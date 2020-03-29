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
import { Person } from './people-api-models';
import { RepoApi } from '../repo-api';
import { PeopleApi as AdfPeopleApi } from '@alfresco/js-api';
var PeopleApi = /** @class */ (function (_super) {
    tslib_1.__extends(PeopleApi, _super);
    function PeopleApi(username, password) {
        var _this = _super.call(this, username, password) || this;
        _this.peopleApi = new AdfPeopleApi(_this.alfrescoJsApi);
        return _this;
    }
    PeopleApi.prototype.createUser = function (user) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var person, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        person = new Person(user);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.peopleApi.createPerson(person)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_1 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.createUser.name, error_1);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PeopleApi.prototype.getUser = function (username) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.peopleApi.getPerson(username)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_2 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getUser.name, error_2);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PeopleApi.prototype.updateUser = function (username, userDetails) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.peopleApi.updatePerson(username, userDetails)];
                    case 2:
                        error_3 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.updateUser.name, error_3);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PeopleApi.prototype.disableUser = function (username) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.updateUser(username, { enabled: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.disableUser.name, error_4);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PeopleApi.prototype.changePassword = function (username, newPassword) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_5;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.updateUser(username, { password: newPassword })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.changePassword.name, error_5);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return PeopleApi;
}(RepoApi));
export { PeopleApi };
//# sourceMappingURL=people-api.js.map