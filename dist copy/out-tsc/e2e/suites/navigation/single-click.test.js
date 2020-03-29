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
import { Viewer } from '../../components/viewer/viewer';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
describe('Single click on item name', function () {
    var username = "user-" + Utils.random();
    var file1 = "file1-" + Utils.random() + ".txt";
    var file1Id;
    var folder1 = "folder1-" + Utils.random();
    var folder1Id;
    var deletedFile1 = "file1-" + Utils.random() + ".txt";
    var deletedFile1Id;
    var deletedFolder1 = "folder1-" + Utils.random();
    var deletedFolder1Id;
    var siteName = "site-" + Utils.random();
    var fileSite = "fileSite-" + Utils.random() + ".txt";
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable, breadcrumb = page.breadcrumb;
    var viewer = new Viewer();
    var searchInput = page.header.searchInput;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var docLibId;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(file1)];
                case 2:
                    file1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(folder1)];
                case 3:
                    folder1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(deletedFile1)];
                case 4:
                    deletedFile1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(deletedFolder1)];
                case 5:
                    deletedFolder1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(deletedFile1Id, false)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(deletedFolder1Id, false)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(siteName)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.getDocLibId(siteName)];
                case 9:
                    docLibId = (_a.sent());
                    return [4 /*yield*/, apis.user.nodes.createFile(fileSite, docLibId)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.shareFileById(file1Id)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 1 })];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file1Id)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('folder', folder1Id)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.waitForApi({ expect: 2 + 1 })];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
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
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(folder1Id)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(file1Id)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apis.user.trashcan.emptyTrash()];
                case 4:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Hyperlink does not appear for items in the Trash - [C284899]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.clickTrashAndWait()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.hasLinkOnName(deletedFile1)];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe(false, 'Link on name is present');
                    _b = expect;
                    return [4 /*yield*/, dataTable.hasLinkOnName(deletedFolder1)];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe(false, 'Link on name is present');
                    return [2 /*return*/];
            }
        });
    }); });
    describe('on Personal Files', function () {
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Hyperlink appears when mouse over a file/folder - [C280032]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.hasLinkOnName(file1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Link on name is missing');
                        return [2 /*return*/];
                }
            });
        }); });
        it('File preview opens when clicking the hyperlink - [C280033]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.clickNameLink(file1)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, Utils.pressEscape()];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Navigate inside the folder when clicking the hyperlink - [C280034]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.clickNameLink(folder1)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, breadcrumb.getCurrentItemName()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(folder1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on File Libraries', function () {
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickFileLibrariesAndWait()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Hyperlink appears when mouse over a library - [C284901]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.hasLinkOnName(siteName)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Link on site name is missing');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Navigate inside the library when clicking the hyperlink - [C284902]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.clickNameLink(siteName)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, breadcrumb.getCurrentItemName()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(siteName);
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileSite)];
                    case 3:
                        _b.apply(void 0, [_c.sent()]).toBe(true, fileSite + " not displayed");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Shared Files', function () {
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
        it('Hyperlink appears when mouse over a file - [C284905]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.hasLinkOnName(file1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Link on name is missing');
                        return [2 /*return*/];
                }
            });
        }); });
        it('File preview opens when clicking the hyperlink - [C284906]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.clickNameLink(file1)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, Utils.pressEscape()];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Recent Files', function () {
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
        it('Hyperlink appears when mouse over a file - [C284907]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.hasLinkOnName(file1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Link on name is missing');
                        return [2 /*return*/];
                }
            });
        }); });
        it('File preview opens when clicking the hyperlink - [C284908]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.clickNameLink(file1)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, Utils.pressEscape()];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Favorites', function () {
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
        it('Hyperlink appears when mouse over a file/folder - [C284909]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.hasLinkOnName(file1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Link on name is missing');
                        return [2 /*return*/];
                }
            });
        }); });
        it('File preview opens when clicking the hyperlink - [C284910]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.clickNameLink(file1)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, Utils.pressEscape()];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Navigate inside the folder when clicking the hyperlink - [C284911]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.clickNameLink(folder1)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, breadcrumb.getCurrentItemName()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(folder1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Search Results', function () {
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                    case 2:
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
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 2:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Hyperlink appears when mouse over a file - [C306988]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, searchInput.searchFor(file1)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.hasLinkOnSearchResultName(file1)];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Link on name is missing');
                        return [2 /*return*/];
                }
            });
        }); });
        it('File preview opens when clicking the hyperlink - [C306989]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, searchInput.searchFor(file1)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, dataTable.clickSearchResultNameLink(file1)];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, Utils.pressEscape()];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Navigate inside the folder when clicking the hyperlink - [C306990]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, searchInput.searchFor(folder1)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, dataTable.clickSearchResultNameLink(folder1)];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, breadcrumb.getCurrentItemName()];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toBe(folder1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=single-click.test.js.map