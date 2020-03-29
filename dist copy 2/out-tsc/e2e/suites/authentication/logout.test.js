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
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { APP_ROUTES } from '../../configs';
describe('Logout', function () {
    var page = new BrowsingPage();
    var loginPage = new LoginPage();
    var peopleApi = new RepoClient().people;
    var johnDoe = "user-" + Utils.random();
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, peopleApi.createUser({ username: johnDoe })];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loginPage.loginWith(johnDoe)];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Sign out option is available - [C213143]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.header.userInfo.openMenu()];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, page.header.isSignOutDisplayed()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe(true, 'Sign out option not displayed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('redirects to Login page on sign out - [C213144]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.signOut()];
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
    it('redirects to Login page when pressing browser Back after logout - [C213145]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.signOut()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, browser.navigate().back()];
                case 2:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, browser.getCurrentUrl()];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toContain(APP_ROUTES.LOGIN);
                    return [2 /*return*/];
            }
        });
    }); });
    it('redirects to Login page when trying to access a part of the app after logout - [C213146]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.signOut()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, page.load('/favorites')];
                case 2:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, browser.getCurrentUrl()];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toContain(APP_ROUTES.LOGIN);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=logout.test.js.map