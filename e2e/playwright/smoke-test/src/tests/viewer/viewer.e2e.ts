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
  const usernameViewer = `user-${Utils.random()}`;
  const randomDocxName = `${TEST_FILES.DOCX.name}-${Utils.random()}`;
  const siteAdmin = `siteAdmin-${Utils.random()}`;
  let docLibId: string;
  let folderId: string;
  let fileDocxId: string;
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let siteActionsAdmin: SitesApi;

  test.beforeAll(async () => {
    test.setTimeout(timeouts.globalTest);
    const randomFolderName = `viewer-${Utils.random()}`;
    const apiClientFactory = new ApiClientFactory();
    await apiClientFactory.setUpAcaBackend('admin');
    try {
      await apiClientFactory.createUser({ username: usernameViewer });
    } catch (exception) {
      if (JSON.parse(exception.message).error.statusCode !== 409) {
        throw new Error(`----- beforeAll failed : ${exception}`);
      }
    }
    nodesApi = await NodesApi.initialize(usernameViewer, usernameViewer);
    const fileActionApi = await FileActionsApi.initialize(usernameViewer, usernameViewer);
    trashcanApi = await TrashcanApi.initialize(usernameViewer, usernameViewer);
    siteActionsAdmin = await SitesApi.initialize('admin');
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

    await fileActionApi.waitForNodes(randomDocxName, { expect: 1 });
  });

  test.beforeEach(async ({ personalFiles, loginPage }) => {
    await Utils.tryLoginUser(loginPage, usernameViewer, usernameViewer, 'beforeEach failed');
    await personalFiles.navigate({ remoteUrl: `#/personal-files/${folderId}` });
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed', siteActionsAdmin, [docLibId]);
  });

  test('[XAT-17736] Open viewer with click action', async ({ personalFiles }) => {
    await personalFiles.dataTable.getRowByName(randomDocxName).click();
    await personalFiles.acaHeader.viewButton.click();
    await personalFiles.dataTable.spinnerWaitForReload();
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
  });

  test('[XAT-17737] Check action for viewer to close', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    expect(await personalFiles.viewer.getCloseButtonTooltip()).toEqual('Close');
    await personalFiles.viewer.closeButtonLocator.click();
    await expect(personalFiles.dataTable.getCellLinkByName(randomDocxName), 'Viewer did not close').toBeVisible();
  });

  test('[XAT-17738] Viewer with preview URL', async ({ personalFiles }) => {
    const previewURL = `#/personal-files/${folderId}/(viewer:view/${fileDocxId})`;
    await personalFiles.navigate({ remoteUrl: previewURL });
    await personalFiles.viewer.waitForViewerLoaderToFinish(timeouts.sixtySeconds);
    await expect(personalFiles.viewer.fileTitleButtonLocator).toHaveText(randomDocxName);
  });
});
