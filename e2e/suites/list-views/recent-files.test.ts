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

import { AdminActions, UserActions, SITE_VISIBILITY, LoginPage, BrowsingPage, Utils, RepoClient } from '@alfresco/aca-testing-shared';

describe('Recent Files', () => {
  const username = `user-${Utils.random()}`;

  const folderName = `folder-${Utils.random()}`;
  let folderId: string;
  const fileName1 = `file-${Utils.random()}.txt`;
  const fileName2 = `file-${Utils.random()}.txt`;
  let file2Id: string;
  const fileName3 = `file-${Utils.random()}.txt`;

  const siteName = `site-${Utils.random()}`;
  const folderSite = `folder2-${Utils.random()}`;
  let folderSiteId: string;
  const fileSite = `file-${Utils.random()}.txt`;

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, breadcrumb } = page;

  const adminApiActions = new AdminActions();
  const userActions = new UserActions();

  beforeAll(async (done) => {
    await adminApiActions.createUser({ username });

    folderId = (await apis.user.nodes.createFolders([folderName])).entry.id;
    await apis.user.nodes.createFiles([fileName1], folderName);
    file2Id = (await apis.user.nodes.createFiles([fileName2])).entry.id;
    const id = (await apis.user.nodes.createFiles([fileName3])).entry.id;

    await userActions.login(username, username);
    await userActions.deleteNodes([id], false);

    await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
    const docLibId = await apis.user.sites.getDocLibId(siteName);
    folderSiteId = (await apis.user.nodes.createFolder(folderSite, docLibId)).entry.id;
    await apis.user.nodes.createFile(fileSite, folderSiteId);

    await apis.user.search.waitForApi(username, { expect: 3 });

    await loginPage.loginWith(username);
    done();
  });

  beforeEach(async (done) => {
    await page.clickRecentFilesAndWait();
    done();
  });

  afterAll(async (done) => {
    await userActions.login(username, username);
    await userActions.deleteNodes([folderId, file2Id]);
    await userActions.deleteSites([siteName]);
    await userActions.emptyTrashcan();
    done();
  });

  it('[C213168] has the correct columns', async () => {
    const expectedColumns = ['Name', 'Location', 'Size', 'Modified'];
    const actualColumns = await dataTable.getColumnHeadersText();

    await expect(actualColumns).toEqual(expectedColumns);
  });

  it('[C213171] default sorting column', async () => {
    expect(await dataTable.getSortedColumnHeaderText()).toBe('Modified');
    expect(await dataTable.getSortingOrder()).toBe('desc');
  });

  it('[C213170] displays the files added by the current user in the last 30 days', async () => {
    expect(await dataTable.getRowsCount()).toEqual(3, 'Incorrect number of files displayed');
    expect(await dataTable.isItemPresent(fileName1)).toBe(true, `${fileName1} not displayed`);
    expect(await dataTable.isItemPresent(fileName2)).toBe(true, `${fileName2} not displayed`);
    expect(await dataTable.isItemPresent(fileSite)).toBe(true, `${fileSite} not displayed`);
  });

  it(`[C213174] file not displayed if it's been deleted`, async () => {
    expect(await dataTable.isItemPresent(fileName3)).not.toBe(true, `${fileName3} is displayed`);
  });

  it('[C213175] Location column displays the parent folder of the file', async () => {
    expect(await dataTable.getItemLocation(fileName1)).toEqual(folderName);
    expect(await dataTable.getItemLocation(fileName2)).toEqual('Personal Files');
    expect(await dataTable.getItemLocation(fileSite)).toEqual(folderSite);
  });

  it('[C213177] Location column displays a tooltip with the entire path of the file', async () => {
    expect(await dataTable.getItemLocationTooltip(fileName1)).toEqual(`Personal Files/${folderName}`);
    expect(await dataTable.getItemLocationTooltip(fileName2)).toEqual('Personal Files');
    expect(await dataTable.getItemLocationTooltip(fileSite)).toEqual(`File Libraries/${siteName}/${folderSite}`);
  });

  it('[C213176] Location column redirect - file in user Home', async () => {
    await dataTable.clickItemLocation(fileName2);
    await expect(await breadcrumb.getAllItems()).toEqual(['Personal Files']);
  });

  it('[C280486] Location column redirect - file in folder', async () => {
    await dataTable.clickItemLocation(fileName1);
    expect(await breadcrumb.getAllItems()).toEqual(['Personal Files', folderName]);
  });

  it('[C280487] Location column redirect - file in site', async () => {
    await dataTable.clickItemLocation(fileSite);
    expect(await breadcrumb.getAllItems()).toEqual(['My Libraries', siteName, folderSite]);
  });
});
