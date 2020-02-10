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

import { LoginPage, BrowsingPage } from '../../../pages/pages';
import { ContentNodeSelectorDialog } from '../../../components/dialog/content-node-selector-dialog';
import { RepoClient } from '../../../utilities/repo-client/repo-client';
import { Utils } from '../../../utilities/utils';
import { AdminActions } from '../../../utilities/admin-actions';

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
  const { dataTable, toolbar } = page;
  const contentNodeSelector = new ContentNodeSelectorDialog();

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
      await dataTable.selectItem(file);
      await toolbar.clickMoreActionsCopy();
      await contentNodeSelector.waitForDialogToOpen();
    });

    it('Dialog UI - [C263875]', async () => {
      expect(await contentNodeSelector.getTitle()).toEqual(`Copy '${file}' to...`);
      expect(await contentNodeSelector.isSearchInputPresent()).toBe(true, 'Search input is not displayed');
      expect(await contentNodeSelector.isSelectLocationDropdownDisplayed()).toBe(true, 'Select Location dropdown not displayed');
      expect(await contentNodeSelector.breadcrumb.getCurrentFolderName()).toEqual('Personal Files');
      expect(await contentNodeSelector.dataTable.isItemPresent(destination)).toBe(true, 'Personal Files content not displayed');
      expect(await contentNodeSelector.isCopyButtonEnabled()).toBe(true, 'Copy button is not disabled');
      expect(await contentNodeSelector.isCancelButtonEnabled()).toBe(true, 'Cancel button is not enabled');
    });

    it('Files are not displayed - [C263880]', async () => {
      await contentNodeSelector.selectLocation('Personal Files');
      expect(await contentNodeSelector.dataTable.isItemPresent(destination)).toBe(true, 'destination folder not displayed');
      await contentNodeSelector.dataTable.doubleClickOnRowByName(destination);
      expect(await contentNodeSelector.dataTable.isItemPresent(folderInDestination)).toBe(true, 'folder is not displayed');
      expect(await contentNodeSelector.dataTable.isItemPresent(fileInDestination)).toBe(false, 'file is displayed');
    });

    it('Folder links are not displayed - [C263881]', async() => {
      await contentNodeSelector.selectLocation('Personal Files');
      await contentNodeSelector.dataTable.doubleClickOnRowByName(destination);

      expect(await contentNodeSelector.dataTable.isItemPresent(folderInDestination)).toBe(true, `${folderInDestination} is not displayed`);
      expect(await contentNodeSelector.dataTable.isItemPresent(folder2InDestination)).toBe(true, `${folder2InDestination} is not displayed`);
      expect(await contentNodeSelector.dataTable.isItemPresent(folderLink)).toBe(false, 'Link to folder is displayed');
    });

    it('User can see his Libraries - [C263885]', async () => {
      await contentNodeSelector.selectLocation('File Libraries');
      expect(await contentNodeSelector.dataTable.isItemPresent(site)).toBe(true, 'user site is not displayed');
    });

    it('Search - No results displayed - [C263889]', async () => {
      await contentNodeSelector.searchFor('nonexistent-folder');
      expect(await contentNodeSelector.dataTable.isEmpty()).toBe(true, 'datatable not empty');
      expect(await contentNodeSelector.dataTable.getEmptyListText()).toEqual('No results found');
    });

    it('Search - results found - [C263888]', async () => {
      await contentNodeSelector.searchFor(searchFolder);
      expect(await contentNodeSelector.dataTable.isItemPresent(searchFolder, username)).toBe(true, 'folder from Personal Files not displayed');
      expect(await contentNodeSelector.dataTable.isItemPresent(searchFolder, site)).toBe(true, 'folder from site not displayed');
    });
  });

  describe('multiple selection', () => {
    beforeAll(async () => {
      await loginPage.loginWith(username);
    });

    beforeEach(async () => {
      await dataTable.selectMultipleItems([file, destination]);
      await toolbar.clickMoreActionsCopy();
      await contentNodeSelector.waitForDialogToOpen();
    });

    it('Dialog title - multiple selection - [C263879]', async () => {
      expect(await contentNodeSelector.getTitle()).toEqual(`Copy 2 items to...`);
    });
  });

  describe('breadcrumb', () => {
    beforeAll(async () => {
      await loginPage.loginWith(username);
    });

    beforeEach(async () => {
      await dataTable.selectItem(file);
      await toolbar.clickMoreActionsCopy();
      await contentNodeSelector.waitForDialogToOpen();
    });

    it('Personal Files breadcrumb - main node - [C263890]', async () => {
      await contentNodeSelector.selectLocation('Personal Files');
      expect(await contentNodeSelector.breadcrumb.getCurrentFolderName()).toEqual('Personal Files');
    });

    it('File Libraries breadcrumb - main node - [C263891]', async () => {
      await contentNodeSelector.selectLocation('File Libraries');
      expect(await contentNodeSelector.breadcrumb.getCurrentFolderName()).toEqual('File Libraries');
    });

    it('Search results breadcrumb - [C263899]', async () => {
      await contentNodeSelector.searchFor(searchFolder);
      expect(await contentNodeSelector.getToolbarTitle()).toEqual('Search results');
    });

    it('Search results breadcrumb when selecting a folder - [C263900]', async () => {
      await contentNodeSelector.searchFor(searchFolder);
      await contentNodeSelector.dataTable.selectItem(searchFolder, site);
      expect(await contentNodeSelector.breadcrumb.getCurrentFolderName()).toEqual(searchFolder);
    });

    it('Personal Files breadcrumb - folder structure - [C263897]', async () => {
      await contentNodeSelector.selectLocation('Personal Files');
      await contentNodeSelector.dataTable.doubleClickOnRowByName(destination);
      expect(await contentNodeSelector.breadcrumb.getCurrentFolderName()).toEqual(destination);
      await contentNodeSelector.dataTable.doubleClickOnRowByName(searchFolder);
      expect(await contentNodeSelector.breadcrumb.getCurrentFolderName()).toEqual(searchFolder);
      await contentNodeSelector.dataTable.doubleClickOnRowByName(searchSubFolder1);
      expect(await contentNodeSelector.breadcrumb.getCurrentFolderName()).toEqual(searchSubFolder1);
      await contentNodeSelector.dataTable.doubleClickOnRowByName(searchSubFolder2);
      expect(await contentNodeSelector.breadcrumb.getCurrentFolderName()).toEqual(searchSubFolder2);
      await contentNodeSelector.breadcrumb.openPath();
      expect(await contentNodeSelector.breadcrumb.getPathItems()).toEqual([searchSubFolder1, searchFolder, destination, 'Personal Files']);
    });

    it('File Libraries breadcrumb - folder structure - [C263898]', async () => {
      await contentNodeSelector.selectLocation('File Libraries');
      await contentNodeSelector.dataTable.doubleClickOnRowByName(site);
      expect(await contentNodeSelector.breadcrumb.getCurrentFolderName()).toEqual(site);
      await contentNodeSelector.dataTable.doubleClickOnRowByName('documentLibrary');
      expect(await contentNodeSelector.breadcrumb.getCurrentFolderName()).toEqual(site);
      await contentNodeSelector.dataTable.doubleClickOnRowByName(searchFolder);
      expect(await contentNodeSelector.breadcrumb.getCurrentFolderName()).toEqual(searchFolder);
      await contentNodeSelector.dataTable.doubleClickOnRowByName(searchSubFolder1);
      expect(await contentNodeSelector.breadcrumb.getCurrentFolderName()).toEqual(searchSubFolder1);
      await contentNodeSelector.dataTable.doubleClickOnRowByName(searchSubFolder2);
      expect(await contentNodeSelector.breadcrumb.getCurrentFolderName()).toEqual(searchSubFolder2);
      await contentNodeSelector.breadcrumb.openPath();
      expect(await contentNodeSelector.breadcrumb.getPathItems()).toEqual([searchSubFolder1, searchFolder, site, 'File Libraries']);
    });

    it('Select a node from the breadcrumb path - [C263895]', async () => {
      await contentNodeSelector.selectLocation('Personal Files');
      await contentNodeSelector.dataTable.doubleClickOnRowByName(destination);
      await contentNodeSelector.dataTable.doubleClickOnRowByName(searchFolder);
      await contentNodeSelector.dataTable.doubleClickOnRowByName(searchSubFolder1);
      await contentNodeSelector.dataTable.doubleClickOnRowByName(searchSubFolder2);
      await contentNodeSelector.breadcrumb.openPath();

      await contentNodeSelector.breadcrumb.clickPathItem(destination);
      expect(await contentNodeSelector.breadcrumb.getCurrentFolderName()).toEqual(destination);
      expect(await contentNodeSelector.dataTable.isItemPresent(searchFolder)).toBe(true, 'folder not displayed');
    });
  });

  describe('Users with different permissions', () => {

    it('Consumer user cannot select the folder as destination - [C263876]', async () => {
      await loginPage.loginWith(consumer);
      await dataTable.selectItem(file);
      await toolbar.clickMoreActionsCopy();
      await contentNodeSelector.waitForDialogToOpen();

      await contentNodeSelector.selectLocation('File Libraries');
      await contentNodeSelector.dataTable.doubleClickOnRowByName(site);
      await contentNodeSelector.dataTable.doubleClickOnRowByName('documentLibrary');
      await contentNodeSelector.dataTable.selectItem(searchFolder);

      expect(await contentNodeSelector.isCopyButtonEnabled()).toBe(false, 'Copy should be disabled');
    });

    it('Contributor user can select the folder as destination - [C263877]', async () => {
      await loginPage.loginWith(contributor);
      await dataTable.selectItem(file);
      await toolbar.clickMoreActionsCopy();
      await contentNodeSelector.waitForDialogToOpen();

      await contentNodeSelector.selectLocation('File Libraries');
      await contentNodeSelector.dataTable.doubleClickOnRowByName(site);
      await contentNodeSelector.dataTable.doubleClickOnRowByName('documentLibrary');
      await contentNodeSelector.dataTable.selectItem(searchFolder);

      expect(await contentNodeSelector.isCopyButtonEnabled()).toBe(true, 'Copy should be disabled');
    });

    it('Collaborator user can select the folder as destination - [C263878]', async () => {
      await loginPage.loginWith(collaborator);
      await dataTable.selectItem(file);
      await toolbar.clickMoreActionsCopy();
      await contentNodeSelector.waitForDialogToOpen();

      await contentNodeSelector.selectLocation('File Libraries');
      await contentNodeSelector.dataTable.doubleClickOnRowByName(site);
      await contentNodeSelector.dataTable.doubleClickOnRowByName('documentLibrary');
      await contentNodeSelector.dataTable.selectItem(searchFolder);

      expect(await contentNodeSelector.isCopyButtonEnabled()).toBe(true, 'Copy should be disabled');
    });

    it('Admin user - Personal Files breadcrumb main node - [C263892]', async () => {
      await loginPage.loginWithAdmin();
      await dataTable.selectItem(adminFolder);
      await toolbar.clickMoreActionsCopy();
      await contentNodeSelector.waitForDialogToOpen();

      await contentNodeSelector.selectLocation('Personal Files');
      expect(await contentNodeSelector.breadcrumb.getCurrentFolderName()).toEqual('Company Home');
    });
  });
});
