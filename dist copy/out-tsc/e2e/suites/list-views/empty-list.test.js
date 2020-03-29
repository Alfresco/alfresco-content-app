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
import { LoginPage, BrowsingPage, SearchResultsPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';
describe('Empty list views', function () {
    var username = "user-" + Utils.random();
    var password = username;
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, password)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var searchResultsPage = new SearchResultsPage();
    var dataTable = page.dataTable, pagination = page.pagination;
    var searchInput = page.header.searchInput;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 2:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('empty Personal Files - [C280131]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.clickPersonalFiles()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isEmpty()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe(true, 'list is not empty');
                    _b = expect;
                    return [4 /*yield*/, dataTable.getEmptyDragAndDropText()];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toContain('Drag and drop');
                    return [2 /*return*/];
            }
        });
    }); });
    it('empty My Libraries - [C217099]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, page.goToMyLibraries()];
                case 1:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isEmpty()];
                case 2:
                    _a.apply(void 0, [_d.sent()]).toBe(true, 'list is not empty');
                    _b = expect;
                    return [4 /*yield*/, dataTable.getEmptyStateTitle()];
                case 3:
                    _b.apply(void 0, [_d.sent()]).toContain("You aren't a member of any File Libraries yet");
                    _c = expect;
                    return [4 /*yield*/, dataTable.getEmptyStateSubtitle()];
                case 4:
                    _c.apply(void 0, [_d.sent()]).toContain('Join libraries to upload, view, and share files.');
                    return [2 /*return*/];
            }
        });
    }); });
    it('empty Favorite Libraries - [C289911]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, page.goToFavoriteLibraries()];
                case 1:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isEmpty()];
                case 2:
                    _a.apply(void 0, [_d.sent()]).toBe(true, 'list is not empty');
                    _b = expect;
                    return [4 /*yield*/, dataTable.getEmptyStateTitle()];
                case 3:
                    _b.apply(void 0, [_d.sent()]).toContain("No Favorite Libraries");
                    _c = expect;
                    return [4 /*yield*/, dataTable.getEmptyStateSubtitle()];
                case 4:
                    _c.apply(void 0, [_d.sent()]).toContain('Favorite a library that you want to find easily later.');
                    return [2 /*return*/];
            }
        });
    }); });
    it('empty Shared Files - [C280132]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, page.clickSharedFiles()];
                case 1:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isEmpty()];
                case 2:
                    _a.apply(void 0, [_d.sent()]).toBe(true, 'list is not empty');
                    _b = expect;
                    return [4 /*yield*/, dataTable.getEmptyStateTitle()];
                case 3:
                    _b.apply(void 0, [_d.sent()]).toContain('No shared files or folders');
                    _c = expect;
                    return [4 /*yield*/, dataTable.getEmptyStateSubtitle()];
                case 4:
                    _c.apply(void 0, [_d.sent()]).toContain('Items you share using the Share option are shown here.');
                    return [2 /*return*/];
            }
        });
    }); });
    it('empty Recent Files - [C213169]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, page.clickRecentFiles()];
                case 1:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isEmpty()];
                case 2:
                    _a.apply(void 0, [_d.sent()]).toBe(true, 'list is not empty');
                    _b = expect;
                    return [4 /*yield*/, dataTable.getEmptyStateTitle()];
                case 3:
                    _b.apply(void 0, [_d.sent()]).toContain('No recent files');
                    _c = expect;
                    return [4 /*yield*/, dataTable.getEmptyStateSubtitle()];
                case 4:
                    _c.apply(void 0, [_d.sent()]).toContain('Items you uploaded or edited in the last 30 days are shown here.');
                    return [2 /*return*/];
            }
        });
    }); });
    it('empty Favorites - [C280133]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, page.clickFavorites()];
                case 1:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isEmpty()];
                case 2:
                    _a.apply(void 0, [_d.sent()]).toBe(true, 'list is not empty');
                    _b = expect;
                    return [4 /*yield*/, dataTable.getEmptyStateTitle()];
                case 3:
                    _b.apply(void 0, [_d.sent()]).toContain('No favorite files or folders');
                    _c = expect;
                    return [4 /*yield*/, dataTable.getEmptyStateSubtitle()];
                case 4:
                    _c.apply(void 0, [_d.sent()]).toContain('Favorite items that you want to easily find later.');
                    return [2 /*return*/];
            }
        });
    }); });
    it('empty Trash - [C280134]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, page.clickTrash()];
                case 1:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isEmpty()];
                case 2:
                    _a.apply(void 0, [_e.sent()]).toBe(true, 'list is not empty');
                    _b = expect;
                    return [4 /*yield*/, dataTable.getEmptyStateTitle()];
                case 3:
                    _b.apply(void 0, [_e.sent()]).toContain('Trash is empty');
                    _c = expect;
                    return [4 /*yield*/, dataTable.getEmptyListText()];
                case 4:
                    _c.apply(void 0, [_e.sent()]).toContain('Items you delete are moved to the Trash.');
                    _d = expect;
                    return [4 /*yield*/, dataTable.getEmptyListText()];
                case 5:
                    _d.apply(void 0, [_e.sent()]).toContain('Empty Trash to permanently delete items.');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Favorites - pagination controls not displayed - [C280111]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, page.clickFavorites()];
                case 1:
                    _g.sent();
                    _a = expect;
                    return [4 /*yield*/, pagination.isRangePresent()];
                case 2:
                    _a.apply(void 0, [_g.sent()]).toBe(false, 'Range is present');
                    _b = expect;
                    return [4 /*yield*/, pagination.isMaxItemsPresent()];
                case 3:
                    _b.apply(void 0, [_g.sent()]).toBe(false, 'Max items is present');
                    _c = expect;
                    return [4 /*yield*/, pagination.isCurrentPagePresent()];
                case 4:
                    _c.apply(void 0, [_g.sent()]).toBe(false, 'Current page is present');
                    _d = expect;
                    return [4 /*yield*/, pagination.isTotalPagesPresent()];
                case 5:
                    _d.apply(void 0, [_g.sent()]).toBe(false, 'Total pages is present');
                    _e = expect;
                    return [4 /*yield*/, pagination.isPreviousButtonPresent()];
                case 6:
                    _e.apply(void 0, [_g.sent()]).toBe(false, 'Previous button is present');
                    _f = expect;
                    return [4 /*yield*/, pagination.isNextButtonPresent()];
                case 7:
                    _f.apply(void 0, [_g.sent()]).toBe(false, 'Next button is present');
                    return [2 /*return*/];
            }
        });
    }); });
    it('My Libraries - pagination controls not displayed - [C280084]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, page.goToMyLibraries()];
                case 1:
                    _g.sent();
                    _a = expect;
                    return [4 /*yield*/, pagination.isRangePresent()];
                case 2:
                    _a.apply(void 0, [_g.sent()]).toBe(false, 'Range is present');
                    _b = expect;
                    return [4 /*yield*/, pagination.isMaxItemsPresent()];
                case 3:
                    _b.apply(void 0, [_g.sent()]).toBe(false, 'Max items is present');
                    _c = expect;
                    return [4 /*yield*/, pagination.isCurrentPagePresent()];
                case 4:
                    _c.apply(void 0, [_g.sent()]).toBe(false, 'Current page is present');
                    _d = expect;
                    return [4 /*yield*/, pagination.isTotalPagesPresent()];
                case 5:
                    _d.apply(void 0, [_g.sent()]).toBe(false, 'Total pages is present');
                    _e = expect;
                    return [4 /*yield*/, pagination.isPreviousButtonPresent()];
                case 6:
                    _e.apply(void 0, [_g.sent()]).toBe(false, 'Previous button is present');
                    _f = expect;
                    return [4 /*yield*/, pagination.isNextButtonPresent()];
                case 7:
                    _f.apply(void 0, [_g.sent()]).toBe(false, 'Next button is present');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Favorite Libraries - pagination controls not displayed - [C291873]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, page.goToFavoriteLibraries()];
                case 1:
                    _g.sent();
                    _a = expect;
                    return [4 /*yield*/, pagination.isRangePresent()];
                case 2:
                    _a.apply(void 0, [_g.sent()]).toBe(false, 'Range is present');
                    _b = expect;
                    return [4 /*yield*/, pagination.isMaxItemsPresent()];
                case 3:
                    _b.apply(void 0, [_g.sent()]).toBe(false, 'Max items is present');
                    _c = expect;
                    return [4 /*yield*/, pagination.isCurrentPagePresent()];
                case 4:
                    _c.apply(void 0, [_g.sent()]).toBe(false, 'Current page is present');
                    _d = expect;
                    return [4 /*yield*/, pagination.isTotalPagesPresent()];
                case 5:
                    _d.apply(void 0, [_g.sent()]).toBe(false, 'Total pages is present');
                    _e = expect;
                    return [4 /*yield*/, pagination.isPreviousButtonPresent()];
                case 6:
                    _e.apply(void 0, [_g.sent()]).toBe(false, 'Previous button is present');
                    _f = expect;
                    return [4 /*yield*/, pagination.isNextButtonPresent()];
                case 7:
                    _f.apply(void 0, [_g.sent()]).toBe(false, 'Next button is present');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Personal Files - pagination controls not displayed - [C280075]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, page.clickPersonalFiles()];
                case 1:
                    _g.sent();
                    _a = expect;
                    return [4 /*yield*/, pagination.isRangePresent()];
                case 2:
                    _a.apply(void 0, [_g.sent()]).toBe(false, 'Range is present');
                    _b = expect;
                    return [4 /*yield*/, pagination.isMaxItemsPresent()];
                case 3:
                    _b.apply(void 0, [_g.sent()]).toBe(false, 'Max items is present');
                    _c = expect;
                    return [4 /*yield*/, pagination.isCurrentPagePresent()];
                case 4:
                    _c.apply(void 0, [_g.sent()]).toBe(false, 'Current page is present');
                    _d = expect;
                    return [4 /*yield*/, pagination.isTotalPagesPresent()];
                case 5:
                    _d.apply(void 0, [_g.sent()]).toBe(false, 'Total pages is present');
                    _e = expect;
                    return [4 /*yield*/, pagination.isPreviousButtonPresent()];
                case 6:
                    _e.apply(void 0, [_g.sent()]).toBe(false, 'Previous button is present');
                    _f = expect;
                    return [4 /*yield*/, pagination.isNextButtonPresent()];
                case 7:
                    _f.apply(void 0, [_g.sent()]).toBe(false, 'Next button is present');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Recent Files - pagination controls not displayed - [C280102]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, page.clickRecentFiles()];
                case 1:
                    _g.sent();
                    _a = expect;
                    return [4 /*yield*/, pagination.isRangePresent()];
                case 2:
                    _a.apply(void 0, [_g.sent()]).toBe(false, 'Range is present');
                    _b = expect;
                    return [4 /*yield*/, pagination.isMaxItemsPresent()];
                case 3:
                    _b.apply(void 0, [_g.sent()]).toBe(false, 'Max items is present');
                    _c = expect;
                    return [4 /*yield*/, pagination.isCurrentPagePresent()];
                case 4:
                    _c.apply(void 0, [_g.sent()]).toBe(false, 'Current page is present');
                    _d = expect;
                    return [4 /*yield*/, pagination.isTotalPagesPresent()];
                case 5:
                    _d.apply(void 0, [_g.sent()]).toBe(false, 'Total pages is present');
                    _e = expect;
                    return [4 /*yield*/, pagination.isPreviousButtonPresent()];
                case 6:
                    _e.apply(void 0, [_g.sent()]).toBe(false, 'Previous button is present');
                    _f = expect;
                    return [4 /*yield*/, pagination.isNextButtonPresent()];
                case 7:
                    _f.apply(void 0, [_g.sent()]).toBe(false, 'Next button is present');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Shared Files - pagination controls not displayed - [C280094]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, page.clickSharedFiles()];
                case 1:
                    _g.sent();
                    _a = expect;
                    return [4 /*yield*/, pagination.isRangePresent()];
                case 2:
                    _a.apply(void 0, [_g.sent()]).toBe(false, 'Range is present');
                    _b = expect;
                    return [4 /*yield*/, pagination.isMaxItemsPresent()];
                case 3:
                    _b.apply(void 0, [_g.sent()]).toBe(false, 'Max items is present');
                    _c = expect;
                    return [4 /*yield*/, pagination.isCurrentPagePresent()];
                case 4:
                    _c.apply(void 0, [_g.sent()]).toBe(false, 'Current page is present');
                    _d = expect;
                    return [4 /*yield*/, pagination.isTotalPagesPresent()];
                case 5:
                    _d.apply(void 0, [_g.sent()]).toBe(false, 'Total pages is present');
                    _e = expect;
                    return [4 /*yield*/, pagination.isPreviousButtonPresent()];
                case 6:
                    _e.apply(void 0, [_g.sent()]).toBe(false, 'Previous button is present');
                    _f = expect;
                    return [4 /*yield*/, pagination.isNextButtonPresent()];
                case 7:
                    _f.apply(void 0, [_g.sent()]).toBe(false, 'Next button is present');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Trash - pagination controls not displayed - [C280120]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, page.clickTrash()];
                case 1:
                    _g.sent();
                    _a = expect;
                    return [4 /*yield*/, pagination.isRangePresent()];
                case 2:
                    _a.apply(void 0, [_g.sent()]).toBe(false, 'Range is present');
                    _b = expect;
                    return [4 /*yield*/, pagination.isMaxItemsPresent()];
                case 3:
                    _b.apply(void 0, [_g.sent()]).toBe(false, 'Max items is present');
                    _c = expect;
                    return [4 /*yield*/, pagination.isCurrentPagePresent()];
                case 4:
                    _c.apply(void 0, [_g.sent()]).toBe(false, 'Current page is present');
                    _d = expect;
                    return [4 /*yield*/, pagination.isTotalPagesPresent()];
                case 5:
                    _d.apply(void 0, [_g.sent()]).toBe(false, 'Total pages is present');
                    _e = expect;
                    return [4 /*yield*/, pagination.isPreviousButtonPresent()];
                case 6:
                    _e.apply(void 0, [_g.sent()]).toBe(false, 'Previous button is present');
                    _f = expect;
                    return [4 /*yield*/, pagination.isNextButtonPresent()];
                case 7:
                    _f.apply(void 0, [_g.sent()]).toBe(false, 'Next button is present');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Search results - pagination controls not displayed - [C290123]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _g.sent();
                    /* cspell:disable-next-line */
                    return [4 /*yield*/, searchInput.searchFor('qwertyuiop')];
                case 2:
                    /* cspell:disable-next-line */
                    _g.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 3:
                    _g.sent();
                    _a = expect;
                    return [4 /*yield*/, pagination.isRangePresent()];
                case 4:
                    _a.apply(void 0, [_g.sent()]).toBe(false, 'Range is present');
                    _b = expect;
                    return [4 /*yield*/, pagination.isMaxItemsPresent()];
                case 5:
                    _b.apply(void 0, [_g.sent()]).toBe(false, 'Max items is present');
                    _c = expect;
                    return [4 /*yield*/, pagination.isCurrentPagePresent()];
                case 6:
                    _c.apply(void 0, [_g.sent()]).toBe(false, 'Current page is present');
                    _d = expect;
                    return [4 /*yield*/, pagination.isTotalPagesPresent()];
                case 7:
                    _d.apply(void 0, [_g.sent()]).toBe(false, 'Total pages is present');
                    _e = expect;
                    return [4 /*yield*/, pagination.isPreviousButtonPresent()];
                case 8:
                    _e.apply(void 0, [_g.sent()]).toBe(false, 'Previous button is present');
                    _f = expect;
                    return [4 /*yield*/, pagination.isNextButtonPresent()];
                case 9:
                    _f.apply(void 0, [_g.sent()]).toBe(false, 'Next button is present');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Search filters panel is not displayed on empty Search Results page - [C279189]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _b.sent();
                    /* cspell:disable-next-line */
                    return [4 /*yield*/, searchInput.searchFor('qwertyuiop')];
                case 2:
                    /* cspell:disable-next-line */
                    _b.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, searchResultsPage.filters.isSearchFiltersPanelDisplayed()];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBe(false, 'Search filters panel is present');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Empty Search results - Libraries - [C290020]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, searchInput.checkLibraries()];
                case 2:
                    _c.sent();
                    /* cspell:disable-next-line */
                    return [4 /*yield*/, searchInput.searchFor('qwertyuiop')];
                case 3:
                    /* cspell:disable-next-line */
                    _c.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isEmpty()];
                case 5:
                    _a.apply(void 0, [_c.sent()]).toBe(true, 'list is not empty');
                    _b = expect;
                    return [4 /*yield*/, dataTable.getEmptySearchResultsText()];
                case 6:
                    _b.apply(void 0, [_c.sent()]).toContain('Your search returned 0 results');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Empty Search results - Files / Folders - [C290031]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                case 2:
                    _c.sent();
                    /* cspell:disable-next-line */
                    return [4 /*yield*/, searchInput.searchFor('qwertyuiop')];
                case 3:
                    /* cspell:disable-next-line */
                    _c.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isEmpty()];
                case 5:
                    _a.apply(void 0, [_c.sent()]).toBe(true, 'list is not empty');
                    _b = expect;
                    return [4 /*yield*/, dataTable.getEmptySearchResultsText()];
                case 6:
                    _b.apply(void 0, [_c.sent()]).toContain('Your search returned 0 results');
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=empty-list.test.js.map