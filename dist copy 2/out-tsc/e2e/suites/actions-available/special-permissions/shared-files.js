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
import * as testData from './test-data-permissions';
import * as testUtil from '../test-util';
export function sharedFilesTests() {
    var _this = this;
    var page = new BrowsingPage();
    describe('available actions : ', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickSharedFilesAndWait()];
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
        afterEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.closeOpenDialogs()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('single selection', function () {
            it('File Office, shared - [C326626]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileDocxShared.name, testData.fileDocxShared.toolbarPrimary, testData.fileDocxShared.sharedToolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileDocxShared.name, testData.fileDocxShared.sharedContextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, shared, favorite - [C326627]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.toolbarPrimary, testData.fileDocxSharedFav.sharedToolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.sharedContextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared - [C326628]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileShared.name, testData.fileShared.toolbarPrimary, testData.fileShared.sharedToolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileShared.name, testData.fileShared.sharedContextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite - [C326629]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileSharedFav.name, testData.fileSharedFav.toolbarPrimary, testData.fileSharedFav.sharedToolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileSharedFav.name, testData.fileSharedFav.sharedContextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, locked - [C326631]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileSharedLocked.name, testData.fileSharedLocked.toolbarPrimary, testData.fileSharedLocked.sharedToolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileSharedLocked.name, testData.fileSharedLocked.sharedContextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite, locked - [C326632]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.toolbarPrimary, testData.fileSharedFavLocked.sharedToolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.sharedContextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('multiple selection', function () {
            it('multiple files - [C326634]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.fileShared.name, testData.fileSharedFav.name], testData.multipleSel.contextMenu)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.fileShared.name, testData.fileSharedFav.name], testData.multipleSel.toolbarPrimary, testData.multipleSel.toolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('multiple files - all favorite - [C326635]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.fileSharedFav.name, testData.fileSharedFavLocked.name], testData.multipleSelAllFav.contextMenu)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.fileSharedFav.name, testData.fileSharedFavLocked.name], testData.multipleSel.toolbarPrimary, testData.multipleSelAllFav.toolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('multiple locked files - [C326636]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.fileSharedLocked.name, testData.fileSharedFavLocked.name], testData.multipleSel.contextMenu)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.fileSharedLocked.name, testData.fileSharedFavLocked.name], testData.multipleSel.toolbarPrimary, testData.multipleSel.toolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('multiple files with different granular permissions - [C326639]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.fileSharedFav.name, testData.fileGranularPermission], testData.multipleSelAllFav.contextMenu)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.fileSharedFav.name, testData.fileGranularPermission], testData.multipleSel.toolbarPrimary, testData.multipleSelAllFav.toolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
}
//# sourceMappingURL=shared-files.js.map