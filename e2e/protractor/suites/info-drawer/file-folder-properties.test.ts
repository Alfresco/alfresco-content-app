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

import { AdminActions, LoginPage, BrowsingPage, RepoClient, InfoDrawer, Utils, FILES, click, rightClick } from '@alfresco/aca-testing-shared';

describe('File / Folder properties', () => {
  const username = `user1-${Utils.random()}`;

  const parent = `parent-${Utils.random()}`;
  let parentId: string;

  const file1 = {
    name: `file1-${Utils.random()}.txt`,
    title: 'file title',
    description: 'file description',
    author: 'file author',
    contentType: 'Content'
  };

  const image1 = {
    name: FILES.jpgFile,
    title: 'image title',
    description: 'image description',
    author: 'image author'
  };

  const folder1 = {
    name: `folder1-${Utils.random()}`,
    title: 'folder title',
    description: 'folder description',
    author: 'folder author',
    contentType: 'Folder'
  };

  const apis = {
    user: new RepoClient(username, username)
  };

  const infoDrawer = new InfoDrawer();

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;
  const adminApiActions = new AdminActions();

  beforeAll(async () => {
    await adminApiActions.createUser({ username });
    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
    await apis.user.nodes.createFile(file1.name, parentId, file1.title, file1.description, file1.author);
    await apis.user.nodes.createFolder(folder1.name, parentId, folder1.title, folder1.description, folder1.author);
    await apis.user.upload.uploadFile(image1.name, parentId);

    await loginPage.loginWith(username);
  });

  afterAll(async () => {
    await apis.user.nodes.deleteNodeById(parentId);
  });

  beforeEach(async () => {
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(parent);
  });

  describe('View properties', () => {
    it('[C299162] Default tabs', async () => {
      await dataTable.selectItem(file1.name);
      await click(page.toolbar.viewDetailsButton);
      await infoDrawer.waitForInfoDrawerToOpen();

      expect(await infoDrawer.getHeaderTitle()).toEqual(file1.name);
      expect(await infoDrawer.isPropertiesTabDisplayed()).toBe(true, 'Properties tab is not displayed');
      expect(await infoDrawer.isCommentsTabDisplayed()).toBe(true, 'Comments tab is not displayed');
      expect(await infoDrawer.getTabsCount()).toBe(2, 'Incorrect number of tabs');
    });

    it('[C599174] Should be able to make the files/folders info drawer expandable as for Sites', async () => {
      await dataTable.selectItem(file1.name);
      await click(page.toolbar.viewDetailsButton);
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.expandDetailsButton.click();
      expect(await infoDrawer.expandedDetailsPermissionsTab.isPresent()).toBe(true, 'Permissions tab is not displayed');

      await page.clickPersonalFilesAndWait();
      await dataTable.selectItem(parent);
      await rightClick(dataTable.selectedRow);
      await dataTable.menu.clickMenuItem('Permissions');
      const expectedSelectedTabTitle = 'permissions';
      const actualSelectedTabTitle = await infoDrawer.selectedTab.getText();

      expect(actualSelectedTabTitle.toLowerCase()).toEqual(expectedSelectedTabTitle);
    });
  });
});
