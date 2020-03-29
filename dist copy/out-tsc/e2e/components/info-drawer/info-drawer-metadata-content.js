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
var ContentMetadata = /** @class */ (function (_super) {
    tslib_1.__extends(ContentMetadata, _super);
    function ContentMetadata(ancestor) {
        var _this = _super.call(this, ContentMetadata.selectors.root, ancestor) || this;
        _this.expandedPanel = _this.component.element(by.css(ContentMetadata.selectors.expandedPanel));
        _this.propertyList = _this.component.element(by.css(ContentMetadata.selectors.propertyList));
        _this.propertyListElements = _this.component.all(by.css(ContentMetadata.selectors.property));
        _this.propertyValue = _this.component.element(by.css(ContentMetadata.selectors.propertyValue));
        _this.editPropertiesButton = _this.component.element(by.css(ContentMetadata.selectors.editProperties));
        _this.lessInfoButton = _this.component.element(by.cssContainingText(ContentMetadata.selectors.moreLessInformation, 'Less information'));
        _this.moreInfoButton = _this.component.element(by.cssContainingText(ContentMetadata.selectors.moreLessInformation, 'More information'));
        _this.imagePropertiesPanel = _this.component.element(by.css("[data-automation-id='adf-metadata-group-APP.CONTENT_METADATA.EXIF_GROUP_TITLE']"));
        _this.expandedImagePropertiesPanel = _this.component.element(by.css("[data-automation-id='adf-metadata-group-APP.CONTENT_METADATA.EXIF_GROUP_TITLE'].mat-expanded"));
        return _this;
    }
    ContentMetadata.prototype.isPropertiesListExpanded = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.expandedPanel)];
            });
        });
    };
    ContentMetadata.prototype.waitForImagePropertiesPanelToExpand = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.visibilityOf(this.expandedImagePropertiesPanel), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentMetadata.prototype.getVisiblePropertiesLabels = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.component.all(by.css(ContentMetadata.selectors.propertyLabel))
                            .filter(function (elem) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, elem.isDisplayed()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); })
                            .map(function (elem) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, elem.getText()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentMetadata.prototype.getVisiblePropertiesValues = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.component.all(by.css(ContentMetadata.selectors.propertyValue))
                            .filter(function (elem) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, elem.isDisplayed()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); })
                            .map(function (elem) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, elem.isElementPresent(by.css('.mat-checkbox'))];
                                    case 1:
                                        if (!_a.sent()) return [3 /*break*/, 3];
                                        return [4 /*yield*/, elem.isElementPresent(by.css('.mat-checkbox-checked'))];
                                    case 2:
                                        if (_a.sent()) {
                                            return [2 /*return*/, true];
                                        }
                                        return [2 /*return*/, false];
                                    case 3: return [4 /*yield*/, elem.getText()];
                                    case 4: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentMetadata.prototype.isEditPropertiesButtonEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, browser.isElementPresent(this.editPropertiesButton)];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.editPropertiesButton.isEnabled()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    ContentMetadata.prototype.isLessInfoButtonEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, browser.isElementPresent(this.lessInfoButton)];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.lessInfoButton.isEnabled()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    ContentMetadata.prototype.isMoreInfoButtonEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, browser.isElementPresent(this.moreInfoButton)];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.moreInfoButton.isEnabled()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    ContentMetadata.prototype.isLessInfoButtonDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.lessInfoButton)];
            });
        });
    };
    ContentMetadata.prototype.isMoreInfoButtonDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.moreInfoButton)];
            });
        });
    };
    ContentMetadata.prototype.clickLessInformationButton = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.lessInfoButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentMetadata.prototype.clickMoreInformationButton = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.moreInfoButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentMetadata.prototype.isImagePropertiesPanelDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, browser.isElementPresent(this.imagePropertiesPanel)];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.imagePropertiesPanel.isDisplayed()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    ContentMetadata.prototype.clickImagePropertiesPanel = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.imagePropertiesPanel.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentMetadata.selectors = {
        root: 'adf-content-metadata-card',
        expandedPanel: '.mat-expansion-panel.mat-expanded',
        propertyList: '.adf-property-list',
        property: '.adf-property',
        propertyLabel: '.adf-property-label',
        propertyValue: '.adf-property-value',
        editProperties: "button[title='Edit']",
        editProperty: ".mat-icon[title='Edit']",
        editDateItem: ".adf-dateitem-editable",
        moreLessInformation: "[data-automation-id='meta-data-card-toggle-expand']"
    };
    return ContentMetadata;
}(Component));
export { ContentMetadata };
//# sourceMappingURL=info-drawer-metadata-content.js.map