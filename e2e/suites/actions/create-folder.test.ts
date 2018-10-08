/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { browser } from 'protractor';

import { SIDEBAR_LABELS, SITE_VISIBILITY, SITE_ROLES } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { CreateOrEditFolderDialog } from '../../components/dialog/create-edit-folder-dialog';
import { Menu } from '../../components/menu/menu';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('Create folder', () => {
  const username = `user-${Utils.random()}`;

  const parent = `parent-${Utils.random()}`; let parentId;
  const folderName1 = `folder-${Utils.random()}`;
  const folderName2 = `folder-${Utils.random()}`;
  const folderDescription = 'description of my folder';
  const duplicateFolderName = `folder-${Utils.random()}`;
  const nameWithSpaces = ` folder-${Utils.random()} `;

  const siteName = `site-private-${Utils.random()}`;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const logoutPage = new LogoutPage();
  const personalFilesPage = new BrowsingPage();
  const createDialog = new CreateOrEditFolderDialog();
  const { dataTable } = personalFilesPage;
  const menu = new Menu();

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    await apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PRIVATE);
    const docLibId = (await apis.admin.sites.getDocLibId(siteName));
    await apis.admin.nodes.createFolder(folderName1, docLibId);
    await apis.admin.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_CONSUMER);
    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
    await apis.user.nodes.createFolder(duplicateFolderName, parentId);
    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.admin.sites.deleteSite(siteName);
    await apis.user.nodes.deleteNodeById(parentId);
    await logoutPage.load();
    done();
  });

  describe('on Personal Files', () => {
    beforeEach(async (done) => {
      await personalFilesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
      await dataTable.waitForHeader();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('option is enabled when having enough permissions - [C216339]', async () => {
      await personalFilesPage.dataTable.doubleClickOnRowByName(parent);
      await personalFilesPage.sidenav.openNewMenu();
      const isEnabled = await menu.getItemByLabel('Create folder').isEnabled();
      expect(isEnabled).toBe(true, 'Create folder is not enabled');
    });

    it('creates new folder with name - [C216341]', async () => {
      await personalFilesPage.dataTable.doubleClickOnRowByName(parent);
      await personalFilesPage.sidenav.openCreateDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.enterName(folderName1);
      await createDialog.clickCreate();
      await createDialog.waitForDialogToClose();
      await dataTable.waitForHeader();
      const isPresent = await dataTable.getRowByName(folderName1).isPresent();
      expect(isPresent).toBe(true, 'Folder not displayed in list view');
    });

    it('creates new folder with name and description - [C216340]', async (done) => {
      await personalFilesPage.dataTable.doubleClickOnRowByName(parent);
      await personalFilesPage.sidenav.openCreateDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.enterName(folderName2);
      await createDialog.enterDescription(folderDescription);
      await createDialog.clickCreate();
      await createDialog.waitForDialogToClose();
      await dataTable.waitForHeader();
      expect(await dataTable.getRowByName(folderName2).isPresent()).toBe(true, 'Folder not displayed');
      const desc = await apis.user.nodes.getNodeDescription(folderName2, parent);
      expect(desc).toEqual(folderDescription);
      done();
    });

    it('enabled option tooltip - [C216342]', async () => {
      await personalFilesPage.dataTable.doubleClickOnRowByName(parent);
      await personalFilesPage.sidenav.openNewMenu();
      await browser.actions().mouseMove(menu.getItemByLabel('Create folder')).perform();
      expect(await menu.getItemTooltip('Create folder')).toContain('Create new folder');
    });

    it('dialog UI elements - [C216345]', async () => {
      await personalFilesPage.dataTable.doubleClickOnRowByName(parent);
      await personalFilesPage.sidenav.openCreateDialog();
      await createDialog.waitForDialogToOpen();
      const dialogTitle = await createDialog.getTitle();
      const isFolderNameDisplayed = await createDialog.nameInput.isDisplayed();
      const isDescriptionDisplayed = await createDialog.descriptionTextArea.isDisplayed();
      const isCreateEnabled = await createDialog.createButton.isEnabled();
      const isCancelEnabled = await createDialog.cancelButton.isEnabled();

      expect(dialogTitle).toMatch('Create new folder');
      expect(isFolderNameDisplayed).toBe(true, 'Name input is not displayed');
      expect(isDescriptionDisplayed).toBe(true, 'Description field is not displayed');
      expect(isCreateEnabled).toBe(false, 'Create button is not disabled');
      expect(isCancelEnabled).toBe(true, 'Cancel button is not enabled');
    });

    it('with empty folder name - [C216346]', async () => {
      await personalFilesPage.dataTable.doubleClickOnRowByName(parent);
      await personalFilesPage.sidenav.openCreateDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.deleteNameWithBackspace();
      const isCreateEnabled = await createDialog.createButton.isEnabled();
      const validationMessage = await createDialog.getValidationMessage();

      expect(isCreateEnabled).toBe(false, 'Create button is enabled');
      expect(validationMessage).toMatch('Folder name is required');
    });

    it('with folder name ending with a dot "." - [C216348]', async () => {
      await personalFilesPage.dataTable.doubleClickOnRowByName(parent);
      await personalFilesPage.sidenav.openCreateDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.enterName('folder-name.');
      const isCreateEnabled = await createDialog.createButton.isEnabled();
      const validationMessage = await createDialog.getValidationMessage();

      expect(isCreateEnabled).toBe(false, 'Create button is not disabled');
      expect(validationMessage).toMatch(`Folder name can't end with a period .`);
    });

    it('with folder name containing special characters - [C216347]', async () => {
      const namesWithSpecialChars = [ 'a*a', 'a"a', 'a<a', 'a>a', `a\\a`, 'a/a', 'a?a', 'a:a', 'a|a' ];

      await personalFilesPage.dataTable.doubleClickOnRowByName(parent);
      await personalFilesPage.sidenav.openCreateDialog();
      await createDialog.waitForDialogToOpen();

      for (const name of namesWithSpecialChars) {
        await createDialog.enterName(name);
        expect(await createDialog.createButton.isEnabled()).toBe(false, 'Create button is not disabled');
        expect(await createDialog.getValidationMessage()).toContain(`Folder name can't contain these characters`);
      }
    });

    it('with folder name containing only spaces - [C280406]', async () => {
      await personalFilesPage.dataTable.doubleClickOnRowByName(parent);
      await personalFilesPage.sidenav.openCreateDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.enterName('    ');
      const isCreateEnabled = await createDialog.createButton.isEnabled();
      const validationMessage = await createDialog.getValidationMessage();

      expect(isCreateEnabled).toBe(false, 'Create button is not disabled');
      expect(validationMessage).toMatch(`Folder name can't contain only spaces`);
    });

    it('cancel folder creation - [C216349]', async () => {
      await personalFilesPage.dataTable.doubleClickOnRowByName(parent);
      await personalFilesPage.sidenav.openCreateDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.enterName('test');
      await createDialog.enterDescription('test description');
      await createDialog.clickCancel();
      expect(await createDialog.component.isPresent()).not.toBe(true, 'dialog is not closed');
    });

    it('duplicate folder name - [C216350]', async () => {
      await personalFilesPage.dataTable.doubleClickOnRowByName(parent);
      await personalFilesPage.sidenav.openCreateDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.enterName(duplicateFolderName);
      await createDialog.clickCreate();
      const message = await personalFilesPage.getSnackBarMessage();
      expect(message).toEqual(`There's already a folder with this name. Try a different name.`);
      expect(await createDialog.component.isPresent()).toBe(true, 'dialog is not present');
    });

    it('trim ending spaces from folder name - [C216351]', async () => {
      await personalFilesPage.dataTable.doubleClickOnRowByName(parent);
      await personalFilesPage.sidenav.openCreateDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.enterName(nameWithSpaces);
      await createDialog.clickCreate();
      await createDialog.waitForDialogToClose();
      await dataTable.waitForHeader();
      const isPresent = await dataTable.getRowByName(nameWithSpaces.trim()).isPresent();
      expect(isPresent).toBe(true, 'Folder not displayed in list view');
    });
  });

  describe('on File Libraries', () => {
    const fileLibrariesPage = new BrowsingPage();

    beforeEach(async (done) => {
      await fileLibrariesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES);
      await dataTable.waitForHeader();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('option is disabled when not enough permissions - [C280397]', async () => {
      await fileLibrariesPage.dataTable.doubleClickOnRowByName(siteName);
      await fileLibrariesPage.dataTable.doubleClickOnRowByName(folderName1);
      await fileLibrariesPage.sidenav.openNewMenu();
      const isEnabled = await menu.getItemByLabel('Create folder').isEnabled();
      expect(isEnabled).toBe(false, 'Create folder is not disabled');
    });

    it('disabled option tooltip - [C280398]', async () => {
      await fileLibrariesPage.dataTable.doubleClickOnRowByName(siteName);
      await fileLibrariesPage.dataTable.doubleClickOnRowByName(folderName1);
      await fileLibrariesPage.sidenav.openNewMenu();
      await browser.actions().mouseMove(menu.getItemByLabel('Create folder')).perform();
      const tooltip = await menu.getItemTooltip('Create folder');
      expect(tooltip).toContain(`Folders cannot be created whilst viewing the current items`);
    });
  });

  xit('');
});
