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

import { AdminActions, LoginPage, BrowsingPage, SITE_ROLES, Utils, UserActions } from '@alfresco/aca-testing-shared';

describe('New menu', () => {
  const username = `user-${Utils.random()}`;

  const siteUser = `site-user-${Utils.random()}`;
  const siteAdmin = `site-admin-${Utils.random()}`;

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { sidenav } = page;
  const { menu } = sidenav;

  const adminApiActions = new AdminActions();
  const userActions = new UserActions();

  beforeAll(async () => {
    await adminApiActions.createUser({ username });
    await userActions.login(username, username);

    await adminApiActions.sites.createSite(siteAdmin);
    await adminApiActions.sites.addSiteMember(siteAdmin, username, SITE_ROLES.SITE_CONSUMER.ROLE);

    await userActions.createSites([siteUser]);

    await loginPage.loginWith(username);
  });

  afterAll(async () => {
    await userActions.login(username, username);
    await userActions.deleteSites([siteUser]);

    await adminApiActions.login();
    await adminApiActions.deleteSites([siteAdmin]);
  });

  afterEach(async () => {
    await sidenav.closeNewMenu();
  });

  it('[C286524] Actions in Personal Files', async () => {
    await page.clickPersonalFiles();
    await sidenav.openNewMenu();

    expect(await menu.isCreateFolderEnabled()).toBe(true, 'Create Folder option not enabled');

    expect(await menu.isCreateFileFromTemplateEnabled()).toBe(true, 'Create file from template is not enabled');
    expect(await menu.isCreateFolderFromTemplateEnabled()).toBe(true, 'Create folder from template is not enabled');
  });

  it('[C280393] Actions in File Libraries - user with enough permissions', async () => {
    await page.goToMyLibrariesAndWait();
    await sidenav.openNewMenu();

    expect(await menu.isCreateLibraryEnabled()).toBe(true, 'Create Library option not enabled');
  });

  it('[C216342] Enabled actions tooltips', async () => {
    await page.clickPersonalFiles();
    await sidenav.openNewMenu();

    let tooltip: string;

    tooltip = await menu.getItemTooltip('Create Folder');
    expect(tooltip).toContain('Create new folder');

    tooltip = await menu.getItemTooltip('Create file from template');
    expect(tooltip).toContain('Create file from template');
  });
});
