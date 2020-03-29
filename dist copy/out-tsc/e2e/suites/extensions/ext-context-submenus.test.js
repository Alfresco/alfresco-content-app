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
import { EXTENSIBILITY_CONFIGS } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
describe('Extensions - Context submenu', function () {
    var username = "user-" + Utils.random();
    var file = "file-" + Utils.random() + ".txt";
    var fileId;
    var folder = "folder-" + Utils.random();
    var folderId;
    var restrictedPermissionsItem = 'Share';
    var menuItem1 = {
        label: 'Test Menu1',
        submenu: ['Test submenu1', 'Test submenu2', restrictedPermissionsItem]
    };
    var menuItem2 = {
        label: 'Test Menu2',
        submenu: [restrictedPermissionsItem]
    };
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable;
    var contextMenu = dataTable.menu;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(file)];
                case 2:
                    fileId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(folder)];
                case 3:
                    folderId = (_a.sent()).entry.id;
                    return [4 /*yield*/, loginPage.load()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, Utils.setSessionStorageFromConfig(EXTENSIBILITY_CONFIGS.CONTEXT_SUBMENUS)];
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
    beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Utils.pressEscape()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dataTable.clearSelection()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, page.clickPersonalFilesAndWait()];
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
                case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(fileId, true)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(folderId, true)];
                case 2:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Displays the submenu actions set from config - [C286717]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, dataTable.rightClickOnItem(file)];
                case 1:
                    _g.sent();
                    _a = expect;
                    return [4 /*yield*/, contextMenu.isMenuItemPresent(menuItem1.label)];
                case 2:
                    _a.apply(void 0, [_g.sent()]).toBe(true, menuItem1.label + " is not displayed for " + file);
                    _b = expect;
                    return [4 /*yield*/, contextMenu.hasSubMenu(menuItem1.label)];
                case 3:
                    _b.apply(void 0, [_g.sent()]).toBe(true, 'Menu does not have submenu');
                    return [4 /*yield*/, contextMenu.mouseOverMenuItem(menuItem1.label)];
                case 4:
                    _g.sent();
                    _c = expect;
                    return [4 /*yield*/, contextMenu.getSubmenuItemsCount()];
                case 5:
                    _c.apply(void 0, [_g.sent()]).toBe(3, 'submenu has wrong number of items');
                    _d = expect;
                    return [4 /*yield*/, contextMenu.isSubMenuItemPresent(menuItem1.submenu[0])];
                case 6:
                    _d.apply(void 0, [_g.sent()]).toBe(true, menuItem1.submenu[0] + " is not displayed for " + file);
                    _e = expect;
                    return [4 /*yield*/, contextMenu.isSubMenuItemPresent(menuItem1.submenu[1])];
                case 7:
                    _e.apply(void 0, [_g.sent()]).toBe(true, menuItem1.submenu[1] + " is not displayed for " + file);
                    _f = expect;
                    return [4 /*yield*/, contextMenu.isSubMenuItemPresent(menuItem1.submenu[2])];
                case 8:
                    _f.apply(void 0, [_g.sent()]).toBe(true, restrictedPermissionsItem + " is not displayed for " + file);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Does not display submenu actions without permissions - [C286718]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e;
        return tslib_1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, dataTable.rightClickOnItem(folder)];
                case 1:
                    _f.sent();
                    _a = expect;
                    return [4 /*yield*/, contextMenu.isMenuItemPresent(menuItem1.label)];
                case 2:
                    _a.apply(void 0, [_f.sent()]).toBe(true, menuItem1.label + " is not displayed for " + folder);
                    return [4 /*yield*/, contextMenu.mouseOverMenuItem(menuItem1.label)];
                case 3:
                    _f.sent();
                    _b = expect;
                    return [4 /*yield*/, contextMenu.getSubmenuItemsCount()];
                case 4:
                    _b.apply(void 0, [_f.sent()]).toBe(2, 'submenu has wrong number of items');
                    _c = expect;
                    return [4 /*yield*/, contextMenu.isSubMenuItemPresent(menuItem1.submenu[0])];
                case 5:
                    _c.apply(void 0, [_f.sent()]).toBe(true, menuItem1.submenu[0] + " is not displayed for " + file);
                    _d = expect;
                    return [4 /*yield*/, contextMenu.isSubMenuItemPresent(menuItem1.submenu[1])];
                case 6:
                    _d.apply(void 0, [_f.sent()]).toBe(true, menuItem1.submenu[1] + " is not displayed for " + file);
                    _e = expect;
                    return [4 /*yield*/, contextMenu.isSubMenuItemPresent(menuItem1.submenu[2])];
                case 7:
                    _e.apply(void 0, [_f.sent()]).toBe(false, "no permission submenu " + restrictedPermissionsItem + " is displayed");
                    return [2 /*return*/];
            }
        });
    }); });
    it('The parent item is not displayed if all its children have no permission to be displayed - [C287784]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, dataTable.rightClickOnItem(folder)];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, contextMenu.isMenuItemPresent(menuItem2.label)];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe(false, menuItem2.label + " menu is displayed for " + folder);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=ext-context-submenus.test.js.map