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
import * as moment from 'moment';
describe('Search results - files and folders', function () {
    var username = "user-" + Utils.random();
    var file = "test-file-" + Utils.random() + ".txt";
    var fileId;
    var fileTitle = 'file title';
    var fileDescription = 'file description';
    /* cspell:disable-next-line */
    var fileRussian = "\u043B\u044E\u0431\u0438\u043C\u044B\u0439-\u0441\u0430\u0439\u0442-" + Utils.random();
    var fileRussianId;
    var folder = "test-folder-" + Utils.random();
    var folderId;
    var folderTitle = 'folder title';
    var folderDescription = 'folder description';
    var site = "test-site-" + Utils.random();
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new SearchResultsPage();
    var searchInput = page.header.searchInput;
    var dataTable = page.dataTable, breadcrumb = page.breadcrumb;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(file, '-my-', fileTitle, fileDescription)];
                case 2:
                    fileId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.editNodeContent(fileId, 'edited by user')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folder, '-my-', folderTitle, folderDescription)];
                case 4:
                    folderId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileRussian)];
                case 5:
                    fileRussianId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.sites.createSite(site)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, apis.user.search.waitForApi(username, { expect: 2 })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, apis.user.queries.waitForSites(site, { expect: 1 })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 9:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.refresh()];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        apis.user.nodes.deleteNodeById(fileId),
                        apis.user.nodes.deleteNodeById(fileRussianId),
                        apis.user.nodes.deleteNodeById(folderId),
                        apis.user.sites.deleteSite(site)
                    ])];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Results page title - [C307002]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, searchInput.searchFor('test-')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, page.breadcrumb.getCurrentItemName()];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toEqual('Search Results');
                    return [2 /*return*/];
            }
        });
    }); });
    it('File information - [C279183]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var fileEntry, modifiedDate, modifiedBy, size, _a, _b, _c, _d, _e, _f, _g;
        return tslib_1.__generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _h.sent();
                    return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                case 2:
                    _h.sent();
                    return [4 /*yield*/, searchInput.searchFor('test-')];
                case 3:
                    _h.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _h.sent();
                    return [4 /*yield*/, apis.user.nodes.getNodeById(fileId)];
                case 5:
                    fileEntry = _h.sent();
                    modifiedDate = moment(fileEntry.entry.modifiedAt).format('MMM D, YYYY, h:mm:ss A');
                    modifiedBy = fileEntry.entry.modifiedByUser.displayName;
                    size = fileEntry.entry.content.sizeInBytes;
                    _a = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(file)];
                case 6:
                    _a.apply(void 0, [_h.sent()]).toBe(true, file + " is not displayed");
                    _b = expect;
                    return [4 /*yield*/, dataTable.getRowCellsCount(file)];
                case 7:
                    _b.apply(void 0, [_h.sent()]).toEqual(2, 'incorrect number of columns');
                    _c = expect;
                    return [4 /*yield*/, dataTable.getSearchResultLinesCount(file)];
                case 8:
                    _c.apply(void 0, [_h.sent()]).toEqual(4, 'incorrect number of lines for search result');
                    _d = expect;
                    return [4 /*yield*/, dataTable.getSearchResultNameAndTitle(file)];
                case 9:
                    _d.apply(void 0, [_h.sent()]).toBe(file + " ( " + fileTitle + " )");
                    _e = expect;
                    return [4 /*yield*/, dataTable.getSearchResultDescription(file)];
                case 10:
                    _e.apply(void 0, [_h.sent()]).toBe(fileDescription);
                    _f = expect;
                    return [4 /*yield*/, dataTable.getSearchResultModified(file)];
                case 11:
                    _f.apply(void 0, [_h.sent()]).toBe("Modified: " + modifiedDate + " by " + modifiedBy + " | Size: " + size + " Bytes");
                    _g = expect;
                    return [4 /*yield*/, dataTable.getSearchResultLocation(file)];
                case 12:
                    _g.apply(void 0, [_h.sent()]).toMatch(/Location:\s+Personal Files/);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Folder information - [C306867]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var folderEntry, modifiedDate, modifiedBy, _a, _b, _c, _d, _e, _f, _g;
        return tslib_1.__generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _h.sent();
                    return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                case 2:
                    _h.sent();
                    return [4 /*yield*/, searchInput.searchFor('test-')];
                case 3:
                    _h.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _h.sent();
                    return [4 /*yield*/, apis.user.nodes.getNodeById(folderId)];
                case 5:
                    folderEntry = _h.sent();
                    modifiedDate = moment(folderEntry.entry.modifiedAt).format('MMM D, YYYY, h:mm:ss A');
                    modifiedBy = folderEntry.entry.modifiedByUser.displayName;
                    _a = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(folder)];
                case 6:
                    _a.apply(void 0, [_h.sent()]).toBe(true, folder + " is not displayed");
                    _b = expect;
                    return [4 /*yield*/, dataTable.getRowCellsCount(folder)];
                case 7:
                    _b.apply(void 0, [_h.sent()]).toEqual(2, 'incorrect number of columns');
                    _c = expect;
                    return [4 /*yield*/, dataTable.getSearchResultLinesCount(folder)];
                case 8:
                    _c.apply(void 0, [_h.sent()]).toEqual(4, 'incorrect number of lines for search result');
                    _d = expect;
                    return [4 /*yield*/, dataTable.getSearchResultNameAndTitle(folder)];
                case 9:
                    _d.apply(void 0, [_h.sent()]).toBe(folder + " ( " + folderTitle + " )");
                    _e = expect;
                    return [4 /*yield*/, dataTable.getSearchResultDescription(folder)];
                case 10:
                    _e.apply(void 0, [_h.sent()]).toBe(folderDescription);
                    _f = expect;
                    return [4 /*yield*/, dataTable.getSearchResultModified(folder)];
                case 11:
                    _f.apply(void 0, [_h.sent()]).toBe("Modified: " + modifiedDate + " by " + modifiedBy);
                    _g = expect;
                    return [4 /*yield*/, dataTable.getSearchResultLocation(folder)];
                case 12:
                    _g.apply(void 0, [_h.sent()]).toMatch(/Location:\s+Personal Files/);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Search file with special characters - [C290029]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, searchInput.searchFor(fileRussian)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(fileRussian)];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toBe(true, fileRussian + " is not displayed");
                    return [2 /*return*/];
            }
        });
    }); });
    it('Location column redirect - file in user Home - [C279177]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, searchInput.searchFor(file)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, dataTable.clickItemLocation(file)];
                case 5:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, breadcrumb.getAllItems()];
                case 6:
                    _a.apply(void 0, [_b.sent()]).toEqual(['Personal Files']);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=search-results-files-folders.test.js.map