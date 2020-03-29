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
describe('Favorites', function () {
    var username = "user-" + Utils.random();
    var siteName = "site-" + Utils.random();
    var favFolderName = "favFolder-" + Utils.random();
    var parentFolder = "parent-" + Utils.random();
    var fileName1 = "file1-" + Utils.random() + ".txt";
    var fileName2 = "file2-" + Utils.random() + ".txt";
    var fileName3 = "file3-" + Utils.random() + ".txt";
    var fileName4 = "file4-" + Utils.random() + ".txt";
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable, breadcrumb = page.breadcrumb;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var docLibId, file1Id, folderId, parentId, file2Id, file3Id, file4Id;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.getDocLibId(siteName)];
                case 3:
                    docLibId = _a.sent();
                    return [4 /*yield*/, apis.admin.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_MANAGER.ROLE)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.nodes.createFile(fileName1, docLibId)];
                case 5:
                    file1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(favFolderName)];
                case 6:
                    folderId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(parentFolder)];
                case 7:
                    parentId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileName2, parentId)];
                case 8:
                    file2Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileName3, parentId)];
                case 9:
                    file3Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileName4, parentId)];
                case 10:
                    file4Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file1Id)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('folder', folderId)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file2Id)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file3Id)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file4Id)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(file3Id, false)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(file4Id, false)];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, apis.user.trashcan.restore(file4Id)];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 19:
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
                case 0: return [4 /*yield*/, apis.admin.sites.deleteSite(siteName)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodes([favFolderName, parentFolder])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.user.trashcan.emptyTrash()];
                case 3:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('has the correct columns - [C280482]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var expectedColumns, actualColumns;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectedColumns = ['Name', 'Location', 'Size', 'Modified', 'Modified by'];
                    return [4 /*yield*/, dataTable.getColumnHeadersText()];
                case 1:
                    actualColumns = _a.sent();
                    expect(actualColumns).toEqual(expectedColumns);
                    return [2 /*return*/];
            }
        });
    }); });
    it('displays the favorite files and folders - [C213226]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, dataTable.getRowsCount()];
                case 1:
                    _a.apply(void 0, [_e.sent()]).toEqual(4, 'Incorrect number of items displayed');
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(fileName1)];
                case 2:
                    _b.apply(void 0, [_e.sent()]).toBe(true, fileName1 + " not displayed");
                    _c = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(fileName2)];
                case 3:
                    _c.apply(void 0, [_e.sent()]).toBe(true, fileName2 + " not displayed");
                    _d = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(favFolderName)];
                case 4:
                    _d.apply(void 0, [_e.sent()]).toBe(true, favFolderName + " not displayed");
                    return [2 /*return*/];
            }
        });
    }); });
    it("deleted favorite file does not appear - [C213228]", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(fileName3)];
                case 1:
                    _a.apply(void 0, [_b.sent()]).not.toBe(true, fileName3 + " is displayed");
                    return [2 /*return*/];
            }
        });
    }); });
    it("file is displayed after it is restored from Trashcan - [C213229]", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(fileName4)];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBe(true, fileName4 + " not displayed");
                    return [2 /*return*/];
            }
        });
    }); });
    it('Location column displays the parent folder of the files - [C213231]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, dataTable.getItemLocation(fileName1)];
                case 1:
                    _a.apply(void 0, [_d.sent()]).toEqual(siteName);
                    _b = expect;
                    return [4 /*yield*/, dataTable.getItemLocation(fileName2)];
                case 2:
                    _b.apply(void 0, [_d.sent()]).toEqual(parentFolder);
                    _c = expect;
                    return [4 /*yield*/, dataTable.getItemLocation(favFolderName)];
                case 3:
                    _c.apply(void 0, [_d.sent()]).toEqual('Personal Files');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Location column displays a tooltip with the entire path of the file - [C213671]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, dataTable.getItemLocationTooltip(fileName1)];
                case 1:
                    _a.apply(void 0, [_d.sent()]).toEqual("File Libraries/" + siteName);
                    _b = expect;
                    return [4 /*yield*/, dataTable.getItemLocationTooltip(fileName2)];
                case 2:
                    _b.apply(void 0, [_d.sent()]).toEqual("Personal Files/" + parentFolder);
                    _c = expect;
                    return [4 /*yield*/, dataTable.getItemLocationTooltip(favFolderName)];
                case 3:
                    _c.apply(void 0, [_d.sent()]).toEqual('Personal Files');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Location column redirect - item in user Home - [C213650]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, dataTable.clickItemLocation(favFolderName)];
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
    it('Location column redirect - file in folder - [C280484]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, dataTable.clickItemLocation(fileName2)];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, breadcrumb.getAllItems()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual(['Personal Files', parentFolder]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Location column redirect - file in site - [C280485]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, dataTable.clickItemLocation(fileName1)];
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
    it('Navigate into folder from Favorites - [C213230]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(favFolderName)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, dataTable.waitForEmptyState()];
                case 2:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, breadcrumb.getCurrentItemName()];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBe(favFolderName);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=favorites.test.js.map