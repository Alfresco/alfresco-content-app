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

import {
  AdminActions,
  UserActions,
  LoginPage,
  BrowsingPage,
  FILES,
  RepoClient,
  Utils,
  Viewer,
  ContentNodeSelectorDialog,
  ShareDialog,
  UploadNewVersionDialog,
  UploadFilesDialog
} from '@alfresco/aca-testing-shared';
import { Logger } from '@alfresco/adf-testing';

describe('Viewer actions', () => {
  const username = `user-${Utils.random()}`;

  const docxFile = FILES.docxFile;
  const docxFile2 = FILES.docxFile2;
  const xlsxFileForMove = FILES.xlsxFile;
  const pdfFileForDelete = FILES.pdfFile;

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const dataTable = page.dataTable;
  const viewer = new Viewer();
  const { toolbar } = viewer;
  const copyMoveDialog = new ContentNodeSelectorDialog();
  const shareDialog = new ShareDialog();
  const uploadNewVersionDialog = new UploadNewVersionDialog();
  const adminApiActions = new AdminActions();
  const userActions = new UserActions();
  const uploadFilesDialog = new UploadFilesDialog();

  beforeAll(async () => {
    await adminApiActions.createUser({ username });
  });

  describe('from Personal Files', () => {
    const parent = `parentPF-${Utils.random()}`;
    let parentId: string;
    const destination = `destPF-${Utils.random()}`;
    let destinationId: string;

    const docxPersonalFiles = `docxPF-${Utils.random()}.docx`;

    const xlsxPersonalFiles = `xlsxPF-${Utils.random()}.xlsx`;
    const pdfPersonalFiles = `pdfPF-${Utils.random()}.pdf`;
    const filePersonalFiles = docxFile2;
    let filePersonalFilesId: string;

    const fileForEditOffline = `file1-${Utils.random()}.docx`;
    let fileForEditOfflineId: string;
    const fileForCancelEditing = `file2-${Utils.random()}.docx`;
    let fileForCancelEditingId: string;
    const fileForUploadNewVersion = `file3-${Utils.random()}.docx`;
    let fileForUploadNewVersionId: string;
    const fileForUploadNewVersion2 = `file4-${Utils.random()}.docx`;
    let fileForUploadNewVersionId2: string;

    beforeAll(async () => {
      try {
        parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
        destinationId = (await apis.user.nodes.createFolder(destination)).entry.id;

        await apis.user.upload.uploadFileWithRename(docxFile, parentId, docxPersonalFiles);

        filePersonalFilesId = (await apis.user.upload.uploadFile(docxFile2, parentId)).entry.id;
        await apis.user.upload.uploadFileWithRename(xlsxFileForMove, parentId, xlsxPersonalFiles);
        await apis.user.upload.uploadFileWithRename(pdfFileForDelete, parentId, pdfPersonalFiles);

        fileForEditOfflineId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForEditOffline)).entry.id;
        fileForCancelEditingId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForCancelEditing)).entry.id;
        fileForUploadNewVersionId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForUploadNewVersion)).entry.id;
        fileForUploadNewVersionId2 = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForUploadNewVersion2)).entry.id;

        await apis.user.nodes.lockFile(fileForCancelEditingId);
        await apis.user.nodes.lockFile(fileForUploadNewVersionId);
        await apis.user.nodes.lockFile(fileForUploadNewVersionId2);

        await loginPage.loginWith(username);
      } catch (error) {
        Logger.error(`----- beforeAll failed : ${error}`);
      }
    });

    beforeEach(async () => {
      try {
        await page.clickPersonalFilesAndWait();
        await dataTable.doubleClickOnRowByName(parent);
        await dataTable.waitForHeader();
      } catch (error) {
        Logger.error(`----- beforeEach failed : ${error}`);
      }
    });

    afterEach(async () => {
      await Utils.pressEscape();
      await uploadFilesDialog.closeUploadDialog();
    });

    afterAll(async () => {
      try {
        await userActions.login(username, username);
        await userActions.deleteNodes([parentId, destinationId]);
        await userActions.emptyTrashcan();
      } catch (error) {
        Logger.error(`----- afterAll failed : ${error}`);
      }
    });

    it('[C268129] Download action', async () => {
      await dataTable.doubleClickOnRowByName(docxPersonalFiles);
      await viewer.waitForViewerToOpen();

      await toolbar.downloadButton.click();

      expect(await Utils.fileExistsOnOS(docxPersonalFiles)).toBe(true, 'File not found in download location');
    });

    it('[C268133] Delete action', async () => {
      await dataTable.doubleClickOnRowByName(pdfPersonalFiles);
      await viewer.waitForViewerToOpen();

      await toolbar.clickMoreActionsDelete();
      expect(await page.getSnackBarMessage()).toContain(`${pdfPersonalFiles} deleted`);
      expect(await viewer.isViewerOpened()).toBe(false, 'Viewer is opened');
      await Utils.pressEscape();
      await page.clickTrashAndWait();
      expect(await dataTable.isItemPresent(pdfPersonalFiles)).toBe(true, 'Item is not present in Trash');
    });

    it('[C297584] Edit Offline action', async () => {
      await dataTable.doubleClickOnRowByName(fileForEditOffline);
      await viewer.waitForViewerToOpen();
      await toolbar.clickMoreActionsEditOffline();

      expect(await Utils.fileExistsOnOS(fileForEditOffline)).toBe(true, 'File not found in download location');
      expect(await apis.user.nodes.isFileLockedWrite(fileForEditOfflineId)).toBe(true, `${fileForEditOffline} is not locked`);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not open');
    });

    it('[C297585] Cancel Editing action', async () => {
      await dataTable.doubleClickOnRowByName(fileForCancelEditing);
      await viewer.waitForViewerToOpen();
      await toolbar.clickMoreActionsCancelEditing();

      expect(await apis.user.nodes.isFileLockedWriteWithRetry(fileForCancelEditingId, false)).toBe(false, `${fileForCancelEditing} is still locked`);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not open');
    });

    it('[C297586] Upload new version action', async () => {
      await dataTable.doubleClickOnRowByName(filePersonalFiles);
      await viewer.waitForViewerToOpen();

      await Utils.uploadFileNewVersion(docxFile2);
      await page.waitForDialog();

      await uploadNewVersionDialog.majorOption.click();
      await uploadNewVersionDialog.enterDescription('new major version description');
      await uploadNewVersionDialog.uploadButton.click();

      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not open');
      expect(await viewer.getFileTitle()).toContain(docxFile2);
      expect(await apis.user.nodes.getFileVersionType(filePersonalFilesId)).toEqual('MAJOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(filePersonalFilesId)).toEqual('2.0', 'File has incorrect version label');
    });

    it('[MNT-21058] Upload new version action when node is locked', async () => {
      await dataTable.doubleClickOnRowByName(fileForUploadNewVersion2);
      await viewer.waitForViewerToOpen();

      await Utils.uploadFileNewVersion(docxFile);
      await page.waitForDialog();

      await uploadNewVersionDialog.uploadButton.click();
      await uploadNewVersionDialog.waitForDialogToClose();

      await viewer.waitForViewerToOpen();
      await viewer.waitForFileTitleToBeDisplayed(docxFile);

      await toolbar.openMoreMenu();
      expect(await toolbar.menu.cancelEditingAction.isPresent()).toBe(false, `'Cancel Editing' button shouldn't be shown`);
      expect(await toolbar.menu.editOfflineAction.isPresent()).toBe(true, `'Edit Offline' should be shown`);
    });

    it('[C279282] Full screen action', async () => {
      await dataTable.doubleClickOnRowByName(docxPersonalFiles);
      await viewer.waitForViewerToOpen();
      await Utils.getBrowserLog();

      await toolbar.fullScreenButton.click();
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is closed after pressing Full screen');
      const browserLogAfter = await Utils.getBrowserLog();

      expect(browserLogAfter.length).toBe(0, browserLogAfter.entries);
    });

    it('[C286314] Pressing ESC in the viewer closes only the action dialog', async () => {
      await dataTable.doubleClickOnRowByName(docxPersonalFiles);
      await viewer.waitForViewerToOpen();

      await toolbar.clickMoreActionsCopy();
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await Utils.pressEscape();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Dialog is still open');
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
    });
  });

  describe('from File Libraries', () => {
    const siteName = `site-${Utils.random()}`;
    const destination = `destFL-${Utils.random()}`;
    let destinationId: string;

    const xlsxLibraries = `xlsxFL-${Utils.random()}.xlsx`;
    const pdfLibraries = `pdfFL-${Utils.random()}.pdf`;

    const fileForEditOffline = `file1-${Utils.random()}.docx`;
    const fileForCancelEditing = `file2-${Utils.random()}.docx`;
    let fileForCancelEditingId: string;
    const fileForUploadNewVersion = `file3-${Utils.random()}.docx`;
    let fileForUploadNewVersionId: string;

    beforeAll(async () => {
      try {
        await apis.user.sites.createSite(siteName);
        const docLibId = await apis.user.sites.getDocLibId(siteName);
        destinationId = (await apis.user.nodes.createFolder(destination)).entry.id;

        await apis.user.upload.uploadFile(docxFile2, docLibId);

        await apis.user.upload.uploadFileWithRename(xlsxFileForMove, docLibId, xlsxLibraries);
        await apis.user.upload.uploadFileWithRename(pdfFileForDelete, docLibId, pdfLibraries);

        await apis.user.upload.uploadFileWithRename(docxFile, docLibId, fileForEditOffline);
        fileForCancelEditingId = (await apis.user.upload.uploadFileWithRename(docxFile, docLibId, fileForCancelEditing)).entry.id;
        fileForUploadNewVersionId = (await apis.user.upload.uploadFileWithRename(docxFile, docLibId, fileForUploadNewVersion)).entry.id;

        await apis.user.nodes.lockFile(fileForCancelEditingId);
        await apis.user.nodes.lockFile(fileForUploadNewVersionId);

        await loginPage.loginWith(username);
      } catch (error) {
        Logger.error(`----- beforeAll failed : ${error}`);
      }
    });

    beforeEach(async () => {
      try {
        await page.goToMyLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();
      } catch (error) {
        Logger.error(`----- beforeEach failed : ${error}`);
      }
    });

    afterEach(async () => {
      await Utils.pressEscape();
      await uploadFilesDialog.closeUploadDialog();
    });

    afterAll(async () => {
      try {
        await userActions.login(username, username);
        await userActions.deleteSites([siteName]);
        await userActions.deleteNodes([destinationId]);
        await userActions.emptyTrashcan();
      } catch (error) {
        Logger.error(`----- afterAll failed : ${error}`);
      }
    });

    it('[C286371] Move action', async () => {
      await dataTable.doubleClickOnRowByName(xlsxLibraries);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickMoreActionsMove();
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await copyMoveDialog.selectLocation('Personal Files');
      await copyMoveDialog.selectDestination(destination);
      await copyMoveDialog.moveButton.click();
      expect(await page.getSnackBarMessage()).toContain('Moved 1 item');
      await viewer.closeButton.click();
      expect(await dataTable.isItemPresent(xlsxLibraries)).toBe(false, 'Item was not moved');
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.isItemPresent(xlsxLibraries)).toBe(true, 'Item is not present in destination');
    });
  });

  describe('from Recent Files', () => {
    const parent = `parentRF-${Utils.random()}`;
    let parentId: string;
    const destination = `destRF-${Utils.random()}`;
    let destinationId: string;

    const docxRecentFiles = `docxRF-${Utils.random()}.docx`;
    const xlsxRecentFiles = `xlsxRF-${Utils.random()}.xlsx`;
    const pdfRecentFiles = `pdfRF-${Utils.random()}.pdf`;

    const fileForEditOffline = `file1-${Utils.random()}.docx`;
    const fileForCancelEditing = `file2-${Utils.random()}.docx`;
    let fileForCancelEditingId: string;
    const fileForUploadNewVersion = `file3-${Utils.random()}.docx`;
    let fileForUploadNewVersionId: string;

    beforeAll(async () => {
      try {
        await apis.user.search.waitForApi(username, { expect: 0 });

        parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
        destinationId = (await apis.user.nodes.createFolder(destination)).entry.id;
        await apis.user.upload.uploadFileWithRename(docxFile, parentId, docxRecentFiles);
        await apis.user.upload.uploadFile(docxFile2, parentId);

        await apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForEditOffline);
        fileForCancelEditingId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForCancelEditing)).entry.id;
        fileForUploadNewVersionId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForUploadNewVersion)).entry.id;

        await apis.user.nodes.lockFile(fileForCancelEditingId);
        await apis.user.nodes.lockFile(fileForUploadNewVersionId);

        await apis.user.upload.uploadFileWithRename(xlsxFileForMove, parentId, xlsxRecentFiles);
        await apis.user.upload.uploadFileWithRename(pdfFileForDelete, parentId, pdfRecentFiles);

        await apis.user.search.waitForApi(username, { expect: 7 });

        await loginPage.loginWith(username);
      } catch (error) {
        Logger.error(`----- beforeAll failed : ${error}`);
      }
    });

    beforeEach(async () => {
      await page.clickRecentFilesAndWait();
    });

    afterEach(async () => {
      await Utils.pressEscape();
      await uploadFilesDialog.closeUploadDialog();
    });

    afterAll(async () => {
      try {
        await userActions.login(username, username);
        await userActions.deleteNodes([parentId, destinationId]);
        await userActions.emptyTrashcan();
      } catch (error) {
        Logger.error(`----- afterAll failed : ${error}`);
      }
    });

    it('[C286384] Copy action', async () => {
      await dataTable.doubleClickOnRowByName(docxRecentFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickMoreActionsCopy();
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await copyMoveDialog.selectLocation('Personal Files');
      await copyMoveDialog.selectDestination(destination);
      await copyMoveDialog.copyButton.click();
      expect(await page.getSnackBarMessage()).toContain('Copied 1 item');
      await viewer.closeButton.click();
      expect(await dataTable.isItemPresent(docxRecentFiles)).toBe(true, 'Item is not in the list');
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.isItemPresent(docxRecentFiles)).toBe(true, 'Item is not present in destination');

      await apis.user.nodes.deleteNodeChildren(destinationId);
    });
  });

  describe('from Shared Files', () => {
    const parent = `parentSF-${Utils.random()}`;
    let parentId: string;
    const destination = `destSF-${Utils.random()}`;
    let destinationId: string;

    const docxSharedFiles = `docxSF-${Utils.random()}.docx`;
    let docxFileId: string;

    const xlsxSharedFiles = `xlsxSF-${Utils.random()}.xlsx`;
    let xlsxFileId: string;
    const pdfSharedFiles = `pdfSF-${Utils.random()}.pdf`;
    let pdfFileId: string;
    let fileSharedId: string;

    const fileForEditOffline = `file1-${Utils.random()}.docx`;
    let fileForEditOfflineId: string;
    const fileForCancelEditing = `file2-${Utils.random()}.docx`;
    let fileForCancelEditingId: string;
    const fileForUploadNewVersion = `file3-${Utils.random()}.docx`;
    let fileForUploadNewVersionId;

    beforeAll(async () => {
      try {
        parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
        destinationId = (await apis.user.nodes.createFolder(destination)).entry.id;
        docxFileId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, docxSharedFiles)).entry.id;

        xlsxFileId = (await apis.user.upload.uploadFileWithRename(xlsxFileForMove, parentId, xlsxSharedFiles)).entry.id;
        pdfFileId = (await apis.user.upload.uploadFileWithRename(pdfFileForDelete, parentId, pdfSharedFiles)).entry.id;
        fileSharedId = (await apis.user.upload.uploadFile(docxFile2, parentId)).entry.id;

        fileForEditOfflineId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForEditOffline)).entry.id;
        fileForCancelEditingId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForCancelEditing)).entry.id;
        fileForUploadNewVersionId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForUploadNewVersion)).entry.id;

        await apis.user.nodes.lockFile(fileForCancelEditingId);
        await apis.user.nodes.lockFile(fileForUploadNewVersionId);

        await apis.user.shared.shareFilesByIds([
          docxFileId,
          xlsxFileId,
          pdfFileId,
          fileForCancelEditingId,
          fileForEditOfflineId,
          fileForUploadNewVersionId,
          fileSharedId
        ]);
        await apis.user.shared.waitForFilesToBeShared([
          docxFileId,
          xlsxFileId,
          pdfFileId,
          fileForCancelEditingId,
          fileForEditOfflineId,
          fileForUploadNewVersionId,
          fileSharedId
        ]);

        await loginPage.loginWith(username);
      } catch (error) {
        Logger.error(`----- beforeAll failed : ${error}`);
      }
    });

    beforeEach(async () => {
      await page.clickSharedFilesAndWait();
    });

    afterEach(async () => {
      try {
        await page.closeOpenDialogs();
        await Utils.pressEscape();
        await uploadFilesDialog.closeUploadDialog();
      } catch (error) {
        Logger.error(`----- afterEach failed : ${error}`);
      }
    });

    afterAll(async () => {
      try {
        await userActions.login(username, username);
        await userActions.deleteNodes([parentId, destinationId]);
        await userActions.emptyTrashcan();
      } catch (error) {
        Logger.error(`----- afterAll failed : ${error}`);
      }
    });

    it('[C286379] Favorite action', async () => {
      await dataTable.doubleClickOnRowByName(docxSharedFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickMoreActionsFavorite();
      await viewer.closeButton.click();
      await page.clickFavoritesAndWait();
      expect(await apis.user.favorites.isFavorite(docxFileId)).toBe(true, 'Item is not favorite');
      expect(await dataTable.isItemPresent(docxSharedFiles)).toBe(true, 'Item is not present in Favorites list');
    });
  });

  describe('from Favorites', () => {
    const parent = `parentFav-${Utils.random()}`;
    let parentId: string;
    const destination = `destFav-${Utils.random()}`;
    let destinationId: string;

    const docxFavorites = `docxFav-${Utils.random()}.docx`;
    let docxFileId: string;

    const xlsxFavorites = `xlsxFav-${Utils.random()}.xlsx`;
    let xlsxFileId: string;
    const pdfFavorites = `pdfFav-${Utils.random()}.pdf`;
    let pdfFileId: string;
    let fileFavId: string;

    const fileForEditOffline = `file1-${Utils.random()}.docx`;
    let fileForEditOfflineId: string;
    const fileForCancelEditing = `file2-${Utils.random()}.docx`;
    let fileForCancelEditingId: string;
    const fileForUploadNewVersion = `file3-${Utils.random()}.docx`;
    let fileForUploadNewVersionId: string;

    beforeAll(async () => {
      try {
        parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
        destinationId = (await apis.user.nodes.createFolder(destination)).entry.id;
        docxFileId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, docxFavorites)).entry.id;

        xlsxFileId = (await apis.user.upload.uploadFileWithRename(xlsxFileForMove, parentId, xlsxFavorites)).entry.id;
        pdfFileId = (await apis.user.upload.uploadFileWithRename(pdfFileForDelete, parentId, pdfFavorites)).entry.id;
        fileFavId = (await apis.user.upload.uploadFile(docxFile2, parentId)).entry.id;

        fileForEditOfflineId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForEditOffline)).entry.id;
        fileForCancelEditingId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForCancelEditing)).entry.id;
        fileForUploadNewVersionId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForUploadNewVersion)).entry.id;

        await apis.user.nodes.lockFile(fileForCancelEditingId);
        await apis.user.nodes.lockFile(fileForUploadNewVersionId);

        await apis.user.favorites.addFavoritesByIds('file', [
          docxFileId,
          xlsxFileId,
          pdfFileId,
          fileForEditOfflineId,
          fileForCancelEditingId,
          fileForUploadNewVersionId,
          fileFavId
        ]);
        await apis.user.favorites.waitForApi({ expect: 7 });

        await loginPage.loginWith(username);
      } catch (error) {
        Logger.error(`----- beforeAll failed : ${error}`);
      }
    });

    beforeEach(async () => {
      await page.clickFavoritesAndWait();
    });

    afterEach(async () => {
      await Utils.pressEscape();
      await uploadFilesDialog.closeUploadDialog();
    });

    afterAll(async () => {
      try {
        await userActions.login(username, username);
        await userActions.deleteNodes([parentId, destinationId]);
        await userActions.emptyTrashcan();
      } catch (error) {
        Logger.error(`----- afterAll failed : ${error}`);
      }
    });

    it('[C286395] Share action', async () => {
      await dataTable.doubleClickOnRowByName(docxFavorites);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.shareButton.click();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await shareDialog.clickClose();
    });
  });
});
