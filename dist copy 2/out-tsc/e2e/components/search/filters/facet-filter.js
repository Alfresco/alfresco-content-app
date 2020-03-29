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
import { GenericFilterPanel } from './generic-filter-panel';
var FacetFilter = /** @class */ (function (_super) {
    tslib_1.__extends(FacetFilter, _super);
    function FacetFilter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.locators = {
            checkbox: '.mat-checkbox',
            checkboxChecked: '.mat-checkbox.mat-checkbox-checked',
            button: '.adf-facet-buttons button',
            categoryInput: 'input[placeholder="Filter category"',
            facetsFilter: '.adf-facet-result-filter'
        };
        return _this;
    }
    Object.defineProperty(FacetFilter.prototype, "facets", {
        get: function () { return this.panelExpanded.all(by.css(this.locators.checkbox)); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FacetFilter.prototype, "selectedFacets", {
        get: function () { return this.panel.all(by.css(this.locators.checkboxChecked)); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FacetFilter.prototype, "clearButton", {
        get: function () { return this.panel.element(by.cssContainingText(this.locators.button, 'Clear all')); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FacetFilter.prototype, "facetsFilter", {
        get: function () { return this.panelExpanded.element(by.css(this.locators.facetsFilter)); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FacetFilter.prototype, "filterCategoryInput", {
        get: function () { return this.facetsFilter.element(by.css(this.locators.categoryInput)); },
        enumerable: true,
        configurable: true
    });
    FacetFilter.prototype.getFiltersValues = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var list;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.facets.map(function (option) {
                            return option.getText();
                        })];
                    case 1:
                        list = _a.sent();
                        return [2 /*return*/, list];
                }
            });
        });
    };
    FacetFilter.prototype.getFiltersCheckedValues = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var list;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.selectedFacets.map(function (option) {
                            return option.getText();
                        })];
                    case 1:
                        list = _a.sent();
                        return [2 /*return*/, list];
                }
            });
        });
    };
    FacetFilter.prototype.resetPanel = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.selectedFacets.count()];
                    case 1:
                        if (!((_a.sent()) > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.expandPanel()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.selectedFacets.each(function (elem) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, elem.click()];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.expandPanel()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FacetFilter.prototype.isFilterFacetsDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.facetsFilter.isDisplayed()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FacetFilter.prototype.isClearButtonEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clearButton.isEnabled()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FacetFilter.prototype.clickClearButton = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isClearButtonEnabled()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.clearButton.click()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FacetFilter.prototype.isFilterCategoryInputDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.filterCategoryInput.isDisplayed()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FacetFilter.prototype.checkCategory = function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var option;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        option = this.facets.filter(function (elem) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, elem.getText()];
                                case 1: return [2 /*return*/, (_a.sent()).includes(name)];
                            }
                        }); }); }).first();
                        return [4 /*yield*/, browser.executeScript("arguments[0].scrollIntoView();", option)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser.actions().mouseMove(option).perform()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, browser.actions().click().perform()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FacetFilter.prototype.filterCategoriesBy = function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.filterCategoryInput.sendKeys(name)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return FacetFilter;
}(GenericFilterPanel));
export { FacetFilter };
//# sourceMappingURL=facet-filter.js.map