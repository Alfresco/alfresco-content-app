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
import { RepoClient } from '../../../utilities/repo-client/repo-client';
import { Utils } from '../../../utilities/utils';
import { AdminActions } from '../../../utilities/admin-actions';
import { LoginPage } from '../../../pages/pages';
import { FILES } from '../../../configs';
import * as testData from './test-data';
import { personalFilesTests } from './personal-files';
import { recentFilesTests } from './recent-files';
import { favoritesTests } from './favorites';
import { searchResultsTests } from './search-results';
import { sharedFilesTests } from './shared-files';
import { viewerTests } from './viewer';
import { trashTests } from './trash';
describe('Files / folders actions : ', function () {
    var random = Utils.random();
    var username = "user-" + random;
    var parent = "parent-" + random;
    var parentId;
    var fileDocxFavId;
    var fileFavId;
    var fileDocxSharedId;
    var fileDocxSharedFavId;
    var fileSharedId;
    var fileSharedFavId;
    var fileLockedId;
    var fileFavLockedId;
    var fileSharedLockedId;
    var fileSharedFavLockedId;
    var folderFavId;
    var folderFav2Id;
    var fileInTrashId;
    var file2InTrashId;
    var folderInTrashId;
    var folder2InTrashId;
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
                    return [4 /*yield*/, userApi.upload.uploadFileWithRename(FILES.docxFile, parentId, testData.fileDocx.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, userApi.upload.uploadFileWithRename(FILES.docxFile, parentId, testData.fileDocxFav.name)];
                case 4:
                    fileDocxFavId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFile(testData.file.name, parentId)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, userApi.nodes.createFile(testData.fileFav.name, parentId)];
                case 6:
                    fileFavId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.upload.uploadFileWithRename(FILES.docxFile, parentId, testData.fileDocxShared.name)];
                case 7:
                    fileDocxSharedId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.upload.uploadFileWithRename(FILES.docxFile, parentId, testData.fileDocxSharedFav.name)];
                case 8:
                    fileDocxSharedFavId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFile(testData.fileShared.name, parentId)];
                case 9:
                    fileSharedId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFile(testData.fileSharedFav.name, parentId)];
                case 10:
                    fileSharedFavId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFile(testData.fileLocked.name, parentId)];
                case 11:
                    fileLockedId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFile(testData.fileFavLocked.name, parentId)];
                case 12:
                    fileFavLockedId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFile(testData.fileSharedLocked.name, parentId)];
                case 13:
                    fileSharedLockedId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFile(testData.fileSharedFavLocked.name, parentId)];
                case 14:
                    fileSharedFavLockedId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFolder(testData.folder.name, parentId)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, userApi.nodes.createFolder(testData.folderFav.name, parentId)];
                case 16:
                    folderFavId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFolder(testData.folderFav2.name, parentId)];
                case 17:
                    folderFav2Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.favorites.addFavoritesByIds('folder', [folderFavId, folderFav2Id])];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, userApi.favorites.addFavoritesByIds('file', [
                            fileDocxFavId,
                            fileFavId,
                            fileDocxSharedFavId,
                            fileSharedFavId,
                            fileFavLockedId,
                            fileSharedFavLockedId
                        ])];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, userApi.shared.shareFilesByIds([
                            fileDocxSharedId,
                            fileDocxSharedFavId,
                            fileSharedId,
                            fileSharedFavId,
                            fileSharedLockedId,
                            fileSharedFavLockedId
                        ])];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, userApi.nodes.lockFile(fileLockedId)];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, userApi.nodes.lockFile(fileFavLockedId)];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, userApi.nodes.lockFile(fileSharedLockedId)];
                case 23:
                    _a.sent();
                    return [4 /*yield*/, userApi.nodes.lockFile(fileSharedFavLockedId)];
                case 24:
                    _a.sent();
                    return [4 /*yield*/, userApi.nodes.createFile(testData.fileInTrash.name)];
                case 25:
                    fileInTrashId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFile(testData.file2InTrash.name)];
                case 26:
                    file2InTrashId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFolder(testData.folderInTrash.name)];
                case 27:
                    folderInTrashId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFolder(testData.folder2InTrash.name)];
                case 28:
                    folder2InTrashId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.deleteNodeById(fileInTrashId, false)];
                case 29:
                    _a.sent();
                    return [4 /*yield*/, userApi.nodes.deleteNodeById(file2InTrashId, false)];
                case 30:
                    _a.sent();
                    return [4 /*yield*/, userApi.nodes.deleteNodeById(folderInTrashId, false)];
                case 31:
                    _a.sent();
                    return [4 /*yield*/, userApi.nodes.deleteNodeById(folder2InTrashId, false)];
                case 32:
                    _a.sent();
                    return [4 /*yield*/, Promise.all([
                            userApi.favorites.waitForApi({ expect: 8 }),
                            userApi.shared.waitForApi({ expect: 6 }),
                            userApi.search.waitForApi(username, { expect: 12 }),
                            userApi.trashcan.waitForApi({ expect: 4 })
                        ])];
                case 33:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 34:
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
                    return [4 /*yield*/, userApi.trashcan.emptyTrash()];
                case 2:
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
    describe('on Personal Files : ', function () {
        personalFilesTests(parent);
    });
    describe('on Recent Files : ', function () {
        recentFilesTests();
    });
    describe('on Favorites : ', function () {
        favoritesTests();
    });
    describe('on Search Results : ', function () {
        searchResultsTests();
    });
    describe('on Shared Files : ', function () {
        sharedFilesTests();
    });
    describe('on Viewer : ', function () {
        viewerTests(parent);
    });
    describe('on Trash : ', function () {
        trashTests();
    });
});
//# sourceMappingURL=files-folders-actions.test.js.map