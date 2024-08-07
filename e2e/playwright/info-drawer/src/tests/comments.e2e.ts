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

import { expect } from '@playwright/test';
import { ApiClientFactory, Utils, test, TrashcanApi, FavoritesPageApi, NodesApi, FileActionsApi } from '@alfresco/playwright-shared';

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

  test('[C299173] from Personal Files - Comments tab default fields', async ({ personalFiles }) => {
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

  test('[C299209] from Favorites - Add a comment on a folder', async ({ favoritePage }) => {
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
    expect(await favoritePage.infoDrawer.checkCommentsHeaderCount()).toEqual(1);
    expect(await favoritePage.infoDrawer.verifyCommentsCountFromList(1));
  });

  test('[C299189] from Shared Files - Comments are displayed ordered by created date in descending order', async ({ sharedPage }) => {
    const sharedFileName = `sharedFile-e2e-${Utils.random()}`;
    const e2eCommentFirst = `e2e-comment-${Utils.random()}`;
    const e2eCommentSecond = `e2e-comment-${Utils.random()}`;
    const sharedFileId = (await nodesApi.createFile(sharedFileName)).entry.id;
    await fileActionsApi.waitForNodes(sharedFileName, { expect: 1 });
    await apiClientFactory.commentsApi.createComment(sharedFileId, { content: e2eCommentFirst });
    await apiClientFactory.commentsApi.createComment(sharedFileId, { content: e2eCommentSecond });
    await apiClientFactory.share.createSharedLink({ nodeId: sharedFileId });
    await fileActionsApi.waitForNodes(sharedFileName, { expect: 1 });
    await sharedPage.navigate();
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

  test('[C299195] from Recent Files - Add a comment on a file', async ({ recentFilesPage }) => {
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
    expect(await recentFilesPage.infoDrawer.checkCommentsHeaderCount()).toEqual(1);
    expect(await recentFilesPage.infoDrawer.verifyCommentsCountFromList(1));
  });

  test('[C299196] Comment info display - File from Favorites', async ({ favoritePage }) => {
    const e2eCommentFirst = `e2e-comment-${Utils.random()}`;
    const commentInfoFileName = `e2e-commentFile-${Utils.random()}`;
    const commentInfoFileId = (await nodesApi.createFile(commentInfoFileName)).entry.id;
    await favoritesActions.addFavoritesByIds('file', [commentInfoFileId]);
    await fileActionsApi.waitForNodes(commentInfoFileName, { expect: 1 });
    await apiClientFactory.commentsApi.createComment(commentInfoFileId, { content: e2eCommentFirst });
    await fileActionsApi.waitForNodes(commentInfoFileName, { expect: 1 });
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
