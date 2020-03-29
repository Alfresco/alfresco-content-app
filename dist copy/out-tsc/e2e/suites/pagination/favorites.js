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
import { BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
export function favoritesTests() {
    var _this = this;
    var page = new BrowsingPage();
    var dataTable = page.dataTable, pagination = page.pagination;
    describe('Pagination controls : ', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickFavoritesAndWait()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Pagination control default values - [C280113]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, pagination.getRange()];
                    case 1:
                        _a.apply(void 0, [_g.sent()]).toContain('1-25 of 101');
                        _b = expect;
                        return [4 /*yield*/, pagination.getMaxItems()];
                    case 2:
                        _b.apply(void 0, [_g.sent()]).toContain('25');
                        _c = expect;
                        return [4 /*yield*/, pagination.getCurrentPage()];
                    case 3:
                        _c.apply(void 0, [_g.sent()]).toContain('Page 1');
                        _d = expect;
                        return [4 /*yield*/, pagination.getTotalPages()];
                    case 4:
                        _d.apply(void 0, [_g.sent()]).toContain('of 5');
                        _e = expect;
                        return [4 /*yield*/, pagination.isPreviousEnabled()];
                    case 5:
                        _e.apply(void 0, [_g.sent()]).toBe(false, 'Previous button is enabled');
                        _f = expect;
                        return [4 /*yield*/, pagination.isNextEnabled()];
                    case 6:
                        _f.apply(void 0, [_g.sent()]).toBe(true, 'Next button is not enabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Items per page values - [C280114]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, pagination.openMaxItemsMenu()];
                    case 1:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, pagination.menu.getNthItem(1).getText()];
                    case 2:
                        _a.apply(void 0, [_d.sent()]).toBe('25');
                        _b = expect;
                        return [4 /*yield*/, pagination.menu.getNthItem(2).getText()];
                    case 3:
                        _b.apply(void 0, [_d.sent()]).toBe('50');
                        _c = expect;
                        return [4 /*yield*/, pagination.menu.getNthItem(3).getText()];
                    case 4:
                        _c.apply(void 0, [_d.sent()]).toBe('100');
                        return [4 /*yield*/, pagination.menu.closeMenu()];
                    case 5:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('current page menu items - [C280115]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return tslib_1.__generator(this, function (_k) {
                switch (_k.label) {
                    case 0: return [4 /*yield*/, pagination.openMaxItemsMenu()];
                    case 1:
                        _k.sent();
                        return [4 /*yield*/, pagination.menu.clickMenuItem('25')];
                    case 2:
                        _k.sent();
                        _a = expect;
                        return [4 /*yield*/, pagination.getMaxItems()];
                    case 3:
                        _a.apply(void 0, [_k.sent()]).toContain('25');
                        _b = expect;
                        return [4 /*yield*/, pagination.getTotalPages()];
                    case 4:
                        _b.apply(void 0, [_k.sent()]).toContain('of 5');
                        return [4 /*yield*/, pagination.openCurrentPageMenu()];
                    case 5:
                        _k.sent();
                        _c = expect;
                        return [4 /*yield*/, pagination.menu.getItemsCount()];
                    case 6:
                        _c.apply(void 0, [_k.sent()]).toBe(5);
                        return [4 /*yield*/, pagination.menu.closeMenu()];
                    case 7:
                        _k.sent();
                        return [4 /*yield*/, pagination.openMaxItemsMenu()];
                    case 8:
                        _k.sent();
                        return [4 /*yield*/, pagination.menu.clickMenuItem('50')];
                    case 9:
                        _k.sent();
                        _d = expect;
                        return [4 /*yield*/, pagination.getMaxItems()];
                    case 10:
                        _d.apply(void 0, [_k.sent()]).toContain('50');
                        _e = expect;
                        return [4 /*yield*/, pagination.getTotalPages()];
                    case 11:
                        _e.apply(void 0, [_k.sent()]).toContain('of 3');
                        return [4 /*yield*/, pagination.openCurrentPageMenu()];
                    case 12:
                        _k.sent();
                        _f = expect;
                        return [4 /*yield*/, pagination.menu.getItemsCount()];
                    case 13:
                        _f.apply(void 0, [_k.sent()]).toBe(3);
                        return [4 /*yield*/, pagination.menu.closeMenu()];
                    case 14:
                        _k.sent();
                        return [4 /*yield*/, pagination.openMaxItemsMenu()];
                    case 15:
                        _k.sent();
                        return [4 /*yield*/, pagination.menu.clickMenuItem('100')];
                    case 16:
                        _k.sent();
                        _g = expect;
                        return [4 /*yield*/, pagination.getMaxItems()];
                    case 17:
                        _g.apply(void 0, [_k.sent()]).toContain('100');
                        _h = expect;
                        return [4 /*yield*/, pagination.getTotalPages()];
                    case 18:
                        _h.apply(void 0, [_k.sent()]).toContain('of 2');
                        return [4 /*yield*/, pagination.openCurrentPageMenu()];
                    case 19:
                        _k.sent();
                        _j = expect;
                        return [4 /*yield*/, pagination.menu.getItemsCount()];
                    case 20:
                        _j.apply(void 0, [_k.sent()]).toBe(2);
                        return [4 /*yield*/, pagination.menu.closeMenu()];
                    case 21:
                        _k.sent();
                        return [4 /*yield*/, pagination.resetToDefaultPageSize()];
                    case 22:
                        _k.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('change the current page from menu - [C280116]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, pagination.openCurrentPageMenu()];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, pagination.menu.clickNthItem(3)];
                    case 2:
                        _f.sent();
                        _a = expect;
                        return [4 /*yield*/, pagination.getRange()];
                    case 3:
                        _a.apply(void 0, [_f.sent()]).toContain('51-75 of 101');
                        _b = expect;
                        return [4 /*yield*/, pagination.getCurrentPage()];
                    case 4:
                        _b.apply(void 0, [_f.sent()]).toContain('Page 3');
                        _c = expect;
                        return [4 /*yield*/, pagination.isPreviousEnabled()];
                    case 5:
                        _c.apply(void 0, [_f.sent()]).toBe(true, 'Previous button is not enabled');
                        _d = expect;
                        return [4 /*yield*/, pagination.isNextEnabled()];
                    case 6:
                        _d.apply(void 0, [_f.sent()]).toBe(true, 'Next button is not enabled');
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent('my-file-40')];
                    case 7:
                        _e.apply(void 0, [_f.sent()]).toBe(true, 'File not found on page');
                        return [4 /*yield*/, pagination.resetToDefaultPageNumber()];
                    case 8:
                        _f.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('navigate to next and previous pages - [C280119]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, pagination.clickNext()];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 2:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, pagination.getRange()];
                    case 3:
                        _a.apply(void 0, [_e.sent()]).toContain('26-50 of 101');
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent('my-file-70')];
                    case 4:
                        _b.apply(void 0, [_e.sent()]).toBe(true, 'File not found on page');
                        return [4 /*yield*/, pagination.resetToDefaultPageNumber()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, pagination.openCurrentPageMenu()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, pagination.menu.clickNthItem(2)];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 8:
                        _e.sent();
                        return [4 /*yield*/, pagination.clickPrevious()];
                    case 9:
                        _e.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 10:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, pagination.getRange()];
                    case 11:
                        _c.apply(void 0, [_e.sent()]).toContain('1-25 of 101');
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent('my-file-88')];
                    case 12:
                        _d.apply(void 0, [_e.sent()]).toBe(true, 'File not found on page');
                        return [4 /*yield*/, pagination.resetToDefaultPageNumber()];
                    case 13:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Previous button is disabled on first page - [C280117]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, pagination.getCurrentPage()];
                    case 1:
                        _a.apply(void 0, [_c.sent()]).toContain('Page 1');
                        _b = expect;
                        return [4 /*yield*/, pagination.isPreviousEnabled()];
                    case 2:
                        _b.apply(void 0, [_c.sent()]).toBe(false, 'Previous button is enabled on first page');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Next button is disabled on last page - [C280118]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, pagination.openCurrentPageMenu()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, pagination.menu.clickNthItem(5)];
                    case 2:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.getRowsCount()];
                    case 3:
                        _a.apply(void 0, [_d.sent()]).toBe(1, 'Incorrect number of items on the last page');
                        _b = expect;
                        return [4 /*yield*/, pagination.getCurrentPage()];
                    case 4:
                        _b.apply(void 0, [_d.sent()]).toContain('Page 5');
                        _c = expect;
                        return [4 /*yield*/, pagination.isNextEnabled()];
                    case 5:
                        _c.apply(void 0, [_d.sent()]).toBe(false, 'Next button is enabled on last page');
                        return [2 /*return*/];
                }
            });
        }); });
    });
}
//# sourceMappingURL=favorites.js.map