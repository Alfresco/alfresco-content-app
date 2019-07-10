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

import { LoginPage, BrowsingPage } from '../../pages/pages';
import { Viewer } from '../../components/viewer/viewer';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Single click on item name', () => {
  const username = `user-${Utils.random()}`;

  const file1 = `file1-${Utils.random()}.txt`; let file1Id;
  const folder1 = `folder1-${Utils.random()}`; let folder1Id;

  const deletedFile1 = `file1-${Utils.random()}.txt`; let deletedFile1Id;
  const deletedFolder1 = `folder1-${Utils.random()}`; let deletedFolder1Id;

  const siteName = `site-${Utils.random()}`;
  const fileSite = `fileSite-${Utils.random()}.txt`;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, breadcrumb } = page;
  const viewer = new Viewer();
  const { searchInput } = page.header;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    file1Id = (await apis.user.nodes.createFile(file1)).entry.id;
    folder1Id = (await apis.user.nodes.createFolder(folder1)).entry.id;

    deletedFile1Id = (await apis.user.nodes.createFile(deletedFile1)).entry.id;
    deletedFolder1Id = (await apis.user.nodes.createFolder(deletedFolder1)).entry.id;
    await apis.user.nodes.deleteNodeById(deletedFile1Id, false);
    await apis.user.nodes.deleteNodeById(deletedFolder1Id, false);

    await apis.user.sites.createSite(siteName);
    const docLibId = (await apis.user.sites.getDocLibId(siteName));
    await apis.user.nodes.createFile(fileSite, docLibId);

    await apis.user.shared.shareFileById(file1Id);
    await apis.user.shared.waitForApi({ expect: 1 });

    await apis.user.favorites.addFavoriteById('file', file1Id);
    await apis.user.favorites.addFavoriteById('folder', folder1Id);
    await apis.user.favorites.waitForApi({ expect: 2 + 1 });

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.sites.deleteSite(siteName);
    await apis.user.nodes.deleteNodeById(folder1Id);
    await apis.user.nodes.deleteNodeById(file1Id);
    await apis.user.trashcan.emptyTrash();
    done();
  });

  it('Hyperlink does not appear for items in the Trash - [C284899]', async () => {
    await page.clickTrashAndWait();

    expect(await dataTable.hasLinkOnName(deletedFile1)).toBe(false, 'Link on name is present');
    expect(await dataTable.hasLinkOnName(deletedFolder1)).toBe(false, 'Link on name is present');
  });

  describe('on Personal Files', () => {
    beforeEach(async (done) => {
      await page.clickPersonalFilesAndWait();
      done();
    });

    it('Hyperlink appears when mouse over a file/folder - [C280032]', async () => {
      expect(await dataTable.hasLinkOnName(file1)).toBe(true, 'Link on name is missing');
    });

    it('File preview opens when clicking the hyperlink - [C280033]', async () => {
      await dataTable.clickNameLink(file1);

      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await Utils.pressEscape();
    });

    it('Navigate inside the folder when clicking the hyperlink - [C280034]', async () => {
      await dataTable.clickNameLink(folder1);

      expect(await breadcrumb.getCurrentItemName()).toBe(folder1);
    });
  });

  describe('on File Libraries', () => {
    beforeEach(async (done) => {
      await page.clickFileLibrariesAndWait();
      done();
    });

    it('Hyperlink appears when mouse over a library - [C284901]', async () => {
      expect(await dataTable.hasLinkOnName(siteName)).toBe(true, 'Link on site name is missing');
    });

    it('Navigate inside the library when clicking the hyperlink - [C284902]', async () => {
      await dataTable.clickNameLink(siteName);

      expect(await breadcrumb.getCurrentItemName()).toBe(siteName);
      expect(await dataTable.isItemPresent(fileSite)).toBe(true, `${fileSite} not displayed`);
    });
  });

  describe('on Shared Files', () => {
    beforeEach(async (done) => {
      await page.clickSharedFilesAndWait();
      done();
    });

    it('Hyperlink appears when mouse over a file - [C284905]', async () => {
      expect(await dataTable.hasLinkOnName(file1)).toBe(true, 'Link on name is missing');
    });

    it('File preview opens when clicking the hyperlink - [C284906]', async () => {
      await dataTable.clickNameLink(file1);

      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await Utils.pressEscape();
    });
  });

  describe('on Recent Files', () => {
    beforeEach(async (done) => {
      await page.clickRecentFilesAndWait();
      done();
    });

    it('Hyperlink appears when mouse over a file - [C284907]', async () => {
      expect(await dataTable.hasLinkOnName(file1)).toBe(true, 'Link on name is missing');
    });

    it('File preview opens when clicking the hyperlink - [C284908]', async () => {
      await dataTable.clickNameLink(file1);

      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await Utils.pressEscape();
    });
  });

  describe('on Favorites', () => {
    beforeEach(async (done) => {
      await page.clickFavoritesAndWait();
      done();
    });

    it('Hyperlink appears when mouse over a file/folder - [C284909]', async () => {
      expect(await dataTable.hasLinkOnName(file1)).toBe(true, 'Link on name is missing');
    });

    it('File preview opens when clicking the hyperlink - [C284910]', async () => {
      await dataTable.clickNameLink(file1);

      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await Utils.pressEscape();
    });

    it('Navigate inside the folder when clicking the hyperlink - [C284911]', async () => {
      await dataTable.clickNameLink(folder1);

      expect(await breadcrumb.getCurrentItemName()).toBe(folder1);
    });
  });

  describe('on Search Results', () => {
    beforeEach(async done => {
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      await page.clickPersonalFilesAndWait();
      done();
    });

    it('Hyperlink appears when mouse over a file - [C306988]', async () => {
      await searchInput.searchFor(file1);
      await dataTable.waitForBody();

      expect(await dataTable.hasLinkOnSearchResultName(file1)).toBe(true, 'Link on name is missing');
    });

    it('File preview opens when clicking the hyperlink - [C306989]', async () => {
      await searchInput.searchFor(file1);
      await dataTable.waitForBody();
      await dataTable.clickSearchResultNameLink(file1);

      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await Utils.pressEscape();
    });

    it('Navigate inside the folder when clicking the hyperlink - [C306990]', async () => {
      await searchInput.searchFor(folder1);
      await dataTable.waitForBody();
      await dataTable.clickSearchResultNameLink(folder1);

      expect(await breadcrumb.getCurrentItemName()).toBe(folder1);
    });
  });

});
