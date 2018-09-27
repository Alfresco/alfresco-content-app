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

import { SIDEBAR_LABELS } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('Empty list views', () => {
  const username = `user-${Utils.random()}`;
  const password = username;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, password)
  };

  const loginPage = new LoginPage();
  const logoutPage = new LogoutPage();
  const page = new BrowsingPage();
  const { dataTable } = page;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await logoutPage.load();
    done();
  });

  it('empty Personal Files - [C280131]', async () => {
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
    expect(await dataTable.isEmptyList()).toBe(true, 'list is not empty');
    expect(await dataTable.getEmptyDragAndDropText()).toContain('Drag and drop');
  });

  it('empty File Libraries - [C217099]', async () => {
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES);
    expect(await dataTable.isEmptyList()).toBe(true, 'list is not empty');
    expect(await dataTable.getEmptyStateTitle()).toContain(`You aren't a member of any File Libraries yet`);
    expect(await dataTable.getEmptyStateSubtitle()).toContain('Join libraries to upload, view, and share files.');
  });

  it('empty Shared Files - [C280132]', async () => {
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES);
    expect(await dataTable.isEmptyList()).toBe(true, 'list is not empty');
    expect(await dataTable.getEmptyStateTitle()).toContain('No shared files or folders');
    expect(await dataTable.getEmptyStateSubtitle()).toContain('Items you share using the Share option are shown here.');
  });

  it('empty Recent Files - [C213169]', async () => {
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES)
    expect(await dataTable.isEmptyList()).toBe(true, 'list is not empty');
    expect(await dataTable.getEmptyStateTitle()).toContain('No recent files');
    expect(await dataTable.getEmptyStateSubtitle()).toContain('Items you upload or edit in the last 30 days are shown here.');
  });

  it('empty Favorites - [C280133]', async () => {
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES);
    expect(await dataTable.isEmptyList()).toBe(true, 'list is not empty');
    expect(await dataTable.getEmptyStateTitle()).toContain('No favorite files or folders');
    expect(await dataTable.getEmptyStateSubtitle()).toContain('Favorite items that you want to easily find later.');
  });

  it('empty Trash - [C280134]', async () => {
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH);
    expect(await dataTable.isEmptyList()).toBe(true, 'list is not empty');
    expect(await dataTable.getEmptyStateTitle()).toContain('Trash is empty');
    expect(await dataTable.getEmptyStateText()).toContain('Items you delete are moved to the Trash.');
    expect(await dataTable.getEmptyStateText()).toContain('Empty Trash to permanently delete items.');
  });
});
