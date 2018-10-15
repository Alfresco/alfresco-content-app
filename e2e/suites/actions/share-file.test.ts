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

import { protractor, browser } from 'protractor';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { SIDEBAR_LABELS, SITE_VISIBILITY, SITE_ROLES, FILES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { ShareDialog } from '../../components/dialog/share-dialog';
import { Utils } from '../../utilities/utils';

fdescribe('Share a file', () => {
  const username = `user-${Utils.random()}`;
  console.log('===> username: ', username);

  const parent = `parent-${Utils.random()}`; let parentId;

  const file = `filePF-${Utils.random()}.txt`; let fileId;
  console.log('===> file: ', file);

  const docxFile = FILES.docxFile;

  const docxPersonalFiles = `docxPF-${Utils.random()}.docx`; let docxFileId;



  // const siteName = `site-${Utils.random()}`;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const logoutPage = new LogoutPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const shareDialog = new ShareDialog();

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    // await apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PRIVATE);
    // const docLibId = await apis.admin.sites.getDocLibId(siteName);
    // await apis.admin.nodes.createFolder(folderName, docLibId);
    // await apis.admin.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_CONSUMER);

    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
    await apis.user.nodes.createFile(file, parentId);

    docxFileId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, docxPersonalFiles)).entry.id;

    await loginPage.loginWith(username);
    done();
  });

  beforeEach(async (done) => {
    // await personalFilesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
    // await dataTable.waitForHeader();
    // await dataTable.doubleClickOnRowByName(parent);
    // await dataTable.waitForHeader();
    done();
  });

  afterEach(async (done) => {
    await Utils.pressEscape();
    done();
  });

  afterAll(async (done) => {
    await Promise.all([
    //   apis.admin.sites.deleteSite(siteName),
      // apis.user.nodes.deleteNodeById(parentId),
      logoutPage.load()
    ]);
    done();
  });

  it('Share dialog default values - []', async () => {
    await dataTable.doubleClickOnRowByName(parent);
    await dataTable.selectItem(file);
    await toolbar.openMoreMenu();
    await toolbar.menu.clickMenuItem('Share');
    await shareDialog.waitForDialogToOpen();

    await browser.sleep(3000);
    let log = await Utils.getBrowserLog();
    console.log('====> log: ', log);

    await Utils.pressEscape();
    await browser.refresh();
    await dataTable.selectItem(docxPersonalFiles);
    await toolbar.openMoreMenu();
    await toolbar.menu.clickMenuItem('Share');
    await shareDialog.waitForDialogToOpen();

    await browser.sleep(3000);
    log = await Utils.getBrowserLog();
    console.log('====> log: ', log);

    // expect(await shareDialog.getTitle()).toEqual(`Share ${file}`);
    // expect(await shareDialog.getInfoText()).toEqual('Click the link below to copy it to the clipboard.');
    // expect(await shareDialog.getLabels().get(0).getText()).toEqual('Link to share');
    // expect(await shareDialog.getLinkUrl()).toEqual('blah');
    // expect(await shareDialog.isUrlReadOnly()).toBe('true', 'url is not readonly');
    // expect(await shareDialog.isShareToggleEnabled()).toBe('true', 'Share toggle not checked');
    // expect(await shareDialog.getLabels().get(1).getText()).toEqual('Expires on');
    // expect(await shareDialog.closeButton.isEnabled()).toBe(true, 'Close button is not enabled');

  });

//   it('[C286549] Share toggle button is checked automatically', () => {
//     contentListPage.clickRowToSelect(pngFileModel.name);
//     contentServicesPage.clickShareButton();
//     shareDialog.checkDialogIsDisplayed();
//     shareDialog.shareToggleButtonIsChecked();
// });

// it('[C286544] Copy shared link button action shows notification', () => {
//     contentListPage.clickRowToSelect(pngFileModel.name);
//     contentServicesPage.clickShareButton();
//     shareDialog.checkDialogIsDisplayed();
//     shareDialog.clickShareLinkButton();
//     shareDialog.checkNotificationWithMessage('Link copied to the clipboard');
// });

// it('[C286328] User can close the Share dialog', () => {
//     contentListPage.clickRowToSelect(pngFileModel.name);
//     contentServicesPage.clickShareButton();
//     shareDialog.checkDialogIsDisplayed();
//     shareDialog.checkShareLinkIsDisplayed();
//     shareDialog.clickCloseButton();
//     shareDialog.dialogIsClosed();
// });

// it('[C286578] Expiration day calendar should have today day option disabled', () => {
//     contentListPage.clickRowToSelect(pngFileModel.name);
//     contentServicesPage.clickShareButton();
//     shareDialog.checkDialogIsDisplayed();
//     shareDialog.clickDateTimePickerButton();
//     shareDialog.calendarTodayDayIsDisabled();
// });

// it('[C286548] User can set when the shared file link expires', async () => {
//     contentListPage.clickRowToSelect(pngFileModel.name);
//     contentServicesPage.clickShareButton();
//     shareDialog.checkDialogIsDisplayed();
//     shareDialog.clickDateTimePickerButton();
//     shareDialog.setDefaultDay();
//     shareDialog.setDefaultHour();
//     shareDialog.setDefaultMinutes();
//     shareDialog.dateTimePickerDialogIsClosed();
//     const value = await shareDialog.getExpirationDate();
//     shareDialog.clickCloseButton();
//     shareDialog.dialogIsClosed();
//     contentServicesPage.clickShareButton();
//     shareDialog.checkDialogIsDisplayed();
//     shareDialog.expirationDateInputHasValue(value);
// });
// });

// describe('Shared link preview', () => {
// afterEach(async (done) => {
//     await loginPage.loginToContentServicesUsingUserModel(acsUser);
//     await contentServicesPage.navigateToDocumentList();
//     done();
// });

// it('[C286565] Logged user can open shared link', async () => {
//     contentListPage.clickRowToSelect(pngFileModel.name);
//     contentServicesPage.clickShareButton();
//     shareDialog.checkDialogIsDisplayed();
//     shareDialog.clickShareLinkButton();
//     shareDialog.checkNotificationWithMessage('Link copied to the clipboard');
//     const sharedLink = await shareDialog.getShareLink();
//     browser.get(sharedLink);
//     viewerPage.checkFileNameIsDisplayed(pngFileModel.name);
// });

// it('[C286539] A non-logged user should see the shared file in the viewer', async () => {
//     contentListPage.clickRowToSelect(pngFileModel.name);
//     contentServicesPage.clickShareButton();
//     shareDialog.checkDialogIsDisplayed();
//     shareDialog.checkShareLinkIsDisplayed();
//     const sharedLink = await shareDialog.getShareLink();
//     shareDialog.clickCloseButton();
//     navigationBarPage.clickLogoutButton();
//     browser.get(sharedLink);
//     viewerPage.checkFileNameIsDisplayed(pngFileModel.name);
// });

});
