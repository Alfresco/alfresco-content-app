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

import { test as base } from '@playwright/test';
import {
  MyLibrariesPage,
  FileActionsApi,
  NodesPage,
  PersonalFilesPage,
  RecentFilesPage,
  SharedLinksApi,
  SharedPage,
  SearchPage,
  FavoritesPage,
  FavoritesPageApi,
  TrashPage,
  LoginPage,
  NodesApi,
  SitesApi,
  users,
  FavoritesLibrariesPage
} from '../';

interface Pages {
  personalFiles: PersonalFilesPage;
  nodesPage: NodesPage;
  myLibrariesPage: MyLibrariesPage;
  recentFilesPage: RecentFilesPage;
  sharedPage: SharedPage;
  searchPage: SearchPage;
  favoritePage: FavoritesPage;
  favoritesLibrariesPage: FavoritesLibrariesPage;
  trashPage: TrashPage;
  loginPage: LoginPage;
  favoriteLibrariesPage: FavoritesLibrariesPage;
}

interface Api {
  fileAction: FileActionsApi;
  shareAction: SharedLinksApi;
  favoritesPageAction: FavoritesPageApi;
  nodesApiAction: NodesApi;
  sitesApiAction: SitesApi;
}

export const test = base.extend<Pages & Api>({
  personalFiles: async ({ page }, use) => {
    await use(new PersonalFilesPage(page));
  },
  nodesPage: async ({ page }, use) => {
    await use(new NodesPage(page));
  },
  recentFilesPage: async ({ page }, use) => {
    await use(new RecentFilesPage(page));
  },
  sharedPage: async ({ page }, use) => {
    await use(new SharedPage(page));
  },
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
  favoritePage: async ({ page }, use) => {
    await use(new FavoritesPage(page));
  },
  favoritesLibrariesPage: async ({ page }, use) => {
    await use(new FavoritesLibrariesPage(page));
  },
  trashPage: async ({ page }, use) => {
    await use(new TrashPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  // eslint-disable-next-line no-empty-pattern
  fileAction: async ({}, use) => {
    await use(await FileActionsApi.initialize(users.hruser.username));
  },
  // eslint-disable-next-line no-empty-pattern
  shareAction: async ({}, use) => {
    await use(await SharedLinksApi.initialize(users.hruser.username));
  },
  // eslint-disable-next-line no-empty-pattern
  favoritesPageAction: async ({}, use) => {
    await use(await FavoritesPageApi.initialize(users.hruser.username));
  },
  // eslint-disable-next-line no-empty-pattern
  nodesApiAction: async ({}, use) => {
    await use(await NodesApi.initialize(users.admin.username, users.admin.password));
  },
  // eslint-disable-next-line no-empty-pattern
  sitesApiAction: async ({}, use) => {
    await use(await SitesApi.initialize(users.hruser.username));
  },
  myLibrariesPage: async ({ page }, use) => {
    await use(new MyLibrariesPage(page));
  },
  favoriteLibrariesPage: async ({ page }, use) => {
    await use(new FavoritesLibrariesPage(page));
  }
});
