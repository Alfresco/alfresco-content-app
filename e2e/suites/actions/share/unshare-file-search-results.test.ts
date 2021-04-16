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
  SITE_ROLES,
  RepoClient,
  ShareDialog,
  ConfirmDialog,
  Viewer,
  Utils
} from '@alfresco/aca-testing-shared';
import { BrowserActions, Logger } from '@alfresco/adf-testing';

describe('Unshare a file from Search Results', () => {
  const username = `user-${Utils.random()}`;

  const parent = `parent-${Utils.random()}`;
  let parentId: string;

  const searchRandom = Utils.random();
  const file1 = `search-file-${searchRandom}-1.txt`;
  let file1Id: string;
  const file2 = `search-file-${searchRandom}-2.txt`;
  let file2Id: string;
  const file3 = `search-file-${searchRandom}-3.txt`;
  let file3Id: string;
  const file4 = `search-file-${searchRandom}-4.txt`;
  let file4Id: string;

  const sitePrivate = `site-private-${Utils.random()}`;

  const fileSite1 = `search-file-${searchRandom}-Site1.txt`;
  let fileSite1Id: string;
  const fileSite2 = `search-file-${searchRandom}-Site2.txt`;
  let fileSite2Id: string;

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const shareDialog = new ShareDialog();
  const confirmDialog = new ConfirmDialog();
  const contextMenu = dataTable.menu;
  const viewer = new Viewer();
  const { searchInput } = page.header;

  const adminApiActions = new AdminActions();
  const userActions = new UserActions();

  beforeAll(async (done) => {
    try {
      await adminApiActions.createUser({ username });

      parentId = (await apis.user.nodes.createFolder(parent)).entry.id;

      file1Id = (await apis.user.nodes.createFile(file1, parentId)).entry.id;
      file2Id = (await apis.user.nodes.createFile(file2, parentId)).entry.id;
      file3Id = (await apis.user.nodes.createFile(file3, parentId)).entry.id;
      file4Id = (await apis.user.nodes.createFile(file4, parentId)).entry.id;

      await adminApiActions.login();
      await adminApiActions.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE);
      const docLibId = await adminApiActions.sites.getDocLibId(sitePrivate);

      fileSite1Id = (await adminApiActions.nodes.createFile(fileSite1, docLibId)).entry.id;
      fileSite2Id = (await adminApiActions.nodes.createFile(fileSite2, docLibId)).entry.id;

      await adminApiActions.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_CONSUMER.ROLE);

      await adminApiActions.shareNodes([fileSite1Id]);
      await adminApiActions.shared.waitForFilesToBeShared([fileSite1Id]);

      await userActions.login(username, username);
      await userActions.shareNodes([file1Id, file2Id, file3Id, file4Id, fileSite2Id]);
      await apis.user.shared.waitForFilesToBeShared([file1Id, file2Id, file3Id, file4Id, fileSite2Id]);

      await apis.user.search.waitForNodes(`search-file-${searchRandom}`, { expect: 6 });

      await loginPage.loginWith(username);
    } catch (error) {
      Logger.error(`----- beforeAll failed : ${error}`);
    }
    done();
  });

  afterAll(async () => {
    await apis.user.nodes.deleteNodeById(parentId);
    await adminApiActions.sites.deleteSite(sitePrivate);
  });

  afterEach(async () => {
    await page.closeOpenDialogs();
    await page.clickPersonalFilesAndWait();
  });

  it('[C306995] Unshare dialog UI', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(file1);
    await dataTable.waitForBody();

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

  it('[C306996] Unshare a file', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(file2);
    await dataTable.waitForBody();

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
    expect(await apis.user.nodes.isFileShared(file2Id)).toBe(false, `${file2} is shared`);

    await browser.get(url);
    expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
    expect(await viewer.getFileTitle()).not.toEqual(file2);

    await page.load();
  });

  it('[C306997] Cancel the Unshare action', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(file3);
    await dataTable.waitForBody();

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

  it('[C306999] Unshare a file from the context menu', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(file4);
    await dataTable.waitForBody();

    await dataTable.rightClickOnItem(file4);
    await contextMenu.waitForMenuToOpen();
    await BrowserActions.click(contextMenu.shareEditAction);
    await shareDialog.waitForDialogToOpen();
    const url = await shareDialog.getLinkUrl();
    await BrowserActions.click(shareDialog.shareToggle);
    await confirmDialog.waitForDialogToOpen();

    await confirmDialog.removeButton.click();
    await confirmDialog.waitForDialogToClose();
    await shareDialog.waitForDialogToClose();
    expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
    expect(await apis.user.nodes.isFileShared(file4Id)).toBe(false, `${file4} is shared`);

    await browser.get(url);
    expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
    expect(await viewer.getFileTitle()).not.toEqual(file4);

    await page.load();
  });

  it('[C306998] Consumer - on Search Results - file shared by other user', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(fileSite1);
    await dataTable.waitForBody();
    await dataTable.selectItem(fileSite1);
    await BrowserActions.click(toolbar.shareEditButton);
    await shareDialog.waitForDialogToOpen();

    expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle disabled for consumer');

    await BrowserActions.click(shareDialog.shareToggle);
    await confirmDialog.waitForDialogToOpen();
    await confirmDialog.removeButton.click();

    const msg = await page.getSnackBarMessage();
    expect(msg).toContain(`You don't have permission to unshare this file`);
  });

  it('[C307000] Consumer - on Search Results - file shared by the user', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(fileSite2);
    await dataTable.waitForBody();
    await dataTable.selectItem(fileSite2);
    await BrowserActions.click(toolbar.shareEditButton);
    await shareDialog.waitForDialogToOpen();

    expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle disabled for consumer');

    await BrowserActions.click(shareDialog.shareToggle);
    await confirmDialog.waitForDialogToOpen();
    await confirmDialog.removeButton.click();
    await confirmDialog.waitForDialogToClose();
    await shareDialog.waitForDialogToClose();

    expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
    expect(await apis.user.nodes.isFileShared(fileSite2Id)).toBe(false, `${fileSite2} is shared`);
  });
});
