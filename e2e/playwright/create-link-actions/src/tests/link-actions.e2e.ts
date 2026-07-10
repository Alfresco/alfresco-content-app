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

import { ApiClientFactory, NodesApi, TrashcanApi, Utils, test, LoginPage, PersonalFilesPage } from '@alfresco/aca-playwright-shared';
import { expect } from '@playwright/test';

test.describe('Create Link - actions on linked items', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  const username = `user-${Utils.random()}`;

  let sourceFile: string;
  let sourceFolder: string;
  let destinationFolder: string;
  let copyDestinationFolder: string;
  let moveDestinationFolder: string;

  let sourceFileId: string;
  let sourceFolderId: string;
  let destinationFolderId: string;
  let copyDestinationFolderId: string;
  let moveDestinationFolderId: string;

  let fileLinkName: string;
  let folderLinkName: string;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
      throw error;
    }
  });

  test.beforeEach(async ({ personalFiles, page }) => {
    sourceFile = `source-file-${Utils.random()}.txt`;
    sourceFolder = `source-folder-${Utils.random()}`;
    destinationFolder = `destination-folder-${Utils.random()}`;
    copyDestinationFolder = `copy-dest-${Utils.random()}`;
    moveDestinationFolder = `move-dest-${Utils.random()}`;

    const loginPage = new LoginPage(page);
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');

    sourceFileId = (await nodesApi.createFile(sourceFile)).entry.id;
    sourceFolderId = (await nodesApi.createFolder(sourceFolder)).entry.id;
    destinationFolderId = (await nodesApi.createFolder(destinationFolder)).entry.id;
    copyDestinationFolderId = (await nodesApi.createFolder(copyDestinationFolder)).entry.id;
    moveDestinationFolderId = (await nodesApi.createFolder(moveDestinationFolder)).entry.id;

    const fileLinkEntry = await nodesApi.createFileLink(sourceFileId, destinationFolderId);
    const folderLinkEntry = await nodesApi.createFolderLink(sourceFolderId, destinationFolderId);

    fileLinkName = fileLinkEntry.entry.name;
    folderLinkName = folderLinkEntry.entry.name;

    await personalFiles.navigate();
    await Utils.reloadPageIfRowNotVisible(personalFiles, destinationFolder);
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[TC4a] should copy a linked file to another location and verify the link still exists', async ({ personalFiles }) => {
    await navigateToFolderById(personalFiles, destinationFolderId);
    await Utils.reloadPageIfRowNotVisible(personalFiles, fileLinkName);

    await copyItemInPage(personalFiles, fileLinkName, copyDestinationFolder);

    const msg = await personalFiles.snackBar.getSnackBarMessage();
    expect.soft(msg).toContain('Copied 1 item');

    expect.soft(await personalFiles.dataTable.isItemPresent(fileLinkName)).toBe(true);

    await navigateToFolderById(personalFiles, copyDestinationFolderId);
    expect(await personalFiles.dataTable.isItemPresent(fileLinkName)).toBe(true);
  });

  test('[TC4b] should copy a linked folder to another location and verify the link still exists', async ({ personalFiles }) => {
    await navigateToFolderById(personalFiles, destinationFolderId);
    await Utils.reloadPageIfRowNotVisible(personalFiles, folderLinkName);

    await copyItemInPage(personalFiles, folderLinkName, copyDestinationFolder);

    const msg = await personalFiles.snackBar.getSnackBarMessage();
    expect.soft(msg).toContain('Copied 1 item');

    expect.soft(await personalFiles.dataTable.isItemPresent(folderLinkName)).toBe(true);

    await navigateToFolderById(personalFiles, copyDestinationFolderId);
    expect(await personalFiles.dataTable.isItemPresent(folderLinkName)).toBe(true);
  });

  test('[TC4c] should move a linked file to another location and verify the link is accessible', async ({ personalFiles }) => {
    await navigateToFolderById(personalFiles, destinationFolderId);
    await Utils.reloadPageIfRowNotVisible(personalFiles, fileLinkName);

    await moveItemInPage(personalFiles, fileLinkName, moveDestinationFolder);

    const msg = await personalFiles.snackBar.getSnackBarMessage();
    expect.soft(msg).toContain('Moved 1 item.');
    await personalFiles.snackBar.closeIcon.click();

    expect.soft(await personalFiles.dataTable.isItemPresent(fileLinkName)).toBe(false);

    await navigateToFolderById(personalFiles, moveDestinationFolderId);
    expect(await personalFiles.dataTable.isItemPresent(fileLinkName)).toBe(true);
  });

  test('[TC4d] should move a linked folder to another location and verify the link is accessible', async ({ personalFiles }) => {
    await navigateToFolderById(personalFiles, destinationFolderId);
    await Utils.reloadPageIfRowNotVisible(personalFiles, folderLinkName);

    await moveItemInPage(personalFiles, folderLinkName, moveDestinationFolder);

    const msg = await personalFiles.snackBar.getSnackBarMessage();
    expect.soft(msg).toContain('Moved 1 item.');
    await personalFiles.snackBar.closeIcon.click();

    expect.soft(await personalFiles.dataTable.isItemPresent(folderLinkName)).toBe(false);

    await navigateToFolderById(personalFiles, moveDestinationFolderId);
    expect(await personalFiles.dataTable.isItemPresent(folderLinkName)).toBe(true);
  });

  test('[TC6a] should permanently delete a linked file without showing Undo or placing it in Trash', async ({ personalFiles, trashPage }) => {
    await navigateToFolderById(personalFiles, destinationFolderId);
    await Utils.reloadPageIfRowNotVisible(personalFiles, fileLinkName);

    await personalFiles.dataTable.performActionFromExpandableMenu(fileLinkName, 'Delete');

    const msg = await personalFiles.snackBar.getSnackBarMessage();
    expect.soft(msg).toContain('deleted');

    expect.soft(await personalFiles.snackBar.actionButton.isVisible()).toBe(false);

    expect.soft(await personalFiles.dataTable.isItemPresent(fileLinkName)).toBe(false);

    await trashPage.navigate();
    await trashPage.spinnerWaitForReload();
    expect(await trashPage.dataTable.isItemPresent(fileLinkName)).toBe(false);
  });

  test('[TC6b] should permanently delete a linked folder without showing Undo or placing it in Trash', async ({ personalFiles, trashPage }) => {
    await navigateToFolderById(personalFiles, destinationFolderId);
    await Utils.reloadPageIfRowNotVisible(personalFiles, folderLinkName);

    await personalFiles.dataTable.performActionFromExpandableMenu(folderLinkName, 'Delete');

    const msg = await personalFiles.snackBar.getSnackBarMessage();
    expect.soft(msg).toContain('deleted');

    expect.soft(await personalFiles.snackBar.actionButton.isVisible()).toBe(false);
    expect.soft(await personalFiles.dataTable.isItemPresent(folderLinkName)).toBe(false);

    await trashPage.navigate();
    await trashPage.spinnerWaitForReload();
    expect(await trashPage.dataTable.isItemPresent(folderLinkName)).toBe(false);
  });

  test('[TC7a] should display N/A for size in the info drawer of a linked file', async ({ personalFiles }) => {
    await navigateToFolderById(personalFiles, destinationFolderId);
    await Utils.reloadPageIfRowNotVisible(personalFiles, fileLinkName);

    await personalFiles.dataTable.selectItems(fileLinkName);
    await personalFiles.acaHeader.clickMoreActions();
    await personalFiles.matMenu.clickMenuItem('Information');

    await expect(personalFiles.folderInformationDialog.folderSize).toBeVisible();
    const sizeText = await personalFiles.folderInformationDialog.folderSize.textContent();
    expect(sizeText?.trim()).toBe('N/A');

    await personalFiles.folderInformationDialog.doneButton.click();
  });

  test('[TC7b] should display N/A for size in the info drawer of a linked folder', async ({ personalFiles }) => {
    await navigateToFolderById(personalFiles, destinationFolderId);
    await Utils.reloadPageIfRowNotVisible(personalFiles, folderLinkName);

    await personalFiles.dataTable.selectItems(folderLinkName);
    await personalFiles.acaHeader.clickMoreActions();
    await personalFiles.matMenu.clickMenuItem('Information');

    await expect(personalFiles.folderInformationDialog.folderSize).toBeVisible();
    const sizeText = await personalFiles.folderInformationDialog.folderSize.textContent();
    expect(sizeText?.trim()).toBe('N/A');

    await personalFiles.folderInformationDialog.doneButton.click();
  });

  test('[TC8a] should locate the original file when using Locate Linked Item on a file link', async ({ personalFiles }) => {
    await navigateToFolderById(personalFiles, destinationFolderId);
    await Utils.reloadPageIfRowNotVisible(personalFiles, fileLinkName);

    await personalFiles.dataTable.performActionFromExpandableMenu(fileLinkName, 'Locate Linked Item');
    await personalFiles.spinnerWaitForReload();

    await personalFiles.page.waitForURL('**/#/personal-files**');
    expect(await personalFiles.dataTable.isItemPresent(sourceFile)).toBe(true);
  });

  test('[TC8b] should locate the original folder when using Locate Linked Item on a folder link', async ({ personalFiles }) => {
    await navigateToFolderById(personalFiles, destinationFolderId);
    await Utils.reloadPageIfRowNotVisible(personalFiles, folderLinkName);

    await personalFiles.dataTable.performActionFromExpandableMenu(folderLinkName, 'Locate Linked Item');
    await personalFiles.spinnerWaitForReload();

    await personalFiles.page.waitForURL('**/#/personal-files**');
    expect(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBe(true);
  });

  test('[TC9a] should navigate to original file location when opening a file link', async ({ personalFiles }) => {
    await navigateToFolderById(personalFiles, destinationFolderId);
    await Utils.reloadPageIfRowNotVisible(personalFiles, fileLinkName);

    await personalFiles.dataTable.performClickFolderOrFileToOpen(fileLinkName);
    await personalFiles.spinnerWaitForReload();

    await personalFiles.page.waitForURL('**/#/personal-files**');
    expect(await personalFiles.dataTable.isItemPresent(sourceFile)).toBe(true);
  });

  test('[TC9b] should navigate inside the original folder when opening a folder link', async ({ personalFiles }) => {
    await navigateToFolderById(personalFiles, destinationFolderId);
    await Utils.reloadPageIfRowNotVisible(personalFiles, folderLinkName);

    await personalFiles.dataTable.performClickFolderOrFileToOpen(folderLinkName);
    await personalFiles.spinnerWaitForReload();

    await personalFiles.page.waitForURL(`**/${sourceFolderId}**`);
    await expect(personalFiles.breadcrumb.currentItem).toHaveText(sourceFolder);
  });

  const navigateToFolderById = async (page: PersonalFilesPage, nodeId: string): Promise<void> => {
    await page.navigate({ remoteUrl: `./#/personal-files/${nodeId}`, waitUntil: 'load' });
    await page.spinnerWaitForReload();
  };

  const copyItemInPage = (page: PersonalFilesPage, itemName: string, destinationName: string): Promise<void> =>
    performNodeAction(page, itemName, 'Copy', destinationName);

  const moveItemInPage = (page: PersonalFilesPage, itemName: string, destinationName: string): Promise<void> =>
    performNodeAction(page, itemName, 'Move', destinationName);

  const performNodeAction = async (page: PersonalFilesPage, itemName: string, action: 'Copy' | 'Move', destinationName: string): Promise<void> => {
    await page.dataTable.selectItems(itemName);
    await page.clickMoreActionsButton(action);
    await page.contentNodeSelector.searchAndSelectDestination(destinationName);
    await page.contentNodeSelector.actionButton.click();
    await page.spinnerWaitForReload();
  };
});
