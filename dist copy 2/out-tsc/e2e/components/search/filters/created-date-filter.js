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
import { by, protractor } from 'protractor';
import { GenericFilterPanel } from './generic-filter-panel';
import { Utils } from '../../../utilities/utils';
var CreatedDateFilter = /** @class */ (function (_super) {
    tslib_1.__extends(CreatedDateFilter, _super);
    function CreatedDateFilter() {
        var _this = _super.call(this, 'Created date') || this;
        _this.fromField = _this.panelExpanded.element(by.cssContainingText('.adf-search-date-range .mat-form-field', 'From'));
        _this.fromInput = _this.fromField.element(by.css("[data-automation-id='date-range-from-input']"));
        _this.fromFieldError = _this.fromField.element(by.css("[data-automation-id='date-range-from-error']"));
        _this.toField = _this.panelExpanded.element(by.cssContainingText('.adf-search-date-range .mat-form-field', 'To'));
        _this.toInput = _this.toField.element(by.css("[data-automation-id='date-range-to-input']"));
        _this.toFieldError = _this.toField.element(by.css("[data-automation-id='date-range-to-error']"));
        _this.clearButton = _this.panel.element(by.css('.adf-facet-buttons [data-automation-id="date-range-clear-btn"]'));
        _this.applyButton = _this.panel.element(by.css('.adf-facet-buttons [data-automation-id="date-range-apply-btn"]'));
        return _this;
    }
    CreatedDateFilter.prototype.isFromFieldDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fromField.isPresent()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.fromField.isDisplayed()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    CreatedDateFilter.prototype.isFromErrorDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fromFieldError.isPresent()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.fromFieldError.isDisplayed()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    CreatedDateFilter.prototype.isToFieldDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.toField.isPresent()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.toField.isDisplayed()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    CreatedDateFilter.prototype.isToErrorDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.toFieldError.isPresent()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.toFieldError.isDisplayed()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    CreatedDateFilter.prototype.isClearButtonEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clearButton.isEnabled()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreatedDateFilter.prototype.isApplyButtonEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.applyButton.isEnabled()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreatedDateFilter.prototype.clickClearButton = function () {
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
    CreatedDateFilter.prototype.clickApplyButton = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isApplyButtonEnabled()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.applyButton.click()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreatedDateFilter.prototype.getFromValue = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var value, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.fromInput.getAttribute('value')];
                    case 1:
                        value = _a.sent();
                        return [2 /*return*/, value];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, ''];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreatedDateFilter.prototype.getFromError = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.fromFieldError.getText()];
                    case 1:
                        error = _a.sent();
                        return [2 /*return*/, error];
                    case 2:
                        err_1 = _a.sent();
                        return [2 /*return*/, ''];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreatedDateFilter.prototype.getToValue = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var value, err_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.toInput.getAttribute('value')];
                    case 1:
                        value = _a.sent();
                        return [2 /*return*/, value];
                    case 2:
                        err_2 = _a.sent();
                        return [2 /*return*/, ''];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreatedDateFilter.prototype.getToError = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error, err_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.toFieldError.getText()];
                    case 1:
                        error = _a.sent();
                        return [2 /*return*/, error];
                    case 2:
                        err_3 = _a.sent();
                        return [2 /*return*/, ''];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreatedDateFilter.prototype.resetPanel = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var fromValue, toValue;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFromValue()];
                    case 1:
                        fromValue = _a.sent();
                        return [4 /*yield*/, this.getToValue()];
                    case 2:
                        toValue = _a.sent();
                        if (!(fromValue.length > 0 || toValue.length > 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.expandPanel()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.clickClearButton()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.collapsePanel()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    CreatedDateFilter.prototype.enterFromDate = function (date) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.expandPanel()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Utils.clearFieldWithBackspace(this.fromInput)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.fromInput.sendKeys(date, protractor.Key.TAB)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreatedDateFilter.prototype.enterToDate = function (date) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.expandPanel()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Utils.clearFieldWithBackspace(this.toInput)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.toInput.sendKeys(date, protractor.Key.TAB)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return CreatedDateFilter;
}(GenericFilterPanel));
export { CreatedDateFilter };
//# sourceMappingURL=created-date-filter.js.map