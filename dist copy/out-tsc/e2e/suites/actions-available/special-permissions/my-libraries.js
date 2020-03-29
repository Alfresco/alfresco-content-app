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
export function librariesTests(siteName) {
    var _this = this;
    var page = new BrowsingPage();
    var dataTable = page.dataTable;
    describe('available actions : ', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(siteName)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 3:
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
        describe('on a file', function () {
            it('File Office - [C280476]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
            it('File Office, favorite - [C280455]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
            it('File simple - [C280444]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
            it('File favorite - [C280464]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
            it('File Office, shared - [C280465]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
            it('File Office, shared, favorite - [C280466]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
            it('File shared - [C280599]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
            it('File shared, favorite - [C280600]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
            it('File locked - [C280647]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
            it('File favorite, locked - [C280477]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
            it('File shared, locked - [C280666]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
            it('File shared, favorite, locked - [C280669]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
        describe('on a folder', function () {
            it('Folder not favorite - [C280456]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.folder.name, testData.folder.toolbarPrimary, testData.folder.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.folder.name, testData.folder.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Folder favorite - [C286284]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.folderFav.name, testData.folderFav.toolbarPrimary, testData.folderFav.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.folderFav.name, testData.folderFav.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('on multiple selection', function () {
            it('multiple files - [C286264]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.fileDocx.name, testData.fileDocxSharedFav.name], testData.multipleSel.contextMenu)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.fileDocx.name, testData.fileDocxSharedFav.name], testData.multipleSel.toolbarPrimary, testData.multipleSel.toolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('multiple files - all favorite - [C286283]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.fileDocxFav.name, testData.fileDocxSharedFav.name], testData.multipleSelAllFav.contextMenu)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.fileDocxFav.name, testData.fileDocxSharedFav.name], testData.multipleSel.toolbarPrimary, testData.multipleSelAllFav.toolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('multiple locked files - [C280478]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
            it('multiple folders - [C213121]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.folderFav.name, testData.folder.name], testData.multipleSel.contextMenu)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.folderFav.name, testData.folder.name], testData.multipleSel.toolbarPrimary, testData.multipleSel.toolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('both files and folders - [C286266]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.file.name, testData.folder.name], testData.multipleSel.contextMenu)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.file.name, testData.folder.name], testData.multipleSel.toolbarPrimary, testData.multipleSel.toolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('multiple files with different granular permissions - [C286285]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.fileDocxFav.name, testData.fileGranularPermission], testData.multipleSelAllFav.contextMenu)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.fileDocxFav.name, testData.fileGranularPermission], testData.multipleSel.toolbarPrimary, testData.multipleSelAllFav.toolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
}
//# sourceMappingURL=my-libraries.js.map