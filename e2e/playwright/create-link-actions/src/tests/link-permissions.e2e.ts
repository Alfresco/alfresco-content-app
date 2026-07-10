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

import { ApiClientFactory, NodesApi, SitesApi, TrashcanApi, Utils, test, LoginPage, PersonalFilesPage } from '@alfresco/aca-playwright-shared';
import { Site } from '@alfresco/js-api';
import { expect } from '@playwright/test';

test.describe('Create Link - comments and permissions', () => {
  let ownerNodesApi: NodesApi;
  let consumerNodesApi: NodesApi;
  let ownerTrashcanApi: TrashcanApi;
  let consumerTrashcanApi: TrashcanApi;
  let sitesApi: SitesApi;

  const random = Utils.random();
  const ownerUsername = `owner-${random}`;
  const consumerUsername = `consumer-${random}`;

  let siteId: string;
  let siteTitle: string;
  let docLibId: string;
  let sourceFile: string;
  let sourceFolder: string;
  let destinationFolder: string;

  let sourceFileId: string;
  let destinationFolderId: string;

  let fileLinkName: string;
  let folderLinkName: string;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username: ownerUsername });
      await apiClientFactory.createUser({ username: consumerUsername });

      ownerNodesApi = await NodesApi.initialize(ownerUsername, ownerUsername);
      consumerNodesApi = await NodesApi.initialize(consumerUsername, consumerUsername);
      ownerTrashcanApi = await TrashcanApi.initialize(ownerUsername, ownerUsername);
      consumerTrashcanApi = await TrashcanApi.initialize(consumerUsername, consumerUsername);
      sitesApi = await SitesApi.initialize(ownerUsername, ownerUsername);

      const site = await sitesApi.createSite(`link-perm-site-${random}`, Site.VisibilityEnum.PRIVATE);
      siteId = site.entry.id;
      siteTitle = site.entry.title;
      docLibId = await sitesApi.getDocLibId(siteId);
      await sitesApi.addSiteMember(siteId, consumerUsername, 'SiteConsumer');
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
      throw error;
    }
  });

  test.beforeEach(async ({ personalFiles, page }) => {
    try {
      sourceFile = `source-file-${Utils.random()}.txt`;
      sourceFolder = `source-folder-${Utils.random()}`;
      destinationFolder = `destination-folder-${Utils.random()}`;

      const loginPage = new LoginPage(page);
      await Utils.tryLoginUser(loginPage, ownerUsername, ownerUsername, 'beforeEach failed');

      sourceFileId = (await ownerNodesApi.createFile(sourceFile)).entry.id;
      const sourceFolderEntry = await ownerNodesApi.createFolder(sourceFolder);
      destinationFolderId = (await ownerNodesApi.createFolder(destinationFolder)).entry.id;

      const fileLinkEntry = await ownerNodesApi.createFileLink(sourceFileId, destinationFolderId);
      const folderLinkEntry = await ownerNodesApi.createFolderLink(sourceFolderEntry.entry.id, destinationFolderId);

      fileLinkName = fileLinkEntry.entry.name;
      folderLinkName = folderLinkEntry.entry.name;

      await personalFiles.navigate();
    } catch (error) {
      console.error(`beforeEach failed: ${error}`);
      throw error;
    }
  });

  test.afterAll(async () => {
    let primaryError: unknown;

    try {
      await Utils.deleteNodesSitesEmptyTrashcan(consumerNodesApi, consumerTrashcanApi, 'afterAll failed (consumer cleanup)');
    } catch (error) {
      console.error(`afterAll failed (consumer cleanup): ${error}`);
      primaryError = error;
    }

    try {
      await Utils.deleteNodesSitesEmptyTrashcan(ownerNodesApi, ownerTrashcanApi, 'afterAll failed', sitesApi, [siteId]);
    } catch (error) {
      console.error(`afterAll failed: ${error}`);
      primaryError ??= error;
    }

    if (primaryError) {
      throw primaryError;
    }
  });

  test('[XAT-19640] Should show a comment added on a linked file in the original file info drawer', async ({ personalFiles }) => {
    const commentText = `comment-${Utils.random()}`;

    await personalFiles.navigate({ remoteUrl: `./#/personal-files/${destinationFolderId}`, waitUntil: 'load' });
    await Utils.reloadPageIfRowNotVisible(personalFiles, fileLinkName);

    await personalFiles.dataTable.getRowByName(fileLinkName).click();
    await personalFiles.acaHeader.viewDetails.click();
    await personalFiles.infoDrawer.commentsTab.click();
    await expect(personalFiles.infoDrawer.commentInputField).toBeVisible();
    await personalFiles.infoDrawer.addCommentToNode(commentText);

    await personalFiles.infoDrawer.waitForComments();

    await personalFiles.navigate({ remoteUrl: `./#/personal-files`, waitUntil: 'load' });
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFile);

    await personalFiles.dataTable.getRowByName(sourceFile).click();
    await personalFiles.acaHeader.viewDetails.click();
    await personalFiles.infoDrawer.commentsTab.click();
    await personalFiles.infoDrawer.waitForComments();

    const commentsCount = await personalFiles.infoDrawer.getCommentsCountFromList();
    expect(commentsCount).toBeGreaterThanOrEqual(1);

    const commentContent = await personalFiles.infoDrawer.commentTextContent.first().innerText();
    expect(commentContent).toContain(commentText);
  });

  test('[XAT-19641] Should show a comment added on a linked folder in the original folder info drawer', async ({ personalFiles }) => {
    const commentText = `comment-${Utils.random()}`;

    await personalFiles.navigate({ remoteUrl: `./#/personal-files/${destinationFolderId}`, waitUntil: 'load' });
    await Utils.reloadPageIfRowNotVisible(personalFiles, folderLinkName);

    await personalFiles.dataTable.getRowByName(folderLinkName).click();
    await personalFiles.acaHeader.viewDetails.click();
    await personalFiles.infoDrawer.commentsTab.click();
    await expect(personalFiles.infoDrawer.commentInputField).toBeVisible();
    await personalFiles.infoDrawer.addCommentToNode(commentText);

    await personalFiles.infoDrawer.waitForComments();

    await personalFiles.navigate({ remoteUrl: `./#/personal-files`, waitUntil: 'load' });
    await Utils.reloadPageIfRowNotVisible(personalFiles, sourceFolder);

    await personalFiles.dataTable.getRowByName(sourceFolder).click();
    await personalFiles.acaHeader.viewDetails.click();
    await personalFiles.infoDrawer.commentsTab.click();
    await personalFiles.infoDrawer.waitForComments();

    const commentsCount = await personalFiles.infoDrawer.getCommentsCountFromList();
    expect(commentsCount).toBeGreaterThanOrEqual(1);

    const commentContent = await personalFiles.infoDrawer.commentTextContent.first().innerText();
    expect(commentContent).toContain(commentText);
  });

  test('[XAT-19642] Should show Create Link action for manager and successfully create a link from a site document library', async ({
    personalFiles
  }) => {
    const siteFile = `site-file-${Utils.random()}.txt`;
    const managerDestFolder = `manager-dest-${Utils.random()}`;

    await ownerNodesApi.createFile(siteFile, docLibId);
    const managerDestFolderEntry = await ownerNodesApi.createFolder(managerDestFolder);
    const managerDestFolderId = managerDestFolderEntry.entry.id;

    await personalFiles.navigate({ remoteUrl: `./#/libraries/${docLibId}`, waitUntil: 'load' });
    await Utils.reloadPageIfRowNotVisible(personalFiles, siteFile);

    await personalFiles.dataTable.rightClickOnItem(siteFile);
    const createLinkButton = personalFiles.dataTable.contextMenuActions.getButtonByText('Create Link');
    await expect(createLinkButton).toBeVisible();
    await createLinkButton.click();

    await personalFiles.contentNodeSelector.searchAndSelectDestination(managerDestFolder);
    await personalFiles.contentNodeSelector.actionButton.click();

    const msg = await personalFiles.snackBar.getSnackBarMessage();
    expect(msg).toContain('Link created for 1 item');

    await personalFiles.navigate({ remoteUrl: `./#/personal-files/${managerDestFolderId}`, waitUntil: 'load' });

    const expectedLinkName = `Link to ${siteFile}.url`;
    expect(await personalFiles.dataTable.isItemPresent(expectedLinkName)).toBe(true);
  });

  test('[XAT-19643] Should allow a consumer to create a link to a site file in their own personal files', async ({ personalFiles, page }) => {
    const siteFile = `site-file-consumer-${Utils.random()}.txt`;
    const consumerDestFolder = `consumer-dest-${Utils.random()}`;

    await ownerNodesApi.createFile(siteFile, docLibId);
    const consumerDestFolderEntry = await consumerNodesApi.createFolder(consumerDestFolder);
    const consumerDestFolderId = consumerDestFolderEntry.entry.id;

    const loginPage = new LoginPage(page);
    await loginPage.logoutUser();
    await loginPage.loginUser({ username: consumerUsername, password: consumerUsername }, { withNavigation: true, waitForLoading: true });

    await personalFiles.navigate({ remoteUrl: `./#/libraries/${docLibId}`, waitUntil: 'load' });
    await Utils.reloadPageIfRowNotVisible(personalFiles, siteFile);

    await personalFiles.dataTable.rightClickOnItem(siteFile);
    const createLinkButton = personalFiles.dataTable.contextMenuActions.getButtonByText('Create Link');
    await expect(createLinkButton).toBeVisible();
    await createLinkButton.click();

    await personalFiles.contentNodeSelector.searchAndSelectDestination(consumerDestFolder);
    await personalFiles.contentNodeSelector.actionButton.click();

    const msg = await personalFiles.snackBar.getSnackBarMessage();
    expect(msg).toContain('Link created for 1 item');

    await personalFiles.navigate({ remoteUrl: `./#/personal-files/${consumerDestFolderId}`, waitUntil: 'load' });

    const expectedLinkName = `Link to ${siteFile}.url`;
    expect(await personalFiles.dataTable.isItemPresent(expectedLinkName)).toBe(true);
  });

  test('[XAT-19644] Should disable the Choose button in the node selector when consumer selects a read-only library folder', async ({ page }) => {
    const siteFile = `site-file-ro-${Utils.random()}.txt`;
    await ownerNodesApi.createFile(siteFile, docLibId);

    const loginPage = new LoginPage(page);
    await loginPage.logoutUser();
    await loginPage.loginUser({ username: consumerUsername, password: consumerUsername }, { withNavigation: true, waitForLoading: true });

    const consumerPage = new PersonalFilesPage(page);

    await consumerPage.navigate({ remoteUrl: `./#/libraries/${docLibId}`, waitUntil: 'load' });
    await Utils.reloadPageIfRowNotVisible(consumerPage, siteFile);

    await consumerPage.dataTable.selectItems(siteFile);
    await consumerPage.acaHeader.clickMoreActions();
    const createLinkMenuItem = consumerPage.matMenu.getButtonByText('Create Link');
    await expect(createLinkMenuItem).toBeVisible();
    await createLinkMenuItem.click();

    await consumerPage.contentNodeSelector.selectLocation('My Libraries');
    await consumerPage.contentNodeSelector.spinnerWaitForReload();

    await consumerPage.contentNodeSelector.selectDestination(siteTitle);
    expect(await consumerPage.contentNodeSelector.actionButton.isDisabled()).toBe(true);

    await consumerPage.contentNodeSelector.cancelButton.click();
  });
});
