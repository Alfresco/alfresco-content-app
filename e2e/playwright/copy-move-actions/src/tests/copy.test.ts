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

test.use({ storageState: getUserState('hruser') });
test.describe('Copy actions', () => {
  const apiClientFactory = new ApiClientFactory();

  const sourceFile = `source-file-${Utils.generateTimeStamp()}.txt`;
  const sourceFileInsideFolder = `source-file-inside-folder-${Utils.generateTimeStamp()}.txt`;
  const sourceFolder = `source-folder-${Utils.generateTimeStamp()}`;
  const destinationFolder = `destination-folder-${Utils.generateTimeStamp()}`;
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
    destinationFolderId = (await apiClientFactory.nodes.createNode('-my-', { name: destinationFolder, nodeType: 'cm:folder' })).entry.id;
    sourceFolderId = (await apiClientFactory.nodes.createNode('-my-', { name: sourceFolder, nodeType: 'cm:folder' })).entry.id;
    sourceFileInsideFolderId = (await apiClientFactory.nodes.createNode(sourceFolderId, { name: sourceFileInsideFolder, nodeType: 'cm:content' }))
      .entry.id;
    sourceFileId = (await apiClientFactory.nodes.createNode('-my-', { name: sourceFile, nodeType: 'cm:content' })).entry.id;

    nodeIdList.push(...[sourceFileId, sourceFileInsideFolderId, sourceFolderId, destinationFolderId]);

    await personalFiles.navigate();
    await personalFiles.dataTable.pagination.setItemsPerPage(100);
  });

  const copyContentInPersonalFiles = async (personalFilesPage: PersonalFilesPage, sourceFileList: string[], destinationName: string) => {
    personalFilesPage.copyOrMoveContentInDatatable(sourceFileList, destinationName, 'Copy');
    const msg = await personalFilesPage.snackBar.message.innerText();
    if (sourceFileList.length === 1) {
      expect.soft(msg).toContain('Copied 1 item');
    } else {
      expect.soft(msg).toContain(`Copied ${sourceFileList.length} items`);
    }
  };

  test('[C217135] Copy a file', async ({ personalFiles }) => {
    await copyContentInPersonalFiles(personalFiles, [sourceFile], destinationFolder);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    await personalFiles.spinner.waitForReload();
    expect(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
  });

  test('[C291888] Copy a folder with content', async ({ personalFiles }) => {
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
    await copyContentInPersonalFiles(personalFiles, [sourceFolder, sourceFile], destinationFolder);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeTruthy();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    await personalFiles.spinner.waitForReload();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeTruthy();
    expect(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
  });

  test('[C217137] Copy a file with a name that already exists on the destination', async ({ personalFiles }) => {
    nodeIdList.push((await apiClientFactory.nodes.createNode(destinationFolderId, { name: sourceFile, nodeType: 'cm:content' })).entry.id);
    const expectedNameForCopiedFile = sourceFile.replace('.', '-1.');
    await copyContentInPersonalFiles(personalFiles, [sourceFile], destinationFolder);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    await personalFiles.spinner.waitForReload();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
    expect(await personalFiles.dataTable.isItemPresent(expectedNameForCopiedFile)).toBeTruthy();
  });

  test('[C217138] Copy a folder with a name that already exists on the destination', async ({ personalFiles }) => {
    const existingFolderId = (await apiClientFactory.nodes.createNode(destinationFolderId, { name: sourceFolder, nodeType: 'cm:folder' })).entry.id;
    nodeIdList.push((await apiClientFactory.nodes.createNode(existingFolderId, { name: sourceFileInsideFolder, nodeType: 'cm:content' })).entry.id);
    nodeIdList.push(existingFolderId);
    const expectedNameForCopiedFile = sourceFileInsideFolder.replace('.', '-1.');
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
    await apiClientFactory.nodes.lockNode([sourceFileId], { type: lockType });
    await copyContentInPersonalFiles(personalFiles, [sourceFile], destinationFolder);
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    await personalFiles.spinner.waitForReload();
    expect(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
  });

  test('[C217140] Copy folder that contains locked file', async ({ personalFiles }) => {
    const lockType = 'ALLOW_OWNER_CHANGES';
    await apiClientFactory.nodes.lockNode([sourceFileInsideFolderId], { type: lockType });
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
    await copyContentInPersonalFiles(personalFiles, [sourceFile], destinationFolder);
    await personalFiles.snackBar.actionButton.click();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    await personalFiles.spinner.waitForReload();
    expect(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeFalsy();
  });

  test('[C217172] Undo copy of folders', async ({ personalFiles }) => {
    await copyContentInPersonalFiles(personalFiles, [sourceFolder], destinationFolder);
    await personalFiles.snackBar.actionButton.click();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    await personalFiles.spinner.waitForReload();
    expect(await personalFiles.dataTable.isItemPresent(sourceFolder)).toBeFalsy();
  });

  test('[C217173] Undo copy of a file when a file with same name already exists on the destination', async ({ personalFiles }) => {
    nodeIdList.push((await apiClientFactory.nodes.createNode(destinationFolderId, { name: sourceFile, nodeType: 'cm:content' })).entry.id);
    const expectedNameForCopiedFile = sourceFile.replace('.', '-1.');
    await copyContentInPersonalFiles(personalFiles, [sourceFile], destinationFolder);
    await personalFiles.snackBar.actionButton.click();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolder);
    await personalFiles.spinner.waitForReload();
    expect.soft(await personalFiles.dataTable.isItemPresent(sourceFile)).toBeTruthy();
    expect(await personalFiles.dataTable.isItemPresent(expectedNameForCopiedFile)).toBeFalsy();
  });

  test('[C217174] Undo copy of a folder when a folder with same name already exists on the destination', async ({ personalFiles }) => {
    const existingFolderId = (await apiClientFactory.nodes.createNode(destinationFolderId, { name: sourceFolder, nodeType: 'cm:folder' })).entry.id;
    nodeIdList.push((await apiClientFactory.nodes.createNode(existingFolderId, { name: sourceFileInsideFolder, nodeType: 'cm:content' })).entry.id);
    nodeIdList.push(existingFolderId);
    const expectedNameForCopiedFile = sourceFileInsideFolder.replace('.', '-1.');
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
