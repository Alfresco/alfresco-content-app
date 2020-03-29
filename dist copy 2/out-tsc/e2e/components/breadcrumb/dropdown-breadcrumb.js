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
import { by, browser, ExpectedConditions as EC } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';
var DropDownBreadcrumb = /** @class */ (function (_super) {
    tslib_1.__extends(DropDownBreadcrumb, _super);
    function DropDownBreadcrumb(ancestor) {
        var _this = _super.call(this, DropDownBreadcrumb.selectors.root, ancestor) || this;
        _this.trigger = _this.component.element(by.css(DropDownBreadcrumb.selectors.trigger));
        _this.pathItems = browser.$$(DropDownBreadcrumb.selectors.pathOption);
        _this.pathItemsContainer = browser.element(by.css('.mat-select-panel'));
        _this.currentFolder = _this.component.element(by.css(DropDownBreadcrumb.selectors.currentFolder));
        return _this;
    }
    DropDownBreadcrumb.prototype.waitForPathListDropdownToOpen = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.presenceOf(this.pathItemsContainer), BROWSER_WAIT_TIMEOUT, 'Timeout waiting for breadcrumb dropdown to open')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DropDownBreadcrumb.prototype.waitForPathListDropdownToClose = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.stalenessOf(browser.$(DropDownBreadcrumb.selectors.pathOption)), BROWSER_WAIT_TIMEOUT, 'Timeout waiting for breadcrumb dropdown to close')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DropDownBreadcrumb.prototype.getCurrentFolderName = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.currentFolder.getText()];
            });
        });
    };
    DropDownBreadcrumb.prototype.openPath = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.trigger.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.waitForPathListDropdownToOpen()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DropDownBreadcrumb.prototype.clickPathItem = function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var elem;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        elem = browser.element(by.cssContainingText(DropDownBreadcrumb.selectors.pathOption, name));
                        return [4 /*yield*/, elem.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DropDownBreadcrumb.prototype.getPathItems = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pathItems.map(function (elem) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                return [2 /*return*/, elem.getText()];
                            });
                        }); })];
                    case 1:
                        items = _a.sent();
                        return [2 /*return*/, items];
                }
            });
        });
    };
    DropDownBreadcrumb.selectors = {
        root: '.adf-dropdown-breadcrumb',
        trigger: '.adf-dropdown-breadcrumb-trigger',
        currentFolder: '.adf-current-folder',
        pathOption: '.adf-dropdown-breadcrumb-path-option .mat-option-text'
    };
    return DropDownBreadcrumb;
}(Component));
export { DropDownBreadcrumb };
//# sourceMappingURL=dropdown-breadcrumb.js.map