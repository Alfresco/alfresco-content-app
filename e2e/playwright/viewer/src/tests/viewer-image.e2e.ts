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
  TrashcanApi,
  PersonalFilesPage,
  MyLibrariesPage,
  RecentFilesPage,
  FavoritesLibrariesPage,
  SharedPage
} from '@alfresco/aca-playwright-shared';

test.describe('Zoom activity on different files in viewer', () => {
  const username = `user-${Utils.random()}`;
  const randomJpgName = `${TEST_FILES.JPG_FILE.name}-${Utils.random()}.jpg`;
  const randomPngName = `${TEST_FILES.PNG_FILE.name}-${Utils.random()}.png`;
  const randomPdfName = `${TEST_FILES.PDF.name}-${Utils.random()}.pdf`;
  const randomDocxName = `${TEST_FILES.DOCX.name}-${Utils.random()}.docx`;
  let docLibId: string;
  let docLibSiteUserId: string;
  let folderId: string;
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
    const node = await nodesApi.createFolder(randomFolderName);
    folderId = node.entry.id;

    await fileActionApi.uploadFile(TEST_FILES.JPG_FILE.path, randomJpgName, folderId);
    const filePngId = (await fileActionApi.uploadFile(TEST_FILES.PNG_FILE.path, randomPngName, folderId)).entry.id;
    const filePdfId = (await fileActionApi.uploadFile(TEST_FILES.PDF.path, randomPdfName, folderId)).entry.id;
    await fileActionApi.uploadFile(TEST_FILES.DOCX.path, randomDocxName, folderId);

    const consumerFavoritesTotalItems = await favoritesActions.getFavoritesTotalItems(username);
    await shareActions.shareFileById(filePngId);
    await favoritesActions.addFavoriteById('file', filePdfId);

    await Promise.all([
      favoritesActions.isFavoriteWithRetry(username, filePdfId, { expect: true }),
      favoritesActions.waitForApi(username, { expect: consumerFavoritesTotalItems + 2 })
    ]);
    try {
      await shareActions.waitForFilesToBeShared([filePngId]);
      await fileActionApi.waitForNodes(randomPngName, { expect: 1 });
    } catch (exception) {
      if (JSON.parse(exception.message).error.statusCode !== 409) {
        throw new Error(`----- beforeAll failed : ${exception}`);
      }
    }
  });

  test.beforeEach(async ({ personalFiles, loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    await personalFiles.navigate({ remoteUrl: `#/personal-files/${folderId}` });
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed', siteActionsUser, [docLibSiteUserId]);
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed', siteActionsAdmin, [docLibId]);
  });

  async function validateZoomScaleInViewer(
    pageToValidate: PersonalFilesPage | RecentFilesPage | SharedPage | FavoritesLibrariesPage | MyLibrariesPage
  ): Promise<void> {
    const defaultZoomSize: number = parseInt(await pageToValidate.viewer.zoomScale.innerText(), 10);
    expect(defaultZoomSize).toBe(100);
    await pageToValidate.viewer.zoomInButton.click();
    expect(parseInt(await pageToValidate.viewer.zoomScale.innerText(), 10)).toBeGreaterThan(defaultZoomSize);
    await pageToValidate.viewer.zoomOutButton.click();
    expect(parseInt(await pageToValidate.viewer.zoomScale.innerText(), 10)).toEqual(defaultZoomSize);
    await pageToValidate.viewer.zoomOutButton.click();
    expect(parseInt(await pageToValidate.viewer.zoomScale.innerText(), 10)).toBeLessThan(defaultZoomSize);
    await pageToValidate.viewer.zoomInButton.click();
    expect(parseInt(await pageToValidate.viewer.zoomScale.innerText(), 10)).toEqual(defaultZoomSize);
  }

  async function validateZoomResetButtonActivity(pageToValidate: PersonalFilesPage | RecentFilesPage | SharedPage): Promise<void> {
    await pageToValidate.viewer.zoomInButton.click();
    await pageToValidate.viewer.zoomResetButton.click();
    expect(parseInt(await pageToValidate.viewer.zoomScale.innerText(), 10)).toEqual(100);
    await pageToValidate.viewer.zoomInButton.click();
    await pageToValidate.viewer.zoomResetButton.click();
    expect(parseInt(await pageToValidate.viewer.zoomScale.innerText(), 10)).toEqual(100);
  }

  async function validateFitToPageButtonActivity(pageToValidate: FavoritesLibrariesPage | MyLibrariesPage): Promise<void> {
    await pageToValidate.viewer.zoomInButton.click();
    await pageToValidate.viewer.fitToPageButton.click();
    expect(parseInt(await pageToValidate.viewer.zoomScale.innerText(), 10)).toEqual(100);
    await pageToValidate.viewer.zoomInButton.click();
    await pageToValidate.viewer.fitToPageButton.click();
    expect(parseInt(await pageToValidate.viewer.zoomScale.innerText(), 10)).toEqual(100);
  }

  test('[XAT-17637] Percentage of the zoom of a jpg image is opened in viewer mode in Personal Files', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomJpgName);
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await validateZoomScaleInViewer(personalFiles);
  });

  test('[XAT-17650] Percentage of the zoom and reset when a jpg file is opened in viewer mode in Recent Files', async ({
    personalFiles,
    recentFilesPage
  }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomJpgName);
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await recentFilesPage.navigate();
    await recentFilesPage.dataTable.performClickFolderOrFileToOpen(randomJpgName);
    expect(await recentFilesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await validateZoomScaleInViewer(recentFilesPage);
  });

  test('[XAT-17638] Percentage of the zoom of a png image is opened in viewer mode in Shared Files', async ({ sharedPage }) => {
    await sharedPage.dataTable.performClickFolderOrFileToOpen(randomPngName);
    expect(await sharedPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await validateZoomScaleInViewer(sharedPage);
  });

  test('[XAT-17639] Percentage of the zoom and reset when a pdf file is opened in viewer mode in Favorite Files', async ({
    favoriteLibrariesPage
  }) => {
    await favoriteLibrariesPage.dataTable.performClickFolderOrFileToOpen(randomPdfName);
    expect(await favoriteLibrariesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await favoriteLibrariesPage.viewer.waitForZoomPercentageToDisplay();
    await validateZoomScaleInViewer(favoriteLibrariesPage);
  });

  test('[XAT-17640] Percentage of the zoom and reset when a document is opened in viewer mode in Libraries Files', async ({ myLibrariesPage }) => {
    await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    await myLibrariesPage.viewer.waitForViewerLoaderToFinish();
    expect(await myLibrariesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await myLibrariesPage.viewer.waitForZoomPercentageToDisplay();
    await validateZoomScaleInViewer(myLibrariesPage);
  });

  test('[XAT-17641] User can restore the default state of jpg image in viewer mode in Personal Files', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomJpgName);
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await validateZoomResetButtonActivity(personalFiles);
  });

  test('[XAT-17651] User can restore the default state of jpg image in viewer mode in Recent Files', async ({ personalFiles, recentFilesPage }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomJpgName);
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await recentFilesPage.navigate();
    await recentFilesPage.dataTable.performClickFolderOrFileToOpen(randomJpgName);
    expect(await recentFilesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await validateZoomResetButtonActivity(recentFilesPage);
  });

  test('[XAT-17642] User can restore the default state of png image in viewer mode in Shared Files', async ({ sharedPage }) => {
    await sharedPage.dataTable.performClickFolderOrFileToOpen(randomPngName);
    expect(await sharedPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await validateZoomResetButtonActivity(sharedPage);
  });

  test('[XAT-17643] User can restore the default state of pdf file in viewer mode in Favorites Files', async ({ favoriteLibrariesPage }) => {
    await favoriteLibrariesPage.dataTable.performClickFolderOrFileToOpen(randomPdfName);
    expect(await favoriteLibrariesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await favoriteLibrariesPage.viewer.waitForZoomPercentageToDisplay();
    await validateFitToPageButtonActivity(favoriteLibrariesPage);
  });

  test('[XAT-17644] User can restore the default state of a doc file in viewer mode in Libraries Files', async ({ myLibrariesPage }) => {
    await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(randomDocxName);
    await myLibrariesPage.viewer.waitForViewerLoaderToFinish();
    expect(await myLibrariesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await myLibrariesPage.viewer.waitForZoomPercentageToDisplay();
    await validateFitToPageButtonActivity(myLibrariesPage);
  });
});
