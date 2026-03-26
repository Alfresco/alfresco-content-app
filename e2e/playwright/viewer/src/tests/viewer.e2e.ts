/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
} from '@alfresco/aca-playwright-shared';
import { Site } from '@alfresco/js-api';

async function initializeApis(username: string): Promise<{ nodesApi: NodesApi; trashcanApi: TrashcanApi; fileActionsApi: FileActionsApi }> {
  const apiClientFactory = new ApiClientFactory();
  await apiClientFactory.setUpAcaBackend('admin');
  await apiClientFactory.createUser({ username });
  const nodesApi = await NodesApi.initialize(username, username);
  const trashcanApi = await TrashcanApi.initialize(username, username);
  const fileActionsApi = await FileActionsApi.initialize(username, username);
  return { nodesApi, trashcanApi, fileActionsApi };
}

test.describe('viewer file', () => {
  test.describe('Open viewer from Personal Files', () => {
    const username = `user-${Utils.random()}`;
    const randomDocxName = `${TEST_FILES.DOCX.name}-${Utils.random()}`;
    let folderViewerId: string;
    let nodesApiViewer: NodesApi;
    let trashcanApiViewer: TrashcanApi;

    test.beforeAll(async () => {
      try {
        const apis = await initializeApis(username);
        nodesApiViewer = apis.nodesApi;
        trashcanApiViewer = apis.trashcanApi;
        const { fileActionsApi } = apis;
        folderViewerId = (await nodesApiViewer.createFolder(`viewer-${Utils.random()}`)).entry.id;
        await fileActionsApi.uploadFile(TEST_FILES.DOCX.path, randomDocxName, folderViewerId);
        await fileActionsApi.waitForNodes(randomDocxName, { expect: 1 });
      } catch (error) {
        console.error(`beforeAll failed: ${error}`);
      }
    });

    test.beforeEach(async ({ personalFiles, loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${folderViewerId}` });
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApiViewer, trashcanApiViewer, 'afterAll failed');
    });

    test('[XAT-5471] Viewer opens on double clicking on a file from Personal Files', async ({ personalFiles }) => {
      await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
      expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    });

    test('[XAT-5472] Viewer opens when clicking the View action for a file', async ({ personalFiles }) => {
      await personalFiles.dataTable.getRowByName(randomDocxName).click();
      await personalFiles.acaHeader.viewButton.click();
      await personalFiles.dataTable.spinnerWaitForReload();
      expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    });

    test('[XAT-5473] The viewer general elements are displayed correctly', async ({ personalFiles }) => {
      await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
      expect(await personalFiles.viewer.isViewerOpened()).toBe(true);
      await personalFiles.dataTable.spinnerWaitForReload();
      expect(await personalFiles.viewer.isCloseButtonDisplayed(), 'Close button is not displayed').toBe(true);
      expect(await personalFiles.viewer.isFileTitleDisplayed(), 'File title is not displayed').toBe(true);
    });

    test('[XAT-5474] Close the viewer', async ({ personalFiles }) => {
      await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
      expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
      expect(await personalFiles.viewer.getCloseButtonTooltip()).toEqual('Close');
      await personalFiles.viewer.closeButtonLocator.click();
      await expect(personalFiles.dataTable.getCellLinkByName(randomDocxName), 'Viewer did not close').toBeVisible();
    });
  });

  test.describe('Navigate between files', () => {
    const username = `user-${Utils.random()}`;
    const file1 = `file-${Utils.random()}.txt`;
    const file2 = `file2-${Utils.random()}.txt`;
    const file3 = `file3-${Utils.random()}.txt`;
    let folder2Id: string;
    let folder3Id: string;
    let nodesApi: NodesApi;
    let trashcanApi: TrashcanApi;

    test.beforeAll(async () => {
      try {
        const apis = await initializeApis(username);
        nodesApi = apis.nodesApi;
        trashcanApi = apis.trashcanApi;
        folder2Id = (await nodesApi.createFolder(`viewer2-${Utils.random()}`)).entry.id;
        folder3Id = (await nodesApi.createFolder(`viewer3-${Utils.random()}`)).entry.id;
        await nodesApi.createFile(file1, folder2Id);
        await nodesApi.createFile(file2, folder2Id);
        await nodesApi.createFile(file3, folder3Id);
      } catch (error) {
        console.error(`beforeAll failed: ${error}`);
      }
    });

    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    });

    test('[XAT-5408] Next / Previous File buttons are displayed and work when viewer is opened for a file from a list of files', async ({
      personalFiles
    }) => {
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${folder2Id}` });
      await personalFiles.dataTable.performClickFolderOrFileToOpen(file1);
      expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
      expect(await personalFiles.viewer.fileTitleButtonLocator.textContent()).toContain(file1);
      await personalFiles.viewer.nextFileButton.click();
      await personalFiles.viewer.waitForViewerLoaderToFinish();
      expect(await personalFiles.viewer.fileTitleButtonLocator.textContent()).not.toContain(file1);
      await personalFiles.viewer.previousFileButton.click();
      await personalFiles.viewer.waitForViewerLoaderToFinish();
      expect(await personalFiles.viewer.fileTitleButtonLocator.textContent()).toContain(file1);
    });

    test('[XAT-5409] Previous File button is not displayed when file is first in the list', async ({ personalFiles }) => {
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${folder2Id}` });
      await personalFiles.dataTable.performClickFolderOrFileToOpen(file1);
      expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
      if (await personalFiles.viewer.previousFileButton.isVisible()) {
        await personalFiles.viewer.previousFileButton.click();
        await personalFiles.viewer.waitForViewerLoaderToFinish();
      }
      await expect(personalFiles.viewer.nextFileButton).toBeVisible();
      await expect(personalFiles.viewer.previousFileButton).toBeHidden();
    });

    test('[XAT-5410] Next File button is not displayed when file is last in the list view', async ({ personalFiles }) => {
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${folder2Id}` });
      await personalFiles.dataTable.performClickFolderOrFileToOpen(file1);
      expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
      if (await personalFiles.viewer.nextFileButton.isVisible()) {
        await personalFiles.viewer.nextFileButton.click();
        await personalFiles.viewer.waitForViewerLoaderToFinish();
      }
      await expect(personalFiles.viewer.previousFileButton).toBeVisible();
      await expect(personalFiles.viewer.nextFileButton).toBeHidden();
    });

    test('[XAT-5411] Next / Previous File buttons are not displayed when no other files', async ({ personalFiles }) => {
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${folder3Id}` });
      await personalFiles.dataTable.performClickFolderOrFileToOpen(file3);
      expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
      await expect(personalFiles.viewer.fileTitleButtonLocator).toBeVisible();
      await expect(personalFiles.viewer.previousFileButton).toBeHidden();
      await expect(personalFiles.viewer.nextFileButton).toBeHidden();
    });
  });

  test.describe('Navigate between files - permissions', () => {
    const username1 = `user1-${Utils.random()}`;
    const username2 = `user2-${Utils.random()}`;
    const file1 = `file-${Utils.random()}.txt`;
    const file2 = `file2-${Utils.random()}.txt`;
    const file3 = `file3-${Utils.random()}.txt`;
    let folderId: string;
    let nodesApi1: NodesApi;
    let trashcanApi1: TrashcanApi;
    let sitesApi1: SitesApi;
    let site1Id: string;
    let user2Id: string;

    test.beforeAll(async () => {
      try {
        const apiClientFactory = new ApiClientFactory();
        await apiClientFactory.setUpAcaBackend('admin');
        await apiClientFactory.createUser({ username: username1 });
        user2Id = (await apiClientFactory.createUser({ username: username2 })).entry.id;
        nodesApi1 = await NodesApi.initialize(username1, username1);
        trashcanApi1 = await TrashcanApi.initialize(username1, username1);
        sitesApi1 = await SitesApi.initialize(username1, username1);
        site1Id = (await sitesApi1.createSite(`viewer-site-${Utils.random()}`, 'PRIVATE')).entry.id;
        const site1DocLibId = await sitesApi1.getDocLibId(site1Id);
        await sitesApi1.addSiteMember(site1Id, user2Id, 'SiteConsumer');
        folderId = (await nodesApi1.createFolder(`viewer-permissions-${Utils.random()}`, site1DocLibId)).entry.id;
        await nodesApi1.createFile(file1, folderId);
        await nodesApi1.createFile(file2, folderId);
        await nodesApi1.createFile(file3, folderId);
      } catch (error) {
        console.error(`beforeAll failed: ${error}`);
      }
    });

    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, username2, username2, 'beforeEach failed');
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi1, trashcanApi1, 'afterAll failed');
      await sitesApi1.deleteSites([site1Id]);
    });

    test('[XAT-5412] Next/Previous File buttons when user has insufficient permissions', async ({ personalFiles }) => {
      await personalFiles.navigate({ remoteUrl: `#/libraries/${folderId}` });
      await personalFiles.dataTable.performClickFolderOrFileToOpen(file2);
      expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
      await expect(personalFiles.viewer.fileTitleButtonLocator).toBeVisible();
      await expect(personalFiles.viewer.previousFileButton.or(personalFiles.viewer.nextFileButton).first()).toBeVisible();
      await sitesApi1.deleteSiteMember(site1Id, user2Id);
      await personalFiles.viewer.previousFileButton.or(personalFiles.viewer.nextFileButton).first().click();
      await expect(personalFiles.viewer.noPermissionsView.or(personalFiles.dataTable.noPermissionsView)).toBeVisible();
    });
  });

  test.describe('Open viewer via preview URL', () => {
    const username = `user-${Utils.random()}`;
    const randomJpgName = `${TEST_FILES.JPG_FILE.name}-${Utils.random()}`;
    let folderId: string;
    let fileJpgId: string;
    let nodesApi: NodesApi;
    let trashcanApi: TrashcanApi;

    test.beforeAll(async () => {
      try {
        const apis = await initializeApis(username);
        nodesApi = apis.nodesApi;
        trashcanApi = apis.trashcanApi;
        const { fileActionsApi } = apis;
        folderId = (await nodesApi.createFolder(`viewer-${Utils.random()}`)).entry.id;
        fileJpgId = (await fileActionsApi.uploadFile(TEST_FILES.JPG_FILE.path, randomJpgName, folderId)).entry.id;
      } catch (error) {
        console.error(`beforeAll failed: ${error}`);
      }
    });

    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    });

    test('[XAT-5476] Viewer opens when accessing the preview URL for a file', async ({ personalFiles }) => {
      const previewURL = `#/personal-files/${folderId}/(viewer:view/${fileJpgId})`;
      await personalFiles.navigate({ remoteUrl: previewURL });
      await personalFiles.viewer.waitForViewerLoaderToFinish(timeouts.fortySeconds);
      await expect(personalFiles.viewer.fileTitleButtonLocator).toContainText(randomJpgName);
    });
  });

  test.describe('Open viewer from Recent Files', () => {
    const username = `user-${Utils.random()}`;
    const randomDocxName = `${TEST_FILES.DOCX.name}-${Utils.random()}`;
    let folderRecentId: string;
    let nodesApiRecent: NodesApi;
    let trashcanApiRecent: TrashcanApi;

    test.beforeAll(async () => {
      try {
        const apis = await initializeApis(username);
        nodesApiRecent = apis.nodesApi;
        trashcanApiRecent = apis.trashcanApi;
        const { fileActionsApi } = apis;
        folderRecentId = (await nodesApiRecent.createFolder(`viewer-${Utils.random()}`)).entry.id;
        await fileActionsApi.uploadFile(TEST_FILES.DOCX.path, randomDocxName, folderRecentId);
        await fileActionsApi.waitForNodes(randomDocxName, { expect: 1 });
      } catch (error) {
        console.error(`beforeAll failed: ${error}`);
      }
    });

    test.beforeEach(async ({ personalFiles, loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${folderRecentId}` });
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApiRecent, trashcanApiRecent, 'afterAll failed');
    });

    test('[XAT-5479] Viewer opens for a file from Recent Files', async ({ personalFiles, recentFilesPage }) => {
      await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
      expect(await personalFiles.viewer.getCloseButtonTooltip()).toEqual('Close');
      await recentFilesPage.navigate();
      await recentFilesPage.reload();
      await recentFilesPage.dataTable.performClickFolderOrFileToOpen(randomDocxName);
      expect(await recentFilesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
      expect(await recentFilesPage.viewer.isCloseButtonDisplayed(), 'Close button is not displayed').toBe(true);
      expect(await recentFilesPage.viewer.isFileTitleDisplayed(), 'File title is not displayed').toBe(true);
    });
  });

  test.describe('Open viewer from Search Results', () => {
    const username = `user-${Utils.random()}`;
    const randomDocxName = `${TEST_FILES.DOCX.name}-${Utils.random()}`;
    let nodesApi: NodesApi;
    let trashcanApi: TrashcanApi;

    test.beforeAll(async () => {
      try {
        const apis = await initializeApis(username);
        nodesApi = apis.nodesApi;
        trashcanApi = apis.trashcanApi;
        const { fileActionsApi } = apis;
        const folderId = (await nodesApi.createFolder(`viewer-${Utils.random()}`)).entry.id;
        await fileActionsApi.uploadFile(TEST_FILES.DOCX.path, randomDocxName, folderId);
        await fileActionsApi.waitForNodes(randomDocxName, { expect: 1 });
      } catch (error) {
        console.error(`beforeAll failed: ${error}`);
      }
    });

    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    });

    test('[XAT-5482] Viewer opens for a file from Search Results', async ({ searchPage }) => {
      await searchPage.searchWithin(randomDocxName, 'filesAndFolders');
      await searchPage.dataTable.goThroughPagesLookingForRowWithName(randomDocxName);
      await searchPage.dataTable.performClickFolderOrFileToOpen(randomDocxName);
      expect(await searchPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
      expect(await searchPage.viewer.isCloseButtonDisplayed(), 'Close button is not displayed').toBe(true);
      expect(await searchPage.viewer.isFileTitleDisplayed(), 'File title is not displayed').toBe(true);
    });
  });

  test.describe('Open viewer from Shared Files', () => {
    const username = `user-${Utils.random()}`;
    const randomDocxName = `${TEST_FILES.DOCX.name}-${Utils.random()}`;
    let nodesApi: NodesApi;
    let trashcanApi: TrashcanApi;

    test.beforeAll(async () => {
      try {
        const apis = await initializeApis(username);
        nodesApi = apis.nodesApi;
        trashcanApi = apis.trashcanApi;
        const { fileActionsApi } = apis;
        const shareActions = await SharedLinksApi.initialize(username, username);
        const folderId = (await nodesApi.createFolder(`viewer-${Utils.random()}`)).entry.id;
        const fileDocxId = (await fileActionsApi.uploadFile(TEST_FILES.DOCX.path, randomDocxName, folderId)).entry.id;
        await shareActions.shareFileById(fileDocxId);
        await shareActions.waitForFilesToBeShared([fileDocxId]);
      } catch (error) {
        console.error(`beforeAll failed: ${error}`);
      }
    });

    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    });

    test('[XAT-5480] Viewer opens for a file from Shared Files', async ({ sharedPage }) => {
      await sharedPage.navigate();
      await sharedPage.reload({ waitUntil: 'domcontentloaded' });
      await sharedPage.dataTable.goThroughPagesLookingForRowWithName(randomDocxName);
      await sharedPage.dataTable.performClickFolderOrFileToOpen(randomDocxName);
      expect(await sharedPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
      expect(await sharedPage.viewer.isCloseButtonDisplayed(), 'Close button is not displayed').toBe(true);
      expect(await sharedPage.viewer.isFileTitleDisplayed(), 'File title is not displayed').toBe(true);
    });
  });

  test.describe('Open viewer from Favorites', () => {
    const username = `user-${Utils.random()}`;
    const randomDocxName = `${TEST_FILES.DOCX.name}-${Utils.random()}`;
    let nodesApi: NodesApi;
    let trashcanApi: TrashcanApi;

    test.beforeAll(async () => {
      try {
        const apis = await initializeApis(username);
        nodesApi = apis.nodesApi;
        trashcanApi = apis.trashcanApi;
        const { fileActionsApi } = apis;
        const favoritesActions = await FavoritesPageApi.initialize(username, username);
        const folderId = (await nodesApi.createFolder(`viewer-${Utils.random()}`)).entry.id;
        const fileDocxId = (await fileActionsApi.uploadFile(TEST_FILES.DOCX.path, randomDocxName, folderId)).entry.id;
        const consumerFavoritesTotalItems = await favoritesActions.getFavoritesTotalItems(username);
        await favoritesActions.addFavoriteById('file', fileDocxId);
        await Promise.all([
          favoritesActions.isFavoriteWithRetry(username, fileDocxId, { expect: true }),
          favoritesActions.waitForApi(username, { expect: consumerFavoritesTotalItems + 1 })
        ]);
      } catch (error) {
        console.error(`beforeAll failed: ${error}`);
      }
    });

    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    });

    test('[XAT-5481] Viewer opens for a file from Favorites', async ({ favoritePage }) => {
      await favoritePage.navigate({ waitUntil: 'domcontentloaded' });
      await favoritePage.dataTable.goThroughPagesLookingForRowWithName(randomDocxName);
      await favoritePage.dataTable.performClickFolderOrFileToOpen(randomDocxName);
      expect(await favoritePage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
      expect(await favoritePage.viewer.isCloseButtonDisplayed(), 'Close button is not displayed').toBe(true);
      expect(await favoritePage.viewer.isFileTitleDisplayed(), 'File title is not displayed').toBe(true);
    });
  });

  test.describe('Viewer does not open without permissions', () => {
    const username = `user-${Utils.random()}`;
    const siteAdmin = `siteAdmin-${Utils.random()}`;
    const fileAdmin = TEST_FILES.XLSX.name;
    let docLibId: string;
    let fileAdminId: string;
    let nodesApi: NodesApi;
    let trashcanApi: TrashcanApi;
    let siteActionsAdmin: SitesApi;

    test.beforeAll(async () => {
      try {
        const apis = await initializeApis(username);
        nodesApi = apis.nodesApi;
        trashcanApi = apis.trashcanApi;
        siteActionsAdmin = await SitesApi.initialize('admin');
        const fileActionsApiAdmin = await FileActionsApi.initialize('admin');
        await siteActionsAdmin.createSite(siteAdmin, Site.VisibilityEnum.PRIVATE);
        docLibId = await siteActionsAdmin.getDocLibId(siteAdmin);
        fileAdminId = (await fileActionsApiAdmin.uploadFile(TEST_FILES.DOCX.path, fileAdmin, docLibId)).entry.id;
      } catch (error) {
        console.error(`beforeAll failed: ${error}`);
      }
    });

    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed', siteActionsAdmin, [docLibId]);
    });

    test('[XAT-5477] Viewer does not open when accessing the preview URL for a file without permissions', async ({ personalFiles }) => {
      const previewURL = `#/libraries/${docLibId}/(viewer:view/${fileAdminId})`;
      await personalFiles.navigate({ remoteUrl: `${previewURL}` });
      await expect(personalFiles.viewer.viewerLocator, 'Viewer should not be opened!').toBeHidden();
    });
  });

  test.describe('Open viewer from File Libraries', () => {
    const username = `user-${Utils.random()}`;
    const siteUser = `siteUser-${Utils.random()}`;
    const fileInSite = TEST_FILES.DOCX.name;
    let docLibSiteUserId: string;
    let nodesApi: NodesApi;
    let trashcanApi: TrashcanApi;
    let siteActionsUser: SitesApi;

    test.beforeAll(async () => {
      try {
        const apis = await initializeApis(username);
        nodesApi = apis.nodesApi;
        trashcanApi = apis.trashcanApi;
        const { fileActionsApi } = apis;
        siteActionsUser = await SitesApi.initialize(username, username);
        await siteActionsUser.createSite(siteUser, Site.VisibilityEnum.PUBLIC);
        docLibSiteUserId = await siteActionsUser.getDocLibId(siteUser);
        await fileActionsApi.uploadFile(TEST_FILES.DOCX.path, fileInSite, docLibSiteUserId);
      } catch (error) {
        console.error(`beforeAll failed: ${error}`);
      }
    });

    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed', siteActionsUser, [docLibSiteUserId]);
    });

    test('[XAT-5478] Viewer opens for a file from File Libraries', async ({ myLibrariesPage }) => {
      await myLibrariesPage.navigate();
      await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteUser);
      await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(fileInSite);
      expect(await myLibrariesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
      expect(await myLibrariesPage.viewer.isCloseButtonDisplayed(), 'Close button is not displayed').toBe(true);
      expect(await myLibrariesPage.viewer.isFileTitleDisplayed(), 'File title is not displayed').toBe(true);
    });
  });
});
