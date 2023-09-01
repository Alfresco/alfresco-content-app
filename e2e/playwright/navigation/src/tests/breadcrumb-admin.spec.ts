/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ApiClientFactory, getUserState, test, Utils } from '@alfresco/playwright-shared';

test.describe('as admin', () => {
  const apiClientFactory = new ApiClientFactory();
  const userFolder = `userFolder-${Utils.random()}`;
  const username = `userAdmin-${Utils.random()}`;
  let userFolderId: string;

  test.beforeAll(async ({ userActions }) => {
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
    await userActions.setUpUserAcaBackend(username, username);
    const node = await userActions.nodesApi.createNode('-my-', { name: userFolder, nodeType: 'cm:folder', relativePath: '/' });
    userFolderId = node.entry.id;
  });

  test.afterAll(async () => {
    await apiClientFactory.nodes.deleteNode(userFolderId, { permanent: true });
  });
  test.use({ storageState: getUserState('admin') });
  test(`[C260970] Breadcrumb on navigation to a user's home`, async ({ personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/personal-files/${userFolderId}` });
    expect(await personalFiles.breadcrumb.getAllItems()).toEqual(['Personal Files', 'User Homes', username, userFolder]);
  });
});
