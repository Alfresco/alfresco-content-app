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

import { browser } from 'protractor';

import { AdminActions, APP_ROUTES, LoginPage, BrowsingPage, Utils, RepoClient } from '@alfresco/aca-testing-shared';

describe('Personal Files', () => {
  const username = `user-${Utils.random()}`;

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;

  const adminFolder = `admin-folder-${Utils.random()}`;

  const userFolder = `user-folder-${Utils.random()}`;
  const userFile = `file-${Utils.random()}.txt`;
  const adminApiActions = new AdminActions();

  beforeAll(async (done) => {
    await Promise.all([adminApiActions.createUser({ username }), adminApiActions.nodes.createFolders([adminFolder])]);
    await apis.user.nodes.createFolders([userFolder]);
    await apis.user.nodes.createFiles([userFile], userFolder);
    done();
  });

  afterAll(async (done) => {
    await Promise.all([adminApiActions.nodes.deleteNodes([adminFolder]), apis.user.nodes.deleteNodes([userFolder])]);
    done();
  });

  describe(`Admin user's personal files`, () => {
    beforeAll(async (done) => {
      await loginPage.loginWithAdmin();
      done();
    });

    beforeEach(async (done) => {
      await page.clickPersonalFilesAndWait();
      done();
    });

    it('[C213241] has Data Dictionary and created content', async () => {
      expect(await dataTable.isItemPresent('Data Dictionary')).toBe(true, 'Data Dictionary not displayed');
      expect(await dataTable.isItemPresent(adminFolder)).toBe(true, 'admin folder not displayed');
    });
  });

  describe(`Regular user's personal files`, () => {
    beforeAll(async (done) => {
      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.clickPersonalFilesAndWait();
      done();
    });

    it('[C217142] has the correct columns', async () => {
      const expectedColumns = ['Name', 'Size', 'Modified', 'Modified by'];
      const actualColumns = await dataTable.getColumnHeadersText();

      await expect(actualColumns).toEqual(expectedColumns);
    });

    it('[C217143] has default sorted column', async () => {
      await expect(await dataTable.getSortedColumnHeaderText()).toBe('Name');
    });

    it('[C213242] has user created content', async () => {
      await expect(await dataTable.isItemPresent(userFolder)).toBe(true, 'user folder not displayed');
    });

    it('[C213244] navigates to folder', async () => {
      const nodeId = (await apis.user.nodes.getNodeByPath(`/${userFolder}`)).entry.id;

      await dataTable.doubleClickOnRowByName(userFolder);
      await dataTable.waitForHeader();

      expect(await browser.getCurrentUrl()).toContain(nodeId, 'Node ID is not in the URL');
      expect(await dataTable.isItemPresent(userFile)).toBe(true, 'user file is missing');
    });

    it('[C213245] redirects to Personal Files on clicking the link from sidebar', async () => {
      await page.dataTable.doubleClickOnRowByName(userFolder);
      await page.clickPersonalFiles();
      const url = await browser.getCurrentUrl();
      expect(url.endsWith(APP_ROUTES.PERSONAL_FILES)).toBe(true, 'incorrect url');
    });

    it('[C213246] page loads correctly after browser refresh', async () => {
      await page.refresh();
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
    });

    it('[C213247] page load by URL', async () => {
      const url = await browser.getCurrentUrl();
      await page.clickTrash();
      await browser.get(url);
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
    });
  });
});
