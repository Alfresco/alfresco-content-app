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
import { SITE_VISIBILITY, SITE_ROLES } from '../../configs';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { ConfirmDialog } from './../../components/components';
import { RepoClient } from '../../utilities/repo-client/repo-client';
describe('Library actions', function () {
    var username = "user-" + Utils.random();
    var sitePublic1Admin = "admin-public1-" + Utils.random();
    var sitePublic2Admin = "admin-public2-" + Utils.random();
    var sitePublic3Admin = "admin-public3-" + Utils.random();
    var sitePublic4Admin = "admin-public4-" + Utils.random();
    var sitePublic5Admin = "admin-public5-" + Utils.random();
    var sitePublic6Admin = "admin-public6-" + Utils.random();
    var sitePublic7Admin = "admin-public7-" + Utils.random();
    var sitePublic8Admin = "admin-public8-" + Utils.random();
    var sitePublicUser = "user-public1-" + Utils.random();
    var siteForDelete1 = "user-public2-" + Utils.random();
    var siteForDelete2 = "user-public3-" + Utils.random();
    var siteModerated1Admin = "admin-moderated1-" + Utils.random();
    var siteModerated2Admin = "admin-moderated2-" + Utils.random();
    var siteSearchModerated1Admin = "site-moderated-search-1-" + Utils.random();
    var siteSearchModerated2Admin = "site-moderated-search-2-" + Utils.random();
    var siteSearchPublic1Admin = "site-public-search-1-" + Utils.random();
    var siteSearchPublic2Admin = "site-public-search-2-" + Utils.random();
    var siteSearchPublic3Admin = "site-public-search-3-" + Utils.random();
    var siteSearchPublic4Admin = "site-public-search-4-" + Utils.random();
    var siteSearchForDelete = "site-public-search-5-" + Utils.random();
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable, toolbar = page.toolbar;
    var searchInput = page.header.searchInput;
    var confirmDialog = new ConfirmDialog();
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(siteSearchPublic1Admin)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(siteSearchPublic2Admin)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(siteSearchPublic3Admin)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(siteSearchPublic4Admin)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(siteSearchModerated1Admin, SITE_VISIBILITY.MODERATED)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(siteSearchModerated2Admin, SITE_VISIBILITY.MODERATED)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(siteSearchForDelete)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, apis.user.queries.waitForSites('site-public-search', { expect: 5 })];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, apis.user.queries.waitForSites('site-moderated-search', { expect: 2 })];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 11:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Utils.pressEscape()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.header.expandSideNav()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, page.clickPersonalFiles()];
                case 3:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.sites.deleteSite(sitePublic1Admin)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.deleteSite(siteSearchPublic1Admin)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.deleteSite(sitePublic2Admin)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.deleteSite(sitePublic3Admin)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.deleteSite(sitePublic4Admin)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.deleteSite(sitePublic5Admin)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.deleteSite(sitePublic6Admin)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.deleteSite(sitePublic7Admin)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.deleteSite(sitePublic8Admin)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.deleteSite(siteSearchPublic2Admin)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.deleteSite(siteSearchPublic3Admin)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.deleteSite(siteSearchPublic4Admin)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.deleteSite(siteModerated1Admin)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.deleteSite(siteModerated2Admin)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.deleteSite(siteSearchModerated1Admin)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.deleteSite(siteSearchModerated2Admin)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.deleteSite(sitePublicUser)];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.trashcan.emptyTrash()];
                case 18:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Join a public library', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.admin.sites.createSite(sitePublic1Admin)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('site', sitePublic1Admin)];
                    case 2:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('from Favorite Libraries - [C290105]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.goToFavoriteLibrariesAndWait()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(sitePublic1Admin)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickJoin()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.getLibraryRole(sitePublic1Admin)];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toEqual('Consumer');
                        return [2 /*return*/];
                }
            });
        }); });
        it('from Search Results - [C306959]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, searchInput.checkLibraries()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, searchInput.searchFor(siteSearchPublic1Admin)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(siteSearchPublic1Admin)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickJoin()];
                    case 6:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.getLibraryRole(siteSearchPublic1Admin)];
                    case 7:
                        _a.apply(void 0, [_b.sent()]).toEqual('Consumer');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Join a moderated library', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.admin.sites.createSite(siteModerated1Admin, SITE_VISIBILITY.MODERATED)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('site', siteModerated1Admin)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.queries.waitForSites(siteSearchModerated1Admin, { expect: 1 })];
                    case 3:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('from Favorite Libraries - [C290109]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, hasJoinRequest;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.goToFavoriteLibrariesAndWait()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(siteModerated1Admin)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickJoin()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.getLibraryRole(siteModerated1Admin)];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toEqual('');
                        return [4 /*yield*/, apis.user.sites.hasMembershipRequest(siteModerated1Admin)];
                    case 5:
                        hasJoinRequest = _b.sent();
                        expect(hasJoinRequest).toBe(true, "Join request does not exist on " + siteModerated1Admin);
                        return [2 /*return*/];
                }
            });
        }); });
        it('from Search Results - [C306960]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, hasJoinRequest;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, searchInput.checkLibraries()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, searchInput.searchFor(siteSearchModerated1Admin)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(siteSearchModerated1Admin)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickJoin()];
                    case 6:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.getLibraryRole(siteSearchModerated1Admin)];
                    case 7:
                        _a.apply(void 0, [_b.sent()]).toEqual('');
                        return [4 /*yield*/, apis.user.sites.hasMembershipRequest(siteSearchModerated1Admin)];
                    case 8:
                        hasJoinRequest = _b.sent();
                        expect(hasJoinRequest).toBe(true, "Join request does not exist on " + siteSearchModerated1Admin);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Leave a library', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.admin.sites.createSite(sitePublic2Admin)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.sites.createSite(sitePublic3Admin)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.sites.createSite(sitePublic4Admin)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.sites.createSite(sitePublic5Admin)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, apis.user.sites.createSite(sitePublicUser)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('site', sitePublic3Admin)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.sites.addSiteMember(sitePublic2Admin, username, SITE_ROLES.SITE_COLLABORATOR.ROLE)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.sites.addSiteMember(sitePublic3Admin, username, SITE_ROLES.SITE_MANAGER.ROLE)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.sites.addSiteMember(siteSearchPublic2Admin, username, SITE_ROLES.SITE_CONTRIBUTOR.ROLE)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.sites.addSiteMember(sitePublic4Admin, username, SITE_ROLES.SITE_MANAGER.ROLE)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.sites.addSiteMember(sitePublic5Admin, username, SITE_ROLES.SITE_MANAGER.ROLE)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, apis.user.queries.waitForSites(siteSearchPublic2Admin, { expect: 1 })];
                    case 12:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('from My Libraries - [C290106]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, dataTable.selectItem(sitePublic2Admin)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickLeave()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, confirmDialog.clickOk()];
                    case 5:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        _a.apply(void 0, [_c.sent()]).toEqual("You have left the library");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(sitePublic2Admin)];
                    case 7:
                        _b.apply(void 0, [_c.sent()]).toBe(false, sitePublic2Admin + " is displayed");
                        return [2 /*return*/];
                }
            });
        }); });
        it('from Favorite Libraries - [C290110]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.goToFavoriteLibrariesAndWait()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, dataTable.selectItem(sitePublic3Admin)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickLeave()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, confirmDialog.clickOk()];
                    case 5:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        _a.apply(void 0, [_c.sent()]).toEqual("You have left the library");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(sitePublic3Admin)];
                    case 7:
                        _b.apply(void 0, [_c.sent()]).toBe(true, sitePublic3Admin + " is not displayed");
                        return [2 /*return*/];
                }
            });
        }); });
        it('from Search Results - [C306961]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, searchInput.checkLibraries()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, searchInput.searchFor(siteSearchPublic2Admin)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, dataTable.selectItem(siteSearchPublic2Admin)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickLeave()];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, confirmDialog.clickOk()];
                    case 8:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 9:
                        _a.apply(void 0, [_c.sent()]).toEqual("You have left the library");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(siteSearchPublic2Admin)];
                    case 10:
                        _b.apply(void 0, [_c.sent()]).toBe(true, siteSearchPublic2Admin + " is not displayed");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Confirmation dialog UI - [C290136]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, dataTable.selectItem(sitePublic4Admin)];
                    case 2:
                        _f.sent();
                        return [4 /*yield*/, toolbar.clickLeave()];
                    case 3:
                        _f.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _f.sent();
                        _a = expect;
                        return [4 /*yield*/, confirmDialog.isDialogOpen()];
                    case 5:
                        _a.apply(void 0, [_f.sent()]).toBe(true, 'Confirm delete dialog not open');
                        _b = expect;
                        return [4 /*yield*/, confirmDialog.getTitle()];
                    case 6:
                        _b.apply(void 0, [_f.sent()]).toContain('Leave this library?');
                        _c = expect;
                        return [4 /*yield*/, confirmDialog.getText()];
                    case 7:
                        _c.apply(void 0, [_f.sent()]).toContain('Leaving will remove your access.');
                        _d = expect;
                        return [4 /*yield*/, confirmDialog.isOkEnabled()];
                    case 8:
                        _d.apply(void 0, [_f.sent()]).toBe(true, 'OK button is not enabled');
                        _e = expect;
                        return [4 /*yield*/, confirmDialog.isCancelEnabled()];
                    case 9:
                        _e.apply(void 0, [_f.sent()]).toBe(true, 'Cancel button is not enabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Cancel Leave Library - [C290111]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, dataTable.selectItem(sitePublic5Admin)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickLeave()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, confirmDialog.isCancelEnabled()];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Cancel button is not enabled');
                        return [4 /*yield*/, confirmDialog.clickCancel()];
                    case 6:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(sitePublic5Admin)];
                    case 7:
                        _b.apply(void 0, [_c.sent()]).toBe(true, sitePublic5Admin + " was deleted");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Leave a library - failure notification - [C290107]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(sitePublicUser)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickLeave()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, confirmDialog.clickOk()];
                    case 5:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        _a.apply(void 0, [_b.sent()]).toEqual("Cannot leave this library");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Cancel join', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.admin.sites.createSite(siteModerated2Admin, SITE_VISIBILITY.MODERATED)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('site', siteModerated2Admin)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.sites.requestToJoin(siteModerated2Admin)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, apis.user.sites.requestToJoin(siteSearchModerated2Admin)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, apis.user.queries.waitForSites(siteSearchModerated2Admin, { expect: 1 })];
                    case 5:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('from Favorite Libraries - [C290108]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, hasJoinRequest;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.goToFavoriteLibrariesAndWait()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(siteModerated2Admin)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickButton('Cancel Join Request')];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toEqual("Canceled the request to join the library");
                        return [4 /*yield*/, apis.user.sites.hasMembershipRequest(siteModerated2Admin)];
                    case 5:
                        hasJoinRequest = _b.sent();
                        expect(hasJoinRequest).toBe(false, "Join request exists on " + siteModerated2Admin);
                        return [2 /*return*/];
                }
            });
        }); });
        it('from Search Results - [C306962]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, hasJoinRequest;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, searchInput.checkLibraries()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, searchInput.searchFor(siteSearchModerated2Admin)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(siteSearchModerated2Admin)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickButton('Cancel Join Request')];
                    case 6:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 7:
                        _a.apply(void 0, [_b.sent()]).toEqual("Canceled the request to join the library");
                        return [4 /*yield*/, apis.user.sites.hasMembershipRequest(siteSearchModerated2Admin)];
                    case 8:
                        hasJoinRequest = _b.sent();
                        expect(hasJoinRequest).toBe(false, "Join request exists on " + siteSearchModerated2Admin);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Mark library as favorite', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.admin.sites.createSite(sitePublic6Admin)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.sites.addSiteMember(sitePublic6Admin, username, SITE_ROLES.SITE_MANAGER.ROLE)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.queries.waitForSites(siteSearchPublic3Admin, { expect: 1 })];
                    case 3:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('from My Libraries - [C289974]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(sitePublic6Admin)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(sitePublic6Admin, { expect: true })];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toBe(true, sitePublic6Admin + " not favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('from on Search Results - [C306963]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, searchInput.checkLibraries()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, searchInput.searchFor(siteSearchPublic3Admin)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(siteSearchPublic3Admin)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 6:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(siteSearchPublic3Admin, { expect: true })];
                    case 7:
                        _a.apply(void 0, [_b.sent()]).toBe(true, siteSearchPublic3Admin + " not favorite");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Remove library from favorites', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.admin.sites.createSite(sitePublic7Admin)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.sites.createSite(sitePublic8Admin)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('site', sitePublic7Admin)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('site', sitePublic8Admin)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('site', siteSearchPublic4Admin)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.sites.addSiteMember(sitePublic7Admin, username, SITE_ROLES.SITE_MANAGER.ROLE)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.sites.addSiteMember(sitePublic8Admin, username, SITE_ROLES.SITE_MANAGER.ROLE)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.sites.addSiteMember(siteSearchPublic4Admin, username, SITE_ROLES.SITE_MANAGER.ROLE)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, apis.user.queries.waitForSites(siteSearchPublic4Admin, { expect: 1 })];
                    case 9:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('from My Libraries - [C289975]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(sitePublic7Admin)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsRemoveFavorite()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(sitePublic7Admin, { expect: false })];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toBe(false, sitePublic7Admin + " still favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('from Favorite Libraries - [C289976]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.goToFavoriteLibrariesAndWait()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, dataTable.selectItem(sitePublic8Admin)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsRemoveFavorite()];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(sitePublic8Admin)];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(false, sitePublic8Admin + " is displayed");
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(sitePublic8Admin, { expect: false })];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toBe(false, sitePublic8Admin + " still favorite");
                        return [2 /*return*/];
                }
            });
        }); });
        it('from Search Results - [C306964]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, searchInput.checkLibraries()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, searchInput.searchFor(siteSearchPublic4Admin)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(siteSearchPublic4Admin)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsRemoveFavorite()];
                    case 6:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavoriteWithRetry(siteSearchPublic4Admin, { expect: false })];
                    case 7:
                        _a.apply(void 0, [_b.sent()]).toBe(false, siteSearchPublic4Admin + " still favorite");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Delete a library', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.sites.createSite(siteForDelete1)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.sites.createSite(siteForDelete2)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.queries.waitForSites(siteSearchForDelete, { expect: 1 })];
                    case 3:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('from My Libraries - [C289988]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, dataTable.selectItem(siteForDelete1)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toEqual("Library deleted");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(siteForDelete1)];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toBe(false, siteForDelete1 + " still displayed");
                        return [2 /*return*/];
                }
            });
        }); });
        it('from Favorite Libraries - [C289991]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.goToFavoriteLibrariesAndWait()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, dataTable.selectItem(siteForDelete2)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toEqual("Library deleted");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(siteForDelete2)];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toBe(false, siteForDelete2 + " still displayed");
                        return [2 /*return*/];
                }
            });
        }); });
        it('from Search Results - [C306965]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, searchInput.checkLibraries()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, searchInput.searchFor(siteSearchForDelete)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, dataTable.selectItem(siteSearchForDelete)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 6:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 7:
                        _a.apply(void 0, [_c.sent()]).toEqual("Library deleted");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(siteSearchForDelete)];
                    case 8:
                        _b.apply(void 0, [_c.sent()]).toBe(false, siteSearchForDelete + " still displayed");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=library-actions.test.js.map