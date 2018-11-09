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

import { browser } from 'protractor';

import { APP_ROUTES, SIDEBAR_LABELS } from '../../configs';
import { LoginPage, BrowsingPage } from '../../pages/pages';

describe('Sidebar', () => {
  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { sidenav } = page;

  beforeAll(async (done) => {
    await loginPage.loginWithAdmin();
    done();
  });

  it('has "Personal Files" as default - [C217149]', async () => {
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
    expect(await sidenav.isActiveByLabel('Personal Files')).toBe(true, 'Active link');
  });

  it('navigates to "File Libraries" - [C217150]', async () => {
    await page.clickFileLibraries();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.MY_LIBRARIES);
    expect(await sidenav.childIsActiveByLabel(SIDEBAR_LABELS.MY_LIBRARIES)).toBe(true);
  });

  it('navigates to "Personal Files" - [C280409]', async () => {
    await page.clickPersonalFiles();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
    expect(await sidenav.isActiveByLabel(SIDEBAR_LABELS.PERSONAL_FILES)).toBe(true);
  });

  it('navigates to "Shared Files" - [C213110]', async () => {
    await page.clickSharedFiles();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.SHARED_FILES);
    expect(await sidenav.isActiveByLabel(SIDEBAR_LABELS.SHARED_FILES)).toBe(true);
  });

  it('navigates to "Recent Files" - [C213166]', async () => {
    await page.clickRecentFiles();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.RECENT_FILES);
    expect(await sidenav.isActiveByLabel(SIDEBAR_LABELS.RECENT_FILES)).toBe(true);
  });

  it('navigates to "Favorites" - [C213225]', async () => {
    await page.clickFavorites();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.FAVORITES);
    expect(await sidenav.isActiveByLabel(SIDEBAR_LABELS.FAVORITES)).toBe(true);
  });

  it('navigates to "Trash" - [C213216]', async () => {
    await page.clickTrash();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.TRASHCAN);
    expect(await sidenav.isActiveByLabel(SIDEBAR_LABELS.TRASH)).toBe(true);
  });

  // TODO: incomplete test
  xit('Personal Files tooltip - [C217151]', async () => {
    await page.clickPersonalFiles();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.PERSONAL_FILES)).toContain('View your Personal Files');
  });

  // TODO: incomplete test
  xit('File Libraries tooltip - [C217152]', async () => {
    await page.clickFileLibraries();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.FILE_LIBRARIES)).toContain('Access File Libraries');
  });

  // TODO: incomplete test
  xit('Shared Files tooltip - [C213111]', async () => {
    await page.clickSharedFiles();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.SHARED_FILES)).toContain('View files that have been shared');
  });

  // TODO: incomplete test
  xit('Recent Files tooltip - [C213167]', async () => {
    await page.clickRecentFiles();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.RECENT_FILES)).toContain('View files you recently edited');
  });

  // TODO: incomplete test
  xit('Favorites tooltip - [C217153]', async () => {
    await page.clickFavorites();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.FAVORITES)).toContain('View your favorite files and folders');
  });

  // TODO: incomplete test
  xit('Trash tooltip - [C217154]', async () => {
    await page.clickTrash();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.TRASH)).toContain('View deleted files in the trash');
  });
});
