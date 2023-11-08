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

import { AdminActions, LoginPage, SearchResultsPage, RepoClient, Utils } from '@alfresco/aca-testing-shared';

describe('Search results - files and folders', () => {
  const random = Utils.random();
  const username = `user-${random}`;

  const file = `test-file-${random}.txt`;
  let fileId: string;
  const fileTitle = 'file title';
  const fileDescription = 'file description';

  /* cspell:disable-next-line */
  const fileRussian = `любимый-сайт-${random}`;
  let fileRussianId: string;

  const folder = `test-folder-${random}`;
  let folderId: string;
  const folderTitle = 'folder title';
  const folderDescription = 'folder description';

  const site = `test-site-${random}`;

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new SearchResultsPage();
  const { searchInput } = page.pageLayoutHeader;
  const { dataTable, breadcrumb, toolbar } = page;
  const adminApiActions = new AdminActions();

  beforeAll(async () => {
    await adminApiActions.createUser({ username });

    fileId = (await apis.user.nodes.createFile(file, '-my-', fileTitle, fileDescription)).entry.id;
    await apis.user.nodes.updateNodeContent(fileId, 'edited by user');
    folderId = (await apis.user.nodes.createFolder(folder, '-my-', folderTitle, folderDescription)).entry.id;
    fileRussianId = (await apis.user.nodes.createFile(fileRussian)).entry.id;
    await apis.user.sites.createSite(site);

    await apis.user.search.waitForApi(username, { expect: 2 });
    await apis.user.queries.waitForSites(site, { expect: 1 });

    await loginPage.loginWith(username);
  });

  beforeEach(async () => {
    await page.refresh();
    await page.clickPersonalFilesAndWait();
  });

  afterAll(async () => {
    await Promise.all([
      apis.user.nodes.deleteNodeById(fileId),
      apis.user.nodes.deleteNodeById(fileRussianId),
      apis.user.nodes.deleteNodeById(folderId),
      apis.user.sites.deleteSite(site)
    ]);
  });

  it('[C290029] Search file with special characters', async () => {
    await toolbar.clickSearchIconButton();
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(fileRussian);
    await dataTable.waitForBody();

    expect(await dataTable.isItemPresent(fileRussian)).toBe(true, `${fileRussian} is not displayed`);
  });

  it('[C279177] Location column redirect - file in user Home', async () => {
    await toolbar.clickSearchIconButton();
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(file);
    await dataTable.waitForBody();

    await dataTable.clickItemLocation(file);
    expect(await breadcrumb.getAllItems()).toEqual(['Personal Files']);
  });
});
