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

import { LoginPage, BrowsingPage, ContentNodeSelectorDialog, RepoClient, Utils, AdminActions } from '@alfresco/aca-testing-shared';

describe('Destination picker dialog : ', () => {
  const random = Utils.random();
  const username = `user-${random}`;

  const consumer = `consumer-${random}`;
  const contributor = `contributor-${random}`;
  const collaborator = `collaborator-${random}`;

  const file = `file-${random}.txt`;
  let fileId: string;
  let fileIdConsumer: string;
  let fileIdContributor: string;
  let fileIdCollaborator: string;

  const adminFolder = `admin-folder-${random}`;
  let adminFolderId: string;

  const destination = `destination-folder-${random}`;
  let destinationId: string;
  const fileInDestination = `file-in-dest-${random}.txt`;
  const folderInDestination = `folder-in-dest-${random}`;
  const folder2InDestination = `folder2-in-dest-${random}`;
  let folderLink: string;

  const searchFolder = `search-${random}`;
  let searchFolderId: string;
  let searchFolderSiteId: string;
  const searchSubFolder1 = `sub-folder-${random}`;
  let searchSubFolder1Id: string;
  let searchSubFolder1SiteId: string;
  const searchSubFolder2 = `sub-folder-${random}`;

  const site = `site-${random}`;

  const userApi = new RepoClient(username, username);
  const consumerApi = new RepoClient(consumer, consumer);
  const contributorApi = new RepoClient(contributor, contributor);
  const collaboratorApi = new RepoClient(collaborator, collaborator);
  const adminApiActions = new AdminActions();

  const loginPage = new LoginPage();
  const page = new BrowsingPage();

  const dialog = new ContentNodeSelectorDialog();
  const breadcrumb = dialog.breadcrumb;
  const dataTable = dialog.dataTable;

  beforeAll(async () => {
    await adminApiActions.createUser({ username });
    await adminApiActions.createUser({ username: consumer });
    await adminApiActions.createUser({ username: contributor });
    await adminApiActions.createUser({ username: collaborator });

    fileId = (await userApi.nodes.createFile(file)).entry.id;

    destinationId = (await userApi.nodes.createFolder(destination)).entry.id;
    await userApi.nodes.createFile(fileInDestination, destinationId);
    await userApi.nodes.createFolder(folderInDestination, destinationId);
    const folder2Id = (await userApi.nodes.createFolder(folder2InDestination, destinationId)).entry.id;
    folderLink = (await userApi.nodes.createFolderLink(folder2Id, destinationId)).entry.name;
    searchFolderId = (await userApi.nodes.createFolder(searchFolder, destinationId)).entry.id;
    searchSubFolder1Id = (await userApi.nodes.createFolder(searchSubFolder1, searchFolderId)).entry.id;
    await userApi.nodes.createFolder(searchSubFolder2, searchSubFolder1Id);

    await userApi.sites.createSitePrivate(site);
    const docLibId = await userApi.sites.getDocLibId(site);
    searchFolderSiteId = (await userApi.nodes.createFolder(searchFolder, docLibId)).entry.id;
    searchSubFolder1SiteId = (await userApi.nodes.createFolder(searchSubFolder1, searchFolderSiteId)).entry.id;
    await userApi.nodes.createFolder(searchSubFolder2, searchSubFolder1SiteId);

    await userApi.sites.addSiteConsumer(site, consumer);
    await userApi.sites.addSiteContributor(site, contributor);
    await userApi.sites.addSiteCollaborator(site, collaborator);

    fileIdConsumer = (await consumerApi.nodes.createFile(file)).entry.id;
    fileIdContributor = (await contributorApi.nodes.createFile(file)).entry.id;
    fileIdCollaborator = (await collaboratorApi.nodes.createFile(file)).entry.id;

    await adminApiActions.login();
    adminFolderId = (await adminApiActions.nodes.createFolder(adminFolder)).entry.id;

    await userApi.search.waitForNodes(searchFolder, { expect: 2 });
  });

  afterAll(async () => {
    await userApi.nodes.deleteNodeById(fileId);
    await userApi.nodes.deleteNodeById(destinationId);
    await userApi.sites.deleteSite(site);

    await consumerApi.nodes.deleteNodeById(fileIdConsumer);
    await contributorApi.nodes.deleteNodeById(fileIdContributor);
    await collaboratorApi.nodes.deleteNodeById(fileIdCollaborator);

    await adminApiActions.nodes.deleteNodeById(adminFolderId);
  });

  afterEach(async () => {
    await page.closeOpenDialogs();
  });

  describe('general', () => {
    beforeAll(async () => {
      await loginPage.loginWith(username);
    });

    beforeEach(async () => {
      await page.dataTable.selectItem(file);
      await page.toolbar.clickMoreActionsCopy();
      await dialog.waitForDialogToOpen();
    });

    it('[C263875] Dialog UI', async () => {
      expect(await dialog.getDialogTitle()).toEqual(`Copy '${file}' to...`);
      expect(await dialog.searchInput.isPresent()).toBe(true, 'Search input is not displayed');
      expect(await dialog.isSelectLocationDropdownDisplayed()).toBe(true, 'Select Location dropdown not displayed');
      expect(await breadcrumb.currentFolder.getText()).toEqual('Personal Files');
      expect(await dataTable.isItemPresent(destination)).toBe(true, 'Personal Files content not displayed');
      expect(await dialog.isCopyButtonEnabled()).toBe(true, 'Copy button is not disabled');
      expect(await dialog.isCancelButtonEnabled()).toBe(true, 'Cancel button is not enabled');
    });

    it('[C263880] Files are not displayed', async () => {
      await dialog.selectLocation('Personal Files');
      expect(await dataTable.isItemPresent(destination)).toBe(true, 'destination folder not displayed');

      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.isItemPresent(folderInDestination)).toBe(true, 'folder is not displayed');
      expect(await dataTable.isItemPresent(fileInDestination)).toBe(false, 'file is displayed');
    });

    it('[C263881] Folder links are not displayed', async () => {
      await dialog.selectLocation('Personal Files');
      await dataTable.doubleClickOnRowByName(destination);

      expect(await dataTable.isItemPresent(folderInDestination)).toBe(true, `${folderInDestination} is not displayed`);
      expect(await dataTable.isItemPresent(folder2InDestination)).toBe(true, `${folder2InDestination} is not displayed`);
      expect(await dataTable.isItemPresent(folderLink)).toBe(false, 'Link to folder is displayed');
    });

    it('[C263885] User can see his Libraries', async () => {
      await dialog.selectLocation('My Libraries');
      expect(await dataTable.isItemPresent(site)).toBe(true, 'user site is not displayed');
    });

    it('[C263889] Search - No results displayed', async () => {
      await dialog.searchFor('nonexistent-folder');

      expect(await dataTable.isEmpty()).toBe(true, 'datatable not empty');
      expect(await dataTable.getEmptyListText()).toEqual('No results found');
    });

    it('[C263888] Search - results found', async () => {
      await dialog.searchFor(searchFolder);

      expect(await dataTable.isItemPresent(searchFolder, username)).toBe(true, 'folder from Personal Files not displayed');
      expect(await dataTable.isItemPresent(searchFolder, site)).toBe(true, 'folder from site not displayed');
    });
  });

  describe('multiple selection', () => {
    beforeAll(async () => {
      await loginPage.loginWith(username);
    });

    beforeEach(async () => {
      await page.dataTable.selectMultipleItems([file, destination]);
      await page.toolbar.clickMoreActionsCopy();
      await dialog.waitForDialogToOpen();
    });

    it('[C263879] Dialog title - multiple selection', async () => {
      expect(await dialog.getDialogTitle()).toEqual(`Copy 2 items to...`);
    });
  });

  describe('breadcrumb', () => {
    beforeAll(async () => {
      await loginPage.loginWith(username);
    });

    beforeEach(async () => {
      await page.dataTable.selectItem(file);
      await page.toolbar.clickMoreActionsCopy();
      await dialog.waitForDialogToOpen();
    });

    it('[C263890] Personal Files breadcrumb - main node', async () => {
      await dialog.selectLocation('Personal Files');
      expect(await breadcrumb.currentFolder.getText()).toEqual('Personal Files');
    });

    it('[C263891] File Libraries breadcrumb - main node', async () => {
      await dialog.selectLocation('My Libraries');
      expect(await breadcrumb.currentFolder.getText()).toEqual('My Libraries');
    });

    it('[C263899] Search results breadcrumb', async () => {
      await dialog.searchFor(searchFolder);
      expect(await dialog.getToolbarTitle()).toEqual('Search results');
    });

    it('[C263900] Search results breadcrumb when selecting a folder', async () => {
      await dialog.searchFor(searchFolder);
      await dataTable.selectItem(searchFolder, site);
      expect(await breadcrumb.currentFolder.getText()).toEqual(searchFolder);
    });

    it('[C263897] Personal Files breadcrumb - folder structure', async () => {
      await dialog.selectLocation('Personal Files');
      await dataTable.doubleClickOnRowByName(destination);

      expect(await breadcrumb.currentFolder.getText()).toEqual(destination);
      await dataTable.doubleClickOnRowByName(searchFolder);
      expect(await breadcrumb.currentFolder.getText()).toEqual(searchFolder);
      await dataTable.doubleClickOnRowByName(searchSubFolder1);
      expect(await breadcrumb.currentFolder.getText()).toEqual(searchSubFolder1);
      await dataTable.doubleClickOnRowByName(searchSubFolder2);
      expect(await breadcrumb.currentFolder.getText()).toEqual(searchSubFolder2);
      await breadcrumb.openPath();
      expect(await breadcrumb.getPathItems()).toEqual([searchSubFolder1, searchFolder, destination, 'Personal Files']);
    });

    it('[C263898] File Libraries breadcrumb - folder structure', async () => {
      await dialog.selectLocation('My Libraries');

      await dataTable.doubleClickOnRowByName(site);
      expect(await breadcrumb.currentFolder.getText()).toEqual(site);

      await dataTable.doubleClickOnRowByName('documentLibrary');
      expect(await breadcrumb.currentFolder.getText()).toEqual(site);

      await dataTable.doubleClickOnRowByName(searchFolder);
      expect(await breadcrumb.currentFolder.getText()).toEqual(searchFolder);

      await dataTable.doubleClickOnRowByName(searchSubFolder1);
      expect(await breadcrumb.currentFolder.getText()).toEqual(searchSubFolder1);

      await dataTable.doubleClickOnRowByName(searchSubFolder2);
      expect(await breadcrumb.currentFolder.getText()).toEqual(searchSubFolder2);

      await breadcrumb.openPath();
      expect(await breadcrumb.getPathItems()).toEqual([searchSubFolder1, searchFolder, site, 'My Libraries']);
    });

    it('[C263895] Select a node from the breadcrumb path', async () => {
      await dialog.selectLocation('Personal Files');
      await dataTable.doubleClickOnRowByName(destination);
      await dataTable.doubleClickOnRowByName(searchFolder);
      await dataTable.doubleClickOnRowByName(searchSubFolder1);
      await dataTable.doubleClickOnRowByName(searchSubFolder2);
      await breadcrumb.openPath();

      await breadcrumb.clickPathItem(destination);
      expect(await breadcrumb.currentFolder.getText()).toEqual(destination);
      expect(await dataTable.isItemPresent(searchFolder)).toBe(true, 'folder not displayed');
    });
  });

  describe('Users with different permissions', () => {
    it('[C263876] Consumer user cannot select the folder as destination', async () => {
      await loginPage.loginWith(consumer);
      await page.dataTable.selectItem(file);
      await page.toolbar.clickMoreActionsCopy();
      await dialog.waitForDialogToOpen();

      await dialog.selectLocation('My Libraries');
      await dataTable.doubleClickOnRowByName(site);
      await dataTable.doubleClickOnRowByName('documentLibrary');
      await dataTable.selectItem(searchFolder);

      expect(await dialog.isCopyButtonEnabled()).toBe(false, 'Copy should be disabled');
    });

    it('[C263877] Contributor user can select the folder as destination', async () => {
      await loginPage.loginWith(contributor);
      await page.dataTable.selectItem(file);
      await page.toolbar.clickMoreActionsCopy();
      await dialog.waitForDialogToOpen();

      await dialog.selectLocation('My Libraries');
      await dataTable.doubleClickOnRowByName(site);
      await dataTable.doubleClickOnRowByName('documentLibrary');
      await dataTable.selectItem(searchFolder);

      expect(await dialog.isCopyButtonEnabled()).toBe(true, 'Copy should be disabled');
    });

    it('[C263878] Collaborator user can select the folder as destination', async () => {
      await loginPage.loginWith(collaborator);
      await page.dataTable.selectItem(file);
      await page.toolbar.clickMoreActionsCopy();
      await dialog.waitForDialogToOpen();

      await dialog.selectLocation('My Libraries');
      await dataTable.doubleClickOnRowByName(site);
      await dataTable.doubleClickOnRowByName('documentLibrary');
      await dataTable.selectItem(searchFolder);

      expect(await dialog.isCopyButtonEnabled()).toBe(true, 'Copy should be disabled');
    });

    it('[C263892] Admin user - Personal Files breadcrumb main node', async () => {
      await loginPage.loginWithAdmin();
      await page.dataTable.selectItem(adminFolder);
      await page.toolbar.clickMoreActionsCopy();
      await dialog.waitForDialogToOpen();

      await dialog.selectLocation('Personal Files');
      expect(await breadcrumb.currentFolder.getText()).toEqual('Company Home');
    });
  });
});
