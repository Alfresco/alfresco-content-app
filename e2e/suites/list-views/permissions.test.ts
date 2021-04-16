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

import { AdminActions, UserActions, SITE_VISIBILITY, SITE_ROLES, LoginPage, BrowsingPage, Utils, RepoClient } from '@alfresco/aca-testing-shared';

describe('Special permissions', () => {
  const username = `user-${Utils.random()}`;

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;
  const { searchInput } = page.header;

  const adminApiActions = new AdminActions();
  const userActions = new UserActions();

  beforeAll(async () => {
    await adminApiActions.createUser({ username });
  });

  describe('file not displayed if user no longer has permissions on it', () => {
    const sitePrivate = `private-${Utils.random()}`;
    const fileName = `file-${Utils.random()}.txt`;
    let fileId: string;

    beforeAll(async (done) => {
      await adminApiActions.login();
      await adminApiActions.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE);
      await adminApiActions.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_COLLABORATOR.ROLE);
      const docLibId = await adminApiActions.sites.getDocLibId(sitePrivate);
      fileId = (await adminApiActions.nodes.createFile(fileName, docLibId)).entry.id;
      await apis.user.favorites.addFavoriteById('file', fileId);

      await adminApiActions.login();
      await adminApiActions.shareNodes([fileId]);
      await apis.user.nodes.updateNodeContent(fileId, 'edited by user');

      await apis.user.search.waitForApi(username, { expect: 1 });

      await adminApiActions.login();
      await adminApiActions.shared.waitForFilesToBeShared([fileId]);

      await loginPage.loginWith(username);
      done();
    });

    afterEach(async () => {
      await adminApiActions.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_COLLABORATOR.ROLE);
    });

    afterAll(async () => {
      await adminApiActions.sites.deleteSite(sitePrivate);
    });

    it('[C213173] on Recent Files', async () => {
      await page.clickRecentFilesAndWait();
      expect(await dataTable.getRowsCount()).toBe(1, 'Incorrect number of items');
      await adminApiActions.sites.deleteSiteMember(sitePrivate, username);
      await page.refresh();
      expect(await dataTable.isEmpty()).toBe(true, 'Items are still displayed');
    });

    it('[C213227] on Favorites', async () => {
      await page.clickFavoritesAndWait();
      expect(await dataTable.getRowsCount()).toBe(1, 'Incorrect number of items');
      await adminApiActions.sites.deleteSiteMember(sitePrivate, username);
      await page.refresh();
      expect(await dataTable.isEmpty()).toBe(true, 'Items are still displayed');
    });

    it('[C213116] on Shared Files', async () => {
      await page.clickSharedFilesAndWait();
      expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName} not displayed`);
      await adminApiActions.sites.deleteSiteMember(sitePrivate, username);
      await page.refresh();
      expect(await dataTable.isItemPresent(fileName)).toBe(false, `${fileName} is displayed`);
    });

    it('[C290122] on Search Results', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchFor(fileName);
      await dataTable.waitForBody();

      expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName} is not displayed`);

      await adminApiActions.sites.deleteSiteMember(sitePrivate, username);

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
      await adminApiActions.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE);
      await adminApiActions.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_COLLABORATOR.ROLE);
      const docLibId = await adminApiActions.sites.getDocLibId(sitePrivate);
      fileId = (await apis.user.nodes.createFile(fileName, docLibId)).entry.id;
      await apis.user.favorites.addFavoriteById('file', fileId);

      await userActions.login(username, username);
      await userActions.shareNodes([fileId]);
      await apis.user.shared.waitForFilesToBeShared([fileId]);

      await apis.user.search.waitForApi(username, { expect: 1 });
      await adminApiActions.sites.deleteSiteMember(sitePrivate, username);
      await loginPage.loginWith(username);
      done();
    });

    afterAll(async (done) => {
      await adminApiActions.sites.deleteSite(sitePrivate);
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
      expect(await dataTable.isItemPresent(fileName)).toBe(true, `${fileName} not displayed`);
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
