/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { AdminActions, UserActions, LoginPage, BrowsingPage, ContentNodeSelectorDialog, RepoClient, Utils } from '@alfresco/aca-testing-shared';
import { BrowserActions, Logger } from '@alfresco/adf-testing';

describe('Copy content', () => {
  const random = Utils.random();
  const username = `user-${random}`;
  const source = `source-${random}`;
  let sourceId: string;
  const destinationPF = `destinationPersonal-${random}`;
  let destinationIdPF: string;
  const destinationRF = `destinationRecent-${random}`;
  let destinationIdRF: string;
  const destinationSF = `destinationShared-${random}`;
  let destinationIdSF: string;
  const destinationFav = `destinationFav-${random}`;
  let destinationIdFav: string;
  const destinationSearch = `destinationSearch-${random}`;
  let destinationIdSearch: string;

  const file1 = `copy-file1-${random}.txt`;
  const folder1 = `copy-folder1-${random}`;
  const fileInFolder = `copy-fileInFolder-${random}.txt`;

  const folder2 = `copy-folder2-${random}`;
  const fileInFolder2 = fileInFolder;

  const folderExisting = `copy-folder-existing-${random}`;
  const file1InFolderExisting = `copy-file1InFolderExisting-${random}.txt`;
  const file2InFolderExisting = `copy-file2InFolderExisting-${random}.txt`;

  const file2 = `copy-file2-${random}.txt`;
  const file3 = `copy-file3-${random}.txt`;
  const file4 = `copy-file4-${random}.txt`;
  const fileLocked1 = `copy-file-locked1-${random}.txt`;
  let fileLocked1Id: string;

  const folderWithLockedFiles = `copy-folder-locked1-${random}`;
  let folderWithLockedFilesId: string;
  const fileLockedInFolder = `copy-file-locked-${random}`;
  let fileLockedInFolderId: string;

  const existingFile = `copy-existing-${random}-file.txt`;
  const existingFolder = `copy-existing-${random}-folder`;
  const file2InFolder = `copy-file2InFolder-${random}.txt`;
  const file3InFolder = `copy-file3InFolder-${random}.txt`;
  const siteName = `copy-site-${random}`;
  const folderSitePF = `copy-folderSitePersonal-${random}`;
  const folderSiteRF = `copy-folderSiteRecent-${random}`;
  const folderSiteSF = `copy-folderSiteShared-${random}`;
  const folderSiteFav = `copy-folderSiteFav-${random}`;
  const folderSiteSearch = `copy-folderSiteSearch-${random}`;

  let locationId: string;
  let destinationId: string;

  const apis = new RepoClient(username, username);

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const copyDialog = new ContentNodeSelectorDialog();

  const adminApiActions = new AdminActions();
  const userActions = new UserActions();

  beforeAll(async () => {
    try {
      await adminApiActions.createUser({ username });
      await userActions.login(username, username);

      const initialFavoritesTotalItems = await apis.favorites.getFavoritesTotalItems();

      sourceId = await apis.createFolder(source);
      destinationIdPF = await apis.createFolder(destinationPF);
      destinationIdRF = await apis.createFolder(destinationRF);
      destinationIdSF = await apis.createFolder(destinationSF);
      destinationIdFav = await apis.createFolder(destinationFav);
      destinationIdSearch = await apis.createFolder(destinationSearch);

      const existingFileToCopyId = await apis.createFile(existingFile, sourceId);

      await userActions.shareNodes([existingFileToCopyId]);
      await apis.favorites.addFavoriteById('file', existingFileToCopyId);

      await apis.createFile(existingFile, destinationIdPF);
      await apis.createFile(existingFile, destinationIdRF);
      await apis.createFile(existingFile, destinationIdSF);
      await apis.createFile(existingFile, destinationIdFav);
      await apis.createFile(existingFile, destinationIdSearch);

      const existingFolderToCopyId = await apis.createFolder(existingFolder, sourceId);

      const existingIdPF = await apis.createFolder(existingFolder, destinationIdPF);
      await apis.createFolder(existingFolder, destinationIdRF);
      await apis.createFolder(existingFolder, destinationIdSF);
      const existingIdFav = await apis.createFolder(existingFolder, destinationIdFav);
      const existingIdSearch = await apis.createFolder(existingFolder, destinationIdSearch);
      await apis.createFile(file2InFolder, existingFolderToCopyId);

      await apis.createFile(file3InFolder, existingIdPF);
      await apis.createFile(file3InFolder, existingIdFav);
      await apis.createFile(file3InFolder, existingIdSearch);

      await apis.favorites.addFavoriteById('folder', existingFolderToCopyId);

      const folder1Id = await apis.createFolder(folder1, sourceId);
      const fileInFolderId = await apis.createFile(fileInFolder, folder1Id);
      await apis.favorites.addFavoriteById('folder', folder1Id);
      await apis.favorites.addFavoriteById('file', fileInFolderId);
      await userActions.shareNodes([fileInFolderId]);

      const folderExistingId = await apis.createFolder(folderExisting, sourceId);
      await apis.favorites.addFavoriteById('folder', folderExistingId);
      await apis.createFile(file1InFolderExisting, folderExistingId);

      const folderExistingPFId = await apis.createFolder(folderExisting, destinationIdPF);
      await apis.createFile(file2InFolderExisting, folderExistingPFId);

      const folderExistingFavId = await apis.createFolder(folderExisting, destinationIdFav);
      await apis.createFile(file2InFolderExisting, folderExistingFavId);

      const folderExistingSearchId = await apis.createFolder(folderExisting, destinationIdSearch);
      await apis.createFile(file2InFolderExisting, folderExistingSearchId);

      const folder2Id = await apis.createFolder(folder2, sourceId);
      await apis.createFile(fileInFolder2, folder2Id);
      await apis.favorites.addFavoriteById('folder', folder2Id);

      fileLocked1Id = await apis.createFile(fileLocked1, sourceId);
      await userActions.lockNodes([fileLocked1Id]);

      folderWithLockedFilesId = await apis.createFolder(folderWithLockedFiles, sourceId);
      fileLockedInFolderId = await apis.createFile(fileLockedInFolder, folderWithLockedFilesId);
      await userActions.lockNodes([fileLockedInFolderId]);
      await apis.favorites.addFavoriteById('folder', folderWithLockedFilesId);

      const file1Id = await apis.createFile(file1, sourceId);
      const file2Id = await apis.createFile(file2, sourceId);
      const file3Id = await apis.createFile(file3, sourceId);
      const file4Id = await apis.createFile(file4, sourceId);

      await userActions.shareNodes([file1Id, file2Id, file3Id, file4Id, fileLocked1Id]);

      await apis.favorites.addFavoritesByIds('file', [file1Id, file2Id, file3Id, file4Id, fileLocked1Id]);

      await apis.sites.createSite(siteName);
      const docLibId = await apis.sites.getDocLibId(siteName);
      await apis.createFolder(folderSitePF, docLibId);
      await apis.createFolder(folderSiteRF, docLibId);
      await apis.createFolder(folderSiteSF, docLibId);
      await apis.createFolder(folderSiteFav, docLibId);
      await apis.createFolder(folderSiteSearch, docLibId);

      await apis.shared.waitForFilesToBeShared([existingFileToCopyId, fileInFolderId, file1Id, file2Id, file3Id, file4Id, fileLocked1Id]);
      await apis.favorites.waitForApi({ expect: initialFavoritesTotalItems + 13 });

      await loginPage.loginWith(username);
    } catch (error) {
      Logger.error(`----- beforeAll failed : ${error}`);
    }
  });

  beforeEach(async () => {
    await page.closeOpenDialogs();
  });

  afterAll(async () => {
    try {
      await userActions.login(username, username);
      await userActions.unlockNodes([fileLocked1Id, fileLockedInFolderId]);
      await userActions.deleteNodes([sourceId, destinationIdRF, destinationIdPF, destinationIdSF, destinationIdFav, destinationIdSearch]);
      await userActions.deleteSites([siteName]);
    } catch (error) {
      Logger.error(`---- afterAll failed : ${error}`);
    }
  });

  describe('from Personal Files', () => {
    beforeEach(async () => {
      await Utils.pressEscape();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(source);
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

  async function copyFile(fileName: string, location: string = '', destination: string, doBefore?: () => void) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(fileName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await BrowserActions.click(copyDialog.copyButton);
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    const action = await page.getSnackBarAction();
    expect(action).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName} not present in ${destination} folder`);
  }

  async function copyFolderWithContent(folderName: string, location: string = '', destination: string, doBefore?: () => void) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(folderName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await BrowserActions.click(copyDialog.copyButton);
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    const action = await page.getSnackBarAction();
    expect(action).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(folderName)).toBe(true, `${folderName} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(folderName)).toBe(true, `${folderName} not present in ${destination} folder`);
    expect(await dataTable.isItemPresent(fileInFolder)).toBe(false, `${fileInFolder} is present in ${destination}`);

    await dataTable.doubleClickOnRowByName(folderName);
    expect(await dataTable.isItemPresent(fileInFolder)).toBe(true, `${fileInFolder} is not present in ${folderName} folder in ${destination}`);
  }

  async function copyMultipleItems(items: string[], location: string = '', destination: string, doBefore?: () => void) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectMultipleItems(items, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await BrowserActions.click(copyDialog.copyButton);
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 2 items');
    const action = await page.getSnackBarAction();
    expect(action).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(items[0])).toBe(true, `${items[0]} not present in source folder`);
    expect(await dataTable.isItemPresent(items[1])).toBe(true, `${items[1]} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(items[0])).toBe(true, `${items[0]} not present in ${destination} folder`);
    expect(await dataTable.isItemPresent(items[1])).toBe(true, `${items[1]} not present in ${destination} folder`);
  }

  async function copyFileWithNameThatAlreadyExists(fileName: string, location: string = '', destination: string, doBefore?: () => void) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(fileName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await BrowserActions.click(copyDialog.copyButton);
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    const action = await page.getSnackBarAction();
    expect(action).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName}.txt not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName}.txt not present in ${destination} folder`);
  }

  async function copyFolderWithNameThatAlreadyExists(folderName: string, location: string = '', destination: string, doBefore?: () => void) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(folderName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await BrowserActions.click(copyDialog.copyButton);
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    const action = await page.getSnackBarAction();
    expect(action).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(folderName)).toBe(true, `${folderName} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(folderName)).toBe(true, `${folderName} not present in ${destination} folder`);
    await dataTable.doubleClickOnRowByName(folderName);
    expect(await dataTable.isItemPresent(file2InFolder)).toBe(true, `${file2InFolder} not present in ${destination} folder in ${folderName}`);
    expect(await dataTable.isItemPresent(file3InFolder)).toBe(true, `${file3InFolder} not present in ${destination} folder in ${folderName}`);
  }

  async function copyItemsIntoLibrary(items: string[], location: string = '', destination: string, doBefore?: () => void) {
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
    await BrowserActions.click(copyDialog.copyButton);
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain(`Copied ${noOfItems} ${noOfItems === 1 ? 'item' : 'items'}`);
    const action = await page.getSnackBarAction();
    expect(action).toContain('Undo');

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

  async function copyLockedFile(fileName: string, location: string = '', destination: string, doBefore?: () => void) {
    if (doBefore) {
      await doBefore();
    }

    await dataTable.selectItem(fileName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await BrowserActions.click(copyDialog.copyButton);
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    const action = await page.getSnackBarAction();
    expect(action).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName} not present in source folder`);
    expect(await apis.nodes.isFileLockedByName(fileName, locationId)).toBe(true, `${fileName} not locked in ${location}`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName} not present in ${destination} folder`);
    expect(await apis.nodes.isFileLockedByName(fileName, destinationId)).toBe(false, `${fileName} is locked in ${destination}`);
  }

  async function copyFolderThatContainsLockedFile(folderName: string, location: string = '', destination: string, doBefore?: () => void) {
    if (doBefore) {
      await doBefore();
    }

    await dataTable.selectItem(folderName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await BrowserActions.click(copyDialog.copyButton);
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    const action = await page.getSnackBarAction();
    expect(action).toContain('Undo');

    await copyDialog.waitForDialogToClose();
    expect(await dataTable.isItemPresent(folderName)).toBe(true, `${folderName} not present in source folder`);
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(folderName)).toBe(true, `${folderName} not present in ${destination} folder`);
    expect(await dataTable.isItemPresent(fileLockedInFolder)).toBe(false, `${fileLockedInFolder} is present in ${destination}`);
    expect(await apis.nodes.isFileLockedByName(fileLockedInFolder, locationId)).toBe(true, `${fileLockedInFolder} not locked in ${location}`);

    await dataTable.doubleClickOnRowByName(folderName);
    expect(await dataTable.isItemPresent(fileLockedInFolder)).toBe(
      true,
      `${fileLockedInFolder} is not present in ${folderName} folder from ${destination}`
    );
    expect(await apis.nodes.isFileLockedByName(fileLockedInFolder, await apis.nodes.getNodeIdFromParent(folderWithLockedFiles, destinationId))).toBe(
      false,
      `${fileLockedInFolder} is locked in ${destination}`
    );
  }

  async function undoCopyFile(fileName: string, location: string = '', destination: string, doBefore?: () => void) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(fileName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await BrowserActions.click(copyDialog.copyButton);
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    const action = await page.getSnackBarAction();
    expect(action).toContain('Undo');

    await page.clickSnackBarAction();

    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(fileName)).toBe(false, `${fileName} present in ${destination} folder`);

    await page.clickTrash();
    expect(await dataTable.isEmpty()).toBe(true, 'Trash is not empty');
  }

  async function undoCopyFolder(folderName: string, location: string = '', destination: string, doBefore?: () => void) {
    if (doBefore) {
      await doBefore();
    }
    await dataTable.selectItem(folderName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.selectDestination(destination);
    await BrowserActions.click(copyDialog.copyButton);
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    const action = await page.getSnackBarAction();
    expect(action).toContain('Undo');

    await page.clickSnackBarAction();

    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.isItemPresent(folderName)).toBe(false, `${folderName} present in ${destination} folder`);

    await page.clickTrash();
    expect(await dataTable.isEmpty()).toBe(true, 'Trash is not empty');
  }

  async function undoCopyFileWithExistingName(fileName: string, location: string = '', destination: string, doBefore?: () => void) {
    if (doBefore) {
      await doBefore();
    }

    await dataTable.selectItem(fileName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.dataTable.doubleClickOnRowByName(source);
    await copyDialog.selectDestination(destination);
    await BrowserActions.click(copyDialog.copyButton);
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    const action = await page.getSnackBarAction();
    expect(action).toContain('Undo');

    await page.clickSnackBarAction();

    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(source);
    await dataTable.doubleClickOnRowByName(folder2);
    expect(await dataTable.isItemPresent(fileInFolder2)).toBe(true, `${fileInFolder2} not present in ${destination} folder`);
    expect(await dataTable.isItemPresent(`${fileInFolder2}-1`)).toBe(false, `${fileInFolder2}-1 is present in ${destination} folder`);

    await page.clickTrash();
    expect(await dataTable.isEmpty()).toBe(true, 'Trash is not empty');
  }

  async function undoCopyFolderWithExistingName(folderName: string, location: string = '', destination: string, doBefore?: () => void) {
    if (doBefore) {
      await doBefore();
    }

    await dataTable.selectItem(folderName, location);
    await toolbar.clickMoreActionsCopy();
    await copyDialog.selectLocation('Personal Files');
    await copyDialog.dataTable.doubleClickOnRowByName(destination);
    await BrowserActions.click(copyDialog.copyButton);
    const msg = await page.getSnackBarMessage();
    expect(msg).toContain('Copied 1 item');
    const action = await page.getSnackBarAction();
    expect(action).toContain('Undo');

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
