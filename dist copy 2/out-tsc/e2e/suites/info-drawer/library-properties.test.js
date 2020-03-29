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
import { SITE_VISIBILITY, SITE_ROLES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { InfoDrawer } from './../../components/info-drawer/info-drawer';
import { Utils } from '../../utilities/utils';
describe('Library properties', function () {
    var username = "user1-" + Utils.random();
    var user2 = "user2-" + Utils.random();
    var user3 = "user3-" + Utils.random();
    var site = {
        name: "site1-" + Utils.random(),
        id: "site-id-" + Utils.random(),
        visibility: SITE_VISIBILITY.MODERATED,
        description: 'my site description'
    };
    var siteForUpdate = {
        name: "site2-" + Utils.random(),
        id: "site-id-" + Utils.random(),
        visibility: SITE_VISIBILITY.MODERATED,
        description: 'my initial description'
    };
    var siteUpdated = {
        name: "site-for-rename-" + Utils.random(),
        visibility: SITE_VISIBILITY.PRIVATE,
        description: 'new description'
    };
    var siteDup = "site3-" + Utils.random();
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var infoDrawer = new InfoDrawer();
    var aboutTab = infoDrawer.aboutTab;
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.people.createUser({ username: user2 })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.people.createUser({ username: user3 })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(site.name, site.visibility, site.description, site.id)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(siteForUpdate.name, siteForUpdate.visibility, siteForUpdate.description, siteForUpdate.id)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(siteDup)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.addSiteMember(site.id, user2, SITE_ROLES.SITE_COLLABORATOR.ROLE)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.addSiteMember(site.id, user3, SITE_ROLES.SITE_MANAGER.ROLE)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 9:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.user.sites.deleteSite(site.id)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.deleteSite(siteForUpdate.id)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.deleteSite(siteDup)];
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
                case 0: return [4 /*yield*/, page.clickFileLibrariesAndWait()];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, infoDrawer.isOpen()];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 3];
                    return [4 /*yield*/, page.toolbar.clickViewDetails()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Info drawer opens for a library - [C289336]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return tslib_1.__generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, dataTable.selectItem(site.name)];
                case 1:
                    _m.sent();
                    return [4 /*yield*/, page.toolbar.clickViewDetails()];
                case 2:
                    _m.sent();
                    return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                case 3:
                    _m.sent();
                    _a = expect;
                    return [4 /*yield*/, infoDrawer.getHeaderTitle()];
                case 4:
                    _a.apply(void 0, [_m.sent()]).toEqual('Details');
                    _b = expect;
                    return [4 /*yield*/, infoDrawer.isAboutTabDisplayed()];
                case 5:
                    _b.apply(void 0, [_m.sent()]).toBe(true, 'About tab is not displayed');
                    _c = expect;
                    return [4 /*yield*/, aboutTab.isNameDisplayed()];
                case 6:
                    _c.apply(void 0, [_m.sent()]).toBe(true, 'Name field not displayed');
                    _d = expect;
                    return [4 /*yield*/, aboutTab.isLibraryIdDisplayed()];
                case 7:
                    _d.apply(void 0, [_m.sent()]).toBe(true, 'Library ID field not displayed');
                    _e = expect;
                    return [4 /*yield*/, aboutTab.isVisibilityDisplayed()];
                case 8:
                    _e.apply(void 0, [_m.sent()]).toBe(true, 'Visibility field not displayed');
                    _f = expect;
                    return [4 /*yield*/, aboutTab.isDescriptionDisplayed()];
                case 9:
                    _f.apply(void 0, [_m.sent()]).toBe(true, 'Description field not displayed');
                    _g = expect;
                    return [4 /*yield*/, aboutTab.getName()];
                case 10:
                    _g.apply(void 0, [_m.sent()]).toEqual(site.name);
                    _h = expect;
                    return [4 /*yield*/, aboutTab.getLibraryId()];
                case 11:
                    _h.apply(void 0, [_m.sent()]).toEqual(site.id);
                    _j = expect;
                    return [4 /*yield*/, aboutTab.getVisibility()];
                case 12:
                    _j.apply(void 0, [(_m.sent()).toLowerCase()]).toEqual((site.visibility).toLowerCase());
                    _k = expect;
                    return [4 /*yield*/, aboutTab.getDescription()];
                case 13:
                    _k.apply(void 0, [_m.sent()]).toEqual(site.description);
                    _l = expect;
                    return [4 /*yield*/, aboutTab.isEditLibraryPropertiesDisplayed()];
                case 14:
                    _l.apply(void 0, [_m.sent()]).toBe(true, 'Edit action is not displayed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Editable properties - [C289338]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return tslib_1.__generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, dataTable.selectItem(site.name)];
                case 1:
                    _k.sent();
                    return [4 /*yield*/, page.toolbar.clickViewDetails()];
                case 2:
                    _k.sent();
                    return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                case 3:
                    _k.sent();
                    _a = expect;
                    return [4 /*yield*/, aboutTab.isEditLibraryPropertiesEnabled()];
                case 4:
                    _a.apply(void 0, [_k.sent()]).toBe(true, 'Edit action is not enabled');
                    return [4 /*yield*/, aboutTab.clickEditLibraryProperties()];
                case 5:
                    _k.sent();
                    _b = expect;
                    return [4 /*yield*/, aboutTab.isNameEnabled()];
                case 6:
                    _b.apply(void 0, [_k.sent()]).toBe(true, 'Name field not enabled');
                    _c = expect;
                    return [4 /*yield*/, aboutTab.isLibraryIdEnabled()];
                case 7:
                    _c.apply(void 0, [_k.sent()]).toBe(false, 'Library ID field not disabled');
                    _d = expect;
                    return [4 /*yield*/, aboutTab.isVisibilityEnabled()];
                case 8:
                    _d.apply(void 0, [_k.sent()]).toBe(true, 'Visibility field not enabled');
                    _e = expect;
                    return [4 /*yield*/, aboutTab.isDescriptionEnabled()];
                case 9:
                    _e.apply(void 0, [_k.sent()]).toBe(true, 'Description field not enabled');
                    _f = expect;
                    return [4 /*yield*/, aboutTab.isCancelDisplayed()];
                case 10:
                    _f.apply(void 0, [_k.sent()]).toBe(true, 'Cancel button not displayed');
                    _g = expect;
                    return [4 /*yield*/, aboutTab.isUpdateDisplayed()];
                case 11:
                    _g.apply(void 0, [_k.sent()]).toBe(true, 'Update button not displayed');
                    _h = expect;
                    return [4 /*yield*/, aboutTab.isCancelEnabled()];
                case 12:
                    _h.apply(void 0, [_k.sent()]).toBe(true, 'Cancel button not enabled');
                    _j = expect;
                    return [4 /*yield*/, aboutTab.isUpdateEnabled()];
                case 13:
                    _j.apply(void 0, [_k.sent()]).toBe(false, 'Update button not disabled');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Edit site details - [C289339]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return tslib_1.__generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, dataTable.selectItem(siteForUpdate.name)];
                case 1:
                    _j.sent();
                    return [4 /*yield*/, page.toolbar.clickViewDetails()];
                case 2:
                    _j.sent();
                    return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                case 3:
                    _j.sent();
                    _a = expect;
                    return [4 /*yield*/, aboutTab.isEditLibraryPropertiesEnabled()];
                case 4:
                    _a.apply(void 0, [_j.sent()]).toBe(true, 'Edit action is not enabled');
                    return [4 /*yield*/, aboutTab.clickEditLibraryProperties()];
                case 5:
                    _j.sent();
                    return [4 /*yield*/, aboutTab.enterName(siteUpdated.name)];
                case 6:
                    _j.sent();
                    return [4 /*yield*/, aboutTab.enterDescription(siteUpdated.description)];
                case 7:
                    _j.sent();
                    return [4 /*yield*/, aboutTab.setVisibility(siteUpdated.visibility)];
                case 8:
                    _j.sent();
                    _b = expect;
                    return [4 /*yield*/, aboutTab.isUpdateEnabled()];
                case 9:
                    _b.apply(void 0, [_j.sent()]).toBe(true, 'Update button not enabled');
                    return [4 /*yield*/, aboutTab.clickUpdate()];
                case 10:
                    _j.sent();
                    _c = expect;
                    return [4 /*yield*/, page.getSnackBarMessage()];
                case 11:
                    _c.apply(void 0, [_j.sent()]).toEqual('Library properties updated');
                    _d = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(siteUpdated.name)];
                case 12:
                    _d.apply(void 0, [_j.sent()]).toBe(true, 'New site name not displayed in the list');
                    _e = expect;
                    return [4 /*yield*/, infoDrawer.isOpen()];
                case 13:
                    _e.apply(void 0, [_j.sent()]).toBe(false, 'Info drawer still open');
                    _f = expect;
                    return [4 /*yield*/, apis.user.sites.getSite(siteForUpdate.id)];
                case 14:
                    _f.apply(void 0, [(_j.sent()).entry.title]).toEqual(siteUpdated.name);
                    _g = expect;
                    return [4 /*yield*/, apis.user.sites.getSite(siteForUpdate.id)];
                case 15:
                    _g.apply(void 0, [(_j.sent()).entry.description]).toEqual(siteUpdated.description);
                    _h = expect;
                    return [4 /*yield*/, apis.user.sites.getSite(siteForUpdate.id)];
                case 16:
                    _h.apply(void 0, [(_j.sent()).entry.visibility]).toEqual(siteUpdated.visibility);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Cancel editing a site - [C289340]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var newName, newDesc, _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    newName = "new-name-" + Utils.random;
                    newDesc = "new desc " + Utils.random;
                    return [4 /*yield*/, dataTable.selectItem(site.name)];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, page.toolbar.clickViewDetails()];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                case 3:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, aboutTab.isEditLibraryPropertiesEnabled()];
                case 4:
                    _a.apply(void 0, [_e.sent()]).toBe(true, 'Edit action is not enabled');
                    return [4 /*yield*/, aboutTab.clickEditLibraryProperties()];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, aboutTab.enterName(newName)];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, aboutTab.enterDescription(newDesc)];
                case 7:
                    _e.sent();
                    return [4 /*yield*/, aboutTab.setVisibility(SITE_VISIBILITY.MODERATED)];
                case 8:
                    _e.sent();
                    return [4 /*yield*/, aboutTab.clickCancel()];
                case 9:
                    _e.sent();
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(newName)];
                case 10:
                    _b.apply(void 0, [_e.sent()]).toBe(false, 'New site name is displayed in the list');
                    _c = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site.name)];
                case 11:
                    _c.apply(void 0, [_e.sent()]).toBe(true, 'Original site name not displayed in the list');
                    _d = expect;
                    return [4 /*yield*/, infoDrawer.isOpen()];
                case 12:
                    _d.apply(void 0, [_e.sent()]).toBe(true, 'Info drawer not open');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Warning appears when editing the name of the library by entering an existing name - [C289341]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, apis.user.queries.waitForSites(site.name, { expect: 1 })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, dataTable.selectItem(siteDup)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, page.toolbar.clickViewDetails()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, aboutTab.clickEditLibraryProperties()];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, aboutTab.enterName(site.name)];
                case 6:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, aboutTab.isMessageDisplayed()];
                case 7:
                    _a.apply(void 0, [_c.sent()]).toBe(true, 'Message not displayed');
                    _b = expect;
                    return [4 /*yield*/, aboutTab.getMessage()];
                case 8:
                    _b.apply(void 0, [_c.sent()]).toEqual('Library name already in use');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Site name too long - [C289342]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, dataTable.selectItem(site.name)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, page.toolbar.clickViewDetails()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, aboutTab.clickEditLibraryProperties()];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, aboutTab.enterName(Utils.string257)];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, Utils.pressTab()];
                case 6:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, aboutTab.isErrorDisplayed()];
                case 7:
                    _a.apply(void 0, [_d.sent()]).toBe(true, 'Message not displayed');
                    _b = expect;
                    return [4 /*yield*/, aboutTab.getError()];
                case 8:
                    _b.apply(void 0, [_d.sent()]).toEqual('Use 256 characters or less for title');
                    _c = expect;
                    return [4 /*yield*/, aboutTab.isUpdateEnabled()];
                case 9:
                    _c.apply(void 0, [_d.sent()]).toBe(false, 'Update button not disabled');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Site description too long - [C289343]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, dataTable.selectItem(site.name)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, page.toolbar.clickViewDetails()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, aboutTab.clickEditLibraryProperties()];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, aboutTab.enterDescription(Utils.string513)];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, Utils.pressTab()];
                case 6:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, aboutTab.isErrorDisplayed()];
                case 7:
                    _a.apply(void 0, [_d.sent()]).toBe(true, 'Message not displayed');
                    _b = expect;
                    return [4 /*yield*/, aboutTab.getError()];
                case 8:
                    _b.apply(void 0, [_d.sent()]).toEqual('Use 512 characters or less for description');
                    _c = expect;
                    return [4 /*yield*/, aboutTab.isUpdateEnabled()];
                case 9:
                    _c.apply(void 0, [_d.sent()]).toBe(false, 'Update button not disabled');
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Non manager', function () {
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWith(username)];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Edit button is not displayed when user is not the library manager - [C289337]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWith(user2)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.clickFileLibrariesAndWait()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(site.name)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 5:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, aboutTab.isEditLibraryPropertiesDisplayed()];
                    case 6:
                        _a.apply(void 0, [_b.sent()]).toBe(false, 'Edit action is displayed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Error notification - [C289344]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWith(user3)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.clickFileLibrariesAndWait()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(site.name)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, aboutTab.clickEditLibraryProperties()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, apis.user.sites.updateSiteMember(site.id, user3, SITE_ROLES.SITE_CONSUMER.ROLE)];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, aboutTab.enterDescription('new description')];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, aboutTab.clickUpdate()];
                    case 9:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 10:
                        _a.apply(void 0, [_b.sent()]).toEqual('There was an error updating library properties');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=library-properties.test.js.map