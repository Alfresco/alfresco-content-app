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
import { ApiClientFactory, getUserState, test, TEST_FILES, timeouts, Utils } from '@alfresco/playwright-shared';

test.use({ storageState: getUserState('hruser') });
test.describe('viewer action file', () => {
  const apiClientFactory = new ApiClientFactory();
  const randomFolderName = `playwright-folder-${Utils.random()}`;
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

  test.beforeAll(async ({ fileAction, favoritesPageAction, shareAction }) => {
    await apiClientFactory.setUpAcaBackend('hruser');
    const node = await apiClientFactory.nodes.createNode('-my-', { name: randomFolderName, nodeType: 'cm:folder', relativePath: '/' });
    folderId = node.entry.id;

    fileDocxShareId = (await fileAction.uploadFile(TEST_FILES.DOCX.path, randomDocxNameShare, folderId)).entry.id;
    await shareAction.shareFileById(fileDocxShareId);
    fileForCancelEditingId = (await fileAction.uploadFile(TEST_FILES.DOCX.path, fileForCancelEditing, folderId)).entry.id;
    await fileAction.lockNodes([fileForCancelEditingId]);
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
  });

  test('[C268129] Download action', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    await personalFiles.viewer.waitForViewerToOpen();
    const downloadPromise = personalFiles.page.waitForEvent('download');
    await personalFiles.acaHeader.downloadButton.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(randomDocxName);
  });

  test('[C268133] Delete action', async ({ personalFiles, trashPage }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxDelete);
    await personalFiles.viewer.waitForViewerToOpen();

    await personalFiles.acaHeader.clickViewerMoreActions();
    await personalFiles.viewerDialog.deleteMenuButton.click();
    await personalFiles.snackBar.getByMessageLocator(randomDocxDelete).waitFor({ state: 'attached' });
    const deleteName = await personalFiles.snackBar.getByMessageLocator(randomDocxDelete).innerText();
    expect(deleteName).toContain(`${randomDocxDelete} deleted`);
    await personalFiles.dataTable.getCellLinkByName(randomDocxName).waitFor({ state: 'attached' });
    expect(await personalFiles.dataTable.getCellLinkByName(randomDocxDelete).isVisible(), 'file should not visible').toBe(false);
    await trashPage.navigate({ waitUntil: 'domcontentloaded' });
    expect(await trashPage.dataTable.isItemPresent(randomDocxDelete), 'Item should be present in Trash').toBe(true);
  });

  test('[C297584] Edit Offline action', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(fileForEditOffline);
    await personalFiles.viewer.waitForViewerToOpen();
    await personalFiles.acaHeader.clickViewerMoreActions();
    await personalFiles.matMenu.clickMenuItem('Edit Offline');

    const downloadPromise = personalFiles.page.waitForEvent('download');
    await personalFiles.acaHeader.downloadButton.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename(), 'File should found in download location').toBe(fileForEditOffline);
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is closed after pressing Full screen').toBe(true);
    await personalFiles.acaHeader.clickViewerMoreActions();
    expect(await personalFiles.matMenu.isMenuItemVisible('Cancel Editing'), 'Cancel Editing menu should be visible').toBe(true);
  });

  test('[C297585] Cancel Editing action', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(fileForCancelEditing);
    await personalFiles.viewer.waitForViewerToOpen();
    await personalFiles.acaHeader.clickViewerMoreActions();
    await personalFiles.matMenu.clickMenuItem('Cancel Editing');
    await personalFiles.acaHeader.clickViewerMoreActions();
    expect(await personalFiles.matMenu.isMenuItemVisible('Edit Offline'), 'Edit offline menu should be visible').toBe(true);
  });

  test('[C279282] Full screen action', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    await personalFiles.viewer.waitForViewerToOpen();
    await personalFiles.acaHeader.fullScreenButton.click();
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is closed after pressing Full screen').toBe(true);
  });

  test('[C286314] Pressing ESC in the viewer closes only the action dialog', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    await personalFiles.viewer.waitForViewerToOpen();
    await personalFiles.acaHeader.clickViewerMoreActions();
    await personalFiles.viewerDialog.clickActionsCopy();
    expect(await personalFiles.viewerDialog.isCopyDialogOpen(), 'Dialog is not open').toBe(true);
    await personalFiles.page.keyboard.press('Escape');
    expect(await personalFiles.viewerDialog.isCopyDialogClose(), 'Dialog is not open').toBe(false);
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer should be opened').toBe(true);
  });

  test('[C286379] Favorite action from Shared Files', async ({ sharedPage, favoritePage }) => {
    await sharedPage.navigate({ waitUntil: 'domcontentloaded' });
    await sharedPage.dataTable.performClickFolderOrFileToOpen(randomDocxNameShare);
    expect(await sharedPage.viewer.isViewerOpened(), 'Viewer should be opened').toBe(true);

    await sharedPage.acaHeader.clickViewerMoreActions();

    await favoritePage.viewerDialog.favoriteMenuButton.waitFor({ state: 'attached', timeout: timeouts.normal });
    await sharedPage.viewerDialog.favoriteMenuButton.click();
    await favoritePage.viewerDialog.favoriteMenuButton.waitFor({ state: 'detached', timeout: timeouts.normal });

    await sharedPage.acaHeader.clickViewerMoreActions();
    await favoritePage.viewerDialog.removeFavoriteMenuButton.waitFor({ state: 'attached', timeout: timeouts.normal });
    expect(await sharedPage.viewerDialog.removeFavoriteMenuButton.isVisible(), 'Item should be remove favorite').toBe(true);
    await sharedPage.page.keyboard.press('Escape');
    await favoritePage.navigate({ waitUntil: 'domcontentloaded' });
    expect(await favoritePage.dataTable.isItemPresent(randomDocxNameShare), 'Item is not present in Favorites list').toBe(true);
  });

  test('[C286395] Share action from Favorites', async ({ favoritePage }) => {
    await favoritePage.navigate({ waitUntil: 'domcontentloaded' });
    await favoritePage.dataTable.performClickFolderOrFileToOpen(randomDocxNameFavorite);
    expect(await favoritePage.viewer.isViewerOpened(), 'Viewer should be opened').toBe(true);
    await favoritePage.viewer.shareButton.waitFor({ state: 'attached', timeout: timeouts.normal });
    await favoritePage.viewer.shareButton.click();
    await favoritePage.viewerDialog.shareDialogTitle.waitFor({ state: 'attached', timeout: timeouts.normal });
    expect(await favoritePage.viewerDialog.shareDialogTitle.isVisible(), 'Share dialog should be open').toBe(true);
    await favoritePage.viewerDialog.shareDialogClose.click();
    await favoritePage.viewerDialog.shareDialogClose.waitFor({ state: 'detached', timeout: timeouts.large });
    expect(await favoritePage.viewerDialog.shareDialogTitle.isVisible(), 'Share dialog should be open').toBe(false);
  });
});
