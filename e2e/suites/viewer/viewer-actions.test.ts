/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { LoginPage, BrowsingPage, LogoutPage } from '../../pages/pages';
import { SIDEBAR_LABELS, FILES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
import { Viewer } from '../../components/viewer/viewer';
import { CopyMoveDialog } from './../../components/dialog/copy-move-dialog';
import { ShareDialog } from './../../components/dialog/share-dialog';
import { ManageVersionsDialog } from './../../components/dialog/manage-versions-dialog';

describe('Viewer actions', () => {
  const username = `user-${Utils.random()}`;

  const docxFile = FILES.docxFile;
  const xlsxFileForMove = FILES.xlsxFile;
  const pdfFileForDelete = FILES.pdfFile;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const logoutPage = new LogoutPage();
  const page = new BrowsingPage();
  const dataTable = page.dataTable;
  const viewer = new Viewer();
  const { toolbar } = viewer;
  const copyMoveDialog = new CopyMoveDialog();
  const shareDialog = new ShareDialog();
  const manageVersionsDialog = new ManageVersionsDialog();

  beforeAll(async done => {
    await apis.admin.people.createUser({ username });
    done();
  });

  xit('');

  describe('on Personal Files', () => {
    const parent = `parentPF-${Utils.random()}`; let parentId;
    const destination = `destPF-${Utils.random()}`; let destinationId;

    const docxPersonalFiles = `docxPF-${Utils.random()}.docx`; let docxFileId;
    const xlsxPersonalFiles = `xlsxPF-${Utils.random()}.xlsx`;
    const pdfPersonalFiles = `pdfPF-${Utils.random()}.pdf`;

    beforeAll(async (done) => {
      parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
      destinationId = (await apis.user.nodes.createFolder(destination)).entry.id;
      docxFileId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, docxPersonalFiles)).entry.id;
      await apis.user.upload.uploadFileWithRename(xlsxFileForMove, parentId, xlsxPersonalFiles);
      await apis.user.upload.uploadFileWithRename(pdfFileForDelete, parentId, pdfPersonalFiles);

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
      await dataTable.waitForHeader();
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
      await logoutPage.load();
      done();
    });

    it('Correct actions appear in the viewer toolbar - [C282025]', async () => {
      await dataTable.doubleClickOnRowByName(docxPersonalFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      expect(await toolbar.isEmpty()).toBe(false, `viewer toolbar is empty`);
      expect(await toolbar.isButtonPresent('View')).toBe(false, `View is displayed`);
      expect(await toolbar.isButtonPresent('Download')).toBe(true, `Download is not displayed`);
      expect(await toolbar.isButtonPresent('Print')).toBe(true, `print`);
      expect(await toolbar.isButtonPresent('Activate full-screen mode')).toBe(true, `full screen`);
      expect(await toolbar.isButtonPresent('View details')).toBe(true, `view details`);
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `favorite`);
      expect(await toolbar.menu.isMenuItemPresent('Share')).toBe(true, `share`);
      expect(await toolbar.menu.isMenuItemPresent('Copy')).toBe(true, `copy`);
      expect(await toolbar.menu.isMenuItemPresent('Move')).toBe(true, `move`);
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `delete`);
      expect(await toolbar.menu.isMenuItemPresent('Manage Versions')).toBe(true, `manage versions`);
      expect(await toolbar.menu.isMenuItemPresent('Permissions')).toBe(true, `permissions`);
      await toolbar.closeMoreMenu();
    });

    it('Download action - [C268129]', async () => {
      await dataTable.doubleClickOnRowByName(docxPersonalFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickButton('Download');
      expect(await Utils.fileExistsOnOS(docxPersonalFiles)).toBe(true, 'File not found in download location');
    });

    it('Copy action - [C268130]', async (done) => {
      await dataTable.doubleClickOnRowByName(docxPersonalFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Copy');
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await copyMoveDialog.selectLocation('Personal Files');
      await copyMoveDialog.chooseDestination(destination);
      await copyMoveDialog.clickCopy();
      expect(await page.getSnackBarMessage()).toContain('Copied 1 item');
      await viewer.clickClose();
      expect(await dataTable.getRowByName(docxPersonalFiles).isPresent()).toBe(true, 'Item is not in the list');
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
      await dataTable.waitForHeader();
      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.getRowByName(docxPersonalFiles).isPresent()).toBe(true, 'Item is not present in destination');

      await apis.user.nodes.deleteNodeChildren(destinationId);
      done();
    });

    it('Move action - [C268131]', async () => {
      await dataTable.doubleClickOnRowByName(xlsxPersonalFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Move');
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await copyMoveDialog.selectLocation('Personal Files');
      await copyMoveDialog.chooseDestination(destination);
      await copyMoveDialog.clickMove();
      expect(await page.getSnackBarMessage()).toContain('Moved 1 item');
      await viewer.clickClose();
      expect(await dataTable.getRowByName(xlsxPersonalFiles).isPresent()).toBe(false, 'Item was not moved');
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
      await dataTable.waitForHeader();
      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.getRowByName(xlsxPersonalFiles).isPresent()).toBe(true, 'Item is not present in destination');
    });

    it('Favorite action - [C268132]', async () => {
      await dataTable.doubleClickOnRowByName(docxPersonalFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Favorite');
      await viewer.clickClose();
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES);
      await dataTable.waitForHeader();
      expect(await apis.user.favorites.isFavorite(docxFileId)).toBe(true, 'Item is not favorite');
      expect(await dataTable.getRowByName(docxPersonalFiles).isPresent()).toBe(true, 'Item is not present in Favorites list');
    });

    it('Delete action - [C268133]', async () => {
      await dataTable.doubleClickOnRowByName(pdfPersonalFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      expect(await page.getSnackBarMessage()).toContain(`${pdfPersonalFiles} deleted`);
      // TODO: enable this when ACA-1806 is fixed
      // expect(await viewer.isViewerOpened()).toBe(false, 'Viewer is opened');
      await Utils.pressEscape();
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH);
      await dataTable.waitForHeader();
      expect(await dataTable.getRowByName(pdfPersonalFiles).isPresent()).toBe(true, 'Item is not present in Trash');
    });

    it('Full screen action - [C279282]', async () => {
      await dataTable.doubleClickOnRowByName(docxPersonalFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
      await Utils.getBrowserLog();

      await toolbar.clickButton('Activate full-screen mode');
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is closed after pressing Full screen');
      const browserLogAfter = await Utils.getBrowserLog();

      expect(browserLogAfter.length).toEqual(0);
    });

    it('Share action - [C286313]', async () => {
      await dataTable.doubleClickOnRowByName(docxPersonalFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Share');
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await shareDialog.clickClose();
    });

    it('Manage Versions action - [C286316]', async () => {
      await dataTable.doubleClickOnRowByName(docxPersonalFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Manage Versions');
      expect(await manageVersionsDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await manageVersionsDialog.clickClose();
    });

    // TODO: enable this once bug is fixed
    xit('Pressing ESC in the viewer closes only the action dialog - [C286314]', async () => {
      await dataTable.doubleClickOnRowByName(docxPersonalFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Share');
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await Utils.pressEscape();
      expect(await shareDialog.isDialogOpen()).toBe(false, 'Dialog is still open');
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
    });
  });

  describe('on File Libraries', () => {
    const siteName = `site-${Utils.random()}`;
    const destination = `destFL-${Utils.random()}`; let destinationId;

    const docxLibraries = `docxFL-${Utils.random()}.docx`; let docxFileId;
    const xlsxLibraries = `xlsxFL-${Utils.random()}.xlsx`;
    const pdfLibraries = `pdfFL-${Utils.random()}.pdf`;

    beforeAll(async (done) => {
      await apis.user.sites.createSite(siteName);
      const docLibId = await apis.user.sites.getDocLibId(siteName);
      destinationId = (await apis.user.nodes.createFolder(destination)).entry.id;
      docxFileId = (await apis.user.upload.uploadFileWithRename(docxFile, docLibId, docxLibraries)).entry.id;
      await apis.user.upload.uploadFileWithRename(xlsxFileForMove, docLibId, xlsxLibraries);
      await apis.user.upload.uploadFileWithRename(pdfFileForDelete, docLibId, pdfLibraries);

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES);
      await dataTable.waitForHeader();
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
      await logoutPage.load();
      done();
    });

    it('Download action - [C286369]', async () => {
      await dataTable.doubleClickOnRowByName(docxLibraries);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickButton('Download');
      expect(await Utils.fileExistsOnOS(docxLibraries)).toBe(true, 'File not found in download location');
    });

    it('Copy action - [C286370]', async (done) => {
      await dataTable.doubleClickOnRowByName(docxLibraries);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Copy');
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await copyMoveDialog.selectLocation('Personal Files');
      await copyMoveDialog.chooseDestination(destination);
      await copyMoveDialog.clickCopy();
      expect(await page.getSnackBarMessage()).toContain('Copied 1 item');
      await viewer.clickClose();
      expect(await dataTable.getRowByName(docxLibraries).isPresent()).toBe(true, 'Item is not in the list');
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
      await dataTable.waitForHeader();
      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.getRowByName(docxLibraries).isPresent()).toBe(true, 'Item is not present in destination');

      await apis.user.nodes.deleteNodeChildren(destinationId);
      done();
    });

    it('Move action - [C286371]', async () => {
      await dataTable.doubleClickOnRowByName(xlsxLibraries);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Move');
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await copyMoveDialog.selectLocation('Personal Files');
      await copyMoveDialog.chooseDestination(destination);
      await copyMoveDialog.clickMove();
      expect(await page.getSnackBarMessage()).toContain('Moved 1 item');
      await viewer.clickClose();
      expect(await dataTable.getRowByName(xlsxLibraries).isPresent()).toBe(false, 'Item was not moved');
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
      await dataTable.waitForHeader();
      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.getRowByName(xlsxLibraries).isPresent()).toBe(true, 'Item is not present in destination');
    });

    it('Favorite action - [C286372]', async () => {
      await dataTable.doubleClickOnRowByName(docxLibraries);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Favorite');
      await viewer.clickClose();
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES);
      await dataTable.waitForHeader();
      expect(await apis.user.favorites.isFavorite(docxFileId)).toBe(true, `${docxLibraries} is not favorite`);
      expect(await dataTable.getRowByName(docxLibraries).isPresent()).toBe(true, `${docxLibraries} is not present in Favorites list`);
    });

    it('Delete action - [C286373]', async () => {
      await dataTable.doubleClickOnRowByName(pdfLibraries);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      expect(await page.getSnackBarMessage()).toContain(`${pdfLibraries} deleted`);
      // TODO: enable this when ACA-1806 is fixed
      // expect(await viewer.isViewerOpened()).toBe(false, 'Viewer is opened');
      await Utils.pressEscape();
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH);
      await dataTable.waitForHeader();
      expect(await dataTable.getRowByName(pdfLibraries).isPresent()).toBe(true, 'Item is not present in Trash');
    });

    it('Share action - [C286374]', async () => {
      await dataTable.doubleClickOnRowByName(docxLibraries);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Share');
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await shareDialog.clickClose();
    });

    it('Manage Versions action - [C286375]', async () => {
      await dataTable.doubleClickOnRowByName(docxLibraries);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Manage Versions');
      expect(await manageVersionsDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await manageVersionsDialog.clickClose();
    });
  });

  describe('on Recent Files', () => {
    const parent = `parentRF-${Utils.random()}`; let parentId;
    const destination = `destRF-${Utils.random()}`; let destinationId;

    const docxRecentFiles = `docxRF-${Utils.random()}.docx`; let docxFileId;
    const xlsxRecentFiles = `xlsxRF-${Utils.random()}.xlsx`;
    const pdfRecentFiles = `pdfRF-${Utils.random()}.pdf`;

    beforeAll(async (done) => {
      await apis.user.search.waitForApi(username, {expect: 0});
      parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
      destinationId = (await apis.user.nodes.createFolder(destination)).entry.id;
      docxFileId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, docxRecentFiles)).entry.id;
      await apis.user.upload.uploadFileWithRename(xlsxFileForMove, parentId, xlsxRecentFiles);
      await apis.user.upload.uploadFileWithRename(pdfFileForDelete, parentId, pdfRecentFiles);

      await apis.user.search.waitForApi(username, {expect: 3});

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES);
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
      await logoutPage.load();
      done();
    });

    it('Download action - [C286383]', async () => {
      await dataTable.doubleClickOnRowByName(docxRecentFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickButton('Download');
      expect(await Utils.fileExistsOnOS(docxRecentFiles)).toBe(true, 'File not found in download location');
    });

    it('Copy action - [C286384]', async (done) => {
      await dataTable.doubleClickOnRowByName(docxRecentFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Copy');
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await copyMoveDialog.selectLocation('Personal Files');
      await copyMoveDialog.chooseDestination(destination);
      await copyMoveDialog.clickCopy();
      expect(await page.getSnackBarMessage()).toContain('Copied 1 item');
      await viewer.clickClose();
      expect(await dataTable.getRowByName(docxRecentFiles).isPresent()).toBe(true, 'Item is not in the list');
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
      await dataTable.waitForHeader();
      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.getRowByName(docxRecentFiles).isPresent()).toBe(true, 'Item is not present in destination');

      await apis.user.nodes.deleteNodeChildren(destinationId);
      done();
    });

    it('Move action - [C286385]', async () => {
      await dataTable.doubleClickOnRowByName(xlsxRecentFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Move');
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await copyMoveDialog.selectLocation('Personal Files');
      await copyMoveDialog.chooseDestination(destination);
      await copyMoveDialog.clickMove();
      expect(await page.getSnackBarMessage()).toContain('Moved 1 item');
      await viewer.clickClose();
      expect(await dataTable.getRowByName(xlsxRecentFiles).isPresent()).toBe(true, 'Item is not in the list');
      expect(await dataTable.getItemLocationTileAttr(xlsxRecentFiles)).toContain(destination, 'Item was not moved');
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
      await dataTable.waitForHeader();
      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.getRowByName(xlsxRecentFiles).isPresent()).toBe(true, 'Item is not present in destination');
    });

    it('Favorite action - [C286386]', async () => {
      await dataTable.doubleClickOnRowByName(docxRecentFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Favorite');
      await viewer.clickClose();
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES);
      await dataTable.waitForHeader();
      expect(await apis.user.favorites.isFavorite(docxFileId)).toBe(true, 'Item is not favorite');
      expect(await dataTable.getRowByName(docxRecentFiles).isPresent()).toBe(true, 'Item is not present in Favorites list');
    });

    it('Delete action - [C286387]', async () => {
      await dataTable.doubleClickOnRowByName(pdfRecentFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      expect(await page.getSnackBarMessage()).toContain(`${pdfRecentFiles} deleted`);
      // TODO: enable this when ACA-1806 is fixed
      // expect(await viewer.isViewerOpened()).toBe(false, 'Viewer is opened');
      await Utils.pressEscape();
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH);
      await dataTable.waitForHeader();
      expect(await dataTable.getRowByName(pdfRecentFiles).isPresent()).toBe(true, 'Item is not present in Trash');
    });

    it('Share action - [C286388]', async () => {
      await dataTable.doubleClickOnRowByName(docxRecentFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Share');
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await shareDialog.clickClose();
    });

    it('Manage Versions action - [C286389]', async () => {
      await dataTable.doubleClickOnRowByName(docxRecentFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Manage Versions');
      expect(await manageVersionsDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await manageVersionsDialog.clickClose();
    });
  });

  describe('on Shared Files', () => {
    const parent = `parentSF-${Utils.random()}`; let parentId;
    const destination = `destSF-${Utils.random()}`; let destinationId;

    const docxSharedFiles = `docxSF-${Utils.random()}.docx`; let docxFileId;
    const xlsxSharedFiles = `xlsxSF-${Utils.random()}.xlsx`; let xlsxFileId;
    const pdfSharedFiles = `pdfSF-${Utils.random()}.pdf`; let pdfFileId;

    beforeAll(async (done) => {
      parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
      destinationId = (await apis.user.nodes.createFolder(destination)).entry.id;
      docxFileId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, docxSharedFiles)).entry.id;
      xlsxFileId = (await apis.user.upload.uploadFileWithRename(xlsxFileForMove, parentId, xlsxSharedFiles)).entry.id;
      pdfFileId = (await apis.user.upload.uploadFileWithRename(pdfFileForDelete, parentId, pdfSharedFiles)).entry.id;

      await apis.user.shared.shareFilesByIds([docxFileId, xlsxFileId, pdfFileId])
      await apis.user.shared.waitForApi({expect: 3});

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES);
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
      await logoutPage.load();
      done();
    });

    it('Download action - [C286376]', async () => {
      await dataTable.doubleClickOnRowByName(docxSharedFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickButton('Download');
      expect(await Utils.fileExistsOnOS(docxSharedFiles)).toBe(true, 'File not found in download location');
    });

    it('Copy action - [C286377]', async (done) => {
      await dataTable.doubleClickOnRowByName(docxSharedFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Copy');
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await copyMoveDialog.selectLocation('Personal Files');
      await copyMoveDialog.chooseDestination(destination);
      await copyMoveDialog.clickCopy();
      expect(await page.getSnackBarMessage()).toContain('Copied 1 item');
      await viewer.clickClose();
      expect(await dataTable.getRowByName(docxSharedFiles).isPresent()).toBe(true, 'Item is not in the list');
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
      await dataTable.waitForHeader();
      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.getRowByName(docxSharedFiles).isPresent()).toBe(true, 'Item is not present in destination');

      await apis.user.nodes.deleteNodeChildren(destinationId);
      done();
    });

    it('Move action - [C286378]', async () => {
      await dataTable.doubleClickOnRowByName(xlsxSharedFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Move');
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await copyMoveDialog.selectLocation('Personal Files');
      await copyMoveDialog.chooseDestination(destination);
      await copyMoveDialog.clickMove();
      expect(await page.getSnackBarMessage()).toContain('Moved 1 item');
      await viewer.clickClose();
      expect(await dataTable.getRowByName(xlsxSharedFiles).isPresent()).toBe(true, 'Item is not in the list');
      expect(await dataTable.getItemLocationTileAttr(xlsxSharedFiles)).toContain(destination, 'Item was not moved');
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
      await dataTable.waitForHeader();
      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.getRowByName(xlsxSharedFiles).isPresent()).toBe(true, 'Item is not present in destination');
    });

    it('Favorite action - [C286379]', async () => {
      await dataTable.doubleClickOnRowByName(docxSharedFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Favorite');
      await viewer.clickClose();
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES);
      await dataTable.waitForHeader();
      expect(await apis.user.favorites.isFavorite(docxFileId)).toBe(true, 'Item is not favorite');
      expect(await dataTable.getRowByName(docxSharedFiles).isPresent()).toBe(true, 'Item is not present in Favorites list');
    });

    it('Delete action - [C286380]', async () => {
      await dataTable.doubleClickOnRowByName(pdfSharedFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      expect(await page.getSnackBarMessage()).toContain(`${pdfSharedFiles} deleted`);
      // TODO: enable this when ACA-1806 is fixed
      // expect(await viewer.isViewerOpened()).toBe(false, 'Viewer is opened');
      await Utils.pressEscape();
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH);
      await dataTable.waitForHeader();
      expect(await dataTable.getRowByName(pdfSharedFiles).isPresent()).toBe(true, 'Item is not present in Trash');
    });

    // TODO: enable tis when Unshare is implemented - ACA-122
    xit('Share action - [C286381]', async () => {
      await dataTable.doubleClickOnRowByName(docxSharedFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Share');
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await shareDialog.clickClose();
    });

    it('Manage Versions action - [C286382]', async () => {
      await dataTable.doubleClickOnRowByName(docxSharedFiles);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Manage Versions');
      expect(await manageVersionsDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await manageVersionsDialog.clickClose();
    });
  });

  describe('on Favorites', () => {
    const parent = `parentFav-${Utils.random()}`;
    let parentId;
    const destination = `destFav-${Utils.random()}`;
    let destinationId;

    const docxFavorites = `docxFav-${Utils.random()}.docx`; let docxFileId;
    const xlsxFavorites = `xlsxFav-${Utils.random()}.xlsx`; let xlsxFileId;
    const pdfFavorites = `pdfFav-${Utils.random()}.pdf`; let pdfFileId;

    beforeAll(async (done) => {
      parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
      destinationId = (await apis.user.nodes.createFolder(destination)).entry.id;
      docxFileId = (await apis.user.upload.uploadFileWithRename(docxFile, parentId, docxFavorites)).entry.id;
      xlsxFileId = (await apis.user.upload.uploadFileWithRename(xlsxFileForMove, parentId, xlsxFavorites)).entry.id;
      pdfFileId = (await apis.user.upload.uploadFileWithRename(pdfFileForDelete, parentId, pdfFavorites)).entry.id;

      await apis.user.favorites.addFavoritesByIds('file', [docxFileId, xlsxFileId, pdfFileId])
      await apis.user.favorites.waitForApi({expect: 3});

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES);
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
      await logoutPage.load();
      done();
    });

    it('Download action - [C286390]', async () => {
      await dataTable.doubleClickOnRowByName(docxFavorites);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.clickButton('Download');
      expect(await Utils.fileExistsOnOS(docxFavorites)).toBe(true, 'File not found in download location');
    });

    it('Copy action - [C286391]', async (done) => {
      await dataTable.doubleClickOnRowByName(docxFavorites);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Copy');
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await copyMoveDialog.selectLocation('Personal Files');
      await copyMoveDialog.chooseDestination(destination);
      await copyMoveDialog.clickCopy();
      expect(await page.getSnackBarMessage()).toContain('Copied 1 item');
      await viewer.clickClose();
      expect(await dataTable.getRowByName(docxFavorites).isPresent()).toBe(true, 'Item is not in the list');
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
      await dataTable.waitForHeader();
      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.getRowByName(docxFavorites).isPresent()).toBe(true, 'Item is not present in destination');

      await apis.user.nodes.deleteNodeChildren(destinationId);
      done();
    });

    it('Move action - [C286392]', async () => {
      await dataTable.doubleClickOnRowByName(xlsxFavorites);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Move');
      expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await copyMoveDialog.selectLocation('Personal Files');
      await copyMoveDialog.chooseDestination(destination);
      await copyMoveDialog.clickMove();
      expect(await page.getSnackBarMessage()).toContain('Moved 1 item');
      await viewer.clickClose();
      expect(await dataTable.getRowByName(xlsxFavorites).isPresent()).toBe(true, 'Item is not in the list');
      expect(await dataTable.getItemLocationTileAttr(xlsxFavorites)).toContain(destination, 'Item was not moved');
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
      await dataTable.waitForHeader();
      await dataTable.doubleClickOnRowByName(destination);
      expect(await dataTable.getRowByName(xlsxFavorites).isPresent()).toBe(true, 'Item is not present in destination');
    });

    it('Favorite action - [C286393]', async () => {
      await dataTable.doubleClickOnRowByName(xlsxFavorites);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Favorite');
      await viewer.clickClose();
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES);
      await dataTable.waitForHeader();
      expect(await apis.user.favorites.isFavorite(xlsxFileId)).toBe(false, 'Item is still favorite');
      expect(await dataTable.getRowByName(xlsxFavorites).isPresent()).toBe(false, 'Item is still present in Favorites list');
    });

    it('Delete action - [C286394]', async () => {
      await dataTable.doubleClickOnRowByName(pdfFavorites);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      expect(await page.getSnackBarMessage()).toContain(`${pdfFavorites} deleted`);
      // TODO: enable this when ACA-1806 is fixed
      // expect(await viewer.isViewerOpened()).toBe(false, 'Viewer is opened');
      await Utils.pressEscape();
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH);
      await dataTable.waitForHeader();
      expect(await dataTable.getRowByName(pdfFavorites).isPresent()).toBe(true, 'Item is not present in Trash');
    });

    it('Share action - [C286395]', async () => {
      await dataTable.doubleClickOnRowByName(docxFavorites);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Share');
      expect(await shareDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await shareDialog.clickClose();
    });

    it('Manage Versions action - [C286396]', async () => {
      await dataTable.doubleClickOnRowByName(docxFavorites);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Manage Versions');
      expect(await manageVersionsDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
      await manageVersionsDialog.clickClose();
    });
  });
});
