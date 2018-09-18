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

  const parent = `parent-${Utils.random()}`;
  let parentId;
  const docxFile = FILES.docxFile;
  let docxFileId;
  const xlsxFileForMove = FILES.xlsxFile;
  const pdfFileForDelete = FILES.pdfFile;
  let pdfFileForDeleteId;

  const destination = `destination-${Utils.random()}`;
  let destinationId;

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

    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
    docxFileId = (await apis.user.upload.uploadFile(docxFile, parentId)).entry.id;
    await apis.user.upload.uploadFile(xlsxFileForMove, parentId);
    pdfFileForDeleteId = (await apis.user.upload.uploadFile(pdfFileForDelete, parentId)).entry.id;

    destinationId = (await apis.user.nodes.createFolder(destination)).entry.id;

    await loginPage.loginWith(username);
    done();
  });

  beforeEach(async done => {
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
    await dataTable.waitForHeader();
    await dataTable.doubleClickOnRowByName(parent);
    await dataTable.waitForHeader();
    done();
  });

  afterEach(async done => {
    await Utils.pressEscape();
    done();
  });

  afterAll(async done => {
    await Promise.all([apis.user.nodes.deleteNodeById(parentId), apis.user.nodes.deleteNodeById(destinationId), logoutPage.load()]);
    done();
  });

  it('Correct actions appear in the viewer toolbar - [C282025]', async () => {
    await dataTable.doubleClickOnRowByName(docxFile);
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

    expect(await toolbar.isEmpty()).toBe(false, `viewer toolbar is empty`);
    expect(await toolbar.isButtonPresent('View')).toBe(false, `View is displayed`);
    expect(await toolbar.isButtonPresent('Download')).toBe(true, `Download is not displayed`);
    expect(await toolbar.isButtonPresent('Print')).toBe(true, `print`);
    expect(await toolbar.isButtonPresent('Activate full-screen mode')).toBe(true, `full screen`);
    expect(await toolbar.isButtonPresent('View details')).toBe(true, `view details`);
    const menu = await toolbar.openMoreMenu();
    expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `favorite`);
    expect(await menu.isMenuItemPresent('Share')).toBe(true, `share`);
    expect(await menu.isMenuItemPresent('Copy')).toBe(true, `copy`);
    expect(await menu.isMenuItemPresent('Move')).toBe(true, `move`);
    expect(await menu.isMenuItemPresent('Delete')).toBe(true, `delete`);
    expect(await menu.isMenuItemPresent('Manage Versions')).toBe(true, `manage versions`);
    expect(await menu.isMenuItemPresent('Permissions')).toBe(true, `permissions`);
    await toolbar.closeMoreMenu();
  });

  it('Download action - [C268129]', async () => {
    await dataTable.doubleClickOnRowByName(docxFile);
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

    await toolbar.clickButton('Download');
    expect(await Utils.fileExistsOnOS(docxFile)).toBe(true, 'File not found in download location');
  });

  it('Copy action - [C268130]', async () => {
    await dataTable.doubleClickOnRowByName(docxFile);
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

    const menu = await toolbar.openMoreMenu();
    await menu.clickMenuItem('Copy');
    expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
    await copyMoveDialog.selectLocation('Personal Files');
    await copyMoveDialog.chooseDestination(destination);
    await copyMoveDialog.clickCopy();
    expect(await page.getSnackBarMessage()).toContain('Copied 1 item');
    await viewer.clickClose();
    expect(await dataTable.getRowByName(docxFile).isPresent()).toBe(true, 'Item is not in the list');
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
    await dataTable.waitForHeader();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.getRowByName(docxFile).isPresent()).toBe(true, 'Item is not present in destination');
  });

  it('Move action - [C268131]', async () => {
    await dataTable.doubleClickOnRowByName(xlsxFileForMove);
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

    const menu = await toolbar.openMoreMenu();
    await menu.clickMenuItem('Move');
    expect(await copyMoveDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
    await copyMoveDialog.selectLocation('Personal Files');
    await copyMoveDialog.chooseDestination(destination);
    await copyMoveDialog.clickMove();
    expect(await page.getSnackBarMessage()).toContain('Moved 1 item');
    await viewer.clickClose();
    expect(await dataTable.getRowByName(xlsxFileForMove).isPresent()).toBe(false, 'Item was not moved');
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
    await dataTable.waitForHeader();
    await dataTable.doubleClickOnRowByName(destination);
    expect(await dataTable.getRowByName(xlsxFileForMove).isPresent()).toBe(true, 'Item is not present in destination');
  });

  it('Favorite action - [C268132]', async () => {
    await dataTable.doubleClickOnRowByName(docxFile);
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

    const menu = await toolbar.openMoreMenu();
    await menu.clickMenuItem('Favorite');
    expect(await apis.user.favorites.isFavorite(docxFileId)).toBe(true, 'Item is not favorite');
    await viewer.clickClose();
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES);
    await dataTable.waitForHeader();
    expect(await dataTable.getRowByName(docxFile).isPresent()).toBe(true, 'Item is not present in Favorites list');

    await apis.user.favorites.removeFavoriteById(docxFileId);
  });

  it('Delete action - [C268133]', async () => {
    await dataTable.doubleClickOnRowByName(pdfFileForDelete);
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

    const menu = await toolbar.openMoreMenu();
    await menu.clickMenuItem('Delete');
    expect(await page.getSnackBarMessage()).toContain(`${pdfFileForDelete} deleted`);
    // TODO: enable this when ACA-1806 is fixed
    // expect(await viewer.isViewerOpened()).toBe(false, 'Viewer is opened');
    await Utils.pressEscape();
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH);
    await dataTable.waitForHeader();
    expect(await dataTable.getRowByName(pdfFileForDelete).isPresent()).toBe(true, 'Item is not present in Trash');

    await apis.user.trashcan.restore(pdfFileForDeleteId);
  });

  it('Full screen action - [C279282]', async () => {
    await dataTable.doubleClickOnRowByName(docxFile);
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
    await Utils.getBrowserLog();

    await toolbar.clickButton('Activate full-screen mode');
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is closed after pressing Full screen');
    const browserLogAfter = await Utils.getBrowserLog();

    expect(browserLogAfter.length).toEqual(0);
  });

  it('Share action - [C286313]', async () => {
    await dataTable.doubleClickOnRowByName(docxFile);
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

    const menu = await toolbar.openMoreMenu();
    await menu.clickMenuItem('Share');
    expect(await shareDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
    await shareDialog.clickClose();
  });

  it('Manage Versions action - [C286316]', async () => {
    await dataTable.doubleClickOnRowByName(docxFile);
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

    const menu = await toolbar.openMoreMenu();
    await menu.clickMenuItem('Manage Versions');
    expect(await manageVersionsDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
    await manageVersionsDialog.clickClose();
  });

  // TODO: enable this once bug is fixed
  xit('Pressing ESC in the viewer closes only the action dialog - [C286314]', async () => {
    await dataTable.doubleClickOnRowByName(docxFile);
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

    const menu = await toolbar.openMoreMenu();
    await menu.clickMenuItem('Share');
    expect(await shareDialog.isDialogOpen()).toBe(true, 'Dialog is not open');
    await Utils.pressEscape();
    expect(await shareDialog.isDialogOpen()).toBe(false, 'Dialog is still open');
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
  });
});
