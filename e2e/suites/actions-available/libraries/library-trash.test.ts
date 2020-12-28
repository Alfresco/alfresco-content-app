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

import { BrowsingPage, RepoClient, Utils, ApiActions } from '@alfresco/aca-testing-shared';
import * as testData from './test-data-libraries';
import * as testUtil from '../test-util';
import { ApiService, UsersActions, LoginPage } from '@alfresco/adf-testing';

describe('Library actions : ', () => {
  const apiService = new ApiService();
  const adminApiService = new ApiService();
  const userApi = new RepoClient(apiService);
  const apiActions = new ApiActions(apiService);
  const usersActions = new UsersActions(adminApiService);

  const loginPage = new LoginPage();
  const page = new BrowsingPage();

  beforeAll(async () => {
    await adminApiService.loginWithProfile('admin');
    const user = await usersActions.createUser();
    await apiService.login(user.username, user.password);

    await userApi.sites.createSite(testData.siteInTrash.name);
    await userApi.sites.createSite(testData.site2InTrash.name);

    await apiActions.deleteSites([testData.siteInTrash.name, testData.site2InTrash.name], false);

    await loginPage.loginWith(user.username, user.password);
  });

  afterAll(async () => {
    await apiActions.emptyTrashcan();
  });

  describe('on Trash', () => {
    beforeAll(async () => {
      await Utils.pressEscape();
      await page.clickTrashAndWait();
    });

    beforeEach(async () => {
      await Utils.pressEscape();
    });

    it('[C326686] single library', async () => {
      await testUtil.checkToolbarPrimary(testData.siteInTrash.name, testData.siteInTrash.trashActions);
      await testUtil.checkContextMenu(testData.siteInTrash.name, testData.siteInTrash.trashActions);
    });

    it('[C326687] multiple libraries', async () => {
      await testUtil.checkMultipleSelContextMenu([testData.siteInTrash.name, testData.site2InTrash.name], testData.trashActions);
      await testUtil.checkMultipleSelToolbarPrimary([testData.siteInTrash.name, testData.site2InTrash.name], testData.trashActions);
    });
  });
});
