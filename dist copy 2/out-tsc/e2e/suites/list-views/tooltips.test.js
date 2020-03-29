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
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';
describe('File / folder tooltips', function () {
    var username = "user-" + Utils.random();
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var parent = "parent-" + Utils.random();
    var file = "file1-" + Utils.random();
    var fileWithDesc = "file2-" + Utils.random();
    var fileWithTitle = "file3-" + Utils.random();
    var fileWithTitleAndDesc = "file4-" + Utils.random();
    var fileNameEqTitleEqDesc = "file5-" + Utils.random();
    var fileNameEqTitleDiffDesc = "file6-" + Utils.random();
    var fileNameEqDescDiffTitle = "file7-" + Utils.random();
    var fileTitleEqDesc = "file8-" + Utils.random();
    var parentId, file1Id, file2Id, file3Id, file4Id, file5Id, file6Id, file7Id, file8Id;
    var fileTitle = 'file title';
    var fileDescription = 'file description';
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                case 2:
                    parentId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file, parentId)];
                case 3:
                    file1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileWithDesc, parentId, '', fileDescription)];
                case 4:
                    file2Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileWithTitle, parentId, fileTitle)];
                case 5:
                    file3Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileWithTitleAndDesc, parentId, fileTitle, fileDescription)];
                case 6:
                    file4Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileNameEqTitleEqDesc, parentId, fileNameEqTitleEqDesc, fileNameEqTitleEqDesc)];
                case 7:
                    file5Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileNameEqTitleDiffDesc, parentId, fileNameEqTitleDiffDesc, fileDescription)];
                case 8:
                    file6Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileNameEqDescDiffTitle, parentId, fileTitle, fileNameEqDescDiffTitle)];
                case 9:
                    file7Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileTitleEqDesc, parentId, fileTitle, fileTitle)];
                case 10:
                    file8Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.shared.shareFilesByIds([file1Id, file2Id, file3Id, file4Id, file5Id, file6Id, file7Id, file8Id])];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoritesByIds('file', [
                            file1Id, file2Id, file3Id, file4Id, file5Id, file6Id, file7Id, file8Id
                        ])];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 13:
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
                        apis.user.nodes.deleteNodes([parent]),
                        apis.user.trashcan.emptyTrash()
                    ])];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('on Personal Files', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
        it('File with name, no title, no description - [C255871]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(file)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual("" + file);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name and description, no title - [C255872]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileWithDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileWithDesc + "\n" + fileDescription);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name and title, no description - [C255873]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileWithTitle)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileWithTitle + "\n" + fileTitle);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name and title and description, all different - [C255874]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileWithTitleAndDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileTitle + "\n" + fileDescription);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name and title and description, all equal - [C255875]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileNameEqTitleEqDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual("" + fileNameEqTitleEqDesc);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name = title, different description - [C255876]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileNameEqTitleDiffDesc + "\n" + fileDescription);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name = description, different title - [C255877]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileNameEqDescDiffTitle)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileTitle + "\n" + fileNameEqDescDiffTitle);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with title = description, different name - [C255878]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileTitleEqDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual("" + fileTitle);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Recent Files', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.search.waitForApi(username, { expect: 8 })];
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
        it('File with name, no title, no description - [C280135]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(file)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual("" + file);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name and description, no title - [C280136]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileWithDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileWithDesc + "\n" + fileDescription);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name and title, no description - [C280137]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileWithTitle)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileWithTitle + "\n" + fileTitle);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name and title and description, all different - [C280138]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileWithTitleAndDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileTitle + "\n" + fileDescription);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name and title and description, all equal - [C280139]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileNameEqTitleEqDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual("" + fileNameEqTitleEqDesc);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name = title, different description - [C280140]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileNameEqTitleDiffDesc + "\n" + fileDescription);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name = description, different title - [C280141]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileNameEqDescDiffTitle)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileTitle + "\n" + fileNameEqDescDiffTitle);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with title = description, different name - [C280142]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileTitleEqDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual("" + fileTitle);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // disabled until ACA-518 is done
    xdescribe('on Shared Files', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 8 })];
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
        xit('File with name, no title, no description - [C280143]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(file)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual("" + file);
                        return [2 /*return*/];
                }
            });
        }); });
        xit('File with name and description, no title - [C280144]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileWithDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileWithDesc + "\n" + fileDescription);
                        return [2 /*return*/];
                }
            });
        }); });
        xit('File with name and title, no description - [C280145]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileWithTitle)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileWithTitle + "\n" + fileTitle);
                        return [2 /*return*/];
                }
            });
        }); });
        xit('File with name and title and description, all different - [C280146]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileWithTitleAndDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileTitle + "\n" + fileDescription);
                        return [2 /*return*/];
                }
            });
        }); });
        xit('File with name and title and description, all equal - [C280147]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileNameEqTitleEqDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual("" + fileNameEqTitleEqDesc);
                        return [2 /*return*/];
                }
            });
        }); });
        xit('File with name = title, different description - [C280148]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileNameEqTitleDiffDesc + "\n" + fileDescription);
                        return [2 /*return*/];
                }
            });
        }); });
        xit('File with name = description, different title - [C280149]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileNameEqDescDiffTitle)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileTitle + "\n" + fileNameEqDescDiffTitle);
                        return [2 /*return*/];
                }
            });
        }); });
        xit('File with title = description, different name - [C280150]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileTitleEqDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual("" + fileTitle);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Favorites', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
        it('File with name, no title, no description - [C280151]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(file)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual("" + file);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name and description, no title - [C280152]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileWithDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileWithDesc + "\n" + fileDescription);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name and title, no description - [C280153]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileWithTitle)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileWithTitle + "\n" + fileTitle);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name and title and description, all different - [C280154]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileWithTitleAndDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileTitle + "\n" + fileDescription);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name and title and description, all equal - [C280155]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileNameEqTitleEqDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual("" + fileNameEqTitleEqDesc);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name = title, different description - [C280156]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileNameEqTitleDiffDesc + "\n" + fileDescription);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name = description, different title - [C280157]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileNameEqDescDiffTitle)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileTitle + "\n" + fileNameEqDescDiffTitle);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with title = description, different name - [C280158]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileTitleEqDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual("" + fileTitle);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Trash', function () {
        var parentForTrash = "parent-" + Utils.random();
        var parentForTrashId, file1TrashId, file2TrashId, file3TrashId, file4TrashId;
        var file5TrashId, file6TrashId, file7TrashId, file8TrashId;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFolder(parentForTrash)];
                    case 1:
                        parentForTrashId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file, parentForTrashId)];
                    case 2:
                        file1TrashId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileWithDesc, parentForTrashId, '', fileDescription)];
                    case 3:
                        file2TrashId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileWithTitle, parentForTrashId, fileTitle)];
                    case 4:
                        file3TrashId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileWithTitleAndDesc, parentForTrashId, fileTitle, fileDescription)];
                    case 5:
                        file4TrashId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileNameEqTitleEqDesc, parentForTrashId, fileNameEqTitleEqDesc, fileNameEqTitleEqDesc)];
                    case 6:
                        file5TrashId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileNameEqTitleDiffDesc, parentForTrashId, fileNameEqTitleDiffDesc, fileDescription)];
                    case 7:
                        file6TrashId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileNameEqDescDiffTitle, parentForTrashId, fileTitle, fileNameEqDescDiffTitle)];
                    case 8:
                        file7TrashId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileTitleEqDesc, parentForTrashId, fileTitle, fileTitle)];
                    case 9:
                        file8TrashId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.deleteNodesById([
                                file1TrashId, file2TrashId, file3TrashId, file4TrashId, file5TrashId, file6TrashId, file7TrashId, file8TrashId
                            ], false)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, page.clickTrashAndWait()];
                    case 11:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.deleteNodes([parentForTrash])];
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
        it('File with name, no title, no description - [C280159]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(file)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual("" + file);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name and description, no title - [C280160]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileWithDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileWithDesc + "\n" + fileDescription);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name and title, no description - [C280161]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileWithTitle)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileWithTitle + "\n" + fileTitle);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name and title and description, all different - [C280162]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileWithTitleAndDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileTitle + "\n" + fileDescription);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name and title and description, all equal - [C280163]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileNameEqTitleEqDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual("" + fileNameEqTitleEqDesc);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name = title, different description - [C280164]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileNameEqTitleDiffDesc + "\n" + fileDescription);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with name = description, different title - [C280165]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileNameEqDescDiffTitle)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(fileTitle + "\n" + fileNameEqDescDiffTitle);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File with title = description, different name - [C280166]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemNameTooltip(fileTitleEqDesc)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual("" + fileTitle);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=tooltips.test.js.map