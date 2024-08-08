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
import { ApiClientFactory, NodesApi, Utils, test, TrashcanApi } from '@alfresco/playwright-shared';

test.describe('Edit folder', () => {
  const apiClientFactory = new ApiClientFactory();
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;

  let parentId: string;
  let folderNameToEditId: string;

  const username = `user-${Utils.random()}`;
  const parent = `parent-${Utils.random()}`;
  const folderName = `folder-${Utils.random()}`;
  const folderDescription = 'my folder description';

  const folderNameToEdit = `folder-${Utils.random()}`;
  const duplicateFolderName = `folder-${Utils.random()}`;

  const folderNameEdited = `folder-renamed-${Utils.random()}`;
  const folderDescriptionEdited = 'description edited';

  test.beforeAll(async () => {
    try {
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);

      parentId = (await nodesApi.createFolder(parent)).entry.id;
      await nodesApi.createFolder(folderName, parentId, '', folderDescription);
      folderNameToEditId = (await nodesApi.createFolder(folderNameToEdit, parentId)).entry.id;
      await nodesApi.createFolder(duplicateFolderName, parentId);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage, personalFiles }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    await personalFiles.dataTable.performClickFolderOrFileToOpen(parent);
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test.describe('on Personal Files', () => {
    test('[XAT-5089] "Edit folder" dialog UI', async ({ personalFiles }) => {
      await personalFiles.dataTable.selectItems(folderName);
      await personalFiles.acaHeader.clickMoreActions();
      await personalFiles.matMenu.clickMenuItemFromHeaderMenu('Edit');

      await expect(personalFiles.editDialog.editDialog).toBeVisible();
      await expect(personalFiles.editDialog.titleInput).toHaveText('Edit folder');
      await expect(personalFiles.editDialog.nameInput).toHaveValue(folderName);
      await expect(personalFiles.editDialog.descriptionInput).toHaveValue(folderDescription);
      await expect(personalFiles.editDialog.cancelButton).toBeEnabled();
      await expect(personalFiles.editDialog.updateButton).toBeEnabled();
    });

    test('[XAT-5093] Properties are modified when clicking Update button', async ({ personalFiles }) => {
      await personalFiles.dataTable.selectItems(folderNameToEdit);
      await personalFiles.acaHeader.clickMoreActions();
      await personalFiles.matMenu.clickMenuItemFromHeaderMenu('Edit');
      await personalFiles.editDialog.descriptionInput.fill(folderDescriptionEdited);
      await personalFiles.editDialog.nameInput.fill(folderNameEdited);
      await personalFiles.editDialog.updateButton.click();

      await expect(personalFiles.editDialog.editDialog).toBeHidden();
      expect(await personalFiles.dataTable.isItemPresent(folderNameEdited)).toBeTruthy();
      const description = await nodesApi.getNodeProperty(folderNameToEditId, 'cm:description');
      expect(description).toEqual(folderDescriptionEdited);
    });

    test('[XAT-5090] Empty folder name', async ({ personalFiles }) => {
      await personalFiles.dataTable.selectItems(folderName);
      await personalFiles.acaHeader.clickMoreActions();
      await personalFiles.matMenu.clickMenuItemFromHeaderMenu('Edit');
      await personalFiles.editDialog.nameInput.fill('');

      await expect(personalFiles.editDialog.updateButton).toBeDisabled();
      await expect(personalFiles.editDialog.fieldHint).toHaveText('Folder name is required');
    });

    test('[XAT-5091] Folder name with special characters', async ({ personalFiles }) => {
      const namesWithSpecialChars = ['a*a', 'a"a', 'a<a', 'a>a', `a\\a`, 'a/a', 'a?a', 'a:a', 'a|a'];

      await personalFiles.dataTable.selectItems(folderName);
      await personalFiles.acaHeader.clickMoreActions();
      await personalFiles.matMenu.clickMenuItemFromHeaderMenu('Edit');

      for (const name of namesWithSpecialChars) {
        await personalFiles.editDialog.nameInput.fill(name);
        await expect(personalFiles.editDialog.updateButton).toBeDisabled();
        expect(await personalFiles.editDialog.fieldHint.innerText()).toContain(`Folder name can't contain these characters`);
      }
    });

    test('[XAT-5092] Folder name ending with a dot', async ({ personalFiles }) => {
      await personalFiles.dataTable.selectItems(folderName);
      await personalFiles.acaHeader.clickMoreActions();
      await personalFiles.matMenu.clickMenuItemFromHeaderMenu('Edit');
      await personalFiles.editDialog.nameInput.fill(`${folderName}.`);

      await expect(personalFiles.editDialog.updateButton).toBeDisabled();
      expect(await personalFiles.editDialog.fieldHint.innerText()).toContain(`Folder name can't end with a period`);
    });

    test('[XAT-5094] Cancel editing properties', async ({ personalFiles }) => {
      await personalFiles.dataTable.selectItems(folderName);
      await personalFiles.acaHeader.clickMoreActions();
      await personalFiles.matMenu.clickMenuItemFromHeaderMenu('Edit');
      await personalFiles.editDialog.cancelButton.click();

      await expect(personalFiles.editDialog.editDialog).toBeHidden();
    });

    test('[XAT-5095] Duplicated folder name', async ({ personalFiles }) => {
      await personalFiles.dataTable.selectItems(folderName);
      await personalFiles.acaHeader.clickMoreActions();
      await personalFiles.matMenu.clickMenuItemFromHeaderMenu('Edit');
      await personalFiles.editDialog.nameInput.fill(duplicateFolderName);
      await personalFiles.editDialog.updateButton.click();

      await expect(personalFiles.editDialog.editDialog).toBeVisible();
      expect(await personalFiles.snackBar.getSnackBarMessage()).toEqual(`There's already a folder with this name. Try a different name.`);
    });

    test('[XAT-5096] Trim ending spaces', async ({ personalFiles }) => {
      await personalFiles.dataTable.selectItems(folderName);
      await personalFiles.acaHeader.clickMoreActions();
      await personalFiles.matMenu.clickMenuItemFromHeaderMenu('Edit');
      await personalFiles.editDialog.nameInput.fill(`${folderName} `);
      await personalFiles.editDialog.updateButton.click();

      await expect(personalFiles.editDialog.editDialog).toBeHidden();
      expect(await personalFiles.dataTable.isItemPresent(folderName)).toBeTruthy();
    });
  });
});
