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
  AdminActions,
  UserActions,
  LoginPage,
  BrowsingPage,
  SITE_VISIBILITY,
  RepoClient,
  ShareDialog,
  Viewer,
  Utils
} from '@alfresco/aca-testing-shared';
import { BrowserActions, Logger } from '@alfresco/adf-testing';

describe('Share a file', () => {
  const username = `user-${Utils.random()}`;
  const parent = `parent-${Utils.random()}`;
  let parentId: string;

  const file1 = `file1-${Utils.random()}.txt`;
  const file2 = `file2-${Utils.random()}.txt`;
  const file3 = `file3-${Utils.random()}.txt`;
  const file4 = `file4-${Utils.random()}.txt`;
  const file5 = `file5-${Utils.random()}.txt`;
  const file6 = `file6-${Utils.random()}.txt`;
  const file7 = `file7-${Utils.random()}.txt`;
  const file8 = `file8-${Utils.random()}.txt`;
  const file9 = `file9-${Utils.random()}.txt`;

  const viewer = new Viewer();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const shareLinkPreUrl = `/#/preview/s/`;

  const apis = {
    user: new RepoClient(username, username)
  };

  const adminApiActions = new AdminActions();
  const userActions = new UserActions();

  beforeAll(async () => {
    await adminApiActions.createUser({ username });

    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
  });

  afterAll(async () => {
    await apis.user.nodes.deleteNodeById(parentId);
  });

  describe('when logged out', () => {
    let file6SharedLink: string;
    let file6Id: string;

    beforeAll(async () => {
      file6Id = (await apis.user.nodes.createFile(file6, parentId)).entry.id;

      const sharedId = (await apis.user.shared.shareFileById(file6Id)).entry.id;
      file6SharedLink = `${shareLinkPreUrl}${sharedId}`;
      await apis.user.shared.waitForFilesToBeShared([file6Id]);
    });

    afterAll(async () => {
      await apis.user.nodes.deleteNodeById(file6Id);
    });

    it('[C286326] A non-logged user can download the shared file from the viewer', async () => {
      await browser.get(file6SharedLink);
      await viewer.waitForTxtViewerToLoad();

      expect(await viewer.getFileTitle()).toEqual(file6);

      await BrowserActions.click(viewer.toolbar.downloadButton);
      expect(await Utils.fileExistsOnOS(file6)).toBe(true, 'File not found in download location');
    });
  });

  describe('when logged in', () => {
    const expiryDate: any = '2022-12-25T18:30:00.000+0000';

    const loginPage = new LoginPage();
    const shareDialog = new ShareDialog();
    const contextMenu = dataTable.menu;
    const { searchInput } = page.header;

    beforeAll(async () => {
      await loginPage.loginWith(username);
    });

    describe('from Personal Files', () => {
      let file1Id: string;
      let file2Id: string;
      let file3Id: string;
      let file4Id: string;
      let file5Id: string;
      let file6Id: string;
      let file7Id: string;
      let file8Id: string;
      let file9Id: string;

      beforeAll(async () => {
        file1Id = (await apis.user.nodes.createFile(file1, parentId)).entry.id;
        file2Id = (await apis.user.nodes.createFile(file2, parentId)).entry.id;
        file3Id = (await apis.user.nodes.createFile(file3, parentId)).entry.id;
        file4Id = (await apis.user.nodes.createFile(file4, parentId)).entry.id;
        file5Id = (await apis.user.nodes.createFile(file5, parentId)).entry.id;
        file6Id = (await apis.user.nodes.createFile(file6, parentId)).entry.id;
        file7Id = (await apis.user.nodes.createFile(file7, parentId)).entry.id;
        file8Id = (await apis.user.nodes.createFile(file8, parentId)).entry.id;
        file9Id = (await apis.user.nodes.createFile(file9, parentId)).entry.id;

        await userActions.login(username, username);
        await userActions.shareNodes([file6Id, file7Id], expiryDate);
        await apis.user.shared.waitForFilesToBeShared([file6Id, file7Id]);
      });

      beforeEach(async () => {
        await page.clickPersonalFilesAndWait();
        await dataTable.doubleClickOnRowByName(parent);
        await dataTable.waitForHeader();
      });

      afterEach(async () => {
        await Utils.pressEscape();
        await page.closeOpenDialogs();
      });

      afterAll(async () => {
        await apis.user.nodes.deleteNodesById([file1Id, file2Id, file3Id, file4Id, file5Id, file6Id, file7Id, file8Id, file9Id]);
      });

      it('[C286327] Share dialog default values', async () => {
        await dataTable.selectItem(file1);
        await toolbar.shareButton.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file1Id]);

        expect(await shareDialog.getDialogTitle()).toEqual(`Share ${file1}`);
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
        await apis.user.shared.waitForFilesToBeShared([file2Id]);

        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
        await shareDialog.clickClose();
        expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog is open');
      });

      it('[C286329] Share a file', async () => {
        await dataTable.selectItem(file3);
        await toolbar.shareButton.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file3Id]);

        const url = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();

        const sharedId = await apis.user.nodes.getSharedId(file3Id);
        expect(url).toContain(sharedId);
      });

      it('[C286330] Copy shared file URL', async () => {
        await dataTable.selectItem(file4);
        await toolbar.shareButton.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file4Id]);

        const url = await shareDialog.getLinkUrl();
        expect(url).toContain(shareLinkPreUrl);

        await BrowserActions.click(shareDialog.urlAction);
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
        await apis.user.shared.waitForFilesToBeShared([file5Id]);

        await BrowserActions.click(shareDialog.expireToggle);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expire toggle not checked');

        await BrowserActions.click(shareDialog.datetimePickerButton);
        expect(await shareDialog.dateTimePicker.isCalendarOpen()).toBe(true, 'Calendar not opened');
        const date = await shareDialog.dateTimePicker.setDefaultDay();
        await shareDialog.dateTimePicker.waitForDateTimePickerToClose();

        const setDate = `${date}`.replace(',', '');
        const inputDate = await shareDialog.getExpireDate();

        expect(new Date(inputDate)).toEqual(new Date(setDate));

        const expireDateProperty = await apis.user.nodes.getSharedExpiryDate(file5Id);

        expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
      });

      it('[C286337] Expire date is displayed correctly', async () => {
        await dataTable.selectItem(file6);
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();

        const expireProperty = await apis.user.nodes.getSharedExpiryDate(file6Id);
        expect(expireProperty).toEqual(expiryDate);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(Utils.formatDate(await shareDialog.getExpireDate())).toEqual(Utils.formatDate(expiryDate));
      });

      it('[C286333] Disable the share link expiration', async () => {
        await dataTable.selectItem(file7);
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(await shareDialog.getExpireDate()).not.toBe('', 'Expire date input is empty');

        await BrowserActions.click(shareDialog.expireToggle);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expiration is checked');
        expect(await shareDialog.getExpireDate()).toBe('', 'Expire date input is not empty');

        await shareDialog.clickClose();
        expect(await apis.user.nodes.getSharedExpiryDate(file7Id)).toBe('', `${file7} link still has expiration`);
      });

      it('[C286335] Shared file URL is not changed when Share dialog is closed and opened again', async () => {
        await dataTable.selectItem(file8);
        await toolbar.shareButton.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file8Id]);

        const url1 = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();

        await page.dataTable.clearSelection();
        await dataTable.selectItem(file8);
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();
        const url2 = await shareDialog.getLinkUrl();

        expect(url1).toEqual(url2);
      });

      it('[C286345] Share a file from the context menu', async () => {
        await dataTable.rightClickOnItem(file9);
        await contextMenu.waitForMenuToOpen();
        await contextMenu.shareAction.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file9Id]);

        const url = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();

        const sharedId = await apis.user.nodes.getSharedId(file9Id);
        expect(await apis.user.nodes.isFileShared(file9Id)).toBe(true, `${file9} is not shared`);
        expect(url).toContain(sharedId);
      });
    });

    describe('from File Libraries', () => {
      const siteName = `site-${Utils.random()}`;
      const parentInSite = `parent-site-${Utils.random()}`;
      let parentInSiteId: string;
      let file1Id: string;
      let file2Id: string;
      let file3Id: string;
      let file4Id: string;
      let file5Id: string;
      let file6Id: string;
      let file7Id: string;
      let file8Id: string;
      let file9Id: string;

      beforeAll(async () => {
        await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
        const docLibId = await apis.user.sites.getDocLibId(siteName);
        parentInSiteId = (await apis.user.nodes.createFolder(parentInSite, docLibId)).entry.id;

        file1Id = (await apis.user.nodes.createFile(file1, parentInSiteId)).entry.id;
        file2Id = (await apis.user.nodes.createFile(file2, parentInSiteId)).entry.id;
        file3Id = (await apis.user.nodes.createFile(file3, parentInSiteId)).entry.id;
        file4Id = (await apis.user.nodes.createFile(file4, parentInSiteId)).entry.id;
        file5Id = (await apis.user.nodes.createFile(file5, parentInSiteId)).entry.id;
        file6Id = (await apis.user.nodes.createFile(file6, parentInSiteId)).entry.id;
        file7Id = (await apis.user.nodes.createFile(file7, parentInSiteId)).entry.id;
        file8Id = (await apis.user.nodes.createFile(file8, parentInSiteId)).entry.id;
        file9Id = (await apis.user.nodes.createFile(file9, parentInSiteId)).entry.id;

        await userActions.login(username, username);
        await userActions.shareNodes([file6Id, file7Id], expiryDate);
        await apis.user.shared.waitForFilesToBeShared([file6Id, file7Id]);
      });

      beforeEach(async () => {
        try {
          await page.goToMyLibrariesAndWait();
          await dataTable.doubleClickOnRowByName(siteName);
          await dataTable.waitForHeader();
          await dataTable.doubleClickOnRowByName(parentInSite);
          await dataTable.waitForHeader();
        } catch (error) {
          Logger.error(`----- beforeEach failed : ${error}`);
        }
      });

      afterEach(async () => {
        await Utils.pressEscape();
        await page.closeOpenDialogs();
      });

      afterAll(async () => {
        await adminApiActions.sites.deleteSite(siteName);
      });

      it('[C286639] Share dialog default values', async () => {
        await dataTable.selectItem(file1);
        await toolbar.shareButton.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file1Id]);

        expect(await shareDialog.getDialogTitle()).toEqual(`Share ${file1}`);
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
        await apis.user.shared.waitForFilesToBeShared([file2Id]);

        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
        await shareDialog.clickClose();
        expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog is open');
      });

      it('[C286641] Share a file', async () => {
        await dataTable.selectItem(file3);
        await toolbar.shareButton.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file3Id]);

        const url = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();

        const sharedId = await apis.user.nodes.getSharedId(file3Id);
        expect(await apis.user.nodes.isFileShared(file3Id)).toBe(true, `${file3} is not shared`);
        expect(url).toContain(sharedId);
      });

      it('[C286642] Copy shared file URL', async () => {
        await dataTable.selectItem(file4);
        await toolbar.shareButton.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file4Id]);

        const url = await shareDialog.getLinkUrl();
        expect(url).toContain(shareLinkPreUrl);

        await BrowserActions.click(shareDialog.urlAction);
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
        await apis.user.shared.waitForFilesToBeShared([file5Id]);

        await BrowserActions.click(shareDialog.expireToggle);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expire toggle not checked');
        await BrowserActions.click(shareDialog.datetimePickerButton);
        expect(await shareDialog.dateTimePicker.isCalendarOpen()).toBe(true, 'Calendar not opened');
        const date = await shareDialog.dateTimePicker.setDefaultDay();
        await shareDialog.dateTimePicker.waitForDateTimePickerToClose();

        const setDate = `${date}`.replace(',', '');
        const inputDate = await shareDialog.getExpireDate();

        expect(new Date(inputDate)).toEqual(new Date(setDate));

        const expireDateProperty = await apis.user.nodes.getSharedExpiryDate(file5Id);

        expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
      });

      it('[C286644] Expire date is displayed correctly', async () => {
        await dataTable.selectItem(file6);
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();

        const expireProperty = await apis.user.nodes.getSharedExpiryDate(file6Id);
        expect(expireProperty).toEqual(expiryDate);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(Utils.formatDate(await shareDialog.getExpireDate())).toEqual(Utils.formatDate(expiryDate));
      });

      it('[C286645] Disable the share link expiration', async () => {
        await dataTable.selectItem(file7);
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(await shareDialog.getExpireDate()).not.toBe('', 'Expire date input is empty');

        await BrowserActions.click(shareDialog.expireToggle);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expiration is checked');
        expect(await shareDialog.getExpireDate()).toBe('', 'Expire date input is not empty');

        await shareDialog.clickClose();
        expect(await apis.user.nodes.getSharedExpiryDate(file7Id)).toBe('', `${file7} link still has expiration`);
      });

      it('[C286646] Shared file URL is not changed when Share dialog is closed and opened again', async () => {
        await dataTable.selectItem(file8);
        await toolbar.shareButton.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file8Id]);

        const url1 = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();

        await page.dataTable.clearSelection();
        await dataTable.selectItem(file8);
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();
        const url2 = await shareDialog.getLinkUrl();

        expect(url1).toEqual(url2);
      });

      it('[C286647] Share a file from the context menu', async () => {
        await dataTable.rightClickOnItem(file9);
        await contextMenu.waitForMenuToOpen();
        await contextMenu.shareAction.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file9Id]);

        const url = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();

        const sharedId = await apis.user.nodes.getSharedId(file9Id);
        expect(await apis.user.nodes.isFileShared(file9Id)).toBe(true, `${file9} is not shared`);
        expect(url).toContain(sharedId);
      });
    });

    describe('from Recent Files', () => {
      let file1Id: string;
      let file2Id: string;
      let file3Id: string;
      let file4Id: string;
      let file5Id: string;
      let file6Id: string;
      let file7Id: string;
      let file8Id: string;
      let file9Id: string;

      beforeAll(async () => {
        file1Id = (await apis.user.nodes.createFile(file1, parentId)).entry.id;
        file2Id = (await apis.user.nodes.createFile(file2, parentId)).entry.id;
        file3Id = (await apis.user.nodes.createFile(file3, parentId)).entry.id;
        file4Id = (await apis.user.nodes.createFile(file4, parentId)).entry.id;
        file5Id = (await apis.user.nodes.createFile(file5, parentId)).entry.id;
        file6Id = (await apis.user.nodes.createFile(file6, parentId)).entry.id;
        file7Id = (await apis.user.nodes.createFile(file7, parentId)).entry.id;
        file8Id = (await apis.user.nodes.createFile(file8, parentId)).entry.id;
        file9Id = (await apis.user.nodes.createFile(file9, parentId)).entry.id;

        await userActions.login(username, username);
        await userActions.shareNodes([file6Id, file7Id], expiryDate);
        await apis.user.shared.waitForFilesToBeShared([file6Id, file7Id]);
      });

      beforeEach(async () => {
        await page.clickRecentFilesAndWait();
      });

      afterEach(async () => {
        await page.closeOpenDialogs();
        await Utils.pressEscape();
      });

      afterAll(async () => {
        await apis.user.nodes.deleteNodesById([file1Id, file2Id, file3Id, file4Id, file5Id, file6Id, file7Id, file8Id, file9Id]);
      });

      it('[C286657] Share dialog default values', async () => {
        await dataTable.selectItem(file1, parent);
        await toolbar.shareButton.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file1Id]);

        expect(await shareDialog.getDialogTitle()).toEqual(`Share ${file1}`);
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
        await dataTable.selectItem(file2, parent);
        await toolbar.shareButton.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file2Id]);

        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
        await shareDialog.clickClose();
        expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog is open');
      });

      it('[C286659] Share a file', async () => {
        await dataTable.selectItem(file3, parent);
        await toolbar.shareButton.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file3Id]);

        const url = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();

        const sharedId = await apis.user.nodes.getSharedId(file3Id);
        expect(await apis.user.nodes.isFileShared(file3Id)).toBe(true, `${file3} is not shared`);
        expect(url).toContain(sharedId);
      });

      it('[C286660] Copy shared file URL', async () => {
        await dataTable.selectItem(file4, parent);
        await toolbar.shareButton.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file4Id]);

        const url = await shareDialog.getLinkUrl();
        expect(url).toContain(shareLinkPreUrl);

        await BrowserActions.click(shareDialog.urlAction);
        expect(await page.getSnackBarMessage()).toBe('Link copied to the clipboard');

        await browser.get(url);
        expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
        expect(await viewer.getFileTitle()).toEqual(file4);

        await page.load();
      });

      it('[C286661] Share a file with expiration date', async () => {
        await dataTable.selectItem(file5, parent);
        await toolbar.shareButton.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file5Id]);

        await BrowserActions.click(shareDialog.expireToggle);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expire toggle not checked');
        await BrowserActions.click(shareDialog.datetimePickerButton);
        expect(await shareDialog.dateTimePicker.isCalendarOpen()).toBe(true, 'Calendar not opened');
        const date = await shareDialog.dateTimePicker.setDefaultDay();
        await shareDialog.dateTimePicker.waitForDateTimePickerToClose();

        const setDate = `${date}`.replace(',', '');
        const inputDate = await shareDialog.getExpireDate();

        expect(new Date(inputDate)).toEqual(new Date(setDate));

        const expireDateProperty = await apis.user.nodes.getSharedExpiryDate(file5Id);

        expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
      });

      it('[C286662] Expire date is displayed correctly', async () => {
        await dataTable.selectItem(file6, parent);
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();

        const expireProperty = await apis.user.nodes.getSharedExpiryDate(file6Id);
        expect(expireProperty).toEqual(expiryDate);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(Utils.formatDate(await shareDialog.getExpireDate())).toEqual(Utils.formatDate(expiryDate));
      });

      it('[C286663] Disable the share link expiration', async () => {
        await dataTable.selectItem(file7, parent);
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(await shareDialog.getExpireDate()).not.toBe('', 'Expire date input is empty');

        await BrowserActions.click(shareDialog.expireToggle);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expiration is checked');
        expect(await shareDialog.getExpireDate()).toBe('', 'Expire date input is not empty');

        await shareDialog.clickClose();
        expect(await apis.user.nodes.getSharedExpiryDate(file7Id)).toBe('', `${file7} link still has expiration`);
      });

      it('[C286664] Shared file URL is not changed when Share dialog is closed and opened again', async () => {
        await dataTable.selectItem(file8);
        await toolbar.shareButton.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file8Id]);

        const url1 = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();

        await page.dataTable.clearSelection();
        await dataTable.selectItem(file8);
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();
        const url2 = await shareDialog.getLinkUrl();

        expect(url1).toEqual(url2);
      });

      it('[C286665] Share a file from the context menu', async () => {
        await dataTable.rightClickOnItem(file9);
        await contextMenu.waitForMenuToOpen();
        await contextMenu.shareAction.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file9Id]);

        const url = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();

        const sharedId = await apis.user.nodes.getSharedId(file9Id);
        expect(await apis.user.nodes.isFileShared(file9Id)).toBe(true, `${file9} is not shared`);
        expect(url).toContain(sharedId);
      });
    });

    describe('from Shared Files', () => {
      let file1Id: string;
      let file2Id: string;
      let file3Id: string;
      let file4Id: string;
      let file5Id: string;
      let file6Id: string;
      let file7Id: string;

      beforeAll(async () => {
        file1Id = (await apis.user.nodes.createFile(file1, parentId)).entry.id;
        file2Id = (await apis.user.nodes.createFile(file2, parentId)).entry.id;
        file3Id = (await apis.user.nodes.createFile(file3, parentId)).entry.id;
        file4Id = (await apis.user.nodes.createFile(file4, parentId)).entry.id;
        file5Id = (await apis.user.nodes.createFile(file5, parentId)).entry.id;
        file6Id = (await apis.user.nodes.createFile(file6, parentId)).entry.id;
        file7Id = (await apis.user.nodes.createFile(file7, parentId)).entry.id;

        await userActions.login(username, username);
        await userActions.shareNodes([file1Id, file2Id, file3Id]);
        await userActions.shareNodes([file4Id, file5Id], expiryDate);
        await userActions.shareNodes([file6Id, file7Id]);
        await apis.user.shared.waitForFilesToBeShared([file1Id, file2Id, file3Id, file4Id, file5Id, file6Id, file7Id]);
      });

      beforeEach(async () => {
        await page.clickSharedFilesAndWait();
      });

      afterEach(async () => {
        await Utils.pressEscape();
        await page.closeOpenDialogs();
      });

      afterAll(async () => {
        await apis.user.nodes.deleteNodesById([file1Id, file2Id, file3Id, file4Id, file5Id, file6Id, file7Id]);
      });

      it('[C286648] Share dialog default values', async () => {
        await dataTable.selectItem(file1);
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.getDialogTitle()).toEqual(`Share ${file1}`);
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
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
        await shareDialog.clickClose();
        expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog is open');
      });

      it('[C286651] Copy shared file URL', async () => {
        await dataTable.selectItem(file3);
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();
        const url = await shareDialog.getLinkUrl();
        expect(url).toContain(shareLinkPreUrl);

        await BrowserActions.click(shareDialog.urlAction);
        expect(await page.getSnackBarMessage()).toBe('Link copied to the clipboard');

        await browser.get(url);
        expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
        expect(await viewer.getFileTitle()).toEqual(file3);

        await page.load();
      });

      it('[C286653] Expire date is displayed correctly', async () => {
        await dataTable.selectItem(file4);
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();

        const expireProperty = await apis.user.nodes.getSharedExpiryDate(file4Id);
        expect(expireProperty).toEqual(expiryDate);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(Utils.formatDate(await shareDialog.getExpireDate())).toEqual(Utils.formatDate(expiryDate));
      });

      it('[C286654] Disable the share link expiration', async () => {
        await dataTable.selectItem(file5);
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(await shareDialog.getExpireDate()).not.toBe('', 'Expire date input is empty');

        await BrowserActions.click(shareDialog.expireToggle);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expiration is checked');
        expect(await shareDialog.getExpireDate()).toBe('', 'Expire date input is not empty');

        await shareDialog.clickClose();
        expect(await apis.user.nodes.getSharedExpiryDate(file5Id)).toBe('', `${file5} link still has expiration`);
      });

      it('[C286655] Shared file URL is not changed when Share dialog is closed and opened again', async () => {
        await dataTable.selectItem(file6);
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();
        const url1 = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();

        await page.dataTable.clearSelection();
        await dataTable.selectItem(file6);
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();
        const url2 = await shareDialog.getLinkUrl();

        expect(url1).toEqual(url2);
      });

      it('[C286656] Open Share dialog from context menu', async () => {
        await dataTable.rightClickOnItem(file7);
        await contextMenu.waitForMenuToOpen();
        await BrowserActions.click(contextMenu.shareEditAction);

        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.getDialogTitle()).toEqual(`Share ${file7}`);
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
      let file1Id: string;
      let file2Id: string;
      let file3Id: string;
      let file4Id: string;
      let file5Id: string;
      let file6Id: string;
      let file7Id: string;
      let file8Id: string;
      let file9Id: string;

      beforeAll(async () => {
        file1Id = (await apis.user.nodes.createFile(file1, parentId)).entry.id;
        file2Id = (await apis.user.nodes.createFile(file2, parentId)).entry.id;
        file3Id = (await apis.user.nodes.createFile(file3, parentId)).entry.id;
        file4Id = (await apis.user.nodes.createFile(file4, parentId)).entry.id;
        file5Id = (await apis.user.nodes.createFile(file5, parentId)).entry.id;
        file6Id = (await apis.user.nodes.createFile(file6, parentId)).entry.id;
        file7Id = (await apis.user.nodes.createFile(file7, parentId)).entry.id;
        file8Id = (await apis.user.nodes.createFile(file8, parentId)).entry.id;
        file9Id = (await apis.user.nodes.createFile(file9, parentId)).entry.id;

        await apis.user.favorites.addFavoritesByIds('file', [file1Id, file2Id, file3Id, file4Id, file5Id, file6Id, file7Id, file8Id, file9Id]);
        await userActions.login(username, username);
        await userActions.shareNodes([file6Id, file7Id], expiryDate);

        await apis.user.favorites.waitForApi({ expect: 9 });
        await apis.user.shared.waitForFilesToBeShared([file6Id, file7Id]);
      });

      beforeEach(async () => {
        await page.clickFavoritesAndWait();
      });

      afterEach(async () => {
        await Utils.pressEscape();
        await page.closeOpenDialogs();
      });

      afterAll(async () => {
        await apis.user.nodes.deleteNodesById([file1Id, file2Id, file3Id, file4Id, file5Id, file6Id, file7Id, file8Id, file9Id]);
      });

      it('[C286666] Share dialog default values', async () => {
        await dataTable.selectItem(file1);
        await toolbar.shareButton.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file1Id]);

        expect(await shareDialog.getDialogTitle()).toEqual(`Share ${file1}`);
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
        await apis.user.shared.waitForFilesToBeShared([file2Id]);

        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
        await shareDialog.clickClose();
        expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog is open');
      });

      it('[C286668] Share a file', async () => {
        await dataTable.selectItem(file3);
        await toolbar.shareButton.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file3Id]);

        const url = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();

        const sharedId = await apis.user.nodes.getSharedId(file3Id);
        expect(await apis.user.nodes.isFileShared(file3Id)).toBe(true, `${file3} is not shared`);
        expect(url).toContain(sharedId);
      });

      it('[C286669] Copy shared file URL', async () => {
        await dataTable.selectItem(file4);
        await toolbar.shareButton.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file4Id]);

        const url = await shareDialog.getLinkUrl();
        expect(url).toContain(shareLinkPreUrl);

        await BrowserActions.click(shareDialog.urlAction);
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
        await apis.user.shared.waitForFilesToBeShared([file5Id]);

        await BrowserActions.click(shareDialog.expireToggle);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expire toggle not checked');
        await BrowserActions.click(shareDialog.datetimePickerButton);
        expect(await shareDialog.dateTimePicker.isCalendarOpen()).toBe(true, 'Calendar not opened');
        const date = await shareDialog.dateTimePicker.setDefaultDay();
        await shareDialog.dateTimePicker.waitForDateTimePickerToClose();

        const setDate = `${date}`.replace(',', '');
        const inputDate = await shareDialog.getExpireDate();

        expect(new Date(inputDate)).toEqual(new Date(setDate));

        const expireDateProperty = await apis.user.nodes.getSharedExpiryDate(file5Id);

        expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
      });

      it('[C286671] Expire date is displayed correctly', async () => {
        await dataTable.selectItem(file6);
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();

        const expireProperty = await apis.user.nodes.getSharedExpiryDate(file6Id);
        expect(expireProperty).toEqual(expiryDate);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(Utils.formatDate(await shareDialog.getExpireDate())).toEqual(Utils.formatDate(expiryDate));
      });

      it('[C286672] Disable the share link expiration', async () => {
        await dataTable.selectItem(file7);
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(await shareDialog.getExpireDate()).not.toBe('', 'Expire date input is empty');

        await BrowserActions.click(shareDialog.expireToggle);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expiration is checked');
        expect(await shareDialog.getExpireDate()).toBe('', 'Expire date input is not empty');

        await shareDialog.clickClose();
        expect(await apis.user.nodes.getSharedExpiryDate(file7Id)).toBe('', `${file7} link still has expiration`);
      });

      it('[C286673] Shared file URL is not changed when Share dialog is closed and opened again', async () => {
        await dataTable.selectItem(file8);
        await toolbar.shareButton.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file8Id]);

        const url1 = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();

        await page.dataTable.clearSelection();
        await dataTable.selectItem(file8);
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();
        const url2 = await shareDialog.getLinkUrl();

        expect(url1).toEqual(url2);
      });

      it('[C286674] Share a file from the context menu', async () => {
        await dataTable.rightClickOnItem(file9);
        await contextMenu.waitForMenuToOpen();
        await contextMenu.shareAction.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([file9Id]);

        const url = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();

        const sharedId = await apis.user.nodes.getSharedId(file9Id);
        expect(await apis.user.nodes.isFileShared(file9Id)).toBe(true, `${file9} is not shared`);
        expect(url).toContain(sharedId);
      });
    });

    describe('from Search Results', () => {
      const searchRandom = Utils.random();

      const fileSearch3 = `search-file3-${searchRandom}.txt`;
      const fileSearch5 = `search-file5-${searchRandom}.txt`;
      const fileSearch6 = `search-file6-${searchRandom}.txt`;
      const fileSearch7 = `search-file7-${searchRandom}.txt`;
      const fileSearch9 = `search-file9-${searchRandom}.txt`;

      let fileSearch3Id: string;
      let fileSearch5Id: string;
      let fileSearch6Id: string;
      let fileSearch7Id: string;
      let fileSearch9Id: string;

      beforeAll(async () => {
        fileSearch3Id = (await apis.user.nodes.createFile(fileSearch3, parentId)).entry.id;
        fileSearch5Id = (await apis.user.nodes.createFile(fileSearch5, parentId)).entry.id;
        fileSearch6Id = (await apis.user.nodes.createFile(fileSearch6, parentId)).entry.id;
        fileSearch7Id = (await apis.user.nodes.createFile(fileSearch7, parentId)).entry.id;
        fileSearch9Id = (await apis.user.nodes.createFile(fileSearch9, parentId)).entry.id;
        await apis.user.search.waitForNodes(searchRandom, { expect: 5 });

        await userActions.login(username, username);
        await userActions.shareNodes([fileSearch6Id, fileSearch7Id], expiryDate);
        await apis.user.shared.waitForFilesToBeShared([fileSearch6Id, fileSearch7Id]);
      });

      beforeEach(async () => {
        try {
          await searchInput.clickSearchButton();
          await searchInput.checkFilesAndFolders();
          await searchInput.searchFor(searchRandom);
          await dataTable.waitForBody();
        } catch (error) {
          Logger.error(`----- beforeEach failed : ${error}`);
        }
      });

      afterEach(async () => {
        await Utils.pressEscape();
        await page.closeOpenDialogs();
      });

      afterAll(async () => {
        await apis.user.nodes.deleteNodesById([fileSearch3Id, fileSearch5Id, fileSearch6Id, fileSearch7Id, fileSearch9Id]);
      });

      it('[C306975] Share a file', async () => {
        await dataTable.selectItem(fileSearch3);
        await toolbar.shareButton.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([fileSearch3Id]);

        const url = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();

        const sharedId = await apis.user.nodes.getSharedId(fileSearch3Id);
        expect(await apis.user.nodes.isFileShared(fileSearch3Id)).toBe(true, `${fileSearch3} is not shared`);
        expect(url).toContain(sharedId);
      });

      it('[C306977] Share a file with expiration date', async () => {
        await dataTable.selectItem(fileSearch5);
        await toolbar.shareButton.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([fileSearch5Id]);

        await BrowserActions.click(shareDialog.expireToggle);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expire toggle not checked');
        await BrowserActions.click(shareDialog.datetimePickerButton);
        expect(await shareDialog.dateTimePicker.isCalendarOpen()).toBe(true, 'Calendar not opened');
        const date = await shareDialog.dateTimePicker.setDefaultDay();
        await shareDialog.dateTimePicker.waitForDateTimePickerToClose();

        const setDate = `${date}`.replace(',', '');
        const inputDate = await shareDialog.getExpireDate();

        expect(new Date(inputDate)).toEqual(new Date(setDate));

        const expireDateProperty = await apis.user.nodes.getSharedExpiryDate(fileSearch5Id);

        expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
      });

      it('[C306978] Expire date is displayed correctly', async () => {
        await dataTable.selectItem(fileSearch6);
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();

        const expireProperty = await apis.user.nodes.getSharedExpiryDate(fileSearch6Id);
        expect(expireProperty).toEqual(expiryDate);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(Utils.formatDate(await shareDialog.getExpireDate())).toEqual(Utils.formatDate(expiryDate));
      });

      it('[C306979] Disable the share link expiration', async () => {
        await dataTable.selectItem(fileSearch7);
        await BrowserActions.click(toolbar.shareEditButton);
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(await shareDialog.getExpireDate()).not.toBe('', 'Expire date input is empty');

        await BrowserActions.click(shareDialog.expireToggle);

        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expiration is checked');
        expect(await shareDialog.getExpireDate()).toBe('', 'Expire date input is not empty');

        await shareDialog.clickClose();
        expect(await apis.user.nodes.getSharedExpiryDate(fileSearch7Id)).toBe('', `${fileSearch7} link still has expiration`);
      });

      it('[C306981] Share a file from the context menu', async () => {
        await dataTable.rightClickOnItem(fileSearch9);
        await contextMenu.waitForMenuToOpen();
        await contextMenu.shareAction.click();

        await shareDialog.waitForDialogToOpen();
        await apis.user.shared.waitForFilesToBeShared([fileSearch9Id]);

        const url = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();

        const sharedId = await apis.user.nodes.getSharedId(fileSearch9Id);
        expect(await apis.user.nodes.isFileShared(fileSearch9Id)).toBe(true, `${fileSearch9} is not shared`);
        expect(url).toContain(sharedId);
      });
    });
  });
});
