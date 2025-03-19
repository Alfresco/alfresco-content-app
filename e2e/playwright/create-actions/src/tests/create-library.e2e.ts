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
import {
  Utils,
  ApiClientFactory,
  test,
  libraryErrors,
  LoginPage,
  SitesApi,
  AdfLibraryDialogComponent,
  DataTableComponent,
  Breadcrumb,
  TrashcanApi,
  NodesApi
} from '@alfresco/aca-playwright-shared';

test.describe('Create Libraries ', () => {
  const apiClientFactory = new ApiClientFactory();
  let sitesApi: SitesApi;
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let libraryDialog: AdfLibraryDialogComponent;
  let libraryTable: DataTableComponent;
  let libraryBreadcrumb: Breadcrumb;
  let randomLibraryName: string;
  let randomLibraryId: string;
  let randomLibraryDescription: string;
  const libraryDialogTitle = 'Create Library';
  const libraryNameLabel = 'Name';
  const libraryIdLabel = 'Library ID';
  const libraryDescriptionLabel = 'Description';
  const publicVisibility = 'Public';
  const moderatedVisibility = 'Moderated';
  const privateVisibility = 'Private';
  const errorMessageNotPresent = 'Error message is not displayed';
  const tabKeyString = 'Tab';
  const username = `user-${Utils.random()}`;
  const commonLibraryName = `playwright-library1-${Utils.random()}`;
  const commonTrashLibraryName = `playwright-library2-${Utils.random()}`;
  const createdLibrariesIds: string[] = [];

  test.beforeAll(async () => {
    try {
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      sitesApi = await SitesApi.initialize(username, username);
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      const commonLibraryId = (await sitesApi.createSite(commonLibraryName)).entry.id;
      createdLibrariesIds.push(commonLibraryId);
      const commonTrashLibraryId = (await sitesApi.createSite(commonTrashLibraryName)).entry.id;
      createdLibrariesIds.push(commonTrashLibraryId);
      await sitesApi.deleteSites([commonTrashLibraryId], false);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }
  });

  test.beforeEach(async ({ myLibrariesPage, page }) => {
    randomLibraryName = `playwright-library3-${Utils.random()}`;
    randomLibraryId = `libraryId-${Utils.random()}`;
    randomLibraryDescription = `libraryDescription-${Utils.random()}`;
    libraryDialog = myLibrariesPage.libraryDialog;
    const loginPage = new LoginPage(page);
    await Utils.tryLoginUser(loginPage, username, username, 'Main beforeEach failed');
    await myLibrariesPage.navigate();
    await myLibrariesPage.selectCreateLibrary();
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed', sitesApi, createdLibrariesIds);
  });

  test('[XAT-5118] Create Library dialog UI check', async () => {
    await expect(libraryDialog.getDialogTitle(libraryDialogTitle)).toBeVisible();
    await expect(libraryDialog.getLabelText(libraryNameLabel)).toBeVisible();
    await expect(libraryDialog.getRequiredMarker(libraryNameLabel)).toBeVisible();
    await expect(libraryDialog.getLabelText(libraryIdLabel)).toBeVisible();
    await expect(libraryDialog.getRequiredMarker(libraryIdLabel)).toBeVisible();
    await expect(libraryDialog.getLabelText(libraryDescriptionLabel)).toBeVisible();
    await expect(libraryDialog.getLabelText(publicVisibility)).toBeVisible();
    await expect(libraryDialog.getLabelText(publicVisibility)).toBeChecked();
    await expect(libraryDialog.getLabelText(privateVisibility)).toBeVisible();
    await expect(libraryDialog.getLabelText(moderatedVisibility)).toBeVisible();
    await expect(libraryDialog.cancelButton).toBeEnabled();
    await expect(libraryDialog.createButton).toBeDisabled();
  });

  test.describe('On My Libraries dataTable', () => {
    test.beforeEach(async ({ myLibrariesPage }) => {
      libraryTable = myLibrariesPage.dataTable;
      libraryBreadcrumb = myLibrariesPage.breadcrumb;
    });

    test('[XAT-5119] Create a public library', async ({ myLibrariesPage }) => {
      await libraryDialog.getLabelText(libraryNameLabel).fill(randomLibraryName);
      await expect(libraryDialog.getLabelText(libraryNameLabel)).toHaveValue(randomLibraryName);
      await expect(libraryDialog.getLabelText(libraryIdLabel)).toHaveValue(randomLibraryName);
      await libraryDialog.createButton.click();
      await expect(libraryBreadcrumb.getItemByTitle(randomLibraryName)).toBeVisible();

      await myLibrariesPage.navigate();
      await expect(libraryTable.getCellByColumnNameAndRowItem(randomLibraryName, publicVisibility)).toBeVisible();

      createdLibrariesIds.push(randomLibraryName);
    });

    test('[XAT-5120] Create a moderated library', async ({ myLibrariesPage }) => {
      await libraryDialog.createLibraryWithNameAndId(randomLibraryName, randomLibraryId, null, moderatedVisibility);
      await expect(libraryBreadcrumb.getItemByTitle(randomLibraryName)).toBeVisible();

      await myLibrariesPage.navigate();
      await libraryTable.spinnerWaitForReload();
      await expect(libraryTable.getCellByColumnNameAndRowItem(randomLibraryName, moderatedVisibility)).toBeVisible();

      createdLibrariesIds.push(randomLibraryId);
    });

    test('[XAT-5121] Create a private library', async ({ myLibrariesPage }) => {
      await libraryDialog.createLibraryWithNameAndId(randomLibraryName, randomLibraryId, null, privateVisibility);
      await expect(libraryBreadcrumb.getItemByTitle(randomLibraryName)).toBeVisible();

      await myLibrariesPage.navigate();
      await expect(libraryTable.getCellByColumnNameAndRowItem(randomLibraryName, privateVisibility)).toBeVisible();

      createdLibrariesIds.push(randomLibraryId);
    });

    test('[XAT-5122] Create a library with a given ID and description', async ({ myLibrariesPage }) => {
      const libraryViewDetails = myLibrariesPage.acaHeader.viewDetails;
      const libraryDetails = myLibrariesPage.libraryDetails;

      await libraryDialog.createLibraryWithNameAndId(randomLibraryName, randomLibraryId, randomLibraryDescription);
      await expect(libraryBreadcrumb.getItemByTitle(randomLibraryName)).toBeVisible();

      await myLibrariesPage.navigate();
      await expect(libraryTable.getCellLinkByName(randomLibraryName).and(myLibrariesPage.page.getByTitle(randomLibraryDescription))).toBeVisible();
      await libraryTable.getRowByName(randomLibraryName).click();
      await libraryViewDetails.click();
      expect(await libraryDetails.getNameField('Name').inputValue()).toBe(randomLibraryName);
      expect(await libraryDetails.getIdField('Library ID').inputValue()).toBe(randomLibraryId);
      // eslint-disable-next-line @alfresco/eslint-angular/no-angular-material-selectors
      await expect(libraryDetails.getVisibilityField('Visibility').locator('.mat-mdc-select-min-line').getByText(publicVisibility)).toBeVisible();
      expect(await libraryDetails.getDescriptionField.inputValue()).toBe(randomLibraryDescription);

      createdLibrariesIds.push(randomLibraryId);
    });

    test('[XAT-5126] Create Library - Cancel button', async () => {
      await expect(libraryDialog.getDialogTitle(libraryDialogTitle)).toBeVisible();
      await libraryDialog.getLabelText(libraryNameLabel).fill(randomLibraryName);
      await libraryDialog.cancelButton.click();

      await expect(libraryDialog.getDialogTitle(libraryDialogTitle)).toBeHidden();
      await expect(libraryTable.getRowByName(randomLibraryName)).toHaveCount(0);
    });

    test('[XAT-5127] Create multiple sites with same name but different IDs', async ({ myLibrariesPage }) => {
      const libraryName = commonLibraryName + ' (' + commonLibraryName + ')';
      const libraryName2 = commonLibraryName + ' (' + randomLibraryId + ')';

      await libraryDialog.createLibraryWithNameAndId(commonLibraryName, randomLibraryId);
      await expect(libraryBreadcrumb.getItemByTitle(commonLibraryName)).toBeVisible();

      await myLibrariesPage.navigate();
      await expect(libraryTable.getRowByName(libraryName)).toBeVisible();
      await expect(libraryTable.getRowByName(libraryName2)).toBeVisible();

      createdLibrariesIds.push(randomLibraryId);
    });
  });

  test('[XAT-5123] Library ID cannot contain special characters', async () => {
    const idsWithSpecialChars = [
      'a!a',
      'a@a',
      'a#a',
      'a%a',
      'a^a',
      'a&a',
      'a*a',
      'a(a',
      'a)a',
      'a"a',
      'a<a',
      'a>a',
      `a\\a`,
      'a/a',
      'a?a',
      'a:a',
      'a|a'
    ];

    await libraryDialog.getLabelText(libraryNameLabel).fill(randomLibraryName);

    for (const specialLibraryId of idsWithSpecialChars) {
      await libraryDialog.getLabelText(libraryIdLabel).clear();
      await libraryDialog.getLabelText(libraryIdLabel).fill(specialLibraryId);
      await libraryDialog.page.keyboard.press(tabKeyString);
      await expect(libraryDialog.getLabelText(libraryIdLabel)).toHaveValue(specialLibraryId);
      expect(await libraryDialog.isErrorMessageDisplayed(libraryErrors.useNumbersAndLettersOnly), errorMessageNotPresent).toBe(true);
      await expect(libraryDialog.createButton).toBeDisabled();
    }
  });

  test('[XAT-5124] Duplicate library ID', async () => {
    await libraryDialog.getLabelText(libraryNameLabel).fill(randomLibraryName);
    await libraryDialog.getLabelText(libraryIdLabel).clear();
    await libraryDialog.getLabelText(libraryIdLabel).fill(commonLibraryName);
    await libraryDialog.page.keyboard.press(tabKeyString);
    await expect(libraryDialog.getLabelText(libraryIdLabel)).toHaveValue(commonLibraryName);

    await expect(libraryDialog.createButton).toBeDisabled();
    expect(await libraryDialog.isErrorMessageDisplayed(libraryErrors.libraryIdIsNotAvailable), errorMessageNotPresent).toBe(true);
  });

  test('[XAT-5125] Create library using the ID of a library from the Trashcan', async () => {
    await libraryDialog.getLabelText(libraryNameLabel).fill(randomLibraryName);
    await libraryDialog.getLabelText(libraryIdLabel).clear();
    await libraryDialog.getLabelText(libraryIdLabel).fill(commonTrashLibraryName);
    await libraryDialog.page.keyboard.press(tabKeyString);

    await expect(libraryDialog.createButton).toBeEnabled();
    await libraryDialog.createButton.click();
    await expect(libraryDialog.createButton).toBeDisabled();
    expect(await libraryDialog.isErrorMessageDisplayed(libraryErrors.libraryIdIsAlreadyUsed), errorMessageNotPresent).toBe(true);
  });
});
