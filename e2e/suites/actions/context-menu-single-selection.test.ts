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

describe('Context menu actions - single selection : ', () => {
  const username = `user-${Utils.random()}`;

  const fileUser = `fileUser-${Utils.random()}.txt`; let fileUserId;
  const folderUser = `folderUser-${Utils.random()}`; let folderUserId;
  const fileInTrash = `fileForDelete-${Utils.random()}.txt`; let fileInTrashId;
  const folderInTrash = `folderForDelete-${Utils.random()}`; let folderInTrashId;

  const siteName = `userSite-${Utils.random()}`;
  const fileSiteUser = `fileUser-${Utils.random()}.txt`;
  const folderSiteUser = `folderUser-${Utils.random()}`;

  const adminPublic = `admin-public-${Utils.random()}`;
  const adminModerated = `admin-moderated-${Utils.random()}`;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;
  const contextMenu = dataTable.menu;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });

    fileUserId = (await apis.user.nodes.createFile(fileUser)).entry.id;
    folderUserId = (await apis.user.nodes.createFolder(folderUser)).entry.id;

    await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
    const docLibId = await apis.user.sites.getDocLibId(siteName);
    await apis.user.nodes.createFile(fileSiteUser, docLibId);
    await apis.user.nodes.createFolder(folderSiteUser, docLibId);

    fileInTrashId = (await apis.user.nodes.createFiles([fileInTrash])).entry.id;
    folderInTrashId = (await apis.user.nodes.createFolders([ folderInTrash ])).entry.id;
    await apis.user.nodes.deleteNodeById(fileInTrashId, false);
    await apis.user.nodes.deleteNodeById(folderInTrashId, false);

    await apis.user.shared.shareFileById(fileUserId);
    await apis.user.shared.waitForApi({ expect: 1 });

    await apis.user.favorites.addFavoriteById('file', fileUserId);
    await apis.user.favorites.addFavoriteById('folder', folderUserId);
    await apis.user.favorites.waitForApi({ expect: 3 });

    await apis.admin.sites.createSite(adminPublic);
    await apis.admin.sites.createSite(adminModerated, SITE_VISIBILITY.MODERATED);
    await apis.user.favorites.addFavoriteById('site', adminPublic);
    await apis.user.favorites.addFavoriteById('site', adminModerated);
    await apis.user.sites.requestToJoin(adminModerated);

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(fileUserId);
    await apis.user.nodes.deleteNodeById(folderUserId);
    await apis.user.sites.deleteSite(siteName);
    await apis.admin.sites.deleteSite(adminPublic);
    await apis.admin.sites.deleteSite(adminModerated);
    await apis.user.trashcan.emptyTrash();
    done();
  });

  xit('');

  describe('Generic tests', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickPersonalFilesAndWait();
      done();
    });

    it('Row is marked with a check circle icon on direct right click - [C286252]', async () => {
      await dataTable.rightClickOnItem(fileUser);
      expect(await dataTable.hasCheckMarkIcon(fileUser)).toBe(true, 'check mark missing');
    });

    it('Context menu appears on direct right click on an item - [C286253]', async () => {
      await dataTable.rightClickOnItem(fileUser);
      expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
    });

    it('Context menu appears when selecting an item and then right clicking on it - [C286254]', async () => {
      await dataTable.selectItem(fileUser);
      await dataTable.rightClickOnItem(fileUser);
      expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
    });

    it('Context menu appears correctly when right clicking on another item - [C284666]', async () => {
      await dataTable.selectItem(fileUser);
      await dataTable.rightClickOnItem(folderUser);
      expect(await dataTable.hasContextMenu()).toBe(true, `Context menu is not displayed for ${folderUser}`);
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(true, `Edit is not displayed for ${folderUser}`);
      expect(await dataTable.hasCheckMarkIcon(folderUser)).toBe(true, `${folderUser} is not selected`);
      expect(await dataTable.hasCheckMarkIcon(fileUser)).toBe(false, `${fileUser} is not selected`);
    });

    it('Context menu closes when clicking away from it - [C280619]', async () => {
      await dataTable.rightClickOnItem(fileUser);
      expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
      await page.sidenav.getActiveLink().click();
      expect(await dataTable.hasContextMenu()).toBe(false, 'Context menu is displayed');
    });
  });

  describe('on Personal Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickPersonalFilesAndWait();
      await dataTable.clearSelection();
      done();
    });

    it('Context menu has the correct actions for a file - [C280615]', async () => {
      await dataTable.rightClickOnItem(fileUser);
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(true, `Download is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('View')).toBe(true, `View is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Share')).toBe(true, `Share is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Manage Versions')).toBe(true, `Manage Versions is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Permissions')).toBe(true, `Permissions is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, `Edit is displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('View details')).toBe(false, `View details is displayed for ${fileUser}`);
    });

    it('Context menu has the correct actions for a folder - [C280616]', async () => {
      await dataTable.rightClickOnItem(folderUser);
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(true, `Download is not enabled for ${folderUser}`);
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(true, `Edit is not displayed for ${folderUser}`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${folderUser}`);
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${folderUser}`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${folderUser}`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${folderUser}`);
      expect(await contextMenu.isMenuItemPresent('Permissions')).toBe(true, `Permissions is not displayed for ${folderUser}`);
      expect(await contextMenu.isMenuItemPresent('View')).toBe(false, `View is displayed for ${folderUser}`);
      expect(await contextMenu.isMenuItemPresent('Manage Versions')).toBe(false, `Manage Versions is displayed for ${folderUser}`);
      expect(await contextMenu.isMenuItemPresent('Share')).toBe(false, `Share is displayed for ${folderUser}`);
    });
  });

  describe('on File Libraries', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickFileLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.waitForHeader();
      done();
    });

    it('Context menu has the correct actions for a file - [C280594]', async () => {
      await dataTable.rightClickOnItem(fileSiteUser);
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(true, `Download is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isMenuItemPresent('View')).toBe(true, `View is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isMenuItemPresent('Share')).toBe(true, `Share is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isMenuItemPresent('Manage Versions')).toBe(true, `Manage Versions not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isMenuItemPresent('Permissions')).toBe(true, `Permissions is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, `Edit is displayed for ${fileSiteUser}`);
      expect(await contextMenu.isMenuItemPresent('View details')).toBe(false, `View details is displayed for ${fileSiteUser}`);
    });

    it('Context menu has the correct actions for a folder - [C280595]', async () => {
      await dataTable.rightClickOnItem(folderSiteUser);
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(true, `Download is not enabled for ${folderSiteUser}`);
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(true, `Edit is not displayed for ${folderSiteUser}`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${folderSiteUser}`);
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${folderSiteUser}`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${folderSiteUser}`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${folderSiteUser}`);
      expect(await contextMenu.isMenuItemPresent('Permissions')).toBe(true, `Permissions is not displayed for ${folderSiteUser}`);
      expect(await contextMenu.isMenuItemPresent('View')).toBe(false, `View is displayed for ${folderSiteUser}`);
      expect(await contextMenu.isMenuItemPresent('Manage Versions')).toBe(false, `Manage Versions displayed for ${folderSiteUser}`);
      expect(await contextMenu.isMenuItemPresent('Share')).toBe(false, `Share is displayed for ${folderSiteUser}`);
    });
  });

  describe('on a library', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await dataTable.clearSelection();
      done();
    });

    it('Available actions when a library is selected - My Libraries - [C290080]', async () => {
      await page.goToMyLibraries();
      await dataTable.rightClickOnItem(siteName);
      expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
      expect(await contextMenu.isMenuItemPresent('Leave library')).toBe(true, `Leave is not displayed for ${siteName}`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${siteName}`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${siteName}`);
    });

    it('Available actions when a library is selected - Favorite Libraries - user is a member - [C290081]', async () => {
      await page.goToFavoriteLibraries();
      await dataTable.rightClickOnItem(siteName);
      expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
      expect(await contextMenu.isMenuItemPresent('Leave library')).toBe(true, `Leave is not displayed for ${siteName}`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${siteName}`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${siteName}`);
    });

    it('Available actions when a library is selected - Favorite Libraries - user is not a member - [C290082]', async () => {
      await page.goToFavoriteLibraries();
      await dataTable.rightClickOnItem(adminPublic);
      expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
      expect(await contextMenu.isMenuItemPresent('Join')).toBe(true, `Join is not displayed for ${adminPublic}`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${adminPublic}`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${adminPublic}`);
    });

    it('Available actions when a library is selected - Favorite Libraries - user requested to join - [C290089]', async () => {
      await page.goToFavoriteLibraries();
      await dataTable.rightClickOnItem(adminModerated);
      expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
      expect(await contextMenu.isMenuItemPresent('Cancel join')).toBe(true, `Cancel join is not displayed for ${adminModerated}`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${adminModerated}`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${adminModerated}`);
    });
  });

  describe('on Shared Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickSharedFilesAndWait();
      done();
    });

    it('Context menu has the correct actions for a file - [C280601]', async () => {
      await dataTable.rightClickOnItem(fileUser);
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(true, `Download is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('View')).toBe(true, `View is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Shared link settings')).toBe(true, `Shared link settings is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Manage Versions')).toBe(true, `Manage Versions not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Permissions')).toBe(true, `Permissions is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, `Edit is displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('View details')).toBe(false, `View details is displayed for ${fileUser}`);
    });
  });

  describe('on Recent Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickRecentFilesAndWait();
      done();
    });

    it('Context menu has the correct actions for a file - [C280622]', async () => {
      await dataTable.rightClickOnItem(fileUser);
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(true, `Download is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('View')).toBe(true, `View is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Share')).toBe(true, `Share is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Manage Versions')).toBe(true, `Manage Versions not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Permissions')).toBe(true, `Permissions is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, `Edit is displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('View details')).toBe(false, `View details is displayed for ${fileUser}`);
    });
  });

  describe('on Favorites', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickFavoritesAndWait();
      done();
    });

    it('Context menu has the correct actions for a file - [C280608]', async () => {
      await dataTable.rightClickOnItem(fileUser);
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(true, `Download is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('View')).toBe(true, `View is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Share')).toBe(true, `Share is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Manage Versions')).toBe(true, `Manage Versions is not displayed for ${fileUser}`);
      // TODO: enable when ACA-1794 is fixed
      // expect(await contextMenu.isMenuItemPresent('Permissions')).toBe(true, `Permissions is not displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, `Edit is displayed for ${fileUser}`);
      expect(await contextMenu.isMenuItemPresent('View details')).toBe(false, `View details is displayed for ${fileUser}`);
    });

    it('Context menu has the correct actions for a folder - [C280609]', async () => {
      await dataTable.rightClickOnItem(folderUser);
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(true, `Download is not enabled for ${folderUser}`);
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(true, `Edit is not displayed for ${folderUser}`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${folderUser}`);
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${folderUser}`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${folderUser}`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${folderUser}`);
      // TODO: enable when ACA-1794 is fixed
      // expect(await contextMenu.isMenuItemPresent('Permissions')).toBe(true, `Permissions is not displayed for ${folderUser}`);
      expect(await contextMenu.isMenuItemPresent('View')).toBe(false, `View is displayed for ${folderUser}`);
      expect(await contextMenu.isMenuItemPresent('Manage Versions')).toBe(false, `Manage Versions is displayed for ${folderUser}`);
      expect(await contextMenu.isMenuItemPresent('Share')).toBe(false, `Share is displayed for ${folderUser}`);
    });
  });

  describe('on Trash', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickTrashAndWait();
      done();
    });

    it('Context menu has the correct actions for a file - [C286258]', async () => {
      await dataTable.rightClickOnItem(fileInTrash);
      expect(await contextMenu.isMenuItemPresent('Permanently delete'))
          .toBe(true, `Permanently delete is not displayed for ${fileInTrash}`);
      expect(await contextMenu.isMenuItemPresent('Restore')).toBe(true, `Restore is not displayed for ${fileInTrash}`);
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(false, `Download is not displayed for ${fileInTrash}`);
      expect(await contextMenu.isMenuItemPresent('View')).toBe(false, `View is not displayed for ${fileInTrash}`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(false, `Favorite is not displayed for ${fileInTrash}`);
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(false, `Copy is not displayed for ${fileInTrash}`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(false, `Move is not displayed for ${fileInTrash}`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(false, `Delete is not displayed for ${fileInTrash}`);
      expect(await contextMenu.isMenuItemPresent('Share')).toBe(false, `Share is not displayed for ${fileInTrash}`);
      expect(await contextMenu.isMenuItemPresent('Manage Versions'))
          .toBe(false, `Manage Versions is not displayed for ${fileInTrash}`);
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, `Edit is displayed for ${fileInTrash}`);
      expect(await contextMenu.isMenuItemPresent('View details')).toBe(false, `View details is displayed for ${fileInTrash}`);
    });

    it('Context menu has the correct actions for a folder - [C286259]', async () => {
      await dataTable.rightClickOnItem(folderInTrash);
      expect(await contextMenu.isMenuItemPresent('Permanently delete'))
          .toBe(true, `Permanently delete is not displayed for ${folderInTrash}`);
      expect(await contextMenu.isMenuItemPresent('Restore')).toBe(true, `Restore is not displayed for ${folderInTrash}`);
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(false, `Download is not displayed for ${folderInTrash}`);
      expect(await contextMenu.isMenuItemPresent('View')).toBe(false, `View is not displayed for ${folderInTrash}`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(false, `Favorite is not displayed for ${folderInTrash}`);
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(false, `Copy is not displayed for ${folderInTrash}`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(false, `Move is not displayed for ${folderInTrash}`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(false, `Delete is not displayed for ${folderInTrash}`);
      expect(await contextMenu.isMenuItemPresent('Share')).toBe(false, `Share is not displayed for ${folderInTrash}`);
      expect(await contextMenu.isMenuItemPresent('Manage Versions'))
          .toBe(false, `Manage Versions is not displayed for ${folderInTrash}`);
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, `Edit is displayed for ${folderInTrash}`);
      expect(await contextMenu.isMenuItemPresent('View details')).toBe(false, `View details is displayed for ${folderInTrash}`);
    });
  });
});
