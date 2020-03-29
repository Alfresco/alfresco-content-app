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
import { FILES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
import { Viewer } from '../../components/viewer/viewer';
import { PasswordDialog } from './../../components/dialog/password-dialog';
describe('Viewer - password protected file', function () {
    var username = "user-" + Utils.random();
    var parent = "parent-" + Utils.random();
    var parentId;
    var protectedFile = FILES.protectedFile;
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable;
    var viewer = new Viewer();
    var passwordDialog = new PasswordDialog();
    beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                case 2:
                    parentId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.upload.uploadFile(protectedFile.name, parentId)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.header.expandSideNav()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dataTable.doubleClickOnRowByName(parent)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, dataTable.waitForHeader()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, dataTable.doubleClickOnRowByName(protectedFile.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, viewer.waitForViewerToOpen()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, page.waitForDialog()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.closeOpenDialogs()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Utils.pressEscape()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Password dialog appears when opening a protected file - [C268958]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e;
        return tslib_1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, passwordDialog.isDialogOpen()];
                case 1:
                    _a.apply(void 0, [_f.sent()]).toBe(true, 'Password dialog not open');
                    _b = expect;
                    return [4 /*yield*/, passwordDialog.isPasswordInputDisplayed()];
                case 2:
                    _b.apply(void 0, [_f.sent()]).toBe(true, 'Password input not displayed');
                    _c = expect;
                    return [4 /*yield*/, passwordDialog.isSubmitEnabled()];
                case 3:
                    _c.apply(void 0, [_f.sent()]).toBe(false, 'Submit button not disabled');
                    _d = expect;
                    return [4 /*yield*/, passwordDialog.isCloseEnabled()];
                case 4:
                    _d.apply(void 0, [_f.sent()]).toBe(true, 'Close button not enabled');
                    _e = expect;
                    return [4 /*yield*/, viewer.isPdfViewerContentDisplayed()];
                case 5:
                    _e.apply(void 0, [_f.sent()]).toBe(false, 'file content is displayed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('File content is displayed when entering the correct password - [C268959]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, passwordDialog.enterPassword(protectedFile.password)];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, passwordDialog.isSubmitEnabled()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe(true, 'Submit button not enabled');
                    return [4 /*yield*/, passwordDialog.clickSubmit()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, passwordDialog.waitForDialogToClose()];
                case 4:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, viewer.isPdfViewerContentDisplayed()];
                case 5:
                    _b.apply(void 0, [_c.sent()]).toBe(true, 'file content not displayed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Error appears when entering an incorrect password - [C268960]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, passwordDialog.enterPassword('incorrect')];
                case 1:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, passwordDialog.isSubmitEnabled()];
                case 2:
                    _a.apply(void 0, [_d.sent()]).toBe(true, 'Submit button not enabled');
                    return [4 /*yield*/, passwordDialog.clickSubmit()];
                case 3:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, passwordDialog.getErrorMessage()];
                case 4:
                    _b.apply(void 0, [_d.sent()]).toBe('Password is wrong');
                    _c = expect;
                    return [4 /*yield*/, viewer.isPdfViewerContentDisplayed()];
                case 5:
                    _c.apply(void 0, [_d.sent()]).toBe(false, 'file content is displayed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Refresh the page while Password dialog is open - [C268961]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, passwordDialog.enterPassword(protectedFile.password)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, page.refresh()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, viewer.waitForViewerToOpen()];
                case 3:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, viewer.isPdfViewerContentDisplayed()];
                case 4:
                    _a.apply(void 0, [_c.sent()]).toBe(false, 'file content is displayed');
                    _b = expect;
                    return [4 /*yield*/, passwordDialog.isDialogOpen()];
                case 5:
                    _b.apply(void 0, [_c.sent()]).toBe(true, 'Password dialog not open');
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=viewer-protected-file.test.js.map