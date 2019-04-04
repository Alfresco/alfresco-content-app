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

fdescribe('Copy content', () => {
  const username = `user-${Utils.random()}`;

  const source = `source-${Utils.random()}`; let sourceId;
  const destinationPF = `destinationPersonal-${Utils.random()}`; let destinationIdPF;
  const destinationRF = `destinationRecent-${Utils.random()}`; let destinationIdRF;
  const destinationSF = `destinationShared-${Utils.random()}`; let destinationIdSF;
  const destinationFav = `destinationFav-${Utils.random()}`; let destinationIdFav;

  const file1 = `file1-${Utils.random()}.txt`; let file1Id;

  const folder1 = `folder1-${Utils.random()}`; let folder1Id;
  const fileInFolder = `fileInFolder-${Utils.random()}.txt`; let fileInFolderId;

  const file2 = `file2-${Utils.random()}.txt`; let file2Id;
  const file3 = `file3-${Utils.random()}.txt`; let file3Id;
  const file4 = `file4-${Utils.random()}.txt`; let file4Id;

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
    fileInFolderId = (await apis.user.nodes.createFile(fileInFolder, folder1Id)).entry.id;
    await apis.user.favorites.addFavoriteById('file', fileInFolderId);
    await apis.user.favorites.addFavoriteById('folder', folder1Id);

    file2Id = (await apis.user.nodes.createFile(file2, sourceId)).entry.id;
    file3Id = (await apis.user.nodes.createFile(file3, sourceId)).entry.id;
    file4Id = (await apis.user.nodes.createFile(file4, sourceId)).entry.id;
    await apis.user.shared.shareFileById(file2Id);
    await apis.user.shared.shareFileById(file3Id);
    await apis.user.shared.shareFileById(file4Id);
    await apis.user.favorites.addFavoriteById('file', file2Id);
    await apis.user.favorites.addFavoriteById('file', file3Id);
    await apis.user.favorites.addFavoriteById('file', file4Id);

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

    await apis.user.shared.waitForApi({ expect: 5 });
    await apis.user.favorites.waitForApi({ expect: 8 });

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

  fdescribe('from Personal Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(source);
      done();
    });

    it('Copy a file - [C217135]', async () => copyAFile());

    // it('Copy a folder with content - [C291888]', async () => copyAFolderWithContent());

    // it('Copy multiple items - [C291889]', async () => copyMultipleItems());

    // it('Copy a file with a name that already exists on the destination - [C217137]', async () => copyAFileWithANameThatAlreadyExists());

    // it('Copy a folder with a name that already exists on the destination - [C217138]', async () => copyAFolderWithANameThatAlreadyExists());

    // it('Copy items into a library - [C280282]', async () => copyItemsIntoALibrary());

    // it('Copy locked file - [C217139]', async () => copyLockedFile());

    // it('Copy folder that contains locked file - [C217140]', async () => copyFolderThatContainsLockedFile());

    // it('Undo copy of files - [C217171]', async () => undoCopyOfFiles());

    // it('Undo copy of folders - [C217172]', async () => undoCopyOfFolders());

    // it('Undo copy of a file when a file with same name already exists on the destination - [C217173]', async () => undoCopyOfAFile());

    // it('Undo copy of a folder when a folder with same name already exists on the destination - [C217174]', async () => undoCopyOfAFolder());
  });

  // fdescribe('from Recent Files', () => {
  //   beforeEach(async (done) => {
  //     await Utils.pressEscape();
  //     await page.clickRecentFilesAndWait();
  //     done();
  //   });

  //   it('Copy a file - [C280194]', async () => copyAFile());

  //   it('Copy multiple items - [C280201]', async () => copyMultipleItems());

  //   it('Copy a file with a name that already exists on the destination - [C280196]', async () => copyAFileWithANameThatAlreadyExists());

  //   it('Copy items into a library - [C291899]', async () => copyItemsIntoALibrary());

  //   it('Copy locked file - [C280198]', async () => copyLockedFile());
  // });

  // it('Undo copy of files - [C280202]', async () => undoCopyOfFiles());

  // fdescribe('from Shared Files', () => {
  //   beforeEach(async (done) => {
  //     await Utils.pressEscape();
  //     await page.clickSharedFilesAndWait();
  //     done();
  //   });

  //   it('Copy a file - [C280206]', async () => copyAFile());

  //   it('Copy multiple items - [C280213]', async () => copyMultipleItems());

  //   it('Copy a file with a name that already exists on the destination - [C280208]', async () => copyAFileWithANameThatAlreadyExists());

  //   it('Copy items into a library - [C291900]', async () => copyItemsIntoALibrary());

  //   it('Copy locked file - [C280210]', async () => copyLockedFile());

  //   it('Undo copy of files - [C280214]', async () => undoCopyOfFiles());
  // });

  // fdescribe('from Favorites', () => {
  //   beforeEach(async (done) => {
  //     await Utils.pressEscape();
  //     await page.clickFavoritesAndWait();
  //     done();
  //   });

  //   it('Copy a file - [C280218]', async () => copyAFile());

  //   it('Copy a folder with content - [C280219]', async () => copyAFolderWithContent());

  //   it('Copy multiple items - [C280225]', async () => copyMultipleItems());

  //   it('Copy a file with a name that already exists on the destination - [C280220]', async () => copyAFileWithANameThatAlreadyExists());

  //   it('Copy a folder with a name that already exists on the destination - [C280221]', async () => copyAFolderWithANameThatAlreadyExists());

  //   it('Copy items into a library - [C291901]', async () => copyItemsIntoALibrary());

  //   it('Copy locked file - [C280222]', async () => copyLockedFile());

  //   it('Copy folder that contains locked file - [C280223]', async () => copyFolderThatContainsLockedFile());

  //   it('Undo copy of files - [C280226]', async () => undoCopyOfFiles());

  //   it('Undo copy of folders - [C280227]', async () => undoCopyOfFolders());

  //   it('Undo copy of a file when a file with same name already exists on the destination - [C280228]', async () => undoCopyOfAFile());

  //   it('Undo copy of a folder when a folder with same name already exists on the destination - [C280229]', async () => undoCopyOfAFolder());
  // });

  async function copyAFile() {
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
  }

  async function copyAFolderWithContent() {
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
  }

  async function copyMultipleItems() {
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
  }

  async function copyAFileWithANameThatAlreadyExists() {
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
  }

  async function copyAFolderWithANameThatAlreadyExists() {
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
  }

  async function copyItemsIntoALibrary() {
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
  }

  async function copyLockedFile() {
    await apis.user.nodes.lockFile(file1Id);

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
  }

  async function copyFolderThatContainsLockedFile() {
    await apis.user.nodes.lockFile(fileInFolderId);

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
  }

  async function undoCopyOfFiles() {
    await dataTable.selectItem(file4);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destinationPF);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await page.clickSnackBarAction();

    expect(await dataTable.isItemPresent(file4)).toBe(true, `${file4} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destinationPF);
    expect(await dataTable.isItemPresent(file4)).toBe(false, `${file4} present in destination folder`);

    await page.clickTrash();
    expect(await dataTable.isEmptyList()).toBe(true, 'Trash is not empty');
  }

  async function undoCopyOfFolders() {
    await dataTable.selectItem(folder1);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destinationPF);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await page.clickSnackBarAction();

    expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destinationPF);
    expect(await dataTable.isItemPresent(folder1)).toBe(false, `${folder1} present in destination folder`);

    await page.clickTrash();
    expect(await dataTable.isEmptyList()).toBe(true, 'Trash is not empty');
  }

  async function undoCopyOfAFile() {
    const folder2 = `folder2-${Utils.random()}`; let folder2Id;
    folder2Id = (await apis.user.nodes.createFolder(folder2, sourceId)).entry.id;
    const fileInFolder2 = fileInFolder;
    await apis.user.nodes.createFile(fileInFolder2, folder2Id);

    await dataTable.doubleClickOnRowByName(folder1);
    await dataTable.selectItem(fileInFolder);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.doubleClickOnRow(source);
    await copyDialog.selectDestination(folder2);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await page.clickSnackBarAction();

    expect(await dataTable.isItemPresent(fileInFolder)).toBe(true, `${fileInFolder} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(source);
    await dataTable.doubleClickOnRowByName(folder2);
    expect(await dataTable.isItemPresent(fileInFolder2)).toBe(true, `${fileInFolder2} not present in destination folder`);
    expect(await dataTable.isItemPresent(fileInFolder2 + '-1')).toBe(false, `${fileInFolder2}-1 present in destination folder`);

    await page.clickTrash();
    expect(await dataTable.isEmptyList()).toBe(true, 'Trash is not empty');
  }

  async function undoCopyOfAFolder() {
    // create folder1/my-folder-x/file1-y.txt
    const folderInFolder1 = `my-folder-${Utils.random()}`; let folderInFolder1Id;
    folderInFolder1Id = (await apis.user.nodes.createFolder(folderInFolder1, folder1Id)).entry.id;
    const fileInFolderInFolder1 = `file1-${Utils.random()}.txt`;
    await apis.user.nodes.createFile(fileInFolderInFolder1, folderInFolder1Id);

    // create folder2/my-folder-x/file2-y.txt
    const folder2 = `folder2-${Utils.random()}`; let folder2Id;
    folder2Id = (await apis.user.nodes.createFolder(folder2, sourceId)).entry.id;
    const folderInFolder2 = folderInFolder1; let folderInFolder2Id;
    folderInFolder2Id = (await apis.user.nodes.createFolder(folderInFolder2, folder2Id)).entry.id;
    const fileInFolderInFolder2 = `file2-${Utils.random()}.txt`;
    await apis.user.nodes.createFile(fileInFolderInFolder2, folderInFolder2Id);

    await dataTable.doubleClickOnRowByName(folder1);
    await dataTable.selectItem(folderInFolder1);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.doubleClickOnRow(source);
    await copyDialog.selectDestination(folder2);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await page.clickSnackBarAction();

    expect(await dataTable.isItemPresent(fileInFolder)).toBe(true, `${fileInFolder} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(source);
    await dataTable.doubleClickOnRowByName(folder2);
    expect(await dataTable.isItemPresent(folderInFolder2)).toBe(true, `${folderInFolder2} not present in destination folder`);
    await dataTable.doubleClickOnRowByName(folderInFolder2);
    expect(await dataTable.isItemPresent(fileInFolderInFolder2)).toBe(true, `${fileInFolderInFolder2} not present in destination folder`);
    expect(await dataTable.isItemPresent(fileInFolderInFolder1)).toBe(false, `${fileInFolderInFolder1} present in destination folder`);

    await page.clickTrash();
    expect(await dataTable.isEmptyList()).toBe(true, 'Trash is not empty');
  }

});
