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
import { SITE_VISIBILITY, SITE_ROLES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { ShareDialog } from '../../components/dialog/share-dialog';
import { ConfirmDialog } from '../../components/dialog/confirm-dialog';
import { Viewer } from '../../components/viewer/viewer';
import { Utils } from '../../utilities/utils';

describe('Unshare a file from Search Results', () => {
  const username = `user-${Utils.random()}`;

  const parent = `parent-${Utils.random()}`; let parentId;

  const file1 = `search-file1-${Utils.random()}.txt`; let file1Id;
  const file2 = `search-file2-${Utils.random()}.txt`; let file2Id;
  const file3 = `search-file3-${Utils.random()}.txt`; let file3Id;
  const file4 = `search-file4-${Utils.random()}.txt`; let file4Id;

  const sitePrivate = `site-private-${Utils.random()}`;

  const fileSite1 = `search-fileSite1-${Utils.random()}.txt`; let fileSite1Id;
  const fileSite2 = `search-fileSite2-${Utils.random()}.txt`; let fileSite2Id;

  const apis = {
    admin: new RepoClient(),
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

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;

    file1Id = (await apis.user.nodes.createFile(file1, parentId)).entry.id;
    file2Id = (await apis.user.nodes.createFile(file2, parentId)).entry.id;
    file3Id = (await apis.user.nodes.createFile(file3, parentId)).entry.id;
    file4Id = (await apis.user.nodes.createFile(file4, parentId)).entry.id;

    await apis.user.shared.shareFileById(file1Id);
    await apis.user.shared.shareFileById(file2Id);
    await apis.user.shared.shareFileById(file3Id);
    await apis.user.shared.shareFileById(file4Id);

    await apis.admin.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE);
    const docLibId = await apis.admin.sites.getDocLibId(sitePrivate);

    fileSite1Id = (await apis.admin.nodes.createFile(fileSite1, docLibId)).entry.id;
    fileSite2Id = (await apis.admin.nodes.createFile(fileSite2, docLibId)).entry.id;

    await apis.admin.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_CONSUMER.ROLE);

    await apis.admin.shared.shareFileById(fileSite1Id);
    await apis.user.shared.shareFileById(fileSite2Id);

    await apis.user.shared.waitForApi({ expect: 6 });
    await apis.user.search.waitForNodes('search-file', { expect: 6 });

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(parentId);
    await apis.admin.sites.deleteSite(sitePrivate);
    done();
  });

  afterEach(async (done) => {
    await page.closeOpenDialogs();
    await page.clickPersonalFilesAndWait();
    done();
  });

  it('Unshare dialog UI - [C306995]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(file1);
    await dataTable.waitForBody();

    await dataTable.selectItem(file1);
    await toolbar.clickSharedLinkSettings();
    await shareDialog.waitForDialogToOpen();

    expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
    await shareDialog.clickShareToggle();

    expect(await confirmDialog.isDialogOpen()).toBe(true, 'Unshare dialog is not open');
    expect(await confirmDialog.getTitle()).toContain('Remove this shared link');
    expect(await confirmDialog.getText()).toContain('This link will be deleted and a new link will be created next time this file is shared');
    expect(await confirmDialog.isRemoveEnabled()).toBe(true, 'REMOVE button is not enabled');
    expect(await confirmDialog.isCancelEnabled()).toBe(true, 'CANCEL button is not enabled');
  });

  it('Unshare a file - [C306996]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(file2);
    await dataTable.waitForBody();

    await dataTable.selectItem(file2);
    await toolbar.clickSharedLinkSettings();
    await shareDialog.waitForDialogToOpen();
    const url = await shareDialog.getLinkUrl();
    await shareDialog.clickShareToggle();

    await confirmDialog.clickRemove();
    await confirmDialog.waitForDialogToClose();
    await shareDialog.waitForDialogToClose();
    expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
    expect(await apis.user.nodes.isFileShared(file2Id)).toBe(false, `${file2} is shared`);

    await browser.get(url);
    expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
    expect(await viewer.getFileTitle()).not.toEqual(file2);

    await page.load();
  });

  it('Cancel the Unshare action - [C306997]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(file3);
    await dataTable.waitForBody();

    await dataTable.selectItem(file3);
    await toolbar.clickSharedLinkSettings();
    await shareDialog.waitForDialogToOpen();

    const urlBefore = await shareDialog.getLinkUrl();
    await shareDialog.clickShareToggle();

    await confirmDialog.clickCancel();
    await confirmDialog.waitForDialogToClose();
    expect(await shareDialog.isDialogOpen()).toBe(true, 'Share dialog not open');
    expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle is off');

    const urlAfter = await shareDialog.getLinkUrl();
    expect(urlBefore).toEqual(urlAfter);
  });

  it('Unshare a file from the context menu - [C306999]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(file4);
    await dataTable.waitForBody();

    await dataTable.rightClickOnItem(file4);
    await contextMenu.waitForMenuToOpen();
    await contextMenu.clickSharedLinkSettings();
    await shareDialog.waitForDialogToOpen();
    const url = await shareDialog.getLinkUrl();
    await shareDialog.clickShareToggle();

    await confirmDialog.clickRemove();
    await confirmDialog.waitForDialogToClose();
    await shareDialog.waitForDialogToClose();
    expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
    expect(await apis.user.nodes.isFileShared(file4Id)).toBe(false, `${file4} is shared`);

    await browser.get(url);
    expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
    expect(await viewer.getFileTitle()).not.toEqual(file4);

    await page.load();
  });

  it('Consumer - on Search Results - file shared by other user - [C306998]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(fileSite1);
    await dataTable.waitForBody();
    await dataTable.selectItem(fileSite1);
    await toolbar.clickSharedLinkSettings();
    await shareDialog.waitForDialogToOpen();

    expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle disabled for consumer');

    await shareDialog.clickShareToggle();
    await confirmDialog.clickRemove();

    const msg = await page.getSnackBarMessage();
    expect(msg).toContain(`You don't have permission to unshare this file`);
  });

  it('Consumer - on Search Results - file shared by the user - [C307000]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(fileSite2);
    await dataTable.waitForBody();
    await dataTable.selectItem(fileSite2);
    await toolbar.clickSharedLinkSettings();
    await shareDialog.waitForDialogToOpen();

    expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle disabled for consumer');

    await shareDialog.clickShareToggle();
    await confirmDialog.clickRemove();
    await confirmDialog.waitForDialogToClose();
    await shareDialog.waitForDialogToClose();

    expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
    expect(await apis.user.nodes.isFileShared(fileSite2Id)).toBe(false, `${fileSite2} is shared`);
  });

});
