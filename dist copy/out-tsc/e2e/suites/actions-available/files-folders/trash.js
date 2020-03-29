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
import { BrowsingPage } from '../../../pages/pages';
import { Utils } from '../../../utilities/utils';
import * as testData from './test-data';
import * as testUtil from '../test-util';
export function trashTests() {
    var _this = this;
    var page = new BrowsingPage();
    describe('available actions : ', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickTrashAndWait()];
                    case 1:
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
        it('on a file - [C286258]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarPrimary(testData.fileInTrash.name, testData.fileInTrash.trashActions)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.fileInTrash.name, testData.fileInTrash.trashActions)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('on a folder - [C286259]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkToolbarPrimary(testData.folderInTrash.name, testData.folderInTrash.trashActions)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkContextMenu(testData.folderInTrash.name, testData.folderInTrash.trashActions)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('multiple files - [C280472]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.fileInTrash.name, testData.file2InTrash.name], testData.trashActions)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkMultipleSelToolbarPrimary([testData.fileInTrash.name, testData.file2InTrash.name], testData.trashActions)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('multiple folders - [C280473]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.folderInTrash.name, testData.folder2InTrash.name], testData.trashActions)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkMultipleSelToolbarPrimary([testData.folderInTrash.name, testData.folder2InTrash.name], testData.trashActions)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('both files and folders - [C280474]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.fileInTrash.name, testData.folderInTrash.name], testData.trashActions)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testUtil.checkMultipleSelToolbarPrimary([testData.fileInTrash.name, testData.folderInTrash.name], testData.trashActions)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
}
//# sourceMappingURL=trash.js.map