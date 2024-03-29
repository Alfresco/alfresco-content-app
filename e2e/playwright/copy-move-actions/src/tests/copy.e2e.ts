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

import { ApiClientFactory, test, Utils, PersonalFilesPage, NodesApi, LoginPage, TrashcanApi } from '@alfresco/playwright-shared';
import { expect } from '@playwright/test';

test.describe('Copy actions', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  const username = `user-${Utils.random()}`;

  let sourceFile: string;
  let sourceFileInsideFolder: string;
  let sourceFolder: string;
  let destinationFolder: string;

  let sourceFileId: string;
  let sourceFileInsideFolderId: string;
  let destinationFolderId: string;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test.beforeEach(async ({ personalFiles, page }) => {
    sourceFile = `source-file-${Utils.random()}.txt`;
    sourceFileInsideFolder = `source-file-inside-folder-${Utils.random()}.txt`;
    sourceFolder = `source-folder-${Utils.random()}`;
    destinationFolder = `destination-folder-${Utils.random()}`;

    const loginPage = new LoginPage(page);
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');

    destinationFolderId = (await nodesApi.createFolder(destinationFolder)).entry.id;
    const sourceFolderId = (await nodesApi.createFolder(sourceFolder)).entry.id;
    sourceFileInsideFolderId = (await nodesApi.createFile(sourceFileInsideFolder, sourceFolderId)).entry.id;
    sourceFileId = (await nodesApi.createFile(sourceFile)).entry.id;

    await personalFiles.navigate();
  });

  const copyContentInPersonalFiles = async (personalFilesPage: PersonalFilesPage, sourceFileList: string[], destinationName: string) => {
    await personalFilesPage.copyOrMoveContentInDatatable(sourceFileList, destinationName, 'Copy');
    const msg = await personalFilesPage.snackBar.message.innerText();
    if (sourceFileList.length === 1) {
      expect.soft(msg).toContain('Copied 1 item');
    } else {
      expect.soft(msg).toContain(`Copied ${sourceFileList.length} items`);
    }
  };

  test('[C217135] Copy a file', async ({ personalFiles }) => {
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFile);
    await copyContentInPersonalFiles(personalFiles, [sourceFile], destinationFolder);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    await personalFiles.spinner.waitForReload();
    expect(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
  });

  test('[C291888] Copy a folder with content', async ({ personalFiles }) => {
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFolder);
    await copyContentInPersonalFiles(personalFiles, [sourceFolder], destinationFolder);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    await personalFiles.spinner.waitForReload();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(sourceFolder);
    await personalFiles.spinner.waitForReload();
    expect(await personalFiles.dataTable.isItemPresent(sourceFileInsideFolder)).toBeTruthy();
  });

  test('[C291889] Copy multiple items', async ({ personalFiles }) => {
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFolder);
    await copyContentInPersonalFiles(personalFiles, [sourceFolder, sourceFile], destinationFolder);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeTruthy();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    await personalFiles.spinner.waitForReload();
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFolder);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeTruthy();
    expect(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
  });

  test('[C217137] Copy a file with a name that already exists on the destination', async ({ personalFiles }) => {
    await nodesApi.createFile(sourceFile, destinationFolderId);
    const expectedNameForCopiedFile = sourceFile.replace('.', '-1.');
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFile);
    await copyContentInPersonalFiles(personalFiles, [sourceFile], destinationFolder);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    await personalFiles.spinner.waitForReload();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
    expect(await personalFiles.dataTable.isItemPresent(expectedNameForCopiedFile)).toBeTruthy();
  });

  test('[C217138] Copy a folder with a name that already exists on the destination', async ({ personalFiles }) => {
    const existingFolderId = (await nodesApi.createFolder(sourceFolder, destinationFolderId)).entry.id;
    await nodesApi.createFile(sourceFileInsideFolder, existingFolderId);
    const expectedNameForCopiedFile = sourceFileInsideFolder.replace('.', '-1.');
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFolder);
    await copyContentInPersonalFiles(personalFiles, [sourceFolder], destinationFolder);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    await personalFiles.spinner.waitForReload();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(sourceFolder);
    await personalFiles.spinner.waitForReload();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFileInsideFolder)).toBeTruthy();
    expect(await personalFiles.dataTable.isItemPresent(expectedNameForCopiedFile)).toBeTruthy();
  });

  test('[C217139] Copy locked file', async ({ personalFiles }) => {
    const lockType = 'ALLOW_OWNER_CHANGES';
    await nodesApi.lockNodes([sourceFileId], lockType);
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFile);
    await copyContentInPersonalFiles(personalFiles, [sourceFile], destinationFolder);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    await personalFiles.spinner.waitForReload();
    expect(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
  });

  test('[C217140] Copy folder that contains locked file', async ({ personalFiles }) => {
    const lockType = 'ALLOW_OWNER_CHANGES';
    await nodesApi.lockNodes([sourceFileInsideFolderId], lockType);
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFolder);
    await copyContentInPersonalFiles(personalFiles, [sourceFolder], destinationFolder);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    await personalFiles.spinner.waitForReload();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(sourceFolder);
    await personalFiles.spinner.waitForReload();
    expect(await personalFiles.dataTable.isItemPresent(sourceFileInsideFolder)).toBeTruthy();
  });

  test('[C217171] Undo copy of files', async ({ personalFiles }) => {
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFile);
    await copyContentInPersonalFiles(personalFiles, [sourceFile], destinationFolder);
    await personalFiles.snackBar.actionButton.click();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    await personalFiles.spinner.waitForReload();
    expect(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeFalsy();
  });

  test('[C217172] Undo copy of folders', async ({ personalFiles }) => {
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFolder);
    await copyContentInPersonalFiles(personalFiles, [sourceFolder], destinationFolder);
    await personalFiles.snackBar.actionButton.click();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    await personalFiles.spinner.waitForReload();
    expect(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeFalsy();
  });

  test('[C217173] Undo copy of a file when a file with same name already exists on the destination', async ({ personalFiles }) => {
    await nodesApi.createFile(sourceFile, destinationFolderId);
    const expectedNameForCopiedFile = sourceFile.replace('.', '-1.');
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFile);
    await copyContentInPersonalFiles(personalFiles, [sourceFile], destinationFolder);
    await personalFiles.snackBar.actionButton.click();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    await personalFiles.spinner.waitForReload();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
    expect(await personalFiles.dataTable.isItemPresent(expectedNameForCopiedFile)).toBeFalsy();
  });

  test('[C217174] Undo copy of a folder when a folder with same name already exists on the destination', async ({ personalFiles }) => {
    const existingFolderId = (await nodesApi.createFolder(sourceFolder, destinationFolderId)).entry.id;
    await nodesApi.createFile(sourceFileInsideFolder, existingFolderId);
    const expectedNameForCopiedFile = sourceFileInsideFolder.replace('.', '-1.');
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFolder);
    await copyContentInPersonalFiles(personalFiles, [sourceFolder], destinationFolder);
    await personalFiles.snackBar.actionButton.click();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    await personalFiles.spinner.waitForReload();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(sourceFolder);
    await personalFiles.spinner.waitForReload();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFileInsideFolder)).toBeTruthy();
    expect(await personalFiles.dataTable.isItemPresent(expectedNameForCopiedFile)).toBeFalsy();
  });
});
