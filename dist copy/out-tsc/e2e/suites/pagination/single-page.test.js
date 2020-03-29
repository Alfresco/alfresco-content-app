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
import { LoginPage, BrowsingPage, SearchResultsPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { AdminActions } from '../../utilities/admin-actions';
import { RepoClient } from '../../utilities/repo-client/repo-client';
describe('Pagination on single page', function () {
    var random = Utils.random();
    var username = "user-" + random;
    var siteName = "site-" + random;
    var siteId;
    var file = "file-" + random + ".txt";
    var fileId;
    var fileInTrash = "fileInTrash-" + random + ".txt";
    var fileInTrashId;
    var userApi = new RepoClient(username, username);
    var adminApiActions = new AdminActions();
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var pagination = page.pagination;
    var searchInput = page.header.searchInput;
    var searchResultsPage = new SearchResultsPage();
    beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adminApiActions.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, userApi.nodes.createFile(file)];
                case 2:
                    fileId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFile(fileInTrash)];
                case 3:
                    fileInTrashId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.sites.createSite(siteName)];
                case 4:
                    siteId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.deleteNodeById(fileInTrashId, false)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, userApi.favorites.addFavoriteById('file', fileId)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, userApi.shared.shareFileById(fileId)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, Promise.all([
                            userApi.favorites.waitForApi({ expect: 2 }),
                            userApi.search.waitForApi(username, { expect: 1 }),
                            userApi.shared.waitForApi({ expect: 1 }),
                            userApi.trashcan.waitForApi({ expect: 1 })
                        ])];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        userApi.nodes.deleteNodeById(fileId),
                        userApi.sites.deleteSite(siteId),
                        userApi.trashcan.emptyTrash()
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('page selector not displayed on Favorites - [C280112]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.clickFavoritesAndWait()];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, pagination.isPagesButtonPresent()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe(false, 'page selector displayed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('page selector not displayed on My Libraries - [C280085]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, pagination.isPagesButtonPresent()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe(false, 'page selector displayed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('page selector not displayed on Favorite Libraries - [C291874]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.goToFavoriteLibrariesAndWait()];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, pagination.isPagesButtonPresent()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe(false, 'page selector displayed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('page selector not displayed on Personal Files - [C280076]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, pagination.isPagesButtonPresent()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe(false, 'page selector displayed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('page selector not displayed on Recent Files - [C280103]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.clickRecentFilesAndWait()];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, pagination.isPagesButtonPresent()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe(false, 'page selector displayed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('page selector not displayed on Shared Files - [C280094]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.clickSharedFilesAndWait()];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, pagination.isPagesButtonPresent()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe(false, 'page selector displayed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('page selector not displayed on Trash - [C280121]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.clickTrashAndWait()];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, pagination.isPagesButtonPresent()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe(false, 'page selector displayed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('page selector not displayed on Search results - [C290124]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, searchInput.searchFor(file)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, searchResultsPage.waitForResults()];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, pagination.isPagesButtonPresent()];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBe(false, 'page selector displayed');
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=single-page.test.js.map