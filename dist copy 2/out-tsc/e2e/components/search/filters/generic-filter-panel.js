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
import { by, browser } from 'protractor';
var GenericFilterPanel = /** @class */ (function () {
    function GenericFilterPanel(filterName) {
        this.selectors = {
            root: 'adf-search-filter',
            panel: '.mat-expansion-panel',
            panelExpanded: '.mat-expansion-panel.mat-expanded',
            panelHeader: '.mat-expansion-panel-header'
        };
        this.filterName = filterName;
    }
    Object.defineProperty(GenericFilterPanel.prototype, "panel", {
        get: function () { return browser.element(by.cssContainingText(this.selectors.panel, this.filterName)); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GenericFilterPanel.prototype, "panelExpanded", {
        get: function () { return browser.element(by.cssContainingText(this.selectors.panelExpanded, this.filterName)); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GenericFilterPanel.prototype, "panelHeader", {
        get: function () { return this.panel.element(by.css(this.selectors.panelHeader)); },
        enumerable: true,
        configurable: true
    });
    GenericFilterPanel.prototype.clickPanelHeader = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.panelHeader.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GenericFilterPanel.prototype.isPanelDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, browser.isElementPresent(this.panel)];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.panel.isDisplayed()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    GenericFilterPanel.prototype.isPanelExpanded = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.panelExpanded.isPresent()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.panelExpanded.isDisplayed()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    GenericFilterPanel.prototype.expandPanel = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isPanelExpanded()];
                    case 1:
                        if (!!(_a.sent())) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.clickPanelHeader()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GenericFilterPanel.prototype.collapsePanel = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isPanelExpanded()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.clickPanelHeader()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return GenericFilterPanel;
}());
export { GenericFilterPanel };
//# sourceMappingURL=generic-filter-panel.js.map