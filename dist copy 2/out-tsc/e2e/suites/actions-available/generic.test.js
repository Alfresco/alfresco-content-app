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
var _this = this;
import * as tslib_1 from "tslib";
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
import { AdminActions } from '../../utilities/admin-actions';
describe('Generic tests : ', function () {
    var random = Utils.random();
    var username = "user-" + random;
    var parent = "parent-" + random;
    var file1 = "file1-" + random + ".txt";
    var file2 = "file2-" + random + ".txt";
    var folder1 = "my-folder1-" + random;
    var folder2 = "my-folder2-" + random;
    var content = {
        name: parent,
        files: [file1, file2],
        folders: [folder1, folder2]
    };
    var userApi = new RepoClient(username, username);
    var adminApiActions = new AdminActions();
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable, toolbar = page.toolbar;
    var searchInput = page.header.searchInput;
    var contextMenu = dataTable.menu;
    beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adminApiActions.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, userApi.nodes.createContent(content)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userApi.nodes.deleteNodeByPath(parent)];
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
    describe('single selection', function () {
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(parent)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('selected row is marked with a check circle icon - [C213134]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.hasCheckMarkIcon(file1)];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'check mark missing');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Row is marked with a check circle icon on direct right click - [C286252]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.rightClickOnItem(file2)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.hasCheckMarkIcon(file2)];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'check mark missing');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Context menu appears on direct right click on an item - [C286253]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.rightClickOnItem(file1)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.hasContextMenu()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Context menu is not displayed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Context menu appears when selecting an item and then right clicking on it - [C286254]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file2)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.rightClickOnItem(file2)];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.hasContextMenu()];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Context menu is not displayed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Context menu appears correctly when right clicking on another item - [C284666]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, dataTable.rightClickOnItem(file2)];
                    case 2:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.hasContextMenu()];
                    case 3:
                        _a.apply(void 0, [_d.sent()]).toBe(true, "Context menu is not displayed");
                        _b = expect;
                        return [4 /*yield*/, dataTable.hasCheckMarkIcon(file2)];
                    case 4:
                        _b.apply(void 0, [_d.sent()]).toBe(true, file2 + " is not selected");
                        _c = expect;
                        return [4 /*yield*/, dataTable.hasCheckMarkIcon(file1)];
                    case 5:
                        _c.apply(void 0, [_d.sent()]).toBe(false, file1 + " is not selected");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Context menu closes when clicking away from it - [C280619]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.rightClickOnItem(file1)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.hasContextMenu()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Context menu is not displayed');
                        return [4 /*yield*/, page.breadcrumb.getCurrentItem().click()];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.hasContextMenu()];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(false, 'Context menu is displayed');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Actions are not displayed when no item is selected', function () {
        it('on Personal Files - [C213120]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, toolbar.isEmpty()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(true, "actions displayed though nothing selected");
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Trash - [C280452]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.clickTrash()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, toolbar.isEmpty()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(true, "actions displayed though nothing selected");
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Favorites - [C280449]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.clickFavorites()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, toolbar.isEmpty()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(true, "actions displayed though nothing selected");
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Recent Files - [C280447]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, userApi.search.waitForApi(username, { expect: 2 })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.clickRecentFilesAndWait()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, toolbar.isEmpty()];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(true, "actions displayed though nothing selected");
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Shared Files - [C280445]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.clickSharedFiles()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, toolbar.isEmpty()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(true, "actions displayed though nothing selected");
                        return [2 /*return*/];
                }
            });
        }); });
        it('on My Libraries - [C280439]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.goToMyLibraries()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, toolbar.isEmpty()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(true, "actions displayed though nothing selected");
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Favorite Libraries - [C280439]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.goToFavoriteLibraries()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, toolbar.isEmpty()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(true, "actions displayed though nothing selected");
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Search Results - [C291815]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, searchInput.searchFor('*')];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, toolbar.getButtons()];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toEqual(['Toggle search filter']);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('multiple selection', function () {
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(parent)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Context menu appears on right click on a multiple selection of items - [C286268]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([file1, file2])];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.rightClickOnMultipleSelection()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.hasContextMenu()];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Context menu is not displayed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Context menu appears when right clicking on a single item while having multiple items selected - [C286269]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([file2, folder1])];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, dataTable.rightClickOnItem(file1)];
                    case 2:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.hasContextMenu()];
                    case 3:
                        _a.apply(void 0, [_g.sent()]).toBe(true, "Context menu is not displayed for " + file1);
                        _b = expect;
                        return [4 /*yield*/, dataTable.getSelectedRowsCount()];
                    case 4:
                        _b.apply(void 0, [_g.sent()]).toEqual(1, 'incorrect number of selected rows');
                        _c = expect;
                        return [4 /*yield*/, contextMenu.isEditFolderPresent()];
                    case 5:
                        _c.apply(void 0, [_g.sent()]).toBe(false, "Edit folder is displayed for " + file1);
                        _d = expect;
                        return [4 /*yield*/, dataTable.hasCheckMarkIcon(file1)];
                    case 6:
                        _d.apply(void 0, [_g.sent()]).toBe(true, file1 + " is not selected");
                        _e = expect;
                        return [4 /*yield*/, dataTable.hasCheckMarkIcon(file2)];
                    case 7:
                        _e.apply(void 0, [_g.sent()]).toBe(false, file2 + " is selected");
                        _f = expect;
                        return [4 /*yield*/, dataTable.hasCheckMarkIcon(folder1)];
                    case 8:
                        _f.apply(void 0, [_g.sent()]).toBe(false, folder1 + " is selected");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Unselect items with single click - [C280458]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([file1, file2, folder1, folder2])];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.getSelectedRowsCount()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toEqual(4, 'incorrect selected rows number');
                        return [4 /*yield*/, dataTable.clickItem(file1)];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.getSelectedRowsCount()];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toEqual(1, 'incorrect selected rows number');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Select / unselect items by CMD+click - [C217110]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, Utils.pressCmd()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, dataTable.clickItem(file1)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, dataTable.clickItem(file2)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, dataTable.clickItem(folder1)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, dataTable.clickItem(folder2)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, Utils.releaseKeyPressed()];
                    case 6:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.getSelectedRowsCount()];
                    case 7:
                        _a.apply(void 0, [_c.sent()]).toEqual(4, 'incorrect selected rows number');
                        return [4 /*yield*/, Utils.pressCmd()];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, dataTable.clickItem(file1)];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, dataTable.clickItem(file2)];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, Utils.releaseKeyPressed()];
                    case 11:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.getSelectedRowsCount()];
                    case 12:
                        _b.apply(void 0, [_c.sent()]).toEqual(2, 'incorrect selected rows number');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=generic.test.js.map