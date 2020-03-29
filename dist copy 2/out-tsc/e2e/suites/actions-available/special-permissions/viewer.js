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
export function viewerTests(siteName) {
    var _this = this;
    var page = new BrowsingPage();
    var searchResultsPage = new SearchResultsPage();
    var dataTable = page.dataTable;
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
        describe('file opened from File Libraries', function () {
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
            it('File Office - [C326622]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocx.name, testData.fileDocx.viewerToolbarPrimary, testData.fileDocx.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, favorite - [C326623]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxFav.name, testData.fileDocxFav.viewerToolbarPrimary, testData.fileDocxFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File simple - [C326624]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.file.name, testData.file.viewerToolbarPrimary, testData.file.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File favorite - [C326625]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileFav.name, testData.fileFav.viewerToolbarPrimary, testData.fileFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, shared - [C326637]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxShared.name, testData.fileDocxShared.viewerToolbarPrimary, testData.fileDocxShared.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, shared, favorite - [C326638]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.viewerToolbarPrimary, testData.fileDocxSharedFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared - [C326648]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileShared.name, testData.fileShared.viewerToolbarPrimary, testData.fileShared.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite - [C326649]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedFav.name, testData.fileSharedFav.viewerToolbarPrimary, testData.fileSharedFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File locked - [C326630]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileLocked.name, testData.fileLocked.viewerToolbarPrimary, testData.fileLocked.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File favorite, locked - [C326633]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileFavLocked.name, testData.fileFavLocked.viewerToolbarPrimary, testData.fileFavLocked.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, locked - [C326650]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedLocked.name, testData.fileSharedLocked.viewerToolbarPrimary, testData.fileSharedLocked.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite, locked - [C326651]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
            it('File Office, favorite - [C326652]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxFav.name, testData.fileDocxFav.viewerToolbarPrimary, testData.fileDocxFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File favorite - [C326653]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileFav.name, testData.fileFav.viewerToolbarPrimary, testData.fileFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, shared, favorite - [C326655]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.viewerToolbarPrimary, testData.fileDocxSharedFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite - [C326656]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedFav.name, testData.fileSharedFav.viewerToolbarPrimary, testData.fileSharedFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File favorite, locked - [C326654]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileFavLocked.name, testData.fileFavLocked.viewerToolbarPrimary, testData.fileFavLocked.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite, locked - [C326657]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
            it('File Office, shared - [C326658]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxShared.name, testData.fileDocxShared.viewerToolbarPrimary, testData.fileDocxShared.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, shared, favorite - [C326659]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.viewerToolbarPrimary, testData.fileDocxSharedFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared - [C326660]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileShared.name, testData.fileShared.viewerToolbarPrimary, testData.fileShared.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite - [C326661]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedFav.name, testData.fileSharedFav.viewerToolbarPrimary, testData.fileSharedFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, locked - [C326662]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedLocked.name, testData.fileSharedLocked.viewerToolbarPrimary, testData.fileSharedLocked.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite, locked - [C326663]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
            it('File Office - [C326664]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocx.name, testData.fileDocx.viewerToolbarPrimary, testData.fileDocx.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, favorite - [C326665]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxFav.name, testData.fileDocxFav.viewerToolbarPrimary, testData.fileDocxFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File simple - [C326666]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.file.name, testData.file.viewerToolbarPrimary, testData.file.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File favorite - [C326667]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileFav.name, testData.fileFav.viewerToolbarPrimary, testData.fileFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, shared - [C326670]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxShared.name, testData.fileDocxShared.viewerToolbarPrimary, testData.fileDocxShared.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File Office, shared, favorite - [C326671]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.viewerToolbarPrimary, testData.fileDocxSharedFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared - [C326672]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileShared.name, testData.fileShared.viewerToolbarPrimary, testData.fileShared.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite - [C326673]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedFav.name, testData.fileSharedFav.viewerToolbarPrimary, testData.fileSharedFav.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File locked - [C326668]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileLocked.name, testData.fileLocked.viewerToolbarPrimary, testData.fileLocked.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File favorite, locked - [C326669]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileFavLocked.name, testData.fileFavLocked.viewerToolbarPrimary, testData.fileFavLocked.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, locked - [C326674]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testUtil.checkViewerActions(testData.fileSharedLocked.name, testData.fileSharedLocked.viewerToolbarPrimary, testData.fileSharedLocked.viewerToolbarMore)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File shared, favorite, locked - [C326675]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
    });
}
//# sourceMappingURL=viewer.js.map