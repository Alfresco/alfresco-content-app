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

test.describe('Repository — Trash restore [ACS-12055]', () => {
  const admin = users.admin;

  let adminNodesApi: NodesApi;
  let trashcanApi: TrashcanApi;

  let repoFolderName: string;
  let repoFolderId: string;
  let repoFileName: string;
  let repoFileId: string;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      adminNodesApi = await NodesApi.initialize('admin');
      trashcanApi = await TrashcanApi.initialize('admin');

      repoFolderName = `repo-folder-restore-${Utils.random()}`;
      repoFileName = `repo-file-restore-${Utils.random()}.txt`;
      repoFolderId = (await adminNodesApi.createFolder(repoFolderName, '-root-')).entry.id;
      repoFileId = (await adminNodesApi.createFile(repoFileName, repoFolderId)).entry.id;

      await adminNodesApi.deleteNodes([repoFileId], false);
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, admin.username, admin.password, 'beforeEach failed');
  });

  test.afterAll(async () => {
    try {
      await adminNodesApi.deleteNodes([repoFolderId], true);
    } catch (error) {
      console.error(`Repository folder cleanup failed: ${error}`);
    }
    await Utils.deleteNodesSitesEmptyTrashcan(adminNodesApi, trashcanApi, 'afterAll failed');
  });

  test('[XAT-19601] Restoring a Repository file from Trash lands it back in the Repository folder', async ({ trashPage, personalFiles }) => {
    await trashPage.navigate();
    await trashPage.dataTable.spinnerWaitForReload();
    await expect(trashPage.dataTable.getRowByName(repoFileName)).toBeVisible();

    await trashPage.dataTable.selectItems(repoFileName);
    await trashPage.acaHeader.restoreButton.click();
    await trashPage.snackBar.verifySnackBarActionText(`${repoFileName} restored`);

    await expect(trashPage.dataTable.getRowByName(repoFileName), `${repoFileName} should be gone from Trash after restore`).toBeHidden();

    await personalFiles.navigate({ remoteUrl: `#/repository/${repoFolderId}` });
    await personalFiles.dataTable.spinnerWaitForReload();
    expect(
      await personalFiles.dataTable.isItemPresent(repoFileName),
      `Restored file should reappear inside the original Repository folder (${repoFolderName})`
    ).toBe(true);

    const url = personalFiles.page.url();
    expect(url, 'Repository view must stay on /repository').toContain(`/repository/${repoFolderId}`);
    expect(url, 'Restored Repository file must not force a /personal-files navigation').not.toContain('/personal-files/');
  });
});
