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
import * as moment from 'moment';
var DateTimePicker = /** @class */ (function (_super) {
    tslib_1.__extends(DateTimePicker, _super);
    function DateTimePicker(ancestor) {
        var _this = _super.call(this, DateTimePicker.selectors.root, ancestor) || this;
        _this.calendar = browser.element(by.css(DateTimePicker.selectors.root));
        _this.headerDate = _this.component.element(by.css(DateTimePicker.selectors.date));
        _this.headerYear = _this.component.element(by.css(DateTimePicker.selectors.year));
        _this.dayPicker = _this.component.element(by.css(DateTimePicker.selectors.dayPicker));
        _this.rootElemLocator = by.css(DateTimePicker.selectors.root);
        return _this;
    }
    DateTimePicker.prototype.waitForDateTimePickerToOpen = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.presenceOf(this.calendar), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DateTimePicker.prototype.waitForDateTimePickerToClose = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.stalenessOf(this.calendar), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DateTimePicker.prototype.isCalendarOpen = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, browser.element(this.rootElemLocator).isPresent()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, browser.element(this.rootElemLocator).isDisplayed()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    DateTimePicker.prototype.getDate = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.headerDate.getText()];
            });
        });
    };
    DateTimePicker.prototype.getYear = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.headerYear.getText()];
            });
        });
    };
    DateTimePicker.prototype.setDefaultDay = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var today, tomorrow, dayOfTomorrow, date, year, elem;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        today = moment();
                        tomorrow = today.add(1, 'day');
                        dayOfTomorrow = tomorrow.date();
                        return [4 /*yield*/, this.getDate()];
                    case 1:
                        date = _a.sent();
                        return [4 /*yield*/, this.getYear()];
                    case 2:
                        year = _a.sent();
                        elem = this.dayPicker.element(by.cssContainingText(DateTimePicker.selectors.firstActiveDay, "" + dayOfTomorrow));
                        return [4 /*yield*/, elem.click()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, date + " " + year];
                }
            });
        });
    };
    DateTimePicker.selectors = {
        root: '.mat-datetimepicker-popup',
        header: '.mat-datetimepicker-calendar-header',
        year: '.mat-datetimepicker-calendar-header-year',
        date: '.mat-datetimepicker-calendar-header-date',
        content: '.mat-datetimepicker-calendar-content',
        dayPicker: 'mat-datetimepicker-month-view',
        today: '.mat-datetimepicker-calendar-body-today',
        firstActiveDay: '.mat-datetimepicker-calendar-body-active .mat-datetimepicker-calendar-body-cell-content',
    };
    return DateTimePicker;
}(Component));
export { DateTimePicker };
//# sourceMappingURL=datetime-picker.js.map