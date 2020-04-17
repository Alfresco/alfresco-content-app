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

import { SITE_VISIBILITY, SITE_ROLES } from '../../configs';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('Special permissions', () => {
  const username = `user-${Utils.random()}`;
  const password = username;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, password)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;
  const { searchInput } = page.header;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    done();
  });

  describe('file not displayed if user no longer has permissions on it', () => {
    const sitePrivate = `private-${Utils.random()}`;
    const fileName = `file-${Utils.random()}.txt`;
    let fileId;

    beforeAll(async (done) => {
      await apis.admin.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE);
      await apis.admin.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_COLLABORATOR.ROLE);
      const docLibId = await apis.admin.sites.getDocLibId(sitePrivate);
      fileId = (await apis.admin.nodes.createFile(fileName, docLibId)).entry.id;
      await apis.user.favorites.addFavoriteById('file', fileId);
      await apis.admin.shared.shareFileById(fileId);
      await apis.user.nodes.editNodeContent(fileId, 'edited by user');

      await apis.user.search.waitForApi(username, { expect: 1 });
      await apis.user.shared.waitForApi({ expect: 1 });

      await loginPage.loginWith(username);
      done();
    });

    afterEach(async (done) => {
      await apis.admin.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_COLLABORATOR.ROLE);
      done();
    });

    afterAll(async (done) => {
      await apis.admin.sites.deleteSite(sitePrivate);
      done();
    });

    it('[C213173] on Recent Files', async () => {
      await page.clickRecentFilesAndWait();
      expect(await dataTable.getRowsCount()).toBe(1, 'Incorrect number of items');
      await apis.admin.sites.deleteSiteMember(sitePrivate, username);
      await page.refresh();
      expect(await dataTable.isEmpty()).toBe(true, 'Items are still displayed');
    });

    it('[C213227] on Favorites', async () => {
      await page.clickFavoritesAndWait();
      expect(await dataTable.getRowsCount()).toBe(1, 'Incorrect number of items');
      await apis.admin.sites.deleteSiteMember(sitePrivate, username);
      await page.refresh();
      expect(await dataTable.isEmpty()).toBe(true, 'Items are still displayed');
    });

    it('[C213116] on Shared Files', async () => {
      await page.clickSharedFilesAndWait();
      expect(await dataTable.getRowsCount()).toBe(1, 'Incorrect number of items');
      await apis.admin.sites.deleteSiteMember(sitePrivate, username);
      await page.refresh();
      expect(await dataTable.isEmpty()).toBe(true, 'Items are still displayed');
    });

    it('[C290122] on Search Results', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchFor(fileName);
      await dataTable.waitForBody();

      expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName} is not displayed`);

      await apis.admin.sites.deleteSiteMember(sitePrivate, username);

      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchFor(fileName);
      await dataTable.waitForBody();

      expect(await dataTable.isItemPresent(fileName)).toBe(false, `${fileName} is displayed`);
    });
  });

  describe(`Location column is empty if user doesn't have permissions on the file's parent folder`, () => {
    const sitePrivate = `private-${Utils.random()}`;
    const fileName = `file-${Utils.random()}.txt`;
    let fileId;

    beforeAll(async (done) => {
      await apis.admin.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE);
      await apis.admin.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_COLLABORATOR.ROLE);
      const docLibId = await apis.admin.sites.getDocLibId(sitePrivate);
      fileId = (await apis.user.nodes.createFile(fileName, docLibId)).entry.id;
      await apis.user.favorites.addFavoriteById('file', fileId);
      await apis.user.shared.shareFileById(fileId);
      await apis.user.shared.waitForApi({ expect: 1 });
      await apis.user.search.waitForApi(username, { expect: 1 });
      await apis.admin.sites.deleteSiteMember(sitePrivate, username);
      await loginPage.loginWith(username);
      done();
    });

    afterAll(async (done) => {
      await apis.admin.sites.deleteSite(sitePrivate);
      done();
    });

    it('[C213178] on Recent Files', async () => {
      await page.clickRecentFilesAndWait();
      expect(await dataTable.getRowsCount()).toBe(1, 'Incorrect number of items');
      expect(await dataTable.getItemLocation(fileName)).toEqual('Unknown');
    });

    it('[C213672] on Favorites', async () => {
      await page.clickFavoritesAndWait();
      expect(await dataTable.getRowsCount()).toBe(1, 'Incorrect number of items');
      expect(await dataTable.getItemLocation(fileName)).toEqual('Unknown');
    });

    it(`[C213668] on Shared Files`, async () => {
      await page.clickSharedFilesAndWait();
      expect(await dataTable.getRowsCount()).toBe(1, 'Incorrect number of items');
      expect(await dataTable.getItemLocation(fileName)).toEqual('Unknown');
    });

    it('[C306868] on Search results', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchFor(fileName);
      await dataTable.waitForBody();

      expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName} is not displayed`);
      expect(await dataTable.getItemLocation(fileName)).toEqual('Unknown');
    });
  });
});
