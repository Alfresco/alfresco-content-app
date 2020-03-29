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
import { FILES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
describe('Edit offline', function () {
    var username = "user-" + Utils.random();
    var file1 = "file1-" + Utils.random() + ".docx";
    var file1Id;
    var fileLocked = "file-locked-" + Utils.random() + ".docx";
    var fileLockedId;
    var fileLocked2 = "file-locked2-" + Utils.random() + ".docx";
    var fileLocked2Id;
    var fileSearch1 = "file-search-1-" + Utils.random() + ".docx";
    var fileSearch1Id;
    var fileSearchLocked = "file-search-locked-" + Utils.random() + ".docx";
    var fileSearchLockedId;
    var fileSearchLocked2 = "file-search-locked2-" + Utils.random() + ".docx";
    var fileSearchLocked2Id;
    var parentPF = "parentPersonal-" + Utils.random();
    var parentPFId;
    var parentSF = "parentShared-" + Utils.random();
    var parentSFId;
    var parentRF = "parentRecent-" + Utils.random();
    var parentRFId;
    var parentFav = "parentFav-" + Utils.random();
    var parentFavId;
    var parentSearch = "parentSearch-" + Utils.random();
    var parentSearchId;
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable, toolbar = page.toolbar;
    var searchInput = page.header.searchInput;
    beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('on Personal Files', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFolder(parentPF)];
                    case 1:
                        parentPFId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(FILES.docxFile, parentPFId, file1)];
                    case 2:
                        file1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(FILES.docxFile, parentPFId, fileLocked)];
                    case 3:
                        fileLockedId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(FILES.docxFile, parentPFId, fileLocked2)];
                    case 4:
                        fileLocked2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLockedId)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked2Id)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginWith(username)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(parentPF)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentPFId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('File is locked and downloaded when clicking Edit Offline - [C297538]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsEditOffline()];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(file1)];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'File not found in download location');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(file1Id)];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, file1 + " is not locked");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Lock information is displayed - [C297539]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileLocked2)];
                    case 1:
                        _a.apply(void 0, [_d.sent()]).toBe(true, fileLocked2 + " is not displayed");
                        _b = expect;
                        return [4 /*yield*/, dataTable.hasLockIcon(fileLocked2)];
                    case 2:
                        _b.apply(void 0, [_d.sent()]).toBe(true, fileLocked2 + " does not have a lock icon");
                        _c = expect;
                        return [4 /*yield*/, dataTable.getLockOwner(fileLocked2)];
                    case 3:
                        _c.apply(void 0, [_d.sent()]).toContain(username, fileLocked2 + " does not have correct lock owner info");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Cancel Editing unlocks the file - [C297540]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileLocked)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCancelEditing()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, dataTable.unselectItem(fileLocked)];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileLockedId)];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(false, fileLocked + " is still locked");
                        _b = expect;
                        return [4 /*yield*/, dataTable.hasLockIcon(fileLocked)];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toBe(false, fileLocked + " has a lock icon");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Shared Files', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFolder(parentSF)];
                    case 1:
                        parentSFId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(FILES.docxFile, parentSFId, file1)];
                    case 2:
                        file1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(FILES.docxFile, parentSFId, fileLocked)];
                    case 3:
                        fileLockedId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(FILES.docxFile, parentSFId, fileLocked2)];
                    case 4:
                        fileLocked2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLockedId)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked2Id)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFilesByIds([file1Id, fileLockedId, fileLocked2Id])];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 3 })];
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
                    case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentSFId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickSharedFilesAndWait()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('File is locked and downloaded when clicking Edit Offline - [C306950]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1, parentSF)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsEditOffline()];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(file1)];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'File not found in download location');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(file1Id)];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, file1 + " is not locked");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Lock information is displayed - [C306951]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileLocked2, parentSF)];
                    case 1:
                        _a.apply(void 0, [_d.sent()]).toBe(true, fileLocked2 + " is not displayed");
                        _b = expect;
                        return [4 /*yield*/, dataTable.hasLockIcon(fileLocked2, parentSF)];
                    case 2:
                        _b.apply(void 0, [_d.sent()]).toBe(true, fileLocked2 + " does not have a lock icon");
                        _c = expect;
                        return [4 /*yield*/, dataTable.getLockOwner(fileLocked2, parentSF)];
                    case 3:
                        _c.apply(void 0, [_d.sent()]).toContain(username, fileLocked2 + " does not have correct lock owner info");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Cancel Editing unlocks the file - [C306952]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileLocked)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCancelEditing()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, dataTable.unselectItem(fileLocked)];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileLockedId)];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(false, fileLocked + " is still locked");
                        _b = expect;
                        return [4 /*yield*/, dataTable.hasLockIcon(fileLocked, parentSF)];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toBe(false, fileLocked + " has a lock icon");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Recent Files', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFolder(parentRF)];
                    case 1:
                        parentRFId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.search.waitForApi(username, { expect: 0 })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(FILES.docxFile, parentRFId, file1)];
                    case 3:
                        file1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(FILES.docxFile, parentRFId, fileLocked)];
                    case 4:
                        fileLockedId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(FILES.docxFile, parentRFId, fileLocked2)];
                    case 5:
                        fileLocked2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLockedId)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked2Id)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, apis.user.search.waitForApi(username, { expect: 3 })];
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
                    case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentRFId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickRecentFilesAndWait()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('File is locked and downloaded when clicking Edit Offline - [C297541]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1, parentRF)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsEditOffline()];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(file1)];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'File not found in download location');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(file1Id)];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, file1 + " is not locked");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Lock information is displayed - [C297542]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileLocked2, parentRF)];
                    case 1:
                        _a.apply(void 0, [_d.sent()]).toBe(true, fileLocked2 + " is not displayed");
                        _b = expect;
                        return [4 /*yield*/, dataTable.hasLockIcon(fileLocked2, parentRF)];
                    case 2:
                        _b.apply(void 0, [_d.sent()]).toBe(true, fileLocked2 + " does not have a lock icon");
                        _c = expect;
                        return [4 /*yield*/, dataTable.getLockOwner(fileLocked2, parentRF)];
                    case 3:
                        _c.apply(void 0, [_d.sent()]).toContain(username, fileLocked2 + " does not have correct lock owner info");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Cancel Editing unlocks the file - [C297543]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileLocked, parentRF)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCancelEditing()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, dataTable.unselectItem(fileLocked, parentRF)];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileLockedId)];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(false, fileLocked + " is still locked");
                        _b = expect;
                        return [4 /*yield*/, dataTable.hasLockIcon(fileLocked, parentRF)];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toBe(false, fileLocked + " has a lock icon");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Favorite Files', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFolder(parentFav)];
                    case 1:
                        parentFavId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(FILES.docxFile, parentFavId, file1)];
                    case 2:
                        file1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(FILES.docxFile, parentFavId, fileLocked)];
                    case 3:
                        fileLockedId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(FILES.docxFile, parentFavId, fileLocked2)];
                    case 4:
                        fileLocked2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLockedId)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked2Id)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoritesByIds('file', [file1Id, fileLockedId, fileLocked2Id])];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.waitForApi({ expect: 3 })];
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
                    case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentFavId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickFavoritesAndWait()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // TODO: raise REPO issue: permissions not returned in /people/${personId}/favorites api
        xit('File is locked and downloaded when clicking Edit Offline - [C306956]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsEditOffline()];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(file1)];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'File not found in download location');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(file1Id)];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, file1 + " is not locked");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Lock information is displayed - [C306957]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileLocked2)];
                    case 1:
                        _a.apply(void 0, [_d.sent()]).toBe(true, fileLocked2 + " is not displayed");
                        _b = expect;
                        return [4 /*yield*/, dataTable.hasLockIcon(fileLocked2)];
                    case 2:
                        _b.apply(void 0, [_d.sent()]).toBe(true, fileLocked2 + " does not have a lock icon");
                        _c = expect;
                        return [4 /*yield*/, dataTable.getLockOwner(fileLocked2)];
                    case 3:
                        _c.apply(void 0, [_d.sent()]).toContain(username, fileLocked2 + " does not have correct lock owner info");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Cancel Editing unlocks the file - [C306958]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileLocked)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCancelEditing()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, dataTable.unselectItem(fileLocked)];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileLockedId)];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(false, fileLocked + " is still locked");
                        _b = expect;
                        return [4 /*yield*/, dataTable.hasLockIcon(fileLocked)];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toBe(false, fileLocked + " has a lock icon");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Search Results', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFolder(parentSearch)];
                    case 1:
                        parentSearchId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(FILES.docxFile, parentSearchId, fileSearch1)];
                    case 2:
                        fileSearch1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(FILES.docxFile, parentSearchId, fileSearchLocked)];
                    case 3:
                        fileSearchLockedId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(FILES.docxFile, parentSearchId, fileSearchLocked2)];
                    case 4:
                        fileSearchLocked2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileSearchLockedId)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileSearchLocked2Id)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, apis.user.search.waitForNodes('file-search', { expect: 3 })];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginWith(username)];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentSearchId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, searchInput.searchFor('file-search')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('File is locked and downloaded when clicking Edit Offline - [C306953]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileSearch1)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsEditOffline()];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileSearch1)];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'File not found in download location');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileSearch1Id)];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, fileSearch1 + " is not locked");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Lock information is displayed - [C306954]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileSearchLocked2, parentSearch)];
                    case 1:
                        _a.apply(void 0, [_c.sent()]).toBe(true, fileSearchLocked2 + " is not displayed");
                        _b = expect;
                        return [4 /*yield*/, dataTable.hasLockIcon(fileSearchLocked2, parentSearch)];
                    case 2:
                        _b.apply(void 0, [_c.sent()]).toBe(true, fileSearchLocked2 + " does not have a lock icon");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Cancel Editing unlocks the file - [C306955]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileSearchLocked)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCancelEditing()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, dataTable.unselectItem(fileSearchLocked)];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileSearchLockedId)];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(false, fileSearchLocked + " is still locked");
                        _b = expect;
                        return [4 /*yield*/, dataTable.hasLockIcon(fileSearchLocked, parentSearch)];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toBe(false, fileSearchLocked + " has a lock icon");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=edit-offline.test.js.map