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
  const { menu } = sidenav;

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

  it('Actions in Personal Files - [C286524]', async () => {
    await page.clickPersonalFiles();
    await sidenav.openNewMenu();

    expect(await menu.isUploadFileEnabled()).toBe(true, 'Upload File option not enabled');
    expect(await menu.isUploadFolderEnabled()).toBe(true, 'Upload Folder option not enabled');

    expect(await menu.isCreateFolderEnabled()).toBe(true, 'Create Folder option not enabled');
    expect(await menu.isCreateLibraryEnabled()).toBe(true, 'Create Library option not enabled');

    expect(await menu.isCreateFileFromTemplateEnabled()).toBe(true, 'Create file from template is not enabled');
    expect(await menu.isCreateFolderFromTemplateEnabled()).toBe(true, 'Create folder from template is not enabled');
  });

  it('Actions in File Libraries - user with enough permissions - [C280393]', async () => {
    await page.goToMyLibrariesAndWait();
    await dataTable.doubleClickOnRowByName(siteUser);
    await sidenav.openNewMenu();

    expect(await menu.isUploadFileEnabled()).toBe(true, 'Upload file is not enabled in File Libraries');
    expect(await menu.isUploadFolderEnabled()).toBe(true, 'Upload folder is not enabled in File Libraries');

    expect(await menu.isCreateFolderEnabled()).toBe(true, 'Create folder is not enabled');
    expect(await menu.isCreateLibraryEnabled()).toBe(true, 'Create Library option not enabled');

    expect(await menu.isCreateFileFromTemplateEnabled()).toBe(true, 'Create file from template is not enabled');
    expect(await menu.isCreateFolderFromTemplateEnabled()).toBe(true, 'Create folder from template is not enabled');
  });

  it('Actions in File Libraries - user without enough permissions - [C280397]', async () => {
    await page.goToMyLibrariesAndWait();
    await dataTable.doubleClickOnRowByName(siteAdmin);
    await sidenav.openNewMenu();

    expect(await menu.isUploadFileEnabled()).toBe(false, 'Upload file is not disabled');
    expect(await menu.isUploadFolderEnabled()).toBe(false, 'Upload folder is not disabled');

    expect(await menu.isCreateFolderEnabled()).toBe(false, 'Create folder is not disabled');
    expect(await menu.isCreateLibraryEnabled()).toBe(true, 'Create Library option not enabled');

    expect(await menu.isCreateFileFromTemplateEnabled()).toBe(false, 'Create file from template is not disabled');
    expect(await menu.isCreateFolderFromTemplateEnabled()).toBe(false, 'Create folder from template is not disabled');
  });

  it('Enabled actions tooltips - [C216342]', async () => {
    await page.clickPersonalFiles();
    await sidenav.openNewMenu();

    let tooltip: string;

    tooltip = await menu.getTooltipForUploadFile();
    expect(tooltip).toContain('Select files to upload');

    tooltip = await menu.getTooltipForUploadFolder();
    expect(tooltip).toContain('Select folders to upload');

    tooltip = await menu.getTooltipForCreateFolder();
    expect(tooltip).toContain('Create new folder');

    tooltip = await menu.getTooltipForCreateLibrary();
    expect(tooltip).toContain('Create a new File Library');

    tooltip = await menu.getTooltipForCreateFileFromTemplate();
    expect(tooltip).toContain('Create file from template');
  });

  it('Disabled actions tooltips - [C280398]', async () => {
    await page.goToMyLibrariesAndWait();
    await dataTable.doubleClickOnRowByName(siteAdmin);
    await sidenav.openNewMenu();

    let tooltip: string;

    tooltip = await menu.getTooltipForUploadFile();
    expect(tooltip).toContain('Files cannot be uploaded whilst viewing the current items');

    tooltip = await menu.getTooltipForUploadFolder();
    expect(tooltip).toContain('Folders cannot be uploaded whilst viewing the current items');

    tooltip = await menu.getTooltipForCreateFolder();
    expect(tooltip).toContain('Folders cannot be created whilst viewing the current items');

    tooltip = await menu.getTooltipForCreateFileFromTemplate();
    expect(tooltip).toContain('Files cannot be created whilst viewing the current items');
  });

});
