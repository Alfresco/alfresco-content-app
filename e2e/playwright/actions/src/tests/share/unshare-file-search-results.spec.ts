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

import {
  ApiClientFactory,
  FileActionsApi,
  NodesApi,
  SITE_ROLES,
  SITE_VISIBILITY,
  SharedLinksApi,
  SitesApi,
  Utils,
  test,
  timeouts
} from '@alfresco/playwright-shared';
import { expect } from '@playwright/test';

test.describe('Unshare a file from Search Results', () => {
  const random = Utils.random();

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

  let fileSite1Id: string;
  let fileSite2Id: string;
  const fileSite1 = `search-file-${searchRandom}-Site1.txt`;
  const fileSite2 = `search-file-${searchRandom}-Site2.txt`;

  const apiClientFactory = new ApiClientFactory();

  test.beforeAll(async () => {
    try {
      test.setTimeout(timeouts.extendedTest);
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      const nodesApi = await NodesApi.initialize(username, username);
      sitesApi = await SitesApi.initialize(username, username);
      const shareApi = await SharedLinksApi.initialize(username, username);
      const filesAction = await FileActionsApi.initialize(username, username);
      parentId = (await nodesApi.createFolder(parent)).entry.id;

      file1Id = (await nodesApi.createFile(file1, parentId)).entry.id;
      file2Id = (await nodesApi.createFile(file2, parentId)).entry.id;
      file3Id = (await nodesApi.createFile(file3, parentId)).entry.id;
      file4Id = (await nodesApi.createFile(file4, parentId)).entry.id;

      await sitesApi.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE);
      const docLibId = await sitesApi.getDocLibId(sitePrivate);

      fileSite1Id = (await nodesApi.createFile(fileSite1, docLibId)).entry.id;
      fileSite2Id = (await nodesApi.createFile(fileSite2, docLibId)).entry.id;

      await sitesApi.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_CONSUMER.ROLE);

      await shareApi.shareFilesByIds([fileSite1Id]);
      await shareApi.waitForFilesToBeShared([fileSite1Id]);

      await shareApi.shareFilesByIds([file1Id, file2Id, file3Id, file4Id, fileSite2Id]);
      await shareApi.waitForFilesToBeShared([file1Id, file2Id, file3Id, file4Id, fileSite2Id]);

      await filesAction.waitForNodes(`search-file-${searchRandom}`, { expect: 6 });
    } catch (error) {
      throw new Error(`----- beforeAll failed : ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage, personalFiles }) => {
    await loginPage.navigate();
    await loginPage.loginUser({ username: username, password: username });
    await personalFiles.waitForPageLoad();
  });

  test.afterAll(async () => {
    await apiClientFactory.nodes.deleteNode(parentId, { permanent: true });
    await sitesApi.deleteSites([sitePrivate]);
  });

  test('[C306995] Unshare dialog UI', async ({ personalFiles, searchPage }) => {
    await personalFiles.acaHeader.searchButton.click();
    await searchPage.searchInput.searchButton.click();
    await searchPage.searchOverlay.checkFilesAndFolders();
    await searchPage.searchOverlay.searchFor(file1);

    await personalFiles.dataTable.selectItem(file1);
    await personalFiles.acaHeader.shareButton.click();
    await personalFiles.viewerDialog.shareDialogTitle.waitFor({ state: 'attached', timeout: timeouts.normal });

    expect(await personalFiles.shareDialog.isShareToggleChecked()).toBe(true);
    await personalFiles.shareDialog.shareToggle.click();

    expect(personalFiles.confirmDialog.getDialogTitle('Remove this shared link')).toBeVisible();
    expect(
      personalFiles.confirmDialog.getDialogContent('This link will be deleted and a new link will be created next time this file is shared')
    ).toBeVisible();
    expect(await personalFiles.confirmDialog.isRemoveEnabled()).toBe(true);
    expect(await personalFiles.confirmDialog.isCancelEnabled()).toBe(true);
  });

  test('[C306996] Unshare a file', async ({ personalFiles, searchPage, nodesApiAction, page }) => {
    await personalFiles.acaHeader.searchButton.click();
    await searchPage.searchInput.searchButton.click();
    await searchPage.searchOverlay.checkFilesAndFolders();
    await searchPage.searchOverlay.searchFor(file2);

    await personalFiles.dataTable.selectItem(file2);
    await personalFiles.acaHeader.shareButton.click();
    const url = await personalFiles.shareDialog.getLinkUrl();
    await personalFiles.shareDialog.shareToggle.click();

    await personalFiles.confirmDialog.okButton.click();
    expect(await nodesApiAction.isFileShared(file2Id)).toBe(false);

    await page.goto(url);
    await personalFiles.viewer.waitForViewerToOpen();
    expect(await personalFiles.viewer.fileTitleButtonLocator.innerText()).not.toEqual(file2);
  });

  test('[C306997] Cancel the Unshare action', async ({ personalFiles, searchPage }) => {
    await personalFiles.acaHeader.searchButton.click();
    await searchPage.searchInput.searchButton.click();
    await searchPage.searchOverlay.checkFilesAndFolders();
    await searchPage.searchOverlay.searchFor(file3);

    await personalFiles.dataTable.selectItem(file3);
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
    await searchPage.searchInput.searchButton.click();
    await searchPage.searchOverlay.checkFilesAndFolders();
    await searchPage.searchOverlay.searchFor(file4);

    await personalFiles.dataTable.rightClickOnItem(file4);
    await personalFiles.matMenu.clickMenuItem('Shared Link Settings');
    const url = await personalFiles.shareDialog.getLinkUrl();
    await personalFiles.shareDialog.shareToggle.click();

    await personalFiles.confirmDialog.okButton.click();
    expect(await nodesApiAction.isFileShared(file4Id)).toBe(false);

    await page.goto(url);
    await personalFiles.viewer.waitForViewerToOpen();
    expect(personalFiles.viewer.fileTitleButtonLocator).not.toEqual(file4);

    await page.reload();
  });

  test('[C306998] Consumer - on Search Results - file shared by other user', async ({ personalFiles, searchPage, nodesApiAction }) => {
    await personalFiles.acaHeader.searchButton.click();
    await searchPage.searchInput.searchButton.click();
    await searchPage.searchOverlay.checkFilesAndFolders();
    await searchPage.searchOverlay.searchFor(fileSite1);

    await personalFiles.dataTable.selectItem(fileSite1);
    await personalFiles.acaHeader.shareButton.click();

    expect(await personalFiles.shareDialog.isShareToggleChecked()).toBe(true);
    await personalFiles.shareDialog.shareToggle.click();
    await personalFiles.confirmDialog.okButton.click();
    expect(await nodesApiAction.isFileShared(fileSite2Id)).toBe(true);
  });

  test('[C307000] Consumer - on Search Results - file shared by the user', async ({ personalFiles, searchPage, nodesApiAction }) => {
    await personalFiles.acaHeader.searchButton.click();
    await searchPage.searchInput.searchButton.click();
    await searchPage.searchOverlay.checkFilesAndFolders();
    await searchPage.searchOverlay.searchFor(fileSite2);

    await personalFiles.dataTable.selectItem(fileSite2);
    await personalFiles.acaHeader.shareButton.click();
    expect(await personalFiles.shareDialog.isShareToggleChecked()).toBe(true);

    await personalFiles.shareDialog.shareToggle.click();
    await personalFiles.confirmDialog.okButton.click();
    expect(await nodesApiAction.isFileShared(fileSite2Id)).toBe(false);
  });
});
