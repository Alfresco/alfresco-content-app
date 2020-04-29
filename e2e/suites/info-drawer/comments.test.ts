/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { LoginPage, BrowsingPage } from '../../pages/pages';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { InfoDrawer } from './../../components/info-drawer/info-drawer';
import { Utils } from '../../utilities/utils';
import * as moment from 'moment';

describe('Comments', () => {
  const username = `user1-${Utils.random()}`;

  const parent = `parent-${Utils.random()}`; let parentId;

  const file1 = `file1-${Utils.random()}.txt`;
  const folder1 = `folder1-${Utils.random()}`;
  const folder2 = `folder2-${Utils.random()}`; let folder2Id;

  const fileWith1Comment = `file1Comment-${Utils.random()}.txt`; let fileWith1CommentId;
  const fileWith2Comments = `file2Comments-${Utils.random()}.txt`; let fileWith2CommentsId;

  const file2Personal = `file2Personal-${Utils.random()}.txt`;
  const file2Shared = `file2Shared-${Utils.random()}.txt`; let file2SharedId;
  const file2Recent = `file2Recent-${Utils.random()}.txt`;
  const file2Favorites = `file2Favorites-${Utils.random()}.txt`; let file2FavoritesId;

  let commentFile1Entry;
  let comment1File2Entry, comment2File2Entry;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const infoDrawer = new InfoDrawer();
  const { commentsTab } = infoDrawer;

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });

    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;

    await apis.user.nodes.createFile(file1, parentId);
    await apis.user.nodes.createFile(file2Personal, parentId);
    await apis.user.nodes.createFile(file2Recent, parentId);
    file2SharedId = (await apis.user.nodes.createFile(file2Shared, parentId)).entry.id
    file2FavoritesId = (await apis.user.nodes.createFile(file2Favorites, parentId)).entry.id;

    fileWith1CommentId = (await apis.user.nodes.createFile(fileWith1Comment, parentId)).entry.id;
    fileWith2CommentsId = (await apis.user.nodes.createFile(fileWith2Comments, parentId)).entry.id;

    comment1File2Entry = (await apis.user.comments.addComment(fileWith2CommentsId, 'first comment')).entry;
    comment2File2Entry = (await apis.user.comments.addComment(fileWith2CommentsId, 'second comment')).entry;

    await apis.user.shared.shareFilesByIds([file2SharedId, fileWith1CommentId, fileWith2CommentsId]);
    await apis.user.favorites.addFavoritesByIds('file', [file2FavoritesId, fileWith1CommentId, fileWith2CommentsId]);

    await apis.user.nodes.createFolder(folder1, parentId);
    folder2Id = (await apis.user.nodes.createFolder(folder2, parentId)).entry.id;
    await apis.user.favorites.addFavoriteById('folder', folder2Id);

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(parentId);
    done();
  });

  afterEach(async (done) => {
    await page.clickPersonalFiles();
    done();
  });

  describe('from Personal Files', () => {
    beforeEach(async (done) => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);
      done();
    });

    it('[C299173] Comments tab default fields', async () => {
      await dataTable.selectItem(file1);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();

      expect(await infoDrawer.getActiveTabTitle()).toBe('COMMENTS');
      expect(await commentsTab.getCommentsTabHeaderText()).toBe('Comments (0)');
      expect(await commentsTab.isCommentTextAreaDisplayed()).toBe(true, 'Comment field not present');
      expect(await commentsTab.isAddCommentButtonEnabled()).toBe(false, 'Add comment button not disabled');
    });

    it('[C280583] Comments are displayed ordered by created date in descending order', async () => {
      await dataTable.selectItem(fileWith2Comments);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();

      expect(await commentsTab.getNthCommentId(1)).toContain(comment2File2Entry.id);
      expect(await commentsTab.getNthCommentId(2)).toContain(comment1File2Entry.id);
    });

    it('[C280585] Total number of comments is displayed', async () => {
      await dataTable.selectItem(fileWith2Comments);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();

      expect(await commentsTab.getCommentsTabHeaderText()).toBe('Comments (2)');
    });

    it('[C280589] Add button is enabled when typing in the comment field', async () => {
      await dataTable.selectItem(file1);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();

      expect(await commentsTab.isAddCommentButtonEnabled()).toBe(false, 'Add comment button not disabled');

      await commentsTab.typeComment('my comment');
      expect(await commentsTab.isAddCommentButtonEnabled()).toBe(true, 'Add comment button not enabled');
    });

    it('[C280590] Add a comment on a file', async () => {
      const myComment = 'my comment';

      await dataTable.selectItem(file2Personal);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();
      await commentsTab.typeComment(myComment);
      await commentsTab.clickAddButton();

      expect(await commentsTab.getCommentsTabHeaderText()).toBe('Comments (1)');
      expect(await commentsTab.isCommentDisplayed()).toBe(true, `Comment not displayed`);
      expect(await commentsTab.getCommentText()).toBe(myComment, 'Incorrect comment text');
    });

    it('[C299208] Add a comment on a folder', async () => {
      const myComment = 'my comment';

      await dataTable.selectItem(folder1);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();
      await commentsTab.typeComment(myComment);
      await commentsTab.clickAddButton();

      expect(await commentsTab.getCommentsTabHeaderText()).toBe('Comments (1)');
      expect(await commentsTab.isCommentDisplayed()).toBe(true, `Comment not displayed`);
      expect(await commentsTab.getCommentText()).toBe(myComment, 'Incorrect comment text');
    });

    it('[C280591] Escape key clears the text when focus is on the textarea', async () => {
      await dataTable.selectItem(file2Personal);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();
      await commentsTab.typeComment('myComment');

      expect(await commentsTab.getCommentTextFromTextArea()).toBe('myComment');

      await Utils.pressEscape();

      expect(await commentsTab.getCommentTextFromTextArea()).toBe('');
    });
  });

  describe('from Favorites', () => {
    beforeAll(async (done) => {
      await apis.user.favorites.waitForApi({ expect: 4 });
      done();
    });

    beforeEach(async (done) => {
      await page.clickFavoritesAndWait();
      done();
    });

    it('[C299197] Comments are displayed ordered by created date in descending order', async () => {
      await dataTable.selectItem(fileWith2Comments);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();

      expect(await commentsTab.getNthCommentId(1)).toContain(comment2File2Entry.id);
      expect(await commentsTab.getNthCommentId(2)).toContain(comment1File2Entry.id);
    });

    it('[C299198] Total number of comments is displayed', async () => {
      await dataTable.selectItem(fileWith2Comments);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();

      expect(await commentsTab.getCommentsTabHeaderText()).toBe('Comments (2)');
    });

    it('[C299199] Add a comment on a file', async () => {
      const myComment = 'my comment';

      await dataTable.selectItem(file2Favorites);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();
      await commentsTab.typeComment(myComment);
      await commentsTab.clickAddButton();

      expect(await commentsTab.getCommentsTabHeaderText()).toBe('Comments (1)');
      expect(await commentsTab.isCommentDisplayed()).toBe(true, `Comment not displayed`);
      expect(await commentsTab.getCommentText()).toBe(myComment, 'Incorrect comment text');
    });

    it('[C299209] Add a comment on a folder', async () => {
      const myComment = 'my comment';

      await dataTable.selectItem(folder2);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();
      await commentsTab.typeComment(myComment);
      await commentsTab.clickAddButton();

      expect(await commentsTab.getCommentsTabHeaderText()).toBe('Comments (1)');
      expect(await commentsTab.isCommentDisplayed()).toBe(true, `Comment not displayed`);
      expect(await commentsTab.getCommentText()).toBe(myComment, 'Incorrect comment text');
    });
  });

  describe('from Shared Files', () => {
    beforeAll(async (done) => {
      await apis.user.shared.waitForApi({ expect: 3 });
      done();
    });

    beforeEach(async (done) => {
      await page.clickSharedFilesAndWait();
      done();
    });

    it('[C299189] Comments are displayed ordered by created date in descending order', async () => {
      await dataTable.selectItem(fileWith2Comments);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();

      expect(await commentsTab.getNthCommentId(1)).toContain(comment2File2Entry.id);
      expect(await commentsTab.getNthCommentId(2)).toContain(comment1File2Entry.id);
    });

    it('[C299190] Total number of comments is displayed', async () => {
      await dataTable.selectItem(fileWith2Comments);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();

      expect(await commentsTab.getCommentsTabHeaderText()).toBe('Comments (2)');
    });

    it('[C299191] Add a comment on a file', async () => {
      const myComment = 'my comment';

      await dataTable.selectItem(file2Shared);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();
      await commentsTab.typeComment(myComment);
      await commentsTab.clickAddButton();

      expect(await commentsTab.getCommentsTabHeaderText()).toBe('Comments (1)');
      expect(await commentsTab.isCommentDisplayed()).toBe(true, `Comment not displayed`);
      expect(await commentsTab.getCommentText()).toBe(myComment, 'Incorrect comment text');
    });
  });

  describe('from Recent Files', () => {
    beforeAll(async (done) => {
      await apis.user.search.waitForApi(username, { expect: 7 });
      done();
    });

    beforeEach(async (done) => {
      await page.clickRecentFilesAndWait();
      done();
    });

    it('[C299193] Comments are displayed ordered by created date in descending order', async () => {
      await dataTable.selectItem(fileWith2Comments);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();

      expect(await commentsTab.getNthCommentId(1)).toContain(comment2File2Entry.id);
      expect(await commentsTab.getNthCommentId(2)).toContain(comment1File2Entry.id);
    });

    it('[C299194] Total number of comments is displayed', async () => {
      await dataTable.selectItem(fileWith2Comments);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();

      expect(await commentsTab.getCommentsTabHeaderText()).toBe('Comments (2)');
    });

    it('[C299195] Add a comment on a file', async () => {
      const myComment = 'my comment';

      await dataTable.selectItem(file2Recent);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();
      await commentsTab.typeComment(myComment);
      await commentsTab.clickAddButton();

      expect(await commentsTab.getCommentsTabHeaderText()).toBe('Comments (1)');
      expect(await commentsTab.isCommentDisplayed()).toBe(true, `Comment not displayed`);
      expect(await commentsTab.getCommentText()).toBe(myComment, 'Incorrect comment text');
    });
  });

  describe('Comment info display', () => {
    beforeAll(async (done) => {
      commentFile1Entry = (await apis.user.comments.addComment(fileWith1CommentId, 'this is my comment')).entry;

      await apis.user.favorites.waitForApi({ expect: 4 });
      await apis.user.shared.waitForApi({ expect: 3 });
      await apis.user.search.waitForApi(username, { expect: 7 });

      done();
    });

    it('[C280582] File from Personal files', async () => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);

      await dataTable.selectItem(fileWith1Comment);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();

      expect(await commentsTab.getCommentsTabHeaderText()).toBe('Comments (1)');
      expect(await commentsTab.isCommentTextAreaDisplayed()).toBe(true, 'Comment field not present');
      expect(await commentsTab.isAddCommentButtonEnabled()).toBe(false, 'Add comment button not disabled');

      expect(await commentsTab.isCommentDisplayed(commentFile1Entry.id)).toBe(true, `Comment with id: ${commentFile1Entry.id} not displayed`);
      expect(await commentsTab.getCommentText(commentFile1Entry.id)).toBe(commentFile1Entry.content, 'Incorrect comment text');
      expect(await commentsTab.getCommentUserName(commentFile1Entry.id)).toBe(`${username} ${username}`, 'Incorrect comment user');
      expect(await commentsTab.getCommentTime(commentFile1Entry.id)).toBe(moment(commentFile1Entry.createdAt).fromNow(), 'Incorrect comment created time');
      expect(await commentsTab.isCommentUserAvatarDisplayed(commentFile1Entry.id)).toBe(true, 'User avatar not displayed');
    });

    it('[C299196] File from Favorites', async () => {
      await page.clickFavoritesAndWait();

      await dataTable.selectItem(fileWith1Comment);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();

      expect(await commentsTab.getCommentsTabHeaderText()).toBe('Comments (1)');
      expect(await commentsTab.isCommentTextAreaDisplayed()).toBe(true, 'Comment field not present');
      expect(await commentsTab.isAddCommentButtonEnabled()).toBe(false, 'Add comment button not disabled');

      expect(await commentsTab.isCommentDisplayed(commentFile1Entry.id)).toBe(true, `Comment with id: ${commentFile1Entry.id} not displayed`);
      expect(await commentsTab.getCommentText(commentFile1Entry.id)).toBe(commentFile1Entry.content, 'Incorrect comment text');
      expect(await commentsTab.getCommentUserName(commentFile1Entry.id)).toBe(`${username} ${username}`, 'Incorrect comment user');
      expect(await commentsTab.getCommentTime(commentFile1Entry.id)).toBe(moment(commentFile1Entry.createdAt).fromNow(), 'Incorrect comment created time');
      expect(await commentsTab.isCommentUserAvatarDisplayed(commentFile1Entry.id)).toBe(true, 'User avatar not displayed');
    });

    it('[C299188] File from Shared Files', async () => {
      await page.clickSharedFilesAndWait();

      await dataTable.selectItem(fileWith1Comment);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();

      expect(await commentsTab.getCommentsTabHeaderText()).toBe('Comments (1)');
      expect(await commentsTab.isCommentTextAreaDisplayed()).toBe(true, 'Comment field not present');
      expect(await commentsTab.isAddCommentButtonEnabled()).toBe(false, 'Add comment button not disabled');

      expect(await commentsTab.isCommentDisplayed(commentFile1Entry.id)).toBe(true, `Comment with id: ${commentFile1Entry.id} not displayed`);
      expect(await commentsTab.getCommentText(commentFile1Entry.id)).toBe(commentFile1Entry.content, 'Incorrect comment text');
      expect(await commentsTab.getCommentUserName(commentFile1Entry.id)).toBe(`${username} ${username}`, 'Incorrect comment user');
      expect(await commentsTab.getCommentTime(commentFile1Entry.id)).toBe(moment(commentFile1Entry.createdAt).fromNow(), 'Incorrect comment created time');
      expect(await commentsTab.isCommentUserAvatarDisplayed(commentFile1Entry.id)).toBe(true, 'User avatar not displayed');
    });

    it('[C299192] File from Recent Files', async () => {
      await page.clickRecentFilesAndWait();

      await dataTable.selectItem(fileWith1Comment);
      await page.toolbar.viewDetailsButton.click();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickCommentsTab();

      expect(await commentsTab.getCommentsTabHeaderText()).toBe('Comments (1)');
      expect(await commentsTab.isCommentTextAreaDisplayed()).toBe(true, 'Comment field not present');
      expect(await commentsTab.isAddCommentButtonEnabled()).toBe(false, 'Add comment button not disabled');

      expect(await commentsTab.isCommentDisplayed(commentFile1Entry.id)).toBe(true, `Comment with id: ${commentFile1Entry.id} not displayed`);
      expect(await commentsTab.getCommentText(commentFile1Entry.id)).toBe(commentFile1Entry.content, 'Incorrect comment text');
      expect(await commentsTab.getCommentUserName(commentFile1Entry.id)).toBe(`${username} ${username}`, 'Incorrect comment user');
      expect(await commentsTab.getCommentTime(commentFile1Entry.id)).toBe(moment(commentFile1Entry.createdAt).fromNow(), 'Incorrect comment created time');
      expect(await commentsTab.isCommentUserAvatarDisplayed(commentFile1Entry.id)).toBe(true, 'User avatar not displayed');
    });

  });

});
