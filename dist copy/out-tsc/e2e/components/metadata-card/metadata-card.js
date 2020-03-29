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
import { Component } from '../component';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
var MetadataCard = /** @class */ (function (_super) {
    tslib_1.__extends(MetadataCard, _super);
    function MetadataCard(ancestor) {
        var _this = _super.call(this, MetadataCard.selectors.root, ancestor) || this;
        _this.footer = _this.component.element(by.css(MetadataCard.selectors.footer));
        _this.expandButton = _this.component.element(by.css(MetadataCard.selectors.expandButton));
        _this.expansionPanels = _this.component.all(by.css(MetadataCard.selectors.expansionPanel));
        return _this;
    }
    MetadataCard.prototype.isExpandPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.expandButton.isPresent()];
            });
        });
    };
    MetadataCard.prototype.clickExpandButton = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.expandButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataCard.prototype.waitForFirstExpansionPanel = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.presenceOf(this.expansionPanels.get(0)), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataCard.prototype.isExpansionPanelPresent = function (index) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.expansionPanels.get(index).isPresent()];
            });
        });
    };
    MetadataCard.prototype.getComponentIdOfPanel = function (index) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.expansionPanels.get(index).getAttribute('data-automation-id')];
            });
        });
    };
    MetadataCard.selectors = {
        root: 'adf-content-metadata-card',
        footer: '.adf-content-metadata-card-footer',
        expandButton: '[data-automation-id="meta-data-card-toggle-expand"]',
        expansionPanel: '.adf-metadata-grouped-properties-container mat-expansion-panel'
    };
    return MetadataCard;
}(Component));
export { MetadataCard };
//# sourceMappingURL=metadata-card.js.map