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
  Utils,
  test,
  TrashcanApi,
  FavoritesPageApi,
  NodesApi,
  FileActionsApi,
  SitesApi,
  MyLibrariesPage,
  timeouts
} from '@alfresco/aca-playwright-shared';
import { Site } from '@alfresco/js-api';

test.describe('Info Drawer - Comments', () => {
  const apiClientFactory = new ApiClientFactory();
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let fileActionsApi: FileActionsApi;
  let favoritesActions: FavoritesPageApi;
  const username = `user-e2e-${Utils.random()}`;
  const commentText = `comment-e2e-${Utils.random()}`;

  test.beforeAll(async () => {
    try {
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      favoritesActions = await FavoritesPageApi.initialize(username, username);
      fileActionsApi = await FileActionsApi.initialize(username, username);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[XAT-5524] from Personal Files - Comments tab default fields', async ({ personalFiles }) => {
    const personalFolderName = `personalFolder-e2e-${Utils.random()}`;
    await nodesApi.createFolder(personalFolderName);
    await fileActionsApi.waitForNodes(personalFolderName, { expect: 1 });
    await personalFiles.navigate();
    await Utils.reloadPageIfRowNotVisible(personalFiles, personalFolderName);
    await expect(personalFiles.dataTable.getRowByName(personalFolderName)).toBeVisible();
    await personalFiles.dataTable.getRowByName(personalFolderName).click();
    await personalFiles.acaHeader.viewDetails.click();
    await personalFiles.infoDrawer.commentsTab.click();
    await expect(personalFiles.infoDrawer.commentInputField).toBeVisible();
    expect(await personalFiles.infoDrawer.checkCommentsHeaderCount()).toEqual(0);
    await expect(personalFiles.infoDrawer.addCommentButton).toBeDisabled();
  });

  test('[XAT-5544] from Favorites - Add a comment on a folder', async ({ favoritePage }) => {
    const favoriteFolderName = `favoriteFolder-e2e-${Utils.random()}`;
    const folderFavId = (await nodesApi.createFolder(favoriteFolderName)).entry.id;
    await favoritesActions.addFavoritesByIds('folder', [folderFavId]);
    await fileActionsApi.waitForNodes(favoriteFolderName, { expect: 1 });
    await favoritePage.navigate();
    await expect(favoritePage.dataTable.getRowByName(favoriteFolderName)).toBeVisible();
    await favoritePage.dataTable.getRowByName(favoriteFolderName).click();
    await favoritePage.acaHeader.viewDetails.click();
    await favoritePage.infoDrawer.commentsTab.click();
    await expect(favoritePage.infoDrawer.commentInputField).toBeVisible();
    await favoritePage.infoDrawer.addCommentToNode(commentText);
    await expect(favoritePage.infoDrawer.addCommentButton).toBeDisabled();
    expect(await favoritePage.infoDrawer.getCommentsCountFromList()).toEqual(1);
  });

  test('[XAT-5533] from Shared Files - Comments are displayed ordered by created date in descending order', async ({ sharedPage }) => {
    await sharedPage.navigate();
    const sharedFileName = `sharedFile-e2e-${Utils.random()}`;
    const e2eCommentFirst = `e2e-comment-${Utils.random()}`;
    const e2eCommentSecond = `e2e-comment-${Utils.random()}`;
    const sharedFileId = (await nodesApi.createFile(sharedFileName)).entry.id;
    await fileActionsApi.waitForNodes(sharedFileName, { expect: 1 });
    await apiClientFactory.commentsApi.createComment(sharedFileId, { content: e2eCommentFirst });
    await apiClientFactory.commentsApi.createComment(sharedFileId, { content: e2eCommentSecond });
    await apiClientFactory.share.createSharedLink({ nodeId: sharedFileId });
    await Utils.reloadPageIfRowNotVisible(sharedPage, sharedFileName);
    await expect(sharedPage.dataTable.getRowByName(sharedFileName)).toBeVisible();
    await sharedPage.dataTable.getRowByName(sharedFileName).click();
    await sharedPage.acaHeader.viewDetails.click();
    await sharedPage.infoDrawer.commentsTab.click();
    await sharedPage.infoDrawer.waitForComments();
    expect(await sharedPage.infoDrawer.checkCommentsHeaderCount()).toEqual(2);
    await expect(sharedPage.infoDrawer.commentTextContent.nth(0)).toHaveText(e2eCommentSecond);
    await expect(sharedPage.infoDrawer.commentTextContent.nth(1)).toHaveText(e2eCommentFirst);
  });

  test('[XAT-5539] from Recent Files - Add a comment on a file', async ({ recentFilesPage }) => {
    const recentFile = `e2e-recentFile-${Utils.random()}`;
    await nodesApi.createFile(recentFile);
    await fileActionsApi.waitForNodes(recentFile, { expect: 1 });
    await recentFilesPage.navigate();
    await expect(recentFilesPage.dataTable.getRowByName(recentFile)).toBeVisible();
    await recentFilesPage.dataTable.selectItems(recentFile);
    await recentFilesPage.acaHeader.viewDetails.click();
    await recentFilesPage.infoDrawer.commentsTab.click();
    await expect(recentFilesPage.infoDrawer.commentInputField).toBeVisible();
    await recentFilesPage.infoDrawer.addCommentToNode(commentText);
    await expect(recentFilesPage.infoDrawer.addCommentButton).toBeDisabled();
    expect(await recentFilesPage.infoDrawer.getCommentsCountFromList()).toEqual(1);
  });

  test('[XAT-5540] Comment info display - File from Favorites', async ({ favoritePage }) => {
    const e2eCommentFirst = `e2e-comment-${Utils.random()}`;
    const commentInfoFileName = `e2e-commentFile-${Utils.random()}`;
    const commentInfoFileId = (await nodesApi.createFile(commentInfoFileName)).entry.id;
    await favoritesActions.addFavoritesByIds('file', [commentInfoFileId]);
    await apiClientFactory.commentsApi.createComment(commentInfoFileId, { content: e2eCommentFirst });
    await favoritePage.navigate();
    await expect(favoritePage.dataTable.getRowByName(commentInfoFileName)).toBeVisible();
    await favoritePage.dataTable.getRowByName(commentInfoFileName).click();
    await favoritePage.acaHeader.viewDetails.click();
    await favoritePage.infoDrawer.commentsTab.click();
    await favoritePage.infoDrawer.waitForComments();
    expect(await favoritePage.infoDrawer.checkCommentsHeaderCount()).toEqual(1);
    await expect(favoritePage.infoDrawer.commentTextContent.nth(0)).toHaveText(e2eCommentFirst);
    await expect(favoritePage.infoDrawer.commentTimestamp.nth(0)).toHaveText('less than a minute ago');
    await expect(favoritePage.infoDrawer.commentUsername.nth(0)).toHaveText('Administrator');
  });
});

test.describe('Info Drawer - Comments - Sites Privileges', () => {
  const apiClientFactory = new ApiClientFactory();
  let nodesApi1: NodesApi;
  let trashcanApi1: TrashcanApi;
  let fileActionsApi1: FileActionsApi;
  let sitesApi1: SitesApi;
  let siteEntry5522: Site;
  let siteEntry5523: Site;
  const siteName5522 = `site-e2e-${Utils.random()}`;
  const siteName5523 = `site-e2e-${Utils.random()}`;
  const folderName5522 = `folder-e2e-${Utils.random()}`;
  const folderName5523 = `folder-e2e-${Utils.random()}`;
  const username1 = `user-e2e-${Utils.random()}`;
  const username2 = `user-e2e-${Utils.random()}`;

  async function navigateToFolderAndOpenCommentsTab(page: MyLibrariesPage, siteGuid: string, folderName: string) {
    await page.navigate({ remoteUrl: `#/libraries/${siteGuid}` });
    await page.dataTable.getRowByName('documentLibrary').dblclick();
    await page.dataTable.selectItems(folderName);
    await page.acaHeader.viewDetails.click();
    await page.infoDrawer.commentsTab.click();
  }

  test.beforeAll(async () => {
    try {
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username: username1 });
      await apiClientFactory.createUser({ username: username2 });
      nodesApi1 = await NodesApi.initialize(username1, username1);
      trashcanApi1 = await TrashcanApi.initialize(username1, username1);
      fileActionsApi1 = await FileActionsApi.initialize(username1, username1);
      sitesApi1 = await SitesApi.initialize(username1, username1);

      siteEntry5522 = (await sitesApi1.createSite(siteName5522, Site.VisibilityEnum.PRIVATE)).entry;
      await sitesApi1.addSiteMember(siteEntry5522.id, username2, 'SiteConsumer');

      siteEntry5523 = (await sitesApi1.createSite(siteName5523, Site.VisibilityEnum.PRIVATE)).entry;
      await sitesApi1.addSiteMember(siteEntry5523.id, username2, 'SiteContributor');

      const documentLibraryId1 = await nodesApi1.getNodeIdFromParent('documentLibrary', siteEntry5522.guid);
      await nodesApi1.createFolder(folderName5522, documentLibraryId1);
      await fileActionsApi1.waitForNodes(folderName5522, { expect: 1 });

      const documentLibraryId2 = await nodesApi1.getNodeIdFromParent('documentLibrary', siteEntry5523.guid);
      await nodesApi1.createFolder(folderName5523, documentLibraryId2);
      await fileActionsApi1.waitForNodes(folderName5523, { expect: 1 });
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username2, username2, 'beforeEach failed for user2');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi1, trashcanApi1, 'afterAll failed for user1');
  });

  test('[XAT-5522] Comments: Consumer user does not see the multiline field and Add button', async ({ myLibrariesPage }) => {
    await navigateToFolderAndOpenCommentsTab(myLibrariesPage, siteEntry5522.guid, folderName5522);
    await expect(myLibrariesPage.infoDrawer.commentsHeader).toBeVisible();
    await expect(myLibrariesPage.infoDrawer.commentInputField).toBeHidden();
    await expect(myLibrariesPage.infoDrawer.addCommentButton).toBeHidden();
  });

  test('[XAT-5523] Contributor can add comments', async ({ myLibrariesPage }) => {
    await navigateToFolderAndOpenCommentsTab(myLibrariesPage, siteEntry5523.guid, folderName5523);
    await expect(myLibrariesPage.infoDrawer.commentsHeader).toBeVisible();
    await expect(myLibrariesPage.infoDrawer.commentInputField).toBeVisible();
    await expect(myLibrariesPage.infoDrawer.addCommentButton).toBeVisible();
    await myLibrariesPage.infoDrawer.commentInputField.fill(`e2e-comment-${Utils.random()}`);
    await myLibrariesPage.infoDrawer.addCommentButton.click();
    await myLibrariesPage.infoDrawer.commentsList.first().waitFor({ timeout: timeouts.medium });
    await expect(myLibrariesPage.infoDrawer.commentsList).toHaveCount(1);
  });
});
