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

import { AdminActions, LoginPage, SearchResultsPage, RepoClient, Utils, FILES } from '@alfresco/aca-testing-shared';

describe('Search sorting', () => {
  const random = Utils.random();

  const user1 = `user1-${random}`;
  const user2 = `user2-${random}`;

  const parent = `parent-${random}`;
  let parentId: string;

  const fileJpg = {
    name: `search-sort-${random}-file-1.jpg`,
    source: FILES.jpgFile
  };

  const filePdf = {
    name: `search-sort-${random}-file-2.pdf`,
    title: 'search sort title',
    description: 'search sort',
    source: FILES.pdfFile
  };

  const apis = {
    user1: new RepoClient(user1, user1),
    user2: new RepoClient(user2, user2)
  };

  const loginPage = new LoginPage();
  const page = new SearchResultsPage();
  const { searchInput } = page.header;
  const { dataTable } = page;
  const adminApiActions = new AdminActions();

  beforeAll(async (done) => {
    await adminApiActions.createUser({ username: user1 });
    await adminApiActions.createUser({ username: user2 });
    parentId = (await apis.user1.nodes.createFolder(parent)).entry.id;

    await apis.user1.nodes.setGranularPermission(parentId, true, user2, 'Collaborator');

    await apis.user1.upload.uploadFileWithRename(fileJpg.source, parentId, fileJpg.name);
    await apis.user2.upload.uploadFileWithRename(filePdf.source, parentId, filePdf.name, filePdf.title, filePdf.description);

    await apis.user1.search.waitForNodes(`search-sort-${random}`, { expect: 2 });

    await loginPage.loginWith(user1);
    done();
  });

  beforeEach(async (done) => {
    await Utils.pressEscape();
    await page.clickPersonalFilesAndWait();

    await searchInput.clickSearchButton();
    await searchInput.searchFor(`search sort ${random}`);
    await dataTable.waitForBody();
    done();
  });

  afterAll(async () => {
    await apis.user1.nodes.deleteNodeById(parentId);
  });

  it('[C277722] Sorting options are displayed', async () => {
    expect(await page.sortingPicker.isSortOrderButtonDisplayed()).toBe(true, 'Sort order button not displayed');

    await page.sortingPicker.clickSortByDropdown();

    const expectedOptions = ['Relevance', 'Filename', 'Title', 'Modified date', 'Modifier', 'Created date', 'Size', 'Type'];
    const optionListed = await page.sortingPicker.getSortByOptionsList();
    expect(optionListed).toEqual(expectedOptions, 'Incorrect sort options list');
  });

  it('[C277728] Sort by Name', async () => {
    await page.sortingPicker.sortBy('Filename', 'asc');

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(fileJpg.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(filePdf.name);

    await page.sortingPicker.sortBy('Filename', 'desc');

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(filePdf.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(fileJpg.name);
  });

  it('[C277740] Sort by Type', async () => {
    await page.sortingPicker.sortBy('Type', 'asc');

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(filePdf.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(fileJpg.name);

    await page.sortingPicker.sortBy('Type', 'desc');

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(fileJpg.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(filePdf.name);
  });

  it('[C277738] Sort by Size', async () => {
    await page.sortingPicker.sortBy('Size', 'asc');

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(filePdf.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(fileJpg.name);

    await page.sortingPicker.sortBy('Size', 'desc');

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(fileJpg.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(filePdf.name);
  });

  it('[C277734] Sort by Created date', async () => {
    await page.sortingPicker.sortBy('Created date', 'asc');

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(fileJpg.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(filePdf.name);

    await page.sortingPicker.sortBy('Created date', 'desc');

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(filePdf.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(fileJpg.name);
  });

  it('[C277736] Sort by Modified date', async () => {
    await page.sortingPicker.sortBy('Modified date', 'asc');

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(fileJpg.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(filePdf.name);

    await page.sortingPicker.sortBy('Modified date', 'desc');

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(filePdf.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(fileJpg.name);
  });

  it('[C277727] Sort by Relevance', async () => {
    await page.sortingPicker.sortBy('Relevance', 'asc');

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(fileJpg.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(filePdf.name);

    await page.sortingPicker.sortBy('Relevance', 'desc');

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(filePdf.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(fileJpg.name);
  });

  it('[C277732] Sort by Modifier', async () => {
    await page.sortingPicker.sortBy('Modifier', 'asc');

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(fileJpg.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(filePdf.name);

    await page.sortingPicker.sortBy('Modifier', 'desc');

    expect(await dataTable.getNthSearchResultsRow(1).getText()).toContain(filePdf.name);
    expect(await dataTable.getNthSearchResultsRow(2).getText()).toContain(fileJpg.name);
  });
});
