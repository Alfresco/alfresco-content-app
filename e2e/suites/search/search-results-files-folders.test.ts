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

import { LoginPage, SearchResultsPage } from '../../pages/pages';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
import * as moment from 'moment';

describe('Search results - files and folders', () => {
  const username = `user-${Utils.random()}`;

  const file = `test-file-${Utils.random()}.txt`;
  let fileId;
  const fileTitle = 'file title';
  const fileDescription = 'file description';

  /* cspell:disable-next-line */
  const fileRussian = `любимый-сайт-${Utils.random()}`;
  let fileRussianId;

  const folder = `test-folder-${Utils.random()}`;
  let folderId;
  const folderTitle = 'folder title';
  const folderDescription = 'folder description';

  const site = `test-site-${Utils.random()}`;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new SearchResultsPage();
  const { searchInput } = page.header;
  const { dataTable, breadcrumb } = page;

  beforeAll(async done => {
    await apis.admin.people.createUser({ username });

    fileId = (await apis.user.nodes.createFile(
      file,
      '-my-',
      fileTitle,
      fileDescription
    )).entry.id;
    await apis.user.nodes.editNodeContent(fileId, 'edited by user');
    folderId = (await apis.user.nodes.createFolder(
      folder,
      '-my-',
      folderTitle,
      folderDescription
    )).entry.id;
    fileRussianId = (await apis.user.nodes.createFile(fileRussian)).entry.id;
    await apis.user.sites.createSite(site);

    await apis.user.search.waitForApi(username, { expect: 2 });
    await apis.user.queries.waitForSites(site, { expect: 1 });

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async done => {
    await Promise.all([
      apis.user.nodes.deleteNodeById(fileId),
      apis.user.nodes.deleteNodeById(fileRussianId),
      apis.user.nodes.deleteNodeById(folderId),
      apis.user.sites.deleteSite(site)
    ]);
    done();
  });

  beforeEach(async done => {
    await page.refresh();
    done();
  });

  it('Results page title - [C307002]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor('test-');
    await dataTable.waitForBody();

    expect(await page.breadcrumb.getCurrentItemName()).toEqual(
      'Search Results'
    );
  });

  it('File information - [C279183]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor('test-');
    await dataTable.waitForBody();

    const fileEntry = await apis.user.nodes.getNodeById(fileId);
    const modifiedDate = moment(fileEntry.entry.modifiedAt).format(
      'MMM D, YYYY, h:mm:ss A'
    );
    const modifiedBy = fileEntry.entry.modifiedByUser.displayName;
    const size = fileEntry.entry.content.sizeInBytes;

    expect(await dataTable.isItemPresent(file)).toBe(
      true,
      `${file} is not displayed`
    );

    expect(await dataTable.getRowCellsCount(file)).toEqual(
      2,
      'incorrect number of columns'
    );

    expect(await dataTable.getSearchResultLinesCount(file)).toEqual(
      4,
      'incorrect number of lines for search result'
    );
    expect(await dataTable.getSearchResultNameAndTitle(file)).toBe(
      `${file} ( ${fileTitle} )`
    );
    expect(await dataTable.getSearchResultDescription(file)).toBe(
      fileDescription
    );
    expect(await dataTable.getSearchResultModified(file)).toBe(
      `Modified: ${modifiedDate} by ${modifiedBy} | Size: ${size} Bytes`
    );
    expect(await dataTable.getSearchResultLocation(file)).toMatch(
      /Location:\s+Personal Files/
    );
  });

  it('Folder information - [C306867]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor('test-');
    await dataTable.waitForBody();

    const folderEntry = await apis.user.nodes.getNodeById(folderId);
    const modifiedDate = moment(folderEntry.entry.modifiedAt).format(
      'MMM D, YYYY, h:mm:ss A'
    );
    const modifiedBy = folderEntry.entry.modifiedByUser.displayName;

    expect(await dataTable.isItemPresent(folder)).toBe(
      true,
      `${folder} is not displayed`
    );

    expect(await dataTable.getRowCellsCount(folder)).toEqual(
      2,
      'incorrect number of columns'
    );

    expect(await dataTable.getSearchResultLinesCount(folder)).toEqual(
      4,
      'incorrect number of lines for search result'
    );
    expect(await dataTable.getSearchResultNameAndTitle(folder)).toBe(
      `${folder} ( ${folderTitle} )`
    );
    expect(await dataTable.getSearchResultDescription(folder)).toBe(
      folderDescription
    );
    expect(await dataTable.getSearchResultModified(folder)).toBe(
      `Modified: ${modifiedDate} by ${modifiedBy}`
    );
    expect(await dataTable.getSearchResultLocation(folder)).toMatch(
      /Location:\s+Personal Files/
    );
  });

  it('Search file with special characters - [C290029]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(fileRussian);
    await dataTable.waitForBody();

    expect(await dataTable.isItemPresent(fileRussian)).toBe(
      true,
      `${fileRussian} is not displayed`
    );
  });

  it('Location column redirect - file in user Home - [C279177]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(file);
    await dataTable.waitForBody();

    await dataTable.clickItemLocation(file);
    expect(await breadcrumb.getAllItems()).toEqual(['Personal Files']);
  });
});
