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

import { expect } from '@playwright/test';
import {
  ApiClientFactory,
  Utils,
  test,
  TrashcanApi,
  NodesApi,
  TEST_FILES,
  FileActionsApi,
  PersonalFilesPage,
  SearchPage
} from '@alfresco/playwright-shared';

test.describe('Upload new version', () => {
  const username = `user-${Utils.random()}`;

  const file1 = `file1-${Utils.random()}.docx`;
  let file1Id: string;
  const fileLocked1 = `file-locked1-${Utils.random()}.docx`;
  let fileLocked1Id: string;
  const fileLocked2 = `file-locked2-${Utils.random()}.docx`;
  let fileLocked2Id: string;

  const searchRandom = Utils.random();
  const fileSearch2 = `search-${searchRandom}-file2.docx`;
  let fileSearch2Id: string;
  const fileSearch3 = `search-${searchRandom}-file3.docx`;
  let fileSearch3Id: string;

  const parentPF = `parentPersonal-${Utils.random()}`;
  let parentPFId: string;
  const parentSearch = `parentSearch-${Utils.random()}`;
  let parentSearchId: string;
  const parentUnsupported = `parentUnsupported-${Utils.random()}`;
  let parentUnsupportedId: string;
  let filePdfID: string;
  let fileJpgID: string;

  const file = TEST_FILES.PDF.name;
  const fileToUpload1 = TEST_FILES.DOCX2.name;
  const fileToUpload2 = TEST_FILES.XLSX;

  let trashcanApi: TrashcanApi;
  let nodesApi: NodesApi;
  let fileActionAPI: FileActionsApi;

  async function uploadNewVersion(page: PersonalFilesPage | SearchPage, filename: string, location: string) {
    await page.dataTable.selectItems(filename);
    await page.acaHeader.clickMoreActions();
    await page.acaHeader.matMenu.clickMenuItem('Upload New Version');
    await page.acaHeader.uploadNewVersionButton.setInputFiles(location);
  }

  async function previewUnsupportedFile(page: PersonalFilesPage, unsupportedFileName: string): Promise<void> {
    await page.dataTable.performClickFolderOrFileToOpen(unsupportedFileName);
    await page.viewer.checkUnknownFormatIsDisplayed();
    expect(await page.viewer.getUnknownFormatMessage()).toContain(`Couldn't load preview. Unsupported file type`);
    await page.viewer.closeButtonLocator.click();
  }

  test.beforeAll(async () => {
    const apiClientFactory = new ApiClientFactory();
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
    trashcanApi = await TrashcanApi.initialize(username, username);
    nodesApi = await NodesApi.initialize(username, username);
    fileActionAPI = await FileActionsApi.initialize(username, username);
    parentPFId = (await nodesApi.createFolder(parentPF)).entry.id;
    parentSearchId = (await nodesApi.createFolder(parentSearch)).entry.id;
    parentUnsupportedId = (await nodesApi.createFolder(parentUnsupported)).entry.id;
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test.describe('on Search Results', () => {
    test.beforeAll(async () => {
      await fileActionAPI.uploadFile(TEST_FILES.PDF.path, file, parentSearchId);
      fileSearch2Id = (await nodesApi.createFile(fileSearch2, parentSearchId)).entry.id;
      fileSearch3Id = (await nodesApi.createFile(fileSearch3, parentSearchId)).entry.id;
      await fileActionAPI.waitForNodes(file, { expect: 1 });
    });

    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    });

    test('[C307005] file is updated after uploading a new version - minor', async ({ searchPage }) => {
      await searchPage.searchWithin(fileSearch2, 'files');
      await uploadNewVersion(searchPage, fileSearch2, fileToUpload2.path);

      await searchPage.uploadNewVersionDialog.description.fill('new minor version description');
      await searchPage.uploadNewVersionDialog.uploadButton.click();
      await searchPage.uploadNewVersionDialog.cancelButton.waitFor({ state: 'detached' });

      expect(await nodesApi.getNodeProperty(fileSearch2Id, 'cm:versionLabel'), 'File has incorrect version label').toEqual('1.1');
      expect(await nodesApi.getNodeProperty(fileSearch2Id, 'cm:versionType'), 'File has incorrect version type').toEqual('MINOR');
    });

    test('[C307006] file is not updated when clicking Cancel', async ({ searchPage }) => {
      await searchPage.searchWithin(fileSearch3, 'files');
      await uploadNewVersion(searchPage, fileSearch3, TEST_FILES.DOCX2.path);

      await searchPage.uploadNewVersionDialog.description.fill('new version description');
      await searchPage.uploadNewVersionDialog.cancelButton.click();

      expect(await searchPage.dataTable.isItemPresent(fileSearch3)).toBe(true);
      expect(await nodesApi.getNodeProperty(fileSearch3Id, 'cm:versionLabel'), 'File has incorrect version label').toEqual('1.0');
      expect(await nodesApi.getNodeProperty(fileSearch3Id, 'cm:versionType'), 'File has incorrect version type').toEqual('MAJOR');
    });
  });

  test.describe('on Personal Files', () => {
    test.beforeAll(async () => {
      await fileActionAPI.uploadFile(TEST_FILES.PDF.path, `${TEST_FILES.PDF.name}.${TEST_FILES.PDF.extension}`, parentPFId);
      file1Id = (await nodesApi.createFile(file1, parentPFId)).entry.id;
      fileLocked1Id = (await nodesApi.createFile(fileToUpload1, parentPFId)).entry.id;
      fileLocked2Id = (await nodesApi.createFile(fileLocked2, parentPFId)).entry.id;

      await nodesApi.lockNodes([fileLocked1Id, fileLocked2Id]);
    });

    test.beforeEach(async ({ loginPage, personalFiles }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await personalFiles.dataTable.performClickFolderOrFileToOpen(parentPF);
    });

    test('[C297548] upload new version fails when new file name already exists', async ({ personalFiles }) => {
      await uploadNewVersion(personalFiles, file1, TEST_FILES.PDF.path);

      await expect(personalFiles.uploadNewVersionDialog.title).toHaveText('Upload New Version');
      await personalFiles.uploadNewVersionDialog.description.fill('new version description');
      await personalFiles.uploadNewVersionDialog.uploadButton.click();

      const message = await personalFiles.snackBar.message.innerText();
      expect(message).toContain('New version not uploaded, another file with the same name already exists');
      expect(await personalFiles.dataTable.isItemPresent(file1)).toBe(true);
      expect(await nodesApi.getNodeProperty(file1Id, 'cm:versionLabel')).toEqual('1.0');
      expect(await nodesApi.getNodeProperty(file1Id, 'cm:versionType')).toEqual('MAJOR');
    });

    test('[C297549] file is unlocked after uploading a new version', async ({ personalFiles }) => {
      await uploadNewVersion(personalFiles, fileToUpload1, TEST_FILES.DOCX2.path);

      await personalFiles.uploadNewVersionDialog.description.fill('new version description');
      await personalFiles.uploadNewVersionDialog.uploadButton.click();

      expect(await personalFiles.dataTable.isItemPresent(fileToUpload1), 'File was not updated').toBe(true);
      expect(await nodesApi.getNodeProperty(fileLocked1Id, 'cm:lockType'), `${fileLocked1} is still locked`).not.toEqual('WRITE_LOCK');
      expect(await nodesApi.getNodeProperty(fileLocked1Id, 'cm:versionType'), 'File has incorrect version type').toEqual('MINOR');
      expect(await nodesApi.getNodeProperty(fileLocked1Id, 'cm:versionLabel'), 'File has incorrect version label').toEqual('1.1');
    });

    test('[C297550] file remains locked after canceling of uploading a new version', async ({ personalFiles }) => {
      await uploadNewVersion(personalFiles, fileLocked2, TEST_FILES.DOCX2.path);
      await personalFiles.uploadNewVersionDialog.cancelButton.click();

      expect(await personalFiles.dataTable.isItemPresent(fileLocked2), 'File not displayed').toBe(true);
      expect(await nodesApi.getNodeProperty(fileLocked2Id, 'cm:lockType'), `${fileLocked2} was unlocked`).toEqual('WRITE_LOCK');
    });
  });

  test.describe('Viewer - version update with unsupported file', () => {
    test.beforeAll(async () => {
      filePdfID = (await fileActionAPI.uploadFile(TEST_FILES.PDF.path, TEST_FILES.PDF.name, parentUnsupportedId)).entry.id;
      fileJpgID = (await fileActionAPI.uploadFile(TEST_FILES.JPG_FILE.path, TEST_FILES.JPG_FILE.name, parentUnsupportedId)).entry.id;
    });

    test.beforeEach(async ({ loginPage, personalFiles }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await personalFiles.dataTable.performClickFolderOrFileToOpen(parentUnsupported);
    });

    test('[C587084] Should display unknown format the preview for an unsupported file', async ({ personalFiles }) => {
      await uploadNewVersion(personalFiles, TEST_FILES.JPG_FILE.name, TEST_FILES.FILE_UNSUPPORTED.path);
      await personalFiles.uploadNewVersionDialog.uploadButton.click();
      await previewUnsupportedFile(personalFiles, TEST_FILES.FILE_UNSUPPORTED.name);
      await nodesApi.deleteNodes([fileJpgID], true);

      await personalFiles.page.reload({ waitUntil: 'load' });

      await uploadNewVersion(personalFiles, TEST_FILES.PDF.name, TEST_FILES.FILE_UNSUPPORTED.path);
      await personalFiles.uploadNewVersionDialog.uploadButton.click();
      await previewUnsupportedFile(personalFiles, TEST_FILES.FILE_UNSUPPORTED.name);
      await nodesApi.deleteNodes([filePdfID], true);
    });
  });
});
