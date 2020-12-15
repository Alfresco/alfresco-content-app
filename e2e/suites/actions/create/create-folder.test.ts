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

import {
  AdminActions,
  LoginPage,
  BrowsingPage,
  CreateOrEditFolderDialog,
  Utils,
  clearTextWithBackspace,
  RepoClient
} from '@alfresco/aca-testing-shared';
import { BrowserActions } from '@alfresco/adf-testing';

describe('Create folder', () => {
  const username = `user-${Utils.random()}`;

  const parent = `parent-${Utils.random()}`;
  let parentId: string;
  const folderName1 = `folder-${Utils.random()}`;
  const folderName2 = `folder-${Utils.random()}`;
  const folderDescription = 'description of my folder';
  const duplicateFolderName = `folder-${Utils.random()}`;
  const nameWithSpaces = ` folder-${Utils.random()} `;

  const siteName = `site-${Utils.random()}`;

  const folderSite = `folder-site-${Utils.random()}`;
  const duplicateFolderSite = `folder-${Utils.random()}`;
  let docLibUserSite: string;

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const createDialog = new CreateOrEditFolderDialog();
  const { dataTable } = page;
  const adminApiActions = new AdminActions();

  async function openCreateFolderDialog(name: string) {
    await page.dataTable.doubleClickOnRowByName(name);
    await page.sidenav.openCreateFolderDialog();
    await createDialog.waitForDialogToOpen();
  }

  beforeAll(async (done) => {
    await adminApiActions.createUser({ username });

    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
    await apis.user.nodes.createFolder(duplicateFolderName, parentId);

    await apis.user.sites.createSite(siteName);
    docLibUserSite = await apis.user.sites.getDocLibId(siteName);
    await apis.user.nodes.createFolder(duplicateFolderSite, docLibUserSite);

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.sites.deleteSite(siteName);
    await apis.user.nodes.deleteNodeById(parentId);
    done();
  });

  describe('on Personal Files', () => {
    beforeEach(async (done) => {
      await page.clickPersonalFilesAndWait();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('[C216341] creates new folder with name', async () => {
      await openCreateFolderDialog(parent);
      await createDialog.enterName(folderName1);
      await BrowserActions.click(createDialog.createButton);
      await createDialog.waitForDialogToClose();
      await dataTable.waitForHeader();

      expect(await dataTable.isItemPresent(folderName1)).toBe(true, 'Folder not displayed in list view');
    });

    it('[C216340] creates new folder with name and description', async (done) => {
      await openCreateFolderDialog(parent);
      await createDialog.enterName(folderName2);
      await createDialog.enterDescription(folderDescription);
      await BrowserActions.click(createDialog.createButton);
      await createDialog.waitForDialogToClose();
      await dataTable.waitForHeader();

      expect(await dataTable.isItemPresent(folderName2)).toBe(true, 'Folder not displayed');
      const desc = await apis.user.nodes.getNodeDescription(folderName2, parentId);
      expect(desc).toEqual(folderDescription);
      done();
    });

    it('[C216345] dialog UI elements', async () => {
      await openCreateFolderDialog(parent);

      expect(await createDialog.getDialogTitle()).toMatch('Create new folder');
      expect(await createDialog.nameInput.isDisplayed()).toBe(true, 'Name input is not displayed');
      expect(await createDialog.descriptionTextArea.isDisplayed()).toBe(true, 'Description field is not displayed');
      expect(await createDialog.isCreateButtonEnabled()).toBe(false, 'Create button is not disabled');
      expect(await createDialog.isCancelButtonEnabled()).toBe(true, 'Cancel button is not enabled');
    });

    it('[C216346] with empty folder name', async () => {
      await openCreateFolderDialog(parent);
      await clearTextWithBackspace(createDialog.nameInput);

      expect(await createDialog.isCreateButtonEnabled()).toBe(false, 'Create button is enabled');
      expect(await createDialog.getValidationMessage()).toMatch('Folder name is required');
    });

    it('[C216348] with folder name ending with a dot "."', async () => {
      await openCreateFolderDialog(parent);
      await createDialog.enterName('folder-name.');

      expect(await createDialog.isCreateButtonEnabled()).toBe(false, 'Create button is not disabled');
      expect(await createDialog.getValidationMessage()).toMatch(`Folder name can't end with a period .`);
    });

    it('[C216347] with folder name containing special characters', async () => {
      const namesWithSpecialChars = ['a*a', 'a"a', 'a<a', 'a>a', `a\\a`, 'a/a', 'a?a', 'a:a', 'a|a'];

      await openCreateFolderDialog(parent);

      for (const name of namesWithSpecialChars) {
        await createDialog.enterName(name);
        expect(await createDialog.isCreateButtonEnabled()).toBe(false, 'Create button is not disabled');
        expect(await createDialog.getValidationMessage()).toContain(`Folder name can't contain these characters`);
      }
    });

    it('[C280406] with folder name containing only spaces', async () => {
      await openCreateFolderDialog(parent);
      await createDialog.enterName('    ');

      expect(await createDialog.isCreateButtonEnabled()).toBe(false, 'Create button is not disabled');
      expect(await createDialog.getValidationMessage()).toMatch(`Folder name can't contain only spaces`);
    });

    it('[C216349] cancel folder creation', async () => {
      await openCreateFolderDialog(parent);
      await createDialog.enterName('test');
      await createDialog.enterDescription('test description');
      await createDialog.clickCancel();

      expect(await createDialog.isDialogOpen()).not.toBe(true, 'dialog is not closed');
    });

    it('[C216350] duplicate folder name', async () => {
      await openCreateFolderDialog(parent);
      await createDialog.enterName(duplicateFolderName);
      await BrowserActions.click(createDialog.createButton);

      expect(await page.getSnackBarMessage()).toEqual(`There's already a folder with this name. Try a different name.`);
      expect(await createDialog.isDialogOpen()).toBe(true, 'dialog is not present');
    });

    it('[C216351] trim ending spaces from folder name', async () => {
      await openCreateFolderDialog(parent);
      await createDialog.enterName(nameWithSpaces);
      await BrowserActions.click(createDialog.createButton);
      await createDialog.waitForDialogToClose();
      await dataTable.waitForHeader();

      expect(await dataTable.isItemPresent(nameWithSpaces.trim())).toBe(true, 'Folder not displayed in list view');
    });
  });

  describe('on File Libraries', () => {
    const fileLibrariesPage = new BrowsingPage();

    beforeEach(async (done) => {
      await fileLibrariesPage.goToMyLibrariesAndWait();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('[C280394] creates new folder with name and description', async () => {
      await openCreateFolderDialog(siteName);
      await createDialog.enterName(folderSite);
      await createDialog.enterDescription(folderDescription);
      await BrowserActions.click(createDialog.createButton);
      await createDialog.waitForDialogToClose();
      await dataTable.waitForHeader();

      expect(await dataTable.isItemPresent(folderSite)).toBe(true, 'Folder not displayed');
      const desc = await apis.user.nodes.getNodeDescription(folderSite, docLibUserSite);
      expect(desc).toEqual(folderDescription);
    });

    it('[C280403] cancel folder creation', async () => {
      await openCreateFolderDialog(siteName);
      await createDialog.enterName('test');
      await createDialog.enterDescription('test description');
      await createDialog.clickCancel();

      expect(await createDialog.isDialogOpen()).not.toBe(true, 'dialog is not closed');
    });

    it('[C280404] duplicate folder name', async () => {
      await openCreateFolderDialog(siteName);
      await createDialog.enterName(duplicateFolderSite);
      await BrowserActions.click(createDialog.createButton);

      expect(await page.getSnackBarMessage()).toEqual(`There's already a folder with this name. Try a different name.`);
      expect(await createDialog.isDialogOpen()).toBe(true, 'dialog is not present');
    });
  });
});
