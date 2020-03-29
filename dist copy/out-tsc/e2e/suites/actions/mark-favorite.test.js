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
import { SITE_VISIBILITY } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
describe('Mark items as favorites', function () {
    var username = "user-" + Utils.random();
    var parent = "parent-" + Utils.random();
    var fileNotFavUI = "fileNotFavUI-" + Utils.random() + ".txt";
    var fileFavUI = "fileFavUI-" + Utils.random() + ".txt";
    var fileNotFav1 = "fileNotFav1-" + Utils.random() + ".txt";
    var fileNotFav2 = "fileNotFav2-" + Utils.random() + ".txt";
    var fileNotFav3 = "fileNotFav3-" + Utils.random() + ".txt";
    var fileNotFav4 = "fileNotFav4-" + Utils.random() + ".txt";
    var fileFav1 = "fileFav1-" + Utils.random() + ".txt";
    var fileFav2 = "fileFav2-" + Utils.random() + ".txt";
    var fileFav3 = "fileFav3-" + Utils.random() + ".txt";
    var fileFav4 = "fileFav4-" + Utils.random() + ".txt";
    var folder = "folder-" + Utils.random();
    var fileFavUIId, fileNotFav1Id, fileNotFav2Id, fileNotFav3Id, fileNotFav4Id, fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id, folderId, parentId;
    var fileSearchNotFav1 = "search-fileNotFav1-" + Utils.random() + ".txt";
    var fileSearchNotFav2 = "search-fileNotFav2-" + Utils.random() + ".txt";
    var fileSearchNotFav3 = "search-fileNotFav3-" + Utils.random() + ".txt";
    var fileSearchNotFav4 = "search-fileNotFav4-" + Utils.random() + ".txt";
    var fileSearchFav1 = "search-fileFav1-" + Utils.random() + ".txt";
    var fileSearchFav2 = "search-fileFav2-" + Utils.random() + ".txt";
    var fileSearchFav3 = "search-fileFav3-" + Utils.random() + ".txt";
    var fileSearchFav4 = "search-fileFav4-" + Utils.random() + ".txt";
    var folderSearch = "search-folder-" + Utils.random();
    var fileSearchNotFav1Id, fileSearchNotFav2Id, fileSearchNotFav3Id, fileSearchNotFav4Id;
    var fileSearchFav1Id, fileSearchFav2Id, fileSearchFav3Id, fileSearchFav4Id, folderSearchId;
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable, toolbar = page.toolbar;
    var searchInput = page.header.searchInput;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                case 2:
                    parentId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileNotFavUI, parentId)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(fileFavUI, parentId)];
                case 4:
                    fileFavUIId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileNotFav1, parentId)];
                case 5:
                    fileNotFav1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileNotFav2, parentId)];
                case 6:
                    fileNotFav2Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileNotFav3, parentId)];
                case 7:
                    fileNotFav3Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileNotFav4, parentId)];
                case 8:
                    fileNotFav4Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileFav1, parentId)];
                case 9:
                    fileFav1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileFav2, parentId)];
                case 10:
                    fileFav2Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileFav3, parentId)];
                case 11:
                    fileFav3Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileFav4, parentId)];
                case 12:
                    fileFav4Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(folder, parentId)];
                case 13:
                    folderId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileSearchNotFav1, parentId)];
                case 14:
                    fileSearchNotFav1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileSearchNotFav2, parentId)];
                case 15:
                    fileSearchNotFav2Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileSearchNotFav3, parentId)];
                case 16:
                    fileSearchNotFav3Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileSearchNotFav4, parentId)];
                case 17:
                    fileSearchNotFav4Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileSearchFav1, parentId)];
                case 18:
                    fileSearchFav1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileSearchFav2, parentId)];
                case 19:
                    fileSearchFav2Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileSearchFav3, parentId)];
                case 20:
                    fileSearchFav3Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileSearchFav4, parentId)];
                case 21:
                    fileSearchFav4Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderSearch, parentId)];
                case 22:
                    folderSearchId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.favorites.addFavoritesByIds('file', [fileFavUIId, fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id])];
                case 23:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoritesByIds('file', [fileSearchFav1Id, fileSearchFav2Id, fileSearchFav3Id, fileSearchFav4Id])];
                case 24:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.waitForApi({ expect: 9 })];
                case 25:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.shareFilesByIds([fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id])];
                case 26:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.shareFilesByIds([fileNotFav1Id, fileNotFav2Id, fileNotFav3Id, fileNotFav4Id])];
                case 27:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 8 })];
                case 28:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 29:
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
                case 0: return [4 /*yield*/, Utils.pressEscape()];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('on Personal Files', function () {
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, apis.user.favorites.addFavoritesByIds('file', [fileFavUIId, fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('folder', folderId)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.removeFavoritesByIds([fileNotFav1Id, fileNotFav2Id, fileNotFav3Id, fileNotFav4Id])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.waitForApi({ expect: 10 })];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(parent)];
                    case 3:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Favorite action has empty star icon for an item not marked as favorite - [C217186]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileNotFavUI)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, toolbar.menu.getItemIconText('Favorite')];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toEqual('star_border');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Favorite action has empty star icon for multiple selection of items when some are not favorite - [C217187]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([fileNotFavUI, fileFavUI])];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, toolbar.menu.getItemIconText('Favorite')];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toEqual('star_border');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Favorite action has full star icon for items marked as favorite - [C217188]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileFavUI)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, toolbar.menu.getItemIconText('Remove Favorite')];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toEqual('star');
                        return [2 /*return*/];
                }
            });
        }); });
        it('favorite a file - [C217189]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileNotFav1)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileNotFav1Id, { expect: true })];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(true, fileNotFav1 + " not marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('favorite a folder - [C280390]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(folder)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(folderId, { expect: true })];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(true, folder + " not marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('unfavorite an item - [C217190]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileFav1)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsRemoveFavorite()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileFav1Id, { expect: false })];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(false, fileFav1 + " is marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('favorite multiple items - all unfavorite - [C217192]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([fileNotFav2, fileNotFav3])];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileNotFav2Id, { expect: true })];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(true, fileNotFav2 + " not marked as favorite");
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileNotFav3Id, { expect: true })];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, fileNotFav3 + " not marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('favorite multiple items - some favorite and some unfavorite - [C217194]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([fileNotFav4, fileFav2])];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileNotFav4Id, { expect: true })];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(true, fileNotFav4 + " not marked as favorite");
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileFav2Id, { expect: true })];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, fileFav2 + " not marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('unfavorite multiple items - [C217193]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([fileFav3, fileFav4])];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsRemoveFavorite()];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileFav3Id, { expect: false })];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(false, fileFav3 + " marked as favorite");
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileFav4Id, { expect: false })];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(false, fileFav4 + " marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Recent Files', function () {
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, apis.user.favorites.addFavoritesByIds('file', [fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.removeFavoritesByIds([fileNotFav1Id, fileNotFav2Id, fileNotFav3Id, fileNotFav4Id])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.waitForApi({ expect: 10 })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.clickRecentFilesAndWait()];
                    case 2:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('favorite a file - [C280352]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileNotFav1)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileNotFav1Id, { expect: true })];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(true, fileNotFav1 + " not marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('unfavorite an item - [C280353]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileFav1)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsRemoveFavorite()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileFav1Id, { expect: false })];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(false, fileFav1 + " is marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('favorite multiple items - all unfavorite - [C280355]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([fileNotFav2, fileNotFav3])];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileNotFav2Id, { expect: true })];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(true, fileNotFav2 + " not marked as favorite");
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileNotFav3Id, { expect: true })];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, fileNotFav3 + " not marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('favorite multiple items - some favorite and some unfavorite - [C280357]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([fileNotFav4, fileFav2])];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileNotFav4Id, { expect: true })];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(true, fileNotFav4 + " not marked as favorite");
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileFav2Id, { expect: true })];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, fileFav2 + " not marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('unfavorite multiple items - [C280356]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([fileFav3, fileFav4])];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsRemoveFavorite()];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileFav3Id, { expect: false })];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(false, fileFav3 + " marked as favorite");
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileFav4Id, { expect: false })];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(false, fileFav4 + " marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Shared Files', function () {
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, apis.user.favorites.addFavoritesByIds('file', [fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.removeFavoritesByIds([fileNotFav1Id, fileNotFav2Id, fileNotFav3Id, fileNotFav4Id])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.waitForApi({ expect: 10 })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.clickSharedFilesAndWait()];
                    case 2:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('favorite a file - [C280362]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileNotFav1)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileNotFav1Id, { expect: true })];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(true, fileNotFav1 + " not marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('unfavorite an item - [C280363]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileFav1)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsRemoveFavorite()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileFav1Id, { expect: false })];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(false, fileFav1 + " is marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('favorite multiple items - all unfavorite - [C280365]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([fileNotFav2, fileNotFav3])];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileNotFav2Id, { expect: true })];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(true, fileNotFav2 + " not marked as favorite");
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileNotFav3Id, { expect: true })];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, fileNotFav3 + " not marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('favorite multiple items - some favorite and some unfavorite - [C280367]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([fileNotFav4, fileFav2])];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileNotFav4Id, { expect: true })];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(true, fileNotFav4 + " not marked as favorite");
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileFav2Id, { expect: true })];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, fileFav2 + " not marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('unfavorite multiple items - [C280366]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([fileFav3, fileFav4])];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsRemoveFavorite()];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileFav3Id, { expect: false })];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(false, fileFav3 + " marked as favorite");
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileFav4Id, { expect: false })];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(false, fileFav4 + " marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Favorites', function () {
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var error_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, apis.user.favorites.addFavoritesByIds('file', [fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.waitForApi({ expect: 10 })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.refresh()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.clickFavoritesAndWait()];
                    case 3:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('unfavorite an item - [C280368]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileFav1)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsRemoveFavorite()];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileFav1Id, { expect: false })];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(false, fileFav1 + " is marked as favorite");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileFav1)];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(false, 'item still displayed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('unfavorite multiple items - [C280374]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([fileFav3, fileFav4])];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsRemoveFavorite()];
                    case 2:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileFav3Id, { expect: false })];
                    case 3:
                        _a.apply(void 0, [_e.sent()]).toBe(false, fileFav3 + " marked as favorite");
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileFav4Id, { expect: false })];
                    case 4:
                        _b.apply(void 0, [_e.sent()]).toBe(false, fileFav4 + " marked as favorite");
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileFav3)];
                    case 5:
                        _c.apply(void 0, [_e.sent()]).toBe(false, 'file3 still displayed');
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileFav4)];
                    case 6:
                        _d.apply(void 0, [_e.sent()]).toBe(false, 'file4 still displayed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Favorite action has full star icon for items marked as favorite - [C280371]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileFav2)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, toolbar.menu.getItemIconText('Remove Favorite')];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toEqual('star');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Search Results', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.search.waitForNodes('search-f', { expect: 9 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, searchInput.searchFor('search-f')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 5:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.header.expandSideNav()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.clickPersonalFiles()];
                    case 2:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('favorite a file - [C306966]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileSearchNotFav1)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileSearchNotFav1Id, { expect: true })];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(true, fileSearchNotFav1 + " not marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('favorite a folder - [C306971]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(folderSearch)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(folderSearchId, { expect: true })];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(true, folderSearch + " not marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('unfavorite an item - [C306967]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileSearchFav1)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsRemoveFavorite()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileSearchFav1Id, { expect: false })];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(false, fileSearchFav1 + " is marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('favorite multiple items - all unfavorite - [C306968]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([fileSearchNotFav2, fileSearchNotFav3])];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileSearchNotFav2Id, { expect: true })];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(true, fileSearchNotFav2 + " not marked as favorite");
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileSearchNotFav3Id, { expect: true })];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, fileSearchNotFav3 + " not marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('favorite multiple items - some favorite and some unfavorite - [C306970]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([fileSearchNotFav4, fileSearchFav2])];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileSearchNotFav4Id, { expect: true })];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(true, fileSearchNotFav4 + " not marked as favorite");
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileSearchFav2Id, { expect: true })];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, fileSearchFav2 + " not marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('unfavorite multiple items - [C306969]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([fileSearchFav3, fileSearchFav4])];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsRemoveFavorite()];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileSearchFav3Id, { expect: false })];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(false, fileSearchFav3 + " marked as favorite");
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileSearchFav4Id, { expect: false })];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(false, fileSearchFav4 + " marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on File Libraries', function () {
        var siteName = "site-public-" + Utils.random();
        var folderSite = "folderSite-" + Utils.random();
        var fileSiteNotFav1 = "fileSiteNotFav1-" + Utils.random() + ".txt";
        var fileSiteNotFav2 = "fileSiteNotFav2-" + Utils.random() + ".txt";
        var fileSiteNotFav3 = "fileSiteNotFav3-" + Utils.random() + ".txt";
        var fileSiteNotFav4 = "fileSiteNotFav4-" + Utils.random() + ".txt";
        var fileSiteFav1 = "fileSiteFav1-" + Utils.random() + ".txt";
        var fileSiteFav2 = "fileSiteFav2-" + Utils.random() + ".txt";
        var fileSiteFav3 = "fileSiteFav3-" + Utils.random() + ".txt";
        var fileSiteFav4 = "fileSiteFav4-" + Utils.random() + ".txt";
        var folderSiteId, fileSiteNotFav1Id, fileSiteNotFav2Id, fileSiteNotFav3Id, fileSiteNotFav4Id;
        var fileSiteFav1Id, fileSiteFav2Id, fileSiteFav3Id, fileSiteFav4Id;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var docLibId;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.sites.getDocLibId(siteName)];
                    case 2:
                        docLibId = _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFolder(folderSite, docLibId)];
                    case 3:
                        folderSiteId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileSiteNotFav1, folderSiteId)];
                    case 4:
                        fileSiteNotFav1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileSiteNotFav2, folderSiteId)];
                    case 5:
                        fileSiteNotFav2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileSiteNotFav3, folderSiteId)];
                    case 6:
                        fileSiteNotFav3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileSiteNotFav4, folderSiteId)];
                    case 7:
                        fileSiteNotFav4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileSiteFav1, folderSiteId)];
                    case 8:
                        fileSiteFav1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileSiteFav2, folderSiteId)];
                    case 9:
                        fileSiteFav2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileSiteFav3, folderSiteId)];
                    case 10:
                        fileSiteFav3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileSiteFav4, folderSiteId)];
                    case 11:
                        fileSiteFav4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.favorites.addFavoritesByIds('file', [fileSiteFav1Id, fileSiteFav2Id, fileSiteFav3Id, fileSiteFav4Id])];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileSiteFav1Id, { expect: true })];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileSiteFav2Id, { expect: true })];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileSiteFav3Id, { expect: true })];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileSiteFav4Id, { expect: true })];
                    case 16:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.sites.deleteSite(siteName)];
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
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(siteName)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.dataTable.waitForHeader()];
                    case 4:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Favorite a folder - [C280391]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(folderSite)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(folderSiteId, { expect: true })];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(true, folderSite + " not marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Favorite a file - [C280342]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(folderSite)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(fileSiteNotFav1)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileSiteNotFav1Id, { expect: true })];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toBe(true, fileSiteNotFav1 + " not marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Unfavorite an item - [C280343]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(folderSite)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(fileSiteFav1)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsRemoveFavorite()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileSiteFav1Id, { expect: false })];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toBe(false, fileSiteFav1 + " is marked as favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Favorite multiple items - all unfavorite - [C280345]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(folderSite)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, dataTable.selectMultipleItems([fileSiteNotFav2, fileSiteNotFav3])];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileSiteNotFav2Id, { expect: true })];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'item not marked as favorite');
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileSiteNotFav3Id, { expect: true })];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'item not marked as favorite');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Unfavorite multiple items - [C280346]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(folderSite)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, dataTable.selectMultipleItems([fileSiteFav2, fileSiteFav3])];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsRemoveFavorite()];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileSiteFav2Id, { expect: false })];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(false, 'item marked as favorite');
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileSiteFav3Id, { expect: false })];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toBe(false, 'item marked as favorite');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Favorite multiple items - some favorite and some unfavorite - [C280347]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(folderSite)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, dataTable.selectMultipleItems([fileSiteNotFav4, fileSiteFav4])];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileSiteNotFav4Id, { expect: true })];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'item not marked as favorite');
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(fileSiteFav4Id, { expect: true })];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'item not marked as favorite');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=mark-favorite.test.js.map