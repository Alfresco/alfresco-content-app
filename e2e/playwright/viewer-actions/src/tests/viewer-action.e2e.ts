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
  PersonalFilesPage,
  SharedLinksApi,
  TrashcanApi,
  test,
  TEST_FILES,
  timeouts,
  Utils
} from '@alfresco/aca-playwright-shared';

async function initializeApis(username: string): Promise<{ nodesApi: NodesApi; trashcanApi: TrashcanApi; fileActionsApi: FileActionsApi }> {
  const apiClientFactory = new ApiClientFactory();
  await apiClientFactory.setUpAcaBackend('admin');
  await apiClientFactory.createUser({ username });
  const nodesApi = await NodesApi.initialize(username, username);
  const trashcanApi = await TrashcanApi.initialize(username, username);
  const fileActionsApi = await FileActionsApi.initialize(username, username);
  return { nodesApi, trashcanApi, fileActionsApi };
}

async function openFileInViewer(page: PersonalFilesPage, fileName: string): Promise<void> {
  await page.dataTable.performClickFolderOrFileToOpen(fileName);
  await page.viewer.waitForViewerToOpen();
}

async function uploadMajorVersionAndVerify(page: PersonalFilesPage, newVersionName: string, description?: string): Promise<void> {
  await Utils.uploadFileNewVersion(page, newVersionName, 'jpg');
  await page.uploadNewVersionDialog.majorOption.click();
  if (description) {
    await page.uploadNewVersionDialog.description.fill(description);
  }
  await page.uploadNewVersionDialog.uploadButton.click();
  await page.uploadNewVersionDialog.uploadButton.waitFor({ state: 'detached' });
  await expect(page.uploadNewVersionDialog.cancelButton).toHaveCount(0);
  await Utils.waitForApiResponse(page, 'content', 200);
  expect(await page.viewer.isViewerOpened(), 'Viewer is not open').toBe(true);
  expect(await page.viewer.getFileTitle()).toContain(newVersionName);
}

async function navigateAndOpenFile(page: PersonalFilesPage, folderId: string, fileName: string): Promise<void> {
  await page.navigate({ remoteUrl: `#/personal-files/${folderId}` });
  await openFileInViewer(page, fileName);
}

async function uploadVersionAndOpenHistory(page: PersonalFilesPage, newVersionName: string, description?: string): Promise<void> {
  await uploadMajorVersionAndVerify(page, newVersionName, description);
  await page.acaHeader.clickViewerMoreActions();
  await page.matMenu.clickMenuItem('Manage Versions');
  await page.manageVersionsDialog.viewFileVersion('1.0');
}

test.describe('viewer action file', () => {
  test.describe('Personal Files - general viewer actions', () => {
    const username = `user-${Utils.random()}`;
    const randomDocxName = `${TEST_FILES.DOCX.name}-${Utils.random()}`;
    let folderIdActions: string;
    let nodesApi: NodesApi;
    let trashcanApi: TrashcanApi;

    test.beforeAll(async () => {
      try {
        const apis = await initializeApis(username);
        nodesApi = apis.nodesApi;
        const { fileActionsApi } = apis;
        trashcanApi = apis.trashcanApi;
        folderIdActions = (await nodesApi.createFolder(`viewer-action-5415-5416-5417-${Utils.random()}`)).entry.id;
        await fileActionsApi.uploadFile(TEST_FILES.DOCX.path, randomDocxName, folderIdActions);
      } catch (error) {
        console.error(`beforeAll failed: ${error}`);
        throw error;
      }
    });

    test.beforeEach(async ({ personalFiles, loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${folderIdActions}` });
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    });

    test('[XAT-5417] Viewer - Download action - Personal Files', async ({ personalFiles }) => {
      await openFileInViewer(personalFiles, randomDocxName);
      const downloadPromise = personalFiles.page.waitForEvent('download');
      await personalFiles.acaHeader.downloadButtonViewer.click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe(randomDocxName);
    });

    test('[XAT-5415] Full screen action', async ({ personalFiles }) => {
      await openFileInViewer(personalFiles, randomDocxName);
      await personalFiles.acaHeader.fullScreenButton.click();
      expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is closed after pressing Full screen').toBe(true);
    });

    test('[XAT-5416] Pressing ESC in the viewer closes only the action dialog', async ({ personalFiles }) => {
      await openFileInViewer(personalFiles, randomDocxName);
      await personalFiles.acaHeader.clickViewerMoreActions();
      await personalFiles.viewerDialog.clickActionsCopy();
      expect(await personalFiles.viewerDialog.isCopyDialogOpen(), 'Dialog is not open').toBe(true);
      await personalFiles.page.keyboard.press('Escape');
      expect(await personalFiles.viewerDialog.isCopyDialogClose(), 'Dialog is not open').toBe(false);
      expect(await personalFiles.viewer.isViewerOpened(), 'Viewer should be opened').toBe(true);
    });
  });

  test.describe('Personal Files - Delete action', () => {
    const username = `user-${Utils.random()}`;
    const randomDocxDelete = `${TEST_FILES.DOCX.name}-${Utils.random()}`;
    const randomDocxName = `${TEST_FILES.DOCX.name}-${Utils.random()}`;
    let folderId: string;
    let nodesApi: NodesApi;
    let trashcanApi: TrashcanApi;

    test.beforeAll(async () => {
      try {
        const apis = await initializeApis(username);
        trashcanApi = apis.trashcanApi;
        const { fileActionsApi } = apis;
        nodesApi = apis.nodesApi;
        folderId = (await nodesApi.createFolder(`viewer-action-5421-${Utils.random()}`)).entry.id;
        await fileActionsApi.uploadFile(TEST_FILES.DOCX.path, randomDocxName, folderId);
        await fileActionsApi.uploadFile(TEST_FILES.DOCX.path, randomDocxDelete, folderId);
      } catch (error) {
        console.error(`beforeAll failed: ${error}`);
        throw error;
      }
    });

    test.beforeEach(async ({ personalFiles, loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${folderId}` });
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    });

    test('[XAT-5421] Viewer - Delete action - Personal Files', async ({ personalFiles, trashPage }) => {
      await openFileInViewer(personalFiles, randomDocxDelete);
      await personalFiles.acaHeader.clickViewerMoreActions();
      await personalFiles.viewerDialog.deleteMenuButton.click();
      await personalFiles.snackBar.getByMessageLocator(randomDocxDelete).waitFor({ state: 'attached' });
      const deleteName = await personalFiles.snackBar.getByMessageLocator(randomDocxDelete).innerText();
      expect(deleteName).toContain(`${randomDocxDelete} deleted`);
      await personalFiles.dataTable.getCellLinkByName(randomDocxName).waitFor({ state: 'attached' });
      await expect(personalFiles.dataTable.getCellLinkByName(randomDocxDelete), 'file should not visible').toBeHidden();
      await trashPage.navigate({ waitUntil: 'domcontentloaded' });
      expect(await trashPage.dataTable.isItemPresent(randomDocxDelete), 'Item should be present in Trash').toBe(true);
    });
  });

  test.describe('Personal Files - Edit Offline action', () => {
    const username = `user-${Utils.random()}`;
    const fileForEditOffline = `playwright-file1-${Utils.random()}.docx`;
    let folderIdOffline: string;
    let nodesApi: NodesApi;
    let trashcanApi: TrashcanApi;

    test.beforeAll(async () => {
      try {
        const apis = await initializeApis(username);
        const { fileActionsApi } = apis;

        nodesApi = apis.nodesApi;
        trashcanApi = apis.trashcanApi;
        folderIdOffline = (await nodesApi.createFolder(`viewer-action-5423-${Utils.random()}`)).entry.id;
        await fileActionsApi.uploadFile(TEST_FILES.DOCX.path, fileForEditOffline, folderIdOffline);
      } catch (error) {
        console.error(`beforeAll failed: ${error}`);
        throw error;
      }
    });

    test.beforeEach(async ({ personalFiles, loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${folderIdOffline}` });
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    });

    test('[XAT-5423] Viewer - Edit Offline action - Personal Files', async ({ personalFiles }) => {
      await openFileInViewer(personalFiles, fileForEditOffline);
      await personalFiles.acaHeader.clickViewerMoreActions();
      await personalFiles.matMenu.clickMenuItem('Edit Offline');
      const downloadPromise = personalFiles.page.waitForEvent('download');
      await personalFiles.acaHeader.downloadButtonViewer.click();
      const download = await downloadPromise;
      expect(download.suggestedFilename(), 'File should found in download location').toBe(fileForEditOffline);
      expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is closed after pressing Full screen').toBe(true);
      await personalFiles.acaHeader.clickViewerMoreActions();
      expect(await personalFiles.matMenu.isMenuItemVisible('Cancel Editing'), 'Cancel Editing menu should be visible').toBe(true);
    });
  });

  test.describe('Personal Files - Cancel Editing action', () => {
    const username = `user-${Utils.random()}`;
    const fileForCancelEditing = `playwright-file2-${Utils.random()}.docx`;
    let folderIdCancelEdit: string;
    let nodesApi: NodesApi;
    let trashcanApi: TrashcanApi;

    test.beforeAll(async () => {
      try {
        const apis = await initializeApis(username);
        nodesApi = apis.nodesApi;
        trashcanApi = apis.trashcanApi;

        const { fileActionsApi } = apis;
        folderIdCancelEdit = (await nodesApi.createFolder(`viewer-action-5424-${Utils.random()}`)).entry.id;
        const fileForCancelEditingId = (await fileActionsApi.uploadFile(TEST_FILES.DOCX.path, fileForCancelEditing, folderIdCancelEdit)).entry.id;
        await fileActionsApi.lockNodes([fileForCancelEditingId]);
        await fileActionsApi.isFileLockedWriteWithRetry(fileForCancelEditingId, true);
      } catch (error) {
        console.error(`beforeAll failed: ${error}`);
        throw error;
      }
    });

    test.beforeEach(async ({ personalFiles, loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${folderIdCancelEdit}` });
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    });

    test('[XAT-5424] Viewer - Cancel Editing action - Personal Files', async ({ personalFiles }) => {
      await openFileInViewer(personalFiles, fileForCancelEditing);
      await personalFiles.acaHeader.clickViewerMoreActions();
      await personalFiles.matMenu.clickMenuItem('Cancel Editing');
      await personalFiles.acaHeader.clickViewerMoreActions();
      expect(await personalFiles.matMenu.isMenuItemVisible('Edit Offline'), 'Edit offline menu should be visible').toBe(true);
    });
  });

  test.describe('Personal Files - Upload new version', () => {
    const username = `user-${Utils.random()}`;
    const file5465 = `file-5465-${Utils.random()}.jpg`;
    const file5465NewVersion = TEST_FILES.JPG_FILE.name;
    const file5713 = `file-5713-${Utils.random()}.jpg`;
    const file5713NewVersion = TEST_FILES.JPG_FILE.name;
    const file5714 = `file-5714-${Utils.random()}.jpg`;
    const file5714NewVersion = TEST_FILES.JPG_FILE.name;
    const file17781 = `file-17781-${Utils.random()}.jpg`;
    const file17781NewVersion = TEST_FILES.JPG_FILE.name;
    const file5717 = `file-5717-${Utils.random()}.jpg`;
    const file5717NewVersion = TEST_FILES.JPG_FILE.name;
    const file5720 = `file-5720-${Utils.random()}.jpg`;
    const file5720NewVersion = TEST_FILES.JPG_FILE.name;
    let file5465Id: string;
    let file17781Id: string;
    let folder5465Id: string;
    let folder5713Id: string;
    let folder5714Id: string;
    let folder5717Id: string;
    let folder17781Id: string;
    let folder5720Id: string;
    let nodesApi: NodesApi;
    let trashcanApi: TrashcanApi;

    test.beforeAll(async () => {
      try {
        const apis = await initializeApis(username);
        nodesApi = apis.nodesApi;
        trashcanApi = apis.trashcanApi;
        const { fileActionsApi } = apis;
        folder5465Id = (await nodesApi.createFolder(`viewer-action-5465-${Utils.random()}`)).entry.id;
        folder17781Id = (await nodesApi.createFolder(`viewer-action-17781-${Utils.random()}`)).entry.id;
        folder5713Id = (await nodesApi.createFolder(`viewer-action-5713-${Utils.random()}`)).entry.id;
        folder5714Id = (await nodesApi.createFolder(`viewer-action-5714-${Utils.random()}`)).entry.id;
        folder5717Id = (await nodesApi.createFolder(`viewer-action-5717-${Utils.random()}`)).entry.id;
        folder5720Id = (await nodesApi.createFolder(`viewer-action-5720-${Utils.random()}`)).entry.id;
        file5465Id = (await fileActionsApi.uploadFile(TEST_FILES.JPG_FILE.path, file5465, folder5465Id)).entry.id;
        file17781Id = (await fileActionsApi.uploadFileWithRename(TEST_FILES.JPG_FILE.path, file17781, folder17781Id)).entry.id;
        await fileActionsApi.uploadFileWithRename(TEST_FILES.JPG_FILE.path, file5713, folder5713Id);
        await fileActionsApi.uploadFileWithRename(TEST_FILES.JPG_FILE.path, file5714, folder5714Id);
        await fileActionsApi.uploadFileWithRename(TEST_FILES.JPG_FILE.path, file5717, folder5717Id);
        await fileActionsApi.uploadFileWithRename(TEST_FILES.JPG_FILE.path, file5720, folder5720Id);
        await fileActionsApi.lockNodes([file17781Id]);
      } catch (error) {
        console.error(`beforeAll failed: ${error}`);
        throw error;
      }
    });

    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    });

    test('[XAT-5465] Upload new version action - major', async ({ personalFiles, nodesApiAction }) => {
      await navigateAndOpenFile(personalFiles, folder5465Id, file5465);
      await uploadMajorVersionAndVerify(personalFiles, file5465NewVersion, 'new major version description');
      expect(await nodesApiAction.getNodeProperty(file5465Id, 'cm:versionType'), 'File has incorrect version type').toEqual('MAJOR');
      expect(await nodesApiAction.getNodeProperty(file5465Id, 'cm:versionLabel'), 'File has incorrect version label').toEqual('2.0');
    });

    test('[XAT-17781] Upload new version action when node is locked', async ({ personalFiles }) => {
      await navigateAndOpenFile(personalFiles, folder17781Id, file17781);
      await Utils.uploadFileNewVersion(personalFiles, file17781NewVersion, 'jpg');
      await personalFiles.uploadNewVersionDialog.uploadButton.click();
      await personalFiles.uploadNewVersionDialog.uploadButton.waitFor({ state: 'detached' });
      await expect(personalFiles.uploadNewVersionDialog.cancelButton).toHaveCount(0);
      await Utils.waitForApiResponse(personalFiles, 'content', 200);
      expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not open').toBe(true);
      expect(await personalFiles.viewer.getFileTitle()).toContain(file17781NewVersion);
      await personalFiles.acaHeader.clickViewerMoreActions();
      await expect(personalFiles.matMenu.getMenuItemFromHeaderMenu('Cancel Editing'), `'Cancel Editing' button shouldn't be shown`).toBeHidden();
      await expect(personalFiles.matMenu.getMenuItemFromHeaderMenu('Edit Offline'), `'Edit Offline' should be shown`).toBeVisible();
    });

    test('[XAT-5713] Viewer: User can download a previous version of a file', async ({ personalFiles }) => {
      await navigateAndOpenFile(personalFiles, folder5713Id, file5713);
      await uploadVersionAndOpenHistory(personalFiles, file5713NewVersion);
      const [download] = await Promise.all([personalFiles.page.waitForEvent('download'), personalFiles.matMenu.clickMenuItem('Download')]);
      expect(download.suggestedFilename()).toBe(file5713);
    });

    test('[XAT-5714] Viewer: User can restore the current version of a file to a previous version  with permissions', async ({ personalFiles }) => {
      await navigateAndOpenFile(personalFiles, folder5714Id, file5714);
      await uploadVersionAndOpenHistory(personalFiles, file5714NewVersion);
      await personalFiles.matMenu.clickMenuItem('Restore');
      await Utils.waitForApiResponse(personalFiles, 'revert', 200);
      await personalFiles.manageVersionsDialog.waitForProgressBarToDisappear();
      expect(await personalFiles.manageVersionsDialog.isVersionPresent('3.0')).toBe(true);
    });

    test('[XAT-5717] Viewer: User can delete a version of a file with permissions', async ({ personalFiles }) => {
      await navigateAndOpenFile(personalFiles, folder5717Id, file5717);
      await uploadVersionAndOpenHistory(personalFiles, file5717NewVersion);
      await personalFiles.matMenu.clickMenuItem('Delete');
      await personalFiles.confirmDialog.okButton.click();
      await Utils.waitForApiResponse(personalFiles, '1.0', 204);
      await personalFiles.manageVersionsDialog.waitForProgressBarToDisappear();
      expect(await personalFiles.manageVersionsDialog.isVersionPresent('2.0')).toBe(true);
      expect(await personalFiles.manageVersionsDialog.isVersionPresent('1.0')).toBe(false);
    });

    test('[XAT-5720] Viewer: User can write comments when user is uploading a new version for a file', async ({ personalFiles }) => {
      await navigateAndOpenFile(personalFiles, folder5720Id, file5720);
      await uploadVersionAndOpenHistory(personalFiles, file5720NewVersion, 'version with comment');
      expect(await personalFiles.manageVersionsDialog.isDescriptionPresent('2.0')).toBe(true);
    });
  });

  test.describe('Shared Files - Favorite action', () => {
    const username = `user-${Utils.random()}`;
    const randomDocxNameShare = `${TEST_FILES.DOCX.name}-${Utils.random()}`;
    let folderId: string;
    let nodesApi: NodesApi;
    let trashcanApi: TrashcanApi;

    test.beforeAll(async () => {
      try {
        const apis = await initializeApis(username);
        nodesApi = apis.nodesApi;
        trashcanApi = apis.trashcanApi;
        const { fileActionsApi } = apis;
        const shareActions = await SharedLinksApi.initialize(username, username);
        folderId = (await nodesApi.createFolder(`viewer-action-5442-${Utils.random()}`)).entry.id;
        const fileDocxShareId = (await fileActionsApi.uploadFile(TEST_FILES.DOCX.path, randomDocxNameShare, folderId)).entry.id;
        await shareActions.shareFileById(fileDocxShareId);
      } catch (error) {
        console.error(`beforeAll failed: ${error}`);
        throw error;
      }
    });

    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    });

    test('[XAT-5442] Favorite action from Shared Files', async ({ sharedPage, favoritePage }) => {
      await sharedPage.navigate({ waitUntil: 'domcontentloaded' });
      await sharedPage.dataTable.performClickFolderOrFileToOpen(randomDocxNameShare);
      expect(await sharedPage.viewer.isViewerOpened(), 'Viewer should be opened').toBe(true);
      await sharedPage.acaHeader.clickViewerMoreActions();
      await favoritePage.viewerDialog.favoriteMenuButton.waitFor({ state: 'attached', timeout: timeouts.normal });
      await sharedPage.viewerDialog.favoriteMenuButton.click();
      await favoritePage.viewerDialog.favoriteMenuButton.waitFor({ state: 'detached', timeout: timeouts.normal });
      await sharedPage.acaHeader.clickViewerMoreActions();
      await favoritePage.viewerDialog.removeFavoriteMenuButton.waitFor({ state: 'attached', timeout: timeouts.normal });
      await expect(sharedPage.viewerDialog.removeFavoriteMenuButton, 'Item should be remove favorite').toBeVisible();
      await sharedPage.page.keyboard.press('Escape');
      await favoritePage.navigate({ waitUntil: 'domcontentloaded' });
      expect(await favoritePage.dataTable.isItemPresent(randomDocxNameShare), 'Item is not present in Favorites list').toBe(true);
    });
  });

  test.describe('Favorites - Share action', () => {
    const username = `user-${Utils.random()}`;
    const randomDocxNameFavorite = `${TEST_FILES.DOCX.name}-${Utils.random()}`;
    let folderId: string;
    let nodesApi: NodesApi;
    let trashcanApi: TrashcanApi;

    test.beforeAll(async () => {
      try {
        const apis = await initializeApis(username);
        nodesApi = apis.nodesApi;
        trashcanApi = apis.trashcanApi;
        const { fileActionsApi } = apis;
        const favoritesActions = await FavoritesPageApi.initialize(username, username);
        folderId = (await nodesApi.createFolder(`viewer-action-5462-${Utils.random()}`)).entry.id;
        const randomDocxNameFavoriteId = (await fileActionsApi.uploadFile(TEST_FILES.DOCX.path, randomDocxNameFavorite, folderId)).entry.id;
        await favoritesActions.addFavoriteById('file', randomDocxNameFavoriteId);
        await favoritesActions.isFavoriteWithRetry(username, randomDocxNameFavoriteId, { expect: true });
      } catch (error) {
        console.error(`beforeAll failed: ${error}`);
        throw error;
      }
    });

    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    });

    test('[XAT-5462] Share action from Favorites', async ({ favoritePage }) => {
      await favoritePage.navigate({ waitUntil: 'domcontentloaded' });
      await favoritePage.dataTable.performClickFolderOrFileToOpen(randomDocxNameFavorite);
      expect(await favoritePage.viewer.isViewerOpened(), 'Viewer should be opened').toBe(true);
      await favoritePage.viewer.shareButton.waitFor({ state: 'attached', timeout: timeouts.normal });
      await favoritePage.viewer.shareButton.click();
      await favoritePage.viewerDialog.shareDialogTitle.waitFor({ state: 'attached', timeout: timeouts.normal });
      await expect(favoritePage.viewerDialog.shareDialogTitle, 'Share dialog should be open').toBeVisible();
      await favoritePage.viewerDialog.shareDialogClose.click();
      await favoritePage.viewerDialog.shareDialogClose.waitFor({ state: 'detached', timeout: timeouts.large });
      await expect(favoritePage.viewerDialog.shareDialogTitle, 'Share dialog should be open').toBeHidden();
    });
  });

  test.describe('Recent Files - Copy action', () => {
    const username = `user-${Utils.random()}`;
    const docxRecentFiles = `docxRF-${Utils.random()}.docx`;
    const destination = `viewer-action-destRF-${Utils.random()}`;
    let folderId: string;
    let destinationId: string;
    let nodesApi: NodesApi;
    let trashcanApi: TrashcanApi;

    test.beforeAll(async () => {
      try {
        const apis = await initializeApis(username);
        nodesApi = apis.nodesApi;
        trashcanApi = apis.trashcanApi;
        const { fileActionsApi } = apis;
        folderId = (await nodesApi.createFolder(`viewer-action-5448-${Utils.random()}`)).entry.id;
        destinationId = (await nodesApi.createFolder(destination)).entry.id;
        await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, docxRecentFiles, folderId);
      } catch (error) {
        console.error(`beforeAll failed: ${error}`);
        throw error;
      }
    });

    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    });

    test('[XAT-5448] Copy action from Recent Files', async ({ recentFilesPage, personalFiles }) => {
      await recentFilesPage.navigate();
      await recentFilesPage.dataTable.performClickFolderOrFileToOpen(docxRecentFiles);
      expect(await recentFilesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
      await recentFilesPage.acaHeader.clickViewerMoreActions();
      await recentFilesPage.matMenu.clickMenuItem('Copy');
      await expect(recentFilesPage.contentNodeSelector.actionButton, 'Dialog is not open').toBeVisible();
      await recentFilesPage.contentNodeSelector.selectLocation('Personal Files');
      await recentFilesPage.contentNodeSelector.selectDestination(destination);
      await recentFilesPage.contentNodeSelector.actionButton.click();
      expect(await recentFilesPage.snackBar.message.innerText()).toContain('Copied 1 item');
      await recentFilesPage.viewer.closeButtonLocator.click();
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${destinationId}` });
      expect(await personalFiles.dataTable.isItemPresent(docxRecentFiles), 'Item is not present in destination').toBe(true);
    });
  });
});
