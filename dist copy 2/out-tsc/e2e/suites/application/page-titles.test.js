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
import { browser } from 'protractor';
import { PAGE_TITLES } from '../../configs';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
describe('Page titles', function () {
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var adminApi = new RepoClient();
    var nodesApi = adminApi.nodes;
    var file = "file-" + Utils.random() + ".txt";
    var fileId;
    var searchInput = page.header.searchInput;
    describe('on Login / Logout pages', function () {
        it('on Login page - [C217155]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loginPage.load()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getTitle()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toContain('Sign in');
                        return [2 /*return*/];
                }
            });
        }); });
        it('after logout - [C217156]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWithAdmin()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.signOut()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getTitle()];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toContain('Sign in');
                        return [2 /*return*/];
                }
            });
        }); });
        it('when pressing Back after Logout - [C280414]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWithAdmin()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.signOut()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, browser.navigate().back()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getTitle()];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toContain('Sign in');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on app pages', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nodesApi.createFile(file)];
                    case 1:
                        fileId = (_a.sent()).entry.id;
                        return [4 /*yield*/, loginPage.loginWithAdmin()];
                    case 2:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adminApi.nodes.deleteNodeById(fileId)];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Personal Files page - [C217157]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.clickPersonalFiles()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getTitle()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toContain(PAGE_TITLES.PERSONAL_FILES);
                        return [2 /*return*/];
                }
            });
        }); });
        it('My Libraries page - [C217158]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.goToMyLibraries()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getTitle()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toContain(PAGE_TITLES.MY_LIBRARIES);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Favorite Libraries page - [C289907]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.goToFavoriteLibraries()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getTitle()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toContain(PAGE_TITLES.FAVORITE_LIBRARIES);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Shared Files page - [C217159]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.clickSharedFiles()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getTitle()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toContain(PAGE_TITLES.SHARED_FILES);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Recent Files page - [C217160]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.clickRecentFiles()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getTitle()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toContain(PAGE_TITLES.RECENT_FILES);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Favorites page - [C217161]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.clickFavorites()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getTitle()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toContain(PAGE_TITLES.FAVORITES);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Trash page - [C217162]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.clickTrash()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getTitle()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toContain(PAGE_TITLES.TRASH);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File Preview page - [C280415]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(file)];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getTitle()];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toContain(PAGE_TITLES.VIEWER);
                        return [4 /*yield*/, Utils.pressEscape()];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Search Results page - [C280413]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, searchInput.searchFor(file)];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getTitle()];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toContain(PAGE_TITLES.SEARCH);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=page-titles.test.js.map