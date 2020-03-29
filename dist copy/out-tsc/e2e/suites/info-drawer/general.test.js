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
import { InfoDrawer } from './../../components/info-drawer/info-drawer';
import { Utils } from '../../utilities/utils';
describe('General', function () {
    var username = "user1-" + Utils.random();
    var parent = "parent-" + Utils.random();
    var parentId;
    var file1 = "file1-" + Utils.random() + ".txt";
    var folder1 = "folder1-" + Utils.random();
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var infoDrawer = new InfoDrawer();
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
                    return [4 /*yield*/, apis.user.nodes.createFile(file1, parentId)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folder1, parentId)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 5:
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
                    return [4 /*yield*/, dataTable.doubleClickOnRowByName(parent)];
                case 2:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, infoDrawer.isOpen()];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 3];
                    return [4 /*yield*/, page.toolbar.clickViewDetails()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Info drawer closes on page refresh - [C268999]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, page.toolbar.clickViewDetails()];
                case 2:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, infoDrawer.isOpen()];
                case 3:
                    _a.apply(void 0, [_c.sent()]).toBe(true, 'Info drawer not open');
                    return [4 /*yield*/, page.refresh()];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 5:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, infoDrawer.isOpen()];
                case 6:
                    _b.apply(void 0, [_c.sent()]).toBe(false, 'Info drawer open');
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=general.test.js.map