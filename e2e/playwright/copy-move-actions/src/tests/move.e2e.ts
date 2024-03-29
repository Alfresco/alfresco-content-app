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

test.describe('Move actions', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  const username = `user-${Utils.random()}`;

  let sourceFileId: string;
  let sourceFileInsideFolderId: string;
  let destinationFolderId: string;

  let sourceFile: string;
  let sourceFileInsideFolder: string;
  let sourceFolder: string;
  let destinationFolder: string;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
    } catch {}
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

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  const moveContentInPersonalFiles = async (personalFilesPage: PersonalFilesPage, sourceFileList: string[], destinationName: string) => {
    await personalFilesPage.copyOrMoveContentInDatatable(sourceFileList, destinationName, 'Move');
    await personalFilesPage.spinner.waitForReload();
  };

  test('[C217316] Move a file', async ({ personalFiles }) => {
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFile);
    await moveContentInPersonalFiles(personalFiles, [sourceFile], destinationFolder);
    const msg = await personalFiles.snackBar.message.innerText();
    expect.soft(msg).toContain('Moved 1 item.');
    await personalFiles.snackBar.closeIcon.click();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeFalsy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    expect(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
  });

  test('[C291958] Move multiple items', async ({ personalFiles }) => {
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFolder);
    await moveContentInPersonalFiles(personalFiles, [sourceFolder, sourceFile], destinationFolder);
    const msg = await personalFiles.snackBar.message.innerText();
    expect.soft(msg).toContain('Moved 2 items.');
    await personalFiles.snackBar.closeIcon.click();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeFalsy();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeFalsy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeTruthy();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
  });

  test('[C217318] Move a file with a name that already exists on the destination', async ({ personalFiles }) => {
    await nodesApi.createFile(sourceFile, destinationFolderId);
    const expectedNameForCopiedFile = sourceFile.replace('.', '-1.');
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFile);
    await moveContentInPersonalFiles(personalFiles, [sourceFile], destinationFolder);
    const msg = await personalFiles.snackBar.message.innerText();
    expect.soft(msg).toContain('Move unsuccessful, a file with the same name already exists.');
    await personalFiles.snackBar.closeIcon.click();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    expect(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
    expect(await personalFiles.dataTable.isItemPresent(expectedNameForCopiedFile)).toBeFalsy();
  });

  test('[C217319] Move a folder with a name that already exists on the destination', async ({ personalFiles }) => {
    const existingFolderId = (await nodesApi.createFolder(sourceFolder, destinationFolderId)).entry.id;
    await nodesApi.createFile(sourceFileInsideFolder, existingFolderId);
    const expectedNameForCopiedFile = sourceFileInsideFolder.replace('.', '-1.');
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFolder);
    await moveContentInPersonalFiles(personalFiles, [sourceFolder], destinationFolder);
    const msg = await personalFiles.snackBar.message.innerText();
    expect.soft(msg).toContain('Move unsuccessful, a file with the same name already exists.');
    await personalFiles.snackBar.closeIcon.click();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    expect(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(sourceFolder);
    expect(await personalFiles.dataTable.isItemPresent(sourceFileInsideFolder)).toBeTruthy();
    expect(await personalFiles.dataTable.isItemPresent(expectedNameForCopiedFile)).toBeFalsy();
  });

  test('[C217320] Move locked file', async ({ personalFiles }) => {
    const lockType = 'ALLOW_OWNER_CHANGES';
    await nodesApi.lockNodes([sourceFileId], lockType);
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFile);
    await moveContentInPersonalFiles(personalFiles, [sourceFile], destinationFolder);
    const msg = await personalFiles.snackBar.message.innerText();
    expect.soft(msg).toContain('Moved 1 item.');
    await personalFiles.snackBar.closeIcon.click();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeFalsy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
  });

  test('[C217324] Undo move files', async ({ personalFiles, trashPage }) => {
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFile);
    await moveContentInPersonalFiles(personalFiles, [sourceFile], destinationFolder);
    await personalFiles.snackBar.actionButton.click();
    await personalFiles.spinner.waitForReload();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeFalsy();
    await trashPage.navigate();
    expect(await trashPage.dataTable.isItemPresent(sourceFile)).toBeFalsy();
  });

  test('[C217325] Undo move of folders', async ({ personalFiles, trashPage }) => {
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFolder);
    await moveContentInPersonalFiles(personalFiles, [sourceFolder], destinationFolder);
    await personalFiles.snackBar.actionButton.click();
    await personalFiles.spinner.waitForReload();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeFalsy();
    await trashPage.navigate();
    expect(await trashPage.dataTable.isItemPresent(sourceFolder)).toBeFalsy();
  });

  async function moveFolderWithContent(personalFiles: PersonalFilesPage, lockedFile: boolean) {
    if (lockedFile) {
      const lockType = 'ALLOW_OWNER_CHANGES';
      await nodesApi.lockNodes([sourceFileInsideFolderId], lockType);
    }
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFolder);
    await moveContentInPersonalFiles(personalFiles, [sourceFolder], destinationFolder);
    const msg = await personalFiles.snackBar.message.innerText();
    expect.soft(msg).toContain('Moved 1 item.');
    await personalFiles.snackBar.closeIcon.click();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeFalsy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(sourceFolder);
    expect(await personalFiles.dataTable.isItemPresent(sourceFileInsideFolder)).toBeTruthy();
  }

  [
    {
      id: 'C217317',
      testTitle: `Move a folder with content`,
      lockedFile: false
    },
    {
      id: 'C217321',
      testTitle: 'Move folder that contains locked file',
      lockedFile: true
    }
  ].forEach((testCase) => {
    test(`[${testCase.id}] ${testCase.testTitle}`, async ({ personalFiles }) => {
      await moveFolderWithContent(personalFiles, testCase.lockedFile);
    });
  });
});
