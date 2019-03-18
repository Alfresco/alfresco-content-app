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

import { browser, protractor } from 'protractor';
import { LoginPage, BrowsingPage, SearchResultsPage } from '../../pages/pages';
import { SITE_VISIBILITY } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Toolbar actions - multiple selection : ', () => {
  const username = `user-${Utils.random()}`;

  const parent = `parent-${Utils.random()}`; let parentId;

  const file1 = `my-file1-${Utils.random()}.txt`; let file1Id;
  const file2 = `my-file2-${Utils.random()}.txt`; let file2Id;

  const folder1 = `my-folder1-${Utils.random()}`; let folder1Id;
  const folder2 = `my-folder2-${Utils.random()}`; let folder2Id;

  const fileForDelete1 = `file-${Utils.random()}.txt`; let fileForDelete1Id;
  const fileForDelete2 = `file-${Utils.random()}.txt`; let fileForDelete2Id;
  const folderForDelete1 = `folder-${Utils.random()}`; let folderForDelete1Id;
  const folderForDelete2 = `folder-${Utils.random()}`; let folderForDelete2Id;

  const siteName = `site-${Utils.random()}`;
  const file1InSite = `my-fileInSite1-${Utils.random()}.txt`;
  const file2InSite = `my-fileInSite2-${Utils.random()}.txt`;
  const folder1InSite = `my-folderInSite1-${Utils.random()}`;
  const folder2InSite = `my-folderInSite2-${Utils.random()}`;
  const fileLocked1InSite = `my-fileLockedInSite1-${Utils.random()}.txt`; let fileLocked1InSiteId;
  const fileLocked2InSite = `my-fileLockedInSite2-${Utils.random()}.txt`; let fileLocked2InSiteId;

  const fileLocked1 = `my-fileLocked1-${Utils.random()}.txt`; let fileLocked1Id;
  const fileLocked2 = `my-fileLocked2-${Utils.random()}.txt`; let fileLocked2Id;

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

    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;

    file1Id = (await apis.user.nodes.createFile(file1, parentId)).entry.id;
    file2Id = (await apis.user.nodes.createFile(file2, parentId)).entry.id;
    folder1Id = (await apis.user.nodes.createFolder(folder1, parentId)).entry.id;
    folder2Id = (await apis.user.nodes.createFolder(folder2, parentId)).entry.id;
    fileForDelete1Id = (await apis.user.nodes.createFile(fileForDelete1, parentId)).entry.id;
    fileForDelete2Id = (await apis.user.nodes.createFile(fileForDelete2, parentId)).entry.id;
    folderForDelete1Id = (await apis.user.nodes.createFolder(folderForDelete1, parentId)).entry.id;
    folderForDelete2Id = (await apis.user.nodes.createFolder(folderForDelete2, parentId)).entry.id;
    fileLocked1Id = (await apis.user.nodes.createFile(fileLocked1, parentId)).entry.id;
    fileLocked2Id = (await apis.user.nodes.createFile(fileLocked2, parentId)).entry.id;
    await apis.user.nodes.lockFile(fileLocked1Id);
    await apis.user.nodes.lockFile(fileLocked2Id);

    await apis.user.shared.shareFilesByIds([file1Id, file2Id, fileLocked1Id, fileLocked2Id]);
    await apis.user.shared.waitForApi({ expect: 4 });

    await apis.user.favorites.addFavoritesByIds('file', [file1Id, file2Id, fileLocked1Id, fileLocked2Id]);
    await apis.user.favorites.addFavoritesByIds('folder', [folder1Id, folder2Id]);
    await apis.user.favorites.waitForApi({ expect: 6 });

    await apis.user.nodes.deleteNodesById([fileForDelete1Id, fileForDelete2Id, folderForDelete1Id, folderForDelete2Id], false);
    await apis.user.trashcan.waitForApi({ expect: 4 });

    await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PRIVATE);
    const docLibId = await apis.user.sites.getDocLibId(siteName);
    await apis.user.nodes.createFile(file1InSite, docLibId);
    await apis.user.nodes.createFile(file2InSite, docLibId);
    await apis.user.nodes.createFolder(folder1InSite, docLibId);
    await apis.user.nodes.createFolder(folder2InSite, docLibId);
    fileLocked1InSiteId = (await apis.user.nodes.createFile(fileLocked1InSite, docLibId)).entry.id;
    fileLocked2InSiteId = (await apis.user.nodes.createFile(fileLocked2InSite, docLibId)).entry.id;

    await apis.user.nodes.lockFile(fileLocked1InSiteId);
    await apis.user.nodes.lockFile(fileLocked2InSiteId);

    await apis.user.search.waitForApi(username, { expect: 6 });

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await Promise.all([
      apis.user.nodes.deleteNodeById(parentId),
      apis.user.trashcan.emptyTrash(),
      apis.user.sites.deleteSite(siteName)
    ]);
    done();
  });

  describe('on Personal Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await dataTable.clearSelection();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);
      await dataTable.waitForBody();
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('Unselect items with single click - [C280458]', async () => {
      await dataTable.selectMultipleItems([file1, file2, folder1, folder2]);

      expect(await dataTable.countSelectedRows()).toEqual(4, 'incorrect selected rows number');

      await dataTable.selectItem(file1);

      expect(await dataTable.countSelectedRows()).toEqual(1, 'incorrect selected rows number');
    });

    it('Select / unselect selected items by CMD+click - [C217110]', async () => {
      await browser.actions().sendKeys(protractor.Key.COMMAND).perform();
      await dataTable.selectItem(file1);
      await dataTable.selectItem(file2);
      await dataTable.selectItem(folder1);
      await dataTable.selectItem(folder2);
      await browser.actions().sendKeys(protractor.Key.NULL).perform();

      expect(await dataTable.countSelectedRows()).toEqual(4, 'incorrect selected rows number');

      await browser.actions().sendKeys(protractor.Key.COMMAND).perform();
      await dataTable.selectItem(file1);
      await dataTable.selectItem(file2);
      await browser.actions().sendKeys(protractor.Key.NULL).perform();

      expect(await dataTable.countSelectedRows()).toEqual(2, 'incorrect selected rows number');
    });

    it('correct actions appear when multiple files are selected - [C217112]', async () => {
      await dataTable.selectMultipleItems([file1, file2]);

      expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
      expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isRemoveFavoritePresent()).toBe(true, `Remove Favorite is not displayed for selected files`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when multiple locked files are selected - [C297619]', async () => {
      await dataTable.selectMultipleItems([fileLocked1, fileLocked2]);

      expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
      expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for selected files`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when multiple folders are selected - [C280459]', async () => {
      await dataTable.selectMultipleItems([folder1, folder2]);

      expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
      expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for selected files`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when both files and folders are selected - [C280460]', async () => {
      await dataTable.selectMultipleItems([file1, file2, folder1, folder2]);

      expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
      expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for selected files`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

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

    it('correct actions appear when multiple files are selected - [C280461]', async () => {
      await dataTable.selectMultipleItems([file1InSite, file2InSite]);

      expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed for selected files');
      expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed for selected files');
      expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed for selected files');

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isFavoritePresent()).toBe(true, `Favorite is not displayed for selected files`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when multiple locked files are selected - [C297620]', async () => {
      await dataTable.selectMultipleItems([fileLocked1InSite, fileLocked2InSite]);

      expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed for selected files');
      expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed for selected files');
      expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed for selected files');

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isFavoritePresent()).toBe(true, `Favorite is not displayed for selected files`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when multiple folders are selected - [C280462]', async () => {
      await dataTable.selectMultipleItems([folder1InSite, folder2InSite]);

      expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
      expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isFavoritePresent()).toBe(true, `Favorite is not displayed for selected files`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when both files and folders are selected - [C280463]', async () => {
      await dataTable.selectMultipleItems([file1InSite, file2InSite, folder1InSite, folder2InSite]);

      expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
      expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isFavoritePresent()).toBe(true, `Favorite is not displayed for selected files`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

      await toolbar.closeMoreMenu();
    });
  });

  describe('on Shared Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await dataTable.clearSelection();
      await page.clickSharedFilesAndWait();
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('correct actions appear when multiple files are selected - [C280467]', async () => {
      await dataTable.selectMultipleItems([file1, file2]);

      expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
      expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed for selected files');
      expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed for selected files');

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for selected files`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when multiple locked files are selected - [C297623]', async () => {
      await dataTable.selectMultipleItems([fileLocked1, fileLocked2]);

      expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
      expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed for selected files');
      expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed for selected files');

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for selected files`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

      await toolbar.closeMoreMenu();
    });
  });

  describe('on Recent Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await dataTable.clearSelection();
      await page.clickRecentFilesAndWait();
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('correct actions appear when multiple files are selected - [C280468]', async () => {
      await dataTable.selectMultipleItems([file1, file2]);

      expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
      expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for selected files`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when multiple locked files are selected - [C297624]', async () => {
      await dataTable.selectMultipleItems([fileLocked1, fileLocked2]);

      expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
      expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for selected files`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

      await toolbar.closeMoreMenu();
    });
  });

  describe('on Favorites', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await dataTable.clearSelection();
      await page.clickFavoritesAndWait();
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('correct actions appear when multiple files are selected - [C280469]', async () => {
      await dataTable.selectMultipleItems([file1, file2]);

      expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
      expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for selected files`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when multiple locked files are selected - [C297625]', async () => {
      await dataTable.selectMultipleItems([fileLocked1, fileLocked2]);

      expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
      expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for selected files`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when multiple folders are selected - [C280470]', async () => {
      await dataTable.selectMultipleItems([folder1, folder2]);

      expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
      expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for selected files`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when both files and folders are selected - [C280471]', async () => {
      await dataTable.selectMultipleItems([file1, file2, folder1, folder2]);

      expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
      expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed for selected files');
      expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for selected files`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

      await toolbar.closeMoreMenu();
    });
  });

  describe('on Trash', () => {
    beforeEach(async (done) => {
      await page.clickTrashAndWait();
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('correct actions appear when multiple files are selected - [C280472]', async () => {
      await dataTable.selectMultipleItems([fileForDelete1, fileForDelete2]);

      expect(await toolbar.isButtonPresent('Permanently delete')).toBe(true, 'Permanently delete is displayed');
      expect(await toolbar.isButtonPresent('Restore')).toBe(true, 'Restore is not displayed');
    });

    it('correct actions appear when multiple folders are selected - [C280473]', async () => {
      await dataTable.selectMultipleItems([folderForDelete1, folderForDelete2]);

      expect(await toolbar.isButtonPresent('Permanently delete')).toBe(true, 'Permanently delete is displayed');
      expect(await toolbar.isButtonPresent('Restore')).toBe(true, 'Restore is not displayed');
    });

    it('correct actions appear when both files and folders are selected - [C280474]', async () => {
      await dataTable.selectMultipleItems([fileForDelete1, fileForDelete2, folderForDelete1, folderForDelete2]);

      expect(await toolbar.isButtonPresent('Permanently delete')).toBe(true, 'Permanently delete is displayed');
      expect(await toolbar.isButtonPresent('Restore')).toBe(true, 'Restore is not displayed');
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

    it('correct actions appear when multiple files are selected - [C291820]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFiles();
      await searchInput.searchForTextAndCloseSearchOptions('my-fileInSite');
      await dataTable.selectMultipleItems([file1InSite, file2InSite]);

      expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed for selected files');
      expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed for selected files');
      expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed for selected files');

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for selected files`);
      expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for selected files`);
      expect(await toolbar.menu.isToggleFavoritePresent()).toBe(true, `Favorite is not displayed for selected files`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when multiple locked files are selected - [C297626]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFiles();
      await searchInput.searchForTextAndCloseSearchOptions('my-fileLockedInSite');
      await dataTable.selectMultipleItems([fileLocked1InSite, fileLocked2InSite]);

      expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed for selected files');
      expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed for selected files');
      expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed for selected files');

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for selected files`);
      expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for selected files`);
      expect(await toolbar.menu.isToggleFavoritePresent()).toBe(true, `Favorite is not displayed for selected files`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when multiple folders are selected - [C291821]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFolders();
      await searchInput.searchForTextAndCloseSearchOptions('my-folderInSite');
      await dataTable.selectMultipleItems([folder1InSite, folder2InSite]);

      expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
      expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for selected files`);
      expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for selected files`);
      expect(await toolbar.menu.isToggleFavoritePresent()).toBe(true, `Favorite is not displayed for selected files`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when both files and folders are selected - [C291822]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchForTextAndCloseSearchOptions('my-f');
      await dataTable.selectMultipleItems([file1InSite, file2InSite, folder1InSite, folder2InSite]);

      expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
      expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for selected files`);
      expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for selected files`);
      expect(await toolbar.menu.isToggleFavoritePresent()).toBe(true, `Favorite is not displayed for selected files`);
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

      await toolbar.closeMoreMenu();
    });
  });
});
