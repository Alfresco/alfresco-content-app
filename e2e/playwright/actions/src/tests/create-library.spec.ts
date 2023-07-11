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

import { expect } from '@playwright/test';
import { libraryErrors, ApiClientFactory, getUserState, test } from '@alfresco/playwright-shared';
import { SiteBodyCreate } from '@alfresco/js-api';
import { GeneralUtils } from '../../../../../projects/aca-playwright-shared/src/utils/general-utils';

test.use({ storageState: getUserState('hruser') });
test.describe('Create Libraries ', () => {
  const apiClientFactory = new ApiClientFactory();
  let randomLibraryName: string;
  let randomLibraryId: string;
  let randomLibraryDescription: string;
  const libraryDialogTitle = 'Create Library';
  const libraryNameLebel = 'Name *';
  const libraryIdLebel = 'Library ID *';
  const libraryDescriptionLebel = 'Description';
  const publicVisibility = 'Public';
  const moderatedVisibility = 'Moderated';
  const privateVisibility = 'Private';
  const deleteAction = 'Delete';

  const commonLibraryName = `playwright-library-${GeneralUtils.random()}`;
  const commonLibraryId = `libraryId-${GeneralUtils.random()}`;
  const commonTrashLibraryName = `playwright-library-${GeneralUtils.random()}`;
  const commonTrashLibraryId = `libraryId-${GeneralUtils.random()}`;

  test.beforeAll(async () => {
    await apiClientFactory.setUpAcaBackend('hruser');
    await apiClientFactory.sites.createSite({ id: commonLibraryId, title: commonLibraryName, visibility: SiteBodyCreate.VisibilityEnum.PUBLIC });
    await apiClientFactory.sites.createSite({
      id: commonTrashLibraryId,
      title: commonTrashLibraryName,
      visibility: SiteBodyCreate.VisibilityEnum.PUBLIC
    });
    await apiClientFactory.sites.deleteSite(commonTrashLibraryId);
  });

  test.beforeEach(async ({ myLibrariesPage }) => {
    randomLibraryName = `playwright-library-${GeneralUtils.random()}`;
    randomLibraryId = `libraryId-${GeneralUtils.random()}`;
    randomLibraryDescription = `libraryDescription-${GeneralUtils.random()}`;
    await myLibrariesPage.navigate();
  });

  test.afterAll(async () => {
    await apiClientFactory.sites.deleteSite(commonLibraryId, { permanent: true });
  });

  test('[C280024] Create Library dialog UI', async ({ myLibrariesPage }) => {
    const libraryDialog = myLibrariesPage.libraryDialog;

    await myLibrariesPage.selectCreateLibrary();

    await expect(libraryDialog.getDialogTitle(libraryDialogTitle)).toBeVisible();
    await expect(libraryDialog.getLabelText(libraryNameLebel)).toBeVisible();
    await expect(libraryDialog.getLabelText(libraryIdLebel)).toBeVisible();
    await expect(libraryDialog.getLabelText(libraryDescriptionLebel)).toBeVisible();
    await expect(libraryDialog.getLabelText(publicVisibility)).toBeVisible();
    await expect(libraryDialog.getLabelText(publicVisibility)).toBeChecked();
    await expect(libraryDialog.getLabelText(privateVisibility)).toBeVisible();
    await expect(libraryDialog.getLabelText(moderatedVisibility)).toBeVisible();
    await expect(libraryDialog.cancelButton).toBeEnabled();
    await expect(libraryDialog.createButton).toBeDisabled();
  });

  test('[C280025] Create a public library', async ({ myLibrariesPage }) => {
    const libraryDialog = myLibrariesPage.libraryDialog;
    const libraryTable = myLibrariesPage.dataTable;
    const libraryBreadcrumb = myLibrariesPage.breadcrumb;

    await myLibrariesPage.selectCreateLibrary();
    await libraryDialog.getLabelText(libraryNameLebel).fill(randomLibraryName);
    await expect(libraryDialog.getLabelText(libraryNameLebel)).toHaveValue(randomLibraryName);
    await expect(libraryDialog.getLabelText(libraryIdLebel)).toHaveValue(randomLibraryName);
    await libraryDialog.createButton.click();
    await expect(libraryBreadcrumb.getBreadcrumbItem(randomLibraryName)).toBeVisible();

    await myLibrariesPage.navigate();
    await libraryTable.goThroughPagesLookingForRowWithName(randomLibraryName);
    await expect(libraryTable.getCellByColumnNameAndRowItem(randomLibraryName, publicVisibility)).toBeVisible();

    await libraryTable.performActionFromExpandableMenu(randomLibraryName, deleteAction);
  });

  test('[C289880] Create a moderated library', async ({ myLibrariesPage }) => {
    const libraryDialog = myLibrariesPage.libraryDialog;
    const libraryTable = myLibrariesPage.dataTable;
    const libraryBreadcrumb = myLibrariesPage.breadcrumb;

    await myLibrariesPage.selectCreateLibrary();
    await libraryDialog.createLibraryWithNameAndId(randomLibraryName, randomLibraryId, null, moderatedVisibility);
    await expect(libraryBreadcrumb.getBreadcrumbItem(randomLibraryName)).toBeVisible();

    await myLibrariesPage.navigate();
    await libraryTable.goThroughPagesLookingForRowWithName(randomLibraryName);
    await expect(libraryTable.getCellByColumnNameAndRowItem(randomLibraryName, moderatedVisibility)).toBeVisible();

    await libraryTable.performActionFromExpandableMenu(randomLibraryName, deleteAction);
  });

  test('[C289881] Create a private library', async ({ myLibrariesPage }) => {
    const libraryDialog = myLibrariesPage.libraryDialog;
    const libraryTable = myLibrariesPage.dataTable;
    const libraryBreadcrumb = myLibrariesPage.breadcrumb;

    await myLibrariesPage.selectCreateLibrary();
    await libraryDialog.createLibraryWithNameAndId(randomLibraryName, randomLibraryId, null, privateVisibility);
    await expect(libraryBreadcrumb.getBreadcrumbItem(randomLibraryName)).toBeVisible();

    await myLibrariesPage.navigate();
    await libraryTable.goThroughPagesLookingForRowWithName(randomLibraryName);
    await expect(libraryTable.getCellByColumnNameAndRowItem(randomLibraryName, privateVisibility)).toBeVisible();

    await libraryTable.performActionFromExpandableMenu(randomLibraryName, deleteAction);
  });

  test('[C289882] Create a library with a given ID and description', async ({ myLibrariesPage }) => {
    const libraryDialog = myLibrariesPage.libraryDialog;
    const libraryTable = myLibrariesPage.dataTable;
    const libraryBreadcrumb = myLibrariesPage.breadcrumb;
    const libraryViewDetails = myLibrariesPage.acaHeader.viewDetails;
    const libraryDetails = myLibrariesPage.libraryDetails;

    await myLibrariesPage.selectCreateLibrary();
    await libraryDialog.createLibraryWithNameAndId(randomLibraryName, randomLibraryId, randomLibraryDescription);
    await expect(libraryBreadcrumb.getBreadcrumbItem(randomLibraryName)).toBeVisible();

    await myLibrariesPage.navigate();
    await libraryTable.goThroughPagesLookingForRowWithName(randomLibraryName);
    await expect(libraryTable.getCellLinkByName(randomLibraryName).and(myLibrariesPage.page.getByTitle(randomLibraryDescription))).toBeVisible();
    await libraryTable.getRowByName(randomLibraryName).click();
    await libraryViewDetails.click();
    await expect(libraryDetails.getFieldData('Name').and(libraryDetails.getFieldData(randomLibraryName))).toBeVisible();
    await expect(libraryDetails.getFieldData('Library ID').and(libraryDetails.getFieldData(randomLibraryId))).toBeVisible();
    await expect(libraryDetails.getFieldData('Visibility').and(libraryDetails.getFieldData(publicVisibility))).toBeVisible();
    await expect(libraryDetails.getFieldData(libraryDescriptionLebel).and(libraryDetails.getFieldData(randomLibraryDescription))).toBeVisible();

    await apiClientFactory.sites.deleteSite(randomLibraryId, { permanent: true });
  });

  test('[C280027] Duplicate library ID', async ({ myLibrariesPage }) => {
    const libraryDialog = myLibrariesPage.libraryDialog;

    await myLibrariesPage.selectCreateLibrary();
    await libraryDialog.getLabelText(libraryNameLebel).fill(randomLibraryName);
    await libraryDialog.getLabelText(libraryIdLebel).clear();
    await libraryDialog.getLabelText(libraryIdLebel).fill(commonLibraryId);

    await expect(libraryDialog.createButton).toBeDisabled();
    await expect(libraryDialog.getMatError(libraryErrors.libraryIdIsNotAvailable)).toBeVisible();
  });

  test('[C280028] Create library using the ID of a library from the Trashcan', async ({ myLibrariesPage }) => {
    const libraryDialog = myLibrariesPage.libraryDialog;

    await myLibrariesPage.selectCreateLibrary();
    await libraryDialog.getLabelText(libraryNameLebel).fill(randomLibraryName);
    await libraryDialog.getLabelText(libraryIdLebel).clear();
    await libraryDialog.getLabelText(libraryIdLebel).fill(commonTrashLibraryId);

    await expect(libraryDialog.createButton).toBeEnabled();
    await libraryDialog.createButton.click();
    await expect(libraryDialog.createButton).toBeDisabled();
    await expect(libraryDialog.getMatError(libraryErrors.libraryIdIsAlreadyUsed)).toBeVisible();
  });

  test('[C280029] Cancel button', async ({ myLibrariesPage }) => {
    const libraryDialog = myLibrariesPage.libraryDialog;
    const libraryTable = myLibrariesPage.dataTable;
    const libraryBreadcrumb = myLibrariesPage.breadcrumb;

    await myLibrariesPage.selectCreateLibrary();
    await expect(libraryDialog.getDialogTitle(libraryDialogTitle)).toBeVisible();
    await libraryDialog.getLabelText(libraryNameLebel).fill(randomLibraryName);
    await libraryDialog.cancelButton.click();

    await expect(libraryDialog.getDialogTitle(libraryDialogTitle)).toBeHidden();
    await expect(libraryBreadcrumb.getBreadcrumbItem(randomLibraryName)).toHaveCount(0);
    await expect(libraryTable.getRowByName(randomLibraryName)).toHaveCount(0);
  });

  test('[C280026] Library ID cannot contain special characters', async ({ myLibrariesPage }) => {
    const libraryDialog = myLibrariesPage.libraryDialog;
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

    await myLibrariesPage.selectCreateLibrary();
    await libraryDialog.getLabelText(libraryNameLebel).fill(randomLibraryName);

    for (const specialLibraryId of idsWithSpecialChars) {
      await libraryDialog.getLabelText(libraryIdLebel).clear();
      await libraryDialog.getLabelText(libraryIdLebel).fill(specialLibraryId);
      await expect(libraryDialog.getLabelText(libraryIdLebel)).toHaveValue(specialLibraryId);
      await expect(libraryDialog.getMatError(libraryErrors.useNumbersAndLettersOnly)).toBeVisible();
      await expect(libraryDialog.createButton).toBeDisabled();
    }
  });

  test('[C280030] Create 2 libraries with same name but different IDs', async ({ myLibrariesPage }) => {
    const libraryDialog = myLibrariesPage.libraryDialog;
    const libraryTable = myLibrariesPage.dataTable;
    const libraryBreadcrumb = myLibrariesPage.breadcrumb;
    const libraryName = commonLibraryName + ' (' + commonLibraryId + ')';
    const libraryName2 = commonLibraryName + ' (' + randomLibraryId + ')';

    await myLibrariesPage.selectCreateLibrary();
    await libraryDialog.createLibraryWithNameAndId(commonLibraryName, randomLibraryId);

    await expect(libraryBreadcrumb.getBreadcrumbItem(commonLibraryName)).toBeVisible();

    await myLibrariesPage.navigate();
    await libraryTable.goThroughPagesLookingForRowWithName(libraryName);
    await expect(libraryTable.getRowByName(libraryName)).toBeVisible();
    await libraryTable.goThroughPagesLookingForRowWithName(libraryName2);
    await expect(libraryTable.getRowByName(libraryName2)).toBeVisible();

    await apiClientFactory.sites.deleteSite(randomLibraryId, { permanent: true });
  });
});
