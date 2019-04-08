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
  const destinationSearch = `destinationSearch-${Utils.random()}`; let destinationIdSearch;

  const file1 = `file1-${Utils.random()}.txt`; let file1Id;

  const folder1 = `folder1-${Utils.random()}`; let folder1Id;
  const folder2 = `folder2-${Utils.random()}`; let folder2Id;
  const fileInFolder = `fileInFolder-${Utils.random()}.txt`; let fileInFolderId;
  const fileInFolder2 = fileInFolder;

  const file2 = `file2-${Utils.random()}.txt`; let file2Id;
  const file3 = `file3-${Utils.random()}.txt`; let file3Id;
  const file4 = `file4-${Utils.random()}.txt`; let file4Id;

  const existingFile = `existing-${Utils.random()}.txt`; let existingFileId;

  const existingFolder = `existing-${Utils.random()}`;
  let existingId1, existingId2, existingId2RF, existingId2SF, existingId2Fav, existingId2Search;
  const file2InFolder = `file2InFolder-${Utils.random()}.txt`;
  const file3InFolder = `file3InFolder-${Utils.random()}.txt`;

  const siteName = `site-${Utils.random()}`;
  const folderSitePF = `folderSitePersonal-${Utils.random()}`;
  const folderSiteRF = `folderSiteRecent-${Utils.random()}`;
  const folderSiteSF = `folderSiteShared-${Utils.random()}`;
  const folderSiteFav = `folderSiteFav-${Utils.random()}`;
  const folderSiteSearch = `folderSiteSearch-${Utils.random()}`;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const copyDialog = new CopyMoveDialog();
  const { searchInput } = page.header;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });

    sourceId = (await apis.user.nodes.createFolder(source)).entry.id;
    destinationIdPF = (await apis.user.nodes.createFolder(destinationPF)).entry.id;
    destinationIdRF = (await apis.user.nodes.createFolder(destinationRF)).entry.id;
    destinationIdSF = (await apis.user.nodes.createFolder(destinationSF)).entry.id;
    destinationIdFav = (await apis.user.nodes.createFolder(destinationFav)).entry.id;
    destinationIdSearch = (await apis.user.nodes.createFolder(destinationSearch)).entry.id;

    existingFileId = (await apis.user.nodes.createFile(existingFile, sourceId)).entry.id;
    await apis.user.shared.shareFileById(existingFileId);
    await apis.user.favorites.addFavoriteById('file', existingFileId);
    await apis.user.nodes.createFile(existingFile, destinationIdPF);
    await apis.user.nodes.createFile(existingFile, destinationIdRF);
    await apis.user.nodes.createFile(existingFile, destinationIdSF);
    await apis.user.nodes.createFile(existingFile, destinationIdFav);
    await apis.user.nodes.createFile(existingFile, destinationIdSearch);

    existingId1 = (await apis.user.nodes.createFolder(existingFolder, sourceId)).entry.id;
    existingId2 = (await apis.user.nodes.createFolder(existingFolder, destinationIdPF)).entry.id;
    existingId2RF = (await apis.user.nodes.createFolder(existingFolder, destinationIdRF)).entry.id;
    existingId2SF = (await apis.user.nodes.createFolder(existingFolder, destinationIdSF)).entry.id;
    existingId2Fav = (await apis.user.nodes.createFolder(existingFolder, destinationIdFav)).entry.id;
    existingId2Search = (await apis.user.nodes.createFolder(existingFolder, destinationIdSearch)).entry.id;
    await apis.user.nodes.createFile(file2InFolder, existingId1);
    await apis.user.nodes.createFile(file3InFolder, existingId2);
    await apis.user.nodes.createFile(file3InFolder, existingId2RF);
    await apis.user.nodes.createFile(file3InFolder, existingId2SF);
    await apis.user.nodes.createFile(file3InFolder, existingId2Fav);
    await apis.user.nodes.createFile(file3InFolder, existingId2Search);
    await apis.user.favorites.addFavoriteById('folder', existingId1);

    folder1Id = (await apis.user.nodes.createFolder(folder1, sourceId)).entry.id;
    folder2Id = (await apis.user.nodes.createFolder(folder2, sourceId)).entry.id;
    fileInFolderId = (await apis.user.nodes.createFile(fileInFolder, folder1Id)).entry.id;
    await apis.user.favorites.addFavoriteById('file', fileInFolderId);
    await apis.user.favorites.addFavoriteById('folder', folder1Id);
    await apis.user.favorites.addFavoriteById('folder', folder2Id);

    await apis.user.nodes.createFile(fileInFolder2, folder2Id);

    file1Id = (await apis.user.nodes.createFile(file1, sourceId)).entry.id;
    file2Id = (await apis.user.nodes.createFile(file2, sourceId)).entry.id;
    file3Id = (await apis.user.nodes.createFile(file3, sourceId)).entry.id;
    file4Id = (await apis.user.nodes.createFile(file4, sourceId)).entry.id;
    await apis.user.shared.shareFileById(file1Id);
    await apis.user.shared.shareFileById(file2Id);
    await apis.user.shared.shareFileById(file3Id);
    await apis.user.shared.shareFileById(file4Id);
    await apis.user.favorites.addFavoriteById('file', file1Id);
    await apis.user.favorites.addFavoriteById('file', file2Id);
    await apis.user.favorites.addFavoriteById('file', file3Id);
    await apis.user.favorites.addFavoriteById('file', file4Id);

    await apis.user.sites.createSite(siteName);
    const docLibId = await apis.user.sites.getDocLibId(siteName);
    await apis.user.nodes.createFolder(folderSitePF, docLibId);
    await apis.user.nodes.createFolder(folderSiteRF, docLibId);
    await apis.user.nodes.createFolder(folderSiteSF, docLibId);
    await apis.user.nodes.createFolder(folderSiteFav, docLibId);
    await apis.user.nodes.createFolder(folderSiteSearch, docLibId);

    await apis.user.shared.waitForApi({ expect: 5 });
    await apis.user.favorites.waitForApi({ expect: 9 });

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(sourceId);
    await apis.user.sites.deleteSite(siteName);
    done();
  });

  describe('from Recent Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickRecentFilesAndWait();
      done();
    });

    afterAll(async done => {
      await apis.user.nodes.deleteNodeById(destinationIdRF);
      done();
    });

    it('Copy a file - [C280194]', async () => copyAFile(destinationRF, source));

    it('Copy multiple items - [C280201]', async () => copyMultipleItems(destinationRF, source));

    it('Copy a file with a name that already exists on the destination - [C280196]', async () => copyAFileWithANameThatAlreadyExists(destinationRF, source));

    it('Copy items into a library - [C291899]', async () => copyItemsIntoALibrary([file1], folderSiteRF, source));

    it('Copy locked file - [C280198]', async () => copyLockedFile(destinationRF, source));

    it('Undo copy of files - [C280202]', async () => undoCopyOfFiles(destinationRF));

  });

  describe('from Personal Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(source);
      done();
    });

    afterAll(async done => {
      await apis.user.nodes.deleteNodeById(destinationIdPF);
      done();
    });

    it('Copy a file - [C217135]', async () => copyAFile(destinationPF));

    it('Copy a folder with content - [C291888]', async () => copyAFolderWithContent(destinationPF));

    it('Copy multiple items - [C291889]', async () => copyMultipleItems(destinationPF));

    it('Copy a file with a name that already exists on the destination - [C217137]', async () => copyAFileWithANameThatAlreadyExists(destinationPF));

    it('Copy a folder with a name that already exists on the destination - [C217138]', async () => copyAFileWithANameThatAlreadyExists(destinationPF));

    it('Copy items into a library - [C280282]', async () => copyItemsIntoALibrary([file1, folder1], folderSitePF));

    it('Copy locked file - [C217139]', async () => copyLockedFile(destinationPF));

    it('Copy folder that contains locked file - [C217140]', async () => copyFolderThatContainsLockedFile(destinationPF));

    it('Undo copy of files - [C217171]', async () => undoCopyOfFiles(destinationPF));

    it('Undo copy of folders - [C217172]', async () => undoCopyOfFolders(destinationPF));

    it('Undo copy of a file when a file with same name already exists on the destination - [C217173]', async () => undoCopyOfAFile());

    it('Undo copy of a folder when a folder with same name already exists on the destination - [C217174]', async () => undoCopyOfAFolder());

  });

  describe('from Shared Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickSharedFilesAndWait();
      done();
    });

    afterAll(async done => {
      await apis.user.nodes.deleteNodeById(destinationIdSF);
      done();
    });

    it('Copy a file - [C280206]', async () => copyAFile(destinationSF));

    it('Copy multiple items - [C280213]', async () => copyMultipleItems(destinationSF, source));

    it('Copy a file with a name that already exists on the destination - [C280208]', async () => copyAFileWithANameThatAlreadyExists(destinationSF));

    it('Copy items into a library - [C291900]', async () => copyItemsIntoALibrary([file1], folderSiteSF, source));

    it('Copy locked file - [C280210]', async () => copyLockedFile(destinationSF));

    it('Undo copy of files - [C280214]', async () => undoCopyOfFiles(destinationSF));

  });

  describe('from Favorites', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickFavoritesAndWait();
      done();
    });

    afterAll(async done => {
      await apis.user.nodes.deleteNodeById(destinationIdFav);
      done();
    });

    it('Copy a file - [C280218]', async () => copyAFile(destinationFav));

    it('Copy a folder with content - [C280219]', async () => copyAFolderWithContent(destinationFav, source));

    it('Copy multiple items - [C280225]', async () => copyMultipleItems(destinationFav));

    it('Copy a file with a name that already exists on the destination - [C280220]', async () => copyAFileWithANameThatAlreadyExists(destinationFav));

    it('Copy a folder with a name that already exists on the destination - [C280221]', async () => copyAFolderWithANameThatAlreadyExists(destinationFav));

    it('Copy items into a library - [C291901]', async () => copyItemsIntoALibrary([file1, folder1], folderSiteFav, source));

    it('Copy locked file - [C280222]', async () => copyLockedFile(destinationFav));

    it('Copy folder that contains locked file - [C280223]', async () => copyFolderThatContainsLockedFile(destinationFav, source));

    it('Undo copy of files - [C280226]', async () => undoCopyOfFiles(destinationFav));

    it('Undo copy of folders - [C280227]', async () => undoCopyOfFolders(destinationFav));

    it('Undo copy of a file when a file with same name already exists on the destination - [C280228]', async () => undoCopyOfAFile(source));

    it('Undo copy of a folder when a folder with same name already exists on the destination - [C280229]', async () => undoCopyOfAFolder(source));

  });

  describe('from Search Results', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      done();
    });

    afterAll(async done => {
      await apis.user.nodes.deleteNodeById(destinationIdSearch);
      done();
    });

    it('Copy a file - [C306932]', async () => copyAFile(destinationSearch, source, async () => {
        await searchInput.searchFor(file1);
        await dataTable.waitForBody();
      })
    );

    it('Copy a folder with content - [C306943]', async () => copyAFolderWithContent(destinationSearch, source, async () => {
        await searchInput.searchFor(folder1);
        await dataTable.waitForBody();
      })
    );

    it('Copy multiple items - [C306944]', async () => copyMultipleItems(destinationSearch, source, async () => {
        await searchInput.searchFor('file');
        await dataTable.waitForBody();
      })
    );

    it('Copy a file with a name that already exists on the destination - [C306933]', async () => copyAFileWithANameThatAlreadyExists(destinationSearch, source, async () => {
        await searchInput.searchFor(existingFile);
        await dataTable.waitForBody();
      })
    );

    it('Copy a folder with a name that already exists on the destination - [C306934]', async () => copyAFolderWithANameThatAlreadyExists(destinationSearch, source, async () => {
        await searchInput.searchFor(existingFolder);
        await dataTable.waitForBody();
      })
    );

    it('Copy items into a library - [C306942]', async () => copyItemsIntoALibrary([file1, file2], folderSiteSearch, source, async () => {
        await searchInput.searchFor('file');
        await dataTable.waitForBody();
      })
    );

    it('Copy locked file - [C306935]', async () => copyLockedFile(destinationSearch, source, async () => {
        await searchInput.searchFor(file1);
        await dataTable.waitForBody();
      })
    );

    it('Copy folder that contains locked file - [C306936]', async () => copyFolderThatContainsLockedFile(destinationSearch, source, async () => {
        await searchInput.searchFor(folder1);
        await dataTable.waitForBody();
      })
    );

    it('Undo copy of files - [C306938]', async () => undoCopyOfFiles(destinationSearch, '', async () => {
        await searchInput.searchFor('file');
        await dataTable.waitForBody();
      })
    );

    it('Undo copy of folders - [C306939]', async () => undoCopyOfFolders(destinationSearch, source, async () => {
        await searchInput.searchFor('folder');
        await dataTable.waitForBody();
      })
    );

    it('Undo copy of a file when a file with same name already exists on the destination - [C306940]', async () => {
      await searchInput.searchFor(existingFile);
      await dataTable.waitForBody();

      await dataTable.selectItem(existingFile, source);
      await toolbar.clickMoreActionsCopy();
      await copyDialog.selectLocation('Personal Files');
      await copyDialog.selectDestination(destinationSearch);
      await copyDialog.clickCopy();
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Copied 1 item');
      expect(msg).toContain('Undo');

      await copyDialog.waitForDialogToClose();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationSearch);
      expect(await dataTable.isItemPresent(existingFile)).toBe(true, `${existingFile} not present in destination folder`);
    });

    it('Undo copy of a folder when a folder with same name already exists on the destination - [C306941]', async () => undoCopyOfAFolder(source, async () => {
        await searchInput.searchFor(folder1);
        await dataTable.waitForBody();
      })
    );

  });

  async function copyAFile(destination, location = '', doBefore = null) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(file1, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in destination folder`);
  }

  async function copyAFolderWithContent(destination, location = '', doBefore = null) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(folder1, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(folder1)).toBe(true, `${folder1} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(folder1)).toBe(true, `${folder1} not present in destination folder`);
    expect(await dataTable.isItemPresent(fileInFolder)).toBe(false, `${fileInFolder} is present in destination`);

    await dataTable.doubleClickOnRowByName(folder1);
    expect(await dataTable.isItemPresent(fileInFolder)).toBe(true, `${fileInFolder} is not present in parent folder`);
  }

  async function copyMultipleItems(destination, location = '', doBefore = null) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectMultipleItems([file2, file3], location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 2 items');
    expect(msg).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(file2)).toBe(true, `${file2} not present in source folder`);
    expect(await dataTable.isItemPresent(file3)).toBe(true, `${file3} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(file2)).toBe(true, `${file2} not present in destination folder`);
    expect(await dataTable.isItemPresent(file3)).toBe(true, `${file3} not present in destination folder`);
  }

  async function copyAFileWithANameThatAlreadyExists(destination, location = '', doBefore = null) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(existingFile, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(existingFile)).toBe(true, `${existingFile}.txt not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(existingFile)).toBe(true, `${existingFile}.txt not present in destination folder`);
  }

  async function copyAFolderWithANameThatAlreadyExists(destination, location = '', doBefore = null) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(existingFolder, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(existingFolder)).toBe(true, `${existingFolder} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(existingFolder)).toBe(true, `${existingFolder} not present in destination folder`);
    await dataTable.doubleClickOnRowByName(existingFolder);
    expect(await dataTable.isItemPresent(file2InFolder)).toBe(true, `${file2InFolder} not present in destination folder`);
    expect(await dataTable.isItemPresent(file3InFolder)).toBe(true, `${file3InFolder} not present in destination folder`);
  }

  async function copyItemsIntoALibrary(items, destination, location = '', doBefore = null) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectMultipleItems(items, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('File Libraries');
    await copyDialog.doubleClickOnRow(siteName);
    await copyDialog.doubleClickOnRow('documentLibrary');
    await copyDialog.selectDestination(destination);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied ' + items.length + ' item');
    expect(msg).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    for (const item of Object.keys(items)) {
      expect(await dataTable.isItemPresent(item)).toBe(true, `${item} not present in source folder`);
    }

    await page.goToMyLibraries();
    await dataTable.doubleClickOnRowByName(siteName);
    await dataTable.doubleClickOnRowByName(destination);

    for (const item of Object.keys(items)) {
      expect(await dataTable.isItemPresent(item)).toBe(true, `${item} not present in destination folder`);
    }
  }

  async function copyLockedFile(destination, location = '', doBefore = null) {
    if (doBefore) {
      await doBefore();
    }
    await apis.user.nodes.lockFile(file1Id);

    await dataTable.selectItem(file1, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in destination folder`);
  }

  async function copyFolderThatContainsLockedFile(destination, location = '', doBefore = null) {
    if (doBefore) {
      await doBefore();
    }
    await apis.user.nodes.lockFile(fileInFolderId);

    await dataTable.selectItem(folder1, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(folder1)).toBe(true, `${folder1} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(folder1)).toBe(true, `${folder1} not present in destination folder`);
    expect(await dataTable.isItemPresent(fileInFolder)).toBe(false, `${fileInFolder} is present in destination`);

    await dataTable.doubleClickOnRowByName(folder1);
    expect(await dataTable.isItemPresent(fileInFolder)).toBe(true, `${fileInFolder} is not present in parent folder`);
  }

  async function undoCopyOfFiles(destination, location = '', doBefore = null) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(file4, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await page.clickSnackBarAction();

    expect(await dataTable.isItemPresent(file4)).toBe(true, `${file4} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(file4)).toBe(false, `${file4} present in destination folder`);

    await page.clickTrash();
    expect(await dataTable.isEmptyList()).toBe(true, 'Trash is not empty');
  }

  async function undoCopyOfFolders(destination, location = '', doBefore = null) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(folder2, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await page.clickSnackBarAction();

    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(folder2)).toBe(false, `${folder2} present in destination folder`);

    await page.clickTrash();
    expect(await dataTable.isEmptyList()).toBe(true, 'Trash is not empty');
  }

  async function undoCopyOfAFile(location = '', doBefore = null) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.doubleClickOnRowByName(folder1, location);
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

  async function undoCopyOfAFolder(location = '', doBefore = null) {
    if (doBefore) {
      await doBefore();
    }
    // create folder1/my-folder-x/file1-y.txt
    const folderInFolder1 = `my-folder-${Utils.random()}`; let folderInFolder1Id;
    folderInFolder1Id = (await apis.user.nodes.createFolder(folderInFolder1, folder1Id)).entry.id;
    const fileInFolderInFolder1 = `f1-${Utils.random()}.txt`;
    await apis.user.nodes.createFile(fileInFolderInFolder1, folderInFolder1Id);

    // create folder2/my-folder-x/file2-y.txt
    const f2 = `f2-${Utils.random()}`; let f2Id;
    f2Id = (await apis.user.nodes.createFolder(f2, sourceId)).entry.id;
    const folderInFolder2 = folderInFolder1; let folderInFolder2Id;
    folderInFolder2Id = (await apis.user.nodes.createFolder(folderInFolder2, f2Id)).entry.id;
    const fileInFolderInFolder2 = `f2-${Utils.random()}.txt`;
    await apis.user.nodes.createFile(fileInFolderInFolder2, folderInFolder2Id);

    await dataTable.doubleClickOnRowByName(folder1, location);
    await dataTable.selectItem(folderInFolder1);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.doubleClickOnRow(source);
    await copyDialog.selectDestination(f2);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await page.clickSnackBarAction();

    expect(await dataTable.isItemPresent(fileInFolder)).toBe(true, `${fileInFolder} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(source);
    await dataTable.doubleClickOnRowByName(f2);
    expect(await dataTable.isItemPresent(folderInFolder2)).toBe(true, `${folderInFolder2} not present in destination folder`);
    await dataTable.doubleClickOnRowByName(folderInFolder2);
    expect(await dataTable.isItemPresent(fileInFolderInFolder2)).toBe(true, `${fileInFolderInFolder2} not present in destination folder`);
    expect(await dataTable.isItemPresent(fileInFolderInFolder1)).toBe(false, `${fileInFolderInFolder1} present in destination folder`);

    await page.clickTrash();
    expect(await dataTable.isEmptyList()).toBe(true, 'Trash is not empty');
  }

});
