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
import { ApiClientFactory, NodesApi, Utils, test, SitesApi, timeouts, SharedLinksApi, TrashcanApi } from '@alfresco/playwright-shared';
import { Site } from '@alfresco/js-api';

test.describe('Shared Files', () => {
  let nodesApi: NodesApi;
  let siteActionsAdmin: SitesApi;
  let trashcanApi: TrashcanApi;

  const username = `user-${Utils.random()}`;
  const siteName = `site-${Utils.random()}`;
  const fileAdmin = `fileSite-${Utils.random()}.txt`;
  const folderUser = `folder-${Utils.random()}`;
  const file1User = `file1-${Utils.random()}.txt`;
  const file2User = `file2-${Utils.random()}.txt`;
  const file3User = `file3-${Utils.random()}.txt`;
  const file4User = `file4-${Utils.random()}.txt`;

  test.beforeAll(async () => {
    test.setTimeout(timeouts.extendedTest);
    const apiClientFactory = new ApiClientFactory();
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
    siteActionsAdmin = await SitesApi.initialize('admin');
    const nodesApiAdmin = await NodesApi.initialize('admin');
    const shareActionsAdmin = await SharedLinksApi.initialize('admin');
    nodesApi = await NodesApi.initialize(username, username);
    trashcanApi = await TrashcanApi.initialize(username, username);
    const shareActions = await SharedLinksApi.initialize(username, username);

    await siteActionsAdmin.createSite(siteName, Site.VisibilityEnum.PUBLIC);
    await siteActionsAdmin.addSiteMember(siteName, username, Site.RoleEnum.SiteConsumer);
    const docLibId = await siteActionsAdmin.getDocLibId(siteName);
    const nodeId = (await nodesApiAdmin.createFile(fileAdmin, docLibId)).entry.id;

    await shareActionsAdmin.shareFileById(nodeId);
    await shareActionsAdmin.waitForFilesToBeShared([nodeId]);

    const folderId = (await nodesApi.createFolder(folderUser)).entry.id;
    const file1Id = (await nodesApi.createFile(file1User, folderId)).entry.id;
    const file2Id = (await nodesApi.createFile(file2User)).entry.id;
    const file3Id = (await nodesApi.createFile(file3User)).entry.id;
    const file4Id = (await nodesApi.createFile(file4User)).entry.id;

    await shareActions.shareFilesByIds([file1Id, file2Id, file3Id, file4Id]);
    await shareActions.waitForFilesToBeShared([file1Id, file2Id, file3Id, file4Id]);

    await nodesApi.deleteNodeById(file2Id);
    await shareActions.unshareFileById(file3Id);

    await shareActions.waitForFilesToNotBeShared([file2Id, file3Id]);
  });

  test.beforeEach(async ({ loginPage, sharedPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    await sharedPage.navigate();
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed', siteActionsAdmin, [siteName]);
  });

  test('[C213113] has the correct columns', async ({ sharedPage }) => {
    const expectedColumns = ['Name', 'Location', 'Size', 'Modified', 'Modified by', 'Shared by', 'Tags'];
    const actualColumns = await sharedPage.dataTable.getColumnHeaders();
    expect(actualColumns).toEqual(expectedColumns);
  });

  test('[C213115] default sorting column', async ({ sharedPage }) => {
    expect(await sharedPage.dataTable.getSortedColumnHeaderText()).toBe('Modified');
    expect(await sharedPage.dataTable.getSortingOrder()).toBe('desc');
  });

  test(`[C213117] file not displayed if it's been deleted`, async ({ sharedPage }) => {
    expect(await sharedPage.dataTable.isItemPresent(file2User), `${file2User} is displayed`).toBe(false);
  });

  test('[C213118] unshared file is not displayed', async ({ sharedPage }) => {
    expect(await sharedPage.dataTable.isItemPresent(file3User), `${file3User} is displayed`).toBe(false);
  });

  test('[C213666] Location column redirect - file in user Home', async ({ sharedPage }) => {
    await sharedPage.dataTable.clickItemLocation(file4User);
    await sharedPage.dataTable.spinnerWaitForReload();
    expect(await sharedPage.breadcrumb.getAllItems()).toEqual(['Personal Files']);
  });

  test('[C280490] Location column redirect - file in folder', async ({ sharedPage }) => {
    await sharedPage.dataTable.clickItemLocation(file1User);
    await sharedPage.dataTable.spinnerWaitForReload();
    expect(await sharedPage.breadcrumb.getAllItems()).toEqual(['Personal Files', folderUser]);
  });

  test('[C280491] Location column redirect - file in site', async ({ sharedPage }) => {
    await sharedPage.dataTable.clickItemLocation(fileAdmin);
    await sharedPage.dataTable.spinnerWaitForReload();
    expect(await sharedPage.breadcrumb.getAllItems()).toEqual(['My Libraries', siteName]);
  });
});
