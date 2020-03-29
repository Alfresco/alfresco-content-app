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
import { by, browser, until } from 'protractor';
import { Component } from '../component';
import { UserInfo } from './user-info';
import { Menu } from '../menu/menu';
import { Toolbar } from './../toolbar/toolbar';
import { SearchInput } from '../search/search-input';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
var Header = /** @class */ (function (_super) {
    tslib_1.__extends(Header, _super);
    function Header(ancestor) {
        var _this = _super.call(this, 'adf-layout-header', ancestor) || this;
        _this.logoLink = _this.component.element(Header.selectors.logoLink);
        _this.moreActions = browser.element(Header.selectors.moreActions);
        _this.sidenavToggle = _this.component.element(by.css(Header.selectors.sidenavToggle));
        _this.userInfo = new UserInfo();
        _this.menu = new Menu();
        _this.toolbar = new Toolbar();
        _this.searchInput = new SearchInput();
        return _this;
    }
    Header.prototype.openMoreMenu = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.moreActions.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.menu.waitForMenuToOpen()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Header.prototype.isSignOutDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.userInfo.menu.isMenuItemPresent('Sign out')];
            });
        });
    };
    Header.prototype.clickSidenavToggle = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sidenavToggle.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Header.prototype.isSidenavExpanded = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(Header.selectors.expandedSidenav)];
            });
        });
    };
    Header.prototype.expandSideNav = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var expanded;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isSidenavExpanded()];
                    case 1:
                        expanded = _a.sent();
                        if (!!expanded) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.clickSidenavToggle()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, browser.wait(until.elementLocated(Header.selectors.expandedSidenav), BROWSER_WAIT_TIMEOUT, '--- timeout waiting for expanded sidenav')];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Header.prototype.collapseSideNav = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var expanded;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isSidenavExpanded()];
                    case 1:
                        expanded = _a.sent();
                        if (!expanded) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.clickSidenavToggle()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, browser.wait(until.elementLocated(Header.selectors.collapsedSidenav), BROWSER_WAIT_TIMEOUT, '--- timeout waiting for collapsed sidenav')];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Header.selectors = {
        root: 'app-header',
        logoLink: by.css('.app-menu__title'),
        userInfo: by.css('aca-current-user'),
        moreActions: by.id('app.header.more'),
        sidenavToggle: "[id='adf-sidebar-toggle-start']",
        expandedSidenav: by.css("[data-automation-id='expanded']"),
        collapsedSidenav: by.css("[data-automation-id='collapsed']")
    };
    return Header;
}(Component));
export { Header };
//# sourceMappingURL=header.js.map