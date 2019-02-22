/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { LoginPage, BrowsingPage } from '../../pages/pages';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Download', () => {
  const username = `user-${Utils.random()}`;

  const parent = `parent-${Utils.random()}`; let parentId;

  const filePersonal = `filePersonal-${Utils.random()}.txt`;
  const fileRecent = `fileRecent-${Utils.random()}.txt`;
  const fileShared = `fileShared-${Utils.random()}.txt`;
  const fileFavorites = `fileFavorites-${Utils.random()}.txt`;

  let fileSharedId, fileFavoritesId;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;

  beforeAll(async done => {
    await apis.admin.people.createUser({ username });

    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;

    await apis.user.nodes.createFile(filePersonal, parentId);
    await apis.user.nodes.createFile(fileRecent, parentId);
    fileSharedId = (await apis.user.nodes.createFile(fileShared, parentId)).entry.id;
    fileFavoritesId = (await apis.user.nodes.createFile(fileFavorites, parentId)).entry.id;

    await apis.user.shared.shareFileById(fileSharedId);
    await apis.user.favorites.addFavoriteById('file', fileFavoritesId);

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(parentId);
    await apis.user.trashcan.emptyTrash();
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

  });

  describe('on Recent Files', () => {

    beforeAll(async (done) => {
      await apis.user.search.waitForApi(username, { expect: 4 });
      done();
    });

    beforeEach(async (done) => {
      await page.clickRecentFilesAndWait();
      done();
    });

    it('Download a file - [C280167]', async () => {
      await dataTable.selectItem(fileRecent);
      await toolbar.clickDownload();

      expect(await Utils.fileExistsOnOS(fileRecent)).toBe(true, 'File not found in download location');
    });

  });

  describe('on Shared Files', () => {

    beforeAll(async (done) => {
      await apis.user.shared.waitForApi({ expect: 1 });
      done();
    });

    beforeEach(async (done) => {
      await page.clickSharedFilesAndWait();
      done();
    });

    it('Download a file - [C280170]', async () => {
      await dataTable.selectItem(fileShared);
      await toolbar.clickDownload();

      expect(await Utils.fileExistsOnOS(fileShared)).toBe(true, 'File not found in download location');
    });

  });

  describe('on Favorites', () => {

    beforeAll(async (done) => {
      await apis.user.favorites.waitForApi({ expect: 1 });
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

  });

});
