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
import { SITE_VISIBILITY, SITE_ROLES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { CreateOrEditFolderDialog } from '../../components/dialog/create-edit-folder-dialog';
import { Utils } from '../../utilities/utils';
describe('Edit folder', function () {
    var username = "user-" + Utils.random();
    var parent = "parent-" + Utils.random();
    var parentId;
    var folderName = "folder-" + Utils.random();
    var folderDescription = 'my folder description';
    var folderNameToEdit = "folder-" + Utils.random();
    var duplicateFolderName = "folder-" + Utils.random();
    var folderNameEdited = "folder-renamed-" + Utils.random();
    var folderNameEdited2 = "folder-search-renamed-" + Utils.random();
    var folderDescriptionEdited = 'description edited';
    var sitePrivate = "site-private-" + Utils.random();
    var siteName = "site-" + Utils.random();
    var folderSite = "folder-site-" + Utils.random();
    var folderSiteToEdit = "folder-site-" + Utils.random();
    var folderSiteToEditId;
    var duplicateFolderSite = "folder-" + Utils.random();
    var docLibUserSite;
    var folderFavorite = "folder-fav-" + Utils.random();
    var folderFavoriteId;
    var folderFavoriteToEdit = "folder-fav-" + Utils.random();
    var folderFavoriteToEditId;
    var folderFavoriteDuplicate = "folder-fav-" + Utils.random();
    var folderFavoriteDuplicateId;
    var folderSearch = "folder-search-" + Utils.random();
    var folderSearchToEdit = "folder-search-" + Utils.random();
    var folderSearchToEditId;
    var folderSearchDuplicate = "folder-search-" + Utils.random();
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var editDialog = new CreateOrEditFolderDialog();
    var dataTable = page.dataTable, toolbar = page.toolbar;
    var searchInput = page.header.searchInput;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var docLibId;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.getDocLibId(sitePrivate)];
                case 3:
                    docLibId = _a.sent();
                    return [4 /*yield*/, apis.admin.nodes.createFolder(folderName, docLibId)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_CONSUMER.ROLE)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                case 6:
                    parentId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderName, parentId, '', folderDescription)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderNameToEdit, parentId)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(duplicateFolderName, parentId)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(siteName)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.getDocLibId(siteName)];
                case 11:
                    docLibUserSite = _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderSite, docLibUserSite)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderSiteToEdit, docLibUserSite)];
                case 13:
                    folderSiteToEditId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(duplicateFolderSite, docLibUserSite)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderFavorite)];
                case 15:
                    folderFavoriteId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderFavoriteToEdit)];
                case 16:
                    folderFavoriteToEditId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderFavoriteDuplicate)];
                case 17:
                    folderFavoriteDuplicateId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderSearch)];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderSearchToEdit)];
                case 19:
                    folderSearchToEditId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderSearchDuplicate)];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('folder', folderFavoriteId)];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('folder', folderFavoriteToEditId)];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('folder', folderFavoriteDuplicateId)];
                case 23:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 24:
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
                        apis.admin.sites.deleteSite(sitePrivate),
                        apis.user.sites.deleteSite(siteName),
                        apis.user.nodes.deleteNodesById([parentId, folderFavoriteToEditId, folderFavoriteDuplicateId, folderSearchToEditId])
                    ])];
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
    it('dialog UI defaults - [C216331]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e;
        return tslib_1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(parent)];
                case 1:
                    _f.sent();
                    return [4 /*yield*/, dataTable.selectItem(folderName)];
                case 2:
                    _f.sent();
                    return [4 /*yield*/, toolbar.openMoreMenu()];
                case 3:
                    _f.sent();
                    return [4 /*yield*/, toolbar.menu.clickEditFolder()];
                case 4:
                    _f.sent();
                    _a = expect;
                    return [4 /*yield*/, editDialog.getTitle()];
                case 5:
                    _a.apply(void 0, [_f.sent()]).toEqual('Edit folder');
                    _b = expect;
                    return [4 /*yield*/, editDialog.getName()];
                case 6:
                    _b.apply(void 0, [_f.sent()]).toBe(folderName);
                    _c = expect;
                    return [4 /*yield*/, editDialog.getDescription()];
                case 7:
                    _c.apply(void 0, [_f.sent()]).toBe(folderDescription);
                    _d = expect;
                    return [4 /*yield*/, editDialog.isUpdateButtonEnabled()];
                case 8:
                    _d.apply(void 0, [_f.sent()]).toBe(true, 'upload button is not enabled');
                    _e = expect;
                    return [4 /*yield*/, editDialog.isCancelButtonEnabled()];
                case 9:
                    _e.apply(void 0, [_f.sent()]).toBe(true, 'cancel button is not enabled');
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
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(parent)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 3:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('properties are modified when pressing OK - [C216335]', function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, desc;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(folderNameToEdit)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.menu.clickEditFolder()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, editDialog.waitForDialogToOpen()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, editDialog.enterDescription(folderDescriptionEdited)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, editDialog.enterName(folderNameEdited)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, editDialog.clickUpdate()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, editDialog.waitForDialogToClose()];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 9:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folderNameEdited)];
                    case 10:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Folder not displayed');
                        return [4 /*yield*/, apis.user.nodes.getNodeDescription(folderNameEdited, parentId)];
                    case 11:
                        desc = _b.sent();
                        expect(desc).toEqual(folderDescriptionEdited);
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('with empty folder name - [C216332]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(folderName)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.menu.clickEditFolder()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, editDialog.deleteNameWithBackspace()];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, editDialog.isUpdateButtonEnabled()];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toBe(false, 'upload button is not enabled');
                        _b = expect;
                        return [4 /*yield*/, editDialog.getValidationMessage()];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toMatch('Folder name is required');
                        return [2 /*return*/];
                }
            });
        }); });
        it('with name with special characters - [C216333]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var namesWithSpecialChars, _i, namesWithSpecialChars_1, name_1, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        namesWithSpecialChars = ['a*a', 'a"a', 'a<a', 'a>a', "a\\a", 'a/a', 'a?a', 'a:a', 'a|a'];
                        return [4 /*yield*/, dataTable.selectItem(folderName)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.menu.clickEditFolder()];
                    case 3:
                        _c.sent();
                        _i = 0, namesWithSpecialChars_1 = namesWithSpecialChars;
                        _c.label = 4;
                    case 4:
                        if (!(_i < namesWithSpecialChars_1.length)) return [3 /*break*/, 9];
                        name_1 = namesWithSpecialChars_1[_i];
                        return [4 /*yield*/, editDialog.enterName(name_1)];
                    case 5:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, editDialog.isUpdateButtonEnabled()];
                    case 6:
                        _a.apply(void 0, [_c.sent()]).toBe(false, 'upload button is not disabled');
                        _b = expect;
                        return [4 /*yield*/, editDialog.getValidationMessage()];
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
        it('with name ending with a dot - [C216334]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(folderName)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.menu.clickEditFolder()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, editDialog.waitForDialogToOpen()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, editDialog.nameInput.sendKeys('.')];
                    case 5:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, editDialog.isUpdateButtonEnabled()];
                    case 6:
                        _a.apply(void 0, [_c.sent()]).toBe(false, 'upload button is not enabled');
                        _b = expect;
                        return [4 /*yield*/, editDialog.getValidationMessage()];
                    case 7:
                        _b.apply(void 0, [_c.sent()]).toMatch("Folder name can't end with a period .");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Cancel button - [C216336]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(folderName)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.menu.clickEditFolder()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, editDialog.waitForDialogToOpen()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, editDialog.clickCancel()];
                    case 5:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, editDialog.isDialogOpen()];
                    case 6:
                        _a.apply(void 0, [_b.sent()]).not.toBe(true, 'dialog is not closed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('with duplicate folder name - [C216337]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(folderName)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.menu.clickEditFolder()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, editDialog.waitForDialogToOpen()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, editDialog.enterName(duplicateFolderName)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, editDialog.clickUpdate()];
                    case 6:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 7:
                        _a.apply(void 0, [_c.sent()]).toEqual("There's already a folder with this name. Try a different name.");
                        _b = expect;
                        return [4 /*yield*/, editDialog.isDialogOpen()];
                    case 8:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'dialog is not present');
                        return [2 /*return*/];
                }
            });
        }); });
        it('trim ending spaces - [C216338]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(folderName)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.menu.clickEditFolder()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, editDialog.nameInput.sendKeys('   ')];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, editDialog.clickUpdate()];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, editDialog.waitForDialogToClose()];
                    case 6:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, page.isSnackBarPresent()];
                    case 7:
                        _a.apply(void 0, [_c.sent()]).not.toBe(true, 'notification appears');
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folderName)];
                    case 8:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Folder not displayed in list view');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Favorites', function () {
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
        it('properties are modified when pressing OK - [C280384]', function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, desc;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(folderFavoriteToEdit)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.menu.clickEditFolder()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, editDialog.waitForDialogToOpen()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, editDialog.enterDescription(folderDescriptionEdited)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, editDialog.enterName(folderNameEdited)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, editDialog.clickUpdate()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, editDialog.waitForDialogToClose()];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 9:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folderNameEdited)];
                    case 10:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Folder not displayed');
                        return [4 /*yield*/, apis.user.nodes.getNodeProperty(folderFavoriteToEditId, 'cm:description')];
                    case 11:
                        desc = _b.sent();
                        expect(desc).toEqual(folderDescriptionEdited);
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('with duplicate folder name - [C280386]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(folderFavorite)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.menu.clickEditFolder()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, editDialog.waitForDialogToOpen()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, editDialog.enterName(folderFavoriteDuplicate)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, editDialog.clickUpdate()];
                    case 6:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 7:
                        _a.apply(void 0, [_c.sent()]).toEqual("There's already a folder with this name. Try a different name.");
                        _b = expect;
                        return [4 /*yield*/, editDialog.isDialogOpen()];
                    case 8:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'dialog is not present');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on My Libraries', function () {
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(siteName)];
                    case 2:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('properties are modified when pressing OK - [C280509]', function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, desc;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(folderSiteToEdit)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.menu.clickEditFolder()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, editDialog.waitForDialogToOpen()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, editDialog.enterDescription(folderDescriptionEdited)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, editDialog.enterName(folderNameEdited)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, editDialog.clickUpdate()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, editDialog.waitForDialogToClose()];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 9:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folderNameEdited)];
                    case 10:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Folder not displayed');
                        return [4 /*yield*/, apis.user.nodes.getNodeProperty(folderSiteToEditId, 'cm:description')];
                    case 11:
                        desc = _b.sent();
                        expect(desc).toEqual(folderDescriptionEdited);
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('with duplicate folder name - [C280511]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(folderSite)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.menu.clickEditFolder()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, editDialog.waitForDialogToOpen()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, editDialog.enterName(duplicateFolderSite)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, editDialog.clickUpdate()];
                    case 6:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 7:
                        _a.apply(void 0, [_c.sent()]).toEqual("There's already a folder with this name. Try a different name.");
                        _b = expect;
                        return [4 /*yield*/, editDialog.isDialogOpen()];
                    case 8:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'dialog is not present');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Search Results', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.search.waitForNodes('folder-search', { expect: 3 })];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('properties are modified when pressing OK - [C306947]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, desc;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.clickPersonalFiles()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, searchInput.checkOnlyFolders()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, searchInput.searchFor(folderSearchToEdit)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(folderSearchToEdit)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, toolbar.menu.clickEditFolder()];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, editDialog.waitForDialogToOpen()];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, editDialog.enterDescription(folderDescriptionEdited)];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, editDialog.enterName(folderNameEdited2)];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, editDialog.clickUpdate()];
                    case 12:
                        _b.sent();
                        return [4 /*yield*/, editDialog.waitForDialogToClose()];
                    case 13:
                        _b.sent();
                        return [4 /*yield*/, page.refresh()];
                    case 14:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folderNameEdited2)];
                    case 15:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Folder not displayed');
                        return [4 /*yield*/, apis.user.nodes.getNodeProperty(folderSearchToEditId, 'cm:description')];
                    case 16:
                        desc = _b.sent();
                        expect(desc).toEqual(folderDescriptionEdited);
                        return [2 /*return*/];
                }
            });
        }); });
        it('with duplicate folder name - [C306948]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.clickPersonalFiles()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, searchInput.checkOnlyFolders()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, searchInput.searchFor(folderSearch)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, dataTable.selectItem(folderSearch)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, toolbar.menu.clickEditFolder()];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, editDialog.waitForDialogToOpen()];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, editDialog.enterName(folderSearchDuplicate)];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, editDialog.clickUpdate()];
                    case 11:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 12:
                        _a.apply(void 0, [_c.sent()]).toEqual("There's already a folder with this name. Try a different name.");
                        _b = expect;
                        return [4 /*yield*/, editDialog.isDialogOpen()];
                    case 13:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'dialog is not present');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=edit-folder.test.js.map