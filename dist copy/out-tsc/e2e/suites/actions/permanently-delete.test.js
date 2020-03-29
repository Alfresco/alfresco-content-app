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
import { ConfirmDialog } from './../../components/components';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
describe('Permanently delete from Trash', function () {
    var username = "user-" + Utils.random();
    var file1 = "file1-" + Utils.random() + ".txt";
    var file2 = "file2-" + Utils.random() + ".txt";
    var file3 = "file3-" + Utils.random() + ".txt";
    var filesIds;
    var folder1 = "folder1-" + Utils.random();
    var folder2 = "folder2-" + Utils.random();
    var foldersIds;
    var site = "site-" + Utils.random();
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable, toolbar = page.toolbar;
    var confirmDialog = new ConfirmDialog();
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFiles([file1, file2, file3])];
                case 2:
                    filesIds = (_a.sent()).list.entries.map(function (entries) { return entries.entry.id; });
                    return [4 /*yield*/, apis.user.nodes.createFolders([folder1, folder2])];
                case 3:
                    foldersIds = (_a.sent()).list.entries.map(function (entries) { return entries.entry.id; });
                    return [4 /*yield*/, apis.user.sites.createSite(site)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodesById(filesIds, false)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodesById(foldersIds, false)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.deleteSite(site, false)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 8:
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
    afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.user.trashcan.emptyTrash()];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('delete a file - [C217091]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, toolbar.clickPermanentlyDelete()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, page.waitForDialog()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, confirmDialog.clickDelete()];
                case 4:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, page.getSnackBarMessage()];
                case 5:
                    _a.apply(void 0, [_c.sent()]).toEqual(file1 + " deleted");
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(file1)];
                case 6:
                    _b.apply(void 0, [_c.sent()]).toBe(false, 'Item was not deleted');
                    return [2 /*return*/];
            }
        });
    }); });
    it('delete a folder - [C280416]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, dataTable.selectItem(folder1)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, toolbar.clickPermanentlyDelete()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, page.waitForDialog()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, confirmDialog.clickDelete()];
                case 4:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, page.getSnackBarMessage()];
                case 5:
                    _a.apply(void 0, [_c.sent()]).toEqual(folder1 + " deleted");
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(folder1)];
                case 6:
                    _b.apply(void 0, [_c.sent()]).toBe(false, 'Item was not deleted');
                    return [2 /*return*/];
            }
        });
    }); });
    it('delete a library - [C290103]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, dataTable.selectItem(site)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, toolbar.clickPermanentlyDelete()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, page.waitForDialog()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, confirmDialog.clickDelete()];
                case 4:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, page.getSnackBarMessage()];
                case 5:
                    _a.apply(void 0, [_c.sent()]).toEqual(site + " deleted");
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site)];
                case 6:
                    _b.apply(void 0, [_c.sent()]).toBe(false, site + " was not deleted");
                    return [2 /*return*/];
            }
        });
    }); });
    it('delete multiple items - [C280417]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, dataTable.selectMultipleItems([file2, folder2])];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, toolbar.clickPermanentlyDelete()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, page.waitForDialog()];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, confirmDialog.clickDelete()];
                case 4:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, page.getSnackBarMessage()];
                case 5:
                    _a.apply(void 0, [_d.sent()]).toEqual("2 items deleted");
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(file2)];
                case 6:
                    _b.apply(void 0, [_d.sent()]).toBe(false, 'Item was not deleted');
                    _c = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(folder2)];
                case 7:
                    _c.apply(void 0, [_d.sent()]).toBe(false, 'Item was not deleted');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Confirmation dialog UI - [C269113]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e;
        return tslib_1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, dataTable.selectItem(file3)];
                case 1:
                    _f.sent();
                    return [4 /*yield*/, toolbar.clickPermanentlyDelete()];
                case 2:
                    _f.sent();
                    return [4 /*yield*/, page.waitForDialog()];
                case 3:
                    _f.sent();
                    _a = expect;
                    return [4 /*yield*/, confirmDialog.isDialogOpen()];
                case 4:
                    _a.apply(void 0, [_f.sent()]).toBe(true, 'Confirm delete dialog not open');
                    _b = expect;
                    return [4 /*yield*/, confirmDialog.getTitle()];
                case 5:
                    _b.apply(void 0, [_f.sent()]).toContain('Delete from trash');
                    _c = expect;
                    return [4 /*yield*/, confirmDialog.getText()];
                case 6:
                    _c.apply(void 0, [_f.sent()]).toContain('This will permanently remove the selected item(s)');
                    _d = expect;
                    return [4 /*yield*/, confirmDialog.isDeleteEnabled()];
                case 7:
                    _d.apply(void 0, [_f.sent()]).toBe(true, 'DELETE button is not enabled');
                    _e = expect;
                    return [4 /*yield*/, confirmDialog.isKeepEnabled()];
                case 8:
                    _e.apply(void 0, [_f.sent()]).toBe(true, 'KEEP button is not enabled');
                    return [4 /*yield*/, Utils.pressEscape()];
                case 9:
                    _f.sent();
                    return [4 /*yield*/, dataTable.clearSelection()];
                case 10:
                    _f.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Keep action cancels the deletion - [C269115]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, dataTable.selectItem(file3)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, toolbar.clickPermanentlyDelete()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, page.waitForDialog()];
                case 3:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, confirmDialog.isKeepEnabled()];
                case 4:
                    _a.apply(void 0, [_c.sent()]).toBe(true, 'KEEP button is not enabled');
                    return [4 /*yield*/, confirmDialog.clickKeep()];
                case 5:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(file3)];
                case 6:
                    _b.apply(void 0, [_c.sent()]).toBe(true, 'Item was deleted');
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=permanently-delete.test.js.map