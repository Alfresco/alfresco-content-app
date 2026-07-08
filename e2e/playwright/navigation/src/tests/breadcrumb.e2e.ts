/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { expect } from '@playwright/test';
import { ApiClientFactory, TrashcanApi, NodesApi, SitesApi, test, timeouts, Utils } from '@alfresco/aca-playwright-shared';
import { Site } from '@alfresco/js-api';

test.describe('viewer action file', () => {
  test.describe('Personal Files folder hierarchy', () => {
    let nodesApi: NodesApi;
    let trashcanApi: TrashcanApi;
    const username = `breadcrumb-pf-${Utils.random()}`;
    const parent = `parent-viewer-${Utils.random()}`;
    const subFolder1 = `subFolder1-${Utils.random()}`;
    const subFolder2 = `subFolder2-${Utils.random()}`;
    const fileName1 = `file1-${Utils.random()}.txt`;
    let subFolder1Id: string;
    let subFolder2Id: string;

    test.beforeAll(async () => {
      test.setTimeout(timeouts.extendedTest);
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      const parentId = (await nodesApi.createFolder(parent)).entry.id;
      subFolder1Id = (await nodesApi.createFolder(subFolder1, parentId)).entry.id;
      subFolder2Id = (await nodesApi.createFolder(subFolder2, subFolder1Id)).entry.id;
      await nodesApi.createFile(fileName1, subFolder2Id);
    });

    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    });

    test('[XAT-4387] Personal Files breadcrumb main node', async ({ personalFiles }) => {
      await personalFiles.navigate({ remoteUrl: `#/personal-files/` });
      await expect(personalFiles.breadcrumb.items).toHaveCount(1);
      await expect(personalFiles.breadcrumb.currentItem).toHaveText('Personal Files');
    });

    test('[XAT-4388] Personal Files breadcrumb for a folder hierarchy', async ({ personalFiles }) => {
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${subFolder2Id}` });
      const expectedBreadcrumb = ['Personal Files', parent, subFolder1, subFolder2];
      expect(await personalFiles.breadcrumb.getAllItems()).toEqual(expectedBreadcrumb);
    });

    test('[XAT-4396] User can navigate to any location by clicking on any step from the breadcrumb', async ({ personalFiles }) => {
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${subFolder2Id}` });
      await personalFiles.breadcrumb.clickItem(subFolder1);
      await personalFiles.dataTable.spinnerWaitForReload();
      const expectedBreadcrumb = ['Personal Files', parent, subFolder1];
      expect(await personalFiles.breadcrumb.getAllItems()).toEqual(expectedBreadcrumb);
    });

    test('[XAT-4397] Tooltip appears on hover on a step in breadcrumb', async ({ personalFiles }) => {
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${subFolder2Id}` });
      const item = personalFiles.breadcrumb.items.nth(2);
      await expect(item).toHaveAttribute('title', subFolder1);
    });

    test('[XAT-4399] Browser back navigates to previous location regardless of breadcrumb steps', async ({ personalFiles, trashPage }) => {
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${subFolder2Id}` });
      await trashPage.navigate();
      await personalFiles.page.goBack();
      await personalFiles.dataTable.spinnerWaitForReload();
      const expectedBreadcrumb = ['Personal Files', parent, subFolder1, subFolder2];
      expect(await personalFiles.breadcrumb.getAllItems()).toEqual(expectedBreadcrumb);
    });
  });

  test.describe('My Libraries folder hierarchy', () => {
    let nodesApi: NodesApi;
    let siteActions: SitesApi;
    let trashcanApi: TrashcanApi;
    const username = `breadcrumb-lib-${Utils.random()}`;
    const siteName = `site-breadcrumb-${Utils.random()}`;
    const parentFromSite = `parent-in-site-${Utils.random()}`;
    const subFolder1FromSite = `subFolder1-in-site-${Utils.random()}`;
    const subFolder2FromSite = `subFolder2-in-site-${Utils.random()}`;
    const fileName1FromSite = `file1-in-site-${Utils.random()}.txt`;
    let docLibId: string;
    let subFolder2FromSiteId: string;

    test.beforeAll(async () => {
      test.setTimeout(timeouts.extendedTest);
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      siteActions = await SitesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      await siteActions.createSite(siteName, Site.VisibilityEnum.PUBLIC);
      docLibId = await siteActions.getDocLibId(siteName);
      const parentFromSiteId = (await nodesApi.createFolder(parentFromSite, docLibId)).entry.id;
      const subFolder1FromSiteId = (await nodesApi.createFolder(subFolder1FromSite, parentFromSiteId)).entry.id;
      subFolder2FromSiteId = (await nodesApi.createFolder(subFolder2FromSite, subFolder1FromSiteId)).entry.id;
      await nodesApi.createFile(fileName1FromSite, subFolder2FromSiteId);
    });

    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed', siteActions, [siteName]);
    });

    test('[XAT-4391] My Libraries breadcrumb for a folder hierarchy', async ({ myLibrariesPage }) => {
      await myLibrariesPage.navigate({ remoteUrl: `#/libraries/${subFolder2FromSiteId}` });
      const expectedItems = ['My Libraries', siteName, parentFromSite, subFolder1FromSite, subFolder2FromSite];
      expect(await myLibrariesPage.breadcrumb.getAllItems()).toEqual(expectedItems);
    });
  });

  test.describe('Folder rename', () => {
    let nodesApi: NodesApi;
    let trashcanApi: TrashcanApi;
    const username = `breadcrumb-rename-${Utils.random()}`;
    const parent2 = `parent2-${Utils.random()}`;
    const folder1 = `folder1-${Utils.random()}`;
    const folder1Renamed = `renamed-${Utils.random()}`;
    let folder1Id: string;

    test.beforeAll(async () => {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      const parent2Id = (await nodesApi.createFolder(parent2)).entry.id;
      folder1Id = (await nodesApi.createFolder(folder1, parent2Id)).entry.id;
    });

    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    });

    test('[XAT-4398] Breadcrumb updates correctly when folder is renamed', async ({ personalFiles, nodesApiAction }) => {
      await nodesApiAction.renameNode(folder1Id, folder1Renamed);
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${folder1Id}` });
      await personalFiles.page.reload();
      await personalFiles.dataTable.spinnerWaitForReload();
      await expect(personalFiles.breadcrumb.currentItem).toHaveText(folder1Renamed);
    });
  });
});
