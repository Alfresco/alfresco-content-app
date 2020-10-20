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

import { BrowsingPage, FILES, SITE_VISIBILITY, RepoClient, Utils, Viewer, AdminActions, CoreActions } from '@alfresco/aca-testing-shared';
import { ApiService, LoginPage, UsersActions, UserModel } from '@alfresco/adf-testing';
import { browser } from 'protractor';

describe('Viewer general', () => {
  let user: UserModel;

  const parent = `parent-${Utils.random()}`;
  let parentId: string;

  const xlsxFile = FILES.xlsxFile;
  let xlsxFileId: string;
  const fileAdmin = FILES.docxFile;
  let fileAdminId: string;

  const siteAdmin = `siteAdmin-${Utils.random()}`;
  let docLibId: string;
  const siteUser = `siteUser-${Utils.random()}`;
  let docLibSiteUserId: string;

  const fileInSite = FILES.docxFile;

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;
  const viewer = new Viewer();
  const { searchInput } = page.header;

  const apiService = new ApiService();
  const usersActions = new UsersActions(apiService);
  const repo = new RepoClient(apiService);
  const adminActions = new AdminActions(apiService);
  const coreActions = new CoreActions(apiService);

  beforeAll(async () => {
    await apiService.getInstance().loginWithProfile('admin')
    user = await usersActions.createUser();
    await apiService.getInstance().login(user.email, user.password);

    parentId = (await repo.nodes.createFolder(parent)).entry.id;
    xlsxFileId = (await repo.upload.uploadFile(xlsxFile, parentId)).entry.id;

    await adminActions.sites.createSite(siteAdmin, SITE_VISIBILITY.PRIVATE);
    docLibId = await adminActions.sites.getDocLibId(siteAdmin);
    fileAdminId = (await adminActions.upload.uploadFile(fileAdmin, docLibId)).entry.id;

    await repo.sites.createSite(siteUser, SITE_VISIBILITY.PUBLIC);
    docLibSiteUserId = await repo.sites.getDocLibId(siteUser);
    await repo.upload.uploadFile(fileInSite, docLibSiteUserId);

    const initialSharedTotalItems = await repo.shared.getSharedLinksTotalItems();
    await coreActions.shareNodes([xlsxFileId]);

    await repo.favorites.addFavoriteById('file', xlsxFileId);
    await repo.favorites.waitForApi({ expect: 2 });
    await repo.shared.waitForApi({ expect: initialSharedTotalItems + 1 });

    await loginPage.login(user.email, user.password);
  });

  beforeEach(async () => {
    await page.header.expandSideNav();
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(parent);
    await dataTable.waitForHeader();
  });

  afterEach(async () => {
    await Utils.pressEscape();
    await page.header.expandSideNav();
  });

  afterAll(async () => {
    await repo.nodes.deleteNodeById(parentId);
    await adminActions.sites.deleteSite(siteAdmin);
    await repo.sites.deleteSite(siteUser);
  });

  it('[C279269] Viewer opens on double clicking on a file from Personal Files', async () => {
    await dataTable.doubleClickOnRowByName(xlsxFile);
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
  });

  it('[C279270] Viewer opens when clicking the View action for a file', async () => {
    await dataTable.selectItem(xlsxFile);
    await page.toolbar.viewButton.click();
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
  });

  it('[C279283] The viewer general elements are displayed', async () => {
    await dataTable.doubleClickOnRowByName(xlsxFile);
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
    expect(await viewer.isViewerToolbarDisplayed()).toBe(true, 'Toolbar not displayed');
    expect(await viewer.isCloseButtonDisplayed()).toBe(true, 'Close button is not displayed');
    expect(await viewer.isFileTitleDisplayed()).toBe(true, 'File title is not displayed');
  });

  it('[C279271] Close the viewer', async () => {
    await dataTable.doubleClickOnRowByName(xlsxFile);
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
    await viewer.closeButton.click();
    expect(await viewer.isViewerOpened()).toBe(false, 'Viewer did not close');
  });

  it('[C284632] Close button tooltip', async () => {
    await dataTable.doubleClickOnRowByName(xlsxFile);
    expect(await viewer.getCloseButtonTooltip()).toEqual('Close');
  });

  it('[C279285] Viewer opens when accessing the preview URL for a file', async () => {
    const previewURL = `personal-files/${parentId}/(viewer:view/${xlsxFileId})`;
    await page.load(previewURL);
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
    expect(await viewer.getFileTitle()).toEqual(xlsxFile);
  });

  it('[C279287] Viewer does not open when accessing the preview URL for a file without permissions', async () => {
    const previewURL = `libraries/${docLibId}/(viewer:view/${fileAdminId})`;
    await page.load(previewURL);
    expect(await viewer.isViewerOpened()).toBe(false, 'Viewer should not be opened!');
  });

  it('[C284633] Viewer opens for a file from File Libraries', async () => {
    await page.goToMyLibrariesAndWait();
    await dataTable.doubleClickOnRowByName(siteUser);
    await dataTable.waitForHeader();
    await dataTable.doubleClickOnRowByName(fileInSite);
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
    expect(await viewer.isViewerToolbarDisplayed()).toBe(true, 'Toolbar not displayed');
    expect(await viewer.isCloseButtonDisplayed()).toBe(true, 'Close button is not displayed');
    expect(await viewer.isFileTitleDisplayed()).toBe(true, 'File title is not displayed');
  });

  it('[C284636] Viewer opens for a file from Recent Files', async () => {
    await page.clickRecentFilesAndWait();
    await dataTable.doubleClickOnRowByName(xlsxFile);
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
    expect(await viewer.isViewerToolbarDisplayed()).toBe(true, 'Toolbar not displayed');
    expect(await viewer.isCloseButtonDisplayed()).toBe(true, 'Close button is not displayed');
    expect(await viewer.isFileTitleDisplayed()).toBe(true, 'File title is not displayed');
  });

  it('[C284635] Viewer opens for a file from Shared Files', async () => {
    await page.clickSharedFilesAndWait();
    await dataTable.doubleClickOnRowByName(xlsxFile);
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
    expect(await viewer.isViewerToolbarDisplayed()).toBe(true, 'Toolbar not displayed');
    expect(await viewer.isCloseButtonDisplayed()).toBe(true, 'Close button is not displayed');
    expect(await viewer.isFileTitleDisplayed()).toBe(true, 'File title is not displayed');
  });

  it('[C284634] Viewer opens for a file from Favorites', async () => {
    await page.clickFavoritesAndWait();
    await dataTable.doubleClickOnRowByName(xlsxFile);
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
    expect(await viewer.isViewerToolbarDisplayed()).toBe(true, 'Toolbar not displayed');
    expect(await viewer.isCloseButtonDisplayed()).toBe(true, 'Close button is not displayed');
    expect(await viewer.isFileTitleDisplayed()).toBe(true, 'File title is not displayed');
  });

  it('[C279175] Viewer opens for a file from Search Results', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    await searchInput.searchFor(xlsxFile);
    await dataTable.waitForBody();

    await dataTable.doubleClickOnRowByName(xlsxFile);
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
    expect(await viewer.isViewerToolbarDisplayed()).toBe(true, 'Toolbar not displayed');
    expect(await viewer.isCloseButtonDisplayed()).toBe(true, 'Close button is not displayed');
    expect(await viewer.isFileTitleDisplayed()).toBe(true, 'File title is not displayed');
  });
});
