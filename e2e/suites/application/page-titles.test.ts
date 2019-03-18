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

import { browser } from 'protractor';
import { PAGE_TITLES } from '../../configs';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Page titles', () => {
  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const adminApi = new RepoClient();
  const { nodes: nodesApi } = adminApi;
  const file = `file-${Utils.random()}.txt`; let fileId;
  const { searchInput } = page.header;

  describe('on Login / Logout pages', () => {
    it('on Login page - [C217155]', async () => {
      await loginPage.load();
      expect(await browser.getTitle()).toContain('Sign in');
    });

    it('after logout - [C217156]', async () => {
      await loginPage.loginWithAdmin();
      await page.signOut();
      expect(await browser.getTitle()).toContain('Sign in');
    });

    it('when pressing Back after Logout - [C280414]', async () => {
      await loginPage.loginWithAdmin();
      await page.signOut();
      await browser.navigate().back();
      expect(await browser.getTitle()).toContain('Sign in');
    });
  });

  describe('on app pages', () => {
    beforeAll(async (done) => {
      fileId = (await nodesApi.createFile(file)).entry.id;
      await loginPage.loginWithAdmin();
      done();
    });

    afterAll(async (done) => {
      await adminApi.nodes.deleteNodeById(fileId);
      done();
    });

    it('Personal Files page - [C217157]', async () => {
      await page.clickPersonalFiles();
      expect(await browser.getTitle()).toContain(PAGE_TITLES.PERSONAL_FILES);
    });

    it('My Libraries page - [C217158]', async () => {
      await page.goToMyLibraries();
      expect(await browser.getTitle()).toContain(PAGE_TITLES.MY_LIBRARIES);
    });

    it('Favorite Libraries page - [C289907]', async () => {
      await page.goToFavoriteLibraries();
      expect(await browser.getTitle()).toContain(PAGE_TITLES.FAVORITE_LIBRARIES);
    });

    it('Shared Files page - [C217159]', async () => {
      await page.clickSharedFiles();
      expect(await browser.getTitle()).toContain(PAGE_TITLES.SHARED_FILES);
    });

    it('Recent Files page - [C217160]', async () => {
      await page.clickRecentFiles();
      expect(await browser.getTitle()).toContain(PAGE_TITLES.RECENT_FILES);
    });

    it('Favorites page - [C217161]', async () => {
      await page.clickFavorites();
      expect(await browser.getTitle()).toContain(PAGE_TITLES.FAVORITES);
    });

    it('Trash page - [C217162]', async () => {
      await page.clickTrash();
      expect(await browser.getTitle()).toContain(PAGE_TITLES.TRASH);
    });

    it('File Preview page - [C280415]', async () => {
      await page.clickPersonalFilesAndWait();
      await page.dataTable.doubleClickOnRowByName(file);
      expect(await browser.getTitle()).toContain(PAGE_TITLES.VIEWER);
      await Utils.pressEscape();
    });

    it('Search Results page - [C280413]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.searchFor(file);
      expect(await browser.getTitle()).toContain(PAGE_TITLES.SEARCH);
    });
  });
});
