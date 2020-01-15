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

import { LoginPage, SearchResultsPage } from '../../pages/pages';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
import { FILES } from '../../configs';

describe('Search sorting', () => {
  const random = Utils.random();

  const user1 = `user1-${random}`;
  const user2 = `user2-${random}`;

  const parent = `parent-${random}`;
  let parentId: string;

  const fileJpg = {
    name: `search-sort-file-1-${random}.jpg`,
    source: FILES.jpgFile
  };

  const filePdf = {
    name: `search-sort-file-2-${random}.pdf`,
    title: 'search sort title',
    description: 'search sort',
    source: FILES.pdfFile
  };

  const apis = {
    admin: new RepoClient(),
    user1: new RepoClient(user1, user1),
    user2: new RepoClient(user2, user2)
  };

  const loginPage = new LoginPage();
  const page = new SearchResultsPage();
  const { searchInput } = page.header;
  const { dataTable } = page;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username: user1 });
    await apis.admin.people.createUser({ username: user2 });
    parentId = (await apis.user1.nodes.createFolder(parent)).entry.id;

    await apis.user1.nodes.setGranularPermission(parentId, true, user2, 'Collaborator');

    await apis.user1.upload.uploadFileWithRename(fileJpg.source, parentId, fileJpg.name);
    await apis.user2.upload.uploadFileWithRename(filePdf.source, parentId, filePdf.name, filePdf.title, filePdf.description);

    await apis.user1.search.waitForNodes('search-sort', { expect: 2 });

    await loginPage.loginWith(user1);
    done();
  });

  beforeEach(async (done) => {
    await Utils.pressEscape();
    await page.clickPersonalFilesAndWait();

    await searchInput.clickSearchButton();
    await searchInput.searchFor('search sort');
    await dataTable.waitForBody();
    done();
  });

  afterAll(async () => {
    await apis.user1.nodes.deleteNodeById(parentId);
  });

  it('Sorting options are displayed - [C277722]', async () => {
    expect(await page.sortingPicker.isSortOrderButtonDisplayed()).toBe(true, 'Sort order button not displayed');
    expect(await page.sortingPicker.isSortByOptionDisplayed()).toBe(true, 'Sort options not displayed');
    expect(await page.sortingPicker.getSortOrder()).toBe('DESC', 'Incorrect default sort order');
    expect(await page.sortingPicker.getSelectedSortByOption()).toBe('Relevance', 'Incorrect selected sort option');

    await page.sortingPicker.clickSortByDropdown();

    const expectedOptions = [ 'Relevance', 'Filename', 'Title', 'Modified date', 'Modifier', 'Created date', 'Size', 'Type' ];
    expect(await page.sortingPicker.getSortByOptionsList()).toEqual(expectedOptions, 'Incorrect sort options list');
  });

  it('Sort by Name - [C277728]', async () => {
    await page.sortingPicker.sortByName();
    await page.sortingPicker.setSortOrderASC();

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(fileJpg.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(filePdf.name);

    await page.sortingPicker.sortByName();
    await page.sortingPicker.setSortOrderDESC();

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(filePdf.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(fileJpg.name);
  });

  it('Sort by Type - [C277740]', async () => {
    await page.sortingPicker.sortByType();
    await page.sortingPicker.setSortOrderASC();

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(filePdf.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(fileJpg.name);

    await page.sortingPicker.sortByType();
    await page.sortingPicker.setSortOrderDESC();

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(fileJpg.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(filePdf.name);
  });

  it('Sort by Size - [C277738]', async () => {
    await page.sortingPicker.sortBySize();
    await page.sortingPicker.setSortOrderASC();

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(filePdf.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(fileJpg.name);

    await page.sortingPicker.sortBySize();
    await page.sortingPicker.setSortOrderDESC();

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(fileJpg.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(filePdf.name);
  });

  it('Sort by Created date - [C277734]', async () => {
    await page.sortingPicker.sortByCreatedDate();
    await page.sortingPicker.setSortOrderASC();

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(fileJpg.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(filePdf.name);

    await page.sortingPicker.sortByCreatedDate();
    await page.sortingPicker.setSortOrderDESC();

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(filePdf.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(fileJpg.name);
  });

  it('Sort by Modified date - [C277736]', async () => {
    await page.sortingPicker.sortByModifiedDate();
    await page.sortingPicker.setSortOrderASC();

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(fileJpg.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(filePdf.name);

    await page.sortingPicker.sortByModifiedDate();
    await page.sortingPicker.setSortOrderDESC();

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(filePdf.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(fileJpg.name);
  });

  it('Sort by Relevance - [C277727]', async () => {
    await page.sortingPicker.sortByRelevance();
    await page.sortingPicker.setSortOrderASC();

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(fileJpg.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(filePdf.name);

    await page.sortingPicker.sortByRelevance();
    await page.sortingPicker.setSortOrderDESC();

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(filePdf.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(fileJpg.name);
  });

  it('Sort by Modifier - [C277732]', async () => {
    await page.sortingPicker.sortByModifier();
    await page.sortingPicker.setSortOrderASC();

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(fileJpg.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(filePdf.name);

    await page.sortingPicker.sortByModifier();
    await page.sortingPicker.setSortOrderDESC();

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(filePdf.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(fileJpg.name);
  });
});
