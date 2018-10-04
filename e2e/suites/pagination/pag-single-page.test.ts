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

describe('Pagination on single page', () => {
  const username = `user-${Utils.random()}`;

  const siteName = `site-${Utils.random()}`; let siteId;

  const file = `file-${Utils.random()}.txt`; let fileId;
  const fileInTrash = `fileInTrash-${Utils.random()}.txt`; let fileInTrashId;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const logoutPage = new LogoutPage();
  const page = new BrowsingPage();
  const { dataTable, pagination } = page;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    const [fileP, fileInTrashP, siteP] = await Promise.all([
      apis.user.nodes.createFile(file),
      apis.user.nodes.createFile(fileInTrash),
      apis.user.sites.createSite(siteName)
    ]);

    fileId = fileP.entry.id;
    fileInTrashId = fileInTrashP.entry.id;
    siteId = siteP.entry.id;

    await apis.user.nodes.deleteNodeById(fileInTrashId, false);
    await apis.user.favorites.addFavoriteById('file', fileId);
    await apis.user.shared.shareFileById(fileId);

    await apis.user.favorites.waitForApi({ expect: 2 });
    await apis.user.search.waitForApi(username, { expect: 1 });
    await apis.user.shared.waitForApi({ expect: 1 });
    await apis.user.trashcan.waitForApi({ expect: 1 });

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await Promise.all([
      apis.user.nodes.deleteNodeById(fileId),
      apis.user.sites.deleteSite(siteId),
      apis.user.trashcan.emptyTrash(),
      logoutPage.load()
    ]);
    done();
  });

  it('page selector not displayed on Favorites - [C280112]', async () => {
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES);
    await dataTable.waitForHeader();
    expect(await pagination.pagesButton.isPresent()).toBe(false, 'page selector displayed');
  });

  it('page selector not displayed on File Libraries - [C280085]', async () => {
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES);
    await dataTable.waitForHeader();
    expect(await pagination.pagesButton.isPresent()).toBe(false, 'page selector displayed');
  });

  it('page selector not displayed on Personal Files - [C280076]', async () => {
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
    await dataTable.waitForHeader();
    expect(await pagination.pagesButton.isPresent()).toBe(false, 'page selector displayed');
  });

  it('page selector not displayed on Recent Files - [C280103]', async () => {
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES);
    await dataTable.waitForHeader();
    expect(await pagination.pagesButton.isPresent()).toBe(false, 'page selector displayed');
  });

  it('page selector not displayed on Shared Files - [C280094]', async () => {
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES);
    await dataTable.waitForHeader();
    expect(await pagination.pagesButton.isPresent()).toBe(false, 'page selector displayed');
  });

  it('page selector not displayed on Trash - [C280121]', async () => {
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH);
    await dataTable.waitForHeader();
    expect(await pagination.pagesButton.isPresent()).toBe(false, 'page selector displayed');
  });

});
