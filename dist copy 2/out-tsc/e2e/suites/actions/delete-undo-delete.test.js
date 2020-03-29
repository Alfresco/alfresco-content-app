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
import { Utils } from '../../utilities/utils';
describe('Delete and undo delete', function () {
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
    describe('on Personal Files', function () {
        var file1 = "file1-" + Utils.random() + ".txt";
        var file2 = "file2-" + Utils.random() + ".txt";
        var file3 = "file3-" + Utils.random() + ".txt";
        var file4 = "file4-" + Utils.random() + ".txt";
        var file5 = "file5-" + Utils.random() + ".txt";
        var file6 = "file6-" + Utils.random() + ".txt";
        var file7 = "file7-" + Utils.random() + ".txt";
        var folder1 = "folder1-" + Utils.random();
        var folder1Id;
        var folder2 = "folder2-" + Utils.random();
        var folder2Id;
        var folder3 = "folder3-" + Utils.random();
        var folder3Id;
        var folder4 = "folder4-" + Utils.random();
        var folder4Id;
        var folder5 = "folder5-" + Utils.random();
        var folder5Id;
        var folder6 = "folder6-" + Utils.random();
        var folder6Id;
        var file1InFolder = "file1InFolder-" + Utils.random() + ".txt";
        var file2InFolder = "file2InFolder-" + Utils.random() + ".txt";
        var fileLocked1 = "fileLocked1-" + Utils.random() + ".txt";
        var fileLocked1Id;
        var fileLocked2 = "fileLocked2-" + Utils.random() + ".txt";
        var fileLocked2Id;
        var fileLocked3 = "fileLocked3-" + Utils.random() + ".txt";
        var fileLocked3Id;
        var fileLocked4 = "fileLocked4-" + Utils.random() + ".txt";
        var fileLocked4Id;
        var parent = "parentPF-" + Utils.random();
        var parentId;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                    case 1:
                        parentId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file1, parentId)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(file2, parentId)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(file3, parentId)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(file4, parentId)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(file5, parentId)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(file6, parentId)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(file7, parentId)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFolder(folder1, parentId)];
                    case 9:
                        folder1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(folder2, parentId)];
                    case 10:
                        folder2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(folder3, parentId)];
                    case 11:
                        folder3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(folder4, parentId)];
                    case 12:
                        folder4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(folder5, parentId)];
                    case 13:
                        folder5Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(folder6, parentId)];
                    case 14:
                        folder6Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file1InFolder, folder1Id)];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(fileLocked1, folder2Id)];
                    case 16:
                        fileLocked1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileLocked2, folder3Id)];
                    case 17:
                        fileLocked2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileLocked3, folder4Id)];
                    case 18:
                        fileLocked3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileLocked4, folder5Id)];
                    case 19:
                        fileLocked4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file2InFolder, folder6Id)];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked1Id, 'FULL')];
                    case 21:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked2Id, 'FULL')];
                    case 22:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked3Id, 'FULL')];
                    case 23:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked4Id, 'FULL')];
                    case 24:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginWith(username)];
                    case 25:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(parent)];
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
                    case 0: return [4 /*yield*/, apis.user.nodes.unlockFile(fileLocked1Id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.unlockFile(fileLocked2Id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.unlockFile(fileLocked3Id)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.unlockFile(fileLocked4Id)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentId)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.user.trashcan.emptyTrash()];
                    case 6:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('delete a file and check notification - [C217125]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var items, message, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, page.dataTable.getRowsCount()];
                    case 1:
                        items = _d.sent();
                        return [4 /*yield*/, dataTable.selectItem(file1)];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 4:
                        message = _d.sent();
                        expect(message).toContain(file1 + " deleted");
                        expect(message).toContain("Undo");
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file1)];
                    case 5:
                        _a.apply(void 0, [_d.sent()]).toBe(false, 'Item was not removed from list');
                        items--;
                        _b = expect;
                        return [4 /*yield*/, page.pagination.getRange()];
                    case 6:
                        _b.apply(void 0, [_d.sent()]).toContain("1-" + items + " of " + items);
                        return [4 /*yield*/, page.clickTrash()];
                    case 7:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file1)];
                    case 8:
                        _c.apply(void 0, [_d.sent()]).toBe(true, 'Item is not in trash');
                        return [2 /*return*/];
                }
            });
        }); });
        it('delete multiple files and check notification - [C280502]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var items, message, _a, _b, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, page.dataTable.getRowsCount()];
                    case 1:
                        items = _f.sent();
                        return [4 /*yield*/, dataTable.selectMultipleItems([file2, file3])];
                    case 2:
                        _f.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 3:
                        _f.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 4:
                        message = _f.sent();
                        expect(message).toContain("Deleted 2 items");
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file2)];
                    case 5:
                        _a.apply(void 0, [_f.sent()]).toBe(false, file2 + " was not removed from list");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file3)];
                    case 6:
                        _b.apply(void 0, [_f.sent()]).toBe(false, file3 + " was not removed from list");
                        items = items - 2;
                        _c = expect;
                        return [4 /*yield*/, page.pagination.getRange()];
                    case 7:
                        _c.apply(void 0, [_f.sent()]).toContain("1-" + items + " of " + items);
                        return [4 /*yield*/, page.clickTrash()];
                    case 8:
                        _f.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file2)];
                    case 9:
                        _d.apply(void 0, [_f.sent()]).toBe(true, file2 + " is not in trash");
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file3)];
                    case 10:
                        _e.apply(void 0, [_f.sent()]).toBe(true, file3 + " is not in trash");
                        return [2 /*return*/];
                }
            });
        }); });
        it('delete a folder with content - [C217126]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var items, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, page.dataTable.getRowsCount()];
                    case 1:
                        items = _e.sent();
                        return [4 /*yield*/, dataTable.selectItem(folder1)];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 3:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folder1)];
                    case 4:
                        _a.apply(void 0, [_e.sent()]).toBe(false, 'Item was not removed from list');
                        items--;
                        _b = expect;
                        return [4 /*yield*/, page.pagination.getRange()];
                    case 5:
                        _b.apply(void 0, [_e.sent()]).toContain("1-" + items + " of " + items);
                        return [4 /*yield*/, page.clickTrash()];
                    case 6:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folder1)];
                    case 7:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'Item is not in trash');
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file1InFolder)];
                    case 8:
                        _d.apply(void 0, [_e.sent()]).toBe(false, 'Item is in trash');
                        return [2 /*return*/];
                }
            });
        }); });
        it('delete a folder containing locked files - [C217127]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var message, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(folder2)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 3:
                        message = _d.sent();
                        expect(message).toContain(folder2 + " couldn't be deleted");
                        expect(message).not.toContain("Undo");
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folder2)];
                    case 4:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'Item was removed from list');
                        return [4 /*yield*/, page.clickTrash()];
                    case 5:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folder2)];
                    case 6:
                        _b.apply(void 0, [_d.sent()]).toBe(false, 'Item is in trash');
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileLocked1)];
                    case 7:
                        _c.apply(void 0, [_d.sent()]).toBe(false, 'Item is in trash');
                        return [2 /*return*/];
                }
            });
        }); });
        it('notification on multiple items deletion - some items fail to delete - [C217129]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var message;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([file4, folder3])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 3:
                        message = _a.sent();
                        expect(message).toContain("Deleted 1 item, 1 couldn't be deleted");
                        expect(message).toContain("Undo");
                        return [2 /*return*/];
                }
            });
        }); });
        it('notification on multiple items deletion - all items fail to delete - [C217130]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var message;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([folder4, folder5])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 3:
                        message = _a.sent();
                        expect(message).toEqual("2 items couldn't be deleted");
                        expect(message).not.toContain("Undo");
                        return [2 /*return*/];
                }
            });
        }); });
        it('undo delete of file - [C217132]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var items, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.dataTable.getRowsCount()];
                    case 1:
                        items = _c.sent();
                        return [4 /*yield*/, dataTable.selectItem(file5)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, page.clickSnackBarAction()];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file5)];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Item was not restored');
                        _b = expect;
                        return [4 /*yield*/, page.pagination.getRange()];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toContain("1-" + items + " of " + items);
                        return [2 /*return*/];
                }
            });
        }); });
        it('undo delete of folder with content - [C280503]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var items, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, page.dataTable.getRowsCount()];
                    case 1:
                        items = _d.sent();
                        return [4 /*yield*/, dataTable.selectItem(folder6)];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.clickSnackBarAction()];
                    case 4:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folder6)];
                    case 5:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'Item was not restored');
                        _b = expect;
                        return [4 /*yield*/, page.pagination.getRange()];
                    case 6:
                        _b.apply(void 0, [_d.sent()]).toContain("1-" + items + " of " + items);
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(folder6)];
                    case 7:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file2InFolder)];
                    case 8:
                        _c.apply(void 0, [_d.sent()]).toBe(true, 'file from folder not restored');
                        return [2 /*return*/];
                }
            });
        }); });
        it('undo delete of multiple files - [C280504]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var items, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, page.dataTable.getRowsCount()];
                    case 1:
                        items = _d.sent();
                        return [4 /*yield*/, dataTable.selectMultipleItems([file6, file7])];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.clickSnackBarAction()];
                    case 4:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file6)];
                    case 5:
                        _a.apply(void 0, [_d.sent()]).toBe(true, file6 + " was not removed from list");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file7)];
                    case 6:
                        _b.apply(void 0, [_d.sent()]).toBe(true, file7 + " was not removed from list");
                        _c = expect;
                        return [4 /*yield*/, page.pagination.getRange()];
                    case 7:
                        _c.apply(void 0, [_d.sent()]).toContain("1-" + items + " of " + items);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Shared Files', function () {
        var sharedFile1 = "sharedFile1-" + Utils.random() + ".txt";
        var sharedFile1Id;
        var sharedFile2 = "sharedFile2-" + Utils.random() + ".txt";
        var sharedFile2Id;
        var sharedFile3 = "sharedFile3-" + Utils.random() + ".txt";
        var sharedFile3Id;
        var sharedFile4 = "sharedFile4-" + Utils.random() + ".txt";
        var sharedFile4Id;
        var sharedFile5 = "sharedFile5-" + Utils.random() + ".txt";
        var sharedFile5Id;
        var sharedFile6 = "sharedFile6-" + Utils.random() + ".txt";
        var sharedFile6Id;
        var parent = "parentSF-" + Utils.random();
        var parentId;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                    case 1:
                        parentId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(sharedFile1, parentId)];
                    case 2:
                        sharedFile1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(sharedFile2, parentId)];
                    case 3:
                        sharedFile2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(sharedFile3, parentId)];
                    case 4:
                        sharedFile3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(sharedFile4, parentId)];
                    case 5:
                        sharedFile4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(sharedFile5, parentId)];
                    case 6:
                        sharedFile5Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(sharedFile6, parentId)];
                    case 7:
                        sharedFile6Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.shared.shareFilesByIds([
                                sharedFile1Id,
                                sharedFile2Id,
                                sharedFile3Id,
                                sharedFile4Id,
                                sharedFile5Id,
                                sharedFile6Id
                            ])];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 6 })];
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
        it('delete a file and check notification - [C280316]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var message, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(sharedFile1)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 3:
                        message = _c.sent();
                        expect(message).toContain(sharedFile1 + " deleted");
                        expect(message).toContain("Undo");
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(sharedFile1)];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(false, 'Item was not removed from list');
                        return [4 /*yield*/, page.clickTrash()];
                    case 5:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(sharedFile1)];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Item is not in trash');
                        return [2 /*return*/];
                }
            });
        }); });
        it('delete multiple files and check notification - [C280513]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var message, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([sharedFile2, sharedFile3])];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 3:
                        message = _e.sent();
                        expect(message).toContain("Deleted 2 items");
                        expect(message).toContain("Undo");
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(sharedFile2)];
                    case 4:
                        _a.apply(void 0, [_e.sent()]).toBe(false, sharedFile2 + " was not removed from list");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(sharedFile3)];
                    case 5:
                        _b.apply(void 0, [_e.sent()]).toBe(false, sharedFile3 + " was not removed from list");
                        return [4 /*yield*/, page.clickTrash()];
                    case 6:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(sharedFile2)];
                    case 7:
                        _c.apply(void 0, [_e.sent()]).toBe(true, sharedFile2 + " is not in trash");
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(sharedFile3)];
                    case 8:
                        _d.apply(void 0, [_e.sent()]).toBe(true, sharedFile3 + " is not in trash");
                        return [2 /*return*/];
                }
            });
        }); });
        it('undo delete of file - [C280324]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(sharedFile4)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, page.clickSnackBarAction()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, page.clickTrash()];
                    case 4:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(sharedFile4)];
                    case 5:
                        _a.apply(void 0, [_b.sent()]).toBe(false, 'Item was not restored');
                        return [2 /*return*/];
                }
            });
        }); });
        it('undo delete of multiple files - [C280514]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([sharedFile5, sharedFile6])];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, page.clickSnackBarAction()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, page.clickTrash()];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(sharedFile5)];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toBe(false, sharedFile5 + " was not restored");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(sharedFile6)];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toBe(false, sharedFile6 + " was not restored");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Favorites', function () {
        var parent = "parentF-" + Utils.random();
        var parentId;
        var favFile1 = "favFile1-" + Utils.random() + ".txt";
        var favFile1Id;
        var favFile2 = "favFile2-" + Utils.random() + ".txt";
        var favFile2Id;
        var favFile3 = "favFile3-" + Utils.random() + ".txt";
        var favFile3Id;
        var favFile4 = "favFile4-" + Utils.random() + ".txt";
        var favFile4Id;
        var favFile5 = "favFile5-" + Utils.random() + ".txt";
        var favFile5Id;
        var favFile6 = "favFile6-" + Utils.random() + ".txt";
        var favFile6Id;
        var favFile7 = "favFile7-" + Utils.random() + ".txt";
        var favFile7Id;
        var favFolder1 = "favFolder1-" + Utils.random();
        var favFolder1Id;
        var favFolder2 = "favFolder2-" + Utils.random();
        var favFolder2Id;
        var favFolder3 = "favFolder3-" + Utils.random();
        var favFolder3Id;
        var favFolder4 = "favFolder4-" + Utils.random();
        var favFolder4Id;
        var favFolder5 = "favFolder5-" + Utils.random();
        var favFolder5Id;
        var favFolder6 = "favFolder6-" + Utils.random();
        var favFolder6Id;
        var file1InFolder = "file1InFolder-" + Utils.random() + ".txt";
        var file2InFolder = "file2InFolder-" + Utils.random() + ".txt";
        var fileLocked1 = "fileLocked1-" + Utils.random() + ".txt";
        var fileLocked1Id;
        var fileLocked2 = "fileLocked2-" + Utils.random() + ".txt";
        var fileLocked2Id;
        var fileLocked3 = "fileLocked3-" + Utils.random() + ".txt";
        var fileLocked3Id;
        var fileLocked4 = "fileLocked4-" + Utils.random() + ".txt";
        var fileLocked4Id;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                    case 1:
                        parentId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(favFile1, parentId)];
                    case 2:
                        favFile1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(favFile2, parentId)];
                    case 3:
                        favFile2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(favFile3, parentId)];
                    case 4:
                        favFile3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(favFile4, parentId)];
                    case 5:
                        favFile4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(favFile5, parentId)];
                    case 6:
                        favFile5Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(favFile6, parentId)];
                    case 7:
                        favFile6Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(favFile7, parentId)];
                    case 8:
                        favFile7Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(favFolder1, parentId)];
                    case 9:
                        favFolder1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(favFolder2, parentId)];
                    case 10:
                        favFolder2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(favFolder3, parentId)];
                    case 11:
                        favFolder3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(favFolder4, parentId)];
                    case 12:
                        favFolder4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(favFolder5, parentId)];
                    case 13:
                        favFolder5Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(favFolder6, parentId)];
                    case 14:
                        favFolder6Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file1InFolder, favFolder1Id)];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(fileLocked1, favFolder2Id)];
                    case 16:
                        fileLocked1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileLocked2, favFolder3Id)];
                    case 17:
                        fileLocked2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileLocked3, favFolder4Id)];
                    case 18:
                        fileLocked3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileLocked4, favFolder5Id)];
                    case 19:
                        fileLocked4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file2InFolder, favFolder6Id)];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked1Id, 'FULL')];
                    case 21:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked2Id, 'FULL')];
                    case 22:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked3Id, 'FULL')];
                    case 23:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked4Id, 'FULL')];
                    case 24:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoritesByIds('file', [favFile1Id, favFile2Id, favFile3Id, favFile4Id, favFile5Id, favFile6Id, favFile7Id])];
                    case 25:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoritesByIds('folder', [favFolder1Id, favFolder2Id, favFolder3Id, favFolder4Id, favFolder5Id, favFolder6Id])];
                    case 26:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.waitForApi({ expect: 13 })];
                    case 27:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginWith(username)];
                    case 28:
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
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.unlockFile(fileLocked1Id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.unlockFile(fileLocked2Id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.unlockFile(fileLocked3Id)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.unlockFile(fileLocked4Id)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentId)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.user.trashcan.emptyTrash()];
                    case 6:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('delete a file and check notification - [C280516]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var items, message, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, page.dataTable.getRowsCount()];
                    case 1:
                        items = _d.sent();
                        return [4 /*yield*/, dataTable.selectItem(favFile1)];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 4:
                        message = _d.sent();
                        expect(message).toContain(favFile1 + " deleted");
                        expect(message).toContain("Undo");
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(favFile1)];
                    case 5:
                        _a.apply(void 0, [_d.sent()]).toBe(false, 'Item was not removed from list');
                        items--;
                        _b = expect;
                        return [4 /*yield*/, page.pagination.getRange()];
                    case 6:
                        _b.apply(void 0, [_d.sent()]).toContain("1-" + items + " of " + items);
                        return [4 /*yield*/, page.clickTrash()];
                    case 7:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(favFile1)];
                    case 8:
                        _c.apply(void 0, [_d.sent()]).toBe(true, 'Item is not in trash');
                        return [2 /*return*/];
                }
            });
        }); });
        it('delete multiple files and check notification - [C280517]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var items, message, _a, _b, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, page.dataTable.getRowsCount()];
                    case 1:
                        items = _f.sent();
                        return [4 /*yield*/, dataTable.selectMultipleItems([favFile2, favFile3])];
                    case 2:
                        _f.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 3:
                        _f.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 4:
                        message = _f.sent();
                        expect(message).toContain("Deleted 2 items");
                        expect(message).toContain("Undo");
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(favFile2)];
                    case 5:
                        _a.apply(void 0, [_f.sent()]).toBe(false, favFile2 + " was not removed from list");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(favFile3)];
                    case 6:
                        _b.apply(void 0, [_f.sent()]).toBe(false, favFile3 + " was not removed from list");
                        items = items - 2;
                        _c = expect;
                        return [4 /*yield*/, page.pagination.getRange()];
                    case 7:
                        _c.apply(void 0, [_f.sent()]).toContain("1-" + items + " of " + items);
                        return [4 /*yield*/, page.clickTrash()];
                    case 8:
                        _f.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(favFile2)];
                    case 9:
                        _d.apply(void 0, [_f.sent()]).toBe(true, favFile2 + " is not in trash");
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(favFile3)];
                    case 10:
                        _e.apply(void 0, [_f.sent()]).toBe(true, favFile3 + " is not in trash");
                        return [2 /*return*/];
                }
            });
        }); });
        it('delete a folder with content - [C280518]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var items, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, page.dataTable.getRowsCount()];
                    case 1:
                        items = _e.sent();
                        return [4 /*yield*/, dataTable.selectItem(favFolder1)];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 3:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(favFolder1)];
                    case 4:
                        _a.apply(void 0, [_e.sent()]).toBe(false, 'Item was not removed from list');
                        items--;
                        _b = expect;
                        return [4 /*yield*/, page.pagination.getRange()];
                    case 5:
                        _b.apply(void 0, [_e.sent()]).toContain("1-" + items + " of " + items);
                        return [4 /*yield*/, page.clickTrash()];
                    case 6:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(favFolder1)];
                    case 7:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'Item is not in trash');
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file1InFolder)];
                    case 8:
                        _d.apply(void 0, [_e.sent()]).toBe(false, 'Item is in trash');
                        return [2 /*return*/];
                }
            });
        }); });
        it('delete a folder containing locked files - [C280519]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var message, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(favFolder2)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 3:
                        message = _d.sent();
                        expect(message).toContain(favFolder2 + " couldn't be deleted");
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(favFolder2)];
                    case 4:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'Item was removed from list');
                        return [4 /*yield*/, page.clickTrash()];
                    case 5:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(favFolder2)];
                    case 6:
                        _b.apply(void 0, [_d.sent()]).toBe(false, 'Item is in trash');
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileLocked1)];
                    case 7:
                        _c.apply(void 0, [_d.sent()]).toBe(false, 'Item is in trash');
                        return [2 /*return*/];
                }
            });
        }); });
        it('notification on multiple items deletion - some items fail to delete - [C280520]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var message;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([favFile4, favFolder3])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 3:
                        message = _a.sent();
                        expect(message).toContain("Deleted 1 item, 1 couldn't be deleted");
                        expect(message).toContain("Undo");
                        return [2 /*return*/];
                }
            });
        }); });
        it('notification on multiple items deletion - all items fail to delete - [C280521]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var message;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([favFolder4, favFolder5])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 3:
                        message = _a.sent();
                        expect(message).toEqual("2 items couldn't be deleted");
                        expect(message).not.toContain("Undo");
                        return [2 /*return*/];
                }
            });
        }); });
        it('undo delete of file - [C280524]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var items, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.dataTable.getRowsCount()];
                    case 1:
                        items = _c.sent();
                        return [4 /*yield*/, dataTable.selectItem(favFile5)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, page.clickSnackBarAction()];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(favFile5)];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Item was not restored');
                        _b = expect;
                        return [4 /*yield*/, page.pagination.getRange()];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toContain("1-" + items + " of " + items);
                        return [2 /*return*/];
                }
            });
        }); });
        it('undo delete of folder with content - [C280526]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var items, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, page.dataTable.getRowsCount()];
                    case 1:
                        items = _d.sent();
                        return [4 /*yield*/, dataTable.selectItem(favFolder6)];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.clickSnackBarAction()];
                    case 4:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(favFolder6)];
                    case 5:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'Item was not restored');
                        _b = expect;
                        return [4 /*yield*/, page.pagination.getRange()];
                    case 6:
                        _b.apply(void 0, [_d.sent()]).toContain("1-" + items + " of " + items);
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(favFolder6)];
                    case 7:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file2InFolder)];
                    case 8:
                        _c.apply(void 0, [_d.sent()]).toBe(true, 'file from folder not restored');
                        return [2 /*return*/];
                }
            });
        }); });
        it('undo delete of multiple files - [C280525]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var items, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, page.dataTable.getRowsCount()];
                    case 1:
                        items = _d.sent();
                        return [4 /*yield*/, dataTable.selectMultipleItems([favFile6, favFile7])];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.clickSnackBarAction()];
                    case 4:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(favFile6)];
                    case 5:
                        _a.apply(void 0, [_d.sent()]).toBe(true, favFile6 + " was not removed from list");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(favFile7)];
                    case 6:
                        _b.apply(void 0, [_d.sent()]).toBe(true, favFile7 + " was not removed from list");
                        _c = expect;
                        return [4 /*yield*/, page.pagination.getRange()];
                    case 7:
                        _c.apply(void 0, [_d.sent()]).toContain("1-" + items + " of " + items);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Recent Files', function () {
        var parent = "parentRF-" + Utils.random();
        var parentId;
        var recentFile1 = "recentFile1-" + Utils.random() + ".txt";
        var recentFile2 = "recentFile2-" + Utils.random() + ".txt";
        var recentFile3 = "recentFile3-" + Utils.random() + ".txt";
        var recentFile4 = "recentFile4-" + Utils.random() + ".txt";
        var recentFile5 = "recentFile5-" + Utils.random() + ".txt";
        var recentFile6 = "recentFile6-" + Utils.random() + ".txt";
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                    case 1:
                        parentId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(recentFile1, parentId)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(recentFile2, parentId)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(recentFile3, parentId)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(recentFile4, parentId)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(recentFile5, parentId)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(recentFile6, parentId)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, apis.user.search.waitForApi(username, { expect: 6 })];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginWith(username)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, page.clickRecentFiles()];
                    case 10:
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
        it('delete a file and check notification - [C280528]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var message, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(recentFile1)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 3:
                        message = _c.sent();
                        expect(message).toContain(recentFile1 + " deleted");
                        expect(message).toContain("Undo");
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(recentFile1)];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(false, 'Item was not removed from list');
                        return [4 /*yield*/, page.clickTrash()];
                    case 5:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(recentFile1)];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Item is not in trash');
                        return [2 /*return*/];
                }
            });
        }); });
        it('delete multiple files and check notification - [C280529]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var message, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([recentFile2, recentFile3])];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 3:
                        message = _e.sent();
                        expect(message).toContain("Deleted 2 items");
                        expect(message).toContain("Undo");
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(recentFile2)];
                    case 4:
                        _a.apply(void 0, [_e.sent()]).toBe(false, recentFile2 + " was not removed from list");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(recentFile3)];
                    case 5:
                        _b.apply(void 0, [_e.sent()]).toBe(false, recentFile3 + " was not removed from list");
                        return [4 /*yield*/, page.clickTrash()];
                    case 6:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(recentFile2)];
                    case 7:
                        _c.apply(void 0, [_e.sent()]).toBe(true, recentFile2 + " is not in trash");
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(recentFile3)];
                    case 8:
                        _d.apply(void 0, [_e.sent()]).toBe(true, recentFile3 + " is not in trash");
                        return [2 /*return*/];
                }
            });
        }); });
        // due to the fact that the search api is slow to update,
        // we cannot test that the restored file is displayed in the Recent Files list
        // without adding a very big browser.sleep followed by a page.refresh
        // so for the moment we're testing that the restored file is not displayed in the Trash
        it('undo delete of file - [C280536]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(recentFile4)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, page.clickSnackBarAction()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, page.clickTrash()];
                    case 4:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(recentFile4)];
                    case 5:
                        _a.apply(void 0, [_b.sent()]).toBe(false, 'Item is in Trash');
                        return [2 /*return*/];
                }
            });
        }); });
        // due to the fact that the search api is slow to update,
        // we cannot test that the restored file is displayed in the Recent Files list
        // without adding a very big browser.sleep followed by a page.refresh
        // so for the moment we're testing that the restored file is not displayed in the Trash
        it('undo delete of multiple files - [C280537]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([recentFile5, recentFile6])];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, page.clickSnackBarAction()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, page.clickTrash()];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(recentFile5)];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toBe(false, recentFile5 + " is in Trash");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(recentFile6)];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toBe(false, recentFile6 + " is in Trash");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=delete-undo-delete.test.js.map