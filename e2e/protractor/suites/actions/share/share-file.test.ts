/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { browser } from 'protractor';
import { AdminActions, UserActions, LoginPage, BrowsingPage, RepoClient, ShareDialog, Viewer, Utils } from '@alfresco/aca-testing-shared';
import { BrowserActions } from '@alfresco/adf-testing';

describe('Share a file', () => {
  const username = `user-${Utils.random()}`;
  const parent = `parent-${Utils.random()}`;
  let parentId: string;

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
    await userActions.login(username, username);

    parentId = await apis.user.createFolder(parent);
  });

  afterAll(async () => {
    await userActions.deleteNodes([parentId]);
  });

  describe('when logged out', () => {
    let file6SharedLink: string;
    let file6Id: string;

    beforeAll(async () => {
      file6Id = await apis.user.createFile(file6, parentId);

      const sharedId = (await apis.user.shared.shareFileById(file6Id)).entry.id;
      file6SharedLink = `${shareLinkPreUrl}${sharedId}`;
      await apis.user.shared.waitForFilesToBeShared([file6Id]);
    });

    afterAll(async () => {
      await userActions.deleteNodes([file6Id]);
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
    const expiryDateObj: Date = new Date();
    expiryDateObj.setFullYear(expiryDateObj.getFullYear() + 1);
    const expiryDate: any = expiryDateObj.toISOString().replace('Z', '+0000');

    const loginPage = new LoginPage();
    const shareDialog = new ShareDialog();
    const contextMenu = dataTable.menu;

    beforeAll(async () => {
      await loginPage.loginWith(username);
    });

    describe('from Personal Files', () => {
      let file3Id: string;
      let file4Id: string;
      let file5Id: string;
      let file6Id: string;
      let file7Id: string;
      let file8Id: string;
      let file9Id: string;

      beforeAll(async () => {
        file3Id = await apis.user.createFile(file3, parentId);
        file4Id = await apis.user.createFile(file4, parentId);
        file5Id = await apis.user.createFile(file5, parentId);
        file6Id = await apis.user.createFile(file6, parentId);
        file7Id = await apis.user.createFile(file7, parentId);
        file8Id = await apis.user.createFile(file8, parentId);
        file9Id = await apis.user.createFile(file9, parentId);

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
        await userActions.deleteNodes([file3Id, file4Id, file5Id, file6Id, file7Id, file8Id, file9Id]);
      });

      it('[C286327] Share dialog default values', async () => {
        await dataTable.selectItem(file3);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.getDialogTitle()).toEqual(`Share ${file3}`);
        expect(await shareDialog.getInfoText()).toEqual('Share Link');
        expect(await shareDialog.labels.get(0).getText()).toEqual(`Share ${file3}`);
        expect(await shareDialog.getLinkUrl()).toContain(shareLinkPreUrl);
        expect(await shareDialog.isUrlReadOnly()).toBe(true, 'url is not readonly');
        expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
        expect(await shareDialog.labels.get(1).getText()).toEqual('Link Expiry Date');
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expire toggle is checked');
        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
      });

      it('[C286329] Share a file', async () => {
        await dataTable.selectItem(file3);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();

        const sharedId = await apis.user.nodes.getSharedId(file3Id);
        expect(url).toContain(sharedId);
      });

      it('[C286330] Copy shared file URL', async () => {
        await dataTable.selectItem(file4);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        expect(url).toContain(shareLinkPreUrl);

        await BrowserActions.click(shareDialog.urlAction);
        expect(await page.getSnackBarMessage()).toBe('Link copied to the clipboard');

        await browser.get(url);

        await viewer.waitForViewerToOpen();
        expect(await viewer.getFileTitle()).toEqual(file4);

        await page.load();
      });

      it('[C286332] Share a file with expiration date', async () => {
        await dataTable.selectItem(file5);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        await BrowserActions.click(shareDialog.expireToggle);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expire toggle not checked');

        await BrowserActions.click(shareDialog.datetimePickerButton);
        expect(await shareDialog.dateTimePicker.isCalendarOpen()).toBe(true, 'Calendar not opened');
        await shareDialog.dateTimePicker.pickDateTime();
        await shareDialog.dateTimePicker.waitForDateTimePickerToClose();

        const inputDate = await shareDialog.getExpireDate();
        const expireDateProperty = await apis.user.nodes.getSharedExpiryDate(file5Id);

        expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
      });

      it('[C286337] Expire date is displayed correctly', async () => {
        await dataTable.selectItem(file6);
        await BrowserActions.click(toolbar.shareButton);
        await shareDialog.waitForDialogToOpen();

        const expireProperty = await apis.user.nodes.getSharedExpiryDate(file6Id);
        expect(expireProperty).toEqual(expiryDate);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(Utils.formatDate(await shareDialog.getExpireDate())).toEqual(Utils.formatDate(expiryDate));
      });

      it('[C286333] Disable the share link expiration', async () => {
        await dataTable.selectItem(file7);
        await BrowserActions.click(toolbar.shareButton);
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(await shareDialog.getExpireDate()).not.toBe('', 'Expire date input is empty');

        await BrowserActions.click(shareDialog.expireToggle);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expiration is checked');
        expect(await shareDialog.expireInput.isDisplayed()).toBe(false, 'Expire date input is not empty');

        await shareDialog.clickClose();
        expect(await apis.user.nodes.getSharedExpiryDate(file7Id)).toBe('', `${file7} link still has expiration`);
      });

      it('[C286335] Shared file URL is not changed when Share dialog is closed and opened again', async () => {
        await dataTable.selectItem(file8);
        await toolbar.shareButton.click();
        await shareDialog.waitForDialogToOpen();

        const url1 = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();

        await page.dataTable.clearSelection();
        await dataTable.selectItem(file8);
        await BrowserActions.click(toolbar.shareButton);
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
        await shareDialog.clickClose();

        const sharedId = await apis.user.nodes.getSharedId(file9Id);
        expect(await apis.user.nodes.isFileShared(file9Id)).toBe(true, `${file9} is not shared`);
        expect(url).toContain(sharedId);
      });
    });
  });
});
