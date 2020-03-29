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
import { QueriesApi as AdfQueriesApi } from '@alfresco/js-api';
var QueriesApi = /** @class */ (function (_super) {
    tslib_1.__extends(QueriesApi, _super);
    function QueriesApi(username, password) {
        var _this = _super.call(this, username, password) || this;
        _this.queriesApi = new AdfQueriesApi(_this.alfrescoJsApi);
        return _this;
    }
    QueriesApi.prototype.findSites = function (searchTerm) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            term: searchTerm,
                            fields: ['title']
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.queriesApi.findSites(searchTerm, data)];
                    case 3:
                        error_1 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.findSites.name, error_1);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueriesApi.prototype.findNodes = function (searchTerm) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            term: searchTerm,
                            fields: ['name']
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.queriesApi.findNodes(searchTerm, data)];
                    case 3:
                        error_2 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.findNodes.name, error_2);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QueriesApi.prototype.waitForSites = function (searchTerm, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var sites, error_3;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        sites = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var totalItems;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.findSites(searchTerm)];
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
                        error_3 = _a.sent();
                        console.log(this.constructor.name + " " + this.waitForSites.name + " catch: ");
                        console.log("\tExpected: " + data.expect + " items, but found " + error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    QueriesApi.prototype.waitForFilesAndFolders = function (searchTerm, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var nodes, error_4;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        nodes = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var totalItems;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.findNodes(searchTerm)];
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
                        error_4 = _a.sent();
                        console.log(this.constructor.name + " " + this.waitForFilesAndFolders.name + " catch: ");
                        console.log("\tExpected: " + data.expect + " items, but found " + error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return QueriesApi;
}(RepoApi));
export { QueriesApi };
//# sourceMappingURL=queries-api.js.map