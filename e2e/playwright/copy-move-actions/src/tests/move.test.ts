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

import { ApiClientFactory, getUserState, test, Utils, PersonalFilesPage } from '@alfresco/playwright-shared';
import { expect } from '@playwright/test';

// TODO: Test ids for new move tests need to be added
test.use({ storageState: getUserState('hruser') });
test.describe('Move actions', () => {
  const apiClientFactory = new ApiClientFactory();

  const sourceFileName = `source-file-${Utils.generateTimeStamp()}.txt`;
  const sourceFileInsideFolderName = `source-file-inside-folder-${Utils.generateTimeStamp()}.txt`;
  const sourceFolderName = `source-folder-${Utils.generateTimeStamp()}`;
  const destinationFolderName = `destination-folder-${Utils.generateTimeStamp()}`;
  const nodeIdList: string[] = [];

  let sourceFileId: string;
  let sourceFileInsideFolderId: string;
  let sourceFolderId: string;
  let destinationFolderId: string;

  test.beforeAll(async () => {
    await apiClientFactory.setUpAcaBackend('hruser');
  });

  test.afterEach(async () => {
    for (const id of nodeIdList) {
      await apiClientFactory.nodes.deleteNode(id);
    }
  });

  test.beforeEach(async ({ personalFiles }) => {
    destinationFolderId = (await apiClientFactory.nodes.createNode('-my-', { name: destinationFolderName, nodeType: 'cm:folder' })).entry.id;
    sourceFolderId = (await apiClientFactory.nodes.createNode('-my-', { name: sourceFolderName, nodeType: 'cm:folder' })).entry.id;
    sourceFileId = (await apiClientFactory.nodes.createNode('-my-', { name: sourceFileName, nodeType: 'cm:content' })).entry.id;
    sourceFileInsideFolderId = (await apiClientFactory.nodes.createNode(sourceFolderId, { name: sourceFileInsideFolderName, nodeType: 'cm:content' }))
      .entry.id;

    nodeIdList.push(...[sourceFileId, sourceFileInsideFolderId, sourceFolderId, destinationFolderId]);

    await personalFiles.navigate();
    await personalFiles.dataTable.pagination.setItemsPerPage(100);
  });

  const moveContentInPersonalFiles = async (personalFilesPage: PersonalFilesPage, sourceFileList: string[], destinationName: string) => {
    await personalFilesPage.copyOrMoveContentInDatatable(sourceFileList, destinationName, 'Move');
    await personalFilesPage.spinner.waitForReload();
  };

  test('[C217316] Move a file', async ({ personalFiles }) => {
    await moveContentInPersonalFiles(personalFiles, [sourceFileName], destinationFolderName);
    const msg = await personalFiles.snackBar.message.innerText();
    expect.soft(msg).toContain('Moved 1 item.');
    await personalFiles.snackBar.closeIcon.click();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFileName)).toBeFalsy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolderName);
    expect(await personalFiles.dataTable.isItemPresent(sourceFileName)).toBeTruthy();
  });

  test('[C217317] Move a folder with content', async ({ personalFiles }) => {
    await moveContentInPersonalFiles(personalFiles, [sourceFolderName], destinationFolderName);
    const msg = await personalFiles.snackBar.message.innerText();
    expect.soft(msg).toContain('Moved 1 item.');
    await personalFiles.snackBar.closeIcon.click();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolderName)).toBeFalsy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolderName);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolderName)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(sourceFolderName);
    expect(await personalFiles.dataTable.isItemPresent(sourceFileInsideFolderName)).toBeTruthy();
  });

  test('[C291958] Move multiple items', async ({ personalFiles }) => {
    await moveContentInPersonalFiles(personalFiles, [sourceFolderName, sourceFileName], destinationFolderName);
    const msg = await personalFiles.snackBar.message.innerText();
    expect.soft(msg).toContain('Moved 2 items.');
    await personalFiles.snackBar.closeIcon.click();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolderName)).toBeFalsy();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFileName)).toBeFalsy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolderName);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolderName)).toBeTruthy();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFileName)).toBeTruthy();
  });

  test('[C217318] Move a file with a name that already exists on the destination', async ({ personalFiles }) => {
    nodeIdList.push((await apiClientFactory.nodes.createNode(destinationFolderId, { name: sourceFileName, nodeType: 'cm:content' })).entry.id);
    const expectedNameForCopiedFile = sourceFileName.replace('.', '-1.');
    await moveContentInPersonalFiles(personalFiles, [sourceFileName], destinationFolderName);
    const msg = await personalFiles.snackBar.message.innerText();
    expect.soft(msg).toContain('Move unsuccessful, a file with the same name already exists.');
    await personalFiles.snackBar.closeIcon.click();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFileName)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolderName);
    expect(await personalFiles.dataTable.isItemPresent(sourceFileName)).toBeTruthy();
    expect(await personalFiles.dataTable.isItemPresent(expectedNameForCopiedFile)).toBeFalsy();
  });

  test('[C217319] Move a folder with a name that already exists on the destination', async ({ personalFiles }) => {
    const existingFolderId = (await apiClientFactory.nodes.createNode(destinationFolderId, { name: sourceFolderName, nodeType: 'cm:folder' })).entry
      .id;
    nodeIdList.push(
      (await apiClientFactory.nodes.createNode(existingFolderId, { name: sourceFileInsideFolderName, nodeType: 'cm:content' })).entry.id
    );
    nodeIdList.push(existingFolderId);
    const expectedNameForCopiedFile = sourceFileInsideFolderName.replace('.', '-1.');
    await moveContentInPersonalFiles(personalFiles, [sourceFolderName], destinationFolderName);
    const msg = await personalFiles.snackBar.message.innerText();
    expect.soft(msg).toContain('Move unsuccessful, a file with the same name already exists.');
    await personalFiles.snackBar.closeIcon.click();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolderName)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolderName);
    expect(await personalFiles.dataTable.isItemPresent(sourceFolderName)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(sourceFolderName);
    expect(await personalFiles.dataTable.isItemPresent(sourceFileInsideFolderName)).toBeTruthy();
    expect(await personalFiles.dataTable.isItemPresent(expectedNameForCopiedFile)).toBeFalsy();
  });

  test('[<AddTestId>] Move locked file', async ({ personalFiles }) => {
    const lockType = 'ALLOW_OWNER_CHANGES';
    await apiClientFactory.nodes.lockNode([sourceFileId], { type: lockType });
    await moveContentInPersonalFiles(personalFiles, [sourceFileName], destinationFolderName);
    const msg = await personalFiles.snackBar.message.innerText();
    expect.soft(msg).toContain('Moved 1 item.');
    await personalFiles.snackBar.closeIcon.click();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFileName)).toBeFalsy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolderName);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFileName)).toBeTruthy();
  });

  test('[<AddTestId>] Move folder that contains locked file', async ({ personalFiles }) => {
    const lockType = 'ALLOW_OWNER_CHANGES';
    await apiClientFactory.nodes.lockNode([sourceFileInsideFolderId], { type: lockType });
    await moveContentInPersonalFiles(personalFiles, [sourceFolderName], destinationFolderName);
    const msg = await personalFiles.snackBar.message.innerText();
    expect.soft(msg).toContain('Moved 1 item.');
    await personalFiles.snackBar.closeIcon.click();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolderName)).toBeFalsy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolderName);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolderName)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(sourceFolderName);
    expect(await personalFiles.dataTable.isItemPresent(sourceFileInsideFolderName)).toBeTruthy();
  });

  test('[<AddTestId>] Undo move of files', async ({ personalFiles }) => {
    await moveContentInPersonalFiles(personalFiles, [sourceFileName], destinationFolderName);
    await personalFiles.snackBar.actionButton.click();
    await personalFiles.spinner.waitForReload();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFileName)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolderName);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFileName)).toBeFalsy();
  });

  test('[<AddTestId>] Undo move of folders', async ({ personalFiles }) => {
    await moveContentInPersonalFiles(personalFiles, [sourceFolderName], destinationFolderName);
    await personalFiles.snackBar.actionButton.click();
    await personalFiles.spinner.waitForReload();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolderName)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolderName);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolderName)).toBeFalsy();
  });
});
