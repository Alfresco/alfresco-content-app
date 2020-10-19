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

import { BrowsingPage, Viewer, RepoClient, Utils, CoreActions } from '@alfresco/aca-testing-shared';
import { ApiService, LoginPage, UsersActions, UserModel } from '@alfresco/adf-testing';
import { browser } from 'protractor';

describe('Single click on item name', () => {
  let user: UserModel;

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

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, breadcrumb } = page;
  const viewer = new Viewer();
  const { searchInput } = page.header;

  const apiService = new ApiService();
  const usersActions = new UsersActions(apiService);
  const repo = new RepoClient(apiService);
  const coreActions = new CoreActions(apiService);

  beforeAll(async () => {
    await apiService.getInstance().login(browser.params.testConfig.users.admin.username, browser.params.testConfig.users.admin.password);
    user = await usersActions.createUser();
    await apiService.getInstance().login(user.email, user.password);

    file1Id = (await repo.nodes.createFile(file1)).entry.id;
    folder1Id = (await repo.nodes.createFolder(folder1)).entry.id;

    deletedFile1Id = (await repo.nodes.createFile(deletedFile1)).entry.id;
    deletedFolder1Id = (await repo.nodes.createFolder(deletedFolder1)).entry.id;

    await coreActions.deleteNodes([deletedFile1Id, deletedFolder1Id], false);

    await repo.sites.createSite(siteName);
    const docLibId = await repo.sites.getDocLibId(siteName);
    await repo.nodes.createFile(fileSite, docLibId);

    await loginPage.login(user.email, user.password);
  });

  afterAll(async () => {
    await coreActions.deleteSites([siteName]);
    await coreActions.deleteNodes([folder1Id, file1Id]);
    await coreActions.emptyTrashcan();
  });

  it('[C284899] Hyperlink does not appear for items in the Trash', async () => {
    await page.clickTrashAndWait();

    expect(await dataTable.hasLinkOnName(deletedFile1)).toBe(false, 'Link on name is present');
    expect(await dataTable.hasLinkOnName(deletedFolder1)).toBe(false, 'Link on name is present');
  });

  describe('on Personal Files', () => {
    beforeEach(async () => {
      await page.clickPersonalFilesAndWait();
    });

    it('[C280032] Hyperlink appears when mouse over a file/folder', async () => {
      expect(await dataTable.hasLinkOnName(file1)).toBe(true, 'Link on name is missing');
    });

    it('[C280033] File preview opens when clicking the hyperlink', async () => {
      await dataTable.clickNameLink(file1);

      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await Utils.pressEscape();
    });

    it('[C280034] Navigate inside the folder when clicking the hyperlink', async () => {
      await dataTable.clickNameLink(folder1);

      expect(await breadcrumb.currentItem.getText()).toBe(folder1);
    });
  });

  describe('on File Libraries', () => {
    beforeEach(async () => {
      await page.clickFileLibrariesAndWait();
    });

    it('[C284901] Hyperlink appears when mouse over a library', async () => {
      expect(await dataTable.hasLinkOnName(siteName)).toBe(true, 'Link on site name is missing');
    });

    it('[C284902] Navigate inside the library when clicking the hyperlink', async () => {
      await dataTable.clickNameLink(siteName);

      expect(await breadcrumb.currentItem.getText()).toBe(siteName);
      expect(await dataTable.isItemPresent(fileSite)).toBe(true, `${fileSite} not displayed`);
    });
  });

  describe('on Shared Files', () => {
    beforeAll(async () => {
      const initialSharedTotalItems = await repo.shared.getSharedLinksTotalItems();
      await coreActions.shareNodes([file1Id]);
      await repo.shared.waitForApi({ expect: initialSharedTotalItems + 1 });
    });

    beforeEach(async () => {
      await page.clickSharedFilesAndWait();
    });

    it('[C284905] Hyperlink appears when mouse over a file', async () => {
      expect(await dataTable.hasLinkOnName(file1)).toBe(true, 'Link on name is missing');
    });

    it('[C284906] File preview opens when clicking the hyperlink', async () => {
      await dataTable.clickNameLink(file1);

      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await Utils.pressEscape();
    });
  });

  describe('on Recent Files', () => {
    beforeEach(async () => {
      await page.clickRecentFilesAndWait();
    });

    it('[C284907] Hyperlink appears when mouse over a file', async () => {
      expect(await dataTable.hasLinkOnName(file1)).toBe(true, 'Link on name is missing');
    });

    it('[C284908] File preview opens when clicking the hyperlink', async () => {
      await dataTable.clickNameLink(file1);

      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await Utils.pressEscape();
    });
  });

  describe('on Favorites', () => {
    beforeAll(async () => {
      const initialFavoriteTotalItems = await repo.favorites.getFavoritesTotalItems();
      await repo.favorites.addFavoriteById('file', file1Id);
      await repo.favorites.addFavoriteById('folder', folder1Id);
      await repo.favorites.waitForApi({ expect: initialFavoriteTotalItems + 2 });
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
      const initialRecentTotalItems = await repo.search.getTotalItems(user.username);
      await repo.search.waitForApi(user.username, { expect: initialRecentTotalItems + 2 });
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
