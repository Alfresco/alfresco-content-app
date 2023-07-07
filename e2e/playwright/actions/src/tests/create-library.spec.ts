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
import { getUserState, test } from '@alfresco/playwright-shared';
import { libraryErrors } from '../../../../../projects/aca-playwright-shared/src/utils/library-errors';

test.use({ storageState: getUserState('hruser') });
test.describe('Create Libraries ', () => {
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

  test.beforeEach(async ({ myLibrariesPage }) => {
    randomLibraryName = `playwright-library-${(Math.random() + 1).toString(36).substring(6)}`;
    randomLibraryId = `libraryId-${(Math.random() + 1).toString(36).substring(6)}`;
    randomLibraryDescription = `libraryDescription-${(Math.random() + 1).toString(36).substring(6)}`;
    await myLibrariesPage.navigate();
  });

  test('[C280024] Create Library dialog UI', async ({ myLibrariesPage }) => {
    await myLibrariesPage.acaHeader.createButton.click();
    await myLibrariesPage.matMenu.createLibrary.click();

    await expect(myLibrariesPage.libraryDialog.getDialogTitle(libraryDialogTitle)).toBeVisible();
    await expect(myLibrariesPage.libraryDialog.getLabelText(libraryNameLebel)).toBeVisible();
    await expect(myLibrariesPage.libraryDialog.getLabelText(libraryIdLebel)).toBeVisible();
    await expect(myLibrariesPage.libraryDialog.getLabelText(libraryDescriptionLebel)).toBeVisible();
    await expect(myLibrariesPage.libraryDialog.getLabelText(publicVisibility)).toBeVisible();
    await expect(myLibrariesPage.libraryDialog.getLabelText(publicVisibility)).toBeChecked();
    await expect(myLibrariesPage.libraryDialog.getLabelText(privateVisibility)).toBeVisible();
    await expect(myLibrariesPage.libraryDialog.getLabelText(moderatedVisibility)).toBeVisible();
    await expect(myLibrariesPage.libraryDialog.cancelButton).toBeEnabled();
    await expect(myLibrariesPage.libraryDialog.createButton).toBeDisabled();
  });

  test('[C280025] Create a public library', async ({ myLibrariesPage }) => {
    await myLibrariesPage.acaHeader.createButton.click();
    await myLibrariesPage.matMenu.createLibrary.click();
    await myLibrariesPage.libraryDialog.getLabelText(libraryNameLebel).fill(randomLibraryName);
    await expect(myLibrariesPage.libraryDialog.getLabelText(libraryNameLebel)).toHaveValue(randomLibraryName);
    await expect(myLibrariesPage.libraryDialog.getLabelText(libraryIdLebel)).toHaveValue(randomLibraryName);
    await myLibrariesPage.libraryDialog.createButton.click();

    await expect(myLibrariesPage.breadcrumb.getBreadcrumbItem(randomLibraryName)).toBeVisible();

    await myLibrariesPage.navigate();
    await myLibrariesPage.dataTable.goThroughPagesLookingForRowWithName(randomLibraryName);
    await expect(myLibrariesPage.dataTable.getCellByColumnNameAndRowItem(randomLibraryName, publicVisibility)).toBeVisible();

    await myLibrariesPage.dataTable.performActionFromExpandableMenu(randomLibraryName, deleteAction);
  });

  test('[C289880] Create a moderated library', async ({ myLibrariesPage }) => {
    await myLibrariesPage.acaHeader.createButton.click();
    await myLibrariesPage.matMenu.createLibrary.click();
    await myLibrariesPage.libraryDialog.createLibraryWithNameAndId(randomLibraryName, randomLibraryId, null, moderatedVisibility);
    await expect(myLibrariesPage.breadcrumb.getBreadcrumbItem(randomLibraryName)).toBeVisible();

    await myLibrariesPage.navigate();
    await myLibrariesPage.dataTable.goThroughPagesLookingForRowWithName(randomLibraryName);
    await expect(myLibrariesPage.dataTable.getCellByColumnNameAndRowItem(randomLibraryName, moderatedVisibility)).toBeVisible();

    await myLibrariesPage.dataTable.performActionFromExpandableMenu(randomLibraryName, deleteAction);
  });

  test('[C289881] Create a private library', async ({ myLibrariesPage }) => {
    await myLibrariesPage.acaHeader.createButton.click();
    await myLibrariesPage.matMenu.createLibrary.click();
    await myLibrariesPage.libraryDialog.createLibraryWithNameAndId(randomLibraryName, randomLibraryId, null, privateVisibility);
    await expect(myLibrariesPage.breadcrumb.getBreadcrumbItem(randomLibraryName)).toBeVisible();

    await myLibrariesPage.navigate();
    await myLibrariesPage.dataTable.goThroughPagesLookingForRowWithName(randomLibraryName);
    await expect(myLibrariesPage.dataTable.getCellByColumnNameAndRowItem(randomLibraryName, privateVisibility)).toBeVisible();

    await myLibrariesPage.dataTable.performActionFromExpandableMenu(randomLibraryName, deleteAction);
  });

  test('[C289882] Create a library with a given ID and description', async ({ myLibrariesPage }) => {
    await myLibrariesPage.acaHeader.createButton.click();
    await myLibrariesPage.matMenu.createLibrary.click();
    await myLibrariesPage.libraryDialog.createLibraryWithNameAndId(randomLibraryName, randomLibraryId, randomLibraryDescription);

    await expect(myLibrariesPage.breadcrumb.getBreadcrumbItem(randomLibraryName)).toBeVisible();

    await myLibrariesPage.navigate();
    await myLibrariesPage.dataTable.goThroughPagesLookingForRowWithName(randomLibraryName);
    await expect(
      myLibrariesPage.dataTable.getCellLinkByName(randomLibraryName).and(myLibrariesPage.page.getByTitle(randomLibraryDescription))
    ).toBeVisible();

    await myLibrariesPage.dataTable.getRowByName(randomLibraryName).click();
    await myLibrariesPage.acaHeader.viewDetails.click();
    await expect(myLibrariesPage.viewDetails.getFieldData('Name').and(myLibrariesPage.viewDetails.getFieldData(randomLibraryName))).toBeVisible();
    await expect(myLibrariesPage.viewDetails.getFieldData('Library ID').and(myLibrariesPage.viewDetails.getFieldData(randomLibraryId))).toBeVisible();
    await expect(
      myLibrariesPage.viewDetails.getFieldData('Visibility').and(myLibrariesPage.viewDetails.getFieldData(publicVisibility))
    ).toBeVisible();
    await expect(
      myLibrariesPage.viewDetails.getFieldData(libraryDescriptionLebel).and(myLibrariesPage.viewDetails.getFieldData(randomLibraryDescription))
    ).toBeVisible();

    await myLibrariesPage.dataTable.performActionFromExpandableMenu(randomLibraryName, deleteAction);
  });

  test('[C280027] Duplicate library ID', async ({ myLibrariesPage }) => {
    await myLibrariesPage.acaHeader.createButton.click();
    await myLibrariesPage.matMenu.createLibrary.click();
    await myLibrariesPage.libraryDialog.createLibraryWithNameAndId(randomLibraryName, randomLibraryId);

    await myLibrariesPage.navigate();
    // duplicate library id
    await myLibrariesPage.acaHeader.createButton.click();
    await myLibrariesPage.matMenu.createLibrary.click();
    await myLibrariesPage.libraryDialog.getLabelText(libraryNameLebel).fill(randomLibraryName + '2');
    await myLibrariesPage.libraryDialog.getLabelText(libraryIdLebel).clear();
    await myLibrariesPage.libraryDialog.getLabelText(libraryIdLebel).fill(randomLibraryId);

    await expect(myLibrariesPage.libraryDialog.createButton).toBeDisabled();
    await expect(myLibrariesPage.libraryDialog.getMatError(libraryErrors.libraryIdIsNotAvailable)).toBeVisible();

    await myLibrariesPage.libraryDialog.cancelButton.click();
    await myLibrariesPage.dataTable.performActionFromExpandableMenu(randomLibraryName, deleteAction);
  });

  test('[C280028] Create library using the ID of a library from the Trashcan', async ({ myLibrariesPage }) => {
    await myLibrariesPage.acaHeader.createButton.click();
    await myLibrariesPage.matMenu.createLibrary.click();
    await myLibrariesPage.libraryDialog.createLibraryWithNameAndId(randomLibraryName, randomLibraryId);

    await myLibrariesPage.navigate();
    await myLibrariesPage.dataTable.performActionFromExpandableMenu(randomLibraryName, deleteAction);
    // library id from the trashcan
    await myLibrariesPage.acaHeader.createButton.click();
    await myLibrariesPage.matMenu.createLibrary.click();
    await myLibrariesPage.libraryDialog.getLabelText(libraryNameLebel).fill(randomLibraryName + '2');
    await myLibrariesPage.libraryDialog.getLabelText(libraryIdLebel).clear();
    await myLibrariesPage.libraryDialog.getLabelText(libraryIdLebel).fill(randomLibraryId);

    await expect(myLibrariesPage.libraryDialog.createButton).toBeEnabled();
    await myLibrariesPage.libraryDialog.createButton.click();
    await expect(myLibrariesPage.libraryDialog.createButton).toBeDisabled();
    await expect(myLibrariesPage.libraryDialog.getMatError(libraryErrors.libraryIdIsAlreadyUsed)).toBeVisible();

    await myLibrariesPage.libraryDialog.cancelButton.click();
  });

  test('[C280029] Cancel button', async ({ myLibrariesPage }) => {
    await myLibrariesPage.acaHeader.createButton.click();
    await myLibrariesPage.matMenu.createLibrary.click();
    await expect(myLibrariesPage.libraryDialog.getDialogTitle(libraryDialogTitle)).toBeVisible();
    await myLibrariesPage.libraryDialog.getLabelText(libraryNameLebel).fill(randomLibraryName);
    await myLibrariesPage.libraryDialog.cancelButton.click();

    await expect(myLibrariesPage.libraryDialog.getDialogTitle(libraryDialogTitle)).toBeHidden();
    await expect(myLibrariesPage.breadcrumb.getBreadcrumbItem(randomLibraryName)).toHaveCount(0);
    await expect(myLibrariesPage.dataTable.getRowByName(randomLibraryName)).toHaveCount(0);
  });

  test('[C280026] Library ID cannot contain special characters', async ({ myLibrariesPage }) => {
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
    await myLibrariesPage.acaHeader.createButton.click();
    await myLibrariesPage.matMenu.createLibrary.click();
    await myLibrariesPage.libraryDialog.getLabelText(libraryNameLebel).fill(randomLibraryName);

    for (const specialLibraryId of idsWithSpecialChars) {
      await myLibrariesPage.libraryDialog.getLabelText(libraryIdLebel).clear();
      await myLibrariesPage.libraryDialog.getLabelText(libraryIdLebel).fill(specialLibraryId);
      await expect(myLibrariesPage.libraryDialog.getLabelText(libraryIdLebel)).toHaveValue(specialLibraryId);
      await expect(myLibrariesPage.libraryDialog.getMatError(libraryErrors.useNumbersAndLettersOnly)).toBeVisible();
      await expect(myLibrariesPage.libraryDialog.createButton).toBeDisabled();
    }

    await myLibrariesPage.libraryDialog.cancelButton.click();
  });

  test('[C280030] Create 2 libraries with same name but different IDs', async ({ myLibrariesPage }) => {
    const libraryName = randomLibraryName + ' (' + randomLibraryId + ')';
    const libraryName2 = randomLibraryName + ' (' + randomLibraryId + '2)';

    await myLibrariesPage.acaHeader.createButton.click();
    await myLibrariesPage.matMenu.createLibrary.click();
    await myLibrariesPage.libraryDialog.createLibraryWithNameAndId(randomLibraryName, randomLibraryId);
    await myLibrariesPage.navigate();

    // duplicate library name but different id
    await myLibrariesPage.acaHeader.createButton.click();
    await myLibrariesPage.matMenu.createLibrary.click();
    await myLibrariesPage.libraryDialog.createLibraryWithNameAndId(randomLibraryName, randomLibraryId + '2');

    await expect(myLibrariesPage.breadcrumb.getBreadcrumbItem(randomLibraryName)).toBeVisible();

    await myLibrariesPage.navigate();
    await myLibrariesPage.dataTable.goThroughPagesLookingForRowWithName(libraryName);
    await expect(myLibrariesPage.dataTable.getRowByName(libraryName)).toBeVisible();
    await myLibrariesPage.dataTable.goThroughPagesLookingForRowWithName(libraryName2);
    await expect(myLibrariesPage.dataTable.getRowByName(libraryName2)).toBeVisible();

    await myLibrariesPage.dataTable.performActionFromExpandableMenu(libraryName2, deleteAction);
    await myLibrariesPage.dataTable.performActionFromExpandableMenu(randomLibraryName, deleteAction);
  });
});
