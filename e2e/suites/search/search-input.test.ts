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

describe('Search input', () => {
  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { searchInput } = page.header;

  beforeAll(async (done) => {
    await loginPage.loginWithAdmin();
    done();
  });

  beforeEach(async (done) => {
    await Utils.pressEscape();
    await page.clickPersonalFiles();
    done();
  });

  it('[C289847] Search input is displayed in the app header', async () => {
    expect(await searchInput.isSearchContainerDisplayed()).toBe(true, 'search controls not displayed');
  });

  it('[C289848] Search options are displayed when clicking in the search input', async () => {
    await searchInput.clickSearchButton();
    expect(await searchInput.isOptionsAreaDisplayed()).toBe(true, 'Search options not displayed');
    expect(await searchInput.isFilesOptionEnabled()).toBe(true, 'Files option not enabled');
    expect(await searchInput.isFoldersOptionEnabled()).toBe(true, 'Folders option not enabled');
    expect(await searchInput.isLibrariesOptionEnabled()).toBe(true, 'Libraries option not enabled');
    expect(await searchInput.isFilesOptionChecked()).toBe(false, 'Files option is checked');
    expect(await searchInput.isFoldersOptionChecked()).toBe(false, 'Folders option is checked');
    expect(await searchInput.isLibrariesOptionChecked()).toBe(false, 'Libraries option is checked');
  });

  it('[C289849] Search options are correctly enabled / disabled', async () => {
    await searchInput.clickSearchButton();

    await searchInput.clickFilesOption();
    expect(await searchInput.isFoldersOptionEnabled()).toBe(true, 'Folders option not enabled');
    expect(await searchInput.isLibrariesOptionEnabled()).toBe(false, 'Libraries option not disabled');

    await searchInput.clickFilesOption();
    expect(await searchInput.isFoldersOptionEnabled()).toBe(true, 'Folders option not enabled');
    expect(await searchInput.isLibrariesOptionEnabled()).toBe(true, 'Folders option not enabled');

    await searchInput.clickFoldersOption();
    expect(await searchInput.isFilesOptionEnabled()).toBe(true, 'Files option not enabled');
    expect(await searchInput.isLibrariesOptionEnabled()).toBe(false, 'Libraries option not disabled');

    await searchInput.clickFoldersOption();
    expect(await searchInput.isFilesOptionEnabled()).toBe(true, 'Files option not enabled');
    expect(await searchInput.isLibrariesOptionEnabled()).toBe(true, 'Libraries option not enabled');

    await searchInput.clickLibrariesOption();
    expect(await searchInput.isFilesOptionEnabled()).toBe(false, 'Files option not disabled');
    expect(await searchInput.isFoldersOptionEnabled()).toBe(false, 'Folders option not disabled');

    await searchInput.clickLibrariesOption();
    expect(await searchInput.isFilesOptionEnabled()).toBe(true, 'Files option not enabled');
    expect(await searchInput.isFoldersOptionEnabled()).toBe(true, 'Folders option not enabled');
  });
});
