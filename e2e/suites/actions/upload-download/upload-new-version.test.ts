/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import {
  AdminActions,
  LoginPage,
  BrowsingPage,
  SearchResultsPage,
  FILES,
  RepoClient,
  Utils,
  UploadNewVersionDialog
} from '@alfresco/aca-testing-shared';

describe('Upload new version', () => {
  const username = `user-${Utils.random()}`;

  const file1 = `file1-${Utils.random()}.docx`;
  let file1Id: string;
  const file2 = `file2-${Utils.random()}.docx`;
  let file2Id: string;
  const file3 = `file3-${Utils.random()}.docx`;
  let file3Id: string;
  const file4 = `file4-${Utils.random()}.docx`;
  let file4Id: string;
  const fileLocked1 = `file-locked1-${Utils.random()}.docx`;
  let fileLocked1Id: string;
  const fileLocked2 = `file-locked2-${Utils.random()}.docx`;
  let fileLocked2Id: string;

  const searchRandom = Utils.random();
  const fileSearch1 = `search-${searchRandom}-file1.docx`;
  let fileSearch1Id: string;
  const fileSearch2 = `search-${searchRandom}-file2.docx`;
  let fileSearch2Id: string;
  const fileSearch3 = `search-${searchRandom}-file3.docx`;
  let fileSearch3Id: string;
  const fileSearch4 = `search-${searchRandom}-file4.docx`;
  let fileSearch4Id: string;
  const fileLockedSearch1 = `search-${searchRandom}-file-locked1.docx`;
  let fileLockedSearch1Id: string;
  const fileLockedSearch2 = `search-${searchRandom}-file-locked2.docx`;
  let fileLockedSearch2Id: string;

  const parentPF = `parentPersonal-${Utils.random()}`;
  let parentPFId: string;
  const parentSF = `parentShared-${Utils.random()}`;
  let parentSFId: string;
  const parentRF = `parentRecent-${Utils.random()}`;
  let parentRFId: string;
  const parentFav = `parentFav-${Utils.random()}`;
  let parentFavId: string;
  const parentSearch = `parentSearch-${Utils.random()}`;
  let parentSearchId: string;

  const nameConflictMessage = 'New version not uploaded, another file with the same name already exists';

  const file = FILES.pdfFile;
  let fileId: string;
  const fileToUpload1 = FILES.docxFile;
  const fileToUpload2 = FILES.xlsxFile;
  const fileToUpload3 = FILES.pdfFile;
  const fileToUpload4 = FILES.docxFile2;
  const fileToUpload5 = FILES.xlsxFile2;

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const searchResultsPage = new SearchResultsPage();
  const { dataTable, toolbar } = page;
  const uploadNewVersionDialog = new UploadNewVersionDialog();
  const { searchInput } = page.header;
  const adminApiActions = new AdminActions();

  beforeAll(async () => {
    await adminApiActions.createUser({ username });

    parentPFId = (await apis.user.nodes.createFolder(parentPF)).entry.id;
    parentSFId = (await apis.user.nodes.createFolder(parentSF)).entry.id;
    parentRFId = (await apis.user.nodes.createFolder(parentRF)).entry.id;
    parentFavId = (await apis.user.nodes.createFolder(parentFav)).entry.id;
    parentSearchId = (await apis.user.nodes.createFolder(parentSearch)).entry.id;
  });

  afterAll(async () => {
    await apis.user.nodes.deleteNodeById(parentPFId);
    await apis.user.nodes.deleteNodeById(parentSFId);
    await apis.user.nodes.deleteNodeById(parentRFId);
    await apis.user.nodes.deleteNodeById(parentFavId);
    await apis.user.nodes.deleteNodeById(parentSearchId);
  });

  describe('on Search Results', () => {
    beforeAll(async (done) => {
      fileId = (await apis.user.upload.uploadFile(file, parentSearchId)).entry.id;
      fileSearch1Id = (await apis.user.nodes.createFile(fileSearch1, parentSearchId)).entry.id;
      fileSearch2Id = (await apis.user.nodes.createFile(fileSearch2, parentSearchId)).entry.id;
      fileSearch3Id = (await apis.user.nodes.createFile(fileSearch3, parentSearchId)).entry.id;
      fileSearch4Id = (await apis.user.nodes.createFile(fileSearch4, parentSearchId)).entry.id;

      fileLockedSearch1Id = (await apis.user.nodes.createFile(fileLockedSearch1, parentSearchId)).entry.id;
      fileLockedSearch2Id = (await apis.user.nodes.createFile(fileLockedSearch2, parentSearchId)).entry.id;

      await apis.user.nodes.lockFile(fileLockedSearch1Id);
      await apis.user.nodes.lockFile(fileLockedSearch2Id);

      await apis.user.search.waitForNodes(searchRandom, { expect: 6 });

      await loginPage.loginWith(username);
      done();
    });

    afterEach(async () => {
      await Utils.pressEscape();
      await page.header.expandSideNav();
      await page.clickPersonalFilesAndWait();
    });

    it('[C307003] dialog UI defaults', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchFor(file);
      await searchResultsPage.waitForResults();
      await dataTable.selectItem(file, parentSearch);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload1);
      await page.waitForDialog();

      expect(await uploadNewVersionDialog.getDialogTitle()).toEqual('Upload New Version');
      expect(await uploadNewVersionDialog.description.isDisplayed()).toBe(true, 'Description not displayed');
      expect(await uploadNewVersionDialog.minorOption.isDisplayed()).toBe(true, 'Minor option not displayed');
      expect(await uploadNewVersionDialog.majorOption.isDisplayed()).toBe(true, 'Major option not displayed');
      expect(await uploadNewVersionDialog.isCancelButtonEnabled()).toBe(true, 'Cancel button not enabled');
      expect(await uploadNewVersionDialog.isUploadButtonEnabled()).toBe(true, 'Update button not enabled');
    });

    it('[C307004] file is updated after uploading a new version - major', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchFor(fileSearch1);
      await dataTable.waitForBody();
      await dataTable.selectItem(fileSearch1, parentSearch);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload1);
      await page.waitForDialog();

      await uploadNewVersionDialog.majorOption.click();
      await uploadNewVersionDialog.enterDescription('new major version description');
      await uploadNewVersionDialog.uploadButton.click();
      await uploadNewVersionDialog.waitForDialogToClose();

      // TODO: enable when ACA-2329 is fixed
      // expect(await dataTable.isItemPresent(fileToUpload1, parentSearch)).toBe(true, 'File not updated');
      expect(await apis.user.nodes.getFileVersionType(fileSearch1Id)).toEqual('MAJOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(fileSearch1Id)).toEqual('2.0', 'File has incorrect version label');
    });

    it('[C307005] file is updated after uploading a new version - minor', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchFor(fileSearch2);
      await dataTable.waitForBody();
      await dataTable.selectItem(fileSearch2, parentSearch);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload2);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new minor version description');
      await uploadNewVersionDialog.uploadButton.click();
      await uploadNewVersionDialog.waitForDialogToClose();

      // TODO: enable when ACA-2329 is fixed
      // expect(await dataTable.isItemPresent(fileToUpload2, parentSearch)).toBe(true, 'File not updated');
      expect(await apis.user.nodes.getFileVersionType(fileSearch2Id)).toEqual('MINOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(fileSearch2Id)).toEqual('1.1', 'File has incorrect version label');
    });

    it('[C307006] file is not updated when clicking Cancel', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchFor(fileSearch3);
      await dataTable.waitForBody();
      await dataTable.selectItem(fileSearch3, parentSearch);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload3);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new version description');
      await uploadNewVersionDialog.clickCancel();

      expect(await dataTable.isItemPresent(fileSearch3, parentSearch)).toBe(true, 'File was updated');
      expect(await apis.user.nodes.getFileVersionType(fileSearch3Id)).toEqual('MAJOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(fileSearch3Id)).toEqual('1.0', 'File has incorrect version label');
    });

    it('[C307007] upload new version fails when new file name already exists', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchFor(fileSearch4);
      await dataTable.waitForBody();
      await dataTable.selectItem(fileSearch4, parentSearch);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(file);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new version description');
      await uploadNewVersionDialog.uploadButton.click();

      const message = await page.getSnackBarMessage();
      expect(message).toContain(nameConflictMessage);

      expect(await dataTable.isItemPresent(fileSearch4, parentSearch)).toBe(true, 'File was updated');
      expect(await apis.user.nodes.getFileVersionType(fileSearch4Id)).toEqual('MAJOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(fileSearch4Id)).toEqual('1.0', 'File has incorrect version label');
    });

    it('[C307008] file is unlocked after uploading a new version', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchFor(fileLockedSearch1);
      await dataTable.waitForBody();
      await dataTable.selectItem(fileLockedSearch1, parentSearch);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload4);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new version description');
      await uploadNewVersionDialog.uploadButton.click();
      await uploadNewVersionDialog.waitForDialogToClose();

      // TODO: enable when ACA-2329 is fixed
      // expect(await dataTable.isItemPresent(fileToUpload4, parentSearch)).toBe(true, 'File name was not changed');
      expect(await apis.user.nodes.isFileLockedWrite(fileLockedSearch1Id)).toBe(false, `${fileLockedSearch1} is still locked`);
      expect(await apis.user.nodes.getFileVersionType(fileLockedSearch1Id)).toEqual('MINOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(fileLockedSearch1Id)).toEqual('1.1', 'File has incorrect version label');
    });

    it('[C307009] file remains locked after canceling of uploading a new version', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchFor(fileLockedSearch2);
      await dataTable.waitForBody();
      await dataTable.selectItem(fileLockedSearch2, parentSearch);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload5);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new version description');
      await uploadNewVersionDialog.clickCancel();

      expect(await dataTable.isItemPresent(fileToUpload5, parentSearch)).toBe(false, 'File was updated');
      expect(await dataTable.isItemPresent(fileLockedSearch2, parentSearch)).toBe(true, 'File not displayed');
      expect(await apis.user.nodes.isFileLockedWrite(fileLockedSearch2Id)).toBe(true, `${fileLockedSearch2} was unlocked`);
    });
  });

  describe('on Personal Files', () => {
    beforeAll(async (done) => {
      fileId = (await apis.user.upload.uploadFile(file, parentPFId)).entry.id;
      file1Id = (await apis.user.nodes.createFile(file1, parentPFId)).entry.id;
      file2Id = (await apis.user.nodes.createFile(file2, parentPFId)).entry.id;
      file3Id = (await apis.user.nodes.createFile(file3, parentPFId)).entry.id;
      file4Id = (await apis.user.nodes.createFile(file4, parentPFId)).entry.id;

      fileLocked1Id = (await apis.user.nodes.createFile(fileLocked1, parentPFId)).entry.id;
      fileLocked2Id = (await apis.user.nodes.createFile(fileLocked2, parentPFId)).entry.id;

      await apis.user.nodes.lockFile(fileLocked1Id);
      await apis.user.nodes.lockFile(fileLocked2Id);

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parentPF);
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      await page.refresh();
      done();
    });

    it('[C297544] dialog UI defaults', async () => {
      await dataTable.selectItem(file);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload1);
      await page.waitForDialog();

      expect(await uploadNewVersionDialog.getDialogTitle()).toEqual('Upload New Version');
      expect(await uploadNewVersionDialog.description.isDisplayed()).toBe(true, 'Description not displayed');
      expect(await uploadNewVersionDialog.minorOption.isDisplayed()).toBe(true, 'Minor option not displayed');
      expect(await uploadNewVersionDialog.majorOption.isDisplayed()).toBe(true, 'Major option not displayed');
      expect(await uploadNewVersionDialog.isCancelButtonEnabled()).toBe(true, 'Cancel button not enabled');
      expect(await uploadNewVersionDialog.isUploadButtonEnabled()).toBe(true, 'Update button not enabled');
    });

    it('[C297545] file is updated after uploading a new version - major', async () => {
      await dataTable.selectItem(file1);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload1);
      await page.waitForDialog();

      await uploadNewVersionDialog.majorOption.click();
      await uploadNewVersionDialog.enterDescription('new major version description');
      await uploadNewVersionDialog.uploadButton.click();
      await uploadNewVersionDialog.waitForDialogToClose();

      expect(await dataTable.isItemPresent(fileToUpload1)).toBe(true, 'File not updated');
      expect(await apis.user.nodes.getFileVersionType(file1Id)).toEqual('MAJOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(file1Id)).toEqual('2.0', 'File has incorrect version label');
    });

    it('[C297546] file is updated after uploading a new version - minor', async () => {
      await dataTable.selectItem(file2);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload2);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new minor version description');
      await uploadNewVersionDialog.uploadButton.click();
      await uploadNewVersionDialog.waitForDialogToClose();

      expect(await dataTable.isItemPresent(fileToUpload2)).toBe(true, 'File not updated');
      expect(await apis.user.nodes.getFileVersionType(file2Id)).toEqual('MINOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(file2Id)).toEqual('1.1', 'File has incorrect version label');
    });

    it('[C297547] file is not updated when clicking Cancel', async () => {
      await dataTable.selectItem(file3);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload3);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new version description');
      await uploadNewVersionDialog.clickCancel();

      expect(await dataTable.isItemPresent(file3)).toBe(true, 'File was updated');
      expect(await apis.user.nodes.getFileVersionType(file3Id)).toEqual('MAJOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(file3Id)).toEqual('1.0', 'File has incorrect version label');
    });

    it('[C297548] upload new version fails when new file name already exists', async () => {
      await dataTable.selectItem(file4);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(file);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new version description');
      await uploadNewVersionDialog.uploadButton.click();

      const message = await page.getSnackBarMessage();
      expect(message).toContain(nameConflictMessage);

      expect(await dataTable.isItemPresent(file4)).toBe(true, 'File was updated');
      expect(await apis.user.nodes.getFileVersionType(file4Id)).toEqual('MAJOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(file4Id)).toEqual('1.0', 'File has incorrect version label');
    });

    it('[C297549] file is unlocked after uploading a new version', async () => {
      await dataTable.selectItem(fileLocked1);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload4);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new version description');
      await uploadNewVersionDialog.uploadButton.click();
      await uploadNewVersionDialog.waitForDialogToClose();

      expect(await dataTable.isItemPresent(fileToUpload4)).toBe(true, 'File name was not changed');
      expect(await apis.user.nodes.isFileLockedWrite(fileLocked1Id)).toBe(false, `${fileLocked1} is still locked`);
      expect(await apis.user.nodes.getFileVersionType(fileLocked1Id)).toEqual('MINOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(fileLocked1Id)).toEqual('1.1', 'File has incorrect version label');
    });

    it('[C297550] file remains locked after canceling of uploading a new version', async () => {
      await dataTable.selectItem(fileLocked2);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload5);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new version description');
      await uploadNewVersionDialog.clickCancel();

      expect(await dataTable.isItemPresent(fileToUpload5)).toBe(false, 'File was updated');
      expect(await dataTable.isItemPresent(fileLocked2)).toBe(true, 'File not displayed');
      expect(await apis.user.nodes.isFileLockedWrite(fileLocked2Id)).toBe(true, `${fileLocked2} was unlocked`);
    });
  });

  describe('on Shared Files', () => {
    beforeAll(async (done) => {
      fileId = (await apis.user.upload.uploadFile(file, parentSFId)).entry.id;
      file1Id = (await apis.user.nodes.createFile(file1, parentSFId)).entry.id;
      file2Id = (await apis.user.nodes.createFile(file2, parentSFId)).entry.id;
      file3Id = (await apis.user.nodes.createFile(file3, parentSFId)).entry.id;
      file4Id = (await apis.user.nodes.createFile(file4, parentSFId)).entry.id;

      fileLocked1Id = (await apis.user.nodes.createFile(fileLocked1, parentSFId)).entry.id;
      fileLocked2Id = (await apis.user.nodes.createFile(fileLocked2, parentSFId)).entry.id;

      await apis.user.nodes.lockFile(fileLocked1Id);
      await apis.user.nodes.lockFile(fileLocked2Id);

      await apis.user.shared.shareFilesByIds([fileId, file1Id, file2Id, file3Id, file4Id, fileLocked1Id, fileLocked2Id]);
      await apis.user.shared.waitForFilesToBeShared([fileId, file1Id, file2Id, file3Id, file4Id, fileLocked1Id, fileLocked2Id]);

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async () => {
      await page.clickSharedFilesAndWait();
    });

    afterEach(async () => {
      await page.refresh();
    });

    it('[C297551] dialog UI defaults', async () => {
      await dataTable.selectItem(file);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload1);
      await page.waitForDialog();

      expect(await uploadNewVersionDialog.getDialogTitle()).toEqual('Upload New Version');
      expect(await uploadNewVersionDialog.description.isDisplayed()).toBe(true, 'Description not displayed');
      expect(await uploadNewVersionDialog.minorOption.isDisplayed()).toBe(true, 'Minor option not displayed');
      expect(await uploadNewVersionDialog.majorOption.isDisplayed()).toBe(true, 'Major option not displayed');
      expect(await uploadNewVersionDialog.isCancelButtonEnabled()).toBe(true, 'Cancel button not enabled');
      expect(await uploadNewVersionDialog.isUploadButtonEnabled()).toBe(true, 'Update button not enabled');
    });

    it('[C297552] file is updated after uploading a new version - major', async () => {
      await dataTable.selectItem(file1);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload1);
      await page.waitForDialog();

      await uploadNewVersionDialog.majorOption.click();
      await uploadNewVersionDialog.enterDescription('new major version description');
      await uploadNewVersionDialog.uploadButton.click();
      await uploadNewVersionDialog.waitForDialogToClose();

      expect(await dataTable.isItemPresent(fileToUpload1)).toBe(true, 'File not updated');
      expect(await apis.user.nodes.getFileVersionType(file1Id)).toEqual('MAJOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(file1Id)).toEqual('2.0', 'File has incorrect version label');
    });

    it('[C297553] file is updated after uploading a new version - minor', async () => {
      await dataTable.selectItem(file2);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload2);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new minor version description');
      await uploadNewVersionDialog.uploadButton.click();
      await uploadNewVersionDialog.waitForDialogToClose();

      expect(await dataTable.isItemPresent(fileToUpload2)).toBe(true, 'File not updated');
      expect(await apis.user.nodes.getFileVersionType(file2Id)).toEqual('MINOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(file2Id)).toEqual('1.1', 'File has incorrect version label');
    });

    it('[C297554] file is not updated when clicking Cancel', async () => {
      await dataTable.selectItem(file3);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload3);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new version description');
      await uploadNewVersionDialog.clickCancel();

      expect(await dataTable.isItemPresent(file3)).toBe(true, 'File was updated');
      expect(await apis.user.nodes.getFileVersionType(file3Id)).toEqual('MAJOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(file3Id)).toEqual('1.0', 'File has incorrect version label');
    });

    it('[C297555] upload new version fails when new file name already exists', async () => {
      await dataTable.selectItem(file4);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(file);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new version description');
      await uploadNewVersionDialog.uploadButton.click();

      const message = await page.getSnackBarMessage();
      expect(message).toContain(nameConflictMessage);

      expect(await dataTable.isItemPresent(file4)).toBe(true, 'File was updated');
      expect(await apis.user.nodes.getFileVersionType(file4Id)).toEqual('MAJOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(file4Id)).toEqual('1.0', 'File has incorrect version label');
    });

    it('[C297556] file is unlocked after uploading a new version', async () => {
      await dataTable.selectItem(fileLocked1);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload4);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new version description');
      await uploadNewVersionDialog.uploadButton.click();
      await uploadNewVersionDialog.waitForDialogToClose();

      expect(await dataTable.isItemPresent(fileToUpload4)).toBe(true, 'File name was not changed');
      expect(await apis.user.nodes.isFileLockedWrite(fileLocked1Id)).toBe(false, `${fileLocked1} is still locked`);
      expect(await apis.user.nodes.getFileVersionType(fileLocked1Id)).toEqual('MINOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(fileLocked1Id)).toEqual('1.1', 'File has incorrect version label');
    });

    it('[C297557] file remains locked after canceling of uploading a new version', async () => {
      await dataTable.selectItem(fileLocked2);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload5);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new version description');
      await uploadNewVersionDialog.clickCancel();

      expect(await dataTable.isItemPresent(fileToUpload5)).toBe(false, 'File was updated');
      expect(await dataTable.isItemPresent(fileLocked2)).toBe(true, 'File not displayed');
      expect(await apis.user.nodes.isFileLockedWrite(fileLocked2Id)).toBe(true, `${fileLocked2} was unlocked`);
    });
  });

  describe('on Recent Files', () => {
    beforeAll(async (done) => {
      const initialRecentTotalItems = await apis.user.search.getTotalItems(username);
      fileId = (await apis.user.upload.uploadFile(file, parentRFId)).entry.id;
      file1Id = (await apis.user.nodes.createFile(file1, parentRFId)).entry.id;
      file2Id = (await apis.user.nodes.createFile(file2, parentRFId)).entry.id;
      file3Id = (await apis.user.nodes.createFile(file3, parentRFId)).entry.id;
      file4Id = (await apis.user.nodes.createFile(file4, parentRFId)).entry.id;

      fileLocked1Id = (await apis.user.nodes.createFile(fileLocked1, parentRFId)).entry.id;
      fileLocked2Id = (await apis.user.nodes.createFile(fileLocked2, parentRFId)).entry.id;

      await apis.user.nodes.lockFile(fileLocked1Id);
      await apis.user.nodes.lockFile(fileLocked2Id);

      await apis.user.search.waitForApi(username, { expect: initialRecentTotalItems + 7 });

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async () => {
      await page.clickRecentFilesAndWait();
    });

    afterEach(async () => {
      await page.refresh();
    });

    it('[C297558] dialog UI defaults', async () => {
      await dataTable.selectItem(file, parentRF);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload1);
      await page.waitForDialog();

      expect(await uploadNewVersionDialog.getDialogTitle()).toEqual('Upload New Version');
      expect(await uploadNewVersionDialog.description.isDisplayed()).toBe(true, 'Description not displayed');
      expect(await uploadNewVersionDialog.minorOption.isDisplayed()).toBe(true, 'Minor option not displayed');
      expect(await uploadNewVersionDialog.majorOption.isDisplayed()).toBe(true, 'Major option not displayed');
      expect(await uploadNewVersionDialog.isCancelButtonEnabled()).toBe(true, 'Cancel button not enabled');
      expect(await uploadNewVersionDialog.isUploadButtonEnabled()).toBe(true, 'Update button not enabled');
    });

    it('[C297559] file is updated after uploading a new version - major', async () => {
      await dataTable.selectItem(file1, parentRF);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload1);
      await page.waitForDialog();

      await uploadNewVersionDialog.majorOption.click();
      await uploadNewVersionDialog.enterDescription('new major version description');
      await uploadNewVersionDialog.uploadButton.click();
      await uploadNewVersionDialog.waitForDialogToClose();

      expect(await dataTable.isItemPresent(fileToUpload1, parentRF)).toBe(true, 'File not updated');
      expect(await apis.user.nodes.getFileVersionType(file1Id)).toEqual('MAJOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(file1Id)).toEqual('2.0', 'File has incorrect version label');
    });

    it('[C297560] file is updated after uploading a new version - minor', async () => {
      await dataTable.selectItem(file2, parentRF);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload2);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new minor version description');
      await uploadNewVersionDialog.uploadButton.click();
      await uploadNewVersionDialog.waitForDialogToClose();

      expect(await dataTable.isItemPresent(fileToUpload2, parentRF)).toBe(true, 'File not updated');
      expect(await apis.user.nodes.getFileVersionType(file2Id)).toEqual('MINOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(file2Id)).toEqual('1.1', 'File has incorrect version label');
    });

    it('[C297561] file is not updated when clicking Cancel', async () => {
      await dataTable.selectItem(file3, parentRF);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload3);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new version description');
      await uploadNewVersionDialog.clickCancel();

      expect(await dataTable.isItemPresent(file3, parentRF)).toBe(true, 'File was updated');
      expect(await apis.user.nodes.getFileVersionType(file3Id)).toEqual('MAJOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(file3Id)).toEqual('1.0', 'File has incorrect version label');
    });

    it('[C297562] upload new version fails when new file name already exists', async () => {
      await dataTable.selectItem(file4, parentRF);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(file);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new version description');
      await uploadNewVersionDialog.uploadButton.click();

      const message = await page.getSnackBarMessage();
      expect(message).toContain(nameConflictMessage);

      expect(await dataTable.isItemPresent(file4, parentRF)).toBe(true, 'File was updated');
      expect(await apis.user.nodes.getFileVersionType(file4Id)).toEqual('MAJOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(file4Id)).toEqual('1.0', 'File has incorrect version label');
    });

    it('[C297563] file is unlocked after uploading a new version', async () => {
      await dataTable.selectItem(fileLocked1, parentRF);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload4);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new version description');
      await uploadNewVersionDialog.uploadButton.click();
      await uploadNewVersionDialog.waitForDialogToClose();

      expect(await dataTable.isItemPresent(fileToUpload4, parentRF)).toBe(true, 'File name was not changed');
      expect(await apis.user.nodes.isFileLockedWrite(fileLocked1Id)).toBe(false, `${fileLocked1} is still locked`);
      expect(await apis.user.nodes.getFileVersionType(fileLocked1Id)).toEqual('MINOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(fileLocked1Id)).toEqual('1.1', 'File has incorrect version label');
    });

    it('[C297564] file remains locked after canceling of uploading a new version', async () => {
      await dataTable.selectItem(fileLocked2, parentRF);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload5);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new version description');
      await uploadNewVersionDialog.clickCancel();

      expect(await dataTable.isItemPresent(fileToUpload5, parentRF)).toBe(false, 'File was updated');
      expect(await dataTable.isItemPresent(fileLocked2, parentRF)).toBe(true, 'File not displayed');
      expect(await apis.user.nodes.isFileLockedWrite(fileLocked2Id)).toBe(true, `${fileLocked2} was unlocked`);
    });
  });

  describe('on Favorite Files', () => {
    beforeAll(async (done) => {
      const initialFavoritesTotalItems = await apis.user.favorites.getFavoritesTotalItems();
      fileId = (await apis.user.upload.uploadFile(file, parentFavId)).entry.id;
      file1Id = (await apis.user.nodes.createFile(file1, parentFavId)).entry.id;
      file2Id = (await apis.user.nodes.createFile(file2, parentFavId)).entry.id;
      file3Id = (await apis.user.nodes.createFile(file3, parentFavId)).entry.id;
      file4Id = (await apis.user.nodes.createFile(file4, parentFavId)).entry.id;

      fileLocked1Id = (await apis.user.nodes.createFile(fileLocked1, parentFavId)).entry.id;
      fileLocked2Id = (await apis.user.nodes.createFile(fileLocked2, parentFavId)).entry.id;

      await apis.user.nodes.lockFile(fileLocked1Id);
      await apis.user.nodes.lockFile(fileLocked2Id);

      await apis.user.favorites.addFavoritesByIds('file', [fileId, file1Id, file2Id, file3Id, file4Id, fileLocked1Id, fileLocked2Id]);
      await apis.user.favorites.waitForApi({ expect: initialFavoritesTotalItems + 7 });

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.clickFavoritesAndWait();
      done();
    });

    afterEach(async (done) => {
      await page.refresh();
      done();
    });

    it('[C297565] dialog UI defaults', async () => {
      await dataTable.selectItem(file);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload1);
      await page.waitForDialog();

      expect(await uploadNewVersionDialog.getDialogTitle()).toEqual('Upload New Version');
      expect(await uploadNewVersionDialog.description.isDisplayed()).toBe(true, 'Description not displayed');
      expect(await uploadNewVersionDialog.minorOption.isDisplayed()).toBe(true, 'Minor option not displayed');
      expect(await uploadNewVersionDialog.majorOption.isDisplayed()).toBe(true, 'Major option not displayed');
      expect(await uploadNewVersionDialog.isCancelButtonEnabled()).toBe(true, 'Cancel button not enabled');
      expect(await uploadNewVersionDialog.isUploadButtonEnabled()).toBe(true, 'Update button not enabled');
    });

    it('[C297566] file is updated after uploading a new version - major', async () => {
      await dataTable.selectItem(file1);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload1);
      await page.waitForDialog();

      await uploadNewVersionDialog.majorOption.click();
      await uploadNewVersionDialog.enterDescription('new major version description');
      await uploadNewVersionDialog.uploadButton.click();
      await uploadNewVersionDialog.waitForDialogToClose();

      expect(await dataTable.isItemPresent(fileToUpload1)).toBe(true, 'File not updated');
      expect(await apis.user.nodes.getFileVersionType(file1Id)).toEqual('MAJOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(file1Id)).toEqual('2.0', 'File has incorrect version label');
    });

    it('[C297567] file is updated after uploading a new version - minor', async () => {
      await dataTable.selectItem(file2);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload2);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new minor version description');
      await uploadNewVersionDialog.uploadButton.click();
      await uploadNewVersionDialog.waitForDialogToClose();

      expect(await dataTable.isItemPresent(fileToUpload2)).toBe(true, 'File not updated');
      expect(await apis.user.nodes.getFileVersionType(file2Id)).toEqual('MINOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(file2Id)).toEqual('1.1', 'File has incorrect version label');
    });

    it('[C297568] file is not updated when clicking Cancel', async () => {
      await dataTable.selectItem(file3);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload3);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new version description');
      await uploadNewVersionDialog.clickCancel();

      expect(await dataTable.isItemPresent(file3)).toBe(true, 'File was updated');
      expect(await apis.user.nodes.getFileVersionType(file3Id)).toEqual('MAJOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(file3Id)).toEqual('1.0', 'File has incorrect version label');
    });

    it('[C297569] upload new version fails when new file name already exists', async () => {
      await dataTable.selectItem(file4);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(file);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new version description');
      await uploadNewVersionDialog.uploadButton.click();

      const message = await page.getSnackBarMessage();
      expect(message).toContain(nameConflictMessage);

      expect(await dataTable.isItemPresent(file4)).toBe(true, 'File was updated');
      expect(await apis.user.nodes.getFileVersionType(file4Id)).toEqual('MAJOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(file4Id)).toEqual('1.0', 'File has incorrect version label');
    });

    it('[C297570] file is unlocked after uploading a new version', async () => {
      await dataTable.selectItem(fileLocked1);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload4);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new version description');
      await uploadNewVersionDialog.uploadButton.click();
      await uploadNewVersionDialog.waitForDialogToClose();

      expect(await dataTable.isItemPresent(fileToUpload4)).toBe(true, 'File name was not changed');
      expect(await apis.user.nodes.isFileLockedWrite(fileLocked1Id)).toBe(false, `${fileLocked1} is still locked`);
      expect(await apis.user.nodes.getFileVersionType(fileLocked1Id)).toEqual('MINOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(fileLocked1Id)).toEqual('1.1', 'File has incorrect version label');
    });

    it('[C297571] file remains locked after canceling of uploading a new version', async () => {
      await dataTable.selectItem(fileLocked2);
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(fileToUpload5);
      await page.waitForDialog();

      await uploadNewVersionDialog.minorOption.click();
      await uploadNewVersionDialog.enterDescription('new version description');
      await uploadNewVersionDialog.clickCancel();

      expect(await dataTable.isItemPresent(fileToUpload5)).toBe(false, 'File was updated');
      expect(await dataTable.isItemPresent(fileLocked2)).toBe(true, 'File not displayed');
      expect(await apis.user.nodes.isFileLockedWrite(fileLocked2Id)).toBe(true, `${fileLocked2} was unlocked`);
    });
  });
});
