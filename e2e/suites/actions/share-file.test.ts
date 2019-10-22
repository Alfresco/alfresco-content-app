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

import { browser } from 'protractor';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { SITE_VISIBILITY } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { ShareDialog } from '../../components/dialog/share-dialog';
import { Viewer } from '../../components/viewer/viewer';
import { Utils } from '../../utilities/utils';

describe('Share a file', () => {
  const username = `user-${Utils.random()}`;
  const parent = `parent-${Utils.random()}`; let parentId;

  const file1 = `file1-${Utils.random()}.txt`; let file1Id;
  const file2 = `file2-${Utils.random()}.txt`; let file2Id;
  let file3 = `file3-${Utils.random()}.txt`; let file3Id;
  const file4 = `file4-${Utils.random()}.txt`; let file4Id;
  let file5 = `file5-${Utils.random()}.txt`; let file5Id;
  let file6 = `file6-${Utils.random()}.txt`; let file6Id;
  let file7 = `file7-${Utils.random()}.txt`; let file7Id;
  const file8 = `file8-${Utils.random()}.txt`; let file8Id;
  let file9 = `file9-${Utils.random()}.txt`; let file9Id;

  const viewer = new Viewer();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const shareLinkPreUrl = "/#/preview/s/";

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(parentId);
    done();
  });

  describe('when logged out', () => {
    let file6SharedLink;

    beforeAll(async (done) => {
      file6Id = (await apis.user.nodes.createFile(file6, parentId)).entry.id;
      const sharedId = (await apis.user.shared.shareFileById(file6Id)).entry.id;
      file6SharedLink = `${shareLinkPreUrl}${sharedId}`;
      await apis.user.shared.waitForApi({ expect: 1 });
      done();
    });

    afterAll(async (done) => {
      await apis.user.nodes.deleteNodeById(file6Id);
      await apis.user.shared.waitForApi({ expect: 0 });
      done();
    });

    it('A non-logged user can download the shared file from the viewer - [C286326]', async () => {
      await browser.get(file6SharedLink);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).toEqual(file6);

      await toolbar.clickDownload();
      expect(await Utils.fileExistsOnOS(file6)).toBe(true, 'File not found in download location');
    });
  })

  describe('when logged in', () => {
    const expiryDate: any = '2020-12-25T18:30:00.000+0000';

    const loginPage = new LoginPage();
    const shareDialog = new ShareDialog();
    const contextMenu = dataTable.menu;
    const { searchInput } = page.header;

    beforeAll(async (done) => {
      await loginPage.loginWith(username);
      done();
    });

    describe('from Personal Files', () => {

      beforeAll(async (done) => {
        file1Id = (await apis.user.nodes.createFile(file1, parentId)).entry.id;
        file2Id = (await apis.user.nodes.createFile(file2, parentId)).entry.id;
        file3Id = (await apis.user.nodes.createFile(file3, parentId)).entry.id;
        file4Id = (await apis.user.nodes.createFile(file4, parentId)).entry.id;
        file5Id = (await apis.user.nodes.createFile(file5, parentId)).entry.id;
        file6Id = (await apis.user.nodes.createFile(file6, parentId)).entry.id;
        file7Id = (await apis.user.nodes.createFile(file7, parentId)).entry.id;
        file8Id = (await apis.user.nodes.createFile(file8, parentId)).entry.id;
        file9Id = (await apis.user.nodes.createFile(file9, parentId)).entry.id;
        await apis.user.shared.shareFileById(file6Id, expiryDate);
        await apis.user.shared.shareFileById(file7Id, expiryDate);
        await apis.user.shared.waitForApi({ expect: 2 });
        done();
      });

      beforeEach(async (done) => {
        await page.clickPersonalFilesAndWait();
        await dataTable.doubleClickOnRowByName(parent);
        await dataTable.waitForHeader();
        done();
      });

      afterEach(async (done) => {
        await Utils.pressEscape();
        done();
      });

      afterAll(async (done) => {
        await apis.user.nodes.deleteNodeById(file1Id);
        await apis.user.nodes.deleteNodeById(file2Id);
        await apis.user.nodes.deleteNodeById(file3Id);
        await apis.user.nodes.deleteNodeById(file4Id);
        await apis.user.nodes.deleteNodeById(file5Id);
        await apis.user.nodes.deleteNodeById(file6Id);
        await apis.user.nodes.deleteNodeById(file7Id);
        await apis.user.nodes.deleteNodeById(file8Id);
        await apis.user.nodes.deleteNodeById(file9Id);
        await apis.user.shared.waitForApi({ expect: 0 });
        done();
      });

      it('Share dialog default values - [C286327]', async () => {
        await dataTable.selectItem(file1);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.getTitle()).toEqual(`Share ${file1}`);
        expect(await shareDialog.getInfoText()).toEqual('Click the link below to copy it to the clipboard.');
        expect(await shareDialog.getLabels().get(0).getText()).toEqual('Link to share');
        expect(await shareDialog.getLinkUrl()).toContain(shareLinkPreUrl);
        expect(await shareDialog.isUrlReadOnly()).toBe('true', 'url is not readonly');
        expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
        expect(await shareDialog.getLabels().get(1).getText()).toEqual('Expires on');
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expire toggle is checked');
        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
      });

      it('Close dialog - [C286328]', async () => {
        await dataTable.selectItem(file2);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
        await shareDialog.clickClose();
        expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog is open');
      });

      it('Share a file - [C286329]', async () => {
        await dataTable.selectItem(file3);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await Utils.pressEscape();
        const sharedId = await apis.user.nodes.getSharedId(file3Id);
        expect(await apis.user.nodes.isFileShared(file3Id)).toBe(true, `${file3} is not shared`);
        expect(url).toContain(sharedId);
      });

      it('Copy shared file URL - [C286330]', async () => {
        await dataTable.selectItem(file4);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();
        const url = await shareDialog.getLinkUrl();
        expect(url).toContain(shareLinkPreUrl);

        await shareDialog.copyUrl();
        expect(await page.getSnackBarMessage()).toBe('Link copied to the clipboard');

        await browser.get(url);
        expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
        expect(await viewer.getFileTitle()).toEqual(file4);

        await page.load();
      });

      it('Share a file with expiration date - [C286332]', async () => {
        await dataTable.selectItem(file5);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();

        await shareDialog.clickExpirationToggle();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expire toggle not checked');
        expect(await shareDialog.dateTimePicker.isCalendarOpen()).toBe(true, 'Calendar not opened');
        const date = await shareDialog.dateTimePicker.setDefaultDay();
        await shareDialog.dateTimePicker.waitForDateTimePickerToClose();

        const setDate = (`${date}`).replace(',', '');
        const inputDate = await shareDialog.getExpireDate();

        expect(new Date(inputDate)).toEqual(new Date(setDate));

        const expireDateProperty = await apis.user.nodes.getSharedExpiryDate(file5Id);

        expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
      });

      it('Expire date is displayed correctly - [C286337]', async () => {
        await dataTable.selectItem(file6);
        await toolbar.clickSharedLinkSettings();
        await shareDialog.waitForDialogToOpen();

        const expireProperty = await apis.user.nodes.getSharedExpiryDate(file6Id);
        expect(expireProperty).toEqual(expiryDate);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(Utils.formatDate(await shareDialog.getExpireDate())).toEqual(Utils.formatDate(expiryDate));
      });

      it('Disable the share link expiration - [C286333]', async () => {
        await dataTable.selectItem(file7);
        await toolbar.clickSharedLinkSettings();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(await shareDialog.getExpireDate()).not.toBe('', 'Expire date input is empty');

        await shareDialog.clickExpirationToggle();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expiration is checked');
        expect(await shareDialog.getExpireDate()).toBe('', 'Expire date input is not empty');

        await shareDialog.clickClose();
        expect(await apis.user.nodes.getSharedExpiryDate(file7Id)).toBe('', `${file7} link still has expiration`);
      });

      it('Shared file URL is not changed when Share dialog is closed and opened again - [C286335]', async () => {
        await dataTable.selectItem(file8);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();
        const url1 = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();
        await shareDialog.waitForDialogToClose();

        await page.dataTable.clearSelection();
        await dataTable.selectItem(file8);
        await toolbar.clickSharedLinkSettings();
        await shareDialog.waitForDialogToOpen();
        const url2 = await shareDialog.getLinkUrl();

        expect(url1).toEqual(url2);
      });

      it('Share a file from the context menu - [C286345]', async () => {
        await dataTable.rightClickOnItem(file9);
        await contextMenu.waitForMenuToOpen();
        await contextMenu.clickShare();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await Utils.pressEscape();
        const sharedId = await apis.user.nodes.getSharedId(file9Id);
        expect(await apis.user.nodes.isFileShared(file9Id)).toBe(true, `${file9} is not shared`);
        expect(url).toContain(sharedId);
      });
    });

    describe('from File Libraries', () => {

      const siteName = `site-${Utils.random()}`;
      const parentInSite = `parent-site-${Utils.random()}`; let parentInSiteId;

      beforeAll(async (done) => {
        await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
        const docLibId = await apis.user.sites.getDocLibId(siteName);
        parentInSiteId = (await apis.user.nodes.createFolder(parentInSite, docLibId)).entry.id;

        await apis.user.nodes.createFile(file1, parentInSiteId);
        await apis.user.nodes.createFile(file2, parentInSiteId);
        file3Id = (await apis.user.nodes.createFile(file3, parentInSiteId)).entry.id;
        await apis.user.nodes.createFile(file4, parentInSiteId);
        file5Id = (await apis.user.nodes.createFile(file5, parentInSiteId)).entry.id;
        file6Id = (await apis.user.nodes.createFile(file6, parentInSiteId)).entry.id;
        file7Id = (await apis.user.nodes.createFile(file7, parentInSiteId)).entry.id;
        await apis.user.nodes.createFile(file8, parentInSiteId);
        file9Id = (await apis.user.nodes.createFile(file9, parentInSiteId)).entry.id;
        await apis.user.shared.shareFileById(file6Id, expiryDate);
        await apis.user.shared.shareFileById(file7Id, expiryDate);
        await apis.user.shared.waitForApi({ expect: 2 });
        done();
      });

      beforeEach(async (done) => {
        await page.goToMyLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();
        await dataTable.doubleClickOnRowByName(parentInSite);
        await dataTable.waitForHeader();
        done();
      });

      afterEach(async (done) => {
        await Utils.pressEscape();
        await page.clickPersonalFilesAndWait();
        done();
      });

      afterAll(async (done) => {
        await apis.admin.sites.deleteSite(siteName);
        await apis.user.shared.waitForApi({ expect: 0 });
        done();
      });

      it('Share dialog default values - [C286639]', async () => {
        await dataTable.selectItem(file1);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.getTitle()).toEqual(`Share ${file1}`);
        expect(await shareDialog.getInfoText()).toEqual('Click the link below to copy it to the clipboard.');
        expect(await shareDialog.getLabels().get(0).getText()).toEqual('Link to share');
        expect(await shareDialog.getLinkUrl()).toContain(shareLinkPreUrl);
        expect(await shareDialog.isUrlReadOnly()).toBe('true', 'url is not readonly');
        expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
        expect(await shareDialog.getLabels().get(1).getText()).toEqual('Expires on');
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expire toggle is checked');
        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
      });

      it('Close dialog - [C286640]', async () => {
        await dataTable.selectItem(file2);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
        await shareDialog.clickClose();
        expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog is open');
      });

      it('Share a file - [C286641]', async () => {
        await dataTable.selectItem(file3);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await Utils.pressEscape();
        const sharedId = await apis.user.nodes.getSharedId(file3Id);
        expect(await apis.user.nodes.isFileShared(file3Id)).toBe(true, `${file3} is not shared`);
        expect(url).toContain(sharedId);
      });

      it('Copy shared file URL - [C286642]', async () => {
        await dataTable.selectItem(file4);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();
        const url = await shareDialog.getLinkUrl();
        expect(url).toContain(shareLinkPreUrl);

        await shareDialog.copyUrl();
        expect(await page.getSnackBarMessage()).toBe('Link copied to the clipboard');

        await browser.get(url);
        expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
        expect(await viewer.getFileTitle()).toEqual(file4);

        await page.load();
      });

      it('Share a file with expiration date - [C286643]', async () => {
        await dataTable.selectItem(file5);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();

        await shareDialog.clickExpirationToggle();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expire toggle not checked');
        expect(await shareDialog.dateTimePicker.isCalendarOpen()).toBe(true, 'Calendar not opened');
        const date = await shareDialog.dateTimePicker.setDefaultDay();
        await shareDialog.dateTimePicker.waitForDateTimePickerToClose();

        const setDate = (`${date}`).replace(',', '');
        const inputDate = await shareDialog.getExpireDate();

        expect(new Date(inputDate)).toEqual(new Date(setDate));

        const expireDateProperty = await apis.user.nodes.getSharedExpiryDate(file5Id);

        expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
      });

      it('Expire date is displayed correctly - [C286644]', async () => {
        await dataTable.selectItem(file6);
        await toolbar.clickSharedLinkSettings();
        await shareDialog.waitForDialogToOpen();

        const expireProperty = await apis.user.nodes.getSharedExpiryDate(file6Id);
        expect(expireProperty).toEqual(expiryDate);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(Utils.formatDate(await shareDialog.getExpireDate())).toEqual(Utils.formatDate(expiryDate));
      });

      it('Disable the share link expiration - [C286645]', async () => {
        await dataTable.selectItem(file7);
        await toolbar.clickSharedLinkSettings();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(await shareDialog.getExpireDate()).not.toBe('', 'Expire date input is empty');

        await shareDialog.clickExpirationToggle();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expiration is checked');
        expect(await shareDialog.getExpireDate()).toBe('', 'Expire date input is not empty');

        await shareDialog.clickClose();
        expect(await apis.user.nodes.getSharedExpiryDate(file7Id)).toBe('', `${file7} link still has expiration`);
      });

      it('Shared file URL is not changed when Share dialog is closed and opened again - [C286646]', async () => {
        await dataTable.selectItem(file8);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();
        const url1 = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();
        await shareDialog.waitForDialogToClose();

        await page.dataTable.clearSelection();
        await dataTable.selectItem(file8);
        await toolbar.clickSharedLinkSettings();
        await shareDialog.waitForDialogToOpen();
        const url2 = await shareDialog.getLinkUrl();

        expect(url1).toEqual(url2);
      });

      it('Share a file from the context menu - [C286647]', async () => {
        await dataTable.rightClickOnItem(file9);
        await contextMenu.waitForMenuToOpen();
        await contextMenu.clickShare();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await Utils.pressEscape();
        const sharedId = await apis.user.nodes.getSharedId(file9Id);
        expect(await apis.user.nodes.isFileShared(file9Id)).toBe(true, `${file9} is not shared`);
        expect(url).toContain(sharedId);
      });
    });

    describe('from Recent Files', () => {

      beforeAll(async (done) => {
        file1Id = (await apis.user.nodes.createFile(file1, parentId)).entry.id;
        file2Id = (await apis.user.nodes.createFile(file2, parentId)).entry.id;
        file3Id = (await apis.user.nodes.createFile(file3, parentId)).entry.id;
        file4Id = (await apis.user.nodes.createFile(file4, parentId)).entry.id;
        file5Id = (await apis.user.nodes.createFile(file5, parentId)).entry.id;
        file6Id = (await apis.user.nodes.createFile(file6, parentId)).entry.id;
        file7Id = (await apis.user.nodes.createFile(file7, parentId)).entry.id;
        file8Id = (await apis.user.nodes.createFile(file8, parentId)).entry.id;
        file9Id = (await apis.user.nodes.createFile(file9, parentId)).entry.id;
        await apis.user.shared.shareFileById(file6Id, expiryDate);
        await apis.user.shared.shareFileById(file7Id, expiryDate);
        await apis.user.shared.waitForApi({ expect: 2 });
        done();
      });

      beforeEach(async (done) => {
        await page.clickRecentFilesAndWait();
        done();
      });

      afterEach(async (done) => {
        await Utils.pressEscape();
        await page.clickPersonalFilesAndWait();
        done();
      });

      afterAll(async (done) => {
        await apis.user.nodes.deleteNodeById(file1Id);
        await apis.user.nodes.deleteNodeById(file2Id);
        await apis.user.nodes.deleteNodeById(file3Id);
        await apis.user.nodes.deleteNodeById(file4Id);
        await apis.user.nodes.deleteNodeById(file5Id);
        await apis.user.nodes.deleteNodeById(file6Id);
        await apis.user.nodes.deleteNodeById(file7Id);
        await apis.user.nodes.deleteNodeById(file8Id);
        await apis.user.nodes.deleteNodeById(file9Id);
        await apis.user.shared.waitForApi({ expect: 0 });
        done();
      });

      it('Share dialog default values - [C286657]', async () => {
        await dataTable.selectItem(file1);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.getTitle()).toEqual(`Share ${file1}`);
        expect(await shareDialog.getInfoText()).toEqual('Click the link below to copy it to the clipboard.');
        expect(await shareDialog.getLabels().get(0).getText()).toEqual('Link to share');
        expect(await shareDialog.getLinkUrl()).toContain(shareLinkPreUrl);
        expect(await shareDialog.isUrlReadOnly()).toBe('true', 'url is not readonly');
        expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
        expect(await shareDialog.getLabels().get(1).getText()).toEqual('Expires on');
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expire toggle is checked');
        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
      });

      it('Close dialog - [C286658]', async () => {
        await dataTable.selectItem(file2);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
        await shareDialog.clickClose();
        expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog is open');
      });

      it('Share a file - [C286659]', async () => {
        await dataTable.selectItem(file3);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await Utils.pressEscape();
        const sharedId = await apis.user.nodes.getSharedId(file3Id);
        expect(await apis.user.nodes.isFileShared(file3Id)).toBe(true, `${file3} is not shared`);
        expect(url).toContain(sharedId);
      });

      it('Copy shared file URL - [C286660]', async () => {
        await dataTable.selectItem(file4);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();
        const url = await shareDialog.getLinkUrl();
        expect(url).toContain(shareLinkPreUrl);

        await shareDialog.copyUrl();
        expect(await page.getSnackBarMessage()).toBe('Link copied to the clipboard');

        await browser.get(url);
        expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
        expect(await viewer.getFileTitle()).toEqual(file4);

        await page.load();
      });

      it('Share a file with expiration date - [C286661]', async () => {
        await dataTable.selectItem(file5);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();

        await shareDialog.clickExpirationToggle();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expire toggle not checked');
        expect(await shareDialog.dateTimePicker.isCalendarOpen()).toBe(true, 'Calendar not opened');
        const date = await shareDialog.dateTimePicker.setDefaultDay();
        await shareDialog.dateTimePicker.waitForDateTimePickerToClose();

        const setDate = (`${date}`).replace(',', '');
        const inputDate = await shareDialog.getExpireDate();

        expect(new Date(inputDate)).toEqual(new Date(setDate));

        const expireDateProperty = await apis.user.nodes.getSharedExpiryDate(file5Id);

        expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
      });

      it('Expire date is displayed correctly - [C286662]', async () => {
        await dataTable.selectItem(file6);
        await toolbar.clickSharedLinkSettings();
        await shareDialog.waitForDialogToOpen();

        const expireProperty = await apis.user.nodes.getSharedExpiryDate(file6Id);
        expect(expireProperty).toEqual(expiryDate);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(Utils.formatDate(await shareDialog.getExpireDate())).toEqual(Utils.formatDate(expiryDate));
      });

      it('Disable the share link expiration - [C286663]', async () => {
        await dataTable.selectItem(file7);
        await toolbar.clickSharedLinkSettings();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(await shareDialog.getExpireDate()).not.toBe('', 'Expire date input is empty');

        await shareDialog.clickExpirationToggle();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expiration is checked');
        expect(await shareDialog.getExpireDate()).toBe('', 'Expire date input is not empty');

        await shareDialog.clickClose();
        expect(await apis.user.nodes.getSharedExpiryDate(file7Id)).toBe('', `${file7} link still has expiration`);
      });

      it('Shared file URL is not changed when Share dialog is closed and opened again - [C286664]', async () => {
        await dataTable.selectItem(file8);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();
        const url1 = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();
        await shareDialog.waitForDialogToClose();

        await page.dataTable.clearSelection();
        await dataTable.selectItem(file8);
        await toolbar.clickSharedLinkSettings();
        await shareDialog.waitForDialogToOpen();
        const url2 = await shareDialog.getLinkUrl();

        expect(url1).toEqual(url2);
      });

      it('Share a file from the context menu - [C286665]', async () => {
        await dataTable.rightClickOnItem(file9);
        await contextMenu.waitForMenuToOpen();
        await contextMenu.clickShare();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await Utils.pressEscape();
        const sharedId = await apis.user.nodes.getSharedId(file9Id);
        expect(await apis.user.nodes.isFileShared(file9Id)).toBe(true, `${file9} is not shared`);
        expect(url).toContain(sharedId);
      });
    });

    describe('from Shared Files', () => {

      beforeAll(async (done) => {
        file1Id = (await apis.user.nodes.createFile(file1, parentId)).entry.id;
        file2Id = (await apis.user.nodes.createFile(file2, parentId)).entry.id;
        file3Id = (await apis.user.nodes.createFile(file3, parentId)).entry.id;
        file4Id = (await apis.user.nodes.createFile(file4, parentId)).entry.id;
        file5Id = (await apis.user.nodes.createFile(file5, parentId)).entry.id;
        file6Id = (await apis.user.nodes.createFile(file6, parentId)).entry.id;
        file7Id = (await apis.user.nodes.createFile(file7, parentId)).entry.id;

        await apis.user.shared.shareFileById(file1Id);
        await apis.user.shared.shareFileById(file2Id);
        await apis.user.shared.shareFileById(file3Id);
        await apis.user.shared.shareFileById(file4Id, expiryDate);
        await apis.user.shared.shareFileById(file5Id, expiryDate);
        await apis.user.shared.shareFileById(file6Id);
        await apis.user.shared.shareFileById(file7Id);
        await apis.user.shared.waitForApi({ expect: 7 });
        done();
      });

      beforeEach(async (done) => {
        await page.clickSharedFilesAndWait();
        done();
      });

      afterEach(async (done) => {
        await Utils.pressEscape();
        await page.clickPersonalFilesAndWait();
        done();
      });

      afterAll(async (done) => {
        await apis.user.nodes.deleteNodeById(file1Id);
        await apis.user.nodes.deleteNodeById(file2Id);
        await apis.user.nodes.deleteNodeById(file3Id);
        await apis.user.nodes.deleteNodeById(file4Id);
        await apis.user.nodes.deleteNodeById(file5Id);
        await apis.user.nodes.deleteNodeById(file6Id);
        await apis.user.nodes.deleteNodeById(file7Id);
        await apis.user.shared.waitForApi({ expect: 0 });
        done();
      });

      it('Share dialog default values - [C286648]', async () => {
        await dataTable.selectItem(file1);
        await toolbar.clickSharedLinkSettings();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.getTitle()).toEqual(`Share ${file1}`);
        expect(await shareDialog.getInfoText()).toEqual('Click the link below to copy it to the clipboard.');
        expect(await shareDialog.getLabels().get(0).getText()).toEqual('Link to share');
        expect(await shareDialog.getLinkUrl()).toContain(shareLinkPreUrl);
        expect(await shareDialog.isUrlReadOnly()).toBe('true', 'url is not readonly');
        expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
        expect(await shareDialog.getLabels().get(1).getText()).toEqual('Expires on');
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expire toggle is checked');
        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
      });

      it('Close dialog - [C286649]', async () => {
        await dataTable.selectItem(file2);
        await toolbar.clickSharedLinkSettings();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
        await shareDialog.clickClose();
        expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog is open');
      });

      it('Copy shared file URL - [C286651]', async () => {
        await dataTable.selectItem(file3);
        await toolbar.clickSharedLinkSettings();
        await shareDialog.waitForDialogToOpen();
        const url = await shareDialog.getLinkUrl();
        expect(url).toContain(shareLinkPreUrl);

        await shareDialog.copyUrl();
        expect(await page.getSnackBarMessage()).toBe('Link copied to the clipboard');

        await browser.get(url);
        expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
        expect(await viewer.getFileTitle()).toEqual(file3);

        await page.load();
      });

      it('Expire date is displayed correctly - [C286653]', async () => {
        await dataTable.selectItem(file4);
        await toolbar.clickSharedLinkSettings();
        await shareDialog.waitForDialogToOpen();

        const expireProperty = await apis.user.nodes.getSharedExpiryDate(file4Id);
        expect(expireProperty).toEqual(expiryDate);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(Utils.formatDate(await shareDialog.getExpireDate())).toEqual(Utils.formatDate(expiryDate));
      });

      it('Disable the share link expiration - [C286654]', async () => {
        await dataTable.selectItem(file5);
        await toolbar.clickSharedLinkSettings();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(await shareDialog.getExpireDate()).not.toBe('', 'Expire date input is empty');

        await shareDialog.clickExpirationToggle();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expiration is checked');
        expect(await shareDialog.getExpireDate()).toBe('', 'Expire date input is not empty');

        await shareDialog.clickClose();
        expect(await apis.user.nodes.getSharedExpiryDate(file5Id)).toBe('', `${file5} link still has expiration`);
      });

      it('Shared file URL is not changed when Share dialog is closed and opened again - [C286655]', async () => {
        await dataTable.selectItem(file6);
        await toolbar.clickSharedLinkSettings();
        await shareDialog.waitForDialogToOpen();
        const url1 = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();
        await shareDialog.waitForDialogToClose();

        await page.dataTable.clearSelection();
        await dataTable.selectItem(file6);
        await toolbar.clickSharedLinkSettings();
        await shareDialog.waitForDialogToOpen();
        const url2 = await shareDialog.getLinkUrl();

        expect(url1).toEqual(url2);
      });

      it('Open Share dialog from context menu - [C286656]', async () => {
        await dataTable.rightClickOnItem(file7);
        await contextMenu.waitForMenuToOpen();
        await contextMenu.clickSharedLinkSettings();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.getTitle()).toEqual(`Share ${file7}`);
        expect(await shareDialog.getInfoText()).toEqual('Click the link below to copy it to the clipboard.');
        expect(await shareDialog.getLabels().get(0).getText()).toEqual('Link to share');
        expect(await shareDialog.getLinkUrl()).toContain(shareLinkPreUrl);
        expect(await shareDialog.isUrlReadOnly()).toBe('true', 'url is not readonly');
        expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
        expect(await shareDialog.getLabels().get(1).getText()).toEqual('Expires on');
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expire toggle is checked');
        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
      });
    });

    describe('from Favorites', () => {

      beforeAll(async (done) => {
        file1Id = (await apis.user.nodes.createFile(file1, parentId)).entry.id;
        file2Id = (await apis.user.nodes.createFile(file2, parentId)).entry.id;
        file3Id = (await apis.user.nodes.createFile(file3, parentId)).entry.id;
        file4Id = (await apis.user.nodes.createFile(file4, parentId)).entry.id;
        file5Id = (await apis.user.nodes.createFile(file5, parentId)).entry.id;
        file6Id = (await apis.user.nodes.createFile(file6, parentId)).entry.id;
        file7Id = (await apis.user.nodes.createFile(file7, parentId)).entry.id;
        file8Id = (await apis.user.nodes.createFile(file8, parentId)).entry.id;
        file9Id = (await apis.user.nodes.createFile(file9, parentId)).entry.id;

        await apis.user.favorites.addFavoriteById('file', file1Id);
        await apis.user.favorites.addFavoriteById('file', file2Id);
        await apis.user.favorites.addFavoriteById('file', file3Id);
        await apis.user.favorites.addFavoriteById('file', file4Id);
        await apis.user.favorites.addFavoriteById('file', file5Id);
        await apis.user.favorites.addFavoriteById('file', file6Id);
        await apis.user.favorites.addFavoriteById('file', file7Id);
        await apis.user.favorites.addFavoriteById('file', file8Id);
        await apis.user.favorites.addFavoriteById('file', file9Id);

        await apis.user.shared.shareFileById(file6Id, expiryDate);
        await apis.user.shared.shareFileById(file7Id, expiryDate);
        await apis.user.favorites.waitForApi({ expect: 9 });
        await apis.user.shared.waitForApi({ expect: 2 });
        done();
      });

      beforeEach(async (done) => {
        await page.clickFavoritesAndWait();
        done();
      });

      afterEach(async (done) => {
        await Utils.pressEscape();
        await page.clickPersonalFilesAndWait();
        done();
      });

      afterAll(async (done) => {
        await apis.user.nodes.deleteNodeById(file1Id);
        await apis.user.nodes.deleteNodeById(file2Id);
        await apis.user.nodes.deleteNodeById(file3Id);
        await apis.user.nodes.deleteNodeById(file4Id);
        await apis.user.nodes.deleteNodeById(file5Id);
        await apis.user.nodes.deleteNodeById(file6Id);
        await apis.user.nodes.deleteNodeById(file7Id);
        await apis.user.nodes.deleteNodeById(file8Id);
        await apis.user.nodes.deleteNodeById(file9Id);
        await apis.user.shared.waitForApi({ expect: 0 });
        done();
      });

      it('Share dialog default values - [C286666]', async () => {
        await dataTable.selectItem(file1);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.getTitle()).toEqual(`Share ${file1}`);
        expect(await shareDialog.getInfoText()).toEqual('Click the link below to copy it to the clipboard.');
        expect(await shareDialog.getLabels().get(0).getText()).toEqual('Link to share');
        expect(await shareDialog.getLinkUrl()).toContain(shareLinkPreUrl);
        expect(await shareDialog.isUrlReadOnly()).toBe('true', 'url is not readonly');
        expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
        expect(await shareDialog.getLabels().get(1).getText()).toEqual('Expires on');
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expire toggle is checked');
        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
      });

      it('Close dialog - [C286667]', async () => {
        await dataTable.selectItem(file2);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isCloseEnabled()).toBe(true, 'Close button is not enabled');
        await shareDialog.clickClose();
        expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog is open');
      });

      it('Share a file - [C286668]', async () => {
        await dataTable.selectItem(file3);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await Utils.pressEscape();
        const sharedId = await apis.user.nodes.getSharedId(file3Id);
        expect(await apis.user.nodes.isFileShared(file3Id)).toBe(true, `${file3} is not shared`);
        expect(url).toContain(sharedId);
      });

      it('Copy shared file URL - [C286669]', async () => {
        await dataTable.selectItem(file4);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();
        const url = await shareDialog.getLinkUrl();
        expect(url).toContain(shareLinkPreUrl);

        await shareDialog.copyUrl();
        expect(await page.getSnackBarMessage()).toBe('Link copied to the clipboard');

        await browser.get(url);
        expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
        expect(await viewer.getFileTitle()).toEqual(file4);

        await page.load();
      });

      it('Share a file with expiration date - [C286670]', async () => {
        await dataTable.selectItem(file5);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();

        await shareDialog.clickExpirationToggle();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expire toggle not checked');
        expect(await shareDialog.dateTimePicker.isCalendarOpen()).toBe(true, 'Calendar not opened');
        const date = await shareDialog.dateTimePicker.setDefaultDay();
        await shareDialog.dateTimePicker.waitForDateTimePickerToClose();

        const setDate = (`${date}`).replace(',', '');
        const inputDate = await shareDialog.getExpireDate();

        expect(new Date(inputDate)).toEqual(new Date(setDate));

        const expireDateProperty = await apis.user.nodes.getSharedExpiryDate(file5Id);

        expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
      });

      it('Expire date is displayed correctly - [C286671]', async () => {
        await dataTable.selectItem(file6);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();

        const expireProperty = await apis.user.nodes.getSharedExpiryDate(file6Id);
        expect(expireProperty).toEqual(expiryDate);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(Utils.formatDate(await shareDialog.getExpireDate())).toEqual(Utils.formatDate(expiryDate));
      });

      it('Disable the share link expiration - [C286672]', async () => {
        await dataTable.selectItem(file7);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(await shareDialog.getExpireDate()).not.toBe('', 'Expire date input is empty');

        await shareDialog.clickExpirationToggle();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expiration is checked');
        expect(await shareDialog.getExpireDate()).toBe('', 'Expire date input is not empty');

        await shareDialog.clickClose();
        expect(await apis.user.nodes.getSharedExpiryDate(file7Id)).toBe('', `${file7} link still has expiration`);
      });

      it('Shared file URL is not changed when Share dialog is closed and opened again - [C286673]', async () => {
        await dataTable.selectItem(file8);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();
        const url1 = await shareDialog.getLinkUrl();
        await shareDialog.clickClose();
        await shareDialog.waitForDialogToClose();

        await page.dataTable.clearSelection();
        await dataTable.selectItem(file8);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();
        const url2 = await shareDialog.getLinkUrl();

        expect(url1).toEqual(url2);
      });

      it('Share a file from the context menu - [C286674]', async () => {
        await dataTable.rightClickOnItem(file9);
        await contextMenu.waitForMenuToOpen();
        await contextMenu.clickShare();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await Utils.pressEscape();
        const sharedId = await apis.user.nodes.getSharedId(file9Id);
        expect(await apis.user.nodes.isFileShared(file9Id)).toBe(true, `${file9} is not shared`);
        expect(url).toContain(sharedId);
      });
    });

    describe('from Search Results', () => {

      file3 = `search-file3-${Utils.random()}.txt`;
      file5 = `search-file5-${Utils.random()}.txt`;
      file6 = `search-file6-${Utils.random()}.txt`;
      file7 = `search-file7-${Utils.random()}.txt`;
      file9 = `search-file9-${Utils.random()}.txt`;

      beforeAll(async (done) => {
        file3Id = (await apis.user.nodes.createFile(file3, parentId)).entry.id;
        file5Id = (await apis.user.nodes.createFile(file5, parentId)).entry.id;
        file6Id = (await apis.user.nodes.createFile(file6, parentId)).entry.id;
        file7Id = (await apis.user.nodes.createFile(file7, parentId)).entry.id;
        file9Id = (await apis.user.nodes.createFile(file9, parentId)).entry.id;
        await apis.user.shared.shareFileById(file6Id, expiryDate);
        await apis.user.shared.shareFileById(file7Id, expiryDate);
        await apis.user.shared.waitForApi({ expect: 2 });
        await apis.user.search.waitForNodes('search-f', { expect: 5 });
        done();
      });

      beforeEach(async done => {
        await searchInput.clickSearchButton();
        await searchInput.checkFilesAndFolders();
        await searchInput.searchFor('search-f');
        await dataTable.waitForBody();
        done();
      });

      afterEach(async (done) => {
        await Utils.pressEscape();
        await page.clickPersonalFilesAndWait();
        done();
      });

      afterAll(async (done) => {
        await apis.user.nodes.deleteNodeById(file3Id);
        await apis.user.nodes.deleteNodeById(file5Id);
        await apis.user.nodes.deleteNodeById(file6Id);
        await apis.user.nodes.deleteNodeById(file7Id);
        await apis.user.nodes.deleteNodeById(file9Id);
        await apis.user.shared.waitForApi({ expect: 0 });
        done();
      });

      it('Share a file - [C306975]', async () => {
        await dataTable.selectItem(file3);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await Utils.pressEscape();
        const sharedId = await apis.user.nodes.getSharedId(file3Id);
        expect(await apis.user.nodes.isFileShared(file3Id)).toBe(true, `${file3} is not shared`);
        expect(url).toContain(sharedId);
      });

      it('Share a file with expiration date - [C306977]', async () => {
        await dataTable.selectItem(file5);
        await toolbar.clickShare();
        await shareDialog.waitForDialogToOpen();

        await shareDialog.clickExpirationToggle();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expire toggle not checked');
        expect(await shareDialog.dateTimePicker.isCalendarOpen()).toBe(true, 'Calendar not opened');
        const date = await shareDialog.dateTimePicker.setDefaultDay();
        await shareDialog.dateTimePicker.waitForDateTimePickerToClose();

        const setDate = (`${date}`).replace(',', '');
        const inputDate = await shareDialog.getExpireDate();

        expect(new Date(inputDate)).toEqual(new Date(setDate));

        const expireDateProperty = await apis.user.nodes.getSharedExpiryDate(file5Id);

        expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
      });

      it('Expire date is displayed correctly - [C306978]', async () => {
        await dataTable.selectItem(file6);
        await toolbar.clickSharedLinkSettings();
        await shareDialog.waitForDialogToOpen();

        const expireProperty = await apis.user.nodes.getSharedExpiryDate(file6Id);
        expect(expireProperty).toEqual(expiryDate);
        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(Utils.formatDate(await shareDialog.getExpireDate())).toEqual(Utils.formatDate(expiryDate));
      });

      it('Disable the share link expiration - [C306979]', async () => {
        await dataTable.selectItem(file7);
        await toolbar.clickSharedLinkSettings();
        await shareDialog.waitForDialogToOpen();

        expect(await shareDialog.isExpireToggleEnabled()).toBe(true, 'Expiration is not checked');
        expect(await shareDialog.getExpireDate()).not.toBe('', 'Expire date input is empty');

        await shareDialog.clickExpirationToggle();
        expect(await shareDialog.isExpireToggleEnabled()).toBe(false, 'Expiration is checked');
        expect(await shareDialog.getExpireDate()).toBe('', 'Expire date input is not empty');

        await shareDialog.clickClose();
        expect(await apis.user.nodes.getSharedExpiryDate(file7Id)).toBe('', `${file7} link still has expiration`);
      });

      it('Share a file from the context menu - [C306981]', async () => {
        await dataTable.rightClickOnItem(file9);
        await contextMenu.waitForMenuToOpen();
        await contextMenu.clickShare();
        await shareDialog.waitForDialogToOpen();

        const url = await shareDialog.getLinkUrl();
        await Utils.pressEscape();
        const sharedId = await apis.user.nodes.getSharedId(file9Id);
        expect(await apis.user.nodes.isFileShared(file9Id)).toBe(true, `${file9} is not shared`);
        expect(url).toContain(sharedId);
      });
    });
  })
});
