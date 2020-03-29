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
import { APP_ROUTES } from '../../configs';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';
describe('Personal Files', function () {
    var username = "user-" + Utils.random();
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable;
    var adminFolder = "admin-folder-" + Utils.random();
    var userFolder = "user-folder-" + Utils.random();
    var userFile = "file-" + Utils.random() + ".txt";
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        apis.admin.people.createUser({ username: username }),
                        apis.admin.nodes.createFolders([adminFolder])
                    ])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolders([userFolder])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFiles([userFile], userFolder)];
                case 3:
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
                        apis.admin.nodes.deleteNodes([adminFolder]),
                        apis.user.nodes.deleteNodes([userFolder])
                    ])];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    describe("Admin user's personal files", function () {
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
                    case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('has Data Dictionary and created content - [C213241]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent('Data Dictionary')];
                    case 1:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Data Dictionary not displayed');
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(adminFolder)];
                    case 2:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'admin folder not displayed');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("Regular user's personal files", function () {
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
                    case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('has the correct columns - [C217142]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var expectedColumns, actualColumns;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedColumns = ['Name', 'Size', 'Modified', 'Modified by'];
                        return [4 /*yield*/, dataTable.getColumnHeadersText()];
                    case 1:
                        actualColumns = _a.sent();
                        expect(actualColumns).toEqual(expectedColumns);
                        return [2 /*return*/];
                }
            });
        }); });
        it('has default sorted column - [C217143]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.getSortedColumnHeaderText()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe('Modified');
                        return [2 /*return*/];
                }
            });
        }); });
        it('has user created content - [C213242]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(userFolder)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'user folder not displayed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('navigates to folder - [C213244]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var nodeId, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.getNodeByPath("/" + userFolder)];
                    case 1:
                        nodeId = (_c.sent()).entry.id;
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(userFolder)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getCurrentUrl()];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toContain(nodeId, 'Node ID is not in the URL');
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(userFile)];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'user file is missing');
                        return [2 /*return*/];
                }
            });
        }); });
        it('redirects to Personal Files on clicking the link from sidebar - [C213245]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var url;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(userFolder)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.clickPersonalFiles()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, browser.getCurrentUrl()];
                    case 3:
                        url = _a.sent();
                        expect(url.endsWith(APP_ROUTES.PERSONAL_FILES)).toBe(true, 'incorrect url');
                        return [2 /*return*/];
                }
            });
        }); });
        it('page loads correctly after browser refresh - [C213246]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.refresh()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getCurrentUrl()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toContain(APP_ROUTES.PERSONAL_FILES);
                        return [2 /*return*/];
                }
            });
        }); });
        it('page load by URL - [C213247]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var url, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, browser.getCurrentUrl()];
                    case 1:
                        url = _b.sent();
                        return [4 /*yield*/, page.clickTrash()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, browser.get(url)];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getCurrentUrl()];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toContain(APP_ROUTES.PERSONAL_FILES);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=personal-files.test.js.map