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
import { SearchApi as AdfSearchApi } from '@alfresco/js-api';
var SearchApi = /** @class */ (function (_super) {
    tslib_1.__extends(SearchApi, _super);
    function SearchApi(username, password) {
        var _this = _super.call(this, username, password) || this;
        _this.searchApi = new AdfSearchApi(_this.alfrescoJsApi);
        return _this;
    }
    SearchApi.prototype.queryRecentFiles = function (username) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            query: {
                                query: '*',
                                language: 'afts'
                            },
                            filterQueries: [
                                { query: "cm:modified:[NOW/DAY-30DAYS TO NOW/DAY+1DAY]" },
                                { query: "cm:modifier:" + username + " OR cm:creator:" + username },
                                { query: "TYPE:\"content\" AND -TYPE:\"app:filelink\" AND -TYPE:\"fm:post\"" }
                            ]
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.searchApi.search(data)];
                    case 3:
                        error_1 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.queryRecentFiles.name, error_1);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SearchApi.prototype.queryNodesNames = function (searchTerm) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            query: {
                                query: "cm:name:\"" + searchTerm + "*\"",
                                language: 'afts'
                            },
                            filterQueries: [
                                { query: "+TYPE:'cm:folder' OR +TYPE:'cm:content'" }
                            ]
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.searchApi.search(data)];
                    case 3:
                        error_2 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.queryNodesNames.name, error_2);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SearchApi.prototype.queryNodesExactNames = function (searchTerm) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            query: {
                                query: "cm:name:\"" + searchTerm + "\"",
                                language: 'afts'
                            },
                            filterQueries: [
                                { query: "+TYPE:'cm:folder' OR +TYPE:'cm:content'" }
                            ]
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.searchApi.search(data)];
                    case 3:
                        error_3 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.queryNodesExactNames.name, error_3);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SearchApi.prototype.waitForApi = function (username, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var recentFiles, error_4;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        recentFiles = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var totalItems;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.queryRecentFiles(username)];
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
                        return [4 /*yield*/, Utils.retryCall(recentFiles)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        console.log(this.constructor.name + " " + this.waitForApi.name + " catch: ");
                        console.log("\tExpected: " + data.expect + " items, but found " + error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SearchApi.prototype.waitForNodes = function (searchTerm, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var nodes, error_5;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        nodes = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var totalItems;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.queryNodesNames(searchTerm)];
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
                        return [4 /*yield*/, Utils.retryCall(nodes)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        console.log(this.constructor.name + " " + this.waitForNodes.name + " catch: ");
                        console.log("\tExpected: " + data.expect + " items, but found " + error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SearchApi;
}(RepoApi));
export { SearchApi };
//# sourceMappingURL=search-api.js.map