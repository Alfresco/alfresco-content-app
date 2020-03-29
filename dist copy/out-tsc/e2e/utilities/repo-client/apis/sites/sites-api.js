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
import * as tslib_1 from "tslib";
import { RepoApi } from '../repo-api';
import { SitesApi as AdfSiteApi } from '@alfresco/js-api';
import { SITE_VISIBILITY, SITE_ROLES } from '../../../../configs';
import { Utils } from '../../../../utilities/utils';
var SitesApi = /** @class */ (function (_super) {
    tslib_1.__extends(SitesApi, _super);
    function SitesApi(username, password) {
        var _this = _super.call(this, username, password) || this;
        _this.sitesApi = new AdfSiteApi(_this.alfrescoJsApi);
        return _this;
    }
    SitesApi.prototype.getSite = function (siteId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.sitesApi.getSite(siteId)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_1 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getSite.name, error_1);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SitesApi.prototype.getSites = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.sitesApi.listSiteMembershipsForPerson(this.getUsername())];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_2 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getSites.name, error_2);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SitesApi.prototype.getDocLibId = function (siteId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.sitesApi.listSiteContainers(siteId)];
                    case 2: return [2 /*return*/, (_a.sent()).list.entries[0].entry.id];
                    case 3:
                        error_3 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getDocLibId.name, error_3);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SitesApi.prototype.getVisibility = function (siteId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var site, error_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getSite(siteId)];
                    case 1:
                        site = _a.sent();
                        return [2 /*return*/, site.entry.visibility];
                    case 2:
                        error_4 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getVisibility.name, error_4);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SitesApi.prototype.getDescription = function (siteId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var site, error_5;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getSite(siteId)];
                    case 1:
                        site = _a.sent();
                        return [2 /*return*/, site.entry.description];
                    case 2:
                        error_5 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getDescription.name, error_5);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SitesApi.prototype.getTitle = function (siteId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var site, error_6;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getSite(siteId)];
                    case 1:
                        site = _a.sent();
                        return [2 /*return*/, site.entry.title];
                    case 2:
                        error_6 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getTitle.name, error_6);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SitesApi.prototype.createSite = function (title, visibility, description, siteId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var site, error_7;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        site = {
                            title: title,
                            visibility: visibility || SITE_VISIBILITY.PUBLIC,
                            description: description,
                            id: siteId || title
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.sitesApi.createSite(site)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_7 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.createSite.name, error_7);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SitesApi.prototype.createSitePrivate = function (title, description, siteId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.createSite(title, SITE_VISIBILITY.PRIVATE, description, siteId)];
            });
        });
    };
    SitesApi.prototype.createSiteModerated = function (title, description, siteId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.createSite(title, SITE_VISIBILITY.MODERATED, description, siteId)];
            });
        });
    };
    SitesApi.prototype.createSites = function (titles, visibility) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                try {
                    return [2 /*return*/, titles.reduce(function (previous, current) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, previous];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, this.createSite(current, visibility)];
                                    case 2: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); }, Promise.resolve())];
                }
                catch (error) {
                    this.handleError(this.constructor.name + " " + this.createSites.name, error);
                }
                return [2 /*return*/];
            });
        });
    };
    SitesApi.prototype.createSitesPrivate = function (siteNames) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.createSites(siteNames, SITE_VISIBILITY.PRIVATE)];
            });
        });
    };
    SitesApi.prototype.deleteSite = function (siteId, permanent) {
        if (permanent === void 0) { permanent = true; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_8;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.sitesApi.deleteSite(siteId, { permanent: permanent })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_8 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.deleteSite.name, error_8);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SitesApi.prototype.deleteSites = function (siteIds, permanent) {
        if (permanent === void 0) { permanent = true; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                try {
                    return [2 /*return*/, siteIds.reduce(function (previous, current) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, previous];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, this.deleteSite(current, permanent)];
                                    case 2: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); }, Promise.resolve())];
                }
                catch (error) {
                    this.handleError(this.constructor.name + " " + this.deleteSites.name, error);
                }
                return [2 /*return*/];
            });
        });
    };
    SitesApi.prototype.deleteAllUserSites = function (permanent) {
        if (permanent === void 0) { permanent = true; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var siteIds, error_9;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getSites()];
                    case 1:
                        siteIds = (_a.sent()).list.entries.map(function (entries) { return entries.entry.id; });
                        return [4 /*yield*/, siteIds.reduce(function (previous, current) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, previous];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, this.deleteSite(current, permanent)];
                                        case 2: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); }, Promise.resolve())];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_9 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.deleteAllUserSites.name, error_9);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SitesApi.prototype.updateSiteMember = function (siteId, userId, role) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var siteRole, error_10;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        siteRole = {
                            role: role
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.sitesApi.updateSiteMembership(siteId, userId, siteRole)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_10 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.updateSiteMember.name, error_10);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SitesApi.prototype.addSiteMember = function (siteId, userId, role) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var memberBody, error_11;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        memberBody = {
                            id: userId,
                            role: role
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.sitesApi.createSiteMembership(siteId, memberBody)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_11 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.addSiteMember.name, error_11);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SitesApi.prototype.addSiteConsumer = function (siteId, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.addSiteMember(siteId, userId, SITE_ROLES.SITE_CONSUMER.ROLE)];
            });
        });
    };
    SitesApi.prototype.addSiteContributor = function (siteId, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.addSiteMember(siteId, userId, SITE_ROLES.SITE_CONTRIBUTOR.ROLE)];
            });
        });
    };
    SitesApi.prototype.addSiteCollaborator = function (siteId, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.addSiteMember(siteId, userId, SITE_ROLES.SITE_COLLABORATOR.ROLE)];
            });
        });
    };
    SitesApi.prototype.addSiteManager = function (siteId, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.addSiteMember(siteId, userId, SITE_ROLES.SITE_MANAGER.ROLE)];
            });
        });
    };
    SitesApi.prototype.deleteSiteMember = function (siteId, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_12;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.sitesApi.deleteSiteMembership(siteId, userId)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_12 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.deleteSiteMember.name, error_12);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SitesApi.prototype.requestToJoin = function (siteId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var body, error_13;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = {
                            id: siteId
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.sitesApi.createSiteMembershipRequestForPerson('-me-', body)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_13 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.requestToJoin.name, error_13);
                        return [2 /*return*/, null];
                    case 5:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    SitesApi.prototype.hasMembershipRequest = function (siteId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var requests, error_14;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.sitesApi.getSiteMembershipRequests('-me-')];
                    case 2:
                        requests = (_a.sent()).list.entries.map(function (e) { return e.entry.id; });
                        return [2 /*return*/, requests.includes(siteId)];
                    case 3:
                        error_14 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.hasMembershipRequest.name, error_14);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SitesApi.prototype.waitForApi = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var sites, error_15;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        sites = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var totalItems;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getSites()];
                                    case 1:
                                        totalItems = (_a.sent()).list.pagination.totalItems;
                                        if (totalItems !== data.expect) {
                                            return [2 /*return*/, Promise.reject(totalItems)];
                                        }
                                        else {
                                            return [2 /*return*/, Promise.resolve(totalItems)];
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, Utils.retryCall(sites)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_15 = _a.sent();
                        console.log(this.constructor.name + " " + this.waitForApi.name + " catch: ");
                        console.log("\tExpected: " + data.expect + " items, but found " + error_15);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SitesApi;
}(RepoApi));
export { SitesApi };
//# sourceMappingURL=sites-api.js.map