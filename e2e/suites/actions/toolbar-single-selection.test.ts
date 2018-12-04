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

import { LoginPage, BrowsingPage } from '../../pages/pages';
import { SITE_VISIBILITY } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Toolbar actions - single selection : ', () => {
  const username = `user-${Utils.random()}`;

  const fileUser = `fileUser-${Utils.random()}.txt`; let fileUserId;
  const folderUser = `folderUser-${Utils.random()}`; let folderUserId;
  const fileForDelete = `fileForDelete-${Utils.random()}.txt`; let fileForDeleteId;
  const folderForDelete = `folderForDelete-${Utils.random()}`; let folderForDeleteId;

  const siteName = `site-${Utils.random()}`;
  const fileInSite = `fileAdmin-${Utils.random()}.txt`;
  const folderInSite = `folderAdmin-${Utils.random()}`;

  const adminPublic = `admin-public-${Utils.random()}`;
  const adminModerated = `admin-moderated-${Utils.random()}`;

  const apis = {
      admin: new RepoClient(),
      user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });

    fileUserId = (await apis.user.nodes.createFile(fileUser)).entry.id;
    fileForDeleteId = (await apis.user.nodes.createFile(fileForDelete)).entry.id;
    folderForDeleteId = (await apis.user.nodes.createFolder(folderForDelete)).entry.id;
    folderUserId = (await apis.user.nodes.createFolder(folderUser)).entry.id;

    await apis.user.shared.shareFileById(fileUserId);
    await apis.user.shared.waitForApi({ expect: 1 });

    await apis.user.favorites.addFavoriteById('file', fileUserId);
    await apis.user.favorites.addFavoriteById('folder', folderUserId);
    await apis.user.favorites.waitForApi({ expect: 2 });

    await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PRIVATE);
    const docLibId = await apis.user.sites.getDocLibId(siteName);
    await apis.user.nodes.createFile(fileInSite, docLibId);
    await apis.user.nodes.createFolder(folderInSite, docLibId);

    await apis.user.nodes.deleteNodeById(fileForDeleteId, false);
    await apis.user.nodes.deleteNodeById(folderForDeleteId, false);

    await apis.admin.sites.createSite(adminPublic);
    await apis.admin.sites.createSite(adminModerated, SITE_VISIBILITY.MODERATED);
    await apis.user.favorites.addFavoriteById('site', adminPublic);
    await apis.user.favorites.addFavoriteById('site', adminModerated);
    await apis.user.sites.requestToJoin(adminModerated);

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await Promise.all([
      apis.user.nodes.deleteNodeById(fileUserId),
      apis.user.nodes.deleteNodeById(folderUserId),
      apis.user.sites.deleteSite(siteName),
      apis.admin.sites.deleteSite(adminPublic),
      apis.admin.sites.deleteSite(adminModerated),
      apis.user.trashcan.emptyTrash()
    ]);
    done();
  });

  xit('');

  describe('General tests', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await dataTable.clearSelection();
      done();
    });

    it('selected row is marked with a check circle icon - [C213134]', async () => {
      await page.clickPersonalFilesAndWait();
      await dataTable.selectItem(fileUser);
      expect(await dataTable.hasCheckMarkIcon(fileUser)).toBe(true, 'check mark missing');
    });
  });

  describe('on Personal Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickPersonalFilesAndWait();
      await dataTable.clearSelection();
      done();
    });

    it('actions are not displayed when no item is selected - [C213120]', async () => {
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('correct actions appear when a file is selected - [C213122]', async () => {
      await dataTable.selectItem(fileUser);
      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
      expect(await toolbar.isButtonPresent('View')).toBe(true, `View is not displayed for ${fileUser}`);
      expect(await toolbar.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${fileUser}`);
      expect(await toolbar.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${fileUser}`);
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileUser}`);
      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when a folder is selected - [C213123]', async () => {
      await dataTable.selectItem(folderUser);
      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${folderUser}`);
      expect(await toolbar.isButtonPresent('View')).toBe(false, `View is displayed for ${folderUser}`);
      expect(await toolbar.isButtonPresent('Download')).toBe(true, `Download is not enabled for ${folderUser}`);
      expect(await toolbar.isButtonPresent('Edit')).toBe(true, `Edit is not displayed for ${folderUser}`);
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${folderUser}`);
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${folderUser}`);
      expect(await toolbar.menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${folderUser}`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${folderUser}`);
      await toolbar.closeMoreMenu();
    });
  });

  describe('on File Libraries', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickFileLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.waitForHeader();
      await dataTable.clearSelection();
      done();
    });

    it('actions are not displayed when no item is selected - [C280439]', async () => {
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('correct actions appear when a file is selected - [C280440]', async () => {
      await dataTable.selectItem(fileInSite);
      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${fileInSite}`);
      expect(await toolbar.isButtonPresent('View')).toBe(true, `View is not displayed for ${fileInSite}`);
      expect(await toolbar.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${fileInSite}`);
      expect(await toolbar.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${fileInSite}`);
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileInSite}`);
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${fileInSite}`);
      expect(await toolbar.menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${fileInSite}`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileInSite}`);
      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when a folder is selected - [C280441]', async () => {
      await dataTable.selectItem(folderInSite);
      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${folderInSite}`);
      expect(await toolbar.isButtonPresent('View')).toBe(false, `View is displayed for ${folderInSite}`);
      expect(await toolbar.isButtonPresent('Download')).toBe(true, `Download is not enabled for ${folderInSite}`);
      expect(await toolbar.isButtonPresent('Edit')).toBe(true, `Edit is not displayed for ${folderInSite}`);
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${folderInSite}`);
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${folderInSite}`);
      expect(await toolbar.menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${folderInSite}`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${folderInSite}`);
      await toolbar.closeMoreMenu();
    });
  });

  describe('on a library', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await dataTable.clearSelection();
      done();
    });

    it('Available actions when a library is selected - My Libraries - [C213135]', async () => {
      await page.goToMyLibraries();
      await dataTable.selectItem(siteName);
      expect(await toolbar.isEmpty()).toBe(false, 'toolbar not displayed');
      expect(await toolbar.isButtonPresent('View details')).toBe(true, `View details is not displayed for ${siteName}`);
      expect(await toolbar.isButtonPresent('Leave library')).toBe(true, `Leave is not displayed for ${siteName}`);
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${siteName}`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${siteName}`);
    });

    it('Available actions when a library is selected - Favorite Libraries - user is a member - [C289892]', async () => {
      await page.goToFavoriteLibraries();
      await dataTable.selectItem(siteName);
      expect(await toolbar.isEmpty()).toBe(false, 'toolbar not displayed');
      expect(await toolbar.isButtonPresent('View details')).toBe(true, `View details is not displayed for ${siteName}`);
      expect(await toolbar.isButtonPresent('Leave library')).toBe(true, `Leave is not displayed for ${siteName}`);
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${siteName}`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${siteName}`);
    });

    it('Available actions when a library is selected - Favorite Libraries - user is not a member - [C290090]', async () => {
      await page.goToFavoriteLibraries();
      await dataTable.selectItem(adminPublic);
      expect(await toolbar.isEmpty()).toBe(false, 'toolbar not displayed');
      expect(await toolbar.isButtonPresent('View details')).toBe(true, `View details is not displayed for ${adminPublic}`);
      expect(await toolbar.isButtonPresent('Join')).toBe(true, `Join is not displayed for ${adminPublic}`);
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${adminPublic}`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${adminPublic}`);
    });

    it('Available actions when a library is selected - Favorite Libraries - user requested to join - [C290091]', async () => {
      await page.goToFavoriteLibraries();
      await dataTable.selectItem(adminModerated);
      expect(await toolbar.isEmpty()).toBe(false, 'toolbar not displayed');
      expect(await toolbar.isButtonPresent('View details')).toBe(true, `View details is not displayed for ${adminModerated}`);
      expect(await toolbar.isButtonPresent('Cancel join')).toBe(true, `Cancel join is not displayed for ${adminModerated}`);
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${adminModerated}`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${adminModerated}`);
    });
  });

  describe('on Shared Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickSharedFilesAndWait();
      await dataTable.clearSelection();
      done();
    });

    it('actions are not displayed when no item is selected - [C280445]', async () => {
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('correct actions appear when a file is selected - [C286265]', async () => {
      await page.dataTable.selectItem(fileUser);
      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
      expect(await toolbar.isButtonPresent('View')).toBe(true, `View is not displayed for ${fileUser}`);
      expect(await toolbar.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${fileUser}`);
      expect(await toolbar.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${fileUser}`);
      expect(await toolbar.isShareEditButtonPresent()).toBe(true, `Shared link settings is not displayed for ${fileUser}`);
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileUser}`);
      await toolbar.closeMoreMenu();
    });
  });

  describe('on Recent Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickRecentFilesAndWait();
      await dataTable.clearSelection();
      done();
    });

    it('actions are not displayed when no item is selected - [C280447]', async () => {
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('correct actions appear when a file is selected - [C280448]', async () => {
      await dataTable.selectItem(fileUser);
      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
      expect(await toolbar.isButtonPresent('View')).toBe(true, `View is not displayed for ${fileUser}`);
      expect(await toolbar.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${fileUser}`);
      expect(await toolbar.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${fileUser}`);
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileUser}`);
      await toolbar.closeMoreMenu();
    });
  });

  describe('on Favorites', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickFavoritesAndWait();
      await dataTable.clearSelection();
      done();
    });

    it('actions are not displayed when no item is selected - [C280449]', async () => {
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('correct actions appear when a file is selected - [C280450]', async () => {
      await dataTable.selectItem(fileUser);
      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
      expect(await toolbar.isButtonPresent('View')).toBe(true, `View is not displayed for ${fileUser}`);
      expect(await toolbar.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${fileUser}`);
      expect(await toolbar.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${fileUser}`);
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileUser}`);
      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when a folder is selected - [C280451]', async () => {
      await dataTable.selectItem(folderUser);
      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${folderUser}`);
      expect(await toolbar.isButtonPresent('View')).toBe(false, `View is displayed for ${folderUser}`);
      expect(await toolbar.isButtonPresent('Download')).toBe(true, `Download is not enabled for ${folderUser}`);
      expect(await toolbar.isButtonPresent('Edit')).toBe(true, `Edit is not displayed for ${folderUser}`);
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${folderUser}`);
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${folderUser}`);
      expect(await toolbar.menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${folderUser}`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${folderUser}`);
      await toolbar.closeMoreMenu();
    });
  });

  describe('on Trash', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickTrashAndWait();
      await dataTable.clearSelection();
      done();
    });

    it('actions are not displayed when no item is selected - [C280452]', async () => {
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('correct actions appear when a file is selected - [C280453]', async () => {
      await dataTable.selectItem(fileForDelete);
      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${fileForDelete}`);
      expect(await toolbar.isButtonPresent('Permanently delete')).toBe(true, `Permanently delete is not displayed for file`);
      expect(await toolbar.isButtonPresent('Restore')).toBe(true, `Restore is not displayed for file`);
    });

    it('correct actions appear when a folder is selected - [C280454]', async () => {
      await dataTable.selectItem(folderForDelete);
      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${folderForDelete}`);
      expect(await toolbar.isButtonPresent('Permanently delete')).toBe(true, `Permanently delete is displayed for folder`);
      expect(await toolbar.isButtonPresent('Restore')).toBe(true, `Restore is not enabled for folder`);
    });
  });
});
