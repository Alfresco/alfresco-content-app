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

describe('Context menu actions - multiple selection : ', () => {
  const username = `user-${Utils.random()}`;

  const parent = `parent=${Utils.random()}`; let parentId;

  const file1 = `my-file1-${Utils.random()}.txt`; let file1Id;
  const file2 = `my-file2-${Utils.random()}.txt`; let file2Id;
  const fileLocked1 = `my-fileLocked1-${Utils.random()}.txt`; let fileLocked1Id;
  const fileLocked2 = `my-fileLocked2-${Utils.random()}.txt`; let fileLocked2Id;

  const folder1 = `my-folder1-${Utils.random()}`; let folder1Id;
  const folder2 = `my-folder2-${Utils.random()}`; let folder2Id;

  const fileInTrash1 = `deletedFile1-${Utils.random()}.txt`; let fileInTrash1Id;
  const fileInTrash2 = `deletedFile2-${Utils.random()}.txt`; let fileInTrash2Id;
  const folderInTrash1 = `deletedFolder1-${Utils.random()}`; let folderInTrash1Id;
  const folderInTrash2 = `deletedFolder2-${Utils.random()}`; let folderInTrash2Id;

  const siteName = `site-${Utils.random()}`;
  const file1Site = `my-inSite-file1-${Utils.random()}.txt`;
  const file2Site = `my-inSite-file2-${Utils.random()}.txt`;
  const fileLocked1Site = `my-inSite-fileLocked1-${Utils.random()}.txt`; let fileLocked1SiteId;
  const fileLocked2Site = `my-inSite-fileLocked2-${Utils.random()}.txt`; let fileLocked2SiteId;
  const folder1Site = `my-inSite-folder1-${Utils.random()}`;
  const folder2Site = `my-inSite-folder2-${Utils.random()}`;

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
    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;

    file1Id = (await apis.user.nodes.createFile(file1, parentId)).entry.id;
    file2Id = (await apis.user.nodes.createFile(file2, parentId)).entry.id;
    folder1Id = (await apis.user.nodes.createFolder(folder1, parentId)).entry.id;
    folder2Id = (await apis.user.nodes.createFolder(folder2, parentId)).entry.id;

    fileLocked1Id = (await apis.user.nodes.createFile(fileLocked1, parentId)).entry.id;
    fileLocked2Id = (await apis.user.nodes.createFile(fileLocked2, parentId)).entry.id;
    await apis.user.nodes.lockFile(fileLocked1Id);
    await apis.user.nodes.lockFile(fileLocked2Id);

    await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
    const docLibId = await apis.user.sites.getDocLibId(siteName);
    await apis.user.nodes.createFile(file1Site, docLibId);
    await apis.user.nodes.createFile(file2Site, docLibId);
    await apis.user.nodes.createFolder(folder1Site, docLibId);
    await apis.user.nodes.createFolder(folder2Site, docLibId);
    fileLocked1SiteId = (await apis.user.nodes.createFile(fileLocked1Site, docLibId)).entry.id;
    fileLocked2SiteId = (await apis.user.nodes.createFile(fileLocked2Site, docLibId)).entry.id;
    await apis.user.nodes.lockFile(fileLocked1SiteId);
    await apis.user.nodes.lockFile(fileLocked2SiteId);

    await apis.user.shared.shareFilesByIds([ file1Id, file2Id, fileLocked1Id, fileLocked2Id ]);
    await apis.user.shared.waitForApi({ expect: 4 });

    await apis.user.favorites.addFavoritesByIds('file', [ file1Id, file2Id, fileLocked1Id, fileLocked2Id ]);
    await apis.user.favorites.addFavoritesByIds('folder', [ folder1Id, folder2Id ]);
    await apis.user.favorites.waitForApi({ expect: 6 + 1 });

    fileInTrash1Id = (await apis.user.nodes.createFile(fileInTrash1)).entry.id;
    fileInTrash2Id = (await apis.user.nodes.createFile(fileInTrash2)).entry.id;
    folderInTrash1Id = (await apis.user.nodes.createFolder(folderInTrash1)).entry.id;
    folderInTrash2Id = (await apis.user.nodes.createFolder(folderInTrash2)).entry.id;
    await apis.user.nodes.deleteNodesById([ fileInTrash1Id, fileInTrash2Id, folderInTrash1Id, folderInTrash2Id ], false);

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(parentId);
    await apis.user.sites.deleteSite(siteName);
    await apis.user.trashcan.emptyTrash();
    done();
  });

  describe('Generic tests', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('Context menu appears on right click on a multiple selection of items - [C286268]', async () => {
      await dataTable.selectMultipleItems([ file1, file2 ]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
    });

    it('Context menu appears when right clicking on a single item while having multiple items selected - [C286269]', async () => {
      await dataTable.selectMultipleItems([ file2, folder1 ]);
      await dataTable.rightClickOnItem(file1);

      expect(await dataTable.hasContextMenu()).toBe(true, `Context menu is not displayed for ${file1}`);
      expect(await dataTable.countSelectedRows()).toEqual(1, 'incorrect number of selected rows');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${file1}`);
      expect(await dataTable.hasCheckMarkIcon(file1)).toBe(true, `${file1} is not selected`);
      expect(await dataTable.hasCheckMarkIcon(file2)).toBe(false, `${file2} is selected`);
      expect(await dataTable.hasCheckMarkIcon(folder1)).toBe(false, `${folder1} is selected`);
    });
  });

  describe('on Personal Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);
      await dataTable.waitForBody();
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('correct actions appear when multiple files are selected - [C280661]', async () => {
      await dataTable.selectMultipleItems([file1, file2]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });

    it('correct actions appear when multiple locked files are selected - [C297627]', async () => {
      await dataTable.selectMultipleItems([fileLocked1, fileLocked2]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });

    it('correct actions appear when multiple folders are selected - [C280632]', async () => {
      await dataTable.selectMultipleItems([folder1, folder2]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });

    it('correct actions appear when both files and folders are selected - [C280631]', async () => {
      await dataTable.selectMultipleItems([file1, file2, folder1, folder2]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
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

    it('correct actions appear when multiple files are selected - [C280641]', async () => {
      await dataTable.selectMultipleItems([ file1Site, file2Site ]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isFavoritePresent()).toBe(true, `Favorite is not displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });

    it('correct actions appear when multiple locked files are selected - [C297628]', async () => {
      await dataTable.selectMultipleItems([ fileLocked1Site, fileLocked2Site ]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isFavoritePresent()).toBe(true, `Favorite is not displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });

    it('correct actions appear when multiple folders are selected - [C280574]', async () => {
      await dataTable.selectMultipleItems([ folder1Site, folder2Site ]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isFavoritePresent()).toBe(true, `Favorite is not displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });

    it('correct actions appear when both files and folders are selected - [C280642]', async () => {
      await dataTable.selectMultipleItems([ file1Site, file2Site, folder1Site, folder2Site ]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isFavoritePresent()).toBe(true, `Favorite is not displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });
  });

  describe('on Shared Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickSharedFilesAndWait();
      await dataTable.clearSelection();
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('correct actions appear when multiple files are selected - [C280648]', async () => {
      await dataTable.selectMultipleItems([ file1, file2 ]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is not displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });

    it('correct actions appear when multiple locked files are selected - [C297629]', async () => {
      await dataTable.selectMultipleItems([ fileLocked1, fileLocked2 ]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is not displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });
  });

  describe('Recent Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickRecentFilesAndWait();
      await dataTable.clearSelection();
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('correct actions appear when multiple files are selected - [C280652]', async () => {
      await dataTable.selectMultipleItems([ file1, file2 ]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });

    it('correct actions appear when multiple locked files are selected - [C297630]', async () => {
      await dataTable.selectMultipleItems([ fileLocked1, fileLocked2 ]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });
  });

  describe('Favorites', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickFavoritesAndWait();
      await dataTable.clearSelection();
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('correct actions appear when multiple files are selected - [C280656]', async () => {
      await dataTable.selectMultipleItems([ file1, file2 ]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });

    it('correct actions appear when multiple locked files are selected - [C297631]', async () => {
      await dataTable.selectMultipleItems([ fileLocked1, fileLocked2 ]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });

    it('correct actions appear when multiple folders are selected - [C280664]', async () => {
      await dataTable.selectMultipleItems([ folder1, folder2 ]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });

    it('correct actions appear when both files and folders are selected - [C280657]', async () => {
      await dataTable.selectMultipleItems([ file1, file2, folder1, folder2 ]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMovePresent()).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Toggle favorite is not displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });
  });

  describe('Trash', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickTrashAndWait();
      await dataTable.clearSelection();
      done();
    });

    afterAll(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('correct actions appear when multiple files are selected - [C286273]', async () => {
      await dataTable.selectMultipleItems([ fileInTrash1, fileInTrash2 ]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isPermanentDeletePresent()).toBe(true, 'Permanently delete is not displayed');
      expect(await contextMenu.isRestorePresent()).toBe(true, 'Restore is not displayed');
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(false, 'Download is displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(false, `Copy is displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed`);
      expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed`);
      expect(await contextMenu.isFavoritePresent()).toBe(false, `Favorite is displayed`);
      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });

    it('correct actions appear when multiple folders are selected - [C286274]', async () => {
      await dataTable.selectMultipleItems([ folderInTrash1, folderInTrash2 ]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isPermanentDeletePresent()).toBe(true, 'Permanently delete is not displayed');
      expect(await contextMenu.isRestorePresent()).toBe(true, 'Restore is not displayed');
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(false, 'Download is displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(false, `Copy is displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed`);
      expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed`);
      expect(await contextMenu.isFavoritePresent()).toBe(false, `Favorite is displayed`);
      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });

    it('correct actions appear when both files and folders are selected - [C286275]', async () => {
      await dataTable.selectMultipleItems([ fileInTrash1, fileInTrash2, folderInTrash1, folderInTrash2 ]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isPermanentDeletePresent()).toBe(true, 'Permanently delete is not displayed');
      expect(await contextMenu.isRestorePresent()).toBe(true, 'Restore is not displayed');
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(false, 'Download is displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(false, `Copy is displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed`);
      expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed`);
      expect(await contextMenu.isFavoritePresent()).toBe(false, `Favorite is displayed`);
      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
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

    it('correct actions appear when multiple files are selected - [C291831]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFiles();
      await searchInput.searchForTextAndCloseSearchOptions('my-inSite-file');
      await dataTable.selectMultipleItems([ file1Site, file2Site ]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed`);
      expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed`);
      expect(await contextMenu.isToggleFavoritePresent()).toBe(true, `Toggle favorite is not displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });

    it('correct actions appear when multiple locked files are selected - [C297632]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFiles();
      await searchInput.searchForTextAndCloseSearchOptions('my-inSite-file');
      await dataTable.selectMultipleItems([ fileLocked1Site, fileLocked2Site ]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed`);
      expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed`);
      expect(await contextMenu.isToggleFavoritePresent()).toBe(true, `Toggle favorite is not displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });

    it('correct actions appear when multiple folders are selected - [C291832]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFolders();
      await searchInput.searchForTextAndCloseSearchOptions('my-inSite-folder');
      await dataTable.selectMultipleItems([ folder1Site, folder2Site ]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed`);
      expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed`);
      expect(await contextMenu.isToggleFavoritePresent()).toBe(true, `Toggle favorite is not displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });

    it('correct actions appear when both files and folders are selected - [C291833]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchForTextAndCloseSearchOptions('my-inSite-f');
      await dataTable.selectMultipleItems([ file1Site, file2Site, folder1Site, folder2Site ]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
      expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
      expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
      expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
      expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed`);
      expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed`);
      expect(await contextMenu.isToggleFavoritePresent()).toBe(true, `Toggle favorite is not displayed`);
      expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
      expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
    });
  });
});
