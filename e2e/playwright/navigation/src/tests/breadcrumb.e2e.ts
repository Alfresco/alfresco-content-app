/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ApiClientFactory, TrashcanApi, NodesApi, SitesApi, test, timeouts, Utils } from '@alfresco/playwright-shared';
import { Site } from '@alfresco/js-api';

test.describe('viewer action file', () => {
  let nodesApi: NodesApi;
  let siteActions: SitesApi;
  let trashcanApi: TrashcanApi;
  const username = `user-${Utils.random()}`;
  const parent = `parent-${Utils.random()}`;
  let parentId: string;
  const subFolder1 = `subFolder1-${Utils.random()}`;
  let subFolder1Id: string;
  const subFolder2 = `subFolder2-${Utils.random()}`;
  let subFolder2Id: string;
  const fileName1 = `file1-${Utils.random()}.txt`;

  const siteName = `site-${Utils.random()}`;
  let docLibId: string;
  const parentFromSite = `parent-in-site-${Utils.random()}`;
  let parentFromSiteId: string;
  const subFolder1FromSite = `subFolder1-in-site-${Utils.random()}`;
  let subFolder1FromSiteId: string;
  const subFolder2FromSite = `subFolder2-in-site-${Utils.random()}`;
  let subFolder2FromSiteId: string;
  const fileName1FromSite = `file1-in-site-${Utils.random()}.txt`;

  const parent2 = `parent2-${Utils.random()}`;
  let parent2Id: string;
  const folder1 = `folder1-${Utils.random()}`;
  let folder1Id: string;
  const folder1Renamed = `renamed-${Utils.random()}`;

  test.beforeAll(async () => {
    test.setTimeout(timeouts.extendedTest);
    const apiClientFactory = new ApiClientFactory();
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
    nodesApi = await NodesApi.initialize(username, username);
    siteActions = await SitesApi.initialize(username, username);
    trashcanApi = await TrashcanApi.initialize(username, username);
    const parentNode = await nodesApi.createFolder(parent);
    parentId = parentNode.entry.id;
    subFolder1Id = (await nodesApi.createFolder(subFolder1, parentId)).entry.id;
    subFolder2Id = (await nodesApi.createFolder(subFolder2, subFolder1Id)).entry.id;
    await nodesApi.createFile(fileName1, subFolder2Id);

    parent2Id = (await nodesApi.createFolder(parent2)).entry.id;
    folder1Id = (await nodesApi.createFolder(folder1, parent2Id)).entry.id;

    await siteActions.createSite(siteName, Site.VisibilityEnum.PUBLIC);
    docLibId = await siteActions.getDocLibId(siteName);
    parentFromSiteId = (await nodesApi.createFolder(parentFromSite, docLibId)).entry.id;
    subFolder1FromSiteId = (await nodesApi.createFolder(subFolder1FromSite, parentFromSiteId)).entry.id;
    subFolder2FromSiteId = (await nodesApi.createFolder(subFolder2FromSite, subFolder1FromSiteId)).entry.id;
    await nodesApi.createFile(fileName1FromSite, subFolder2FromSiteId);
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed', siteActions, [docLibId]);
  });

  test('[C260964] Personal Files breadcrumb main node', async ({ personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/personal-files/` });
    expect(await personalFiles.breadcrumb.items.count(), 'Breadcrumb has incorrect number of items').toEqual(1);
    await expect(personalFiles.breadcrumb.currentItem).toHaveText('Personal Files');
  });

  test('[C260965] Personal Files breadcrumb for a folder hierarchy', async ({ personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/personal-files/${subFolder2Id}` });
    const expectedBreadcrumb = ['Personal Files', parent, subFolder1, subFolder2];
    expect(await personalFiles.breadcrumb.getAllItems()).toEqual(expectedBreadcrumb);
  });

  test('[C260967] File Libraries breadcrumb for a folder hierarchy', async ({ myLibrariesPage }) => {
    await myLibrariesPage.navigate({ remoteUrl: `#/libraries/${subFolder2FromSiteId}` });
    const expectedItems = ['My Libraries', siteName, parentFromSite, subFolder1FromSite, subFolder2FromSite];
    expect(await myLibrariesPage.breadcrumb.getAllItems()).toEqual(expectedItems);
  });

  test('[C213235] User can navigate to any location by clicking on a step from the breadcrumb', async ({ personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/personal-files/${subFolder2Id}` });
    await personalFiles.breadcrumb.clickItem(subFolder1);
    await personalFiles.dataTable.spinnerWaitForReload();
    const expectedBreadcrumb = ['Personal Files', parent, subFolder1];
    expect(await personalFiles.breadcrumb.getAllItems()).toEqual(expectedBreadcrumb);
  });

  test('[C213237] Tooltip appears on hover on a step in breadcrumb', async ({ personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/personal-files/${subFolder2Id}` });
    const item = personalFiles.breadcrumb.items.nth(2);
    await expect(item).toHaveAttribute('title', subFolder1);
  });

  test('[C213238] Breadcrumb updates correctly when folder is renamed', async ({ personalFiles, nodesApiAction }) => {
    await nodesApiAction.renameNode(folder1Id, folder1Renamed);
    await personalFiles.navigate({ remoteUrl: `#/personal-files/${folder1Id}` });
    await personalFiles.page.reload();
    await personalFiles.dataTable.spinnerWaitForReload();
    await expect(personalFiles.breadcrumb.currentItem).toHaveText(folder1Renamed);
  });

  test('[C213240] Browser back navigates to previous location regardless of breadcrumb steps', async ({ personalFiles, trashPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/personal-files/${subFolder2Id}` });
    await trashPage.navigate();
    await personalFiles.page.goBack();
    await personalFiles.dataTable.spinnerWaitForReload();
    const expectedBreadcrumb = ['Personal Files', parent, subFolder1, subFolder2];
    expect(await personalFiles.breadcrumb.getAllItems()).toEqual(expectedBreadcrumb);
  });
});
