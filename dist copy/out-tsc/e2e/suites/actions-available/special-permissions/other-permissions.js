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
var page = new BrowsingPage();
var dataTable = page.dataTable;
var searchResultsPage = new SearchResultsPage();
var searchInput = searchResultsPage.header.searchInput;
export function collaboratorTests(siteName) {
    var _this = this;
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
        it('on File Libraries - [C297647]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var expectedToolbarPrimary, expectedToolbarMore;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickFileLibrariesAndWait()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(siteName)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 3:
                        _a.sent();
                        expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
                        expectedToolbarMore = ['Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
                        return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileSharedFav.name, expectedToolbarPrimary, expectedToolbarMore)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Shared Files - [C297651]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var expectedToolbarPrimary, expectedToolbarMore;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickSharedFilesAndWait()];
                    case 1:
                        _a.sent();
                        expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
                        expectedToolbarMore = ['Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
                        return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileSharedFav.name, expectedToolbarPrimary, expectedToolbarMore)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Favorites - [C297652]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var expectedToolbarPrimary, expectedToolbarMore;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickFavoritesAndWait()];
                    case 1:
                        _a.sent();
                        expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
                        expectedToolbarMore = ['Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
                        return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileSharedFav.name, expectedToolbarPrimary, expectedToolbarMore)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Search Results - [C297653]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var expectedToolbarPrimary, expectedToolbarMore;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, searchInput.searchFor(testData.fileSharedFav.name)];
                    case 2:
                        _a.sent();
                        expectedToolbarPrimary = ['Toggle search filter', 'Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
                        expectedToolbarMore = ['Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
                        return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileSharedFav.name, expectedToolbarPrimary, expectedToolbarMore)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('available actions in the viewer : ', function () {
            it('file opened from File Libraries - [C297654]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expectedToolbarPrimary, expectedToolbarMore;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.clickFileLibrariesAndWait()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, dataTable.doubleClickOnRowByName(siteName)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, dataTable.waitForHeader()];
                        case 3:
                            _a.sent();
                            expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
                            expectedToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
                            return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxSharedFav.name, expectedToolbarPrimary, expectedToolbarMore)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('file opened from Shared Files - [C297655]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expectedToolbarPrimary, expectedToolbarMore;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.clickSharedFilesAndWait()];
                        case 1:
                            _a.sent();
                            expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
                            expectedToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
                            return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxSharedFav.name, expectedToolbarPrimary, expectedToolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('file opened from Favorites - [C297656]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expectedToolbarPrimary, expectedToolbarMore;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.clickFavoritesAndWait()];
                        case 1:
                            _a.sent();
                            expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
                            expectedToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
                            return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxSharedFav.name, expectedToolbarPrimary, expectedToolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('file opened from Search Results - [C306992]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expectedToolbarPrimary, expectedToolbarMore;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, searchInput.searchFor(testData.fileDocxSharedFav.name)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, searchResultsPage.waitForResults()];
                        case 3:
                            _a.sent();
                            expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
                            expectedToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
                            return [4 /*yield*/, testUtil.checkViewerActions(testData.fileDocxSharedFav.name, expectedToolbarPrimary, expectedToolbarMore)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
}
export function filesLockedByCurrentUser(siteName) {
    var _this = this;
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
        it('on File Libraries - [C297657]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var expectedToolbarPrimary, expectedToolbarMore;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickFileLibrariesAndWait()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(siteName)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 3:
                        _a.sent();
                        expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
                        expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];
                        return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Shared Files - [C297658]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var expectedToolbarPrimary, expectedToolbarMore;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickSharedFilesAndWait()];
                    case 1:
                        _a.sent();
                        expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
                        expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];
                        return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Favorites - [C297659]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var expectedToolbarPrimary, expectedToolbarMore;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickFavoritesAndWait()];
                    case 1:
                        _a.sent();
                        expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
                        expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
                        return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Search Results - [C297660]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var expectedToolbarPrimary, expectedToolbarMore;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, searchInput.searchFor(testData.fileLockedByUser)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, searchResultsPage.waitForResults()];
                    case 3:
                        _a.sent();
                        expectedToolbarPrimary = ['Toggle search filter', 'Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
                        expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];
                        return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('available actions in the viewer : ', function () {
            it('file opened from File Libraries - [C297661]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expectedToolbarPrimary, expectedToolbarMore;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.clickFileLibrariesAndWait()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, dataTable.doubleClickOnRowByName(siteName)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, dataTable.waitForHeader()];
                        case 3:
                            _a.sent();
                            expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
                            expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];
                            return [4 /*yield*/, testUtil.checkViewerActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('file opened from Shared Files - [C297662]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expectedToolbarPrimary, expectedToolbarMore;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.clickSharedFilesAndWait()];
                        case 1:
                            _a.sent();
                            expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
                            expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];
                            return [4 /*yield*/, testUtil.checkViewerActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('file opened from Favorites - [C297663]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expectedToolbarPrimary, expectedToolbarMore;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.clickFavoritesAndWait()];
                        case 1:
                            _a.sent();
                            expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
                            expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];
                            return [4 /*yield*/, testUtil.checkViewerActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('file opened from Search Results - [C306993]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expectedToolbarPrimary, expectedToolbarMore;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, searchInput.searchFor(testData.fileLockedByUser)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, searchResultsPage.waitForResults()];
                        case 3:
                            _a.sent();
                            expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
                            expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];
                            return [4 /*yield*/, testUtil.checkViewerActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
}
export function filesLockedByOtherUser(siteName) {
    var _this = this;
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
        it('on File Libraries - [C297664]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var expectedToolbarPrimary, expectedToolbarMore;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickFileLibrariesAndWait()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(siteName)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 3:
                        _a.sent();
                        expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
                        expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
                        return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Shared Files - [C297665]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var expectedToolbarPrimary, expectedToolbarMore;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickSharedFilesAndWait()];
                    case 1:
                        _a.sent();
                        expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
                        expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
                        return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Favorites - [C297666]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var expectedToolbarPrimary, expectedToolbarMore;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickFavoritesAndWait()];
                    case 1:
                        _a.sent();
                        expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
                        expectedToolbarMore = ['Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
                        return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Search Results - [C297667]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var expectedToolbarPrimary, expectedToolbarMore;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, searchInput.searchFor(testData.fileLockedByUser)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, searchResultsPage.waitForResults()];
                    case 3:
                        _a.sent();
                        expectedToolbarPrimary = ['Toggle search filter', 'Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
                        expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
                        return [4 /*yield*/, testUtil.checkToolbarActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('available actions in the viewer : ', function () {
            it('file opened from File Libraries - [C297671]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expectedToolbarPrimary, expectedToolbarMore;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.clickFileLibrariesAndWait()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, dataTable.doubleClickOnRowByName(siteName)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, dataTable.waitForHeader()];
                        case 3:
                            _a.sent();
                            expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
                            expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
                            return [4 /*yield*/, testUtil.checkViewerActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('file opened from Shared Files - [C297672]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expectedToolbarPrimary, expectedToolbarMore;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.clickSharedFilesAndWait()];
                        case 1:
                            _a.sent();
                            expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
                            expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
                            return [4 /*yield*/, testUtil.checkViewerActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('file opened from Favorites - [C297673]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expectedToolbarPrimary, expectedToolbarMore;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.clickFavoritesAndWait()];
                        case 1:
                            _a.sent();
                            expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
                            expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
                            return [4 /*yield*/, testUtil.checkViewerActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('file opened from Search Results - [C306994]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expectedToolbarPrimary, expectedToolbarMore;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, searchInput.searchFor(testData.fileLockedByUser)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, searchResultsPage.waitForResults()];
                        case 3:
                            _a.sent();
                            expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
                            expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
                            return [4 /*yield*/, testUtil.checkViewerActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
}
//# sourceMappingURL=other-permissions.js.map