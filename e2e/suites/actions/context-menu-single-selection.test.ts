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

import { LoginPage, BrowsingPage, SearchResultsPage } from '../../pages/pages';
import { SITE_VISIBILITY } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Context menu actions - single selection : ', () => {
  const username = `user-${Utils.random()}`;

  const fileUser = `fileUser-${Utils.random()}.txt`; let fileUserId;
  const folderUser = `folderUser-${Utils.random()}`; let folderUserId;
  const fileInTrash = `fileForDelete-${Utils.random()}.txt`; let fileInTrashId;
  const folderInTrash = `folderForDelete-${Utils.random()}`; let folderInTrashId;
  const fileLocked = `fileLocked-${Utils.random()}.txt`; let fileLockedId;

  const siteName = `userSite-${Utils.random()}`;
  const fileSiteUser = `fileUser-${Utils.random()}.txt`;
  const fileLockedInSite = `file-locked-site-${Utils.random()}.txt`; let fileLockedInSiteId;
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
  const searchResultsPage = new SearchResultsPage();
  const { searchInput } = searchResultsPage.header;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });

    fileUserId = (await apis.user.nodes.createFile(fileUser)).entry.id;
    folderUserId = (await apis.user.nodes.createFolder(folderUser)).entry.id;

    fileLockedId = (await apis.user.nodes.createFile(fileLocked)).entry.id;
    await apis.user.nodes.lockFile(fileLockedId);

    await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
    const docLibId = await apis.user.sites.getDocLibId(siteName);
    await apis.user.nodes.createFile(fileSiteUser, docLibId);
    fileLockedInSiteId = (await apis.user.nodes.createFile(fileLockedInSite, docLibId)).entry.id;
    await apis.user.nodes.createFolder(folderSiteUser, docLibId);
    await apis.user.nodes.lockFile(fileLockedInSiteId);

    fileInTrashId = (await apis.user.nodes.createFiles([fileInTrash])).entry.id;
    folderInTrashId = (await apis.user.nodes.createFolders([ folderInTrash ])).entry.id;
    await apis.user.nodes.deleteNodeById(fileInTrashId, false);
    await apis.user.nodes.deleteNodeById(folderInTrashId, false);

    await apis.user.shared.shareFileById(fileUserId);
    await apis.user.shared.shareFileById(fileLockedId);
    await apis.user.shared.waitForApi({ expect: 2 });

    await apis.user.favorites.addFavoriteById('file', fileUserId);
    await apis.user.favorites.addFavoriteById('file', fileLockedId);
    await apis.user.favorites.addFavoriteById('folder', folderUserId);
    await apis.user.favorites.waitForApi({ expect: 4 });

    await apis.admin.sites.createSite(adminPublic);
    await apis.admin.sites.createSite(adminModerated, SITE_VISIBILITY.MODERATED);
    await apis.user.favorites.addFavoriteById('site', adminPublic);
    await apis.user.favorites.addFavoriteById('site', adminModerated);
    await apis.user.sites.requestToJoin(adminModerated);

    await apis.user.queries.waitForSites(siteName, { expect: 1 });
    await apis.user.queries.waitForSites(adminPublic, { expect: 1 });
    await apis.user.queries.waitForSites(adminModerated, { expect: 1 });

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

  describe('Generic tests', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickPersonalFilesAndWait();
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
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
      expect(await contextMenu.isEditFolderPresent()).toBe(true, `Edit folder is not displayed for ${folderUser}`);
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

    afterAll(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('Context menu has the correct actions for a file - [C280615]', async () => {
      await dataTable.rightClickOnItem(fileUser);

      expect(await contextMenu.isEditOfflinePresent()).toBe(true, `Edit offline is not displayed for ${fileUser}`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${fileUser}`);
      expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileUser}`);
      expect(await contextMenu.isViewPresent()).toBe(true, `View is not displayed for ${fileUser}`);
      expect(await contextMenu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${fileUser}`);
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileUser}`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed for ${fileUser}`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileUser}`);
      expect(await contextMenu.isSharePresent()).toBe(true, `Share is not displayed for ${fileUser}`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(true, `Manage Versions is not displayed for ${fileUser}`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed for ${fileUser}`);
      expect(await contextMenu.isManagePermissionsPresent()).toBe(true, `Permissions is not displayed for ${fileUser}`);
      expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileUser}`);
      expect(await contextMenu.isViewDetailsPresent()).toBe(false, `View details is displayed for ${fileUser}`);
    });

    it('Context menu has the correct actions for a locked file - [C297633]', async () => {
      await dataTable.rightClickOnItem(fileLocked);

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileLocked}`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(true, `Cancel editing is not displayed for ${fileLocked}`);
      expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileLocked}`);
      expect(await contextMenu.isViewPresent()).toBe(true, `View is not displayed for ${fileLocked}`);
      expect(await contextMenu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${fileLocked}`);
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileLocked}`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed for ${fileLocked}`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileLocked}`);
      expect(await contextMenu.isSharePresent()).toBe(true, `Share is not displayed for ${fileLocked}`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(true, `Manage Versions is not displayed for ${fileLocked}`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed for ${fileLocked}`);
      expect(await contextMenu.isManagePermissionsPresent()).toBe(true, `Permissions is not displayed for ${fileLocked}`);
      expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileLocked}`);
      expect(await contextMenu.isViewDetailsPresent()).toBe(false, `View details is displayed for ${fileLocked}`);
    });

    it('Context menu has the correct actions for a folder - [C280616]', async () => {
      await dataTable.rightClickOnItem(folderUser);

      expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${folderUser}`);
      expect(await contextMenu.isEditFolderPresent()).toBe(true, `Edit folder is not displayed for ${folderUser}`);
      expect(await contextMenu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${folderUser}`);
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${folderUser}`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed for ${folderUser}`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed for ${folderUser}`);
      expect(await contextMenu.isManagePermissionsPresent()).toBe(true, `Permissions is not displayed for ${folderUser}`);
      expect(await contextMenu.isViewPresent()).toBe(false, `View is displayed for ${folderUser}`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage Versions is displayed for ${folderUser}`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for ${folderUser}`);
      expect(await contextMenu.isSharePresent()).toBe(false, `Share is displayed for ${folderUser}`);
      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${folderUser}`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${folderUser}`);
    });
  });

  describe('on File Libraries', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.goToMyLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.waitForHeader();
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('Context menu has the correct actions for a file - [C280594]', async () => {
      await dataTable.rightClickOnItem(fileSiteUser);

      expect(await contextMenu.isEditOfflinePresent()).toBe(true, `Edit offline is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${fileSiteUser}`);
      expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isViewPresent()).toBe(true, `View is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isFavoritePresent()).toBe(true, `Favorite is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isSharePresent()).toBe(true, `Share is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(true, `Manage Versions not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(true, `Upload new version not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isManagePermissionsPresent()).toBe(true, `Permissions is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileSiteUser}`);
      expect(await contextMenu.isViewDetailsPresent()).toBe(false, `View details is displayed for ${fileSiteUser}`);
    });

    it('Context menu has the correct actions for a locked file - [C297634]', async () => {
      await dataTable.rightClickOnItem(fileLockedInSite);

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is not displayed for ${fileLockedInSite}`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(true, `Cancel editing is displayed for ${fileLockedInSite}`);
      expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileLockedInSite}`);
      expect(await contextMenu.isViewPresent()).toBe(true, `View is not displayed for ${fileLockedInSite}`);
      expect(await contextMenu.isFavoritePresent()).toBe(true, `Favorite is not displayed for ${fileLockedInSite}`);
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileLockedInSite}`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed for ${fileLockedInSite}`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileLockedInSite}`);
      expect(await contextMenu.isSharePresent()).toBe(true, `Share is not displayed for ${fileLockedInSite}`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(true, `Manage Versions not displayed for ${fileLockedInSite}`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(true, `Upload new version not displayed for ${fileLockedInSite}`);
      expect(await contextMenu.isManagePermissionsPresent()).toBe(true, `Permissions is not displayed for ${fileLockedInSite}`);
      expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileLockedInSite}`);
      expect(await contextMenu.isViewDetailsPresent()).toBe(false, `View details is displayed for ${fileLockedInSite}`);
    });

    it('Context menu has the correct actions for a folder - [C280595]', async () => {
      await dataTable.rightClickOnItem(folderSiteUser);

      expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${folderSiteUser}`);
      expect(await contextMenu.isEditFolderPresent()).toBe(true, `Edit folder is not displayed for ${folderSiteUser}`);
      expect(await contextMenu.isFavoritePresent()).toBe(true, `Favorite is not displayed for ${folderSiteUser}`);
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${folderSiteUser}`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed for ${folderSiteUser}`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed for ${folderSiteUser}`);
      expect(await contextMenu.isManagePermissionsPresent()).toBe(true, `Permissions is not displayed for ${folderSiteUser}`);
      expect(await contextMenu.isViewPresent()).toBe(false, `View is displayed for ${folderSiteUser}`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage Versions displayed for ${folderSiteUser}`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version displayed for ${folderSiteUser}`);
      expect(await contextMenu.isSharePresent()).toBe(false, `Share is displayed for ${folderSiteUser}`);
      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${folderSiteUser}`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${folderSiteUser}`);
    });
  });

  describe('on a library', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await dataTable.clearSelection();
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('Available actions for a library - My Libraries - [C290080]', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.rightClickOnItem(siteName);

      expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
      expect(await contextMenu.isLeaveLibraryPresent()).toBe(true, `Leave is not displayed for ${siteName}`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed for ${siteName}`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed for ${siteName}`);
    });

    it('Available actions for a library - Favorite Libraries - user is a member - [C290081]', async () => {
      await page.goToFavoriteLibrariesAndWait();
      await dataTable.rightClickOnItem(siteName);

      expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
      expect(await contextMenu.isLeaveLibraryPresent()).toBe(true, `Leave is not displayed for ${siteName}`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed for ${siteName}`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed for ${siteName}`);
    });

    it('Available actions for a library - Favorite Libraries - user is not a member - [C290082]', async () => {
      await page.goToFavoriteLibrariesAndWait();
      await dataTable.rightClickOnItem(adminPublic);

      expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
      expect(await contextMenu.isJoinLibraryPresent()).toBe(true, `Join is not displayed for ${adminPublic}`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed for ${adminPublic}`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed for ${adminPublic}`);
    });

    it('Available actions for a moderated library - Favorite Libraries - user requested to join - [C290089]', async () => {
      await page.goToFavoriteLibrariesAndWait();
      await dataTable.rightClickOnItem(adminModerated);

      expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
      expect(await contextMenu.isCancelJoinPresent()).toBe(true, `Cancel join is not displayed for ${adminModerated}`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed for ${adminModerated}`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed for ${adminModerated}`);
    });

    it('Available actions for a library - Search Results - user is a member - [C291812]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchForTextAndCloseSearchOptions(siteName);
      await dataTable.rightClickOnItem(siteName);

      expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
      expect(await contextMenu.isLeaveLibraryPresent()).toBe(true, `Leave is not displayed for ${siteName}`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed for ${siteName}`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed for ${siteName}`);
    });

    it('Available actions for a library - Search Results - user is not a member - [C291813]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchForTextAndCloseSearchOptions(adminPublic);
      await dataTable.rightClickOnItem(adminPublic);

      expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
      expect(await contextMenu.isJoinLibraryPresent()).toBe(true, `Join is not displayed for ${adminPublic}`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed for ${adminPublic}`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed for ${adminPublic}`);
    });

    it('Available actions for a moderated library - Search Results - user requested to join - [C291814]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchForTextAndCloseSearchOptions(adminModerated);
      await dataTable.rightClickOnItem(adminModerated);

      expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
      expect(await contextMenu.isCancelJoinPresent()).toBe(true, `Cancel join is not displayed for ${adminModerated}`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed for ${adminModerated}`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed for ${adminModerated}`);
    });
  });

  describe('on Shared Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickSharedFilesAndWait();
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('Context menu has the correct actions for a file - [C280601]', async () => {
      await dataTable.rightClickOnItem(fileUser);

      // TODO: change expect to true when ACA-2173 is done
      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileUser}`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${fileUser}`);
      expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileUser}`);
      expect(await contextMenu.isViewPresent()).toBe(true, `View is not displayed for ${fileUser}`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed for ${fileUser}`);
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileUser}`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed for ${fileUser}`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileUser}`);
      expect(await contextMenu.isSharedLinkSettingsPresent()).toBe(true, `Shared link settings is not displayed for ${fileUser}`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(true, `Manage Versions not displayed for ${fileUser}`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(true, `Upload new version not displayed for ${fileUser}`);
      expect(await contextMenu.isManagePermissionsPresent()).toBe(true, `Permissions is not displayed for ${fileUser}`);
      expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileUser}`);
      expect(await contextMenu.isViewDetailsPresent()).toBe(false, `View details is displayed for ${fileUser}`);
    });

    it('Context menu has the correct actions for a locked file - [C297635]', async () => {
      await dataTable.rightClickOnItem(fileLocked);

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileLocked}`);
      // TODO: change expect to true when ACA-2173 is done
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${fileLocked}`);
      expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileLocked}`);
      expect(await contextMenu.isViewPresent()).toBe(true, `View is not displayed for ${fileLocked}`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed for ${fileLocked}`);
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileLocked}`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed for ${fileLocked}`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileLocked}`);
      expect(await contextMenu.isSharedLinkSettingsPresent()).toBe(true, `Shared link settings is not displayed for ${fileLocked}`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(true, `Manage Versions not displayed for ${fileLocked}`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(true, `Upload new version not displayed for ${fileLocked}`);
      expect(await contextMenu.isManagePermissionsPresent()).toBe(true, `Permissions is not displayed for ${fileLocked}`);
      expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileLocked}`);
      expect(await contextMenu.isViewDetailsPresent()).toBe(false, `View details is displayed for ${fileLocked}`);
    });
  });

  describe('on Recent Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickRecentFilesAndWait();
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('Context menu has the correct actions for a file - [C280622]', async () => {
      await dataTable.rightClickOnItem(fileUser);

      expect(await contextMenu.isEditOfflinePresent()).toBe(true, `Edit offline is not displayed for ${fileUser}`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${fileUser}`);
      expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileUser}`);
      expect(await contextMenu.isViewPresent()).toBe(true, `View is not displayed for ${fileUser}`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed for ${fileUser}`);
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileUser}`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed for ${fileUser}`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileUser}`);
      expect(await contextMenu.isSharePresent()).toBe(true, `Share is not displayed for ${fileUser}`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(true, `Manage Versions not displayed for ${fileUser}`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(true, `Upload new version not displayed for ${fileUser}`);
      expect(await contextMenu.isManagePermissionsPresent()).toBe(true, `Permissions is not displayed for ${fileUser}`);
      expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileUser}`);
      expect(await contextMenu.isViewDetailsPresent()).toBe(false, `View details is displayed for ${fileUser}`);
    });

    it('Context menu has the correct actions for a locked file - [C297636]', async () => {
      await dataTable.rightClickOnItem(fileLocked);

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileLocked}`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(true, `Cancel editing is not displayed for ${fileLocked}`);
      expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileLocked}`);
      expect(await contextMenu.isViewPresent()).toBe(true, `View is not displayed for ${fileLocked}`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed for ${fileLocked}`);
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileLocked}`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed for ${fileLocked}`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileLocked}`);
      expect(await contextMenu.isSharePresent()).toBe(true, `Share is not displayed for ${fileLocked}`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(true, `Manage Versions not displayed for ${fileLocked}`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(true, `Upload new version not displayed for ${fileLocked}`);
      expect(await contextMenu.isManagePermissionsPresent()).toBe(true, `Permissions is not displayed for ${fileLocked}`);
      expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileLocked}`);
      expect(await contextMenu.isViewDetailsPresent()).toBe(false, `View details is displayed for ${fileLocked}`);
    });
  });

  describe('on Favorites', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickFavoritesAndWait();
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('Context menu has the correct actions for a file - [C280608]', async () => {
      await dataTable.rightClickOnItem(fileUser);

      // TODO: change expect to true when ACA-2174 is done
      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileUser}`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${fileUser}`);
      expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileUser}`);
      expect(await contextMenu.isViewPresent()).toBe(true, `View is not displayed for ${fileUser}`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed for ${fileUser}`);
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileUser}`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed for ${fileUser}`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileUser}`);
      expect(await contextMenu.isSharePresent()).toBe(true, `Share is not displayed for ${fileUser}`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(true, `Manage Versions is not displayed for ${fileUser}`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed for ${fileUser}`);
      expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileUser}`);
      expect(await contextMenu.isViewDetailsPresent()).toBe(false, `View details is displayed for ${fileUser}`);
    });

    it('Context menu has the correct actions for a locked file - [C297637]', async () => {
      await dataTable.rightClickOnItem(fileLocked);

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileLocked}`);
      // TODO: change expect to true when ACA-2174 is done
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${fileLocked}`);
      expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileLocked}`);
      expect(await contextMenu.isViewPresent()).toBe(true, `View is not displayed for ${fileLocked}`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed for ${fileLocked}`);
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileLocked}`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed for ${fileLocked}`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileLocked}`);
      expect(await contextMenu.isSharePresent()).toBe(true, `Share is not displayed for ${fileLocked}`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(true, `Manage Versions is not displayed for ${fileLocked}`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed for ${fileLocked}`);
      expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileLocked}`);
      expect(await contextMenu.isViewDetailsPresent()).toBe(false, `View details is displayed for ${fileLocked}`);
    });

    it('Context menu has the correct actions for a folder - [C280609]', async () => {
      await dataTable.rightClickOnItem(folderUser);

      expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${folderUser}`);
      expect(await contextMenu.isEditFolderPresent()).toBe(true, `Edit folder is not displayed for ${folderUser}`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed for ${folderUser}`);
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${folderUser}`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed for ${folderUser}`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed for ${folderUser}`);
      expect(await contextMenu.isViewPresent()).toBe(false, `View is displayed for ${folderUser}`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage Versions is displayed for ${folderUser}`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for ${folderUser}`);
      expect(await contextMenu.isSharePresent()).toBe(false, `Share is displayed for ${folderUser}`);
      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${folderUser}`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${folderUser}`);
    });
  });

  describe('on Trash', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickTrashAndWait();
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('Context menu has the correct actions for a file - [C286258]', async () => {
      await dataTable.rightClickOnItem(fileInTrash);

      expect(await contextMenu.isPermanentDeletePresent()).toBe(true, `Permanently delete is not displayed for ${fileInTrash}`);
      expect(await contextMenu.isRestorePresent()).toBe(true, `Restore is not displayed for ${fileInTrash}`);
      expect(await contextMenu.isDownloadPresent()).toBe(false, `Download is displayed for ${fileInTrash}`);
      expect(await contextMenu.isViewPresent()).toBe(false, `View is displayed for ${fileInTrash}`);
      expect(await contextMenu.isFavoritePresent()).toBe(false, `Favorite is displayed for ${fileInTrash}`);
      expect(await contextMenu.isCopyPresent()).toBe(false, `Copy is displayed for ${fileInTrash}`);
      expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed for ${fileInTrash}`);
      expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed for ${fileInTrash}`);
      expect(await contextMenu.isSharePresent()).toBe(false, `Share is displayed for ${fileInTrash}`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage Versions is displayed for ${fileInTrash}`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for ${fileInTrash}`);
      expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileInTrash}`);
      expect(await contextMenu.isViewDetailsPresent()).toBe(false, `View details is displayed for ${fileInTrash}`);
      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileInTrash}`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${fileInTrash}`);
    });

    it('Context menu has the correct actions for a folder - [C286259]', async () => {
      await dataTable.rightClickOnItem(folderInTrash);

      expect(await contextMenu.isPermanentDeletePresent()).toBe(true, `Permanently delete is not displayed for ${folderInTrash}`);
      expect(await contextMenu.isRestorePresent()).toBe(true, `Restore is not displayed for ${folderInTrash}`);
      expect(await contextMenu.isDownloadPresent()).toBe(false, `Download is displayed for ${folderInTrash}`);
      expect(await contextMenu.isViewPresent()).toBe(false, `View is displayed for ${folderInTrash}`);
      expect(await contextMenu.isFavoritePresent()).toBe(false, `Favorite is displayed for ${folderInTrash}`);
      expect(await contextMenu.isCopyPresent()).toBe(false, `Copy is displayed for ${folderInTrash}`);
      expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed for ${folderInTrash}`);
      expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed for ${folderInTrash}`);
      expect(await contextMenu.isSharePresent()).toBe(false, `Share is displayed for ${folderInTrash}`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage Versions is displayed for ${folderInTrash}`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for ${folderInTrash}`);
      expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${folderInTrash}`);
      expect(await contextMenu.isViewDetailsPresent()).toBe(false, `View details is displayed for ${folderInTrash}`);
      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${folderInTrash}`);
    });
  });

  describe('on Search Results', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickPersonalFilesAndWait();
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('Context menu has the correct actions for a file - [C291827]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFiles();
      await searchInput.searchForTextAndCloseSearchOptions(fileSiteUser);
      await dataTable.rightClickOnItem(fileSiteUser);

      expect(await contextMenu.isEditOfflinePresent()).toBe(true, `Edit offline is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${fileSiteUser}`);
      expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isViewPresent()).toBe(true, `View is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isToggleFavoritePresent()).toBe(true, `Toggle favorite is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed for ${fileSiteUser}`);
      expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed for ${fileSiteUser}`);
      expect(await contextMenu.isSharePresent()).toBe(true, `Share is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(true, `Manage Versions not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(true, `Upload new version not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isManagePermissionsPresent()).toBe(true, `Permissions is not displayed for ${fileSiteUser}`);
      expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileSiteUser}`);
      expect(await contextMenu.isViewDetailsPresent()).toBe(false, `View details is displayed for ${fileSiteUser}`);
    });

    it('Context menu has the correct actions for a locked file - [C297638]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFiles();
      await searchInput.searchForTextAndCloseSearchOptions(fileLocked);
      await dataTable.rightClickOnItem(fileLocked);

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileLocked}`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(true, `Cancel editing is not displayed for ${fileLocked}`);
      expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileLocked}`);
      expect(await contextMenu.isViewPresent()).toBe(true, `View is not displayed for ${fileLocked}`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed for ${fileLocked}`);
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileLocked}`);
      expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed for ${fileLocked}`);
      expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed for ${fileLocked}`);
      expect(await contextMenu.isSharePresent()).toBe(true, `Share is not displayed for ${fileLocked}`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(true, `Manage Versions not displayed for ${fileLocked}`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(true, `Upload new version not displayed for ${fileLocked}`);
      expect(await contextMenu.isManagePermissionsPresent()).toBe(true, `Permissions is not displayed for ${fileLocked}`);
      expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileLocked}`);
      expect(await contextMenu.isViewDetailsPresent()).toBe(false, `View details is displayed for ${fileLocked}`);
    });

    it('Context menu has the correct actions for a folder - [C291828]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFolders();
      await searchInput.searchForTextAndCloseSearchOptions(folderSiteUser);
      await dataTable.rightClickOnItem(folderSiteUser);

      expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${folderSiteUser}`);
      expect(await contextMenu.isEditFolderPresent()).toBe(true, `Edit folder is not displayed for ${folderSiteUser}`);
      expect(await contextMenu.isToggleFavoritePresent()).toBe(true, `Toggle favorite is not displayed for ${folderSiteUser}`);
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${folderSiteUser}`);
      expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed for ${folderSiteUser}`);
      expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed for ${folderSiteUser}`);
      expect(await contextMenu.isManagePermissionsPresent()).toBe(true, `Permissions is not displayed for ${folderSiteUser}`);
      expect(await contextMenu.isViewPresent()).toBe(false, `View is displayed for ${folderSiteUser}`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage Versions displayed for ${folderSiteUser}`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version displayed for ${folderSiteUser}`);
      expect(await contextMenu.isSharePresent()).toBe(false, `Share is displayed for ${folderSiteUser}`);
      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${folderSiteUser}`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${folderSiteUser}`);
    });
  });
});
