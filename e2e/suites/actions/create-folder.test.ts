/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { SITE_VISIBILITY, SITE_ROLES } from '../../configs';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { CreateOrEditFolderDialog } from '../../components/dialog/create-edit-folder-dialog';
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

  const sitePrivate = `site-private-${Utils.random()}`;
  const siteName = `site-${Utils.random()}`;

  const folderSite = `folder-site-${Utils.random()}`;
  const duplicateFolderSite = `folder-${Utils.random()}`;
  let docLibUserSite;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const createDialog = new CreateOrEditFolderDialog();
  const { dataTable } = page;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });

    await apis.admin.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE);
    const docLibId = await apis.admin.sites.getDocLibId(sitePrivate);
    await apis.admin.nodes.createFolder(folderName1, docLibId);
    await apis.admin.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_CONSUMER.ROLE);

    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
    await apis.user.nodes.createFolder(duplicateFolderName, parentId);

    await apis.user.sites.createSite(siteName);
    docLibUserSite = await apis.user.sites.getDocLibId(siteName);
    await apis.user.nodes.createFolder(duplicateFolderSite, docLibUserSite);

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.admin.sites.deleteSite(sitePrivate);
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

    it('creates new folder with name - [C216341]', async () => {
      await page.dataTable.doubleClickOnRowByName(parent);
      await page.sidenav.openCreateFolderDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.enterName(folderName1);
      await createDialog.clickCreate();
      await createDialog.waitForDialogToClose();
      await dataTable.waitForHeader();

      expect(await dataTable.isItemPresent(folderName1)).toBe(true, 'Folder not displayed in list view');
    });

    it('creates new folder with name and description - [C216340]', async (done) => {
      await page.dataTable.doubleClickOnRowByName(parent);
      await page.sidenav.openCreateFolderDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.enterName(folderName2);
      await createDialog.enterDescription(folderDescription);
      await createDialog.clickCreate();
      await createDialog.waitForDialogToClose();
      await dataTable.waitForHeader();

      expect(await dataTable.isItemPresent(folderName2)).toBe(true, 'Folder not displayed');
      const desc = await apis.user.nodes.getNodeDescription(folderName2, parentId);
      expect(desc).toEqual(folderDescription);
      done();
    });

    it('dialog UI elements - [C216345]', async () => {
      await page.dataTable.doubleClickOnRowByName(parent);
      await page.sidenav.openCreateFolderDialog();
      await createDialog.waitForDialogToOpen();

      expect(await createDialog.getTitle()).toMatch('Create new folder');
      expect(await createDialog.isNameDisplayed()).toBe(true, 'Name input is not displayed');
      expect(await createDialog.isDescriptionDisplayed()).toBe(true, 'Description field is not displayed');
      expect(await createDialog.isCreateButtonEnabled()).toBe(false, 'Create button is not disabled');
      expect(await createDialog.isCancelButtonEnabled()).toBe(true, 'Cancel button is not enabled');
    });

    it('with empty folder name - [C216346]', async () => {
      await page.dataTable.doubleClickOnRowByName(parent);
      await page.sidenav.openCreateFolderDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.deleteNameWithBackspace();

      expect(await createDialog.isCreateButtonEnabled()).toBe(false, 'Create button is enabled');
      expect(await createDialog.getValidationMessage()).toMatch('Folder name is required');
    });

    it('with folder name ending with a dot "." - [C216348]', async () => {
      await page.dataTable.doubleClickOnRowByName(parent);
      await page.sidenav.openCreateFolderDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.enterName('folder-name.');

      expect(await createDialog.isCreateButtonEnabled()).toBe(false, 'Create button is not disabled');
      expect(await createDialog.getValidationMessage()).toMatch(`Folder name can't end with a period .`);
    });

    it('with folder name containing special characters - [C216347]', async () => {
      const namesWithSpecialChars = [ 'a*a', 'a"a', 'a<a', 'a>a', `a\\a`, 'a/a', 'a?a', 'a:a', 'a|a' ];

      await page.dataTable.doubleClickOnRowByName(parent);
      await page.sidenav.openCreateFolderDialog();
      await createDialog.waitForDialogToOpen();

      for (const name of namesWithSpecialChars) {
        await createDialog.enterName(name);
        expect(await createDialog.isCreateButtonEnabled()).toBe(false, 'Create button is not disabled');
        expect(await createDialog.getValidationMessage()).toContain(`Folder name can't contain these characters`);
      }
    });

    it('with folder name containing only spaces - [C280406]', async () => {
      await page.dataTable.doubleClickOnRowByName(parent);
      await page.sidenav.openCreateFolderDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.enterName('    ');

      expect(await createDialog.isCreateButtonEnabled()).toBe(false, 'Create button is not disabled');
      expect(await createDialog.getValidationMessage()).toMatch(`Folder name can't contain only spaces`);
    });

    it('cancel folder creation - [C216349]', async () => {
      await page.dataTable.doubleClickOnRowByName(parent);
      await page.sidenav.openCreateFolderDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.enterName('test');
      await createDialog.enterDescription('test description');
      await createDialog.clickCancel();

      expect(await createDialog.isDialogOpen()).not.toBe(true, 'dialog is not closed');
    });

    it('duplicate folder name - [C216350]', async () => {
      await page.dataTable.doubleClickOnRowByName(parent);
      await page.sidenav.openCreateFolderDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.enterName(duplicateFolderName);
      await createDialog.clickCreate();

      expect(await page.getSnackBarMessage()).toEqual(`There's already a folder with this name. Try a different name.`);
      expect(await createDialog.isDialogOpen()).toBe(true, 'dialog is not present');
    });

    it('trim ending spaces from folder name - [C216351]', async () => {
      await page.dataTable.doubleClickOnRowByName(parent);
      await page.sidenav.openCreateFolderDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.enterName(nameWithSpaces);
      await createDialog.clickCreate();
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

    it('creates new folder with name and description - [C280394]', async () => {
      await page.dataTable.doubleClickOnRowByName(siteName);
      await page.sidenav.openCreateFolderDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.enterName(folderSite);
      await createDialog.enterDescription(folderDescription);
      await createDialog.clickCreate();
      await createDialog.waitForDialogToClose();
      await dataTable.waitForHeader();

      expect(await dataTable.isItemPresent(folderSite)).toBe(true, 'Folder not displayed');
      const desc = await apis.user.nodes.getNodeDescription(folderSite, docLibUserSite);
      expect(desc).toEqual(folderDescription);
    });

    it('cancel folder creation - [C280403]', async () => {
      await page.dataTable.doubleClickOnRowByName(siteName);
      await page.sidenav.openCreateFolderDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.enterName('test');
      await createDialog.enterDescription('test description');
      await createDialog.clickCancel();

      expect(await createDialog.isDialogOpen()).not.toBe(true, 'dialog is not closed');
    });

    it('duplicate folder name - [C280404]', async () => {
      await page.dataTable.doubleClickOnRowByName(siteName);
      await page.sidenav.openCreateFolderDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.enterName(duplicateFolderSite);
      await createDialog.clickCreate();

      expect(await page.getSnackBarMessage()).toEqual(`There's already a folder with this name. Try a different name.`);
      expect(await createDialog.isDialogOpen()).toBe(true, 'dialog is not present');
    });
  });

});
