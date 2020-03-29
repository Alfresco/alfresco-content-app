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
import { E2E_ROOT_PATH } from '../../../../configs';
import { UploadApi as AdfUploadApi } from '@alfresco/js-api';
var fs = require('fs');
var UploadApi = /** @class */ (function (_super) {
    tslib_1.__extends(UploadApi, _super);
    function UploadApi(username, password) {
        var _this = _super.call(this, username, password) || this;
        _this.upload = new AdfUploadApi(_this.alfrescoJsApi);
        return _this;
    }
    UploadApi.prototype.uploadFile = function (fileName, parentFolderId) {
        if (parentFolderId === void 0) { parentFolderId = '-my-'; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var file, opts, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        file = fs.createReadStream(E2E_ROOT_PATH + "/resources/test-files/" + fileName);
                        opts = {
                            name: file.name,
                            nodeType: 'cm:content'
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.upload.uploadFile(file, '', parentFolderId, null, opts)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_1 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.uploadFile.name, error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UploadApi.prototype.uploadFileWithRename = function (fileName, parentId, newName, title, description) {
        if (parentId === void 0) { parentId = '-my-'; }
        if (title === void 0) { title = ''; }
        if (description === void 0) { description = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var file, nodeProps, opts, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        file = fs.createReadStream(E2E_ROOT_PATH + "/resources/test-files/" + fileName);
                        nodeProps = {
                            properties: {
                                'cm:title': title,
                                'cm:description': description
                            }
                        };
                        opts = {
                            name: newName,
                            nodeType: 'cm:content'
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.upload.uploadFile(file, '', parentId, nodeProps, opts)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_2 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.uploadFileWithRename.name, error_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return UploadApi;
}(RepoApi));
export { UploadApi };
//# sourceMappingURL=upload-api.js.map