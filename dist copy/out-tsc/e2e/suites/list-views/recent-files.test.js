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
import { SITE_VISIBILITY } from '../../configs';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';
describe('Recent Files', function () {
    var username = "user-" + Utils.random();
    var folderName = "folder-" + Utils.random();
    var folderId;
    var fileName1 = "file-" + Utils.random() + ".txt";
    var fileName2 = "file-" + Utils.random() + ".txt";
    var file2Id;
    var fileName3 = "file-" + Utils.random() + ".txt";
    var siteName = "site-" + Utils.random();
    var folderSite = "folder2-" + Utils.random();
    var folderSiteId;
    var fileSite = "file-" + Utils.random() + ".txt";
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable, breadcrumb = page.breadcrumb;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var id, docLibId;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolders([folderName])];
                case 2:
                    folderId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFiles([fileName1], folderName)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFiles([fileName2])];
                case 4:
                    file2Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFiles([fileName3])];
                case 5:
                    id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(id, false)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.getDocLibId(siteName)];
                case 8:
                    docLibId = _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderSite, docLibId)];
                case 9:
                    folderSiteId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileSite, folderSiteId)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, apis.user.search.waitForApi(username, { expect: 3 })];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 12:
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
                case 0: return [4 /*yield*/, apis.user.nodes.deleteNodesById([folderId, file2Id])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.deleteSite(siteName)];
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
    it('has the correct columns - [C213168]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var expectedColumns, actualColumns;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectedColumns = ['Name', 'Location', 'Size', 'Modified'];
                    return [4 /*yield*/, dataTable.getColumnHeadersText()];
                case 1:
                    actualColumns = _a.sent();
                    expect(actualColumns).toEqual(expectedColumns);
                    return [2 /*return*/];
            }
        });
    }); });
    it('default sorting column - [C213171]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, dataTable.getSortedColumnHeaderText()];
                case 1:
                    _a.apply(void 0, [_c.sent()]).toBe('Modified');
                    _b = expect;
                    return [4 /*yield*/, dataTable.getSortingOrder()];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toBe('desc');
                    return [2 /*return*/];
            }
        });
    }); });
    it('displays the files added by the current user in the last 30 days - [C213170]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, dataTable.getRowsCount()];
                case 1:
                    _a.apply(void 0, [_e.sent()]).toEqual(3, 'Incorrect number of files displayed');
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(fileName1)];
                case 2:
                    _b.apply(void 0, [_e.sent()]).toBe(true, fileName1 + " not displayed");
                    _c = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(fileName2)];
                case 3:
                    _c.apply(void 0, [_e.sent()]).toBe(true, fileName2 + " not displayed");
                    _d = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(fileSite)];
                case 4:
                    _d.apply(void 0, [_e.sent()]).toBe(true, fileSite + " not displayed");
                    return [2 /*return*/];
            }
        });
    }); });
    it("file not displayed if it's been deleted - [C213174]", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
    it('Location column displays the parent folder of the file - [C213175]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, dataTable.getItemLocation(fileName1)];
                case 1:
                    _a.apply(void 0, [_d.sent()]).toEqual(folderName);
                    _b = expect;
                    return [4 /*yield*/, dataTable.getItemLocation(fileName2)];
                case 2:
                    _b.apply(void 0, [_d.sent()]).toEqual('Personal Files');
                    _c = expect;
                    return [4 /*yield*/, dataTable.getItemLocation(fileSite)];
                case 3:
                    _c.apply(void 0, [_d.sent()]).toEqual(folderSite);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Location column displays a tooltip with the entire path of the file - [C213177]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, dataTable.getItemLocationTooltip(fileName1)];
                case 1:
                    _a.apply(void 0, [_d.sent()]).toEqual("Personal Files/" + folderName);
                    _b = expect;
                    return [4 /*yield*/, dataTable.getItemLocationTooltip(fileName2)];
                case 2:
                    _b.apply(void 0, [_d.sent()]).toEqual('Personal Files');
                    _c = expect;
                    return [4 /*yield*/, dataTable.getItemLocationTooltip(fileSite)];
                case 3:
                    _c.apply(void 0, [_d.sent()]).toEqual("File Libraries/" + siteName + "/" + folderSite);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Location column redirect - file in user Home - [C213176]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, dataTable.clickItemLocation(fileName2)];
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
    it('Location column redirect - file in folder - [C280486]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, dataTable.clickItemLocation(fileName1)];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, breadcrumb.getAllItems()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual(['Personal Files', folderName]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Location column redirect - file in site - [C280487]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, dataTable.clickItemLocation(fileSite)];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, breadcrumb.getAllItems()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual(['My Libraries', siteName, folderSite]);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=recent-files.test.js.map