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
import { SharedlinksApi as AdfSharedlinksApi } from '@alfresco/js-api';
var SharedLinksApi = /** @class */ (function (_super) {
    tslib_1.__extends(SharedLinksApi, _super);
    function SharedLinksApi(username, password) {
        var _this = _super.call(this, username, password) || this;
        _this.sharedlinksApi = new AdfSharedlinksApi(_this.alfrescoJsApi);
        return _this;
    }
    SharedLinksApi.prototype.shareFileById = function (id, expireDate) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        data = {
                            nodeId: id,
                            expiresAt: expireDate
                        };
                        return [4 /*yield*/, this.sharedlinksApi.createSharedLink(data)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_1 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.shareFileById.name, error_1);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SharedLinksApi.prototype.shareFilesByIds = function (ids) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_2;
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
                                            return [4 /*yield*/, this.shareFileById(current)];
                                        case 2: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); }, Promise.resolve())];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.shareFilesByIds.name, error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharedLinksApi.prototype.getSharedIdOfNode = function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var sharedLinks, found, error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getSharedLinks()];
                    case 1:
                        sharedLinks = (_a.sent()).list.entries;
                        found = sharedLinks.find(function (sharedLink) { return sharedLink.entry.name === name; });
                        return [2 /*return*/, (found || { entry: { id: null } }).entry.id];
                    case 2:
                        error_3 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getSharedIdOfNode.name, error_3);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharedLinksApi.prototype.unshareFile = function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var id, error_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getSharedIdOfNode(name)];
                    case 1:
                        id = _a.sent();
                        return [4 /*yield*/, this.sharedlinksApi.deleteSharedLink(id)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_4 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.unshareFile.name, error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SharedLinksApi.prototype.getSharedLinks = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_5;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.sharedlinksApi.listSharedLinks()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_5 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getSharedLinks.name, error_5);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SharedLinksApi.prototype.waitForApi = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var sharedFiles, error_6;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        sharedFiles = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var totalItems;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getSharedLinks()];
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
                        return [4 /*yield*/, Utils.retryCall(sharedFiles)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        console.log(this.constructor.name + " " + this.waitForApi.name + " catch: ");
                        console.log("\tExpected: " + data.expect + " items, but found " + error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SharedLinksApi;
}(RepoApi));
export { SharedLinksApi };
//# sourceMappingURL=shared-links-api.js.map