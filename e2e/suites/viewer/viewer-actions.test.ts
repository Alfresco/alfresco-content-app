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

import { LoginPage, BrowsingPage } from '../../pages/pages';
import { FILES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
import { Viewer } from '../../components/viewer/viewer';
import { ContentNodeSelectorDialog } from './../../components/dialog/content-node-selector-dialog';
import { ShareDialog } from './../../components/dialog/share-dialog';
import { ManageVersionsDialog } from './../../components/dialog/manage-versions-dialog';
import { UploadNewVersionDialog } from './../../components/dialog/upload-new-version-dialog';

describe('Viewer actions', () => {
  const username = `user-${Utils.random()}`;

  const docxFile = FILES.docxFile;
  const docxFile2 = FILES.docxFile2;
  const xlsxFileForMove = FILES.xlsxFile;
  const pdfFileForDelete = FILES.pdfFile;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const dataTable = page.dataTable;
  const viewer = new Viewer();
  const { toolbar } = viewer;
  const copyMoveDialog = new ContentNodeSelectorDialog();
  const shareDialog = new ShareDialog();
  const manageVersionsDialog = new ManageVersionsDialog();
  const uploadNewVersionDialog = new UploadNewVersionDialog();

  beforeAll(async done => {
    await apis.admin.people.createUser({ username });
    done();
  });

  describe('from Personal Files', () => {
    const parent = `parentPF-${Utils.random()}`; let parentId;
    const destination = `destPF-${Utils.random()}`; let destinationId;

    const docxPersonalFiles = `docxPF-${Utils.random()}.docx`; let docxFileId;

    const xlsxPersonalFiles = `xlsxPF-${Utils.random()}.xlsx`;
    const pdfPersonalFiles = `pdfPF-${Utils.random()}.pdf`;
    const filePersonalFiles = docxFile2; let filePersonalFilesId;

    const fileForEditOffline = `file1-${Utils.random()}.docx`; let fileForEditOfflineId;
    const fileForCancelEditing = `file2-${Utils.random()}.docx`; let fileForCancelEditingId;
    const fileForUploadNewVersion = `file3-${Utils.random()}.docx`; let fileForUploadNewVersionId;
    const fileForUploadNewVersion2 = `file4-${Utils.random()}.docx`; let fileForUploadNewVersionId2;

    beforeAll(async (done) => {
      parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
      destinationId = (await apis.user.nodes.createFolder(destination)).entry.id;

      docxFileId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, docxPersonalFiles)).entry.id;

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
      done();
    });

    beforeEach(async (done) => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);
      await dataTable.waitForHeader();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    afterAll(async (done) => {
      await apis.user.nodes.deleteNodeById(parentId);
      await apis.user.nodes.deleteNodeById(destinationId);
      await apis.user.trashcan.emptyTrash();
      done();
    });

    it('[C268129] Download action', async () => {
      await dataTable.doubleClickOnRowByName(docxPersonalFiles);
      await viewer.waitForViewerToOpen();

      await toolbar.downloadButton.click();

      expect(await Utils.fileExistsOnOS(docxPersonalFiles)).toBe(true, 'File not found in download location');
    });

    it('[C268130] Copy action', async () => {
      await dataTable.doubleClickOnRowByName(docxPersonalFiles);
      await viewer.waitForViewerToOpen();

      await toolbar.clickMoreActionsCopy();
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await copyMoveDialog.selectLocation('Personal Files');
      await copyMoveDialog.selectDestination(destination);
      await copyMoveDialog.copyButton.click();
      expect(await page.getSnackBarMessage()).toContain('Copied 1 item');
      await viewer.closeButton.click();
      expect(await dataTable.isItemPresent(docxPersonalFiles)).toBe(true, 'Item is not in the list');
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.isItemPresent(docxPersonalFiles)).toBe(true, 'Item is not present in destination');

      await apis.user.nodes.deleteNodeChildren(destinationId);
    });

    it('[C268131] Move action', async () => {
      await dataTable.doubleClickOnRowByName(xlsxPersonalFiles);
      await viewer.waitForViewerToOpen();

      await toolbar.clickMoreActionsMove();
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await copyMoveDialog.selectLocation('Personal Files');
      await copyMoveDialog.selectDestination(destination);
      await copyMoveDialog.moveButton.click();
      expect(await page.getSnackBarMessage()).toContain('Moved 1 item');
      await viewer.closeButton.click();
      expect(await dataTable.isItemPresent(xlsxPersonalFiles)).toBe(false, 'Item was not moved');
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.isItemPresent(xlsxPersonalFiles)).toBe(true, 'Item is not present in destination');
    });

    it('[C268132] Favorite action', async () => {
      await dataTable.doubleClickOnRowByName(docxPersonalFiles);
      await viewer.waitForViewerToOpen();

      await toolbar.clickMoreActionsFavorite();
      await viewer.closeButton.click();
      await page.clickFavoritesAndWait();
      expect(await apis.user.favorites.isFavorite(docxFileId)).toBe(true, 'Item is not favorite');
      expect(await dataTable.isItemPresent(docxPersonalFiles)).toBe(true, 'Item is not present in Favorites list');
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
      await toolbar.clickMoreActionsUploadNewVersion();

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

      await toolbar.openMoreMenu();
      expect(await toolbar.menu.cancelEditingAction.isPresent()).toBe(true, `'Cancel Editing' button should be shown`);
      expect(await toolbar.menu.editOfflineAction.isPresent()).toBe(false, `'Edit Offline' shouldn't be shown`);

      await toolbar.menu.clickMenuItem('Upload New Version');
      await Utils.uploadFileNewVersion(docxFile);
      await page.waitForDialog();

      await uploadNewVersionDialog.uploadButton.click();

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

      expect(browserLogAfter.length).toEqual(0);
    });

    it('[C286313] Share action', async () => {
      await dataTable.doubleClickOnRowByName(docxPersonalFiles);
      await viewer.waitForViewerToOpen();

      await toolbar.shareButton.click();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await shareDialog.clickClose();
    });

    it('[C286316] Manage Versions action', async () => {
      await dataTable.doubleClickOnRowByName(docxPersonalFiles);
      await viewer.waitForViewerToOpen();

      await toolbar.clickMoreActionsManageVersions();
      expect(await manageVersionsDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await manageVersionsDialog.clickClose();
    });

    // TODO: disabled until ACA-2176 is done
    xit('[C286314] Pressing ESC in the viewer closes only the action dialog', async () => {
      await dataTable.doubleClickOnRowByName(docxPersonalFiles);
      await viewer.waitForViewerToOpen();

      await toolbar.shareButton.click();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await Utils.pressEscape();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Dialog is still open');
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
    });
  });

  describe('from File Libraries', () => {
    const siteName = `site-${Utils.random()}`;
    const destination = `destFL-${Utils.random()}`; let destinationId;

    const docxLibraries = `docxFL-${Utils.random()}.docx`; let docxFileId;

    const xlsxLibraries = `xlsxFL-${Utils.random()}.xlsx`;
    const pdfLibraries = `pdfFL-${Utils.random()}.pdf`;
    const fileLibraries = docxFile2; let fileLibrariesId;

    const fileForEditOffline = `file1-${Utils.random()}.docx`; let fileForEditOfflineId;
    const fileForCancelEditing = `file2-${Utils.random()}.docx`; let fileForCancelEditingId;
    const fileForUploadNewVersion = `file3-${Utils.random()}.docx`; let fileForUploadNewVersionId;

    beforeAll(async (done) => {
      await apis.user.sites.createSite(siteName);
      const docLibId = await apis.user.sites.getDocLibId(siteName);
      destinationId = (await apis.user.nodes.createFolder(destination)).entry.id;
      docxFileId = (await apis.user.upload.uploadFileWithRename(docxFile, docLibId, docxLibraries)).entry.id;

      fileLibrariesId = (await apis.user.upload.uploadFile(docxFile2, docLibId)).entry.id;

      await apis.user.upload.uploadFileWithRename(xlsxFileForMove, docLibId, xlsxLibraries);
      await apis.user.upload.uploadFileWithRename(pdfFileForDelete, docLibId, pdfLibraries);

      fileForEditOfflineId = (await apis.user.upload.uploadFileWithRename(docxFile, docLibId, fileForEditOffline)).entry.id;
      fileForCancelEditingId = (await apis.user.upload.uploadFileWithRename(docxFile, docLibId, fileForCancelEditing)).entry.id;
      fileForUploadNewVersionId = (await apis.user.upload.uploadFileWithRename(docxFile, docLibId, fileForUploadNewVersion)).entry.id;

      await apis.user.nodes.lockFile(fileForCancelEditingId);
      await apis.user.nodes.lockFile(fileForUploadNewVersionId);

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.goToMyLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.waitForHeader();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    afterAll(async (done) => {
      await apis.user.sites.deleteSite(siteName);
      await apis.user.nodes.deleteNodeById(destinationId);
      await apis.user.trashcan.emptyTrash();
      done();
    });

    it('[C286369] Download action', async () => {
      await dataTable.doubleClickOnRowByName(docxLibraries);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.downloadButton.click();
      expect(await Utils.fileExistsOnOS(docxLibraries)).toBe(true, 'File not found in download location');
    });

    it('[C286370] Copy action', async (done) => {
      await dataTable.doubleClickOnRowByName(docxLibraries);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickMoreActionsCopy();
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await copyMoveDialog.selectLocation('Personal Files');
      await copyMoveDialog.selectDestination(destination);
      await copyMoveDialog.copyButton.click();
      expect(await page.getSnackBarMessage()).toContain('Copied 1 item');
      await viewer.closeButton.click();
      expect(await dataTable.isItemPresent(docxLibraries)).toBe(true, 'Item is not in the list');
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.isItemPresent(docxLibraries)).toBe(true, 'Item is not present in destination');

      await apis.user.nodes.deleteNodeChildren(destinationId);
      done();
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

    it('[C286372] Favorite action', async () => {
      await dataTable.doubleClickOnRowByName(docxLibraries);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickMoreActionsFavorite();
      await viewer.closeButton.click();
      await page.clickFavoritesAndWait();
      expect(await apis.user.favorites.isFavorite(docxFileId)).toBe(true, `${docxLibraries} is not favorite`);
      expect(await dataTable.isItemPresent(docxLibraries)).toBe(true, `${docxLibraries} is not present in Favorites list`);
    });

    it('[C286373] Delete action', async () => {
      await dataTable.doubleClickOnRowByName(pdfLibraries);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickMoreActionsDelete();
      expect(await page.getSnackBarMessage()).toContain(`${pdfLibraries} deleted`);
      expect(await viewer.isViewerOpened()).toBe(false, 'Viewer is opened');
      await Utils.pressEscape();
      await page.clickTrashAndWait();
      expect(await dataTable.isItemPresent(pdfLibraries)).toBe(true, 'Item is not present in Trash');
    });

    it('[C297589] Edit Offline action', async () => {
      await dataTable.doubleClickOnRowByName(fileForEditOffline);
      await viewer.waitForViewerToOpen();
      await toolbar.clickMoreActionsEditOffline();

      expect(await Utils.fileExistsOnOS(fileForEditOffline)).toBe(true, 'File not found in download location');
      expect(await apis.user.nodes.isFileLockedWrite(fileForEditOfflineId)).toBe(true, `${fileForEditOffline} is not locked`);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not open');
    });

    it('[C297590] Cancel Editing action', async () => {
      await dataTable.doubleClickOnRowByName(fileForCancelEditing);
      await viewer.waitForViewerToOpen();
      await toolbar.clickMoreActionsCancelEditing();

      expect(await apis.user.nodes.isFileLockedWriteWithRetry(fileForCancelEditingId, false)).toBe(false, `${fileForCancelEditing} is still locked`);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not open');
    });

    it('[C297591] Upload new version action', async () => {
      await dataTable.doubleClickOnRowByName(fileLibraries);
      await viewer.waitForViewerToOpen();
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(docxFile2);
      await page.waitForDialog();

      await uploadNewVersionDialog.majorOption.click();
      await uploadNewVersionDialog.enterDescription('new major version description');
      await uploadNewVersionDialog.uploadButton.click();

      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not open');
      expect(await viewer.getFileTitle()).toContain(docxFile2);
      expect(await apis.user.nodes.getFileVersionType(fileLibrariesId)).toEqual('MAJOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(fileLibrariesId)).toEqual('2.0', 'File has incorrect version label');
    });

    it('[C286374] Share action', async () => {
      await dataTable.doubleClickOnRowByName(docxLibraries);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.shareButton.click();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await shareDialog.clickClose();
    });

    it('[C286375] Manage Versions action', async () => {
      await dataTable.doubleClickOnRowByName(docxLibraries);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickMoreActionsManageVersions();
      expect(await manageVersionsDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await manageVersionsDialog.clickClose();
    });
  });

  describe('from Recent Files', () => {
    const parent = `parentRF-${Utils.random()}`; let parentId;
    const destination = `destRF-${Utils.random()}`; let destinationId;

    const docxRecentFiles = `docxRF-${Utils.random()}.docx`; let docxFileId;

    const xlsxRecentFiles = `xlsxRF-${Utils.random()}.xlsx`;
    const pdfRecentFiles = `pdfRF-${Utils.random()}.pdf`;
    const fileRecent = docxFile2; let fileRecentId;

    const fileForEditOffline = `file1-${Utils.random()}.docx`; let fileForEditOfflineId;
    const fileForCancelEditing = `file2-${Utils.random()}.docx`; let fileForCancelEditingId;
    const fileForUploadNewVersion = `file3-${Utils.random()}.docx`; let fileForUploadNewVersionId;

    beforeAll(async (done) => {
      await apis.user.search.waitForApi(username, {expect: 0});

      parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
      destinationId = (await apis.user.nodes.createFolder(destination)).entry.id;
      docxFileId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, docxRecentFiles)).entry.id;

      fileRecentId = (await apis.user.upload.uploadFile(docxFile2, parentId)).entry.id;

      fileForEditOfflineId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForEditOffline)).entry.id;
      fileForCancelEditingId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForCancelEditing)).entry.id;
      fileForUploadNewVersionId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForUploadNewVersion)).entry.id;

      await apis.user.nodes.lockFile(fileForCancelEditingId);
      await apis.user.nodes.lockFile(fileForUploadNewVersionId);


      await apis.user.upload.uploadFileWithRename(xlsxFileForMove, parentId, xlsxRecentFiles);
      await apis.user.upload.uploadFileWithRename(pdfFileForDelete, parentId, pdfRecentFiles);

      await apis.user.search.waitForApi(username, {expect: 7});

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.clickRecentFilesAndWait();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    afterAll(async (done) => {
      await apis.user.nodes.deleteNodeById(parentId);
      await apis.user.nodes.deleteNodeById(destinationId);
      await apis.user.trashcan.emptyTrash();
      done();
    });

    it('[C286383] Download action', async () => {
      await dataTable.doubleClickOnRowByName(docxRecentFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.downloadButton.click();
      expect(await Utils.fileExistsOnOS(docxRecentFiles)).toBe(true, 'File not found in download location');
    });

    it('[C286384] Copy action', async (done) => {
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
      done();
    });

    it('[C286385] Move action', async () => {
      await dataTable.doubleClickOnRowByName(xlsxRecentFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickMoreActionsMove();
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await copyMoveDialog.selectLocation('Personal Files');
      await copyMoveDialog.selectDestination(destination);
      await copyMoveDialog.moveButton.click();
      expect(await page.getSnackBarMessage()).toContain('Moved 1 item');
      await viewer.closeButton.click();
      expect(await dataTable.isItemPresent(xlsxRecentFiles)).toBe(true, 'Item is not in the list');
      expect(await dataTable.getItemLocationTooltip(xlsxRecentFiles)).toContain(destination, 'Item was not moved');
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.isItemPresent(xlsxRecentFiles)).toBe(true, 'Item is not present in destination');
    });

    it('[C286386] Favorite action', async () => {
      await dataTable.doubleClickOnRowByName(docxRecentFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickMoreActionsFavorite();
      await viewer.closeButton.click();
      await page.clickFavoritesAndWait();
      expect(await apis.user.favorites.isFavorite(docxFileId)).toBe(true, 'Item is not favorite');
      expect(await dataTable.isItemPresent(docxRecentFiles)).toBe(true, 'Item is not present in Favorites list');
    });

    it('[C286387] Delete action', async () => {
      await dataTable.doubleClickOnRowByName(pdfRecentFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickMoreActionsDelete();
      expect(await page.getSnackBarMessage()).toContain(`${pdfRecentFiles} deleted`);
      expect(await viewer.isViewerOpened()).toBe(false, 'Viewer is opened');
      await Utils.pressEscape();
      await page.clickTrashAndWait();
      expect(await dataTable.isItemPresent(pdfRecentFiles)).toBe(true, 'Item is not present in Trash');
    });

    it('[C297594] Edit Offline action', async () => {
      await dataTable.doubleClickOnRowByName(fileForEditOffline);
      await viewer.waitForViewerToOpen();
      await toolbar.clickMoreActionsEditOffline();

      expect(await Utils.fileExistsOnOS(fileForEditOffline)).toBe(true, 'File not found in download location');
      expect(await apis.user.nodes.isFileLockedWrite(fileForEditOfflineId)).toBe(true, `${fileForEditOffline} is not locked`);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not open');
    });

    it('[C297595] Cancel Editing action', async () => {
      await dataTable.doubleClickOnRowByName(fileForCancelEditing);
      await viewer.waitForViewerToOpen();
      await toolbar.clickMoreActionsCancelEditing();

      expect(await apis.user.nodes.isFileLockedWriteWithRetry(fileForCancelEditingId, false)).toBe(false, `${fileForCancelEditing} is still locked`);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not open');
    });

    it('[C297596] Upload new version action', async () => {
      await dataTable.doubleClickOnRowByName(fileRecent);
      await viewer.waitForViewerToOpen();
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(docxFile2);
      await page.waitForDialog();

      await uploadNewVersionDialog.majorOption.click();
      await uploadNewVersionDialog.enterDescription('new major version description');
      await uploadNewVersionDialog.uploadButton.click();

      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not open');
      expect(await viewer.getFileTitle()).toContain(docxFile2);
      expect(await apis.user.nodes.getFileVersionType(fileRecentId)).toEqual('MAJOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(fileRecentId)).toEqual('2.0', 'File has incorrect version label');
    });

    it('[C286388] Share action', async () => {
      await dataTable.doubleClickOnRowByName(docxRecentFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.shareButton.click();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await shareDialog.clickClose();
    });

    it('[C286389] Manage Versions action', async () => {
      await dataTable.doubleClickOnRowByName(docxRecentFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickMoreActionsManageVersions();
      expect(await manageVersionsDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await manageVersionsDialog.clickClose();
    });
  });

  describe('from Shared Files', () => {
    const parent = `parentSF-${Utils.random()}`; let parentId;
    const destination = `destSF-${Utils.random()}`; let destinationId;

    const docxSharedFiles = `docxSF-${Utils.random()}.docx`; let docxFileId;

    const xlsxSharedFiles = `xlsxSF-${Utils.random()}.xlsx`; let xlsxFileId;
    const pdfSharedFiles = `pdfSF-${Utils.random()}.pdf`; let pdfFileId;
    const fileShared = docxFile2; let fileSharedId;

    const fileForEditOffline = `file1-${Utils.random()}.docx`; let fileForEditOfflineId;
    const fileForCancelEditing = `file2-${Utils.random()}.docx`; let fileForCancelEditingId;
    const fileForUploadNewVersion = `file3-${Utils.random()}.docx`; let fileForUploadNewVersionId;

    beforeAll(async (done) => {
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

      await apis.user.shared.shareFilesByIds([docxFileId, xlsxFileId, pdfFileId, fileForCancelEditingId, fileForEditOfflineId, fileForUploadNewVersionId, fileSharedId])
      await apis.user.shared.waitForApi({expect: 7});

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.clickSharedFilesAndWait();
      done();
    });

    afterEach(async (done) => {
      await page.closeOpenDialogs();
      await Utils.pressEscape();
      done();
    });

    afterAll(async (done) => {
      await apis.user.nodes.deleteNodeById(parentId);
      await apis.user.nodes.deleteNodeById(destinationId);
      await apis.user.trashcan.emptyTrash();
      done();
    });

    it('[C286376] Download action', async () => {
      await dataTable.doubleClickOnRowByName(docxSharedFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.downloadButton.click();
      expect(await Utils.fileExistsOnOS(docxSharedFiles)).toBe(true, 'File not found in download location');
    });

    it('[C286377] Copy action', async () => {
      await dataTable.doubleClickOnRowByName(docxSharedFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickMoreActionsCopy();
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await copyMoveDialog.selectLocation('Personal Files');
      await copyMoveDialog.selectDestination(destination);
      await copyMoveDialog.copyButton.click();
      expect(await page.getSnackBarMessage()).toContain('Copied 1 item');
      await viewer.closeButton.click();
      expect(await dataTable.isItemPresent(docxSharedFiles)).toBe(true, 'Item is not in the list');
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.isItemPresent(docxSharedFiles)).toBe(true, 'Item is not present in destination');

      await apis.user.nodes.deleteNodeChildren(destinationId);
    });

    it('[C286378] Move action', async () => {
      await dataTable.doubleClickOnRowByName(xlsxSharedFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickMoreActionsMove();
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await copyMoveDialog.selectLocation('Personal Files');
      await copyMoveDialog.selectDestination(destination);
      await copyMoveDialog.moveButton.click();
      expect(await page.getSnackBarMessage()).toContain('Moved 1 item');
      await viewer.closeButton.click();
      expect(await dataTable.isItemPresent(xlsxSharedFiles)).toBe(true, 'Item is not in the list');
      expect(await dataTable.getItemLocationTooltip(xlsxSharedFiles)).toContain(destination, 'Item was not moved');
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.isItemPresent(xlsxSharedFiles)).toBe(true, 'Item is not present in destination');
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

    it('[C286380] Delete action', async () => {
      await dataTable.doubleClickOnRowByName(pdfSharedFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickMoreActionsDelete();
      expect(await page.getSnackBarMessage()).toContain(`${pdfSharedFiles} deleted`);
      expect(await viewer.isViewerOpened()).toBe(false, 'Viewer is opened');
      await Utils.pressEscape();
      await page.clickTrashAndWait();
      expect(await dataTable.isItemPresent(pdfSharedFiles)).toBe(true, 'Item is not present in Trash');
    });

    it('[C297601] Edit Offline action', async () => {
      await dataTable.doubleClickOnRowByName(fileForEditOffline);
      await viewer.waitForViewerToOpen();
      await toolbar.clickMoreActionsEditOffline();

      expect(await Utils.fileExistsOnOS(fileForEditOffline)).toBe(true, 'File not found in download location');
      expect(await apis.user.nodes.isFileLockedWrite(fileForEditOfflineId)).toBe(true, `${fileForEditOffline} is not locked`);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not open');
    });

    it('[C297602] Cancel Editing action', async () => {
      await dataTable.doubleClickOnRowByName(fileForCancelEditing);
      await viewer.waitForViewerToOpen();
      await toolbar.clickMoreActionsCancelEditing();

      expect(await apis.user.nodes.isFileLockedWriteWithRetry(fileForCancelEditingId, false)).toBe(false, `${fileForCancelEditing} is still locked`);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not open');
    });

    it('[C297603] Upload new version action', async () => {
      await dataTable.doubleClickOnRowByName(fileShared);
      await viewer.waitForViewerToOpen();
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(docxFile2);
      await page.waitForDialog();

      await uploadNewVersionDialog.majorOption.click();
      await uploadNewVersionDialog.enterDescription('new major version description');
      await uploadNewVersionDialog.uploadButton.click();

      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not open');
      expect(await viewer.getFileTitle()).toContain(docxFile2);
      expect(await apis.user.nodes.getFileVersionType(fileSharedId)).toEqual('MAJOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(fileSharedId)).toEqual('2.0', 'File has incorrect version label');
    });

    it('[C286381] Share action', async () => {
      await dataTable.doubleClickOnRowByName(docxSharedFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.shareEditButton.click();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await shareDialog.clickClose();
    });

    it('[C286382] Manage Versions action', async () => {
      await dataTable.doubleClickOnRowByName(docxSharedFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickMoreActionsManageVersions();
      expect(await manageVersionsDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await manageVersionsDialog.clickClose();
    });
  });

  describe('from Favorites', () => {
    const parent = `parentFav-${Utils.random()}`;
    let parentId;
    const destination = `destFav-${Utils.random()}`;
    let destinationId;

    const docxFavorites = `docxFav-${Utils.random()}.docx`; let docxFileId;

    const xlsxFavorites = `xlsxFav-${Utils.random()}.xlsx`; let xlsxFileId;
    const pdfFavorites = `pdfFav-${Utils.random()}.pdf`; let pdfFileId;
    const fileFav = docxFile2; let fileFavId;

    const fileForEditOffline = `file1-${Utils.random()}.docx`; let fileForEditOfflineId;
    const fileForCancelEditing = `file2-${Utils.random()}.docx`; let fileForCancelEditingId;
    const fileForUploadNewVersion = `file3-${Utils.random()}.docx`; let fileForUploadNewVersionId;

    beforeAll(async (done) => {
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


      await apis.user.favorites.addFavoritesByIds('file', [docxFileId, xlsxFileId, pdfFileId, fileForEditOfflineId, fileForCancelEditingId, fileForUploadNewVersionId, fileFavId])
      await apis.user.favorites.waitForApi({expect: 7});

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.clickFavoritesAndWait();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    afterAll(async (done) => {
      await apis.user.nodes.deleteNodeById(parentId);
      await apis.user.nodes.deleteNodeById(destinationId);
      await apis.user.trashcan.emptyTrash();
      done();
    });

    it('[C286390] Download action', async () => {
      await dataTable.doubleClickOnRowByName(docxFavorites);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.downloadButton.click();
      expect(await Utils.fileExistsOnOS(docxFavorites)).toBe(true, 'File not found in download location');
    });

    it('[C286391] Copy action', async (done) => {
      await dataTable.doubleClickOnRowByName(docxFavorites);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickMoreActionsCopy();
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await copyMoveDialog.selectLocation('Personal Files');
      await copyMoveDialog.selectDestination(destination);
      await copyMoveDialog.copyButton.click();
      expect(await page.getSnackBarMessage()).toContain('Copied 1 item');
      await viewer.closeButton.click();
      expect(await dataTable.isItemPresent(docxFavorites)).toBe(true, 'Item is not in the list');
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.isItemPresent(docxFavorites)).toBe(true, 'Item is not present in destination');

      await apis.user.nodes.deleteNodeChildren(destinationId);
      done();
    });

    it('[C286392] Move action', async () => {
      await dataTable.doubleClickOnRowByName(xlsxFavorites);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickMoreActionsMove();
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await copyMoveDialog.selectLocation('Personal Files');
      await copyMoveDialog.selectDestination(destination);
      await copyMoveDialog.moveButton.click();
      expect(await page.getSnackBarMessage()).toContain('Moved 1 item');
      await viewer.closeButton.click();
      expect(await dataTable.isItemPresent(xlsxFavorites)).toBe(true, 'Item is not in the list');
      expect(await dataTable.getItemLocationTooltip(xlsxFavorites)).toContain(destination, 'Item was not moved');
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.isItemPresent(xlsxFavorites)).toBe(true, 'Item is not present in destination');
    });

    it('[C286393] Favorite action', async () => {
      await dataTable.doubleClickOnRowByName(xlsxFavorites);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickMoreActionsRemoveFavorite();
      await viewer.closeButton.click();
      await page.clickFavoritesAndWait();
      expect(await apis.user.favorites.isFavorite(xlsxFileId)).toBe(false, 'Item is still favorite');
      expect(await dataTable.isItemPresent(xlsxFavorites)).toBe(false, 'Item is still present in Favorites list');
    });

    it('[C286394] Delete action', async () => {
      await dataTable.doubleClickOnRowByName(pdfFavorites);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickMoreActionsDelete();
      expect(await page.getSnackBarMessage()).toContain(`${pdfFavorites} deleted`);
      expect(await viewer.isViewerOpened()).toBe(false, 'Viewer is opened');
      await Utils.pressEscape();
      await page.clickTrashAndWait();
      expect(await dataTable.isItemPresent(pdfFavorites)).toBe(true, 'Item is not present in Trash');
    });

    it('[C297604] Edit Offline action', async () => {
      await dataTable.doubleClickOnRowByName(fileForEditOffline);
      await viewer.waitForViewerToOpen();
      await toolbar.clickMoreActionsEditOffline();

      expect(await Utils.fileExistsOnOS(fileForEditOffline)).toBe(true, 'File not found in download location');
      expect(await apis.user.nodes.isFileLockedWrite(fileForEditOfflineId)).toBe(true, `${fileForEditOffline} is not locked`);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not open');
    });

    it('[C297605] Cancel Editing action', async () => {
      await dataTable.doubleClickOnRowByName(fileForCancelEditing);
      await viewer.waitForViewerToOpen();
      await toolbar.clickMoreActionsCancelEditing();

      expect(await apis.user.nodes.isFileLockedWriteWithRetry(fileForCancelEditingId, false)).toBe(false, `${fileForCancelEditing} is still locked`);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not open');
    });

    it('[C297606] Upload new version action', async () => {
      await dataTable.doubleClickOnRowByName(fileFav);
      await viewer.waitForViewerToOpen();
      await toolbar.clickMoreActionsUploadNewVersion();

      await Utils.uploadFileNewVersion(docxFile2);
      await page.waitForDialog();

      await uploadNewVersionDialog.majorOption.click();
      await uploadNewVersionDialog.enterDescription('new major version description');
      await uploadNewVersionDialog.uploadButton.click();

      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not open');
      expect(await viewer.getFileTitle()).toContain(docxFile2);
      expect(await apis.user.nodes.getFileVersionType(fileFavId)).toEqual('MAJOR', 'File has incorrect version type');
      expect(await apis.user.nodes.getFileVersionLabel(fileFavId)).toEqual('2.0', 'File has incorrect version label');
    });

    it('[C286395] Share action', async () => {
      await dataTable.doubleClickOnRowByName(docxFavorites);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.shareButton.click();
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await shareDialog.clickClose();
    });

    it('[C286396] Manage Versions action', async () => {
      await dataTable.doubleClickOnRowByName(docxFavorites);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickMoreActionsManageVersions();
      expect(await manageVersionsDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await manageVersionsDialog.clickClose();
    });
  });
});
