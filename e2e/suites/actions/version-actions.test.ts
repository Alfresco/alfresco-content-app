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

import { AdminActions, UserActions, LoginPage, BrowsingPage, FILES, RepoClient, Utils, UploadNewVersionDialog } from '@alfresco/aca-testing-shared';
import { VersionManagePage } from '../../../projects/aca-testing-shared/src/components/version-manage/version-manager';
import { Viewer } from '../../../projects/aca-testing-shared/src/components';
import { browser } from 'protractor';

describe('Version component actions', () => {
  const versionManagePage = new VersionManagePage();
  const viewerPage = new Viewer();

  const username = `user-${Utils.random()}`;

  let fileId: string;

  const filesToUpload = [FILES.pdfFile, FILES.docxFile, FILES.xlsxFile, FILES.jpgFile, FILES.docxFile2];

  /* @deprecated use userActions instead */
  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const uploadNewVersionDialog = new UploadNewVersionDialog();
  const { searchInput } = page.header;

  const adminApiActions = new AdminActions();
  const userActions = new UserActions();

  beforeAll(async (done) => {
    await adminApiActions.login();
    await adminApiActions.createUser({ username });
    await userActions.login(username, username);

    fileId = (await apis.user.upload.uploadFile(filesToUpload[0])).entry.id;
    await apis.user.shared.shareFilesByIds([fileId]);
    await loginPage.loginWith(username);

    for (let i = 0; i < filesToUpload.length - 1; i++) {
      await dataTable.selectItem(filesToUpload[i]);
      await toolbar.clickMoreActionsUploadNewVersion();
      await Utils.uploadFileNewVersion(filesToUpload[i + 1]);

      await page.waitForDialog();

      await uploadNewVersionDialog.majorOption.click();
      await uploadNewVersionDialog.enterDescription('new major version description');
      await uploadNewVersionDialog.uploadButton.click();
      await uploadNewVersionDialog.waitForDialogToClose();
    }
    done();
  });

  afterAll(async (done) => {
    await userActions.deleteNodes([fileId]);
    done();
  });

  describe('on Personal Files', () => {
    beforeAll(async (done) => {
      await page.clickPersonalFilesAndWait();
      done();
    });

    beforeEach(async (done) => {
      await dataTable.selectItem(filesToUpload[4]);
      await toolbar.clickMoreActionsManageVersions();
      await versionManagePage.viewFileVersion('1.0');
      done();
    });

    afterEach(async (done) => {
      await viewerPage.clickCloseButton();
      done();
    });

    it('[C586766] Should be possible to view a previous document version', async () => {
      expect(await browser.getCurrentUrl()).toContain('1.0');
    });

    it('[C586767] Previous document version title should be the same in Preview mode as the Uploaded File', async () => {
      expect(await viewerPage.getFileTitle()).toContain(filesToUpload[0]);
    });

    it('[C586768] Should be possible to download a previous document version', async () => {
      await viewerPage.clickDownloadButton();

      expect(await Utils.fileExistsOnOS(filesToUpload[0])).toBe(true, 'File not found in download location');
    });
  });

  describe('on Shared Files', () => {
    beforeAll(async (done) => {
      await page.clickSharedFilesAndWait();
      done();
    });

    beforeEach(async (done) => {
      await dataTable.selectItem(filesToUpload[4]);
      await toolbar.clickMoreActionsManageVersions();
      await versionManagePage.viewFileVersion('2.0');
      done();
    });

    afterEach(async (done) => {
      await viewerPage.clickCloseButton();
      done();
    });

    it('[C586776] Should be possible to view a previous document version', async () => {
      expect(await browser.getCurrentUrl()).toContain('2.0');
    });

    it('[C586777] Previous document version title should be the same in Preview mode as the Uploaded File', async () => {
      expect(await viewerPage.getFileTitle()).toContain(filesToUpload[1]);
    });

    it('[C586778] Should be possible to download a previous document version', async () => {
      await viewerPage.clickDownloadButton();

      expect(await Utils.fileExistsOnOS(filesToUpload[1])).toBe(true, 'File not found in download location');
    });
  });

  describe('on Recent Files', () => {
    beforeAll(async (done) => {
      await page.clickRecentFilesAndWait();
      done();
    });

    beforeEach(async (done) => {
      await dataTable.selectItem(filesToUpload[4]);
      await toolbar.clickMoreActionsManageVersions();
      await versionManagePage.viewFileVersion('3.0');
      done();
    });

    afterEach(async (done) => {
      await viewerPage.clickCloseButton();
      done();
    });

    it('[C586769] Should be possible to view a previous document version', async () => {
      expect(await browser.getCurrentUrl()).toContain('3.0');
    });

    it('[C586770] Previous document version title should be the same in Preview mode as the Uploaded File', async () => {
      expect(await viewerPage.getFileTitle()).toContain(filesToUpload[2]);
    });

    it('[C586771] Should be possible to download a previous document version', async () => {
      await viewerPage.clickDownloadButton();

      expect(await Utils.fileExistsOnOS(filesToUpload[2])).toBe(true, 'File not found in download location');
    });
  });

  describe('on Favorite Files', () => {
    beforeAll(async (done) => {
      await userActions.createFavorites('file', [fileId]);
      await apis.user.favorites.waitForApi({ expect: 1 });
      await page.clickFavoritesAndWait();
      done();
    });

    beforeEach(async (done) => {
      await dataTable.selectItem(filesToUpload[4]);
      await toolbar.clickMoreActionsManageVersions();
      await versionManagePage.viewFileVersion('4.0');
      done();
    });

    afterEach(async (done) => {
      await viewerPage.clickCloseButton();
      done();
    });

    it('[C586772] Should be possible to view a previous document version', async () => {
      expect(await browser.getCurrentUrl()).toContain('4.0');
    });

    it('[C586773] Previous document version title should be the same in Preview mode as the Uploaded File', async () => {
      expect(await viewerPage.getFileTitle()).toContain(filesToUpload[3]);
    });

    it('[C586774] Should be possible to download a previous document version', async () => {
      await viewerPage.clickDownloadButton();

      expect(await Utils.fileExistsOnOS(filesToUpload[3])).toBe(true, 'File not found in download location');
    });
  });

  describe('on Search Results', () => {
    beforeAll(async (done) => {
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchFor(filesToUpload[4]);
      await dataTable.waitForBody();
      done();
    });

    beforeEach(async (done) => {
      await dataTable.selectItem(filesToUpload[4], 'Personal Files');
      await toolbar.clickMoreActionsManageVersions();
      await versionManagePage.viewFileVersion('5.0');
      done();
    });

    afterEach(async (done) => {
      await viewerPage.clickCloseButton();
      done();
    });

    it('[C586779] Should be possible to view a previous document version', async () => {
      expect(await browser.getCurrentUrl()).toContain('5.0');
    });

    it('[C586780] Previous document version title should be the same in Preview mode as the Uploaded File', async () => {
      expect(await viewerPage.getFileTitle()).toContain(filesToUpload[4]);
    });

    it('[C586781] Should be possible to download a previous document version', async () => {
      await viewerPage.clickDownloadButton();

      expect(await Utils.fileExistsOnOS(filesToUpload[4])).toBe(true, 'File not found in download location');
    });
  });
});
