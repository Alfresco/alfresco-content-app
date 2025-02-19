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
  FavoritesPageApi,
  FileActionsApi,
  NodesApi,
  SharedLinksApi,
  SitesApi,
  test,
  TEST_FILES,
  timeouts,
  Utils,
  TrashcanApi
} from '@alfresco/aca-playwright-shared';
import { Site } from '@alfresco/js-api';

test.describe('Image file zoom activity in viewer', () => {
  const username = `user-${Utils.random()}`;
  const randomJpgName = `${TEST_FILES.JPG_FILE.name}-${Utils.random()}.jpg`;
  const siteUser = `siteUser-${Utils.random()}`;
  const fileInSite = TEST_FILES.DOCX.name;
  const siteAdmin = `siteAdmin-${Utils.random()}`;
  const fileAdmin = TEST_FILES.XLSX.name;
  let fileAdminId: string;
  let docLibId: string;
  let docLibSiteUserId: string;
  let folderId: string;
  let fileJpgId: string;
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let siteActionsAdmin: SitesApi;
  let siteActionsUser: SitesApi;

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
    const shareActions = await SharedLinksApi.initialize(username, username);
    const favoritesActions = await FavoritesPageApi.initialize(username, username);
    siteActionsUser = await SitesApi.initialize(username, username);
    siteActionsAdmin = await SitesApi.initialize('admin');
    const fileActionApiAdmin = await FileActionsApi.initialize('admin');
    const node = await nodesApi.createFolder(randomFolderName);
    folderId = node.entry.id;
    const fileJpg = await fileActionApi.uploadFile(TEST_FILES.JPG_FILE.path, randomJpgName, folderId);
    fileJpgId = fileJpg.entry.id;
    const consumerFavoritesTotalItems = await favoritesActions.getFavoritesTotalItems(username);
    await shareActions.shareFileById(fileJpgId);
    await favoritesActions.addFavoriteById('file', fileJpgId);

    try {
      await siteActionsAdmin.createSite(siteAdmin, Site.VisibilityEnum.PRIVATE);
    } catch (exception) {
      if (JSON.parse(exception.message).error.statusCode !== 409) {
        throw new Error(`----- beforeAll failed : ${exception}`);
      }
    }

    docLibId = await siteActionsAdmin.getDocLibId(siteAdmin);

    try {
      fileAdminId = (await fileActionApiAdmin.uploadFile(TEST_FILES.JPG_FILE.path, fileAdmin, docLibId)).entry.id;
    } catch (exception) {
      if (JSON.parse(exception.message).error.statusCode !== 409) {
        throw new Error(`----- beforeAll failed : ${exception}`);
      }
    }

    try {
      await siteActionsUser.createSite(siteUser, Site.VisibilityEnum.PUBLIC);
    } catch (exception) {
      if (JSON.parse(exception.message).error.statusCode !== 409) {
        throw new Error(`----- beforeAll failed : ${exception}`);
      }
    }

    docLibSiteUserId = await siteActionsUser.getDocLibId(siteUser);

    try {
      await fileActionApi.uploadFile(TEST_FILES.JPG_FILE.path, fileInSite, docLibSiteUserId);
    } catch (exception) {
      if (JSON.parse(exception.message).error.statusCode !== 409) {
        throw new Error(`----- beforeAll failed : ${exception}`);
      }
    }

    await Promise.all([
      favoritesActions.isFavoriteWithRetry(username, fileJpgId, { expect: true }),
      favoritesActions.waitForApi(username, { expect: consumerFavoritesTotalItems + 2 })
    ]);
    await shareActions.waitForFilesToBeShared([fileJpgId]);
    await fileActionApi.waitForNodes(randomJpgName, { expect: 1 });
  });

  test.beforeEach(async ({ personalFiles, loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    await personalFiles.navigate({ remoteUrl: `#/personal-files/${folderId}` });
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed', siteActionsUser, [docLibSiteUserId]);
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed', siteActionsAdmin, [docLibId]);
  });

  async function validateZoomScaleInViewer(pageToValidate: any): Promise<void> {
    const defaultZoomSize: number = parseInt(await pageToValidate.viewer.zoomScale.innerText(), 10);
    expect(defaultZoomSize).toBe(100);
    await pageToValidate.viewer.zoomInButton.click();
    expect(parseInt(await pageToValidate.viewer.zoomScale.innerText(), 10)).toBeGreaterThan(defaultZoomSize);
    await pageToValidate.viewer.zoomResetButton.click();
    expect(parseInt(await pageToValidate.viewer.zoomScale.innerText(), 10)).toEqual(defaultZoomSize);
    await pageToValidate.viewer.zoomOutButton.click();
    expect(parseInt(await pageToValidate.viewer.zoomScale.innerText(), 10)).toBeLessThan(defaultZoomSize);
    await pageToValidate.viewer.zoomResetButton.click();
    expect(parseInt(await pageToValidate.viewer.zoomScale.innerText(), 10)).toEqual(defaultZoomSize);
  }

  test('[XAT-5488], [XAT-5490] Percentage of the zoom and reset when an image is opened in viewer mode in Personal Files', async ({
    personalFiles
  }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomJpgName);
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    const defaultZoomSize: number = parseInt(await personalFiles.viewer.zoomScale.innerText(), 10);
    expect(defaultZoomSize).toBe(100);
    await validateZoomScaleInViewer(personalFiles);
  });

  test('[XAT-5488], [XAT-5490] Image Viewer does not open when accessing the preview URL for a file without permissions', async ({
    personalFiles
  }) => {
    const previewURL = `#/libraries/${docLibId}/(viewer:view/${fileAdminId})`;
    await personalFiles.navigate({ remoteUrl: `${previewURL}` });
    await expect(personalFiles.viewer.viewerLocator, 'Viewer should not be opened!').toBeHidden();
  });

  test('[XAT-5488], [XAT-5490] Percentage of the zoom and reset when an image is opened in viewer mode in Recent Files', async ({
    personalFiles,
    recentFilesPage
  }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomJpgName);
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await recentFilesPage.navigate();
    await recentFilesPage.reload();
    await recentFilesPage.dataTable.performClickFolderOrFileToOpen(randomJpgName);
    expect(await recentFilesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await validateZoomScaleInViewer(recentFilesPage);
  });

  test('[XAT-5488], [XAT-5490] Percentage of the zoom and reset when an image is opened in viewer mode in Shared Files', async ({ sharedPage }) => {
    await sharedPage.dataTable.performClickFolderOrFileToOpen(randomJpgName);
    expect(await sharedPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    const defaultZoomSize: number = parseInt(await sharedPage.viewer.zoomScale.innerText(), 10);
    expect(defaultZoomSize).toBe(100);
    await validateZoomScaleInViewer(sharedPage);
  });

  test('[XAT-5488], [XAT-5490] Percentage of the zoom and reset when an image is opened in viewer mode in Favorite Files', async ({
    favoriteLibrariesPage
  }) => {
    await favoriteLibrariesPage.dataTable.performClickFolderOrFileToOpen(randomJpgName);
    expect(await favoriteLibrariesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    const defaultZoomSize: number = parseInt(await favoriteLibrariesPage.viewer.zoomScale.innerText(), 10);
    expect(defaultZoomSize).toBe(100);
    await validateZoomScaleInViewer(favoriteLibrariesPage);
  });

  test('[XAT-5488], [XAT-5490] Percentage of the zoom and reset when an image is opened in viewer mode in Libraries Files', async ({
    myLibrariesPage
  }) => {
    await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(randomJpgName);
    expect(await myLibrariesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    const defaultZoomSize: number = parseInt(await myLibrariesPage.viewer.zoomScale.innerText(), 10);
    expect(defaultZoomSize).toBe(100);
    await validateZoomScaleInViewer(myLibrariesPage);
  });
});
