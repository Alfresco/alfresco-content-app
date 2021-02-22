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

import { browser } from 'protractor';
import {
  ApiActions,
  BrowsingPage,
  SITE_VISIBILITY,
  SITE_ROLES,
  RepoClient,
  ShareDialog,
  ConfirmDialog,
  Viewer,
  Utils
} from '@alfresco/aca-testing-shared';
import { ApiService, BrowserActions, UsersActions, LoginPage } from '@alfresco/adf-testing';

describe('Unshare a file', () => {
  const parent = `parent-${Utils.random()}`;
  let parentId: string;

  const apiService = new ApiService();
  const adminApiService = new ApiService();
  const repoClient = new RepoClient(apiService);
  const adminApiActions = new ApiActions(adminApiService);
  const apiActions = new ApiActions(apiService);
  const usersActions = new UsersActions(adminApiService);

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const shareDialog = new ShareDialog();
  const confirmDialog = new ConfirmDialog();
  const contextMenu = dataTable.menu;
  const viewer = new Viewer();

  beforeAll(async (done) => {
    await adminApiService.loginWithProfile('admin');
    const user = await usersActions.createUser();
    await apiService.login(user.username, user.password);

    parentId = (await repoClient.nodes.createFolder(parent)).entry.id;
    await loginPage.loginWith(user.username, user.password);
    done();
  });

  afterAll(async (done) => {
    await repoClient.nodes.deleteNodeById(parentId);
    done();
  });

  describe('from Personal Files', () => {
    const file1 = `file1-${Utils.random()}.txt`;
    let file1Id: string;
    const file2 = `file2-${Utils.random()}.txt`;
    let file2Id: string;
    const file3 = `file3-${Utils.random()}.txt`;
    let file3Id: string;
    const file4 = `file4-${Utils.random()}.txt`;
    let file4Id: string;

    beforeAll(async (done) => {
      file1Id = (await repoClient.nodes.createFile(file1, parentId)).entry.id;
      file2Id = (await repoClient.nodes.createFile(file2, parentId)).entry.id;
      file3Id = (await repoClient.nodes.createFile(file3, parentId)).entry.id;
      file4Id = (await repoClient.nodes.createFile(file4, parentId)).entry.id;

      await apiActions.shareNodes([file1Id, file2Id, file3Id, file4Id]);
      await repoClient.shared.waitForFilesToBeShared([file1Id, file2Id, file3Id, file4Id]);
      done();
    });

    beforeEach(async (done) => {
      await page.closeOpenDialogs();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);
      await dataTable.waitForHeader();
      done();
    });

    afterEach(async (done) => {
      await page.closeOpenDialogs();
      done();
    });

    afterAll(async (done) => {
      await repoClient.nodes.deleteNodesById([file1Id, file2Id, file3Id, file4Id]);
      done();
    });

    it('[C286339] Unshare dialog UI', async () => {
      await dataTable.selectItem(file1);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
      await BrowserActions.click(shareDialog.shareToggle);

      expect(await confirmDialog.isDialogOpen()).toBe(true, 'Unshare dialog is not open');
      expect(await confirmDialog.getDialogTitle()).toContain('Remove this shared link');
      expect(await confirmDialog.getText()).toContain('This link will be deleted and a new link will be created next time this file is shared');
      expect(await confirmDialog.isRemoveEnabled()).toBe(true, 'REMOVE button is not enabled');
      expect(await confirmDialog.isCancelEnabled()).toBe(true, 'CANCEL button is not enabled');
    });

    it('[C286340] Unshare a file', async () => {
      await dataTable.selectItem(file2);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();

      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repoClient.nodes.isFileShared(file2Id)).toBe(false, `${file2} is shared`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file2);

      await page.load();
    });

    it('[C286341] Cancel the Unshare action', async () => {
      await dataTable.selectItem(file3);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();

      const urlBefore = await shareDialog.getLinkUrl();
      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();

      await confirmDialog.cancelButton.click();
      await confirmDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Share dialog not open');
      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle is off');

      const urlAfter = await shareDialog.getLinkUrl();
      expect(urlBefore).toEqual(urlAfter);
    });

    it('[C286359] Unshare a file from the context menu', async () => {
      await dataTable.rightClickOnItem(file4);
      await BrowserActions.click(contextMenu.shareEditAction);
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();

      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repoClient.nodes.isFileShared(file4Id)).toBe(false, `${file4} is shared`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file4);

      await page.load();
    });
  });

  describe('from File Libraries', () => {
    const file1 = `file1-${Utils.random()}.txt`;
    let file1Id: string;
    const file2 = `file2-${Utils.random()}.txt`;
    let file2Id: string;
    const file3 = `file3-${Utils.random()}.txt`;
    let file3Id: string;
    const file4 = `file4-${Utils.random()}.txt`;
    let file4Id: string;

    const siteName = `site-${Utils.random()}`;
    const parentInSite = `parent-site-${Utils.random()}`;
    let parentInSiteId: string;

    beforeAll(async (done) => {
      await repoClient.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
      const docLibId = await repoClient.sites.getDocLibId(siteName);
      parentInSiteId = (await repoClient.nodes.createFolder(parentInSite, docLibId)).entry.id;

      file1Id = (await repoClient.nodes.createFile(file1, parentInSiteId)).entry.id;
      file2Id = (await repoClient.nodes.createFile(file2, parentInSiteId)).entry.id;
      file3Id = (await repoClient.nodes.createFile(file3, parentInSiteId)).entry.id;
      file4Id = (await repoClient.nodes.createFile(file4, parentInSiteId)).entry.id;

      await apiActions.shareNodes([file1Id, file2Id, file3Id, file4Id]);
      await repoClient.shared.waitForFilesToBeShared([file1Id, file2Id, file3Id, file4Id]);
      done();
    });

    beforeEach(async (done) => {
      await page.closeOpenDialogs();
      await page.goToMyLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.waitForHeader();
      await dataTable.doubleClickOnRowByName(parentInSite);
      await dataTable.waitForHeader();
      done();
    });

    afterEach(async (done) => {
      await page.closeOpenDialogs();
      done();
    });

    afterAll(async (done) => {
      await adminApiActions.sites.deleteSite(siteName);
      done();
    });

    it('[C286679] Unshare dialog UI', async () => {
      await dataTable.selectItem(file1);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
      await BrowserActions.click(shareDialog.shareToggle);

      expect(await confirmDialog.isDialogOpen()).toBe(true, 'Unshare dialog is not open');
      expect(await confirmDialog.getDialogTitle()).toContain('Remove this shared link');
      expect(await confirmDialog.getText()).toContain('This link will be deleted and a new link will be created next time this file is shared');
      expect(await confirmDialog.isRemoveEnabled()).toBe(true, 'REMOVE button is not enabled');
      expect(await confirmDialog.isCancelEnabled()).toBe(true, 'CANCEL button is not enabled');
    });

    it('[C286680] Unshare a file', async () => {
      await dataTable.selectItem(file2);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();

      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repoClient.nodes.isFileShared(file2Id)).toBe(false, `${file2} is shared`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file2);

      await page.load();
    });

    it('[C286681] Cancel the Unshare action', async () => {
      await dataTable.selectItem(file3);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();

      const urlBefore = await shareDialog.getLinkUrl();
      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();

      await confirmDialog.cancelButton.click();
      await confirmDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Share dialog not open');
      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle is off');

      const urlAfter = await shareDialog.getLinkUrl();
      expect(urlBefore).toEqual(urlAfter);
    });

    it('[C286683] Unshare a file from the context menu', async () => {
      await dataTable.rightClickOnItem(file4);
      await BrowserActions.click(contextMenu.shareEditAction);
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();

      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repoClient.nodes.isFileShared(file4Id)).toBe(false, `${file4} is shared`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file4);

      await page.load();
    });
  });

  describe('from Recent Files', () => {
    const file1 = `file1-${Utils.random()}.txt`;
    let file1Id: string;
    const file2 = `file2-${Utils.random()}.txt`;
    let file2Id: string;
    const file3 = `file3-${Utils.random()}.txt`;
    let file3Id: string;
    const file4 = `file4-${Utils.random()}.txt`;
    let file4Id: string;

    beforeAll(async (done) => {
      file1Id = (await repoClient.nodes.createFile(file1, parentId)).entry.id;
      file2Id = (await repoClient.nodes.createFile(file2, parentId)).entry.id;
      file3Id = (await repoClient.nodes.createFile(file3, parentId)).entry.id;
      file4Id = (await repoClient.nodes.createFile(file4, parentId)).entry.id;

      await apiActions.shareNodes([file1Id, file2Id, file3Id, file4Id]);
      await repoClient.shared.waitForFilesToBeShared([file1Id, file2Id, file3Id, file4Id]);
      done();
    });

    beforeEach(async (done) => {
      await page.closeOpenDialogs();
      await page.clickRecentFilesAndWait();
      done();
    });

    afterEach(async (done) => {
      await page.closeOpenDialogs();
      done();
    });

    afterAll(async (done) => {
      await repoClient.nodes.deleteNodesById([file1Id, file2Id, file3Id, file4Id]);
      done();
    });

    it('[C286689] Unshare dialog UI', async () => {
      await dataTable.selectItem(file1);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
      await BrowserActions.click(shareDialog.shareToggle);

      expect(await confirmDialog.isDialogOpen()).toBe(true, 'Unshare dialog is not open');
      expect(await confirmDialog.getDialogTitle()).toContain('Remove this shared link');
      expect(await confirmDialog.getText()).toContain('This link will be deleted and a new link will be created next time this file is shared');
      expect(await confirmDialog.isRemoveEnabled()).toBe(true, 'REMOVE button is not enabled');
      expect(await confirmDialog.isCancelEnabled()).toBe(true, 'CANCEL button is not enabled');
    });

    it('[C286690] Unshare a file', async () => {
      await dataTable.selectItem(file2);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();

      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repoClient.nodes.isFileShared(file2Id)).toBe(false, `${file2} is shared`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file2);

      await page.load();
    });

    it('[C286691] Cancel the Unshare action', async () => {
      await dataTable.selectItem(file3);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();

      const urlBefore = await shareDialog.getLinkUrl();
      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();

      await confirmDialog.cancelButton.click();
      await confirmDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Share dialog not open');
      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle is off');

      const urlAfter = await shareDialog.getLinkUrl();
      expect(urlBefore).toEqual(urlAfter);
    });

    it('[C286693] Unshare a file from the context menu', async () => {
      await dataTable.rightClickOnItem(file4);
      await BrowserActions.click(contextMenu.shareEditAction);
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();

      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repoClient.nodes.isFileShared(file4Id)).toBe(false, `${file4} is shared`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file4);

      await page.load();
    });
  });

  describe('from Shared Files', () => {
    const file1 = `file1-${Utils.random()}.txt`;
    let file1Id: string;
    const file2 = `file2-${Utils.random()}.txt`;
    let file2Id: string;
    const file3 = `file3-${Utils.random()}.txt`;
    let file3Id: string;
    const file4 = `file4-${Utils.random()}.txt`;
    let file4Id: string;

    beforeAll(async (done) => {
      file1Id = (await repoClient.nodes.createFile(file1, parentId)).entry.id;
      file2Id = (await repoClient.nodes.createFile(file2, parentId)).entry.id;
      file3Id = (await repoClient.nodes.createFile(file3, parentId)).entry.id;
      file4Id = (await repoClient.nodes.createFile(file4, parentId)).entry.id;

      await apiActions.shareNodes([file1Id, file2Id, file3Id, file4Id]);
      await repoClient.shared.waitForFilesToBeShared([file1Id, file2Id, file3Id, file4Id]);
      done();
    });

    beforeEach(async (done) => {
      await page.closeOpenDialogs();
      await page.clickSharedFilesAndWait();
      done();
    });

    afterEach(async (done) => {
      await page.closeOpenDialogs();
      done();
    });

    afterAll(async (done) => {
      await repoClient.nodes.deleteNodesById([file1Id, file2Id, file3Id, file4Id]);
      done();
    });

    it('[C286684] Unshare dialog UI', async () => {
      await dataTable.selectItem(file1);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
      await BrowserActions.click(shareDialog.shareToggle);

      expect(await confirmDialog.isDialogOpen()).toBe(true, 'Unshare dialog is not open');
      expect(await confirmDialog.getDialogTitle()).toContain('Remove this shared link');
      expect(await confirmDialog.getText()).toContain('This link will be deleted and a new link will be created next time this file is shared');
      expect(await confirmDialog.isRemoveEnabled()).toBe(true, 'REMOVE button is not enabled');
      expect(await confirmDialog.isCancelEnabled()).toBe(true, 'CANCEL button is not enabled');
    });

    it('[C286685] Unshare a file', async () => {
      await dataTable.selectItem(file2);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();

      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repoClient.nodes.isFileShared(file2Id)).toBe(false, `${file2} is shared`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file2);

      await page.load();
    });

    it('[C286686] Cancel the Unshare action', async () => {
      await dataTable.selectItem(file3);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();

      const urlBefore = await shareDialog.getLinkUrl();
      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();

      await confirmDialog.cancelButton.click();
      await confirmDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Share dialog not open');
      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle is off');

      const urlAfter = await shareDialog.getLinkUrl();
      expect(urlBefore).toEqual(urlAfter);
    });

    it('[C286688] Unshare a file from the context menu', async () => {
      await dataTable.rightClickOnItem(file4);
      await BrowserActions.click(contextMenu.shareEditAction);
      await shareDialog.waitForDialogToOpen();

      const url = await shareDialog.getLinkUrl();
      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();

      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repoClient.nodes.isFileShared(file4Id)).toBe(false, `${file4} is shared`);

      await browser.get(url);
      await viewer.waitForViewerToOpen();

      expect(await viewer.getFileTitle()).not.toEqual(file4);

      await page.load();
    });
  });

  describe('from Favorites', () => {
    const file1 = `file1-${Utils.random()}.txt`;
    let file1Id: string;
    const file2 = `file2-${Utils.random()}.txt`;
    let file2Id: string;
    const file3 = `file3-${Utils.random()}.txt`;
    let file3Id: string;
    const file4 = `file4-${Utils.random()}.txt`;
    let file4Id: string;

    beforeAll(async (done) => {
      file1Id = (await repoClient.nodes.createFile(file1, parentId)).entry.id;
      file2Id = (await repoClient.nodes.createFile(file2, parentId)).entry.id;
      file3Id = (await repoClient.nodes.createFile(file3, parentId)).entry.id;
      file4Id = (await repoClient.nodes.createFile(file4, parentId)).entry.id;

      await apiActions.shareNodes([file1Id, file2Id, file3Id, file4Id]);

      await repoClient.favorites.addFavoriteById('file', file1Id);
      await repoClient.favorites.addFavoriteById('file', file2Id);
      await repoClient.favorites.addFavoriteById('file', file3Id);
      await repoClient.favorites.addFavoriteById('file', file4Id);

      await repoClient.favorites.waitForApi({ expect: 4 });
      await repoClient.shared.waitForFilesToBeShared([file1Id, file2Id, file3Id, file4Id]);
      done();
    });

    beforeEach(async (done) => {
      await page.closeOpenDialogs();
      await page.clickFavoritesAndWait();
      done();
    });

    afterEach(async (done) => {
      await page.closeOpenDialogs();
      done();
    });

    afterAll(async (done) => {
      await repoClient.nodes.deleteNodesById([file1Id, file2Id, file3Id, file4Id]);
      done();
    });

    it('[C286694] Unshare dialog UI', async () => {
      await dataTable.selectItem(file1);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
      await BrowserActions.click(shareDialog.shareToggle);

      expect(await confirmDialog.isDialogOpen()).toBe(true, 'Unshare dialog is not open');
      expect(await confirmDialog.getDialogTitle()).toContain('Remove this shared link');
      expect(await confirmDialog.getText()).toContain('This link will be deleted and a new link will be created next time this file is shared');
      expect(await confirmDialog.isRemoveEnabled()).toBe(true, 'REMOVE button is not enabled');
      expect(await confirmDialog.isCancelEnabled()).toBe(true, 'CANCEL button is not enabled');
    });

    it('[C286695] Unshare a file', async () => {
      await dataTable.selectItem(file2);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();

      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repoClient.nodes.isFileShared(file2Id)).toBe(false, `${file2} is shared`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file2);

      await page.load();
    });

    it('[C286696] Cancel the Unshare action', async () => {
      await dataTable.selectItem(file3);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();

      const urlBefore = await shareDialog.getLinkUrl();
      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();

      await confirmDialog.cancelButton.click();
      await confirmDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Share dialog not open');
      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle is off');

      const urlAfter = await shareDialog.getLinkUrl();
      expect(urlBefore).toEqual(urlAfter);
    });

    it('[C286698] Unshare a file from the context menu', async () => {
      await dataTable.rightClickOnItem(file4);
      await BrowserActions.click(contextMenu.shareEditAction);
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();

      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repoClient.nodes.isFileShared(file4Id)).toBe(false, `${file4} is shared`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file4);

      await page.load();
    });
  });

  describe('as Consumer', () => {
    const sitePrivate = `site-private-${Utils.random()}`;

    const file1FileLib = `file1-FL-${Utils.random()}.txt`;
    let file1FileLibId: string;
    const file2FileLib = `file2-FL-${Utils.random()}.txt`;
    let file2FileLibId: string;
    const file1Shared = `file1-Shared-${Utils.random()}.txt`;
    let file1SharedId: string;
    const file2Shared = `file2-Shared-${Utils.random()}.txt`;
    let file2SharedId: string;
    const file1Fav = `file1-Fav-${Utils.random()}.txt`;
    let file1FavId: string;
    const file2Fav = `file2-Fav-${Utils.random()}.txt`;
    let file2FavId: string;

    beforeAll(async (done) => {
      await adminApiActions.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE);
      const docLibId = await adminApiActions.sites.getDocLibId(sitePrivate);

      file1FileLibId = (await adminApiActions.nodes.createFile(file1FileLib, docLibId)).entry.id;
      file2FileLibId = (await adminApiActions.nodes.createFile(file2FileLib, docLibId)).entry.id;
      file1SharedId = (await adminApiActions.nodes.createFile(file1Shared, docLibId)).entry.id;
      file2SharedId = (await adminApiActions.nodes.createFile(file2Shared, docLibId)).entry.id;
      file1FavId = (await adminApiActions.nodes.createFile(file1Fav, docLibId)).entry.id;
      file2FavId = (await adminApiActions.nodes.createFile(file2Fav, docLibId)).entry.id;

      await adminApiActions.sites.addSiteMember(sitePrivate, user.username, SITE_ROLES.SITE_CONSUMER.ROLE);

      await adminApiService.loginWithProfile('admin');
      await adminApiActions.shareNodes([file1FileLibId, file1SharedId, file1FavId]);

      await apiService.login(user.username, user.password);
      await apiActions.shareNodes([file2FileLibId, file2SharedId, file2FavId]);

      await repoClient.favorites.addFavoriteById('file', file1FavId);
      await repoClient.favorites.addFavoriteById('file', file2FavId);

      await repoClient.favorites.waitForApi({ expect: 2 });
      await adminApiActions.shared.waitForFilesToBeShared([file1FileLibId, file1SharedId, file1FavId]);
      await repoClient.shared.waitForFilesToBeShared([file2FileLibId, file2SharedId, file2FavId]);

      done();
    });

    afterAll(async (done) => {
      await adminApiActions.sites.deleteSite(sitePrivate);
      done();
    });

    afterEach(async (done) => {
      await page.closeOpenDialogs();
      await page.clickPersonalFilesAndWait();
      done();
    });

    it('[C286682] on File Libraries - file shared by other user', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(sitePrivate);
      await dataTable.waitForHeader();
      await dataTable.selectItem(file1FileLib);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle disabled for consumer');

      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();
      await confirmDialog.removeButton.click();

      const msg = await page.getSnackBarMessage();
      expect(msg).toContain(`You don't have permission to unshare this file`);
    });

    it('[C286701] on File Libraries - file shared by the user', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(sitePrivate);
      await dataTable.waitForHeader();
      await dataTable.selectItem(file2FileLib);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle disabled for consumer');

      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();
      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();

      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repoClient.nodes.isFileShared(file2FileLibId)).toBe(false, `${file2FileLib} is shared`);
    });

    it('[C286687] on Shared Files - file shared by other user', async () => {
      await page.clickSharedFilesAndWait();
      await dataTable.selectItem(file1Shared);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle disabled for consumer');

      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();
      await confirmDialog.removeButton.click();

      const msg = await page.getSnackBarMessage();
      expect(msg).toContain(`You don't have permission to unshare this file`);
    });

    it('[C286702] on Shared Files - file shared by the user', async () => {
      await page.clickSharedFilesAndWait();
      await dataTable.selectItem(file2Shared);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle disabled for consumer');

      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();
      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();

      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repoClient.nodes.isFileShared(file2SharedId)).toBe(false, `${file2Shared} is shared`);
    });

    it('[C286697] on Favorites - file shared by other user', async () => {
      await page.clickFavoritesAndWait();
      await dataTable.selectItem(file1Fav);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle disabled for consumer');

      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();
      await confirmDialog.removeButton.click();

      const msg = await page.getSnackBarMessage();
      expect(msg).toContain(`You don't have permission to unshare this file`);
    });

    it('[C286703] on Favorites - file shared by the user', async () => {
      await page.clickFavoritesAndWait();
      await dataTable.selectItem(file2Fav);
      await BrowserActions.click(toolbar.shareEditButton);
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle disabled for consumer');

      await BrowserActions.click(shareDialog.shareToggle);
      await confirmDialog.waitForDialogToOpen();
      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();

      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repoClient.nodes.isFileShared(file2FavId)).toBe(false, `${file2Fav} is shared`);
    });
  });
});
