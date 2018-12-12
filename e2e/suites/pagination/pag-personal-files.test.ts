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

import { LoginPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('Pagination on multiple pages on Personal Files', () => {
  const username = `user-${Utils.random()}`;

  const apis = {
      admin: new RepoClient(),
      user: new RepoClient(username, username)
  };

  const parent = `parent-${Utils.random()}`; let parentId;
  const files = Array(101)
    .fill('file')
    .map((name, index): string => `${name}-${index + 1}.txt`);

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, pagination } = page;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
    await apis.user.nodes.createFiles(files, parent);
    await loginPage.loginWith(username);
    done();
  });

  beforeEach(async (done) => {
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(parent);
    done();
  });

  afterEach(async (done) => {
    await Utils.pressEscape();
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(parentId);
    done();
  });

  it('Pagination control default values - [C280077]', async () => {
    expect(await pagination.range.getText()).toContain('1-25 of 101');
    expect(await pagination.maxItems.getText()).toContain('25');
    expect(await pagination.currentPage.getText()).toContain('Page 1');
    expect(await pagination.totalPages.getText()).toContain('of 5');
    expect(await pagination.previousButton.isEnabled()).toBe(false, 'Previous button is enabled');
    expect(await pagination.nextButton.isEnabled()).toBe(true, 'Next button is not enabled');
  });

  it('Items per page values - [C280078]', async () => {
    await pagination.openMaxItemsMenu();
    const [ first, second, third ] = [1, 2, 3]
        .map(async nth => await pagination.menu.getNthItem(nth).getText());
    expect(first).toBe('25');
    expect(second).toBe('50');
    expect(third).toBe('100');
    await pagination.menu.closeMenu();
  });

  it('current page menu items - [C280079]', async () => {
    await pagination.openMaxItemsMenu();
    await pagination.menu.clickMenuItem('25');
    expect(await pagination.getText(pagination.maxItems)).toContain('25');
    expect(await pagination.getText(pagination.totalPages)).toContain('of 5');
    await pagination.openCurrentPageMenu();
    expect(pagination.menu.getItemsCount()).toBe(5);
    await pagination.menu.closeMenu();

    await pagination.openMaxItemsMenu();
    await pagination.menu.clickMenuItem('50');
    expect(await pagination.getText(pagination.maxItems)).toContain('50');
    expect(await pagination.getText(pagination.totalPages)).toContain('of 3');
    await pagination.openCurrentPageMenu();
    expect(pagination.menu.getItemsCount()).toBe(3);
    await pagination.menu.closeMenu();

    await pagination.openMaxItemsMenu();
    await pagination.menu.clickMenuItem('100');
    expect(await pagination.getText(pagination.maxItems)).toContain('100');
    expect(await pagination.getText(pagination.totalPages)).toContain('of 2');
    await pagination.openCurrentPageMenu();
    expect(await pagination.menu.getItemsCount()).toBe(2);
    await pagination.menu.closeMenu();

    await pagination.resetToDefaultPageSize();
  });

  it('change the current page from menu - [C280080]', async () => {
    await pagination.openCurrentPageMenu();
    await pagination.menu.clickNthItem(3);
    await dataTable.waitForHeader();
    expect(await pagination.range.getText()).toContain('51-75 of 101');
    expect(await pagination.currentPage.getText()).toContain('Page 3');
    expect(await pagination.previousButton.isEnabled()).toBe(true, 'Previous button is not enabled');
    expect(await pagination.nextButton.isEnabled()).toBe(true, 'Next button is not enabled');
    expect(await dataTable.getRowByName('file-60').isPresent()).toBe(true, 'File not found on page');

    await pagination.resetToDefaultPageNumber();
  });

  it('navigate to next and previous pages - [C280083]', async () => {
    await pagination.clickNext();
    await dataTable.waitForHeader();
    expect(await pagination.range.getText()).toContain('26-50 of 101');
    expect(await dataTable.getRowByName('file-31').isPresent()).toBe(true, 'file-31 not found on page');
    await pagination.resetToDefaultPageNumber();

    await pagination.openCurrentPageMenu();
    await pagination.menu.clickNthItem(2);
    await dataTable.waitForHeader();
    await pagination.previousButton.click();
    await dataTable.waitForHeader();
    expect(await pagination.range.getText()).toContain('1-25 of 101');
    expect(await dataTable.getRowByName('file-12').isPresent()).toBe(true, 'file-12 not found on page');

    await pagination.resetToDefaultPageNumber();
  });

  it('Previous button is disabled on first page - [C280081]', async () => {
    expect(await pagination.currentPage.getText()).toContain('Page 1');
    expect(await pagination.previousButton.isEnabled()).toBe(false, 'Previous button is enabled on first page');
  });

  it('Next button is disabled on last page - [C280082]', async () => {
    await pagination.openCurrentPageMenu();
    await pagination.menu.clickNthItem(5);
    expect(await dataTable.countRows()).toBe(1, 'Incorrect number of items on the last page');
    expect(await pagination.currentPage.getText()).toContain('Page 5');
    expect(await pagination.nextButton.isEnabled()).toBe(false, 'Next button is enabled on last page');
  });
});
