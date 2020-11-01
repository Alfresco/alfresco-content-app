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
import { BrowsingPage, SITE_VISIBILITY, RepoClient, ShareDialog, Viewer, Utils, AdminActions, CoreActions } from '@alfresco/aca-testing-shared';
import { ApiService, LoginPage, UsersActions, UserModel } from '@alfresco/adf-testing';

describe('Share a file', () => {
  let user: UserModel;
  const parent = `parent-${Utils.random()}`;
  let parentId: string;

  const file1 = `file1-${Utils.random()}.txt`;
  let file1Id: string;
  const file2 = `file2-${Utils.random()}.txt`;
  let file2Id: string;
  let file3 = `file3-${Utils.random()}.txt`;
  let file3Id: string;
  const file4 = `file4-${Utils.random()}.txt`;
  let file4Id: string;
  let file5 = `file5-${Utils.random()}.txt`;
  let file5Id: string;
  let file6 = `file6-${Utils.random()}.txt`;
  let file6Id: string;
  let file7 = `file7-${Utils.random()}.txt`;
  let file7Id: string;
  const file8 = `file8-${Utils.random()}.txt`;
  let file8Id: string;
  let file9 = `file9-${Utils.random()}.txt`;
  let file9Id: string;

  const viewer = new Viewer();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const shareLinkPreUrl = `/#/preview/s/`;

  const apiService = new ApiService();
  const usersActions = new UsersActions(apiService);
  const coreActions = new CoreActions(apiService);
  const repo = new RepoClient(apiService);
  const adminActions = new AdminActions(apiService);

  beforeAll(async () => {
    await apiService.getInstance().login(browser.params.testConfig.users.admin.username, browser.params.testConfig.users.admin.password);
    user = await usersActions.createUser();
    await apiService.getInstance().login(user.email, user.password);

    parentId = (await repo.nodes.createFolder(parent)).entry.id;
  });

  afterAll(async () => {
    await repo.nodes.deleteNodeById(parentId);
  });

  describe('when logged out', () => {
    let file6SharedLink: string;
    let initialTotalItems: number;

    beforeAll(async () => {
      file6Id = (await repo.nodes.createFile(file6, parentId)).entry.id;

      initialTotalItems = await repo.shared.getSharedLinksTotalItems();
      const sharedId = (await repo.shared.shareFileById(file6Id)).entry.id;
      file6SharedLink = `${shareLinkPreUrl}${sharedId}`;
      await repo.shared.waitForApi({ expect: initialTotalItems + 1 });
    });

    afterAll(async () => {
      await repo.nodes.deleteNodeById(file6Id);
      await repo.shared.waitForApi({ expect: initialTotalItems });
    });

    it('[C286326] A non-logged user can download the shared file from the viewer', async () => {
      await browser.get(file6SharedLink);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).toEqual(file6);

      await toolbar.downloadButton.click();
      expect(await Utils.fileExistsOnOS(file6)).toBe(true, 'File not found in download location');
    });
  });

  describe('when logged in', () => {
    const expiryDate: any = '2020-12-25T18:30:00.000+0000';

    const loginPage = new LoginPage();
    const shareDialog = new ShareDialog();
    const contextMenu = dataTable.menu;
    const { searchInput } = page.header;

    beforeAll(async () => {
      await loginPage.login(user.email, user.password);
    });

    describe('from Personal Files', () => {
      let initialTotalItems: number;

      beforeAll(async () => {
        file1Id = (await repo.nodes.createFile(file1, parentId)).entry.id;
        file2Id = (await repo.nodes.createFile(file2, parentId)).entry.id;
        file3Id = (await repo.nodes.createFile(file3, parentId)).entry.id;
        file4Id = (await repo.nodes.createFile(file4, parentId)).entry.id;
        file5Id = (await repo.nodes.createFile(file5, parentId)).entry.id;
        file6Id = (await repo.nodes.createFile(file6, parentId)).entry.id;
        file7Id = (await repo.nodes.createFile(file7, parentId)).entry.id;
        file8Id = (await repo.nodes.createFile(file8, parentId)).entry.id;
        file9Id = (await repo.nodes.createFile(file9, parentId)).entry.id;

        initialTotalItems = await repo.shared.getSharedLinksTotalItems();
        await coreActions.shareNodes([file6Id, file7Id], expiryDate);
        await repo.shared.waitForApi({ expect: initialTotalItems + 2 });
      });

      beforeEach(async () => {
        await page.clickPersonalFilesAndWait();
        await dataTable.doubleClickOnRowByName(parent);
        await dataTable.waitForHeader();
      });

      afterEach(async () => {
        await Utils.pressEscape();
      });

      afterAll(async () => {
        await repo.nodes.deleteNodeById(file1Id);
        await repo.nodes.deleteNodeById(file2Id);
        await repo.nodes.deleteNodeById(file3Id);
        await repo.nodes.deleteNodeById(file4Id);
        await repo.nodes.deleteNodeById(file5Id);
        await repo.nodes.deleteNodeById(file6Id);
        await repo.nodes.deleteNodeById(file7Id);
        await repo.nodes.deleteNodeById(file8Id);
        await repo.nodes.deleteNodeById(file9Id);
        await repo.shared.waitForApi({ expect: initialTotalItems });
      });

      it('[C286327] Share dialog default values', async () => {
        await dataTable.selectItem(file1);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.getTitle()).toEqual(`Share ${file1}`);
        expect(await shareDialog.getInfoText()).toEqual('Click the link below to copy it to the clipboard.');
        expect(await shareDialog.labels.get(0).getText()).toEqual('Link to share');
        expect(await shareDialog.getLinkUrl()).toContain(shareLinkPreUrl);
        expect(await shareDialog.isUrlReadOnly()).toBe(true, 'url is not readonly');
        expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
        expect(await shareDialog.labels.get(1).getText()).toEqual('Expires on');
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expire toggle is checked');
        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
      });

      it('[C286328] Close dialog', async () => {
        await dataTable.selectItem(file2);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
        await shareDialog.clickClose();
        expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog is open');
      });

      it('[C286329] Share a file', async () => {
        await dataTable.selectItem(file3);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await Utils.pressEscape();
        const sharedId = await repo.nodes.getSharedId(file3Id);
        expect(await repo.nodes.isFileShared(file3Id)).toBe(true, `${file3} is not shared`);
        expect(url).toContain(sharedId);
      });

      it('[C286330] Copy shared file URL', async () => {
        await dataTable.selectItem(file4);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();
        const url = await shareDialog.getLinkUrl();
        expect(url).toContain(shareLinkPreUrl);

        await shareDialog.urlAction.click();
        expect(await page.getSnackBarMessage()).toBe('Link copied to the clipboard');

        await browser.get(url);
        expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
        expect(await viewer.getFileTitle()).toEqual(file4);

        await page.load();
      });

      it('[C286332] Share a file with expiration date', async () => {
        await dataTable.selectItem(file5);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        await shareDialog.expireToggle.click();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expire toggle not checked');
        await shareDialog.datetimePickerButton.click();
        expect(await shareDialog.dateTimePicker.isCalendarOpen()).toBe(true, 'Calendar not opened');
        const date = await shareDialog.dateTimePicker.setDefaultDay();
        await shareDialog.dateTimePicker.waitForDateTimePickerToClose();

        const setDate = `${date}`.replace(',', '');
        const inputDate = await shareDialog.getExpireDate();

        expect(new Date(inputDate)).toEqual(new Date(setDate));

        const expireDateProperty = await repo.nodes.getSharedExpiryDate(file5Id);

        expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
      });

      it('[C286337] Expire date is displayed correctly', async () => {
        await dataTable.selectItem(file6);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();

        const expireProperty = await repo.nodes.getSharedExpiryDate(file6Id);
        expect(expireProperty).toEqual(expiryDate);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(Utils.formatDate(await shareDialog.getExpireDate())).toEqual(Utils.formatDate(expiryDate));
      });

      it('[C286333] Disable the share link expiration', async () => {
        await dataTable.selectItem(file7);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(await shareDialog.getExpireDate()).not.toBe('', 'Expire date input is empty');

        await shareDialog.expireToggle.click();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expiration is checked');
        expect(await shareDialog.getExpireDate()).toBe('', 'Expire date input is not empty');

        await shareDialog.clickClose();
        expect(await repo.nodes.getSharedExpiryDate(file7Id)).toBe('', `${file7} link still has expiration`);
      });

      it('[C286335] Shared file URL is not changed when Share dialog is closed and opened again', async () => {
        await dataTable.selectItem(file8);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();
        const url1 = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();
        await shareDialog.waitForDialogToClose();

        await page.dataTable.clearSelection();
        await dataTable.selectItem(file8);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();
        const url2 = await shareDialog.getLinkUrl();

        expect(url1).toEqual(url2);
      });

      it('[C286345] Share a file from the context menu', async () => {
        await dataTable.rightClickOnItem(file9);
        await contextMenu.waitForMenuToOpen();
        await contextMenu.shareAction.click();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await Utils.pressEscape();
        const sharedId = await repo.nodes.getSharedId(file9Id);
        expect(await repo.nodes.isFileShared(file9Id)).toBe(true, `${file9} is not shared`);
        expect(url).toContain(sharedId);
      });
    });

    describe('from File Libraries', () => {
      const siteName = `site-${Utils.random()}`;
      const parentInSite = `parent-site-${Utils.random()}`;
      let parentInSiteId: string;
      let initialTotalItems: number;

      beforeAll(async () => {
        await repo.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
        const docLibId = await repo.sites.getDocLibId(siteName);
        parentInSiteId = (await repo.nodes.createFolder(parentInSite, docLibId)).entry.id;

        await repo.nodes.createFile(file1, parentInSiteId);
        await repo.nodes.createFile(file2, parentInSiteId);
        file3Id = (await repo.nodes.createFile(file3, parentInSiteId)).entry.id;
        await repo.nodes.createFile(file4, parentInSiteId);
        file5Id = (await repo.nodes.createFile(file5, parentInSiteId)).entry.id;
        file6Id = (await repo.nodes.createFile(file6, parentInSiteId)).entry.id;
        file7Id = (await repo.nodes.createFile(file7, parentInSiteId)).entry.id;
        await repo.nodes.createFile(file8, parentInSiteId);
        file9Id = (await repo.nodes.createFile(file9, parentInSiteId)).entry.id;

        initialTotalItems = await repo.shared.getSharedLinksTotalItems();
        await coreActions.shareNodes([file6Id, file7Id], expiryDate);
        await repo.shared.waitForApi({ expect: initialTotalItems + 2 });
      });

      beforeEach(async () => {
        await page.goToMyLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();
        await dataTable.doubleClickOnRowByName(parentInSite);
        await dataTable.waitForHeader();
      });

      afterEach(async () => {
        await Utils.pressEscape();
        await page.clickPersonalFilesAndWait();
      });

      afterAll(async () => {
        await adminActions.sites.deleteSite(siteName);
        await repo.shared.waitForApi({ expect: initialTotalItems });
      });

      it('[C286639] Share dialog default values', async () => {
        await dataTable.selectItem(file1);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.getTitle()).toEqual(`Share ${file1}`);
        expect(await shareDialog.getInfoText()).toEqual('Click the link below to copy it to the clipboard.');
        expect(await shareDialog.labels.get(0).getText()).toEqual('Link to share');
        expect(await shareDialog.getLinkUrl()).toContain(shareLinkPreUrl);
        expect(await shareDialog.isUrlReadOnly()).toBe(true, 'url is not readonly');
        expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
        expect(await shareDialog.labels.get(1).getText()).toEqual('Expires on');
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expire toggle is checked');
        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
      });

      it('[C286640] Close dialog', async () => {
        await dataTable.selectItem(file2);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
        await shareDialog.clickClose();
        expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog is open');
      });

      it('[C286641] Share a file', async () => {
        await dataTable.selectItem(file3);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await Utils.pressEscape();
        const sharedId = await repo.nodes.getSharedId(file3Id);
        expect(await repo.nodes.isFileShared(file3Id)).toBe(true, `${file3} is not shared`);
        expect(url).toContain(sharedId);
      });

      it('[C286642] Copy shared file URL', async () => {
        await dataTable.selectItem(file4);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();
        const url = await shareDialog.getLinkUrl();
        expect(url).toContain(shareLinkPreUrl);

        await shareDialog.urlAction.click();
        expect(await page.getSnackBarMessage()).toBe('Link copied to the clipboard');

        await browser.get(url);
        expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
        expect(await viewer.getFileTitle()).toEqual(file4);

        await page.load();
      });

      it('[C286643] Share a file with expiration date', async () => {
        await dataTable.selectItem(file5);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        await shareDialog.expireToggle.click();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expire toggle not checked');
        await shareDialog.datetimePickerButton.click();
        expect(await shareDialog.dateTimePicker.isCalendarOpen()).toBe(true, 'Calendar not opened');
        const date = await shareDialog.dateTimePicker.setDefaultDay();
        await shareDialog.dateTimePicker.waitForDateTimePickerToClose();

        const setDate = `${date}`.replace(',', '');
        const inputDate = await shareDialog.getExpireDate();

        expect(new Date(inputDate)).toEqual(new Date(setDate));

        const expireDateProperty = await repo.nodes.getSharedExpiryDate(file5Id);

        expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
      });

      it('[C286644] Expire date is displayed correctly', async () => {
        await dataTable.selectItem(file6);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();

        const expireProperty = await repo.nodes.getSharedExpiryDate(file6Id);
        expect(expireProperty).toEqual(expiryDate);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(Utils.formatDate(await shareDialog.getExpireDate())).toEqual(Utils.formatDate(expiryDate));
      });

      it('[C286645] Disable the share link expiration', async () => {
        await dataTable.selectItem(file7);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(await shareDialog.getExpireDate()).not.toBe('', 'Expire date input is empty');

        await shareDialog.expireToggle.click();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expiration is checked');
        expect(await shareDialog.getExpireDate()).toBe('', 'Expire date input is not empty');

        await shareDialog.clickClose();
        expect(await repo.nodes.getSharedExpiryDate(file7Id)).toBe('', `${file7} link still has expiration`);
      });

      it('[C286646] Shared file URL is not changed when Share dialog is closed and opened again', async () => {
        await dataTable.selectItem(file8);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();
        const url1 = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();
        await shareDialog.waitForDialogToClose();

        await page.dataTable.clearSelection();
        await dataTable.selectItem(file8);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();
        const url2 = await shareDialog.getLinkUrl();

        expect(url1).toEqual(url2);
      });

      it('[C286647] Share a file from the context menu', async () => {
        await dataTable.rightClickOnItem(file9);
        await contextMenu.waitForMenuToOpen();
        await contextMenu.shareAction.click();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await Utils.pressEscape();
        const sharedId = await repo.nodes.getSharedId(file9Id);
        expect(await repo.nodes.isFileShared(file9Id)).toBe(true, `${file9} is not shared`);
        expect(url).toContain(sharedId);
      });
    });

    describe('from Recent Files', () => {
      let initialTotalItems: number;

      beforeAll(async () => {
        file1Id = (await repo.nodes.createFile(file1, parentId)).entry.id;
        file2Id = (await repo.nodes.createFile(file2, parentId)).entry.id;
        file3Id = (await repo.nodes.createFile(file3, parentId)).entry.id;
        file4Id = (await repo.nodes.createFile(file4, parentId)).entry.id;
        file5Id = (await repo.nodes.createFile(file5, parentId)).entry.id;
        file6Id = (await repo.nodes.createFile(file6, parentId)).entry.id;
        file7Id = (await repo.nodes.createFile(file7, parentId)).entry.id;
        file8Id = (await repo.nodes.createFile(file8, parentId)).entry.id;
        file9Id = (await repo.nodes.createFile(file9, parentId)).entry.id;

        initialTotalItems = await repo.shared.getSharedLinksTotalItems();
        await coreActions.shareNodes([file6Id, file7Id], expiryDate);
        await repo.shared.waitForApi({ expect: initialTotalItems + 2 });
      });

      beforeEach(async () => {
        await page.clickRecentFilesAndWait();
      });

      afterEach(async () => {
        await Utils.pressEscape();
        await page.clickPersonalFilesAndWait();
      });

      afterAll(async () => {
        await repo.nodes.deleteNodeById(file1Id);
        await repo.nodes.deleteNodeById(file2Id);
        await repo.nodes.deleteNodeById(file3Id);
        await repo.nodes.deleteNodeById(file4Id);
        await repo.nodes.deleteNodeById(file5Id);
        await repo.nodes.deleteNodeById(file6Id);
        await repo.nodes.deleteNodeById(file7Id);
        await repo.nodes.deleteNodeById(file8Id);
        await repo.nodes.deleteNodeById(file9Id);
        await repo.shared.waitForApi({ expect: initialTotalItems });
      });

      it('[C286657] Share dialog default values', async () => {
        await dataTable.selectItem(file1);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.getTitle()).toEqual(`Share ${file1}`);
        expect(await shareDialog.getInfoText()).toEqual('Click the link below to copy it to the clipboard.');
        expect(await shareDialog.labels.get(0).getText()).toEqual('Link to share');
        expect(await shareDialog.getLinkUrl()).toContain(shareLinkPreUrl);
        expect(await shareDialog.isUrlReadOnly()).toBe(true, 'url is not readonly');
        expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
        expect(await shareDialog.labels.get(1).getText()).toEqual('Expires on');
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expire toggle is checked');
        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
      });

      it('[C286658] Close dialog', async () => {
        await dataTable.selectItem(file2);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
        await shareDialog.clickClose();
        expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog is open');
      });

      it('[C286659] Share a file', async () => {
        await dataTable.selectItem(file3);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await Utils.pressEscape();
        const sharedId = await repo.nodes.getSharedId(file3Id);
        expect(await repo.nodes.isFileShared(file3Id)).toBe(true, `${file3} is not shared`);
        expect(url).toContain(sharedId);
      });

      it('[C286660] Copy shared file URL', async () => {
        await dataTable.selectItem(file4);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();
        const url = await shareDialog.getLinkUrl();
        expect(url).toContain(shareLinkPreUrl);

        await shareDialog.urlAction.click();
        expect(await page.getSnackBarMessage()).toBe('Link copied to the clipboard');

        await browser.get(url);
        expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
        expect(await viewer.getFileTitle()).toEqual(file4);

        await page.load();
      });

      it('[C286661] Share a file with expiration date', async () => {
        await dataTable.selectItem(file5);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        await shareDialog.expireToggle.click();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expire toggle not checked');
        await shareDialog.datetimePickerButton.click();
        expect(await shareDialog.dateTimePicker.isCalendarOpen()).toBe(true, 'Calendar not opened');
        const date = await shareDialog.dateTimePicker.setDefaultDay();
        await shareDialog.dateTimePicker.waitForDateTimePickerToClose();

        const setDate = `${date}`.replace(',', '');
        const inputDate = await shareDialog.getExpireDate();

        expect(new Date(inputDate)).toEqual(new Date(setDate));

        const expireDateProperty = await repo.nodes.getSharedExpiryDate(file5Id);

        expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
      });

      it('[C286662] Expire date is displayed correctly', async () => {
        await dataTable.selectItem(file6);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();

        const expireProperty = await repo.nodes.getSharedExpiryDate(file6Id);
        expect(expireProperty).toEqual(expiryDate);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(Utils.formatDate(await shareDialog.getExpireDate())).toEqual(Utils.formatDate(expiryDate));
      });

      it('[C286663] Disable the share link expiration', async () => {
        await dataTable.selectItem(file7);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(await shareDialog.getExpireDate()).not.toBe('', 'Expire date input is empty');

        await shareDialog.expireToggle.click();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expiration is checked');
        expect(await shareDialog.getExpireDate()).toBe('', 'Expire date input is not empty');

        await shareDialog.clickClose();
        expect(await repo.nodes.getSharedExpiryDate(file7Id)).toBe('', `${file7} link still has expiration`);
      });

      it('[C286664] Shared file URL is not changed when Share dialog is closed and opened again', async () => {
        await dataTable.selectItem(file8);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();
        const url1 = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();
        await shareDialog.waitForDialogToClose();

        await page.dataTable.clearSelection();
        await dataTable.selectItem(file8);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();
        const url2 = await shareDialog.getLinkUrl();

        expect(url1).toEqual(url2);
      });

      it('[C286665] Share a file from the context menu', async () => {
        await dataTable.rightClickOnItem(file9);
        await contextMenu.waitForMenuToOpen();
        await contextMenu.shareAction.click();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await Utils.pressEscape();
        const sharedId = await repo.nodes.getSharedId(file9Id);
        expect(await repo.nodes.isFileShared(file9Id)).toBe(true, `${file9} is not shared`);
        expect(url).toContain(sharedId);
      });
    });

    describe('from Shared Files', () => {
      let initialTotalItems: number;

      beforeAll(async () => {
        file1Id = (await repo.nodes.createFile(file1, parentId)).entry.id;
        file2Id = (await repo.nodes.createFile(file2, parentId)).entry.id;
        file3Id = (await repo.nodes.createFile(file3, parentId)).entry.id;
        file4Id = (await repo.nodes.createFile(file4, parentId)).entry.id;
        file5Id = (await repo.nodes.createFile(file5, parentId)).entry.id;
        file6Id = (await repo.nodes.createFile(file6, parentId)).entry.id;
        file7Id = (await repo.nodes.createFile(file7, parentId)).entry.id;

        initialTotalItems = await repo.shared.getSharedLinksTotalItems();
        await coreActions.shareNodes([file1Id, file2Id, file3Id]);
        await coreActions.shareNodes([file4Id, file5Id], expiryDate);
        await coreActions.shareNodes([file6Id, file7Id]);
        await repo.shared.waitForApi({ expect: initialTotalItems + 7 });
      });

      beforeEach(async () => {
        await page.clickSharedFilesAndWait();
      });

      afterEach(async () => {
        await Utils.pressEscape();
        await page.clickPersonalFilesAndWait();
      });

      afterAll(async () => {
        await repo.nodes.deleteNodeById(file1Id);
        await repo.nodes.deleteNodeById(file2Id);
        await repo.nodes.deleteNodeById(file3Id);
        await repo.nodes.deleteNodeById(file4Id);
        await repo.nodes.deleteNodeById(file5Id);
        await repo.nodes.deleteNodeById(file6Id);
        await repo.nodes.deleteNodeById(file7Id);
        await repo.shared.waitForApi({ expect: initialTotalItems });
      });

      it('[C286648] Share dialog default values', async () => {
        await dataTable.selectItem(file1);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.getTitle()).toEqual(`Share ${file1}`);
        expect(await shareDialog.getInfoText()).toEqual('Click the link below to copy it to the clipboard.');
        expect(await shareDialog.labels.get(0).getText()).toEqual('Link to share');
        expect(await shareDialog.getLinkUrl()).toContain(shareLinkPreUrl);
        expect(await shareDialog.isUrlReadOnly()).toBe(true, 'url is not readonly');
        expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
        expect(await shareDialog.labels.get(1).getText()).toEqual('Expires on');
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expire toggle is checked');
        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
      });

      it('[C286649] Close dialog', async () => {
        await dataTable.selectItem(file2);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
        await shareDialog.clickClose();
        expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog is open');
      });

      it('[C286651] Copy shared file URL', async () => {
        await dataTable.selectItem(file3);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();
        const url = await shareDialog.getLinkUrl();
        expect(url).toContain(shareLinkPreUrl);

        await shareDialog.urlAction.click();
        expect(await page.getSnackBarMessage()).toBe('Link copied to the clipboard');

        await browser.get(url);
        expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
        expect(await viewer.getFileTitle()).toEqual(file3);

        await page.load();
      });

      it('[C286653] Expire date is displayed correctly', async () => {
        await dataTable.selectItem(file4);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();

        const expireProperty = await repo.nodes.getSharedExpiryDate(file4Id);
        expect(expireProperty).toEqual(expiryDate);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(Utils.formatDate(await shareDialog.getExpireDate())).toEqual(Utils.formatDate(expiryDate));
      });

      it('[C286654] Disable the share link expiration', async () => {
        await dataTable.selectItem(file5);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(await shareDialog.getExpireDate()).not.toBe('', 'Expire date input is empty');

        await shareDialog.expireToggle.click();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expiration is checked');
        expect(await shareDialog.getExpireDate()).toBe('', 'Expire date input is not empty');

        await shareDialog.clickClose();
        expect(await repo.nodes.getSharedExpiryDate(file5Id)).toBe('', `${file5} link still has expiration`);
      });

      it('[C286655] Shared file URL is not changed when Share dialog is closed and opened again', async () => {
        await dataTable.selectItem(file6);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();
        const url1 = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();
        await shareDialog.waitForDialogToClose();

        await page.dataTable.clearSelection();
        await dataTable.selectItem(file6);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();
        const url2 = await shareDialog.getLinkUrl();

        expect(url1).toEqual(url2);
      });

      it('[C286656] Open Share dialog from context menu', async () => {
        await dataTable.rightClickOnItem(file7);
        await contextMenu.waitForMenuToOpen();
        await contextMenu.shareEditAction.click();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.getTitle()).toEqual(`Share ${file7}`);
        expect(await shareDialog.getInfoText()).toEqual('Click the link below to copy it to the clipboard.');
        expect(await shareDialog.labels.get(0).getText()).toEqual('Link to share');
        expect(await shareDialog.getLinkUrl()).toContain(shareLinkPreUrl);
        expect(await shareDialog.isUrlReadOnly()).toBe(true, 'url is not readonly');
        expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
        expect(await shareDialog.labels.get(1).getText()).toEqual('Expires on');
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expire toggle is checked');
        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
      });
    });

    describe('from Favorites', () => {
      let initialTotalItems: number;

      beforeAll(async () => {
        file1Id = (await repo.nodes.createFile(file1, parentId)).entry.id;
        file2Id = (await repo.nodes.createFile(file2, parentId)).entry.id;
        file3Id = (await repo.nodes.createFile(file3, parentId)).entry.id;
        file4Id = (await repo.nodes.createFile(file4, parentId)).entry.id;
        file5Id = (await repo.nodes.createFile(file5, parentId)).entry.id;
        file6Id = (await repo.nodes.createFile(file6, parentId)).entry.id;
        file7Id = (await repo.nodes.createFile(file7, parentId)).entry.id;
        file8Id = (await repo.nodes.createFile(file8, parentId)).entry.id;
        file9Id = (await repo.nodes.createFile(file9, parentId)).entry.id;

        initialTotalItems = await repo.shared.getSharedLinksTotalItems();
        await repo.favorites.addFavoriteById('file', file1Id);
        await repo.favorites.addFavoriteById('file', file2Id);
        await repo.favorites.addFavoriteById('file', file3Id);
        await repo.favorites.addFavoriteById('file', file4Id);
        await repo.favorites.addFavoriteById('file', file5Id);
        await repo.favorites.addFavoriteById('file', file6Id);
        await repo.favorites.addFavoriteById('file', file7Id);
        await repo.favorites.addFavoriteById('file', file8Id);
        await repo.favorites.addFavoriteById('file', file9Id);

        await coreActions.shareNodes([file6Id, file7Id], expiryDate);
        await repo.favorites.waitForApi({ expect: 9 });
        await repo.shared.waitForApi({ expect: initialTotalItems + 2 });
      });

      beforeEach(async () => {
        await page.clickFavoritesAndWait();
      });

      afterEach(async () => {
        await Utils.pressEscape();
        await page.clickPersonalFilesAndWait();
      });

      afterAll(async () => {
        await repo.nodes.deleteNodeById(file1Id);
        await repo.nodes.deleteNodeById(file2Id);
        await repo.nodes.deleteNodeById(file3Id);
        await repo.nodes.deleteNodeById(file4Id);
        await repo.nodes.deleteNodeById(file5Id);
        await repo.nodes.deleteNodeById(file6Id);
        await repo.nodes.deleteNodeById(file7Id);
        await repo.nodes.deleteNodeById(file8Id);
        await repo.nodes.deleteNodeById(file9Id);
        await repo.shared.waitForApi({ expect: initialTotalItems });
      });

      it('[C286666] Share dialog default values', async () => {
        await dataTable.selectItem(file1);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.getTitle()).toEqual(`Share ${file1}`);
        expect(await shareDialog.getInfoText()).toEqual('Click the link below to copy it to the clipboard.');
        expect(await shareDialog.labels.get(0).getText()).toEqual('Link to share');
        expect(await shareDialog.getLinkUrl()).toContain(shareLinkPreUrl);
        expect(await shareDialog.isUrlReadOnly()).toBe(true, 'url is not readonly');
        expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
        expect(await shareDialog.labels.get(1).getText()).toEqual('Expires on');
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expire toggle is checked');
        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
      });

      it('[C286667] Close dialog', async () => {
        await dataTable.selectItem(file2);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
        await shareDialog.clickClose();
        expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog is open');
      });

      it('[C286668] Share a file', async () => {
        await dataTable.selectItem(file3);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await Utils.pressEscape();
        const sharedId = await repo.nodes.getSharedId(file3Id);
        expect(await repo.nodes.isFileShared(file3Id)).toBe(true, `${file3} is not shared`);
        expect(url).toContain(sharedId);
      });

      it('[C286669] Copy shared file URL', async () => {
        await dataTable.selectItem(file4);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();
        const url = await shareDialog.getLinkUrl();
        expect(url).toContain(shareLinkPreUrl);

        await shareDialog.urlAction.click();
        expect(await page.getSnackBarMessage()).toBe('Link copied to the clipboard');

        await browser.get(url);
        expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
        expect(await viewer.getFileTitle()).toEqual(file4);

        await page.load();
      });

      it('[C286670] Share a file with expiration date', async () => {
        await dataTable.selectItem(file5);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        await shareDialog.expireToggle.click();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expire toggle not checked');
        await shareDialog.datetimePickerButton.click();
        expect(await shareDialog.dateTimePicker.isCalendarOpen()).toBe(true, 'Calendar not opened');
        const date = await shareDialog.dateTimePicker.setDefaultDay();
        await shareDialog.dateTimePicker.waitForDateTimePickerToClose();

        const setDate = `${date}`.replace(',', '');
        const inputDate = await shareDialog.getExpireDate();

        expect(new Date(inputDate)).toEqual(new Date(setDate));

        const expireDateProperty = await repo.nodes.getSharedExpiryDate(file5Id);

        expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
      });

      it('[C286671] Expire date is displayed correctly', async () => {
        await dataTable.selectItem(file6);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();

        const expireProperty = await repo.nodes.getSharedExpiryDate(file6Id);
        expect(expireProperty).toEqual(expiryDate);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(Utils.formatDate(await shareDialog.getExpireDate())).toEqual(Utils.formatDate(expiryDate));
      });

      it('[C286672] Disable the share link expiration', async () => {
        await dataTable.selectItem(file7);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(await shareDialog.getExpireDate()).not.toBe('', 'Expire date input is empty');

        await shareDialog.expireToggle.click();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expiration is checked');
        expect(await shareDialog.getExpireDate()).toBe('', 'Expire date input is not empty');

        await shareDialog.clickClose();
        expect(await repo.nodes.getSharedExpiryDate(file7Id)).toBe('', `${file7} link still has expiration`);
      });

      it('[C286673] Shared file URL is not changed when Share dialog is closed and opened again', async () => {
        await dataTable.selectItem(file8);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();
        const url1 = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();
        await shareDialog.waitForDialogToClose();

        await page.dataTable.clearSelection();
        await dataTable.selectItem(file8);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();
        const url2 = await shareDialog.getLinkUrl();

        expect(url1).toEqual(url2);
      });

      it('[C286674] Share a file from the context menu', async () => {
        await dataTable.rightClickOnItem(file9);
        await contextMenu.waitForMenuToOpen();
        await contextMenu.shareAction.click();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await Utils.pressEscape();
        const sharedId = await repo.nodes.getSharedId(file9Id);
        expect(await repo.nodes.isFileShared(file9Id)).toBe(true, `${file9} is not shared`);
        expect(url).toContain(sharedId);
      });
    });

    describe('from Search Results', () => {
      file3 = `search-file3-${Utils.random()}.txt`;
      file5 = `search-file5-${Utils.random()}.txt`;
      file6 = `search-file6-${Utils.random()}.txt`;
      file7 = `search-file7-${Utils.random()}.txt`;
      file9 = `search-file9-${Utils.random()}.txt`;

      let initialTotalItems: number;

      beforeAll(async () => {
        const initialSearchByTermTotalItems = await repo.search.getSearchByTermTotalItems('search-f');
        file3Id = (await repo.nodes.createFile(file3, parentId)).entry.id;
        file5Id = (await repo.nodes.createFile(file5, parentId)).entry.id;
        file6Id = (await repo.nodes.createFile(file6, parentId)).entry.id;
        file7Id = (await repo.nodes.createFile(file7, parentId)).entry.id;
        file9Id = (await repo.nodes.createFile(file9, parentId)).entry.id;
        await repo.search.waitForNodes('search-f', { expect: initialSearchByTermTotalItems + 5 });

        initialTotalItems = await repo.shared.getSharedLinksTotalItems();
        await coreActions.shareNodes([file6Id, file7Id], expiryDate);
        await repo.shared.waitForApi({ expect: initialTotalItems + 2 });
      });

      beforeEach(async () => {
        await searchInput.clickSearchButton();
        await searchInput.checkFilesAndFolders();
        await searchInput.searchFor('search-f');
        await dataTable.waitForBody();
      });

      afterEach(async () => {
        await Utils.pressEscape();
        await page.clickPersonalFilesAndWait();
      });

      afterAll(async () => {
        await repo.nodes.deleteNodeById(file3Id);
        await repo.nodes.deleteNodeById(file5Id);
        await repo.nodes.deleteNodeById(file6Id);
        await repo.nodes.deleteNodeById(file7Id);
        await repo.nodes.deleteNodeById(file9Id);
        await repo.shared.waitForApi({ expect: initialTotalItems });
      });

      it('[C306975] Share a file', async () => {
        await dataTable.selectItem(file3);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await Utils.pressEscape();
        const sharedId = await repo.nodes.getSharedId(file3Id);
        expect(await repo.nodes.isFileShared(file3Id)).toBe(true, `${file3} is not shared`);
        expect(url).toContain(sharedId);
      });

      it('[C306977] Share a file with expiration date', async () => {
        await dataTable.selectItem(file5);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        await shareDialog.expireToggle.click();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expire toggle not checked');
        await shareDialog.datetimePickerButton.click();
        expect(await shareDialog.dateTimePicker.isCalendarOpen()).toBe(true, 'Calendar not opened');
        const date = await shareDialog.dateTimePicker.setDefaultDay();
        await shareDialog.dateTimePicker.waitForDateTimePickerToClose();

        const setDate = `${date}`.replace(',', '');
        const inputDate = await shareDialog.getExpireDate();

        expect(new Date(inputDate)).toEqual(new Date(setDate));

        const expireDateProperty = await repo.nodes.getSharedExpiryDate(file5Id);

        expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
      });

      it('[C306978] Expire date is displayed correctly', async () => {
        await dataTable.selectItem(file6);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();

        const expireProperty = await repo.nodes.getSharedExpiryDate(file6Id);
        expect(expireProperty).toEqual(expiryDate);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(Utils.formatDate(await shareDialog.getExpireDate())).toEqual(Utils.formatDate(expiryDate));
      });

      it('[C306979] Disable the share link expiration', async () => {
        await dataTable.selectItem(file7);
        await toolbar.shareEditButton.click();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(await shareDialog.getExpireDate()).not.toBe('', 'Expire date input is empty');

        await shareDialog.expireToggle.click();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expiration is checked');
        expect(await shareDialog.getExpireDate()).toBe('', 'Expire date input is not empty');

        await shareDialog.clickClose();
        expect(await repo.nodes.getSharedExpiryDate(file7Id)).toBe('', `${file7} link still has expiration`);
      });

      it('[C306981] Share a file from the context menu', async () => {
        await dataTable.rightClickOnItem(file9);
        await contextMenu.waitForMenuToOpen();
        await contextMenu.shareAction.click();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await Utils.pressEscape();
        const sharedId = await repo.nodes.getSharedId(file9Id);
        expect(await repo.nodes.isFileShared(file9Id)).toBe(true, `${file9} is not shared`);
        expect(url).toContain(sharedId);
      });
    });
  });
});
