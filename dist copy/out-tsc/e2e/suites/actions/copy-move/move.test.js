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
describe('Move content', function () {
    var username = "user-" + Utils.random();
    var sourcePF = "sourcePersonal-" + Utils.random();
    var sourceIdPF;
    var destinationPF = "destinationPersonal-" + Utils.random();
    var destinationIdPF;
    var sourceRF = "sourceRecent-" + Utils.random();
    var sourceIdRF;
    var destinationRF = "destinationRecent-" + Utils.random();
    var destinationIdRF;
    var sourceSF = "sourceShared-" + Utils.random();
    var sourceIdSF;
    var destinationSF = "destinationShared-" + Utils.random();
    var destinationIdSF;
    var sourceFav = "sourceFavorites-" + Utils.random();
    var sourceIdFav;
    var destinationFav = "destinationFavorites-" + Utils.random();
    var destinationIdFav;
    var siteName = "site-" + Utils.random();
    var folderSitePF = "folderSitePersonal-" + Utils.random();
    var folderSiteRF = "folderSiteRecent-" + Utils.random();
    var folderSiteSF = "folderSiteShared-" + Utils.random();
    var folderSiteFav = "folderSiteFavorites-" + Utils.random();
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable, toolbar = page.toolbar;
    var moveDialog = new ContentNodeSelectorDialog();
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var docLibId;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(siteName)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.getDocLibId(siteName)];
                case 3:
                    docLibId = _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderSitePF, docLibId)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderSiteRF, docLibId)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderSiteSF, docLibId)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(folderSiteFav, docLibId)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(sourcePF)];
                case 8:
                    sourceIdPF = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(destinationPF)];
                case 9:
                    destinationIdPF = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(sourceRF)];
                case 10:
                    sourceIdRF = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(destinationRF)];
                case 11:
                    destinationIdRF = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(sourceSF)];
                case 12:
                    sourceIdSF = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(destinationSF)];
                case 13:
                    destinationIdSF = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(sourceFav)];
                case 14:
                    sourceIdFav = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(destinationFav)];
                case 15:
                    destinationIdFav = (_a.sent()).entry.id;
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 16:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(sourceIdPF)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(sourceIdRF)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(sourceIdSF)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(sourceIdFav)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(destinationIdPF)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(destinationIdRF)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(destinationIdSF)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(destinationIdFav)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.deleteSite(siteName)];
                case 9:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('from Personal Files', function () {
        var file1 = "file1-" + Utils.random() + ".txt";
        var folder1 = "folder1-" + Utils.random();
        var folder1Id;
        var fileInFolder = "fileInFolder-" + Utils.random() + ".txt";
        var file2 = "file2-" + Utils.random() + ".txt";
        var file3 = "file3-" + Utils.random() + ".txt";
        var file4 = "file4-" + Utils.random() + ".txt";
        var folder2 = "folder2-" + Utils.random();
        var folder2Id;
        var fileInFolder2 = "fileInFolder2-" + Utils.random() + ".txt";
        var existingFile = "existing-" + Utils.random();
        var existingFolder = "existing-" + Utils.random();
        var existingId1, existingId2;
        var file2InFolder = "file2InFolder-" + Utils.random() + ".txt";
        var file3InFolder = "file3InFolder-" + Utils.random() + ".txt";
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFile(file1, sourceIdPF)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFolder(folder1, sourceIdPF)];
                    case 2:
                        folder1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileInFolder, folder1Id)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(file2, sourceIdPF)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(file3, sourceIdPF)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(existingFile + ".txt", sourceIdPF)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(existingFile + ".txt", destinationIdPF)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFolder(existingFolder, sourceIdPF)];
                    case 8:
                        existingId1 = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(existingFolder, destinationIdPF)];
                    case 9:
                        existingId2 = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file2InFolder, existingId1)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(file3InFolder, existingId2)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(file4, sourceIdPF)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFolder(folder2, sourceIdPF)];
                    case 13:
                        folder2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileInFolder2, folder2Id)];
                    case 14:
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
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(sourcePF)];
                    case 3:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move a file - [C217316]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var msg, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, moveDialog.selectLocation('Personal Files')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, moveDialog.selectDestination(destinationPF)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, moveDialog.clickMove()];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        msg = _c.sent();
                        expect(msg).toContain('Moved 1 item');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, moveDialog.waitForDialogToClose()];
                    case 7:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file1)];
                    case 8:
                        _a.apply(void 0, [_c.sent()]).toBe(false, file1 + " still present in source folder");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destinationPF)];
                    case 10:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file1)];
                    case 11:
                        _b.apply(void 0, [_c.sent()]).toBe(true, file1 + " not present in destination folder");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move a folder with content - [C217317]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var msg, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(folder1)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.selectLocation('Personal Files')];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.selectDestination(destinationPF)];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.clickMove()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        msg = _e.sent();
                        expect(msg).toContain('Moved 1 item');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, moveDialog.waitForDialogToClose()];
                    case 7:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folder1)];
                    case 8:
                        _a.apply(void 0, [_e.sent()]).toBe(false, folder1 + " still present in source folder");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 9:
                        _e.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destinationPF)];
                    case 10:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folder1)];
                    case 11:
                        _b.apply(void 0, [_e.sent()]).toBe(true, folder1 + " not present in destination folder");
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileInFolder)];
                    case 12:
                        _c.apply(void 0, [_e.sent()]).toBe(false, fileInFolder + " is present in destination folder");
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(folder1)];
                    case 13:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileInFolder)];
                    case 14:
                        _d.apply(void 0, [_e.sent()]).toBe(true, fileInFolder + " is not present in parent folder");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move multiple items - [C291958]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var msg, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([file2, file3])];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.selectLocation('Personal Files')];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.selectDestination(destinationPF)];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.clickMove()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        msg = _e.sent();
                        expect(msg).toContain('Moved 2 items');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, moveDialog.waitForDialogToClose()];
                    case 7:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file2)];
                    case 8:
                        _a.apply(void 0, [_e.sent()]).toBe(false, file2 + " still present in source folder");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file3)];
                    case 9:
                        _b.apply(void 0, [_e.sent()]).toBe(false, file3 + " still present in source folder");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 10:
                        _e.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destinationPF)];
                    case 11:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file2)];
                    case 12:
                        _c.apply(void 0, [_e.sent()]).toBe(true, file2 + " not present in destination folder");
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file3)];
                    case 13:
                        _d.apply(void 0, [_e.sent()]).toBe(true, file3 + " not present in destination folder");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move a file with a name that already exists on the destination - [C217318]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var msg, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(existingFile)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.selectLocation('Personal Files')];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.selectDestination(destinationPF)];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.clickMove()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        msg = _d.sent();
                        expect(msg).toContain('Move unsuccessful, a file with the same name already exists');
                        expect(msg).not.toContain('Undo');
                        return [4 /*yield*/, moveDialog.waitForDialogToClose()];
                    case 7:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(existingFile + ".txt")];
                    case 8:
                        _a.apply(void 0, [_d.sent()]).toBe(true, existingFile + ".txt not present in source folder");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destinationPF)];
                    case 10:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(existingFile + ".txt")];
                    case 11:
                        _b.apply(void 0, [_d.sent()]).toBe(true, existingFile + ".txt not present in destination folder");
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(existingFile + "-1.txt")];
                    case 12:
                        _c.apply(void 0, [_d.sent()]).toBe(false, existingFile + "-1.txt is present in destination folder");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move a folder with a name that already exists on the destination - [C217319]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var msg, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(existingFolder)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.selectLocation('Personal Files')];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.selectDestination(destinationPF)];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.clickMove()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        msg = _e.sent();
                        expect(msg).toContain('Moved 1 item');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, moveDialog.waitForDialogToClose()];
                    case 7:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(existingFolder)];
                    case 8:
                        _a.apply(void 0, [_e.sent()]).toBe(false, existingFolder + " still present in source folder");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 9:
                        _e.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destinationPF)];
                    case 10:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(existingFolder)];
                    case 11:
                        _b.apply(void 0, [_e.sent()]).toBe(true, existingFolder + " not present in destination folder");
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(existingFolder)];
                    case 12:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file2InFolder)];
                    case 13:
                        _c.apply(void 0, [_e.sent()]).toBe(true, file2InFolder + " not present in destination folder");
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file3InFolder)];
                    case 14:
                        _d.apply(void 0, [_e.sent()]).toBe(true, file3InFolder + " not present in destination folder");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move items into a library - [C291969]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var msg, _a, _b, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([file4, folder2])];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 2:
                        _f.sent();
                        return [4 /*yield*/, moveDialog.selectLocation('File Libraries')];
                    case 3:
                        _f.sent();
                        return [4 /*yield*/, moveDialog.dataTable.doubleClickOnRowByName(siteName)];
                    case 4:
                        _f.sent();
                        return [4 /*yield*/, moveDialog.dataTable.doubleClickOnRowByName('documentLibrary')];
                    case 5:
                        _f.sent();
                        return [4 /*yield*/, moveDialog.selectDestination(folderSitePF)];
                    case 6:
                        _f.sent();
                        return [4 /*yield*/, moveDialog.clickMove()];
                    case 7:
                        _f.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        msg = _f.sent();
                        expect(msg).toContain('Moved 2 items');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, moveDialog.waitForDialogToClose()];
                    case 9:
                        _f.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file4)];
                    case 10:
                        _a.apply(void 0, [_f.sent()]).toBe(false, file4 + " still present in source folder");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folder2)];
                    case 11:
                        _b.apply(void 0, [_f.sent()]).toBe(false, folder2 + " still present in source folder");
                        return [4 /*yield*/, page.goToMyLibraries()];
                    case 12:
                        _f.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(siteName)];
                    case 13:
                        _f.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(folderSitePF)];
                    case 14:
                        _f.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file4)];
                    case 15:
                        _c.apply(void 0, [_f.sent()]).toBe(true, file4 + " not present in destination folder");
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folder2)];
                    case 16:
                        _d.apply(void 0, [_f.sent()]).toBe(true, folder2 + " not present in destination folder");
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(folder2)];
                    case 17:
                        _f.sent();
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileInFolder2)];
                    case 18:
                        _e.apply(void 0, [_f.sent()]).toBe(true, fileInFolder2 + " not present in parent folder");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('from Recent Files', function () {
        var file1 = "file1-" + Utils.random() + ".txt";
        var file2 = "file2-" + Utils.random() + ".txt";
        var file3 = "file3-" + Utils.random() + ".txt";
        var file4 = "file4-" + Utils.random() + ".txt";
        var existingFile = "existing-" + Utils.random();
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFile(file1, sourceIdRF)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(file2, sourceIdRF)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(file3, sourceIdRF)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(existingFile + ".txt", sourceIdRF)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(existingFile + ".txt", destinationIdRF)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(file4, sourceIdRF)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, apis.user.search.waitForApi(username, { expect: 16 })];
                    case 7:
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
                        return [4 /*yield*/, page.clickRecentFilesAndWait()];
                    case 2:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move a file - [C280230]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var msg, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1, sourceRF)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.selectLocation('Personal Files')];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.selectDestination(destinationRF)];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.clickMove()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        msg = _d.sent();
                        expect(msg).toContain('Moved 1 item');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, moveDialog.waitForDialogToClose()];
                    case 7:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file1, destinationRF)];
                    case 8:
                        _a.apply(void 0, [_d.sent()]).toBe(true, file1 + " from " + destinationRF + " not present");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file1, sourceRF)];
                    case 9:
                        _b.apply(void 0, [_d.sent()]).toBe(false, file1 + " from " + sourceRF + " is present");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destinationRF)];
                    case 11:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file1)];
                    case 12:
                        _c.apply(void 0, [_d.sent()]).toBe(true, file1 + " not present in destination folder");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move multiple items - [C280237]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var msg, _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([file2, file3], sourceRF)];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 2:
                        _g.sent();
                        return [4 /*yield*/, moveDialog.selectLocation('Personal Files')];
                    case 3:
                        _g.sent();
                        return [4 /*yield*/, moveDialog.selectDestination(destinationRF)];
                    case 4:
                        _g.sent();
                        return [4 /*yield*/, moveDialog.clickMove()];
                    case 5:
                        _g.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        msg = _g.sent();
                        expect(msg).toContain('Moved 2 items');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, moveDialog.waitForDialogToClose()];
                    case 7:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file2, destinationRF)];
                    case 8:
                        _a.apply(void 0, [_g.sent()]).toBe(true, file2 + " from " + destinationRF + " not present");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file3, destinationRF)];
                    case 9:
                        _b.apply(void 0, [_g.sent()]).toBe(true, file3 + " from " + destinationRF + " not present");
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file2, sourceRF)];
                    case 10:
                        _c.apply(void 0, [_g.sent()]).toBe(false, file2 + " from " + sourceRF + " is present");
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file3, sourceRF)];
                    case 11:
                        _d.apply(void 0, [_g.sent()]).toBe(false, file3 + " from " + sourceRF + " is present");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 12:
                        _g.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destinationRF)];
                    case 13:
                        _g.sent();
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file2)];
                    case 14:
                        _e.apply(void 0, [_g.sent()]).toBe(true, file2 + " not present in destination folder");
                        _f = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file3)];
                    case 15:
                        _f.apply(void 0, [_g.sent()]).toBe(true, file3 + " not present in destination folder");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move a file with a name that already exists on the destination - [C291970]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var msg, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(existingFile, sourceRF)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.selectLocation('Personal Files')];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.selectDestination(destinationRF)];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.clickMove()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        msg = _e.sent();
                        expect(msg).toContain('Move unsuccessful, a file with the same name already exists');
                        expect(msg).not.toContain('Undo');
                        return [4 /*yield*/, moveDialog.waitForDialogToClose()];
                    case 7:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(existingFile, sourceRF)];
                    case 8:
                        _a.apply(void 0, [_e.sent()]).toBe(true, existingFile + " from " + sourceRF + " not present");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(existingFile, destinationRF)];
                    case 9:
                        _b.apply(void 0, [_e.sent()]).toBe(true, existingFile + " from " + destinationRF + " not present");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 10:
                        _e.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destinationRF)];
                    case 11:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(existingFile + ".txt")];
                    case 12:
                        _c.apply(void 0, [_e.sent()]).toBe(true, existingFile + ".txt not present in destination folder");
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(existingFile + "-1.txt")];
                    case 13:
                        _d.apply(void 0, [_e.sent()]).toBe(false, existingFile + "-1.txt is present in destination folder");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move items into a library - [C291971]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var msg, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file4, sourceRF)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.selectLocation('File Libraries')];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.dataTable.doubleClickOnRowByName(siteName)];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.dataTable.doubleClickOnRowByName('documentLibrary')];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.selectDestination(folderSiteRF)];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.clickMove()];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        msg = _d.sent();
                        expect(msg).toContain('Moved 1 item');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, moveDialog.waitForDialogToClose()];
                    case 9:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file4, folderSiteRF)];
                    case 10:
                        _a.apply(void 0, [_d.sent()]).toBe(true, file4 + " from " + folderSiteRF + " not present");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file4, sourceRF)];
                    case 11:
                        _b.apply(void 0, [_d.sent()]).toBe(false, file4 + " from " + sourceRF + " is present");
                        return [4 /*yield*/, page.goToMyLibraries()];
                    case 12:
                        _d.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(siteName)];
                    case 13:
                        _d.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(folderSiteRF)];
                    case 14:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file4)];
                    case 15:
                        _c.apply(void 0, [_d.sent()]).toBe(true, file4 + " not present in destination folder");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('from Shared Files', function () {
        var file1 = "file1-" + Utils.random() + ".txt";
        var file1Id;
        var file2 = "file2-" + Utils.random() + ".txt";
        var file2Id;
        var file3 = "file3-" + Utils.random() + ".txt";
        var file3Id;
        var file4 = "file4-" + Utils.random() + ".txt";
        var file4Id;
        var existingFile = "existing-" + Utils.random();
        var existingFileId;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFile(file1, sourceIdSF)];
                    case 1:
                        file1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.shared.shareFileById(file1Id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(file2, sourceIdSF)];
                    case 3:
                        file2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file3, sourceIdSF)];
                    case 4:
                        file3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.shared.shareFileById(file2Id)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFileById(file3Id)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(existingFile + ".txt", sourceIdSF)];
                    case 7:
                        existingFileId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.shared.shareFileById(existingFileId)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(existingFile + ".txt", destinationIdSF)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(file4, sourceIdSF)];
                    case 10:
                        file4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.shared.shareFileById(file4Id)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 5 })];
                    case 12:
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
                        return [4 /*yield*/, page.clickSharedFilesAndWait()];
                    case 2:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move a file - [C280243]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var msg, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1, sourceSF)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.selectLocation('Personal Files')];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.selectDestination(destinationSF)];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.clickMove()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        msg = _d.sent();
                        expect(msg).toContain('Moved 1 item');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, moveDialog.waitForDialogToClose()];
                    case 7:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file1, destinationSF)];
                    case 8:
                        _a.apply(void 0, [_d.sent()]).toBe(true, file1 + " from " + destinationSF + " not present");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file1, sourceSF)];
                    case 9:
                        _b.apply(void 0, [_d.sent()]).toBe(false, file1 + " from " + sourceSF + " is present");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destinationSF)];
                    case 11:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file1)];
                    case 12:
                        _c.apply(void 0, [_d.sent()]).toBe(true, file1 + " not present in destination folder");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move multiple items - [C280250]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var msg, _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([file2, file3], sourceSF)];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 2:
                        _g.sent();
                        return [4 /*yield*/, moveDialog.selectLocation('Personal Files')];
                    case 3:
                        _g.sent();
                        return [4 /*yield*/, moveDialog.selectDestination(destinationSF)];
                    case 4:
                        _g.sent();
                        return [4 /*yield*/, moveDialog.clickMove()];
                    case 5:
                        _g.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        msg = _g.sent();
                        expect(msg).toContain('Moved 2 items');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, moveDialog.waitForDialogToClose()];
                    case 7:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file2, destinationSF)];
                    case 8:
                        _a.apply(void 0, [_g.sent()]).toBe(true, file2 + " from " + destinationSF + " not present");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file3, destinationSF)];
                    case 9:
                        _b.apply(void 0, [_g.sent()]).toBe(true, file3 + " from " + destinationSF + " not present");
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file2, sourceSF)];
                    case 10:
                        _c.apply(void 0, [_g.sent()]).toBe(false, file2 + " from " + sourceSF + " is present");
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file3, sourceSF)];
                    case 11:
                        _d.apply(void 0, [_g.sent()]).toBe(false, file3 + " from " + sourceSF + " is present");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 12:
                        _g.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destinationSF)];
                    case 13:
                        _g.sent();
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file2)];
                    case 14:
                        _e.apply(void 0, [_g.sent()]).toBe(true, file2 + " not present in destination folder");
                        _f = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file3)];
                    case 15:
                        _f.apply(void 0, [_g.sent()]).toBe(true, file3 + " not present in destination folder");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move a file with a name that already exists on the destination - [C291977]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var msg, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(existingFile, sourceSF)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.selectLocation('Personal Files')];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.selectDestination(destinationSF)];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.clickMove()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        msg = _e.sent();
                        expect(msg).toContain('Move unsuccessful, a file with the same name already exists');
                        expect(msg).not.toContain('Undo');
                        return [4 /*yield*/, moveDialog.waitForDialogToClose()];
                    case 7:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(existingFile, sourceSF)];
                    case 8:
                        _a.apply(void 0, [_e.sent()]).toBe(true, existingFile + " from " + sourceSF + " not present");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(existingFile, destinationSF)];
                    case 9:
                        _b.apply(void 0, [_e.sent()]).toBe(false, existingFile + " from " + destinationSF + " is present");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 10:
                        _e.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destinationSF)];
                    case 11:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(existingFile + ".txt")];
                    case 12:
                        _c.apply(void 0, [_e.sent()]).toBe(true, existingFile + ".txt not present in destination folder");
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(existingFile + "-1.txt")];
                    case 13:
                        _d.apply(void 0, [_e.sent()]).toBe(false, existingFile + "-1.txt not present in destination folder");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move items into a library - [C291978]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var msg, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file4, sourceSF)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.selectLocation('File Libraries')];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.dataTable.doubleClickOnRowByName(siteName)];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.dataTable.doubleClickOnRowByName('documentLibrary')];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.selectDestination(folderSiteSF)];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.clickMove()];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        msg = _d.sent();
                        expect(msg).toContain('Moved 1 item');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, moveDialog.waitForDialogToClose()];
                    case 9:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file4, folderSiteSF)];
                    case 10:
                        _a.apply(void 0, [_d.sent()]).toBe(true, file4 + " from " + folderSiteSF + " not present");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file4, sourceSF)];
                    case 11:
                        _b.apply(void 0, [_d.sent()]).toBe(false, file4 + " from " + sourceSF + " is present");
                        return [4 /*yield*/, page.goToMyLibraries()];
                    case 12:
                        _d.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(siteName)];
                    case 13:
                        _d.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(folderSiteSF)];
                    case 14:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file4)];
                    case 15:
                        _c.apply(void 0, [_d.sent()]).toBe(true, file4 + " not present in destination folder");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('from Favorites', function () {
        var file1 = "file1-" + Utils.random() + ".txt";
        var file1Id;
        var folder1 = "folder1-" + Utils.random();
        var folder1Id;
        var fileInFolder = "fileInFolder-" + Utils.random() + ".txt";
        var file2 = "file2-" + Utils.random() + ".txt";
        var file2Id;
        var file3 = "file3-" + Utils.random() + ".txt";
        var file3Id;
        var file4 = "file4-" + Utils.random() + ".txt";
        var file4Id;
        var folder2 = "folder2-" + Utils.random();
        var folder2Id;
        var fileInFolder2 = "fileInFolder2-" + Utils.random() + ".txt";
        var existingFile = "existing-" + Utils.random();
        var existingFileId;
        var existingFolder = "existing-" + Utils.random();
        var existingId1, existingId2;
        var file2InFolder = "file2InFolder-" + Utils.random() + ".txt";
        var file3InFolder = "file3InFolder-" + Utils.random() + ".txt";
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFile(file1, sourceIdFav)];
                    case 1:
                        file1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file1Id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFolder(folder1, sourceIdFav)];
                    case 3:
                        folder1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileInFolder, folder1Id)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('folder', folder1Id)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(file2, sourceIdFav)];
                    case 6:
                        file2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file3, sourceIdFav)];
                    case 7:
                        file3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file2Id)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file3Id)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(existingFile + ".txt", sourceIdFav)];
                    case 10:
                        existingFileId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', existingFileId)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(existingFile + ".txt", destinationIdFav)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFolder(existingFolder, sourceIdFav)];
                    case 13:
                        existingId1 = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(existingFolder, destinationIdFav)];
                    case 14:
                        existingId2 = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file2InFolder, existingId1)];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(file3InFolder, existingId2)];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('folder', existingId1)];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFile(file4, sourceIdFav)];
                    case 18:
                        file4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(folder2, sourceIdFav)];
                    case 19:
                        folder2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileInFolder2, folder2Id)];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file4Id)];
                    case 21:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('folder', folder2Id)];
                    case 22:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.waitForApi({ expect: 9 })];
                    case 23:
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
                        return [4 /*yield*/, page.clickFavoritesAndWait()];
                    case 2:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move a file - [C280256]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var msg, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.selectLocation('Personal Files')];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.selectDestination(destinationFav)];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, moveDialog.clickMove()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        msg = _d.sent();
                        expect(msg).toContain('Moved 1 item');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, moveDialog.waitForDialogToClose()];
                    case 7:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file1, destinationFav)];
                    case 8:
                        _a.apply(void 0, [_d.sent()]).toBe(true, file1 + " from " + destinationFav + " not present");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file1, sourceFav)];
                    case 9:
                        _b.apply(void 0, [_d.sent()]).toBe(false, file1 + " from " + sourceFav + " is present");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destinationFav)];
                    case 11:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file1)];
                    case 12:
                        _c.apply(void 0, [_d.sent()]).toBe(true, file1 + " not present in destination folder");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move a folder with content - [C280257]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var msg, _a, _b, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(folder1)];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 2:
                        _f.sent();
                        return [4 /*yield*/, moveDialog.selectLocation('Personal Files')];
                    case 3:
                        _f.sent();
                        return [4 /*yield*/, moveDialog.selectDestination(destinationFav)];
                    case 4:
                        _f.sent();
                        return [4 /*yield*/, moveDialog.clickMove()];
                    case 5:
                        _f.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        msg = _f.sent();
                        expect(msg).toContain('Moved 1 item');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, moveDialog.waitForDialogToClose()];
                    case 7:
                        _f.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folder1, sourceFav)];
                    case 8:
                        _a.apply(void 0, [_f.sent()]).toBe(false, folder1 + " from " + sourceFav + " is present");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folder1, destinationFav)];
                    case 9:
                        _b.apply(void 0, [_f.sent()]).toBe(true, folder1 + " from " + destinationFav + " not present");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 10:
                        _f.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destinationFav)];
                    case 11:
                        _f.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folder1)];
                    case 12:
                        _c.apply(void 0, [_f.sent()]).toBe(true, folder1 + " not present in destination folder");
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileInFolder)];
                    case 13:
                        _d.apply(void 0, [_f.sent()]).toBe(false, fileInFolder + " is present in destination");
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(folder1)];
                    case 14:
                        _f.sent();
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileInFolder)];
                    case 15:
                        _e.apply(void 0, [_f.sent()]).toBe(true, fileInFolder + " is not present in parent folder");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move multiple items - [C280258]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var msg, _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([file2, file3])];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 2:
                        _g.sent();
                        return [4 /*yield*/, moveDialog.selectLocation('Personal Files')];
                    case 3:
                        _g.sent();
                        return [4 /*yield*/, moveDialog.selectDestination(destinationFav)];
                    case 4:
                        _g.sent();
                        return [4 /*yield*/, moveDialog.clickMove()];
                    case 5:
                        _g.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        msg = _g.sent();
                        expect(msg).toContain('Moved 2 items');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, moveDialog.waitForDialogToClose()];
                    case 7:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file2, destinationFav)];
                    case 8:
                        _a.apply(void 0, [_g.sent()]).toBe(true, file2 + " from " + destinationFav + " not present");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file3, destinationFav)];
                    case 9:
                        _b.apply(void 0, [_g.sent()]).toBe(true, file3 + " from " + destinationFav + " not present");
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file2, sourceFav)];
                    case 10:
                        _c.apply(void 0, [_g.sent()]).toBe(false, file2 + " from " + sourceFav + " is present");
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file3, sourceFav)];
                    case 11:
                        _d.apply(void 0, [_g.sent()]).toBe(false, file3 + " from " + sourceFav + " is present");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 12:
                        _g.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destinationFav)];
                    case 13:
                        _g.sent();
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file2)];
                    case 14:
                        _e.apply(void 0, [_g.sent()]).toBe(true, file2 + " not present in destination folder");
                        _f = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file3)];
                    case 15:
                        _f.apply(void 0, [_g.sent()]).toBe(true, file3 + " not present in destination folder");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move a file with a name that already exists on the destination - [C280263]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var msg, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(existingFile)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.selectLocation('Personal Files')];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.selectDestination(destinationFav)];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.clickMove()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        msg = _e.sent();
                        expect(msg).toContain('Move unsuccessful, a file with the same name already exists');
                        expect(msg).not.toContain('Undo');
                        return [4 /*yield*/, moveDialog.waitForDialogToClose()];
                    case 7:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(existingFile, sourceFav)];
                    case 8:
                        _a.apply(void 0, [_e.sent()]).toBe(true, existingFile + " from " + sourceFav + " not present");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(existingFile, destinationFav)];
                    case 9:
                        _b.apply(void 0, [_e.sent()]).toBe(false, existingFile + " from " + destinationFav + " is present");
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 10:
                        _e.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destinationFav)];
                    case 11:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(existingFile + ".txt")];
                    case 12:
                        _c.apply(void 0, [_e.sent()]).toBe(true, existingFile + ".txt not present in destination folder");
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(existingFile + "-1.txt")];
                    case 13:
                        _d.apply(void 0, [_e.sent()]).toBe(false, existingFile + "-1.txt is present in destination folder");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move a folder with a name that already exists on the destination - [C280259]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var msg, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(existingFolder)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.selectLocation('Personal Files')];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.selectDestination(destinationFav)];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, moveDialog.clickMove()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 6:
                        msg = _e.sent();
                        expect(msg).toContain('Moved 1 item');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, moveDialog.waitForDialogToClose()];
                    case 7:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(existingFolder, sourceFav)];
                    case 8:
                        _a.apply(void 0, [_e.sent()]).toBe(false, existingFolder + " from " + sourceFav + " is present");
                        // expect(await dataTable.isItemPresent(existingFolder, destinationFav)).toBe(true, `${existingFolder} from ${destinationFav} not present`);
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 9:
                        // expect(await dataTable.isItemPresent(existingFolder, destinationFav)).toBe(true, `${existingFolder} from ${destinationFav} not present`);
                        _e.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destinationFav)];
                    case 10:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(existingFolder)];
                    case 11:
                        _b.apply(void 0, [_e.sent()]).toBe(true, existingFolder + " not present in destination folder");
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(existingFolder)];
                    case 12:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file2InFolder)];
                    case 13:
                        _c.apply(void 0, [_e.sent()]).toBe(true, file2InFolder + " not present in destination folder");
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file3InFolder)];
                    case 14:
                        _d.apply(void 0, [_e.sent()]).toBe(true, file3InFolder + " not present in destination folder");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move items into a library - [C291979]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var msg, _a, _b, _c, _d, _e, _f, _g;
            return tslib_1.__generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([file4, folder2], sourceFav)];
                    case 1:
                        _h.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 2:
                        _h.sent();
                        return [4 /*yield*/, moveDialog.selectLocation('File Libraries')];
                    case 3:
                        _h.sent();
                        return [4 /*yield*/, moveDialog.dataTable.doubleClickOnRowByName(siteName)];
                    case 4:
                        _h.sent();
                        return [4 /*yield*/, moveDialog.dataTable.doubleClickOnRowByName('documentLibrary')];
                    case 5:
                        _h.sent();
                        return [4 /*yield*/, moveDialog.selectDestination(folderSiteFav)];
                    case 6:
                        _h.sent();
                        return [4 /*yield*/, moveDialog.clickMove()];
                    case 7:
                        _h.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        msg = _h.sent();
                        expect(msg).toContain('Moved 2 items');
                        expect(msg).toContain('Undo');
                        return [4 /*yield*/, moveDialog.waitForDialogToClose()];
                    case 9:
                        _h.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file4, folderSiteFav)];
                    case 10:
                        _a.apply(void 0, [_h.sent()]).toBe(true, file4 + " from " + folderSiteFav + " not present");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file4, sourceFav)];
                    case 11:
                        _b.apply(void 0, [_h.sent()]).toBe(false, file4 + " from " + sourceFav + " is present");
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folder2, folderSiteFav)];
                    case 12:
                        _c.apply(void 0, [_h.sent()]).toBe(true, folder2 + " from " + folderSiteFav + " not present");
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folder2, sourceFav)];
                    case 13:
                        _d.apply(void 0, [_h.sent()]).toBe(false, folder2 + " from " + sourceFav + " is present");
                        return [4 /*yield*/, page.goToMyLibraries()];
                    case 14:
                        _h.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(siteName)];
                    case 15:
                        _h.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(folderSiteFav)];
                    case 16:
                        _h.sent();
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file4)];
                    case 17:
                        _e.apply(void 0, [_h.sent()]).toBe(true, file4 + " not present in destination folder");
                        _f = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(folder2)];
                    case 18:
                        _f.apply(void 0, [_h.sent()]).toBe(true, folder2 + " not present in destination folder");
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(folder2)];
                    case 19:
                        _h.sent();
                        _g = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileInFolder2)];
                    case 20:
                        _g.apply(void 0, [_h.sent()]).toBe(true, fileInFolder2 + " not present in parent folder");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=move.test.js.map