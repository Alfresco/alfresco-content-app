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
import { Header, DataTable, Pagination, Toolbar, Breadcrumb, Sidenav } from '../components/components';
import { SIDEBAR_LABELS } from './../configs';
import { Page } from './page';
var BrowsingPage = /** @class */ (function (_super) {
    tslib_1.__extends(BrowsingPage, _super);
    function BrowsingPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = new Header(_this.appRoot);
        _this.sidenav = new Sidenav(_this.appRoot);
        _this.toolbar = new Toolbar(_this.appRoot);
        _this.breadcrumb = new Breadcrumb(_this.appRoot);
        _this.dataTable = new DataTable(_this.appRoot);
        _this.pagination = new Pagination(_this.appRoot);
        return _this;
    }
    BrowsingPage.prototype.signOut = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.header.userInfo.signOut()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowsingPage.prototype.isSnackBarPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.snackBar.isPresent()];
            });
        });
    };
    // helper methods
    BrowsingPage.prototype.clickPersonalFiles = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sidenav.clickLink(SIDEBAR_LABELS.PERSONAL_FILES)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowsingPage.prototype.clickPersonalFilesAndWait = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickPersonalFiles()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.dataTable.waitForHeader()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowsingPage.prototype.clickFileLibraries = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sidenav.clickLink(SIDEBAR_LABELS.FILE_LIBRARIES)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowsingPage.prototype.clickFileLibrariesAndWait = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickFileLibraries()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.dataTable.waitForHeader()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowsingPage.prototype.goToFavoriteLibraries = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sidenav.isFileLibrariesMenuExpanded()];
                    case 1:
                        if (!!(_a.sent())) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sidenav.expandFileLibraries()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.sidenav.clickLink(SIDEBAR_LABELS.FAVORITE_LIBRARIES)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowsingPage.prototype.goToFavoriteLibrariesAndWait = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.goToFavoriteLibraries()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.dataTable.waitForHeader()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowsingPage.prototype.goToMyLibraries = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sidenav.isFileLibrariesMenuExpanded()];
                    case 1:
                        if (!!(_a.sent())) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sidenav.expandFileLibraries()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.sidenav.clickLink(SIDEBAR_LABELS.MY_LIBRARIES)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowsingPage.prototype.goToMyLibrariesAndWait = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.goToMyLibraries()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.dataTable.waitForHeader()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowsingPage.prototype.clickRecentFiles = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sidenav.clickLink(SIDEBAR_LABELS.RECENT_FILES)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowsingPage.prototype.clickRecentFilesAndWait = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickRecentFiles()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.dataTable.waitForHeader()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowsingPage.prototype.clickSharedFiles = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sidenav.clickLink(SIDEBAR_LABELS.SHARED_FILES)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowsingPage.prototype.clickSharedFilesAndWait = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickSharedFiles()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.dataTable.waitForHeader()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowsingPage.prototype.clickFavorites = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sidenav.clickLink(SIDEBAR_LABELS.FAVORITES)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowsingPage.prototype.clickFavoritesAndWait = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickFavorites()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.dataTable.waitForHeader()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowsingPage.prototype.clickTrash = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sidenav.clickLink(SIDEBAR_LABELS.TRASH)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowsingPage.prototype.clickTrashAndWait = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickTrash()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.dataTable.waitForHeader()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return BrowsingPage;
}(Page));
export { BrowsingPage };
//# sourceMappingURL=browsing-page.js.map