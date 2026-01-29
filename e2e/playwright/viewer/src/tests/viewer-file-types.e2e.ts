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
  test,
  TEST_FILES,
  Utils,
  TrashcanApi,
  PersonalFilesPage,
  timeouts
} from '@alfresco/aca-playwright-shared';

test.use({ channel: 'chrome' });

test.describe('viewer file types', () => {
  const randomString = Utils.random();
  const username = `user-${randomString}`;
  const randomDocxName = `${TEST_FILES.DOCX.name}-${randomString}.docx`;
  const randomJpgName = `${TEST_FILES.JPG_FILE.name}-${randomString}.jpg`;
  const randomPngName = `${TEST_FILES.PNG_FILE.name}-${randomString}.png`;
  const randomGifName = `${TEST_FILES.GIF_FILE.name}-${randomString}.gif`;
  const randomPdfName = `${TEST_FILES.PDF.name}-${randomString}.pdf`;
  const randomPptxName = `${TEST_FILES.PPTX_FILE.name}-${randomString}.pptx`;
  const randomMp3Name = `${TEST_FILES.MP3_FILE.name}-${randomString}.mp3`;
  const randomMp4Name = `${TEST_FILES.MP4_FILE.name}-${randomString}.mp4`;
  const randomWebmName = `${TEST_FILES.WEBM_FILE.name}-${randomString}.webm`;
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let fileActionApi: FileActionsApi;

  test.beforeAll(async () => {
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
    fileActionApi = await FileActionsApi.initialize(username, username);
    trashcanApi = await TrashcanApi.initialize(username, username);

    const filesToUpload = [
      { path: TEST_FILES.DOCX.path, name: randomDocxName },
      { path: TEST_FILES.JPG_FILE.path, name: randomJpgName },
      { path: TEST_FILES.PNG_FILE.path, name: randomPngName },
      { path: TEST_FILES.GIF_FILE.path, name: randomGifName },
      { path: TEST_FILES.PDF.path, name: randomPdfName },
      { path: TEST_FILES.PPTX_FILE.path, name: randomPptxName },
      { path: TEST_FILES.MP3_FILE.path, name: randomMp3Name },
      { path: TEST_FILES.MP4_FILE.path, name: randomMp4Name },
      { path: TEST_FILES.WEBM_FILE.path, name: randomWebmName }
    ];

    for (const file of filesToUpload) {
      await fileActionApi.uploadFile(file.path, file.name, '-my-');
    }

    await fileActionApi.waitForNodes(randomWebmName, { expect: 1 });
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  async function checkViewerDisplay(
    page: PersonalFilesPage,
    fileName: string,
    fileType: 'viewerImage' | 'viewerDocument' | 'viewerMedia' = 'viewerImage'
  ) {
    await page.dataTable.performClickFolderOrFileToOpen(fileName);
    expect(await page.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await page.viewer.waitForViewerLoaderToFinish(timeouts.fortySeconds);

    const viewerElements = {
      viewerImage: page.viewer.viewerImage,
      viewerDocument: page.viewer.viewerDocument,
      viewerMedia: page.viewer.viewerMedia
    };

    const viewerElement = viewerElements[fileType];
    if (!viewerElement) {
      throw new Error(`Wrong viewer file type: ${fileType}`);
    }

    await expect(viewerElement).toBeVisible();
  }

  test('[XAT-17177] Image files are properly displayed in the viewer - JPG', async ({ personalFiles }) => {
    await checkViewerDisplay(personalFiles, randomJpgName, 'viewerImage');
  });

  test('[XAT-17178] Image files are properly displayed in the viewer - PNG', async ({ personalFiles }) => {
    await checkViewerDisplay(personalFiles, randomPngName, 'viewerImage');
  });

  test('[XAT-17179] Image files are properly displayed in the viewer - GIF', async ({ personalFiles }) => {
    await checkViewerDisplay(personalFiles, randomGifName, 'viewerImage');
  });

  test('[XAT-17180] Document files are properly displayed in the viewer - PDF', async ({ personalFiles }) => {
    await checkViewerDisplay(personalFiles, randomPdfName, 'viewerDocument');
  });

  test('[XAT-17181] Document files are properly displayed in the viewer - DOCX', async ({ personalFiles }) => {
    await checkViewerDisplay(personalFiles, randomDocxName, 'viewerDocument');
  });

  test('[XAT-17182] Document files are properly displayed in the viewer - PPTX', async ({ personalFiles }) => {
    await checkViewerDisplay(personalFiles, randomPptxName, 'viewerDocument');
  });

  test('[XAT-17183] Audio files are properly displayed in the viewer - MP3', async ({ personalFiles }) => {
    await checkViewerDisplay(personalFiles, randomMp3Name, 'viewerMedia');
  });

  test('[XAT-17184] Video files are properly displayed in the viewer - MP4', async ({ personalFiles }) => {
    await checkViewerDisplay(personalFiles, randomMp4Name, 'viewerMedia');
  });

  test('[XAT-17185] Video files are properly displayed in the viewer - WEBM', async ({ personalFiles }) => {
    await checkViewerDisplay(personalFiles, randomWebmName, 'viewerMedia');
  });

  test('[XAT-5485] User can select a document page through the thumbnail pane', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomPdfName);
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await personalFiles.viewer.documentThumbnailButton.click();
    await expect(personalFiles.viewer.thumbnailsPages.first()).toBeVisible();
    await personalFiles.viewer.checkViewerActivePage(1);
    await personalFiles.viewer.clickViewerThumbnailPage(2);
    await personalFiles.viewer.checkViewerActivePage(2);
  });

  test('[XAT-5486] User can close the thumbnail pane', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomPdfName);
    expect(await personalFiles.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await personalFiles.viewer.documentThumbnailButton.click();
    await expect(personalFiles.viewer.thumbnailsPages.first()).toBeVisible();
    await personalFiles.viewer.thumbnailsCloseButton.click();
    await expect(personalFiles.viewer.thumbnailsPages.first()).toBeHidden();
  });
});
