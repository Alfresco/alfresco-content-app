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
import { by, element, browser } from 'protractor';
import { SIDEBAR_LABELS, BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Menu } from '../menu/menu';
import { Component } from '../component';
import { Utils } from '../../utilities/utils';
var Sidenav = /** @class */ (function (_super) {
    tslib_1.__extends(Sidenav, _super);
    function Sidenav(ancestor) {
        var _this = _super.call(this, Sidenav.selectors.root, ancestor) || this;
        _this.links = _this.component.all(by.css(Sidenav.selectors.link));
        _this.activeLink = _this.component.element(by.css(Sidenav.selectors.activeClass));
        _this.newButton = _this.component.all(by.css(Sidenav.selectors.newButton));
        _this.personalFiles = _this.component.element(by.css(Sidenav.selectors.personalFiles));
        _this.fileLibraries = _this.component.element(by.css(Sidenav.selectors.fileLibraries));
        _this.myLibraries = browser.element(by.css(Sidenav.selectors.myLibraries));
        _this.favoriteLibraries = browser.element(by.css(Sidenav.selectors.favoriteLibraries));
        _this.shared = _this.component.element(by.css(Sidenav.selectors.shared));
        _this.recentFiles = _this.component.element(by.css(Sidenav.selectors.recentFiles));
        _this.favorites = _this.component.element(by.css(Sidenav.selectors.favorites));
        _this.trash = _this.component.element(by.css(Sidenav.selectors.trash));
        _this.menu = new Menu();
        return _this;
    }
    Sidenav.prototype.expandMenu = function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var link, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, element(by.cssContainingText('.mat-expanded', name)).isPresent()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 2];
                        return [2 /*return*/, Promise.resolve()];
                    case 2:
                        link = this.getLink(name);
                        return [4 /*yield*/, Utils.waitUntilElementClickable(link)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, link.click()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, element(by.css(Sidenav.selectors.expansion_panel_content)).isPresent()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        e_1 = _a.sent();
                        console.log('---- sidebar navigation catch expandMenu: ', e_1);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Sidenav.prototype.openNewMenu = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.newButton.click()];
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
    Sidenav.prototype.openCreateFolderDialog = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openNewMenu()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.menu.clickCreateFolder()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Sidenav.prototype.openCreateLibraryDialog = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openNewMenu()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.menu.clickCreateLibrary()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Sidenav.prototype.openCreateFileFromTemplateDialog = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openNewMenu()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.menu.clickCreateFileFromTemplate()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Sidenav.prototype.openCreateFolderFromTemplateDialog = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openNewMenu()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.menu.clickCreateFolderFromTemplate()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Sidenav.prototype.isActive = function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getLinkLabel(name).getAttribute('class')];
                    case 1: return [2 /*return*/, (_a.sent()).includes(Sidenav.selectors.activeClassName)];
                }
            });
        });
    };
    Sidenav.prototype.childIsActive = function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var childClass;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getLinkLabel(name).element(by.css('span')).getAttribute('class')];
                    case 1:
                        childClass = _a.sent();
                        return [2 /*return*/, childClass.includes(Sidenav.selectors.activeChild)];
                }
            });
        });
    };
    Sidenav.prototype.getLink = function (name) {
        return this.getLinkLabel(name).element(by.xpath('..'));
    };
    Sidenav.prototype.getLinkLabel = function (name) {
        switch (name) {
            case 'Personal Files': return this.personalFiles;
            case 'File Libraries': return this.fileLibraries;
            case 'My Libraries': return this.myLibraries;
            case 'Favorite Libraries': return this.favoriteLibraries;
            case 'Shared': return this.shared;
            case 'Recent Files': return this.recentFiles;
            case 'Favorites': return this.favorites;
            case 'Trash': return this.trash;
            default: return this.personalFiles;
        }
    };
    Sidenav.prototype.getActiveLink = function () {
        return this.activeLink;
    };
    Sidenav.prototype.getLinkTooltip = function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var link, condition;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        link = this.getLinkLabel(name);
                        condition = function () { return link.getAttribute('title').then(function (value) { return value && value.length > 0; }); };
                        return [4 /*yield*/, browser.actions().mouseMove(link).perform()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser.wait(condition, BROWSER_WAIT_TIMEOUT)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, link.getAttribute('title')];
                }
            });
        });
    };
    Sidenav.prototype.clickLink = function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var link, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        link = this.getLinkLabel(name);
                        return [4 /*yield*/, Utils.waitUntilElementClickable(link)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, link.click()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.log('---- sidebar navigation clickLink catch error: ', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Sidenav.prototype.isFileLibrariesMenuExpanded = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, element(by.cssContainingText('.mat-expanded', SIDEBAR_LABELS.FILE_LIBRARIES)).isPresent()];
            });
        });
    };
    Sidenav.prototype.expandFileLibraries = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.expandMenu(SIDEBAR_LABELS.FILE_LIBRARIES)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Sidenav.selectors = {
        root: 'app-sidenav',
        link: '.item',
        label: '.action-button__label',
        expansion_panel: ".mat-expansion-panel-header",
        expansion_panel_content: ".mat-expansion-panel-body",
        active: 'mat-accent',
        activeClass: '.action-button--active',
        activeClassName: 'action-button--active',
        activeChild: 'action-button--active',
        newButton: '[data-automation-id="create-button"]',
        personalFiles: "[data-automation-id='app.navbar.personalFiles']",
        fileLibraries: "[data-automation-id='app.navbar.libraries.menu']",
        myLibraries: "[data-automation-id='app.navbar.libraries.files']",
        favoriteLibraries: "[data-automation-id='app.navbar.libraries.favorite']",
        shared: "[data-automation-id='app.navbar.shared']",
        recentFiles: "[data-automation-id='app.navbar.recentFiles']",
        favorites: "[data-automation-id='app.navbar.favorites']",
        trash: "[data-automation-id='app.navbar.trashcan']"
    };
    return Sidenav;
}(Component));
export { Sidenav };
//# sourceMappingURL=sidenav.js.map