/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import {
  ApiClientFactory,
  NodesApi,
  PersonalFilesPage,
  RepositoryTestData,
  RecentFilesPage,
  test,
  timeouts,
  TrashcanApi,
  users,
  Utils,
  cleanupRepositoryTestData,
  seedRepositoryTestData
} from '@alfresco/aca-playwright-shared';
import { expect } from '@playwright/test';

test.describe('Copy / Move — Repository destination', () => {
  const admin = users.admin;
  const REPOSITORY_LOCATION_LABEL = 'Repository';

  let userNodesApi: NodesApi;
  let adminNodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let testData!: RepositoryTestData;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      userNodesApi = await NodesApi.initialize('admin');
      adminNodesApi = userNodesApi;
      trashcanApi = await TrashcanApi.initialize('admin');
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
      throw error;
    }
  });

  test.beforeEach(async ({ loginPage, personalFiles }) => {
    testData = await seedRepositoryTestData({ userNodesApi, adminNodesApi });

    await Utils.tryLoginUser(loginPage, admin.username, admin.password, 'beforeEach failed');
    await personalFiles.navigate();
  });

  test.afterEach(async () => {
    await cleanupRepositoryTestData(testData, { adminNodesApi });
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(adminNodesApi, trashcanApi, 'afterAll failed');
  });

  const openDialogOnRepository = async (personalFiles: PersonalFilesPage, fileName: string, operation: 'Copy' | 'Move') => {
    await Utils.reloadPageIfRowNotVisible(personalFiles, fileName);
    await personalFiles.dataTable.selectItems(fileName);
    await personalFiles.clickMoreActionsButton(operation);
    await personalFiles.contentNodeSelector.selectLocation(REPOSITORY_LOCATION_LABEL);
    await personalFiles.contentNodeSelector.spinnerWaitForReload();
  };

  test('[XAT-19598] Copy a Personal file into a Repository folder (via search)', async ({ personalFiles }) => {
    await openDialogOnRepository(personalFiles, testData.personalFile.name, 'Copy');
    await personalFiles.contentNodeSelector.searchAndSelectDestination(testData.repoFolder.name);
    await personalFiles.contentNodeSelector.actionButton.click();

    const msg = await personalFiles.snackBar.message.innerText();
    expect.soft(msg, 'Success snackbar did not confirm copy').toContain('Copied 1 item');

    expect.soft(await personalFiles.dataTable.isItemPresent(testData.personalFile.name), 'Original personal file disappeared after Copy').toBe(true);

    await personalFiles.navigate({ remoteUrl: `#/repository/${testData.repoFolder.id}` });
    await personalFiles.dataTable.spinnerWaitForReload();
    expect(await personalFiles.dataTable.isItemPresent(testData.personalFile.name), 'Copy is missing in Repository folder').toBe(true);
  });

  test('[XAT-19599] Move a Personal file into a Repository folder (via search)', async ({ personalFiles }) => {
    await openDialogOnRepository(personalFiles, testData.personalFile.name, 'Move');
    await personalFiles.contentNodeSelector.searchAndSelectDestination(testData.repoFolder.name);
    await personalFiles.contentNodeSelector.actionButton.click();

    const msg = await personalFiles.snackBar.message.innerText();
    expect.soft(msg, 'Success snackbar did not confirm move').toContain('Moved 1 item');
    await personalFiles.snackBar.closeIcon.click();
    await personalFiles.dataTable.spinnerWaitForReload();

    expect
      .soft(await personalFiles.dataTable.isItemPresent(testData.personalFile.name), 'Original personal file still visible after Move')
      .toBe(false);

    await personalFiles.navigate({ remoteUrl: `#/repository/${testData.repoFolder.id}` });
    await personalFiles.dataTable.spinnerWaitForReload();
    expect(await personalFiles.dataTable.isItemPresent(testData.personalFile.name), 'Moved file is missing in Repository folder').toBe(true);
  });

  test.describe('from Recent Files', () => {
    let recentFileName: string;
    let recentFileId: string;
    let recentDestFolderId: string;
    let recentDestFolderName: string;

    test.beforeAll(async () => {
      recentFileName = `recent-repo-file-${Utils.random()}.txt`;
      recentDestFolderName = `recent-repo-dest-${Utils.random()}`;
      recentFileId = (await adminNodesApi.createFile(recentFileName, '-root-')).entry.id;
      recentDestFolderId = (await adminNodesApi.createFolder(recentDestFolderName, '-root-')).entry.id;
    });

    test.beforeEach(async ({ recentFilesPage }) => {
      await recentFilesPage.navigate();
      await recentFilesPage.dataTable.spinnerWaitForReload();
      await waitForRowByReloading(recentFilesPage, recentFileName);
    });

    test.afterAll(async () => {
      try {
        await adminNodesApi.deleteNodes([recentFileId, recentDestFolderId], true);
      } catch (error) {
        console.error(`TS-16 afterAll cleanup failed: ${error}`);
      }
    });

    test('[XAT-19600] Copy a Repository file from the Recent Files view into a Repository folder', async ({ recentFilesPage }) => {
      await recentFilesPage.dataTable.selectItems(recentFileName);
      await recentFilesPage.acaHeader.clickMoreActions();
      await recentFilesPage.matMenu.clickMenuItem('Copy');

      await recentFilesPage.contentNodeSelector.selectLocation(REPOSITORY_LOCATION_LABEL);
      await recentFilesPage.contentNodeSelector.spinnerWaitForReload();
      await recentFilesPage.contentNodeSelector.searchAndSelectDestination(recentDestFolderName);
      await recentFilesPage.contentNodeSelector.actionButton.click();

      const msg = await recentFilesPage.snackBar.message.innerText();
      expect.soft(msg, 'Success snackbar did not confirm copy').toContain('Copied 1 item');

      await recentFilesPage.page.goto(`${recentFilesPage.page.url().split('#')[0]}#/repository/${recentDestFolderId}`);
      await recentFilesPage.dataTable.spinnerWaitForReload();
      expect(await recentFilesPage.dataTable.isItemPresent(recentFileName), 'Copied Repository file is missing in destination folder').toBe(true);
    });
  });
});

async function waitForRowByReloading(page: RecentFilesPage, name: string, maxAttempts = 12): Promise<void> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (await page.dataTable.getRowByName(name).isVisible()) {
      return;
    }
    await page.page.waitForTimeout(timeouts.tiny);
    await page.page.reload({ waitUntil: 'load' });
    await page.dataTable.spinnerWaitForReload();
  }
  throw new Error(`Row "${name}" did not appear in Recent Files after ${maxAttempts} attempts`);
}
