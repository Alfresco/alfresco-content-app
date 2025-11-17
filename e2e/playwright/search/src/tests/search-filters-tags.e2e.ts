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
import { ApiClientFactory, Utils, test, NodesApi, TrashcanApi, TagsApi, FileActionsApi } from '@alfresco/aca-playwright-shared';
import { TagPaging } from '@alfresco/js-api';

test.describe('Search - Filters - Tags', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let tagsApiAdmin: TagsApi;
  let fileActionsApi: FileActionsApi;
  let file1Id: string;
  let file2Id: string;
  let tagPaging: TagPaging;

  const random = Utils.random();
  const username = `user1-${random}`;
  const file1 = `${random}-file1`;
  const file2 = `${random}-file2`;
  const tags = [{ tag: `${random}-tag1` }, { tag: `${random}-tag2` }];

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      tagsApiAdmin = await TagsApi.initialize('admin');
      fileActionsApi = await FileActionsApi.initialize(username, username);
      const node1 = await nodesApi.createFile(file1);
      file1Id = node1.entry.id;
      const node2 = await nodesApi.createFile(file2);
      file2Id = node2.entry.id;
      await fileActionsApi.waitForNodes(file1, { expect: 1 });
      await fileActionsApi.waitForNodes(file2, { expect: 1 });
      tagPaging = (await tagsApiAdmin.createTags(tags)) as TagPaging;
      await tagsApiAdmin.assignTagToNode(file1Id, tags[0]);
      await tagsApiAdmin.assignTagToNode(file2Id, tags[1]);
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    await tagsApiAdmin.deleteTags([`${tagPaging.list.entries[0].entry.id}`]);
    await tagsApiAdmin.deleteTags([`${tagPaging.list.entries[1].entry.id}`]);
  });

  test('[XAT-5581] user able to search with tags facet', async ({ searchPage }) => {
    await searchPage.searchWithin(random, 'files');
    await searchPage.searchFiltersTags.filterByTag(searchPage, `${tagPaging.list.entries[0].entry.tag}`);

    await expect(searchPage.dataTable.getRowByName(file1)).toBeVisible();
    await expect(searchPage.dataTable.getRowByName(file2)).toBeHidden();

    await searchPage.searchFiltersTags.clearTagFilter(searchPage);
    await searchPage.searchFiltersTags.filterByTag(searchPage, `${tagPaging.list.entries[1].entry.tag}`);

    await expect(searchPage.dataTable.getRowByName(file1)).toBeHidden();
    await expect(searchPage.dataTable.getRowByName(file2)).toBeVisible();
  });
});
