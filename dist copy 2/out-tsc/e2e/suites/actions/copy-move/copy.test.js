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
import { LoginPage, BrowsingPage } from '../../../pages/pages';
import { ContentNodeSelectorDialog } from '../../../components/dialog/content-node-selector-dialog';
import { RepoClient } from '../../../utilities/repo-client/repo-client';
import { Utils } from '../../../utilities/utils';
describe('Copy content', function () {
    var username = "user-" + Utils.random();
    var source = "source-" + Utils.random();
    var sourceId;
    var destinationPF = "destinationPersonal-" + Utils.random();
    var destinationIdPF;
    var destinationRF = "destinationRecent-" + Utils.random();
    var destinationIdRF;
    var destinationSF = "destinationShared-" + Utils.random();
    var destinationIdSF;
    var destinationFav = "destinationFav-" + Utils.random();
    var destinationIdFav;
    var destinationSearch = "destinationSearch-" + Utils.random();
    var destinationIdSearch;
    var file1 = "file1-" + Utils.random() + ".txt";
    var file1Id;
    var folder1 = "folder1-" + Utils.random();
    var folder1Id;
    var fileInFolder = "fileInFolder-" + Utils.random() + ".txt";
    var fileInFolderId;
    var folder2 = "folder2-" + Utils.random();
    var folder2Id;
    var fileInFolder2 = fileInFolder;
    var folderExisting = "folder-existing-" + Utils.random();
    var folderExistingId;
    var file1InFolderExisting = "file1InFolderExisting-" + Utils.random() + ".txt";
    var file2InFolderExisting = "file2InFolderExisting-" + Utils.random() + ".txt";
    var file2 = "file2-" + Utils.random() + ".txt";
    var file2Id;
    var file3 = "file3-" + Utils.random() + ".txt";
    var file3Id;
    var file4 = "file4-" + Utils.random() + ".txt";
    var file4Id;
    var fileLocked1 = "file-locked1-" + Utils.random() + ".txt";
    var fileLocked1Id;
    var folderWithLockedFiles = "folder-locked1-" + Utils.random();
    var folderWithLockedFilesId;
    var fileLockedInFolder = "file-locked-" + Utils.random();
    var fileLockedInFolderId;
    var existingFile = "existing-" + Utils.random() + ".txt";
    var existingFileToCopyId;
    var existingFolder = "existing-" + Utils.random();
    var existingFolderToCopyId;
    var existingIdPF, existingIdFav, existingIdSearch;
    var folderExistingPFId, folderExistingFavId, folderExistingSearchId;
    var file2InFolder = "file2InFolder-" + Utils.random() + ".txt";
    var file3InFolder = "file3InFolder-" + Utils.random() + ".txt";
    var siteName = "site-" + Utils.random();
    var folderSitePF = "folderSitePersonal-" + Utils.random();
    var folderSiteRF = "folderSiteRecent-" + Utils.random();
    var folderSiteSF = "folderSiteShared-" + Utils.random();
    var folderSiteFav = "folderSiteFav-" + Utils.random();
    var folderSiteSearch = "folderSiteSearch-" + Utils.random();
    var locationId, destinationId;
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable, toolbar = page.toolbar;
    var copyDialog = new ContentNodeSelectorDialog();
    var searchInput = page.header.searchInput;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var docLibId;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(source)];
                case 2:
                    sourceId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(destinationPF)];
                case 3:
                    destinationIdPF = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(destinationRF)];
                case 4:
                    destinationIdRF = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(destinationSF)];
                case 5:
                    destinationIdSF = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(destinationFav)];
                case 6:
                    destinationIdFav = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(destinationSearch)];
                case 7:
                    destinationIdSearch = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(existingFile, sourceId)];
                case 8:
                    existingFileToCopyId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.shared.shareFileById(existingFileToCopyId)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', existingFileToCopyId)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(existingFile, destinationIdPF)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(existingFile, destinationIdRF)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(existingFile, destinationIdSF)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(existingFile, destinationIdFav)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(existingFile, destinationIdSearch)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(existingFolder, sourceId)];
                case 16:
                    existingFolderToCopyId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(existingFolder, destinationIdPF)];
                case 17:
                    existingIdPF = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(existingFolder, destinationIdRF)];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(existingFolder, destinationIdSF)];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(existingFolder, destinationIdFav)];
                case 20:
                    existingIdFav = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(existingFolder, destinationIdSearch)];
                case 21:
                    existingIdSearch = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file2InFolder, existingFolderToCopyId)];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(file3InFolder, existingIdPF)];
                case 23:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(file3InFolder, existingIdFav)];
                case 24:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(file3InFolder, existingIdSearch)];
                case 25:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('folder', existingFolderToCopyId)];
                case 26:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folder1, sourceId)];
                case 27:
                    folder1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileInFolder, folder1Id)];
                case 28:
                    fileInFolderId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('folder', folder1Id)];
                case 29:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', fileInFolderId)];
                case 30:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.shareFileById(fileInFolderId)];
                case 31:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderExisting, sourceId)];
                case 32:
                    folderExistingId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('folder', folderExistingId)];
                case 33:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(file1InFolderExisting, folderExistingId)];
                case 34:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderExisting, destinationIdPF)];
                case 35:
                    folderExistingPFId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file2InFolderExisting, folderExistingPFId)];
                case 36:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderExisting, destinationIdFav)];
                case 37:
                    folderExistingFavId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file2InFolderExisting, folderExistingFavId)];
                case 38:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderExisting, destinationIdSearch)];
                case 39:
                    folderExistingSearchId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file2InFolderExisting, folderExistingSearchId)];
                case 40:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folder2, sourceId)];
                case 41:
                    folder2Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileInFolder2, folder2Id)];
                case 42:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('folder', folder2Id)];
                case 43:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(fileLocked1, sourceId)];
                case 44:
                    fileLocked1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked1Id)];
                case 45:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderWithLockedFiles, sourceId)];
                case 46:
                    folderWithLockedFilesId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(fileLockedInFolder, folderWithLockedFilesId)];
                case 47:
                    fileLockedInFolderId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.lockFile(fileLockedInFolderId)];
                case 48:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('folder', folderWithLockedFilesId)];
                case 49:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(file1, sourceId)];
                case 50:
                    file1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file2, sourceId)];
                case 51:
                    file2Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file3, sourceId)];
                case 52:
                    file3Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file4, sourceId)];
                case 53:
                    file4Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.shared.shareFileById(file1Id)];
                case 54:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.shareFileById(file2Id)];
                case 55:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.shareFileById(file3Id)];
                case 56:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.shareFileById(file4Id)];
                case 57:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.shareFileById(fileLocked1Id)];
                case 58:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file1Id)];
                case 59:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file2Id)];
                case 60:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file3Id)];
                case 61:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file4Id)];
                case 62:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', fileLocked1Id)];
                case 63:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(siteName)];
                case 64:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.getDocLibId(siteName)];
                case 65:
                    docLibId = _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderSitePF, docLibId)];
                case 66:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderSiteRF, docLibId)];
                case 67:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderSiteSF, docLibId)];
                case 68:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderSiteFav, docLibId)];
                case 69:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderSiteSearch, docLibId)];
                case 70:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 7 })];
                case 71:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.waitForApi({ expect: 13 })];
                case 72:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 73:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(sourceId)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.deleteSite(siteName)];
                case 2:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('from Recent Files', function () {
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.clickRecentFilesAndWait()];
                    case 2:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(destinationIdRF)];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Copy a file - [C280194]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, copyFile(file1, source, destinationRF)];
        }); }); });
        it('Copy multiple items - [C280201]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, copyMultipleItems([file2, file3], source, destinationRF)];
        }); }); });
        it('Copy a file with a name that already exists on the destination - [C280196]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, copyFileWithNameThatAlreadyExists(existingFile, source, destinationRF)];
        }); }); });
        it('Copy items into a library - [C291899]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, copyItemsIntoLibrary([file1, file2], source, folderSiteRF)];
        }); }); });
        it('Copy locked file - [C280198]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, copyLockedFile(fileLocked1, source, destinationRF, function () {
                        locationId = sourceId;
                        destinationId = destinationIdRF;
                    })];
            });
        }); });
        it('Undo copy of files - [C280202]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, undoCopyFile(file4, source, destinationRF)];
        }); }); });
    });
    describe('from Personal Files', function () {
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(source)];
                    case 3:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(destinationIdPF)];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Copy a file - [C217135]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, copyFile(file1, '', destinationPF)];
        }); }); });
        it('Copy a folder with content - [C291888]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, copyFolderWithContent(folder1, '', destinationPF)];
        }); }); });
        it('Copy multiple items - [C291889]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, copyMultipleItems([file2, file3], '', destinationPF)];
        }); }); });
        it('Copy a file with a name that already exists on the destination - [C217137]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, copyFileWithNameThatAlreadyExists(existingFile, '', destinationPF)];
        }); }); });
        it('Copy a folder with a name that already exists on the destination - [C217138]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, copyFolderWithNameThatAlreadyExists(existingFolder, '', destinationPF)];
        }); }); });
        it('Copy items into a library - [C280282]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, copyItemsIntoLibrary([file1, folder1], '', folderSitePF)];
        }); }); });
        it('Copy locked file - [C217139]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, copyLockedFile(fileLocked1, '', destinationPF, function () {
                        locationId = sourceId;
                        destinationId = destinationIdPF;
                    })];
            });
        }); });
        it('Copy folder that contains locked file - [C217140]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, copyFolderThatContainsLockedFile(folderWithLockedFiles, '', destinationPF, function () {
                        locationId = folderWithLockedFilesId;
                        destinationId = destinationIdPF;
                    })];
            });
        }); });
        it('Undo copy of files - [C217171]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, undoCopyFile(file4, '', destinationPF)];
        }); }); });
        it('Undo copy of folders - [C217172]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, undoCopyFolder(folder2, '', destinationPF)];
        }); }); });
        it('Undo copy of a file when a file with same name already exists on the destination - [C217173]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, undoCopyFileWithExistingName(fileInFolder, '', folder2, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(folder1)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, dataTable.waitForHeader()];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); });
        it('Undo copy of a folder when a folder with same name already exists on the destination - [C217174]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, undoCopyFolderWithExistingName(folderExisting, '', destinationPF)];
        }); }); });
    });
    describe('from Shared Files', function () {
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.clickSharedFilesAndWait()];
                    case 2:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(destinationIdSF)];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Copy a file - [C280206]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, copyFile(file1, source, destinationSF)];
        }); }); });
        it('Copy multiple items - [C280213]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, copyMultipleItems([file2, file3], source, destinationSF)];
        }); }); });
        it('Copy a file with a name that already exists on the destination - [C280208]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, copyFileWithNameThatAlreadyExists(existingFile, source, destinationSF)];
        }); }); });
        it('Copy items into a library - [C291900]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, copyItemsIntoLibrary([file1, file2], source, folderSiteSF)];
        }); }); });
        it('Copy locked file - [C280210]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, copyLockedFile(fileLocked1, source, destinationSF, function () {
                        locationId = sourceId;
                        destinationId = destinationIdSF;
                    })];
            });
        }); });
        it('Undo copy of files - [C280214]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, undoCopyFile(file4, source, destinationSF)];
        }); }); });
    });
    describe('from Favorites', function () {
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.clickFavoritesAndWait()];
                    case 2:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(destinationIdFav)];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Copy a file - [C280218]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, copyFile(file1, source, destinationFav)];
        }); }); });
        it('Copy a folder with content - [C280219]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, copyFolderWithContent(folder1, source, destinationFav)];
        }); }); });
        it('Copy multiple items - [C280225]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, copyMultipleItems([file2, file3], source, destinationFav)];
        }); }); });
        it('Copy a file with a name that already exists on the destination - [C280220]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, copyFileWithNameThatAlreadyExists(existingFile, source, destinationFav)];
        }); }); });
        it('Copy a folder with a name that already exists on the destination - [C280221]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, copyFolderWithNameThatAlreadyExists(existingFolder, source, destinationFav)];
        }); }); });
        it('Copy items into a library - [C291901]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, copyItemsIntoLibrary([file1, folder1], source, folderSiteFav)];
        }); }); });
        it('Copy locked file - [C280222]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, copyLockedFile(fileLocked1, source, destinationFav, function () {
                        locationId = sourceId;
                        destinationId = destinationIdFav;
                    })];
            });
        }); });
        it('Copy folder that contains locked file - [C280223]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, copyFolderThatContainsLockedFile(folderWithLockedFiles, source, destinationFav, function () {
                        locationId = folderWithLockedFilesId;
                        destinationId = destinationIdFav;
                    })];
            });
        }); });
        it('Undo copy of files - [C280226]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, undoCopyFile(file4, source, destinationFav)];
        }); }); });
        it('Undo copy of folders - [C280227]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, undoCopyFolder(folder2, source, destinationFav)];
        }); }); });
        it('Undo copy of a file when a file with same name already exists on the destination - [C280228]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, undoCopyFileWithExistingName(fileInFolder, folder1, folder2)];
        }); }); });
        it('Undo copy of a folder when a folder with same name already exists on the destination - [C280229]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, undoCopyFolderWithExistingName(folderExisting, source, destinationFav)];
        }); }); });
    });
    describe('from Search Results', function () {
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                    case 3:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(destinationIdSearch)];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Copy a file - [C306932]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, copyFile(file1, source, destinationSearch, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, searchInput.searchFor(file1)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, dataTable.waitForBody()];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); });
        it('Copy a folder with content - [C306943]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, copyFolderWithContent(folder1, source, destinationSearch, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, searchInput.searchFor(folder1)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, dataTable.waitForBody()];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); });
        it('Copy multiple items - [C306944]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, copyMultipleItems([file2, file3], source, destinationSearch, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, searchInput.searchFor('file')];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, dataTable.waitForBody()];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); });
        it('Copy a file with a name that already exists on the destination - [C306933]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, copyFileWithNameThatAlreadyExists(existingFile, source, destinationSearch, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, searchInput.searchFor(existingFile)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, dataTable.waitForBody()];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); });
        it('Copy a folder with a name that already exists on the destination - [C306934]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, copyFolderWithNameThatAlreadyExists(existingFolder, source, destinationSearch, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, searchInput.searchFor(existingFolder)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, dataTable.waitForBody()];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); });
        it('Copy items into a library - [C306942]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, copyItemsIntoLibrary([file1, file2], source, folderSiteSearch, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, searchInput.searchFor('file')];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, dataTable.waitForBody()];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); });
        it('Copy locked file - [C306935]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, copyLockedFile(fileLocked1, source, destinationSearch, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    locationId = sourceId;
                                    destinationId = destinationIdSearch;
                                    return [4 /*yield*/, searchInput.searchFor(fileLocked1)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, dataTable.waitForBody()];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); });
        it('Copy folder that contains locked file - [C306936]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, copyFolderThatContainsLockedFile(folderWithLockedFiles, source, destinationSearch, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    locationId = folderWithLockedFilesId;
                                    destinationId = destinationIdSearch;
                                    return [4 /*yield*/, searchInput.searchFor(folderWithLockedFiles)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, dataTable.waitForBody()];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); });
        it('Undo copy of files - [C306938]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, undoCopyFile(file4, source, destinationSearch, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, searchInput.searchFor(file4)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, dataTable.waitForBody()];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); });
        it('Undo copy of folders - [C306939]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, undoCopyFolder(folder2, source, destinationSearch, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, searchInput.searchFor(folder2)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, dataTable.waitForBody()];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); });
        it('Undo copy of a file when a file with same name already exists on the destination - [C306940]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, undoCopyFileWithExistingName(fileInFolder, folder1, folder2, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, searchInput.searchFor(fileInFolder)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, dataTable.waitForBody()];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); });
        it('Undo copy of a folder when a folder with same name already exists on the destination - [C306941]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, undoCopyFolderWithExistingName(folderExisting, source, destinationSearch, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, searchInput.searchFor(folderExisting)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, dataTable.waitForBody()];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); });
    });
    function copyFile(fileName, location, destination, doBefore) {
        if (location === void 0) { location = ''; }
        if (doBefore === void 0) { doBefore = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var msg, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!doBefore) return [3 /*break*/, 2];
                        return [4 /*yield*/, doBefore()];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2: return [4 /*yield*/, dataTable.selectItem(fileName, location)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, copyDialog.selectLocation('Personal Files')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, copyDialog.selectDestination(destination)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, copyDialog.clickCopy()];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        msg = _c.sent();
                        expect(msg).toContain('Copied 1 item');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, copyDialog.waitForDialogToClose()];
                    case 9:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileName)];
                    case 10:
                        _a.apply(void 0, [_c.sent()]).toBe(true, fileName + " not present in source folder");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 11:
                        _c.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 12:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileName)];
                    case 13:
                        _b.apply(void 0, [_c.sent()]).toBe(true, fileName + " not present in " + destination + " folder");
                        return [2 /*return*/];
                }
            });
        });
    }
    function copyFolderWithContent(folderName, location, destination, doBefore) {
        if (location === void 0) { location = ''; }
        if (doBefore === void 0) { doBefore = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var msg, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!doBefore) return [3 /*break*/, 2];
                        return [4 /*yield*/, doBefore()];
                    case 1:
                        _e.sent();
                        _e.label = 2;
                    case 2: return [4 /*yield*/, dataTable.selectItem(folderName, location)];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, copyDialog.selectLocation('Personal Files')];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, copyDialog.selectDestination(destination)];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, copyDialog.clickCopy()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        msg = _e.sent();
                        expect(msg).toContain('Copied 1 item');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, copyDialog.waitForDialogToClose()];
                    case 9:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folderName)];
                    case 10:
                        _a.apply(void 0, [_e.sent()]).toBe(true, folderName + " not present in source folder");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 11:
                        _e.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 12:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folderName)];
                    case 13:
                        _b.apply(void 0, [_e.sent()]).toBe(true, folderName + " not present in " + destination + " folder");
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileInFolder)];
                    case 14:
                        _c.apply(void 0, [_e.sent()]).toBe(false, fileInFolder + " is present in " + destination);
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(folderName)];
                    case 15:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileInFolder)];
                    case 16:
                        _d.apply(void 0, [_e.sent()]).toBe(true, fileInFolder + " is not present in " + folderName + " folder in " + destination);
                        return [2 /*return*/];
                }
            });
        });
    }
    function copyMultipleItems(items, location, destination, doBefore) {
        if (location === void 0) { location = ''; }
        if (doBefore === void 0) { doBefore = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var msg, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!doBefore) return [3 /*break*/, 2];
                        return [4 /*yield*/, doBefore()];
                    case 1:
                        _e.sent();
                        _e.label = 2;
                    case 2: return [4 /*yield*/, dataTable.selectMultipleItems(items, location)];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, copyDialog.selectLocation('Personal Files')];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, copyDialog.selectDestination(destination)];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, copyDialog.clickCopy()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        msg = _e.sent();
                        expect(msg).toContain('Copied 2 items');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, copyDialog.waitForDialogToClose()];
                    case 9:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(items[0])];
                    case 10:
                        _a.apply(void 0, [_e.sent()]).toBe(true, items[0] + " not present in source folder");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(items[1])];
                    case 11:
                        _b.apply(void 0, [_e.sent()]).toBe(true, items[1] + " not present in source folder");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 12:
                        _e.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 13:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(items[0])];
                    case 14:
                        _c.apply(void 0, [_e.sent()]).toBe(true, items[0] + " not present in " + destination + " folder");
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(items[1])];
                    case 15:
                        _d.apply(void 0, [_e.sent()]).toBe(true, items[1] + " not present in " + destination + " folder");
                        return [2 /*return*/];
                }
            });
        });
    }
    function copyFileWithNameThatAlreadyExists(fileName, location, destination, doBefore) {
        if (location === void 0) { location = ''; }
        if (doBefore === void 0) { doBefore = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var msg, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!doBefore) return [3 /*break*/, 2];
                        return [4 /*yield*/, doBefore()];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2: return [4 /*yield*/, dataTable.selectItem(fileName, location)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, copyDialog.selectLocation('Personal Files')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, copyDialog.selectDestination(destination)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, copyDialog.clickCopy()];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        msg = _c.sent();
                        expect(msg).toContain('Copied 1 item');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, copyDialog.waitForDialogToClose()];
                    case 9:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileName)];
                    case 10:
                        _a.apply(void 0, [_c.sent()]).toBe(true, fileName + ".txt not present in source folder");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 11:
                        _c.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 12:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileName)];
                    case 13:
                        _b.apply(void 0, [_c.sent()]).toBe(true, fileName + ".txt not present in " + destination + " folder");
                        return [2 /*return*/];
                }
            });
        });
    }
    function copyFolderWithNameThatAlreadyExists(folderName, location, destination, doBefore) {
        if (location === void 0) { location = ''; }
        if (doBefore === void 0) { doBefore = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var msg, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!doBefore) return [3 /*break*/, 2];
                        return [4 /*yield*/, doBefore()];
                    case 1:
                        _e.sent();
                        _e.label = 2;
                    case 2: return [4 /*yield*/, dataTable.selectItem(folderName, location)];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, copyDialog.selectLocation('Personal Files')];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, copyDialog.selectDestination(destination)];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, copyDialog.clickCopy()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        msg = _e.sent();
                        expect(msg).toContain('Copied 1 item');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, copyDialog.waitForDialogToClose()];
                    case 9:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folderName)];
                    case 10:
                        _a.apply(void 0, [_e.sent()]).toBe(true, folderName + " not present in source folder");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 11:
                        _e.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 12:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folderName)];
                    case 13:
                        _b.apply(void 0, [_e.sent()]).toBe(true, folderName + " not present in " + destination + " folder");
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(folderName)];
                    case 14:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file2InFolder)];
                    case 15:
                        _c.apply(void 0, [_e.sent()]).toBe(true, file2InFolder + " not present in " + destination + " folder in " + folderName);
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file3InFolder)];
                    case 16:
                        _d.apply(void 0, [_e.sent()]).toBe(true, file3InFolder + " not present in " + destination + " folder in " + folderName);
                        return [2 /*return*/];
                }
            });
        });
    }
    function copyItemsIntoLibrary(items, location, destination, doBefore) {
        if (location === void 0) { location = ''; }
        if (doBefore === void 0) { doBefore = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var noOfItems, msg, _i, items_1, item, _a, _b, items_2, item, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!doBefore) return [3 /*break*/, 2];
                        return [4 /*yield*/, doBefore()];
                    case 1:
                        _d.sent();
                        _d.label = 2;
                    case 2:
                        noOfItems = items.length;
                        return [4 /*yield*/, dataTable.selectMultipleItems(items, location)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, copyDialog.selectLocation('File Libraries')];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, copyDialog.dataTable.doubleClickOnRowByName(siteName)];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, copyDialog.dataTable.doubleClickOnRowByName('documentLibrary')];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, copyDialog.selectDestination(destination)];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, copyDialog.clickCopy()];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 10:
                        msg = _d.sent();
                        expect(msg).toContain("Copied " + noOfItems + " " + (noOfItems === 1 ? 'item' : 'items'));
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, copyDialog.waitForDialogToClose()];
                    case 11:
                        _d.sent();
                        _i = 0, items_1 = items;
                        _d.label = 12;
                    case 12:
                        if (!(_i < items_1.length)) return [3 /*break*/, 15];
                        item = items_1[_i];
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(item)];
                    case 13:
                        _a.apply(void 0, [_d.sent()]).toBe(true, item + " not present in source folder");
                        _d.label = 14;
                    case 14:
                        _i++;
                        return [3 /*break*/, 12];
                    case 15: return [4 /*yield*/, page.goToMyLibraries()];
                    case 16:
                        _d.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(siteName)];
                    case 17:
                        _d.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 18:
                        _d.sent();
                        _b = 0, items_2 = items;
                        _d.label = 19;
                    case 19:
                        if (!(_b < items_2.length)) return [3 /*break*/, 22];
                        item = items_2[_b];
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(item)];
                    case 20:
                        _c.apply(void 0, [_d.sent()]).toBe(true, item + " not present in " + destination + " folder");
                        _d.label = 21;
                    case 21:
                        _b++;
                        return [3 /*break*/, 19];
                    case 22: return [2 /*return*/];
                }
            });
        });
    }
    function copyLockedFile(fileName, location, destination, doBefore) {
        if (location === void 0) { location = ''; }
        if (doBefore === void 0) { doBefore = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var msg, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!doBefore) return [3 /*break*/, 2];
                        return [4 /*yield*/, doBefore()];
                    case 1:
                        _e.sent();
                        _e.label = 2;
                    case 2: return [4 /*yield*/, dataTable.selectItem(fileName, location)];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, copyDialog.selectLocation('Personal Files')];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, copyDialog.selectDestination(destination)];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, copyDialog.clickCopy()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        msg = _e.sent();
                        expect(msg).toContain('Copied 1 item');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, copyDialog.waitForDialogToClose()];
                    case 9:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileName)];
                    case 10:
                        _a.apply(void 0, [_e.sent()]).toBe(true, fileName + " not present in source folder");
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedByName(fileName, locationId)];
                    case 11:
                        _b.apply(void 0, [_e.sent()]).toBe(true, fileName + " not locked in " + location);
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 12:
                        _e.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 13:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileName)];
                    case 14:
                        _c.apply(void 0, [_e.sent()]).toBe(true, fileName + " not present in " + destination + " folder");
                        _d = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedByName(fileName, destinationId)];
                    case 15:
                        _d.apply(void 0, [_e.sent()]).toBe(false, fileName + " is locked in " + destination);
                        return [2 /*return*/];
                }
            });
        });
    }
    function copyFolderThatContainsLockedFile(folderName, location, destination, doBefore) {
        if (location === void 0) { location = ''; }
        if (doBefore === void 0) { doBefore = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var msg, _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return tslib_1.__generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        if (!doBefore) return [3 /*break*/, 2];
                        return [4 /*yield*/, doBefore()];
                    case 1:
                        _k.sent();
                        _k.label = 2;
                    case 2: return [4 /*yield*/, dataTable.selectItem(folderName, location)];
                    case 3:
                        _k.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 4:
                        _k.sent();
                        return [4 /*yield*/, copyDialog.selectLocation('Personal Files')];
                    case 5:
                        _k.sent();
                        return [4 /*yield*/, copyDialog.selectDestination(destination)];
                    case 6:
                        _k.sent();
                        return [4 /*yield*/, copyDialog.clickCopy()];
                    case 7:
                        _k.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        msg = _k.sent();
                        expect(msg).toContain('Copied 1 item');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, copyDialog.waitForDialogToClose()];
                    case 9:
                        _k.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folderName)];
                    case 10:
                        _a.apply(void 0, [_k.sent()]).toBe(true, folderName + " not present in source folder");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 11:
                        _k.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 12:
                        _k.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folderName)];
                    case 13:
                        _b.apply(void 0, [_k.sent()]).toBe(true, folderName + " not present in " + destination + " folder");
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileLockedInFolder)];
                    case 14:
                        _c.apply(void 0, [_k.sent()]).toBe(false, fileLockedInFolder + " is present in " + destination);
                        _d = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedByName(fileLockedInFolder, locationId)];
                    case 15:
                        _d.apply(void 0, [_k.sent()]).toBe(true, fileLockedInFolder + " not locked in " + location);
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(folderName)];
                    case 16:
                        _k.sent();
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileLockedInFolder)];
                    case 17:
                        _e.apply(void 0, [_k.sent()]).toBe(true, fileLockedInFolder + " is not present in " + folderName + " folder from " + destination);
                        _f = expect;
                        _h = (_g = apis.user.nodes).isFileLockedByName;
                        _j = [fileLockedInFolder];
                        return [4 /*yield*/, apis.user.nodes.getNodeIdFromParent(folderWithLockedFiles, destinationId)];
                    case 18: return [4 /*yield*/, _h.apply(_g, _j.concat([(_k.sent())]))];
                    case 19:
                        _f.apply(void 0, [_k.sent()]).toBe(false, fileLockedInFolder + " is locked in " + destination);
                        return [2 /*return*/];
                }
            });
        });
    }
    function undoCopyFile(fileName, location, destination, doBefore) {
        if (location === void 0) { location = ''; }
        if (doBefore === void 0) { doBefore = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var msg, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!doBefore) return [3 /*break*/, 2];
                        return [4 /*yield*/, doBefore()];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2: return [4 /*yield*/, dataTable.selectItem(fileName, location)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, copyDialog.selectLocation('Personal Files')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, copyDialog.selectDestination(destination)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, copyDialog.clickCopy()];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        msg = _c.sent();
                        expect(msg).toContain('Copied 1 item');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, page.clickSnackBarAction()];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 11:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileName)];
                    case 12:
                        _a.apply(void 0, [_c.sent()]).toBe(false, fileName + " present in " + destination + " folder");
                        return [4 /*yield*/, page.clickTrash()];
                    case 13:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isEmpty()];
                    case 14:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Trash is not empty');
                        return [2 /*return*/];
                }
            });
        });
    }
    function undoCopyFolder(folderName, location, destination, doBefore) {
        if (location === void 0) { location = ''; }
        if (doBefore === void 0) { doBefore = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var msg, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!doBefore) return [3 /*break*/, 2];
                        return [4 /*yield*/, doBefore()];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2: return [4 /*yield*/, dataTable.selectItem(folderName, location)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, copyDialog.selectLocation('Personal Files')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, copyDialog.selectDestination(destination)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, copyDialog.clickCopy()];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        msg = _c.sent();
                        expect(msg).toContain('Copied 1 item');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, page.clickSnackBarAction()];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 11:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folderName)];
                    case 12:
                        _a.apply(void 0, [_c.sent()]).toBe(false, folderName + " present in " + destination + " folder");
                        return [4 /*yield*/, page.clickTrash()];
                    case 13:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isEmpty()];
                    case 14:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Trash is not empty');
                        return [2 /*return*/];
                }
            });
        });
    }
    function undoCopyFileWithExistingName(fileName, location, destination, doBefore) {
        if (location === void 0) { location = ''; }
        if (doBefore === void 0) { doBefore = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var msg, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!doBefore) return [3 /*break*/, 2];
                        return [4 /*yield*/, doBefore()];
                    case 1:
                        _d.sent();
                        _d.label = 2;
                    case 2: return [4 /*yield*/, dataTable.selectItem(fileName, location)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, copyDialog.selectLocation('Personal Files')];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, copyDialog.dataTable.doubleClickOnRowByName(source)];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, copyDialog.selectDestination(destination)];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, copyDialog.clickCopy()];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 9:
                        msg = _d.sent();
                        expect(msg).toContain('Copied 1 item');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, page.clickSnackBarAction()];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 11:
                        _d.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(source)];
                    case 12:
                        _d.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(folder2)];
                    case 13:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileInFolder2)];
                    case 14:
                        _a.apply(void 0, [_d.sent()]).toBe(true, fileInFolder2 + " not present in " + destination + " folder");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileInFolder2 + "-1")];
                    case 15:
                        _b.apply(void 0, [_d.sent()]).toBe(false, fileInFolder2 + "-1 is present in " + destination + " folder");
                        return [4 /*yield*/, page.clickTrash()];
                    case 16:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isEmpty()];
                    case 17:
                        _c.apply(void 0, [_d.sent()]).toBe(true, 'Trash is not empty');
                        return [2 /*return*/];
                }
            });
        });
    }
    function undoCopyFolderWithExistingName(folderName, location, destination, doBefore) {
        if (location === void 0) { location = ''; }
        if (doBefore === void 0) { doBefore = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var msg, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!doBefore) return [3 /*break*/, 2];
                        return [4 /*yield*/, doBefore()];
                    case 1:
                        _e.sent();
                        _e.label = 2;
                    case 2: return [4 /*yield*/, dataTable.selectItem(folderName, location)];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, copyDialog.selectLocation('Personal Files')];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, copyDialog.dataTable.doubleClickOnRowByName(destination)];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, copyDialog.clickCopy()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        msg = _e.sent();
                        expect(msg).toContain('Copied 1 item');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, page.clickSnackBarAction()];
                    case 9:
                        _e.sent();
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 10:
                        _e.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 11:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folderName)];
                    case 12:
                        _a.apply(void 0, [_e.sent()]).toBe(true, folderName + " not present in " + destination + " folder");
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(folderName)];
                    case 13:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file2InFolderExisting)];
                    case 14:
                        _b.apply(void 0, [_e.sent()]).toBe(true, file2InFolderExisting + " not present in " + folderName + " in " + destination + " folder");
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file1InFolderExisting)];
                    case 15:
                        _c.apply(void 0, [_e.sent()]).toBe(false, file1InFolderExisting + " present in " + folderName + " in " + destination + " folder");
                        return [4 /*yield*/, page.clickTrash()];
                    case 16:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isEmpty()];
                    case 17:
                        _d.apply(void 0, [_e.sent()]).toBe(true, 'Trash is not empty');
                        return [2 /*return*/];
                }
            });
        });
    }
});
//# sourceMappingURL=copy.test.js.map