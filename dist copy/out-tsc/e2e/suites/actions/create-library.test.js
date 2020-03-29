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
import { CreateLibraryDialog } from '../../components/dialog/create-library-dialog';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';
describe('Create library', function () {
    var username = "user-" + Utils.random();
    var site1Name = "site1-" + Utils.random();
    var site2Name = "site2-" + Utils.random();
    var site3Name = "site3-" + Utils.random();
    var site4 = {
        name: "site4-" + Utils.random(),
        id: "site4-id-" + Utils.random(),
        description: 'site4 description'
    };
    var duplicateSite = {
        name: "duplicate-" + Utils.random(),
        id: "duplicate-" + Utils.random()
    };
    var siteInTrash = {
        name: "site-trash-" + Utils.random(),
        id: "site-trash-id-" + Utils.random()
    };
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var createDialog = new CreateLibraryDialog();
    var dataTable = page.dataTable;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(duplicateSite.name, SITE_VISIBILITY.PRIVATE, '', duplicateSite.id)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(siteInTrash.name, SITE_VISIBILITY.PUBLIC, '', siteInTrash.id)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.deleteSite(siteInTrash.id, false)];
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
    afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.user.sites.deleteAllUserSites()];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Create Library dialog UI - [C280024]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return tslib_1.__generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, page.sidenav.openCreateLibraryDialog()];
                case 1:
                    _l.sent();
                    return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                case 2:
                    _l.sent();
                    _a = expect;
                    return [4 /*yield*/, createDialog.getTitle()];
                case 3:
                    _a.apply(void 0, [_l.sent()]).toMatch('Create Library');
                    _b = expect;
                    return [4 /*yield*/, createDialog.isNameDisplayed()];
                case 4:
                    _b.apply(void 0, [_l.sent()]).toBe(true, 'Name input is not displayed');
                    _c = expect;
                    return [4 /*yield*/, createDialog.isLibraryIdDisplayed()];
                case 5:
                    _c.apply(void 0, [_l.sent()]).toBe(true, 'Library ID input is not displayed');
                    _d = expect;
                    return [4 /*yield*/, createDialog.isDescriptionDisplayed()];
                case 6:
                    _d.apply(void 0, [_l.sent()]).toBe(true, 'Description field is not displayed');
                    _e = expect;
                    return [4 /*yield*/, createDialog.isPublicDisplayed()];
                case 7:
                    _e.apply(void 0, [_l.sent()]).toBe(true, 'Public option is not displayed');
                    _f = expect;
                    return [4 /*yield*/, createDialog.isModeratedDisplayed()];
                case 8:
                    _f.apply(void 0, [_l.sent()]).toBe(true, 'Moderated option is not displayed');
                    _g = expect;
                    return [4 /*yield*/, createDialog.isPrivateDisplayed()];
                case 9:
                    _g.apply(void 0, [_l.sent()]).toBe(true, 'Private option is not displayed');
                    _h = expect;
                    return [4 /*yield*/, createDialog.isPublicChecked()];
                case 10:
                    _h.apply(void 0, [_l.sent()]).toBe(true, 'Public option not checked');
                    _j = expect;
                    return [4 /*yield*/, createDialog.isCreateEnabled()];
                case 11:
                    _j.apply(void 0, [_l.sent()]).toBe(false, 'Create button is not disabled');
                    _k = expect;
                    return [4 /*yield*/, createDialog.isCancelEnabled()];
                case 12:
                    _k.apply(void 0, [_l.sent()]).toBe(true, 'Cancel button is not enabled');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Create a public library - [C280025]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, page.sidenav.openCreateLibraryDialog()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, createDialog.enterName(site1Name)];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, createDialog.clickCreate()];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, createDialog.waitForDialogToClose()];
                case 5:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, page.breadcrumb.getCurrentItemName()];
                case 6:
                    _a.apply(void 0, [_d.sent()]).toEqual(site1Name, "Not navigated into " + site1Name);
                    return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                case 7:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site1Name)];
                case 8:
                    _b.apply(void 0, [_d.sent()]).toBe(true, site1Name + " not in the list");
                    _c = expect;
                    return [4 /*yield*/, apis.user.sites.getVisibility(site1Name)];
                case 9:
                    _c.apply(void 0, [_d.sent()]).toEqual(SITE_VISIBILITY.PUBLIC);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Create a moderated library - [C289880]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, page.sidenav.openCreateLibraryDialog()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, createDialog.enterName(site2Name)];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, createDialog.selectModerated()];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, createDialog.clickCreate()];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, createDialog.waitForDialogToClose()];
                case 6:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, page.breadcrumb.getCurrentItemName()];
                case 7:
                    _a.apply(void 0, [_d.sent()]).toEqual(site2Name, "Not navigated into " + site2Name);
                    return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                case 8:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site2Name)];
                case 9:
                    _b.apply(void 0, [_d.sent()]).toBe(true, site2Name + " not in the list");
                    _c = expect;
                    return [4 /*yield*/, apis.user.sites.getVisibility(site2Name)];
                case 10:
                    _c.apply(void 0, [_d.sent()]).toEqual(SITE_VISIBILITY.MODERATED);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Create a private library - [C289881]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, page.sidenav.openCreateLibraryDialog()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, createDialog.enterName(site3Name)];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, createDialog.selectPrivate()];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, createDialog.clickCreate()];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, createDialog.waitForDialogToClose()];
                case 6:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, page.breadcrumb.getCurrentItemName()];
                case 7:
                    _a.apply(void 0, [_d.sent()]).toEqual(site3Name, "Not navigated into " + site3Name);
                    return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                case 8:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site3Name)];
                case 9:
                    _b.apply(void 0, [_d.sent()]).toBe(true, site3Name + " not in the list");
                    _c = expect;
                    return [4 /*yield*/, apis.user.sites.getVisibility(site3Name)];
                case 10:
                    _c.apply(void 0, [_d.sent()]).toEqual(SITE_VISIBILITY.PRIVATE);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Create a library with a given ID and description - [C289882]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, page.sidenav.openCreateLibraryDialog()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, createDialog.enterName(site4.name)];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, createDialog.enterLibraryId(site4.id)];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, createDialog.enterDescription(site4.description)];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, createDialog.selectPublic()];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, createDialog.clickCreate()];
                case 7:
                    _e.sent();
                    return [4 /*yield*/, createDialog.waitForDialogToClose()];
                case 8:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, page.breadcrumb.getCurrentItemName()];
                case 9:
                    _a.apply(void 0, [_e.sent()]).toEqual(site4.name, "Not navigated into " + site4.name);
                    return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                case 10:
                    _e.sent();
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site4.name)];
                case 11:
                    _b.apply(void 0, [_e.sent()]).toBe(true, site4.name + " not in the list");
                    _c = expect;
                    return [4 /*yield*/, apis.user.sites.getVisibility(site4.id)];
                case 12:
                    _c.apply(void 0, [_e.sent()]).toEqual(SITE_VISIBILITY.PUBLIC);
                    _d = expect;
                    return [4 /*yield*/, apis.user.sites.getDescription(site4.id)];
                case 13:
                    _d.apply(void 0, [_e.sent()]).toEqual(site4.description);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Duplicate library ID - [C280027]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.sidenav.openCreateLibraryDialog()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, createDialog.enterName(duplicateSite.name)];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, createDialog.enterLibraryId(duplicateSite.id)];
                case 4:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, createDialog.isCreateEnabled()];
                case 5:
                    _a.apply(void 0, [_c.sent()]).toBe(false, 'Create button not disabled');
                    _b = expect;
                    return [4 /*yield*/, createDialog.getErrorMessage()];
                case 6:
                    _b.apply(void 0, [_c.sent()]).toEqual("This Library ID isn't available. Try a different Library ID.");
                    return [2 /*return*/];
            }
        });
    }); });
    it('Create library using the ID of a library from the Trashcan - [C280028]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.sidenav.openCreateLibraryDialog()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, createDialog.enterName(siteInTrash.name)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, createDialog.enterLibraryId(siteInTrash.id)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, createDialog.clickCreate()];
                case 5:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, createDialog.getErrorMessage()];
                case 6:
                    _a.apply(void 0, [_b.sent()]).toEqual("This Library ID is already used. Check the trashcan.");
                    return [2 /*return*/];
            }
        });
    }); });
    it('Cancel button - [C280029]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.sidenav.openCreateLibraryDialog()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, createDialog.enterName('test site')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, createDialog.enterDescription('test description')];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, createDialog.clickCancel()];
                case 5:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, createDialog.isDialogOpen()];
                case 6:
                    _a.apply(void 0, [_b.sent()]).not.toBe(true, 'dialog is not closed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Library ID cannot contain special characters - [C280026]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var idWithSpecialChars, _i, idWithSpecialChars_1, id, _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    idWithSpecialChars = ['a*a', 'a"a', 'a<a', 'a>a', "a\\a", 'a/a', 'a?a', 'a:a', 'a|a'];
                    return [4 /*yield*/, page.sidenav.openCreateLibraryDialog()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, createDialog.enterName('test site')];
                case 3:
                    _c.sent();
                    _i = 0, idWithSpecialChars_1 = idWithSpecialChars;
                    _c.label = 4;
                case 4:
                    if (!(_i < idWithSpecialChars_1.length)) return [3 /*break*/, 9];
                    id = idWithSpecialChars_1[_i];
                    return [4 /*yield*/, createDialog.enterLibraryId(id)];
                case 5:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, createDialog.isCreateEnabled()];
                case 6:
                    _a.apply(void 0, [_c.sent()]).toBe(false, 'Create button is not disabled');
                    _b = expect;
                    return [4 /*yield*/, createDialog.getErrorMessage()];
                case 7:
                    _b.apply(void 0, [_c.sent()]).toContain("Use numbers and letters only");
                    _c.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 4];
                case 9: return [2 /*return*/];
            }
        });
    }); });
    it('Create 2 libraries with same name but different IDs - [C280030]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, page.sidenav.openCreateLibraryDialog()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, createDialog.waitForDialogToOpen()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, createDialog.enterName(duplicateSite.name)];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, createDialog.enterLibraryId(duplicateSite.id + "-2")];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, createDialog.clickCreate()];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, createDialog.waitForDialogToClose()];
                case 6:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, page.breadcrumb.getCurrentItemName()];
                case 7:
                    _a.apply(void 0, [_d.sent()]).toEqual(duplicateSite.name, "Not navigated into " + duplicateSite.name);
                    return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                case 8:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(duplicateSite.name + " (" + duplicateSite.id + "-2)")];
                case 9:
                    _b.apply(void 0, [_d.sent()]).toBe(true, duplicateSite.name + " not in the list");
                    _c = expect;
                    return [4 /*yield*/, apis.user.sites.getTitle(duplicateSite.id + "-2")];
                case 10:
                    _c.apply(void 0, [_d.sent()]).toEqual(duplicateSite.name);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=create-library.test.js.map