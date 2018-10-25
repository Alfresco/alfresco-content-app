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

import { SITE_VISIBILITY, SIDEBAR_LABELS } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('Recent Files', () => {
  const username = `user-${Utils.random()}`;

  const folderName = `folder-${Utils.random()}`; let folderId;
  const fileName1 = `file-${Utils.random()}.txt`;
  const fileName2 = `file-${Utils.random()}.txt`; let file2Id;
  const fileName3 = `file-${Utils.random()}.txt`;

  const siteName = `site-${Utils.random()}`;
  const folderSite = `folder2-${Utils.random()}`; let folderSiteId;
  const fileSite = `file-${Utils.random()}.txt`;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const logoutPage = new LogoutPage();
  const recentFilesPage = new BrowsingPage();
  const { dataTable, breadcrumb } = recentFilesPage;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    folderId = (await apis.user.nodes.createFolders([ folderName ])).entry.id;
    await apis.user.nodes.createFiles([ fileName1 ], folderName);
    file2Id = (await apis.user.nodes.createFiles([ fileName2 ])).entry.id;
    const id = (await apis.user.nodes.createFiles([ fileName3 ])).entry.id;
    await apis.user.nodes.deleteNodeById(id, false);

    await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
    const docLibId = await apis.user.sites.getDocLibId(siteName);
    folderSiteId = (await apis.user.nodes.createFolder(folderSite, docLibId)).entry.id;
    await apis.user.nodes.createFile(fileSite, folderSiteId);

    await apis.user.search.waitForApi(username, { expect: 3 });

    await loginPage.loginWith(username);
    done();
  });

  beforeEach(async (done) => {
    await recentFilesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES);
    await dataTable.waitForHeader();
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodesById([ folderId, file2Id ]);
    await apis.user.sites.deleteSite(siteName);
    await apis.admin.trashcan.emptyTrash();
    await logoutPage.load();
    done();
  });

  it('has the correct columns - [C213168]', async () => {
    const labels = [ 'Name', 'Location', 'Size', 'Modified' ];
    const elements = labels.map(label => dataTable.getColumnHeaderByLabel(label));

    expect(await dataTable.getColumnHeaders().count()).toBe(4 + 1, 'Incorrect number of columns');

    await elements.forEach(async (element, index) => {
      expect(await element.isPresent()).toBe(true, `"${labels[index]}" is missing`);
    });
  });

  it('default sorting column - [C213171]', async () => {
    expect(await dataTable.getSortedColumnHeader().getText()).toBe('Modified');
    expect(await dataTable.getSortingOrder()).toBe('desc');
  });

  it('displays the files added by the current user in the last 30 days - [C213170]', async () => {
    expect(await dataTable.countRows()).toEqual(3, 'Incorrect number of files displayed');
    expect(await dataTable.getRowByName(fileName1).isPresent()).toBe(true, `${fileName1} not displayed`);
    expect(await dataTable.getRowByName(fileName2).isPresent()).toBe(true, `${fileName2} not displayed`);
    expect(await dataTable.getRowByName(fileSite).isPresent()).toBe(true, `${fileSite} not displayed`);
  });

  it(`file not displayed if it's been deleted - [C213174]`, async () => {
    expect(await dataTable.getRowByName(fileName3).isPresent()).not.toBe(true, `${fileName3} is displayed`);
  });

  it('Location column displays the parent folder of the file - [C213175]', async () => {
    expect(await dataTable.getItemLocation(fileName1)).toEqual(folderName);
    expect(await dataTable.getItemLocation(fileName2)).toEqual('Personal Files');
    expect(await dataTable.getItemLocation(fileSite)).toEqual(folderSite);
  });

  it('Location column displays a tooltip with the entire path of the file - [C213177]', async () => {
    expect(await dataTable.getItemLocationTileAttr(fileName1)).toEqual(`Personal Files/${folderName}`);
    expect(await dataTable.getItemLocationTileAttr(fileName2)).toEqual('Personal Files');
    expect(await dataTable.getItemLocationTileAttr(fileSite)).toEqual(`File Libraries/${siteName}/${folderSite}`);
  });

  it('Location column redirect - file in user Home - [C213176]', async () => {
    await dataTable.clickItemLocation(fileName2);
    expect(await breadcrumb.getAllItems()).toEqual([ 'Personal Files' ]);
  });

  it('Location column redirect - file in folder - [C280486]', async () => {
    await dataTable.clickItemLocation(fileName1);
    expect(await breadcrumb.getAllItems()).toEqual([ 'Personal Files', folderName ]);
  });

  it('Location column redirect - file in site - [C280487]', async () => {
    await dataTable.clickItemLocation(fileSite);
    expect(await breadcrumb.getAllItems()).toEqual([ 'File Libraries', siteName, folderSite ]);
  });
});
