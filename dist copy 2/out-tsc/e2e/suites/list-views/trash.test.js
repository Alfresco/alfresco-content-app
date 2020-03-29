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
describe('Trash', function () {
    var username = "user-" + Utils.random();
    var siteName = "site-" + Utils.random();
    var fileSite = "file-" + Utils.random() + ".txt";
    var fileSiteId;
    var folderAdmin = "folder-" + Utils.random();
    var folderAdminId;
    var fileAdmin = "file-" + Utils.random() + ".txt";
    var fileAdminId;
    var folderUser = "folder-" + Utils.random();
    var folderUserId;
    var fileUser = "file-" + Utils.random() + ".txt";
    var fileUserId;
    var folderDeleted = "folder-" + Utils.random();
    var folderDeletedId;
    var fileDeleted = "file-" + Utils.random() + ".txt";
    var fileDeletedId;
    var folderNotDeleted = "folder-" + Utils.random();
    var folderNotDeletedId;
    var fileInFolder = "file-" + Utils.random() + ".txt";
    var fileInFolderId;
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable, breadcrumb = page.breadcrumb;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var docLibId;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.nodes.createFiles([fileAdmin])];
                case 2:
                    fileAdminId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.admin.nodes.createFolders([folderAdmin])];
                case 3:
                    folderAdminId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_MANAGER.ROLE)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.getDocLibId(siteName)];
                case 6:
                    docLibId = _a.sent();
                    return [4 /*yield*/, apis.admin.nodes.createFile(fileSite, docLibId)];
                case 7:
                    fileSiteId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFiles([fileUser])];
                case 8:
                    fileUserId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolders([folderUser])];
                case 9:
                    folderUserId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderDeleted)];
                case 10:
                    folderDeletedId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFiles([fileDeleted], folderDeleted)];
                case 11:
                    fileDeletedId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderNotDeleted)];
                case 12:
                    folderNotDeletedId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFiles([fileInFolder], folderNotDeleted)];
                case 13:
                    fileInFolderId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.admin.nodes.deleteNodesById([fileAdminId, folderAdminId], false)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodesById([fileSiteId, fileUserId, folderUserId, fileInFolderId], false)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(fileDeletedId, false)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(folderDeletedId, false)];
                case 17:
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
                        apis.admin.sites.deleteSite(siteName),
                        apis.user.nodes.deleteNodeById(folderNotDeletedId),
                        apis.admin.trashcan.emptyTrash()
                    ])];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('as admin', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWithAdmin()];
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
                    case 0: return [4 /*yield*/, page.clickTrashAndWait()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('has the correct columns - [C213217]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var expectedColumns, actualColumns;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedColumns = ['Name', 'Location', 'Size', 'Deleted', 'Deleted by'];
                        return [4 /*yield*/, dataTable.getColumnHeadersText()];
                    case 1:
                        actualColumns = _a.sent();
                        expect(actualColumns).toEqual(expectedColumns);
                        return [2 /*return*/];
                }
            });
        }); });
        it('displays the files and folders deleted by everyone - [C280493]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getRowsCount()];
                    case 1:
                        _a.apply(void 0, [_g.sent()]).toEqual(8, 'Incorrect number of deleted items displayed');
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileAdmin)];
                    case 2:
                        _b.apply(void 0, [_g.sent()]).toBe(true, fileAdmin + " not displayed");
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folderAdmin)];
                    case 3:
                        _c.apply(void 0, [_g.sent()]).toBe(true, folderAdmin + " not displayed");
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileUser)];
                    case 4:
                        _d.apply(void 0, [_g.sent()]).toBe(true, fileUser + " not displayed");
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folderUser)];
                    case 5:
                        _e.apply(void 0, [_g.sent()]).toBe(true, folderUser + " not displayed");
                        _f = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileSite)];
                    case 6:
                        _f.apply(void 0, [_g.sent()]).toBe(true, fileSite + " not displayed");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('as user', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWith(username)];
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
                    case 0: return [4 /*yield*/, page.clickTrashAndWait()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('has the correct columns - [C280494]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var expectedColumns, actualColumns;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedColumns = ['Name', 'Location', 'Size', 'Deleted'];
                        return [4 /*yield*/, dataTable.getColumnHeadersText()];
                    case 1:
                        actualColumns = _a.sent();
                        expect(actualColumns).toEqual(expectedColumns);
                        return [2 /*return*/];
                }
            });
        }); });
        it('displays the files and folders deleted by the user - [C213218]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getRowsCount()];
                    case 1:
                        _a.apply(void 0, [_f.sent()]).toEqual(6, 'Incorrect number of deleted items displayed');
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileSite)];
                    case 2:
                        _b.apply(void 0, [_f.sent()]).toBe(true, fileSite + " not displayed");
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileUser)];
                    case 3:
                        _c.apply(void 0, [_f.sent()]).toBe(true, fileUser + " not displayed");
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folderUser)];
                    case 4:
                        _d.apply(void 0, [_f.sent()]).toBe(true, folderUser + " not displayed");
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileAdmin)];
                    case 5:
                        _e.apply(void 0, [_f.sent()]).toBe(false, fileAdmin + " is displayed");
                        return [2 /*return*/];
                }
            });
        }); });
        it('default sorting column - [C213219]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getSortedColumnHeaderText()];
                    case 1:
                        _a.apply(void 0, [_c.sent()]).toBe('Deleted');
                        _b = expect;
                        return [4 /*yield*/, dataTable.getSortingOrder()];
                    case 2:
                        _b.apply(void 0, [_c.sent()]).toBe('desc');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Location column displays the parent folder of the file - [C280498]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemLocation(fileInFolder)];
                    case 1:
                        _a.apply(void 0, [_d.sent()]).toEqual(folderNotDeleted);
                        _b = expect;
                        return [4 /*yield*/, dataTable.getItemLocation(fileUser)];
                    case 2:
                        _b.apply(void 0, [_d.sent()]).toEqual('Personal Files');
                        _c = expect;
                        return [4 /*yield*/, dataTable.getItemLocation(fileSite)];
                    case 3:
                        _c.apply(void 0, [_d.sent()]).toEqual(siteName);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Location column displays a tooltip with the entire path of the file - [C280499]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemLocationTooltip(fileInFolder)];
                    case 1:
                        _a.apply(void 0, [_d.sent()]).toEqual("Personal Files/" + folderNotDeleted);
                        _b = expect;
                        return [4 /*yield*/, dataTable.getItemLocationTooltip(fileUser)];
                    case 2:
                        _b.apply(void 0, [_d.sent()]).toEqual('Personal Files');
                        _c = expect;
                        return [4 /*yield*/, dataTable.getItemLocationTooltip(fileSite)];
                    case 3:
                        _c.apply(void 0, [_d.sent()]).toEqual("File Libraries/" + siteName);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Location column is empty if parent folder no longer exists - [C280500]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getItemLocation(fileDeleted)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual('');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Location column redirect - file in user Home - [C217144]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.clickItemLocation(fileUser)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, breadcrumb.getAllItems()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toEqual(['Personal Files']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Location column redirect - file in folder - [C280496]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.clickItemLocation(fileInFolder)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, breadcrumb.getAllItems()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toEqual(['Personal Files', folderNotDeleted]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Location column redirect - file in site - [C280497]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.clickItemLocation(fileSite)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, breadcrumb.getAllItems()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toEqual(['My Libraries', siteName]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=trash.test.js.map