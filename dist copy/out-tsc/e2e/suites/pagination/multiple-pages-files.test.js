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
import { LoginPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { AdminActions } from '../../utilities/admin-actions';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { personalFilesTests } from './personal-files';
import { recentFilesTests } from './recent-files';
import { searchResultsTests } from './search-results';
import { sharedFilesTests } from './shared-files';
import { favoritesTests } from './favorites';
describe('Pagination on multiple pages : ', function () {
    var random = Utils.random();
    var username = "user-" + random;
    var parent = "parent-" + random;
    var parentId;
    var files = Array(101)
        .fill('my-file')
        .map(function (name, index) { return name + "-" + (index + 1) + "-" + random + ".txt"; });
    var filesIds;
    var userApi = new RepoClient(username, username);
    var adminApiActions = new AdminActions();
    var loginPage = new LoginPage();
    beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adminApiActions.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, userApi.nodes.createFolder(parent)];
                case 2:
                    parentId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFiles(files, parent)];
                case 3:
                    filesIds = (_a.sent()).list.entries.map(function (entries) { return entries.entry.id; });
                    return [4 /*yield*/, userApi.shared.shareFilesByIds(filesIds)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, userApi.favorites.addFavoritesByIds('file', filesIds)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, Promise.all([
                            userApi.favorites.waitForApi({ expect: 101 }),
                            userApi.shared.waitForApi({ expect: 101 }),
                            userApi.search.waitForApi(username, { expect: 101 }),
                        ])];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userApi.nodes.deleteNodeById(parentId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('on Personal Files', function () {
        personalFilesTests(parent);
    });
    describe('on Recent Files', function () {
        recentFilesTests();
    });
    describe('on Search Results', function () {
        searchResultsTests();
    });
    describe('on Shared Files', function () {
        sharedFilesTests();
    });
    describe('on Favorites', function () {
        favoritesTests();
    });
});
//# sourceMappingURL=multiple-pages-files.test.js.map