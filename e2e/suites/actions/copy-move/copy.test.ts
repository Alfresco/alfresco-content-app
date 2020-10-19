/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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

import { BrowsingPage, ContentNodeSelectorDialog, RepoClient, Utils, CoreActions } from '@alfresco/aca-testing-shared';
import { UsersActions, LoginPage, ApiService, UserModel } from '@alfresco/adf-testing';
import { browser } from 'protractor';

describe('Copy content', () => {
  let user: UserModel;

  const source = `source-${Utils.random()}`;
  let sourceId: string;
  const destinationPF = `destinationPersonal-${Utils.random()}`;
  let destinationIdPF: string;
  const destinationRF = `destinationRecent-${Utils.random()}`;
  let destinationIdRF: string;
  const destinationSF = `destinationShared-${Utils.random()}`;
  let destinationIdSF: string;
  const destinationFav = `destinationFav-${Utils.random()}`;
  let destinationIdFav: string;
  const destinationSearch = `destinationSearch-${Utils.random()}`;
  let destinationIdSearch: string;

  const file1 = `copy-file1-${Utils.random()}.txt`;
  let file1Id: string;

  const folder1 = `copy-folder1-${Utils.random()}`;
  let folder1Id: string;
  const fileInFolder = `copy-fileInFolder-${Utils.random()}.txt`;
  let fileInFolderId: string;

  const folder2 = `copy-folder2-${Utils.random()}`;
  let folder2Id: string;
  const fileInFolder2 = fileInFolder;

  const folderExisting = `copy-folder-existing-${Utils.random()}`;
  let folderExistingId: string;
  const file1InFolderExisting = `copy-file1InFolderExisting-${Utils.random()}.txt`;
  const file2InFolderExisting = `copy-file2InFolderExisting-${Utils.random()}.txt`;

  const file2 = `copy-file2-${Utils.random()}.txt`;
  let file2Id: string;
  const file3 = `copy-file3-${Utils.random()}.txt`;
  let file3Id: string;
  const file4 = `copy-file4-${Utils.random()}.txt`;
  let file4Id: string;

  const fileLocked1 = `copy-file-locked1-${Utils.random()}.txt`;
  let fileLocked1Id: string;

  const folderWithLockedFiles = `copy-folder-locked1-${Utils.random()}`;
  let folderWithLockedFilesId: string;
  const fileLockedInFolder = `copy-file-locked-${Utils.random()}`;
  let fileLockedInFolderId: string;

  const existingFile = `copy-existing-${Utils.random()}.txt`;
  let existingFileToCopyId: string;

  const existingFolder = `copy-existing-${Utils.random()}`;
  let existingFolderToCopyId: string;

  let existingIdPF: string;
  let existingIdFav: string;
  let existingIdSearch: string;
  let folderExistingPFId: string;
  let folderExistingFavId: string;
  let folderExistingSearchId: string;

  const file2InFolder = `copy-file2InFolder-${Utils.random()}.txt`;
  const file3InFolder = `copy-file3InFolder-${Utils.random()}.txt`;

  const siteName = `copy-site-${Utils.random()}`;
  const folderSitePF = `copy-folderSitePersonal-${Utils.random()}`;
  const folderSiteRF = `copy-folderSiteRecent-${Utils.random()}`;
  const folderSiteSF = `copy-folderSiteShared-${Utils.random()}`;
  const folderSiteFav = `copy-folderSiteFav-${Utils.random()}`;
  const folderSiteSearch = `copy-folderSiteSearch-${Utils.random()}`;

  let locationId: string;
  let destinationId: string;

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const copyDialog = new ContentNodeSelectorDialog();
  const { searchInput } = page.header;

  const apiService = new ApiService();
  const usersActions = new UsersActions(apiService);
  const repo = new RepoClient(apiService);
  const coreActions = new CoreActions(apiService);

  beforeAll(async () => {
    await apiService.getInstance().login(browser.params.testConfig.users.admin.username, browser.params.testConfig.users.admin.password);
    user = await usersActions.createUser();
    await apiService.getInstance().login(user.email, user.password);

    const initialSharedTotalItems = await repo.shared.getSharedLinksTotalItems();
    const initialFavoritesTotalItems = await repo.favorites.getFavoritesTotalItems();

    sourceId = (await repo.nodes.createFolder(source)).entry.id;
    destinationIdPF = (await repo.nodes.createFolder(destinationPF)).entry.id;
    destinationIdRF = (await repo.nodes.createFolder(destinationRF)).entry.id;
    destinationIdSF = (await repo.nodes.createFolder(destinationSF)).entry.id;
    destinationIdFav = (await repo.nodes.createFolder(destinationFav)).entry.id;
    destinationIdSearch = (await repo.nodes.createFolder(destinationSearch)).entry.id;

    existingFileToCopyId = (await repo.nodes.createFile(existingFile, sourceId)).entry.id;
    await coreActions.shareNodes([existingFileToCopyId]);
    await repo.favorites.addFavoriteById('file', existingFileToCopyId);

    await repo.nodes.createFile(existingFile, destinationIdPF);
    await repo.nodes.createFile(existingFile, destinationIdRF);
    await repo.nodes.createFile(existingFile, destinationIdSF);
    await repo.nodes.createFile(existingFile, destinationIdFav);
    await repo.nodes.createFile(existingFile, destinationIdSearch);

    existingFolderToCopyId = (await repo.nodes.createFolder(existingFolder, sourceId)).entry.id;

    existingIdPF = (await repo.nodes.createFolder(existingFolder, destinationIdPF)).entry.id;
    await repo.nodes.createFolder(existingFolder, destinationIdRF);
    await repo.nodes.createFolder(existingFolder, destinationIdSF);
    existingIdFav = (await repo.nodes.createFolder(existingFolder, destinationIdFav)).entry.id;
    existingIdSearch = (await repo.nodes.createFolder(existingFolder, destinationIdSearch)).entry.id;
    await repo.nodes.createFile(file2InFolder, existingFolderToCopyId);

    await repo.nodes.createFile(file3InFolder, existingIdPF);
    await repo.nodes.createFile(file3InFolder, existingIdFav);
    await repo.nodes.createFile(file3InFolder, existingIdSearch);

    await repo.favorites.addFavoriteById('folder', existingFolderToCopyId);

    folder1Id = (await repo.nodes.createFolder(folder1, sourceId)).entry.id;
    fileInFolderId = (await repo.nodes.createFile(fileInFolder, folder1Id)).entry.id;
    await repo.favorites.addFavoriteById('folder', folder1Id);
    await repo.favorites.addFavoriteById('file', fileInFolderId);
    await coreActions.shareNodes([fileInFolderId]);

    folderExistingId = (await repo.nodes.createFolder(folderExisting, sourceId)).entry.id;
    await repo.favorites.addFavoriteById('folder', folderExistingId);
    await repo.nodes.createFile(file1InFolderExisting, folderExistingId);

    folderExistingPFId = (await repo.nodes.createFolder(folderExisting, destinationIdPF)).entry.id;
    await repo.nodes.createFile(file2InFolderExisting, folderExistingPFId);

    folderExistingFavId = (await repo.nodes.createFolder(folderExisting, destinationIdFav)).entry.id;
    await repo.nodes.createFile(file2InFolderExisting, folderExistingFavId);

    folderExistingSearchId = (await repo.nodes.createFolder(folderExisting, destinationIdSearch)).entry.id;
    await repo.nodes.createFile(file2InFolderExisting, folderExistingSearchId);

    folder2Id = (await repo.nodes.createFolder(folder2, sourceId)).entry.id;
    await repo.nodes.createFile(fileInFolder2, folder2Id);
    await repo.favorites.addFavoriteById('folder', folder2Id);

    fileLocked1Id = (await repo.nodes.createFile(fileLocked1, sourceId)).entry.id;
    await repo.nodes.lockFile(fileLocked1Id);

    folderWithLockedFilesId = (await repo.nodes.createFolder(folderWithLockedFiles, sourceId)).entry.id;
    fileLockedInFolderId = (await repo.nodes.createFile(fileLockedInFolder, folderWithLockedFilesId)).entry.id;
    await repo.nodes.lockFile(fileLockedInFolderId);
    await repo.favorites.addFavoriteById('folder', folderWithLockedFilesId);

    file1Id = (await repo.nodes.createFile(file1, sourceId)).entry.id;
    file2Id = (await repo.nodes.createFile(file2, sourceId)).entry.id;
    file3Id = (await repo.nodes.createFile(file3, sourceId)).entry.id;
    file4Id = (await repo.nodes.createFile(file4, sourceId)).entry.id;

    await coreActions.shareNodes([file1Id, file2Id, file3Id, file4Id, fileLocked1Id]);

    await repo.favorites.addFavoriteById('file', file1Id);
    await repo.favorites.addFavoriteById('file', file2Id);
    await repo.favorites.addFavoriteById('file', file3Id);
    await repo.favorites.addFavoriteById('file', file4Id);

    await repo.favorites.addFavoriteById('file', fileLocked1Id);

    await repo.sites.createSite(siteName);
    const docLibId = await repo.sites.getDocLibId(siteName);
    await repo.nodes.createFolder(folderSitePF, docLibId);
    await repo.nodes.createFolder(folderSiteRF, docLibId);
    await repo.nodes.createFolder(folderSiteSF, docLibId);
    await repo.nodes.createFolder(folderSiteFav, docLibId);
    await repo.nodes.createFolder(folderSiteSearch, docLibId);

    await repo.shared.waitForApi({ expect: initialSharedTotalItems + 7 });
    await repo.favorites.waitForApi({ expect: initialFavoritesTotalItems + 13 });

    await loginPage.login(user.email, user.password);
  });

  afterAll(async () => {
    await repo.nodes.deleteNodeById(sourceId);
    await repo.sites.deleteSite(siteName);
  });

  describe('from Recent Files', () => {
    beforeEach(async () => {
      await Utils.pressEscape();
      await page.clickRecentFilesAndWait();
    });

    afterAll(async () => {
      await repo.nodes.deleteNodeById(destinationIdRF);
    });

    it('[C280194] Copy a file', async () => copyFile(file1, source, destinationRF));

    it('[C280201] Copy multiple items', async () => copyMultipleItems([file2, file3], source, destinationRF));

    it('[C280196] Copy a file with a name that already exists on the destination', async () =>
      copyFileWithNameThatAlreadyExists(existingFile, source, destinationRF));

    it('[C291899] Copy items into a library', async () => copyItemsIntoLibrary([file1, file2], source, folderSiteRF));

    it('[C280198] Copy locked file', async () =>
      copyLockedFile(fileLocked1, source, destinationRF, () => {
        locationId = sourceId;
        destinationId = destinationIdRF;
      }));

    it('[C280202] Undo copy of files', async () => undoCopyFile(file4, source, destinationRF));
  });

  describe('from Personal Files', () => {
    beforeEach(async () => {
      await Utils.pressEscape();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(source);
    });

    afterAll(async () => {
      await repo.nodes.deleteNodeById(destinationIdPF);
    });

    it('[C217135] Copy a file', async () => copyFile(file1, '', destinationPF));

    it('[C291888] Copy a folder with content', async () => copyFolderWithContent(folder1, '', destinationPF));

    it('[C291889] Copy multiple items', async () => copyMultipleItems([file2, file3], '', destinationPF));

    it('[C217137] Copy a file with a name that already exists on the destination', async () =>
      copyFileWithNameThatAlreadyExists(existingFile, '', destinationPF));

    it('[C217138] Copy a folder with a name that already exists on the destination', async () =>
      copyFolderWithNameThatAlreadyExists(existingFolder, '', destinationPF));

    it('[C280282] Copy items into a library', async () => copyItemsIntoLibrary([file1, folder1], '', folderSitePF));

    it('[C217139] Copy locked file', async () =>
      copyLockedFile(fileLocked1, '', destinationPF, () => {
        locationId = sourceId;
        destinationId = destinationIdPF;
      }));

    it('[C217140] Copy folder that contains locked file', async () =>
      copyFolderThatContainsLockedFile(folderWithLockedFiles, '', destinationPF, () => {
        locationId = folderWithLockedFilesId;
        destinationId = destinationIdPF;
      }));

    it('[C217171] Undo copy of files', async () => undoCopyFile(file4, '', destinationPF));

    it('[C217172] Undo copy of folders', async () => undoCopyFolder(folder2, '', destinationPF));

    it('[C217173] Undo copy of a file when a file with same name already exists on the destination', async () =>
      undoCopyFileWithExistingName(fileInFolder, '', folder2, async () => {
        await dataTable.doubleClickOnRowByName(folder1);
        await dataTable.waitForHeader();
      }));

    it('[C217174] Undo copy of a folder when a folder with same name already exists on the destination', async () =>
      undoCopyFolderWithExistingName(folderExisting, '', destinationPF));
  });

  describe('from Shared Files', () => {
    beforeEach(async () => {
      await Utils.pressEscape();
      await page.clickSharedFilesAndWait();
    });

    afterAll(async () => {
      await repo.nodes.deleteNodeById(destinationIdSF);
    });

    it('[C280206] Copy a file', async () => copyFile(file1, source, destinationSF));

    it('[C280213] Copy multiple items', async () => copyMultipleItems([file2, file3], source, destinationSF));

    it('[C280208] Copy a file with a name that already exists on the destination', async () =>
      copyFileWithNameThatAlreadyExists(existingFile, source, destinationSF));

    it('[C291900] Copy items into a library', async () => copyItemsIntoLibrary([file1, file2], source, folderSiteSF));

    it('[C280210] Copy locked file', async () =>
      copyLockedFile(fileLocked1, source, destinationSF, () => {
        locationId = sourceId;
        destinationId = destinationIdSF;
      }));

    it('[C280214] Undo copy of files', async () => undoCopyFile(file4, source, destinationSF));
  });

  describe('from Favorites', () => {
    beforeEach(async () => {
      await Utils.pressEscape();
      await page.clickFavoritesAndWait();
    });

    afterAll(async () => {
      await repo.nodes.deleteNodeById(destinationIdFav);
    });

    it('[C280218] Copy a file', async () => copyFile(file1, source, destinationFav));

    it('[C280219] Copy a folder with content', async () => copyFolderWithContent(folder1, source, destinationFav));

    it('[C280225] Copy multiple items', async () => copyMultipleItems([file2, file3], source, destinationFav));

    it('[C280220] Copy a file with a name that already exists on the destination', async () =>
      copyFileWithNameThatAlreadyExists(existingFile, source, destinationFav));

    it('[C280221] Copy a folder with a name that already exists on the destination', async () =>
      copyFolderWithNameThatAlreadyExists(existingFolder, source, destinationFav));

    it('[C291901] Copy items into a library', async () => copyItemsIntoLibrary([file1, folder1], source, folderSiteFav));

    it('[C280222] Copy locked file', async () =>
      copyLockedFile(fileLocked1, source, destinationFav, () => {
        locationId = sourceId;
        destinationId = destinationIdFav;
      }));

    it('[C280223] Copy folder that contains locked file', async () =>
      copyFolderThatContainsLockedFile(folderWithLockedFiles, source, destinationFav, () => {
        locationId = folderWithLockedFilesId;
        destinationId = destinationIdFav;
      }));

    it('[C280226] Undo copy of files', async () => undoCopyFile(file4, source, destinationFav));

    it('[C280227] Undo copy of folders', async () => undoCopyFolder(folder2, source, destinationFav));

    it('[C280228] Undo copy of a file when a file with same name already exists on the destination', async () =>
      undoCopyFileWithExistingName(fileInFolder, folder1, folder2));

    it('[C280229] Undo copy of a folder when a folder with same name already exists on the destination', async () =>
      undoCopyFolderWithExistingName(folderExisting, source, destinationFav));
  });

  describe('from Search Results', () => {
    beforeEach(async () => {
      await Utils.pressEscape();
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
    });

    afterAll(async () => {
      await repo.nodes.deleteNodeById(destinationIdSearch);
    });

    it('[C306932] Copy a file', async () =>
      copyFile(file1, source, destinationSearch, async () => {
        await searchInput.searchFor(file1);
        await dataTable.waitForBody();
      }));

    it('[C306943] Copy a folder with content', async () =>
      copyFolderWithContent(folder1, source, destinationSearch, async () => {
        await searchInput.searchFor(folder1);
        await dataTable.waitForBody();
      }));

    it('[C306944] Copy multiple items', async () =>
      copyMultipleItems([file2, file3], source, destinationSearch, async () => {
        await searchInput.searchFor('copy-file');
        await dataTable.waitForBody();
      }));

    it('[C306933] Copy a file with a name that already exists on the destination', async () =>
      copyFileWithNameThatAlreadyExists(existingFile, source, destinationSearch, async () => {
        await searchInput.searchFor(existingFile);
        await dataTable.waitForBody();
      }));

    it('[C306934] Copy a folder with a name that already exists on the destination', async () =>
      copyFolderWithNameThatAlreadyExists(existingFolder, source, destinationSearch, async () => {
        await searchInput.searchFor(existingFolder);
        await dataTable.waitForBody();
      }));

    it('[C306942] Copy items into a library', async () =>
      copyItemsIntoLibrary([file1, file2], source, folderSiteSearch, async () => {
        await searchInput.searchFor('copy-file');
        await dataTable.waitForBody();
      }));

    it('[C306935] Copy locked file', async () =>
      copyLockedFile(fileLocked1, source, destinationSearch, async () => {
        locationId = sourceId;
        destinationId = destinationIdSearch;
        await searchInput.searchFor(fileLocked1);
        await dataTable.waitForBody();
      }));

    it('[C306936] Copy folder that contains locked file', async () =>
      copyFolderThatContainsLockedFile(folderWithLockedFiles, source, destinationSearch, async () => {
        locationId = folderWithLockedFilesId;
        destinationId = destinationIdSearch;
        await searchInput.searchFor(folderWithLockedFiles);
        await dataTable.waitForBody();
      }));

    it('[C306938] Undo copy of files', async () =>
      undoCopyFile(file4, source, destinationSearch, async () => {
        await searchInput.searchFor(file4);
        await dataTable.waitForBody();
      }));

    it('[C306939] Undo copy of folders', async () =>
      undoCopyFolder(folder2, source, destinationSearch, async () => {
        await searchInput.searchFor(folder2);
        await dataTable.waitForBody();
      }));

    it('[C306940] Undo copy of a file when a file with same name already exists on the destination', async () =>
      undoCopyFileWithExistingName(fileInFolder, folder1, folder2, async () => {
        await searchInput.searchFor(fileInFolder);
        await dataTable.waitForBody();
      }));

    it('[C306941] Undo copy of a folder when a folder with same name already exists on the destination', async () =>
      undoCopyFolderWithExistingName(folderExisting, source, destinationSearch, async () => {
        await searchInput.searchFor(folderExisting);
        await dataTable.waitForBody();
      }));
  });

  async function copyFile(fileName: string, location: string = '', destination: string, doBefore?: Function) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(fileName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.copyButton.click();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName} not present in ${destination} folder`);
  }

  async function copyFolderWithContent(folderName: string, location: string = '', destination: string, doBefore?: Function) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(folderName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.copyButton.click();
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

  async function copyMultipleItems(items: string[], location: string = '', destination: string, doBefore?: Function) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectMultipleItems(items, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.copyButton.click();
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

  async function copyFileWithNameThatAlreadyExists(fileName: string, location: string = '', destination: string, doBefore?: Function) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(fileName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.copyButton.click();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName}.txt not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName}.txt not present in ${destination} folder`);
  }

  async function copyFolderWithNameThatAlreadyExists(folderName: string, location: string = '', destination: string, doBefore?: Function) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(folderName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.copyButton.click();
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

  async function copyItemsIntoLibrary(items: string[], location: string = '', destination: string, doBefore?: Function) {
    if (doBefore) {
      await doBefore();
    }
    const noOfItems = items.length;
    await dataTable.selectMultipleItems(items, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('My Libraries');
    await copyDialog.dataTable.doubleClickOnRowByName(siteName);
    await copyDialog.dataTable.doubleClickOnRowByName('documentLibrary');
    await copyDialog.selectDestination(destination);
    await copyDialog.copyButton.click();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain(`Copied ${noOfItems} ${noOfItems === 1 ? 'item' : 'items'}`);
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

  async function copyLockedFile(fileName: string, location: string = '', destination: string, doBefore?: Function) {
    if (doBefore) {
      await doBefore();
    }

    await dataTable.selectItem(fileName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.copyButton.click();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName} not present in source folder`);
    expect(await repo.nodes.isFileLockedByName(fileName, locationId)).toBe(true, `${fileName} not locked in ${location}`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName} not present in ${destination} folder`);
    expect(await repo.nodes.isFileLockedByName(fileName, destinationId)).toBe(false, `${fileName} is locked in ${destination}`);
  }

  async function copyFolderThatContainsLockedFile(folderName: string, location: string = '', destination: string, doBefore?: Function) {
    if (doBefore) {
      await doBefore();
    }

    await dataTable.selectItem(folderName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.copyButton.click();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(folderName)).toBe(true, `${folderName} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(folderName)).toBe(true, `${folderName} not present in ${destination} folder`);
    expect(await dataTable.isItemPresent(fileLockedInFolder)).toBe(false, `${fileLockedInFolder} is present in ${destination}`);
    expect(await repo.nodes.isFileLockedByName(fileLockedInFolder, locationId)).toBe(true, `${fileLockedInFolder} not locked in ${location}`);

    await dataTable.doubleClickOnRowByName(folderName);
    expect(await dataTable.isItemPresent(fileLockedInFolder)).toBe(
      true,
      `${fileLockedInFolder} is not present in ${folderName} folder from ${destination}`
    );
    expect(await repo.nodes.isFileLockedByName(fileLockedInFolder, await repo.nodes.getNodeIdFromParent(folderWithLockedFiles, destinationId))).toBe(
      false,
      `${fileLockedInFolder} is locked in ${destination}`
    );
  }

  async function undoCopyFile(fileName: string, location: string = '', destination: string, doBefore?: Function) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(fileName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.copyButton.click();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await page.clickSnackBarAction();

    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(fileName)).toBe(false, `${fileName} present in ${destination} folder`);

    await page.clickTrash();
    expect(await dataTable.isEmpty()).toBe(true, 'Trash is not empty');
  }

  async function undoCopyFolder(folderName: string, location: string = '', destination: string, doBefore?: Function) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(folderName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await copyDialog.copyButton.click();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await page.clickSnackBarAction();

    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(folderName)).toBe(false, `${folderName} present in ${destination} folder`);

    await page.clickTrash();
    expect(await dataTable.isEmpty()).toBe(true, 'Trash is not empty');
  }

  async function undoCopyFileWithExistingName(fileName: string, location: string = '', destination: string, doBefore?: Function) {
    if (doBefore) {
      await doBefore();
    }

    await dataTable.selectItem(fileName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.dataTable.doubleClickOnRowByName(source);
    await copyDialog.selectDestination(destination);
    await copyDialog.copyButton.click();
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
    expect(await dataTable.isEmpty()).toBe(true, 'Trash is not empty');
  }

  async function undoCopyFolderWithExistingName(folderName: string, location: string = '', destination: string, doBefore?: Function) {
    if (doBefore) {
      await doBefore();
    }

    await dataTable.selectItem(folderName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.dataTable.doubleClickOnRowByName(destination);
    await copyDialog.copyButton.click();
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    expect(msg).toContain('Undo');

    await page.clickSnackBarAction();

    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(folderName)).toBe(true, `${folderName} not present in ${destination} folder`);
    await dataTable.doubleClickOnRowByName(folderName);
    expect(await dataTable.isItemPresent(file2InFolderExisting)).toBe(
      true,
      `${file2InFolderExisting} not present in ${folderName} in ${destination} folder`
    );
    expect(await dataTable.isItemPresent(file1InFolderExisting)).toBe(
      false,
      `${file1InFolderExisting} present in ${folderName} in ${destination} folder`
    );

    await page.clickTrash();
    expect(await dataTable.isEmpty()).toBe(true, 'Trash is not empty');
  }
});
