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
import { GenericFilterPanel } from './generic-filter-panel';
var SizeFilter = /** @class */ (function (_super) {
    tslib_1.__extends(SizeFilter, _super);
    function SizeFilter() {
        var _this = _super.call(this, 'Size') || this;
        _this.facets = _this.panelExpanded.all(by.css('.mat-checkbox'));
        _this.selectedFacets = _this.panel.all(by.css('.mat-checkbox.mat-checkbox-checked'));
        _this.clearButton = _this.panel.element(by.cssContainingText('.adf-facet-buttons button', 'Clear all'));
        return _this;
    }
    SizeFilter.prototype.getFiltersValues = function () {
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
    SizeFilter.prototype.getFiltersCheckedValues = function () {
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
    SizeFilter.prototype.resetPanel = function () {
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
                    case 4: return [4 /*yield*/, this.collapsePanel()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SizeFilter.prototype.isClearButtonEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clearButton.isEnabled()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SizeFilter.prototype.clickClearButton = function () {
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
    SizeFilter.prototype.checkSizeSmall = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var small;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        small = this.facets.filter(function (elem) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, elem.getText()];
                                case 1: return [2 /*return*/, (_a.sent()) === 'Small'];
                            }
                        }); }); }).first();
                        return [4 /*yield*/, small.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SizeFilter.prototype.checkSizeMedium = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var medium;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        medium = this.facets.filter(function (elem) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, elem.getText()];
                                case 1: return [2 /*return*/, (_a.sent()) === 'Medium'];
                            }
                        }); }); }).first();
                        return [4 /*yield*/, medium.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SizeFilter.prototype.checkSizeLarge = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var large;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        large = this.facets.filter(function (elem) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, elem.getText()];
                                case 1: return [2 /*return*/, (_a.sent()) === 'Large'];
                            }
                        }); }); }).first();
                        return [4 /*yield*/, large.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SizeFilter.prototype.checkSizeHuge = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var huge;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        huge = this.facets.filter(function (elem) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, elem.getText()];
                                case 1: return [2 /*return*/, (_a.sent()) === 'Huge'];
                            }
                        }); }); }).first();
                        return [4 /*yield*/, huge.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return SizeFilter;
}(GenericFilterPanel));
export { SizeFilter };
//# sourceMappingURL=size-filter.js.map