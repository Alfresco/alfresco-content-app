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
export function favoritesTests() {
    var _this = this;
    var page = new BrowsingPage();
    describe('available actions : ', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickFavoritesAndWait()];
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
        describe('on a file', function () {
            it('File Office, favorite - [C297618]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileDocxFav.name, testData.fileDocxFav.toolbarPrimary, testData.fileDocxFav.favoritesToolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileDocxFav.name, testData.fileDocxFav.favoritesContextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File favorite - [C280461]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileFav.name, testData.fileFav.toolbarPrimary, testData.fileFav.favoritesToolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileFav.name, testData.fileFav.favoritesContextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, shared, favorite - [C297620]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.favoritesToolbarPrimary, testData.fileDocxSharedFav.favoritesToolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.favoritesContextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite - [C280462]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileSharedFav.name, testData.fileSharedFav.favoritesToolbarPrimary, testData.fileSharedFav.favoritesToolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileSharedFav.name, testData.fileSharedFav.favoritesContextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File favorite, locked - [C280463]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileFavLocked.name, testData.fileFavLocked.toolbarPrimary, testData.fileFavLocked.favoritesToolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileFavLocked.name, testData.fileFavLocked.favoritesContextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite, locked - [C280469]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.favoritesToolbarPrimary, testData.fileSharedFavLocked.favoritesToolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.favoritesContextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('on a folder', function () {
            it('Folder favorite - [C291817]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.folderFav.name, testData.folderFav.toolbarPrimary, testData.folderFav.favoritesToolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.folderFav.name, testData.folderFav.favoritesContextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('on multiple selection', function () {
            it('multiple files - [C280656]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.fileDocxFav.name, testData.fileDocxSharedFav.name], testData.multipleSelAllFav.favoritesContextMenu)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.fileDocxFav.name, testData.fileDocxSharedFav.name], testData.multipleSelAllFav.toolbarPrimary, testData.multipleSelAllFav.favoritesToolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('multiple locked files - [C297631]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.fileFavLocked.name, testData.fileSharedFavLocked.name], testData.multipleSelAllFav.favoritesContextMenu)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.fileFavLocked.name, testData.fileSharedFavLocked.name], testData.multipleSelAllFav.toolbarPrimary, testData.multipleSelAllFav.favoritesToolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('multiple folders - [C280664]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.folderFav.name, testData.folderFav2.name], testData.multipleSelAllFav.favoritesContextMenu)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.folderFav.name, testData.folderFav2.name], testData.multipleSelAllFav.toolbarPrimary, testData.multipleSelAllFav.favoritesToolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('both files and folders - [C280657]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.fileFav.name, testData.folderFav.name], testData.multipleSelAllFav.favoritesContextMenu)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.fileFav.name, testData.folderFav.name], testData.multipleSelAllFav.toolbarPrimary, testData.multipleSelAllFav.favoritesToolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
}
//# sourceMappingURL=favorites.js.map