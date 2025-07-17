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
  Utils,
  test,
  TrashcanApi,
  NodesApi,
  TEST_FILES,
  FileActionsApi,
  SharedLinksApi,
  FavoritesPageApi,
  RecentFilesPage,
  PersonalFilesPage,
  FavoritesPage,
  SharedPage,
  SearchPage,
  timeouts
} from '@alfresco/aca-playwright-shared';

test.describe('Version actions', () => {
  let trashcanApi: TrashcanApi;
  let nodesApi: NodesApi;
  let fileActionsApi: FileActionsApi;
  let sharedLinksApi: SharedLinksApi;
  let favoritesApi: FavoritesPageApi;
  const random = Utils.random();
  const filesToUpload = [TEST_FILES.PDF, TEST_FILES.DOCX];
  const filenameBeforeUpdate = `${filesToUpload[0].name}-${random}`;
  const filenameAfterUpdate = `${filesToUpload[1].name}-${random}`;
  const username = `user-${random}`;
  const parentFolder = `parent-version-${random}`;
  let parentFolderId: string;
  let fileId: string;

  async function viewFirstFileVersion(page: PersonalFilesPage | RecentFilesPage | FavoritesPage | SharedPage | SearchPage) {
    await page.dataTable.selectItems(filenameAfterUpdate);
    await page.acaHeader.clickMoreActions();
    await page.matMenu.clickMenuItem('Manage Versions');
    await page.manageVersionsDialog.viewFileVersion('1.0');
    await page.matMenu.clickMenuItem('View');
  }

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      trashcanApi = await TrashcanApi.initialize(username, username);
      nodesApi = await NodesApi.initialize(username, username);
      fileActionsApi = await FileActionsApi.initialize(username, username);
      favoritesApi = await FavoritesPageApi.initialize(username, username);
      sharedLinksApi = await SharedLinksApi.initialize(username, username);

      parentFolderId = (await nodesApi.createFolder(parentFolder)).entry.id;
      fileId = (await fileActionsApi.uploadFile(filesToUpload[0].path, filenameBeforeUpdate, parentFolderId)).entry.id;

      await fileActionsApi.updateNodeContent(fileId, filesToUpload[1].path, true, 'new major version description', filenameAfterUpdate);

      await favoritesApi.addFavoritesByIds('file', [fileId]);
      await favoritesApi.waitForApi(username, { expect: 1 });
      await sharedLinksApi.shareFilesByIds([fileId]);
      await sharedLinksApi.waitForFilesToBeShared([fileId]);
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test.describe('on Personal Files', () => {
    test.beforeEach(async ({ loginPage, personalFiles }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await personalFiles.navigate();
      await personalFiles.dataTable.performClickFolderOrFileToOpen(parentFolder);
      await personalFiles.dataTable.progressBarWaitForReload();
      await viewFirstFileVersion(personalFiles);
    });

    test('[XAT-5496] Should be possible to view a previous document version - Personal Files', async ({ personalFiles }) => {
      expect(personalFiles.page.url()).toContain('1.0');
    });

    test('[XAT-5497] Previous document version title should be the same in Preview mode as in Version Manager - Personal Files', async ({
      personalFiles
    }) => {
      await personalFiles.viewer.waitForViewerToOpen('wait for viewer content');
      expect(await personalFiles.viewer.getFileTitle()).toContain(filenameBeforeUpdate);
    });

    test('[XAT-5498] Should be possible to download a previous document version - Personal Files', async ({ personalFiles }) => {
      const [download] = await Promise.all([personalFiles.page.waitForEvent('download'), await personalFiles.viewer.downloadButton.click()]);
      expect(download.suggestedFilename()).toBe(filenameBeforeUpdate);
    });
  });

  test.describe('on Recent Files', () => {
    test.beforeEach(async ({ loginPage, recentFilesPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await recentFilesPage.navigate();
      await viewFirstFileVersion(recentFilesPage);
    });

    test('[XAT-5499] Should be possible to view a previous document version - Recent Files', async ({ recentFilesPage }) => {
      expect(recentFilesPage.page.url()).toContain('1.0');
    });

    test('[XAT-5500] Previous document version title should be the same in Preview mode as in Version Manager - Recent Files', async ({
      recentFilesPage
    }) => {
      await recentFilesPage.viewer.waitForViewerToOpen('wait for viewer content');
      expect(await recentFilesPage.viewer.getFileTitle()).toContain(filenameBeforeUpdate);
    });

    test('[XAT-5501] Should be possible to download a previous document version - Recent Files', async ({ recentFilesPage }) => {
      const [download] = await Promise.all([recentFilesPage.page.waitForEvent('download'), await recentFilesPage.viewer.downloadButton.click()]);
      expect(download.suggestedFilename()).toBe(filenameBeforeUpdate);
    });
  });

  test.describe('on Favorites', () => {
    test.beforeEach(async ({ loginPage, favoritePage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await favoritePage.navigate();
      await viewFirstFileVersion(favoritePage);
    });

    test('[XAT-5502] Should be possible to view a previous document version - Favorites', async ({ favoritePage }) => {
      expect(favoritePage.page.url()).toContain('1.0');
    });

    test('[XAT-5503] Previous document version title should be the same in Preview mode as in Version Manager - Favorites', async ({
      favoritePage
    }) => {
      await favoritePage.viewer.waitForViewerToOpen('wait for viewer content');
      expect(await favoritePage.viewer.getFileTitle()).toContain(filenameBeforeUpdate);
    });

    test('[XAT-5504] Should be possible to download a previous document version - Favorites', async ({ favoritePage }) => {
      const [download] = await Promise.all([favoritePage.page.waitForEvent('download'), await favoritePage.viewer.downloadButton.click()]);
      expect(download.suggestedFilename()).toBe(filenameBeforeUpdate);
    });
  });

  test.describe('on Shared Files', () => {
    test.beforeEach(async ({ loginPage, sharedPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await sharedPage.navigate();
      await viewFirstFileVersion(sharedPage);
    });

    test('[XAT-5505] Should be possible to view a previous document version - Shared Files', async ({ sharedPage }) => {
      expect(sharedPage.page.url()).toContain('1.0');
    });

    test('[XAT-5506] Previous document version title should be the same in Preview mode as in Version Manager - Shared Files', async ({
      sharedPage
    }) => {
      await sharedPage.viewer.waitForViewerLoaderToFinish(timeouts.fortySeconds);
      expect(await sharedPage.viewer.getFileTitle()).toContain(filenameBeforeUpdate);
    });

    test('[XAT-5507] Should be possible to download a previous document version - Shared Files', async ({ sharedPage }) => {
      const [download] = await Promise.all([sharedPage.page.waitForEvent('download'), await sharedPage.viewer.downloadButton.click()]);
      expect(download.suggestedFilename()).toBe(filenameBeforeUpdate);
    });
  });

  test.describe('on Search', () => {
    test.beforeEach(async ({ loginPage, searchPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await searchPage.navigate();
      await searchPage.clickSearchButton();
      await searchPage.searchOverlay.searchFor(filenameAfterUpdate);
      await viewFirstFileVersion(searchPage);
    });

    test('[XAT-5508] Should be possible to view a previous document version - Search Results', async ({ searchPage }) => {
      expect(searchPage.page.url()).toContain('1.0');
    });

    test('[XAT-5509] Previous document version title should be the same in Preview mode as in Version Manager - Search Results', async ({
      searchPage
    }) => {
      await searchPage.viewer.waitForViewerToOpen('wait for viewer content');
      expect(await searchPage.viewer.getFileTitle()).toContain(filenameBeforeUpdate);
    });

    test('[XAT-5510] Should be possible to download a previous document version - Search Results', async ({ searchPage }) => {
      const [download] = await Promise.all([searchPage.page.waitForEvent('download'), await searchPage.viewer.downloadButton.click()]);
      expect(download.suggestedFilename()).toBe(filenameBeforeUpdate);
    });
  });
});
