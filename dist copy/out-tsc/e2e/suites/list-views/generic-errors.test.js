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
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';
describe('Generic errors', function () {
    var username = "user-" + Utils.random();
    var username2 = "user2-" + Utils.random();
    var parent = "folder-" + Utils.random();
    var parentId;
    var file1 = "file1-" + Utils.random() + ".txt";
    var file1Id;
    var file2 = "file2-" + Utils.random() + ".txt";
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.people.createUser({ username: username2 })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                case 3:
                    parentId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file1, parentId)];
                case 4:
                    file1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file2, parentId)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 6:
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
    it('File / folder not found - [C217313]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var URL, _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, dataTable.doubleClickOnRowByName(parent)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, dataTable.doubleClickOnRowByName(file1)];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, browser.getCurrentUrl()];
                case 4:
                    URL = _c.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(file1Id, false)];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, browser.get(URL)];
                case 6:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, page.isGenericErrorDisplayed()];
                case 7:
                    _a.apply(void 0, [_c.sent()]).toBe(true, 'Generic error page not displayed');
                    _b = expect;
                    return [4 /*yield*/, page.getGenericErrorTitle()];
                case 8:
                    _b.apply(void 0, [_c.sent()]).toContain("This item no longer exists or you don't have permission to view it.");
                    return [2 /*return*/];
            }
        });
    }); });
    it('Invalid URL - [C217315]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.load('/invalid page')];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, page.isGenericErrorDisplayed()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe(true, 'Generic error page not displayed');
                    _b = expect;
                    return [4 /*yield*/, page.getGenericErrorTitle()];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toContain("This item no longer exists or you don't have permission to view it.");
                    return [2 /*return*/];
            }
        });
    }); });
    it('Permission denied - [C217314]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var URL, _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, dataTable.doubleClickOnRowByName(parent)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, dataTable.doubleClickOnRowByName(file2)];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, browser.getCurrentUrl()];
                case 4:
                    URL = _c.sent();
                    return [4 /*yield*/, loginPage.loginWith(username2)];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, browser.get(URL)];
                case 6:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, page.isGenericErrorDisplayed()];
                case 7:
                    _a.apply(void 0, [_c.sent()]).toBe(true, 'Generic error page not displayed');
                    _b = expect;
                    return [4 /*yield*/, page.getGenericErrorTitle()];
                case 8:
                    _b.apply(void 0, [_c.sent()]).toContain("This item no longer exists or you don't have permission to view it.");
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 9:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=generic-errors.test.js.map