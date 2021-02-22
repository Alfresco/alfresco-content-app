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

import { SearchResultsPage, RepoClient, Utils } from '@alfresco/aca-testing-shared';
import { browser } from 'protractor';
import { ApiService, LoginPage, UsersActions } from '@alfresco/adf-testing';

describe('Search results general', () => {
  const random = Utils.random();

  const file = `test-file-${random}.txt`;
  let fileId: string;
  const folder = `test-folder-${random}`;
  let folderId: string;
  const site = `test-site-${random}`;

  const apiService = new ApiService();
  const repoClient = new RepoClient(apiService);
  const adminApiService = new ApiService();
  const usersActions = new UsersActions(adminApiService);

  const loginPage = new LoginPage();
  const page = new SearchResultsPage();
  const { searchInput } = page.header;
  const dataTable = page.dataTable;

  beforeAll(async (done) => {
    await adminApiService.loginWithProfile('admin');
    const user = await usersActions.createUser();
    await apiService.login(user.username, user.password);

    fileId = (await repoClient.nodes.createFile(file)).entry.id;
    folderId = (await repoClient.nodes.createFolder(folder)).entry.id;
    await repoClient.sites.createSite(site);

    await repoClient.search.waitForApi(user.username, { expect: 1 });
    await repoClient.queries.waitForSites(site, { expect: 1 });

    await loginPage.login(user.username, user.password);
    done();
  });

  afterAll(async (done) => {
    await Promise.all([repoClient.nodes.deleteNodeById(fileId), repoClient.nodes.deleteNodeById(folderId), repoClient.sites.deleteSite(site)]);
    done();
  });

  beforeEach(async (done) => {
    await page.refresh();
    done();
  });

  it('[C290005] Only files are returned when Files option is the only one checked', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkOnlyFiles();
    await searchInput.searchFor(random);
    await dataTable.waitForBody();

    expect(await dataTable.isItemPresent(file)).toBe(true, `${file} not displayed`);
    expect(await dataTable.isItemPresent(folder)).toBe(false, `${folder} is displayed`);
    expect(await dataTable.isItemPresent(site)).toBe(false, `${site} is displayed`);
  });

  it('[C290006] Only folders are returned when Folders option is the only one checked', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkOnlyFolders();
    await searchInput.searchFor(random);
    await page.waitForResults();

    expect(await dataTable.isItemPresent(file)).toBe(false, `${file} is displayed`);
    expect(await dataTable.isItemPresent(folder)).toBe(true, `${folder} not displayed`);
    expect(await dataTable.isItemPresent(site)).toBe(false, `${site} is displayed`);
  });

  it('[C290007] Files and folders are returned when both Files and Folders options are checked', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(random);
    await page.waitForResults();

    expect(await dataTable.isItemPresent(file)).toBe(true, `${file} not displayed`);
    expect(await dataTable.isItemPresent(folder)).toBe(true, `${folder} not displayed`);
    expect(await dataTable.isItemPresent(site)).toBe(false, `${site} is displayed`);
  });

  it('[C290008] Only libraries are returned when Libraries option is checked', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor(random);
    await page.waitForResults();

    expect(await dataTable.isItemPresent(file)).toBe(false, `${file} is displayed`);
    expect(await dataTable.isItemPresent(folder)).toBe(false, `${folder} is displayed`);
    expect(await dataTable.isItemPresent(site)).toBe(true, `${site} not displayed`);
  });

  it('[C279162] Results are updated automatically when changing the search term', async () => {
    await searchInput.clickSearchButton();
    await searchInput.searchFor(file);
    await page.waitForResults();

    expect(await dataTable.isItemPresent(file)).toBe(true, `${file} is not displayed`);
    expect(await dataTable.isItemPresent(folder)).toBe(false, `${folder} is displayed`);

    await searchInput.clickSearchButton();
    await searchInput.searchFor(folder);

    expect(await dataTable.isItemPresent(file)).toBe(false, `${file} is displayed`);
    expect(await dataTable.isItemPresent(folder)).toBe(true, `${folder} is not displayed`);
  });

  it('[C279178] Results are returned when accessing an URL containing a search query', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor(site);
    await page.waitForResults();

    expect(await dataTable.isItemPresent(site)).toBe(true, `${site} not displayed`);

    const url = await browser.getCurrentUrl();

    await page.clickPersonalFiles();
    await browser.get(url);
    await page.waitForResults();

    expect(await dataTable.isItemPresent(site)).toBe(true, `${site} not displayed`);
  });
});
