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
import { browser, by, ExpectedConditions as EC, until } from 'protractor';
import { BROWSER_WAIT_TIMEOUT, USE_HASH_STRATEGY } from './../configs';
import { Utils } from '../utilities/utils';
var Page = /** @class */ (function () {
    function Page(url) {
        if (url === void 0) { url = ''; }
        this.url = url;
        this.appRoot = Page.locators.root;
        this.layout = browser.element(by.css(Page.locators.layout));
        this.overlay = browser.element(by.css(Page.locators.overlay));
        this.snackBar = browser.element(by.css(Page.locators.snackBar));
        this.dialogContainer = browser.element(by.css(Page.locators.dialogContainer));
        this.snackBarContainer = browser.element(by.css(Page.locators.snackBarContainer));
        this.snackBarAction = browser.element(by.css(Page.locators.snackBarAction));
        this.genericError = browser.element(by.css(Page.locators.genericError));
        this.genericErrorIcon = browser.element(by.css(Page.locators.genericErrorIcon));
        this.genericErrorTitle = browser.element(by.css(Page.locators.genericErrorTitle));
    }
    Page.prototype.getTitle = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.getTitle()];
            });
        });
    };
    Page.prototype.load = function (relativeUrl) {
        if (relativeUrl === void 0) { relativeUrl = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var hash, path;
            return tslib_1.__generator(this, function (_a) {
                hash = USE_HASH_STRATEGY ? '/#' : '';
                path = "" + browser.baseUrl + hash + this.url + relativeUrl;
                return [2 /*return*/, browser.get(path)];
            });
        });
    };
    Page.prototype.waitForApp = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.presenceOf(this.layout), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Page.prototype.waitForSnackBarToAppear = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.wait(until.elementLocated(by.css('.mat-snack-bar-container')), BROWSER_WAIT_TIMEOUT, '------- timeout waiting for snackbar to appear')];
            });
        });
    };
    Page.prototype.waitForSnackBarToClose = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.not(EC.visibilityOf(this.snackBarContainer)), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Page.prototype.waitForDialog = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.visibilityOf(this.dialogContainer), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Page.prototype.isDialogOpen = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.dialogContainer)];
            });
        });
    };
    Page.prototype.closeOpenDialogs = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isDialogOpen()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, Utils.pressEscape()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Page.prototype.refresh = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.refresh()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.waitForApp()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Page.prototype.getSnackBarMessage = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var elem;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.waitForSnackBarToAppear()];
                    case 1:
                        elem = _a.sent();
                        return [2 /*return*/, elem.getAttribute('innerText')];
                }
            });
        });
    };
    Page.prototype.clickSnackBarAction = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var action, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, browser.wait(until.elementLocated(by.css('.mat-simple-snackbar-action button')), BROWSER_WAIT_TIMEOUT, '------- timeout waiting for snack action to appear')];
                    case 1:
                        action = _a.sent();
                        return [4 /*yield*/, action.click()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.log(e_1, '.......failed on click snack bar action.........');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Page.prototype.isGenericErrorDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.genericError.isDisplayed()];
            });
        });
    };
    Page.prototype.getGenericErrorTitle = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.genericErrorTitle.getText()];
            });
        });
    };
    Page.prototype.isUndoActionPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var message;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.snackBar.getAttribute('innerText')];
                    case 1:
                        message = _a.sent();
                        return [2 /*return*/, message.includes('Undo')];
                }
            });
        });
    };
    Page.locators = {
        root: 'app-root',
        layout: 'app-layout',
        overlay: '.cdk-overlay-container',
        dialogContainer: '.mat-dialog-container',
        snackBarContainer: '.mat-snack-bar-container',
        snackBar: '.mat-simple-snackbar',
        snackBarAction: '.mat-simple-snackbar-action button',
        genericError: 'aca-generic-error',
        genericErrorIcon: 'aca-generic-error .mat-icon',
        genericErrorTitle: '.generic-error__title'
    };
    return Page;
}());
export { Page };
//# sourceMappingURL=page.js.map