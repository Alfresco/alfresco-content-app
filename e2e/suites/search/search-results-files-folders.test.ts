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

import { AdminActions, LoginPage, SearchResultsPage, RepoClient, Utils } from '@alfresco/aca-testing-shared';
const moment = require('moment');

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
  const { searchInput } = page.header;
  const { dataTable, breadcrumb } = page;
  const adminApiActions = new AdminActions();

  beforeAll(async (done) => {
    await adminApiActions.createUser({ username });

    fileId = (await apis.user.nodes.createFile(file, '-my-', fileTitle, fileDescription)).entry.id;
    await apis.user.nodes.updateNodeContent(fileId, 'edited by user');
    folderId = (await apis.user.nodes.createFolder(folder, '-my-', folderTitle, folderDescription)).entry.id;
    fileRussianId = (await apis.user.nodes.createFile(fileRussian)).entry.id;
    await apis.user.sites.createSite(site);

    await apis.user.search.waitForApi(username, { expect: 2 });
    await apis.user.queries.waitForSites(site, { expect: 1 });

    await loginPage.loginWith(username);
    done();
  });

  beforeEach(async (done) => {
    await page.refresh();
    done();
  });

  afterAll(async (done) => {
    await Promise.all([
      apis.user.nodes.deleteNodeById(fileId),
      apis.user.nodes.deleteNodeById(fileRussianId),
      apis.user.nodes.deleteNodeById(folderId),
      apis.user.sites.deleteSite(site)
    ]);
    done();
  });

  it('[C307002] Results page title', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(random);
    await dataTable.waitForBody();

    expect(await page.breadcrumb.currentItem.getText()).toEqual('Search Results');
  });

  it('[C279183] File information', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(random);
    await dataTable.waitForBody();

    const fileEntry = await apis.user.nodes.getNodeById(fileId);
    const modifiedDate = moment(fileEntry.entry.modifiedAt).format('MMM D, YYYY, h:mm:ss A');
    const modifiedBy = fileEntry.entry.modifiedByUser.displayName;
    const size = fileEntry.entry.content.sizeInBytes;

    expect(await dataTable.isItemPresent(file)).toBe(true, `${file} is not displayed`);
    expect(await dataTable.getRowCellsCount(file)).toEqual(2, 'incorrect number of columns');
    expect(await dataTable.getSearchResultLinesCount(file)).toEqual(4, 'incorrect number of lines for search result');
    expect(await dataTable.getSearchResultNameAndTitle(file)).toBe(`${file} ( ${fileTitle} )`);
    expect(await dataTable.getSearchResultDescription(file)).toBe(fileDescription);
    expect(await dataTable.getSearchResultModified(file)).toBe(`Modified: ${modifiedDate} by ${modifiedBy} | Size: ${size} Bytes`);
    expect(await dataTable.getSearchResultLocation(file)).toMatch(/Location:\s+Personal Files/);
  });

  it('[C306867] Folder information', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(random);
    await dataTable.waitForBody();

    const folderEntry = await apis.user.nodes.getNodeById(folderId);
    const modifiedDate = moment(folderEntry.entry.modifiedAt).format('MMM D, YYYY, h:mm:ss A');
    const modifiedBy = folderEntry.entry.modifiedByUser.displayName;

    expect(await dataTable.isItemPresent(folder)).toBe(true, `${folder} is not displayed`);
    expect(await dataTable.getRowCellsCount(folder)).toEqual(2, 'incorrect number of columns');
    expect(await dataTable.getSearchResultLinesCount(folder)).toEqual(4, 'incorrect number of lines for search result');
    expect(await dataTable.getSearchResultNameAndTitle(folder)).toBe(`${folder} ( ${folderTitle} )`);
    expect(await dataTable.getSearchResultDescription(folder)).toBe(folderDescription);
    expect(await dataTable.getSearchResultModified(folder)).toBe(`Modified: ${modifiedDate} by ${modifiedBy}`);
    expect(await dataTable.getSearchResultLocation(folder)).toMatch(/Location:\s+Personal Files/);
  });

  it('[C290029] Search file with special characters', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(fileRussian);
    await dataTable.waitForBody();

    expect(await dataTable.isItemPresent(fileRussian)).toBe(true, `${fileRussian} is not displayed`);
  });

  it('[C279177] Location column redirect - file in user Home', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(file);
    await dataTable.waitForBody();

    await dataTable.clickItemLocation(file);
    expect(await breadcrumb.getAllItems()).toEqual(['Personal Files']);
  });
});
