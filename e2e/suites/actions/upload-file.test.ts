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

import { BrowsingPage, RepoClient, Utils } from '@alfresco/aca-testing-shared';
import { ApiService, LoginPage, UsersActions, UserModel } from '@alfresco/adf-testing';

describe('Upload files', () => {
  let user: UserModel;

  const folder1 = `folder1-${Utils.random()}`;
  let folder1Id: string;

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;

  const apiService = new ApiService();
  const usersActions = new UsersActions(apiService);
  const repo = new RepoClient(apiService);

  beforeAll(async () => {
    user = await usersActions.createUser();
    folder1Id = (await repo.nodes.createFolder(folder1)).entry.id;

    await loginPage.login(user.email, user.password);
  });

  beforeEach(async () => {
    await page.clickPersonalFilesAndWait();
  });

  afterAll(async () => {
    await repo.nodes.deleteNodeById(folder1Id);
  });

  it('Upload a file', async () => {
    await dataTable.doubleClickOnRowByName(folder1);
    await page.sidenav.openNewMenu();
    await page.sidenav.menu.uploadFilesInput.sendKeys(`${__dirname}/create-folder.test.ts`);

    expect(await dataTable.isItemPresent('create-folder.test.ts')).toBe(true, 'file not uploaded');
  });
});
