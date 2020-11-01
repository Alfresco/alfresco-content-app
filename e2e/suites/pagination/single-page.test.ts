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

import { BrowsingPage, SearchResultsPage, Utils, RepoClient, CoreActions } from '@alfresco/aca-testing-shared';
import { ApiService, UsersActions, LoginPage } from '@alfresco/adf-testing';
import { browser } from 'protractor';

describe('Pagination on single page', () => {
  const random = Utils.random();

  let username;

  const siteName = `site-${random}`;
  let siteId: string;

  const file = `file-${random}.txt`;
  let fileId: string;
  const fileInTrash = `fileInTrash-${random}.txt`;
  let fileInTrashId: string;

  const apiService = new ApiService();
  const usersActions = new UsersActions(apiService);
  const coreActions = new CoreActions(apiService);
  const userApi = new RepoClient(apiService);

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { pagination } = page;
  const { searchInput } = page.header;
  const searchResultsPage = new SearchResultsPage();

  beforeAll(async () => {
    await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
    username = await usersActions.createUser();
    await apiService.getInstance().login(username.email, username.password);

    const initialFavoriteTotalItems = await userApi.favorites.getFavoritesTotalItems();
    const initialRecentFilesTotalItems = await userApi.search.getTotalItems(username);
    const initialSharedTotalItems = await userApi.shared.getSharedLinksTotalItems();
    const initialTrashTotalItems = await coreActions.getTrashcanSize();

    fileId = (await userApi.nodes.createFile(file)).entry.id;
    fileInTrashId = (await userApi.nodes.createFile(fileInTrash)).entry.id;
    siteId = (await userApi.sites.createSite(siteName)).entry.id;

    await userApi.nodes.deleteNodeById(fileInTrashId, false);
    await userApi.favorites.addFavoriteById('file', fileId);
    await coreActions.shareNodes([fileId]);

    await userApi.favorites.waitForApi({ expect: initialFavoriteTotalItems + 2 });
    await userApi.search.waitForApi(username, { expect: initialRecentFilesTotalItems + 1 });
    await userApi.shared.waitForApi({ expect: initialSharedTotalItems + 1 });
    await coreActions.waitForTrashcanSize(initialTrashTotalItems + 1);

    await loginPage.login(username.email, username.password);
  });

  afterAll(async () => {
    await coreActions.deleteNodes([fileId]);
    await coreActions.deleteSites([siteId]);
    await coreActions.emptyTrashcan();
  });

  it('[C280112] page selector not displayed on Favorites', async () => {
    await page.clickFavoritesAndWait();
    expect(await pagination.isPagesButtonPresent()).toBe(false, 'page selector displayed');
  });

  it('[C280085] page selector not displayed on My Libraries', async () => {
    await page.goToMyLibrariesAndWait();
    expect(await pagination.isPagesButtonPresent()).toBe(false, 'page selector displayed');
  });

  it('[C291874] page selector not displayed on Favorite Libraries', async () => {
    await page.goToFavoriteLibrariesAndWait();
    expect(await pagination.isPagesButtonPresent()).toBe(false, 'page selector displayed');
  });

  it('[C280076] page selector not displayed on Personal Files', async () => {
    await page.clickPersonalFilesAndWait();
    expect(await pagination.isPagesButtonPresent()).toBe(false, 'page selector displayed');
  });

  it('[C280103] page selector not displayed on Recent Files', async () => {
    await page.clickRecentFilesAndWait();
    expect(await pagination.isPagesButtonPresent()).toBe(false, 'page selector displayed');
  });

  it('[C280094] page selector not displayed on Shared Files', async () => {
    await page.clickSharedFilesAndWait();
    expect(await pagination.isPagesButtonPresent()).toBe(false, 'page selector displayed');
  });

  it('[C280121] page selector not displayed on Trash', async () => {
    await page.clickTrashAndWait();
    expect(await pagination.isPagesButtonPresent()).toBe(false, 'page selector displayed');
  });

  it('[C290124] page selector not displayed on Search results', async () => {
    await searchInput.clickSearchButton();
    await searchInput.searchFor(file);
    await searchResultsPage.waitForResults();
    expect(await pagination.isPagesButtonPresent()).toBe(false, 'page selector displayed');
  });
});
