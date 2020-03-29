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
import { APP_ROUTES, SIDEBAR_LABELS } from '../../configs';
import { LoginPage, BrowsingPage, SearchResultsPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
describe('Sidebar', function () {
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var sidenav = page.sidenav, header = page.header;
    var searchResultsPage = new SearchResultsPage();
    var searchInput = searchResultsPage.header.searchInput;
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
                    return [4 /*yield*/, header.expandSideNav()];
                case 2:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('has "Personal Files" as default - [C217149]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, browser.getCurrentUrl()];
                case 1:
                    _a.apply(void 0, [_c.sent()]).toContain(APP_ROUTES.PERSONAL_FILES);
                    _b = expect;
                    return [4 /*yield*/, sidenav.isActive(SIDEBAR_LABELS.PERSONAL_FILES)];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toBe(true, 'Default active link');
                    return [2 /*return*/];
            }
        });
    }); });
    it('File Libraries has correct sub-categories - [C217150]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, page.clickFileLibraries()];
                case 1:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, sidenav.isFileLibrariesMenuExpanded()];
                case 2:
                    _a.apply(void 0, [_d.sent()]).toBe(true, 'File Libraries not expanded');
                    _b = expect;
                    return [4 /*yield*/, sidenav.getLink(SIDEBAR_LABELS.MY_LIBRARIES).isPresent()];
                case 3:
                    _b.apply(void 0, [_d.sent()]).toBe(true, 'My Libraries link not present');
                    _c = expect;
                    return [4 /*yield*/, sidenav.getLink(SIDEBAR_LABELS.FAVORITE_LIBRARIES).isPresent()];
                case 4:
                    _c.apply(void 0, [_d.sent()]).toBe(true, 'Favorite Libraries link not present');
                    return [2 /*return*/];
            }
        });
    }); });
    it('My Libraries is automatically selected on expanding File Libraries - [C289900]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, sidenav.expandFileLibraries()];
                case 1:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, browser.getCurrentUrl()];
                case 2:
                    _a.apply(void 0, [_d.sent()]).toContain(APP_ROUTES.MY_LIBRARIES);
                    _b = expect;
                    return [4 /*yield*/, sidenav.isActive(SIDEBAR_LABELS.FILE_LIBRARIES)];
                case 3:
                    _b.apply(void 0, [_d.sent()]).toBe(true, 'File Libraries is not active');
                    _c = expect;
                    return [4 /*yield*/, sidenav.isActive(SIDEBAR_LABELS.MY_LIBRARIES)];
                case 4:
                    _c.apply(void 0, [_d.sent()]).toBe(true, 'My Libraries link not active');
                    return [2 /*return*/];
            }
        });
    }); });
    it('navigate to Favorite Libraries - [C289902]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, page.goToFavoriteLibraries()];
                case 1:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, browser.getCurrentUrl()];
                case 2:
                    _a.apply(void 0, [_d.sent()]).toContain(APP_ROUTES.FAVORITE_LIBRARIES);
                    _b = expect;
                    return [4 /*yield*/, sidenav.isActive(SIDEBAR_LABELS.FILE_LIBRARIES)];
                case 3:
                    _b.apply(void 0, [_d.sent()]).toBe(true, 'File Libraries link is not active');
                    _c = expect;
                    return [4 /*yield*/, sidenav.isActive(SIDEBAR_LABELS.FAVORITE_LIBRARIES)];
                case 4:
                    _c.apply(void 0, [_d.sent()]).toBe(true, 'Favorite Libraries link not active');
                    return [2 /*return*/];
            }
        });
    }); });
    it('navigate to My Libraries - [C289901]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, page.goToMyLibraries()];
                case 1:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, browser.getCurrentUrl()];
                case 2:
                    _a.apply(void 0, [_d.sent()]).toContain(APP_ROUTES.MY_LIBRARIES);
                    _b = expect;
                    return [4 /*yield*/, sidenav.isActive(SIDEBAR_LABELS.FILE_LIBRARIES)];
                case 3:
                    _b.apply(void 0, [_d.sent()]).toBe(true, 'File Libraries link is not active');
                    _c = expect;
                    return [4 /*yield*/, sidenav.isActive(SIDEBAR_LABELS.MY_LIBRARIES)];
                case 4:
                    _c.apply(void 0, [_d.sent()]).toBe(true, 'My Libraries link not active');
                    return [2 /*return*/];
            }
        });
    }); });
    it('navigates to "Shared Files" - [C213110]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.clickSharedFiles()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, browser.getCurrentUrl()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toContain(APP_ROUTES.SHARED_FILES);
                    _b = expect;
                    return [4 /*yield*/, sidenav.isActive(SIDEBAR_LABELS.SHARED_FILES)];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe(true, 'Shared Files link not active');
                    return [2 /*return*/];
            }
        });
    }); });
    it('navigates to "Recent Files" - [C213166]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.clickRecentFiles()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, browser.getCurrentUrl()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toContain(APP_ROUTES.RECENT_FILES);
                    _b = expect;
                    return [4 /*yield*/, sidenav.isActive(SIDEBAR_LABELS.RECENT_FILES)];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe(true, 'Recent Files link not active');
                    return [2 /*return*/];
            }
        });
    }); });
    it('navigates to "Favorites" - [C213225]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.clickFavorites()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, browser.getCurrentUrl()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toContain(APP_ROUTES.FAVORITES);
                    _b = expect;
                    return [4 /*yield*/, sidenav.isActive(SIDEBAR_LABELS.FAVORITES)];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe(true, 'Favorites link not active');
                    return [2 /*return*/];
            }
        });
    }); });
    it('navigates to "Trash" - [C213216]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.clickTrash()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, browser.getCurrentUrl()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toContain(APP_ROUTES.TRASHCAN);
                    _b = expect;
                    return [4 /*yield*/, sidenav.isActive(SIDEBAR_LABELS.TRASH)];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe(true, 'Trash link not active');
                    return [2 /*return*/];
            }
        });
    }); });
    it('navigates to "Personal Files" - [C280409]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.clickPersonalFiles()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, browser.getCurrentUrl()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toContain(APP_ROUTES.PERSONAL_FILES);
                    _b = expect;
                    return [4 /*yield*/, sidenav.isActive(SIDEBAR_LABELS.PERSONAL_FILES)];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe(true, 'Personal Files link not active');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Personal Files tooltip - [C217151]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.clickPersonalFiles()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, sidenav.getLinkTooltip(SIDEBAR_LABELS.PERSONAL_FILES)];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toContain('View your Personal Files');
                    return [4 /*yield*/, header.collapseSideNav()];
                case 3:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, sidenav.getLinkTooltip(SIDEBAR_LABELS.PERSONAL_FILES)];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toContain('View your Personal Files');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Shared Files tooltip - [C213111]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.clickSharedFiles()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, sidenav.getLinkTooltip(SIDEBAR_LABELS.SHARED_FILES)];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toContain('View files that have been shared');
                    return [4 /*yield*/, header.collapseSideNav()];
                case 3:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, sidenav.getLinkTooltip(SIDEBAR_LABELS.SHARED_FILES)];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toContain('View files that have been shared');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Recent Files tooltip - [C213167]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.clickRecentFiles()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, sidenav.getLinkTooltip(SIDEBAR_LABELS.RECENT_FILES)];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toContain('View files you recently edited');
                    return [4 /*yield*/, header.collapseSideNav()];
                case 3:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, sidenav.getLinkTooltip(SIDEBAR_LABELS.RECENT_FILES)];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toContain('View files you recently edited');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Favorites tooltip - [C217153]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.clickFavorites()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, sidenav.getLinkTooltip(SIDEBAR_LABELS.FAVORITES)];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toContain('View your favorite files and folders');
                    return [4 /*yield*/, header.collapseSideNav()];
                case 3:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, sidenav.getLinkTooltip(SIDEBAR_LABELS.FAVORITES)];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toContain('View your favorite files and folders');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Trash tooltip - [C217154]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.clickTrash()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, sidenav.getLinkTooltip(SIDEBAR_LABELS.TRASH)];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toContain('View deleted files in the trash');
                    return [4 /*yield*/, header.collapseSideNav()];
                case 3:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, sidenav.getLinkTooltip(SIDEBAR_LABELS.TRASH)];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toContain('View deleted files in the trash');
                    return [2 /*return*/];
            }
        });
    }); });
    it('File Libraries tooltip - [C217152]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.clickFileLibraries()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, sidenav.getLinkTooltip(SIDEBAR_LABELS.FILE_LIBRARIES)];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toContain('File Libraries');
                    return [4 /*yield*/, header.collapseSideNav()];
                case 3:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, sidenav.getLinkTooltip(SIDEBAR_LABELS.FILE_LIBRARIES)];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toContain('File Libraries');
                    return [2 /*return*/];
            }
        });
    }); });
    it('My Libraries tooltip - [C289916]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.goToMyLibraries()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, sidenav.getLinkTooltip(SIDEBAR_LABELS.MY_LIBRARIES)];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toContain('Access my libraries');
                    return [4 /*yield*/, header.collapseSideNav()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, sidenav.clickLink(SIDEBAR_LABELS.FILE_LIBRARIES)];
                case 4:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, sidenav.getLinkTooltip(SIDEBAR_LABELS.MY_LIBRARIES)];
                case 5:
                    _b.apply(void 0, [_c.sent()]).toContain('Access my libraries');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Favorite Libraries tooltip - [C289917]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.goToFavoriteLibraries()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, sidenav.getLinkTooltip(SIDEBAR_LABELS.FAVORITE_LIBRARIES)];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toContain('Access my favorite libraries');
                    return [4 /*yield*/, header.collapseSideNav()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, sidenav.clickLink(SIDEBAR_LABELS.FILE_LIBRARIES)];
                case 4:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, sidenav.getLinkTooltip(SIDEBAR_LABELS.FAVORITE_LIBRARIES)];
                case 5:
                    _b.apply(void 0, [_c.sent()]).toContain('Access my favorite libraries');
                    return [2 /*return*/];
            }
        });
    }); });
    it('default state is expanded - [C269095]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, header.isSidenavExpanded()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBe(true, 'Sidebar not expanded');
                    return [2 /*return*/];
            }
        });
    }); });
    it('sidebar toggle - [C269096]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, header.collapseSideNav()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, header.isSidenavExpanded()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe(false, 'Sidebar not collapsed');
                    return [4 /*yield*/, header.expandSideNav()];
                case 3:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, header.isSidenavExpanded()];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe(true, 'Sidebar not expanded');
                    return [2 /*return*/];
            }
        });
    }); });
    it('sidebar state is preserved on page refresh - [C269100]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, header.isSidenavExpanded()];
                case 1:
                    _a.apply(void 0, [_e.sent()]).toBe(true, 'Sidebar not expanded');
                    return [4 /*yield*/, page.refresh()];
                case 2:
                    _e.sent();
                    _b = expect;
                    return [4 /*yield*/, header.isSidenavExpanded()];
                case 3:
                    _b.apply(void 0, [_e.sent()]).toBe(true, 'Sidebar not expanded');
                    return [4 /*yield*/, header.collapseSideNav()];
                case 4:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, header.isSidenavExpanded()];
                case 5:
                    _c.apply(void 0, [_e.sent()]).toBe(false, 'Sidebar not collapsed');
                    return [4 /*yield*/, page.refresh()];
                case 6:
                    _e.sent();
                    _d = expect;
                    return [4 /*yield*/, header.isSidenavExpanded()];
                case 7:
                    _d.apply(void 0, [_e.sent()]).toBe(false, 'Sidebar not collapsed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('sidebar state is preserved after logout / login - [C269102]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, header.collapseSideNav()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, page.signOut()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, loginPage.loginWithAdmin()];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, header.isSidenavExpanded()];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBe(false, 'Sidebar not collapsed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('sidebar is collapsed automatically when Search Results opens - [C277223]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                    return [4 /*yield*/, searchResultsPage.waitForResults()];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, header.isSidenavExpanded()];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBe(false, 'Sidebar not collapsed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('sidenav returns to the default state when navigating away from the Search Results page - [C277224]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                    return [4 /*yield*/, searchResultsPage.waitForResults()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, page.clickFavorites()];
                case 4:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, header.isSidenavExpanded()];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toBe(true, 'Sidebar not expanded');
                    return [2 /*return*/];
            }
        });
    }); });
    it('sidenav can be expanded when search results page is displayed - [C277230]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                    return [4 /*yield*/, searchResultsPage.waitForResults()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, header.expandSideNav()];
                case 4:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, header.isSidenavExpanded()];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toBe(true, 'Sidebar not expanded');
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=sidebar.test.js.map