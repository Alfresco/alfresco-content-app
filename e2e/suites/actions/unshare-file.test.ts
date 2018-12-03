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

import { browser } from 'protractor';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { SITE_VISIBILITY, SITE_ROLES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { ShareDialog } from '../../components/dialog/share-dialog';
import { ConfirmDialog } from '../../components/dialog/confirm-dialog';
import { Viewer } from '../../components/viewer/viewer';
import { Utils } from '../../utilities/utils';

describe('Unshare a file', () => {
  const username = `user-${Utils.random()}`;

  const parent = `parent-${Utils.random()}`; let parentId;

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

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(parentId);
    done();
  });

  describe('from Personal Files', () => {

    const file1 = `file1-${Utils.random()}.txt`; let file1Id;
    const file2 = `file2-${Utils.random()}.txt`; let file2Id;
    const file3 = `file3-${Utils.random()}.txt`; let file3Id;
    const file4 = `file4-${Utils.random()}.txt`; let file4Id;

    beforeAll(async (done) => {
      file1Id = (await apis.user.nodes.createFile(file1, parentId)).entry.id;
      file2Id = (await apis.user.nodes.createFile(file2, parentId)).entry.id;
      file3Id = (await apis.user.nodes.createFile(file3, parentId)).entry.id;
      file4Id = (await apis.user.nodes.createFile(file4, parentId)).entry.id;
      await apis.user.shared.shareFileById(file1Id);
      await apis.user.shared.shareFileById(file2Id);
      await apis.user.shared.shareFileById(file3Id);
      await apis.user.shared.shareFileById(file4Id);
      await apis.user.shared.waitForApi({ expect: 4 });
      done();
    });

    beforeEach(async (done) => {
      await page.refresh();
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
      await apis.user.shared.waitForApi({ expect: 0 });
      done();
    });

    it('Unshare dialog UI - [C286339]', async () => {
      await dataTable.selectItem(file1);
      await toolbar.clickShareEditButton();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
      await shareDialog.clickShareToggle();

      expect(await confirmDialog.isDialogOpen()).toBe(true, 'Unshare dialog is not open');
      expect(await confirmDialog.getTitle()).toContain('Remove this shared link');
      expect(await confirmDialog.getText()).toContain('This link will be deleted and a new link will be created next time this file is shared');
      expect(await confirmDialog.isButtonEnabled('Remove')).toBe(true, 'REMOVE button is not enabled');
      expect(await confirmDialog.isButtonEnabled('Cancel')).toBe(true, 'CANCEL button is not enabled');
    });

    it('Unshare a file - [C286340]', async () => {
      await dataTable.selectItem(file2);
      await toolbar.clickShareEditButton();
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await shareDialog.clickShareToggle();

      await confirmDialog.clickButton('Remove');
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await apis.user.nodes.isFileShared(file2Id)).toBe(false, `${file2} is shared`);

      // TODO: disable check cause api is slow to update
      // await page.clickSharedFiles();
      // expect(await dataTable.getRowByName(file2).isPresent()).toBe(false, `${file2} is in the Shared files list`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file2);

      await page.load();
    });

    it('Cancel the Unshare action - [C286341]', async () => {
      await dataTable.selectItem(file3);
      await toolbar.clickShareEditButton();
      await shareDialog.waitForDialogToOpen();

      const urlBefore = await shareDialog.getLinkUrl();
      await shareDialog.clickShareToggle();

      await confirmDialog.clickButton('Cancel');
      await confirmDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Share dialog not open');
      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle is off');

      const urlAfter = await shareDialog.getLinkUrl();
      expect(urlBefore).toEqual(urlAfter);
    });

    it('Unshare a file from the context menu - [C286359]', async () => {
      await dataTable.rightClickOnItem(file4);
      await contextMenu.clickShareEditAction();
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await shareDialog.clickShareToggle();

      await confirmDialog.clickButton('Remove');
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await apis.user.nodes.isFileShared(file4Id)).toBe(false, `${file4} is shared`);

      // TODO: disable check cause api is slow to update
      // await page.clickSharedFiles();
      // expect(await dataTable.getRowByName(file4).isPresent()).toBe(false, `${file4} is in the Shared files list`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file4);

      await page.load();
    });
  });

  describe('from File Libraries', () => {

    const file1 = `file1-${Utils.random()}.txt`; let file1Id;
    const file2 = `file2-${Utils.random()}.txt`; let file2Id;
    const file3 = `file3-${Utils.random()}.txt`; let file3Id;
    const file4 = `file4-${Utils.random()}.txt`; let file4Id;

    const siteName = `site-${Utils.random()}`;
    const parentInSite = `parent-site-${Utils.random()}`; let parentInSiteId;

    beforeAll(async (done) => {
      await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
      const docLibId = await apis.user.sites.getDocLibId(siteName);
      parentInSiteId = (await apis.user.nodes.createFolder(parentInSite, docLibId)).entry.id;

      file1Id = (await apis.user.nodes.createFile(file1, parentInSiteId)).entry.id;
      file2Id = (await apis.user.nodes.createFile(file2, parentInSiteId)).entry.id;
      file3Id = (await apis.user.nodes.createFile(file3, parentInSiteId)).entry.id;
      file4Id = (await apis.user.nodes.createFile(file4, parentInSiteId)).entry.id;
      await apis.user.shared.shareFileById(file1Id);
      await apis.user.shared.shareFileById(file2Id);
      await apis.user.shared.shareFileById(file3Id);
      await apis.user.shared.shareFileById(file4Id);
      await apis.user.shared.waitForApi({ expect: 4 });
      done();
    });

    beforeEach(async (done) => {
      await page.refresh();
      await page.clickFileLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.waitForHeader();
      await dataTable.doubleClickOnRowByName(parentInSite);
      await dataTable.waitForHeader();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    afterAll(async (done) => {
      await apis.admin.sites.deleteSite(siteName);
      await apis.user.shared.waitForApi({ expect: 0 });
      done();
    });

    it('Unshare dialog UI - [C286679]', async () => {
      await dataTable.selectItem(file1);
      await toolbar.clickShareEditButton();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
      await shareDialog.clickShareToggle();

      expect(await confirmDialog.isDialogOpen()).toBe(true, 'Unshare dialog is not open');
      expect(await confirmDialog.getTitle()).toContain('Remove this shared link');
      expect(await confirmDialog.getText()).toContain('This link will be deleted and a new link will be created next time this file is shared');
      expect(await confirmDialog.isButtonEnabled('Remove')).toBe(true, 'REMOVE button is not enabled');
      expect(await confirmDialog.isButtonEnabled('Cancel')).toBe(true, 'CANCEL button is not enabled');
    });

    it('Unshare a file - [C286680]', async () => {
      await dataTable.selectItem(file2);
      await toolbar.clickShareEditButton();
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await shareDialog.clickShareToggle();

      await confirmDialog.clickButton('Remove');
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await apis.user.nodes.isFileShared(file2Id)).toBe(false, `${file2} is shared`);

      // TODO: disable check cause api is slow to update
      // await page.clickSharedFiles();
      // expect(await dataTable.getRowByName(file2).isPresent()).toBe(false, `${file2} is in the Shared files list`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file2);

      await page.load();
    });

    it('Cancel the Unshare action - [C286681]', async () => {
      await dataTable.selectItem(file3);
      await toolbar.clickShareEditButton();
      await shareDialog.waitForDialogToOpen();

      const urlBefore = await shareDialog.getLinkUrl();
      await shareDialog.clickShareToggle();

      await confirmDialog.clickButton('Cancel');
      await confirmDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Share dialog not open');
      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle is off');

      const urlAfter = await shareDialog.getLinkUrl();
      expect(urlBefore).toEqual(urlAfter);
    });

    it('Unshare a file from the context menu - [C286683]', async () => {
      await dataTable.rightClickOnItem(file4);
      await contextMenu.clickShareEditAction();
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await shareDialog.clickShareToggle();

      await confirmDialog.clickButton('Remove');
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await apis.user.nodes.isFileShared(file4Id)).toBe(false, `${file4} is shared`);

      // TODO: disable check cause api is slow to update
      // await page.clickSharedFiles();
      // expect(await dataTable.getRowByName(file4).isPresent()).toBe(false, `${file4} is in the Shared files list`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file4);

      await page.load();
    });
  });

  describe('from Recent Files', () => {

    const file1 = `file1-${Utils.random()}.txt`; let file1Id;
    const file2 = `file2-${Utils.random()}.txt`; let file2Id;
    const file3 = `file3-${Utils.random()}.txt`; let file3Id;
    const file4 = `file4-${Utils.random()}.txt`; let file4Id;

    beforeAll(async (done) => {
      file1Id = (await apis.user.nodes.createFile(file1, parentId)).entry.id;
      file2Id = (await apis.user.nodes.createFile(file2, parentId)).entry.id;
      file3Id = (await apis.user.nodes.createFile(file3, parentId)).entry.id;
      file4Id = (await apis.user.nodes.createFile(file4, parentId)).entry.id;
      await apis.user.shared.shareFileById(file1Id);
      await apis.user.shared.shareFileById(file2Id);
      await apis.user.shared.shareFileById(file3Id);
      await apis.user.shared.shareFileById(file4Id);
      await apis.user.shared.waitForApi({ expect: 4 });
      done();
    });

    beforeEach(async (done) => {
      await page.refresh();
      await page.clickRecentFilesAndWait();
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
      await apis.user.shared.waitForApi({ expect: 0 });
      done();
    });

    it('Unshare dialog UI - [C286689]', async () => {
      await dataTable.selectItem(file1);
      await toolbar.clickShareEditButton();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
      await shareDialog.clickShareToggle();

      expect(await confirmDialog.isDialogOpen()).toBe(true, 'Unshare dialog is not open');
      expect(await confirmDialog.getTitle()).toContain('Remove this shared link');
      expect(await confirmDialog.getText()).toContain('This link will be deleted and a new link will be created next time this file is shared');
      expect(await confirmDialog.isButtonEnabled('Remove')).toBe(true, 'REMOVE button is not enabled');
      expect(await confirmDialog.isButtonEnabled('Cancel')).toBe(true, 'CANCEL button is not enabled');
    });

    it('Unshare a file - [C286690]', async () => {
      await dataTable.selectItem(file2);
      await toolbar.clickShareEditButton();
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await shareDialog.clickShareToggle();

      await confirmDialog.clickButton('Remove');
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await apis.user.nodes.isFileShared(file2Id)).toBe(false, `${file2} is shared`);

      // TODO: disable check cause api is slow to update
      // await page.clickSharedFiles();
      // expect(await dataTable.getRowByName(file2).isPresent()).toBe(false, `${file2} is in the Shared files list`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file2);

      await page.load();
    });

    it('Cancel the Unshare action - [C286691]', async () => {
      await dataTable.selectItem(file3);
      await toolbar.clickShareEditButton();
      await shareDialog.waitForDialogToOpen();

      const urlBefore = await shareDialog.getLinkUrl();
      await shareDialog.clickShareToggle();

      await confirmDialog.clickButton('Cancel');
      await confirmDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Share dialog not open');
      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle is off');

      const urlAfter = await shareDialog.getLinkUrl();
      expect(urlBefore).toEqual(urlAfter);
    });

    it('Unshare a file from the context menu - [C286693]', async () => {
      await dataTable.rightClickOnItem(file4);
      await contextMenu.clickShareEditAction();
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await shareDialog.clickShareToggle();

      await confirmDialog.clickButton('Remove');
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await apis.user.nodes.isFileShared(file4Id)).toBe(false, `${file4} is shared`);

      // TODO: disable check cause api is slow to update
      // await page.clickSharedFiles();
      // expect(await dataTable.getRowByName(file4).isPresent()).toBe(false, `${file4} is in the Shared files list`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file4);

      await page.load();
    });
  });

  describe('from Shared Files', () => {

    const file1 = `file1-${Utils.random()}.txt`; let file1Id;
    const file2 = `file2-${Utils.random()}.txt`; let file2Id;
    const file3 = `file3-${Utils.random()}.txt`; let file3Id;
    const file4 = `file4-${Utils.random()}.txt`; let file4Id;

    beforeAll(async (done) => {
      file1Id = (await apis.user.nodes.createFile(file1, parentId)).entry.id;
      file2Id = (await apis.user.nodes.createFile(file2, parentId)).entry.id;
      file3Id = (await apis.user.nodes.createFile(file3, parentId)).entry.id;
      file4Id = (await apis.user.nodes.createFile(file4, parentId)).entry.id;
      await apis.user.shared.shareFileById(file1Id);
      await apis.user.shared.shareFileById(file2Id);
      await apis.user.shared.shareFileById(file3Id);
      await apis.user.shared.shareFileById(file4Id);
      await apis.user.shared.waitForApi({ expect: 4 });
      done();
    });

    beforeEach(async (done) => {
      await page.refresh();
      await page.clickSharedFilesAndWait();
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
      await apis.user.shared.waitForApi({ expect: 0 });
      done();
    });

    it('Unshare dialog UI - [C286684]', async () => {
      await dataTable.selectItem(file1);
      await toolbar.clickShareEditButton();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
      await shareDialog.clickShareToggle();

      expect(await confirmDialog.isDialogOpen()).toBe(true, 'Unshare dialog is not open');
      expect(await confirmDialog.getTitle()).toContain('Remove this shared link');
      expect(await confirmDialog.getText()).toContain('This link will be deleted and a new link will be created next time this file is shared');
      expect(await confirmDialog.isButtonEnabled('Remove')).toBe(true, 'REMOVE button is not enabled');
      expect(await confirmDialog.isButtonEnabled('Cancel')).toBe(true, 'CANCEL button is not enabled');
    });

    it('Unshare a file - [C286685]', async () => {
      await dataTable.selectItem(file2);
      await toolbar.clickShareEditButton();
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await shareDialog.clickShareToggle();

      await confirmDialog.clickButton('Remove');
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await apis.user.nodes.isFileShared(file2Id)).toBe(false, `${file2} is shared`);

      // TODO: disable check cause api is slow to update
      // expect(await dataTable.getRowByName(file2).isPresent()).toBe(false, `${file2} is in the Shared files list`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file2);

      await page.load();
    });

    it('Cancel the Unshare action - [C286686]', async () => {
      await dataTable.selectItem(file3);
      await toolbar.clickShareEditButton();
      await shareDialog.waitForDialogToOpen();

      const urlBefore = await shareDialog.getLinkUrl();
      await shareDialog.clickShareToggle();

      await confirmDialog.clickButton('Cancel');
      await confirmDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Share dialog not open');
      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle is off');

      const urlAfter = await shareDialog.getLinkUrl();
      expect(urlBefore).toEqual(urlAfter);
    });

    it('Unshare a file from the context menu - [C286688]', async () => {
      await dataTable.rightClickOnItem(file4);
      await contextMenu.clickShareEditAction();
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await shareDialog.clickShareToggle();

      await confirmDialog.clickButton('Remove');
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await apis.user.nodes.isFileShared(file4Id)).toBe(false, `${file4} is shared`);

      // TODO: disable check cause api is slow to update
      // expect(await dataTable.getRowByName(file4).isPresent()).toBe(false, `${file4} is in the Shared files list`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file4);

      await page.load();
    });
  });

  describe('from Favorites', () => {

    const file1 = `file1-${Utils.random()}.txt`; let file1Id;
    const file2 = `file2-${Utils.random()}.txt`; let file2Id;
    const file3 = `file3-${Utils.random()}.txt`; let file3Id;
    const file4 = `file4-${Utils.random()}.txt`; let file4Id;

    beforeAll(async (done) => {
      file1Id = (await apis.user.nodes.createFile(file1, parentId)).entry.id;
      file2Id = (await apis.user.nodes.createFile(file2, parentId)).entry.id;
      file3Id = (await apis.user.nodes.createFile(file3, parentId)).entry.id;
      file4Id = (await apis.user.nodes.createFile(file4, parentId)).entry.id;
      await apis.user.shared.shareFileById(file1Id);
      await apis.user.shared.shareFileById(file2Id);
      await apis.user.shared.shareFileById(file3Id);
      await apis.user.shared.shareFileById(file4Id);

      await apis.user.favorites.addFavoriteById('file', file1Id);
      await apis.user.favorites.addFavoriteById('file', file2Id);
      await apis.user.favorites.addFavoriteById('file', file3Id);
      await apis.user.favorites.addFavoriteById('file', file4Id);

      await apis.user.favorites.waitForApi({ expect: 4 });
      await apis.user.shared.waitForApi({ expect: 4 });
      done();
    });

    beforeEach(async (done) => {
      await page.refresh();
      await page.clickFavoritesAndWait();
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
      await apis.user.shared.waitForApi({ expect: 0 });
      done();
    });

    it('Unshare dialog UI - [C286694]', async () => {
      await dataTable.selectItem(file1);
      // TODO: remove workaround for favorites
      // await toolbar.clickShareEditButton();
      await toolbar.clickShareButton();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle not checked');
      await shareDialog.clickShareToggle();

      expect(await confirmDialog.isDialogOpen()).toBe(true, 'Unshare dialog is not open');
      expect(await confirmDialog.getTitle()).toContain('Remove this shared link');
      expect(await confirmDialog.getText()).toContain('This link will be deleted and a new link will be created next time this file is shared');
      expect(await confirmDialog.isButtonEnabled('Remove')).toBe(true, 'REMOVE button is not enabled');
      expect(await confirmDialog.isButtonEnabled('Cancel')).toBe(true, 'CANCEL button is not enabled');
    });

    it('Unshare a file - [C286695]', async () => {
      await dataTable.selectItem(file2);
      // TODO: remove workaround for favorites
      // await toolbar.clickShareEditButton();
      await toolbar.clickShareButton();
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await shareDialog.clickShareToggle();

      await confirmDialog.clickButton('Remove');
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await apis.user.nodes.isFileShared(file2Id)).toBe(false, `${file2} is shared`);

      // TODO: disable check cause api is slow to update
      // await page.clickSharedFiles();
      // expect(await dataTable.getRowByName(file2).isPresent()).toBe(false, `${file2} is in the Shared files list`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file2);

      await page.load();
    });

    it('Cancel the Unshare action - [C286696]', async () => {
      await dataTable.selectItem(file3);
      // TODO: remove workaround for favorites
      // await toolbar.clickShareEditButton();
      await toolbar.clickShareButton();
      await shareDialog.waitForDialogToOpen();

      const urlBefore = await shareDialog.getLinkUrl();
      await shareDialog.clickShareToggle();

      await confirmDialog.clickButton('Cancel');
      await confirmDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Share dialog not open');
      expect(await shareDialog.isShareToggleChecked()).toBe(true, 'Share toggle is off');

      const urlAfter = await shareDialog.getLinkUrl();
      expect(urlBefore).toEqual(urlAfter);
    });

    it('Unshare a file from the context menu - [C286698]', async () => {
      await dataTable.rightClickOnItem(file4);
      // TODO: remove workaround for favorites
      // await toolbar.clickShareEditButton();
      await contextMenu.clickShareAction();
      await shareDialog.waitForDialogToOpen();
      const url = await shareDialog.getLinkUrl();
      await shareDialog.clickShareToggle();

      await confirmDialog.clickButton('Remove');
      await confirmDialog.waitForDialogToClose();
      await shareDialog.waitForDialogToClose();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Share dialog open');
      expect(await apis.user.nodes.isFileShared(file4Id)).toBe(false, `${file4} is shared`);

      // TODO: disable check cause api is slow to update
      // await page.clickSharedFiles();
      // expect(await dataTable.getRowByName(file4).isPresent()).toBe(false, `${file4} is in the Shared files list`);

      await browser.get(url);
      expect(await viewer.isViewerOpened()).toBe(true, 'viewer is not open');
      expect(await viewer.getFileTitle()).not.toEqual(file4);

      await page.load();
    });
  });

  describe('as Consumer', () => {

    const sitePrivate = `site-private-${Utils.random()}`;

    const file1 = `file1-${Utils.random()}.txt`; let file1Id;
    const file2 = `file2-${Utils.random()}.txt`; let file2Id;

    beforeAll(async (done) => {
      await apis.admin.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE);
      const docLibId = await apis.admin.sites.getDocLibId(sitePrivate);

      file1Id = (await apis.admin.nodes.createFile(file1, docLibId)).entry.id;
      file2Id = (await apis.admin.nodes.createFile(file2, docLibId)).entry.id;

      await apis.admin.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_CONSUMER.ROLE);

      await apis.admin.shared.shareFileById(file1Id);
      await apis.user.shared.shareFileById(file2Id);
      await apis.user.shared.waitForApi({ expect: 2 });

      await apis.user.favorites.addFavoriteById('file', file1Id);
      await apis.user.favorites.addFavoriteById('file', file2Id);
      await apis.user.favorites.waitForApi({ expect: 2 });

      done();
    });

    afterAll(async (done) => {
      await apis.admin.sites.deleteSite(sitePrivate);
      done();
    });

    beforeEach(async (done) => {
      await page.refresh();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('on File Libraries - file shared by other user - [C286682]', async () => {
      await page.clickFileLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(sitePrivate);
      await dataTable.waitForHeader();
      await dataTable.selectItem(file1);
      await toolbar.clickShareEditButton();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle enabled for consumer');
    });

    it('on File Libraries - file shared by the user - [C286701]', async () => {
      await page.clickFileLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(sitePrivate);
      await dataTable.waitForHeader();
      await dataTable.selectItem(file2);
      await toolbar.clickShareEditButton();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle enabled for consumer');
    });

    it('on Shared Files - file shared by other user - [C286687]', async () => {
      await page.clickSharedFilesAndWait();
      await dataTable.selectItem(file1);
      await toolbar.clickShareEditButton();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle enabled for consumer');
    });

    it('on Shared Files - file shared by the user - [C286702]', async () => {
      await page.clickSharedFilesAndWait();
      await dataTable.selectItem(file1);
      await toolbar.clickShareEditButton();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle enabled for consumer');
    });

    it('on Favorites - file shared by other user - [C286697]', async () => {
      await page.clickFavoritesAndWait();
      await dataTable.selectItem(file1);
      // TODO: remove workaround for favorites
      // await toolbar.clickShareEditButton();
      await toolbar.clickShareButton();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle enabled for consumer');
    });

    it('on Favorites - file shared by the user - [C286703]', async () => {
      await page.clickFavoritesAndWait();
      await dataTable.selectItem(file1);
      // TODO: remove workaround for favorites
      // await toolbar.clickShareEditButton();
      await toolbar.clickShareButton();
      await shareDialog.waitForDialogToOpen();

      expect(await shareDialog.isShareToggleDisabled()).toBe(false, 'Share toggle enabled for consumer');
    });
  });

  xit('');
});
