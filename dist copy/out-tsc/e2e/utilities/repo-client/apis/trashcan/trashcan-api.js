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
import { TrashcanApi as AdfTrashcanApi } from '@alfresco/js-api';
var TrashcanApi = /** @class */ (function (_super) {
    tslib_1.__extends(TrashcanApi, _super);
    function TrashcanApi(username, password) {
        var _this = _super.call(this, username, password) || this;
        _this.trashcanApi = new AdfTrashcanApi(_this.alfrescoJsApi);
        return _this;
    }
    TrashcanApi.prototype.permanentlyDelete = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.trashcanApi.deleteDeletedNode(id)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_1 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.permanentlyDelete.name, error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TrashcanApi.prototype.restore = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.trashcanApi.restoreDeletedNode(id)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_2 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.restore.name, error_2);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TrashcanApi.prototype.getDeletedNodes = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var opts, error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        opts = {
                            maxItems: 1000
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.trashcanApi.listDeletedNodes(opts)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_3 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getDeletedNodes.name, error_3);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TrashcanApi.prototype.emptyTrash = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ids, error_4;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getDeletedNodes()];
                    case 1:
                        ids = (_a.sent()).list.entries.map(function (entries) { return entries.entry.id; });
                        return [4 /*yield*/, ids.reduce(function (previous, current) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, previous];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, this.permanentlyDelete(current)];
                                        case 2: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); }, Promise.resolve())];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_4 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.emptyTrash.name, error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TrashcanApi.prototype.waitForApi = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var deletedFiles, error_5;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        deletedFiles = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var totalItems;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getDeletedNodes()];
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
                        return [4 /*yield*/, Utils.retryCall(deletedFiles)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        console.log(this.constructor.name + " " + this.waitForApi.name + " catch: ");
                        console.log("\tExpected: " + data.expect + " items, but found " + error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return TrashcanApi;
}(RepoApi));
export { TrashcanApi };
//# sourceMappingURL=trashcan-api.js.map