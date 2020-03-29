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
var _this = this;
import * as tslib_1 from "tslib";
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { InfoDrawer } from './../../components/info-drawer/info-drawer';
import { Utils } from '../../utilities/utils';
import * as moment from 'moment';
describe('Comments', function () {
    var username = "user1-" + Utils.random();
    var parent = "parent-" + Utils.random();
    var parentId;
    var file1 = "file1-" + Utils.random() + ".txt";
    var folder1 = "folder1-" + Utils.random();
    var folder2 = "folder2-" + Utils.random();
    var folder2Id;
    var fileWith1Comment = "file1Comment-" + Utils.random() + ".txt";
    var fileWith1CommentId;
    var fileWith2Comments = "file2Comments-" + Utils.random() + ".txt";
    var fileWith2CommentsId;
    var file2Personal = "file2Personal-" + Utils.random() + ".txt";
    var file2Shared = "file2Shared-" + Utils.random() + ".txt";
    var file2SharedId;
    var file2Recent = "file2Recent-" + Utils.random() + ".txt";
    var file2Favorites = "file2Favorites-" + Utils.random() + ".txt";
    var file2FavoritesId;
    var commentFile1Entry;
    var comment1File2Entry, comment2File2Entry;
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var infoDrawer = new InfoDrawer();
    var commentsTab = infoDrawer.commentsTab;
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                case 2:
                    parentId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file1, parentId)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(file2Personal, parentId)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(file2Recent, parentId)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(file2Shared, parentId)];
                case 6:
                    file2SharedId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file2Favorites, parentId)];
                case 7:
                    file2FavoritesId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileWith1Comment, parentId)];
                case 8:
                    fileWith1CommentId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileWith2Comments, parentId)];
                case 9:
                    fileWith2CommentsId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.comments.addComment(fileWith2CommentsId, 'first comment')];
                case 10:
                    comment1File2Entry = (_a.sent()).entry;
                    return [4 /*yield*/, apis.user.comments.addComment(fileWith2CommentsId, 'second comment')];
                case 11:
                    comment2File2Entry = (_a.sent()).entry;
                    return [4 /*yield*/, apis.user.shared.shareFilesByIds([file2SharedId, fileWith1CommentId, fileWith2CommentsId])];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoritesByIds('file', [file2FavoritesId, fileWith1CommentId, fileWith2CommentsId])];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folder1, parentId)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folder2, parentId)];
                case 15:
                    folder2Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('folder', folder2Id)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 17:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentId)];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.clickPersonalFiles()];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('from Personal Files', function () {
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(parent)];
                    case 2:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Comments tab default fields - [C299173]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 4:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, infoDrawer.getActiveTabTitle()];
                    case 5:
                        _a.apply(void 0, [_e.sent()]).toBe('COMMENTS');
                        _b = expect;
                        return [4 /*yield*/, commentsTab.getCommentsTabHeaderText()];
                    case 6:
                        _b.apply(void 0, [_e.sent()]).toBe('Comments (0)');
                        _c = expect;
                        return [4 /*yield*/, commentsTab.isCommentTextAreaDisplayed()];
                    case 7:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'Comment field not present');
                        _d = expect;
                        return [4 /*yield*/, commentsTab.isAddCommentButtonEnabled()];
                    case 8:
                        _d.apply(void 0, [_e.sent()]).toBe(false, 'Add comment button not disabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Comments are displayed ordered by created date in descending order - [C280583]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileWith2Comments)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, commentsTab.getNthCommentId(1)];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toContain(comment2File2Entry.id);
                        _b = expect;
                        return [4 /*yield*/, commentsTab.getNthCommentId(2)];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toContain(comment1File2Entry.id);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Total number of comments is displayed - [C280585]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileWith2Comments)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 4:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, commentsTab.getCommentsTabHeaderText()];
                    case 5:
                        _a.apply(void 0, [_b.sent()]).toBe('Comments (2)');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Add button is enabled when typing in the comment field - [C280589]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, commentsTab.isAddCommentButtonEnabled()];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toBe(false, 'Add comment button not disabled');
                        return [4 /*yield*/, commentsTab.typeComment('my comment')];
                    case 6:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, commentsTab.isAddCommentButtonEnabled()];
                    case 7:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Add comment button not enabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Add a comment on a file - [C280590]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var myComment, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        myComment = 'my comment';
                        return [4 /*yield*/, dataTable.selectItem(file2Personal)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, commentsTab.typeComment(myComment)];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, commentsTab.clickAddButton()];
                    case 6:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, commentsTab.getCommentsTabHeaderText()];
                    case 7:
                        _a.apply(void 0, [_d.sent()]).toBe('Comments (1)');
                        _b = expect;
                        return [4 /*yield*/, commentsTab.isCommentDisplayed()];
                    case 8:
                        _b.apply(void 0, [_d.sent()]).toBe(true, "Comment not displayed");
                        _c = expect;
                        return [4 /*yield*/, commentsTab.getCommentText()];
                    case 9:
                        _c.apply(void 0, [_d.sent()]).toBe(myComment, 'Incorrect comment text');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Add a comment on a folder - [C299208]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var myComment, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        myComment = 'my comment';
                        return [4 /*yield*/, dataTable.selectItem(folder1)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, commentsTab.typeComment(myComment)];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, commentsTab.clickAddButton()];
                    case 6:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, commentsTab.getCommentsTabHeaderText()];
                    case 7:
                        _a.apply(void 0, [_d.sent()]).toBe('Comments (1)');
                        _b = expect;
                        return [4 /*yield*/, commentsTab.isCommentDisplayed()];
                    case 8:
                        _b.apply(void 0, [_d.sent()]).toBe(true, "Comment not displayed");
                        _c = expect;
                        return [4 /*yield*/, commentsTab.getCommentText()];
                    case 9:
                        _c.apply(void 0, [_d.sent()]).toBe(myComment, 'Incorrect comment text');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Escape key clears the text when focus is on the textarea - [C280591]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file2Personal)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, commentsTab.typeComment('myComment')];
                    case 5:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, commentsTab.getCommentTextFromTextArea()];
                    case 6:
                        _a.apply(void 0, [_c.sent()]).toBe('myComment');
                        return [4 /*yield*/, Utils.pressEscape()];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, commentsTab.getCommentTextFromTextArea()];
                    case 8:
                        _b.apply(void 0, [_c.sent()]).toBe('');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('from Favorites', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.favorites.waitForApi({ expect: 4 })];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickFavoritesAndWait()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Comments are displayed ordered by created date in descending order - [C299197]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileWith2Comments)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, commentsTab.getNthCommentId(1)];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toContain(comment2File2Entry.id);
                        _b = expect;
                        return [4 /*yield*/, commentsTab.getNthCommentId(2)];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toContain(comment1File2Entry.id);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Total number of comments is displayed - [C299198]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileWith2Comments)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 4:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, commentsTab.getCommentsTabHeaderText()];
                    case 5:
                        _a.apply(void 0, [_b.sent()]).toBe('Comments (2)');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Add a comment on a file - [C299199]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var myComment, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        myComment = 'my comment';
                        return [4 /*yield*/, dataTable.selectItem(file2Favorites)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, commentsTab.typeComment(myComment)];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, commentsTab.clickAddButton()];
                    case 6:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, commentsTab.getCommentsTabHeaderText()];
                    case 7:
                        _a.apply(void 0, [_d.sent()]).toBe('Comments (1)');
                        _b = expect;
                        return [4 /*yield*/, commentsTab.isCommentDisplayed()];
                    case 8:
                        _b.apply(void 0, [_d.sent()]).toBe(true, "Comment not displayed");
                        _c = expect;
                        return [4 /*yield*/, commentsTab.getCommentText()];
                    case 9:
                        _c.apply(void 0, [_d.sent()]).toBe(myComment, 'Incorrect comment text');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Add a comment on a folder - [C299209]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var myComment, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        myComment = 'my comment';
                        return [4 /*yield*/, dataTable.selectItem(folder2)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, commentsTab.typeComment(myComment)];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, commentsTab.clickAddButton()];
                    case 6:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, commentsTab.getCommentsTabHeaderText()];
                    case 7:
                        _a.apply(void 0, [_d.sent()]).toBe('Comments (1)');
                        _b = expect;
                        return [4 /*yield*/, commentsTab.isCommentDisplayed()];
                    case 8:
                        _b.apply(void 0, [_d.sent()]).toBe(true, "Comment not displayed");
                        _c = expect;
                        return [4 /*yield*/, commentsTab.getCommentText()];
                    case 9:
                        _c.apply(void 0, [_d.sent()]).toBe(myComment, 'Incorrect comment text');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('from Shared Files', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 3 })];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickSharedFilesAndWait()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Comments are displayed ordered by created date in descending order - [C299189]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileWith2Comments)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, commentsTab.getNthCommentId(1)];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toContain(comment2File2Entry.id);
                        _b = expect;
                        return [4 /*yield*/, commentsTab.getNthCommentId(2)];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toContain(comment1File2Entry.id);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Total number of comments is displayed - [C299190]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileWith2Comments)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 4:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, commentsTab.getCommentsTabHeaderText()];
                    case 5:
                        _a.apply(void 0, [_b.sent()]).toBe('Comments (2)');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Add a comment on a file - [C299191]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var myComment, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        myComment = 'my comment';
                        return [4 /*yield*/, dataTable.selectItem(file2Shared)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, commentsTab.typeComment(myComment)];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, commentsTab.clickAddButton()];
                    case 6:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, commentsTab.getCommentsTabHeaderText()];
                    case 7:
                        _a.apply(void 0, [_d.sent()]).toBe('Comments (1)');
                        _b = expect;
                        return [4 /*yield*/, commentsTab.isCommentDisplayed()];
                    case 8:
                        _b.apply(void 0, [_d.sent()]).toBe(true, "Comment not displayed");
                        _c = expect;
                        return [4 /*yield*/, commentsTab.getCommentText()];
                    case 9:
                        _c.apply(void 0, [_d.sent()]).toBe(myComment, 'Incorrect comment text');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('from Recent Files', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.search.waitForApi(username, { expect: 7 })];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickRecentFilesAndWait()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Comments are displayed ordered by created date in descending order - [C299193]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileWith2Comments)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, commentsTab.getNthCommentId(1)];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toContain(comment2File2Entry.id);
                        _b = expect;
                        return [4 /*yield*/, commentsTab.getNthCommentId(2)];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toContain(comment1File2Entry.id);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Total number of comments is displayed - [C299194]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileWith2Comments)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 4:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, commentsTab.getCommentsTabHeaderText()];
                    case 5:
                        _a.apply(void 0, [_b.sent()]).toBe('Comments (2)');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Add a comment on a file - [C299195]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var myComment, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        myComment = 'my comment';
                        return [4 /*yield*/, dataTable.selectItem(file2Recent)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, commentsTab.typeComment(myComment)];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, commentsTab.clickAddButton()];
                    case 6:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, commentsTab.getCommentsTabHeaderText()];
                    case 7:
                        _a.apply(void 0, [_d.sent()]).toBe('Comments (1)');
                        _b = expect;
                        return [4 /*yield*/, commentsTab.isCommentDisplayed()];
                    case 8:
                        _b.apply(void 0, [_d.sent()]).toBe(true, "Comment not displayed");
                        _c = expect;
                        return [4 /*yield*/, commentsTab.getCommentText()];
                    case 9:
                        _c.apply(void 0, [_d.sent()]).toBe(myComment, 'Incorrect comment text');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Comment info display', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.comments.addComment(fileWith1CommentId, 'this is my comment')];
                    case 1:
                        commentFile1Entry = (_a.sent()).entry;
                        return [4 /*yield*/, apis.user.favorites.waitForApi({ expect: 4 })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 3 })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, apis.user.search.waitForApi(username, { expect: 7 })];
                    case 4:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('File from Personal files - [C280582]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return tslib_1.__generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 1:
                        _j.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(parent)];
                    case 2:
                        _j.sent();
                        return [4 /*yield*/, dataTable.selectItem(fileWith1Comment)];
                    case 3:
                        _j.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 4:
                        _j.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 5:
                        _j.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 6:
                        _j.sent();
                        _a = expect;
                        return [4 /*yield*/, commentsTab.getCommentsTabHeaderText()];
                    case 7:
                        _a.apply(void 0, [_j.sent()]).toBe('Comments (1)');
                        _b = expect;
                        return [4 /*yield*/, commentsTab.isCommentTextAreaDisplayed()];
                    case 8:
                        _b.apply(void 0, [_j.sent()]).toBe(true, 'Comment field not present');
                        _c = expect;
                        return [4 /*yield*/, commentsTab.isAddCommentButtonEnabled()];
                    case 9:
                        _c.apply(void 0, [_j.sent()]).toBe(false, 'Add comment button not disabled');
                        _d = expect;
                        return [4 /*yield*/, commentsTab.isCommentDisplayed(commentFile1Entry.id)];
                    case 10:
                        _d.apply(void 0, [_j.sent()]).toBe(true, "Comment with id: " + commentFile1Entry.id + " not displayed");
                        _e = expect;
                        return [4 /*yield*/, commentsTab.getCommentText(commentFile1Entry.id)];
                    case 11:
                        _e.apply(void 0, [_j.sent()]).toBe(commentFile1Entry.content, 'Incorrect comment text');
                        _f = expect;
                        return [4 /*yield*/, commentsTab.getCommentUserName(commentFile1Entry.id)];
                    case 12:
                        _f.apply(void 0, [_j.sent()]).toBe(username + " " + username, 'Incorrect comment user');
                        _g = expect;
                        return [4 /*yield*/, commentsTab.getCommentTime(commentFile1Entry.id)];
                    case 13:
                        _g.apply(void 0, [_j.sent()]).toBe(moment(commentFile1Entry.createdAt).fromNow(), 'Incorrect comment created time');
                        _h = expect;
                        return [4 /*yield*/, commentsTab.isCommentUserAvatarDisplayed(commentFile1Entry.id)];
                    case 14:
                        _h.apply(void 0, [_j.sent()]).toBe(true, 'User avatar not displayed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('File from Favorites - [C299196]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return tslib_1.__generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4 /*yield*/, page.clickFavoritesAndWait()];
                    case 1:
                        _j.sent();
                        return [4 /*yield*/, dataTable.selectItem(fileWith1Comment)];
                    case 2:
                        _j.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 3:
                        _j.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 4:
                        _j.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 5:
                        _j.sent();
                        _a = expect;
                        return [4 /*yield*/, commentsTab.getCommentsTabHeaderText()];
                    case 6:
                        _a.apply(void 0, [_j.sent()]).toBe('Comments (1)');
                        _b = expect;
                        return [4 /*yield*/, commentsTab.isCommentTextAreaDisplayed()];
                    case 7:
                        _b.apply(void 0, [_j.sent()]).toBe(true, 'Comment field not present');
                        _c = expect;
                        return [4 /*yield*/, commentsTab.isAddCommentButtonEnabled()];
                    case 8:
                        _c.apply(void 0, [_j.sent()]).toBe(false, 'Add comment button not disabled');
                        _d = expect;
                        return [4 /*yield*/, commentsTab.isCommentDisplayed(commentFile1Entry.id)];
                    case 9:
                        _d.apply(void 0, [_j.sent()]).toBe(true, "Comment with id: " + commentFile1Entry.id + " not displayed");
                        _e = expect;
                        return [4 /*yield*/, commentsTab.getCommentText(commentFile1Entry.id)];
                    case 10:
                        _e.apply(void 0, [_j.sent()]).toBe(commentFile1Entry.content, 'Incorrect comment text');
                        _f = expect;
                        return [4 /*yield*/, commentsTab.getCommentUserName(commentFile1Entry.id)];
                    case 11:
                        _f.apply(void 0, [_j.sent()]).toBe(username + " " + username, 'Incorrect comment user');
                        _g = expect;
                        return [4 /*yield*/, commentsTab.getCommentTime(commentFile1Entry.id)];
                    case 12:
                        _g.apply(void 0, [_j.sent()]).toBe(moment(commentFile1Entry.createdAt).fromNow(), 'Incorrect comment created time');
                        _h = expect;
                        return [4 /*yield*/, commentsTab.isCommentUserAvatarDisplayed(commentFile1Entry.id)];
                    case 13:
                        _h.apply(void 0, [_j.sent()]).toBe(true, 'User avatar not displayed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('File from Shared Files - [C299188]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return tslib_1.__generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4 /*yield*/, page.clickSharedFilesAndWait()];
                    case 1:
                        _j.sent();
                        return [4 /*yield*/, dataTable.selectItem(fileWith1Comment)];
                    case 2:
                        _j.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 3:
                        _j.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 4:
                        _j.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 5:
                        _j.sent();
                        _a = expect;
                        return [4 /*yield*/, commentsTab.getCommentsTabHeaderText()];
                    case 6:
                        _a.apply(void 0, [_j.sent()]).toBe('Comments (1)');
                        _b = expect;
                        return [4 /*yield*/, commentsTab.isCommentTextAreaDisplayed()];
                    case 7:
                        _b.apply(void 0, [_j.sent()]).toBe(true, 'Comment field not present');
                        _c = expect;
                        return [4 /*yield*/, commentsTab.isAddCommentButtonEnabled()];
                    case 8:
                        _c.apply(void 0, [_j.sent()]).toBe(false, 'Add comment button not disabled');
                        _d = expect;
                        return [4 /*yield*/, commentsTab.isCommentDisplayed(commentFile1Entry.id)];
                    case 9:
                        _d.apply(void 0, [_j.sent()]).toBe(true, "Comment with id: " + commentFile1Entry.id + " not displayed");
                        _e = expect;
                        return [4 /*yield*/, commentsTab.getCommentText(commentFile1Entry.id)];
                    case 10:
                        _e.apply(void 0, [_j.sent()]).toBe(commentFile1Entry.content, 'Incorrect comment text');
                        _f = expect;
                        return [4 /*yield*/, commentsTab.getCommentUserName(commentFile1Entry.id)];
                    case 11:
                        _f.apply(void 0, [_j.sent()]).toBe(username + " " + username, 'Incorrect comment user');
                        _g = expect;
                        return [4 /*yield*/, commentsTab.getCommentTime(commentFile1Entry.id)];
                    case 12:
                        _g.apply(void 0, [_j.sent()]).toBe(moment(commentFile1Entry.createdAt).fromNow(), 'Incorrect comment created time');
                        _h = expect;
                        return [4 /*yield*/, commentsTab.isCommentUserAvatarDisplayed(commentFile1Entry.id)];
                    case 13:
                        _h.apply(void 0, [_j.sent()]).toBe(true, 'User avatar not displayed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('File from Recent Files - [C299192]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return tslib_1.__generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4 /*yield*/, page.clickRecentFilesAndWait()];
                    case 1:
                        _j.sent();
                        return [4 /*yield*/, dataTable.selectItem(fileWith1Comment)];
                    case 2:
                        _j.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 3:
                        _j.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 4:
                        _j.sent();
                        return [4 /*yield*/, infoDrawer.clickCommentsTab()];
                    case 5:
                        _j.sent();
                        _a = expect;
                        return [4 /*yield*/, commentsTab.getCommentsTabHeaderText()];
                    case 6:
                        _a.apply(void 0, [_j.sent()]).toBe('Comments (1)');
                        _b = expect;
                        return [4 /*yield*/, commentsTab.isCommentTextAreaDisplayed()];
                    case 7:
                        _b.apply(void 0, [_j.sent()]).toBe(true, 'Comment field not present');
                        _c = expect;
                        return [4 /*yield*/, commentsTab.isAddCommentButtonEnabled()];
                    case 8:
                        _c.apply(void 0, [_j.sent()]).toBe(false, 'Add comment button not disabled');
                        _d = expect;
                        return [4 /*yield*/, commentsTab.isCommentDisplayed(commentFile1Entry.id)];
                    case 9:
                        _d.apply(void 0, [_j.sent()]).toBe(true, "Comment with id: " + commentFile1Entry.id + " not displayed");
                        _e = expect;
                        return [4 /*yield*/, commentsTab.getCommentText(commentFile1Entry.id)];
                    case 10:
                        _e.apply(void 0, [_j.sent()]).toBe(commentFile1Entry.content, 'Incorrect comment text');
                        _f = expect;
                        return [4 /*yield*/, commentsTab.getCommentUserName(commentFile1Entry.id)];
                    case 11:
                        _f.apply(void 0, [_j.sent()]).toBe(username + " " + username, 'Incorrect comment user');
                        _g = expect;
                        return [4 /*yield*/, commentsTab.getCommentTime(commentFile1Entry.id)];
                    case 12:
                        _g.apply(void 0, [_j.sent()]).toBe(moment(commentFile1Entry.createdAt).fromNow(), 'Incorrect comment created time');
                        _h = expect;
                        return [4 /*yield*/, commentsTab.isCommentUserAvatarDisplayed(commentFile1Entry.id)];
                    case 13:
                        _h.apply(void 0, [_j.sent()]).toBe(true, 'User avatar not displayed');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=comments.test.js.map