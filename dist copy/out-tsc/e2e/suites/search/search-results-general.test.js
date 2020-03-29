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
import { browser } from 'protractor';
describe('Search results general', function () {
    var username = "user-" + Utils.random();
    var file = "test-file-" + Utils.random() + ".txt";
    var fileId;
    var folder = "test-folder-" + Utils.random();
    var folderId;
    var site = "test-site-" + Utils.random();
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new SearchResultsPage();
    var searchInput = page.header.searchInput;
    var dataTable = page.dataTable;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(file)];
                case 2:
                    fileId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(folder)];
                case 3:
                    folderId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.sites.createSite(site)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apis.user.search.waitForApi(username, { expect: 1 })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, apis.user.queries.waitForSites(site, { expect: 1 })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 7:
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
    it('Only files are returned when Files option is the only one checked - [C290005]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, searchInput.checkOnlyFiles()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, searchInput.searchFor('test')];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(file)];
                case 5:
                    _a.apply(void 0, [_d.sent()]).toBe(true, file + " not displayed");
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(folder)];
                case 6:
                    _b.apply(void 0, [_d.sent()]).toBe(false, folder + " is displayed");
                    _c = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site)];
                case 7:
                    _c.apply(void 0, [_d.sent()]).toBe(false, site + " is displayed");
                    return [2 /*return*/];
            }
        });
    }); });
    it('Only folders are returned when Folders option is the only one checked - [C290006]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, searchInput.checkOnlyFolders()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, searchInput.searchFor('test')];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, page.waitForResults()];
                case 4:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(file)];
                case 5:
                    _a.apply(void 0, [_d.sent()]).toBe(false, file + " is displayed");
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(folder)];
                case 6:
                    _b.apply(void 0, [_d.sent()]).toBe(true, folder + " not displayed");
                    _c = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site)];
                case 7:
                    _c.apply(void 0, [_d.sent()]).toBe(false, site + " is displayed");
                    return [2 /*return*/];
            }
        });
    }); });
    it('Files and folders are returned when both Files and Folders options are checked - [C290007]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, searchInput.searchFor('test')];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, page.waitForResults()];
                case 4:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(file)];
                case 5:
                    _a.apply(void 0, [_d.sent()]).toBe(true, file + " not displayed");
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(folder)];
                case 6:
                    _b.apply(void 0, [_d.sent()]).toBe(true, folder + " not displayed");
                    _c = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site)];
                case 7:
                    _c.apply(void 0, [_d.sent()]).toBe(false, site + " is displayed");
                    return [2 /*return*/];
            }
        });
    }); });
    it('Only libraries are returned when Libraries option is checked - [C290008]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, searchInput.checkLibraries()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, searchInput.searchFor('test')];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, page.waitForResults()];
                case 4:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(file)];
                case 5:
                    _a.apply(void 0, [_d.sent()]).toBe(false, file + " is displayed");
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(folder)];
                case 6:
                    _b.apply(void 0, [_d.sent()]).toBe(false, folder + " is displayed");
                    _c = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site)];
                case 7:
                    _c.apply(void 0, [_d.sent()]).toBe(true, site + " not displayed");
                    return [2 /*return*/];
            }
        });
    }); });
    it('Results are updated automatically when changing the search term - [C279162]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, searchInput.searchFor(file)];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, page.waitForResults()];
                case 3:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(file)];
                case 4:
                    _a.apply(void 0, [_e.sent()]).toBe(true, file + " is not displayed");
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(folder)];
                case 5:
                    _b.apply(void 0, [_e.sent()]).toBe(false, folder + " is displayed");
                    return [4 /*yield*/, searchInput.clickSearchButton()];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, searchInput.searchFor(folder)];
                case 7:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(file)];
                case 8:
                    _c.apply(void 0, [_e.sent()]).toBe(false, file + " is displayed");
                    _d = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(folder)];
                case 9:
                    _d.apply(void 0, [_e.sent()]).toBe(true, folder + " is not displayed");
                    return [2 /*return*/];
            }
        });
    }); });
    it('Results are returned when accessing an URL containing a search query - [C279178]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, url, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, searchInput.checkLibraries()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, searchInput.searchFor(site)];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, page.waitForResults()];
                case 4:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site)];
                case 5:
                    _a.apply(void 0, [_c.sent()]).toBe(true, site + " not displayed");
                    return [4 /*yield*/, browser.getCurrentUrl()];
                case 6:
                    url = _c.sent();
                    return [4 /*yield*/, page.clickPersonalFiles()];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, browser.get(url)];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, page.waitForResults()];
                case 9:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, dataTable.isItemPresent(site)];
                case 10:
                    _b.apply(void 0, [_c.sent()]).toBe(true, site + " not displayed");
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=search-results-general.test.js.map