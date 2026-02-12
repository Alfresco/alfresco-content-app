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
  NodesApi,
  Utils,
  test,
  TrashcanApi,
  TEST_FILES,
  FileActionsApi,
  PersonalFilesPage,
  MyLibrariesPage,
  SitesApi,
  SearchPage
} from '@alfresco/aca-playwright-shared';

test.describe('Actions - Folder Information', () => {
  const username = `user-e2e-${Utils.random()}`;
  const emptyFolder = `folder17722-${Utils.random()}`;
  const folder1File = `folder17715-${Utils.random()}`;
  const folderXFiles = `folder17752-${Utils.random()}`;
  const folderXFilesAndFolders = `folder17753-1-${Utils.random()}`;
  const folderInsideFolder = `folder17753-2-${Utils.random()}`;
  const folderInLibrary = `folder17758-${Utils.random()}`;
  const libraryForFolder = `library17758-${Utils.random()}`;
  const folderForSearch = `folder17759-${Utils.random()}`;
  const folderNested1 = `folder17766-1-${Utils.random()}`;
  const folderNested2 = `folder17766-1-${Utils.random()}`;
  const folderNested3 = `folder17766-1-${Utils.random()}`;
  const file1 = `file1-${Utils.random()}.docx`;
  const file2 = `file2-${Utils.random()}.docx`;
  const file3 = `file3-${Utils.random()}.docx`;
  const file4 = `file4-${Utils.random()}.docx`;
  const file5 = `file5-${Utils.random()}.docx`;
  const file6 = `file6-${Utils.random()}.docx`;
  const file7 = `file7-${Utils.random()}.docx`;
  const file8 = `file8-${Utils.random()}.docx`;
  const file9 = `file9-${Utils.random()}.docx`;
  const file10 = `file10-${Utils.random()}.docx`;
  const file11 = `file10-${Utils.random()}.docx`;
  const file12 = `file10-${Utils.random()}.docx`;
  const file13 = `file10-${Utils.random()}.docx`;
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let fileActionsApi: FileActionsApi;
  let sitesApi: SitesApi;
  let folder1FileId: string;
  let folderXFilesId: string;
  let folderXFilesAndFoldersId: string;
  let folderInsideFolderId: string;
  let folderInLibraryId: string;
  let siteId: string;
  let folderForSearchId: string;
  let folderNested1Id: string;
  let folderNested2Id: string;
  let folderNested3Id: string;

  test.beforeAll(async () => {
    const apiService = new ApiClientFactory();
    await apiService.setUpAcaBackend('admin');
    await apiService.createUser({ username: username });
    nodesApi = await NodesApi.initialize(username, username);
    trashcanApi = await TrashcanApi.initialize(username, username);
    fileActionsApi = await FileActionsApi.initialize(username, username);
    sitesApi = await SitesApi.initialize(username, username);

    siteId = (await sitesApi.createSite(libraryForFolder)).entry.id;
    const docLibId = await sitesApi.getDocLibId(siteId);
    await nodesApi.createFolder(emptyFolder, '-my-');
    folder1FileId = (await nodesApi.createFolder(folder1File, '-my-')).entry.id;
    folderXFilesId = (await nodesApi.createFolder(folderXFiles, '-my-')).entry.id;
    folderXFilesAndFoldersId = (await nodesApi.createFolder(folderXFilesAndFolders, '-my-')).entry.id;
    folderInsideFolderId = (await nodesApi.createFolder(folderInsideFolder, folderXFilesAndFoldersId)).entry.id;
    folderInLibraryId = (await nodesApi.createFolder(folderInLibrary, docLibId)).entry.id;
    folderForSearchId = (await nodesApi.createFolder(folderForSearch, '-my-')).entry.id;
    folderNested1Id = (await nodesApi.createFolder(folderNested1, '-my-')).entry.id;
    folderNested2Id = (await nodesApi.createFolder(folderNested2, folderNested1Id)).entry.id;
    folderNested3Id = (await nodesApi.createFolder(folderNested3, folderNested2Id)).entry.id;

    await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, file1, folder1FileId);
    await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, file2, folderXFilesId);
    await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, file3, folderXFilesId);
    await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, file4, folderXFilesId);
    await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, file5, folderXFilesAndFoldersId);
    await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, file6, folderXFilesAndFoldersId);
    await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, file7, folderXFilesAndFoldersId);
    await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, file8, folderInsideFolderId);
    await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, file9, folderInsideFolderId);
    await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, file10, folderInLibraryId);
    await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, file11, folderForSearchId);
    await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, file12, folderForSearchId);
    await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, file13, folderNested3Id);
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'Main beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  async function checkFolderInformation(
    page: PersonalFilesPage | MyLibrariesPage | SearchPage,
    folderName: string,
    expectedNumber: string,
    expectedSize: string,
    location: string,
    isEmptyFolder?: 'isEmpty'
  ) {
    await page.dataTable.selectItems(folderName);
    await page.acaHeader.clickMoreActions();
    await page.matMenu.clickMenuItem('Information');
    await expect(async () => {
      expect(await page.folderInformationDialog.folderNumberOfFiles.textContent()).toContain(expectedNumber);
      expect(await page.folderInformationDialog.folderSize.textContent()).toContain(expectedSize);
    }).toPass({
      intervals: [1_000],
      timeout: 5_000
    });
    if (!isEmptyFolder) {
      expect(await page.folderInformationDialog.getFolderSizeNumber()).toBeGreaterThan(0);
    }
    expect(await page.folderInformationDialog.folderLocation.textContent()).toContain(location);
    expect(await page.folderInformationDialog.folderCreationDate.textContent()).toContain('ago');
    expect(await page.folderInformationDialog.folderModifiedDate.textContent()).toContain('ago');
    await page.folderInformationDialog.doneButton.click();
    await page.folderInformationDialog.folderName.waitFor({ state: 'hidden' });
  }

  test('[XAT-17722] Folder information Empty folder size and number of documents as 0', async ({ personalFiles }) => {
    await personalFiles.navigate();
    await checkFolderInformation(personalFiles, emptyFolder, '0', '0 Bytes', `/Company Home/User Homes/${username}`, 'isEmpty');
  });

  test('[XAT-17715] Folder information correct folder size and number of documents - single file', async ({ personalFiles }) => {
    await personalFiles.navigate();
    await checkFolderInformation(personalFiles, folder1File, '1', '13.55 KB', `/Company Home/User Homes/${username}`);
  });

  test('[XAT-17752] Folder information correct folder size and number of documents - multiple files', async ({ personalFiles }) => {
    await personalFiles.navigate();
    await checkFolderInformation(personalFiles, folderXFiles, '3', '40.66 KB', `/Company Home/User Homes/${username}`);
  });

  test('[XAT-17753] Folder information correct folder size and number of documents - folder and files', async ({ personalFiles }) => {
    await personalFiles.navigate();
    await checkFolderInformation(personalFiles, folderXFilesAndFolders, '5', '67.76 KB', `/Company Home/User Homes/${username}`);
  });

  test('[XAT-17758] Folder information correct folder size and number of documents - from libraries', async ({ myLibrariesPage }) => {
    await myLibrariesPage.navigate();
    await myLibrariesPage.dataTable.getRowByName(libraryForFolder).dblclick();
    await checkFolderInformation(myLibrariesPage, folderInLibrary, '1', '13.55 KB', `/Company Home/Sites/${libraryForFolder}/documentLibrary`);
  });

  test('[XAT-17759] Folder information correct folder size and number of documents - from search', async ({ personalFiles, searchPage }) => {
    await personalFiles.navigate();
    await searchPage.searchWithin(folderForSearch, 'folders');
    await checkFolderInformation(searchPage, folderForSearch, '2', '27.1 KB', `/Company Home/User Homes/${username}`);
  });

  test('[XAT-17766] Folder information correct folder size and number of documents - nested folders', async ({ personalFiles }) => {
    await personalFiles.navigate();
    await personalFiles.dataTable.getRowByName(folderNested1).dblclick();
    await personalFiles.dataTable.getRowByName(folderNested2).dblclick();
    await checkFolderInformation(
      personalFiles,
      folderNested3,
      '1',
      '13.55 KB',
      `/Company Home/User Homes/${username}/${folderNested1}/${folderNested2}`
    );
  });
});
