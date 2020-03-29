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
var _this = this;
import * as tslib_1 from "tslib";
import { browser } from 'protractor';
import { APP_ROUTES } from '../../configs';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { navigate } from '../../utilities/browser-utils';
describe('Login', function () {
    var peopleApi = new RepoClient().people;
    var loginPage = new LoginPage();
    var login = loginPage.login;
    /* cspell:disable-next-line */
    var testUser = "user-" + Utils.random() + "@alfness";
    var russianUser = {
        /* cspell:disable-next-line */
        username: "\u043F\u043E\u043B\u044C\u0437\u0432\u0430\u0442\u0435" + Utils.random(),
        password: '密碼中國'
    };
    var johnDoe = {
        username: "user-" + Utils.random(),
        get password() { return this.username; },
        firstName: 'John',
        lastName: 'Doe'
    };
    var disabledUser = "user-" + Utils.random();
    var testUser2 = {
        username: "user-" + Utils.random(),
        password: 'user2 password'
    };
    var newPassword = 'new password';
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, peopleApi.createUser({ username: testUser })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, peopleApi.createUser(russianUser)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, peopleApi.createUser(johnDoe)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, peopleApi.createUser({ username: disabledUser })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, peopleApi.createUser(testUser2)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, peopleApi.disableUser(disabledUser)];
                case 6:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Utils.clearLocalStorage()];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('general tests', function () {
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.load()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('login page layout - [C213089]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, login.isUsernameEnabled()];
                    case 1:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'username input is not enabled');
                        _b = expect;
                        return [4 /*yield*/, login.isPasswordEnabled()];
                    case 2:
                        _b.apply(void 0, [_e.sent()]).toBe(true, 'password input is not enabled');
                        _c = expect;
                        return [4 /*yield*/, login.isSubmitEnabled()];
                    case 3:
                        _c.apply(void 0, [_e.sent()]).toBe(false, 'SIGN IN button is enabled');
                        _d = expect;
                        return [4 /*yield*/, login.isPasswordHidden()];
                    case 4:
                        _d.apply(void 0, [_e.sent()]).toBe(true, 'Password is not hidden by default');
                        return [2 /*return*/];
                }
            });
        }); });
        it('change password visibility - [C213091]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, login.enterPassword('some password')];
                    case 1:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, login.isPasswordDisplayed()];
                    case 2:
                        _a.apply(void 0, [_d.sent()]).toBe(false, 'password is visible');
                        return [4 /*yield*/, login.clickPasswordVisibility()];
                    case 3:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, login.isPasswordHidden()];
                    case 4:
                        _b.apply(void 0, [_d.sent()]).toBe(false, 'Password visibility not changed');
                        _c = expect;
                        return [4 /*yield*/, login.isPasswordDisplayed()];
                    case 5:
                        _c.apply(void 0, [_d.sent()]).toBe(true, 'password is not visible');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('with valid credentials', function () {
        it('navigate to "Personal Files" - [C213092]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var username, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        username = johnDoe.username;
                        return [4 /*yield*/, loginPage.loginWith(username)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getCurrentUrl()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toContain(APP_ROUTES.PERSONAL_FILES);
                        return [2 /*return*/];
                }
            });
        }); });
        it("displays user's name in header - [C213108]", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var userInfo, username, firstName, lastName, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userInfo = new BrowsingPage(APP_ROUTES.PERSONAL_FILES).header.userInfo;
                        username = johnDoe.username, firstName = johnDoe.firstName, lastName = johnDoe.lastName;
                        return [4 /*yield*/, loginPage.loginWith(username)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, userInfo.getName()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toEqual(firstName + " " + lastName);
                        return [2 /*return*/];
                }
            });
        }); });
        it("logs in with user having username containing \"@\" - [C213096]", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWith(testUser)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getCurrentUrl()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toContain(APP_ROUTES.PERSONAL_FILES);
                        return [2 /*return*/];
                }
            });
        }); });
        it('logs in with user with non-latin characters - [C213097]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var username, password, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        username = russianUser.username, password = russianUser.password;
                        return [4 /*yield*/, loginPage.loginWith(username, password)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getCurrentUrl()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toContain(APP_ROUTES.PERSONAL_FILES);
                        return [2 /*return*/];
                }
            });
        }); });
        // TODO: ACA-245
        xit('redirects to Home Page when navigating to the Login page while already logged in - [C213107]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var username, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        username = johnDoe.username;
                        return [4 /*yield*/, loginPage.loginWith(username)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, navigate(APP_ROUTES.LOGIN)];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getCurrentUrl()];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toContain(APP_ROUTES.PERSONAL_FILES);
                        return [2 /*return*/];
                }
            });
        }); });
        it('redirects to Personal Files when pressing browser Back while already logged in - [C213109]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var username, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        username = johnDoe.username;
                        return [4 /*yield*/, loginPage.loginWith(username)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, browser.navigate().back()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getCurrentUrl()];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toContain(APP_ROUTES.PERSONAL_FILES);
                        return [2 /*return*/];
                }
            });
        }); });
        it('user is able to login after changing his password - [C213104]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWith(testUser2.username, testUser2.password)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, peopleApi.changePassword(testUser2.username, newPassword)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, loginPage.loginWith(testUser2.username, newPassword)];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getCurrentUrl()];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toContain(APP_ROUTES.PERSONAL_FILES);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('with invalid credentials', function () {
        var loginComponent = loginPage.login;
        var submitButton = loginComponent.submitButton, errorMessage = loginComponent.errorMessage;
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.load()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('disabled submit button when password is empty - [C280072]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loginComponent.enterUsername('any-username')];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, submitButton.isEnabled()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(false, 'submit button is enabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('disabled submit button when username is empty - [C280070]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loginPage.login.enterPassword('any-password')];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, submitButton.isEnabled()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(false, 'submit button is enabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('shows error when entering nonexistent user - [C213093]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, loginPage.tryLoginWith('nonexistent-user', 'any-password')];
                    case 1:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getCurrentUrl()];
                    case 2:
                        _a.apply(void 0, [_d.sent()]).toContain(APP_ROUTES.LOGIN);
                        _b = expect;
                        return [4 /*yield*/, errorMessage.isDisplayed()];
                    case 3:
                        _b.apply(void 0, [_d.sent()]).toBe(true, 'error message is not displayed');
                        _c = expect;
                        return [4 /*yield*/, errorMessage.getText()];
                    case 4:
                        _c.apply(void 0, [_d.sent()]).toBe("You've entered an unknown username or password");
                        return [2 /*return*/];
                }
            });
        }); });
        it('shows error when entering invalid password - [C280071]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var username, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        username = johnDoe.username;
                        return [4 /*yield*/, loginPage.tryLoginWith(username, 'incorrect-password')];
                    case 1:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getCurrentUrl()];
                    case 2:
                        _a.apply(void 0, [_d.sent()]).toContain(APP_ROUTES.LOGIN);
                        _b = expect;
                        return [4 /*yield*/, errorMessage.isDisplayed()];
                    case 3:
                        _b.apply(void 0, [_d.sent()]).toBe(true, 'error message is not displayed');
                        _c = expect;
                        return [4 /*yield*/, errorMessage.getText()];
                    case 4:
                        _c.apply(void 0, [_d.sent()]).toBe("You've entered an unknown username or password");
                        return [2 /*return*/];
                }
            });
        }); });
        it('unauthenticated user is redirected to Login page - [C213106]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, navigate(APP_ROUTES.PERSONAL_FILES)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getCurrentUrl()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toContain(APP_ROUTES.LOGIN);
                        return [2 /*return*/];
                }
            });
        }); });
        it('disabled user is not logged in - [C213100]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, loginPage.tryLoginWith(disabledUser)];
                    case 1:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, browser.getCurrentUrl()];
                    case 2:
                        _a.apply(void 0, [_d.sent()]).toContain(APP_ROUTES.LOGIN);
                        _b = expect;
                        return [4 /*yield*/, errorMessage.isDisplayed()];
                    case 3:
                        _b.apply(void 0, [_d.sent()]).toBe(true, 'error message is not displayed');
                        _c = expect;
                        return [4 /*yield*/, errorMessage.getText()];
                    case 4:
                        _c.apply(void 0, [_d.sent()]).toBe("You've entered an unknown username or password");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=login.test.js.map