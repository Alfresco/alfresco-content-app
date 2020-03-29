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
var SearchSortingPicker = /** @class */ (function (_super) {
    tslib_1.__extends(SearchSortingPicker, _super);
    function SearchSortingPicker(ancestor) {
        var _this = _super.call(this, SearchSortingPicker.selectors.root, ancestor) || this;
        _this.sortOrderButton = _this.component.element(by.css('button[mat-icon-button]'));
        _this.sortByDropdownCollapsed = _this.component.element(by.css('.mat-select'));
        _this.sortByDropdownExpanded = browser.element(by.css('.mat-select-panel'));
        _this.sortByList = _this.sortByDropdownExpanded.all(by.css(SearchSortingPicker.selectors.sortByOption));
        return _this;
    }
    SearchSortingPicker.prototype.waitForSortByDropdownToExpand = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.visibilityOf(this.sortByDropdownExpanded), BROWSER_WAIT_TIMEOUT, 'Timeout waiting for sortBy dropdown to expand')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPicker.prototype.isSortOrderButtonDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.sortOrderButton.isPresent()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sortOrderButton.isDisplayed()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    SearchSortingPicker.prototype.getSortOrder = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var orderArrow;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sortOrderButton.getText()];
                    case 1:
                        orderArrow = _a.sent();
                        if (orderArrow.includes('upward')) {
                            return [2 /*return*/, 'ASC'];
                        }
                        else if (orderArrow.includes('downward')) {
                            return [2 /*return*/, 'DESC'];
                        }
                        else {
                            return [2 /*return*/, ''];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPicker.prototype.isSortByOptionDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.sortByDropdownCollapsed.isPresent()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sortByDropdownCollapsed.isDisplayed()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    SearchSortingPicker.prototype.isSortByDropdownExpanded = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.sortByDropdownExpanded.isPresent()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sortByDropdownExpanded.isDisplayed()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    SearchSortingPicker.prototype.getSelectedSortByOption = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sortByDropdownCollapsed.getText()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SearchSortingPicker.prototype.clickSortByDropdown = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sortByDropdownCollapsed.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.waitForSortByDropdownToExpand()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPicker.prototype.getSortByOptionsList = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var list;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sortByList.map(function (option) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                return [2 /*return*/, option.getText()];
                            });
                        }); })];
                    case 1:
                        list = _a.sent();
                        return [2 /*return*/, list];
                }
            });
        });
    };
    SearchSortingPicker.prototype.sortByOption = function (option) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var elem;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isSortByDropdownExpanded()];
                    case 1:
                        if (!!(_a.sent())) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.clickSortByDropdown()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        elem = browser.element(by.cssContainingText(SearchSortingPicker.selectors.sortByOption, option));
                        return [4 /*yield*/, elem.click()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPicker.prototype.sortByName = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sortByOption('Filename')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPicker.prototype.sortByRelevance = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sortByOption('Relevance')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPicker.prototype.sortByTitle = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sortByOption('Title')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPicker.prototype.sortByModifiedDate = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sortByOption('Modified date')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPicker.prototype.sortByModifier = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sortByOption('Modifier')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPicker.prototype.sortByCreatedDate = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sortByOption('Created date')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPicker.prototype.sortBySize = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sortByOption('Size')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPicker.prototype.sortByType = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sortByOption('Type')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPicker.prototype.setSortOrderASC = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSortOrder()];
                    case 1:
                        if (!((_a.sent()) !== 'ASC')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sortOrderButton.click()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPicker.prototype.setSortOrderDESC = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSortOrder()];
                    case 1:
                        if (!((_a.sent()) !== 'DESC')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sortOrderButton.click()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPicker.selectors = {
        root: 'adf-search-sorting-picker',
        sortByOption: '.mat-option .mat-option-text'
    };
    return SearchSortingPicker;
}(Component));
export { SearchSortingPicker };
//# sourceMappingURL=search-sorting-picker.js.map