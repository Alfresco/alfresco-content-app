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

import { AdminActions, SITE_VISIBILITY, SITE_ROLES, LoginPage, BrowsingPage, Utils, RepoClient } from '@alfresco/aca-testing-shared';

describe('Shared Files', () => {
  const username = `user-${Utils.random()}`;
  const password = username;

  const siteName = `site-${Utils.random()}`;
  const fileAdmin = `fileSite-${Utils.random()}.txt`;

  const folderUser = `folder-${Utils.random()}`;
  let folderId: string;
  const file1User = `file1-${Utils.random()}.txt`;
  let file1Id: string;
  const file2User = `file2-${Utils.random()}.txt`;
  let file2Id: string;
  const file3User = `file3-${Utils.random()}.txt`;
  let file3Id: string;
  const file4User = `file4-${Utils.random()}.txt`;
  let file4Id: string;

  const apis = {
    user: new RepoClient(username, password)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, breadcrumb } = page;
  const adminApiActions = new AdminActions();

  beforeAll(async (done) => {
    await adminApiActions.createUser({ username });
    await adminApiActions.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
    await adminApiActions.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_CONSUMER.ROLE);
    const docLibId = await adminApiActions.sites.getDocLibId(siteName);
    const nodeId = (await adminApiActions.nodes.createFile(fileAdmin, docLibId)).entry.id;

    await adminApiActions.shareNodes([nodeId]);
    await adminApiActions.shared.waitForFilesToBeShared([nodeId]);

    folderId = (await apis.user.nodes.createFolder(folderUser)).entry.id;
    file1Id = (await apis.user.nodes.createFile(file1User, folderId)).entry.id;
    file2Id = (await apis.user.nodes.createFile(file2User)).entry.id;
    file3Id = (await apis.user.nodes.createFile(file3User)).entry.id;
    file4Id = (await apis.user.nodes.createFile(file4User)).entry.id;

    await apis.user.shared.shareFilesByIds([file1Id, file2Id, file3Id, file4Id]);
    await apis.user.shared.waitForFilesToBeShared([file1Id, file2Id, file3Id, file4Id]);

    await apis.user.nodes.deleteNodeById(file2Id);
    await apis.user.shared.unshareFileById(file3Id);

    await apis.user.shared.waitForFilesToNotBeShared([file2Id, file3Id]);

    await loginPage.loginWith(username);
    done();
  });

  beforeEach(async (done) => {
    await page.clickSharedFilesAndWait();
    done();
  });

  afterAll(async () => {
    await adminApiActions.sites.deleteSite(siteName);
    await apis.user.nodes.deleteNodeById(folderId);
    await apis.user.nodes.deleteNodeById(file4Id);
  });

  it('[C213113] has the correct columns', async () => {
    const expectedColumns = ['Name', 'Location', 'Size', 'Modified', 'Modified by', 'Shared by'];
    const actualColumns = await dataTable.getColumnHeadersText();

    await expect(actualColumns).toEqual(expectedColumns);
  });

  it('[C213115] default sorting column', async () => {
    expect(await dataTable.getSortedColumnHeaderText()).toBe('Modified');
    expect(await dataTable.getSortingOrder()).toBe('desc');
  });

  it('[C213114] displays the files shared by everyone', async () => {
    expect(await dataTable.isItemPresent(fileAdmin)).toBe(true, `${fileAdmin} not displayed`);
    expect(await dataTable.isItemPresent(file1User)).toBe(true, `${file1User} not displayed`);
  });

  it(`[C213117] file not displayed if it's been deleted`, async () => {
    expect(await dataTable.isItemPresent(file2User)).toBe(false, `${file2User} is displayed`);
  });

  it('[C213118] unshared file is not displayed', async () => {
    expect(await dataTable.isItemPresent(file3User)).toBe(false, `${file3User} is displayed`);
  });

  it('[C213665] Location column displays the parent folder of the file', async () => {
    expect(await dataTable.getItemLocationTooltip(file4User)).toEqual('Personal Files');
    expect(await dataTable.getItemLocation(fileAdmin)).toEqual(siteName);
    expect(await dataTable.getItemLocation(file1User)).toEqual(folderUser);
  });

  it('[C213666] Location column redirect - file in user Home', async () => {
    await dataTable.clickItemLocation(file4User);
    await expect(await breadcrumb.getAllItems()).toEqual(['Personal Files']);
  });

  it('[C280490] Location column redirect - file in folder', async () => {
    await dataTable.clickItemLocation(file1User);
    expect(await breadcrumb.getAllItems()).toEqual(['Personal Files', folderUser]);
  });

  it('[C280491] Location column redirect - file in site', async () => {
    await dataTable.clickItemLocation(fileAdmin);
    expect(await breadcrumb.getAllItems()).toEqual(['My Libraries', siteName]);
  });

  it('[C213667] Location column displays a tooltip with the entire path of the file', async () => {
    expect(await dataTable.getItemLocationTooltip(fileAdmin)).toEqual(`File Libraries/${siteName}`);
    expect(await dataTable.getItemLocationTooltip(file1User)).toEqual(`Personal Files/${folderUser}`);
  });
});
