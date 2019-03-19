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

import { SITE_VISIBILITY, SITE_ROLES } from '../../configs';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('Favorites', () => {
  const username = `user-${Utils.random()}`;

  const siteName = `site-${Utils.random()}`;
  const favFolderName = `favFolder-${Utils.random()}`;
  const parentFolder = `parent-${Utils.random()}`;
  const fileName1 = `file1-${Utils.random()}.txt`;
  const fileName2 = `file2-${Utils.random()}.txt`;
  const fileName3 = `file3-${Utils.random()}.txt`;
  const fileName4 = `file4-${Utils.random()}.txt`;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, breadcrumb } = page;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });

    await apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
    const docLibId = await apis.admin.sites.getDocLibId(siteName);
    await apis.admin.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_MANAGER.ROLE);

    const file1Id = (await apis.admin.nodes.createFile(fileName1, docLibId)).entry.id;
    const folderId = (await apis.user.nodes.createFolder(favFolderName)).entry.id;
    const parentId = (await apis.user.nodes.createFolder(parentFolder)).entry.id;
    const file2Id = (await apis.user.nodes.createFile(fileName2, parentId)).entry.id;
    const file3Id = (await apis.user.nodes.createFile(fileName3, parentId)).entry.id;
    const file4Id = (await apis.user.nodes.createFile(fileName4, parentId)).entry.id;

    await apis.user.favorites.addFavoriteById('file', file1Id);
    await apis.user.favorites.addFavoriteById('folder', folderId);
    await apis.user.favorites.addFavoriteById('file', file2Id);
    await apis.user.favorites.addFavoriteById('file', file3Id);
    await apis.user.favorites.addFavoriteById('file', file4Id);
    await apis.user.nodes.deleteNodeById(file3Id, false);
    await apis.user.nodes.deleteNodeById(file4Id, false);
    await apis.user.trashcan.restore(file4Id);

    await loginPage.loginWith(username);
    done();
  });

  beforeEach(async (done) => {
    await page.clickFavoritesAndWait();
    done();
  });

  afterAll(async (done) => {
    await apis.admin.sites.deleteSite(siteName);
    await apis.user.nodes.deleteNodes([ favFolderName, parentFolder ]);
    await apis.user.trashcan.emptyTrash();
    done();
  });

  it('has the correct columns - [C280482]', async () => {
    const expectedColumns = [ 'Thumbnail', 'Name', 'Location', 'Size', 'Modified', 'Modified by' ];
    const actualColumns = await dataTable.getColumnHeadersText();

    expect(actualColumns).toEqual(expectedColumns);
  });

  it('displays the favorite files and folders - [C213226]', async () => {
    expect(await dataTable.countRows()).toEqual(4, 'Incorrect number of items displayed');
    expect(await dataTable.isItemPresent(fileName1)).toBe(true, `${fileName1} not displayed`);
    expect(await dataTable.isItemPresent(fileName2)).toBe(true, `${fileName2} not displayed`);
    expect(await dataTable.isItemPresent(favFolderName)).toBe(true, `${favFolderName} not displayed`);
  });

  it(`deleted favorite file does not appear - [C213228]`, async () => {
    expect(await dataTable.isItemPresent(fileName3)).not.toBe(true, `${fileName3} is displayed`);
  });

  it(`file is displayed after it is restored from Trashcan - [C213229]`, async () => {
    expect(await dataTable.isItemPresent(fileName4)).toBe(true, `${fileName4} not displayed`);
  });

  it('Location column displays the parent folder of the files - [C213231]', async () => {
    expect(await dataTable.getItemLocation(fileName1)).toEqual(siteName);
    expect(await dataTable.getItemLocation(fileName2)).toEqual(parentFolder);
    expect(await dataTable.getItemLocation(favFolderName)).toEqual('Personal Files');
  });

  it('Location column displays a tooltip with the entire path of the file - [C213671]', async () => {
    expect(await dataTable.getItemLocationTooltip(fileName1)).toEqual(`File Libraries/${siteName}`);
    expect(await dataTable.getItemLocationTooltip(fileName2)).toEqual(`Personal Files/${parentFolder}`);
    expect(await dataTable.getItemLocationTooltip(favFolderName)).toEqual('Personal Files');
  });

  it('Location column redirect - item in user Home - [C213650]', async () => {
    await dataTable.clickItemLocation(favFolderName);
    expect(await breadcrumb.getAllItems()).toEqual([ 'Personal Files' ]);
  });

  it('Location column redirect - file in folder - [C280484]', async () => {
    await dataTable.clickItemLocation(fileName2);
    expect(await breadcrumb.getAllItems()).toEqual([ 'Personal Files', parentFolder ]);
  });

  it('Location column redirect - file in site - [C280485]', async () => {
    await dataTable.clickItemLocation(fileName1);
    expect(await breadcrumb.getAllItems()).toEqual([ 'My Libraries', siteName ]);
  });

  it('Navigate into folder from Favorites - [C213230]', async () => {
    await dataTable.doubleClickOnRowByName(favFolderName);
    await dataTable.waitForEmptyState();
    expect(await breadcrumb.getCurrentItemName()).toBe(favFolderName);
  });
});
