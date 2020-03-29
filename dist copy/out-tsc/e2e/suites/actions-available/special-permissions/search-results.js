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
import { BrowsingPage, SearchResultsPage } from '../../../pages/pages';
import { Utils } from '../../../utilities/utils';
import * as testData from './test-data-permissions';
import * as testUtil from '../test-util';
export function searchResultsTests() {
    var _this = this;
    var page = new BrowsingPage();
    var searchResultsPage = new SearchResultsPage();
    var searchInput = page.header.searchInput;
    describe('available actions : ', function () {
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
            beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.clickPersonalFiles()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, searchInput.clickSearchButton()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, searchInput.searchFor('file-')];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, searchResultsPage.waitForResults()];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office - [C286286]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileDocx.name, testData.fileDocx.searchToolbarPrimary, testData.fileDocx.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileDocx.name, testData.fileDocx.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, favorite - [C286287]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileDocxFav.name, testData.fileDocxFav.searchToolbarPrimary, testData.fileDocxFav.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileDocxFav.name, testData.fileDocxFav.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File simple - [C286262]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.file.name, testData.file.searchToolbarPrimary, testData.file.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.file.name, testData.file.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File favorite - [C286263]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileFav.name, testData.fileFav.searchToolbarPrimary, testData.fileFav.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileFav.name, testData.fileFav.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, shared - [C286280]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileDocxShared.name, testData.fileDocxShared.searchToolbarPrimary, testData.fileDocxShared.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileDocxShared.name, testData.fileDocxShared.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, shared, favorite - [C286281]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.searchToolbarPrimary, testData.fileDocxSharedFav.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared - [C286282]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileShared.name, testData.fileShared.searchToolbarPrimary, testData.fileShared.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileShared.name, testData.fileShared.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite - [C291823]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileSharedFav.name, testData.fileSharedFav.searchToolbarPrimary, testData.fileSharedFav.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileSharedFav.name, testData.fileSharedFav.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File locked - [C291818]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileLocked.name, testData.fileLocked.searchToolbarPrimary, testData.fileLocked.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileLocked.name, testData.fileLocked.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File favorite, locked - [C291819]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileFavLocked.name, testData.fileFavLocked.searchToolbarPrimary, testData.fileFavLocked.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileFavLocked.name, testData.fileFavLocked.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, locked - [C291824]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileSharedLocked.name, testData.fileSharedLocked.searchToolbarPrimary, testData.fileSharedLocked.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.fileSharedLocked.name, testData.fileSharedLocked.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite, locked - [C291825]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.searchToolbarPrimary, testData.fileSharedFavLocked.toolbarMore)];
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
            beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.clickPersonalFiles()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, searchInput.clickSearchButton()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, searchInput.searchFor('folder-')];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, searchResultsPage.waitForResults()];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Folder not favorite - [C291826]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.folder.name, testData.folder.searchToolbarPrimary, testData.folder.toolbarMore)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkContextMenu(testData.folder.name, testData.folder.contextMenu)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Folder favorite - [C291829]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkToolbarActions(testData.folderFav.name, testData.folderFav.searchToolbarPrimary, testData.folderFav.toolbarMore)];
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
            describe('of files', function () {
                beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, page.clickPersonalFiles()];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, searchInput.clickSearchButton()];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, searchInput.searchFor('file-')];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, searchResultsPage.waitForResults()];
                            case 4:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('multiple files - [C291830]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.file.name, testData.fileDocxShared.name], testData.multipleSel.contextMenu)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.file.name, testData.fileDocxShared.name], testData.multipleSel.searchToolbarPrimary, testData.multipleSel.toolbarMore)];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('multiple files - all favorite - [C291834]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.fileDocxFav.name, testData.fileSharedFav.name], testData.multipleSelAllFav.contextMenu)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.fileDocxFav.name, testData.fileSharedFav.name], testData.multipleSel.searchToolbarPrimary, testData.multipleSelAllFav.toolbarMore)];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('multiple locked files - [C291835]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.fileLocked.name, testData.fileSharedFavLocked.name], testData.multipleSel.contextMenu)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.fileLocked.name, testData.fileSharedFavLocked.name], testData.multipleSel.searchToolbarPrimary, testData.multipleSel.toolbarMore)];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('multiple files with different granular permissions - [C286310]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.fileDocxFav.name, testData.fileGranularPermission], testData.multipleSelAllFav.contextMenu)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.fileDocxFav.name, testData.fileGranularPermission], testData.multipleSel.searchToolbarPrimary, testData.multipleSelAllFav.toolbarMore)];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            it('multiple folders - [C291836]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.clickPersonalFiles()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, searchInput.clickSearchButton()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, searchInput.searchFor('folder-')];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.folder.name, testData.folderFav.name], testData.multipleSel.contextMenu)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.folder.name, testData.folderFav.name], testData.multipleSel.searchToolbarPrimary, testData.multipleSel.toolbarMore)];
                        case 5:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('both files and folders - [C268128]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.clickPersonalFiles()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, searchInput.clickSearchButton()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, searchInput.searchFor("=" + testData.file.name + " or =" + testData.folderFav.name)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkMultipleSelContextMenu([testData.file.name, testData.folderFav.name], testData.multipleSel.contextMenu)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, testUtil.checkMultipleSelToolbarActions([testData.file.name, testData.folderFav.name], testData.multipleSel.searchToolbarPrimary, testData.multipleSel.toolbarMore)];
                        case 5:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
}
//# sourceMappingURL=search-results.js.map