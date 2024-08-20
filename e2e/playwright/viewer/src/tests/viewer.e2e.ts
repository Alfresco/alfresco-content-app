/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { expect } from '@playwright/test';
import {
  ApiClientFactory,
  FavoritesPageApi,
  FileActionsApi,
  NodesApi,
  SharedLinksApi,
  SitesApi,
  test,
  TEST_FILES,
  timeouts,
  Utils,
  TrashcanApi
} from '@alfresco/playwright-shared';
import { Site } from '@alfresco/js-api';

test.describe('viewer file', () => {
  const username = `user-${Utils.random()}`;
  const randomDocxName = `${TEST_FILES.DOCX.name}-${Utils.random()}`;
  const siteUser = `siteUser-${Utils.random()}`;
  const fileInSite = TEST_FILES.DOCX.name;
  const siteAdmin = `siteAdmin-${Utils.random()}`;
  const fileAdmin = TEST_FILES.XLSX.name;
  let fileAdminId: string;
  let docLibId: string;
  let docLibSiteUserId: string;
  let folderId: string;
  let fileDocxId: string;
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;

  test.beforeAll(async () => {
    test.setTimeout(timeouts.extendedTest);
    const randomFolderName = `viewer-${Utils.random()}`;
    const apiClientFactory = new ApiClientFactory();
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
    nodesApi = await NodesApi.initialize(username, username);
    const fileActionApi = await FileActionsApi.initialize(username, username);
    trashcanApi = await TrashcanApi.initialize(username, username);
    const shareActions = await SharedLinksApi.initialize(username, username);
    const favoritesActions = await FavoritesPageApi.initialize(username, username);
    const siteActionsUser = await SitesApi.initialize(username, username);
    const siteActionsAdmin = await SitesApi.initialize('admin');
    const fileActionApiAdmin = await FileActionsApi.initialize('admin');
    const node = await nodesApi.createFolder(randomFolderName);
    folderId = node.entry.id;
    const fileDoc = await fileActionApi.uploadFile(TEST_FILES.DOCX.path, randomDocxName, folderId);
    fileDocxId = fileDoc.entry.id;
    const consumerFavoritesTotalItems = await favoritesActions.getFavoritesTotalItems(username);
    await shareActions.shareFileById(fileDocxId);
    await favoritesActions.addFavoriteById('file', fileDocxId);

    await siteActionsAdmin.createSite(siteAdmin, Site.VisibilityEnum.PRIVATE);
    docLibId = await siteActionsAdmin.getDocLibId(siteAdmin);
    fileAdminId = (await fileActionApiAdmin.uploadFile(TEST_FILES.DOCX.path, fileAdmin, docLibId)).entry.id;

    await siteActionsUser.createSite(siteUser, Site.VisibilityEnum.PUBLIC);
    docLibSiteUserId = await siteActionsUser.getDocLibId(siteUser);
    await fileActionApi.uploadFile(TEST_FILES.DOCX.path, fileInSite, docLibSiteUserId);

    await Promise.all([
      favoritesActions.isFavoriteWithRetry(username, fileDocxId, { expect: true }),
      favoritesActions.waitForApi(username, { expect: consumerFavoritesTotalItems + 2 })
    ]);
    await shareActions.waitForFilesToBeShared([fileDocxId]);
    await fileActionApi.waitForNodes(randomDocxName, { expect: 1 });
  });

  test.beforeEach(async ({ personalFiles, loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    await personalFiles.navigate({ remoteUrl: `#/personal-files/${folderId}` });
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[C279269] Viewer opens on double clicking on a file from Personal Files', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
  });

  test('[C279270] Viewer opens when clicking the View action for a file', async ({ personalFiles }) => {
    await personalFiles.dataTable.getRowByName(randomDocxName).click();
    await personalFiles.acaHeader.viewButton.click();
    await personalFiles.dataTable.spinnerWaitForReload();
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
  });

  test('[C279283] The viewer general elements are displayed', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    expect(await personalFiles.viewer.isViewerOpened()).toBe(true);
    await personalFiles.dataTable.spinnerWaitForReload();
    expect(await personalFiles.viewer.isCloseButtonDisplayed(), 'Close button is not displayed').toBe(true);
    expect(await personalFiles.viewer.isFileTitleDisplayed(), 'File title is not displayed').toBe(true);
  });

  test('[C279271] Close the viewer', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    expect(await personalFiles.viewer.getCloseButtonTooltip()).toEqual('Close');
    await personalFiles.viewer.closeButtonLocator.click();
    await expect(personalFiles.dataTable.getCellLinkByName(randomDocxName), 'Viewer did not close').toBeVisible();
  });

  test('[C284636] Viewer opens for a file from Recent Files', async ({ personalFiles, recentFilesPage }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    expect(await personalFiles.viewer.getCloseButtonTooltip()).toEqual('Close');
    await recentFilesPage.navigate();
    await recentFilesPage.reload();
    await recentFilesPage.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    expect(await recentFilesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    expect(await recentFilesPage.viewer.isCloseButtonDisplayed(), 'Close button is not displayed').toBe(true);
    expect(await recentFilesPage.viewer.isFileTitleDisplayed(), 'File title is not displayed').toBe(true);
  });

  test('[C279175] Viewer opens for a file from Search Results', async ({ personalFiles, searchPage }) => {
    await personalFiles.acaHeader.searchButton.click();
    await searchPage.clickSearchButton();
    await searchPage.searchOverlay.checkFilesAndFolders();
    await searchPage.searchOverlay.searchFor(randomDocxName);
    await searchPage.dataTable.goThroughPagesLookingForRowWithName(randomDocxName);
    await searchPage.searchInput.performDoubleClickFolderOrFileToOpen(randomDocxName);
    expect(await searchPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    expect(await searchPage.viewer.isCloseButtonDisplayed(), 'Close button is not displayed').toBe(true);
    expect(await searchPage.viewer.isFileTitleDisplayed(), 'File title is not displayed').toBe(true);
  });

  test('[C279285] Viewer opens when accessing the preview URL for a file', async ({ personalFiles }) => {
    const previewURL = `#/personal-files/${folderId}/(viewer:view/${fileDocxId})`;
    await personalFiles.navigate({ remoteUrl: previewURL });
    await personalFiles.dataTable.spinnerWaitForReload();
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await expect(personalFiles.viewer.fileTitleButtonLocator).toHaveText(randomDocxName);
  });

  test('[C284635] Viewer opens for a file from Shared Files', async ({ sharedPage }) => {
    await sharedPage.navigate();
    await sharedPage.reload({ waitUntil: 'domcontentloaded' });
    await sharedPage.dataTable.goThroughPagesLookingForRowWithName(randomDocxName);
    await sharedPage.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    expect(await sharedPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    expect(await sharedPage.viewer.isCloseButtonDisplayed(), 'Close button is not displayed').toBe(true);
    expect(await sharedPage.viewer.isFileTitleDisplayed(), 'File title is not displayed').toBe(true);
  });

  test('[C284634] Viewer opens for a file from Favorites', async ({ favoritePage }) => {
    await favoritePage.navigate({ waitUntil: 'domcontentloaded' });
    await favoritePage.dataTable.goThroughPagesLookingForRowWithName(randomDocxName);
    await favoritePage.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    expect(await favoritePage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    expect(await favoritePage.viewer.isCloseButtonDisplayed(), 'Close button is not displayed').toBe(true);
    expect(await favoritePage.viewer.isFileTitleDisplayed(), 'File title is not displayed').toBe(true);
  });

  test('[C279287] Viewer does not open when accessing the preview URL for a file without permissions', async ({ personalFiles }) => {
    const previewURL = `#/libraries/${docLibId}/(viewer:view/${fileAdminId})`;
    await personalFiles.navigate({ remoteUrl: `${previewURL}` });
    await expect(personalFiles.viewer.viewerLocator, 'Viewer should not be opened!').toBeHidden();
  });

  test('[C284633] Viewer opens for a file from File Libraries', async ({ myLibrariesPage }) => {
    await myLibrariesPage.navigate();
    await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteUser);
    await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(fileInSite);
    expect(await myLibrariesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    expect(await myLibrariesPage.viewer.isCloseButtonDisplayed(), 'Close button is not displayed').toBe(true);
    expect(await myLibrariesPage.viewer.isFileTitleDisplayed(), 'File title is not displayed').toBe(true);
  });
});
