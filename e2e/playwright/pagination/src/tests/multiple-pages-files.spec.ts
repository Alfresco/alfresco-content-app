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

import { ApiClientFactory, NodesApi, test, Utils } from '@alfresco/playwright-shared';
import { personalFilesTests } from './personal-files';

test.describe('Pagination on multiple pages : ', () => {
  const random = Utils.random();
  const username = `user-${random}`;

  const parent = `parent-${random}`;
  let parentId: string;

  const files = Array(51)
    .fill('my-file')
    .map((name, index): string => `${name}-${index + 1}-${random}.txt`);

  const apiClientFactory = new ApiClientFactory();

  test.beforeAll(async () => {
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
    const nodesApi = await NodesApi.initialize(username, username);
    parentId = (await nodesApi.createFolder(parent)).entry.id;

    (await nodesApi.createFiles(files, parent)).list.entries.map((entries: any) => entries.entry.id);
  });

  test.afterAll(async () => {
    await apiClientFactory.nodes.deleteNode(parentId, { permanent: true });
  });

  test.describe('on Personal Files', () => {
    personalFilesTests(username, parent);
  });
});
