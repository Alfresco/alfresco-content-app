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

import { ApiClientFactory, NodesApi, TrashcanApi, Utils, test, LoginPage, PersonalFilesPage } from '@alfresco/aca-playwright-shared';
import { expect } from '@playwright/test';

test.describe('Create Link - creation scenarios', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  const username = `user-${Utils.random()}`;

  let sourceFile: string;
  let sourceFolder: string;
  let destinationFolder: string;

  let sourceFileId: string;
  let destinationFolderId: string;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
      throw error;
    }
  });

  test.beforeEach(async ({ personalFiles, page }) => {
    sourceFile = `source-file-${Utils.random()}.txt`;
    sourceFolder = `source-folder-${Utils.random()}`;
    destinationFolder = `destination-folder-${Utils.random()}`;

    const loginPage = new LoginPage(page);
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');

    sourceFileId = (await nodesApi.createFile(sourceFile)).entry.id;
    await nodesApi.createFolder(sourceFolder);
    destinationFolderId = (await nodesApi.createFolder(destinationFolder)).entry.id;

    await personalFiles.navigate();
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[XAT-19624] Should create a link for a file and verify it in the destination', async ({ personalFiles }) => {
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFile);
    await createLinkInPersonalFiles(personalFiles, [sourceFile], destinationFolder);

    const msg = await personalFiles.snackBar.getSnackBarMessage();
    expect(msg).toContain('Link created for 1 item');

    await personalFiles.navigate({ remoteUrl: `./#/personal-files/${destinationFolderId}`, waitUntil: 'load' });
    await personalFiles.spinnerWaitForReload();

    const expectedLinkName = `Link to ${sourceFile}.url`;
    expect(await personalFiles.dataTable.isItemPresent(expectedLinkName)).toBe(true);

    const fileLinkIcon = personalFiles.dataTable.getRowByName(expectedLinkName).locator('img[src*="ft_ic_file_link.svg"]');
    await expect(fileLinkIcon).toBeVisible();
  });

  test('[XAT-19625] Should create a link for a folder and verify it in the destination', async ({ personalFiles }) => {
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFolder);
    await createLinkInPersonalFiles(personalFiles, [sourceFolder], destinationFolder);

    const msg = await personalFiles.snackBar.getSnackBarMessage();
    expect(msg).toContain('Link created for 1 item');

    await personalFiles.navigate({ remoteUrl: `./#/personal-files/${destinationFolderId}`, waitUntil: 'load' });
    await personalFiles.spinnerWaitForReload();

    const expectedLinkName = `Link to ${sourceFolder}.url`;
    expect(await personalFiles.dataTable.isItemPresent(expectedLinkName)).toBe(true);

    const folderLinkIcon = personalFiles.dataTable.getRowByName(expectedLinkName).locator('img[src*="ft_ic_folder_shortcut_link.svg"]');
    await expect(folderLinkIcon).toBeVisible();
  });

  test('[XAT-19626] Should create links for multiple files and folders simultaneously', async ({ personalFiles }) => {
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFolder);
    await createLinkInPersonalFiles(personalFiles, [sourceFile, sourceFolder], destinationFolder);

    const msg = await personalFiles.snackBar.getSnackBarMessage();
    expect(msg).toContain('Links created for 2 items');

    await personalFiles.navigate({ remoteUrl: `./#/personal-files/${destinationFolderId}`, waitUntil: 'load' });
    await personalFiles.spinnerWaitForReload();

    expect(await personalFiles.dataTable.isItemPresent(`Link to ${sourceFile}.url`)).toBe(true);
    expect(await personalFiles.dataTable.isItemPresent(`Link to ${sourceFolder}.url`)).toBe(true);
  });

  test('[XAT-19627] Should not allow creating a duplicate link in the same destination', async ({ personalFiles }) => {
    await nodesApi.createFileLink(sourceFileId, destinationFolderId);
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFile);

    await personalFiles.dataTable.selectItems(sourceFile);
    await personalFiles.clickMoreActionsButton('Create Link');
    await personalFiles.contentNodeSelector.selectDestination(destinationFolder);
    await personalFiles.contentNodeSelector.actionButton.click();

    const msg = await personalFiles.snackBar.getSnackBarMessage();
    expect(msg).toContain("Can't create a link, a link with the same name already exists in this location.");
  });

  const createLinkInPersonalFiles = async (personalFilesPage: PersonalFilesPage, itemNames: string[], destinationName: string): Promise<void> => {
    await personalFilesPage.dataTable.selectItems(...itemNames);
    await personalFilesPage.clickMoreActionsButton('Create Link');
    await personalFilesPage.contentNodeSelector.selectDestination(destinationName);
    await personalFilesPage.contentNodeSelector.actionButton.click();
    await personalFilesPage.spinnerWaitForReload();
  };
});
