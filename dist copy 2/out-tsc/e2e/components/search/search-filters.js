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
import { Component } from '../component';
import { SizeFilter } from './filters/size-filter';
import { CreatedDateFilter } from './filters/created-date-filter';
import { FacetFilter } from './filters/facet-filter';
var SearchFilters = /** @class */ (function (_super) {
    tslib_1.__extends(SearchFilters, _super);
    function SearchFilters(ancestor) {
        var _this = _super.call(this, SearchFilters.selectors.root, ancestor) || this;
        _this.mainPanel = browser.element(by.css(SearchFilters.selectors.root));
        _this.resetAllButton = _this.component.element(by.cssContainingText('.mat-button', 'Reset all'));
        _this.size = new SizeFilter();
        _this.createdDate = new CreatedDateFilter();
        _this.fileType = new FacetFilter('File type');
        _this.creator = new FacetFilter('Creator');
        _this.modifier = new FacetFilter('Modifier');
        _this.location = new FacetFilter('Location');
        _this.modifiedDate = new FacetFilter('Modified date');
        return _this;
    }
    SearchFilters.prototype.isSearchFiltersPanelDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.mainPanel.isPresent()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.mainPanel.isDisplayed()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    SearchFilters.prototype.clickResetAllButton = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resetAllButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFilters.selectors = {
        root: 'adf-search-filter',
    };
    return SearchFilters;
}(Component));
export { SearchFilters };
//# sourceMappingURL=search-filters.js.map