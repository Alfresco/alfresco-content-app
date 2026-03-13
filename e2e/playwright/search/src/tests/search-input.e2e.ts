/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { expect } from '@playwright/test';
import { ApiClientFactory, Utils, test } from '@alfresco/aca-playwright-shared';

test.describe('Search - Input', () => {
  const username = `user1-${Utils.random()}`;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test('[XAT-5563] Search icon is displayed in toolbar and clicking on it displays search input container', async ({ searchPage }) => {
    await searchPage.acaHeader.searchButton.click();
    await expect(searchPage.searchInputComponent.searchInput).toBeVisible();
  });

  test('[XAT-5564] Search options are displayed when clicking in the search input', async ({ searchPage }) => {
    await searchPage.acaHeader.searchButton.click();
    await searchPage.searchInputComponent.searchInButton.click();

    await expect(searchPage.searchInDialog.filesAndFoldersRadioButton).toBeVisible();
    await expect(searchPage.searchInDialog.filesCheckbox).toBeVisible();
    await expect(searchPage.searchInDialog.foldersCheckbox).toBeVisible();
    await expect(searchPage.searchInDialog.librariesRadioButton).toBeVisible();
  });

  test('[XAT-5565] Search options are correctly enabled / disabled', async ({ searchPage }) => {
    await searchPage.acaHeader.searchButton.click();
    await searchPage.searchInputComponent.searchInButton.click();

    await searchPage.searchInDialog.filesAndFoldersRadioButton.click();
    await expect(searchPage.searchInDialog.filesCheckbox).toBeChecked();
    await expect(searchPage.searchInDialog.foldersCheckbox).toBeChecked();
    await expect(searchPage.searchInDialog.librariesRadioButton).not.toBeChecked();

    await searchPage.searchInDialog.librariesRadioButton.click();
    await expect(searchPage.searchInDialog.foldersCheckbox).toBeHidden();
    await expect(searchPage.searchInDialog.filesCheckbox).toBeHidden();
    await expect(searchPage.searchInDialog.filesAndFoldersRadioButton).not.toBeChecked();
  });
});
