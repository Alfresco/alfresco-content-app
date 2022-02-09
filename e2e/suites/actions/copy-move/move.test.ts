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

import { AdminActions, UserActions, LoginPage, BrowsingPage, ContentNodeSelectorDialog, RepoClient, Utils } from '@alfresco/aca-testing-shared';
import { BrowserActions } from '@alfresco/adf-testing';

describe('Move content', () => {
  const username = `user-${Utils.random()}`;

  const sourcePF = `sourcePersonal-${Utils.random()}`;
  let sourceIdPF: string;
  const destinationPF = `destinationPersonal-${Utils.random()}`;
  let destinationIdPF: string;

  const sourceRF = `sourceRecent-${Utils.random()}`;
  let sourceIdRF: string;
  const destinationRF = `destinationRecent-${Utils.random()}`;
  let destinationIdRF: string;

  const sourceSF = `sourceShared-${Utils.random()}`;
  let sourceIdSF: string;
  const destinationSF = `destinationShared-${Utils.random()}`;
  let destinationIdSF: string;

  const sourceFav = `sourceFavorites-${Utils.random()}`;
  let sourceIdFav: string;
  const destinationFav = `destinationFavorites-${Utils.random()}`;
  let destinationIdFav: string;

  const siteName = `site-${Utils.random()}`;
  const folderSitePF = `folderSitePersonal-${Utils.random()}`;
  const folderSiteRF = `folderSiteRecent-${Utils.random()}`;
  const folderSiteSF = `folderSiteShared-${Utils.random()}`;
  const folderSiteFav = `folderSiteFavorites-${Utils.random()}`;

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const moveDialog = new ContentNodeSelectorDialog();

  const adminApiActions = new AdminActions();
  const userActions = new UserActions();

  beforeAll(async (done) => {
    await adminApiActions.createUser({ username });

    await apis.user.sites.createSite(siteName);
    const docLibId = await apis.user.sites.getDocLibId(siteName);
    await apis.user.nodes.createFolder(folderSitePF, docLibId);
    await apis.user.nodes.createFolder(folderSiteRF, docLibId);
    await apis.user.nodes.createFolder(folderSiteSF, docLibId);
    await apis.user.nodes.createFolder(folderSiteFav, docLibId);

    sourceIdPF = (await apis.user.nodes.createFolder(sourcePF)).entry.id;
    destinationIdPF = (await apis.user.nodes.createFolder(destinationPF)).entry.id;

    sourceIdRF = (await apis.user.nodes.createFolder(sourceRF)).entry.id;
    destinationIdRF = (await apis.user.nodes.createFolder(destinationRF)).entry.id;

    sourceIdSF = (await apis.user.nodes.createFolder(sourceSF)).entry.id;
    destinationIdSF = (await apis.user.nodes.createFolder(destinationSF)).entry.id;

    sourceIdFav = (await apis.user.nodes.createFolder(sourceFav)).entry.id;
    destinationIdFav = (await apis.user.nodes.createFolder(destinationFav)).entry.id;

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(sourceIdPF);
    await apis.user.nodes.deleteNodeById(sourceIdRF);
    await apis.user.nodes.deleteNodeById(sourceIdSF);
    await apis.user.nodes.deleteNodeById(sourceIdFav);
    await apis.user.nodes.deleteNodeById(destinationIdPF);
    await apis.user.nodes.deleteNodeById(destinationIdRF);
    await apis.user.nodes.deleteNodeById(destinationIdSF);
    await apis.user.nodes.deleteNodeById(destinationIdFav);
    await apis.user.sites.deleteSite(siteName);
    done();
  });

  describe('from Personal Files', () => {
    const file1 = `file1-${Utils.random()}.txt`;

    const folder1 = `folder1-${Utils.random()}`;
    let folder1Id;
    const fileInFolder = `fileInFolder-${Utils.random()}.txt`;

    const file2 = `file2-${Utils.random()}.txt`;
    const file3 = `file3-${Utils.random()}.txt`;

    const file4 = `file4-${Utils.random()}.txt`;
    const folder2 = `folder2-${Utils.random()}`;
    let folder2Id;
    const fileInFolder2 = `fileInFolder2-${Utils.random()}.txt`;

    const existingFile = `existing-${Utils.random()}`;

    const existingFolder = `existing-${Utils.random()}`;
    let existingId1;
    let existingId2;

    const file2InFolder = `file2InFolder-${Utils.random()}.txt`;
    const file3InFolder = `file3InFolder-${Utils.random()}.txt`;

    beforeAll(async (done) => {
      await apis.user.nodes.createFile(file1, sourceIdPF);

      folder1Id = (await apis.user.nodes.createFolder(folder1, sourceIdPF)).entry.id;
      await apis.user.nodes.createFile(fileInFolder, folder1Id);

      await apis.user.nodes.createFile(file2, sourceIdPF);
      await apis.user.nodes.createFile(file3, sourceIdPF);

      await apis.user.nodes.createFile(`${existingFile}.txt`, sourceIdPF);
      await apis.user.nodes.createFile(`${existingFile}.txt`, destinationIdPF);

      existingId1 = (await apis.user.nodes.createFolder(existingFolder, sourceIdPF)).entry.id;
      existingId2 = (await apis.user.nodes.createFolder(existingFolder, destinationIdPF)).entry.id;
      await apis.user.nodes.createFile(file2InFolder, existingId1);
      await apis.user.nodes.createFile(file3InFolder, existingId2);

      await apis.user.nodes.createFile(file4, sourceIdPF);
      folder2Id = (await apis.user.nodes.createFolder(folder2, sourceIdPF)).entry.id;
      await apis.user.nodes.createFile(fileInFolder2, folder2Id);

      done();
    });

    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(sourcePF);
      done();
    });

    it('[C217316] Move a file', async () => {
      await dataTable.selectItem(file1);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('Personal Files');
      await moveDialog.selectDestination(destinationPF);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Moved 1 item');
      expect(msg).toContain('Undo');

      await moveDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(file1)).toBe(false, `${file1} still present in source folder`);

      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationPF);
      expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in destination folder`);
    });

    it('[C217317] Move a folder with content', async () => {
      await dataTable.selectItem(folder1);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('Personal Files');
      await moveDialog.selectDestination(destinationPF);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Moved 1 item');
      expect(msg).toContain('Undo');

      await moveDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(folder1)).toBe(false, `${folder1} still present in source folder`);

      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationPF);
      expect(await dataTable.isItemPresent(folder1)).toBe(true, `${folder1} not present in destination folder`);
      expect(await dataTable.isItemPresent(fileInFolder)).toBe(false, `${fileInFolder} is present in destination folder`);

      await dataTable.doubleClickOnRowByName(folder1);
      expect(await dataTable.isItemPresent(fileInFolder)).toBe(true, `${fileInFolder} is not present in parent folder`);
    });

    it('[C291958] Move multiple items', async () => {
      await dataTable.selectMultipleItems([file2, file3]);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('Personal Files');
      await moveDialog.selectDestination(destinationPF);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Moved 2 items');
      expect(msg).toContain('Undo');

      await moveDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(file2)).toBe(false, `${file2} still present in source folder`);
      expect(await dataTable.isItemPresent(file3)).toBe(false, `${file3} still present in source folder`);

      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationPF);
      expect(await dataTable.isItemPresent(file2)).toBe(true, `${file2} not present in destination folder`);
      expect(await dataTable.isItemPresent(file3)).toBe(true, `${file3} not present in destination folder`);
    });

    it('[C217318] Move a file with a name that already exists on the destination', async () => {
      await dataTable.selectItem(existingFile);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('Personal Files');
      await moveDialog.selectDestination(destinationPF);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Move unsuccessful, a file with the same name already exists');
      expect(msg).not.toContain('Undo');

      await moveDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(`${existingFile}.txt`)).toBe(true, `${existingFile}.txt not present in source folder`);

      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationPF);
      expect(await dataTable.isItemPresent(`${existingFile}.txt`)).toBe(true, `${existingFile}.txt not present in destination folder`);
      expect(await dataTable.isItemPresent(`${existingFile}-1.txt`)).toBe(false, `${existingFile}-1.txt is present in destination folder`);
    });

    it('[C217319] Move a folder with a name that already exists on the destination', async () => {
      await dataTable.selectItem(existingFolder);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('Personal Files');
      await moveDialog.selectDestination(destinationPF);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Moved 1 item');
      expect(msg).toContain('Undo');

      await moveDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(existingFolder)).toBe(false, `${existingFolder} still present in source folder`);

      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationPF);
      expect(await dataTable.isItemPresent(existingFolder)).toBe(true, `${existingFolder} not present in destination folder`);

      await dataTable.doubleClickOnRowByName(existingFolder);
      await dataTable.waitForBody();
      expect(await dataTable.isItemPresent(file2InFolder)).toBe(true, `${file2InFolder} not present in destination folder`);
      expect(await dataTable.isItemPresent(file3InFolder)).toBe(true, `${file3InFolder} not present in destination folder`);
    });

    it('[C291969] Move items into a library', async () => {
      await dataTable.selectMultipleItems([file4, folder2]);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('My Libraries');
      await moveDialog.dataTable.doubleClickOnRowByName(siteName);
      await moveDialog.dataTable.doubleClickOnRowByName('documentLibrary');
      await moveDialog.selectDestination(folderSitePF);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Moved 2 items');
      expect(msg).toContain('Undo');

      await moveDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(file4)).toBe(false, `${file4} still present in source folder`);
      expect(await dataTable.isItemPresent(folder2)).toBe(false, `${folder2} still present in source folder`);

      await page.goToMyLibraries();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.doubleClickOnRowByName(folderSitePF);

      expect(await dataTable.isItemPresent(file4)).toBe(true, `${file4} not present in destination folder`);
      expect(await dataTable.isItemPresent(folder2)).toBe(true, `${folder2} not present in destination folder`);
      await dataTable.doubleClickOnRowByName(folder2);
      expect(await dataTable.isItemPresent(fileInFolder2)).toBe(true, `${fileInFolder2} not present in parent folder`);
    });
  });

  describe('from Recent Files', () => {
    const file1 = `file1-${Utils.random()}.txt`;

    const file2 = `file2-${Utils.random()}.txt`;
    const file3 = `file3-${Utils.random()}.txt`;

    const file4 = `file4-${Utils.random()}.txt`;

    const existingFile = `existing-${Utils.random()}`;

    beforeAll(async (done) => {
      await apis.user.nodes.createFile(file1, sourceIdRF);
      await apis.user.nodes.createFile(file2, sourceIdRF);
      await apis.user.nodes.createFile(file3, sourceIdRF);
      await apis.user.nodes.createFile(`${existingFile}.txt`, sourceIdRF);
      await apis.user.nodes.createFile(`${existingFile}.txt`, destinationIdRF);
      await apis.user.nodes.createFile(file4, sourceIdRF);

      await apis.user.search.waitForApi(username, { expect: 16 });
      done();
    });

    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickRecentFilesAndWait();
      done();
    });

    it('[C280230] Move a file', async () => {
      await dataTable.selectItem(file1, sourceRF);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('Personal Files');
      await moveDialog.selectDestination(destinationRF);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Moved 1 item');
      expect(msg).toContain('Undo');

      await moveDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(file1, destinationRF)).toBe(true, `${file1} from ${destinationRF} not present`);
      expect(await dataTable.isItemPresent(file1, sourceRF)).toBe(false, `${file1} from ${sourceRF} is present`);

      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationRF);
      expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in destination folder`);
    });

    it('[C280237] Move multiple items', async () => {
      await dataTable.selectMultipleItems([file2, file3], sourceRF);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('Personal Files');
      await moveDialog.selectDestination(destinationRF);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Moved 2 items');
      expect(msg).toContain('Undo');

      await moveDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(file2, destinationRF)).toBe(true, `${file2} from ${destinationRF} not present`);
      expect(await dataTable.isItemPresent(file3, destinationRF)).toBe(true, `${file3} from ${destinationRF} not present`);
      expect(await dataTable.isItemPresent(file2, sourceRF)).toBe(false, `${file2} from ${sourceRF} is present`);
      expect(await dataTable.isItemPresent(file3, sourceRF)).toBe(false, `${file3} from ${sourceRF} is present`);

      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationRF);
      expect(await dataTable.isItemPresent(file2)).toBe(true, `${file2} not present in destination folder`);
      expect(await dataTable.isItemPresent(file3)).toBe(true, `${file3} not present in destination folder`);
    });

    it('[C291970] Move a file with a name that already exists on the destination', async () => {
      await dataTable.selectItem(existingFile, sourceRF);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('Personal Files');
      await moveDialog.selectDestination(destinationRF);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Move unsuccessful, a file with the same name already exists');
      expect(msg).not.toContain('Undo');

      await moveDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(existingFile, sourceRF)).toBe(true, `${existingFile} from ${sourceRF} not present`);
      expect(await dataTable.isItemPresent(existingFile, destinationRF)).toBe(true, `${existingFile} from ${destinationRF} not present`);

      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationRF);
      expect(await dataTable.isItemPresent(`${existingFile}.txt`)).toBe(true, `${existingFile}.txt not present in destination folder`);
      expect(await dataTable.isItemPresent(`${existingFile}-1.txt`)).toBe(false, `${existingFile}-1.txt is present in destination folder`);
    });

    it('[C291971] Move items into a library', async () => {
      await dataTable.selectItem(file4, sourceRF);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('My Libraries');
      await moveDialog.dataTable.doubleClickOnRowByName(siteName);
      await moveDialog.dataTable.doubleClickOnRowByName('documentLibrary');
      await moveDialog.selectDestination(folderSiteRF);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Moved 1 item');
      expect(msg).toContain('Undo');

      await moveDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(file4, folderSiteRF)).toBe(true, `${file4} from ${folderSiteRF} not present`);
      expect(await dataTable.isItemPresent(file4, sourceRF)).toBe(false, `${file4} from ${sourceRF} is present`);

      await page.goToMyLibraries();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.doubleClickOnRowByName(folderSiteRF);

      expect(await dataTable.isItemPresent(file4)).toBe(true, `${file4} not present in destination folder`);
    });
  });

  describe('from Shared Files', () => {
    const file1 = `file1-${Utils.random()}.txt`;
    let file1Id;

    const file2 = `file2-${Utils.random()}.txt`;
    let file2Id;
    const file3 = `file3-${Utils.random()}.txt`;
    let file3Id;

    const file4 = `file4-${Utils.random()}.txt`;
    let file4Id;

    const existingFile = `existing-${Utils.random()}`;
    let existingFileId;

    beforeAll(async (done) => {
      file1Id = (await apis.user.nodes.createFile(file1, sourceIdSF)).entry.id;

      await userActions.login(username, username);
      await userActions.shareNodes([file1Id]);

      file2Id = (await apis.user.nodes.createFile(file2, sourceIdSF)).entry.id;
      file3Id = (await apis.user.nodes.createFile(file3, sourceIdSF)).entry.id;
      await userActions.shareNodes([file2Id, file3Id]);

      existingFileId = (await apis.user.nodes.createFile(`${existingFile}.txt`, sourceIdSF)).entry.id;
      await userActions.shareNodes([existingFileId]);
      await apis.user.nodes.createFile(`${existingFile}.txt`, destinationIdSF);

      file4Id = (await apis.user.nodes.createFile(file4, sourceIdSF)).entry.id;
      await userActions.shareNodes([file4Id]);
      await apis.user.shared.waitForFilesToBeShared([file1Id, file2Id, file3Id, existingFileId, file4Id]);

      done();
    });

    beforeEach(async () => {
      await Utils.pressEscape();
      await page.clickSharedFilesAndWait();
    });

    it('[C280243] Move a file', async () => {
      await dataTable.selectItem(file1, sourceSF);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('Personal Files');
      await moveDialog.selectDestination(destinationSF);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Moved 1 item');
      expect(msg).toContain('Undo');

      await moveDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(file1, destinationSF)).toBe(true, `${file1} from ${destinationSF} not present`);
      expect(await dataTable.isItemPresent(file1, sourceSF)).toBe(false, `${file1} from ${sourceSF} is present`);

      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationSF);
      expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in destination folder`);
    });

    it('[C280250] Move multiple items', async () => {
      await dataTable.selectMultipleItems([file2, file3], sourceSF);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('Personal Files');
      await moveDialog.selectDestination(destinationSF);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Moved 2 items');
      expect(msg).toContain('Undo');

      await moveDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(file2, destinationSF)).toBe(true, `${file2} from ${destinationSF} not present`);
      expect(await dataTable.isItemPresent(file3, destinationSF)).toBe(true, `${file3} from ${destinationSF} not present`);
      expect(await dataTable.isItemPresent(file2, sourceSF)).toBe(false, `${file2} from ${sourceSF} is present`);
      expect(await dataTable.isItemPresent(file3, sourceSF)).toBe(false, `${file3} from ${sourceSF} is present`);

      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationSF);
      expect(await dataTable.isItemPresent(file2)).toBe(true, `${file2} not present in destination folder`);
      expect(await dataTable.isItemPresent(file3)).toBe(true, `${file3} not present in destination folder`);
    });

    it('[C291977] Move a file with a name that already exists on the destination', async () => {
      await dataTable.selectItem(existingFile, sourceSF);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('Personal Files');
      await moveDialog.selectDestination(destinationSF);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Move unsuccessful, a file with the same name already exists');
      expect(msg).not.toContain('Undo');

      await moveDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(existingFile, sourceSF)).toBe(true, `${existingFile} from ${sourceSF} not present`);
      expect(await dataTable.isItemPresent(existingFile, destinationSF)).toBe(false, `${existingFile} from ${destinationSF} is present`);

      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationSF);
      expect(await dataTable.isItemPresent(`${existingFile}.txt`)).toBe(true, `${existingFile}.txt not present in destination folder`);
      expect(await dataTable.isItemPresent(`${existingFile}-1.txt`)).toBe(false, `${existingFile}-1.txt not present in destination folder`);
    });

    it('[C291978] Move items into a library', async () => {
      await dataTable.selectItem(file4, sourceSF);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('My Libraries');
      await moveDialog.dataTable.doubleClickOnRowByName(siteName);
      await moveDialog.dataTable.doubleClickOnRowByName('documentLibrary');
      await moveDialog.selectDestination(folderSiteSF);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Moved 1 item');
      expect(msg).toContain('Undo');

      await moveDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(file4, folderSiteSF)).toBe(true, `${file4} from ${folderSiteSF} not present`);
      expect(await dataTable.isItemPresent(file4, sourceSF)).toBe(false, `${file4} from ${sourceSF} is present`);

      await page.goToMyLibraries();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.doubleClickOnRowByName(folderSiteSF);

      expect(await dataTable.isItemPresent(file4)).toBe(true, `${file4} not present in destination folder`);
    });
  });

  describe('from Favorites', () => {
    const file1 = `file1-${Utils.random()}.txt`;
    let file1Id;

    const folder1 = `folder1-${Utils.random()}`;
    let folder1Id;
    const fileInFolder = `fileInFolder-${Utils.random()}.txt`;

    const file2 = `file2-${Utils.random()}.txt`;
    let file2Id;
    const file3 = `file3-${Utils.random()}.txt`;
    let file3Id;

    const file4 = `file4-${Utils.random()}.txt`;
    let file4Id;
    const folder2 = `folder2-${Utils.random()}`;
    let folder2Id;
    const fileInFolder2 = `fileInFolder2-${Utils.random()}.txt`;

    const existingFile = `existing-${Utils.random()}`;
    let existingFileId;

    const existingFolder = `existing-${Utils.random()}`;
    let existingId1;
    let existingId2;
    const file2InFolder = `file2InFolder-${Utils.random()}.txt`;
    const file3InFolder = `file3InFolder-${Utils.random()}.txt`;

    beforeAll(async (done) => {
      file1Id = (await apis.user.nodes.createFile(file1, sourceIdFav)).entry.id;
      await apis.user.favorites.addFavoriteById('file', file1Id);

      folder1Id = (await apis.user.nodes.createFolder(folder1, sourceIdFav)).entry.id;
      await apis.user.nodes.createFile(fileInFolder, folder1Id);
      await apis.user.favorites.addFavoriteById('folder', folder1Id);

      file2Id = (await apis.user.nodes.createFile(file2, sourceIdFav)).entry.id;
      file3Id = (await apis.user.nodes.createFile(file3, sourceIdFav)).entry.id;
      await apis.user.favorites.addFavoriteById('file', file2Id);
      await apis.user.favorites.addFavoriteById('file', file3Id);

      existingFileId = (await apis.user.nodes.createFile(`${existingFile}.txt`, sourceIdFav)).entry.id;
      await apis.user.favorites.addFavoriteById('file', existingFileId);
      await apis.user.nodes.createFile(`${existingFile}.txt`, destinationIdFav);

      existingId1 = (await apis.user.nodes.createFolder(existingFolder, sourceIdFav)).entry.id;
      existingId2 = (await apis.user.nodes.createFolder(existingFolder, destinationIdFav)).entry.id;
      await apis.user.nodes.createFile(file2InFolder, existingId1);
      await apis.user.nodes.createFile(file3InFolder, existingId2);
      await apis.user.favorites.addFavoriteById('folder', existingId1);

      file4Id = (await apis.user.nodes.createFile(file4, sourceIdFav)).entry.id;
      folder2Id = (await apis.user.nodes.createFolder(folder2, sourceIdFav)).entry.id;
      await apis.user.nodes.createFile(fileInFolder2, folder2Id);
      await apis.user.favorites.addFavoriteById('file', file4Id);
      await apis.user.favorites.addFavoriteById('folder', folder2Id);

      await apis.user.favorites.waitForApi({ expect: 9 });

      done();
    });

    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickFavoritesAndWait();
      done();
    });

    it('[C280256] Move a file', async () => {
      await dataTable.selectItem(file1);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('Personal Files');
      await moveDialog.selectDestination(destinationFav);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Moved 1 item');
      expect(msg).toContain('Undo');

      await moveDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(file1, destinationFav)).toBe(true, `${file1} from ${destinationFav} not present`);
      expect(await dataTable.isItemPresent(file1, sourceFav)).toBe(false, `${file1} from ${sourceFav} is present`);

      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationFav);
      expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} not present in destination folder`);
    });

    it('[C280257] Move a folder with content', async () => {
      await dataTable.selectItem(folder1);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('Personal Files');
      await moveDialog.selectDestination(destinationFav);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Moved 1 item');
      expect(msg).toContain('Undo');

      await moveDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(folder1, sourceFav)).toBe(false, `${folder1} from ${sourceFav} is present`);
      expect(await dataTable.isItemPresent(folder1, destinationFav)).toBe(true, `${folder1} from ${destinationFav} not present`);

      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationFav);
      expect(await dataTable.isItemPresent(folder1)).toBe(true, `${folder1} not present in destination folder`);
      expect(await dataTable.isItemPresent(fileInFolder)).toBe(false, `${fileInFolder} is present in destination`);

      await dataTable.doubleClickOnRowByName(folder1);
      expect(await dataTable.isItemPresent(fileInFolder)).toBe(true, `${fileInFolder} is not present in parent folder`);
    });

    it('[C280258] Move multiple items', async () => {
      await dataTable.selectMultipleItems([file2, file3]);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('Personal Files');
      await moveDialog.selectDestination(destinationFav);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Moved 2 items');
      expect(msg).toContain('Undo');

      await moveDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(file2, destinationFav)).toBe(true, `${file2} from ${destinationFav} not present`);
      expect(await dataTable.isItemPresent(file3, destinationFav)).toBe(true, `${file3} from ${destinationFav} not present`);
      expect(await dataTable.isItemPresent(file2, sourceFav)).toBe(false, `${file2} from ${sourceFav} is present`);
      expect(await dataTable.isItemPresent(file3, sourceFav)).toBe(false, `${file3} from ${sourceFav} is present`);

      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationFav);
      expect(await dataTable.isItemPresent(file2)).toBe(true, `${file2} not present in destination folder`);
      expect(await dataTable.isItemPresent(file3)).toBe(true, `${file3} not present in destination folder`);
    });

    it('[C280263] Move a file with a name that already exists on the destination', async () => {
      await dataTable.selectItem(existingFile);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('Personal Files');
      await moveDialog.selectDestination(destinationFav);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Move unsuccessful, a file with the same name already exists');
      expect(msg).not.toContain('Undo');

      await moveDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(existingFile, sourceFav)).toBe(true, `${existingFile} from ${sourceFav} not present`);
      expect(await dataTable.isItemPresent(existingFile, destinationFav)).toBe(false, `${existingFile} from ${destinationFav} is present`);

      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationFav);
      expect(await dataTable.isItemPresent(`${existingFile}.txt`)).toBe(true, `${existingFile}.txt not present in destination folder`);
      expect(await dataTable.isItemPresent(`${existingFile}-1.txt`)).toBe(false, `${existingFile}-1.txt is present in destination folder`);
    });

    it('[C280259] Move a folder with a name that already exists on the destination', async () => {
      await dataTable.selectItem(existingFolder);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('Personal Files');
      await moveDialog.selectDestination(destinationFav);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Moved 1 item');
      expect(msg).toContain('Undo');

      await moveDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(existingFolder, sourceFav)).toBe(false, `${existingFolder} from ${sourceFav} is present`);
      // expect(await dataTable.isItemPresent(existingFolder, destinationFav)).toBe(true, `${existingFolder} from ${destinationFav} not present`);

      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destinationFav);
      expect(await dataTable.isItemPresent(existingFolder)).toBe(true, `${existingFolder} not present in destination folder`);
      await dataTable.doubleClickOnRowByName(existingFolder);
      expect(await dataTable.isItemPresent(file2InFolder)).toBe(true, `${file2InFolder} not present in destination folder`);
      expect(await dataTable.isItemPresent(file3InFolder)).toBe(true, `${file3InFolder} not present in destination folder`);
    });

    it('[C291979] Move items into a library', async () => {
      await dataTable.selectMultipleItems([file4, folder2], sourceFav);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('My Libraries');
      await moveDialog.dataTable.doubleClickOnRowByName(siteName);
      await moveDialog.dataTable.doubleClickOnRowByName('documentLibrary');
      await moveDialog.selectDestination(folderSiteFav);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Moved 2 items');
      expect(msg).toContain('Undo');

      await moveDialog.waitForDialogToClose();
      expect(await dataTable.isItemPresent(file4, folderSiteFav)).toBe(true, `${file4} from ${folderSiteFav} not present`);
      expect(await dataTable.isItemPresent(file4, sourceFav)).toBe(false, `${file4} from ${sourceFav} is present`);
      expect(await dataTable.isItemPresent(folder2, folderSiteFav)).toBe(true, `${folder2} from ${folderSiteFav} not present`);
      expect(await dataTable.isItemPresent(folder2, sourceFav)).toBe(false, `${folder2} from ${sourceFav} is present`);

      await page.goToMyLibraries();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.doubleClickOnRowByName(folderSiteFav);

      expect(await dataTable.isItemPresent(file4)).toBe(true, `${file4} not present in destination folder`);
      expect(await dataTable.isItemPresent(folder2)).toBe(true, `${folder2} not present in destination folder`);
      await dataTable.doubleClickOnRowByName(folder2);
      expect(await dataTable.isItemPresent(fileInFolder2)).toBe(true, `${fileInFolder2} not present in parent folder`);
    });
  });
});
