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
import { ApiClientFactory, NodesApi, TrashcanApi, Utils, test } from '@alfresco/playwright-shared';

test.describe('Generic errors', () => {
  const username = `user-${Utils.random()}`;
  const username2 = `user2-${Utils.random()}`;
  let parentId: string;
  let file1Id: string;
  let file2Id: string;
  let actionUser: NodesApi;

  test.beforeAll(async () => {
    try {
      const parent = `folder-${Utils.random()}`;
      const file1 = `file1-${Utils.random()}.txt`;
      const file2 = `file2-${Utils.random()}.txt`;
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      await apiClientFactory.createUser({ username: username2 });

      actionUser = await NodesApi.initialize(username, username);
      parentId = (await actionUser.createFolder(parent)).entry.id;
      file1Id = (await actionUser.createFile(file1, parentId)).entry.id;
      file2Id = (await actionUser.createFile(file2, parentId)).entry.id;
    } catch (error) {
      console.error(`----- beforeAll failed : ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.afterAll(async () => {
    actionUser = await NodesApi.initialize(username, username);
    const trashcanApi = await TrashcanApi.initialize(username, username);
    await actionUser.deleteNodeById(parentId);
    await trashcanApi.emptyTrashcan();
  });

  test('[C217313] File / folder not found', async ({ personalFiles }) => {
    await actionUser.deleteNodeById(file1Id, false);
    await personalFiles.navigate({ remoteUrl: `#/personal-files/${file1Id}` });

    await expect(personalFiles.errorDialog.genericError, 'Generic error page not displayed').toBeVisible();
    expect(await personalFiles.errorDialog.genericErrorTitle.innerText()).toContain(
      `This item no longer exists or you don't have permission to view it.`
    );
  });

  test('[C217314] Permission denied', async ({ personalFiles, loginPage }) => {
    await loginPage.logoutUser();
    await loginPage.loginUser(
      { username: username2, password: username2 },
      {
        withNavigation: true,
        waitForLoading: true
      }
    );
    await personalFiles.navigate({ remoteUrl: `#/personal-files/${file2Id}` });

    await expect(personalFiles.errorDialog.genericError, 'Generic error page not displayed').toBeVisible();
    expect(await personalFiles.errorDialog.genericErrorTitle.innerText()).toContain(
      `This item no longer exists or you don't have permission to view it.`
    );
  });
});
