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

import { AdminActions, ApiActions, LoginPage, BrowsingPage, FILES, SITE_VISIBILITY, RepoClient, Utils, Viewer } from '@alfresco/aca-testing-shared';
import { ApiService, BrowserActions, UsersActions } from '@alfresco/adf-testing';

describe('Viewer general', () => {
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

  const apiService = new ApiService();
  const repoClient = new RepoClient(apiService);
  const adminApiService = new ApiService();
  const adminApiActions = new AdminActions(adminApiService);
  const apiActions = new ApiActions(apiService);
  const usersActions = new UsersActions(adminApiService);

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;
  const viewer = new Viewer();
  const { searchInput } = page.header;

  beforeAll(async (done) => {
    await adminApiActions.loginWithProfile('admin');
    const user = await usersActions.createUser();
    await apiService.login(user.username, user.password);

    parentId = (await repoClient.nodes.createFolder(parent)).entry.id;
    xlsxFileId = (await repoClient.upload.uploadFile(xlsxFile, parentId)).entry.id;

    await adminApiActions.sites.createSite(siteAdmin, SITE_VISIBILITY.PRIVATE);
    docLibId = await adminApiActions.sites.getDocLibId(siteAdmin);
    fileAdminId = (await adminApiActions.upload.uploadFile(fileAdmin, docLibId)).entry.id;

    await repoClient.sites.createSite(siteUser, SITE_VISIBILITY.PUBLIC);
    docLibSiteUserId = await repoClient.sites.getDocLibId(siteUser);
    await repoClient.upload.uploadFile(fileInSite, docLibSiteUserId);

    await apiActions.shareNodes([xlsxFileId]);
    await repoClient.favorites.addFavoriteById('file', xlsxFileId);

    await repoClient.favorites.waitForApi({ expect: 2 });
    await repoClient.shared.waitForFilesToBeShared([xlsxFileId]);

    await loginPage.loginWith(user.username, user.password);
    done();
  });

  beforeEach(async (done) => {
    await page.header.expandSideNav();
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(parent);
    await dataTable.waitForHeader();
    done();
  });

  afterEach(async (done) => {
    await Utils.pressEscape();
    await page.header.expandSideNav();
    done();
  });

  afterAll(async (done) => {
    await repoClient.nodes.deleteNodeById(parentId);
    await adminApiActions.sites.deleteSite(siteAdmin);
    await repoClient.sites.deleteSite(siteUser);
    done();
  });

  it('[C279269] Viewer opens on double clicking on a file from Personal Files', async () => {
    await dataTable.doubleClickOnRowByName(xlsxFile);
    expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
  });

  it('[C279270] Viewer opens when clicking the View action for a file', async () => {
    await dataTable.selectItem(xlsxFile);
    await BrowserActions.click(page.toolbar.viewButton);

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
    await BrowserActions.click(viewer.closeButton);
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
