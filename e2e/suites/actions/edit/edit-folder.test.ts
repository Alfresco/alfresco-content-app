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
  BrowsingPage,
  SITE_VISIBILITY,
  SITE_ROLES,
  RepoClient,
  CreateOrEditFolderDialog,
  Utils,
  clearTextWithBackspace
} from '@alfresco/aca-testing-shared';
import { ApiService, BrowserActions, LoginPage, UsersActions } from '@alfresco/adf-testing';

describe('Edit folder', () => {
  const parent = `parent-${Utils.random()}`;
  let parentId: string;
  const folderName = `folder-${Utils.random()}`;
  const folderDescription = 'my folder description';

  const folderNameToEdit = `folder-${Utils.random()}`;
  const duplicateFolderName = `folder-${Utils.random()}`;

  const folderNameEdited = `folder-renamed-${Utils.random()}`;
  const folderNameEdited2 = `folder-search-renamed-${Utils.random()}`;
  const folderDescriptionEdited = 'description edited';

  const sitePrivate = `site-private-${Utils.random()}`;
  const siteName = `site-${Utils.random()}`;

  const folderSite = `folder-site-${Utils.random()}`;
  const folderSiteToEdit = `folder-site-${Utils.random()}`;
  let folderSiteToEditId: string;
  const duplicateFolderSite = `folder-${Utils.random()}`;
  let docLibUserSite: string;

  const folderFavorite = `folder-fav-${Utils.random()}`;
  let folderFavoriteId: string;
  const folderFavoriteToEdit = `folder-fav-${Utils.random()}`;
  let folderFavoriteToEditId: string;
  const folderFavoriteDuplicate = `folder-fav-${Utils.random()}`;
  let folderFavoriteDuplicateId: string;

  const searchRandom = Utils.random();
  const folderSearch = `folder-search-${searchRandom}`;
  const folderSearchToEdit = `folder-search-to-edit-${searchRandom}`;
  let folderSearchToEditId: string;
  const folderSearchDuplicate = `folder-search-duplicate-${searchRandom}`;

  const apiService = new ApiService();
  const adminApiService = new ApiService();
  const repoClient = new RepoClient(apiService);
  const adminApiActions = new ApiActions(adminApiService);
  const usersActions = new UsersActions(adminApiService);

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const editDialog = new CreateOrEditFolderDialog();
  const { dataTable, toolbar } = page;
  const { searchInput } = page.header;

  beforeAll(async (done) => {
    await adminApiService.loginWithProfile('admin');
    const user = await usersActions.createUser();
    await apiService.login(user.username, user.password);

    await adminApiActions.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE);
    const docLibId = await adminApiActions.sites.getDocLibId(sitePrivate);
    await adminApiActions.nodes.createFolder(folderName, docLibId);
    await adminApiActions.sites.addSiteMember(sitePrivate, user.username, SITE_ROLES.SITE_CONSUMER.ROLE);

    parentId = (await repoClient.nodes.createFolder(parent)).entry.id;
    await repoClient.nodes.createFolder(folderName, parentId, '', folderDescription);
    await repoClient.nodes.createFolder(folderNameToEdit, parentId);
    await repoClient.nodes.createFolder(duplicateFolderName, parentId);

    await repoClient.sites.createSite(siteName);
    docLibUserSite = await repoClient.sites.getDocLibId(siteName);
    await repoClient.nodes.createFolder(folderSite, docLibUserSite);
    folderSiteToEditId = (await repoClient.nodes.createFolder(folderSiteToEdit, docLibUserSite)).entry.id;
    await repoClient.nodes.createFolder(duplicateFolderSite, docLibUserSite);

    folderFavoriteId = (await repoClient.nodes.createFolder(folderFavorite)).entry.id;
    folderFavoriteToEditId = (await repoClient.nodes.createFolder(folderFavoriteToEdit)).entry.id;
    folderFavoriteDuplicateId = (await repoClient.nodes.createFolder(folderFavoriteDuplicate)).entry.id;

    await repoClient.nodes.createFolder(folderSearch);
    folderSearchToEditId = (await repoClient.nodes.createFolder(folderSearchToEdit)).entry.id;
    await repoClient.nodes.createFolder(folderSearchDuplicate);

    await repoClient.favorites.addFavoriteById('folder', folderFavoriteId);
    await repoClient.favorites.addFavoriteById('folder', folderFavoriteToEditId);
    await repoClient.favorites.addFavoriteById('folder', folderFavoriteDuplicateId);

    await repoClient.search.waitForNodes(searchRandom, { expect: 3 });

    await loginPage.loginWith(user.username, user.password);
    done();
  });

  afterAll(async () => {
    await adminApiService.loginWithProfile('admin');
    await adminApiActions.sites.deleteSite(sitePrivate);
    await repoClient.sites.deleteSite(siteName);
    await repoClient.nodes.deleteNodesById([parentId, folderFavoriteToEditId, folderFavoriteDuplicateId, folderSearchToEditId]);
  });

  beforeEach(async () => {
    await Utils.pressEscape();
  });

  afterEach(async () => {
    await page.closeOpenDialogs();
  });

  it('[C216331] dialog UI defaults', async () => {
    await dataTable.doubleClickOnRowByName(parent);
    await dataTable.selectItem(folderName);
    await toolbar.openMoreMenu();
    await BrowserActions.click(toolbar.menu.editFolderAction);

    expect(await editDialog.getDialogTitle()).toEqual('Edit folder');
    expect(await editDialog.getName()).toBe(folderName);
    expect(await editDialog.getDescription()).toBe(folderDescription);
    expect(await editDialog.isUpdateButtonEnabled()).toBe(true, 'upload button is not enabled');
    expect(await editDialog.isCancelButtonEnabled()).toBe(true, 'cancel button is not enabled');
  });

  describe('on Personal Files', () => {
    beforeEach(async (done) => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);
      await dataTable.waitForHeader();
      done();
    });

    it('[C216335] properties are modified when pressing OK', async (done) => {
      await dataTable.selectItem(folderNameToEdit);
      await toolbar.openMoreMenu();
      await BrowserActions.click(toolbar.menu.editFolderAction);
      await editDialog.waitForDialogToOpen();
      await editDialog.enterDescription(folderDescriptionEdited);
      await editDialog.enterName(folderNameEdited);
      await BrowserActions.click(editDialog.updateButton);
      await editDialog.waitForDialogToClose();
      await dataTable.waitForHeader();

      expect(await dataTable.isItemPresent(folderNameEdited)).toBe(true, 'Folder not displayed');
      const desc = await repoClient.nodes.getNodeDescription(folderNameEdited, parentId);
      expect(desc).toEqual(folderDescriptionEdited);
      done();
    });

    it('[C216332] with empty folder name', async () => {
      await dataTable.selectItem(folderName);
      await toolbar.openMoreMenu();
      await BrowserActions.click(toolbar.menu.editFolderAction);
      await clearTextWithBackspace(editDialog.nameInput);

      expect(await editDialog.isUpdateButtonEnabled()).toBe(false, 'upload button is not enabled');
      expect(await editDialog.getValidationMessage()).toMatch('Folder name is required');
    });

    it('[C216333] with name with special characters', async () => {
      const namesWithSpecialChars = ['a*a', 'a"a', 'a<a', 'a>a', `a\\a`, 'a/a', 'a?a', 'a:a', 'a|a'];

      await dataTable.selectItem(folderName);
      await toolbar.openMoreMenu();
      await BrowserActions.click(toolbar.menu.editFolderAction);

      for (const name of namesWithSpecialChars) {
        await editDialog.enterName(name);
        expect(await editDialog.isUpdateButtonEnabled()).toBe(false, 'upload button is not disabled');
        expect(await editDialog.getValidationMessage()).toContain(`Folder name can't contain these characters`);
      }
    });

    it('[C216334] with name ending with a dot', async () => {
      await dataTable.selectItem(folderName);
      await toolbar.openMoreMenu();
      await BrowserActions.click(toolbar.menu.editFolderAction);
      await editDialog.waitForDialogToOpen();
      await editDialog.nameInput.sendKeys('.');

      expect(await editDialog.isUpdateButtonEnabled()).toBe(false, 'upload button is not enabled');
      expect(await editDialog.getValidationMessage()).toMatch(`Folder name can't end with a period .`);
    });

    it('[C216336] Cancel button', async () => {
      await dataTable.selectItem(folderName);
      await toolbar.openMoreMenu();
      await BrowserActions.click(toolbar.menu.editFolderAction);
      await editDialog.waitForDialogToOpen();
      await editDialog.clickCancel();

      expect(await editDialog.isDialogOpen()).not.toBe(true, 'dialog is not closed');
    });

    it('[C216337] with duplicate folder name', async () => {
      await dataTable.selectItem(folderName);
      await toolbar.openMoreMenu();
      await BrowserActions.click(toolbar.menu.editFolderAction);
      await editDialog.waitForDialogToOpen();
      await editDialog.enterName(duplicateFolderName);
      await BrowserActions.click(editDialog.updateButton);

      expect(await page.getSnackBarMessage()).toEqual(`There's already a folder with this name. Try a different name.`);
      expect(await editDialog.isDialogOpen()).toBe(true, 'dialog is not present');
    });

    it('[C216338] trim ending spaces', async () => {
      await dataTable.selectItem(folderName);
      await toolbar.openMoreMenu();
      await BrowserActions.click(toolbar.menu.editFolderAction);
      await editDialog.nameInput.sendKeys('   ');
      await BrowserActions.click(editDialog.updateButton);
      await editDialog.waitForDialogToClose();

      expect(await page.snackBar.isPresent()).not.toBe(true, 'notification appears');
      expect(await dataTable.isItemPresent(folderName)).toBe(true, 'Folder not displayed in list view');
    });
  });

  describe('on Favorites', () => {
    beforeEach(async (done) => {
      await page.clickFavoritesAndWait();
      done();
    });

    it('[C280384] properties are modified when pressing OK', async (done) => {
      await dataTable.selectItem(folderFavoriteToEdit);
      await toolbar.openMoreMenu();
      await BrowserActions.click(toolbar.menu.editFolderAction);
      await editDialog.waitForDialogToOpen();
      await editDialog.enterDescription(folderDescriptionEdited);
      await editDialog.enterName(folderNameEdited);
      await BrowserActions.click(editDialog.updateButton);
      await editDialog.waitForDialogToClose();
      await dataTable.waitForHeader();

      expect(await dataTable.isItemPresent(folderNameEdited)).toBe(true, 'Folder not displayed');
      const desc = await repoClient.nodes.getNodeProperty(folderFavoriteToEditId, 'cm:description');
      expect(desc).toEqual(folderDescriptionEdited);
      done();
    });

    it('[C280386] with duplicate folder name', async () => {
      await dataTable.selectItem(folderFavorite);
      await toolbar.openMoreMenu();
      await BrowserActions.click(toolbar.menu.editFolderAction);
      await editDialog.waitForDialogToOpen();
      await editDialog.enterName(folderFavoriteDuplicate);
      await BrowserActions.click(editDialog.updateButton);

      expect(await page.getSnackBarMessage()).toEqual(`There's already a folder with this name. Try a different name.`);
      expect(await editDialog.isDialogOpen()).toBe(true, 'dialog is not present');
    });
  });

  describe('on My Libraries', () => {
    beforeEach(async (done) => {
      await page.goToMyLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(siteName);
      done();
    });

    it('[C280509] properties are modified when pressing OK', async (done) => {
      await dataTable.selectItem(folderSiteToEdit);
      await toolbar.openMoreMenu();
      await BrowserActions.click(toolbar.menu.editFolderAction);
      await editDialog.waitForDialogToOpen();
      await editDialog.enterDescription(folderDescriptionEdited);
      await editDialog.enterName(folderNameEdited);
      await BrowserActions.click(editDialog.updateButton);
      await editDialog.waitForDialogToClose();
      await dataTable.waitForHeader();

      expect(await dataTable.isItemPresent(folderNameEdited)).toBe(true, 'Folder not displayed');
      const desc = await repoClient.nodes.getNodeProperty(folderSiteToEditId, 'cm:description');
      expect(desc).toEqual(folderDescriptionEdited);
      done();
    });

    it('[C280511] with duplicate folder name', async () => {
      await dataTable.selectItem(folderSite);
      await toolbar.openMoreMenu();
      await BrowserActions.click(toolbar.menu.editFolderAction);
      await editDialog.waitForDialogToOpen();
      await editDialog.enterName(duplicateFolderSite);
      await BrowserActions.click(editDialog.updateButton);

      expect(await page.getSnackBarMessage()).toEqual(`There's already a folder with this name. Try a different name.`);
      expect(await editDialog.isDialogOpen()).toBe(true, 'dialog is not present');
    });
  });

  describe('on Search Results', () => {
    it('[C306947] properties are modified when pressing OK', async () => {
      await page.clickPersonalFiles();
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFolders();
      await searchInput.searchFor(folderSearchToEdit);
      await dataTable.waitForBody();

      await dataTable.selectItem(folderSearchToEdit);
      await toolbar.openMoreMenu();
      await BrowserActions.click(toolbar.menu.editFolderAction);
      await editDialog.waitForDialogToOpen();
      await editDialog.enterDescription(folderDescriptionEdited);
      await editDialog.enterName(folderNameEdited2);
      await BrowserActions.click(editDialog.updateButton);
      await editDialog.waitForDialogToClose();

      await page.refresh();
      expect(await dataTable.isItemPresent(folderNameEdited2)).toBe(true, 'Folder not displayed');
      const desc = await repoClient.nodes.getNodeProperty(folderSearchToEditId, 'cm:description');
      expect(desc).toEqual(folderDescriptionEdited);
    });

    it('[C306948] with duplicate folder name', async () => {
      await page.clickPersonalFiles();
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFolders();
      await searchInput.searchFor(folderSearch);
      await dataTable.waitForBody();

      await dataTable.selectItem(folderSearch);
      await toolbar.openMoreMenu();
      await BrowserActions.click(toolbar.menu.editFolderAction);
      await editDialog.waitForDialogToOpen();
      await editDialog.enterName(folderSearchDuplicate);
      await BrowserActions.click(editDialog.updateButton);

      expect(await page.getSnackBarMessage()).toEqual(`There's already a folder with this name. Try a different name.`);
      expect(await editDialog.isDialogOpen()).toBe(true, 'dialog is not present');
    });
  });
});
