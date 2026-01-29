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

import { ApiClientFactory, FavoritesPageApi, NodesApi, test, timeouts, Utils, TrashcanApi } from '@alfresco/aca-playwright-shared';
import { personalFilesTests } from './personal-files';
import { favoritesTests } from './favorites';

test.describe('Pagination on multiple pages : ', () => {
  const random = Utils.random();
  const username = `user-${random}`;
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let favoritesApi: FavoritesPageApi;

  const parent = `parent-multi-${random}`;
  let initialFavoritesTotalItems: number;

  const apiClientFactory = new ApiClientFactory();

  test.beforeAll(async () => {
    test.setTimeout(timeouts.extendedTest);
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
    nodesApi = await NodesApi.initialize(username, username);
    favoritesApi = await FavoritesPageApi.initialize(username, username);

    const files = Array(51)
      .fill('my-file')
      .map((name, index): string => `${name}-${index + 1}-${random}.txt`);

    await nodesApi.createFolder(parent);
    const filesIds = (await nodesApi.createFiles(files, parent)).list.entries.map((entries) => entries.entry.id);
    initialFavoritesTotalItems = await favoritesApi.getFavoritesTotalItems(username);

    await favoritesApi.addFavoritesByIds('file', filesIds);
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test.describe('on Personal Files', () => {
    personalFilesTests(username, parent);
  });

  test.describe('on Favorites', () => {
    test.beforeAll(async () => {
      await favoritesApi.waitForApi(username, { expect: initialFavoritesTotalItems + 51 });
    });

    favoritesTests(username);
  });
});
