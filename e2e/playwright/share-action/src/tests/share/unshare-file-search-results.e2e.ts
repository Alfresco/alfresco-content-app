/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Site } from '@alfresco/js-api';
import {
  ApiClientFactory,
  FileActionsApi,
  NodesApi,
  SharedLinksApi,
  SitesApi,
  Utils,
  test,
  timeouts,
  TrashcanApi
} from '@alfresco/playwright-shared';
import { expect } from '@playwright/test';

test.describe('Unshare a file from Search Results', () => {
  const random = Utils.random();
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;

  const username = `user-${random}`;
  const parent = `parent-${random}`;
  let parentId: string;
  const searchRandom = random;
  let sitesApi: SitesApi;

  let file1Id: string;
  let file2Id: string;
  let file3Id: string;
  let file4Id: string;
  const file1 = `search-file-${searchRandom}-1.txt`;
  const file2 = `search-file-${searchRandom}-2.txt`;
  const file3 = `search-file-${searchRandom}-3.txt`;
  const file4 = `search-file-${searchRandom}-4.txt`;

  const sitePrivate = `site-private-${random}`;

  let fileSite2Id: string;
  const fileSite1 = `search-file-${searchRandom}-Site1.txt`;
  const fileSite2 = `search-file-${searchRandom}-Site2.txt`;

  const apiClientFactory = new ApiClientFactory();

  test.beforeAll(async () => {
    try {
      test.setTimeout(timeouts.extendedTest);
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      sitesApi = await SitesApi.initialize('admin');
      const nodesApiAdmin = await NodesApi.initialize('admin');
      const shareApiAdmin = await SharedLinksApi.initialize('admin');
      const shareApi = await SharedLinksApi.initialize(username, username);
      const filesAction = await FileActionsApi.initialize(username, username);
      parentId = (await nodesApi.createFolder(parent)).entry.id;

      file1Id = (await nodesApi.createFile(file1, parentId)).entry.id;
      file2Id = (await nodesApi.createFile(file2, parentId)).entry.id;
      file3Id = (await nodesApi.createFile(file3, parentId)).entry.id;
      file4Id = (await nodesApi.createFile(file4, parentId)).entry.id;

      await sitesApi.createSite(sitePrivate, Site.VisibilityEnum.PRIVATE);
      const docLibId = await sitesApi.getDocLibId(sitePrivate);

      const fileSite1Id = (await nodesApiAdmin.createFile(fileSite1, docLibId)).entry.id;
      fileSite2Id = (await nodesApiAdmin.createFile(fileSite2, docLibId)).entry.id;

      await sitesApi.addSiteMember(sitePrivate, username, Site.RoleEnum.SiteConsumer);

      await shareApiAdmin.shareFilesByIds([fileSite1Id]);
      await shareApiAdmin.waitForFilesToBeShared([fileSite1Id]);

      await shareApi.shareFilesByIds([file1Id, file2Id, file3Id, file4Id, fileSite2Id]);
      await shareApi.waitForFilesToBeShared([file1Id, file2Id, file3Id, file4Id, fileSite2Id]);

      await filesAction.waitForNodes(`search-file-${searchRandom}`, { expect: 6 });
    } catch (error) {
      throw new Error(`----- beforeAll failed : ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage, personalFiles }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    await personalFiles.waitForPageLoad();
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed', sitesApi, [sitePrivate]);
  });

  test('[C306995] Unshare dialog UI', async ({ personalFiles, searchPage }) => {
    await personalFiles.acaHeader.searchButton.click();
    await searchPage.clickSearchButton();
    await searchPage.searchOverlay.checkFilesAndFolders();
    await searchPage.searchOverlay.searchFor(file1);

    await personalFiles.dataTable.selectItems(file1);
    await personalFiles.acaHeader.shareButton.click();
    await personalFiles.viewerDialog.shareDialogTitle.waitFor({ state: 'attached', timeout: timeouts.normal });

    expect(await personalFiles.shareDialog.isShareToggleChecked()).toBe(true);
    await personalFiles.shareDialog.shareToggle.click();

    await expect(personalFiles.confirmDialog.getDialogTitle('Remove this shared link')).toBeVisible();
    await expect(
      personalFiles.confirmDialog.getDialogContent('This link will be deleted and a new link will be created next time this file is shared')
    ).toBeVisible();
    await expect(personalFiles.confirmDialog.okButton).toBeEnabled();
    await expect(personalFiles.confirmDialog.cancelButton).toBeEnabled();
  });

  test('[C306996] Unshare a file', async ({ personalFiles, searchPage, nodesApiAction, page }) => {
    await personalFiles.acaHeader.searchButton.click();
    await searchPage.clickSearchButton();
    await searchPage.searchOverlay.checkFilesAndFolders();
    await searchPage.searchOverlay.searchFor(file2);

    await personalFiles.dataTable.selectItems(file2);
    await personalFiles.acaHeader.shareButton.click();
    const url = await personalFiles.shareDialog.getLinkUrl();
    await personalFiles.shareDialog.shareToggle.click();

    await personalFiles.confirmDialog.okButton.click();

    await page.goto(url);
    await personalFiles.viewer.waitForViewerToOpen();
    await expect(personalFiles.viewer.fileTitleButtonLocator).not.toHaveText(file2);
    expect(await nodesApiAction.isFileShared(file2Id)).toBe(false);
  });

  test('[C306997] Cancel the Unshare action', async ({ personalFiles, searchPage }) => {
    await personalFiles.acaHeader.searchButton.click();
    await searchPage.clickSearchButton();
    await searchPage.searchOverlay.checkFilesAndFolders();
    await searchPage.searchOverlay.searchFor(file3);

    await personalFiles.dataTable.selectItems(file3);
    await personalFiles.acaHeader.shareButton.click();

    const urlBefore = await personalFiles.shareDialog.getLinkUrl();
    await personalFiles.shareDialog.shareToggle.click();
    await personalFiles.confirmDialog.cancelButton.click();
    expect(await personalFiles.shareDialog.isShareToggleChecked()).toBe(true);

    const urlAfter = await personalFiles.shareDialog.getLinkUrl();
    expect(urlBefore).toEqual(urlAfter);
  });

  test('[C306999] Unshare a file from the context menu', async ({ personalFiles, searchPage, nodesApiAction, page }) => {
    await personalFiles.acaHeader.searchButton.click();
    await searchPage.clickSearchButton();
    await searchPage.searchOverlay.checkFilesAndFolders();
    await searchPage.searchOverlay.searchFor(file4);

    await personalFiles.dataTable.rightClickOnItem(file4);
    await personalFiles.matMenu.clickMenuItem('Shared Link Settings');
    const url = await personalFiles.shareDialog.getLinkUrl();
    await personalFiles.shareDialog.shareToggle.click();

    await personalFiles.confirmDialog.okButton.click();

    await page.goto(url);
    await personalFiles.viewer.waitForViewerToOpen();
    expect(personalFiles.viewer.fileTitleButtonLocator.textContent()).not.toEqual(file4);
    expect(await nodesApiAction.isFileShared(file4Id)).toBe(false);
  });

  test('[C306998] Consumer - on Search Results - file shared by other user', async ({ personalFiles, searchPage, nodesApiAction }) => {
    await personalFiles.acaHeader.searchButton.click();
    await searchPage.clickSearchButton();
    await searchPage.searchOverlay.checkFilesAndFolders();
    await searchPage.searchOverlay.searchFor(fileSite1);

    await personalFiles.dataTable.selectItems(fileSite1);
    await personalFiles.acaHeader.shareButton.click();

    expect(await personalFiles.shareDialog.isShareToggleChecked()).toBe(true);
    await personalFiles.shareDialog.shareToggle.click();
    await personalFiles.confirmDialog.okButton.click();
    expect(await nodesApiAction.isFileShared(fileSite2Id)).toBe(true);
  });

  test('[C307000] Consumer - on Search Results - file shared by the user', async ({ personalFiles, searchPage, nodesApiAction, page }) => {
    await personalFiles.acaHeader.searchButton.click();
    await searchPage.clickSearchButton();
    await searchPage.searchOverlay.checkFilesAndFolders();
    await searchPage.searchOverlay.searchFor(fileSite2);

    await personalFiles.dataTable.selectItems(fileSite2);
    await personalFiles.acaHeader.shareButton.click();
    expect(await personalFiles.shareDialog.isShareToggleChecked()).toBe(true);

    await personalFiles.shareDialog.shareToggle.click();
    await personalFiles.confirmDialog.okButton.click();
    await page.waitForTimeout(timeouts.tiny);
    expect(await nodesApiAction.isFileShared(fileSite2Id)).toBe(false);
  });
});
