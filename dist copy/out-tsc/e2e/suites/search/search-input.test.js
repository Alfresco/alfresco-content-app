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
import { BrowsingPage, LoginPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
describe('Search input', function () {
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var searchInput = page.header.searchInput;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loginPage.loginWithAdmin()];
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
                case 0: return [4 /*yield*/, Utils.pressEscape()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.clickPersonalFiles()];
                case 2:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Search input is displayed in the app header - [C289847]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, searchInput.isSearchContainerDisplayed()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBe(true, 'search controls not displayed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Search options are displayed when clicking in the search input - [C289848]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g;
        return tslib_1.__generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _h.sent();
                    _a = expect;
                    return [4 /*yield*/, searchInput.isOptionsAreaDisplayed()];
                case 2:
                    _a.apply(void 0, [_h.sent()]).toBe(true, 'Search options not displayed');
                    _b = expect;
                    return [4 /*yield*/, searchInput.isFilesOptionEnabled()];
                case 3:
                    _b.apply(void 0, [_h.sent()]).toBe(true, 'Files option not enabled');
                    _c = expect;
                    return [4 /*yield*/, searchInput.isFoldersOptionEnabled()];
                case 4:
                    _c.apply(void 0, [_h.sent()]).toBe(true, 'Folders option not enabled');
                    _d = expect;
                    return [4 /*yield*/, searchInput.isLibrariesOptionEnabled()];
                case 5:
                    _d.apply(void 0, [_h.sent()]).toBe(true, 'Libraries option not enabled');
                    _e = expect;
                    return [4 /*yield*/, searchInput.isFilesOptionChecked()];
                case 6:
                    _e.apply(void 0, [_h.sent()]).toBe(false, 'Files option is checked');
                    _f = expect;
                    return [4 /*yield*/, searchInput.isFoldersOptionChecked()];
                case 7:
                    _f.apply(void 0, [_h.sent()]).toBe(false, 'Folders option is checked');
                    _g = expect;
                    return [4 /*yield*/, searchInput.isLibrariesOptionChecked()];
                case 8:
                    _g.apply(void 0, [_h.sent()]).toBe(false, 'Libraries option is checked');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Search options are correctly enabled / disabled - [C289849]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return tslib_1.__generator(this, function (_o) {
            switch (_o.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _o.sent();
                    return [4 /*yield*/, searchInput.clickFilesOption()];
                case 2:
                    _o.sent();
                    _a = expect;
                    return [4 /*yield*/, searchInput.isFoldersOptionEnabled()];
                case 3:
                    _a.apply(void 0, [_o.sent()]).toBe(true, 'Folders option not enabled');
                    _b = expect;
                    return [4 /*yield*/, searchInput.isLibrariesOptionEnabled()];
                case 4:
                    _b.apply(void 0, [_o.sent()]).toBe(false, 'Libraries option not disabled');
                    return [4 /*yield*/, searchInput.clickFilesOption()];
                case 5:
                    _o.sent();
                    _c = expect;
                    return [4 /*yield*/, searchInput.isFoldersOptionEnabled()];
                case 6:
                    _c.apply(void 0, [_o.sent()]).toBe(true, 'Folders option not enabled');
                    _d = expect;
                    return [4 /*yield*/, searchInput.isLibrariesOptionEnabled()];
                case 7:
                    _d.apply(void 0, [_o.sent()]).toBe(true, 'Folders option not enabled');
                    return [4 /*yield*/, searchInput.clickFoldersOption()];
                case 8:
                    _o.sent();
                    _e = expect;
                    return [4 /*yield*/, searchInput.isFilesOptionEnabled()];
                case 9:
                    _e.apply(void 0, [_o.sent()]).toBe(true, 'Files option not enabled');
                    _f = expect;
                    return [4 /*yield*/, searchInput.isLibrariesOptionEnabled()];
                case 10:
                    _f.apply(void 0, [_o.sent()]).toBe(false, 'Libraries option not disabled');
                    return [4 /*yield*/, searchInput.clickFoldersOption()];
                case 11:
                    _o.sent();
                    _g = expect;
                    return [4 /*yield*/, searchInput.isFilesOptionEnabled()];
                case 12:
                    _g.apply(void 0, [_o.sent()]).toBe(true, 'Files option not enabled');
                    _h = expect;
                    return [4 /*yield*/, searchInput.isLibrariesOptionEnabled()];
                case 13:
                    _h.apply(void 0, [_o.sent()]).toBe(true, 'Libraries option not enabled');
                    return [4 /*yield*/, searchInput.clickLibrariesOption()];
                case 14:
                    _o.sent();
                    _j = expect;
                    return [4 /*yield*/, searchInput.isFilesOptionEnabled()];
                case 15:
                    _j.apply(void 0, [_o.sent()]).toBe(false, 'Files option not disabled');
                    _k = expect;
                    return [4 /*yield*/, searchInput.isFoldersOptionEnabled()];
                case 16:
                    _k.apply(void 0, [_o.sent()]).toBe(false, 'Folders option not disabled');
                    return [4 /*yield*/, searchInput.clickLibrariesOption()];
                case 17:
                    _o.sent();
                    _l = expect;
                    return [4 /*yield*/, searchInput.isFilesOptionEnabled()];
                case 18:
                    _l.apply(void 0, [_o.sent()]).toBe(true, 'Files option not enabled');
                    _m = expect;
                    return [4 /*yield*/, searchInput.isFoldersOptionEnabled()];
                case 19:
                    _m.apply(void 0, [_o.sent()]).toBe(true, 'Folders option not enabled');
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=search-input.test.js.map