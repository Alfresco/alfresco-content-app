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
import { Menu } from '../menu/menu';
import { Component } from '../component';
var Pagination = /** @class */ (function (_super) {
    tslib_1.__extends(Pagination, _super);
    function Pagination(ancestor) {
        var _this = _super.call(this, Pagination.selectors.root, ancestor) || this;
        _this.range = _this.component.element(by.css(Pagination.selectors.range));
        _this.maxItems = _this.component.element(by.css(Pagination.selectors.maxItems));
        _this.currentPage = _this.component.element(by.css(Pagination.selectors.currentPage));
        _this.totalPages = _this.component.element(by.css(Pagination.selectors.totalPages));
        _this.previousButton = _this.component.element(by.css(Pagination.selectors.previousButton));
        _this.nextButton = _this.component.element(by.css(Pagination.selectors.nextButton));
        _this.maxItemsButton = _this.component.element(by.css(Pagination.selectors.maxItemsButton));
        _this.pagesButton = _this.component.element(by.css(Pagination.selectors.pagesButton));
        _this.menu = new Menu();
        return _this;
    }
    Pagination.prototype.openMaxItemsMenu = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, menu, maxItemsButton, error_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, menu = _a.menu, maxItemsButton = _a.maxItemsButton;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, browser.wait(EC.elementToBeClickable(maxItemsButton), BROWSER_WAIT_TIMEOUT, 'timeout waiting for maxItemsButton to be clickable')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, maxItemsButton.click()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, menu.waitForMenuToOpen()];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _b.sent();
                        console.log('____ open max items catch ___', error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Pagination.prototype.openCurrentPageMenu = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, menu, pagesButton, error_2;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, menu = _a.menu, pagesButton = _a.pagesButton;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, browser.wait(EC.elementToBeClickable(pagesButton), BROWSER_WAIT_TIMEOUT, 'timeout waiting for pagesButton to be clickable')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, pagesButton.click()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, menu.waitForMenuToOpen()];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _b.sent();
                        console.log('____ open current page menu ___', error_2);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Pagination.prototype.resetToDefaultPageSize = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.openMaxItemsMenu()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.menu.clickNthItem(1)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.menu.waitForMenuToClose()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        console.log('___ reset to default page size catch ___', error_3);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Pagination.prototype.resetToDefaultPageNumber = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.openCurrentPageMenu()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.menu.clickNthItem(1)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.menu.waitForMenuToClose()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_4 = _a.sent();
                        console.log('____ reset to default page number catch ___', error_4);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Pagination.prototype.clickNext = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nextButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Pagination.prototype.clickPrevious = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.previousButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Pagination.prototype.isNextEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.nextButton.isEnabled()];
            });
        });
    };
    Pagination.prototype.isPreviousEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.previousButton.isEnabled()];
            });
        });
    };
    Pagination.prototype.isPagesButtonPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.pagesButton)];
            });
        });
    };
    Pagination.prototype.isRangePresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.range.isPresent()];
            });
        });
    };
    Pagination.prototype.isMaxItemsPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.maxItems.isPresent()];
            });
        });
    };
    Pagination.prototype.isCurrentPagePresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.currentPage.isPresent()];
            });
        });
    };
    Pagination.prototype.isTotalPagesPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.totalPages.isPresent()];
            });
        });
    };
    Pagination.prototype.isPreviousButtonPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.previousButton.isPresent()];
            });
        });
    };
    Pagination.prototype.isNextButtonPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.nextButton.isPresent()];
            });
        });
    };
    Pagination.prototype.getCurrentPage = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.currentPage.getText()];
            });
        });
    };
    Pagination.prototype.getRange = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.range.getText()];
            });
        });
    };
    Pagination.prototype.getMaxItems = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.maxItems.getText()];
            });
        });
    };
    Pagination.prototype.getTotalPages = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.totalPages.getText()];
            });
        });
    };
    Pagination.selectors = {
        root: 'adf-pagination',
        range: '.adf-pagination__range',
        maxItems: '.adf-pagination__max-items',
        currentPage: '.adf-pagination__current-page',
        totalPages: '.adf-pagination__total-pages',
        previousButton: '.adf-pagination__previous-button',
        nextButton: '.adf-pagination__next-button',
        maxItemsButton: '.adf-pagination__max-items + button[mat-icon-button]',
        pagesButton: '.adf-pagination__current-page + button[mat-icon-button]'
    };
    return Pagination;
}(Component));
export { Pagination };
//# sourceMappingURL=pagination.js.map