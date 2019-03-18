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

describe('Toolbar actions - single selection : ', () => {
  const username = `user-${Utils.random()}`;

  const fileUser = `fileUser-${Utils.random()}.txt`; let fileUserId;
  const folderUser = `folderUser-${Utils.random()}`; let folderUserId;
  const fileForDelete = `fileForDelete-${Utils.random()}.txt`; let fileForDeleteId;
  const folderForDelete = `folderForDelete-${Utils.random()}`; let folderForDeleteId;
  const fileLocked = `fileLocked-${Utils.random()}.txt`; let fileLockedId;

  const siteName = `site-${Utils.random()}`;
  const fileInSite = `file-site-${Utils.random()}.txt`;
  const fileLockedInSite = `file-locked-site-${Utils.random()}.txt`; let fileLockedInSiteId;
  const folderInSite = `folder-site-${Utils.random()}`;

  const adminPublic = `admin-public-${Utils.random()}`;
  const adminModerated = `admin-moderated-${Utils.random()}`;

  const apis = {
      admin: new RepoClient(),
      user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const searchResultsPage = new SearchResultsPage();
  const { searchInput } = searchResultsPage.header;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });

    fileUserId = (await apis.user.nodes.createFile(fileUser)).entry.id;
    fileForDeleteId = (await apis.user.nodes.createFile(fileForDelete)).entry.id;
    folderForDeleteId = (await apis.user.nodes.createFolder(folderForDelete)).entry.id;
    folderUserId = (await apis.user.nodes.createFolder(folderUser)).entry.id;
    fileLockedId = (await apis.user.nodes.createFile(fileLocked)).entry.id;

    await apis.user.shared.shareFileById(fileUserId);
    await apis.user.shared.shareFileById(fileLockedId);
    await apis.user.shared.waitForApi({ expect: 2 });

    await apis.user.favorites.addFavoriteById('file', fileUserId);
    await apis.user.favorites.addFavoriteById('folder', folderUserId);
    await apis.user.favorites.addFavoriteById('file', fileLockedId);
    await apis.user.favorites.waitForApi({ expect: 3 });

    await apis.user.nodes.lockFile(fileLockedId);

    await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PRIVATE);
    const docLibId = await apis.user.sites.getDocLibId(siteName);
    await apis.user.nodes.createFile(fileInSite, docLibId);
    fileLockedInSiteId = (await apis.user.nodes.createFile(fileLockedInSite, docLibId)).entry.id;
    await apis.user.nodes.createFolder(folderInSite, docLibId);

    await apis.user.nodes.lockFile(fileLockedInSiteId);

    await apis.user.nodes.deleteNodeById(fileForDeleteId, false);
    await apis.user.nodes.deleteNodeById(folderForDeleteId, false);

    await apis.admin.sites.createSite(adminPublic);
    await apis.admin.sites.createSite(adminModerated, SITE_VISIBILITY.MODERATED);
    await apis.user.favorites.addFavoriteById('site', adminPublic);
    await apis.user.favorites.addFavoriteById('site', adminModerated);
    await apis.user.sites.requestToJoin(adminModerated);

    await apis.user.queries.waitForSites(siteName, { expect: 1 });

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

  describe('on Personal Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await dataTable.clearSelection();
      await page.clickPersonalFilesAndWait();
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('selected row is marked with a check circle icon - [C213134]', async () => {
      await dataTable.selectItem(fileUser);

      expect(await dataTable.hasCheckMarkIcon(fileUser)).toBe(true, 'check mark missing');
    });

    it('actions are not displayed when no item is selected - [C213120]', async () => {
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('correct actions appear when a file is selected - [C213122]', async () => {
      await dataTable.selectItem(fileUser);

      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${fileUser}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileUser}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileUser}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditOfflinePresent()).toBe(true, `Edit offline is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${fileUser}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload New Version is not displayed for ${fileUser}`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when a locked file is selected - [C297612]', async () => {
      await dataTable.selectItem(fileLocked);

      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${fileLocked}`);
      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${fileLocked}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileLocked}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileLocked}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileLocked}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(true, `Cancel editing is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed for ${fileLocked}`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when a folder is selected - [C213123]', async () => {
      await dataTable.selectItem(folderUser);

      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${folderUser}`);
      expect(await toolbar.isViewPresent()).toBe(false, `View is displayed for ${folderUser}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not enabled for ${folderUser}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditFolderPresent()).toBe(true, `Edit folder is not displayed for ${folderUser}`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${folderUser}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${folderUser}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${folderUser}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${folderUser}`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for ${folderUser}`);
      expect(await toolbar.menu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${folderUser}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed for ${folderUser}`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for ${folderUser}`);

      await toolbar.closeMoreMenu();
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

    it('actions are not displayed when no item is selected - [C280439]', async () => {
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('correct actions appear when a file is selected - [C280440]', async () => {
      await dataTable.selectItem(fileInSite);

      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${fileInSite}`);
      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${fileInSite}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileInSite}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileInSite}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditOfflinePresent()).toBe(true, `Edit offline is not displayed for ${fileInSite}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${fileInSite}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileInSite}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileInSite}`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for ${fileInSite}`);
      expect(await toolbar.menu.isFavoritePresent()).toBe(true, `Favorite is not displayed for ${fileInSite}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed for ${fileInSite}`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed for ${fileInSite}`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when a locked file is selected - [C297614]', async () => {
      await dataTable.selectItem(fileLockedInSite);

      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${fileLockedInSite}`);
      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${fileLockedInSite}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileLockedInSite}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileLockedInSite}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileLockedInSite}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(true, `Cancel editing is not displayed for ${fileLockedInSite}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileLockedInSite}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileLockedInSite}`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for ${fileLockedInSite}`);
      expect(await toolbar.menu.isFavoritePresent()).toBe(true, `Favorite is not displayed for ${fileLockedInSite}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed for ${fileLockedInSite}`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed for ${fileLockedInSite}`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when a folder is selected - [C280441]', async () => {
      await dataTable.selectItem(folderInSite);

      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${folderInSite}`);
      expect(await toolbar.isViewPresent()).toBe(false, `View is displayed for ${folderInSite}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not enabled for ${folderInSite}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditFolderPresent()).toBe(true, `Edit folder is not displayed for ${folderInSite}`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${folderInSite}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${folderInSite}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${folderInSite}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${folderInSite}`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for ${folderInSite}`);
      expect(await toolbar.menu.isFavoritePresent()).toBe(true, `Favorite is not displayed for ${folderInSite}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed for ${folderInSite}`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for ${folderInSite}`);

      await toolbar.closeMoreMenu();
    });
  });

  describe('on a library', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
      await page.clickPersonalFiles();
      done();
    });

    it('Available actions for a library - My Libraries - [C213135]', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.selectItem(siteName);

      expect(await toolbar.isEmpty()).toBe(false, 'toolbar not displayed');
      expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${siteName}`);
      expect(await toolbar.isButtonPresent('Leave library')).toBe(true, `Leave is not displayed for ${siteName}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${siteName}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${siteName}`);

      await toolbar.closeMoreMenu();
    });

    it('Available actions for a library - Favorite Libraries - user is a member - [C289892]', async () => {
      await page.goToFavoriteLibrariesAndWait();
      await dataTable.selectItem(siteName);

      expect(await toolbar.isEmpty()).toBe(false, 'toolbar not displayed');
      expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${siteName}`);
      expect(await toolbar.isButtonPresent('Leave library')).toBe(true, `Leave is not displayed for ${siteName}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${siteName}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${siteName}`);

      await toolbar.closeMoreMenu();
    });

    it('Available actions for a library - Favorite Libraries - user is not a member - [C290090]', async () => {
      await page.goToFavoriteLibrariesAndWait();
      await dataTable.selectItem(adminPublic);

      expect(await toolbar.isEmpty()).toBe(false, 'toolbar not displayed');
      expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${adminPublic}`);
      expect(await toolbar.isButtonPresent('Join')).toBe(true, `Join is not displayed for ${adminPublic}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${adminPublic}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${adminPublic}`);

      await toolbar.closeMoreMenu();
    });

    it('Available actions for a moderated library - Favorite Libraries - user requested to join - [C290091]', async () => {
      await page.goToFavoriteLibrariesAndWait();
      await dataTable.selectItem(adminModerated);

      expect(await toolbar.isEmpty()).toBe(false, 'toolbar not displayed');
      expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${adminModerated}`);
      expect(await toolbar.isButtonPresent('Cancel join request')).toBe(true, `Cancel join is not displayed for ${adminModerated}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${adminModerated}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${adminModerated}`);

      await toolbar.closeMoreMenu();
    });

    it('Available actions for a library - Search Results - [C290084]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchForTextAndCloseSearchOptions(siteName);
      await dataTable.selectItem(siteName);

      expect(await toolbar.isEmpty()).toBe(false, 'toolbar not displayed');
      expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${siteName}`);
      expect(await toolbar.isButtonPresent('Leave library')).toBe(true, `Leave is not displayed for ${siteName}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${siteName}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${siteName}`);

      await toolbar.closeMoreMenu();
    });

    it('Available actions for a library - Search Results - user is not a member - [C290085]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchForTextAndCloseSearchOptions(adminPublic);
      await dataTable.selectItem(adminPublic);

      expect(await toolbar.isEmpty()).toBe(false, 'toolbar not displayed');
      expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${adminPublic}`);
      expect(await toolbar.isButtonPresent('Join')).toBe(true, `Join is not displayed for ${adminPublic}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${adminPublic}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${adminPublic}`);

      await toolbar.closeMoreMenu();
    });

    it('Available actions for a moderated library - Search Results - user requested to join - [C290086]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchForTextAndCloseSearchOptions(adminModerated);
      await dataTable.selectItem(adminModerated);

      expect(await toolbar.isEmpty()).toBe(false, 'toolbar not displayed');
      expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${adminModerated}`);
      expect(await toolbar.isButtonPresent('Cancel join request')).toBe(true, `Cancel join is not displayed for ${adminModerated}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${adminModerated}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${adminModerated}`);

      await toolbar.closeMoreMenu();
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

    it('actions are not displayed when no item is selected - [C280445]', async () => {
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('correct actions appear when a file is selected - [C286265]', async () => {
      await page.dataTable.selectItem(fileUser);

      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${fileUser}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileUser}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileUser}`);
      expect(await toolbar.isSharedLinkSettingsPresent()).toBe(true, `Shared link settings is not displayed for ${fileUser}`);

      await toolbar.openMoreMenu();

      // TODO: change expect to true when ACA-2173 is done
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileUser}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${fileUser}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed for ${fileUser}`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when a locked file is selected - [C297615]', async () => {
      await page.dataTable.selectItem(fileLocked);

      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${fileLocked}`);
      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${fileLocked}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileLocked}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileLocked}`);
      expect(await toolbar.isSharedLinkSettingsPresent()).toBe(true, `Shared link settings is not displayed for ${fileLocked}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileLocked}`);
      // TODO: change expect to true when ACA-2173 is done
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${fileLocked}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed for ${fileLocked}`);

      await toolbar.closeMoreMenu();
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

    it('actions are not displayed when no item is selected - [C280447]', async () => {
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('correct actions appear when a file is selected - [C280448]', async () => {
      await dataTable.selectItem(fileUser);

      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${fileUser}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileUser}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileUser}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditOfflinePresent()).toBe(true, `Edit offline is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${fileUser}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed for ${fileUser}`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when a locked file is selected - [C297616]', async () => {
      await dataTable.selectItem(fileLocked);

      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${fileLocked}`);
      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${fileLocked}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileLocked}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileLocked}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileLocked}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(true, `Cancel editing is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed for ${fileLocked}`);

      await toolbar.closeMoreMenu();
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

    it('actions are not displayed when no item is selected - [C280449]', async () => {
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('correct actions appear when a file is selected - [C280450]', async () => {
      await dataTable.selectItem(fileUser);

      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${fileUser}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileUser}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileUser}`);

      await toolbar.openMoreMenu();

      // TODO: change expect to true when ACA-2174 is done
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileUser}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${fileUser}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed for ${fileUser}`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when a locked file is selected - [C297617]', async () => {
      await dataTable.selectItem(fileLocked);

      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${fileLocked}`);
      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${fileLocked}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileLocked}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileLocked}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileLocked}`);
      // TODO: change expect to true when ACA-2174 is done
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${fileLocked}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed for ${fileLocked}`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when a folder is selected - [C280451]', async () => {
      await dataTable.selectItem(folderUser);

      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${folderUser}`);
      expect(await toolbar.isViewPresent()).toBe(false, `View is displayed for ${folderUser}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not enabled for ${folderUser}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditFolderPresent()).toBe(true, `Edit folder is not displayed for ${folderUser}`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${folderUser}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${folderUser}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${folderUser}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${folderUser}`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for ${folderUser}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${folderUser}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed for ${folderUser}`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for ${folderUser}`);

      await toolbar.closeMoreMenu();
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

    it('actions are not displayed when no item is selected - [C280452]', async () => {
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('correct actions appear when a file is selected - [C280453]', async () => {
      await dataTable.selectItem(fileForDelete);

      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${fileForDelete}`);
      expect(await toolbar.isPermanentlyDeletePresent()).toBe(true, `Permanently delete is not displayed for file`);
      expect(await toolbar.isRestorePresent()).toBe(true, `Restore is not displayed for file`);
    });

    it('correct actions appear when a folder is selected - [C280454]', async () => {
      await dataTable.selectItem(folderForDelete);

      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${folderForDelete}`);
      expect(await toolbar.isPermanentlyDeletePresent()).toBe(true, `Permanently delete is displayed for folder`);
      expect(await toolbar.isRestorePresent()).toBe(true, `Restore is not displayed for folder`);
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

    it('nodes actions are not displayed when no item is selected - [C291815]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchForTextAndCloseSearchOptions(fileInSite);

      expect(await toolbar.isToggleSearchFiltersPresent()).toBe(true, `Search filter toggle is not displayed`);
      expect(await toolbar.numberOfAvailableActions()).toBe(1, `more than 1 action is present`);
    });

    it('correct actions appear when a file is selected - [C291816]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFiles();
      await searchInput.searchForTextAndCloseSearchOptions(fileUser);
      await dataTable.selectItem(fileUser);

      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${fileUser}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileUser}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileUser}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditOfflinePresent()).toBe(true, `Edit offline is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${fileUser}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for ${fileUser}`);
      expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for ${fileUser}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed for ${fileUser}`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed for ${fileUser}`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when a locked file is selected - [C297618]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFiles();
      await searchInput.searchForTextAndCloseSearchOptions(fileLocked);
      await dataTable.selectItem(fileLocked);

      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${fileLocked}`);
      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${fileLocked}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileLocked}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileLocked}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileLocked}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(true, `Cancel editing is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for ${fileLocked}`);
      expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for ${fileLocked}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed for ${fileLocked}`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when a folder is selected - [C291817]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFolders();
      await searchInput.searchForTextAndCloseSearchOptions(folderUser);
      await dataTable.selectItem(folderUser);

      expect(await toolbar.isEmpty()).toBe(false, `actions not displayed for ${folderUser}`);
      expect(await toolbar.isViewPresent()).toBe(false, `View is displayed for ${folderUser}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not enabled for ${folderUser}`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditFolderPresent()).toBe(true, `Edit folder is not displayed for ${folderUser}`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${folderUser}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${folderUser}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${folderUser}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for ${folderUser}`);
      expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for ${folderUser}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${folderUser}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed for ${folderUser}`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for ${folderUser}`);

      await toolbar.closeMoreMenu();
    });
  });
});
