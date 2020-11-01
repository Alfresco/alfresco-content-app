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
  ShareDialog,
  ConfirmDialog,
  Viewer,
  Utils,
  AdminActions,
  CoreActions
} from '@alfresco/aca-testing-shared';
import { ApiService, LoginPage, UsersActions, UserModel } from '@alfresco/adf-testing';
import { browser } from 'protractor';

describe('Unshare a file', () => {
  let user: UserModel;

  const parent = `parent-${Utils.random()}`;
  let parentId: string;

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const shareDialog = new ShareDialog();
  const confirmDialog = new ConfirmDialog();
  const contextMenu = dataTable.menu;
  const viewer = new Viewer();

  const apiService = new ApiService();
  const usersActions = new UsersActions(apiService);
  const repo = new RepoClient(apiService);
  const adminActions = new AdminActions(apiService);
  const coreActions = new CoreActions(apiService);

  beforeAll(async () => {
    await apiService.loginWithProfile('admin');
    user = await usersActions.createUser();
    await apiService.login(user.email, user.password);

    parentId = (await repo.nodes.createFolder(parent)).entry.id;
    await loginPage.login(user.email, user.password);
  });

  afterAll(async () => {
    await repo.nodes.deleteNodeById(parentId);
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
    let initialSharedTotalItems: number;

    beforeAll(async () => {
      file1Id = (await repo.nodes.createFile(file1, parentId)).entry.id;
      file2Id = (await repo.nodes.createFile(file2, parentId)).entry.id;
      file3Id = (await repo.nodes.createFile(file3, parentId)).entry.id;
      file4Id = (await repo.nodes.createFile(file4, parentId)).entry.id;
      initialSharedTotalItems = await repo.shared.getSharedLinksTotalItems();

      await coreActions.shareNodes([file1Id, file2Id, file3Id, file4Id]);
      await repo.shared.waitForApi({ expect: initialSharedTotalItems + 4 });
    });

    beforeEach(async () => {
      await page.closeOpenDialogs();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);
      await dataTable.waitForHeader();
    });

    afterEach(async () => {
      await page.closeOpenDialogs();
    });

    afterAll(async () => {
      await repo.nodes.deleteNodeById(file1Id);
      await repo.nodes.deleteNodeById(file2Id);
      await repo.nodes.deleteNodeById(file3Id);
      await repo.nodes.deleteNodeById(file4Id);
      await repo.shared.waitForApi({ expect: initialSharedTotalItems });
    });

    it('[C286339] Unshare dialog UI', async () => {
      await dataTable.selectItem(file1);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
      await shareDialog.shareToggle.click();

      expect(await confirmDialog.isDialogOpen()).toBe(true, 'Unshare dialog is not open');
      expect(await confirmDialog.getTitle()).toContain('Remove this shared link');
      expect(await confirmDialog.getText()).toContain('This link will be deleted and a new link will be created next time this file is shared');
      expect(await confirmDialog.isRemoveEnabled()).toBe(true, 'REMOVE button is not enabled');
      expect(await confirmDialog.isCancelEnabled()).toBe(true, 'CANCEL button is not enabled');
    });

    it('[C286340] Unshare a file', async () => {
      await dataTable.selectItem(file2);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await shareDialog.shareToggle.click();

      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repo.nodes.isFileShared(file2Id)).toBe(false, `${file2} is shared`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file2);

      await page.load();
    });

    it('[C286341] Cancel the Unshare action', async () => {
      await dataTable.selectItem(file3);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();

      const urlBefore = await shareDialog.getLinkUrl();
      await shareDialog.shareToggle.click();

      await confirmDialog.cancelButton.click();
      await confirmDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Share dialog not open');
      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle is off');

      const urlAfter = await shareDialog.getLinkUrl();
      expect(urlBefore).toEqual(urlAfter);
    });

    it('[C286359] Unshare a file from the context menu', async () => {
      await dataTable.rightClickOnItem(file4);
      await contextMenu.shareEditAction.click();
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await shareDialog.shareToggle.click();

      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repo.nodes.isFileShared(file4Id)).toBe(false, `${file4} is shared`);

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
    let initialSharedTotalItems: number;

    beforeAll(async () => {
      await repo.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
      const docLibId = await repo.sites.getDocLibId(siteName);
      parentInSiteId = (await repo.nodes.createFolder(parentInSite, docLibId)).entry.id;

      file1Id = (await repo.nodes.createFile(file1, parentInSiteId)).entry.id;
      file2Id = (await repo.nodes.createFile(file2, parentInSiteId)).entry.id;
      file3Id = (await repo.nodes.createFile(file3, parentInSiteId)).entry.id;
      file4Id = (await repo.nodes.createFile(file4, parentInSiteId)).entry.id;
      initialSharedTotalItems = await repo.shared.getSharedLinksTotalItems();

      await coreActions.shareNodes([file1Id, file2Id, file3Id, file4Id]);
      await repo.shared.waitForApi({ expect: initialSharedTotalItems + 4 });
    });

    beforeEach(async () => {
      await page.closeOpenDialogs();
      await page.goToMyLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.waitForHeader();
      await dataTable.doubleClickOnRowByName(parentInSite);
      await dataTable.waitForHeader();
    });

    afterEach(async () => {
      await page.closeOpenDialogs();
    });

    afterAll(async () => {
      await adminActions.sites.deleteSite(siteName);
      await repo.shared.waitForApi({ expect: initialSharedTotalItems });
    });

    it('[C286679] Unshare dialog UI', async () => {
      await dataTable.selectItem(file1);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
      await shareDialog.shareToggle.click();

      expect(await confirmDialog.isDialogOpen()).toBe(true, 'Unshare dialog is not open');
      expect(await confirmDialog.getTitle()).toContain('Remove this shared link');
      expect(await confirmDialog.getText()).toContain('This link will be deleted and a new link will be created next time this file is shared');
      expect(await confirmDialog.isRemoveEnabled()).toBe(true, 'REMOVE button is not enabled');
      expect(await confirmDialog.isCancelEnabled()).toBe(true, 'CANCEL button is not enabled');
    });

    it('[C286680] Unshare a file', async () => {
      await dataTable.selectItem(file2);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await shareDialog.shareToggle.click();

      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repo.nodes.isFileShared(file2Id)).toBe(false, `${file2} is shared`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file2);

      await page.load();
    });

    it('[C286681] Cancel the Unshare action', async () => {
      await dataTable.selectItem(file3);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();

      const urlBefore = await shareDialog.getLinkUrl();
      await shareDialog.shareToggle.click();

      await confirmDialog.cancelButton.click();
      await confirmDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Share dialog not open');
      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle is off');

      const urlAfter = await shareDialog.getLinkUrl();
      expect(urlBefore).toEqual(urlAfter);
    });

    it('[C286683] Unshare a file from the context menu', async () => {
      await dataTable.rightClickOnItem(file4);
      await contextMenu.shareEditAction.click();
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await shareDialog.shareToggle.click();

      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repo.nodes.isFileShared(file4Id)).toBe(false, `${file4} is shared`);

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
    let initialSharedTotalItems: number;

    beforeAll(async () => {
      file1Id = (await repo.nodes.createFile(file1, parentId)).entry.id;
      file2Id = (await repo.nodes.createFile(file2, parentId)).entry.id;
      file3Id = (await repo.nodes.createFile(file3, parentId)).entry.id;
      file4Id = (await repo.nodes.createFile(file4, parentId)).entry.id;

      initialSharedTotalItems = await repo.shared.getSharedLinksTotalItems();

      await coreActions.shareNodes([file1Id, file2Id, file3Id, file4Id]);
      await repo.shared.waitForApi({ expect: initialSharedTotalItems + 4 });
    });

    beforeEach(async () => {
      await page.closeOpenDialogs();
      await page.clickRecentFilesAndWait();
    });

    afterEach(async () => {
      await page.closeOpenDialogs();
    });

    afterAll(async () => {
      await repo.nodes.deleteNodeById(file1Id);
      await repo.nodes.deleteNodeById(file2Id);
      await repo.nodes.deleteNodeById(file3Id);
      await repo.nodes.deleteNodeById(file4Id);
      await repo.shared.waitForApi({ expect: initialSharedTotalItems });
    });

    it('[C286689] Unshare dialog UI', async () => {
      await dataTable.selectItem(file1);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
      await shareDialog.shareToggle.click();

      expect(await confirmDialog.isDialogOpen()).toBe(true, 'Unshare dialog is not open');
      expect(await confirmDialog.getTitle()).toContain('Remove this shared link');
      expect(await confirmDialog.getText()).toContain('This link will be deleted and a new link will be created next time this file is shared');
      expect(await confirmDialog.isRemoveEnabled()).toBe(true, 'REMOVE button is not enabled');
      expect(await confirmDialog.isCancelEnabled()).toBe(true, 'CANCEL button is not enabled');
    });

    it('[C286690] Unshare a file', async () => {
      await dataTable.selectItem(file2);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await shareDialog.shareToggle.click();

      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repo.nodes.isFileShared(file2Id)).toBe(false, `${file2} is shared`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file2);

      await page.load();
    });

    it('[C286691] Cancel the Unshare action', async () => {
      await dataTable.selectItem(file3);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();

      const urlBefore = await shareDialog.getLinkUrl();
      await shareDialog.shareToggle.click();

      await confirmDialog.cancelButton.click();
      await confirmDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Share dialog not open');
      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle is off');

      const urlAfter = await shareDialog.getLinkUrl();
      expect(urlBefore).toEqual(urlAfter);
    });

    it('[C286693] Unshare a file from the context menu', async () => {
      await dataTable.rightClickOnItem(file4);
      await contextMenu.shareEditAction.click();
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await shareDialog.shareToggle.click();

      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repo.nodes.isFileShared(file4Id)).toBe(false, `${file4} is shared`);

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
    let initialSharedTotalItems: number;

    beforeAll(async () => {
      file1Id = (await repo.nodes.createFile(file1, parentId)).entry.id;
      file2Id = (await repo.nodes.createFile(file2, parentId)).entry.id;
      file3Id = (await repo.nodes.createFile(file3, parentId)).entry.id;
      file4Id = (await repo.nodes.createFile(file4, parentId)).entry.id;

      initialSharedTotalItems = await repo.shared.getSharedLinksTotalItems();

      await coreActions.shareNodes([file1Id, file2Id, file3Id, file4Id]);
      await repo.shared.waitForApi({ expect: initialSharedTotalItems + 4 });
    });

    beforeEach(async () => {
      await page.closeOpenDialogs();
      await page.clickSharedFilesAndWait();
    });

    afterEach(async () => {
      await page.closeOpenDialogs();
    });

    afterAll(async () => {
      await repo.nodes.deleteNodeById(file1Id);
      await repo.nodes.deleteNodeById(file2Id);
      await repo.nodes.deleteNodeById(file3Id);
      await repo.nodes.deleteNodeById(file4Id);
      await repo.shared.waitForApi({ expect: initialSharedTotalItems });
    });

    it('[C286684] Unshare dialog UI', async () => {
      await dataTable.selectItem(file1);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
      await shareDialog.shareToggle.click();

      expect(await confirmDialog.isDialogOpen()).toBe(true, 'Unshare dialog is not open');
      expect(await confirmDialog.getTitle()).toContain('Remove this shared link');
      expect(await confirmDialog.getText()).toContain('This link will be deleted and a new link will be created next time this file is shared');
      expect(await confirmDialog.isRemoveEnabled()).toBe(true, 'REMOVE button is not enabled');
      expect(await confirmDialog.isCancelEnabled()).toBe(true, 'CANCEL button is not enabled');
    });

    it('[C286685] Unshare a file', async () => {
      await dataTable.selectItem(file2);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await shareDialog.shareToggle.click();

      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repo.nodes.isFileShared(file2Id)).toBe(false, `${file2} is shared`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file2);

      await page.load();
    });

    it('[C286686] Cancel the Unshare action', async () => {
      await dataTable.selectItem(file3);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();

      const urlBefore = await shareDialog.getLinkUrl();
      await shareDialog.shareToggle.click();

      await confirmDialog.cancelButton.click();
      await confirmDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Share dialog not open');
      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle is off');

      const urlAfter = await shareDialog.getLinkUrl();
      expect(urlBefore).toEqual(urlAfter);
    });

    it('[C286688] Unshare a file from the context menu', async () => {
      await dataTable.rightClickOnItem(file4);
      await contextMenu.shareEditAction.click();
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await shareDialog.shareToggle.click();

      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repo.nodes.isFileShared(file4Id)).toBe(false, `${file4} is shared`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
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
    let initialSharedTotalItems: number;

    beforeAll(async () => {
      file1Id = (await repo.nodes.createFile(file1, parentId)).entry.id;
      file2Id = (await repo.nodes.createFile(file2, parentId)).entry.id;
      file3Id = (await repo.nodes.createFile(file3, parentId)).entry.id;
      file4Id = (await repo.nodes.createFile(file4, parentId)).entry.id;

      initialSharedTotalItems = await repo.shared.getSharedLinksTotalItems();

      await coreActions.shareNodes([file1Id, file2Id, file3Id, file4Id]);

      await repo.favorites.addFavoriteById('file', file1Id);
      await repo.favorites.addFavoriteById('file', file2Id);
      await repo.favorites.addFavoriteById('file', file3Id);
      await repo.favorites.addFavoriteById('file', file4Id);

      await repo.favorites.waitForApi({ expect: 4 });
      await repo.shared.waitForApi({ expect: initialSharedTotalItems + 4 });
    });

    beforeEach(async () => {
      await page.closeOpenDialogs();
      await page.clickFavoritesAndWait();
    });

    afterEach(async () => {
      await page.closeOpenDialogs();
    });

    afterAll(async () => {
      await repo.nodes.deleteNodeById(file1Id);
      await repo.nodes.deleteNodeById(file2Id);
      await repo.nodes.deleteNodeById(file3Id);
      await repo.nodes.deleteNodeById(file4Id);
      await repo.shared.waitForApi({ expect: initialSharedTotalItems });
    });

    it('[C286694] Unshare dialog UI', async () => {
      await dataTable.selectItem(file1);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
      await shareDialog.shareToggle.click();

      expect(await confirmDialog.isDialogOpen()).toBe(true, 'Unshare dialog is not open');
      expect(await confirmDialog.getTitle()).toContain('Remove this shared link');
      expect(await confirmDialog.getText()).toContain('This link will be deleted and a new link will be created next time this file is shared');
      expect(await confirmDialog.isRemoveEnabled()).toBe(true, 'REMOVE button is not enabled');
      expect(await confirmDialog.isCancelEnabled()).toBe(true, 'CANCEL button is not enabled');
    });

    it('[C286695] Unshare a file', async () => {
      await dataTable.selectItem(file2);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await shareDialog.shareToggle.click();

      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repo.nodes.isFileShared(file2Id)).toBe(false, `${file2} is shared`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file2);

      await page.load();
    });

    it('[C286696] Cancel the Unshare action', async () => {
      await dataTable.selectItem(file3);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();

      const urlBefore = await shareDialog.getLinkUrl();
      await shareDialog.shareToggle.click();

      await confirmDialog.cancelButton.click();
      await confirmDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Share dialog not open');
      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle is off');

      const urlAfter = await shareDialog.getLinkUrl();
      expect(urlBefore).toEqual(urlAfter);
    });

    it('[C286698] Unshare a file from the context menu', async () => {
      await dataTable.rightClickOnItem(file4);
      await contextMenu.shareEditAction.click();
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await shareDialog.shareToggle.click();

      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repo.nodes.isFileShared(file4Id)).toBe(false, `${file4} is shared`);

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

    beforeAll(async () => {
      await adminActions.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE);
      const docLibId = await adminActions.sites.getDocLibId(sitePrivate);

      file1FileLibId = (await adminActions.nodes.createFile(file1FileLib, docLibId)).entry.id;
      file2FileLibId = (await adminActions.nodes.createFile(file2FileLib, docLibId)).entry.id;
      file1SharedId = (await adminActions.nodes.createFile(file1Shared, docLibId)).entry.id;
      file2SharedId = (await adminActions.nodes.createFile(file2Shared, docLibId)).entry.id;
      file1FavId = (await adminActions.nodes.createFile(file1Fav, docLibId)).entry.id;
      file2FavId = (await adminActions.nodes.createFile(file2Fav, docLibId)).entry.id;

      await adminActions.sites.addSiteMember(sitePrivate, user.username, SITE_ROLES.SITE_CONSUMER.ROLE);

      const initialSharedTotalItems = await repo.shared.getSharedLinksTotalItems();
      await adminActions.shareNodes([file1FileLibId, file1SharedId, file1FavId]);
      await coreActions.shareNodes([file2FileLibId, file2SharedId, file2FavId]);

      await repo.favorites.addFavoriteById('file', file1FavId);
      await repo.favorites.addFavoriteById('file', file2FavId);

      await repo.favorites.waitForApi({ expect: 2 });
      await repo.shared.waitForApi({ expect: initialSharedTotalItems + 6 });
    });

    afterAll(async () => {
      await adminActions.sites.deleteSite(sitePrivate);
    });

    afterEach(async () => {
      await page.closeOpenDialogs();
      await page.clickPersonalFilesAndWait();
    });

    it('[C286682] on File Libraries - file shared by other user', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(sitePrivate);
      await dataTable.waitForHeader();
      await dataTable.selectItem(file1FileLib);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle disabled for consumer');

      await shareDialog.shareToggle.click();
      await confirmDialog.removeButton.click();

      const msg = await page.getSnackBarMessage();
      expect(msg).toContain(`You don't have permission to unshare this file`);
    });

    it('[C286701] on File Libraries - file shared by the user', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(sitePrivate);
      await dataTable.waitForHeader();
      await dataTable.selectItem(file2FileLib);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle disabled for consumer');

      await shareDialog.shareToggle.click();
      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();

      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repo.nodes.isFileShared(file2FileLibId)).toBe(false, `${file2FileLib} is shared`);
    });

    it('[C286687] on Shared Files - file shared by other user', async () => {
      await page.clickSharedFilesAndWait();
      await dataTable.selectItem(file1Shared);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle disabled for consumer');

      await shareDialog.shareToggle.click();
      await confirmDialog.removeButton.click();

      const msg = await page.getSnackBarMessage();
      expect(msg).toContain(`You don't have permission to unshare this file`);
    });

    it('[C286702] on Shared Files - file shared by the user', async () => {
      await page.clickSharedFilesAndWait();
      await dataTable.selectItem(file2Shared);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle disabled for consumer');

      await shareDialog.shareToggle.click();
      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();

      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repo.nodes.isFileShared(file2SharedId)).toBe(false, `${file2Shared} is shared`);
    });

    it('[C286697] on Favorites - file shared by other user', async () => {
      await page.clickFavoritesAndWait();
      await dataTable.selectItem(file1Fav);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle disabled for consumer');

      await shareDialog.shareToggle.click();
      await confirmDialog.removeButton.click();

      const msg = await page.getSnackBarMessage();
      expect(msg).toContain(`You don't have permission to unshare this file`);
    });

    it('[C286703] on Favorites - file shared by the user', async () => {
      await page.clickFavoritesAndWait();
      await dataTable.selectItem(file2Fav);
      await toolbar.shareEditButton.click();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle disabled for consumer');

      await shareDialog.shareToggle.click();
      await confirmDialog.removeButton.click();
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();

      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await repo.nodes.isFileShared(file2FavId)).toBe(false, `${file2Fav} is shared`);
    });
  });
});
