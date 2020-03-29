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
import { browser, by, By } from 'protractor';
import { BrowsingPage } from './browsing-page';
import { SearchSortingPicker } from '../components/search/search-sorting-picker';
import { SearchFilters } from '../components/search/search-filters';
var SearchResultsPage = /** @class */ (function (_super) {
    tslib_1.__extends(SearchResultsPage, _super);
    function SearchResultsPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.root = browser.element(by.css(SearchResultsPage.selectors.root));
        _this.chipList = _this.root.element(by.css(SearchResultsPage.selectors.chipList));
        _this.infoText = _this.root.element(by.css(SearchResultsPage.selectors.infoText));
        _this.sortingPicker = new SearchSortingPicker(SearchResultsPage.selectors.root);
        _this.filters = new SearchFilters(SearchResultsPage.selectors.root);
        return _this;
    }
    SearchResultsPage.prototype.waitForResults = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataTable.waitForBody()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchResultsPage.prototype.getResultsHeader = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.element(by.css(SearchResultsPage.selectors.resultsContentHeader)).getText()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SearchResultsPage.prototype.getResultsFoundText = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.infoText.getText()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SearchResultsPage.prototype.getResultsChipsValues = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var chips, chipsValues;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chips = this.chipList.all(by.css(SearchResultsPage.selectors.chip));
                        return [4 /*yield*/, chips.map(function (elem) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, elem.getText()];
                                        case 1: return [2 /*return*/, (_a.sent()).replace("\ncancel", '')];
                                    }
                                });
                            }); })];
                    case 1:
                        chipsValues = _a.sent();
                        return [2 /*return*/, chipsValues];
                }
            });
        });
    };
    SearchResultsPage.prototype.removeChip = function (chipName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var chip, closeChip;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chip = browser.element(By.cssContainingText(SearchResultsPage.selectors.chip, chipName));
                        closeChip = chip.element(by.css(SearchResultsPage.selectors.chipCloseIcon));
                        return [4 /*yield*/, closeChip.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchResultsPage.selectors = {
        root: 'aca-search-results',
        resultsContentHeader: '.adf-search-results__content-header',
        infoText: '.adf-search-results--info-text',
        chipList: '.adf-search-chip-list',
        chip: '.mat-chip',
        chipCloseIcon: '.mat-chip-remove'
    };
    return SearchResultsPage;
}(BrowsingPage));
export { SearchResultsPage };
//# sourceMappingURL=search-results-page.js.map