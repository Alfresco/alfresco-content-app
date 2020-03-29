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
import * as tslib_1 from "tslib";
import { by } from 'protractor';
import { Menu } from '../menu/menu';
import { Component } from '../component';
var UserInfo = /** @class */ (function (_super) {
    tslib_1.__extends(UserInfo, _super);
    function UserInfo(ancestor) {
        var _this = _super.call(this, 'aca-current-user', ancestor) || this;
        _this.fullName = _this.component.element(UserInfo.selectors.fullName);
        _this.avatar = _this.component.element(UserInfo.selectors.avatar);
        _this.menu = new Menu();
        return _this;
    }
    UserInfo.prototype.openMenu = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, menu, avatar;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, menu = _a.menu, avatar = _a.avatar;
                        return [4 /*yield*/, avatar.click()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, menu.wait()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, menu];
                }
            });
        });
    };
    UserInfo.prototype.getName = function () {
        return this.fullName.getText();
    };
    UserInfo.prototype.signOut = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var menu;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openMenu()];
                    case 1:
                        menu = _a.sent();
                        return [4 /*yield*/, menu.clickMenuItem('Sign out')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserInfo.selectors = {
        avatar: by.css('.current-user__avatar'),
        fullName: by.css('.current-user__full-name'),
        menuItems: by.css('[mat-menu-item]')
    };
    return UserInfo;
}(Component));
export { UserInfo };
//# sourceMappingURL=user-info.js.map