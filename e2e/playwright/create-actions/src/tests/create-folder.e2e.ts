/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
  AdfFolderDialogComponent,
  ApiClientFactory,
  DataTableComponent,
  LoginPage,
  NodesApi,
  Utils,
  errorStrings,
  test,
  TrashcanApi
} from '@alfresco/playwright-shared';

test.describe('Create folders', () => {
  const apiClientFactory = new ApiClientFactory();
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let folderDialog: AdfFolderDialogComponent;
  let folderTable: DataTableComponent;
  let randomFolderName: string;
  let randomFolderTitle: string;
  let randomFolderDescription: string;
  const dialogString = 'dialog';
  const createNewFolderString = 'Create new folder';
  const spacesString = '   ';
  const commonFolderName = `create-folder-${Utils.random()}`;
  const username = `user-${Utils.random()}`;

  test.beforeAll(async () => {
    try {
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      await nodesApi.createFolder(commonFolderName);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }
  });

  test.beforeEach(async ({ personalFiles, page }) => {
    randomFolderName = `create-folder-${Utils.random()}`;
    randomFolderTitle = `folder-title-${Utils.random()}`;
    randomFolderDescription = `folder-description-${Utils.random()}`;
    folderDialog = personalFiles.folderDialog;
    const loginPage = new LoginPage(page);
    await Utils.tryLoginUser(loginPage, username, username, 'Main beforeEach failed');
    await personalFiles.navigate();
    await personalFiles.selectCreateFolder();
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[C216345] Create new folder dialog check', async () => {
    await expect(folderDialog.getLabelText('Name')).toBeVisible();
    await expect(folderDialog.getRequiredMarker('Name')).toBeVisible();
    await expect(folderDialog.folderNameInputLocator).toBeVisible();
    await expect(folderDialog.getLabelText('Title')).toBeVisible();
    await expect(folderDialog.folderTitleInput).toBeVisible();
    await expect(folderDialog.getLabelText('Description')).toBeVisible();
    await expect(folderDialog.folderDescriptionInput).toBeVisible();
    await expect(folderDialog.cancelButton).toBeEnabled();
    await expect(folderDialog.createButton).toBeDisabled();
  });

  test('[C216346] Create a folder without a name', async () => {
    await folderDialog.folderNameInputLocator.fill(randomFolderName);
    await expect(folderDialog.folderNameInputLocator).toHaveValue(randomFolderName);
    await expect(folderDialog.createButton).toBeEnabled();

    await folderDialog.folderNameInputLocator.clear();

    await expect(folderDialog.folderNameInputLocator).toBeEmpty();
    await expect(folderDialog.folderNameInputHint).toContainText(errorStrings.folderNameIsRequired);
    await expect(folderDialog.createButton).toBeDisabled();
  });

  test('[C216348] Create folder when a name that ends with a dot "."', async () => {
    await folderDialog.folderNameInputLocator.fill(randomFolderName + '.');

    await expect(folderDialog.createButton).toBeDisabled();
    await expect(folderDialog.folderNameInputHint).toContainText(errorStrings.folderNameCantEndWithAPeriod);
  });

  test('[C216347] Create folder with a name containing special characters', async () => {
    const namesWithSpecialChars = ['a*a', 'a"a', 'a<a', 'a>a', `a\\a`, 'a/a', 'a?a', 'a:a', 'a|a'];
    for (const folderName of namesWithSpecialChars) {
      await folderDialog.folderNameInputLocator.fill(folderName);

      await expect(folderDialog.createButton).toBeDisabled();
      await expect(folderDialog.folderNameInputHint).toContainText(errorStrings.folderNameCantContainTheseCharacters);
    }
  });

  test('[C280406] Create a folder with a name containing only spaces', async () => {
    await folderDialog.folderNameInputLocator.fill(spacesString);

    await expect(folderDialog.createButton).toBeDisabled();
    await expect(folderDialog.folderNameInputHint).toContainText(errorStrings.folderNameCantContainOnlySpaces);
  });

  test('[C216349] Cancel folder creation', async ({ personalFiles }) => {
    await expect(personalFiles.page.getByRole(dialogString, { name: createNewFolderString })).toBeVisible();
    await folderDialog.folderNameInputLocator.fill(randomFolderName);
    await folderDialog.cancelButton.click();
    await expect(personalFiles.page.getByRole(dialogString, { name: createNewFolderString })).toBeHidden();
  });

  test('[C216350] Duplicate folder name error', async ({ personalFiles }) => {
    const folderSnackBar = personalFiles.snackBar;

    await folderDialog.createNewFolderDialog(commonFolderName);

    await expect(folderSnackBar.getByMessageLocator(errorStrings.thereIsAlreadyAFolderWithThisName)).toBeVisible();
  });

  test.describe('On Personal Files dataTable', () => {
    test.beforeEach(async ({ personalFiles }) => {
      folderTable = personalFiles.dataTable;
    });

    test('[C216341] Create a folder with name only', async () => {
      await folderDialog.createNewFolderDialog(randomFolderName);

      await expect(folderTable.getRowByName(randomFolderName)).toBeVisible();
    });

    test('[C216340] Create a folder with name, title and description', async () => {
      await folderDialog.createNewFolderDialog(randomFolderName, randomFolderTitle, randomFolderDescription);

      await expect(folderTable.getCellLinkByName(randomFolderName)).toHaveAttribute('title', randomFolderTitle + `\n` + randomFolderDescription);
    });

    test('[C216351] Folder created after trimmed ending spaces from a folder name', async () => {
      await folderDialog.createNewFolderDialog(randomFolderName + spacesString);

      await expect(folderTable.getRowByName(randomFolderName)).toBeVisible();
    });
  });
});
