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

import { AdminActions, LoginPage, SearchResultsPage, RepoClient, Utils, FILES, SITE_VISIBILITY, SITE_ROLES } from '@alfresco/aca-testing-shared';
import { BrowserActions } from '@alfresco/adf-testing';

const moment = require('moment');

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

  const expectedFileTypes = ['Adobe PDF Document (1)', 'JPEG Image (1)'];
  const expectedCreators = [`${user1} ${user1} (1)`, `${user2} ${user2} (1)`];
  const expectedModifiers = [`${user1} ${user1} (1)`, `${user2} ${user2} (1)`];
  const expectedLocations = ['_REPOSITORY_ (1)', `${site} (1)`];

  const apis = {
    user1: new RepoClient(user1, user1),
    user2: new RepoClient(user2, user2)
  };

  const loginPage = new LoginPage();
  const page = new SearchResultsPage();
  const { searchInput } = page.header;
  const { dataTable, filters } = page;

  const sizeFilter = filters.size;
  const fileTypeFilter = filters.fileType;
  const createdDateFilter = filters.createdDate;
  const creatorFilter = filters.creator;
  const locationFilter = filters.location;
  const modifierFilter = filters.modifier;
  const modifiedDateFilter = filters.modifiedDate;
  const adminApiActions = new AdminActions();

  beforeAll(async (done) => {
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
    done();
  });

  beforeEach(async (done) => {
    await Utils.pressEscape();
    await page.clickPersonalFilesAndWait();

    await searchInput.clickSearchButton();
    await searchInput.searchFor(`search-filters-${random}`);
    await dataTable.waitForBody();
    done();
  });

  afterAll(async (done) => {
    await Promise.all([apis.user1.nodes.deleteNodeById(parentId), apis.user1.sites.deleteSite(site)]);
    done();
  });

  it('[C279186] Filters are displayed', async () => {
    expect(await sizeFilter.isDisplayed()).toBe(true, 'Size filter panel not displayed');
    expect(await createdDateFilter.isDisplayed()).toBe(true, 'Created date filter panel not displayed');
    expect(await fileTypeFilter.isDisplayed()).toBe(true, 'File type filter panel not displayed');
    expect(await creatorFilter.isDisplayed()).toBe(true, 'Creator filter panel not displayed');
    expect(await modifierFilter.isDisplayed()).toBe(true, 'Modifier filter panel not displayed');
    expect(await locationFilter.isDisplayed()).toBe(true, 'Location filter panel not displayed');
    expect(await modifiedDateFilter.isDisplayed()).toBe(true, 'Modified date filter panel not displayed');
  });

  describe('Filter by Size', () => {
    afterEach(async (done) => {
      await sizeFilter.resetPanel();
      done();
    });

    it('[C279197] Expand / Collapse the Size filter panel', async () => {
      expect(await sizeFilter.isDialogPresent()).toBe(false, 'Size filter panel is expanded');

      await sizeFilter.openDialog();

      expect(await sizeFilter.isDialogPresent()).toBe(true, 'Size filter panel not expanded');

      const expectedSizes = ['Small', 'Medium', 'Large', 'Huge'];
      expect(await sizeFilter.getFiltersValues()).toEqual(expectedSizes, 'Incorrect Size filters facets');

      await sizeFilter.closeDialog();

      expect(await sizeFilter.isDialogPresent()).toBe(false, 'Size filter panel is expanded');
    });

    it('[C279199] Filter by Small', async () => {
      await sizeFilter.openDialog();
      await sizeFilter.checkSizeSmall();
      await sizeFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, `${fileJpgUser1.name} not in the list`);
      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, `${filePdfUser2.name} not in the list`);
    });

    it('[C279202] Filter by Huge', async () => {
      await sizeFilter.openDialog();
      await sizeFilter.checkSizeHuge();
      await sizeFilter.clickApplyButton();

      expect(await dataTable.isEmpty()).toBe(true, 'list is not empty');
    });

    it('[C279203] Filter by multiple size categories', async () => {
      await sizeFilter.openDialog();
      await sizeFilter.checkSizeSmall();
      await sizeFilter.checkSizeMedium();
      await sizeFilter.checkSizeLarge();
      await sizeFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, `${fileJpgUser1.name} not in the list`);
      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, `${filePdfUser2.name} not in the list`);
    });

    it('[C279198] Clear the Size filter options', async () => {
      await sizeFilter.openDialog();
      await sizeFilter.checkSizeSmall();
      await sizeFilter.checkSizeMedium();
      await sizeFilter.clickApplyButton();

      await sizeFilter.openDialog();
      expect(await sizeFilter.getFiltersCheckedValues()).toEqual(['Small', 'Medium'], 'Incorrect checked Size filters');

      await sizeFilter.clickResetButton();
      await sizeFilter.openDialog();
      expect(await sizeFilter.getFiltersCheckedValues()).toEqual([], 'Size filters not cleared');
    });
  });

  describe('Filter by Created date', () => {
    const yesterday = moment().subtract(1, 'day').format('DD-MMM-YY');
    const today = moment().format('DD-MMM-YY');
    const future = moment().add(1, 'month').format('DD-MMM-YY');

    afterEach(async (done) => {
      await Utils.pressEscape();
      await BrowserActions.click(filters.resetAllButton);
      done();
    });

    it('[C279211] Expand / Collapse the Created date filter panel', async () => {
      expect(await createdDateFilter.isDialogPresent()).toBe(false, 'Created date filter panel is expanded');

      await createdDateFilter.openDialog();
      expect(await createdDateFilter.isDialogPresent()).toBe(true, 'Created date filter panel not expanded');

      await createdDateFilter.closeDialog();
      expect(await createdDateFilter.isDialogPresent()).toBe(false, 'Created date filter panel is expanded');
    });

    it('[C279217] Results are filtered by Created date', async () => {
      await createdDateFilter.openDialog();
      await createdDateFilter.enterFromDate(yesterday);
      await createdDateFilter.enterToDate(yesterday);

      await createdDateFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(false, 'PDF file is displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(false, 'JPG file is displayed');

      await createdDateFilter.enterFromDate(yesterday);
      await createdDateFilter.enterToDate(today);

      await createdDateFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
    });

    it('[C279216] Clear the Created date filter options', async () => {
      await createdDateFilter.openDialog();
      await createdDateFilter.enterFromDate(yesterday);
      await createdDateFilter.enterToDate(yesterday);
      await createdDateFilter.clickApplyButton();

      await createdDateFilter.openDialog();
      expect(await createdDateFilter.getFromValue()).toContain(yesterday);
      expect(await createdDateFilter.getToValue()).toContain(yesterday);

      await createdDateFilter.clickResetButton();

      await createdDateFilter.openDialog();
      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file is displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file is displayed');
      expect(await createdDateFilter.getFromValue()).toEqual('', 'From field not empty');
      expect(await createdDateFilter.getToValue()).toEqual('', 'To field not empty');
    });

    it('[C279212] From and To values are required', async () => {
      await createdDateFilter.openDialog();
      await createdDateFilter.enterFromDate('');
      await createdDateFilter.enterToDate('');

      expect(await createdDateFilter.isFromErrorDisplayed()).toBe(true, 'Error missing for From field');
      expect(await createdDateFilter.isToErrorDisplayed()).toBe(true, 'Error missing for To field');
      expect(await createdDateFilter.getFromError()).toEqual('Required value');
      expect(await createdDateFilter.getToError()).toEqual('Required value');
    });

    it('[C279213] Error message is displayed when entering an incorrect date format', async () => {
      await createdDateFilter.openDialog();
      await createdDateFilter.enterFromDate('03.31.2019');
      await createdDateFilter.enterToDate('invalid text');

      expect(await createdDateFilter.isFromErrorDisplayed()).toBe(true, 'Error missing for From field');
      expect(await createdDateFilter.isToErrorDisplayed()).toBe(true, 'Error missing for To field');
      expect(await createdDateFilter.getFromError()).toEqual(`Invalid date. The date must be in the format 'DD-MMM-YY'`);
      expect(await createdDateFilter.getToError()).toEqual(`Invalid date. The date must be in the format 'DD-MMM-YY'`);
    });

    it('[C279214] Error message is displayed when entering a date from the future', async () => {
      await createdDateFilter.openDialog();
      await createdDateFilter.enterFromDate(future);
      await createdDateFilter.enterToDate(future);

      expect(await createdDateFilter.isFromErrorDisplayed()).toBe(true, 'Error missing for From field');
      expect(await createdDateFilter.isToErrorDisplayed()).toBe(true, 'Error missing for To field');
      expect(await createdDateFilter.getFromError()).toEqual('The date is beyond the maximum date.');
      expect(await createdDateFilter.getToError()).toEqual('The date is beyond the maximum date.');
    });

    it('[C279215] Error message is displayed when From value is bigger than To value', async () => {
      await createdDateFilter.openDialog();
      await createdDateFilter.enterFromDate(today);
      await createdDateFilter.enterToDate(yesterday);

      expect(await createdDateFilter.isToErrorDisplayed()).toBe(true, 'Error missing for To field');
      expect(await createdDateFilter.getToError()).toEqual('No days selected.');
    });
  });

  describe('Filter by File type', () => {
    afterEach(async (done) => {
      await Utils.pressEscape();
      await BrowserActions.click(filters.resetAllButton);
      done();
    });

    it('[C279191] Expand / Collapse the File type filter panel', async () => {
      await fileTypeFilter.openDialog();
      expect(await fileTypeFilter.isDialogPresent()).toBe(true, 'File type filter panel not expanded');
      expect(await fileTypeFilter.getFiltersValues()).toEqual(expectedFileTypes, 'Incorrect File type filters facets');
      expect(await fileTypeFilter.isFilterCategoryInputDisplayed()).toBe(true, 'File type filter categories not displayed');

      await fileTypeFilter.closeDialog();
      expect(await fileTypeFilter.isDialogPresent()).toBe(false, 'File type filter panel is expanded');
    });

    it('[C279192] Results are filtered by File type', async () => {
      await fileTypeFilter.openDialog();
      await fileTypeFilter.checkCategory('Adobe PDF Document');
      await fileTypeFilter.clickApplyButton();
      expect(await fileTypeFilter.getChipTitle()).toEqual('Adobe PDF Document');

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(false, 'JPG file is displayed');

      await fileTypeFilter.openDialog();
      await fileTypeFilter.checkCategory('JPEG Image');
      await fileTypeFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await fileTypeFilter.getChipTitle()).toEqual(['Adobe PDF Document', 'JPEG Image'].join(', '));
    });

    it('[C279193] Clear the File type filter options', async () => {
      await fileTypeFilter.openDialog();
      await fileTypeFilter.checkCategory('Adobe PDF Document');
      await fileTypeFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(false, 'JPG file is displayed');

      await fileTypeFilter.openDialog();
      expect(await fileTypeFilter.getFiltersCheckedValues()).toEqual(['Adobe PDF Document (1)']);
      await fileTypeFilter.clickResetButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await fileTypeFilter.getChipTitle()).toEqual('');
    });

    it('[C279195] Search for a specific file type', async () => {
      await fileTypeFilter.openDialog();
      expect(await fileTypeFilter.getFiltersValues()).toEqual(expectedFileTypes, 'Incorrect File type filters facets');
      await fileTypeFilter.filterCategoriesBy('PDF');
      expect(await fileTypeFilter.getFiltersValues()).toEqual(['Adobe PDF Document (1)'], 'Incorrect File type filters facets');
    });
  });

  describe('Filter by Creator', () => {
    afterEach(async (done) => {
      await Utils.pressEscape();
      await BrowserActions.click(filters.resetAllButton);
      done();
    });

    it('[C279205] Expand / Collapse the Creator filter panel', async () => {
      await creatorFilter.openDialog();
      expect(await creatorFilter.isDialogPresent()).toBe(true, 'Creator filter panel not expanded');

      expect(await creatorFilter.getFiltersValues()).toEqual(expectedCreators, 'Incorrect Creator filters facets');
      expect(await creatorFilter.isFilterCategoryInputDisplayed()).toBe(true, 'Creator filter categories not displayed');

      await creatorFilter.closeDialog();
      expect(await creatorFilter.isDialogPresent()).toBe(false, 'Creator filter panel is expanded');
    });

    it('[C279206] Results are filtered by Creator', async () => {
      await creatorFilter.openDialog();
      await creatorFilter.checkCategory(user1);
      await creatorFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(false, 'PDF file is displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await creatorFilter.getChipTitle()).toEqual(`${user1} ${user1}`);

      await creatorFilter.openDialog();
      await creatorFilter.checkCategory(user2);
      await creatorFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await creatorFilter.getChipTitle()).toEqual(`${user1} ${user1}, ${user2} ${user2}`);
    });

    it('[C279207] Clear the Creator filter options', async () => {
      await creatorFilter.openDialog();
      await creatorFilter.checkCategory(user1);
      await creatorFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(false, 'PDF file is displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');

      await creatorFilter.openDialog();
      expect(await creatorFilter.getFiltersCheckedValues()).toEqual([`${user1} ${user1} (1)`]);
      await creatorFilter.clickResetButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await creatorFilter.getChipTitle()).toEqual('', 'Creator selection not cleared');
    });

    it('[C279208] Search for a specific creator', async () => {
      await creatorFilter.openDialog();
      expect(await creatorFilter.getFiltersValues()).toEqual(expectedCreators, 'Incorrect Creator filters facets');
      await creatorFilter.filterCategoriesBy(user1);
      expect(await creatorFilter.getFiltersValues()).toEqual([`${user1} ${user1} (1)`], 'Incorrect Creator filters facets');
    });
  });

  describe('Filter by Modifier', () => {
    afterEach(async (done) => {
      await Utils.pressEscape();
      await BrowserActions.click(filters.resetAllButton);
      done();
    });

    it('[C279224] Expand / Collapse the Modifier filter panel', async () => {
      await modifierFilter.openDialog();
      expect(await modifierFilter.isDialogPresent()).toBe(true, 'Modifier filter panel not expanded');

      expect(await modifierFilter.getFiltersValues()).toEqual(expectedModifiers, 'Incorrect Modifier filters facets');
      expect(await modifierFilter.isFilterCategoryInputDisplayed()).toBe(true, 'Modifier filter categories not displayed');

      await modifierFilter.closeDialog();
      expect(await modifierFilter.isDialogPresent()).toBe(false, 'Modifier filter panel is expanded');
    });

    it('[C279225] Results are filtered by Modifier', async () => {
      await modifierFilter.openDialog();
      await modifierFilter.checkCategory(user1);
      await modifierFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(false, 'PDF file is displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await modifierFilter.getChipTitle()).toEqual(`${user1} ${user1}`, 'Incorrect File type filters facets');

      await modifierFilter.openDialog();
      await modifierFilter.checkCategory(user2);
      await modifierFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await modifierFilter.getChipTitle()).toEqual(`${user1} ${user1}, ${user2} ${user2}`, 'Incorrect modifier filters facets');
    });

    it('[C279226] Clear the Modifier filter options', async () => {
      await modifierFilter.openDialog();
      await modifierFilter.checkCategory(user1);
      await modifierFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(false, 'PDF file is displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');

      await modifierFilter.openDialog();
      expect(await modifierFilter.getFiltersCheckedValues()).toEqual([`${user1} ${user1} (1)`]);
      await modifierFilter.clickResetButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');

      await modifierFilter.openDialog();
      expect(await modifierFilter.getFiltersCheckedValues()).toEqual([], 'Modifier selection not cleared');
    });

    it('[C279227] Search for a specific modifier', async () => {
      await modifierFilter.openDialog();
      expect(await modifierFilter.getFiltersValues()).toEqual(expectedModifiers, 'Incorrect Modifier filters facets');
      await modifierFilter.filterCategoriesBy(user1);
      expect(await modifierFilter.getFiltersValues()).toEqual([`${user1} ${user1} (1)`], 'Incorrect Modifier filters facets');
    });
  });

  describe('Filter by Location', () => {
    afterEach(async (done) => {
      await Utils.pressEscape();
      await BrowserActions.click(filters.resetAllButton);
      done();
    });

    it('[C279230] Expand / Collapse the Location filter panel', async () => {
      await locationFilter.openDialog();
      expect(await locationFilter.isDialogPresent()).toBe(true, 'Location filter panel not expanded');

      expect(await locationFilter.getFiltersValues()).toEqual(expectedLocations, 'Incorrect Location filters facets');
      expect(await locationFilter.isFilterCategoryInputDisplayed()).toBe(true, 'Location filter categories not displayed');

      await locationFilter.closeDialog();
      expect(await locationFilter.isDialogPresent()).toBe(false, 'Location filter panel is expanded');
    });

    it('[C279231] Results are filtered by Location', async () => {
      await locationFilter.openDialog();
      await locationFilter.checkCategory(site);
      await locationFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(false, 'PDF file is displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await locationFilter.getChipTitle()).toEqual(site, 'Incorrect location filter selected');

      await locationFilter.openDialog();
      await locationFilter.checkCategory('_REPOSITORY_');
      await locationFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await locationFilter.getChipTitle()).toEqual(`_REPOSITORY_, ${site}`, 'Incorrect location filter selected');
    });

    it('[C279232] Clear the Location filter options', async () => {
      await locationFilter.openDialog();
      await locationFilter.checkCategory(site);
      await locationFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(false, 'PDF file is displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');

      expect(await locationFilter.getChipTitle()).toEqual(`${site}`, 'Incorrect location filter selected');
      await locationFilter.openDialog();
      expect(await locationFilter.getFiltersCheckedValues()).toEqual([`${site} (1)`]);
      await locationFilter.clickResetButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await locationFilter.getChipTitle()).toEqual('', 'Location selection not cleared');
    });

    it('[C279233] Search for a specific location', async () => {
      await locationFilter.openDialog();
      expect(await locationFilter.getFiltersValues()).toEqual(expectedLocations, 'Incorrect Location filters facets');
      await locationFilter.filterCategoriesBy(site);
      expect(await locationFilter.getFiltersValues()).toEqual([`${site} (1)`], 'Incorrect Location filters facets');
    });
  });

  describe('Filter by Modified date', () => {
    const expectedDateFilters = ['Today (2)', 'This week (2)', 'This month (2)', 'In the last 6 months (2)', 'This year (2)'];

    afterEach(async (done) => {
      await Utils.pressEscape();
      await BrowserActions.click(filters.resetAllButton);
      done();
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
    afterEach(async (done) => {
      await Utils.pressEscape();
      await BrowserActions.click(filters.resetAllButton);
      done();
    });

    it('[C280051] Multiple filters can be applied', async () => {
      await sizeFilter.openDialog();
      await sizeFilter.checkSizeSmall();
      await sizeFilter.clickApplyButton();

      await fileTypeFilter.openDialog();
      await fileTypeFilter.checkCategory('JPEG Image');
      await fileTypeFilter.clickApplyButton();

      await creatorFilter.openDialog();
      await creatorFilter.checkCategory(user1);
      await creatorFilter.clickApplyButton();

      await locationFilter.openDialog();
      await locationFilter.checkCategory(site);
      await locationFilter.clickApplyButton();

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(false, 'PDF file is displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
      expect(await fileTypeFilter.getChipTitle()).toEqual('JPEG Image');
      expect(await creatorFilter.getChipTitle()).toEqual(`${user1} ${user1}`);
      expect(await locationFilter.getChipTitle()).toEqual(site);

      await BrowserActions.click(filters.resetAllButton);

      expect(await dataTable.isItemPresent(filePdfUser2.name)).toBe(true, 'PDF file not displayed');
      expect(await dataTable.isItemPresent(fileJpgUser1.name)).toBe(true, 'JPG file not displayed');
    });

    it('[C280052] Total results is updated correctly', async () => {
      await fileTypeFilter.openDialog();
      await fileTypeFilter.checkCategory('JPEG Image');
      await fileTypeFilter.clickApplyButton();

      await creatorFilter.openDialog();
      await creatorFilter.checkCategory(user1);
      await creatorFilter.clickApplyButton();

      expect(await dataTable.getRowsCount()).toEqual(1, 'expected 1 result');

      await BrowserActions.click(filters.resetAllButton);

      expect(await dataTable.getRowsCount()).toEqual(2, 'expected 2 result');
    });

    it('[C279188] Pagination is correct when search results are filtered', async () => {
      await fileTypeFilter.openDialog();
      await fileTypeFilter.checkCategory('JPEG Image');
      await fileTypeFilter.clickApplyButton();

      await creatorFilter.openDialog();
      await creatorFilter.checkCategory(user1);
      await creatorFilter.clickApplyButton();

      expect(await page.pagination.getRange()).toEqual('Showing 1-1 of 1');

      await BrowserActions.click(filters.resetAllButton);

      expect(await page.pagination.getRange()).toEqual('Showing 1-2 of 2');
    });

    it('[C308042] The filter facets display is updated when making a new query', async () => {
      await fileTypeFilter.openDialog();
      expect(await fileTypeFilter.getFiltersValues()).toEqual(expectedFileTypes);
      await fileTypeFilter.closeDialog();

      await creatorFilter.openDialog();
      expect(await creatorFilter.getFiltersValues()).toEqual(expectedCreators);
      await creatorFilter.closeDialog();

      await modifierFilter.openDialog();
      expect(await modifierFilter.getFiltersValues()).toEqual(expectedModifiers);
      await modifierFilter.closeDialog();

      await locationFilter.openDialog();
      expect(await locationFilter.getFiltersValues()).toEqual(expectedLocations);
      await locationFilter.closeDialog();

      await searchInput.clickSearchButton();
      await searchInput.searchFor(fileJpgUser1.name);
      await dataTable.waitForBody();

      await fileTypeFilter.openDialog();
      expect(await fileTypeFilter.getFiltersValues()).toEqual(['JPEG Image (1)']);
      await fileTypeFilter.closeDialog();

      await creatorFilter.openDialog();
      expect(await creatorFilter.getFiltersValues()).toEqual([`${user1} ${user1} (1)`]);
      await creatorFilter.closeDialog();

      await modifierFilter.openDialog();
      expect(await modifierFilter.getFiltersValues()).toEqual([`${user1} ${user1} (1)`]);
      await modifierFilter.closeDialog();

      await locationFilter.openDialog();
      expect(await locationFilter.getFiltersValues()).toEqual([`${site} (1)`]);
      await locationFilter.closeDialog();
    });
  });
});
