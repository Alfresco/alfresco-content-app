import * as tslib_1 from "tslib";
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
import { browser, ExpectedConditions as EC } from 'protractor';
import { LoginComponent } from '../components/components';
import { Page } from './page';
import { ADMIN_USERNAME, ADMIN_PASSWORD, BROWSER_WAIT_TIMEOUT, APP_ROUTES } from '../configs';
var LoginPage = /** @class */ (function (_super) {
    tslib_1.__extends(LoginPage, _super);
    /** @override */
    function LoginPage() {
        var _this = _super.call(this, APP_ROUTES.LOGIN) || this;
        _this.login = new LoginComponent(_this.appRoot);
        return _this;
    }
    /** @override */
    LoginPage.prototype.load = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var submitButton, hasSubmitButton;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.load.call(this)];
                    case 1:
                        _a.sent();
                        submitButton = this.login.submitButton;
                        hasSubmitButton = EC.presenceOf(submitButton);
                        return [2 /*return*/, browser.wait(hasSubmitButton, BROWSER_WAIT_TIMEOUT)];
                }
            });
        });
    };
    LoginPage.prototype.loginWith = function (username, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var pass;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pass = password || username;
                        return [4 /*yield*/, this.load()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.login.enterCredentials(username, pass)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.login.submit()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, _super.prototype.waitForApp.call(this)];
                }
            });
        });
    };
    LoginPage.prototype.loginWithAdmin = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.load()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.loginWith(ADMIN_USERNAME, ADMIN_PASSWORD)];
                }
            });
        });
    };
    LoginPage.prototype.tryLoginWith = function (username, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var pass;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pass = password || username;
                        return [4 /*yield*/, this.load()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.login.enterCredentials(username, pass)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.login.submit()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, browser.wait(EC.presenceOf(this.login.errorMessage), BROWSER_WAIT_TIMEOUT)];
                }
            });
        });
    };
    return LoginPage;
}(Page));
export { LoginPage };
//# sourceMappingURL=login-page.js.map