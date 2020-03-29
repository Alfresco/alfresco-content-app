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
var GenericDialog = /** @class */ (function () {
    function GenericDialog(selector) {
        this.rootCssSelector = selector;
    }
    Object.defineProperty(GenericDialog.prototype, "rootElem", {
        get: function () {
            return browser.element(by.css(this.rootCssSelector));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GenericDialog.prototype, "title", {
        get: function () {
            return this.rootElem.element(by.css(GenericDialog.locators.title));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GenericDialog.prototype, "content", {
        get: function () {
            return this.rootElem.element(by.css(GenericDialog.locators.content));
        },
        enumerable: true,
        configurable: true
    });
    GenericDialog.prototype.getText = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.content.getText()];
            });
        });
    };
    GenericDialog.prototype.waitForDialogToOpen = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.presenceOf(this.rootElem), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser.wait(EC.visibilityOf(this.content), BROWSER_WAIT_TIMEOUT)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, browser.wait(EC.presenceOf(browser.element(by.css('.cdk-overlay-backdrop'))), BROWSER_WAIT_TIMEOUT)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GenericDialog.prototype.waitForDialogToClose = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.stalenessOf(this.content), BROWSER_WAIT_TIMEOUT, '---- timeout waiting for dialog to close ----')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GenericDialog.prototype.isDialogOpen = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.rootElem.isPresent()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.rootElem.isDisplayed()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    GenericDialog.prototype.getTitle = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.title.getText()];
            });
        });
    };
    GenericDialog.prototype.getActionButton = function (selector) {
        return this.rootElem.element(selector);
    };
    GenericDialog.prototype.isButtonEnabled = function (selector) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getActionButton(selector).isPresent()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getActionButton(selector).isEnabled()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    GenericDialog.prototype.clickButton = function (selector) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getActionButton(selector).click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GenericDialog.locators = {
        title: '.mat-dialog-title',
        content: '.mat-dialog-content'
    };
    return GenericDialog;
}());
export { GenericDialog };
//# sourceMappingURL=generic-dialog.js.map