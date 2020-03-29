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
import { Utils } from '../../../utilities/utils';
import * as testData from './test-data';
import * as testUtil from '../test-util';
import { BrowsingPage } from '../../../pages/pages';
export function recentFilesTests() {
    var _this = this;
    var page = new BrowsingPage();
    describe('available actions : ', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickRecentFilesAndWait()];
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
        describe('on single selection', function () {
            it('File Office - [C297625]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileDocx.name, testData.fileDocx.toolbarPrimary, testData.fileDocx.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileDocx.name, testData.fileDocx.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, favorite - [C280470]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileDocxFav.name, testData.fileDocxFav.toolbarPrimary, testData.fileDocxFav.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileDocxFav.name, testData.fileDocxFav.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File simple - [C280471]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.file.name, testData.file.toolbarPrimary, testData.file.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.file.name, testData.file.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File favorite - [C280615]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileFav.name, testData.fileFav.toolbarPrimary, testData.fileFav.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileFav.name, testData.fileFav.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, shared - [C297633]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileDocxShared.name, testData.fileDocxShared.toolbarPrimary, testData.fileDocxShared.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileDocxShared.name, testData.fileDocxShared.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, shared, favorite - [C280616]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.toolbarPrimary, testData.fileDocxSharedFav.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared - [C280601]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileShared.name, testData.fileShared.toolbarPrimary, testData.fileShared.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileShared.name, testData.fileShared.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite - [C297635]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileSharedFav.name, testData.fileSharedFav.toolbarPrimary, testData.fileSharedFav.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileSharedFav.name, testData.fileSharedFav.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File locked - [C280622]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileLocked.name, testData.fileLocked.toolbarPrimary, testData.fileLocked.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileLocked.name, testData.fileLocked.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File favorite, locked - [C280608]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileFavLocked.name, testData.fileFavLocked.toolbarPrimary, testData.fileFavLocked.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileFavLocked.name, testData.fileFavLocked.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, locked - [C297636]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileSharedLocked.name, testData.fileSharedLocked.toolbarPrimary, testData.fileSharedLocked.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileSharedLocked.name, testData.fileSharedLocked.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite, locked - [C286324]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.toolbarPrimary, testData.fileSharedFavLocked.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('on multiple selection', function () {
            it('multiple files - [C280468]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.fileDocxFav.name, testData.fileLocked.name], testData.multipleSel.contextMenu)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.fileDocxFav.name, testData.fileLocked.name], testData.multipleSel.toolbarPrimary, testData.multipleSel.toolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('multiple files - all favorite - [C326689]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.fileDocxFav.name, testData.fileFav.name], testData.multipleSelAllFav.contextMenu)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.fileDocxFav.name, testData.fileFav.name], testData.multipleSel.toolbarPrimary, testData.multipleSelAllFav.toolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('multiple locked files - [C297624]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.fileLocked.name, testData.fileSharedFavLocked.name], testData.multipleSel.contextMenu)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.fileLocked.name, testData.fileSharedFavLocked.name], testData.multipleSel.toolbarPrimary, testData.multipleSel.toolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
}
//# sourceMappingURL=recent-files.js.map