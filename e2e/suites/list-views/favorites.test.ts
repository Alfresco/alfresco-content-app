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

import { ApiActions, SITE_VISIBILITY, SITE_ROLES, BrowsingPage, Utils, RepoClient } from '@alfresco/aca-testing-shared';
import { ApiService, UsersActions, LoginPage } from '@alfresco/adf-testing';

describe('Favorites', () => {
  const siteName = `site-${Utils.random()}`;
  const favFolderName = `favFolder-${Utils.random()}`;
  const parentFolder = `parent-${Utils.random()}`;
  const fileName1 = `file1-${Utils.random()}.txt`;
  const fileName2 = `file2-${Utils.random()}.txt`;
  const fileName3 = `file3-${Utils.random()}.txt`;
  const fileName4 = `file4-${Utils.random()}.txt`;

  const apiService = new ApiService();
  const repoClient = new RepoClient(apiService);
  const adminApiService = new ApiService();
  const adminApiActions = new ApiActions(adminApiService);
  const apiActions = new ApiActions(apiService);
  const usersActions = new UsersActions(adminApiService);

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, breadcrumb } = page;

  let parentId: string;
  let folderId: string;

  beforeAll(async (done) => {
    await adminApiService.loginWithProfile('admin');
    const user = await usersActions.createUser();
    await apiService.login(user.username, user.password);

    await adminApiActions.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
    const docLibId = await adminApiActions.sites.getDocLibId(siteName);
    await adminApiActions.sites.addSiteMember(siteName, user.username, SITE_ROLES.SITE_MANAGER.ROLE);

    const file1Id = (await adminApiActions.nodes.createFile(fileName1, docLibId)).entry.id;
    folderId = (await repoClient.nodes.createFolder(favFolderName)).entry.id;
    parentId = (await repoClient.nodes.createFolder(parentFolder)).entry.id;
    const file2Id = (await repoClient.nodes.createFile(fileName2, parentId)).entry.id;
    const file3Id = (await repoClient.nodes.createFile(fileName3, parentId)).entry.id;
    const file4Id = (await repoClient.nodes.createFile(fileName4, parentId)).entry.id;

    await repoClient.favorites.addFavoriteById('file', file1Id);
    await repoClient.favorites.addFavoriteById('folder', folderId);
    await repoClient.favorites.addFavoriteById('file', file2Id);
    await repoClient.favorites.addFavoriteById('file', file3Id);
    await repoClient.favorites.addFavoriteById('file', file4Id);

    await apiActions.deleteNodes([file3Id, file4Id], false);
    await apiActions.trashcanApi.restoreDeletedNode(file4Id);
    await loginPage.loginWith(user.username, user.password);
    done();
  });

  beforeEach(async (done) => {
    await page.clickFavoritesAndWait();
    done();
  });

  afterAll(async (done) => {
    await apiActions.deleteNodes([folderId, parentId]);
    await apiActions.emptyTrashcan();

    await adminApiService.loginWithProfile('admin');
    await adminApiActions.deleteSites([siteName]);
    done();
  });

  it('[C280482] has the correct columns', async () => {
    const expectedColumns = ['Name', 'Location', 'Size', 'Modified', 'Modified by'];
    const actualColumns = await dataTable.getColumnHeadersText();

    await expect(actualColumns).toEqual(expectedColumns);
  });

  it('[C213226] displays the favorite files and folders', async () => {
    await expect(await dataTable.getRowsCount()).toEqual(4, 'Incorrect number of items displayed');
    await expect(await dataTable.isItemPresent(fileName1)).toBe(true, `${fileName1} not displayed`);
    await expect(await dataTable.isItemPresent(fileName2)).toBe(true, `${fileName2} not displayed`);
    await expect(await dataTable.isItemPresent(favFolderName)).toBe(true, `${favFolderName} not displayed`);
  });

  it(`[C213228] deleted favorite file does not appear`, async () => {
    expect(await dataTable.isItemPresent(fileName3)).not.toBe(true, `${fileName3} is displayed`);
  });

  it(`[C213229] file is displayed after it is restored from Trashcan`, async () => {
    expect(await dataTable.isItemPresent(fileName4)).toBe(true, `${fileName4} not displayed`);
  });

  it('[C213231] Location column displays the parent folder of the files', async () => {
    expect(await dataTable.getItemLocation(fileName1)).toEqual(siteName);
    expect(await dataTable.getItemLocation(fileName2)).toEqual(parentFolder);
    expect(await dataTable.getItemLocation(favFolderName)).toEqual('Personal Files');
  });

  it('[C213671] Location column displays a tooltip with the entire path of the file', async () => {
    expect(await dataTable.getItemLocationTooltip(fileName1)).toEqual(`File Libraries/${siteName}`);
    expect(await dataTable.getItemLocationTooltip(fileName2)).toEqual(`Personal Files/${parentFolder}`);
    expect(await dataTable.getItemLocationTooltip(favFolderName)).toEqual('Personal Files');
  });

  it('[C213650] Location column redirect - item in user Home', async () => {
    await dataTable.clickItemLocation(favFolderName);
    await expect(await breadcrumb.getAllItems()).toEqual(['Personal Files']);
  });

  it('[C280484] Location column redirect - file in folder', async () => {
    await dataTable.clickItemLocation(fileName2);
    await expect(await breadcrumb.getAllItems()).toEqual(['Personal Files', parentFolder]);
  });

  it('[C280485] Location column redirect - file in site', async () => {
    await dataTable.clickItemLocation(fileName1);
    expect(await breadcrumb.getAllItems()).toEqual(['My Libraries', siteName]);
  });

  it('[C213230] Navigate into folder from Favorites', async () => {
    await dataTable.doubleClickOnRowByName(favFolderName);
    await dataTable.waitForEmptyState();
    expect(await breadcrumb.currentItem.getText()).toBe(favFolderName);
  });
});
