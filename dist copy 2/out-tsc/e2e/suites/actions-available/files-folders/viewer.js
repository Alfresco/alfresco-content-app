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
import * as testData from './test-data';
import * as testUtil from '../test-util';
export function viewerTests(parentName) {
    var _this = this;
    var page = new BrowsingPage();
    var searchResultsPage = new SearchResultsPage();
    var dataTable = page.dataTable;
    var searchInput = page.header.searchInput;
    describe('available actions : ', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickPersonalFiles()];
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
        describe('file opened from Personal Files', function () {
            beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, dataTable.doubleClickOnRowByName(parentName)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, dataTable.waitForHeader()];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office - [C282025]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocx.name, testData.fileDocx.viewerToolbarPrimary, testData.fileDocx.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, favorite - [C297583]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxFav.name, testData.fileDocxFav.viewerToolbarPrimary, testData.fileDocxFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File simple - [C297587]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.file.name, testData.file.viewerToolbarPrimary, testData.file.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File favorite - [C297588]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileFav.name, testData.fileFav.viewerToolbarPrimary, testData.fileFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, shared - [C297597]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxShared.name, testData.fileDocxShared.viewerToolbarPrimary, testData.fileDocxShared.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, shared, favorite - [C297598]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.viewerToolbarPrimary, testData.fileDocxSharedFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared - [C291831]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileShared.name, testData.fileShared.viewerToolbarPrimary, testData.fileShared.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite - [C297632]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedFav.name, testData.fileSharedFav.viewerToolbarPrimary, testData.fileSharedFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File locked - [C291832]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileLocked.name, testData.fileLocked.viewerToolbarPrimary, testData.fileLocked.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File favorite, locked - [C297593]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileFavLocked.name, testData.fileFavLocked.viewerToolbarPrimary, testData.fileFavLocked.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, locked - [C291833]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedLocked.name, testData.fileSharedLocked.viewerToolbarPrimary, testData.fileSharedLocked.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite, locked - [C297592]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.viewerToolbarPrimary, testData.fileSharedFavLocked.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('file opened from Recent Files', function () {
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
            it('File Office - [C297599]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocx.name, testData.fileDocx.viewerToolbarPrimary, testData.fileDocx.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, favorite - [C297600]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxFav.name, testData.fileDocxFav.viewerToolbarPrimary, testData.fileDocxFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File simple - [C326692]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.file.name, testData.file.viewerToolbarPrimary, testData.file.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File favorite - [C326693]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileFav.name, testData.fileFav.viewerToolbarPrimary, testData.fileFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, shared - [C326694]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxShared.name, testData.fileDocxShared.viewerToolbarPrimary, testData.fileDocxShared.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, shared, favorite - [C326695]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.viewerToolbarPrimary, testData.fileDocxSharedFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared - [C326696]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileShared.name, testData.fileShared.viewerToolbarPrimary, testData.fileShared.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite - [C326697]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedFav.name, testData.fileSharedFav.viewerToolbarPrimary, testData.fileSharedFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File locked - [C326698]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileLocked.name, testData.fileLocked.viewerToolbarPrimary, testData.fileLocked.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File favorite, locked - [C326701]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileFavLocked.name, testData.fileFavLocked.viewerToolbarPrimary, testData.fileFavLocked.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, locked - [C326699]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedLocked.name, testData.fileSharedLocked.viewerToolbarPrimary, testData.fileSharedLocked.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite, locked - [C326700]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.viewerToolbarPrimary, testData.fileSharedFavLocked.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('file opened from Favorites', function () {
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
            it('File Office, favorite - [C326702]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxFav.name, testData.fileDocxFav.viewerToolbarPrimary, testData.fileDocxFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File favorite - [C326703]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileFav.name, testData.fileFav.viewerToolbarPrimary, testData.fileFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, shared, favorite - [C326704]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.viewerToolbarPrimary, testData.fileDocxSharedFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite - [C326705]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedFav.name, testData.fileSharedFav.viewerToolbarPrimary, testData.fileSharedFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File favorite, locked - [C326707]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileFavLocked.name, testData.fileFavLocked.viewerToolbarPrimary, testData.fileFavLocked.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite, locked - [C326706]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.viewerToolbarPrimary, testData.fileSharedFavLocked.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('file opened from Shared Files', function () {
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
            it('File Office, shared - [C326708]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxShared.name, testData.fileDocxShared.viewerToolbarPrimary, testData.fileDocxShared.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, shared, favorite - [C326709]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.viewerToolbarPrimary, testData.fileDocxSharedFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared - [C326710]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileShared.name, testData.fileShared.viewerToolbarPrimary, testData.fileShared.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite - [C326711]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedFav.name, testData.fileSharedFav.viewerToolbarPrimary, testData.fileSharedFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, locked - [C326712]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedLocked.name, testData.fileSharedLocked.viewerToolbarPrimary, testData.fileSharedLocked.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite, locked - [C326713]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.viewerToolbarPrimary, testData.fileSharedFavLocked.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('file opened from Search Results', function () {
            beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, searchInput.searchFor('file-')];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, searchResultsPage.waitForResults()];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office - [C326714]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocx.name, testData.fileDocx.viewerToolbarPrimary, testData.fileDocx.searchViewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, favorite - [C326715]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxFav.name, testData.fileDocxFav.viewerToolbarPrimary, testData.fileDocxFav.searchViewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File simple - [C326716]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.file.name, testData.file.viewerToolbarPrimary, testData.file.searchViewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File favorite - [C326717]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileFav.name, testData.fileFav.viewerToolbarPrimary, testData.fileFav.searchViewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, shared - [C326718]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxShared.name, testData.fileDocxShared.viewerToolbarPrimary, testData.fileDocxShared.searchViewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, shared, favorite - [C326719]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.viewerToolbarPrimary, testData.fileDocxSharedFav.searchViewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared - [C326720]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileShared.name, testData.fileShared.viewerToolbarPrimary, testData.fileShared.searchViewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite - [C326721]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedFav.name, testData.fileSharedFav.viewerToolbarPrimary, testData.fileSharedFav.searchViewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File locked - [C326722]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileLocked.name, testData.fileLocked.viewerToolbarPrimary, testData.fileLocked.searchViewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File favorite, locked - [C326725]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileFavLocked.name, testData.fileFavLocked.viewerToolbarPrimary, testData.fileFavLocked.searchViewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, locked - [C326723]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedLocked.name, testData.fileSharedLocked.viewerToolbarPrimary, testData.fileSharedLocked.searchViewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite, locked - [C326724]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.viewerToolbarPrimary, testData.fileSharedFavLocked.searchViewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
}
//# sourceMappingURL=viewer.js.map