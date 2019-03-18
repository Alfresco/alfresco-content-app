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

import { browser } from 'protractor';

import { SITE_VISIBILITY } from '../../configs';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('Breadcrumb', () => {
  const username = `user-${Utils.random()}`;

  const parent = `parent-${Utils.random()}`; let parentId;
  const subFolder1 = `subFolder1-${Utils.random()}`; let subFolder1Id;
  const subFolder2 = `subFolder2-${Utils.random()}`; let subFolder2Id;
  const fileName1 = `file1-${Utils.random()}.txt`;

  const siteName = `site-${Utils.random()}`;

  const parent2 = `parent2-${Utils.random()}`; let parent2Id;
  const folder1 = `folder1-${Utils.random()}`; let folder1Id;
  const folder1Renamed = `renamed-${Utils.random()}`;

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { breadcrumb } = page;

  const apis = {
      admin: new RepoClient(),
      user: new RepoClient(username, username)
  };

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
    subFolder1Id = (await apis.user.nodes.createFolder(subFolder1, parentId)).entry.id;
    subFolder2Id = (await apis.user.nodes.createFolder(subFolder2, subFolder1Id)).entry.id;
    await apis.user.nodes.createFile(fileName1, subFolder2Id);

    parent2Id = (await apis.user.nodes.createFolder(parent2)).entry.id;
    folder1Id = (await apis.user.nodes.createFolder(folder1, parent2Id)).entry.id;

    await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
    const docLibId = await apis.user.sites.getDocLibId(siteName);
    parentId = (await apis.user.nodes.createFolder(parent, docLibId)).entry.id;
    subFolder1Id = (await apis.user.nodes.createFolder(subFolder1, parentId)).entry.id;
    subFolder2Id = (await apis.user.nodes.createFolder(subFolder2, subFolder1Id)).entry.id;
    await apis.user.nodes.createFile(fileName1, subFolder2Id);

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await Promise.all([
      apis.user.nodes.deleteNodeById(parentId),
      apis.user.nodes.deleteNodeById(parent2Id),
      apis.user.sites.deleteSite(siteName)
    ]);
    done();
  });

  it('Personal Files breadcrumb main node - [C260964]', async () => {
    await page.clickPersonalFiles();
    expect(await breadcrumb.getItemsCount()).toEqual(1, 'Breadcrumb has incorrect number of items');
    expect(await breadcrumb.getCurrentItemName()).toBe('Personal Files');
  });

  it('My Libraries breadcrumb main node - [C260966]', async () => {
    await page.goToMyLibrariesAndWait();
    expect(await breadcrumb.getItemsCount()).toEqual(1, 'Breadcrumb has incorrect number of items');
    expect(await breadcrumb.getCurrentItemName()).toBe('My Libraries');
  });

  it('Favorite Libraries breadcrumb main node - [C289891]', async () => {
    await page.goToFavoriteLibrariesAndWait();
    expect(await breadcrumb.getItemsCount()).toEqual(1, 'Breadcrumb has incorrect number of items');
    expect(await breadcrumb.getCurrentItemName()).toBe('Favorite Libraries');
  });

  it('Recent Files breadcrumb main node - [C260971]', async () => {
    await page.clickRecentFiles();
    expect(await breadcrumb.getItemsCount()).toEqual(1, 'Breadcrumb has incorrect number of items');
    expect(await breadcrumb.getCurrentItemName()).toBe('Recent Files');
  });

  it('Shared Files breadcrumb main node - [C260972]', async () => {
    await page.clickSharedFiles();
    expect(await breadcrumb.getItemsCount()).toEqual(1, 'Breadcrumb has incorrect number of items');
    expect(await breadcrumb.getCurrentItemName()).toBe('Shared Files');
  });

  it('Favorites breadcrumb main node - [C260973]', async () => {
    await page.clickFavorites();
    expect(await breadcrumb.getItemsCount()).toEqual(1, 'Breadcrumb has incorrect number of items');
    expect(await breadcrumb.getCurrentItemName()).toBe('Favorites');
  });

  it('Trash breadcrumb main node - [C260974]', async () => {
    await page.clickTrash();
    expect(await breadcrumb.getItemsCount()).toEqual(1, 'Breadcrumb has incorrect number of items');
    expect(await breadcrumb.getCurrentItemName()).toBe('Trash');
  });

  it('Personal Files breadcrumb for a folder hierarchy - [C260965]', async () => {
    await page.clickPersonalFilesAndWait();
    await page.dataTable.doubleClickOnRowByName(parent);
    await page.dataTable.doubleClickOnRowByName(subFolder1);
    await page.dataTable.doubleClickOnRowByName(subFolder2);
    const expectedBreadcrumb = [ 'Personal Files', parent, subFolder1, subFolder2 ];
    expect(await breadcrumb.getAllItems()).toEqual(expectedBreadcrumb);
  });

  it('File Libraries breadcrumb for a folder hierarchy - [C260967]', async () => {
    await page.clickFileLibrariesAndWait();
    await page.dataTable.doubleClickOnRowByName(siteName);
    await page.dataTable.doubleClickOnRowByName(parent);
    await page.dataTable.doubleClickOnRowByName(subFolder1);
    await page.dataTable.doubleClickOnRowByName(subFolder2);
    const expectedItems = [ 'My Libraries', siteName, parent, subFolder1, subFolder2 ];
    expect(await breadcrumb.getAllItems()).toEqual(expectedItems);
  });

  it('User can navigate to any location by clicking on a step from the breadcrumb - [C213235]', async () => {
    await page.clickPersonalFilesAndWait();
    await page.dataTable.doubleClickOnRowByName(parent);
    await page.dataTable.doubleClickOnRowByName(subFolder1);
    await page.dataTable.doubleClickOnRowByName(subFolder2);
    await breadcrumb.clickItem(subFolder1);
    const expectedBreadcrumb = [ 'Personal Files', parent, subFolder1 ];
    expect(await breadcrumb.getAllItems()).toEqual(expectedBreadcrumb);
  });

  it('Tooltip appears on hover on a step in breadcrumb - [C213237]', async () => {
    await page.clickPersonalFilesAndWait();
    await page.dataTable.doubleClickOnRowByName(parent);
    await page.dataTable.doubleClickOnRowByName(subFolder1);
    await page.dataTable.doubleClickOnRowByName(subFolder2);
    expect(await breadcrumb.getNthItemTooltip(3)).toEqual(subFolder1);
  });

  it('Breadcrumb updates correctly when folder is renamed - [C213238]', async () => {
    await page.clickPersonalFilesAndWait();
    await page.dataTable.doubleClickOnRowByName(parent2);
    await page.dataTable.doubleClickOnRowByName(folder1);
    await page.dataTable.wait();
    await apis.user.nodes.renameNode(folder1Id, folder1Renamed)
    await page.refresh();
    await page.dataTable.wait();
    expect(await breadcrumb.getCurrentItemName()).toEqual(folder1Renamed);
  });

  it('Browser back navigates to previous location regardless of breadcrumb steps - [C213240]', async () => {
    await page.clickPersonalFilesAndWait();
    await page.dataTable.doubleClickOnRowByName(parent);
    await page.dataTable.doubleClickOnRowByName(subFolder1);
    await page.dataTable.doubleClickOnRowByName(subFolder2);
    await page.clickTrash();
    await page.dataTable.waitForEmptyState();
    await browser.navigate().back();
    const expectedBreadcrumb = [ 'Personal Files', parent, subFolder1, subFolder2 ];
    expect(await breadcrumb.getAllItems()).toEqual(expectedBreadcrumb);
  });

  describe('as admin', () => {
    const user2 = `user2-${Utils.random()}`;
    const userFolder = `userFolder-${Utils.random()}`; let userFolderId;
    const user2Api = new RepoClient(user2, user2);

    beforeAll(async (done) => {
      await apis.admin.people.createUser({ username: user2 });
      userFolderId = (await user2Api.nodes.createFolder(userFolder)).entry.id;
      await loginPage.loginWithAdmin();
      done();
    });

    afterAll(async (done) => {
      await user2Api.nodes.deleteNodeById(userFolderId);
      done();
    });

    it(`Breadcrumb on navigation to a user's home - [C260970]`, async () => {
      await page.dataTable.doubleClickOnRowByName('User Homes');
      await page.dataTable.doubleClickOnRowByName(user2);
      expect(await breadcrumb.getAllItems()).toEqual([ 'Personal Files', 'User Homes', user2 ]);
      await page.dataTable.doubleClickOnRowByName(userFolder);
      expect(await breadcrumb.getAllItems()).toEqual([ 'Personal Files', 'User Homes', user2, userFolder ]);
    });
  });
});
