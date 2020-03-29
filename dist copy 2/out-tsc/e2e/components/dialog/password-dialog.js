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
import { by, browser, until } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { GenericDialog } from '../dialog/generic-dialog';
var PasswordDialog = /** @class */ (function (_super) {
    tslib_1.__extends(PasswordDialog, _super);
    function PasswordDialog() {
        var _this = _super.call(this, PasswordDialog.selectors.root) || this;
        _this.passwordInput = _this.rootElem.element(by.css(PasswordDialog.selectors.passwordInput));
        _this.errorMessage = _this.rootElem.element(by.css(PasswordDialog.selectors.errorMessage));
        return _this;
    }
    PasswordDialog.prototype.isCloseEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled(PasswordDialog.selectors.closeButton)];
            });
        });
    };
    PasswordDialog.prototype.isSubmitEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled(PasswordDialog.selectors.submitButton)];
            });
        });
    };
    PasswordDialog.prototype.clickClose = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton(PasswordDialog.selectors.closeButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PasswordDialog.prototype.clickSubmit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton(PasswordDialog.selectors.submitButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PasswordDialog.prototype.isPasswordInputDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var present;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.isElementPresent(this.passwordInput)];
                    case 1:
                        present = _a.sent();
                        if (present) {
                            return [2 /*return*/, this.passwordInput.isDisplayed()];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PasswordDialog.prototype.isErrorDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var elem, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, browser.wait(until.elementLocated(by.css(PasswordDialog.selectors.errorMessage)), BROWSER_WAIT_TIMEOUT, '------- timeout waiting for error message to appear')];
                    case 1:
                        elem = _b.sent();
                        return [4 /*yield*/, browser.isElementPresent(elem)];
                    case 2:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, elem.isDisplayed()];
                    case 3:
                        _a = (_b.sent());
                        _b.label = 4;
                    case 4: return [2 /*return*/, _a];
                }
            });
        });
    };
    PasswordDialog.prototype.getErrorMessage = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isErrorDisplayed()];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, this.errorMessage.getText()];
                        }
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    PasswordDialog.prototype.enterPassword = function (password) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.passwordInput.clear()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.passwordInput.sendKeys(password)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PasswordDialog.selectors = {
        root: 'adf-pdf-viewer-password-dialog',
        passwordInput: 'input[type="Password"]',
        errorMessage: '.mat-error',
        closeButton: by.css('[data-automation-id="adf-password-dialog-close"]'),
        submitButton: by.css('[data-automation-id="adf-password-dialog-submit"]')
    };
    return PasswordDialog;
}(GenericDialog));
export { PasswordDialog };
//# sourceMappingURL=password-dialog.js.map