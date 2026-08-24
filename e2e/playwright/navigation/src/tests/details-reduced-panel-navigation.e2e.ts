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

import { expect } from '@playwright/test';
import {
  AdfInfoDrawerComponent,
  ApiClientFactory,
  FileActionsApi,
  NodesApi,
  TEST_FILES,
  TrashcanApi,
  Utils,
  test
} from '@alfresco/aca-playwright-shared';

test.describe('Search → Full Details → Reduced Panel navigation', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let fileActionsApi: FileActionsApi;

  const random = Utils.random();
  const username = `user-${random}`;
  const fileName = `search-details-nav-${random}.docx`;
  let fileNodeId: string;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      fileActionsApi = await FileActionsApi.initialize(username, username);
      const uploadedFile = await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, fileName, '-my-');
      fileNodeId = uploadedFile.entry.id;
      await fileActionsApi.waitForNodes(fileName, { expect: 1 });
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
      throw error;
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  async function waitForFullDetailsPageToSettle(infoDrawer: AdfInfoDrawerComponent): Promise<void> {
    await infoDrawer.detailsTabs.waitFor({ state: 'visible' });
    await infoDrawer.metadataTab.waitFor({ state: 'visible' });
    await infoDrawer.contentMetadata.waitFor({ state: 'visible' });
    await expect(infoDrawer.reducePanelButton).toBeVisible();
  }

  test.describe('File List page', () => {
    test('[XAT-19925] should reduce Full Details to Details panel on File List page without navigating away', async ({ personalFiles }) => {
      await personalFiles.navigate();
      await Utils.reloadPageIfRowNotVisible(personalFiles, fileName);
      await expect(personalFiles.dataTable.getRowByName(fileName)).toBeVisible();

      await personalFiles.dataTable.getRowByName(fileName).click();
      await personalFiles.acaHeader.viewDetails.click();
      await expect(personalFiles.infoDrawer.infoDrawerPanel).toBeVisible();

      await personalFiles.infoDrawer.expandDetailsButton.click();
      await personalFiles.page.waitForURL(`**/personal-files/details/${fileNodeId}**`);
      await waitForFullDetailsPageToSettle(personalFiles.infoDrawer);

      await personalFiles.infoDrawer.reducePanelButton.click();
      await personalFiles.page.waitForURL((url) => !url.href.includes('/details/'));

      expect(personalFiles.page.url()).not.toContain('/details/');
      expect(personalFiles.page.url()).not.toContain('/search');
      await expect(personalFiles.infoDrawer.infoDrawerPanel).toBeVisible();
    });

    test('[XAT-19926] should reduce Full Details back to Search page when the journey started from Search', async ({ searchPage }) => {
      await searchPage.searchWithin(fileName, 'files');
      await expect(searchPage.dataTable.getRowByName(fileName)).toBeVisible();

      await searchPage.dataTable.getRowByName(fileName).click();
      await searchPage.acaHeader.viewDetails.click();

      await expect(searchPage.infoDrawer.infoDrawerPanel).toBeVisible();
      await searchPage.infoDrawer.expandDetailsButton.click();
      await searchPage.page.waitForURL(`**/personal-files/details/${fileNodeId}**`);
      await waitForFullDetailsPageToSettle(searchPage.infoDrawer);

      await searchPage.infoDrawer.reducePanelButton.click();
      await searchPage.page.waitForURL((url) => !url.href.includes('/details/'));

      expect(searchPage.page.url()).not.toContain('/details/');
      expect(searchPage.page.url()).toContain('/search');
    });

    test('[XAT-19927] should reduce Full Details to Details panel after navigating through Search page', async ({ searchPage, personalFiles }) => {
      await personalFiles.navigate();
      await Utils.reloadPageIfRowNotVisible(personalFiles, fileName);
      await expect(personalFiles.dataTable.getRowByName(fileName)).toBeVisible();

      await personalFiles.dataTable.getRowByName(fileName).click();
      await personalFiles.acaHeader.viewDetails.click();
      await expect(personalFiles.infoDrawer.infoDrawerPanel).toBeVisible();

      await personalFiles.infoDrawer.expandDetailsButton.click();
      await personalFiles.page.waitForURL(`**/personal-files/details/${fileNodeId}**`);
      await waitForFullDetailsPageToSettle(personalFiles.infoDrawer);

      await searchPage.searchWithin(fileName, 'files');
      await expect(searchPage.dataTable.getRowByName(fileName)).toBeVisible();

      await searchPage.searchInputComponent.searchCloseButton.click();
      await personalFiles.page.waitForURL(`**/personal-files/details/${fileNodeId}**`);
      await waitForFullDetailsPageToSettle(personalFiles.infoDrawer);

      await personalFiles.infoDrawer.reducePanelButton.click();
      await personalFiles.page.waitForURL((url) => !url.href.includes('/details/'));

      expect(personalFiles.page.url()).not.toContain('/details/');
      expect(personalFiles.page.url()).not.toContain('/search');
      await expect(personalFiles.infoDrawer.infoDrawerPanel).toBeVisible();
    });
  });

  test.describe('Viewer page', () => {
    test('[ACS-19938] should reduce Full Details to Details panel on Viewer page without navigating away', async ({ personalFiles }) => {
      await personalFiles.navigate();
      await Utils.reloadPageIfRowNotVisible(personalFiles, fileName);
      await expect(personalFiles.dataTable.getRowByName(fileName)).toBeVisible();

      await personalFiles.dataTable.performClickFolderOrFileToOpen(fileName);
      await personalFiles.viewer.waitForViewerToOpen();

      await personalFiles.viewer.viewDetailsButton.click();
      await expect(personalFiles.infoDrawer.infoDrawerPanel).toBeVisible();

      await personalFiles.infoDrawer.expandDetailsButton.click();
      await personalFiles.page.waitForURL(`**/personal-files/details/${fileNodeId}**`);
      await waitForFullDetailsPageToSettle(personalFiles.infoDrawer);

      await personalFiles.infoDrawer.reducePanelButton.click();
      await personalFiles.page.waitForURL((url) => !url.href.includes('/details/'));

      expect(personalFiles.page.url()).not.toContain('/search');
      expect(personalFiles.page.url()).not.toContain('/details/');
    });

    test('[ACS-19939] should reduce Full Details to Viewer Details panel after navigating through Search page', async ({
      searchPage,
      personalFiles
    }) => {
      await personalFiles.navigate();
      await Utils.reloadPageIfRowNotVisible(personalFiles, fileName);
      await expect(personalFiles.dataTable.getRowByName(fileName)).toBeVisible();

      await personalFiles.dataTable.performClickFolderOrFileToOpen(fileName);
      await personalFiles.viewer.waitForViewerToOpen();

      await personalFiles.viewer.viewDetailsButton.click();
      await expect(personalFiles.infoDrawer.infoDrawerPanel).toBeVisible();
      await personalFiles.infoDrawer.expandDetailsButton.click();
      await personalFiles.page.waitForURL(`**/personal-files/details/${fileNodeId}**`);
      await waitForFullDetailsPageToSettle(personalFiles.infoDrawer);

      await searchPage.searchWithin(fileName, 'files');
      await expect(searchPage.dataTable.getRowByName(fileName)).toBeVisible();

      await searchPage.searchInputComponent.searchCloseButton.click();
      await searchPage.page.waitForURL(`**/personal-files/details/${fileNodeId}**`);
      await waitForFullDetailsPageToSettle(searchPage.infoDrawer);

      await searchPage.infoDrawer.reducePanelButton.click();
      await searchPage.page.waitForURL((url) => !url.href.includes('/details/'));

      expect(personalFiles.page.url()).not.toContain('/search');
      expect(personalFiles.page.url()).not.toContain('/details/');
      await expect(personalFiles.infoDrawer.infoDrawerPanel).toBeVisible();
    });
  });
});
