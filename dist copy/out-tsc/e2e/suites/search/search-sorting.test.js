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
import { LoginPage, SearchResultsPage } from '../../pages/pages';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
import { FILES } from '../../configs';
describe('Search sorting', function () {
    var random = Utils.random();
    var user1 = "user1-" + random;
    var user2 = "user2-" + random;
    var parent = "parent-" + random;
    var parentId;
    var fileJpg = {
        name: "search-sort-file-1-" + random + ".jpg",
        source: FILES.jpgFile
    };
    var filePdf = {
        name: "search-sort-file-2-" + random + ".pdf",
        title: 'search sort title',
        description: 'search sort',
        source: FILES.pdfFile
    };
    var apis = {
        admin: new RepoClient(),
        user1: new RepoClient(user1, user1),
        user2: new RepoClient(user2, user2)
    };
    var loginPage = new LoginPage();
    var page = new SearchResultsPage();
    var searchInput = page.header.searchInput;
    var dataTable = page.dataTable;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: user1 })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.people.createUser({ username: user2 })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.user1.nodes.createFolder(parent)];
                case 3:
                    parentId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user1.nodes.setGranularPermission(parentId, true, user2, 'Collaborator')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apis.user1.upload.uploadFileWithRename(fileJpg.source, parentId, fileJpg.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, apis.user2.upload.uploadFileWithRename(filePdf.source, parentId, filePdf.name, filePdf.title, filePdf.description)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, apis.user1.search.waitForNodes('search-sort', { expect: 2 })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(user1)];
                case 8:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Utils.pressEscape()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchInput.clickSearchButton()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchInput.searchFor('search sort')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 5:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.user1.nodes.deleteNodeById(parentId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Sorting options are displayed - [C277722]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, expectedOptions, _e;
        return tslib_1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, page.sortingPicker.isSortOrderButtonDisplayed()];
                case 1:
                    _a.apply(void 0, [_f.sent()]).toBe(true, 'Sort order button not displayed');
                    _b = expect;
                    return [4 /*yield*/, page.sortingPicker.isSortByOptionDisplayed()];
                case 2:
                    _b.apply(void 0, [_f.sent()]).toBe(true, 'Sort options not displayed');
                    _c = expect;
                    return [4 /*yield*/, page.sortingPicker.getSortOrder()];
                case 3:
                    _c.apply(void 0, [_f.sent()]).toBe('DESC', 'Incorrect default sort order');
                    _d = expect;
                    return [4 /*yield*/, page.sortingPicker.getSelectedSortByOption()];
                case 4:
                    _d.apply(void 0, [_f.sent()]).toBe('Relevance', 'Incorrect selected sort option');
                    return [4 /*yield*/, page.sortingPicker.clickSortByDropdown()];
                case 5:
                    _f.sent();
                    expectedOptions = ['Relevance', 'Filename', 'Title', 'Modified date', 'Modifier', 'Created date', 'Size', 'Type'];
                    _e = expect;
                    return [4 /*yield*/, page.sortingPicker.getSortByOptionsList()];
                case 6:
                    _e.apply(void 0, [_f.sent()]).toEqual(expectedOptions, 'Incorrect sort options list');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Sort by Name - [C277728]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, page.sortingPicker.sortByName()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, page.sortingPicker.setSortOrderASC()];
                case 2:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(1).getText()];
                case 3:
                    _a.apply(void 0, [_e.sent()]).toContain(fileJpg.name);
                    _b = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(2).getText()];
                case 4:
                    _b.apply(void 0, [_e.sent()]).toContain(filePdf.name);
                    return [4 /*yield*/, page.sortingPicker.sortByName()];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, page.sortingPicker.setSortOrderDESC()];
                case 6:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(1).getText()];
                case 7:
                    _c.apply(void 0, [_e.sent()]).toContain(filePdf.name);
                    _d = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(2).getText()];
                case 8:
                    _d.apply(void 0, [_e.sent()]).toContain(fileJpg.name);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Sort by Type - [C277740]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, page.sortingPicker.sortByType()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, page.sortingPicker.setSortOrderASC()];
                case 2:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(1).getText()];
                case 3:
                    _a.apply(void 0, [_e.sent()]).toContain(filePdf.name);
                    _b = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(2).getText()];
                case 4:
                    _b.apply(void 0, [_e.sent()]).toContain(fileJpg.name);
                    return [4 /*yield*/, page.sortingPicker.sortByType()];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, page.sortingPicker.setSortOrderDESC()];
                case 6:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(1).getText()];
                case 7:
                    _c.apply(void 0, [_e.sent()]).toContain(fileJpg.name);
                    _d = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(2).getText()];
                case 8:
                    _d.apply(void 0, [_e.sent()]).toContain(filePdf.name);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Sort by Size - [C277738]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, page.sortingPicker.sortBySize()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, page.sortingPicker.setSortOrderASC()];
                case 2:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(1).getText()];
                case 3:
                    _a.apply(void 0, [_e.sent()]).toContain(filePdf.name);
                    _b = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(2).getText()];
                case 4:
                    _b.apply(void 0, [_e.sent()]).toContain(fileJpg.name);
                    return [4 /*yield*/, page.sortingPicker.sortBySize()];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, page.sortingPicker.setSortOrderDESC()];
                case 6:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(1).getText()];
                case 7:
                    _c.apply(void 0, [_e.sent()]).toContain(fileJpg.name);
                    _d = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(2).getText()];
                case 8:
                    _d.apply(void 0, [_e.sent()]).toContain(filePdf.name);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Sort by Created date - [C277734]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, page.sortingPicker.sortByCreatedDate()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, page.sortingPicker.setSortOrderASC()];
                case 2:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(1).getText()];
                case 3:
                    _a.apply(void 0, [_e.sent()]).toContain(fileJpg.name);
                    _b = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(2).getText()];
                case 4:
                    _b.apply(void 0, [_e.sent()]).toContain(filePdf.name);
                    return [4 /*yield*/, page.sortingPicker.sortByCreatedDate()];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, page.sortingPicker.setSortOrderDESC()];
                case 6:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(1).getText()];
                case 7:
                    _c.apply(void 0, [_e.sent()]).toContain(filePdf.name);
                    _d = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(2).getText()];
                case 8:
                    _d.apply(void 0, [_e.sent()]).toContain(fileJpg.name);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Sort by Modified date - [C277736]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, page.sortingPicker.sortByModifiedDate()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, page.sortingPicker.setSortOrderASC()];
                case 2:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(1).getText()];
                case 3:
                    _a.apply(void 0, [_e.sent()]).toContain(fileJpg.name);
                    _b = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(2).getText()];
                case 4:
                    _b.apply(void 0, [_e.sent()]).toContain(filePdf.name);
                    return [4 /*yield*/, page.sortingPicker.sortByModifiedDate()];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, page.sortingPicker.setSortOrderDESC()];
                case 6:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(1).getText()];
                case 7:
                    _c.apply(void 0, [_e.sent()]).toContain(filePdf.name);
                    _d = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(2).getText()];
                case 8:
                    _d.apply(void 0, [_e.sent()]).toContain(fileJpg.name);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Sort by Relevance - [C277727]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, page.sortingPicker.sortByRelevance()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, page.sortingPicker.setSortOrderASC()];
                case 2:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(1).getText()];
                case 3:
                    _a.apply(void 0, [_e.sent()]).toContain(fileJpg.name);
                    _b = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(2).getText()];
                case 4:
                    _b.apply(void 0, [_e.sent()]).toContain(filePdf.name);
                    return [4 /*yield*/, page.sortingPicker.sortByRelevance()];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, page.sortingPicker.setSortOrderDESC()];
                case 6:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(1).getText()];
                case 7:
                    _c.apply(void 0, [_e.sent()]).toContain(filePdf.name);
                    _d = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(2).getText()];
                case 8:
                    _d.apply(void 0, [_e.sent()]).toContain(fileJpg.name);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Sort by Modifier - [C277732]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, page.sortingPicker.sortByModifier()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, page.sortingPicker.setSortOrderASC()];
                case 2:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(1).getText()];
                case 3:
                    _a.apply(void 0, [_e.sent()]).toContain(fileJpg.name);
                    _b = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(2).getText()];
                case 4:
                    _b.apply(void 0, [_e.sent()]).toContain(filePdf.name);
                    return [4 /*yield*/, page.sortingPicker.sortByModifier()];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, page.sortingPicker.setSortOrderDESC()];
                case 6:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(1).getText()];
                case 7:
                    _c.apply(void 0, [_e.sent()]).toContain(filePdf.name);
                    _d = expect;
                    return [4 /*yield*/, dataTable.getNthSearchResultsRow(2).getText()];
                case 8:
                    _d.apply(void 0, [_e.sent()]).toContain(fileJpg.name);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=search-sorting.test.js.map