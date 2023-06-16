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

import { AdminActions, LoginPage, BrowsingPage, ContentNodeSelectorDialog, RepoClient, Utils } from '@alfresco/aca-testing-shared';
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

  const apis = new RepoClient(username, username);

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const moveDialog = new ContentNodeSelectorDialog();

  const adminApiActions = new AdminActions();

  beforeAll(async () => {
    await adminApiActions.createUser({ username });

    await apis.sites.createSite(siteName);
    const docLibId = await apis.sites.getDocLibId(siteName);

    await apis.createFolder(folderSitePF, docLibId);
    await apis.createFolder(folderSiteRF, docLibId);
    await apis.createFolder(folderSiteSF, docLibId);
    await apis.createFolder(folderSiteFav, docLibId);

    sourceIdPF = await apis.createFolder(sourcePF);
    destinationIdPF = await apis.createFolder(destinationPF);

    sourceIdRF = await apis.createFolder(sourceRF);
    destinationIdRF = await apis.createFolder(destinationRF);

    sourceIdSF = await apis.createFolder(sourceSF);
    destinationIdSF = await apis.createFolder(destinationSF);

    sourceIdFav = await apis.createFolder(sourceFav);
    destinationIdFav = await apis.createFolder(destinationFav);

    await loginPage.loginWith(username);
  });

  afterAll(async () => {
    await apis.nodes.deleteNodesById([
      sourceIdPF,
      sourceIdRF,
      sourceIdSF,
      sourceIdFav,
      destinationIdPF,
      destinationIdRF,
      destinationIdSF,
      destinationIdFav
    ]);
    await apis.sites.deleteSite(siteName);
  });

  describe('from Personal Files', () => {
    const file1 = `file1-${Utils.random()}.txt`;
    const folder1 = `folder1-${Utils.random()}`;
    const fileInFolder = `fileInFolder-${Utils.random()}.txt`;
    const file2 = `file2-${Utils.random()}.txt`;
    const file3 = `file3-${Utils.random()}.txt`;
    const file4 = `file4-${Utils.random()}.txt`;
    const folder2 = `folder2-${Utils.random()}`;
    const fileInFolder2 = `fileInFolder2-${Utils.random()}.txt`;
    const existingFile = `existing-${Utils.random()}`;
    const existingFolder = `existing-${Utils.random()}`;
    const file2InFolder = `file2InFolder-${Utils.random()}.txt`;
    const file3InFolder = `file3InFolder-${Utils.random()}.txt`;

    beforeAll(async () => {
      await apis.createFile(file1, sourceIdPF);

      const folder1Id = await apis.createFolder(folder1, sourceIdPF);
      await apis.createFile(fileInFolder, folder1Id);

      await apis.createFile(file2, sourceIdPF);
      await apis.createFile(file3, sourceIdPF);
      await apis.createFile(file4, sourceIdPF);

      await apis.createFile(`${existingFile}.txt`, sourceIdPF);
      await apis.createFile(`${existingFile}.txt`, destinationIdPF);

      const existingId1 = await apis.createFolder(existingFolder, sourceIdPF);
      await apis.createFile(file2InFolder, existingId1);

      const existingId2 = await apis.createFolder(existingFolder, destinationIdPF);
      await apis.createFile(file3InFolder, existingId2);

      const folder2Id = await apis.createFolder(folder2, sourceIdPF);
      await apis.createFile(fileInFolder2, folder2Id);
    });

    beforeEach(async () => {
      await Utils.pressEscape();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(sourcePF);
    });

    it('[C217316] Move a file', async () => {
      await dataTable.selectItem(file1);
      await toolbar.clickMoreActionsMove();
      await moveDialog.selectLocation('Personal Files');
      await moveDialog.selectDestination(destinationPF);
      await BrowserActions.click(moveDialog.moveButton);
      const msg = await page.getSnackBarMessage();
      expect(msg).toContain('Moved 1 item');
      const action = await page.getSnackBarAction();
      expect(action).toContain('Undo');

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
      const action = await page.getSnackBarAction();
      expect(action).toContain('Undo');

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
      const action = await page.getSnackBarAction();
      expect(action).toContain('Undo');

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
      const action = await page.getSnackBarAction();
      expect(action).not.toContain('Undo');

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
      const action = await page.getSnackBarAction();
      expect(action).toContain('Undo');

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
      const action = await page.getSnackBarAction();
      expect(action).toContain('Undo');

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
});
