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
import { SITE_VISIBILITY, SITE_ROLES, FILES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
import { Viewer } from '../../components/viewer/viewer';

describe('Special permissions available actions : ', () => {
  const userConsumer = `consumer-${Utils.random()}`;
  const userManager = `manager-${Utils.random()}`;
  const userCollaborator = `collaborator-${Utils.random()}`;
  const userDemoted = `demoted-${Utils.random()}`;

  const siteName = `site-private-${Utils.random()}`;
  const file1 = `my-file1-${Utils.random()}.txt`;
  let file1Id;
  const file2 = `my-file2-${Utils.random()}.txt`;
  let file2Id;
  const file3 = `my-file3-${Utils.random()}.txt`;
  let file3Id;
  const fileLocked = `my-file-locked-${Utils.random()}.txt`;
  let fileLockedId;

  const folder1 = `my-folder1-${Utils.random()}`;
  let folder1Id;
  const folder2 = `my-folder2-${Utils.random()}`;
  let folder2Id;

  const docxFile = FILES.docxFile;
  let docxFileId;

  const apis = {
    admin: new RepoClient(),
    userConsumer: new RepoClient(userConsumer, userConsumer),
    userCollaborator: new RepoClient(userCollaborator, userCollaborator),
    userDemoted: new RepoClient(userDemoted, userDemoted)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const contextMenu = dataTable.menu;
  const viewer = new Viewer();
  const viewerToolbar = viewer.toolbar;
  const searchResultsPage = new SearchResultsPage();
  const { searchInput } = searchResultsPage.header;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username: userConsumer });
    await apis.admin.people.createUser({ username: userManager });
    await apis.admin.people.createUser({ username: userCollaborator });
    await apis.admin.people.createUser({ username: userDemoted });

    await apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PRIVATE);
    const docLibId = await apis.admin.sites.getDocLibId(siteName);

    file1Id = (await apis.admin.nodes.createFile(file1, docLibId)).entry.id;
    file2Id = (await apis.admin.nodes.createFile(file2, docLibId)).entry.id;
    file3Id = (await apis.admin.nodes.createFile(file3, docLibId)).entry.id;
    folder1Id = (await apis.admin.nodes.createFolder(folder1, docLibId)).entry.id;
    folder2Id = (await apis.admin.nodes.createFolder(folder2, docLibId)).entry.id;

    docxFileId = (await apis.admin.upload.uploadFile(docxFile, docLibId)).entry.id;

    await apis.admin.sites.addSiteMember(siteName, userManager, SITE_ROLES.SITE_MANAGER.ROLE);
    await apis.admin.sites.addSiteMember(siteName, userConsumer, SITE_ROLES.SITE_CONSUMER.ROLE);
    await apis.admin.sites.addSiteMember(siteName, userCollaborator, SITE_ROLES.SITE_COLLABORATOR.ROLE);
    await apis.admin.sites.addSiteMember(siteName, userDemoted, SITE_ROLES.SITE_MANAGER.ROLE);

    fileLockedId = (await apis.admin.nodes.createFile(fileLocked, docLibId)).entry.id;
    await apis.userDemoted.nodes.lockFile(fileLockedId);
    await apis.userDemoted.favorites.addFavoriteById('file', fileLockedId);
    await apis.userDemoted.shared.shareFileById(fileLockedId);
    await apis.admin.sites.updateSiteMember(siteName, userDemoted, SITE_ROLES.SITE_CONSUMER.ROLE);

    await apis.admin.nodes.setGranularPermission(file3Id, false, userConsumer, SITE_ROLES.SITE_MANAGER.ROLE);

    await apis.userConsumer.shared.shareFileById(file1Id);
    await apis.userConsumer.shared.shareFileById(file2Id);
    await apis.userConsumer.shared.shareFileById(docxFileId);
    await apis.userConsumer.shared.shareFileById(file3Id);
    await apis.userConsumer.shared.waitForApi({ expect: 5 });

    await apis.userConsumer.favorites.addFavoritesByIds('file', [file1Id, file2Id, file3Id, docxFileId]);
    await apis.userConsumer.favorites.addFavoritesByIds('folder', [folder1Id, folder2Id]);
    await apis.userConsumer.favorites.waitForApi({ expect: 6 });

    await apis.userCollaborator.favorites.addFavoritesByIds('file', [file1Id, docxFileId]);
    await apis.userCollaborator.favorites.waitForApi({ expect: 2 });

    await apis.admin.favorites.addFavoriteById('file', fileLockedId);

    done();
  });

  afterAll(async (done) => {
    await apis.admin.sites.deleteSite(siteName);
    done();
  });

  describe('Consumer', () => {
    beforeAll(async (done) => {
      await loginPage.loginWith(userConsumer);
      done();
    });

    describe('toolbar displays correct actions when selecting multiple files with different granular permissions', () => {
      beforeEach(async (done) => {
        await Utils.pressEscape();
        await dataTable.clearSelection();
        await page.clickPersonalFiles();
        done();
      });

      afterAll(async (done) => {
        await Utils.pressEscape();
        done();
      });

      it('on File Libraries - [C280476]', async () => {
        await page.clickFileLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();
        await dataTable.selectMultipleItems([file1, file2]);

        expect(await toolbar.isViewPresent()).toBe(false, `View is displayed for selected files`);
        expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for selected files`);
        expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for selected files`);
        expect(await toolbar.isSharePresent()).toBe(false, `Share is displayed`);

        await toolbar.openMoreMenu();

        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for selected files`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for selected files`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
        expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for selected files`);
        expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for selected files`);
        expect(await toolbar.menu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for selected files`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed for selected files`);
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for selected files`);

        await toolbar.closeMoreMenu();
      });

      it('on Shared Files - [C280477]', async () => {
        await page.clickSharedFilesAndWait();
        await dataTable.selectMultipleItems([file1, file2]);

        expect(await toolbar.isViewPresent()).toBe(false, `View is displayed for selected files`);
        expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for selected files`);
        expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for selected files`);
        expect(await toolbar.isSharePresent()).toBe(false, `Share is displayed`);

        await toolbar.openMoreMenu();

        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for selected files`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for selected files`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
        expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for selected files`);
        expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for selected files`);
        expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for selected files`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed for selected files`);
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for selected files`);

        await toolbar.closeMoreMenu();
      });

      it('on Favorites - [C280478]', async () => {
        await page.clickFavoritesAndWait();
        await dataTable.selectMultipleItems([file1, file2]);

        expect(await toolbar.isViewPresent()).toBe(false, `View is displayed for selected files`);
        expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for selected files`);
        expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for selected files`);
        expect(await toolbar.isSharePresent()).toBe(false, `Share is displayed`);

        await toolbar.openMoreMenu();

        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for selected files`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is displayed for selected files`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is displayed for selected files`);
        expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for selected files`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed for selected files`);
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for selected files`);

        await toolbar.closeMoreMenu();
      });

      it('on Search Results - [C291823]', async () => {
        await searchInput.clickSearchButton();
        await searchInput.checkOnlyFiles();
        await searchInput.searchForTextAndCloseSearchOptions('my-file');
        await dataTable.selectMultipleItems([file1, file2]);

        expect(await toolbar.isViewPresent()).toBe(false, `View is displayed for selected files`);
        expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for selected files`);
        expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for selected files`);
        expect(await toolbar.isSharePresent()).toBe(false, `Share is displayed`);

        await toolbar.openMoreMenu();

        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for selected files`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for selected files`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
        expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for selected files`);
        expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for selected files`);
        expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for selected files`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed for selected files`);
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for selected files`);

        await toolbar.closeMoreMenu();
      });
    });

    describe('toolbar actions appear correctly for a file', () => {
      beforeEach(async (done) => {
        await Utils.pressEscape();
        await dataTable.clearSelection();
        await page.clickPersonalFiles();
        done();
      });

      afterAll(async (done) => {
        await Utils.pressEscape();
        done();
      });

      it('on File Libraries - [C280455]', async () => {
        await page.clickFileLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();
        await dataTable.selectItem(file1);

        expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${file1}`);
        expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${file1}`);
        expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${file1}`);
        expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${file1}`);
        expect(await toolbar.isSharedLinkSettingsPresent()).toBe(true, `Shared link settings is not displayed`);

        await toolbar.openMoreMenu();

        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${file1}`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${file1}`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${file1}`);
        expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for ${file1}`);
        expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for ${file1}`);
        expect(await toolbar.menu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${file1}`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed for ${file1}`);
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for ${file1}`);

        await toolbar.closeMoreMenu();
      });

      it('on Shared Files - [C280456]', async () => {
        await page.clickSharedFilesAndWait();
        await page.dataTable.selectItem(file1);

        expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${file1}`);
        expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${file1}`);
        expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${file1}`);
        expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${file1}`);
        expect(await toolbar.isSharedLinkSettingsPresent()).toBe(true, `Shared link settings is not displayed`);

        await toolbar.openMoreMenu();

        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${file1}`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${file1}`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${file1}`);
        expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for ${file1}`);
        expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for ${file1}`);
        expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${file1}`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed for ${file1}`);
        // TODO: change expect to false when ACA-2173 is done
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is displayed for ${file1}`);

        await toolbar.closeMoreMenu();
      });

      it('on Favorites - [C213121]', async () => {
        await page.clickFavoritesAndWait();
        await dataTable.selectItem(file1);

        expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${file1}`);
        expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${file1}`);
        expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${file1}`);
        expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${file1}`);
        // TODO: replace with isSharedLinkSettingsPresent when ACA-2175 is done
        expect(await toolbar.isSharePresent()).toBe(true, `Share is not displayed`);

        await toolbar.openMoreMenu();

        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${file1}`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${file1}`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${file1}`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is displayed for ${file1}`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is displayed for ${file1}`);
        expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${file1}`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed for ${file1}`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is displayed for ${file1}`);

        await toolbar.closeMoreMenu();
      });

      it('on Search Results - [C291818]', async () => {
        await searchInput.clickSearchButton();
        await searchInput.checkOnlyFiles();
        await searchInput.searchForTextAndCloseSearchOptions(file1);
        await dataTable.selectItem(file1);

        expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${file1}`);
        expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${file1}`);
        expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${file1}`);
        expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${file1}`);
        expect(await toolbar.isSharedLinkSettingsPresent()).toBe(true, `Shared link settings is not displayed`);

        await toolbar.openMoreMenu();

        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${file1}`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${file1}`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${file1}`);
        expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for ${file1}`);
        expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for ${file1}`);
        expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${file1}`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed for ${file1}`);
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for ${file1}`);

        await toolbar.closeMoreMenu();
      });
    });

    describe('toolbar actions appear correctly for a folder', () => {
      beforeEach(async (done) => {
        await Utils.pressEscape();
        await dataTable.clearSelection();
        await page.clickPersonalFiles();
        done();
      });

      afterAll(async (done) => {
        await Utils.pressEscape();
        done();
      });

      it('on File Libraries - [C280444]', async () => {
        await page.clickFileLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();
        await dataTable.selectItem(folder1);

        expect(await toolbar.isViewPresent()).toBe(false, `View is displayed for ${folder1}`);
        expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${folder1}`);
        expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${folder1}`);
        expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${folder1}`);
        expect(await toolbar.isSharePresent()).toBe(false, `Share is displayed`);

        await toolbar.openMoreMenu();

        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${folder1}`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${folder1}`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${folder1}`);
        expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for ${folder1}`);
        expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for ${folder1}`);
        expect(await toolbar.menu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${folder1}`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed for ${folder1}`);
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for ${folder1}`);

        await toolbar.closeMoreMenu();
      });

      it('on Favorites - [C286266]', async () => {
        await page.clickFavoritesAndWait();
        await dataTable.selectItem(folder1);

        expect(await toolbar.isViewPresent()).toBe(false, `View is not displayed for ${folder1}`);
        expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${folder1}`);
        expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${folder1}`);
        expect(await toolbar.isSharePresent()).toBe(false, `Share is displayed`);

        await toolbar.openMoreMenu();

        // TODO: change expect to false when ACA-1737 is done
        expect(await toolbar.menu.isEditFolderPresent()).toBe(true, `Edit folder is displayed for ${folder1}`);
        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${folder1}`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${folder1}`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${folder1}`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is displayed for ${folder1}`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is displayed for ${folder1}`);
        expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${folder1}`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed for ${folder1}`);
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for ${folder1}`);

        await toolbar.closeMoreMenu();
      });

      it('on Search Results - [C291819]', async () => {
        await searchInput.clickSearchButton();
        await searchInput.checkOnlyFolders();
        await searchInput.searchForTextAndCloseSearchOptions(folder1);
        await dataTable.selectItem(folder1);

        expect(await toolbar.isViewPresent()).toBe(false, `View is displayed for ${folder1}`);
        expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${folder1}`);
        expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${folder1}`);
        expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${folder1}`);
        expect(await toolbar.isSharePresent()).toBe(false, `Share is displayed`);

        await toolbar.openMoreMenu();

        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${folder1}`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${folder1}`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${folder1}`);
        expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for ${folder1}`);
        expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for ${folder1}`);
        expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${folder1}`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed for ${folder1}`);
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for ${folder1}`);

        await toolbar.closeMoreMenu();
      });
    });

    describe('toolbar actions appear correctly for multiple selection of files', () => {
      beforeEach(async (done) => {
        await Utils.pressEscape();
        await dataTable.clearSelection();
        await page.clickPersonalFiles();
        done();
      });

      afterAll(async (done) => {
        await Utils.pressEscape();
        done();
      });

      it('on File Libraries - [C280464]', async () => {
        await page.clickFileLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();
        await dataTable.selectMultipleItems([file1, file2]);

        expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
        expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed');
        expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
        expect(await toolbar.isSharePresent()).toBe(false, `Share is displayed`);

        await toolbar.openMoreMenu();

        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await toolbar.menu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

        await toolbar.closeMoreMenu();
      });

      it('on Shared Files - [C286284]', async () => {
        await page.clickSharedFilesAndWait();
        await dataTable.selectMultipleItems([file1, file2]);

        expect(await toolbar.isViewPresent()).toBe(false, `View is displayed for selected files`);
        expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for selected files`);
        expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for selected files`);
        expect(await toolbar.isSharePresent()).toBe(false, `Share is displayed`);

        await toolbar.openMoreMenu();

        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
        expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for selected files`);
        expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for selected files`);
        expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for selected files`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

        await toolbar.closeMoreMenu();
      });

      it('on Favorites - [C286285]', async () => {
        await page.clickFavoritesAndWait();
        await dataTable.selectMultipleItems([file1, file2]);

        expect(await toolbar.isViewPresent()).toBe(false, `View is displayed for selected files`);
        expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for selected files`);
        expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for selected files`);
        expect(await toolbar.isSharePresent()).toBe(false, `Share is displayed`);

        await toolbar.openMoreMenu();

        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for selected files`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is displayed for selected files`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is displayed for selected files`);
        expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for selected files`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

        await toolbar.closeMoreMenu();
      });

      it('on Search Results - [C291824]', async () => {
        await searchInput.clickSearchButton();
        await searchInput.checkOnlyFiles();
        await searchInput.searchForTextAndCloseSearchOptions('my-file');
        await dataTable.selectMultipleItems([file1, file2]);

        expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
        expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed');
        expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
        expect(await toolbar.isSharePresent()).toBe(false, `Share is displayed`);

        await toolbar.openMoreMenu();

        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

        await toolbar.closeMoreMenu();
      });
    });

    describe('toolbar actions appear correctly for multiple selection of folders', () => {
      beforeEach(async (done) => {
        await Utils.pressEscape();
        await dataTable.clearSelection();
        await page.clickPersonalFiles();
        done();
      });

      afterAll(async (done) => {
        await Utils.pressEscape();
        done();
      });

      it('on File Libraries - [C280465]', async () => {
        await page.clickFileLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();
        await dataTable.selectMultipleItems([folder1, folder2]);

        expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
        expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed');
        expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
        expect(await toolbar.isSharePresent()).toBe(false, `Share is displayed`);

        await toolbar.openMoreMenu();

        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await toolbar.menu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

        await toolbar.closeMoreMenu();
      });

      it('on Favorites - [C286286]', async () => {
        await page.clickFavoritesAndWait();
        await dataTable.selectMultipleItems([folder1, folder2]);

        expect(await toolbar.isViewPresent()).toBe(false, `View is displayed`);
        expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed`);
        expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed`);
        expect(await toolbar.isSharePresent()).toBe(false, `Share is displayed`);

        await toolbar.openMoreMenu();

        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is displayed`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is displayed`);
        expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

        await toolbar.closeMoreMenu();
      });

      it('on Search Results - [C291825]', async () => {
        await searchInput.clickSearchButton();
        await searchInput.checkOnlyFolders();
        await searchInput.searchForTextAndCloseSearchOptions('my-folder');
        await dataTable.selectMultipleItems([folder1, folder2]);

        expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
        expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed');
        expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
        expect(await toolbar.isSharePresent()).toBe(false, `Share is displayed`);

        await toolbar.openMoreMenu();

        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

        await toolbar.closeMoreMenu();
      });
    });

    describe('toolbar actions appear correctly for when both files and folders are selected', () => {
      beforeEach(async (done) => {
        await Utils.pressEscape();
        await dataTable.clearSelection();
        await page.clickPersonalFiles();
        done();
      });

      afterAll(async (done) => {
        await Utils.pressEscape();
        done();
      });

      it('on File Libraries - [C280466]', async () => {
        await page.clickFileLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();
        await dataTable.selectMultipleItems([file1, folder1]);

        expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
        expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed');
        expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
        expect(await toolbar.isSharePresent()).toBe(false, `Share is displayed`);

        await toolbar.openMoreMenu();

        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await toolbar.menu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

        await toolbar.closeMoreMenu();
      });

      it('on Favorites - [C286287]', async () => {
        await page.clickFavoritesAndWait();
        await dataTable.selectMultipleItems([file1, folder1]);

        expect(await toolbar.isViewPresent()).toBe(false, `View is displayed`);
        expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed`);
        expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed`);
        expect(await toolbar.isSharePresent()).toBe(false, `Share is displayed`);

        await toolbar.openMoreMenu();

        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is displayed`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is displayed`);
        expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

        await toolbar.closeMoreMenu();
      });

      it('on Search Results - [C291826]', async () => {
        await searchInput.clickSearchButton();
        await searchInput.checkFilesAndFolders();
        await searchInput.searchForTextAndCloseSearchOptions('my-f');
        await dataTable.selectMultipleItems([file1, folder1]);

        expect(await toolbar.isViewPresent()).toBe(false, 'View is displayed');
        expect(await toolbar.isDownloadPresent()).toBe(true, 'Download is not displayed');
        expect(await toolbar.isEditFolderPresent()).toBe(false, 'Edit folder is displayed');
        expect(await toolbar.isSharePresent()).toBe(false, `Share is displayed`);

        await toolbar.openMoreMenu();

        expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await toolbar.menu.isManageVersionsPresent()).toBe(false, `Manage versions is displayed`);
        expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

        await toolbar.closeMoreMenu();
      });
    });

    describe('context menu actions are correct for a file', () => {
      beforeEach(async (done) => {
        await Utils.pressEscape();
        await dataTable.clearSelection();
        await page.clickPersonalFiles();
        done();
      });

      afterAll(async (done) => {
        await Utils.pressEscape();
        done();
      });

      it('on File Libraries - [C280599]', async () => {
        await page.clickFileLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();
        await dataTable.rightClickOnItem(file1);

        expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${file1}`);
        expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${file1}`);
        expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${file1}`);
        expect(await contextMenu.isViewPresent()).toBe(true, `View is not displayed for ${file1}`);
        expect(await contextMenu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${file1}`);
        expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${file1}`);
        expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed for ${file1}`);
        expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed for ${file1}`);
        expect(await contextMenu.isManageVersionsPresent()).toBe(true, `Manage Versions is not displayed for ${file1}`);
        expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for ${file1}`);
        expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${file1}`);
        expect(await contextMenu.isViewDetailsPresent()).toBe(false, `View details is displayed for ${file1}`);
        expect(await contextMenu.isSharedLinkSettingsPresent()).toBe(true, `Shared link settings is not displayed`);
      });

      it('on Shared Files - [C286264]', async () => {
        await page.clickSharedFilesAndWait();
        await dataTable.rightClickOnItem(file1);

        expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${file1}`);
        expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${file1}`);
        expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${file1}`);
        expect(await contextMenu.isViewPresent()).toBe(true, `View is not displayed for ${file1}`);
        expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${file1}`);
        expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${file1}`);
        expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed for ${file1}`);
        expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed for ${file1}`);
        expect(await contextMenu.isSharedLinkSettingsPresent()).toBe(true, `Shared link settings is not displayed for ${file1}`);
        expect(await contextMenu.isManageVersionsPresent()).toBe(true, `Manage Versions is not displayed for ${file1}`);
        // TODO: change expect to false when ACA-2173 is done
        expect(await contextMenu.isUploadNewVersionPresent()).toBe(true, `Upload new version is displayed for ${file1}`);
        expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${file1}`);
        expect(await contextMenu.isViewDetailsPresent()).toBe(false, `View details is displayed for ${file1}`);
      });

      it('on Favorites - [C286262]', async () => {
        await page.clickFavoritesAndWait();
        await dataTable.rightClickOnItem(file1);

        expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${file1}`);
        expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${file1}`);
        expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${file1}`);
        expect(await contextMenu.isViewPresent()).toBe(true, `View is not displayed for ${file1}`);
        expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${file1}`);
        expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${file1}`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await contextMenu.isMovePresent()).toBe(true, `Move is displayed for ${file1}`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is displayed for ${file1}`);
        // TODO: replace with isSharedLinkSettingsPresent when ACA-2175 is done
        expect(await toolbar.isSharePresent()).toBe(true, `Share is not displayed`);
        expect(await contextMenu.isManageVersionsPresent()).toBe(true, `Manage Versions is not displayed for ${file1}`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await contextMenu.isUploadNewVersionPresent()).toBe(true, `Upload new version is displayed for ${file1}`);
        expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${file1}`);
        expect(await contextMenu.isViewDetailsPresent()).toBe(false, `View details is displayed for ${file1}`);
      });

      it('on Search Results - [C291829]', async () => {
        await searchInput.clickSearchButton();
        await searchInput.checkOnlyFiles();
        await searchInput.searchForTextAndCloseSearchOptions(file1);
        await dataTable.rightClickOnItem(file1);

        expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${file1}`);
        expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${file1}`);
        expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${file1}`);
        expect(await contextMenu.isViewPresent()).toBe(true, `View is not displayed for ${file1}`);
        expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${file1}`);
        expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${file1}`);
        expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed for ${file1}`);
        expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed for ${file1}`);
        expect(await contextMenu.isSharedLinkSettingsPresent()).toBe(true, `Shared link settings is not displayed`);
        expect(await contextMenu.isManageVersionsPresent()).toBe(true, `Manage Versions is not displayed for ${file1}`);
        expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for ${file1}`);
        expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${file1}`);
        expect(await contextMenu.isViewDetailsPresent()).toBe(false, `View details is displayed for ${file1}`);
      });
    });

    describe('context menu actions are correct for a folder', () => {
      beforeEach(async (done) => {
        await Utils.pressEscape();
        await dataTable.clearSelection();
        await page.clickPersonalFiles();
        done();
      });

      afterAll(async (done) => {
        await Utils.pressEscape();
        done();
      });

      it('on File Libraries - [C280600]', async () => {
        await page.clickFileLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();
        await dataTable.rightClickOnItem(folder1);

        expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${folder1}`);
        expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${folder1}`);
        expect(await contextMenu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${folder1}`);
        expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${folder1}`);
        expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed for ${folder1}`);
        expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed for ${folder1}`);
        expect(await contextMenu.isViewPresent()).toBe(false, `View is displayed for ${folder1}`);
        expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage Versions is displayed for ${folder1}`);
        expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for ${folder1}`);
        expect(await contextMenu.isSharePresent()).toBe(false, `Share is displayed for ${folder1}`);
        expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${folder1}`);
        expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${folder1}`);
      });

      it('on Favorites - [C286263]', async () => {
        await page.clickFavoritesAndWait();
        await dataTable.rightClickOnItem(folder1);

        expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${folder1}`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await contextMenu.isEditFolderPresent()).toBe(true, `Edit folder is displayed for ${folder1}`);
        expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${folder1}`);
        expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${folder1}`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await contextMenu.isMovePresent()).toBe(true, `Move is displayed for ${folder1}`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is displayed for ${folder1}`);
        expect(await contextMenu.isViewPresent()).toBe(false, `View is displayed for ${folder1}`);
        expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage Versions is displayed for ${folder1}`);
        expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for ${folder1}`);
        expect(await contextMenu.isSharePresent()).toBe(false, `Share is displayed for ${folder1}`);
        expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${folder1}`);
        expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${folder1}`);
      });

      it('on Search Results - [C291830]', async () => {
        await searchInput.clickSearchButton();
        await searchInput.checkOnlyFolders();
        await searchInput.searchForTextAndCloseSearchOptions(folder1);
        await dataTable.rightClickOnItem(folder1);

        expect(await contextMenu.isDownloadPresent()).toBe(true, `Download is not displayed for ${folder1}`);
        expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${folder1}`);
        expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${folder1}`);
        expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed for ${folder1}`);
        expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed for ${folder1}`);
        expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed for ${folder1}`);
        expect(await contextMenu.isViewPresent()).toBe(false, `View is displayed for ${folder1}`);
        expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage Versions is displayed for ${folder1}`);
        expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed for ${folder1}`);
        expect(await contextMenu.isSharePresent()).toBe(false, `Share is displayed for ${folder1}`);
        expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${folder1}`);
        expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${folder1}`);
      });
    });

  describe('context menu actions are correct for multiple selection of files', () => {
      beforeEach(async (done) => {
        await Utils.pressEscape();
        await dataTable.clearSelection();
        await page.clickPersonalFiles();
        done();
      });

      afterAll(async (done) => {
        await Utils.pressEscape();
        done();
      });

      it('on File Libraries - [C280647]', async () => {
        await page.clickFileLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();
        await dataTable.selectMultipleItems([file1, file2]);
        await dataTable.rightClickOnMultipleSelection();

        expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
        expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
        expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await contextMenu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage Versions is displayed`);
        expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
        expect(await contextMenu.isSharePresent()).toBe(false, `Share is displayed`);
      });

      it('on Shared Files - [C286283]', async () => {
        await page.clickSharedFilesAndWait();
        await dataTable.selectMultipleItems([file1, file2]);
        await dataTable.rightClickOnMultipleSelection();

        expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
        expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
        expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage Versions is displayed`);
        expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
        expect(await contextMenu.isSharePresent()).toBe(false, `Share is displayed`);
      });

      it('on Favorites - [C286280]', async () => {
        await page.clickFavoritesAndWait();
        await dataTable.selectMultipleItems([file1, file2]);
        await dataTable.rightClickOnMultipleSelection();

        expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
        expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
        expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is displayed`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await contextMenu.isMovePresent()).toBe(true, `Move is displayed`);
        expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage Versions is displayed`);
        expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
        expect(await contextMenu.isSharePresent()).toBe(false, `Share is displayed`);
      });

      it('on Search Results - [C291834]', async () => {
        await searchInput.clickSearchButton();
        await searchInput.checkOnlyFiles();
        await searchInput.searchForTextAndCloseSearchOptions('my-file');
        await dataTable.selectMultipleItems([file1, file2]);
        await dataTable.rightClickOnMultipleSelection();

        expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
        expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
        expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage Versions is displayed`);
        expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
        expect(await contextMenu.isSharePresent()).toBe(false, `Share is displayed`);
      });
    });

    describe('context menu actions are correct for multiple selection of folders', () => {
      beforeEach(async (done) => {
        await Utils.pressEscape();
        await dataTable.clearSelection();
        await page.clickPersonalFiles();
        done();
      });

      afterAll(async (done) => {
        await Utils.pressEscape();
        done();
      });

      it('on File Libraries - [C280666]', async () => {
        await page.clickFileLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();
        await dataTable.selectMultipleItems([folder1, folder2]);
        await dataTable.rightClickOnMultipleSelection();

        expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed`);
        expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
        expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
        expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await contextMenu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage Versions is displayed`);
        expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
        expect(await contextMenu.isSharePresent()).toBe(false, `Share is displayed`);
      });

      it('on Favorites - [C286281]', async () => {
        await page.clickFavoritesAndWait();
        await dataTable.selectMultipleItems([folder1, folder2]);
        await dataTable.rightClickOnMultipleSelection();

        expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed`);
        expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
        expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
        expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is displayed`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await contextMenu.isMovePresent()).toBe(true, `Move is displayed`);
        expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage Versions is displayed`);
        expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
        expect(await contextMenu.isSharePresent()).toBe(false, `Share is displayed`);
      });

      it('on Search Results - [C291835]', async () => {
        await searchInput.clickSearchButton();
        await searchInput.checkOnlyFolders();
        await searchInput.searchForTextAndCloseSearchOptions('my-folder');
        await dataTable.selectMultipleItems([folder1, folder2]);
        await dataTable.rightClickOnMultipleSelection();

        expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed`);
        expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
        expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
        expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage Versions is displayed`);
        expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
        expect(await contextMenu.isSharePresent()).toBe(false, `Share is displayed`);
      });
    });

    describe('context menu actions are correct when both files and folders are selected', () => {
      beforeEach(async (done) => {
        await Utils.pressEscape();
        await dataTable.clearSelection();
        await page.clickPersonalFiles();
        done();
      });

      afterAll(async (done) => {
        await Utils.pressEscape();
        done();
      });

      it('on File Libraries - [C280669]', async () => {
        await page.clickFileLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();
        await dataTable.selectMultipleItems([file1, folder1]);
        await dataTable.rightClickOnMultipleSelection();

        expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
        expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
        expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await contextMenu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage Versions is displayed`);
        expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
        expect(await contextMenu.isSharePresent()).toBe(false, `Share is displayed`);
      });

      it('on Favorites - [C286282]', async () => {
        await page.clickFavoritesAndWait();
        await dataTable.selectMultipleItems([file1, folder1]);
        await dataTable.rightClickOnMultipleSelection();

        expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
        expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
        expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await contextMenu.isDeletePresent()).toBe(true, `Delete is displayed`);
        // TODO: change expect to false when ACA-1737 is done
        expect(await contextMenu.isMovePresent()).toBe(true, `Move is displayed`);
        expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage Versions is displayed`);
        expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
        expect(await contextMenu.isSharePresent()).toBe(false, `Share is displayed`);
      });

      it('on Search Results - [C291836]', async () => {
        await searchInput.clickSearchButton();
        await searchInput.checkFilesAndFolders();
        await searchInput.searchForTextAndCloseSearchOptions('my-f');
        await dataTable.selectMultipleItems([file1, folder1]);
        await dataTable.rightClickOnMultipleSelection();

        expect(await contextMenu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await contextMenu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await contextMenu.isViewPresent()).toBe(false, 'View is displayed');
        expect(await contextMenu.isDownloadPresent()).toBe(true, 'Download is not displayed');
        expect(await contextMenu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await contextMenu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await contextMenu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await contextMenu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await contextMenu.isManageVersionsPresent()).toBe(false, `Manage Versions is displayed`);
        expect(await contextMenu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);
        expect(await contextMenu.isSharePresent()).toBe(false, `Share is displayed`);
      });
    });

    describe('toolbar actions appear correctly in the viewer', () => {
      beforeEach(async (done) => {
        await Utils.pressEscape();
        await dataTable.clearSelection();
        await page.clickPersonalFiles();
        done();
      });

      afterAll(async (done) => {
        await Utils.pressEscape();
        done();
      });

      it('file from File Libraries - [C268128]', async () => {
        await page.clickFileLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();
        await dataTable.doubleClickOnRowByName(docxFile);
        await viewer.waitForViewerToOpen();

        expect(await viewerToolbar.isViewPresent()).toBe(false, `View is displayed`);
        expect(await viewerToolbar.isDownloadPresent()).toBe(true, `Download is not displayed`);
        expect(await viewerToolbar.isPrintPresent()).toBe(true, `Print is not displayed`);
        expect(await viewerToolbar.isFullScreenPresent()).toBe(true, `Full screen is not displayed`);
        expect(await viewerToolbar.isSharedLinkSettingsPresent()).toBe(true, 'Shared link settings is not displayed');
        expect(await viewerToolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed`);

        await viewerToolbar.openMoreMenu();

        expect(await viewerToolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await viewerToolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await viewerToolbar.menu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await viewerToolbar.menu.isSharePresent()).toBe(false, `Share is displayed in More actions`);
        expect(await viewerToolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await viewerToolbar.menu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await viewerToolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await viewerToolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed`);
        expect(await viewerToolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

        await toolbar.closeMoreMenu();
      });

      it('file from Shared Files - [C286310]', async () => {
        await page.clickSharedFilesAndWait();
        await dataTable.doubleClickOnRowByName(docxFile);
        await viewer.waitForViewerToOpen();

        expect(await viewerToolbar.isViewPresent()).toBe(false, `View is displayed`);
        expect(await viewerToolbar.isDownloadPresent()).toBe(true, `Download is not displayed`);
        expect(await viewerToolbar.isPrintPresent()).toBe(true, `Print is not displayed`);
        expect(await viewerToolbar.isFullScreenPresent()).toBe(true, `Full screen is not displayed`);
        expect(await viewerToolbar.isSharedLinkSettingsPresent()).toBe(true, 'Shared link settings is not displayed');
        expect(await viewerToolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed`);

        await viewerToolbar.openMoreMenu();

        expect(await viewerToolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await viewerToolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await viewerToolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await viewerToolbar.menu.isSharePresent()).toBe(false, `Share is displayed in More actions`);
        expect(await viewerToolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await viewerToolbar.menu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await viewerToolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await viewerToolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed`);
        expect(await viewerToolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

        await toolbar.closeMoreMenu();
      });

      it('file from Favorites - [C286311]', async () => {
        await page.clickFavoritesAndWait();
        await dataTable.doubleClickOnRowByName(docxFile);
        await viewer.waitForViewerToOpen();

        expect(await viewerToolbar.isViewPresent()).toBe(false, `View is displayed`);
        expect(await viewerToolbar.isDownloadPresent()).toBe(true, `Download is not displayed`);
        expect(await viewerToolbar.isPrintPresent()).toBe(true, `Print is not displayed`);
        expect(await viewerToolbar.isFullScreenPresent()).toBe(true, `Full screen is not displayed`);
        expect(await viewerToolbar.isSharedLinkSettingsPresent()).toBe(true, 'Shared link settings is not displayed');
        expect(await viewerToolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed`);

        await viewerToolbar.openMoreMenu();

        expect(await viewerToolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await viewerToolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await viewerToolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await viewerToolbar.menu.isSharePresent()).toBe(false, `Share is displayed in More actions`);
        expect(await viewerToolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await viewerToolbar.menu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await viewerToolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await viewerToolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed`);
        expect(await viewerToolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

        await toolbar.closeMoreMenu();
      });
    });
  });

  describe('Collaborator', () => {
    beforeAll(async (done) => {
      await loginPage.loginWith(userCollaborator);
      done();
    });

    it('on File Libraries - [C297647]', async () => {
      await page.clickFileLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.waitForHeader();
      await dataTable.selectItem(file1);

      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${file1}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${file1}`);
      expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${file1}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${file1}`);
      expect(await toolbar.isSharedLinkSettingsPresent()).toBe(true, `Shared link settings is not displayed`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditOfflinePresent()).toBe(true, `Edit offline is not displayed for ${file1}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${file1}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${file1}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for ${file1}`);
      expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for ${file1}`);
      expect(await toolbar.menu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${file1}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed`);

      await toolbar.closeMoreMenu();
    });

    it('on Shared Files - [C297651]', async () => {
      await page.clickSharedFilesAndWait();
      await page.dataTable.selectItem(file1);

      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${file1}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${file1}`);
      expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${file1}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${file1}`);
      expect(await toolbar.isSharedLinkSettingsPresent()).toBe(true, `Shared link settings is not displayed`);

      await toolbar.openMoreMenu();

      // TODO: change expect to true when ACA-2173 is done
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${file1}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${file1}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${file1}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for ${file1}`);
      expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for ${file1}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${file1}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed`);

      await toolbar.closeMoreMenu();
    });

    it('on Favorites - [C297652]', async () => {
      await page.clickFavoritesAndWait();
      await dataTable.selectItem(file1);

      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${file1}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${file1}`);
      expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${file1}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${file1}`);
      // TODO: replace with isSharedLinkSettingsPresent when ACA-2175 is done
      expect(await toolbar.isSharePresent()).toBe(true, `Share is not displayed`);

      await toolbar.openMoreMenu();

      // TODO: change expect to true when ACA-2174 is done
      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is not displayed for ${file1}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${file1}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${file1}`);
      // TODO: change expect to false when ACA-1737 is done
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is displayed for ${file1}`);
      // TODO: change expect to false when ACA-1737 is done
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is displayed for ${file1}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${file1}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed`);

      await toolbar.closeMoreMenu();
    });

    it('on Search Results - [C297653]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFiles();
      await searchInput.searchForTextAndCloseSearchOptions(file1);
      await dataTable.selectItem(file1);

      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${file1}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${file1}`);
      expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${file1}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${file1}`);
      expect(await toolbar.isSharedLinkSettingsPresent()).toBe(true, `Shared link settings is not displayed`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditOfflinePresent()).toBe(true, `Edit offline is not displayed for ${file1}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed for ${file1}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${file1}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for ${file1}`);
      expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for ${file1}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${file1}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed`);
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed`);

      await toolbar.closeMoreMenu();
    });

    describe('in the viewer', () => {
      beforeEach(async (done) => {
        await Utils.pressEscape();
        await dataTable.clearSelection();
        await page.clickPersonalFiles();
        done();
      });

      afterAll(async (done) => {
        await Utils.pressEscape();
        done();
      });

      it('file opened from File Libraries - [C297654]', async () => {
        await page.clickFileLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();
        await dataTable.doubleClickOnRowByName(docxFile);
        await viewer.waitForViewerToOpen();

        expect(await viewerToolbar.isViewPresent()).toBe(false, `View is displayed`);
        expect(await viewerToolbar.isDownloadPresent()).toBe(true, `Download is not displayed`);
        expect(await viewerToolbar.isPrintPresent()).toBe(true, `Print is not displayed`);
        expect(await viewerToolbar.isFullScreenPresent()).toBe(true, `Full screen is not displayed`);
        expect(await viewerToolbar.isSharedLinkSettingsPresent()).toBe(true, 'Shared link settings is not displayed');
        expect(await viewerToolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed`);

        await viewerToolbar.openMoreMenu();

        expect(await viewerToolbar.menu.isEditOfflinePresent()).toBe(true, `Edit offline is not displayed`);
        expect(await viewerToolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await viewerToolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await viewerToolbar.menu.isSharePresent()).toBe(false, `Share is displayed in More actions`);
        expect(await viewerToolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await viewerToolbar.menu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await viewerToolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await viewerToolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed`);
        expect(await viewerToolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed`);

        await viewerToolbar.closeMoreMenu();
      });

      it('file opened from Shared Files - [C297655]', async () => {
        await page.clickSharedFilesAndWait();
        await dataTable.doubleClickOnRowByName(docxFile);
        await viewer.waitForViewerToOpen();

        expect(await viewerToolbar.isViewPresent()).toBe(false, `View is displayed`);
        expect(await viewerToolbar.isDownloadPresent()).toBe(true, `Download is not displayed`);
        expect(await viewerToolbar.isPrintPresent()).toBe(true, `Print is not displayed`);
        expect(await viewerToolbar.isFullScreenPresent()).toBe(true, `Full screen is not displayed`);
        expect(await viewerToolbar.isSharedLinkSettingsPresent()).toBe(true, 'Shared link settings is not displayed');
        expect(await viewerToolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed`);

        await viewerToolbar.openMoreMenu();

        expect(await viewerToolbar.menu.isEditOfflinePresent()).toBe(true, `Edit offline is not displayed`);
        expect(await viewerToolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await viewerToolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await viewerToolbar.menu.isSharePresent()).toBe(false, `Share is displayed in More actions`);
        expect(await viewerToolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await viewerToolbar.menu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await viewerToolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await viewerToolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed`);
        expect(await viewerToolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed`);

        await viewerToolbar.closeMoreMenu();
      });

      it('file opened from Favorites - [C297656]', async () => {
        await page.clickFavoritesAndWait();
        await dataTable.doubleClickOnRowByName(docxFile);
        await viewer.waitForViewerToOpen();

        expect(await viewerToolbar.isViewPresent()).toBe(false, `View is displayed`);
        expect(await viewerToolbar.isDownloadPresent()).toBe(true, `Download is not displayed`);
        expect(await viewerToolbar.isPrintPresent()).toBe(true, `Print is not displayed`);
        expect(await viewerToolbar.isFullScreenPresent()).toBe(true, `Full screen is not displayed`);
        expect(await viewerToolbar.isSharedLinkSettingsPresent()).toBe(true, 'Shared link settings is not displayed');
        expect(await viewerToolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed`);

        await viewerToolbar.openMoreMenu();

        expect(await viewerToolbar.menu.isEditOfflinePresent()).toBe(true, `Edit offline is not displayed`);
        expect(await viewerToolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is displayed`);
        expect(await viewerToolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove Favorite is not displayed`);
        expect(await viewerToolbar.menu.isSharePresent()).toBe(false, `Share is displayed in More actions`);
        expect(await viewerToolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await viewerToolbar.menu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await viewerToolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await viewerToolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed`);
        expect(await viewerToolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed`);

        await viewerToolbar.closeMoreMenu();
      });
    });
  });

  describe('File locked - lock owner : ', () => {
    beforeAll(async (done) => {
      await loginPage.loginWith(userDemoted);
      done();
    });

    it('on File Libraries - [C297657]', async () => {
      await page.clickFileLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.waitForHeader();
      await dataTable.selectItem(fileLocked);

      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${fileLocked}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileLocked}`);
      expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${fileLocked}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileLocked}`);
      expect(await toolbar.isSharedLinkSettingsPresent()).toBe(true, `Shared link settings is not displayed`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileLocked}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(true, `Cancel editing is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for ${fileLocked}`);
      expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for ${fileLocked}`);
      expect(await toolbar.menu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, 'Manage versions is not displayed');
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, 'Upload new version is not displayed');

      await toolbar.closeMoreMenu();
    });

    it('on Shared Files - [C297658]', async () => {
      await page.clickSharedFilesAndWait();
      await page.dataTable.selectItem(fileLocked);

      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${fileLocked}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileLocked}`);
      expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${fileLocked}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileLocked}`);
      expect(await toolbar.isSharedLinkSettingsPresent()).toBe(true, `Shared link settings is not displayed`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileLocked}`);
      // TODO: change expect to true when ACA-2173 is done
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for ${fileLocked}`);
      expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for ${fileLocked}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, 'Manage versions is not displayed');
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, 'Upload new version is not displayed');

      await toolbar.closeMoreMenu();
    });

    it('on Favorites - [C297659]', async () => {
      await page.clickFavoritesAndWait();
      await dataTable.selectItem(fileLocked);

      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${fileLocked}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileLocked}`);
      expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${fileLocked}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileLocked}`);
      // TODO: replace with isSharedLinkSettingsPresent when ACA-2175 is done
      expect(await toolbar.isSharePresent()).toBe(true, `Share is not displayed`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileLocked}`);
      // TODO: change expect to true when ACA-2174 is fixed
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileLocked}`);
      // TODO: change expect to false when ACA-1737 is fixed
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is displayed for ${fileLocked}`);
      // TODO: change expect to false when ACA-1737 is fixed
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is displayed for ${fileLocked}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, 'Manage versions is not displayed');
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, 'Upload new version is not displayed');

      await toolbar.closeMoreMenu();
    });

    it('on Search Results - [C297660]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFiles();
      await searchInput.searchForTextAndCloseSearchOptions(fileLocked);
      await dataTable.selectItem(fileLocked);

      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${fileLocked}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileLocked}`);
      expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${fileLocked}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileLocked}`);
      expect(await toolbar.isSharedLinkSettingsPresent()).toBe(true, `Shared link settings is not displayed`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileLocked}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(true, `Cancel editing is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for ${fileLocked}`);
      expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for ${fileLocked}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, 'Manage versions is not displayed');
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, 'Upload new version is not displayed');

      await toolbar.closeMoreMenu();
    });

    describe('in the viewer', () => {
      beforeEach(async (done) => {
        await Utils.pressEscape();
        await dataTable.clearSelection();
        await page.clickPersonalFiles();
        done();
      });

      afterAll(async (done) => {
        await Utils.pressEscape();
        done();
      });

      it('file opened from File Libraries - [C297661]', async () => {
        await page.clickFileLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();
        await dataTable.doubleClickOnRowByName(fileLocked);
        await viewer.waitForViewerToOpen();

        expect(await viewerToolbar.isViewPresent()).toBe(false, `View is displayed`);
        expect(await viewerToolbar.isDownloadPresent()).toBe(true, `Download is not displayed`);
        expect(await viewerToolbar.isPrintPresent()).toBe(true, `Print is not displayed`);
        expect(await viewerToolbar.isFullScreenPresent()).toBe(true, `Full screen is not displayed`);
        expect(await viewerToolbar.isSharedLinkSettingsPresent()).toBe(true, 'Shared link settings is not displayed');
        expect(await viewerToolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed`);

        await viewerToolbar.openMoreMenu();

        expect(await viewerToolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await viewerToolbar.menu.isCancelEditingPresent()).toBe(true, `Cancel editing is not displayed`);
        expect(await viewerToolbar.menu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await viewerToolbar.menu.isSharePresent()).toBe(false, `Share is displayed in More actions`);
        expect(await viewerToolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await viewerToolbar.menu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await viewerToolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await viewerToolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed`);
        expect(await viewerToolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed`);

        await viewerToolbar.closeMoreMenu();
      });

      it('file opened from Shared Files - [C297662]', async () => {
        await page.clickSharedFilesAndWait();
        await dataTable.doubleClickOnRowByName(fileLocked);
        await viewer.waitForViewerToOpen();

        expect(await viewerToolbar.isViewPresent()).toBe(false, `View is displayed`);
        expect(await viewerToolbar.isDownloadPresent()).toBe(true, `Download is not displayed`);
        expect(await viewerToolbar.isPrintPresent()).toBe(true, `Print is not displayed`);
        expect(await viewerToolbar.isFullScreenPresent()).toBe(true, `Full screen is not displayed`);
        expect(await viewerToolbar.isSharedLinkSettingsPresent()).toBe(true, 'Shared link settings is not displayed');
        expect(await viewerToolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed`);

        await viewerToolbar.openMoreMenu();

        expect(await viewerToolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await viewerToolbar.menu.isCancelEditingPresent()).toBe(true, `Cancel editing is not displayed`);
        expect(await viewerToolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await viewerToolbar.menu.isSharePresent()).toBe(false, `Share is displayed in More actions`);
        expect(await viewerToolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await viewerToolbar.menu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await viewerToolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await viewerToolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed`);
        expect(await viewerToolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed`);

        await viewerToolbar.closeMoreMenu();
      });

      it('file opened from Favorites - [C297663]', async () => {
        await page.clickFavoritesAndWait();
        await dataTable.doubleClickOnRowByName(fileLocked);
        await viewer.waitForViewerToOpen();

        expect(await viewerToolbar.isEmpty()).toBe(false, `viewer toolbar is empty`);
        expect(await viewerToolbar.isViewPresent()).toBe(false, `View is displayed`);
        expect(await viewerToolbar.isDownloadPresent()).toBe(true, `Download is not displayed`);
        expect(await viewerToolbar.isPrintPresent()).toBe(true, `Print is not displayed`);
        expect(await viewerToolbar.isFullScreenPresent()).toBe(true, `Full screen is not displayed`);
        expect(await viewerToolbar.isSharedLinkSettingsPresent()).toBe(true, 'Shared link settings is not displayed');
        expect(await viewerToolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed`);

        await viewerToolbar.openMoreMenu();

        expect(await viewerToolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await viewerToolbar.menu.isCancelEditingPresent()).toBe(true, `Cancel editing is not displayed`);
        expect(await viewerToolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await viewerToolbar.menu.isSharePresent()).toBe(false, `Share is displayed in More actions`);
        expect(await viewerToolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await viewerToolbar.menu.isMovePresent()).toBe(false, `Move is displayed`);
        expect(await viewerToolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed`);
        expect(await viewerToolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed`);
        expect(await viewerToolbar.menu.isUploadNewVersionPresent()).toBe(true, `Upload new version is not displayed`);

        await viewerToolbar.closeMoreMenu();
      });
    });
  });

  describe('File locked - manager : ', () => {
    beforeAll(async (done) => {
      await loginPage.loginWithAdmin();
      done();
    });

    it('on File Libraries - [C297664]', async () => {
      await page.clickFileLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.waitForHeader();
      await dataTable.selectItem(fileLocked);

      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${fileLocked}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileLocked}`);
      expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${fileLocked}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileLocked}`);
      expect(await toolbar.isSharedLinkSettingsPresent()).toBe(true, `Shared link settings is not displayed`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileLocked}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(true, `Cancel editing is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, 'Manage versions is not displayed');
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, 'Upload new version is displayed');

      await toolbar.closeMoreMenu();
    });

    it('on Shared Files - [C297665]', async () => {
      await page.clickSharedFilesAndWait();
      await page.dataTable.selectItem(fileLocked);

      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${fileLocked}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileLocked}`);
      expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${fileLocked}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileLocked}`);
      expect(await toolbar.isSharedLinkSettingsPresent()).toBe(true, `Shared link settings is not displayed`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileLocked}`);
      // TODO: change expect to true when ACA-2173 is done
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, 'Manage versions is not displayed');
      // TODO: change expect to false when ACA-2173 is done
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, 'Upload new version is displayed');

      await toolbar.closeMoreMenu();
    });

    it('on Favorites - [C297666]', async () => {
      await page.clickFavoritesAndWait();
      await dataTable.selectItem(fileLocked);

      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${fileLocked}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileLocked}`);
      expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${fileLocked}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileLocked}`);
      // TODO: replace with isSharedLinkSettingsPresent when ACA-2175 is done
      expect(await toolbar.isSharePresent()).toBe(true, `Share is not displayed`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileLocked}`);
      // TODO: change expect to true when ACA-2174 is fixed
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(false, `Cancel editing is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isMovePresent()).toBe(true, `Move is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, 'Manage versions is not displayed');
      // TODO: change expect to false when ACA-1737 is done
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(true, 'Upload new version is displayed');

      await toolbar.closeMoreMenu();
    });

    it('on Search Results - [C297667]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFiles();
      await searchInput.searchForTextAndCloseSearchOptions(fileLocked);
      await dataTable.selectItem(fileLocked);

      expect(await toolbar.isViewPresent()).toBe(true, `View is not displayed for ${fileLocked}`);
      expect(await toolbar.isDownloadPresent()).toBe(true, `Download is not displayed for ${fileLocked}`);
      expect(await toolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed for ${fileLocked}`);
      expect(await toolbar.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${fileLocked}`);
      expect(await toolbar.isSharedLinkSettingsPresent()).toBe(true, `Shared link settings is not displayed`);

      await toolbar.openMoreMenu();

      expect(await toolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed for ${fileLocked}`);
      expect(await toolbar.menu.isCancelEditingPresent()).toBe(true, `Cancel editing is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isDeletePresent()).toBe(false, `Delete is displayed for ${fileLocked} in Search Results`);
      expect(await toolbar.menu.isMovePresent()).toBe(false, `Move is displayed for ${fileLocked} in Search Results`);
      expect(await toolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed for ${fileLocked}`);
      expect(await toolbar.menu.isManageVersionsPresent()).toBe(true, 'Manage versions is not displayed');
      expect(await toolbar.menu.isUploadNewVersionPresent()).toBe(false, 'Upload new version is displayed');

      await toolbar.closeMoreMenu();
    });

    describe('in the viewer', () => {
      beforeEach(async (done) => {
        await Utils.pressEscape();
        await dataTable.clearSelection();
        await page.clickPersonalFiles();
        done();
      });

      afterAll(async (done) => {
        await Utils.pressEscape();
        done();
      });

      it('file opened from File Libraries - [C297671]', async () => {
        await page.clickFileLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();
        await dataTable.doubleClickOnRowByName(fileLocked);
        await viewer.waitForViewerToOpen();

        expect(await viewerToolbar.isViewPresent()).toBe(false, `View is displayed`);
        expect(await viewerToolbar.isDownloadPresent()).toBe(true, `Download is not displayed`);
        expect(await viewerToolbar.isPrintPresent()).toBe(true, `Print is not displayed`);
        expect(await viewerToolbar.isFullScreenPresent()).toBe(true, `Full screen is not displayed`);
        expect(await viewerToolbar.isSharedLinkSettingsPresent()).toBe(true, 'Shared link settings is not displayed');
        expect(await viewerToolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed`);

        await viewerToolbar.openMoreMenu();

        expect(await viewerToolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await viewerToolbar.menu.isCancelEditingPresent()).toBe(true, `Cancel editing is not displayed`);
        expect(await viewerToolbar.menu.isRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await viewerToolbar.menu.isSharePresent()).toBe(false, `Share is displayed in More actions`);
        expect(await viewerToolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await viewerToolbar.menu.isMovePresent()).toBe(true, `Move is not displayed`);
        expect(await viewerToolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed`);
        expect(await viewerToolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed`);
        expect(await viewerToolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

        await viewerToolbar.closeMoreMenu();
      });

      it('file opened from Shared Files - [C297672]', async () => {
        await page.clickSharedFilesAndWait();
        await dataTable.doubleClickOnRowByName(fileLocked);
        await viewer.waitForViewerToOpen();

        expect(await viewerToolbar.isViewPresent()).toBe(false, `View is displayed`);
        expect(await viewerToolbar.isDownloadPresent()).toBe(true, `Download is not displayed`);
        expect(await viewerToolbar.isPrintPresent()).toBe(true, `Print is not displayed`);
        expect(await viewerToolbar.isFullScreenPresent()).toBe(true, `Full screen is not displayed`);
        expect(await viewerToolbar.isSharedLinkSettingsPresent()).toBe(true, 'Shared link settings is not displayed');
        expect(await viewerToolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed`);

        await viewerToolbar.openMoreMenu();

        expect(await viewerToolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await viewerToolbar.menu.isCancelEditingPresent()).toBe(true, `Cancel editing is not displayed`);
        expect(await viewerToolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await viewerToolbar.menu.isSharePresent()).toBe(false, `Share is displayed in More actions`);
        expect(await viewerToolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await viewerToolbar.menu.isMovePresent()).toBe(true, `Move is not displayed`);
        expect(await viewerToolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed`);
        expect(await viewerToolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed`);
        expect(await viewerToolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

        await viewerToolbar.closeMoreMenu();
      });

      it('file opened from Favorites - [C297673]', async () => {
        await page.clickFavoritesAndWait();
        await dataTable.doubleClickOnRowByName(fileLocked);
        await viewer.waitForViewerToOpen();

        expect(await viewerToolbar.isEmpty()).toBe(false, `viewer toolbar is empty`);
        expect(await viewerToolbar.isViewPresent()).toBe(false, `View is displayed`);
        expect(await viewerToolbar.isDownloadPresent()).toBe(true, `Download is not displayed`);
        expect(await viewerToolbar.isPrintPresent()).toBe(true, `Print is not displayed`);
        expect(await viewerToolbar.isFullScreenPresent()).toBe(true, `Full screen is not displayed`);
        expect(await viewerToolbar.isSharedLinkSettingsPresent()).toBe(true, 'Shared link settings is not displayed');
        expect(await viewerToolbar.isViewDetailsPresent()).toBe(true, `View details is not displayed`);

        await viewerToolbar.openMoreMenu();

        expect(await viewerToolbar.menu.isEditOfflinePresent()).toBe(false, `Edit offline is displayed`);
        expect(await viewerToolbar.menu.isCancelEditingPresent()).toBe(true, `Cancel editing is not displayed`);
        expect(await viewerToolbar.menu.isToggleRemoveFavoritePresent()).toBe(true, `Remove favorite is not displayed`);
        expect(await viewerToolbar.menu.isSharePresent()).toBe(false, `Share is displayed in More actions`);
        expect(await viewerToolbar.menu.isCopyPresent()).toBe(true, `Copy is not displayed`);
        expect(await viewerToolbar.menu.isMovePresent()).toBe(true, `Move is not displayed`);
        expect(await viewerToolbar.menu.isDeletePresent()).toBe(true, `Delete is not displayed`);
        expect(await viewerToolbar.menu.isManageVersionsPresent()).toBe(true, `Manage versions is not displayed`);
        expect(await viewerToolbar.menu.isUploadNewVersionPresent()).toBe(false, `Upload new version is displayed`);

        await viewerToolbar.closeMoreMenu();
      });
    });
  });
});
