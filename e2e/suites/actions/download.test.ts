/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { LoginPage, BrowsingPage, SearchResultsPage } from '../../pages/pages';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Download', () => {
  const username = `user-${Utils.random()}`;

  const parent = `parent-${Utils.random()}`; let parentId;

  const filePersonal = `filePersonal-${Utils.random()}.txt`;
  const fileRecent1 = `fileRecent1-${Utils.random()}.txt`;
  const fileRecent2 = `fileRecent2-${Utils.random()}.txt`;
  const fileShared1 = `fileShared1-${Utils.random()}.txt`;
  const fileShared2 = `fileShared2-${Utils.random()}.txt`;
  const fileFavorites = `fileFavorites-${Utils.random()}.txt`;
  const fileSearch = `fileSearch-${Utils.random()}.txt`;

  const folderPersonal = `folderPersonal-${Utils.random()}`;
  const folderFavorites = `folderFavorites-${Utils.random()}`;
  const folderSearch = `folderSearch-${Utils.random()}`;

  const fileInFolderPersonal = `fileInFolderPersonal-${Utils.random()}.txt`;
  const fileInFolderFavorites = `fileInFolderFavorites-${Utils.random()}.txt`;
  const fileInFolderSearch = `fileInFolderSearch-${Utils.random()}.txt`;

  const unzippedPersonal = `unzippedPersonal-${Utils.random()}`;
  const unzippedRecent = `unzippedRecent-${Utils.random()}`;
  const unzippedShared = `unzippedShared-${Utils.random()}`;
  const unzippedFavorites = `unzippedFavorites-${Utils.random()}`;
  const unzippedSearch = `unzippedSearch-${Utils.random()}`;

  let fileShared1Id, fileShared2Id, fileFavoritesId, folderPersonalId, folderFavoritesId, folderSearchId;

  const archiveZip = 'archive.zip';

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const searchResultsPage = new SearchResultsPage();
  const { searchInput } = searchResultsPage.header;

  beforeAll(async done => {
    await apis.admin.people.createUser({ username });

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

    await apis.user.shared.shareFileById(fileShared1Id);
    await apis.user.shared.shareFileById(fileShared2Id);
    await apis.user.favorites.addFavoriteById('file', fileFavoritesId);
    await apis.user.favorites.addFavoriteById('folder', folderFavoritesId);

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(parentId);
    await apis.user.trashcan.emptyTrash();
    done();
  });

  afterEach(async (done) => {
    await Utils.renameFile(archiveZip, `${Utils.random()}.zip`);
    done();
  });

  describe('on Personal Files', () => {

    beforeEach(async (done) => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);
      done();
    });

    it('Download a file - [C213179]', async () => {
      await dataTable.selectItem(filePersonal);
      await toolbar.clickDownload();

      expect(await Utils.fileExistsOnOS(filePersonal)).toBe(true, 'File not found in download location');
    });

    it('Download a folder - [C216352]', async () => {
      await dataTable.selectItem(folderPersonal);
      await toolbar.clickDownload();

      const folderZip = `${folderPersonal}.zip`;

      expect(await Utils.fileExistsOnOS(folderZip)).toBe(true, 'File not found in download location');

      await Utils.unzip(folderZip);

      expect(await Utils.fileExistsOnOS(fileInFolderPersonal, folderPersonal));
    });

    it('Download multiple items - [C216353]', async () => {
      await dataTable.selectMultipleItems([filePersonal, folderPersonal]);
      await toolbar.clickDownload();

      expect(await Utils.fileExistsOnOS(archiveZip)).toBe(true, 'File not found in download location');

      await Utils.unzip(archiveZip, unzippedPersonal);

      expect(await Utils.fileExistsOnOS(filePersonal, unzippedPersonal)).toBe(true, `${filePersonal} not found in unzipped folder`);
      expect(await Utils.fileExistsOnOS(folderPersonal, unzippedPersonal)).toBe(true, `${folderPersonal} not found in unzipped folder`);
      expect(await Utils.fileExistsOnOS(fileInFolderPersonal, unzippedPersonal, folderPersonal)).toBe(true, `${fileInFolderPersonal} not found in unzipped folder in ${folderPersonal}`)
    });

  });

  describe('on Favorites', () => {

    beforeAll(async (done) => {
      await apis.user.favorites.waitForApi({ expect: 2 });
      done();
    });

    beforeEach(async (done) => {
      await page.clickFavoritesAndWait();
      done();
    });

    it('Download a file - [C280173]', async () => {
      await dataTable.selectItem(fileFavorites);
      await toolbar.clickDownload();

      expect(await Utils.fileExistsOnOS(fileFavorites)).toBe(true, 'File not found in download location');
    });

    it('Download a folder - [C280188]', async () => {
      await dataTable.selectItem(folderFavorites);
      await toolbar.clickDownload();

      const folderZip = `${folderFavorites}.zip`;

      expect(await Utils.fileExistsOnOS(folderZip)).toBe(true, 'File not found in download location');

      await Utils.unzip(folderZip);

      expect(await Utils.fileExistsOnOS(fileInFolderFavorites, folderFavorites));
    });

    it('Download multiple items - [C280189]', async () => {
      await dataTable.selectMultipleItems([fileFavorites, folderFavorites]);
      await toolbar.clickDownload();

      expect(await Utils.fileExistsOnOS(archiveZip)).toBe(true, 'File not found in download location');

      await Utils.unzip(archiveZip, unzippedFavorites);

      expect(await Utils.fileExistsOnOS(fileFavorites, unzippedFavorites)).toBe(true, `${fileFavorites} not found in unzipped folder`);
      expect(await Utils.fileExistsOnOS(folderFavorites, unzippedFavorites)).toBe(true, `${folderFavorites} not found in unzipped folder`);
      expect(await Utils.fileExistsOnOS(fileInFolderFavorites, unzippedFavorites, folderFavorites)).toBe(true, `${fileInFolderFavorites} not found in unzipped folder in ${folderFavorites}`)
    });

  });

  describe('on Shared Files', () => {

    beforeAll(async (done) => {
      await apis.user.shared.waitForApi({ expect: 2 });
      done();
    });

    beforeEach(async (done) => {
      await page.clickSharedFilesAndWait();
      done();
    });

    it('Download a file - [C280170]', async () => {
      await dataTable.selectItem(fileShared1);
      await toolbar.clickDownload();

      expect(await Utils.fileExistsOnOS(fileShared1)).toBe(true, 'File not found in download location');
    });

    it('Download multiple items - [C280183]', async () => {
      await dataTable.selectMultipleItems([fileShared1, fileShared2]);
      await toolbar.clickDownload();

      expect(await Utils.fileExistsOnOS(archiveZip)).toBe(true, 'File not found in download location');

      await Utils.unzip(archiveZip, unzippedShared);

      expect(await Utils.fileExistsOnOS(fileShared1, unzippedShared)).toBe(true, `${fileShared1} not found in unzipped folder`);
      expect(await Utils.fileExistsOnOS(fileShared2, unzippedShared)).toBe(true, `${fileShared2} not found in unzipped folder`);
    });

  });

  describe('on Recent Files', () => {

    beforeAll(async (done) => {
      await apis.user.search.waitForApi(username, { expect: 10 });
      done();
    });

    beforeEach(async (done) => {
      await page.clickRecentFilesAndWait();
      done();
    });

    it('Download a file - [C280167]', async () => {
      await dataTable.selectItem(fileRecent1);
      await toolbar.clickDownload();

      expect(await Utils.fileExistsOnOS(fileRecent1)).toBe(true, 'File not found in download location');
    });

    it('Download multiple items - [C280177]', async () => {
      await dataTable.selectMultipleItems([fileRecent1, fileRecent2]);
      await toolbar.clickDownload();

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
      await searchInput.searchFor('*Search*');
      done();
    });

    it('Download a file - [C279164]', async () => {
      await dataTable.selectItem(fileSearch, parent);
      await toolbar.clickDownload();

      expect(await Utils.fileExistsOnOS(fileSearch)).toBe(true, 'File not found in download location');
    });

    it('Download a folder - [C297694]', async () => {
      await dataTable.selectItem(folderSearch, parent);
      await toolbar.clickDownload();

      const folderZip = `${folderSearch}.zip`;

      expect(await Utils.fileExistsOnOS(folderZip)).toBe(true, 'File not found in download location');

      await Utils.unzip(folderZip);

      expect(await Utils.fileExistsOnOS(fileInFolderSearch, folderSearch));
    });

    it('Download multiple items - [C297695]', async () => {
      await dataTable.selectMultipleItems([fileSearch, folderSearch], parent);
      await toolbar.clickDownload();

      expect(await Utils.fileExistsOnOS(archiveZip)).toBe(true, 'File not found in download location');

      await Utils.unzip(archiveZip, unzippedSearch);

      expect(await Utils.fileExistsOnOS(fileSearch, unzippedSearch)).toBe(true, `${fileSearch} not found in unzipped folder`);
      expect(await Utils.fileExistsOnOS(folderSearch, unzippedSearch)).toBe(true, `${folderSearch} not found in unzipped folder`);
      expect(await Utils.fileExistsOnOS(fileInFolderSearch, unzippedSearch, folderSearch)).toBe(true, `${fileInFolderSearch} not found in unzipped folder in ${folderSearch}`)
    });

  });

});
