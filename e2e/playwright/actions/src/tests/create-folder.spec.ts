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
import { ApiClientFactory, Utils, folderErrors, getUserState, test } from '@alfresco/playwright-shared';

test.use({ storageState: getUserState('hruser') });
test.describe('Create folders', () => {
  const apiClientFactory = new ApiClientFactory();
  let randomFolderName: string;
  let randomFolderTitle: string;
  let randomFolderDescription: string;
  const commonFolderName = `playwright-folder-${Utils.random()}`;
  let folderId: string;

  test.beforeAll(async () => {
    await apiClientFactory.setUpAcaBackend('hruser');
    const node = await apiClientFactory.nodes.createNode('-my-', { name: commonFolderName, nodeType: 'cm:folder' });
    folderId = node.entry.id;
  });

  test.beforeEach(async ({ personalFiles }) => {
    randomFolderName = `playwright-folder-${Utils.random()}`;
    randomFolderTitle = `folder-title-${Utils.random()}`;
    randomFolderDescription = `folder-description-${Utils.random()}`;
    await personalFiles.navigate();
  });

  test.afterAll(async () => {
    await apiClientFactory.nodes.deleteNode(folderId, { permanent: true });
  });

  test('[C216341] Create a folder with name only', async ({ personalFiles }) => {
    const folderDialog = personalFiles.folderDialog;
    const folderTable = personalFiles.dataTable;

    await personalFiles.selectCreateFolder();
    await folderDialog.createNewFolderDialog(randomFolderName);

    await folderTable.goThroughPagesLookingForRowWithName(randomFolderName);
    await expect(folderTable.getRowByName(randomFolderName)).toBeVisible();

    await folderTable.performActionInExpandableMenu(randomFolderName, 'Delete');
  });

  test('[C216340] Create a folder with name, title and description', async ({ personalFiles }) => {
    const folderDialog = personalFiles.folderDialog;
    const folderTable = personalFiles.dataTable;

    await personalFiles.selectCreateFolder();
    await folderDialog.createNewFolderDialog(randomFolderName, randomFolderTitle, randomFolderDescription);

    await folderTable.goThroughPagesLookingForRowWithName(randomFolderName);
    await expect(folderTable.getCellLinkByName(randomFolderName)).toHaveAttribute('title', randomFolderTitle + `\n` + randomFolderDescription);

    await folderTable.performActionInExpandableMenu(randomFolderName, 'Delete');
  });

  test('[C216345] Create new folder dialog check', async ({ personalFiles }) => {
    const folderDialog = personalFiles.folderDialog;

    await personalFiles.selectCreateFolder();

    await expect(folderDialog.getLabelText('Name')).toBeVisible();
    await expect(folderDialog.getLabelText('*')).toBeVisible();
    await expect(folderDialog.folderNameInputLocator).toBeVisible();
    await expect(folderDialog.getLabelText('Title')).toBeVisible();
    await expect(folderDialog.folderTitleInput).toBeVisible();
    await expect(folderDialog.getLabelText('Description')).toBeVisible();
    await expect(folderDialog.folderDescriptionInput).toBeVisible();
    await expect(folderDialog.cancelButton).toBeEnabled();
    await expect(folderDialog.createButton).toBeDisabled();
  });

  test('[C216346] Create a folder without a name', async ({ personalFiles }) => {
    const folderDialog = personalFiles.folderDialog;

    await personalFiles.selectCreateFolder();
    await folderDialog.folderNameInputLocator.fill(randomFolderName);
    await expect(folderDialog.folderNameInputLocator).toHaveValue(randomFolderName);
    await expect(folderDialog.createButton).toBeEnabled();

    await folderDialog.folderNameInputLocator.clear();

    await expect(folderDialog.folderNameInputLocator).toBeEmpty();
    await expect(folderDialog.folderNameInputHint).toContainText(folderErrors.folderNameIsRequired);
    await expect(folderDialog.createButton).toBeDisabled();
  });

  test('[C216348] Create folder when a name that ends with a dot "."', async ({ personalFiles }) => {
    const folderDialog = personalFiles.folderDialog;

    await personalFiles.selectCreateFolder();
    await folderDialog.folderNameInputLocator.fill(randomFolderName + '.');

    await expect(folderDialog.createButton).toBeDisabled();
    await expect(folderDialog.folderNameInputHint).toContainText(folderErrors.folderNameCantEndWithAPeriod);
  });

  test('[C216347] Create folder with a name containing special characters', async ({ personalFiles }) => {
    const namesWithSpecialChars = ['a*a', 'a"a', 'a<a', 'a>a', `a\\a`, 'a/a', 'a?a', 'a:a', 'a|a'];
    const folderDialog = personalFiles.folderDialog;

    await personalFiles.selectCreateFolder();
    for (const folderName of namesWithSpecialChars) {
      await folderDialog.folderNameInputLocator.fill(folderName);

      await expect(folderDialog.createButton).toBeDisabled();
      await expect(folderDialog.folderNameInputHint).toContainText(folderErrors.folderNameCantContainTheseCharacters);
    }
  });

  test('[C280406] Create a folder with a name containing only spaces', async ({ personalFiles }) => {
    const folderDialog = personalFiles.folderDialog;

    await personalFiles.selectCreateFolder();
    await folderDialog.folderNameInputLocator.fill('   ');

    await expect(folderDialog.createButton).toBeDisabled();
    await expect(folderDialog.folderNameInputHint).toContainText(folderErrors.folderNameCantContainOnlySpaces);
  });

  test('[C216349] Cancel folder creation', async ({ personalFiles }) => {
    const folderDialog = personalFiles.folderDialog;

    await personalFiles.selectCreateFolder();
    await expect(personalFiles.page.getByRole('dialog', { name: 'Create new folder' })).toBeVisible();
    await folderDialog.folderNameInputLocator.fill(randomFolderName);
    await folderDialog.cancelButton.click();
    await expect(personalFiles.page.getByRole('dialog', { name: 'Create new folder' })).toBeHidden();
  });

  test('[C216350] Duplicate folder name error', async ({ personalFiles }) => {
    const folderDialog = personalFiles.folderDialog;
    const folderSnackBar = personalFiles.snackBar;

    await personalFiles.selectCreateFolder();
    await folderDialog.createNewFolderDialog(commonFolderName);

    await expect(folderSnackBar.getByMessageLocator(folderErrors.thereIsAlreadyAFolderWithThisName)).toBeVisible();
  });

  test('[C216351] Folder created after trimmed ending spaces from a folder name', async ({ personalFiles }) => {
    const folderDialog = personalFiles.folderDialog;
    const folderTable = personalFiles.dataTable;

    await personalFiles.selectCreateFolder();
    await folderDialog.createNewFolderDialog(randomFolderName + '   ');

    await folderTable.goThroughPagesLookingForRowWithName(randomFolderName);
    await expect(folderTable.getRowByName(randomFolderName)).toBeVisible();

    await folderTable.performActionInExpandableMenu(randomFolderName, 'Delete');
  });
});
