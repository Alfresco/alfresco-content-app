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
import { Utils } from '../../../../utilities/utils';
import { FavoritesApi as AdfFavoritesApi, SitesApi as AdfSiteApi } from '@alfresco/js-api';
var FavoritesApi = /** @class */ (function (_super) {
    tslib_1.__extends(FavoritesApi, _super);
    function FavoritesApi(username, password) {
        var _this = _super.call(this, username, password) || this;
        _this.favoritesApi = new AdfFavoritesApi(_this.alfrescoJsApi);
        _this.sitesApi = new AdfSiteApi(_this.alfrescoJsApi);
        return _this;
    }
    FavoritesApi.prototype.addFavorite = function (api, nodeType, name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, nodeId, data, error_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, api.nodes.getNodeByPath(name)];
                    case 1:
                        nodeId = (_b.sent()).entry.id;
                        data = {
                            target: (_a = {},
                                _a[nodeType] = {
                                    guid: nodeId
                                },
                                _a)
                        };
                        return [4 /*yield*/, this.favoritesApi.createFavorite('-me-', data)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        error_1 = _b.sent();
                        this.handleError(this.constructor.name + " " + this.addFavorite.name, error_1);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FavoritesApi.prototype.addFavoriteById = function (nodeType, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, guid, data, error_2;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _b.sent();
                        if (!(nodeType === 'site')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sitesApi.getSite(id)];
                    case 2:
                        guid = (_b.sent()).entry.guid;
                        return [3 /*break*/, 4];
                    case 3:
                        guid = id;
                        _b.label = 4;
                    case 4:
                        data = {
                            target: (_a = {},
                                _a[nodeType] = {
                                    guid: guid
                                },
                                _a)
                        };
                        return [4 /*yield*/, this.favoritesApi.createFavorite('-me-', data)];
                    case 5: return [2 /*return*/, _b.sent()];
                    case 6:
                        error_2 = _b.sent();
                        this.handleError(this.constructor.name + " " + this.addFavoriteById.name, error_2);
                        return [2 /*return*/, null];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    FavoritesApi.prototype.addFavoritesByIds = function (nodeType, ids) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_3;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ids.reduce(function (previous, current) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, previous];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, this.addFavoriteById(nodeType, current)];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, Promise.resolve())];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.addFavoritesByIds.name, error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FavoritesApi.prototype.getFavorites = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.favoritesApi.listFavorites(this.getUsername())];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_4 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getFavorites.name, error_4);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FavoritesApi.prototype.getFavoriteById = function (nodeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_5;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.favoritesApi.getFavorite('-me-', nodeId)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_5 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getFavoriteById.name, error_5);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FavoritesApi.prototype.isFavorite = function (nodeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, error_6;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _b = (_a = JSON).stringify;
                        return [4 /*yield*/, this.getFavorites()];
                    case 1: return [2 /*return*/, _b.apply(_a, [(_c.sent()).list.entries]).includes(nodeId)];
                    case 2:
                        error_6 = _c.sent();
                        this.handleError(this.constructor.name + " " + this.isFavorite.name, error_6);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FavoritesApi.prototype.isFavoriteWithRetry = function (nodeId, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var isFavorite, favorite, error_7;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        favorite = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.isFavorite(nodeId)];
                                    case 1:
                                        isFavorite = _a.sent();
                                        if (isFavorite !== data.expect) {
                                            return [2 /*return*/, Promise.reject(isFavorite)];
                                        }
                                        else {
                                            return [2 /*return*/, Promise.resolve(isFavorite)];
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, Utils.retryCall(favorite)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_7 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, isFavorite];
                }
            });
        });
    };
    FavoritesApi.prototype.removeFavoriteById = function (nodeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_8;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.favoritesApi.deleteFavorite('-me-', nodeId)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_8 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.removeFavoriteById.name, error_8);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FavoritesApi.prototype.removeFavoritesByIds = function (ids) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_9;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ids.reduce(function (previous, current) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, previous];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, this.removeFavoriteById(current)];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, Promise.resolve())];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_9 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.removeFavoritesByIds.name, error_9);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FavoritesApi.prototype.waitForApi = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var favoriteFiles, error_10;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        favoriteFiles = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var totalItems;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getFavorites()];
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
                        return [4 /*yield*/, Utils.retryCall(favoriteFiles)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_10 = _a.sent();
                        console.log(this.constructor.name + " " + this.waitForApi.name + " catch: ");
                        console.log("\tExpected: " + data.expect + " items, but found " + error_10);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return FavoritesApi;
}(RepoApi));
export { FavoritesApi };
//# sourceMappingURL=favorites-api.js.map