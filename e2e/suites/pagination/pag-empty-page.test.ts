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

describe('Pagination on empty page', () => {

  const username = `user-${Utils.random()}`;

  const adminApi = new RepoClient();

  const loginPage = new LoginPage();
  const logoutPage = new LogoutPage();
  const page = new BrowsingPage();
  const { pagination } = page;

  beforeAll(async (done) => {
    await adminApi.people.createUser({ username });
    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await logoutPage.load();
    done();
  });

  it('Favorites - pagination controls not displayed - [C280111]', async () => {
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES);
    expect(await pagination.range.isPresent()).toBe(false);
    expect(await pagination.maxItems.isPresent()).toBe(false);
    expect(await pagination.currentPage.isPresent()).toBe(false);
    expect(await pagination.totalPages.isPresent()).toBe(false);
    expect(await pagination.previousButton.isPresent()).toBe(false);
    expect(await pagination.nextButton.isPresent()).toBe(false);
  });

  it('File Libraries - pagination controls not displayed - [C280084]', async () => {
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES);
    expect(await pagination.range.isPresent()).toBe(false);
    expect(await pagination.maxItems.isPresent()).toBe(false);
    expect(await pagination.currentPage.isPresent()).toBe(false);
    expect(await pagination.totalPages.isPresent()).toBe(false);
    expect(await pagination.previousButton.isPresent()).toBe(false);
    expect(await pagination.nextButton.isPresent()).toBe(false);
  });

  it('Personal Files - pagination controls not displayed - [C280075]', async () => {
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
    expect(await pagination.range.isPresent()).toBe(false);
    expect(await pagination.maxItems.isPresent()).toBe(false);
    expect(await pagination.currentPage.isPresent()).toBe(false);
    expect(await pagination.totalPages.isPresent()).toBe(false);
    expect(await pagination.previousButton.isPresent()).toBe(false);
    expect(await pagination.nextButton.isPresent()).toBe(false);
  });

  it('Recent Files - pagination controls not displayed - [C280102]', async () => {
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES);
    expect(await pagination.range.isPresent()).toBe(false);
    expect(await pagination.maxItems.isPresent()).toBe(false);
    expect(await pagination.currentPage.isPresent()).toBe(false);
    expect(await pagination.totalPages.isPresent()).toBe(false);
    expect(await pagination.previousButton.isPresent()).toBe(false);
    expect(await pagination.nextButton.isPresent()).toBe(false);
  });

  it('Shared Files - pagination controls not displayed - [C280094]', async () => {
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES);
    expect(await pagination.range.isPresent()).toBe(false);
    expect(await pagination.maxItems.isPresent()).toBe(false);
    expect(await pagination.currentPage.isPresent()).toBe(false);
    expect(await pagination.totalPages.isPresent()).toBe(false);
    expect(await pagination.previousButton.isPresent()).toBe(false);
    expect(await pagination.nextButton.isPresent()).toBe(false);
  });

  it('Trash - pagination controls not displayed - [C280120]', async () => {
    await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH);
    expect(await pagination.range.isPresent()).toBe(false);
    expect(pagination.maxItems.isPresent()).toBe(false);
    expect(pagination.currentPage.isPresent()).toBe(false);
    expect(pagination.totalPages.isPresent()).toBe(false);
    expect(pagination.previousButton.isPresent()).toBe(false);
    expect(pagination.nextButton.isPresent()).toBe(false);
  });
});
