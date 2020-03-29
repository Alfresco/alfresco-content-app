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
import { LoginPage } from '../../../pages/pages';
import { FILES, SITE_ROLES } from '../../../configs';
import { RepoClient } from '../../../utilities/repo-client/repo-client';
import { Utils } from '../../../utilities/utils';
import { AdminActions } from '../../../utilities/admin-actions';
import * as testData from './test-data-permissions';
import { librariesTests } from './my-libraries';
import { favoritesTests } from './favorites';
import { searchResultsTests } from './search-results';
import { viewerTests } from './viewer';
import { sharedFilesTests } from './shared-files';
import { collaboratorTests, filesLockedByCurrentUser, filesLockedByOtherUser } from './other-permissions';
describe('Special permissions : ', function () {
    var random = Utils.random();
    var sitePrivate = "site-private-" + random;
    var userManager = "manager-" + random;
    var userConsumer = "consumer-" + random;
    var userCollaborator = "collaborator-" + random;
    var userDemoted = "demoted-" + random;
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
    var fileGranularPermissionId;
    var fileLockedByUserId;
    var folderFavId;
    var folderFav2Id;
    var adminApiActions = new AdminActions();
    var userManagerApi = new RepoClient(userManager, userManager);
    var userConsumerApi = new RepoClient(userConsumer, userConsumer);
    var userCollaboratorApi = new RepoClient(userCollaborator, userCollaborator);
    var userDemotedApi = new RepoClient(userDemoted, userDemoted);
    var loginPage = new LoginPage();
    beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var docLibId;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adminApiActions.createUser({ username: userManager })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, adminApiActions.createUser({ username: userConsumer })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, adminApiActions.createUser({ username: userCollaborator })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, adminApiActions.createUser({ username: userDemoted })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, userManagerApi.sites.createSitePrivate(sitePrivate)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, userManagerApi.sites.getDocLibId(sitePrivate)];
                case 6:
                    docLibId = _a.sent();
                    return [4 /*yield*/, userManagerApi.sites.addSiteConsumer(sitePrivate, userConsumer)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, userManagerApi.sites.addSiteCollaborator(sitePrivate, userCollaborator)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, userManagerApi.sites.addSiteManager(sitePrivate, userDemoted)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, userManagerApi.upload.uploadFileWithRename(FILES.docxFile, docLibId, testData.fileDocx.name)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, userManagerApi.upload.uploadFileWithRename(FILES.docxFile, docLibId, testData.fileDocxFav.name)];
                case 11:
                    fileDocxFavId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userManagerApi.nodes.createFile(testData.file.name, docLibId)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, userManagerApi.nodes.createFile(testData.fileFav.name, docLibId)];
                case 13:
                    fileFavId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userManagerApi.upload.uploadFileWithRename(FILES.docxFile, docLibId, testData.fileDocxShared.name)];
                case 14:
                    fileDocxSharedId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userManagerApi.upload.uploadFileWithRename(FILES.docxFile, docLibId, testData.fileDocxSharedFav.name)];
                case 15:
                    fileDocxSharedFavId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userManagerApi.nodes.createFile(testData.fileShared.name, docLibId)];
                case 16:
                    fileSharedId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userManagerApi.nodes.createFile(testData.fileSharedFav.name, docLibId)];
                case 17:
                    fileSharedFavId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userManagerApi.nodes.createFile(testData.fileLocked.name, docLibId)];
                case 18:
                    fileLockedId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userManagerApi.nodes.createFile(testData.fileFavLocked.name, docLibId)];
                case 19:
                    fileFavLockedId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userManagerApi.nodes.createFile(testData.fileSharedLocked.name, docLibId)];
                case 20:
                    fileSharedLockedId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userManagerApi.nodes.createFile(testData.fileSharedFavLocked.name, docLibId)];
                case 21:
                    fileSharedFavLockedId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userManagerApi.nodes.createFile(testData.fileGranularPermission, docLibId)];
                case 22:
                    fileGranularPermissionId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userManagerApi.nodes.createFile(testData.fileLockedByUser, docLibId)];
                case 23:
                    fileLockedByUserId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userDemotedApi.nodes.lockFile(fileLockedByUserId)];
                case 24:
                    _a.sent();
                    return [4 /*yield*/, userDemotedApi.favorites.addFavoriteById('file', fileLockedByUserId)];
                case 25:
                    _a.sent();
                    return [4 /*yield*/, userDemotedApi.shared.shareFileById(fileLockedByUserId)];
                case 26:
                    _a.sent();
                    return [4 /*yield*/, userManagerApi.sites.updateSiteMember(sitePrivate, userDemoted, SITE_ROLES.SITE_CONSUMER.ROLE)];
                case 27:
                    _a.sent();
                    return [4 /*yield*/, userManagerApi.nodes.createFolder(testData.folder.name, docLibId)];
                case 28:
                    _a.sent();
                    return [4 /*yield*/, userManagerApi.nodes.createFolder(testData.folderFav.name, docLibId)];
                case 29:
                    folderFavId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userManagerApi.nodes.createFolder(testData.folderFav2.name, docLibId)];
                case 30:
                    folderFav2Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, userConsumerApi.favorites.addFavoritesByIds('folder', [folderFavId, folderFav2Id])];
                case 31:
                    _a.sent();
                    return [4 /*yield*/, userConsumerApi.favorites.addFavoritesByIds('file', [
                            fileDocxFavId,
                            fileFavId,
                            fileDocxSharedFavId,
                            fileSharedFavId,
                            fileFavLockedId,
                            fileSharedFavLockedId,
                            fileGranularPermissionId
                        ])];
                case 32:
                    _a.sent();
                    return [4 /*yield*/, userConsumerApi.shared.shareFilesByIds([
                            fileDocxSharedId,
                            fileDocxSharedFavId,
                            fileSharedId,
                            fileSharedFavId,
                            fileSharedLockedId,
                            fileSharedFavLockedId,
                            fileGranularPermissionId
                        ])];
                case 33:
                    _a.sent();
                    return [4 /*yield*/, userCollaboratorApi.favorites.addFavoritesByIds('file', [fileDocxSharedFavId, fileSharedFavId])];
                case 34:
                    _a.sent();
                    return [4 /*yield*/, userManagerApi.nodes.lockFile(fileLockedId)];
                case 35:
                    _a.sent();
                    return [4 /*yield*/, userManagerApi.nodes.lockFile(fileFavLockedId)];
                case 36:
                    _a.sent();
                    return [4 /*yield*/, userManagerApi.nodes.lockFile(fileSharedLockedId)];
                case 37:
                    _a.sent();
                    return [4 /*yield*/, userManagerApi.nodes.lockFile(fileSharedFavLockedId)];
                case 38:
                    _a.sent();
                    return [4 /*yield*/, userManagerApi.nodes.setGranularPermission(fileGranularPermissionId, false, userConsumer, SITE_ROLES.SITE_MANAGER.ROLE)];
                case 39:
                    _a.sent();
                    return [4 /*yield*/, userManagerApi.favorites.addFavoriteById('file', fileLockedByUserId)];
                case 40:
                    _a.sent();
                    return [4 /*yield*/, Promise.all([
                            userConsumerApi.favorites.waitForApi({ expect: 9 }),
                            userConsumerApi.shared.waitForApi({ expect: 8 }),
                            userManagerApi.search.waitForApi(userManager, { expect: 14 }),
                            userCollaboratorApi.favorites.waitForApi({ expect: 2 })
                        ])];
                case 41:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userManagerApi.sites.deleteSite(sitePrivate)];
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
    describe('Consumer', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWith(userConsumer)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('on File Libraries', function () {
            librariesTests(sitePrivate);
        });
        describe('on Favorites', function () {
            favoritesTests();
        });
        describe('on Search Results', function () {
            searchResultsTests();
        });
        describe('on Viewer', function () {
            viewerTests(sitePrivate);
        });
        describe('on Shared Files', function () {
            sharedFilesTests();
        });
    });
    describe('Collaborator', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWith(userCollaborator)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        collaboratorTests(sitePrivate);
    });
    describe('File locked - user is lock owner', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWith(userDemoted)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        filesLockedByCurrentUser(sitePrivate);
    });
    describe('File locked by other user - user is manager', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWith(userManager)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        filesLockedByOtherUser(sitePrivate);
    });
});
//# sourceMappingURL=special-permissions-actions.test.js.map