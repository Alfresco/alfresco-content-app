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
import { by } from 'protractor';
import { Component } from '../component';
var LoginComponent = /** @class */ (function (_super) {
    tslib_1.__extends(LoginComponent, _super);
    function LoginComponent(ancestor) {
        var _this = _super.call(this, LoginComponent.selectors.root, ancestor) || this;
        _this.usernameInput = _this.component.element(LoginComponent.selectors.usernameInput);
        _this.passwordInput = _this.component.element(LoginComponent.selectors.passwordInput);
        _this.submitButton = _this.component.element(LoginComponent.selectors.submitButton);
        _this.errorMessage = _this.component.element(LoginComponent.selectors.errorMessage);
        _this.copyright = _this.component.element(LoginComponent.selectors.copyright);
        _this.passwordVisibility = _this.component.element(LoginComponent.selectors.passwordVisibility);
        return _this;
    }
    LoginComponent.prototype.enterUsername = function (username) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var usernameInput;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        usernameInput = this.usernameInput;
                        return [4 /*yield*/, usernameInput.clear()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, usernameInput.sendKeys(username)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginComponent.prototype.enterPassword = function (password) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var passwordInput;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        passwordInput = this.passwordInput;
                        return [4 /*yield*/, passwordInput.clear()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, passwordInput.sendKeys(password)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginComponent.prototype.enterCredentials = function (username, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.enterUsername(username)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.enterPassword(password)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginComponent.prototype.submit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.submitButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginComponent.prototype.clickPasswordVisibility = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.passwordVisibility.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginComponent.prototype.getPasswordVisibility = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var text;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.passwordVisibility.getText()];
                    case 1:
                        text = _a.sent();
                        if (text.endsWith('visibility_off')) {
                            return [2 /*return*/, false];
                        }
                        else {
                            if (text.endsWith('visibility')) {
                                return [2 /*return*/, true];
                            }
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    LoginComponent.prototype.isPasswordDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var type;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.passwordInput.getAttribute('type')];
                    case 1:
                        type = _a.sent();
                        if (type === 'text') {
                            return [2 /*return*/, true];
                        }
                        else {
                            if (type === 'password') {
                                return [2 /*return*/, false];
                            }
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    LoginComponent.prototype.isUsernameEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.usernameInput.isEnabled()];
            });
        });
    };
    LoginComponent.prototype.isPasswordEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.passwordInput.isEnabled()];
            });
        });
    };
    LoginComponent.prototype.isSubmitEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.submitButton.isEnabled()];
            });
        });
    };
    LoginComponent.prototype.isPasswordHidden = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPasswordVisibility()];
                    case 1: return [2 /*return*/, !(_a.sent())];
                }
            });
        });
    };
    LoginComponent.selectors = {
        root: 'adf-login',
        usernameInput: by.css('input#username'),
        passwordInput: by.css('input#password'),
        passwordVisibility: by.css('.adf-login-password-icon'),
        submitButton: by.css('button#login-button'),
        errorMessage: by.css('.adf-login-error-message'),
        copyright: by.css('.adf-copyright')
    };
    return LoginComponent;
}(Component));
export { LoginComponent };
//# sourceMappingURL=login.js.map