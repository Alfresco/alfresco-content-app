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

import { AdminActions, UserActions, LoginPage, BrowsingPage, SearchResultsPage, RepoClient, Utils } from '@alfresco/aca-testing-shared';
import { BrowserActions } from '@alfresco/adf-testing';

describe('Download', () => {
  const random = Utils.random();
  const username = `user-${random}`;

  const parent = `parent-${random}`;
  let parentId: string;

  const filePersonal = `filePersonal-${random}.txt`;
  const fileRecent1 = `fileRecent1-${random}.txt`;
  const fileRecent2 = `fileRecent2-${random}.txt`;
  const fileShared1 = `fileShared1-${random}.txt`;
  const fileShared2 = `fileShared2-${random}.txt`;
  const fileFavorites = `fileFavorites-${random}.txt`;
  const fileSearch = `fileSearch-${random}.txt`;

  const folderPersonal = `folderPersonal-${random}`;
  const folderFavorites = `folderFavorites-${random}`;
  const folderSearch = `folderSearch-${random}`;

  const fileInFolderPersonal = `fileInFolderPersonal-${random}.txt`;
  const fileInFolderFavorites = `fileInFolderFavorites-${random}.txt`;
  const fileInFolderSearch = `fileInFolderSearch-${random}.txt`;

  const unzippedPersonal = `unzippedPersonal-${random}`;
  const unzippedRecent = `unzippedRecent-${random}`;
  const unzippedShared = `unzippedShared-${random}`;
  const unzippedFavorites = `unzippedFavorites-${random}`;
  const unzippedSearch = `unzippedSearch-${random}`;

  let fileShared1Id: string;
  let fileShared2Id: string;
  let fileFavoritesId: string;
  let folderPersonalId: string;
  let folderFavoritesId: string;
  let folderSearchId: string;

  const archiveZip = 'archive.zip';

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const searchResultsPage = new SearchResultsPage();
  const { searchInput } = searchResultsPage.header;

  let initialFavoritesTotalItems: number;
  let initialRecentTotalItems: number;

  const adminApiActions = new AdminActions();
  const userActions = new UserActions();

  beforeAll(async (done) => {
    await adminApiActions.createUser({ username });

    initialRecentTotalItems = await apis.user.search.getTotalItems(username);

    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;

    await apis.user.nodes.createFile(filePersonal, parentId);
    await apis.user.nodes.createFile(fileRecent1, parentId);
    await apis.user.nodes.createFile(fileRecent2, parentId);
    fileShared1Id = (await apis.user.nodes.createFile(fileShared1, parentId)).entry.id;
    fileShared2Id = (await apis.user.nodes.createFile(fileShared2, parentId)).entry.id;
    fileFavoritesId = (await apis.user.nodes.createFile(fileFavorites, parentId)).entry.id;
    await apis.user.nodes.createFile(fileSearch, parentId);

    folderPersonalId = (await apis.user.nodes.createFolder(folderPersonal, parentId)).entry.id;
    await apis.user.nodes.createFile(fileInFolderPersonal, folderPersonalId);

    folderFavoritesId = (await apis.user.nodes.createFolder(folderFavorites, parentId)).entry.id;
    await apis.user.nodes.createFile(fileInFolderFavorites, folderFavoritesId);

    folderSearchId = (await apis.user.nodes.createFolder(folderSearch, parentId)).entry.id;
    await apis.user.nodes.createFile(fileInFolderSearch, folderSearchId);

    await apis.user.search.waitForApi(username, { expect: initialRecentTotalItems + 10 });

    await userActions.login(username, username);
    await userActions.shareNodes([fileShared1Id, fileShared2Id]);
    await apis.user.shared.waitForFilesToBeShared([fileShared1Id, fileShared2Id]);

    initialFavoritesTotalItems = await apis.user.favorites.getFavoritesTotalItems();
    await apis.user.favorites.addFavoriteById('file', fileFavoritesId);
    await apis.user.favorites.addFavoriteById('folder', folderFavoritesId);
    await apis.user.favorites.waitForApi({ expect: initialFavoritesTotalItems + 2 });

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await userActions.login(username, username);
    await userActions.deleteNodes([parentId]);
    await userActions.emptyTrashcan();
    done();
  });

  afterEach(async (done) => {
    await Utils.renameFile(archiveZip, `${random}.zip`);
    done();
  });

  describe('on Personal Files', () => {
    beforeEach(async (done) => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);
      done();
    });

    it('[C213179] Download a file', async () => {
      await dataTable.selectItem(filePersonal);
      await BrowserActions.click(toolbar.downloadButton);

      expect(await Utils.fileExistsOnOS(filePersonal)).toBe(true, 'File not found in download location');
    });

    it('[C216352] Download a folder', async () => {
      await dataTable.selectItem(folderPersonal);
      await BrowserActions.click(toolbar.downloadButton);

      const folderZip = `${folderPersonal}.zip`;

      expect(await Utils.fileExistsOnOS(folderZip)).toBe(true, 'File not found in download location');

      await Utils.unzip(folderZip);

      expect(await Utils.fileExistsOnOS(fileInFolderPersonal, folderPersonal));
    });

    it('[C216353] Download multiple items', async () => {
      await dataTable.selectMultipleItems([filePersonal, folderPersonal]);
      await BrowserActions.click(toolbar.downloadButton);

      expect(await Utils.fileExistsOnOS(archiveZip)).toBe(true, 'File not found in download location');

      await Utils.unzip(archiveZip, unzippedPersonal);

      expect(await Utils.fileExistsOnOS(filePersonal, unzippedPersonal)).toBe(true, `${filePersonal} not found in unzipped folder`);
      expect(await Utils.fileExistsOnOS(folderPersonal, unzippedPersonal)).toBe(true, `${folderPersonal} not found in unzipped folder`);
      expect(await Utils.fileExistsOnOS(fileInFolderPersonal, unzippedPersonal, folderPersonal)).toBe(
        true,
        `${fileInFolderPersonal} not found in unzipped folder in ${folderPersonal}`
      );
    });
  });

  describe('on Favorites', () => {
    beforeEach(async (done) => {
      await page.clickFavoritesAndWait();
      done();
    });

    it('[C280173] Download a file', async () => {
      await dataTable.selectItem(fileFavorites);
      await BrowserActions.click(toolbar.downloadButton);

      expect(await Utils.fileExistsOnOS(fileFavorites)).toBe(true, 'File not found in download location');
    });

    it('[C280188] Download a folder', async () => {
      await dataTable.selectItem(folderFavorites);
      await BrowserActions.click(toolbar.downloadButton);

      const folderZip = `${folderFavorites}.zip`;

      expect(await Utils.fileExistsOnOS(folderZip)).toBe(true, 'File not found in download location');

      await Utils.unzip(folderZip);

      expect(await Utils.fileExistsOnOS(fileInFolderFavorites, folderFavorites));
    });

    it('[C280189] Download multiple items', async () => {
      await dataTable.selectMultipleItems([fileFavorites, folderFavorites]);
      await BrowserActions.click(toolbar.downloadButton);

      expect(await Utils.fileExistsOnOS(archiveZip)).toBe(true, 'File not found in download location');

      await Utils.unzip(archiveZip, unzippedFavorites);

      expect(await Utils.fileExistsOnOS(fileFavorites, unzippedFavorites)).toBe(true, `${fileFavorites} not found in unzipped folder`);
      expect(await Utils.fileExistsOnOS(folderFavorites, unzippedFavorites)).toBe(true, `${folderFavorites} not found in unzipped folder`);
      expect(await Utils.fileExistsOnOS(fileInFolderFavorites, unzippedFavorites, folderFavorites)).toBe(
        true,
        `${fileInFolderFavorites} not found in unzipped folder in ${folderFavorites}`
      );
    });
  });

  describe('on Shared Files', () => {
    beforeEach(async (done) => {
      await page.clickSharedFilesAndWait();
      done();
    });

    it('[C280170] Download a file', async () => {
      await dataTable.selectItem(fileShared1);
      await BrowserActions.click(toolbar.downloadButton);

      expect(await Utils.fileExistsOnOS(fileShared1)).toBe(true, 'File not found in download location');
    });

    it('[C280183] Download multiple items', async () => {
      await dataTable.selectMultipleItems([fileShared1, fileShared2]);
      await BrowserActions.click(toolbar.downloadButton);

      expect(await Utils.fileExistsOnOS(archiveZip)).toBe(true, 'File not found in download location');

      await Utils.unzip(archiveZip, unzippedShared);

      expect(await Utils.fileExistsOnOS(fileShared1, unzippedShared)).toBe(true, `${fileShared1} not found in unzipped folder`);
      expect(await Utils.fileExistsOnOS(fileShared2, unzippedShared)).toBe(true, `${fileShared2} not found in unzipped folder`);
    });
  });

  describe('on Recent Files', () => {
    beforeEach(async (done) => {
      await page.clickRecentFilesAndWait();
      done();
    });

    it('[C280167] Download a file', async () => {
      await dataTable.selectItem(fileRecent1);
      await BrowserActions.click(toolbar.downloadButton);

      expect(await Utils.fileExistsOnOS(fileRecent1)).toBe(true, 'File not found in download location');
    });

    it('[C280177] Download multiple items', async () => {
      await dataTable.selectMultipleItems([fileRecent1, fileRecent2]);
      await BrowserActions.click(toolbar.downloadButton);

      expect(await Utils.fileExistsOnOS(archiveZip)).toBe(true, 'File not found in download location');

      await Utils.unzip(archiveZip, unzippedRecent);

      expect(await Utils.fileExistsOnOS(fileRecent1, unzippedRecent)).toBe(true, `${fileRecent1} not found in unzipped folder`);
      expect(await Utils.fileExistsOnOS(fileRecent2, unzippedRecent)).toBe(true, `${fileRecent2} not found in unzipped folder`);
    });
  });

  describe('on Search Results', () => {
    beforeEach(async (done) => {
      await page.clickPersonalFilesAndWait();
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchFor(random);
      done();
    });

    it('[C279164] Download a file', async () => {
      await dataTable.selectItem(fileSearch, parent);
      await BrowserActions.click(toolbar.downloadButton);

      expect(await Utils.fileExistsOnOS(fileSearch)).toBe(true, 'File not found in download location');
    });

    it('[C297694] Download a folder', async () => {
      await dataTable.selectItem(folderSearch, parent);
      await BrowserActions.click(toolbar.downloadButton);

      const folderZip = `${folderSearch}.zip`;

      expect(await Utils.fileExistsOnOS(folderZip)).toBe(true, 'File not found in download location');

      await Utils.unzip(folderZip);

      expect(await Utils.fileExistsOnOS(fileInFolderSearch, folderSearch));
    });

    it('[C297695] Download multiple items', async () => {
      await dataTable.selectMultipleItems([fileSearch, folderSearch], parent);
      await BrowserActions.click(toolbar.downloadButton);

      expect(await Utils.fileExistsOnOS(archiveZip)).toBe(true, 'File not found in download location');

      await Utils.unzip(archiveZip, unzippedSearch);

      expect(await Utils.fileExistsOnOS(fileSearch, unzippedSearch)).toBe(true, `${fileSearch} not found in unzipped folder`);
      expect(await Utils.fileExistsOnOS(folderSearch, unzippedSearch)).toBe(true, `${folderSearch} not found in unzipped folder`);
      expect(await Utils.fileExistsOnOS(fileInFolderSearch, unzippedSearch, folderSearch)).toBe(
        true,
        `${fileInFolderSearch} not found in unzipped folder in ${folderSearch}`
      );
    });
  });
});
