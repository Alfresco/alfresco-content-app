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

import { Utils, AdminActions, RepoClient } from '@alfresco/aca-testing-shared';
import { personalFilesTests } from './personal-files';
import { recentFilesTests } from './recent-files';
import { searchResultsTests } from './search-results';
import { sharedFilesTests } from './shared-files';
import { favoritesTests } from './favorites';

describe('Pagination on multiple pages : ', () => {
  const random = Utils.random();
  const username = `user-${random}`;

  const parent = `parent-${random}`;
  let parentId: string;

  const files = Array(51)
    .fill('my-file')
    .map((name, index): string => `${name}-${index + 1}-${random}.txt`);
  let filesIds: string[];

  const userApi = new RepoClient(username, username);
  const adminApiActions = new AdminActions();

  let initialFavoritesTotalItems: number;
  let initialSearchTotalItems: number;

  beforeAll(async () => {
    await adminApiActions.createUser({ username });

    initialSearchTotalItems = await userApi.search.getTotalItems(username);

    parentId = (await userApi.nodes.createFolder(parent)).entry.id;
    filesIds = (await userApi.nodes.createFiles(files, parent)).list.entries.map((entries: any) => entries.entry.id);

    initialFavoritesTotalItems = await userApi.favorites.getFavoritesTotalItems();
    await userApi.shared.shareFilesByIds(filesIds);
    await userApi.favorites.addFavoritesByIds('file', filesIds);
  });

  afterAll(async () => {
    await userApi.nodes.deleteNodeById(parentId);
  });

  describe('on Personal Files', () => {
    personalFilesTests(username, parent);
  });

  describe('on Recent Files', () => {
    beforeAll(async () => {
      await userApi.search.waitForApi(username, { expect: initialSearchTotalItems + 51 });
    });
    recentFilesTests(username);
  });

  describe('on Search Results', () => {
    beforeAll(async () => {
      await userApi.search.waitForApi(username, { expect: initialSearchTotalItems + 51 });
    });
    searchResultsTests(username, random);
  });

  describe('on Shared Files', () => {
    beforeAll(async () => {
      await userApi.shared.waitForFilesToBeShared(filesIds);
    });
    sharedFilesTests(username);
  });

  describe('on Favorites', () => {
    beforeAll(async () => {
      await userApi.favorites.waitForApi({ expect: initialFavoritesTotalItems + 51 });
    });
    favoritesTests(username);
  });
});
