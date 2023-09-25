/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { AdminActions, UserActions, LoginPage, BrowsingPage, Viewer, RepoClient, Utils } from '@alfresco/aca-testing-shared';

describe('Single click on item name', () => {
  const username = `user-${Utils.random()}`;

  const file1 = `file1-${Utils.random()}.txt`;
  let file1Id: string;
  const folder1 = `folder1-${Utils.random()}`;
  let folder1Id: string;

  const deletedFile1 = `file1-${Utils.random()}.txt`;
  let deletedFile1Id: string;
  const deletedFolder1 = `folder1-${Utils.random()}`;
  let deletedFolder1Id: string;

  const siteName = `site-${Utils.random()}`;
  const fileSite = `fileSite-${Utils.random()}.txt`;

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, breadcrumb, toolbar } = page;
  const viewer = new Viewer();
  const { searchInput } = page.pageLayoutHeader;

  const adminApiActions = new AdminActions();
  const userActions = new UserActions();

  beforeAll(async () => {
    await adminApiActions.createUser({ username });

    const initialRecentTotalItems = await apis.user.search.getTotalItems(username);

    file1Id = (await apis.user.nodes.createFile(file1)).entry.id;
    folder1Id = (await apis.user.nodes.createFolder(folder1)).entry.id;

    await apis.user.sites.createSite(siteName);
    const docLibId = await apis.user.sites.getDocLibId(siteName);
    await apis.user.nodes.createFile(fileSite, docLibId);

    await apis.user.search.waitForApi(username, { expect: initialRecentTotalItems + 2 });

    deletedFile1Id = (await apis.user.nodes.createFile(deletedFile1)).entry.id;
    deletedFolder1Id = (await apis.user.nodes.createFolder(deletedFolder1)).entry.id;

    await userActions.login(username, username);
    await userActions.deleteNodes([deletedFile1Id, deletedFolder1Id], false);

    await loginPage.loginWith(username);
  });

  afterAll(async () => {
    await userActions.login(username, username);
    await userActions.deleteSites([siteName]);
    await userActions.deleteNodes([folder1Id, file1Id]);
    await userActions.emptyTrashcan();
  });

  describe('on Favorites', () => {
    beforeAll(async () => {
      const initialFavoriteTotalItems = await apis.user.favorites.getFavoritesTotalItems();
      await apis.user.favorites.addFavoriteById('file', file1Id);
      await apis.user.favorites.addFavoriteById('folder', folder1Id);
      await apis.user.favorites.waitForApi({ expect: initialFavoriteTotalItems + 2 });
    });

    beforeEach(async () => {
      await page.clickFavoritesAndWait();
    });

    it('[C284909] Hyperlink appears when mouse over a file/folder', async () => {
      expect(await dataTable.hasLinkOnName(file1)).toBe(true, 'Link on name is missing');
    });

    it('[C284910] File preview opens when clicking the hyperlink', async () => {
      await dataTable.clickNameLink(file1);

      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await Utils.pressEscape();
    });

    it('[C284911] Navigate inside the folder when clicking the hyperlink', async () => {
      await dataTable.clickNameLink(folder1);

      expect(await breadcrumb.currentItem.getText()).toBe(folder1);
    });
  });

  describe('on Search Results', () => {
    beforeEach(async () => {
      await toolbar.clickSearchIconButton();
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
    });

    afterEach(async () => {
      await Utils.pressEscape();
      await page.clickPersonalFilesAndWait();
    });

    it('[C306988] Hyperlink appears when mouse over a file', async () => {
      await searchInput.searchFor(file1);
      await dataTable.waitForBody();

      expect(await dataTable.hasLinkOnSearchResultName(file1)).toBe(true, 'Link on name is missing');
    });

    it('[C306989] File preview opens when clicking the hyperlink', async () => {
      await searchInput.searchFor(file1);
      await dataTable.waitForBody();
      await dataTable.clickSearchResultNameLink(file1);

      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await Utils.pressEscape();
    });

    it('[C306990] Navigate inside the folder when clicking the hyperlink', async () => {
      await searchInput.searchFor(folder1);
      await dataTable.waitForBody();
      await dataTable.clickSearchResultNameLink(folder1);

      expect(await breadcrumb.currentItem.getText()).toBe(folder1);
    });
  });
});
