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
import { LoginPage, SearchResultsPage } from '../../pages/pages';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
import { SITE_VISIBILITY, SITE_ROLES } from './../../configs';
describe('Search results - libraries', function () {
    var username = "user-" + Utils.random();
    var site1 = {
        name: "lib-1-" + Utils.random(),
        id: "site1-" + Utils.random()
    };
    var site2 = {
        name: "site-2-" + Utils.random(),
        id: "site1-" + Utils.random()
    };
    var site3 = {
        name: "my-lib-" + Utils.random(),
        id: "site3-" + Utils.random()
    };
    var site4 = {
        name: "my-site-" + Utils.random(),
        id: "site4-" + Utils.random(),
        description: 'site description'
    };
    var userSitePrivate = "user-site-private-" + Utils.random();
    var userSiteModerated = "user-site-moderated-" + Utils.random();
    var userSitePublic = "user-site-public-" + Utils.random();
    var siteRussian = {
        /* cspell:disable-next-line */
        name: "\u043B\u044E\u0431\u0438\u043C\u044B\u0439-\u0441\u0430\u0439\u0442-" + Utils.random(),
        id: "site-russian-id-" + Utils.random()
    };
    var adminSite1 = "admin-site-" + Utils.random();
    var adminSite2 = "admin-site-" + Utils.random();
    var adminSite3 = "admin-site-" + Utils.random();
    var adminSite4 = "admin-site-" + Utils.random();
    var adminPrivate = "admin-site-" + Utils.random();
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new SearchResultsPage();
    var searchInput = page.header.searchInput;
    var dataTable = page.dataTable;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(site1.name, SITE_VISIBILITY.PUBLIC, '', site1.id)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(site2.name, SITE_VISIBILITY.PUBLIC, '', site2.id)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(site3.name, SITE_VISIBILITY.PUBLIC, '', site3.id)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(site4.name, SITE_VISIBILITY.PUBLIC, site4.description, site4.id)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(userSitePublic, SITE_VISIBILITY.PUBLIC)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(userSiteModerated, SITE_VISIBILITY.MODERATED)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(userSitePrivate, SITE_VISIBILITY.PRIVATE)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(siteRussian.name, SITE_VISIBILITY.PUBLIC, '', siteRussian.id)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(adminSite1, SITE_VISIBILITY.PUBLIC)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(adminSite2, SITE_VISIBILITY.PUBLIC)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(adminSite3, SITE_VISIBILITY.PUBLIC)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(adminSite4, SITE_VISIBILITY.PUBLIC)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.addSiteMember(adminSite1, username, SITE_ROLES.SITE_CONSUMER.ROLE)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.addSiteMember(adminSite2, username, SITE_ROLES.SITE_CONTRIBUTOR.ROLE)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.addSiteMember(adminSite3, username, SITE_ROLES.SITE_COLLABORATOR.ROLE)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.addSiteMember(adminSite4, username, SITE_ROLES.SITE_MANAGER.ROLE)];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(adminPrivate, SITE_VISIBILITY.PRIVATE)];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.waitForApi({ expect: 12 })];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, apis.user.queries.waitForSites('lib', { expect: 2 })];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, apis.user.queries.waitForSites('my-site', { expect: 1 })];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 22:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        apis.admin.sites.deleteSites([adminSite1, adminSite2, adminSite3, adminSite4, adminPrivate]),
                        apis.user.sites.deleteSites([site1.id, site2.id, site3.id, site4.id, userSitePublic, userSiteModerated, userSitePrivate, siteRussian.id])
                    ])];
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
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Search library - full name match - [C290012]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, searchInput.checkLibraries()];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, searchInput.searchFor(site1.name)];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site1.name)];
                case 5:
                    _a.apply(void 0, [_e.sent()]).toBe(true, site1.name + " not displayed");
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site2.name)];
                case 6:
                    _b.apply(void 0, [_e.sent()]).toBe(false, site2.name + " displayed");
                    _c = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site3.name)];
                case 7:
                    _c.apply(void 0, [_e.sent()]).toBe(false, site3.name + " displayed");
                    _d = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site4.name)];
                case 8:
                    _d.apply(void 0, [_e.sent()]).toBe(false, site4.name + " displayed");
                    return [2 /*return*/];
            }
        });
    }); });
    it('Search library - partial name match - [C290013]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, searchInput.checkLibraries()];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, searchInput.searchFor('lib')];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site1.name)];
                case 5:
                    _a.apply(void 0, [_e.sent()]).toBe(true, site1.name + " not displayed");
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site2.name)];
                case 6:
                    _b.apply(void 0, [_e.sent()]).toBe(false, site2.name + " displayed");
                    _c = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site3.name)];
                case 7:
                    _c.apply(void 0, [_e.sent()]).toBe(true, site3.name + " not displayed");
                    _d = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site4.name)];
                case 8:
                    _d.apply(void 0, [_e.sent()]).toBe(false, site4.name + " displayed");
                    return [2 /*return*/];
            }
        });
    }); });
    it('Search library - description match - [C290014]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, searchInput.checkLibraries()];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, searchInput.searchFor(site4.description)];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site1.name)];
                case 5:
                    _a.apply(void 0, [_e.sent()]).toBe(false, site1.name + " displayed");
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site2.name)];
                case 6:
                    _b.apply(void 0, [_e.sent()]).toBe(false, site2.name + " displayed");
                    _c = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site3.name)];
                case 7:
                    _c.apply(void 0, [_e.sent()]).toBe(false, site3.name + " displayed");
                    _d = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site4.name)];
                case 8:
                    _d.apply(void 0, [_e.sent()]).toBe(true, site4.name + " not displayed");
                    return [2 /*return*/];
            }
        });
    }); });
    it('Results page title - [C290015]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, searchInput.checkLibraries()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, searchInput.searchFor('lib')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, page.breadcrumb.getCurrentItemName()];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toEqual('Libraries found...');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Results page columns - [C290016]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var expectedColumns, actualColumns;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchInput.checkLibraries()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchInput.searchFor(site1.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _a.sent();
                    expectedColumns = ['Name', 'My Role', 'Visibility'];
                    return [4 /*yield*/, dataTable.getColumnHeadersText()];
                case 5:
                    actualColumns = _a.sent();
                    expect(actualColumns).toEqual(expectedColumns);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Library visibility is correctly displayed - [C290017]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, expectedSitesVisibility, sitesList, _i, _b, site;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, searchInput.checkLibraries()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, searchInput.searchFor('user-site')];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _c.sent();
                    expectedSitesVisibility = (_a = {},
                        _a[userSitePrivate] = SITE_VISIBILITY.PRIVATE,
                        _a[userSiteModerated] = SITE_VISIBILITY.MODERATED,
                        _a[userSitePublic] = SITE_VISIBILITY.PUBLIC,
                        _a);
                    return [4 /*yield*/, dataTable.getSitesNameAndVisibility()];
                case 5:
                    sitesList = _c.sent();
                    for (_i = 0, _b = Object.keys(expectedSitesVisibility); _i < _b.length; _i++) {
                        site = _b[_i];
                        expect(sitesList[site]).toEqual(expectedSitesVisibility[site]);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    it('User role is correctly displayed - [C290018]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, expectedSitesRoles, sitesList, _i, _b, site;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, searchInput.checkLibraries()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, searchInput.searchFor('admin-site')];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _c.sent();
                    expectedSitesRoles = (_a = {},
                        _a[adminSite1] = SITE_ROLES.SITE_CONSUMER.LABEL,
                        _a[adminSite2] = SITE_ROLES.SITE_CONTRIBUTOR.LABEL,
                        _a[adminSite3] = SITE_ROLES.SITE_COLLABORATOR.LABEL,
                        _a[adminSite4] = SITE_ROLES.SITE_MANAGER.LABEL,
                        _a);
                    return [4 /*yield*/, dataTable.getSitesNameAndRole()];
                case 5:
                    sitesList = _c.sent();
                    for (_i = 0, _b = Object.keys(expectedSitesRoles); _i < _b.length; _i++) {
                        site = _b[_i];
                        expect(sitesList[site]).toEqual(expectedSitesRoles[site]);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    it('Private sites are not displayed when user is not a member - [C290019]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, searchInput.checkLibraries()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, searchInput.searchFor('admin-site')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(adminPrivate)];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toBe(false, adminPrivate + " is displayed");
                    return [2 /*return*/];
            }
        });
    }); });
    it('Search libraries with special characters - [C290028]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, searchInput.checkLibraries()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, searchInput.searchFor(siteRussian.name)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(siteRussian.name)];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toBe(true, siteRussian.name + " not displayed");
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=search-results-libraries.test.js.map