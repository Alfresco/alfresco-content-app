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
import { by, browser, ExpectedConditions as EC, protractor } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { GenericDialog } from '../dialog/generic-dialog';
import { Utils } from '../../utilities/utils';
import { DropDownBreadcrumb } from '../breadcrumb/dropdown-breadcrumb';
import { DataTable } from '../data-table/data-table';
var ContentNodeSelectorDialog = /** @class */ (function (_super) {
    tslib_1.__extends(ContentNodeSelectorDialog, _super);
    function ContentNodeSelectorDialog() {
        var _this = _super.call(this, ContentNodeSelectorDialog.selectors.root) || this;
        _this.locationDropDown = _this.rootElem.element(by.id(ContentNodeSelectorDialog.selectors.locationDropDown));
        _this.locationPersonalFiles = browser.element(by.cssContainingText(ContentNodeSelectorDialog.selectors.locationOption, 'Personal Files'));
        _this.locationFileLibraries = browser.element(by.cssContainingText(ContentNodeSelectorDialog.selectors.locationOption, 'File Libraries'));
        _this.searchInput = _this.rootElem.element(by.css(ContentNodeSelectorDialog.selectors.searchInput));
        _this.toolbarTitle = _this.rootElem.element(by.css(ContentNodeSelectorDialog.selectors.toolbarTitle));
        _this.breadcrumb = new DropDownBreadcrumb();
        _this.dataTable = new DataTable(ContentNodeSelectorDialog.selectors.root);
        return _this;
    }
    ContentNodeSelectorDialog.prototype.waitForDropDownToOpen = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.presenceOf(this.locationPersonalFiles), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentNodeSelectorDialog.prototype.waitForDropDownToClose = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.stalenessOf(browser.$(ContentNodeSelectorDialog.selectors.locationOption)), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentNodeSelectorDialog.prototype.waitForRowToBeSelected = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.presenceOf(browser.element(by.css(ContentNodeSelectorDialog.selectors.selectedRow))), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentNodeSelectorDialog.prototype.clickCancel = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton(ContentNodeSelectorDialog.selectors.cancelButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.waitForDialogToClose()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentNodeSelectorDialog.prototype.clickCopy = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton(ContentNodeSelectorDialog.selectors.copyButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentNodeSelectorDialog.prototype.clickMove = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton(ContentNodeSelectorDialog.selectors.moveButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentNodeSelectorDialog.prototype.selectLocation = function (location) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.locationDropDown.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.waitForDropDownToOpen()];
                    case 2:
                        _a.sent();
                        if (!(location === 'Personal Files')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.locationPersonalFiles.click()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.locationFileLibraries.click()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [4 /*yield*/, this.waitForDropDownToClose()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentNodeSelectorDialog.prototype.selectDestination = function (folderName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var row;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = this.dataTable.getRowByName(folderName);
                        return [4 /*yield*/, Utils.waitUntilElementClickable(row)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, row.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.waitForRowToBeSelected()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentNodeSelectorDialog.prototype.isSearchInputPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchInput.isPresent()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentNodeSelectorDialog.prototype.isSelectLocationDropdownDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.locationDropDown.isPresent()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.locationDropDown.isDisplayed()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    ContentNodeSelectorDialog.prototype.isCopyButtonEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled(ContentNodeSelectorDialog.selectors.copyButton)];
            });
        });
    };
    ContentNodeSelectorDialog.prototype.isCancelButtonEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled(ContentNodeSelectorDialog.selectors.cancelButton)];
            });
        });
    };
    ContentNodeSelectorDialog.prototype.searchFor = function (text) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.clearFieldWithBackspace(this.searchInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.searchInput.sendKeys(text)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.searchInput.sendKeys(protractor.Key.ENTER)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentNodeSelectorDialog.prototype.getToolbarTitle = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toolbarTitle.getText()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentNodeSelectorDialog.selectors = {
        root: '.adf-content-node-selector-dialog',
        locationDropDown: 'site-dropdown-container',
        locationOption: '.mat-option .mat-option-text',
        dataTable: '.adf-datatable-body',
        selectedRow: '.adf-is-selected',
        searchInput: '#searchInput',
        toolbarTitle: '.adf-toolbar-title',
        cancelButton: by.css('[data-automation-id="content-node-selector-actions-cancel"]'),
        copyButton: by.cssContainingText('[data-automation-id="content-node-selector-actions-choose"]', 'Copy'),
        moveButton: by.cssContainingText('[data-automation-id="content-node-selector-actions-choose"]', 'Move')
    };
    return ContentNodeSelectorDialog;
}(GenericDialog));
export { ContentNodeSelectorDialog };
//# sourceMappingURL=content-node-selector-dialog.js.map