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
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { APP_ROUTES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
describe('Restore from Trash', function () {
    var username = "user-" + Utils.random();
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable, toolbar = page.toolbar;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
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
                case 0: return [4 /*yield*/, apis.user.trashcan.emptyTrash()];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('successful restore', function () {
        var file = "file-" + Utils.random() + ".txt";
        var fileId;
        var folder = "folder-" + Utils.random();
        var folderId;
        var site = "site-" + Utils.random();
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFile(file)];
                    case 1:
                        fileId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(folder)];
                    case 2:
                        folderId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.sites.createSite(site)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodesById([fileId, folderId], false)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, apis.user.sites.deleteSite(site, false)];
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
                    case 0: return [4 /*yield*/, page.clickTrashAndWait()];
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
                    case 0: return [4 /*yield*/, apis.user.trashcan.emptyTrash()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('restore file - [C217177]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var text, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickRestore()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 3:
                        text = _c.sent();
                        expect(text).toContain(file + " restored");
                        expect(text).toContain("View");
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file)];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(false, 'Item was not removed from list');
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 5:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, page.dataTable.isItemPresent(file)];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Item not displayed in list');
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(fileId, false)];
                    case 7:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('restore folder - [C280438]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var text, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(folder)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickRestore()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 3:
                        text = _c.sent();
                        expect(text).toContain(folder + " restored");
                        expect(text).toContain("View");
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folder)];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(false, 'Item was not removed from list');
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 5:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, page.dataTable.isItemPresent(folder)];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Item not displayed in list');
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(folderId, false)];
                    case 7:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('restore library - [C290104]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var text, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(site)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickRestore()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 3:
                        text = _c.sent();
                        expect(text).toContain(site + " restored");
                        expect(text).toContain("View");
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(site)];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(false, site + " was not removed from list");
                        return [4 /*yield*/, page.clickFileLibrariesAndWait()];
                    case 5:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, page.dataTable.isItemPresent(site)];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toBe(true, site + " not displayed in list");
                        return [2 /*return*/];
                }
            });
        }); });
        it('restore multiple items - [C217182]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var text, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([file, folder])];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickRestore()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 3:
                        text = _e.sent();
                        expect(text).toContain("Restore successful");
                        expect(text).not.toContain("View");
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file)];
                    case 4:
                        _a.apply(void 0, [_e.sent()]).toBe(false, 'Item was not removed from list');
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folder)];
                    case 5:
                        _b.apply(void 0, [_e.sent()]).toBe(false, 'Item was not removed from list');
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 6:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, page.dataTable.isItemPresent(file)];
                    case 7:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'Item not displayed in list');
                        _d = expect;
                        return [4 /*yield*/, page.dataTable.isItemPresent(folder)];
                    case 8:
                        _d.apply(void 0, [_e.sent()]).toBe(true, 'Item not displayed in list');
                        return [4 /*yield*/, apis.user.nodes.deleteNodesById([fileId, folderId], false)];
                    case 9:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('View from notification - [C217181]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickRestore()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, page.clickSnackBarAction()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, page.dataTable.waitForHeader()];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, page.sidenav.isActive('Personal Files')];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Personal Files sidebar link not active');
                        _b = expect;
                        return [4 /*yield*/, browser.getCurrentUrl()];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toContain(APP_ROUTES.PERSONAL_FILES);
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(fileId, false)];
                    case 7:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('failure to restore', function () {
        var file1 = "file-" + Utils.random() + ".txt";
        var file1Id1, file1Id2;
        var file2 = "file-" + Utils.random() + ".txt";
        var file2Id;
        var folder1 = "folder-" + Utils.random();
        var folder1Id;
        var folder2 = "folder-" + Utils.random();
        var folder2Id;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFolder(folder1)];
                    case 1:
                        folder1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file1, folder1Id)];
                    case 2:
                        file1Id1 = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(file1Id1, false)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(file1, folder1Id)];
                    case 4:
                        file1Id2 = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(folder2)];
                    case 5:
                        folder2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file2, folder2Id)];
                    case 6:
                        file2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(file2Id, false)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(folder2Id, false)];
                    case 8:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickTrashAndWait()];
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
                    case 0: return [4 /*yield*/, Promise.all([
                            apis.user.nodes.deleteNodeById(file1Id2),
                            apis.user.trashcan.emptyTrash()
                        ])];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Restore a file when another file with same name exists on the restore location - [C217178]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.clickTrashAndWait()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(file1)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickRestore()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toEqual("Can't restore, " + file1 + " already exists");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Restore a file when original location no longer exists - [C217179]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.clickTrashAndWait()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(file2)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickRestore()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toEqual("Can't restore " + file2 + ", the original location no longer exists");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Notification on partial success', function () {
        var folder1 = "folder1-" + Utils.random() + ".txt";
        var folder1Id;
        var folder2 = "folder2-" + Utils.random() + ".txt";
        var folder2Id;
        var file1 = "file-" + Utils.random() + ".txt";
        var file1Id;
        var file2 = "file-" + Utils.random() + ".txt";
        var file2Id;
        var folder3 = "folder3-" + Utils.random() + ".txt";
        var folder3Id;
        var folder4 = "folder4-" + Utils.random() + ".txt";
        var folder4Id;
        var file3 = "file3-" + Utils.random() + ".txt";
        var file3Id;
        var file4 = "file4-" + Utils.random() + ".txt";
        var file4Id;
        var file5 = "file5-" + Utils.random() + ".txt";
        var file5Id;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFolder(folder1)];
                    case 1:
                        folder1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file1, folder1Id)];
                    case 2:
                        file1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(folder2)];
                    case 3:
                        folder2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file2, folder2Id)];
                    case 4:
                        file2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(file1Id, false)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(folder1Id, false)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(file2Id, false)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFolder(folder3)];
                    case 8:
                        folder3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file3, folder3Id)];
                    case 9:
                        file3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file4, folder3Id)];
                    case 10:
                        file4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(folder4)];
                    case 11:
                        folder4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file5, folder4Id)];
                    case 12:
                        file5Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(file3Id, false)];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(file4Id, false)];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(folder3Id, false)];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(file5Id, false)];
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
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickTrashAndWait()];
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
                    case 0: return [4 /*yield*/, apis.user.trashcan.emptyTrash()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('one failure - [C217183]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([file1, file2])];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickRestore()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toEqual("Can't restore " + file1 + ", the original location no longer exists");
                        return [2 /*return*/];
                }
            });
        }); });
        it('multiple failures - [C217184]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([file3, file4, file5])];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickRestore()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toEqual('2 items not restored because of issues with the restore location');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=restore.test.js.map