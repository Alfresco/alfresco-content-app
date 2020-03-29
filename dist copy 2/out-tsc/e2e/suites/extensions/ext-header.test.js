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
import { LoginPage } from '../../pages/pages';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { EXTENSIBILITY_CONFIGS } from '../../configs';
import { Utils } from '../../utilities/utils';
import { Header } from '../../components/components';
import { Menu } from './../../components/menu/menu';
describe('Extensions - Info Drawer', function () {
    var username = "user-" + Utils.random();
    var disabledMenu = {
        id: 'settings',
        title: 'App settings',
        description: 'Application settings',
        icon: 'settings'
    };
    var enabledMenu = {
        id: 'button',
        title: 'New Button',
        description: 'new button description',
        icon: 'alarm_on'
    };
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var header = new Header();
    var toolbarMenu = new Menu();
    var loginPage = new LoginPage();
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loginPage.load()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Utils.setSessionStorageFromConfig(EXTENSIBILITY_CONFIGS.HEADER)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 4:
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
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Add a new button in the header - [C286474]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, header.openMoreMenu()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, toolbarMenu.isMenuItemPresent(enabledMenu.title)];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe(true, 'menu item not present');
                    _b = expect;
                    return [4 /*yield*/, toolbarMenu.getItemIconText(enabledMenu.title)];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toEqual(enabledMenu.icon);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Disable a button from the header - [C286477]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, header.openMoreMenu()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, toolbarMenu.isMenuItemPresent(disabledMenu.title)];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe(true, disabledMenu.title + " menu item not present");
                    _b = expect;
                    return [4 /*yield*/, toolbarMenu.isMenuItemDisabled(disabledMenu.title)];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toEqual('true', disabledMenu.title + " is not disabled");
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=ext-header.test.js.map