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
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
describe('Download', function () {
    var username = "user-" + Utils.random();
    var parent = "parent-" + Utils.random();
    var parentId;
    var filePersonal = "filePersonal-" + Utils.random() + ".txt";
    var fileRecent1 = "fileRecent1-" + Utils.random() + ".txt";
    var fileRecent2 = "fileRecent2-" + Utils.random() + ".txt";
    var fileShared1 = "fileShared1-" + Utils.random() + ".txt";
    var fileShared2 = "fileShared2-" + Utils.random() + ".txt";
    var fileFavorites = "fileFavorites-" + Utils.random() + ".txt";
    var fileSearch = "fileSearch-" + Utils.random() + ".txt";
    var folderPersonal = "folderPersonal-" + Utils.random();
    var folderFavorites = "folderFavorites-" + Utils.random();
    var folderSearch = "folderSearch-" + Utils.random();
    var fileInFolderPersonal = "fileInFolderPersonal-" + Utils.random() + ".txt";
    var fileInFolderFavorites = "fileInFolderFavorites-" + Utils.random() + ".txt";
    var fileInFolderSearch = "fileInFolderSearch-" + Utils.random() + ".txt";
    var unzippedPersonal = "unzippedPersonal-" + Utils.random();
    var unzippedRecent = "unzippedRecent-" + Utils.random();
    var unzippedShared = "unzippedShared-" + Utils.random();
    var unzippedFavorites = "unzippedFavorites-" + Utils.random();
    var unzippedSearch = "unzippedSearch-" + Utils.random();
    var fileShared1Id, fileShared2Id, fileFavoritesId, folderPersonalId, folderFavoritesId, folderSearchId;
    var archiveZip = 'archive.zip';
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable, toolbar = page.toolbar;
    var searchResultsPage = new SearchResultsPage();
    var searchInput = searchResultsPage.header.searchInput;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                case 2:
                    parentId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(filePersonal, parentId)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(fileRecent1, parentId)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(fileRecent2, parentId)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(fileShared1, parentId)];
                case 6:
                    fileShared1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileShared2, parentId)];
                case 7:
                    fileShared2Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileFavorites, parentId)];
                case 8:
                    fileFavoritesId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileSearch, parentId)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderPersonal, parentId)];
                case 10:
                    folderPersonalId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileInFolderPersonal, folderPersonalId)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderFavorites, parentId)];
                case 12:
                    folderFavoritesId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileInFolderFavorites, folderFavoritesId)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderSearch, parentId)];
                case 14:
                    folderSearchId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileInFolderSearch, folderSearchId)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.shareFileById(fileShared1Id)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.shareFileById(fileShared2Id)];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', fileFavoritesId)];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('folder', folderFavoritesId)];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 20:
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
                    return [4 /*yield*/, apis.user.trashcan.emptyTrash()];
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
                case 0: return [4 /*yield*/, Utils.renameFile(archiveZip, Utils.random() + ".zip")];
                case 1:
                    _a.sent();
                    done();
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
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(parent)];
                    case 2:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Download a file - [C213179]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(filePersonal)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickDownload()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(filePersonal)];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'File not found in download location');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Download a folder - [C216352]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var folderZip, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(folderPersonal)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickDownload()];
                    case 2:
                        _c.sent();
                        folderZip = folderPersonal + ".zip";
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(folderZip)];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'File not found in download location');
                        return [4 /*yield*/, Utils.unzip(folderZip)];
                    case 4:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileInFolderPersonal, folderPersonal)];
                    case 5:
                        _b.apply(void 0, [_c.sent()]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Download multiple items - [C216353]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([filePersonal, folderPersonal])];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickDownload()];
                    case 2:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(archiveZip)];
                    case 3:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'File not found in download location');
                        return [4 /*yield*/, Utils.unzip(archiveZip, unzippedPersonal)];
                    case 4:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(filePersonal, unzippedPersonal)];
                    case 5:
                        _b.apply(void 0, [_e.sent()]).toBe(true, filePersonal + " not found in unzipped folder");
                        _c = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(folderPersonal, unzippedPersonal)];
                    case 6:
                        _c.apply(void 0, [_e.sent()]).toBe(true, folderPersonal + " not found in unzipped folder");
                        _d = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileInFolderPersonal, unzippedPersonal, folderPersonal)];
                    case 7:
                        _d.apply(void 0, [_e.sent()]).toBe(true, fileInFolderPersonal + " not found in unzipped folder in " + folderPersonal);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Favorites', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.favorites.waitForApi({ expect: 2 })];
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
        it('Download a file - [C280173]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileFavorites)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickDownload()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileFavorites)];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'File not found in download location');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Download a folder - [C280188]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var folderZip, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(folderFavorites)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickDownload()];
                    case 2:
                        _c.sent();
                        folderZip = folderFavorites + ".zip";
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(folderZip)];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'File not found in download location');
                        return [4 /*yield*/, Utils.unzip(folderZip)];
                    case 4:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileInFolderFavorites, folderFavorites)];
                    case 5:
                        _b.apply(void 0, [_c.sent()]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Download multiple items - [C280189]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([fileFavorites, folderFavorites])];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickDownload()];
                    case 2:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(archiveZip)];
                    case 3:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'File not found in download location');
                        return [4 /*yield*/, Utils.unzip(archiveZip, unzippedFavorites)];
                    case 4:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileFavorites, unzippedFavorites)];
                    case 5:
                        _b.apply(void 0, [_e.sent()]).toBe(true, fileFavorites + " not found in unzipped folder");
                        _c = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(folderFavorites, unzippedFavorites)];
                    case 6:
                        _c.apply(void 0, [_e.sent()]).toBe(true, folderFavorites + " not found in unzipped folder");
                        _d = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileInFolderFavorites, unzippedFavorites, folderFavorites)];
                    case 7:
                        _d.apply(void 0, [_e.sent()]).toBe(true, fileInFolderFavorites + " not found in unzipped folder in " + folderFavorites);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Shared Files', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 2 })];
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
        it('Download a file - [C280170]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileShared1)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickDownload()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileShared1)];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'File not found in download location');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Download multiple items - [C280183]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([fileShared1, fileShared2])];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickDownload()];
                    case 2:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(archiveZip)];
                    case 3:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File not found in download location');
                        return [4 /*yield*/, Utils.unzip(archiveZip, unzippedShared)];
                    case 4:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileShared1, unzippedShared)];
                    case 5:
                        _b.apply(void 0, [_d.sent()]).toBe(true, fileShared1 + " not found in unzipped folder");
                        _c = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileShared2, unzippedShared)];
                    case 6:
                        _c.apply(void 0, [_d.sent()]).toBe(true, fileShared2 + " not found in unzipped folder");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Recent Files', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.search.waitForApi(username, { expect: 10 })];
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
        it('Download a file - [C280167]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileRecent1)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickDownload()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileRecent1)];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'File not found in download location');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Download multiple items - [C280177]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([fileRecent1, fileRecent2])];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickDownload()];
                    case 2:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(archiveZip)];
                    case 3:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File not found in download location');
                        return [4 /*yield*/, Utils.unzip(archiveZip, unzippedRecent)];
                    case 4:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileRecent1, unzippedRecent)];
                    case 5:
                        _b.apply(void 0, [_d.sent()]).toBe(true, fileRecent1 + " not found in unzipped folder");
                        _c = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileRecent2, unzippedRecent)];
                    case 6:
                        _c.apply(void 0, [_d.sent()]).toBe(true, fileRecent2 + " not found in unzipped folder");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Search Results', function () {
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, searchInput.searchFor('*Search*')];
                    case 4:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Download a file - [C279164]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileSearch, parent)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickDownload()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileSearch)];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'File not found in download location');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Download a folder - [C297694]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var folderZip, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(folderSearch, parent)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickDownload()];
                    case 2:
                        _c.sent();
                        folderZip = folderSearch + ".zip";
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(folderZip)];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'File not found in download location');
                        return [4 /*yield*/, Utils.unzip(folderZip)];
                    case 4:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileInFolderSearch, folderSearch)];
                    case 5:
                        _b.apply(void 0, [_c.sent()]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Download multiple items - [C297695]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([fileSearch, folderSearch], parent)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickDownload()];
                    case 2:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(archiveZip)];
                    case 3:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'File not found in download location');
                        return [4 /*yield*/, Utils.unzip(archiveZip, unzippedSearch)];
                    case 4:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileSearch, unzippedSearch)];
                    case 5:
                        _b.apply(void 0, [_e.sent()]).toBe(true, fileSearch + " not found in unzipped folder");
                        _c = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(folderSearch, unzippedSearch)];
                    case 6:
                        _c.apply(void 0, [_e.sent()]).toBe(true, folderSearch + " not found in unzipped folder");
                        _d = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileInFolderSearch, unzippedSearch, folderSearch)];
                    case 7:
                        _d.apply(void 0, [_e.sent()]).toBe(true, fileInFolderSearch + " not found in unzipped folder in " + folderSearch);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=download.test.js.map