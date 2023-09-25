/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ApiClientFactory, getUserState, test, TEST_FILES, Utils } from '@alfresco/playwright-shared';

test.use({ storageState: getUserState('hruser') });
test.describe('viewer file', () => {
  const apiClientFactory = new ApiClientFactory();
  const randomFolderName = `playwright-folder-${Utils.random()}`;
  const randomDocxName = `${TEST_FILES.DOCX.name}-${Utils.random()}`;
  let folderId: string;
  let fileDocxId: string;

  test.beforeAll(async ({ fileAction, shareAction, favoritesPageAction }) => {
    await apiClientFactory.setUpAcaBackend('hruser');
    const node = await apiClientFactory.nodes.createNode('-my-', { name: randomFolderName, nodeType: 'cm:folder', relativePath: '/' });
    folderId = node.entry.id;
    const fileDoc = await fileAction.uploadFile(TEST_FILES.DOCX.path, randomDocxName, folderId);
    fileDocxId = fileDoc.entry.id;
    await shareAction.shareFileById(fileDocxId);
    await favoritesPageAction.addFavoriteById('file', fileDocxId);
    await favoritesPageAction.isFavoriteWithRetry('hruser', fileDocxId, { expect: true });
    await fileAction.waitForNodes(randomDocxName, { expect: 1 });
  });

  test.beforeEach(async ({ personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/personal-files/${folderId}` });
  });

  test.afterAll(async () => {
    await apiClientFactory.nodes.deleteNode(folderId, { permanent: true });
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
    expect(await personalFiles.dataTable.getCellLinkByName(randomDocxName).isVisible(), 'Viewer did not close').toBe(true);
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
    await searchPage.searchInput.searchButton.click();
    await searchPage.searchOverlay.checkFilesAndFolders();
    await searchPage.searchOverlay.searchFor(randomDocxName);
    await searchPage.reload({ waitUntil: 'domcontentloaded' });
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
    expect(await personalFiles.viewer.fileTitleButtonLocator.innerText()).toEqual(randomDocxName);
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
});
