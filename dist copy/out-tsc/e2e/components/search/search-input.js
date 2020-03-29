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
import { browser, by, until, protractor, ExpectedConditions as EC } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';
import { Utils } from '../../utilities/utils';
var SearchInput = /** @class */ (function (_super) {
    tslib_1.__extends(SearchInput, _super);
    function SearchInput(ancestor) {
        var _this = _super.call(this, SearchInput.selectors.root, ancestor) || this;
        _this.searchButton = _this.component.element(by.css(SearchInput.selectors.searchButton));
        _this.searchContainer = browser.element(by.css(SearchInput.selectors.searchContainer));
        _this.searchControl = browser.element(by.css(SearchInput.selectors.searchControl));
        _this.searchInput = browser.element(by.css(SearchInput.selectors.searchInput));
        _this.searchOptionsArea = browser.element(by.id(SearchInput.selectors.searchOptionsArea));
        _this.searchFilesOption = _this.searchOptionsArea.element(by.cssContainingText(SearchInput.selectors.optionCheckbox, 'Files'));
        _this.searchFoldersOption = _this.searchOptionsArea.element(by.cssContainingText(SearchInput.selectors.optionCheckbox, 'Folders'));
        _this.searchLibrariesOption = _this.searchOptionsArea.element(by.cssContainingText(SearchInput.selectors.optionCheckbox, 'Libraries'));
        _this.clearSearchButton = _this.searchContainer.$(SearchInput.selectors.clearButton);
        return _this;
    }
    SearchInput.prototype.waitForSearchControl = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.presenceOf(this.searchControl), BROWSER_WAIT_TIMEOUT, '--- timeout waitForSearchControl ---')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchInput.prototype.waitForSearchInputToBeInteractive = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.elementToBeClickable(this.searchControl), BROWSER_WAIT_TIMEOUT, '--- timeout waitForSearchControl ---')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchInput.prototype.isSearchContainerDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.searchContainer.isDisplayed()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.searchButton.isDisplayed()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    SearchInput.prototype.clickSearchButton = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.waitUntilElementClickable(this.searchButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.searchButton.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.waitForSearchControl()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchInput.prototype.isOptionsAreaDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(until.elementLocated(by.css(SearchInput.selectors.searchControl)), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, browser.isElementPresent(this.searchOptionsArea)];
                }
            });
        });
    };
    SearchInput.prototype.clickFilesOption = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.elementToBeClickable(this.searchFilesOption), BROWSER_WAIT_TIMEOUT, '--- timeout waiting for Files to be clickable')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.searchFilesOption.click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchInput.prototype.clickFoldersOption = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.elementToBeClickable(this.searchFoldersOption), BROWSER_WAIT_TIMEOUT, '--- timeout waiting for Folders to be clickable')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.searchFoldersOption.click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchInput.prototype.clickLibrariesOption = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.elementToBeClickable(this.searchLibrariesOption), BROWSER_WAIT_TIMEOUT, '--- timeout waiting for Libraries to be clickable')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.searchLibrariesOption.click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchInput.prototype.isFilesOptionEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var optClass;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchFilesOption.getAttribute('class')];
                    case 1:
                        optClass = _a.sent();
                        return [2 /*return*/, !optClass.includes('mat-checkbox-disabled')];
                }
            });
        });
    };
    SearchInput.prototype.isFoldersOptionEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var optClass;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchFoldersOption.getAttribute('class')];
                    case 1:
                        optClass = _a.sent();
                        return [2 /*return*/, !optClass.includes('mat-checkbox-disabled')];
                }
            });
        });
    };
    SearchInput.prototype.isLibrariesOptionEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var optClass;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchLibrariesOption.getAttribute('class')];
                    case 1:
                        optClass = _a.sent();
                        return [2 /*return*/, !optClass.includes('mat-checkbox-disabled')];
                }
            });
        });
    };
    SearchInput.prototype.isFilesOptionChecked = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var optClass;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchFilesOption.getAttribute('class')];
                    case 1:
                        optClass = _a.sent();
                        return [2 /*return*/, optClass.includes('mat-checkbox-checked')];
                }
            });
        });
    };
    SearchInput.prototype.isFoldersOptionChecked = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var optClass;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchFoldersOption.getAttribute('class')];
                    case 1:
                        optClass = _a.sent();
                        return [2 /*return*/, optClass.includes('mat-checkbox-checked')];
                }
            });
        });
    };
    SearchInput.prototype.isLibrariesOptionChecked = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var optClass;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchLibrariesOption.getAttribute('class')];
                    case 1:
                        optClass = _a.sent();
                        return [2 /*return*/, optClass.includes('mat-checkbox-checked')];
                }
            });
        });
    };
    SearchInput.prototype.clearOptions = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isFilesOptionChecked()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.clickFilesOption()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.isFoldersOptionChecked()];
                    case 4:
                        if (!_a.sent()) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.clickFoldersOption()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [4 /*yield*/, this.isLibrariesOptionChecked()];
                    case 7:
                        if (!_a.sent()) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.clickLibrariesOption()];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    SearchInput.prototype.isClearSearchButtonPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.clearSearchButton)];
            });
        });
    };
    SearchInput.prototype.clickClearSearchButton = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isClearSearchButtonPresent()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.clearSearchButton.click()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SearchInput.prototype.checkOnlyFiles = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clearOptions()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.clickFilesOption()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchInput.prototype.checkOnlyFolders = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clearOptions()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.clickFoldersOption()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchInput.prototype.checkFilesAndFolders = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clearOptions()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.clickFilesOption()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.clickFoldersOption()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchInput.prototype.checkLibraries = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clearOptions()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.clickLibrariesOption()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchInput.prototype.searchFor = function (text) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.waitForSearchInputToBeInteractive()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Utils.clearFieldWithBackspace(this.searchInput)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.searchInput.sendKeys(text)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.searchInput.sendKeys(protractor.Key.ENTER)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchInput.selectors = {
        root: 'aca-search-input',
        searchContainer: '.app-search-container',
        searchButton: '.app-search-button',
        searchControl: '.app-search-control',
        searchInput: "input[id='app-control-input']",
        searchOptionsArea: 'search-options',
        optionCheckbox: '.mat-checkbox',
        clearButton: '.app-clear-icon'
    };
    return SearchInput;
}(Component));
export { SearchInput };
//# sourceMappingURL=search-input.js.map