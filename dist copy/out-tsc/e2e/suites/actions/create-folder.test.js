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
import { CreateOrEditFolderDialog } from '../../components/dialog/create-edit-folder-dialog';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';
describe('Create folder', function () {
    var username = "user-" + Utils.random();
    var parent = "parent-" + Utils.random();
    var parentId;
    var folderName1 = "folder-" + Utils.random();
    var folderName2 = "folder-" + Utils.random();
    var folderDescription = 'description of my folder';
    var duplicateFolderName = "folder-" + Utils.random();
    var nameWithSpaces = " folder-" + Utils.random() + " ";
    var siteName = "site-" + Utils.random();
    var folderSite = "folder-site-" + Utils.random();
    var duplicateFolderSite = "folder-" + Utils.random();
    var docLibUserSite;
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var createDialog = new CreateOrEditFolderDialog();
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
                    return [4 /*yield*/, apis.user.nodes.createFolder(duplicateFolderName, parentId)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(siteName)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.getDocLibId(siteName)];
                case 5:
                    docLibUserSite = _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(duplicateFolderSite, docLibUserSite)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 7:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.user.sites.deleteSite(siteName)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentId)];
                case 2:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('on Personal Files', function () {
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
        afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('creates new folder with name - [C216341]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(parent)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.sidenav.openCreateFolderDialog()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, createDialog.enterName(folderName1)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, createDialog.clickCreate()];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, createDialog.waitForDialogToClose()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 7:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folderName1)];
                    case 8:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Folder not displayed in list view');
                        return [2 /*return*/];
                }
            });
        }); });
        it('creates new folder with name and description - [C216340]', function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, desc;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(parent)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.sidenav.openCreateFolderDialog()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, createDialog.enterName(folderName2)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, createDialog.enterDescription(folderDescription)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, createDialog.clickCreate()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, createDialog.waitForDialogToClose()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 8:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folderName2)];
                    case 9:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Folder not displayed');
                        return [4 /*yield*/, apis.user.nodes.getNodeDescription(folderName2, parentId)];
                    case 10:
                        desc = _b.sent();
                        expect(desc).toEqual(folderDescription);
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('dialog UI elements - [C216345]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(parent)];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, page.sidenav.openCreateFolderDialog()];
                    case 2:
                        _f.sent();
                        return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                    case 3:
                        _f.sent();
                        _a = expect;
                        return [4 /*yield*/, createDialog.getTitle()];
                    case 4:
                        _a.apply(void 0, [_f.sent()]).toMatch('Create new folder');
                        _b = expect;
                        return [4 /*yield*/, createDialog.isNameDisplayed()];
                    case 5:
                        _b.apply(void 0, [_f.sent()]).toBe(true, 'Name input is not displayed');
                        _c = expect;
                        return [4 /*yield*/, createDialog.isDescriptionDisplayed()];
                    case 6:
                        _c.apply(void 0, [_f.sent()]).toBe(true, 'Description field is not displayed');
                        _d = expect;
                        return [4 /*yield*/, createDialog.isCreateButtonEnabled()];
                    case 7:
                        _d.apply(void 0, [_f.sent()]).toBe(false, 'Create button is not disabled');
                        _e = expect;
                        return [4 /*yield*/, createDialog.isCancelButtonEnabled()];
                    case 8:
                        _e.apply(void 0, [_f.sent()]).toBe(true, 'Cancel button is not enabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('with empty folder name - [C216346]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(parent)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.sidenav.openCreateFolderDialog()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, createDialog.deleteNameWithBackspace()];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, createDialog.isCreateButtonEnabled()];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toBe(false, 'Create button is enabled');
                        _b = expect;
                        return [4 /*yield*/, createDialog.getValidationMessage()];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toMatch('Folder name is required');
                        return [2 /*return*/];
                }
            });
        }); });
        it('with folder name ending with a dot "." - [C216348]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(parent)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.sidenav.openCreateFolderDialog()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, createDialog.enterName('folder-name.')];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, createDialog.isCreateButtonEnabled()];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toBe(false, 'Create button is not disabled');
                        _b = expect;
                        return [4 /*yield*/, createDialog.getValidationMessage()];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toMatch("Folder name can't end with a period .");
                        return [2 /*return*/];
                }
            });
        }); });
        it('with folder name containing special characters - [C216347]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var namesWithSpecialChars, _i, namesWithSpecialChars_1, name_1, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        namesWithSpecialChars = ['a*a', 'a"a', 'a<a', 'a>a', "a\\a", 'a/a', 'a?a', 'a:a', 'a|a'];
                        return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(parent)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.sidenav.openCreateFolderDialog()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                    case 3:
                        _c.sent();
                        _i = 0, namesWithSpecialChars_1 = namesWithSpecialChars;
                        _c.label = 4;
                    case 4:
                        if (!(_i < namesWithSpecialChars_1.length)) return [3 /*break*/, 9];
                        name_1 = namesWithSpecialChars_1[_i];
                        return [4 /*yield*/, createDialog.enterName(name_1)];
                    case 5:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, createDialog.isCreateButtonEnabled()];
                    case 6:
                        _a.apply(void 0, [_c.sent()]).toBe(false, 'Create button is not disabled');
                        _b = expect;
                        return [4 /*yield*/, createDialog.getValidationMessage()];
                    case 7:
                        _b.apply(void 0, [_c.sent()]).toContain("Folder name can't contain these characters");
                        _c.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 4];
                    case 9: return [2 /*return*/];
                }
            });
        }); });
        it('with folder name containing only spaces - [C280406]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(parent)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.sidenav.openCreateFolderDialog()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, createDialog.enterName('    ')];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, createDialog.isCreateButtonEnabled()];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toBe(false, 'Create button is not disabled');
                        _b = expect;
                        return [4 /*yield*/, createDialog.getValidationMessage()];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toMatch("Folder name can't contain only spaces");
                        return [2 /*return*/];
                }
            });
        }); });
        it('cancel folder creation - [C216349]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(parent)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.sidenav.openCreateFolderDialog()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, createDialog.enterName('test')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, createDialog.enterDescription('test description')];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, createDialog.clickCancel()];
                    case 6:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, createDialog.isDialogOpen()];
                    case 7:
                        _a.apply(void 0, [_b.sent()]).not.toBe(true, 'dialog is not closed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('duplicate folder name - [C216350]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(parent)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.sidenav.openCreateFolderDialog()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, createDialog.enterName(duplicateFolderName)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, createDialog.clickCreate()];
                    case 5:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        _a.apply(void 0, [_c.sent()]).toEqual("There's already a folder with this name. Try a different name.");
                        _b = expect;
                        return [4 /*yield*/, createDialog.isDialogOpen()];
                    case 7:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'dialog is not present');
                        return [2 /*return*/];
                }
            });
        }); });
        it('trim ending spaces from folder name - [C216351]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(parent)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.sidenav.openCreateFolderDialog()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, createDialog.enterName(nameWithSpaces)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, createDialog.clickCreate()];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, createDialog.waitForDialogToClose()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 7:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(nameWithSpaces.trim())];
                    case 8:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Folder not displayed in list view');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on File Libraries', function () {
        var fileLibrariesPage = new BrowsingPage();
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fileLibrariesPage.goToMyLibrariesAndWait()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('creates new folder with name and description - [C280394]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, desc;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(siteName)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.sidenav.openCreateFolderDialog()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, createDialog.enterName(folderSite)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, createDialog.enterDescription(folderDescription)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, createDialog.clickCreate()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, createDialog.waitForDialogToClose()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 8:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folderSite)];
                    case 9:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Folder not displayed');
                        return [4 /*yield*/, apis.user.nodes.getNodeDescription(folderSite, docLibUserSite)];
                    case 10:
                        desc = _b.sent();
                        expect(desc).toEqual(folderDescription);
                        return [2 /*return*/];
                }
            });
        }); });
        it('cancel folder creation - [C280403]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(siteName)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.sidenav.openCreateFolderDialog()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, createDialog.enterName('test')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, createDialog.enterDescription('test description')];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, createDialog.clickCancel()];
                    case 6:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, createDialog.isDialogOpen()];
                    case 7:
                        _a.apply(void 0, [_b.sent()]).not.toBe(true, 'dialog is not closed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('duplicate folder name - [C280404]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(siteName)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.sidenav.openCreateFolderDialog()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, createDialog.enterName(duplicateFolderSite)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, createDialog.clickCreate()];
                    case 5:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        _a.apply(void 0, [_c.sent()]).toEqual("There's already a folder with this name. Try a different name.");
                        _b = expect;
                        return [4 /*yield*/, createDialog.isDialogOpen()];
                    case 7:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'dialog is not present');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=create-folder.test.js.map