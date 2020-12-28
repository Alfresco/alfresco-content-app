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

import { BrowsingPage, FILES, RepoClient, Utils, ManageVersionsDialog, Viewer } from '@alfresco/aca-testing-shared';
import { browser } from 'protractor';
import { ApiService, Logger, LoginPage, UsersActions } from '@alfresco/adf-testing';

describe('Version actions', () => {
  const random = Utils.random();

  const parentFolder = `parent-${random}`;
  let parentFolderId: string;

  let fileId: string;

  const filesToUpload = [FILES.pdfFile, FILES.docxFile, FILES.xlsxFile, FILES.jpgFile, FILES.docxFile2];

  const apiService = new ApiService();
  const adminApiService = new ApiService();
  const repoClient = new RepoClient(apiService);
  const usersActions = new UsersActions(adminApiService);

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const versionManagePage = new ManageVersionsDialog();
  const viewerPage = new Viewer();
  const { searchInput } = page.header;

  beforeAll(async () => {
    try {
      await adminApiService.loginWithProfile('admin');
      const user = await usersActions.createUser();
      await apiService.login(user.username, user.password);

      parentFolderId = (await repoClient.nodes.createFolder(parentFolder)).entry.id;

      fileId = (await repoClient.upload.uploadFile(filesToUpload[0], parentFolderId)).entry.id;

      await repoClient.shared.shareFilesByIds([fileId]);
      await repoClient.favorites.addFavoritesByIds('file', [fileId]);

      for (let i = 0; i < filesToUpload.length - 1; i++) {
        await repoClient.nodes.updateNodeContent(
          fileId,
          `${browser.params.e2eRootPath}/resources/test-files/${filesToUpload[i + 1]}`,
          true,
          'new major version description',
          filesToUpload[i + 1]
        );
      }

      await repoClient.shared.waitForFilesToBeShared([fileId]);

      await loginPage.loginWith(user.username, user.password);
      await dataTable.doubleClickOnRowByName(parentFolder);
      await dataTable.waitForHeader();
    } catch (error) {
      Logger.error(`--- beforeAll failed : ${error}`);
    }
  });

  afterAll(async () => {
    await repoClient.nodes.deleteNodeById(parentFolderId);
  });

  describe('on Personal Files', () => {
    beforeEach(async () => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parentFolder);
      await dataTable.waitForHeader();
      await dataTable.selectItem(filesToUpload[4]);
      await toolbar.clickMoreActionsManageVersions();
      await versionManagePage.viewFileVersion('1.0');
    });

    afterEach(async () => {
      await page.closeOpenDialogs();
      await Utils.pressEscape();
    });

    it('[C586766] Should be possible to view a previous document version', async () => {
      expect(await browser.getCurrentUrl()).toContain('1.0');
    });

    it('[C586767] Previous document version title should be the same in Preview mode as the Uploaded File', async () => {
      expect(await viewerPage.getFileTitle()).toContain(filesToUpload[0]);
    });

    it('[C586768] Should be possible to download a previous document version', async () => {
      await viewerPage.toolbar.downloadButton.click();

      expect(await Utils.fileExistsOnOS(filesToUpload[0])).toBe(true, 'File not found in download location');
    });
  });

  describe('on Shared Files', () => {
    beforeEach(async () => {
      await page.clickSharedFilesAndWait();
      await dataTable.selectItem(filesToUpload[4], parentFolder);
      await toolbar.clickMoreActionsManageVersions();
      await versionManagePage.viewFileVersion('2.0');
    });

    afterEach(async () => {
      await page.closeOpenDialogs();
      await Utils.pressEscape();
    });

    it('[C586776] Should be possible to view a previous document version', async () => {
      expect(await browser.getCurrentUrl()).toContain('2.0');
    });

    it('[C586777] Previous document version title should be the same in Preview mode as the Uploaded File', async () => {
      expect(await viewerPage.getFileTitle()).toContain(filesToUpload[1]);
    });

    it('[C586778] Should be possible to download a previous document version', async () => {
      await viewerPage.toolbar.downloadButton.click();

      expect(await Utils.fileExistsOnOS(filesToUpload[1])).toBe(true, 'File not found in download location');
    });
  });

  describe('on Recent Files', () => {
    beforeEach(async () => {
      await page.clickRecentFilesAndWait();
      await dataTable.selectItem(filesToUpload[4], parentFolder);
      await toolbar.clickMoreActionsManageVersions();
      await versionManagePage.viewFileVersion('3.0');
    });

    afterEach(async () => {
      await page.closeOpenDialogs();
      await Utils.pressEscape();
    });

    it('[C586769] Should be possible to view a previous document version', async () => {
      expect(await browser.getCurrentUrl()).toContain('3.0');
    });

    it('[C586770] Previous document version title should be the same in Preview mode as the Uploaded File', async () => {
      expect(await viewerPage.getFileTitle()).toContain(filesToUpload[2]);
    });

    it('[C586771] Should be possible to download a previous document version', async () => {
      await viewerPage.toolbar.downloadButton.click();

      expect(await Utils.fileExistsOnOS(filesToUpload[2])).toBe(true, 'File not found in download location');
    });
  });

  describe('on Favorite Files', () => {
    beforeEach(async () => {
      await page.clickFavoritesAndWait();
      await dataTable.selectItem(filesToUpload[4], parentFolder);
      await toolbar.clickMoreActionsManageVersions();
      await versionManagePage.viewFileVersion('4.0');
    });

    afterEach(async () => {
      await page.closeOpenDialogs();
      await Utils.pressEscape();
    });

    it('[C586772] Should be possible to view a previous document version', async () => {
      expect(await browser.getCurrentUrl()).toContain('4.0');
    });

    it('[C586773] Previous document version title should be the same in Preview mode as the Uploaded File', async () => {
      expect(await viewerPage.getFileTitle()).toContain(filesToUpload[3]);
    });

    it('[C586774] Should be possible to download a previous document version', async () => {
      await viewerPage.toolbar.downloadButton.click();

      expect(await Utils.fileExistsOnOS(filesToUpload[3])).toBe(true, 'File not found in download location');
    });
  });

  describe('on Search Results', () => {
    beforeEach(async () => {
      await page.clickPersonalFiles();
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFiles();
      await searchInput.searchFor(`${filesToUpload[4]} AND PARENT:"workspace://SpacesStore/${parentFolderId}"`);
      await dataTable.waitForBody();

      await dataTable.selectItem(filesToUpload[4], parentFolder);
      await toolbar.clickMoreActionsManageVersions();
      await versionManagePage.viewFileVersion('5.0');
    });

    afterEach(async () => {
      await page.closeOpenDialogs();
      await Utils.pressEscape();
    });

    it('[C586779] Should be possible to view a previous document version', async () => {
      expect(await browser.getCurrentUrl()).toContain('5.0');
    });

    it('[C586780] Previous document version title should be the same in Preview mode as the Uploaded File', async () => {
      expect(await viewerPage.getFileTitle()).toContain(filesToUpload[4]);
    });

    it('[C586781] Should be possible to download a previous document version', async () => {
      await viewerPage.toolbar.downloadButton.click();

      expect(await Utils.fileExistsOnOS(filesToUpload[4])).toBe(true, 'File not found in download location');
    });
  });
});
