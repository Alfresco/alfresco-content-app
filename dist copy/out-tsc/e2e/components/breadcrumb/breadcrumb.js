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
import { Component } from '../component';
var Breadcrumb = /** @class */ (function (_super) {
    tslib_1.__extends(Breadcrumb, _super);
    function Breadcrumb(ancestor) {
        var _this = _super.call(this, Breadcrumb.selectors.root, ancestor) || this;
        _this.items = _this.component.all(by.css(Breadcrumb.selectors.item));
        _this.currentItem = _this.component.element(by.css(Breadcrumb.selectors.currentItem));
        return _this;
    }
    Breadcrumb.prototype.getNthItem = function (nth) {
        return this.items.get(nth - 1);
    };
    Breadcrumb.prototype.getItemsCount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.items.count()];
            });
        });
    };
    Breadcrumb.prototype.getAllItems = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.items.map(function (elem) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var str;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, elem.getText()];
                                    case 1:
                                        str = _a.sent();
                                        return [2 /*return*/, str.split('\nchevron_right')[0]];
                                }
                            });
                        }); })];
                    case 1:
                        items = _a.sent();
                        return [2 /*return*/, items];
                }
            });
        });
    };
    Breadcrumb.prototype.getCurrentItem = function () {
        return this.currentItem;
    };
    Breadcrumb.prototype.getCurrentItemName = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.currentItem.getText()];
            });
        });
    };
    Breadcrumb.prototype.clickItem = function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var elem;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        elem = this.component.element(by.css(Breadcrumb.selectors.item + "[title=" + name + "]"));
                        return [4 /*yield*/, elem.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Breadcrumb.prototype.getNthItemTooltip = function (nth) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getNthItem(nth).getAttribute('title')];
            });
        });
    };
    Breadcrumb.selectors = {
        root: 'adf-breadcrumb',
        item: '.adf-breadcrumb-item',
        currentItem: '.adf-breadcrumb-item-current'
    };
    return Breadcrumb;
}(Component));
export { Breadcrumb };
//# sourceMappingURL=breadcrumb.js.map