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
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { InfoDrawer } from './../../components/info-drawer/info-drawer';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { EXTENSIBILITY_CONFIGS } from '../../configs';
import { Utils } from '../../utilities/utils';
describe('Extensions - Info Drawer', function () {
    var username = "user-" + Utils.random();
    var file = "file-" + Utils.random() + ".txt";
    var fileId;
    var properties_tab = {
        order: 1,
        title: 'MY PROPERTIES'
    };
    var custom_tab = {
        order: 2,
        icon: 'mood',
        title: 'MY CUSTOM TITLE',
        component: 'app.toolbar.toggleFavorite'
    };
    var no_title_tab = {
        order: 3,
        icon: 'check_circle',
        title: ''
    };
    var comments_tab = {
        title: 'COMMENTS'
    };
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var infoDrawer = new InfoDrawer();
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(file)];
                case 2:
                    fileId = (_a.sent()).entry.id;
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(fileId)];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.load()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Utils.setSessionStorageFromConfig(EXTENSIBILITY_CONFIGS.INFO_DRAWER)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginWith(username)];
                    case 3:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.dataTable.clearSelection()];
                    case 2:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Add a new tab with icon and title - [C284646]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var val, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.dataTable.selectItem(file)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, infoDrawer.getTabTitle(custom_tab.order)];
                    case 4:
                        val = _b.sent();
                        _a = expect;
                        return [4 /*yield*/, infoDrawer.isTabPresent(custom_tab.title)];
                    case 5:
                        _a.apply(void 0, [_b.sent()]).toBe(true, custom_tab.title + " tab is not present");
                        expect(val.trim()).toEqual((custom_tab.icon + "\n" + custom_tab.title).trim());
                        return [2 /*return*/];
                }
            });
        }); });
        it('Remove existing tab - [C284647]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.dataTable.selectItem(file)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, infoDrawer.isTabPresent(comments_tab.title)];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toBe(false, comments_tab.title + " tab should not be present!");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Change tab title - [C284648]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.dataTable.selectItem(file)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, infoDrawer.isTabPresent(properties_tab.title)];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(true, properties_tab.title + " tab is not present");
                        _b = expect;
                        return [4 /*yield*/, infoDrawer.getTabTitle(properties_tab.order)];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toEqual(properties_tab.title);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Tab with icon and no title - [C284649]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.dataTable.selectItem(file)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, infoDrawer.isTabPresent(no_title_tab.title)];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(true, no_title_tab.title + " tab is not present");
                        _b = expect;
                        return [4 /*yield*/, infoDrawer.getTabTitle(no_title_tab.order)];
                    case 5:
                        _b.apply(void 0, [(_c.sent()).trim()]).toEqual(("" + no_title_tab.icon).trim());
                        return [2 /*return*/];
                }
            });
        }); });
        it('Insert new component in tab - [C284651]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.dataTable.selectItem(file)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, infoDrawer.isTabDisplayed(custom_tab.title)];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(true, custom_tab.title + " tab is not displayed");
                        return [4 /*yield*/, infoDrawer.clickTab(custom_tab.title)];
                    case 5:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, infoDrawer.getComponentIdOfTab()];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toEqual(custom_tab.component);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.load()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Utils.setSessionStorageFromConfig(EXTENSIBILITY_CONFIGS.INFO_DRAWER_EMPTY)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginWith(username)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 4:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Remove all tabs - [C284650]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.dataTable.selectItem(file)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, infoDrawer.isEmpty()];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Info Drawer is not empty');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=ext-info-drawer.test.js.map