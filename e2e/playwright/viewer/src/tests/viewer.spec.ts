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
import { getUserState, test, TEST_FILES } from '@alfresco/playwright-shared';

test.use({ storageState: getUserState('admin') });
test.describe('viewer file', () => {
  const randomFolderName = `playwright-folder-${(Math.random() + 1).toString(36).substring(6)}`;
  const randomDocxName = TEST_FILES.DOCX.name + (Math.random() + 1).toString(36).substring(6);
  let folderId: string;
  let testFileId: string;

  test.beforeAll(async ({ superAdminApiClient, fileAction }) => {
    const node = await superAdminApiClient.nodes.createNode('-my-', { name: randomFolderName, nodeType: 'cm:folder', relativePath: '/' });
    folderId = node.entry.id;
    const fileDoc = await fileAction.uploadFile(TEST_FILES.DOCX.path, randomDocxName, folderId);
    testFileId = fileDoc.entry.id;
  });

  test.beforeEach(async ({ personalFiles }) => {
    await personalFiles.navigate({ waitUntil: 'domcontentloaded' });
    await personalFiles.dataTable.goThroughPagesLookingForRowWithName(randomFolderName);
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomFolderName);
  });

  test.afterAll(async ({ superAdminApiClient }) => {
    await superAdminApiClient.nodes.deleteNode(folderId);
  });

  test('[C279269] Viewer opens on double clicking on a file from Personal Files', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
  });

  test('[C279270] Viewer opens when clicking the View action for a file', async ({ personalFiles }) => {
    await personalFiles.dataTable.selectItem(randomDocxName);
    await personalFiles.acaHeader.viewButton.click();
    await personalFiles.dataTable.spinnerWaitForReload();
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
  });

  test('[C279283] The viewer general elements are displayed', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    expect(await personalFiles.viewer.isViewerOpened()).toBe(true);
    await personalFiles.dataTable.spinnerWaitForReload();
    expect(await personalFiles.viewer.isCloseButtonDisplayed(), 'Close button is not displayed').toBe(true);
    expect(await personalFiles.viewer.isFileTitleDisplayed(), 'File title is not displayed').toBe(true);
  });

  test('[C279271] Close the viewer', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await personalFiles.viewer.closeButtonLocator.click();
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer did not close').toBe(false);
  });

  test('[C284632] Close button tooltip', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    expect(await personalFiles.viewer.getCloseButtonTooltip()).toEqual('Close');
  });

  test('[C279285] Viewer opens when accessing the preview URL for a file', async ({ personalFiles, baseURL }) => {
    const previewURL = `personal-files/${folderId}/(viewer:view/${testFileId})`;
    await personalFiles.navigate({ remoteUrl: baseURL + previewURL });
    await personalFiles.dataTable.spinnerWaitForReload();
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    expect(await personalFiles.viewer.fileTitleButtonLocator.innerText()).toEqual(randomDocxName);
  });

  test('[C284636] Viewer opens for a file from Recent Files', async ({ personalFiles, recentFilesPage }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    expect(await personalFiles.viewer.getCloseButtonTooltip()).toEqual('Close');
    await recentFilesPage.navigate();
    await recentFilesPage.reload();
    await recentFilesPage.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    expect(await recentFilesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    expect(await recentFilesPage.viewer.isCloseButtonDisplayed(), 'Close button is not displayed').toBe(true);
    expect(await recentFilesPage.viewer.isFileTitleDisplayed(), 'File title is not displayed').toBe(true);
  });
});
