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

import { AdminActions, UserActions, LoginPage, BrowsingPage, FILES, SITE_VISIBILITY, RepoClient, Utils, Viewer } from '@alfresco/aca-testing-shared';

describe('Viewer general', () => {
  const username = `user-${Utils.random()}`;

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

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;
  const viewer = new Viewer();

  const adminApiActions = new AdminActions();
  const userActions = new UserActions();

  beforeAll(async () => {
    await adminApiActions.createUser({ username });

    parentId = await apis.user.createFolder(parent);
    xlsxFileId = (await apis.user.upload.uploadFile(xlsxFile, parentId)).entry.id;

    await adminApiActions.sites.createSite(siteAdmin, SITE_VISIBILITY.PRIVATE);
    docLibId = await adminApiActions.sites.getDocLibId(siteAdmin);
    fileAdminId = (await adminApiActions.upload.uploadFile(fileAdmin, docLibId)).entry.id;

    await apis.user.sites.createSite(siteUser, SITE_VISIBILITY.PUBLIC);
    docLibSiteUserId = await apis.user.sites.getDocLibId(siteUser);
    await apis.user.upload.uploadFile(fileInSite, docLibSiteUserId);

    await userActions.login(username, username);
    await userActions.shareNodes([xlsxFileId]);
    await apis.user.favorites.addFavoriteById('file', xlsxFileId);

    await apis.user.favorites.waitForApi({ expect: 2 });
    await apis.user.shared.waitForFilesToBeShared([xlsxFileId]);

    await loginPage.loginWith(username);
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
    await apis.user.nodes.deleteNodeById(parentId);
    await adminApiActions.sites.deleteSite(siteAdmin);
    await apis.user.sites.deleteSite(siteUser);
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
});
