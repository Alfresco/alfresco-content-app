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
import { LoginPage, BrowsingPage, SearchResultsPage } from '../../../pages/pages';
import { RepoClient } from '../../../utilities/repo-client/repo-client';
import { Utils } from '../../../utilities/utils';
import { AdminActions } from '../../../utilities/admin-actions';
import * as testData from './test-data-libraries';
import * as testUtil from '../test-util';
describe('Library actions : ', function () {
    var username = "user-" + Utils.random();
    var userApi = new RepoClient(username, username);
    var adminApiActions = new AdminActions();
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var searchResultsPage = new SearchResultsPage();
    var searchInput = searchResultsPage.header.searchInput;
    beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var publicUserMemberNotFavId, privateUserMemberNotFavId, moderatedUserMemberNotFavId;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adminApiActions.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, userApi.sites.createSite(testData.publicUserMemberFav.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, userApi.sites.createSitePrivate(testData.privateUserMemberFav.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, userApi.sites.createSiteModerated(testData.moderatedUserMemberFav.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, userApi.sites.createSite(testData.publicUserMemberNotFav.name)];
                case 5:
                    publicUserMemberNotFavId = (_a.sent()).entry.guid;
                    return [4 /*yield*/, userApi.sites.createSitePrivate(testData.privateUserMemberNotFav.name)];
                case 6:
                    privateUserMemberNotFavId = (_a.sent()).entry.guid;
                    return [4 /*yield*/, userApi.sites.createSiteModerated(testData.moderatedUserMemberNotFav.name)];
                case 7:
                    moderatedUserMemberNotFavId = (_a.sent()).entry.guid;
                    return [4 /*yield*/, adminApiActions.sites.createSite(testData.publicNotMemberFav.name)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, adminApiActions.sites.createSiteModerated(testData.moderatedNotMemberFav.name)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, adminApiActions.sites.createSite(testData.publicNotMemberNotFav.name)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, adminApiActions.sites.createSiteModerated(testData.moderatedNotMemberNotFav.name)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, adminApiActions.sites.createSiteModerated(testData.moderatedRequestedJoinFav.name)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, adminApiActions.sites.createSiteModerated(testData.moderatedRequestedJoinNotFav.name)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, userApi.sites.createSite(testData.siteInTrash.name)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, userApi.sites.createSite(testData.site2InTrash.name)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, Promise.all([
                            userApi.sites.waitForApi({ expect: 8 }),
                            adminApiActions.sites.waitForApi({ expect: 6 + 1 })
                        ])];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, userApi.favorites.removeFavoritesByIds([publicUserMemberNotFavId, privateUserMemberNotFavId, moderatedUserMemberNotFavId])];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, userApi.favorites.addFavoritesByIds('site', [testData.publicNotMemberFav.name, testData.moderatedNotMemberFav.name, testData.moderatedRequestedJoinFav.name])];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, userApi.sites.requestToJoin(testData.moderatedRequestedJoinFav.name)];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, userApi.sites.requestToJoin(testData.moderatedRequestedJoinNotFav.name)];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, userApi.queries.waitForSites('site-', { expect: 14 + 1 })];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, userApi.sites.deleteSite(testData.siteInTrash.name, false)];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, userApi.sites.deleteSite(testData.site2InTrash.name, false)];
                case 23:
                    _a.sent();
                    return [4 /*yield*/, userApi.trashcan.waitForApi({ expect: 2 })];
                case 24:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 25:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        userApi.sites.deleteSites([
                            testData.publicUserMemberFav.name,
                            testData.privateUserMemberFav.name,
                            testData.moderatedUserMemberFav.name,
                            testData.publicUserMemberNotFav.name,
                            testData.privateUserMemberNotFav.name,
                            testData.moderatedUserMemberNotFav.name
                        ]),
                        adminApiActions.sites.deleteSites([
                            testData.publicNotMemberFav.name,
                            testData.moderatedNotMemberFav.name,
                            testData.publicNotMemberNotFav.name,
                            testData.moderatedNotMemberNotFav.name,
                            testData.moderatedRequestedJoinFav.name,
                            testData.moderatedRequestedJoinNotFav.name
                        ]),
                        userApi.trashcan.emptyTrash()
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('on My Libraries', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Public library, user is a member, favorite - [C213135]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.publicUserMemberFav.name, testData.publicUserMemberFav.toolbarPrimary, testData.publicUserMemberFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.publicUserMemberFav.name, testData.publicUserMemberFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Private library, user is a member, favorite - [C290080]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.privateUserMemberFav.name, testData.privateUserMemberFav.toolbarPrimary, testData.privateUserMemberFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.privateUserMemberFav.name, testData.privateUserMemberFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Moderated library, user is a member, favorite - [C326676]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.toolbarPrimary, testData.moderatedUserMemberFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Public library, user is a member, not favorite - [C326677]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.publicUserMemberNotFav.name, testData.publicUserMemberNotFav.toolbarPrimary, testData.publicUserMemberNotFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.publicUserMemberNotFav.name, testData.publicUserMemberNotFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Private library, user is a member, not favorite - [C326678]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.privateUserMemberNotFav.name, testData.privateUserMemberNotFav.toolbarPrimary, testData.privateUserMemberNotFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.privateUserMemberNotFav.name, testData.privateUserMemberNotFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Moderated library, user is a member, not favorite - [C326679]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.moderatedUserMemberNotFav.name, testData.moderatedUserMemberNotFav.toolbarPrimary, testData.moderatedUserMemberNotFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.moderatedUserMemberNotFav.name, testData.moderatedUserMemberNotFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Favorite Libraries', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.goToFavoriteLibrariesAndWait()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Public library, user is a member, favorite - [C289892]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.publicUserMemberFav.name, testData.publicUserMemberFav.toolbarPrimary, testData.publicUserMemberFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.publicUserMemberFav.name, testData.publicUserMemberFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Private library, user is a member, favorite - [C290090]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.privateUserMemberFav.name, testData.privateUserMemberFav.toolbarPrimary, testData.privateUserMemberFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.privateUserMemberFav.name, testData.privateUserMemberFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Moderated library, user is a member, favorite - [C290091]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.toolbarPrimary, testData.moderatedUserMemberFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Public library, user not a member, favorite - [C290081]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.publicNotMemberFav.name, testData.publicNotMemberFav.toolbarPrimary, testData.publicNotMemberFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.publicNotMemberFav.name, testData.publicNotMemberFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Moderated library, user not a member, favorite - [C290082]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.moderatedNotMemberFav.name, testData.moderatedNotMemberFav.toolbarPrimary, testData.moderatedNotMemberFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.moderatedNotMemberFav.name, testData.moderatedNotMemberFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Moderated library, user requested to join, favorite - [C290089]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.moderatedRequestedJoinFav.name, testData.moderatedRequestedJoinFav.toolbarPrimary, testData.moderatedRequestedJoinFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.moderatedRequestedJoinFav.name, testData.moderatedRequestedJoinFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Search Results', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.clickPersonalFiles()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, searchInput.checkLibraries()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, searchInput.searchFor('site-')];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Public library, user is a member, favorite - [C290084]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.publicUserMemberFav.name, testData.publicUserMemberFav.searchToolbarPrimary, testData.publicUserMemberFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.publicUserMemberFav.name, testData.publicUserMemberFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Private library, user is a member, favorite - [C290085]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.privateUserMemberFav.name, testData.privateUserMemberFav.searchToolbarPrimary, testData.privateUserMemberFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.privateUserMemberFav.name, testData.privateUserMemberFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Moderated library, user is a member, favorite - [C290086]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.searchToolbarPrimary, testData.moderatedUserMemberFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Public library, user is a member, not favorite - [C291812]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.publicUserMemberNotFav.name, testData.publicUserMemberNotFav.searchToolbarPrimary, testData.publicUserMemberNotFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.publicUserMemberNotFav.name, testData.publicUserMemberNotFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Private library, user is a member, not favorite - [C291813]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.privateUserMemberNotFav.name, testData.privateUserMemberNotFav.searchToolbarPrimary, testData.privateUserMemberNotFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.privateUserMemberNotFav.name, testData.privateUserMemberNotFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Moderated library, user is a member, not favorite - [C291814]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.moderatedUserMemberNotFav.name, testData.moderatedUserMemberNotFav.searchToolbarPrimary, testData.moderatedUserMemberNotFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.moderatedUserMemberNotFav.name, testData.moderatedUserMemberNotFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Public library, user not a member, favorite - [C326680]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.publicNotMemberFav.name, testData.publicNotMemberFav.searchToolbarPrimary, testData.publicNotMemberFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.publicNotMemberFav.name, testData.publicNotMemberFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Moderated library, user not a member, favorite - [C326681]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.moderatedNotMemberFav.name, testData.moderatedNotMemberFav.searchToolbarPrimary, testData.moderatedNotMemberFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.moderatedNotMemberFav.name, testData.moderatedNotMemberFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Public library, user not a member, not favorite - [C326682]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.publicNotMemberNotFav.name, testData.publicNotMemberNotFav.searchToolbarPrimary, testData.publicNotMemberNotFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.publicNotMemberNotFav.name, testData.publicNotMemberNotFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Moderated library, user not a member, not favorite - [C326683]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.moderatedNotMemberNotFav.name, testData.moderatedNotMemberNotFav.searchToolbarPrimary, testData.moderatedNotMemberNotFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.moderatedNotMemberNotFav.name, testData.moderatedNotMemberNotFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Moderated library, user requested to join, favorite - [C326685]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.moderatedRequestedJoinFav.name, testData.moderatedRequestedJoinFav.searchToolbarPrimary, testData.moderatedRequestedJoinFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.moderatedRequestedJoinFav.name, testData.moderatedRequestedJoinFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Moderated library, user requested to join, not favorite - [C326684]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.moderatedRequestedJoinNotFav.name, testData.moderatedRequestedJoinNotFav.searchToolbarPrimary, testData.moderatedRequestedJoinNotFav.toolbarMore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.moderatedRequestedJoinNotFav.name, testData.moderatedRequestedJoinNotFav.contextMenu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Trash', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.clickTrashAndWait()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('single library - [C326686]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarPrimary(testData.siteInTrash.name, testData.siteInTrash.trashActions)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.siteInTrash.name, testData.siteInTrash.trashActions)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('multiple libraries - [C326687]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.siteInTrash.name, testData.site2InTrash.name], testData.trashActions)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkMultipleSelToolbarPrimary([testData.siteInTrash.name, testData.site2InTrash.name], testData.trashActions)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=library.test.js.map