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

import { AdminActions, LoginPage, BrowsingPage, InfoDrawer, RepoClient, EXTENSIBILITY_CONFIGS, Utils } from '@alfresco/aca-testing-shared';
import { BrowserActions } from '@alfresco/adf-testing';

describe('Extensions - Info Drawer', () => {
  const username = `user-${Utils.random()}`;

  const file = `file-${Utils.random()}.txt`;
  let fileId: string;

  const properties_tab = {
    order: 1,
    title: 'MY PROPERTIES'
  };

  const custom_tab = {
    order: 2,
    icon: 'mood',
    title: 'MY CUSTOM TITLE',
    component: 'app.toolbar.toggleFavorite'
  };

  const no_title_tab = {
    order: 3,
    icon: 'check_circle',
    title: ''
  };

  const comments_tab = {
    title: 'COMMENTS'
  };

  const repoClient = new RepoClient(username, username);

  const infoDrawer = new InfoDrawer();

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const adminApiActions = new AdminActions();

  beforeAll(async (done) => {
    await adminApiActions.createUser({ username });
    await repoClient.login();

    fileId = (await repoClient.nodes.createFile(file)).entry.id;
    done();
  });

  afterAll(async (done) => {
    await repoClient.nodes.deleteNodeById(fileId);
    done();
  });

  describe('', () => {
    beforeAll(async (done) => {
      await loginPage.load();
      await Utils.setSessionStorageFromConfig(EXTENSIBILITY_CONFIGS.INFO_DRAWER);
      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.clickPersonalFilesAndWait();
      await page.dataTable.clearSelection();
      done();
    });

    it('[C284646] Add a new tab with icon and title', async () => {
      await page.dataTable.selectItem(file);
      await BrowserActions.click(page.toolbar.viewDetailsButton);
      await infoDrawer.waitForInfoDrawerToOpen();

      const val = await infoDrawer.getTabTitle(custom_tab.order);
      expect(await infoDrawer.isTabPresent(custom_tab.title)).toBe(true, `${custom_tab.title} tab is not present`);
      expect(val.trim()).toEqual(`${custom_tab.icon}\n${custom_tab.title}`.trim());
    });

    it('[C284647] Remove existing tab', async () => {
      await page.dataTable.selectItem(file);
      await BrowserActions.click(page.toolbar.viewDetailsButton);
      await infoDrawer.waitForInfoDrawerToOpen();

      expect(await infoDrawer.isTabPresent(comments_tab.title)).toBe(false, `${comments_tab.title} tab should not be present!`);
    });

    it('[C284648] Change tab title', async () => {
      await page.dataTable.selectItem(file);
      await BrowserActions.click(page.toolbar.viewDetailsButton);
      await infoDrawer.waitForInfoDrawerToOpen();

      expect(await infoDrawer.isTabPresent(properties_tab.title)).toBe(true, `${properties_tab.title} tab is not present`);
      expect(await infoDrawer.getTabTitle(properties_tab.order)).toEqual(properties_tab.title);
    });

    it('[C284649] Tab with icon and no title', async () => {
      await page.dataTable.selectItem(file);
      await BrowserActions.click(page.toolbar.viewDetailsButton);
      await infoDrawer.waitForInfoDrawerToOpen();

      expect(await infoDrawer.isTabPresent(no_title_tab.title)).toBe(true, `${no_title_tab.title} tab is not present`);
      expect((await infoDrawer.getTabTitle(no_title_tab.order)).trim()).toEqual(`${no_title_tab.icon}`.trim());
    });

    it('[C284651] Insert new component in tab', async () => {
      await page.dataTable.selectItem(file);
      await BrowserActions.click(page.toolbar.viewDetailsButton);
      await infoDrawer.waitForInfoDrawerToOpen();

      expect(await infoDrawer.isTabDisplayed(custom_tab.title)).toBe(true, `${custom_tab.title} tab is not displayed`);
      await infoDrawer.clickTab(custom_tab.title);
      expect(await infoDrawer.getComponentIdOfTab()).toEqual(custom_tab.component);
    });
  });

  describe('', () => {
    beforeAll(async (done) => {
      await loginPage.load();
      await Utils.setSessionStorageFromConfig(EXTENSIBILITY_CONFIGS.INFO_DRAWER_EMPTY);
      await loginPage.loginWith(username);
      await page.clickPersonalFilesAndWait();
      done();
    });

    it('[C284650] Remove all tabs', async () => {
      await page.dataTable.selectItem(file);
      await BrowserActions.click(page.toolbar.viewDetailsButton);
      await infoDrawer.waitForInfoDrawerToOpen();

      expect(await infoDrawer.isEmpty()).toBe(true, 'Info Drawer is not empty');
    });
  });
});
