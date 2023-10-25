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

import {
  AdminActions,
  LoginPage,
  SearchResultsPage,
  RepoClient,
  Utils,
  FILES,
  SITE_VISIBILITY,
  SITE_ROLES,
  SizeOperator
} from '@alfresco/aca-testing-shared';
import { BrowserActions } from '@alfresco/adf-testing';

describe('Search filters', () => {
  const random = Utils.random();

  const user1 = `user1-${random}`;

  const user2 = `user2-${random}`;

  const parent = `parent-${random}`;
  let parentId: string;

  const site = `site-${Utils.random()}`;
  let docLibId: string;

  const fileJpgUser1 = {
    name: `search-filters-file-1-${random}.jpg`,
    source: FILES.jpgFile
  };

  const filePdfUser2 = {
    name: `search-filters-file-2-${random}.pdf`,
    title: 'search filters title',
    description: 'search filters',
    source: FILES.pdfFile
  };

  const expectedFileTypes = ['pdf', 'wpd'];

  const apis = {
    user1: new RepoClient(user1, user1),
    user2: new RepoClient(user2, user2)
  };

  const loginPage = new LoginPage();
  const page = new SearchResultsPage();
  const { searchInput } = page.pageLayoutHeader;
  const { dataTable, filters, toolbar } = page;

  const fileTypeFilter = filters.fileType;
  const createdDateFilter = filters.createdDate;
  const peopleFilter = filters.people;
  const locationFilter = filters.location;
  const modifiedDateFilter = filters.modifiedDate;
  const adminApiActions = new AdminActions();

  beforeAll(async () => {
    await adminApiActions.createUser({ username: user1 });
    await adminApiActions.createUser({ username: user2 });
    parentId = (await apis.user1.nodes.createFolder(parent)).entry.id;
    await apis.user1.sites.createSite(site, SITE_VISIBILITY.PUBLIC);
    await apis.user1.sites.addSiteMember(site, user2, SITE_ROLES.SITE_MANAGER.ROLE);
    docLibId = await adminApiActions.sites.getDocLibId(site);

    await apis.user1.nodes.setGranularPermission(parentId, true, user2, 'Collaborator');

    await apis.user1.upload.uploadFileWithRename(fileJpgUser1.source, docLibId, fileJpgUser1.name);
    await apis.user2.upload.uploadFileWithRename(filePdfUser2.source, parentId, filePdfUser2.name, filePdfUser2.title, filePdfUser2.description);

    await apis.user1.search.waitForNodes(`search-filters-${random}`, { expect: 2 });

    await loginPage.loginWith(user1);
  });

  beforeEach(async () => {
    await Utils.pressEscape();
    await page.clickPersonalFilesAndWait();
    await toolbar.clickSearchIconButton();
    await searchInput.clickSearchButton();
    await searchInput.searchFor(`search-filters-${random}`);
    await dataTable.waitForBody();
  });

  afterAll(async () => {
    await Promise.all([apis.user1.nodes.deleteNodeById(parentId), apis.user1.sites.deleteSite(site)]);
  });

  it('[C279186] Filters are displayed', async () => {
    expect(await createdDateFilter.isDisplayed()).toBe(true, 'Created date filter panel not displayed');
    expect(await fileTypeFilter.isDisplayed()).toBe(true, 'File type filter panel not displayed');
    expect(await peopleFilter.isDisplayed()).toBe(true, 'People filter panel not displayed');
    expect(await locationFilter.isDisplayed()).toBe(true, 'Location filter panel not displayed');
    expect(await modifiedDateFilter.isDisplayed()).toBe(true, 'Modified date filter panel not displayed');
  });

  describe('Filter by Size', () => {
    afterEach(async () => {
      await fileTypeFilter.openDialog();
      await fileTypeFilter.clickResetButton();
    });

    it('[C279199] Filter existing', async () => {
      await fileTypeFilter.openDialog();
      await fileTypeFilter.typeFileSize('1024');
      await fileTypeFilter.selectFileSizeOperator(SizeOperator.AT_MOST);
      await fileTypeFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, `${fileJpgUser1.name} not in the list`);
      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, `${filePdfUser2.name} not in the list`);
    });

    it('[C279199] Filter non existing', async () => {
      await fileTypeFilter.openDialog();
      await fileTypeFilter.typeFileSize('512000');
      await fileTypeFilter.clickApplyButton();

      expect(await dataTable.isEmpty()).toBe(true, 'list is not empty');
    });

    it('[C279198] Clear the Size filter options', async () => {
      await fileTypeFilter.openDialog();
      await fileTypeFilter.typeFileSize('1024');
      await fileTypeFilter.selectFileSizeOperator(SizeOperator.AT_MOST);
      await fileTypeFilter.clickApplyButton();

      await fileTypeFilter.openDialog();
      expect(await fileTypeFilter.getFileSizeValue()).toEqual('1024', 'Incorrect file size');
      expect(await fileTypeFilter.getFileSizeOperatorValue()).toEqual(SizeOperator.AT_MOST, 'Incorrect file size operator');
      await fileTypeFilter.clickResetButton();
      await fileTypeFilter.closeDialog();
      await fileTypeFilter.openDialog();
      expect(await fileTypeFilter.getFileSizeValue()).toEqual('', 'Incorrect file size');
      expect(await fileTypeFilter.getFileSizeOperatorValue()).toEqual(SizeOperator.AT_LEAST, 'Incorrect file size operator');
    });
  });

  describe('Filter by File type', () => {
    afterEach(async () => {
      await Utils.pressEscape();
      await BrowserActions.click(filters.resetAllButton);
    });

    it('[C279191] Expand / Collapse the File type filter panel', async () => {
      await fileTypeFilter.openDialog();
      expect(await fileTypeFilter.isDialogPresent()).toBe(true, 'File type filter panel not expanded');
      expect(await fileTypeFilter.getFileTypesValues('pd')).toEqual(expectedFileTypes, 'Incorrect File type filters facets');

      await fileTypeFilter.closeDialog();
      expect(await fileTypeFilter.isDialogPresent()).toBe(false, 'File type filter panel is expanded');
    });

    it('[C279192] Results are filtered by File type', async () => {
      await fileTypeFilter.openDialog();
      await fileTypeFilter.selectFileType('pdf');
      await fileTypeFilter.clickApplyButton();
      expect(await fileTypeFilter.getChipTitle()).toEqual('pdf');

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(false, 'JPG file is displayed');

      await fileTypeFilter.openDialog();
      await fileTypeFilter.selectFileType('jpg');
      await fileTypeFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await fileTypeFilter.getChipTitle()).toEqual(['pdf', 'jpg'].join(', '));
    });

    it('[C279193] Clear the File type filter options', async () => {
      await fileTypeFilter.openDialog();
      await fileTypeFilter.selectFileType('pdf');
      await fileTypeFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(false, 'JPG file is displayed');

      await fileTypeFilter.openDialog();
      expect(await fileTypeFilter.getSelectedFileTypeOptions()).toEqual(['pdf']);
      await fileTypeFilter.clickResetButton();
      await fileTypeFilter.closeDialog();
      await fileTypeFilter.openDialog();
      await fileTypeFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await fileTypeFilter.getChipTitle()).toEqual('');
    });
  });

  describe('Filter by People', () => {
    afterEach(async () => {
      await Utils.pressEscape();
      await BrowserActions.click(filters.resetAllButton);
    });

    it('[C279205] Expand / Collapse the People filter panel', async () => {
      await peopleFilter.openDialog();
      expect(await peopleFilter.isDialogPresent()).toBe(true, 'People filter panel not expanded');

      expect(await peopleFilter.getCurrentTabLabel()).toEqual('Creator', 'Incorrect Creator tab label');
      expect(await peopleFilter.isChipListDisplayed()).toBe(true, 'Creator chip list is not displayed');

      await peopleFilter.changeTabToModifier();
      expect(await peopleFilter.getCurrentTabLabel()).toEqual('Modifier', 'Incorrect Modifier tab label');
      expect(await peopleFilter.isChipListDisplayed()).toBe(true, 'Modifier chip list is not displayed');

      await peopleFilter.closeDialog();
      expect(await peopleFilter.isDialogPresent()).toBe(false, 'People filter panel is expanded');
    });

    it('[C279206] Results are filtered by Creator', async () => {
      await peopleFilter.openDialog();
      await peopleFilter.selectChip(`${user1} ${user1}`);
      await peopleFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(false, 'PDF file is displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await peopleFilter.getChipTitle()).toEqual(`Created by: ${user1} ${user1} `);

      await BrowserActions.click(filters.resetAllButton);
      await peopleFilter.openDialog();
      await peopleFilter.selectChip(`${user2} ${user2}`);
      await peopleFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(false, 'JPG file not displayed');
      expect(await peopleFilter.getChipTitle()).toEqual(`Created by: ${user2} ${user2} `);
    });

    it('[C279207] Results are filtered by Modifier', async () => {
      await peopleFilter.openDialog();
      await peopleFilter.changeTabToModifier();
      await peopleFilter.selectChip(`${user1} ${user1}`);
      await peopleFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(false, 'PDF file is displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await peopleFilter.getChipTitle()).toEqual(`Modified by: ${user1} ${user1} `);

      await BrowserActions.click(filters.resetAllButton);
      await peopleFilter.openDialog();
      await peopleFilter.changeTabToModifier();
      await peopleFilter.selectChip(`${user2} ${user2}`);
      await peopleFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(false, 'JPG file not displayed');
      expect(await peopleFilter.getChipTitle()).toEqual(`Modified by: ${user2} ${user2} `);
    });

    it('[C279208] Clear the Creator filter options', async () => {
      await peopleFilter.openDialog();
      await peopleFilter.selectChip(`${user1} ${user1}`);
      await peopleFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(false, 'PDF file is displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');

      await peopleFilter.openDialog();
      expect(await peopleFilter.getSelectedValues()).toEqual([`${user1} ${user1}`]);
      await peopleFilter.clickResetButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await peopleFilter.getChipTitle()).toEqual('', 'Creator selection not cleared');
    });

    it('[C279209] Clear the Modifier filter options', async () => {
      await peopleFilter.openDialog();
      await peopleFilter.changeTabToModifier();
      await peopleFilter.selectChip(`${user1} ${user1}`);
      await peopleFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(false, 'PDF file is displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');

      await peopleFilter.openDialog();
      expect(await peopleFilter.getSelectedValues()).toEqual([`${user1} ${user1}`]);
      await peopleFilter.clickResetButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await peopleFilter.getChipTitle()).toEqual('', 'Modifier selection not cleared');
    });
  });

  describe('Filter by Location', () => {
    afterEach(async () => {
      await Utils.pressEscape();
      await BrowserActions.click(filters.resetAllButton);
    });

    it('[C279230] Expand / Collapse the Location filter panel', async () => {
      await locationFilter.openDialog();
      expect(await locationFilter.isDialogPresent()).toBe(true, 'Location filter panel not expanded');

      expect(await locationFilter.isFilterAutocompleteInputDisplayed()).toBe(true, 'Location filter categories not displayed');

      await locationFilter.closeDialog();
      expect(await locationFilter.isDialogPresent()).toBe(false, 'Location filter panel is expanded');
    });

    it('[C279231] Results are filtered by Location', async () => {
      await locationFilter.openDialog();
      await locationFilter.setAutocompleteInputValue(site);
      await locationFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(false, 'PDF file is displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await locationFilter.getChipTitle()).toEqual(site, 'Incorrect location filter selected');

      await locationFilter.openDialog();
      await locationFilter.setAutocompleteInputValue('_REPOSITORY_');
      await locationFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await locationFilter.getChipTitle()).toEqual(`${site}, _REPOSITORY_`, 'Incorrect location filter selected');
    });

    it('[C279232] Clear the Location filter options', async () => {
      await locationFilter.openDialog();
      await locationFilter.setAutocompleteInputValue(site);
      await locationFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(false, 'PDF file is displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');

      expect(await locationFilter.getChipTitle()).toEqual(`${site}`, 'Incorrect location filter selected');
      await locationFilter.openDialog();
      expect(await locationFilter.getFiltersSelectedValues()).toEqual([`${site}`]);
      await locationFilter.clickResetButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await locationFilter.getChipTitle()).toEqual('', 'Location selection not cleared');
    });

    it('[C279233] Search for a specific location', async () => {
      await locationFilter.openDialog();
      expect(await locationFilter.getFiltersSelectedValues()).toEqual([], 'Incorrect Location filters facets');
      await locationFilter.setAutocompleteInputValue(site);
      expect(await locationFilter.getFiltersSelectedValues()).toEqual([`${site}`], 'Incorrect Location filters facets');
    });
  });

  describe('Filter by Modified date', () => {
    const expectedDateFilters = ['Today (2)', 'This week (2)', 'This month (2)', 'In the last 6 months (2)', 'This year (2)'];

    afterEach(async () => {
      await Utils.pressEscape();
      await BrowserActions.click(filters.resetAllButton);
    });

    it('[C279219] Expand / Collapse the Modified date filter panel', async () => {
      await modifiedDateFilter.openDialog();
      expect(await modifiedDateFilter.isDialogPresent()).toBe(true, 'Modified Date filter panel not expanded');

      expect(await modifiedDateFilter.getFiltersValues()).toEqual(expectedDateFilters, 'Incorrect Modified Date filters facets');
      expect(await modifiedDateFilter.isFilterCategoryInputDisplayed()).toBe(true, 'Modified Date filter categories not displayed');

      await modifiedDateFilter.closeDialog();
      expect(await modifiedDateFilter.isDialogPresent()).toBe(false, 'Modified Date filter panel is expanded');
    });

    it('[C279221] Results are filtered by Modified date', async () => {
      await modifiedDateFilter.openDialog();
      await modifiedDateFilter.checkCategory('Today');
      await modifiedDateFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await modifiedDateFilter.getChipTitle()).toEqual('Today', 'Incorrect Modified DateFilter selected');

      await modifiedDateFilter.openDialog();
      await modifiedDateFilter.checkCategory('This week');
      await modifiedDateFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await modifiedDateFilter.getChipTitle()).toEqual('Today, This week', 'Incorrect Modified DateFilter selected');
    });

    it('[C279220] Clear the Modified date filter options', async () => {
      await modifiedDateFilter.openDialog();
      await modifiedDateFilter.checkCategory('Today');
      await modifiedDateFilter.checkCategory('This week');
      await modifiedDateFilter.checkCategory('This month');
      await modifiedDateFilter.checkCategory('In the last 6 months');
      await modifiedDateFilter.checkCategory('This year');
      await modifiedDateFilter.clickApplyButton();

      expect(await modifiedDateFilter.getChipTitle()).toEqual(
        `Today, This week, This month, In the last 6 months, This year`,
        'Incorrect checked Modified date filters'
      );
      await modifiedDateFilter.openDialog();
      expect(await modifiedDateFilter.getFiltersCheckedValues()).toEqual(expectedDateFilters, 'Incorrect checked Modified date filters');
      await modifiedDateFilter.clickResetButton();

      expect(await modifiedDateFilter.getChipTitle()).toEqual('', 'Modified date selection not cleared');
    });

    it('[C325006] Search for a specific modified date option', async () => {
      await modifiedDateFilter.openDialog();
      expect(await modifiedDateFilter.getFiltersValues()).toEqual(expectedDateFilters, 'Incorrect Modified date filters facets');
      await modifiedDateFilter.filterCategoriesBy('This');
      expect(await modifiedDateFilter.getFiltersValues()).toEqual(
        ['This week (2)', 'This month (2)', 'This year (2)'],
        'Incorrect Modified date filters facets'
      );
    });
  });

  describe('Multiple filters', () => {
    afterEach(async () => {
      await Utils.pressEscape();
      await BrowserActions.click(filters.resetAllButton);
    });

    it('[C280051] Multiple filters can be applied', async () => {
      await fileTypeFilter.openDialog();
      await fileTypeFilter.typeFileSize('1024');
      await fileTypeFilter.selectFileSizeOperator(SizeOperator.AT_MOST);
      await fileTypeFilter.selectFileType('jpg');
      await fileTypeFilter.clickApplyButton();

      await peopleFilter.openDialog();
      await peopleFilter.selectChip(`${user1} ${user1}`);
      await peopleFilter.clickApplyButton();

      await locationFilter.openDialog();
      await locationFilter.setAutocompleteInputValue(site);
      await locationFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(false, 'PDF file is displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await fileTypeFilter.getChipTitle()).toEqual(`${SizeOperator.AT_MOST} 1024 KB, jpg`);
      expect(await peopleFilter.getChipTitle()).toEqual(`Created by: ${user1} ${user1} `);
      expect(await locationFilter.getChipTitle()).toEqual(site);

      await BrowserActions.click(filters.resetAllButton);

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
    });

    it('[C280052] Total results is updated correctly', async () => {
      await fileTypeFilter.openDialog();
      await fileTypeFilter.selectFileType('jpg');
      await fileTypeFilter.clickApplyButton();

      await peopleFilter.openDialog();
      await peopleFilter.selectChip(`${user1} ${user1}`);
      await peopleFilter.clickApplyButton();

      expect(await dataTable.getRowsCount()).toEqual(1, 'expected 1 result');

      await BrowserActions.click(filters.resetAllButton);

      expect(await dataTable.getRowsCount()).toEqual(2, 'expected 2 result');
    });

    it('[C279188] Pagination is correct when search results are filtered', async () => {
      await fileTypeFilter.openDialog();
      await fileTypeFilter.selectFileType('jpg');
      await fileTypeFilter.clickApplyButton();

      await peopleFilter.openDialog();
      await peopleFilter.selectChip(`${user1} ${user1}`);
      await peopleFilter.clickApplyButton();

      expect(await page.pagination.getRange()).toEqual('Showing 1-1 of 1');

      await BrowserActions.click(filters.resetAllButton);

      expect(await page.pagination.getRange()).toEqual('Showing 1-2 of 2');
    });

    it('[C308042] The filter facets display is updated when making a new query', async () => {
      const expectedUsers1 = [`${user1} ${user1}`, `${user2} ${user2}`];
      await peopleFilter.openDialog();
      expect(await peopleFilter.getAutocompleteOptions(' ')).toEqual(expectedUsers1);
      await peopleFilter.closeDialog();

      await peopleFilter.openDialog();
      await peopleFilter.changeTabToModifier();
      expect(await peopleFilter.getAutocompleteOptions(' ')).toEqual(expectedUsers1);
      await peopleFilter.closeDialog();

      await searchInput.clickSearchButton();
      await searchInput.searchFor(fileJpgUser1.name);
      await dataTable.waitForBody();

      const expectedUsers2 = [`${user1} ${user1}`];
      await peopleFilter.openDialog();
      await peopleFilter.changeTabToCreator();
      expect(await peopleFilter.getAutocompleteOptions('')).toEqual(expectedUsers2);
      await peopleFilter.closeDialog();

      await peopleFilter.openDialog();
      expect(await peopleFilter.getAutocompleteOptions('')).toEqual(expectedUsers2);
      await peopleFilter.closeDialog();
    });
  });
});
