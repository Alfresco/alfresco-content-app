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

import { BrowsingPage, LoginPage, Utils } from '@alfresco/aca-testing-shared';

export function recentFilesTests(username: string) {
  const page = new BrowsingPage();
  const loginPage = new LoginPage();
  const { dataTable, pagination } = page;

  describe('Pagination controls : ', () => {
    beforeAll(async () => {
      await loginPage.loginWith(username);
      await page.clickRecentFilesAndWait();
    });

    afterEach(async () => {
      await Utils.pressEscape();
    });

    it('[C280104] Pagination control default values', async () => {
      expect(await pagination.getRange()).toContain('1-25 of 51');
      expect(await pagination.getMaxItems()).toContain('25');
      expect(await pagination.getCurrentPage()).toContain('Page 1');
      expect(await pagination.getTotalPages()).toContain('of 3');
      expect(await pagination.isPreviousEnabled()).toBe(false, 'Previous button is enabled');
      expect(await pagination.isNextEnabled()).toBe(true, 'Next button is not enabled');
    });

    it('[C280105] Items per page values', async () => {
      await pagination.openMaxItemsMenu();
      expect(await pagination.menu.getNthItem(1).getText()).toBe('25');
      expect(await pagination.menu.getNthItem(2).getText()).toBe('50');
      expect(await pagination.menu.getNthItem(3).getText()).toBe('100');
      await pagination.menu.closeMenu();
    });

    it('[C280106] current page menu items', async () => {
      await pagination.openMaxItemsMenu();
      await pagination.menu.clickMenuItem('25');
      expect(await pagination.getMaxItems()).toContain('25');
      expect(await pagination.getTotalPages()).toContain('of 3');
      await pagination.openCurrentPageMenu();
      expect(await pagination.menu.getItemsCount()).toBe(3);
      await pagination.menu.closeMenu();

      await pagination.openMaxItemsMenu();
      await pagination.menu.clickMenuItem('50');
      expect(await pagination.getMaxItems()).toContain('50');
      expect(await pagination.getTotalPages()).toContain('of 2');
      await pagination.openCurrentPageMenu();
      expect(await pagination.menu.getItemsCount()).toBe(2);
      await pagination.menu.closeMenu();

      await pagination.openMaxItemsMenu();
      await pagination.menu.clickMenuItem('100');
      expect(await pagination.getMaxItems()).toContain('100');
      expect(await pagination.getTotalPages()).toContain('of 1');

      await pagination.resetToDefaultPageSize();
    });

    it('[C280107] change the current page from menu', async () => {
      await pagination.openCurrentPageMenu();
      await pagination.menu.clickNthItem(3);
      await dataTable.waitForHeader();
      expect(await pagination.getRange()).toContain('51-');
      expect(await pagination.getCurrentPage()).toContain('Page 3');
      expect(await pagination.isPreviousEnabled()).toBe(true, 'Previous button is not enabled');
      expect(await pagination.isNextEnabled()).toBe(false, 'Next button is enabled');
      expect(await dataTable.isItemPresent('my-file-1')).toBe(true, 'File not found on page');

      await pagination.resetToDefaultPageNumber();
    });

    it('[C280110] navigate to next and previous pages', async () => {
      await pagination.clickNext();
      await dataTable.waitForHeader();
      expect(await pagination.getRange()).toContain('26-50 of');
      expect(await dataTable.isItemPresent('my-file-21')).toBe(true, 'File not found on page');
      await pagination.resetToDefaultPageNumber();

      await pagination.openCurrentPageMenu();
      await pagination.menu.clickNthItem(2);
      await dataTable.waitForHeader();
      await pagination.clickPrevious();
      await dataTable.waitForHeader();
      expect(await pagination.getRange()).toContain('1-25 of');
      expect(await dataTable.isItemPresent('my-file-50')).toBe(true, 'File not found on page');

      await pagination.resetToDefaultPageNumber();
    });

    it('[C280108] Previous button is disabled on first page', async () => {
      expect(await pagination.getCurrentPage()).toContain('Page 1');
      expect(await pagination.isPreviousEnabled()).toBe(false, 'Previous button is enabled on first page');
    });

    it('[C280109] Next button is disabled on last page', async () => {
      await pagination.openCurrentPageMenu();
      await pagination.menu.clickNthItem(3);
      expect(await dataTable.getRowsCount()).toBe(1, 'Incorrect number of items on the last page');
      expect(await pagination.getCurrentPage()).toContain('Page 3');
      expect(await pagination.isNextEnabled()).toBe(false, 'Next button is enabled on last page');
    });
  });
}
