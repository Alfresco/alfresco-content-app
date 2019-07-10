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
  const fileInFolder = `fileInFolder-${Utils.random()}.txt`; let fileInFolderId;

  const folder2 = `folder2-${Utils.random()}`; let folder2Id;
  const fileInFolder2 = fileInFolder;

  const folderExisting = `folder-existing-${Utils.random()}`; let folderExistingId;
  const file1InFolderExisting = `file1InFolderExisting-${Utils.random()}.txt`;
  const file2InFolderExisting = `file2InFolderExisting-${Utils.random()}.txt`;

  const file2 = `file2-${Utils.random()}.txt`; let file2Id;
  const file3 = `file3-${Utils.random()}.txt`; let file3Id;
  const file4 = `file4-${Utils.random()}.txt`; let file4Id;

  const fileLocked1 = `file-locked1-${Utils.random()}.txt`; let fileLocked1Id;

  const folderWithLockedFiles = `folder-locked1-${Utils.random()}`; let folderWithLockedFilesId;
  const fileLockedInFolder = `file-locked-${Utils.random()}`; let fileLockedInFolderId;

  const existingFile = `existing-${Utils.random()}.txt`; let existingFileToCopyId;

  const existingFolder = `existing-${Utils.random()}`; let existingFolderToCopyId;

  let existingIdPF, existingIdFav, existingIdSearch;
  let folderExistingPFId, folderExistingFavId, folderExistingSearchId;

  const file2InFolder = `file2InFolder-${Utils.random()}.txt`;
  const file3InFolder = `file3InFolder-${Utils.random()}.txt`;

  const siteName = `site-${Utils.random()}`;
  const folderSitePF = `folderSitePersonal-${Utils.random()}`;
  const folderSiteRF = `folderSiteRecent-${Utils.random()}`;
  const folderSiteSF = `folderSiteShared-${Utils.random()}`;
  const folderSiteFav = `folderSiteFav-${Utils.random()}`;
  const folderSiteSearch = `folderSiteSearch-${Utils.random()}`;

  let locationId, destinationId;

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

    existingFileToCopyId = (await apis.user.nodes.createFile(existingFile, sourceId)).entry.id;
    await apis.user.shared.shareFileById(existingFileToCopyId);
    await apis.user.favorites.addFavoriteById('file', existingFileToCopyId);

    await apis.user.nodes.createFile(existingFile, destinationIdPF);
    await apis.user.nodes.createFile(existingFile, destinationIdRF);
    await apis.user.nodes.createFile(existingFile, destinationIdSF);
    await apis.user.nodes.createFile(existingFile, destinationIdFav);
    await apis.user.nodes.createFile(existingFile, destinationIdSearch);

    existingFolderToCopyId = (await apis.user.nodes.createFolder(existingFolder, sourceId)).entry.id;

    existingIdPF = (await apis.user.nodes.createFolder(existingFolder, destinationIdPF)).entry.id;
    await apis.user.nodes.createFolder(existingFolder, destinationIdRF);
    await apis.user.nodes.createFolder(existingFolder, destinationIdSF);
    existingIdFav = (await apis.user.nodes.createFolder(existingFolder, destinationIdFav)).entry.id;
    existingIdSearch = (await apis.user.nodes.createFolder(existingFolder, destinationIdSearch)).entry.id;
    await apis.user.nodes.createFile(file2InFolder, existingFolderToCopyId);

    await apis.user.nodes.createFile(file3InFolder, existingIdPF);
    await apis.user.nodes.createFile(file3InFolder, existingIdFav);
    await apis.user.nodes.createFile(file3InFolder, existingIdSearch);

    await apis.user.favorites.addFavoriteById('folder', existingFolderToCopyId);

    folder1Id = (await apis.user.nodes.createFolder(folder1, sourceId)).entry.id;
    fileInFolderId = (await apis.user.nodes.createFile(fileInFolder, folder1Id)).entry.id;
    await apis.user.favorites.addFavoriteById('folder', folder1Id);
    await apis.user.favorites.addFavoriteById('file', fileInFolderId);
    await apis.user.shared.shareFileById(fileInFolderId);

    folderExistingId = (await apis.user.nodes.createFolder(folderExisting, sourceId)).entry.id;
    await apis.user.favorites.addFavoriteById('folder', folderExistingId);
    await apis.user.nodes.createFile(file1InFolderExisting, folderExistingId);

    folderExistingPFId = (await apis.user.nodes.createFolder(folderExisting, destinationIdPF)).entry.id;
    await apis.user.nodes.createFile(file2InFolderExisting, folderExistingPFId);

    folderExistingFavId = (await apis.user.nodes.createFolder(folderExisting, destinationIdFav)).entry.id;
    await apis.user.nodes.createFile(file2InFolderExisting, folderExistingFavId);

    folderExistingSearchId = (await apis.user.nodes.createFolder(folderExisting, destinationIdSearch)).entry.id;
    await apis.user.nodes.createFile(file2InFolderExisting, folderExistingSearchId);

    folder2Id = (await apis.user.nodes.createFolder(folder2, sourceId)).entry.id;
    await apis.user.nodes.createFile(fileInFolder2, folder2Id);
    await apis.user.favorites.addFavoriteById('folder', folder2Id);

    fileLocked1Id = (await apis.user.nodes.createFile(fileLocked1, sourceId)).entry.id;
    await apis.user.nodes.lockFile(fileLocked1Id);

    folderWithLockedFilesId = (await apis.user.nodes.createFolder(folderWithLockedFiles, sourceId)).entry.id;
    fileLockedInFolderId = (await apis.user.nodes.createFile(fileLockedInFolder, folderWithLockedFilesId)).entry.id;
    await apis.user.nodes.lockFile(fileLockedInFolderId);
    await apis.user.favorites.addFavoriteById('folder', folderWithLockedFilesId);

    file1Id = (await apis.user.nodes.createFile(file1, sourceId)).entry.id;
    file2Id = (await apis.user.nodes.createFile(file2, sourceId)).entry.id;
    file3Id = (await apis.user.nodes.createFile(file3, sourceId)).entry.id;
    file4Id = (await apis.user.nodes.createFile(file4, sourceId)).entry.id;

    await apis.user.shared.shareFileById(file1Id);
    await apis.user.shared.shareFileById(file2Id);
    await apis.user.shared.shareFileById(file3Id);
    await apis.user.shared.shareFileById(file4Id);
    await apis.user.shared.shareFileById(fileLocked1Id);

    await apis.user.favorites.addFavoriteById('file', file1Id);
    await apis.user.favorites.addFavoriteById('file', file2Id);
    await apis.user.favorites.addFavoriteById('file', file3Id);
    await apis.user.favorites.addFavoriteById('file', file4Id);

    await apis.user.favorites.addFavoriteById('file', fileLocked1Id);

    await apis.user.sites.createSite(siteName);
    const docLibId = await apis.user.sites.getDocLibId(siteName);
    await apis.user.nodes.createFolder(folderSitePF, docLibId);
    await apis.user.nodes.createFolder(folderSiteRF, docLibId);
    await apis.user.nodes.createFolder(folderSiteSF, docLibId);
    await apis.user.nodes.createFolder(folderSiteFav, docLibId);
    await apis.user.nodes.createFolder(folderSiteSearch, docLibId);

    await apis.user.shared.waitForApi({ expect: 7 });
    await apis.user.favorites.waitForApi({ expect: 13 });

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

    afterAll(async (done) => {
      await apis.user.nodes.deleteNodeById(destinationIdRF);
      done();
    });

    it('Copy a file - [C280194]', async () => copyFile(file1, source, destinationRF));

    it('Copy multiple items - [C280201]', async () => copyMultipleItems([file2, file3], source, destinationRF));

    it('Copy a file with a name that already exists on the destination - [C280196]', async () => copyFileWithNameThatAlreadyExists(existingFile, source, destinationRF));

    it('Copy items into a library - [C291899]', async () => copyItemsIntoLibrary([file1, file2], source, folderSiteRF));

    it('Copy locked file - [C280198]', async () => copyLockedFile(fileLocked1, source, destinationRF, () => {
      locationId = sourceId;
      destinationId = destinationIdRF;
    }));

    it('Undo copy of files - [C280202]', async () => undoCopyFile(file4, source, destinationRF));

  });

  describe('from Personal Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(source);
      done();
    });

    afterAll(async (done) => {
      await apis.user.nodes.deleteNodeById(destinationIdPF);
      done();
    });

    it('Copy a file - [C217135]', async () => copyFile(file1, '', destinationPF));

    it('Copy a folder with content - [C291888]', async () => copyFolderWithContent(folder1, '', destinationPF));

    it('Copy multiple items - [C291889]', async () => copyMultipleItems([file2, file3], '', destinationPF));

    it('Copy a file with a name that already exists on the destination - [C217137]', async () => copyFileWithNameThatAlreadyExists(existingFile, '', destinationPF));

    it('Copy a folder with a name that already exists on the destination - [C217138]', async () => copyFolderWithNameThatAlreadyExists(existingFolder, '', destinationPF));

    it('Copy items into a library - [C280282]', async () => copyItemsIntoLibrary([file1, folder1], '', folderSitePF));

    it('Copy locked file - [C217139]', async () => copyLockedFile(fileLocked1, '', destinationPF, () => {
      locationId = sourceId;
      destinationId = destinationIdPF;
    }));

    it('Copy folder that contains locked file - [C217140]', async () => copyFolderThatContainsLockedFile(folderWithLockedFiles, '', destinationPF, () => {
      locationId = folderWithLockedFilesId;
      destinationId = destinationIdPF;
    }));

    it('Undo copy of files - [C217171]', async () => undoCopyFile(file4, '', destinationPF));

    it('Undo copy of folders - [C217172]', async () => undoCopyFolder(folder2, '', destinationPF));

    it('Undo copy of a file when a file with same name already exists on the destination - [C217173]', async () => undoCopyFileWithExistingName(fileInFolder, '', folder2, async () => {
      await dataTable.doubleClickOnRowByName(folder1);
      await dataTable.waitForHeader();
    }));

    it('Undo copy of a folder when a folder with same name already exists on the destination - [C217174]', async () => undoCopyFolderWithExistingName(folderExisting, '', destinationPF));

  });

  describe('from Shared Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickSharedFilesAndWait();
      done();
    });

    afterAll(async (done) => {
      await apis.user.nodes.deleteNodeById(destinationIdSF);
      done();
    });

    it('Copy a file - [C280206]', async () => copyFile(file1, source, destinationSF));

    it('Copy multiple items - [C280213]', async () => copyMultipleItems([file2, file3], source, destinationSF));

    it('Copy a file with a name that already exists on the destination - [C280208]', async () => copyFileWithNameThatAlreadyExists(existingFile, source, destinationSF));

    it('Copy items into a library - [C291900]', async () => copyItemsIntoLibrary([file1, file2], source, folderSiteSF));

    it('Copy locked file - [C280210]', async () => copyLockedFile(fileLocked1, source, destinationSF, () => {
      locationId = sourceId;
      destinationId = destinationIdSF;
    }));

    it('Undo copy of files - [C280214]', async () => undoCopyFile(file4, source, destinationSF));

  });

  describe('from Favorites', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickFavoritesAndWait();
      done();
    });

    afterAll(async (done) => {
      await apis.user.nodes.deleteNodeById(destinationIdFav);
      done();
    });

    it('Copy a file - [C280218]', async () => copyFile(file1, source, destinationFav));

    it('Copy a folder with content - [C280219]', async () => copyFolderWithContent(folder1, source, destinationFav));

    it('Copy multiple items - [C280225]', async () => copyMultipleItems([file2, file3], source, destinationFav));

    it('Copy a file with a name that already exists on the destination - [C280220]', async () => copyFileWithNameThatAlreadyExists(existingFile, source, destinationFav));

    it('Copy a folder with a name that already exists on the destination - [C280221]', async () => copyFolderWithNameThatAlreadyExists(existingFolder, source, destinationFav));

    it('Copy items into a library - [C291901]', async () => copyItemsIntoLibrary([file1, folder1], source, folderSiteFav));

    it('Copy locked file - [C280222]', async () => copyLockedFile(fileLocked1, source, destinationFav, () => {
      locationId = sourceId;
      destinationId = destinationIdFav;
    }));

    it('Copy folder that contains locked file - [C280223]', async () => copyFolderThatContainsLockedFile(folderWithLockedFiles, source, destinationFav, () => {
      locationId = folderWithLockedFilesId;
      destinationId = destinationIdFav;
    }));

    it('Undo copy of files - [C280226]', async () => undoCopyFile(file4, source, destinationFav));

    it('Undo copy of folders - [C280227]', async () => undoCopyFolder(folder2, source, destinationFav));

    it('Undo copy of a file when a file with same name already exists on the destination - [C280228]', async () => undoCopyFileWithExistingName(fileInFolder, folder1, folder2));

    it('Undo copy of a folder when a folder with same name already exists on the destination - [C280229]', async () => undoCopyFolderWithExistingName(folderExisting, source, destinationFav));

  });

  describe('from Search Results', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      done();
    });

    afterAll(async (done) => {
      await apis.user.nodes.deleteNodeById(destinationIdSearch);
      done();
    });

    it('Copy a file - [C306932]', async () => copyFile(file1, source, destinationSearch, async () => {
      await searchInput.searchFor(file1);
      await dataTable.waitForBody();
    }));

    it('Copy a folder with content - [C306943]', async () => copyFolderWithContent(folder1, source, destinationSearch, async () => {
      await searchInput.searchFor(folder1);
      await dataTable.waitForBody();
    }));

    it('Copy multiple items - [C306944]', async () => copyMultipleItems([file2, file3], source, destinationSearch, async () => {
      await searchInput.searchFor('file');
      await dataTable.waitForBody();
    }));

    it('Copy a file with a name that already exists on the destination - [C306933]', async () => copyFileWithNameThatAlreadyExists(existingFile, source, destinationSearch, async () => {
      await searchInput.searchFor(existingFile);
      await dataTable.waitForBody();
    }));

    it('Copy a folder with a name that already exists on the destination - [C306934]', async () => copyFolderWithNameThatAlreadyExists(existingFolder, source, destinationSearch, async () => {
      await searchInput.searchFor(existingFolder);
      await dataTable.waitForBody();
    }));

    it('Copy items into a library - [C306942]', async () => copyItemsIntoLibrary([file1, file2], source, folderSiteSearch, async () => {
      await searchInput.searchFor('file');
      await dataTable.waitForBody();
    }));

    it('Copy locked file - [C306935]', async () => copyLockedFile(fileLocked1, source, destinationSearch, async () => {
      locationId = sourceId;
      destinationId = destinationIdSearch;
      await searchInput.searchFor(fileLocked1);
      await dataTable.waitForBody();
    }));

    it('Copy folder that contains locked file - [C306936]', async () => copyFolderThatContainsLockedFile(folderWithLockedFiles, source, destinationSearch, async () => {
      locationId = folderWithLockedFilesId;
      destinationId = destinationIdSearch;
      await searchInput.searchFor(folderWithLockedFiles);
      await dataTable.waitForBody();
    }));

    it('Undo copy of files - [C306938]', async () => undoCopyFile(file4, source, destinationSearch, async () => {
      await searchInput.searchFor(file4);
      await dataTable.waitForBody();
    }));

    it('Undo copy of folders - [C306939]', async () => undoCopyFolder(folder2, source, destinationSearch, async () => {
      await searchInput.searchFor(folder2);
      await dataTable.waitForBody();
    }));

    it('Undo copy of a file when a file with same name already exists on the destination - [C306940]', async () => undoCopyFileWithExistingName(fileInFolder, folder1, folder2, async () => {
      await searchInput.searchFor(fileInFolder);
      await dataTable.waitForBody();
    }));

    it('Undo copy of a folder when a folder with same name already exists on the destination - [C306941]', async () => undoCopyFolderWithExistingName(folderExisting, source, destinationSearch, async () => {
      await searchInput.searchFor(folderExisting);
      await dataTable.waitForBody();
    }));
  });

  async function copyFile(fileName: string, location: string = '', destination: string, doBefore = null) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(fileName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName} not present in ${destination} folder`);
  }

  async function copyFolderWithContent(folderName: string, location: string = '', destination: string, doBefore = null) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(folderName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(folderName)).toBe(true, `${folderName} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(folderName)).toBe(true, `${folderName} not present in ${destination} folder`);
    expect(await dataTable.isItemPresent(fileInFolder)).toBe(false, `${fileInFolder} is present in ${destination}`);

    await dataTable.doubleClickOnRowByName(folderName);
    expect(await dataTable.isItemPresent(fileInFolder)).toBe(true, `${fileInFolder} is not present in ${folderName} folder in ${destination}`);
  }

  async function copyMultipleItems(items: string[], location: string = '', destination: string, doBefore = null) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectMultipleItems(items, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 2 items');
    expect(msg).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(items[0])).toBe(true, `${items[0]} not present in source folder`);
    expect(await dataTable.isItemPresent(items[1])).toBe(true, `${items[1]} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(items[0])).toBe(true, `${items[0]} not present in ${destination} folder`);
    expect(await dataTable.isItemPresent(items[1])).toBe(true, `${items[1]} not present in ${destination} folder`);
  }

  async function copyFileWithNameThatAlreadyExists(fileName: string, location: string = '', destination: string, doBefore = null) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(fileName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName}.txt not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName}.txt not present in ${destination} folder`);
  }

  async function copyFolderWithNameThatAlreadyExists(folderName: string, location: string = '', destination: string, doBefore = null) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(folderName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(folderName)).toBe(true, `${folderName} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(folderName)).toBe(true, `${folderName} not present in ${destination} folder`);
    await dataTable.doubleClickOnRowByName(folderName);
    expect(await dataTable.isItemPresent(file2InFolder)).toBe(true, `${file2InFolder} not present in ${destination} folder in ${folderName}`);
    expect(await dataTable.isItemPresent(file3InFolder)).toBe(true, `${file3InFolder} not present in ${destination} folder in ${folderName}`);
  }

  async function copyItemsIntoLibrary(items: string[], location: string = '', destination: string, doBefore = null) {
    if (doBefore) {
      await doBefore();
    }
    const noOfItems = items.length;
    await dataTable.selectMultipleItems(items, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('File Libraries');
    await copyDialog.doubleClickOnRow(siteName);
    await copyDialog.doubleClickOnRow('documentLibrary');
    await copyDialog.selectDestination(destination);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain(`Copied ${noOfItems} ${ noOfItems === 1 ? 'item' : 'items'}`);
    expect(msg).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    for (const item of items) {
      expect(await dataTable.isItemPresent(item)).toBe(true, `${item} not present in source folder`);
    }

    await page.goToMyLibraries();
    await dataTable.doubleClickOnRowByName(siteName);
    await dataTable.doubleClickOnRowByName(destination);

    for (const item of items) {
      expect(await dataTable.isItemPresent(item)).toBe(true, `${item} not present in ${destination} folder`);
    }
  }

  async function copyLockedFile(fileName: string, location: string = '', destination: string, doBefore = null) {
    if (doBefore) {
      await doBefore();
    }

    await dataTable.selectItem(fileName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName} not present in source folder`);
    expect(await apis.user.nodes.isFileLockedByName(fileName, locationId)).toBe(true, `${fileName} not locked in ${location}`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName} not present in ${destination} folder`);
    expect(await apis.user.nodes.isFileLockedByName(fileName, destinationId)).toBe(false, `${fileName} is locked in ${destination}`);
  }

  async function copyFolderThatContainsLockedFile(folderName: string, location: string = '', destination: string, doBefore = null) {
    if (doBefore) {
      await doBefore();
    }

    await dataTable.selectItem(folderName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(folderName)).toBe(true, `${folderName} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(folderName)).toBe(true, `${folderName} not present in ${destination} folder`);
    expect(await dataTable.isItemPresent(fileLockedInFolder)).toBe(false, `${fileLockedInFolder} is present in ${destination}`);
    expect(await apis.user.nodes.isFileLockedByName(fileLockedInFolder, locationId)).toBe(true, `${fileLockedInFolder} not locked in ${location}`);

    await dataTable.doubleClickOnRowByName(folderName);
    expect(await dataTable.isItemPresent(fileLockedInFolder)).toBe(true, `${fileLockedInFolder} is not present in ${folderName} folder from ${destination}`);
    expect(await apis.user.nodes.isFileLockedByName(fileLockedInFolder, (await apis.user.nodes.getNodeIdFromParent(folderWithLockedFiles, destinationId)))).toBe(false, `${fileLockedInFolder} is locked in ${destination}`);
  }

  async function undoCopyFile(fileName: string, location: string = '', destination: string, doBefore = null) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(fileName, location);
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
    expect(await dataTable.isItemPresent(fileName)).toBe(false, `${fileName} present in ${destination} folder`);

    await page.clickTrash();
    expect(await dataTable.isEmptyList()).toBe(true, 'Trash is not empty');
  }

  async function undoCopyFolder(folderName: string, location: string = '', destination: string, doBefore = null) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(folderName, location);
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
    expect(await dataTable.isItemPresent(folderName)).toBe(false, `${folderName} present in ${destination} folder`);

    await page.clickTrash();
    expect(await dataTable.isEmptyList()).toBe(true, 'Trash is not empty');
  }

  async function undoCopyFileWithExistingName(fileName: string, location: string = '', destination: string, doBefore = null) {
    if (doBefore) {
      await doBefore();
    }

    await dataTable.selectItem(fileName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.doubleClickOnRow(source);
    await copyDialog.selectDestination(destination);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await page.clickSnackBarAction();

    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(source);
    await dataTable.doubleClickOnRowByName(folder2);
    expect(await dataTable.isItemPresent(fileInFolder2)).toBe(true, `${fileInFolder2} not present in ${destination} folder`);
    expect(await dataTable.isItemPresent(`${fileInFolder2}-1`)).toBe(false, `${fileInFolder2}-1 is present in ${destination} folder`);

    await page.clickTrash();
    expect(await dataTable.isEmptyList()).toBe(true, 'Trash is not empty');
  }

  async function undoCopyFolderWithExistingName(folderName: string, location: string = '', destination: string, doBefore = null) {
    if (doBefore) {
      await doBefore();
    }

    await dataTable.selectItem(folderName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.doubleClickOnRow(destination);
    await copyDialog.clickCopy();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await page.clickSnackBarAction();

    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(folderName)).toBe(true, `${folderName} not present in ${destination} folder`);
    await dataTable.doubleClickOnRowByName(folderName);
    expect(await dataTable.isItemPresent(file2InFolderExisting)).toBe(true, `${file2InFolderExisting} not present in ${folderName} in ${destination} folder`);
    expect(await dataTable.isItemPresent(file1InFolderExisting)).toBe(false, `${file1InFolderExisting} present in ${folderName} in ${destination} folder`);

    await page.clickTrash();
    expect(await dataTable.isEmptyList()).toBe(true, 'Trash is not empty');
  }

});
