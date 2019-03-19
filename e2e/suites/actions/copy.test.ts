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

import { LoginPage, BrowsingPage } from '../../pages/pages';
import { CopyMoveDialog } from './../../components/dialog/copy-move-dialog';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Copy content', () => {
  const username = `user-${Utils.random()}`;

  const source = `source-${Utils.random()}`; let sourceId;
  const destinationPF = `destinationPersonal-${Utils.random()}`; let destinationIdPF;
  const destinationRF = `destinationRecent-${Utils.random()}`; let destinationIdRF;
  const destinationSF = `destinationShared-${Utils.random()}`; let destinationIdSF;
  const destinationFav = `destinationFav-${Utils.random()}`; let destinationIdFav;

  const file1 = `file1-${Utils.random()}.txt`; let file1Id;

  const folder1 = `folder1-${Utils.random()}`; let folder1Id;
  const fileInFolder = `fileInFolder-${Utils.random()}.txt`;

  const file2 = `file2-${Utils.random()}.txt`; let file2Id;
  const file3 = `file3-${Utils.random()}.txt`; let file3Id;

  const existingFile = `existing-${Utils.random()}`; let existingFileId;

  const existingFolder = `existing-${Utils.random()}`;
  let existingId1, existingId2, existingId2RF, existingId2SF, existingId2Fav;
  const file2InFolder = `file2InFolder-${Utils.random()}.txt`;
  const file3InFolder = `file3InFolder-${Utils.random()}.txt`;

  const siteName = `site-${Utils.random()}`;
  const folderSitePF = `folderSitePersonal-${Utils.random()}`;
  const folderSiteRF = `folderSiteRecent-${Utils.random()}`;
  const folderSiteSF = `folderSiteShared-${Utils.random()}`;
  const folderSiteFav = `folderSiteFav-${Utils.random()}`;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const copyDialog = new CopyMoveDialog();

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });

    sourceId = (await apis.user.nodes.createFolder(source)).entry.id;
    destinationIdPF = (await apis.user.nodes.createFolder(destinationPF)).entry.id;
    destinationIdRF = (await apis.user.nodes.createFolder(destinationRF)).entry.id;
    destinationIdSF = (await apis.user.nodes.createFolder(destinationSF)).entry.id;
    destinationIdFav = (await apis.user.nodes.createFolder(destinationFav)).entry.id;

    file1Id = (await apis.user.nodes.createFile(file1, sourceId)).entry.id;
    await apis.user.shared.shareFileById(file1Id);
    await apis.user.favorites.addFavoriteById('file', file1Id);

    folder1Id = (await apis.user.nodes.createFolder(folder1, sourceId)).entry.id;
    await apis.user.nodes.createFile(fileInFolder, folder1Id);
    await apis.user.favorites.addFavoriteById('folder', folder1Id);

    file2Id = (await apis.user.nodes.createFile(file2, sourceId)).entry.id;
    file3Id = (await apis.user.nodes.createFile(file3, sourceId)).entry.id;
    await apis.user.shared.shareFileById(file2Id);
    await apis.user.shared.shareFileById(file3Id);
    await apis.user.favorites.addFavoriteById('file', file2Id);
    await apis.user.favorites.addFavoriteById('file', file3Id);

    existingFileId = (await apis.user.nodes.createFile(`${existingFile}.txt`, sourceId)).entry.id;
    await apis.user.shared.shareFileById(existingFileId);
    await apis.user.favorites.addFavoriteById('file', existingFileId);
    await apis.user.nodes.createFile(`${existingFile}.txt`, destinationIdPF);
    await apis.user.nodes.createFile(`${existingFile}.txt`, destinationIdRF);
    await apis.user.nodes.createFile(`${existingFile}.txt`, destinationIdSF);
    await apis.user.nodes.createFile(`${existingFile}.txt`, destinationIdFav);

    existingId1 = (await apis.user.nodes.createFolder(existingFolder, sourceId)).entry.id;
    existingId2 = (await apis.user.nodes.createFolder(existingFolder, destinationIdPF)).entry.id;
    existingId2RF = (await apis.user.nodes.createFolder(existingFolder, destinationIdRF)).entry.id;
    existingId2SF = (await apis.user.nodes.createFolder(existingFolder, destinationIdSF)).entry.id;
    existingId2Fav = (await apis.user.nodes.createFolder(existingFolder, destinationIdFav)).entry.id;
    await apis.user.nodes.createFile(file2InFolder, existingId1);
    await apis.user.nodes.createFile(file3InFolder, existingId2);
    await apis.user.nodes.createFile(file3InFolder, existingId2RF);
    await apis.user.nodes.createFile(file3InFolder, existingId2SF);
    await apis.user.nodes.createFile(file3InFolder, existingId2Fav);
    await apis.user.favorites.addFavoriteById('folder', existingId1);

    await apis.user.sites.createSite(siteName);
    const docLibId = await apis.user.sites.getDocLibId(siteName);
    await apis.user.nodes.createFolder(folderSitePF, docLibId);
    await apis.user.nodes.createFolder(folderSiteRF, docLibId);
    await apis.user.nodes.createFolder(folderSiteSF, docLibId);
    await apis.user.nodes.createFolder(folderSiteFav, docLibId);

    await apis.user.shared.waitForApi({ expect: 4 });
    await apis.user.favorites.waitForApi({ expect: 7 });

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(sourceId);
    await apis.user.nodes.deleteNodeById(destinationIdPF);
    await apis.user.nodes.deleteNodeById(destinationIdRF);
    await apis.user.nodes.deleteNodeById(destinationIdSF);
    await apis.user.nodes.deleteNodeById(destinationIdFav);
    await apis.user.sites.deleteSite(siteName);
    done();
  });

  describe('from Personal Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(source);
      done();
    });

    it('Copy a file - [C217135]', async () => {
      await dataTable.selectItem(file1);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('Personal Files');
      await copyDialog.selectDestination(destinationPF);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 1 item');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in source folder`);
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationPF);
      expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in destination folder`);
    });

    it('Copy a folder with content - [C291888]', async () => {
      await dataTable.selectItem(folder1);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('Personal Files');
      await copyDialog.selectDestination(destinationPF);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 1 item');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(folder1)).toBe(true, `${folder1} not present in source folder`);
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationPF);
      expect(await dataTable.isItemPresent(folder1)).toBe(true, `${folder1} not present in destination folder`);
      expect(await dataTable.isItemPresent(fileInFolder)).toBe(false, `${fileInFolder} is present in destination`);

      await dataTable.doubleClickOnRowByName(folder1);
      expect(await dataTable.isItemPresent(fileInFolder)).toBe(true, `${fileInFolder} is not present in parent folder`);
    });

    it('Copy multiple items - [C291889]', async () => {
      await dataTable.selectMultipleItems([file2, file3]);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('Personal Files');
      await copyDialog.selectDestination(destinationPF);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 2 items');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(file2)).toBe(true, `${file2} not present in source folder`);
      expect(await dataTable.isItemPresent(file3)).toBe(true, `${file3} not present in source folder`);
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationPF);
      expect(await dataTable.isItemPresent(file2)).toBe(true, `${file2} not present in destination folder`);
      expect(await dataTable.isItemPresent(file3)).toBe(true, `${file3} not present in destination folder`);
    });

    it('Copy a file with a name that already exists on the destination - [C217137]', async () => {
      await dataTable.selectItem(existingFile);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('Personal Files');
      await copyDialog.selectDestination(destinationPF);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 1 item');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(`${existingFile}.txt`)).toBe(true, `${existingFile}.txt not present in source folder`);
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationPF);
      expect(await dataTable.isItemPresent(`${existingFile}.txt`)).toBe(true, `${existingFile}.txt not present in destination folder`);
      expect(await dataTable.isItemPresent(`${existingFile}-1.txt`)).toBe(true, `${existingFile}-1.txt not present in destination folder`);
    });

    it('Copy a folder with a name that already exists on the destination - [C217138]', async () => {
      await dataTable.selectItem(existingFolder);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('Personal Files');
      await copyDialog.selectDestination(destinationPF);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 1 item');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(existingFolder)).toBe(true, `${existingFolder} not present in source folder`);
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationPF);
      expect(await dataTable.isItemPresent(existingFolder)).toBe(true, `${existingFolder} not present in destination folder`);
      await dataTable.doubleClickOnRowByName(existingFolder);
      expect(await dataTable.isItemPresent(file2InFolder)).toBe(true, `${file2InFolder} not present in destination folder`);
      expect(await dataTable.isItemPresent(file3InFolder)).toBe(true, `${file3InFolder} not present in destination folder`);
    });

    it('Copy items into a library - [C280282]', async () => {
      await dataTable.selectMultipleItems([file1, folder1]);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('File Libraries');
      await copyDialog.doubleClickOnRow(siteName);
      await copyDialog.doubleClickOnRow('documentLibrary');
      await copyDialog.selectDestination(folderSitePF);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 2 items');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in source folder`);
      expect(await dataTable.isItemPresent(folder1)).toBe(true, `${folder1} not present in source folder`);

      await page.goToMyLibraries();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.doubleClickOnRowByName(folderSitePF);

      expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in destination folder`);
      expect(await dataTable.isItemPresent(folder1)).toBe(true, `${folder1} not present in destination folder`);
      await dataTable.doubleClickOnRowByName(folder1);
      expect(await dataTable.isItemPresent(fileInFolder)).toBe(true, `${fileInFolder} not present in parent folder`);
    });
  });

  describe('from Recent Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickRecentFilesAndWait();
      done();
    });

    it('Copy a file - [C280194]', async () => {
      await dataTable.selectItem(file1, source);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('Personal Files');
      await copyDialog.selectDestination(destinationRF);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 1 item');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationRF);
      expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in destination folder`);
    });

    it('Copy multiple items - [C280201]', async () => {
      await dataTable.selectMultipleItems([file2, file3], source);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('Personal Files');
      await copyDialog.selectDestination(destinationRF);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 2 items');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationRF);
      expect(await dataTable.isItemPresent(file2)).toBe(true, `${file2} not present in destination folder`);
      expect(await dataTable.isItemPresent(file3)).toBe(true, `${file3} not present in destination folder`);
    });

    it('Copy a file with a name that already exists on the destination - [C280196]', async () => {
      await dataTable.selectItem(existingFile, source);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('Personal Files');
      await copyDialog.selectDestination(destinationRF);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 1 item');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationRF);
      expect(await dataTable.isItemPresent(`${existingFile}.txt`)).toBe(true, `${existingFile}.txt not present in destination folder`);
      expect(await dataTable.isItemPresent(`${existingFile}-1.txt`)).toBe(true, `${existingFile}-1.txt not present in destination folder`);
    });

    it('Copy items into a library - [C291899]', async () => {
      await dataTable.selectItem(file1, source);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('File Libraries');
      await copyDialog.doubleClickOnRow(siteName);
      await copyDialog.doubleClickOnRow('documentLibrary');
      await copyDialog.selectDestination(folderSiteRF);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 1 item');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      await page.goToMyLibraries();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.doubleClickOnRowByName(folderSiteRF);

      expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in destination folder`);
    });
  });

  describe('from Shared Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickSharedFilesAndWait();
      done();
    });

    it('Copy a file - [C280206]', async () => {
      await dataTable.selectItem(file1, source);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('Personal Files');
      await copyDialog.selectDestination(destinationSF);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 1 item');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationSF);
      expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in destination folder`);
    });

    it('Copy multiple items - [C280213]', async () => {
      await dataTable.selectMultipleItems([file2, file3], source);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('Personal Files');
      await copyDialog.selectDestination(destinationSF);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 2 items');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationSF);
      expect(await dataTable.isItemPresent(file2)).toBe(true, `${file2} not present in destination folder`);
      expect(await dataTable.isItemPresent(file3)).toBe(true, `${file3} not present in destination folder`);
    });

    it('Copy a file with a name that already exists on the destination - [C280208]', async () => {
      await dataTable.selectItem(existingFile, source);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('Personal Files');
      await copyDialog.selectDestination(destinationSF);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 1 item');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationSF);
      expect(await dataTable.isItemPresent(`${existingFile}.txt`)).toBe(true, `${existingFile}.txt not present in destination folder`);
      expect(await dataTable.isItemPresent(`${existingFile}-1.txt`)).toBe(true, `${existingFile}-1.txt not present in destination folder`);
    });

    it('Copy items into a library - [C291900]', async () => {
      await dataTable.selectItem(file1, source);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('File Libraries');
      await copyDialog.doubleClickOnRow(siteName);
      await copyDialog.doubleClickOnRow('documentLibrary');
      await copyDialog.selectDestination(folderSiteSF);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 1 item');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in source folder`);

      await page.goToMyLibraries();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.doubleClickOnRowByName(folderSiteSF);

      expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in destination folder`);
    });
  });

  describe('from Favorites', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickFavoritesAndWait();
      done();
    });

    it('Copy a file - [C280218]', async () => {
      await dataTable.selectItem(file1);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('Personal Files');
      await copyDialog.selectDestination(destinationFav);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 1 item');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in source folder`);
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationFav);
      expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in destination folder`);
    });

    it('Copy a folder with content - [C280219]', async () => {
      await dataTable.selectItem(folder1);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('Personal Files');
      await copyDialog.selectDestination(destinationFav);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 1 item');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(folder1)).toBe(true, `${folder1} not present in source folder`);
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationFav);
      expect(await dataTable.isItemPresent(folder1)).toBe(true, `${folder1} not present in destination folder`);
      expect(await dataTable.isItemPresent(fileInFolder)).toBe(false, `${fileInFolder} is present in destination`);

      await dataTable.doubleClickOnRowByName(folder1);
      expect(await dataTable.isItemPresent(fileInFolder)).toBe(true, `${fileInFolder} is not present in parent folder`);
    });

    it('Copy multiple items - [C280225]', async () => {
      await dataTable.selectMultipleItems([file2, file3]);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('Personal Files');
      await copyDialog.selectDestination(destinationFav);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 2 items');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(file2)).toBe(true, `${file2} not present in source folder`);
      expect(await dataTable.isItemPresent(file3)).toBe(true, `${file3} not present in source folder`);
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationFav);
      expect(await dataTable.isItemPresent(file2)).toBe(true, `${file2} not present in destination folder`);
      expect(await dataTable.isItemPresent(file3)).toBe(true, `${file3} not present in destination folder`);
    });

    it('Copy a file with a name that already exists on the destination - [C280220]', async () => {
      await dataTable.selectItem(existingFile);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('Personal Files');
      await copyDialog.selectDestination(destinationFav);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 1 item');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(`${existingFile}.txt`)).toBe(true, `${existingFile}.txt not present in source folder`);
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationFav);
      expect(await dataTable.isItemPresent(`${existingFile}.txt`)).toBe(true, `${existingFile}.txt not present in destination folder`);
      expect(await dataTable.isItemPresent(`${existingFile}-1.txt`)).toBe(true, `${existingFile}-1.txt not present in destination folder`);
    });

    it('Copy a folder with a name that already exists on the destination - [C280221]', async () => {
      await dataTable.selectItem(existingFolder);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('Personal Files');
      await copyDialog.selectDestination(destinationFav);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 1 item');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(existingFolder)).toBe(true, `${existingFolder} not present in source folder`);
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationFav);
      expect(await dataTable.isItemPresent(existingFolder)).toBe(true, `${existingFolder} not present in destination folder`);
      await dataTable.doubleClickOnRowByName(existingFolder);
      expect(await dataTable.isItemPresent(file2InFolder)).toBe(true, `${file2InFolder} not present in destination folder`);
      expect(await dataTable.isItemPresent(file3InFolder)).toBe(true, `${file3InFolder} not present in destination folder`);
    });

    it('Copy items into a library - [C291901]', async () => {
      await dataTable.selectMultipleItems([file1, folder1], source);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('File Libraries');
      await copyDialog.doubleClickOnRow(siteName);
      await copyDialog.doubleClickOnRow('documentLibrary');
      await copyDialog.selectDestination(folderSiteFav);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 2 items');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in source folder`);
      expect(await dataTable.isItemPresent(folder1)).toBe(true, `${folder1} not present in source folder`);

      await page.goToMyLibraries();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.doubleClickOnRowByName(folderSiteFav);

      expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in destination folder`);
      expect(await dataTable.isItemPresent(folder1)).toBe(true, `${folder1} not present in destination folder`);
      await dataTable.doubleClickOnRowByName(folder1);
      expect(await dataTable.isItemPresent(fileInFolder)).toBe(true, `${fileInFolder} not present in parent folder`);
    });
  });

});
