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
import { BrowsingPage, LoginPage } from '../../pages/pages';
import { CreateOrEditFolderDialog } from '../../components/dialog/create-edit-folder-dialog';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
describe('General', function () {
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var createDialog = new CreateOrEditFolderDialog();
    var adminApi = new RepoClient();
    var nodesApi = adminApi.nodes, authApi = adminApi.authentication;
    var folder = "folder-" + Utils.random();
    var folderId;
    describe('on session expire', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nodesApi.createFolder(folder)];
                    case 1:
                        folderId = (_a.sent()).entry.id;
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nodesApi.deleteNodeById(folderId)];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should close opened dialogs - [C286473]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, error_1, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWithAdmin()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, page.sidenav.openCreateFolderDialog()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, createDialog.enterName(folder)];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, authApi.logout()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, createDialog.clickCreate()];
                    case 6:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 7:
                        _a.apply(void 0, [_d.sent()]).toEqual('The action was unsuccessful. Try again or contact your IT Team.');
                        _b = expect;
                        return [4 /*yield*/, browser.getTitle()];
                    case 8:
                        _b.apply(void 0, [_d.sent()]).toContain('Sign in');
                        _d.label = 9;
                    case 9:
                        _d.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, createDialog.waitForDialogToClose()];
                    case 10:
                        _d.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        error_1 = _d.sent();
                        console.log('err: ', error_1);
                        return [3 /*break*/, 12];
                    case 12:
                        _c = expect;
                        return [4 /*yield*/, createDialog.isDialogOpen()];
                    case 13:
                        _c.apply(void 0, [_d.sent()]).not.toBe(true, 'dialog is present');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=general.test.js.map