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
import { browser } from 'protractor';

describe('Search results general', () => {
  const username = `user-${Utils.random()}`;

  const file = `test-file-${Utils.random()}.txt`; let fileId;
  const folder = `test-folder-${Utils.random()}`; let folderId;
  const site = `test-site-${Utils.random()}`;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new SearchResultsPage();
  const { searchInput } = page.header;
  const dataTable = page.dataTable;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });

    fileId = (await apis.user.nodes.createFile(file)).entry.id;
    folderId = (await apis.user.nodes.createFolder(folder)).entry.id;
    await apis.user.sites.createSite(site);

    await apis.user.search.waitForApi(username, { expect: 1 });
    await apis.user.queries.waitForSites(site, { expect: 1 });

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await Promise.all([
      apis.user.nodes.deleteNodeById(fileId),
      apis.user.nodes.deleteNodeById(folderId),
      apis.user.sites.deleteSite(site)
    ]);
    done();
  });

  beforeEach(async (done) => {
    await page.refresh();
    done();
  });

  it('Only files are returned when Files option is the only one checked - [C290005]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkOnlyFiles();
    await searchInput.searchFor('test');
    await dataTable.waitForBody();

    expect(await dataTable.isItemPresent(file)).toBe(true, `${file} not displayed`);
    expect(await dataTable.isItemPresent(folder)).toBe(false, `${folder} is displayed`);
    expect(await dataTable.isItemPresent(site)).toBe(false, `${site} is displayed`);
  });

  it('Only folders are returned when Folders option is the only one checked - [C290006]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkOnlyFolders();
    await searchInput.searchFor('test');
    await page.waitForResults();

    expect(await dataTable.isItemPresent(file)).toBe(false, `${file} is displayed`);
    expect(await dataTable.isItemPresent(folder)).toBe(true, `${folder} not displayed`);
    expect(await dataTable.isItemPresent(site)).toBe(false, `${site} is displayed`);
  });

  it('Files and folders are returned when both Files and Folders options are checked - [C290007]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor('test');
    await page.waitForResults();

    expect(await dataTable.isItemPresent(file)).toBe(true, `${file} not displayed`);
    expect(await dataTable.isItemPresent(folder)).toBe(true, `${folder} not displayed`);
    expect(await dataTable.isItemPresent(site)).toBe(false, `${site} is displayed`);
  });

  it('Only libraries are returned when Libraries option is checked - [C290008]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor('test');
    await page.waitForResults();

    expect(await dataTable.isItemPresent(file)).toBe(false, `${file} is displayed`);
    expect(await dataTable.isItemPresent(folder)).toBe(false, `${folder} is displayed`);
    expect(await dataTable.isItemPresent(site)).toBe(true, `${site} not displayed`);
  });

  it('Results are updated automatically when changing the search term - [C279162]', async () => {
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

  it('Results are returned when accessing an URL containing a search query - [C279178]', async () => {
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
