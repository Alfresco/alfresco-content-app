/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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
import { SITE_ROLES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('New menu', () => {
  const username = `user-${Utils.random()}`;

  const siteUser = `site-user-${Utils.random()}`;
  const siteAdmin = `site-admin-${Utils.random()}`;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, sidenav } = page;


  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    await apis.admin.sites.createSite(siteAdmin);
    await apis.admin.sites.addSiteMember(siteAdmin, username, SITE_ROLES.SITE_CONSUMER.ROLE);

    await apis.user.sites.createSite(siteUser);

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.sites.deleteSite(siteUser);
    await apis.admin.sites.deleteSite(siteAdmin);
    done();
  });

  afterEach(async (done) => {
    await Utils.pressEscape();
    done();
  });

  it('has correct actions - [C286524]', async () => {
    await page.clickPersonalFiles();
    await sidenav.openNewMenu();

    expect(await sidenav.menu.isCreateFolderPresent()).toBe(true, 'Create Folder option not present');
    expect(await sidenav.menu.isCreateLibraryPresent()).toBe(true, 'Create Library option not present');
    expect(await sidenav.menu.isUploadFilePresent()).toBe(true, 'Upload File option not present');
    expect(await sidenav.menu.isUploadFolderPresent()).toBe(true, 'Upload Folder option not present');

    expect(await sidenav.menu.isCreateLibraryEnabled()).toBe(true, 'Create Library is not enabled');
  });

  it('Create folder is enabled when having enough permissions - Personal Files - [C216339]', async () => {
    await page.clickPersonalFiles();
    await page.sidenav.openNewMenu();

    expect(await sidenav.menu.isCreateFolderEnabled()).toBe(true, 'Create folder is not enabled');
  });

  it('Create folder is enabled when having enough permissions - File Libraries - [C280393]', async () => {
    await page.goToMyLibrariesAndWait();
    await page.dataTable.doubleClickOnRowByName(siteUser);
    await page.sidenav.openNewMenu();
    expect(await sidenav.menu.isCreateFolderEnabled()).toBe(true, 'Create folder is not enabled');
  });

  it('Create folder is disabled when not enough permissions - [C280397]', async () => {
    await page.goToMyLibrariesAndWait();
    await dataTable.doubleClickOnRowByName(siteAdmin);
    await sidenav.openNewMenu();
    expect(await sidenav.menu.isCreateFolderEnabled()).toBe(false, 'Create folder is not disabled');
  });

  it('Upload File option is enabled when having enough permissions - on Personal Files - [C217145]', async () => {
    await page.clickPersonalFiles();
    await sidenav.openNewMenu();

    expect(await sidenav.menu.isUploadFileEnabled()).toBe(true, 'Upload file is not enabled in Personal Files');
  });

  it('Upload File option is enabled when having permissions - on File Libraries - [C290142]', async () => {
    await page.goToMyLibrariesAndWait();
    await dataTable.doubleClickOnRowByName(siteUser);
    await sidenav.openNewMenu();

    expect(await sidenav.menu.isUploadFileEnabled()).toBe(true, 'Upload file is not enabled in File Libraries');
  });

  it('Upload File option is disabled when user cannot create content in that location - [C217146]', async () => {
    await page.goToMyLibrariesAndWait();
    await dataTable.doubleClickOnRowByName(siteAdmin);
    await sidenav.openNewMenu();

    expect(await sidenav.menu.isUploadFileEnabled()).toBe(false, 'Upload file is not disabled');
  });

  it('Upload Folder option is enabled when having enough permissions - on Personal Files - [C213196]', async () => {
    await page.clickPersonalFiles();
    await sidenav.openNewMenu();

    expect(await sidenav.menu.isUploadFolderEnabled()).toBe(true, 'Upload folder is not enabled in Personal Files');
  });

  it('Upload Folder option is enabled when having permissions - on File Libraries - [C290146]', async () => {
    await page.goToMyLibrariesAndWait();
    await dataTable.doubleClickOnRowByName(siteUser);
    await sidenav.openNewMenu();

    expect(await sidenav.menu.isUploadFolderEnabled()).toBe(true, 'Upload folder is not enabled in File Libraries');
  });

  it('Upload Folder option is disabled when user cannot create content in that location - [C213193]', async () => {
    await page.goToMyLibrariesAndWait();
    await dataTable.doubleClickOnRowByName(siteAdmin);
    await sidenav.openNewMenu();

    expect(await sidenav.menu.isUploadFolderEnabled()).toBe(false, 'Upload folder is not disabled');
  });

  it('Create folder enabled button tooltip - [C216342]', async () => {
    await page.clickPersonalFiles();
    await sidenav.openNewMenu();

    const tooltip = await sidenav.menu.getItemTooltip('Create Folder');
    expect(tooltip).toContain('Create new folder');
  });

  it('Create folder disabled button tooltip - [C280398]', async () => {
    await page.goToMyLibrariesAndWait();
    await dataTable.doubleClickOnRowByName(siteAdmin);
    await sidenav.openNewMenu();

    const tooltip = await sidenav.menu.getItemTooltip('Create Folder');
    expect(tooltip).toContain(`Folders cannot be created whilst viewing the current items`);
  });

  it('Create Library button tooltip - [C286526]', async () => {
    await sidenav.openNewMenu();

    const tooltip = await sidenav.menu.getItemTooltip('Create Library');
    expect(tooltip).toContain('Create a new File Library');
  });

});
