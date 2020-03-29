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
import { RepoClient } from '../../utilities/repo-client/repo-client';
describe('File Libraries', function () {
    var username = "user-" + Utils.random();
    var password = username;
    var userSitePrivate = "user-private-" + Utils.random();
    var userSiteModerated = "user-moderated-" + Utils.random();
    var userSitePublic = "user-public-" + Utils.random();
    var siteName = "siteName-" + Utils.random();
    var siteId1 = Utils.random();
    var siteId2 = Utils.random();
    var adminSite1 = "admin1-" + Utils.random();
    var adminSite2 = "admin2-" + Utils.random();
    var adminSite3 = "admin3-" + Utils.random();
    var adminSite4 = "admin4-" + Utils.random();
    var adminSite5 = "admin5-" + Utils.random();
    var adminSite6 = "admin6-" + Utils.random();
    var siteDescription = 'my site description';
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, password)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(userSitePublic, SITE_VISIBILITY.PUBLIC)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(userSiteModerated, SITE_VISIBILITY.MODERATED, siteDescription)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(userSitePrivate, SITE_VISIBILITY.PRIVATE, null)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(adminSite1, SITE_VISIBILITY.PUBLIC)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(adminSite2, SITE_VISIBILITY.PUBLIC)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(adminSite3, SITE_VISIBILITY.PUBLIC)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(adminSite4, SITE_VISIBILITY.PUBLIC)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(adminSite5, SITE_VISIBILITY.PUBLIC)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(adminSite6, SITE_VISIBILITY.PUBLIC)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.addSiteMember(adminSite1, username, SITE_ROLES.SITE_CONSUMER.ROLE)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.addSiteMember(adminSite2, username, SITE_ROLES.SITE_CONTRIBUTOR.ROLE)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.addSiteMember(adminSite3, username, SITE_ROLES.SITE_COLLABORATOR.ROLE)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.addSiteMember(adminSite4, username, SITE_ROLES.SITE_MANAGER.ROLE)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.addSiteMember(adminSite6, username, SITE_ROLES.SITE_CONSUMER.ROLE)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('site', adminSite1)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('site', adminSite2)];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('site', adminSite3)];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('site', adminSite4)];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC, null, siteId1)];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC, null, siteId2)];
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
                case 0: return [4 /*yield*/, apis.user.sites.deleteSites([userSitePublic, userSiteModerated, userSitePrivate, siteId1, siteId2])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.deleteSites([adminSite1, adminSite2, adminSite3, adminSite4, adminSite5, adminSite6])];
                case 2:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('My Libraries', function () {
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('has the correct columns - [C217095]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var expectedColumns, actualColumns;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedColumns = ['Name', 'My Role', 'Visibility'];
                        return [4 /*yield*/, dataTable.getColumnHeadersText()];
                    case 1:
                        actualColumns = _a.sent();
                        expect(actualColumns).toEqual(expectedColumns);
                        return [2 /*return*/];
                }
            });
        }); });
        it('User can see only the sites he is a member of - [C280501]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var sitesCount, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.getRowsCount()];
                    case 1:
                        sitesCount = _b.sent();
                        expect(sitesCount).toEqual(10, 'Incorrect number of sites displayed');
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(adminSite5)];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(false, adminSite5 + " should not appear in the list");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Library visibility is correctly displayed - [C289905]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, expectedSitesVisibility, sitesList, _i, _b, site;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        expectedSitesVisibility = (_a = {},
                            _a[userSitePrivate] = SITE_VISIBILITY.PRIVATE,
                            _a[userSiteModerated] = SITE_VISIBILITY.MODERATED,
                            _a[userSitePublic] = SITE_VISIBILITY.PUBLIC,
                            _a);
                        return [4 /*yield*/, dataTable.getSitesNameAndVisibility()];
                    case 1:
                        sitesList = _c.sent();
                        for (_i = 0, _b = Object.keys(expectedSitesVisibility); _i < _b.length; _i++) {
                            site = _b[_i];
                            expect(sitesList[site]).toEqual(expectedSitesVisibility[site]);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        it('User role is correctly displayed - [C289903]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, expectedSitesRoles, sitesList, _i, _b, site;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        expectedSitesRoles = (_a = {},
                            _a[adminSite1] = SITE_ROLES.SITE_CONSUMER.LABEL,
                            _a[adminSite2] = SITE_ROLES.SITE_CONTRIBUTOR.LABEL,
                            _a[adminSite3] = SITE_ROLES.SITE_COLLABORATOR.LABEL,
                            _a[adminSite4] = SITE_ROLES.SITE_MANAGER.LABEL,
                            _a);
                        return [4 /*yield*/, dataTable.getSitesNameAndRole()];
                    case 1:
                        sitesList = _c.sent();
                        for (_i = 0, _b = Object.keys(expectedSitesRoles); _i < _b.length; _i++) {
                            site = _b[_i];
                            expect(sitesList[site]).toEqual(expectedSitesRoles[site]);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        it('Site ID is displayed when two sites have the same name - [C217098]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var expectedSites, actualSites;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedSites = [
                            siteName + " (" + siteId1 + ")",
                            siteName + " (" + siteId2 + ")"
                        ];
                        return [4 /*yield*/, dataTable.getCellsContainingName(siteName)];
                    case 1:
                        actualSites = _a.sent();
                        expect(actualSites.sort()).toEqual(expectedSites.sort());
                        return [2 /*return*/];
                }
            });
        }); });
        it('Tooltip for sites without description - [C217096]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var tooltip;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dataTable.getItemNameTooltip(userSitePrivate)];
                    case 1:
                        tooltip = _a.sent();
                        expect(tooltip).toBe("" + userSitePrivate);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Tooltip for sites with description - [C217097]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var tooltip;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dataTable.getItemNameTooltip(userSiteModerated)];
                    case 1:
                        tooltip = _a.sent();
                        expect(tooltip).toBe("" + siteDescription);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Favorite Libraries', function () {
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.goToFavoriteLibrariesAndWait()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('has the correct columns - [C289893]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var expectedColumns, actualColumns;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedColumns = ['Name', 'My Role', 'Visibility'];
                        return [4 /*yield*/, dataTable.getColumnHeadersText()];
                    case 1:
                        actualColumns = _a.sent();
                        expect(actualColumns).toEqual(expectedColumns);
                        return [2 /*return*/];
                }
            });
        }); });
        it('User can see only his favorite sites - [C289897]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var sitesCount, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.getRowsCount()];
                    case 1:
                        sitesCount = _b.sent();
                        expect(sitesCount).toEqual(9, 'Incorrect number of sites displayed');
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(adminSite6)];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(false, adminSite6 + " should not appear");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Library visibility is correctly displayed - [C289906]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, expectedSitesVisibility, sitesList, _i, _b, site;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        expectedSitesVisibility = (_a = {},
                            _a[userSitePrivate] = SITE_VISIBILITY.PRIVATE,
                            _a[userSiteModerated] = SITE_VISIBILITY.MODERATED,
                            _a[userSitePublic] = SITE_VISIBILITY.PUBLIC,
                            _a);
                        return [4 /*yield*/, dataTable.getSitesNameAndVisibility()];
                    case 1:
                        sitesList = _c.sent();
                        for (_i = 0, _b = Object.keys(expectedSitesVisibility); _i < _b.length; _i++) {
                            site = _b[_i];
                            expect(sitesList[site]).toEqual(expectedSitesVisibility[site]);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        it('User role is correctly displayed - [C289904]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, expectedSitesRoles, sitesList, _i, _b, site;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        expectedSitesRoles = (_a = {},
                            _a[adminSite1] = SITE_ROLES.SITE_CONSUMER.LABEL,
                            _a[adminSite2] = SITE_ROLES.SITE_CONTRIBUTOR.LABEL,
                            _a[adminSite3] = SITE_ROLES.SITE_COLLABORATOR.LABEL,
                            _a[adminSite4] = SITE_ROLES.SITE_MANAGER.LABEL,
                            _a);
                        return [4 /*yield*/, dataTable.getSitesNameAndRole()];
                    case 1:
                        sitesList = _c.sent();
                        for (_i = 0, _b = Object.keys(expectedSitesRoles); _i < _b.length; _i++) {
                            site = _b[_i];
                            expect(sitesList[site]).toEqual(expectedSitesRoles[site]);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        it('Site ID is displayed when two sites have the same name - [C289896]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var expectedSites, actualSites;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedSites = [
                            siteName + " (" + siteId1 + ")",
                            siteName + " (" + siteId2 + ")"
                        ];
                        return [4 /*yield*/, dataTable.getCellsContainingName(siteName)];
                    case 1:
                        actualSites = _a.sent();
                        expect(actualSites.sort()).toEqual(expectedSites.sort());
                        return [2 /*return*/];
                }
            });
        }); });
        it('Tooltip for sites without description - [C289894]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var tooltip;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dataTable.getItemNameTooltip(userSitePrivate)];
                    case 1:
                        tooltip = _a.sent();
                        expect(tooltip).toBe("" + userSitePrivate);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Tooltip for sites with description - [C289895]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var tooltip;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dataTable.getItemNameTooltip(userSiteModerated)];
                    case 1:
                        tooltip = _a.sent();
                        expect(tooltip).toBe("" + siteDescription);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=file-libraries.test.js.map