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
import { folderErrors, getUserState, test } from '@alfresco/playwright-shared';

test.use({ storageState: getUserState('hruser') });
test.describe('Create actions', () => {
  let randomFolderName: string;
  let randomFolderTitle: string;
  let randomFolderDescription: string;

  test.beforeEach(async ({ personalFiles }) => {
    randomFolderName = `playwright-folder-${(Math.random() + 1).toString(36).substring(6)}`;
    randomFolderTitle = `folder-title-${(Math.random() + 1).toString(36).substring(6)}`;
    randomFolderDescription = `folder-description-${(Math.random() + 1).toString(36).substring(6)}`;
    await personalFiles.navigate();
  });

  test('[C216341] Create a folder with name only', async ({ personalFiles }) => {
    await personalFiles.acaHeader.createButton.click();
    await personalFiles.matMenu.createFolder.click();
    await personalFiles.folderDialog.folderNameInputLocator.fill(randomFolderName);
    await personalFiles.folderDialog.createButton.click();

    await personalFiles.dataTable.goThroughPagesLookingForRowWithName(randomFolderName);
    await expect(personalFiles.dataTable.getRowByName(randomFolderName)).toBeVisible();

    await personalFiles.dataTable.performActionFromExpandableMenu(randomFolderName, 'Delete');
  });

  test('[C216340] Create a folder with name, title and description', async ({ personalFiles }) => {
    await personalFiles.acaHeader.createButton.click();
    await personalFiles.matMenu.createFolder.click();
    await personalFiles.folderDialog.folderNameInputLocator.fill(randomFolderName);
    await personalFiles.folderDialog.folderTitleInput.fill(randomFolderTitle);
    await personalFiles.folderDialog.folderDescriptionInput.fill(randomFolderDescription);
    await personalFiles.folderDialog.createButton.click();

    await personalFiles.dataTable.goThroughPagesLookingForRowWithName(randomFolderName);
    await expect(
      personalFiles.dataTable
        .getCellLinkByName(randomFolderName)
        .and(personalFiles.page.getByTitle(randomFolderTitle))
        .and(personalFiles.page.getByTitle(randomFolderDescription))
    ).toBeVisible();

    await personalFiles.dataTable.performActionFromExpandableMenu(randomFolderName, 'Delete');
  });

  test('[C216345] Create new folder dialog check', async ({ personalFiles }) => {
    await personalFiles.acaHeader.createButton.click();
    await personalFiles.matMenu.createFolder.click();

    await expect(personalFiles.folderDialog.getLabelText('Name')).toBeVisible();
    await expect(personalFiles.folderDialog.getLabelText('*')).toBeVisible();
    await expect(personalFiles.folderDialog.folderNameInputLocator).toBeVisible();
    await expect(personalFiles.folderDialog.getLabelText('Title')).toBeVisible();
    await expect(personalFiles.folderDialog.folderTitleInput).toBeVisible();
    await expect(personalFiles.folderDialog.getLabelText('Description')).toBeVisible();
    await expect(personalFiles.folderDialog.folderDescriptionInput).toBeVisible();
    await expect(personalFiles.folderDialog.cancelButton).toBeEnabled();
    await expect(personalFiles.folderDialog.createButton).toBeDisabled();
  });

  test('[C216346] Create a folder without a name', async ({ personalFiles }) => {
    await personalFiles.acaHeader.createButton.click();
    await personalFiles.matMenu.createFolder.click();
    await personalFiles.folderDialog.folderNameInputLocator.fill(randomFolderName);
    await expect(personalFiles.folderDialog.folderNameInputLocator).toHaveValue(randomFolderName);
    await expect(personalFiles.folderDialog.createButton).toBeEnabled();

    await personalFiles.folderDialog.folderNameInputLocator.clear();

    await expect(personalFiles.folderDialog.folderNameInputLocator).toBeEmpty();
    await expect(personalFiles.folderDialog.folderNameInputHint).toContainText(folderErrors.folderNameIsRequired);
    await expect(personalFiles.folderDialog.createButton).toBeDisabled();
  });

  test('[C216348] Create folder when a name that ends with a dot "."', async ({ personalFiles }) => {
    await personalFiles.acaHeader.createButton.click();
    await personalFiles.matMenu.createFolder.click();
    await personalFiles.folderDialog.folderNameInputLocator.fill(randomFolderName + '.');

    await expect(personalFiles.folderDialog.createButton).toBeDisabled();
    await expect(personalFiles.folderDialog.folderNameInputHint).toContainText(folderErrors.folderNameCantEndWithAPeriod);
  });

  test('[C216347] Create folder with a name containing special characters', async ({ personalFiles }) => {
    const namesWithSpecialChars = ['a*a', 'a"a', 'a<a', 'a>a', `a\\a`, 'a/a', 'a?a', 'a:a', 'a|a'];
    await personalFiles.acaHeader.createButton.click();
    await personalFiles.matMenu.createFolder.click();
    for (const folderName of namesWithSpecialChars) {
      await personalFiles.folderDialog.folderNameInputLocator.fill(folderName);

      await expect(personalFiles.folderDialog.createButton).toBeDisabled();
      await expect(personalFiles.folderDialog.folderNameInputHint).toContainText(folderErrors.folderNameCantContainTheseCharacters);
    }
  });

  test('[C280406] Create a folder with a name containing only spaces', async ({ personalFiles }) => {
    await personalFiles.acaHeader.createButton.click();
    await personalFiles.matMenu.createFolder.click();
    await personalFiles.folderDialog.folderNameInputLocator.fill('   ');

    await expect(personalFiles.folderDialog.createButton).toBeDisabled();
    await expect(personalFiles.folderDialog.folderNameInputHint).toContainText(folderErrors.folderNameCantContainOnlySpaces);
  });

  test('[C216349] Cancel folder creation', async ({ personalFiles }) => {
    await personalFiles.acaHeader.createButton.click();
    await personalFiles.matMenu.createFolder.click();
    await expect(personalFiles.page.getByRole('dialog', { name: 'Create new folder' })).toBeVisible();
    await personalFiles.folderDialog.folderNameInputLocator.fill(randomFolderName);
    await personalFiles.folderDialog.cancelButton.click();
    await expect(personalFiles.page.getByRole('dialog', { name: 'Create new folder' })).toBeHidden();
  });

  test('[C216350] Duplicate folder name error', async ({ personalFiles }) => {
    await personalFiles.acaHeader.createButton.click();
    await personalFiles.matMenu.createFolder.click();
    await personalFiles.folderDialog.folderNameInputLocator.fill(randomFolderName);
    await personalFiles.folderDialog.createButton.click();
    // duplicate folder name
    await personalFiles.acaHeader.createButton.click();
    await personalFiles.matMenu.createFolder.click();
    await personalFiles.folderDialog.folderNameInputLocator.fill(randomFolderName);
    await personalFiles.folderDialog.createButton.click();

    await expect(personalFiles.page.getByRole('dialog', { name: 'Create new folder' })).toBeVisible();
    await expect(personalFiles.snackBar.getByMessageLocator(folderErrors.thereIsAlreadyAFolderWithThisName)).toBeVisible();

    await personalFiles.folderDialog.cancelButton.click();
    await personalFiles.dataTable.performActionFromExpandableMenu(randomFolderName, 'Delete');
  });

  test('[C216351] Folder created after trimmed ending spaces from a folder name', async ({ personalFiles }) => {
    await personalFiles.acaHeader.createButton.click();
    await personalFiles.matMenu.createFolder.click();
    await personalFiles.folderDialog.folderNameInputLocator.fill(randomFolderName + '   ');
    await personalFiles.folderDialog.createButton.click();

    await personalFiles.dataTable.goThroughPagesLookingForRowWithName(randomFolderName);
    await expect(personalFiles.dataTable.getRowByName(randomFolderName)).toBeVisible();

    await personalFiles.dataTable.performActionFromExpandableMenu(randomFolderName, 'Delete');
  });
});
