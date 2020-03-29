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
describe('Shared Files', function () {
    var username = "user-" + Utils.random();
    var password = username;
    var siteName = "site-" + Utils.random();
    var fileAdmin = "fileSite-" + Utils.random() + ".txt";
    var folderUser = "folder-" + Utils.random();
    var folderId;
    var file1User = "file1-" + Utils.random() + ".txt";
    var file1Id;
    var file2User = "file2-" + Utils.random() + ".txt";
    var file2Id;
    var file3User = "file3-" + Utils.random() + ".txt";
    var file3Id;
    var file4User = "file4-" + Utils.random() + ".txt";
    var file4Id;
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, password)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable, breadcrumb = page.breadcrumb;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var docLibId, nodeId;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_CONSUMER.ROLE)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.getDocLibId(siteName)];
                case 4:
                    docLibId = _a.sent();
                    return [4 /*yield*/, apis.admin.nodes.createFile(fileAdmin, docLibId)];
                case 5:
                    nodeId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.admin.shared.shareFileById(nodeId)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderUser)];
                case 7:
                    folderId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file1User, folderId)];
                case 8:
                    file1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file2User)];
                case 9:
                    file2Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file3User)];
                case 10:
                    file3Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file4User)];
                case 11:
                    file4Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.shared.shareFilesByIds([file1Id, file2Id, file3Id, file4Id])];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.shared.waitForApi({ expect: 5 })];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(file2Id)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.unshareFile(file3User)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.shared.waitForApi({ expect: 3 })];
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
                case 0: return [4 /*yield*/, apis.admin.sites.deleteSite(siteName)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(folderId)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(file4Id)];
                case 3:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('has the correct columns - [C213113]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var expectedColumns, actualColumns;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectedColumns = ['Name', 'Location', 'Size', 'Modified', 'Modified by', 'Shared by'];
                    return [4 /*yield*/, dataTable.getColumnHeadersText()];
                case 1:
                    actualColumns = _a.sent();
                    expect(actualColumns).toEqual(expectedColumns);
                    return [2 /*return*/];
            }
        });
    }); });
    it('default sorting column - [C213115]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
    it('displays the files shared by everyone - [C213114]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(fileAdmin)];
                case 1:
                    _a.apply(void 0, [_c.sent()]).toBe(true, fileAdmin + " not displayed");
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(file1User)];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toBe(true, file1User + " not displayed");
                    return [2 /*return*/];
            }
        });
    }); });
    it("file not displayed if it's been deleted - [C213117]", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(file2User)];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBe(false, file2User + " is displayed");
                    return [2 /*return*/];
            }
        });
    }); });
    it('unshared file is not displayed - [C213118]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(file3User)];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBe(false, file3User + " is displayed");
                    return [2 /*return*/];
            }
        });
    }); });
    it('Location column displays the parent folder of the file - [C213665]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, dataTable.getItemLocationTooltip(file4User)];
                case 1:
                    _a.apply(void 0, [_d.sent()]).toEqual('Personal Files');
                    _b = expect;
                    return [4 /*yield*/, dataTable.getItemLocation(fileAdmin)];
                case 2:
                    _b.apply(void 0, [_d.sent()]).toEqual(siteName);
                    _c = expect;
                    return [4 /*yield*/, dataTable.getItemLocation(file1User)];
                case 3:
                    _c.apply(void 0, [_d.sent()]).toEqual(folderUser);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Location column redirect - file in user Home - [C213666]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, dataTable.clickItemLocation(file4User)];
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
    it('Location column redirect - file in folder - [C280490]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, dataTable.clickItemLocation(file1User)];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, breadcrumb.getAllItems()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual(['Personal Files', folderUser]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Location column redirect - file in site - [C280491]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, dataTable.clickItemLocation(fileAdmin)];
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
    it('Location column displays a tooltip with the entire path of the file - [C213667]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, dataTable.getItemLocationTooltip(fileAdmin)];
                case 1:
                    _a.apply(void 0, [_c.sent()]).toEqual("File Libraries/" + siteName);
                    _b = expect;
                    return [4 /*yield*/, dataTable.getItemLocationTooltip(file1User)];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toEqual("Personal Files/" + folderUser);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=shared-files.test.js.map