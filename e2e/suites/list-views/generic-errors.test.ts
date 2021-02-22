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

import { browser } from 'protractor';
import { ApiActions, BrowsingPage, Utils, RepoClient } from '@alfresco/aca-testing-shared';
import { ApiService, UsersActions, LoginPage, UserModel } from '@alfresco/adf-testing';

describe('Generic errors', () => {
  let user: UserModel;

  const parent = `folder-${Utils.random()}`;
  let parentId: string;
  const file1 = `file1-${Utils.random()}.txt`;
  let file1Id: string;
  const file2 = `file2-${Utils.random()}.txt`;

  const apiService = new ApiService();
  const repoClient = new RepoClient(apiService);
  const adminApiService = new ApiService();
  const apiActions = new ApiActions(apiService);
  const usersActions = new UsersActions(adminApiService);

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;

  beforeAll(async (done) => {
    await adminApiService.loginWithProfile('admin');
    user = await usersActions.createUser();
    await apiService.login(user.username, user.password);

    parentId = (await repoClient.nodes.createFolder(parent)).entry.id;
    file1Id = (await repoClient.nodes.createFile(file1, parentId)).entry.id;
    await repoClient.nodes.createFile(file2, parentId);

    await loginPage.login(user.username, user.password);
    done();
  });

  afterAll(async (done) => {
    await apiActions.deleteNodes([parentId]);
    await apiActions.emptyTrashcan();
    done();
  });

  it('[C217313] File / folder not found', async () => {
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(parent);
    await dataTable.doubleClickOnRowByName(file1);
    const URL = await browser.getCurrentUrl();
    await repoClient.nodes.deleteNodeById(file1Id, false);
    await browser.get(URL);

    expect(await page.genericError.isDisplayed()).toBe(true, 'Generic error page not displayed');
    expect(await page.genericErrorTitle.getText()).toContain(`This item no longer exists or you don't have permission to view it.`);
  });

  it('[C217315] Invalid URL', async () => {
    await page.load('/invalid page');

    expect(await page.genericError.isDisplayed()).toBe(true, 'Generic error page not displayed');
    expect(await page.genericErrorTitle.getText()).toContain(`This item no longer exists or you don't have permission to view it.`);
  });

  it('[C217314] Permission denied', async () => {
    await adminApiService.loginWithProfile('admin');
    const user2 = await usersActions.createUser();

    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(parent);
    await dataTable.doubleClickOnRowByName(file2);
    const URL = await browser.getCurrentUrl();
    await loginPage.login(user2.username, user2.password);
    await browser.get(URL);

    expect(await page.genericError.isDisplayed()).toBe(true, 'Generic error page not displayed');
    expect(await page.genericErrorTitle.getText()).toContain(`This item no longer exists or you don't have permission to view it.`);

    await loginPage.login(user.username, user.password);
  });
});
