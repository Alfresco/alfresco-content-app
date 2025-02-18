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

import { expect } from '@playwright/test';
import {
  ApiClientFactory,
  FileActionsApi,
  NodesApi,
  SitesApi,
  test,
  TEST_FILES,
  timeouts,
  Utils,
  TrashcanApi
} from '@alfresco/aca-playwright-shared';
import { Site } from '@alfresco/js-api';

test.describe('viewer file', () => {
  const username = `user-${Utils.random()}`;
  const randomDocxName = `${TEST_FILES.DOCX.name}-${Utils.random()}`;
  const siteAdmin = `siteAdmin-${Utils.random()}`;
  const fileAdmin = TEST_FILES.XLSX.name;
  let fileAdminId: string;
  let docLibId: string;
  let folderId: string;
  let fileDocxId: string;
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let siteActionsAdmin: SitesApi;

  test.beforeAll(async () => {
    test.setTimeout(timeouts.extendedTest);
    const randomFolderName = `viewer-${Utils.random()}`;
    const apiClientFactory = new ApiClientFactory();
    await apiClientFactory.setUpAcaBackend('admin');
    try {
      await apiClientFactory.createUser({ username });
    } catch (exception) {
      if (JSON.parse(exception.message).error.statusCode !== 409) {
        throw new Error(`----- beforeAll failed : ${exception}`);
      }
    }
    nodesApi = await NodesApi.initialize(username, username);
    const fileActionApi = await FileActionsApi.initialize(username, username);
    trashcanApi = await TrashcanApi.initialize(username, username);
    siteActionsAdmin = await SitesApi.initialize('admin');
    const fileActionApiAdmin = await FileActionsApi.initialize('admin');
    const node = await nodesApi.createFolder(randomFolderName);
    folderId = node.entry.id;
    const fileDoc = await fileActionApi.uploadFile(TEST_FILES.DOCX.path, randomDocxName, folderId);
    fileDocxId = fileDoc.entry.id;

    try {
      await siteActionsAdmin.createSite(siteAdmin, Site.VisibilityEnum.PRIVATE);
    } catch (exception) {
      if (JSON.parse(exception.message).error.statusCode !== 409) {
        throw new Error(`----- beforeAll failed : ${exception}`);
      }
    }

    docLibId = await siteActionsAdmin.getDocLibId(siteAdmin);

    try {
      fileAdminId = (await fileActionApiAdmin.uploadFile(TEST_FILES.DOCX.path, fileAdmin, docLibId)).entry.id;
    } catch (exception) {
      if (JSON.parse(exception.message).error.statusCode !== 409) {
        throw new Error(`----- beforeAll failed : ${exception}`);
      }
    }

    await fileActionApi.waitForNodes(randomDocxName, { expect: 1 });
  });

  test.beforeEach(async ({ personalFiles, loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    await personalFiles.navigate({ remoteUrl: `#/personal-files/${folderId}` });
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed', siteActionsAdmin, [docLibId]);
  });

  test('[C279270] Viewer opens when clicking the View action for a file', async ({ personalFiles }) => {
    await personalFiles.dataTable.getRowByName(randomDocxName).click();
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
    expect(await personalFiles.viewer.getCloseButtonTooltip()).toEqual('Close');
    await personalFiles.viewer.closeButtonLocator.click();
    await expect(personalFiles.dataTable.getCellLinkByName(randomDocxName), 'Viewer did not close').toBeVisible();
  });

  test('[C279285] Viewer opens when accessing the preview URL for a file', async ({ personalFiles }) => {
    const previewURL = `#/personal-files/${folderId}/(viewer:view/${fileDocxId})`;
    await personalFiles.navigate({ remoteUrl: previewURL });
    await personalFiles.dataTable.spinnerWaitForReload();
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await expect(personalFiles.viewer.fileTitleButtonLocator).toHaveText(randomDocxName);
  });

  test('[C279287] Viewer does not open when accessing the preview URL for a file without permissions', async ({ personalFiles }) => {
    const previewURL = `#/libraries/${docLibId}/(viewer:view/${fileAdminId})`;
    await personalFiles.navigate({ remoteUrl: `${previewURL}` });
    await expect(personalFiles.viewer.viewerLocator, 'Viewer should not be opened!').toBeHidden();
  });
});
