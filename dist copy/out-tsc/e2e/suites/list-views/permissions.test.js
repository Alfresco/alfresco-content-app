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
import { SITE_VISIBILITY, SITE_ROLES } from '../../configs';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';
describe('Special permissions', function () {
    var username = "user-" + Utils.random();
    var password = username;
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, password)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable;
    var searchInput = page.header.searchInput;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('file not displayed if user no longer has permissions on it', function () {
        var sitePrivate = "private-" + Utils.random();
        var fileName = "file-" + Utils.random() + ".txt";
        var fileId;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var docLibId;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.admin.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_COLLABORATOR.ROLE)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.sites.getDocLibId(sitePrivate)];
                    case 3:
                        docLibId = _a.sent();
                        return [4 /*yield*/, apis.admin.nodes.createFile(fileName, docLibId)];
                    case 4:
                        fileId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', fileId)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.shared.shareFileById(fileId)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.editNodeContent(fileId, 'edited by user')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, apis.user.search.waitForApi(username, { expect: 1 })];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 1 })];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginWith(username)];
                    case 10:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.admin.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_COLLABORATOR.ROLE)];
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
                    case 0: return [4 /*yield*/, apis.admin.sites.deleteSite(sitePrivate)];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Recent Files - [C213173]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.clickRecentFilesAndWait()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.getRowsCount()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(1, 'Incorrect number of items');
                        return [4 /*yield*/, apis.admin.sites.deleteSiteMember(sitePrivate, username)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, page.refresh()];
                    case 4:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isEmpty()];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Items are still displayed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Favorites - [C213227]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.clickFavoritesAndWait()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.getRowsCount()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(1, 'Incorrect number of items');
                        return [4 /*yield*/, apis.admin.sites.deleteSiteMember(sitePrivate, username)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, page.refresh()];
                    case 4:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isEmpty()];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Items are still displayed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Shared Files - [C213116]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.clickSharedFilesAndWait()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.getRowsCount()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(1, 'Incorrect number of items');
                        return [4 /*yield*/, apis.admin.sites.deleteSiteMember(sitePrivate, username)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, page.refresh()];
                    case 4:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isEmpty()];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Items are still displayed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Search Results - [C290122]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, searchInput.searchFor(fileName)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileName)];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toBe(true, fileName + " is not displayed");
                        return [4 /*yield*/, apis.admin.sites.deleteSiteMember(sitePrivate, username)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, searchInput.searchFor(fileName)];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 10:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileName)];
                    case 11:
                        _b.apply(void 0, [_c.sent()]).toBe(false, fileName + " is displayed");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("Location column is empty if user doesn't have permissions on the file's parent folder", function () {
        var sitePrivate = "private-" + Utils.random();
        var fileName = "file-" + Utils.random() + ".txt";
        var fileId;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var docLibId;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.admin.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_COLLABORATOR.ROLE)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.sites.getDocLibId(sitePrivate)];
                    case 3:
                        docLibId = _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(fileName, docLibId)];
                    case 4:
                        fileId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', fileId)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFileById(fileId)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 1 })];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, apis.user.search.waitForApi(username, { expect: 1 })];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.sites.deleteSiteMember(sitePrivate, username)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginWith(username)];
                    case 10:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.admin.sites.deleteSite(sitePrivate)];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it("on Recent Files - [C213178]", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.clickRecentFilesAndWait()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.getRowsCount()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(1, 'Incorrect number of items');
                        _b = expect;
                        return [4 /*yield*/, dataTable.getItemLocation(fileName)];
                    case 3:
                        _b.apply(void 0, [_c.sent()]).toEqual('Unknown');
                        return [2 /*return*/];
                }
            });
        }); });
        it("on Favorites - [C213672]", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.clickFavoritesAndWait()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.getRowsCount()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(1, 'Incorrect number of items');
                        _b = expect;
                        return [4 /*yield*/, dataTable.getItemLocation(fileName)];
                    case 3:
                        _b.apply(void 0, [_c.sent()]).toEqual('Unknown');
                        return [2 /*return*/];
                }
            });
        }); });
        it("on Shared Files - [C213668]", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.clickSharedFilesAndWait()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.getRowsCount()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(1, 'Incorrect number of items');
                        _b = expect;
                        return [4 /*yield*/, dataTable.getItemLocation(fileName)];
                    case 3:
                        _b.apply(void 0, [_c.sent()]).toEqual('Unknown');
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Search results - [C306868]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, searchInput.searchFor(fileName)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileName)];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toBe(true, fileName + " is not displayed");
                        _b = expect;
                        return [4 /*yield*/, dataTable.getItemLocation(fileName)];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toEqual('Unknown');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=permissions.test.js.map