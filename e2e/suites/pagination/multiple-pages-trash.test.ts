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

import { BrowsingPage, Utils, RepoClient, CoreActions } from '@alfresco/aca-testing-shared';
import { ApiService, LoginPage, UsersActions, UserModel } from '@alfresco/adf-testing';
import { browser } from 'protractor';

describe('Pagination on multiple pages on Trash', () => {
  const random = Utils.random();

  let user: UserModel;
  const filesForDelete = Array(101)
    .fill('file')
    .map((name, index): string => `${name}-${index + 1}-${random}.txt`);
  let filesDeletedIds: string[];

  const apiService = new ApiService();
  const usersActions = new UsersActions(apiService);
  const coreActions = new CoreActions(apiService);
  const userApi = new RepoClient(apiService);

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, pagination } = page;

  beforeAll(async () => {
    await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
    user = await usersActions.createUser();
    await apiService.getInstance().login(user.email, user.password);

    filesDeletedIds = (await userApi.nodes.createFiles(filesForDelete)).list.entries.map((entries: any) => entries.entry.id);

    await coreActions.deleteNodes(filesDeletedIds, false);
    await coreActions.waitForTrashcanSize(101);

    await loginPage.login(user.email, user.password);
    await page.clickTrashAndWait();
  }, 120000);

  afterEach(async () => {
    await Utils.pressEscape();
  });

  afterAll(async () => {
    await coreActions.emptyTrashcan();
  });

  it('[C280122] Pagination control default values', async () => {
    expect(await pagination.getRange()).toContain('1-25 of 101');
    expect(await pagination.getMaxItems()).toContain('25');
    expect(await pagination.getCurrentPage()).toContain('Page 1');
    expect(await pagination.getTotalPages()).toContain('of 5');
    expect(await pagination.isPreviousEnabled()).toBe(false, 'Previous button is enabled');
    expect(await pagination.isNextEnabled()).toBe(true, 'Next button is not enabled');
  });

  it('[C280123] Items per page values', async () => {
    await pagination.openMaxItemsMenu();
    expect(await pagination.menu.getNthItem(1).getText()).toBe('25');
    expect(await pagination.menu.getNthItem(2).getText()).toBe('50');
    expect(await pagination.menu.getNthItem(3).getText()).toBe('100');
    await pagination.menu.closeMenu();
  });

  it('[C280124] current page menu items', async () => {
    await pagination.openMaxItemsMenu();
    await pagination.menu.clickMenuItem('25');
    expect(await pagination.getMaxItems()).toContain('25');
    expect(await pagination.getTotalPages()).toContain('of 5');
    await pagination.openCurrentPageMenu();
    expect(await pagination.menu.getItemsCount()).toBe(5);
    await pagination.menu.closeMenu();

    await pagination.openMaxItemsMenu();
    await pagination.menu.clickMenuItem('50');
    expect(await pagination.getMaxItems()).toContain('50');
    expect(await pagination.getTotalPages()).toContain('of 3');
    await pagination.openCurrentPageMenu();
    expect(await pagination.menu.getItemsCount()).toBe(3);
    await pagination.menu.closeMenu();

    await pagination.openMaxItemsMenu();
    await pagination.menu.clickMenuItem('100');
    expect(await pagination.getMaxItems()).toContain('100');
    expect(await pagination.getTotalPages()).toContain('of 2');
    await pagination.openCurrentPageMenu();
    expect(await pagination.menu.getItemsCount()).toBe(2);
    await pagination.menu.closeMenu();

    await pagination.resetToDefaultPageSize();
  });

  it('[C280125] change the current page from menu', async () => {
    await pagination.openCurrentPageMenu();
    await pagination.menu.clickNthItem(3);
    await dataTable.waitForHeader();
    expect(await pagination.getRange()).toContain('51-75 of 101');
    expect(await pagination.getCurrentPage()).toContain('Page 3');
    expect(await pagination.isPreviousEnabled()).toBe(true, 'Previous button is not enabled');
    expect(await pagination.isNextEnabled()).toBe(true, 'Next button is not enabled');
    expect(await dataTable.isItemPresent('file-40')).toBe(true, 'File not found on page');

    await pagination.resetToDefaultPageNumber();
  });

  it('[C280128] navigate to next and previous pages', async () => {
    await pagination.clickNext();
    await dataTable.waitForHeader();
    expect(await pagination.getRange()).toContain('26-50 of 101');
    expect(await dataTable.isItemPresent('file-70')).toBe(true, 'File not found on page');
    await pagination.resetToDefaultPageNumber();

    await pagination.openCurrentPageMenu();
    await pagination.menu.clickNthItem(2);
    await dataTable.waitForHeader();
    await pagination.clickPrevious();
    await dataTable.waitForHeader();
    expect(await pagination.getRange()).toContain('1-25 of 101');
    expect(await dataTable.isItemPresent('file-88')).toBe(true, 'File not found on page');

    await pagination.resetToDefaultPageNumber();
  });

  it('[C280126] Previous button is disabled on first page', async () => {
    expect(await pagination.getCurrentPage()).toContain('Page 1');
    expect(await pagination.isPreviousEnabled()).toBe(false, 'Previous button is enabled on first page');
  });

  it('[C280127] Next button is disabled on last page', async () => {
    await pagination.openCurrentPageMenu();
    await pagination.menu.clickNthItem(5);
    expect(await dataTable.getRowsCount()).toBe(1, 'Incorrect number of items on the last page');
    expect(await pagination.getCurrentPage()).toContain('Page 5');
    expect(await pagination.isNextEnabled()).toBe(false, 'Next button is enabled on last page');
  });
});
