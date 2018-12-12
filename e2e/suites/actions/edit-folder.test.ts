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

import { LoginPage, BrowsingPage } from '../../pages/pages';
import { SITE_VISIBILITY, SITE_ROLES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { CreateOrEditFolderDialog } from '../../components/dialog/create-edit-folder-dialog';
import { Utils } from '../../utilities/utils';

describe('Edit folder', () => {
  const username = `user-${Utils.random()}`;

  const parent = `parent-${Utils.random()}`; let parentId;
  const folderName = `folder-${Utils.random()}`;
  const folderDescription = 'my folder description';

  const folderNameToEdit = `folder-${Utils.random()}`;
  const duplicateFolderName = `folder-${Utils.random()}`;

  const folderNameEdited = `folder-${Utils.random()}`;
  const folderDescriptionEdited = 'description edited';

  const sitePrivate = `site-private-${Utils.random()}`;
  const siteName = `site-${Utils.random()}`;

  const folderSite = `folder-site-${Utils.random()}`;
  const folderSiteToEdit = `folder-site-${Utils.random()}`; let folderSiteToEditId;
  const duplicateFolderSite = `folder-${Utils.random()}`;
  let docLibUserSite;

  const folderFavorite = `folder-fav-${Utils.random()}`; let folderFavoriteId;
  const folderFavoriteToEdit = `folder-fav-${Utils.random()}`; let folderFavoriteToEditId;
  const folderFavoriteDuplicate = `folder-fav-${Utils.random()}`; let folderFavoriteDuplicateId;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const editDialog = new CreateOrEditFolderDialog();
  const { dataTable } = page;
  const editButton = page.toolbar.getButtonByTitleAttribute('Edit');

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    await apis.admin.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE);
    const docLibId = await apis.admin.sites.getDocLibId(sitePrivate);
    await apis.admin.nodes.createFolder(folderName, docLibId);
    await apis.admin.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_CONSUMER.ROLE);

    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
    await apis.user.nodes.createFolder(folderName, parentId, '', folderDescription);
    await apis.user.nodes.createFolder(folderNameToEdit, parentId);
    await apis.user.nodes.createFolder(duplicateFolderName, parentId);

    await apis.user.sites.createSite(siteName);
    docLibUserSite = await apis.user.sites.getDocLibId(siteName);
    await apis.user.nodes.createFolder(folderSite, docLibUserSite);
    folderSiteToEditId = (await apis.user.nodes.createFolder(folderSiteToEdit, docLibUserSite)).entry.id;
    await apis.user.nodes.createFolder(duplicateFolderSite, docLibUserSite);

    folderFavoriteId = (await apis.user.nodes.createFolder(folderFavorite)).entry.id;
    folderFavoriteToEditId = (await apis.user.nodes.createFolder(folderFavoriteToEdit)).entry.id;
    folderFavoriteDuplicateId = (await apis.user.nodes.createFolder(folderFavoriteDuplicate)).entry.id;

    await apis.user.favorites.addFavoriteById('folder', folderFavoriteId);
    await apis.user.favorites.addFavoriteById('folder', folderFavoriteToEditId);
    await apis.user.favorites.addFavoriteById('folder', folderFavoriteDuplicateId);

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await Promise.all([
      apis.admin.sites.deleteSite(sitePrivate),
      apis.user.sites.deleteSite(siteName),
      apis.user.nodes.deleteNodesById([ parentId, folderFavoriteToEditId, folderFavoriteDuplicateId ])
    ]);
    done();
  });

  afterEach(async (done) => {
    await Utils.pressEscape();
    done();
  });

  it('dialog UI defaults - [C216331]', async () => {
    await dataTable.doubleClickOnRowByName(parent);
    await dataTable.selectItem(folderName);
    await editButton.click();
    expect(await editDialog.getTitle()).toEqual('Edit folder');
    expect(await editDialog.nameInput.getAttribute('value')).toBe(folderName);
    expect(await editDialog.descriptionTextArea.getAttribute('value')).toBe(folderDescription);
    expect(await editDialog.updateButton.isEnabled()).toBe(true, 'upload button is not enabled');
    expect(await editDialog.cancelButton.isEnabled()).toBe(true, 'cancel button is not enabled');
  });

  describe('on Personal Files', () => {
    beforeEach(async (done) => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);
      await dataTable.waitForHeader();
      done();
    });

    it('properties are modified when pressing OK - [C216335]', async (done) => {
      await dataTable.selectItem(folderNameToEdit);
      await editButton.click();
      await editDialog.waitForDialogToOpen();
      await editDialog.enterDescription(folderDescriptionEdited);
      await editDialog.enterName(folderNameEdited);
      await editDialog.clickUpdate();
      await editDialog.waitForDialogToClose();
      await dataTable.waitForHeader();
      expect(await dataTable.getRowByName(folderNameEdited).isPresent()).toBe(true, 'Folder not displayed');
      const desc = await apis.user.nodes.getNodeDescription(folderNameEdited, parentId);
      expect(desc).toEqual(folderDescriptionEdited);
      done();
    });

    it('with empty folder name - [C216332]', async () => {
      await dataTable.selectItem(folderName);
      await editButton.click();
      await editDialog.deleteNameWithBackspace();
      expect(await editDialog.updateButton.isEnabled()).toBe(false, 'upload button is not enabled');
      expect(await editDialog.getValidationMessage()).toMatch('Folder name is required');
    });

    it('with name with special characters - [C216333]', async () => {
      const namesWithSpecialChars = [ 'a*a', 'a"a', 'a<a', 'a>a', `a\\a`, 'a/a', 'a?a', 'a:a', 'a|a' ];

      await dataTable.selectItem(folderName);
      await editButton.click();

      for (const name of namesWithSpecialChars) {
        await editDialog.enterName(name);
        expect(await editDialog.updateButton.isEnabled()).toBe(false, 'upload button is not disabled');
        expect(await editDialog.getValidationMessage()).toContain(`Folder name can't contain these characters`);
      }
    });

    it('with name ending with a dot - [C216334]', async () => {
      await dataTable.selectItem(folderName);
      await editButton.click();
      await editDialog.waitForDialogToOpen();
      await editDialog.nameInput.sendKeys('.');
      expect(await editDialog.updateButton.isEnabled()).toBe(false, 'upload button is not enabled');
      expect(await editDialog.getValidationMessage()).toMatch(`Folder name can't end with a period .`);
    });

    it('Cancel button - [C216336]', async () => {
      await dataTable.selectItem(folderName);
      await editButton.click();
      await editDialog.waitForDialogToOpen();
      await editDialog.clickCancel();
      expect(await editDialog.isDialogOpen()).not.toBe(true, 'dialog is not closed');
    });

    it('with duplicate folder name - [C216337]', async () => {
      await dataTable.selectItem(folderName);
      await editButton.click();
      await editDialog.waitForDialogToOpen();
      await editDialog.enterName(duplicateFolderName);
      await editDialog.clickUpdate();
      const message = await page.getSnackBarMessage();
      expect(message).toEqual(`There's already a folder with this name. Try a different name.`);
      expect(await editDialog.isDialogOpen()).toBe(true, 'dialog is not present');
    });

    it('trim ending spaces - [C216338]', async () => {
      await dataTable.selectItem(folderName);
      await editButton.click();
      await editDialog.nameInput.sendKeys('   ');
      await editDialog.clickUpdate();
      await editDialog.waitForDialogToClose();
      expect(await page.snackBar.isPresent()).not.toBe(true, 'notification appears');
      expect(await dataTable.getRowByName(folderName).isPresent()).toBe(true, 'Folder not displayed in list view');
    });
  });

  describe('on Favorites', () => {
    beforeEach(async (done) => {
      await page.clickFavoritesAndWait();
      done();
    });

    it('properties are modified when pressing OK - [C280384]', async (done) => {
      await dataTable.selectItem(folderFavoriteToEdit);
      await editButton.click();
      await editDialog.waitForDialogToOpen();
      await editDialog.enterDescription(folderDescriptionEdited);
      await editDialog.enterName(folderNameEdited);
      await editDialog.clickUpdate();
      await editDialog.waitForDialogToClose();
      await dataTable.waitForHeader();
      expect(await dataTable.getRowByName(folderNameEdited).isPresent()).toBe(true, 'Folder not displayed');
      const desc = await apis.user.nodes.getNodeProperty(folderFavoriteToEditId, 'cm:description');
      expect(desc).toEqual(folderDescriptionEdited);
      done();
    });

    it('with duplicate folder name - [C280386]', async () => {
      await dataTable.selectItem(folderFavorite);
      await editButton.click();
      await editDialog.waitForDialogToOpen();
      await editDialog.enterName(folderFavoriteDuplicate);
      await editDialog.clickUpdate();
      const message = await page.getSnackBarMessage();
      expect(message).toEqual(`There's already a folder with this name. Try a different name.`);
      expect(await editDialog.isDialogOpen()).toBe(true, 'dialog is not present');
    });
  });

  describe('on My Libraries', () => {
    beforeEach(async (done) => {
      await page.clickFileLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(siteName);
      done();
    });

    it('properties are modified when pressing OK - [C280509]', async (done) => {
      await dataTable.selectItem(folderSiteToEdit);
      await editButton.click();
      await editDialog.waitForDialogToOpen();
      await editDialog.enterDescription(folderDescriptionEdited);
      await editDialog.enterName(folderNameEdited);
      await editDialog.clickUpdate();
      await editDialog.waitForDialogToClose();
      await dataTable.waitForHeader();
      expect(await dataTable.getRowByName(folderNameEdited).isPresent()).toBe(true, 'Folder not displayed');
      const desc = await apis.user.nodes.getNodeProperty(folderSiteToEditId, 'cm:description');
      expect(desc).toEqual(folderDescriptionEdited);
      done();
    });

    it('with duplicate folder name - [C280511]', async () => {
      await dataTable.selectItem(folderSite);
      await editButton.click();
      await editDialog.waitForDialogToOpen();
      await editDialog.enterName(duplicateFolderSite);
      await editDialog.clickUpdate();
      const message = await page.getSnackBarMessage();
      expect(message).toEqual(`There's already a folder with this name. Try a different name.`);
      expect(await editDialog.isDialogOpen()).toBe(true, 'dialog is not present');
    });
  });
});
