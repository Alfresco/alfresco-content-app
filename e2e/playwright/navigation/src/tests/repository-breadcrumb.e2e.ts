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

import { ApiClientFactory, NodesApi, test, TrashcanApi, users, Utils } from '@alfresco/aca-playwright-shared';
import { expect } from '@playwright/test';

test.describe('Repository — Breadcrumb [ACS-12055]', () => {
  const admin = users.admin;

  let adminNodesApi: NodesApi;
  let trashcanApi: TrashcanApi;

  let repoRootName: string;
  let repoRootId: string;
  let subFolderName: string;
  let subFolderId: string;
  let leafFolderName: string;
  let leafFolderId: string;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      adminNodesApi = await NodesApi.initialize('admin');
      trashcanApi = await TrashcanApi.initialize('admin');

      repoRootName = `repo-root-${Utils.random()}`;
      subFolderName = `sub-folder-${Utils.random()}`;
      leafFolderName = `leaf-folder-${Utils.random()}`;

      repoRootId = (await adminNodesApi.createFolder(repoRootName, '-root-')).entry.id;
      subFolderId = (await adminNodesApi.createFolder(subFolderName, repoRootId)).entry.id;
      leafFolderId = (await adminNodesApi.createFolder(leafFolderName, subFolderId)).entry.id;
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, admin.username, admin.password, 'beforeEach failed');
  });

  test.afterAll(async () => {
    try {
      await adminNodesApi.deleteNodes([repoRootId], true);
    } catch (error) {
      console.error(`Repository tree cleanup failed: ${error}`);
    }
    await Utils.deleteNodesSitesEmptyTrashcan(adminNodesApi, trashcanApi, 'afterAll failed');
  });

  test('[XAT-19605] Breadcrumb for a nested Repository folder shows every ancestor and stays on /repository', async ({ personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/repository/${leafFolderId}` });
    await personalFiles.dataTable.spinnerWaitForReload();

    const items = await personalFiles.breadcrumb.getAllItems();
    expect(items, 'Breadcrumb must contain every ancestor plus the current folder').toEqual([
      'Repository',
      repoRootName,
      subFolderName,
      leafFolderName
    ]);

    await expect(personalFiles.breadcrumb.currentItem).toHaveText(leafFolderName);

    await personalFiles.breadcrumb.clickItem(subFolderName);
    await personalFiles.dataTable.spinnerWaitForReload();

    await personalFiles.page.waitForURL(`**/repository/${subFolderId}**`);
    const url = personalFiles.page.url();
    expect(url, 'Breadcrumb navigation must stay on /repository').toContain(`/repository/${subFolderId}`);
    expect(url, 'Breadcrumb navigation must NOT redirect to /personal-files').not.toContain('/personal-files/');

    const trimmed = await personalFiles.breadcrumb.getAllItems();
    expect(trimmed).toEqual(['Repository', repoRootName, subFolderName]);
    await expect(personalFiles.breadcrumb.currentItem).toHaveText(subFolderName);
  });
});
