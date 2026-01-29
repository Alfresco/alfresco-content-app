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
import { ApiClientFactory, getUserState, test, TEST_FILES, timeouts, Utils } from '@alfresco/aca-playwright-shared';

test.use({ storageState: getUserState('hruser') });

test.describe('viewer action file', () => {
  const apiClientFactory = new ApiClientFactory();
  const randomFolderName = `viewer-action-${Utils.random()}`;
  const randomDocxName = `${TEST_FILES.DOCX.name}-${Utils.random()}`;
  const randomDocxNameFavorite = `${TEST_FILES.DOCX.name}-${Utils.random()}`;
  const randomDocxNameShare = `${TEST_FILES.DOCX.name}-${Utils.random()}`;
  const randomDocxDelete = `${TEST_FILES.DOCX.name}-${Utils.random()}`;
  const fileForEditOffline = `playwright-file1-${Utils.random()}.docx`;
  const fileForCancelEditing = `playwright-file2-${Utils.random()}.docx`;
  let folderId: string;
  let fileDocxShareId: string;
  let randomDocxNameFavoriteId: string;
  let fileForCancelEditingId: string;
  const filePersonalFiles = `file3-${Utils.random()}.jpg`;
  let filePersonalFilesId: string;
  const filePersonalFiles2 = TEST_FILES.JPG_FILE.name;
  const fileNewVersionLocked = `file4-${Utils.random()}.jpg`;
  const fileNewVersionLocked2 = TEST_FILES.JPG_FILE.name;
  let fileNewVersionLockedId: string;
  const destination = `viewer-action-destRF-${Utils.random()}`;
  let destinationId: string;
  const docxRecentFiles = `docxRF-${Utils.random()}.docx`;

  test.beforeAll(async ({ fileAction, favoritesPageAction, shareAction }) => {
    await apiClientFactory.setUpAcaBackend('hruser');
    const node = await apiClientFactory.nodes.createNode('-my-', { name: randomFolderName, nodeType: 'cm:folder', relativePath: '/' });
    destinationId = (await apiClientFactory.nodes.createNode('-my-', { name: destination, nodeType: 'cm:folder', relativePath: '/' })).entry.id;
    folderId = node.entry.id;

    fileDocxShareId = (await fileAction.uploadFile(TEST_FILES.DOCX.path, randomDocxNameShare, folderId)).entry.id;
    filePersonalFilesId = (await fileAction.uploadFile(TEST_FILES.JPG_FILE.path, filePersonalFiles, folderId)).entry.id;
    fileNewVersionLockedId = (await fileAction.uploadFileWithRename(TEST_FILES.JPG_FILE.path, fileNewVersionLocked, folderId)).entry.id;
    await fileAction.uploadFileWithRename(TEST_FILES.DOCX.path, docxRecentFiles, folderId);
    await shareAction.shareFileById(fileDocxShareId);
    fileForCancelEditingId = (await fileAction.uploadFile(TEST_FILES.DOCX.path, fileForCancelEditing, folderId)).entry.id;
    await fileAction.lockNodes([fileForCancelEditingId, fileNewVersionLockedId]);
    await fileAction.uploadFile(TEST_FILES.DOCX.path, randomDocxName, folderId);
    await fileAction.uploadFile(TEST_FILES.DOCX.path, randomDocxDelete, folderId);
    const fileFavoritesNode = await fileAction.uploadFile(TEST_FILES.DOCX.path, randomDocxNameFavorite, folderId);
    randomDocxNameFavoriteId = fileFavoritesNode.entry.id;
    await fileAction.uploadFile(TEST_FILES.DOCX.path, fileForEditOffline, folderId);
    await favoritesPageAction.addFavoriteById('file', randomDocxNameFavoriteId);
    await favoritesPageAction.isFavoriteWithRetry('hruser', randomDocxNameFavoriteId, { expect: true });
    await fileAction.isFileLockedWriteWithRetry(fileForCancelEditingId, true);
  });

  test.beforeEach(async ({ personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/personal-files/${folderId}` });
  });

  test.afterAll(async () => {
    await apiClientFactory.nodes.deleteNode(folderId, { permanent: true });
    await apiClientFactory.nodes.deleteNode(destinationId, { permanent: true });
  });

  test('[XAT-5417] Viewer - Download action - Personal Files', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    await personalFiles.viewer.waitForViewerToOpen();
    const downloadPromise = personalFiles.page.waitForEvent('download');
    await personalFiles.acaHeader.downloadButtonViewer.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(randomDocxName);
  });

  test('[XAT-5421] Viewer - Delete action - Personal Files', async ({ personalFiles, trashPage }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxDelete);
    await personalFiles.viewer.waitForViewerToOpen();

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

  test('[XAT-5423] Viewer - Edit Offline action - Personal Files', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(fileForEditOffline);
    await personalFiles.viewer.waitForViewerToOpen();
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

  test('[XAT-5424] Viewer - Cancel Editing action - Personal Files', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(fileForCancelEditing);
    await personalFiles.viewer.waitForViewerToOpen();
    await personalFiles.acaHeader.clickViewerMoreActions();
    await personalFiles.matMenu.clickMenuItem('Cancel Editing');
    await personalFiles.acaHeader.clickViewerMoreActions();
    expect(await personalFiles.matMenu.isMenuItemVisible('Edit Offline'), 'Edit offline menu should be visible').toBe(true);
  });

  test('[XAT-5415] Full screen action', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    await personalFiles.viewer.waitForViewerToOpen();
    await personalFiles.acaHeader.fullScreenButton.click();
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is closed after pressing Full screen').toBe(true);
  });

  test('[XAT-5416] Pressing ESC in the viewer closes only the action dialog', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    await personalFiles.viewer.waitForViewerToOpen();
    await personalFiles.acaHeader.clickViewerMoreActions();
    await personalFiles.viewerDialog.clickActionsCopy();
    expect(await personalFiles.viewerDialog.isCopyDialogOpen(), 'Dialog is not open').toBe(true);
    await personalFiles.page.keyboard.press('Escape');
    expect(await personalFiles.viewerDialog.isCopyDialogClose(), 'Dialog is not open').toBe(false);
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer should be opened').toBe(true);
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

  test('[XAT-5465] Upload new version action - major', async ({ personalFiles, nodesApiAction }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(filePersonalFiles);
    await personalFiles.viewer.waitForViewerToOpen('wait for viewer content');

    await Utils.uploadFileNewVersion(personalFiles, filePersonalFiles2, 'jpg');

    await personalFiles.uploadNewVersionDialog.majorOption.click();
    await personalFiles.uploadNewVersionDialog.description.fill('new major version description');
    await personalFiles.uploadNewVersionDialog.uploadButton.click();
    await personalFiles.uploadNewVersionDialog.uploadButton.waitFor({ state: 'detached' });
    await expect(personalFiles.uploadNewVersionDialog.cancelButton).toHaveCount(0);
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not open').toBe(true);
    await Utils.waitForApiResponse(personalFiles, 'content', 200);

    expect(await personalFiles.viewer.getFileTitle()).toContain(filePersonalFiles2);
    expect(await nodesApiAction.getNodeProperty(filePersonalFilesId, 'cm:versionType'), 'File has incorrect version type').toEqual('MAJOR');
    expect(await nodesApiAction.getNodeProperty(filePersonalFilesId, 'cm:versionLabel'), 'File has incorrect version label').toEqual('2.0');
  });

  test('[XAT-17781] Upload new version action when node is locked', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(fileNewVersionLocked);
    await personalFiles.viewer.waitForViewerToOpen('wait for viewer content');

    await Utils.uploadFileNewVersion(personalFiles, fileNewVersionLocked2, 'jpg');

    await personalFiles.uploadNewVersionDialog.uploadButton.click();
    await personalFiles.uploadNewVersionDialog.uploadButton.waitFor({ state: 'detached' });
    await expect(personalFiles.uploadNewVersionDialog.cancelButton).toHaveCount(0);

    await personalFiles.viewer.waitForViewerToOpen();
    await Utils.waitForApiResponse(personalFiles, 'content', 200);
    expect(await personalFiles.viewer.getFileTitle()).toContain(fileNewVersionLocked2);

    await personalFiles.acaHeader.clickViewerMoreActions();
    await expect(personalFiles.matMenu.getMenuItemFromHeaderMenu('Cancel Editing'), `'Cancel Editing' button shouldn't be shown`).toBeHidden();
    await expect(personalFiles.matMenu.getMenuItemFromHeaderMenu('Edit Offline'), `'Edit Offline' should be shown`).toBeVisible();
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
