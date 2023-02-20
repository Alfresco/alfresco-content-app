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

import { AdminActions, LoginPage, BrowsingPage, FILES, RepoClient, Utils, UploadNewVersionDialog, UserActions } from '@alfresco/aca-testing-shared';

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
  const { dataTable, toolbar } = page;
  const uploadNewVersionDialog = new UploadNewVersionDialog();

  const adminActions = new AdminActions();
  const userActions = new UserActions();

  beforeAll(async () => {
    await adminActions.createUser({ username });
    userActions.login(username, username);

    parentPFId = await apis.user.createFolder(parentPF);
    parentSFId = await apis.user.createFolder(parentSF);
    parentRFId = await apis.user.createFolder(parentRF);
    parentFavId = await apis.user.createFolder(parentFav);
    parentSearchId = await apis.user.createFolder(parentSearch);
  });

  afterAll(async () => {
    userActions.login(username, username);
    await userActions.deleteNodes([parentPFId, parentSFId, parentRFId, parentFavId, parentSearchId]);
  });

  describe('on Personal Files', () => {
    beforeAll(async () => {
      file1Id = (await apis.user.nodes.createFile(file1, parentPFId)).entry.id;
      file2Id = (await apis.user.nodes.createFile(file2, parentPFId)).entry.id;
      file3Id = (await apis.user.nodes.createFile(file3, parentPFId)).entry.id;
      file4Id = (await apis.user.nodes.createFile(file4, parentPFId)).entry.id;

      fileLocked1Id = (await apis.user.nodes.createFile(fileLocked1, parentPFId)).entry.id;
      fileLocked2Id = (await apis.user.nodes.createFile(fileLocked2, parentPFId)).entry.id;

      await userActions.lockNodes([fileLocked1Id, fileLocked2Id]);
      await loginPage.loginWith(username);
    });

    beforeEach(async () => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parentPF);
    });

    afterEach(async () => {
      await Utils.pressEscape();
      await page.refresh();
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
});
