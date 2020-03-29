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
import { SITE_VISIBILITY } from '../../configs';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';
describe('Breadcrumb', function () {
    var username = "user-" + Utils.random();
    var parent = "parent-" + Utils.random();
    var parentId;
    var subFolder1 = "subFolder1-" + Utils.random();
    var subFolder1Id;
    var subFolder2 = "subFolder2-" + Utils.random();
    var subFolder2Id;
    var fileName1 = "file1-" + Utils.random() + ".txt";
    var siteName = "site-" + Utils.random();
    var parent2 = "parent2-" + Utils.random();
    var parent2Id;
    var folder1 = "folder1-" + Utils.random();
    var folder1Id;
    var folder1Renamed = "renamed-" + Utils.random();
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var breadcrumb = page.breadcrumb;
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var docLibId;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                case 2:
                    parentId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(subFolder1, parentId)];
                case 3:
                    subFolder1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(subFolder2, subFolder1Id)];
                case 4:
                    subFolder2Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileName1, subFolder2Id)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(parent2)];
                case 6:
                    parent2Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(folder1, parent2Id)];
                case 7:
                    folder1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.getDocLibId(siteName)];
                case 9:
                    docLibId = _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(parent, docLibId)];
                case 10:
                    parentId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(subFolder1, parentId)];
                case 11:
                    subFolder1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(subFolder2, subFolder1Id)];
                case 12:
                    subFolder2Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileName1, subFolder2Id)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 14:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        apis.user.nodes.deleteNodeById(parentId),
                        apis.user.nodes.deleteNodeById(parent2Id),
                        apis.user.sites.deleteSite(siteName)
                    ])];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Personal Files breadcrumb main node - [C260964]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.clickPersonalFiles()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, breadcrumb.getItemsCount()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toEqual(1, 'Breadcrumb has incorrect number of items');
                    _b = expect;
                    return [4 /*yield*/, breadcrumb.getCurrentItemName()];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe('Personal Files');
                    return [2 /*return*/];
            }
        });
    }); });
    it('My Libraries breadcrumb main node - [C260966]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, breadcrumb.getItemsCount()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toEqual(1, 'Breadcrumb has incorrect number of items');
                    _b = expect;
                    return [4 /*yield*/, breadcrumb.getCurrentItemName()];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe('My Libraries');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Favorite Libraries breadcrumb main node - [C289891]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.goToFavoriteLibrariesAndWait()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, breadcrumb.getItemsCount()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toEqual(1, 'Breadcrumb has incorrect number of items');
                    _b = expect;
                    return [4 /*yield*/, breadcrumb.getCurrentItemName()];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe('Favorite Libraries');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Recent Files breadcrumb main node - [C260971]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.clickRecentFiles()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, breadcrumb.getItemsCount()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toEqual(1, 'Breadcrumb has incorrect number of items');
                    _b = expect;
                    return [4 /*yield*/, breadcrumb.getCurrentItemName()];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe('Recent Files');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Shared Files breadcrumb main node - [C260972]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.clickSharedFiles()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, breadcrumb.getItemsCount()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toEqual(1, 'Breadcrumb has incorrect number of items');
                    _b = expect;
                    return [4 /*yield*/, breadcrumb.getCurrentItemName()];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe('Shared Files');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Favorites breadcrumb main node - [C260973]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.clickFavorites()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, breadcrumb.getItemsCount()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toEqual(1, 'Breadcrumb has incorrect number of items');
                    _b = expect;
                    return [4 /*yield*/, breadcrumb.getCurrentItemName()];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe('Favorites');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Trash breadcrumb main node - [C260974]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.clickTrash()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, breadcrumb.getItemsCount()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toEqual(1, 'Breadcrumb has incorrect number of items');
                    _b = expect;
                    return [4 /*yield*/, breadcrumb.getCurrentItemName()];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe('Trash');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Personal Files breadcrumb for a folder hierarchy - [C260965]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var expectedBreadcrumb, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(parent)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(subFolder1)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(subFolder2)];
                case 4:
                    _b.sent();
                    expectedBreadcrumb = ['Personal Files', parent, subFolder1, subFolder2];
                    _a = expect;
                    return [4 /*yield*/, breadcrumb.getAllItems()];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toEqual(expectedBreadcrumb);
                    return [2 /*return*/];
            }
        });
    }); });
    it('File Libraries breadcrumb for a folder hierarchy - [C260967]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var expectedItems, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.clickFileLibrariesAndWait()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(siteName)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(parent)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(subFolder1)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(subFolder2)];
                case 5:
                    _b.sent();
                    expectedItems = ['My Libraries', siteName, parent, subFolder1, subFolder2];
                    _a = expect;
                    return [4 /*yield*/, breadcrumb.getAllItems()];
                case 6:
                    _a.apply(void 0, [_b.sent()]).toEqual(expectedItems);
                    return [2 /*return*/];
            }
        });
    }); });
    it('User can navigate to any location by clicking on a step from the breadcrumb - [C213235]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var expectedBreadcrumb, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(parent)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(subFolder1)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(subFolder2)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, breadcrumb.clickItem(subFolder1)];
                case 5:
                    _b.sent();
                    expectedBreadcrumb = ['Personal Files', parent, subFolder1];
                    _a = expect;
                    return [4 /*yield*/, breadcrumb.getAllItems()];
                case 6:
                    _a.apply(void 0, [_b.sent()]).toEqual(expectedBreadcrumb);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Tooltip appears on hover on a step in breadcrumb - [C213237]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(parent)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(subFolder1)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(subFolder2)];
                case 4:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, breadcrumb.getNthItemTooltip(3)];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toEqual(subFolder1);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Breadcrumb updates correctly when folder is renamed - [C213238]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(parent2)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(folder1)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.wait()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, apis.user.nodes.renameNode(folder1Id, folder1Renamed)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, page.refresh()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.wait()];
                case 7:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, breadcrumb.getCurrentItemName()];
                case 8:
                    _a.apply(void 0, [_b.sent()]).toEqual(folder1Renamed);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Browser back navigates to previous location regardless of breadcrumb steps - [C213240]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var expectedBreadcrumb, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(parent)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(subFolder1)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(subFolder2)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, page.clickTrash()];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, page.dataTable.waitForEmptyState()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, browser.navigate().back()];
                case 7:
                    _b.sent();
                    expectedBreadcrumb = ['Personal Files', parent, subFolder1, subFolder2];
                    _a = expect;
                    return [4 /*yield*/, breadcrumb.getAllItems()];
                case 8:
                    _a.apply(void 0, [_b.sent()]).toEqual(expectedBreadcrumb);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('as admin', function () {
        var user2 = "user2-" + Utils.random();
        var userFolder = "userFolder-" + Utils.random();
        var userFolderId;
        var user2Api = new RepoClient(user2, user2);
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: user2 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user2Api.nodes.createFolder(userFolder)];
                    case 2:
                        userFolderId = (_a.sent()).entry.id;
                        return [4 /*yield*/, loginPage.loginWithAdmin()];
                    case 3:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user2Api.nodes.deleteNodeById(userFolderId)];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it("Breadcrumb on navigation to a user's home - [C260970]", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName('User Homes')];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(user2)];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, breadcrumb.getAllItems()];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toEqual(['Personal Files', 'User Homes', user2]);
                        return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(userFolder)];
                    case 4:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, breadcrumb.getAllItems()];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toEqual(['Personal Files', 'User Homes', user2, userFolder]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=breadcrumb.test.js.map