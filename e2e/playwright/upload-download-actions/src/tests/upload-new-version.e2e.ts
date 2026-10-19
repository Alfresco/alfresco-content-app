/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { basename } from 'path';
import {
  ApiClientFactory,
  Utils,
  test,
  TrashcanApi,
  NodesApi,
  TEST_FILES,
  UploadApi,
  SearchApi,
  PersonalFilesPage,
  SearchPage,
  timeouts
} from '@alfresco/aca-playwright-shared';

test.describe('Upload new version', () => {
  const username = `user-${Date.now()}-${Utils.random()}`;

  let trashcanApi: TrashcanApi;
  let nodesApi: NodesApi;
  let uploadApi: UploadApi;
  let searchApi: SearchApi;

  async function uploadNewVersion(page: PersonalFilesPage | SearchPage, filename: string, location: string) {
    await page.dataTable.selectItems(filename);
    await page.acaHeader.clickMoreActions();
    const [fileChooser] = await Promise.all([
      page.page.waitForEvent('filechooser', { timeout: timeouts.extraLarge }),
      page.acaHeader.matMenu.clickMenuItem('Upload New Version')
    ]);
    await fileChooser.setFiles(location);
  }

  async function previewUnsupportedFile(page: PersonalFilesPage, unsupportedFileName: string): Promise<void> {
    await page.dataTable.performClickFolderOrFileToOpen(unsupportedFileName);
    await page.viewer.checkUnknownFormatIsDisplayed();
    expect(await page.viewer.getUnknownFormatMessage()).toContain(`Couldn't load preview. Unsupported file type`);
    await page.viewer.closeButton.click();
  }

  test.beforeAll(async () => {
    const apiClientFactory = new ApiClientFactory();
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
    trashcanApi = await TrashcanApi.initialize(username, username);
    nodesApi = await NodesApi.initialize(username, username);
    uploadApi = await UploadApi.initialize(username, username);
    searchApi = await SearchApi.initialize(username, username);
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test.describe('on Search Results', () => {
    const parentSearch = `parentSearch-${Utils.random()}`;
    const searchPhrase = Utils.random();
    const fileSearch5353 = `${searchPhrase}-${Utils.random()}`;
    const fileSearch5354 = `${searchPhrase}-${Utils.random()}`;
    const fileNewVersion5353 = TEST_FILES.JPG_FILE;

    let parentSearchId: string;
    let fileSearch5353Id: string;
    let fileSearch5354Id: string;

    test.beforeAll(async () => {
      parentSearchId = (await nodesApi.createFolder(parentSearch)).entry.id;
      fileSearch5353Id = (await nodesApi.createFile(fileSearch5353, parentSearchId, '', '', '', true, ['cm:versionable'])).entry.id;
      fileSearch5354Id = (await nodesApi.createFile(fileSearch5354, parentSearchId, '', '', '', true, ['cm:versionable'])).entry.id;
      await searchApi.waitForNodes(searchPhrase, { expect: 2 });
    });

    test('[XAT-5353] file is updated after uploading a new version - minor', async ({ searchPage }) => {
      await searchPage.searchWithin(fileSearch5353, 'files');
      await uploadNewVersion(searchPage, fileSearch5353, fileNewVersion5353.path);

      await searchPage.uploadNewVersionDialog.description.fill('new minor version description');
      await searchPage.uploadNewVersionDialog.uploadButton.click();
      await searchPage.uploadNewVersionDialog.cancelButton.waitFor({ state: 'detached' });

      expect(await nodesApi.getNodeProperty(fileSearch5353Id, 'cm:versionLabel'), 'File has incorrect version label').toEqual('1.1');
      expect(await nodesApi.getNodeProperty(fileSearch5353Id, 'cm:versionType'), 'File has incorrect version type').toEqual('MINOR');
    });

    test('[XAT-5354] file is not updated when clicking Cancel', async ({ searchPage }) => {
      await searchPage.searchWithin(fileSearch5354, 'files');
      await uploadNewVersion(searchPage, fileSearch5354, TEST_FILES.DOCX2.path);

      await searchPage.uploadNewVersionDialog.description.fill('new version description');
      await searchPage.uploadNewVersionDialog.cancelButton.click();

      expect(await searchPage.dataTable.isItemPresent(fileSearch5354)).toBe(true);
      expect(await nodesApi.getNodeProperty(fileSearch5354Id, 'cm:versionLabel'), 'File has incorrect version label').toEqual('1.0');
      expect(await nodesApi.getNodeProperty(fileSearch5354Id, 'cm:versionType'), 'File has incorrect version type').toEqual('MAJOR');
    });
  });

  test.describe('on Personal Files', () => {
    const parentPF = `parentPersonal-${Utils.random()}`;
    const file5327 = `file5327-${Utils.random()}.txt`;
    const fileLocked5328 = `file-locked-5328-${Utils.random()}`;
    const fileLocked5329 = `file-locked-5329-${Utils.random()}`;
    const conflictingName5327 = basename(TEST_FILES.DOCX.path);

    let parentPFId: string;
    let file5327Id: string;
    let fileLocked5328Id: string;
    let fileLocked5329Id: string;

    test.beforeAll(async () => {
      parentPFId = (await nodesApi.createFolder(parentPF)).entry.id;
      await uploadApi.uploadFileWithRename(TEST_FILES.DOCX.path, conflictingName5327, parentPFId);
      file5327Id = (await nodesApi.createFile(file5327, parentPFId, '', '', '', true, ['cm:versionable'])).entry.id;
      fileLocked5328Id = (await nodesApi.createFile(fileLocked5328, parentPFId, '', '', '', true, ['cm:versionable'])).entry.id;
      fileLocked5329Id = (await nodesApi.createFile(fileLocked5329, parentPFId, '', '', '', true, ['cm:versionable'])).entry.id;

      await nodesApi.checkoutNodes([fileLocked5328Id, fileLocked5329Id]);
    });

    test.beforeEach(async ({ personalFiles }) => {
      await personalFiles.dataTable.performClickFolderOrFileToOpen(parentPF);
    });

    test('[XAT-5327] upload new version fails when new file name already exists', async ({ personalFiles }) => {
      await uploadNewVersion(personalFiles, file5327, TEST_FILES.DOCX.path);

      await expect(personalFiles.uploadNewVersionDialog.title).toHaveText('Upload New Version');
      await personalFiles.uploadNewVersionDialog.description.fill('new version description');
      await personalFiles.uploadNewVersionDialog.uploadButton.click();

      const message = await personalFiles.snackBar.message.innerText();
      expect(message).toContain('New version not uploaded, another file with the same name already exists');
      expect(await personalFiles.dataTable.isItemPresent(file5327)).toBe(true);
      expect(await nodesApi.getNodeProperty(file5327Id, 'cm:versionLabel')).toEqual('1.0');
      expect(await nodesApi.getNodeProperty(file5327Id, 'cm:versionType')).toEqual('MAJOR');
    });

    test('[XAT-5328] file is unlocked after uploading a new version', async ({ personalFiles }) => {
      await uploadNewVersion(personalFiles, fileLocked5328, TEST_FILES.DOCX2.path);

      await personalFiles.uploadNewVersionDialog.description.fill('new version description');
      await personalFiles.uploadNewVersionDialog.uploadButton.click();

      expect(await personalFiles.dataTable.isItemPresent(fileLocked5328), 'File was not updated').toBe(true);
      expect(await nodesApi.getNodeProperty(fileLocked5328Id, 'cm:lockType'), `${fileLocked5328} is still locked`).not.toEqual('WRITE_LOCK');
      expect(await nodesApi.getNodeProperty(fileLocked5328Id, 'cm:versionType'), 'File has incorrect version type').toEqual('MINOR');
      expect(await nodesApi.getNodeProperty(fileLocked5328Id, 'cm:versionLabel'), 'File has incorrect version label').toEqual('1.1');
    });

    test('[XAT-5329] file remains locked after canceling of uploading a new version', async ({ personalFiles }) => {
      await uploadNewVersion(personalFiles, fileLocked5329, TEST_FILES.DOCX2.path);
      await personalFiles.uploadNewVersionDialog.cancelButton.click();

      expect(await personalFiles.dataTable.isItemPresent(fileLocked5329), 'File not displayed').toBe(true);
      expect(await nodesApi.getNodeProperty(fileLocked5329Id, 'cm:lockType'), `${fileLocked5329} was unlocked`).toEqual('READ_ONLY_LOCK');
    });
  });

  test.describe('Viewer - version update with unsupported file', () => {
    const parentUnsupported = `parentUnsupported-${Utils.random()}`;
    const fileJpg17776 = `file-jpg-17776-${Utils.random()}.jpg`;
    const fileDocx17776 = `file-docx-17776-${Utils.random()}.docx`;
    const unsupportedName17776 = basename(TEST_FILES.AZW3_FILE.path);

    let parentUnsupportedId: string;
    let fileJpg17776Id: string;

    test.beforeAll(async () => {
      parentUnsupportedId = (await nodesApi.createFolder(parentUnsupported)).entry.id;
      fileJpg17776Id = (await uploadApi.uploadFileWithRename(TEST_FILES.JPG_FILE.path, fileJpg17776, parentUnsupportedId)).entry.id;
      await uploadApi.uploadFileWithRename(TEST_FILES.DOCX.path, fileDocx17776, parentUnsupportedId);
    });

    test.beforeEach(async ({ personalFiles }) => {
      await personalFiles.dataTable.performClickFolderOrFileToOpen(parentUnsupported);
    });

    test('[XAT-17776] Should display the unknown format preview for an unsupported file in the viewer', async ({ personalFiles }) => {
      await uploadNewVersion(personalFiles, fileJpg17776, TEST_FILES.AZW3_FILE.path);
      await personalFiles.uploadNewVersionDialog.uploadButton.click();
      await previewUnsupportedFile(personalFiles, unsupportedName17776);
      await nodesApi.deleteNodes([fileJpg17776Id], true);
    });
  });
});
