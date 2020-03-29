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
import { FILES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
import { Viewer } from '../../components/viewer/viewer';
import { ContentNodeSelectorDialog } from './../../components/dialog/content-node-selector-dialog';
import { ShareDialog } from './../../components/dialog/share-dialog';
import { ManageVersionsDialog } from './../../components/dialog/manage-versions-dialog';
import { UploadNewVersionDialog } from './../../components/dialog/upload-new-version-dialog';
describe('Viewer actions', function () {
    var username = "user-" + Utils.random();
    var docxFile = FILES.docxFile;
    var docxFile2 = FILES.docxFile2;
    var xlsxFileForMove = FILES.xlsxFile;
    var pdfFileForDelete = FILES.pdfFile;
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable;
    var viewer = new Viewer();
    var toolbar = viewer.toolbar;
    var copyMoveDialog = new ContentNodeSelectorDialog();
    var shareDialog = new ShareDialog();
    var manageVersionsDialog = new ManageVersionsDialog();
    var uploadNewVersionDialog = new UploadNewVersionDialog();
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('from Personal Files', function () {
        var parent = "parentPF-" + Utils.random();
        var parentId;
        var destination = "destPF-" + Utils.random();
        var destinationId;
        var docxPersonalFiles = "docxPF-" + Utils.random() + ".docx";
        var docxFileId;
        var xlsxPersonalFiles = "xlsxPF-" + Utils.random() + ".xlsx";
        var pdfPersonalFiles = "pdfPF-" + Utils.random() + ".pdf";
        var filePersonalFiles = docxFile2;
        var filePersonalFilesId;
        var fileForEditOffline = "file1-" + Utils.random() + ".docx";
        var fileForEditOfflineId;
        var fileForCancelEditing = "file2-" + Utils.random() + ".docx";
        var fileForCancelEditingId;
        var fileForUploadNewVersion = "file3-" + Utils.random() + ".docx";
        var fileForUploadNewVersionId;
        var fileForUploadNewVersion2 = "file4-" + Utils.random() + ".docx";
        var fileForUploadNewVersionId2;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                    case 1:
                        parentId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(destination)];
                    case 2:
                        destinationId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, parentId, docxPersonalFiles)];
                    case 3:
                        docxFileId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFile(docxFile2, parentId)];
                    case 4:
                        filePersonalFilesId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(xlsxFileForMove, parentId, xlsxPersonalFiles)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(pdfFileForDelete, parentId, pdfPersonalFiles)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForEditOffline)];
                    case 7:
                        fileForEditOfflineId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForCancelEditing)];
                    case 8:
                        fileForCancelEditingId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForUploadNewVersion)];
                    case 9:
                        fileForUploadNewVersionId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForUploadNewVersion2)];
                    case 10:
                        fileForUploadNewVersionId2 = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileForCancelEditingId)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileForUploadNewVersionId)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileForUploadNewVersionId2)];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginWith(username)];
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
                    case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(parent)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 3:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
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
                    case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(destinationId)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.trashcan.emptyTrash()];
                    case 3:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Download action - [C268129]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxPersonalFiles)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickDownload()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(docxPersonalFiles)];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'File not found in download location');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Copy action - [C268130]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxPersonalFiles)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 3:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, copyMoveDialog.isDialogOpen()];
                    case 4:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, copyMoveDialog.selectLocation('Personal Files')];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, copyMoveDialog.selectDestination(destination)];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, copyMoveDialog.clickCopy()];
                    case 7:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        _b.apply(void 0, [_e.sent()]).toContain('Copied 1 item');
                        return [4 /*yield*/, viewer.clickClose()];
                    case 9:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(docxPersonalFiles)];
                    case 10:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'Item is not in the list');
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 11:
                        _e.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 12:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(docxPersonalFiles)];
                    case 13:
                        _d.apply(void 0, [_e.sent()]).toBe(true, 'Item is not present in destination');
                        return [4 /*yield*/, apis.user.nodes.deleteNodeChildren(destinationId)];
                    case 14:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move action - [C268131]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(xlsxPersonalFiles)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 3:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, copyMoveDialog.isDialogOpen()];
                    case 4:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, copyMoveDialog.selectLocation('Personal Files')];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, copyMoveDialog.selectDestination(destination)];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, copyMoveDialog.clickMove()];
                    case 7:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        _b.apply(void 0, [_e.sent()]).toContain('Moved 1 item');
                        return [4 /*yield*/, viewer.clickClose()];
                    case 9:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(xlsxPersonalFiles)];
                    case 10:
                        _c.apply(void 0, [_e.sent()]).toBe(false, 'Item was not moved');
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 11:
                        _e.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 12:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(xlsxPersonalFiles)];
                    case 13:
                        _d.apply(void 0, [_e.sent()]).toBe(true, 'Item is not present in destination');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Favorite action - [C268132]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxPersonalFiles)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, viewer.clickClose()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, page.clickFavoritesAndWait()];
                    case 5:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavorite(docxFileId)];
                    case 6:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Item is not favorite');
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(docxPersonalFiles)];
                    case 7:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Item is not present in Favorites list');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Delete action - [C268133]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(pdfPersonalFiles)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 3:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 4:
                        _a.apply(void 0, [_d.sent()]).toContain(pdfPersonalFiles + " deleted");
                        _b = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 5:
                        _b.apply(void 0, [_d.sent()]).toBe(false, 'Viewer is opened');
                        return [4 /*yield*/, Utils.pressEscape()];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, page.clickTrashAndWait()];
                    case 7:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(pdfPersonalFiles)];
                    case 8:
                        _c.apply(void 0, [_d.sent()]).toBe(true, 'Item is not present in Trash');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Edit Offline action - [C297584]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(fileForEditOffline)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsEditOffline()];
                    case 3:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileForEditOffline)];
                    case 4:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File not found in download location');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileForEditOfflineId)];
                    case 5:
                        _b.apply(void 0, [_d.sent()]).toBe(true, fileForEditOffline + " is not locked");
                        _c = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 6:
                        _c.apply(void 0, [_d.sent()]).toBe(true, 'Viewer is not open');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Cancel Editing action - [C297585]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(fileForCancelEditing)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCancelEditing()];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWriteWithRetry(fileForCancelEditingId, false)];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(false, fileForCancelEditing + " is still locked");
                        _b = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not open');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Upload new version action - [C297586]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(filePersonalFiles)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(docxFile2)];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMajor()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new major version description')];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 8:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 9:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'Viewer is not open');
                        _b = expect;
                        return [4 /*yield*/, viewer.getFileTitle()];
                    case 10:
                        _b.apply(void 0, [_e.sent()]).toContain(docxFile2);
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(filePersonalFilesId)];
                    case 11:
                        _c.apply(void 0, [_e.sent()]).toEqual('MAJOR', 'File has incorrect version type');
                        _d = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(filePersonalFilesId)];
                    case 12:
                        _d.apply(void 0, [_e.sent()]).toEqual('2.0', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Upload new version action when node is locked - [MNT-21058]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(fileForUploadNewVersion2)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 3:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, toolbar.menu.isCancelEditingPresent()];
                    case 4:
                        _a.apply(void 0, [_e.sent()]).toBe(true, "'Cancel Editing' button should be shown");
                        _b = expect;
                        return [4 /*yield*/, toolbar.menu.isEditOfflinePresent()];
                    case 5:
                        _b.apply(void 0, [_e.sent()]).toBe(false, "'Edit Offline' shouldn't be shown");
                        return [4 /*yield*/, toolbar.menu.clickMenuItem('Upload New Version')];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(docxFile)];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 8:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 9:
                        _e.sent();
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 10:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, toolbar.menu.isCancelEditingPresent()];
                    case 11:
                        _c.apply(void 0, [_e.sent()]).toBe(false, "'Cancel Editing' button shouldn't be shown");
                        _d = expect;
                        return [4 /*yield*/, toolbar.menu.isEditOfflinePresent()];
                    case 12:
                        _d.apply(void 0, [_e.sent()]).toBe(true, "'Edit Offline' should be shown");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Full screen action - [C279282]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, browserLogAfter;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxPersonalFiles)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, Utils.getBrowserLog()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickFullScreen()];
                    case 4:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 5:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Viewer is closed after pressing Full screen');
                        return [4 /*yield*/, Utils.getBrowserLog()];
                    case 6:
                        browserLogAfter = _b.sent();
                        expect(browserLogAfter.length).toEqual(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Share action - [C286313]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxPersonalFiles)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickShare()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, shareDialog.clickClose()];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Manage Versions action - [C286316]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxPersonalFiles)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsManageVersions()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, manageVersionsDialog.isDialogOpen()];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, manageVersionsDialog.clickClose()];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // TODO: disabled until ACA-2176 is done
        xit('Pressing ESC in the viewer closes only the action dialog - [C286314]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxPersonalFiles)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickShare()];
                    case 3:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 4:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, Utils.pressEscape()];
                    case 5:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 6:
                        _b.apply(void 0, [_d.sent()]).toBe(false, 'Dialog is still open');
                        _c = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 7:
                        _c.apply(void 0, [_d.sent()]).toBe(true, 'Viewer is not opened');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('from File Libraries', function () {
        var siteName = "site-" + Utils.random();
        var destination = "destFL-" + Utils.random();
        var destinationId;
        var docxLibraries = "docxFL-" + Utils.random() + ".docx";
        var docxFileId;
        var xlsxLibraries = "xlsxFL-" + Utils.random() + ".xlsx";
        var pdfLibraries = "pdfFL-" + Utils.random() + ".pdf";
        var fileLibraries = docxFile2;
        var fileLibrariesId;
        var fileForEditOffline = "file1-" + Utils.random() + ".docx";
        var fileForEditOfflineId;
        var fileForCancelEditing = "file2-" + Utils.random() + ".docx";
        var fileForCancelEditingId;
        var fileForUploadNewVersion = "file3-" + Utils.random() + ".docx";
        var fileForUploadNewVersionId;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var docLibId;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.sites.createSite(siteName)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.sites.getDocLibId(siteName)];
                    case 2:
                        docLibId = _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFolder(destination)];
                    case 3:
                        destinationId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, docLibId, docxLibraries)];
                    case 4:
                        docxFileId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFile(docxFile2, docLibId)];
                    case 5:
                        fileLibrariesId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(xlsxFileForMove, docLibId, xlsxLibraries)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(pdfFileForDelete, docLibId, pdfLibraries)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, docLibId, fileForEditOffline)];
                    case 8:
                        fileForEditOfflineId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, docLibId, fileForCancelEditing)];
                    case 9:
                        fileForCancelEditingId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, docLibId, fileForUploadNewVersion)];
                    case 10:
                        fileForUploadNewVersionId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileForCancelEditingId)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileForUploadNewVersionId)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginWith(username)];
                    case 13:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(siteName)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 3:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
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
                    case 0: return [4 /*yield*/, apis.user.sites.deleteSite(siteName)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(destinationId)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.trashcan.emptyTrash()];
                    case 3:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Download action - [C286369]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxLibraries)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickDownload()];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(docxLibraries)];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'File not found in download location');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Copy action - [C286370]', function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxLibraries)];
                    case 1:
                        _f.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_f.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 3:
                        _f.sent();
                        _b = expect;
                        return [4 /*yield*/, copyMoveDialog.isDialogOpen()];
                    case 4:
                        _b.apply(void 0, [_f.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, copyMoveDialog.selectLocation('Personal Files')];
                    case 5:
                        _f.sent();
                        return [4 /*yield*/, copyMoveDialog.selectDestination(destination)];
                    case 6:
                        _f.sent();
                        return [4 /*yield*/, copyMoveDialog.clickCopy()];
                    case 7:
                        _f.sent();
                        _c = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        _c.apply(void 0, [_f.sent()]).toContain('Copied 1 item');
                        return [4 /*yield*/, viewer.clickClose()];
                    case 9:
                        _f.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(docxLibraries)];
                    case 10:
                        _d.apply(void 0, [_f.sent()]).toBe(true, 'Item is not in the list');
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 11:
                        _f.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 12:
                        _f.sent();
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(docxLibraries)];
                    case 13:
                        _e.apply(void 0, [_f.sent()]).toBe(true, 'Item is not present in destination');
                        return [4 /*yield*/, apis.user.nodes.deleteNodeChildren(destinationId)];
                    case 14:
                        _f.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move action - [C286371]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(xlsxLibraries)];
                    case 1:
                        _f.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_f.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 3:
                        _f.sent();
                        _b = expect;
                        return [4 /*yield*/, copyMoveDialog.isDialogOpen()];
                    case 4:
                        _b.apply(void 0, [_f.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, copyMoveDialog.selectLocation('Personal Files')];
                    case 5:
                        _f.sent();
                        return [4 /*yield*/, copyMoveDialog.selectDestination(destination)];
                    case 6:
                        _f.sent();
                        return [4 /*yield*/, copyMoveDialog.clickMove()];
                    case 7:
                        _f.sent();
                        _c = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        _c.apply(void 0, [_f.sent()]).toContain('Moved 1 item');
                        return [4 /*yield*/, viewer.clickClose()];
                    case 9:
                        _f.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(xlsxLibraries)];
                    case 10:
                        _d.apply(void 0, [_f.sent()]).toBe(false, 'Item was not moved');
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 11:
                        _f.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 12:
                        _f.sent();
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(xlsxLibraries)];
                    case 13:
                        _e.apply(void 0, [_f.sent()]).toBe(true, 'Item is not present in destination');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Favorite action - [C286372]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxLibraries)];
                    case 1:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, viewer.clickClose()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, page.clickFavoritesAndWait()];
                    case 5:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavorite(docxFileId)];
                    case 6:
                        _b.apply(void 0, [_d.sent()]).toBe(true, docxLibraries + " is not favorite");
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(docxLibraries)];
                    case 7:
                        _c.apply(void 0, [_d.sent()]).toBe(true, docxLibraries + " is not present in Favorites list");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Delete action - [C286373]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(pdfLibraries)];
                    case 1:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 3:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 4:
                        _b.apply(void 0, [_e.sent()]).toContain(pdfLibraries + " deleted");
                        _c = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 5:
                        _c.apply(void 0, [_e.sent()]).toBe(false, 'Viewer is opened');
                        return [4 /*yield*/, Utils.pressEscape()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, page.clickTrashAndWait()];
                    case 7:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(pdfLibraries)];
                    case 8:
                        _d.apply(void 0, [_e.sent()]).toBe(true, 'Item is not present in Trash');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Edit Offline action - [C297589]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(fileForEditOffline)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsEditOffline()];
                    case 3:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileForEditOffline)];
                    case 4:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File not found in download location');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileForEditOfflineId)];
                    case 5:
                        _b.apply(void 0, [_d.sent()]).toBe(true, fileForEditOffline + " is not locked");
                        _c = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 6:
                        _c.apply(void 0, [_d.sent()]).toBe(true, 'Viewer is not open');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Cancel Editing action - [C297590]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(fileForCancelEditing)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCancelEditing()];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWriteWithRetry(fileForCancelEditingId, false)];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(false, fileForCancelEditing + " is still locked");
                        _b = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not open');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Upload new version action - [C297591]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(fileLibraries)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(docxFile2)];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMajor()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new major version description')];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 8:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 9:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'Viewer is not open');
                        _b = expect;
                        return [4 /*yield*/, viewer.getFileTitle()];
                    case 10:
                        _b.apply(void 0, [_e.sent()]).toContain(docxFile2);
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(fileLibrariesId)];
                    case 11:
                        _c.apply(void 0, [_e.sent()]).toEqual('MAJOR', 'File has incorrect version type');
                        _d = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(fileLibrariesId)];
                    case 12:
                        _d.apply(void 0, [_e.sent()]).toEqual('2.0', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Share action - [C286374]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxLibraries)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickShare()];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, shareDialog.clickClose()];
                    case 5:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Manage Versions action - [C286375]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxLibraries)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickMoreActionsManageVersions()];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, manageVersionsDialog.isDialogOpen()];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, manageVersionsDialog.clickClose()];
                    case 5:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('from Recent Files', function () {
        var parent = "parentRF-" + Utils.random();
        var parentId;
        var destination = "destRF-" + Utils.random();
        var destinationId;
        var docxRecentFiles = "docxRF-" + Utils.random() + ".docx";
        var docxFileId;
        var xlsxRecentFiles = "xlsxRF-" + Utils.random() + ".xlsx";
        var pdfRecentFiles = "pdfRF-" + Utils.random() + ".pdf";
        var fileRecent = docxFile2;
        var fileRecentId;
        var fileForEditOffline = "file1-" + Utils.random() + ".docx";
        var fileForEditOfflineId;
        var fileForCancelEditing = "file2-" + Utils.random() + ".docx";
        var fileForCancelEditingId;
        var fileForUploadNewVersion = "file3-" + Utils.random() + ".docx";
        var fileForUploadNewVersionId;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.search.waitForApi(username, { expect: 0 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                    case 2:
                        parentId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(destination)];
                    case 3:
                        destinationId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, parentId, docxRecentFiles)];
                    case 4:
                        docxFileId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFile(docxFile2, parentId)];
                    case 5:
                        fileRecentId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForEditOffline)];
                    case 6:
                        fileForEditOfflineId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForCancelEditing)];
                    case 7:
                        fileForCancelEditingId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForUploadNewVersion)];
                    case 8:
                        fileForUploadNewVersionId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileForCancelEditingId)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileForUploadNewVersionId)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(xlsxFileForMove, parentId, xlsxRecentFiles)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(pdfFileForDelete, parentId, pdfRecentFiles)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, apis.user.search.waitForApi(username, { expect: 7 })];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginWith(username)];
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
                    case 0: return [4 /*yield*/, page.clickRecentFilesAndWait()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
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
                    case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(destinationId)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.trashcan.emptyTrash()];
                    case 3:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Download action - [C286383]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxRecentFiles)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickDownload()];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(docxRecentFiles)];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'File not found in download location');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Copy action - [C286384]', function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxRecentFiles)];
                    case 1:
                        _f.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_f.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 3:
                        _f.sent();
                        _b = expect;
                        return [4 /*yield*/, copyMoveDialog.isDialogOpen()];
                    case 4:
                        _b.apply(void 0, [_f.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, copyMoveDialog.selectLocation('Personal Files')];
                    case 5:
                        _f.sent();
                        return [4 /*yield*/, copyMoveDialog.selectDestination(destination)];
                    case 6:
                        _f.sent();
                        return [4 /*yield*/, copyMoveDialog.clickCopy()];
                    case 7:
                        _f.sent();
                        _c = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        _c.apply(void 0, [_f.sent()]).toContain('Copied 1 item');
                        return [4 /*yield*/, viewer.clickClose()];
                    case 9:
                        _f.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(docxRecentFiles)];
                    case 10:
                        _d.apply(void 0, [_f.sent()]).toBe(true, 'Item is not in the list');
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 11:
                        _f.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 12:
                        _f.sent();
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(docxRecentFiles)];
                    case 13:
                        _e.apply(void 0, [_f.sent()]).toBe(true, 'Item is not present in destination');
                        return [4 /*yield*/, apis.user.nodes.deleteNodeChildren(destinationId)];
                    case 14:
                        _f.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move action - [C286385]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(xlsxRecentFiles)];
                    case 1:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_g.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 3:
                        _g.sent();
                        _b = expect;
                        return [4 /*yield*/, copyMoveDialog.isDialogOpen()];
                    case 4:
                        _b.apply(void 0, [_g.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, copyMoveDialog.selectLocation('Personal Files')];
                    case 5:
                        _g.sent();
                        return [4 /*yield*/, copyMoveDialog.selectDestination(destination)];
                    case 6:
                        _g.sent();
                        return [4 /*yield*/, copyMoveDialog.clickMove()];
                    case 7:
                        _g.sent();
                        _c = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        _c.apply(void 0, [_g.sent()]).toContain('Moved 1 item');
                        return [4 /*yield*/, viewer.clickClose()];
                    case 9:
                        _g.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(xlsxRecentFiles)];
                    case 10:
                        _d.apply(void 0, [_g.sent()]).toBe(true, 'Item is not in the list');
                        _e = expect;
                        return [4 /*yield*/, dataTable.getItemLocationTooltip(xlsxRecentFiles)];
                    case 11:
                        _e.apply(void 0, [_g.sent()]).toContain(destination, 'Item was not moved');
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 12:
                        _g.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 13:
                        _g.sent();
                        _f = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(xlsxRecentFiles)];
                    case 14:
                        _f.apply(void 0, [_g.sent()]).toBe(true, 'Item is not present in destination');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Favorite action - [C286386]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxRecentFiles)];
                    case 1:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, viewer.clickClose()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, page.clickFavoritesAndWait()];
                    case 5:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavorite(docxFileId)];
                    case 6:
                        _b.apply(void 0, [_d.sent()]).toBe(true, 'Item is not favorite');
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(docxRecentFiles)];
                    case 7:
                        _c.apply(void 0, [_d.sent()]).toBe(true, 'Item is not present in Favorites list');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Delete action - [C286387]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(pdfRecentFiles)];
                    case 1:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 3:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 4:
                        _b.apply(void 0, [_e.sent()]).toContain(pdfRecentFiles + " deleted");
                        _c = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 5:
                        _c.apply(void 0, [_e.sent()]).toBe(false, 'Viewer is opened');
                        return [4 /*yield*/, Utils.pressEscape()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, page.clickTrashAndWait()];
                    case 7:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(pdfRecentFiles)];
                    case 8:
                        _d.apply(void 0, [_e.sent()]).toBe(true, 'Item is not present in Trash');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Edit Offline action - [C297594]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(fileForEditOffline)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsEditOffline()];
                    case 3:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileForEditOffline)];
                    case 4:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File not found in download location');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileForEditOfflineId)];
                    case 5:
                        _b.apply(void 0, [_d.sent()]).toBe(true, fileForEditOffline + " is not locked");
                        _c = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 6:
                        _c.apply(void 0, [_d.sent()]).toBe(true, 'Viewer is not open');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Cancel Editing action - [C297595]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(fileForCancelEditing)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCancelEditing()];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWriteWithRetry(fileForCancelEditingId, false)];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(false, fileForCancelEditing + " is still locked");
                        _b = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not open');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Upload new version action - [C297596]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(fileRecent)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(docxFile2)];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMajor()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new major version description')];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 8:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 9:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'Viewer is not open');
                        _b = expect;
                        return [4 /*yield*/, viewer.getFileTitle()];
                    case 10:
                        _b.apply(void 0, [_e.sent()]).toContain(docxFile2);
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(fileRecentId)];
                    case 11:
                        _c.apply(void 0, [_e.sent()]).toEqual('MAJOR', 'File has incorrect version type');
                        _d = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(fileRecentId)];
                    case 12:
                        _d.apply(void 0, [_e.sent()]).toEqual('2.0', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Share action - [C286388]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxRecentFiles)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickShare()];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, shareDialog.clickClose()];
                    case 5:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Manage Versions action - [C286389]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxRecentFiles)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickMoreActionsManageVersions()];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, manageVersionsDialog.isDialogOpen()];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, manageVersionsDialog.clickClose()];
                    case 5:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('from Shared Files', function () {
        var parent = "parentSF-" + Utils.random();
        var parentId;
        var destination = "destSF-" + Utils.random();
        var destinationId;
        var docxSharedFiles = "docxSF-" + Utils.random() + ".docx";
        var docxFileId;
        var xlsxSharedFiles = "xlsxSF-" + Utils.random() + ".xlsx";
        var xlsxFileId;
        var pdfSharedFiles = "pdfSF-" + Utils.random() + ".pdf";
        var pdfFileId;
        var fileShared = docxFile2;
        var fileSharedId;
        var fileForEditOffline = "file1-" + Utils.random() + ".docx";
        var fileForEditOfflineId;
        var fileForCancelEditing = "file2-" + Utils.random() + ".docx";
        var fileForCancelEditingId;
        var fileForUploadNewVersion = "file3-" + Utils.random() + ".docx";
        var fileForUploadNewVersionId;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                    case 1:
                        parentId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(destination)];
                    case 2:
                        destinationId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, parentId, docxSharedFiles)];
                    case 3:
                        docxFileId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(xlsxFileForMove, parentId, xlsxSharedFiles)];
                    case 4:
                        xlsxFileId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(pdfFileForDelete, parentId, pdfSharedFiles)];
                    case 5:
                        pdfFileId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFile(docxFile2, parentId)];
                    case 6:
                        fileSharedId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForEditOffline)];
                    case 7:
                        fileForEditOfflineId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForCancelEditing)];
                    case 8:
                        fileForCancelEditingId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForUploadNewVersion)];
                    case 9:
                        fileForUploadNewVersionId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileForCancelEditingId)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileForUploadNewVersionId)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFilesByIds([docxFileId, xlsxFileId, pdfFileId, fileForCancelEditingId, fileForEditOfflineId, fileForUploadNewVersionId, fileSharedId])];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 7 })];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginWith(username)];
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
                    case 0: return [4 /*yield*/, page.clickSharedFilesAndWait()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.closeOpenDialogs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Utils.pressEscape()];
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
                    case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(destinationId)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.trashcan.emptyTrash()];
                    case 3:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Download action - [C286376]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxSharedFiles)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickDownload()];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(docxSharedFiles)];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'File not found in download location');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Copy action - [C286377]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxSharedFiles)];
                    case 1:
                        _f.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_f.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 3:
                        _f.sent();
                        _b = expect;
                        return [4 /*yield*/, copyMoveDialog.isDialogOpen()];
                    case 4:
                        _b.apply(void 0, [_f.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, copyMoveDialog.selectLocation('Personal Files')];
                    case 5:
                        _f.sent();
                        return [4 /*yield*/, copyMoveDialog.selectDestination(destination)];
                    case 6:
                        _f.sent();
                        return [4 /*yield*/, copyMoveDialog.clickCopy()];
                    case 7:
                        _f.sent();
                        _c = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        _c.apply(void 0, [_f.sent()]).toContain('Copied 1 item');
                        return [4 /*yield*/, viewer.clickClose()];
                    case 9:
                        _f.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(docxSharedFiles)];
                    case 10:
                        _d.apply(void 0, [_f.sent()]).toBe(true, 'Item is not in the list');
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 11:
                        _f.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 12:
                        _f.sent();
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(docxSharedFiles)];
                    case 13:
                        _e.apply(void 0, [_f.sent()]).toBe(true, 'Item is not present in destination');
                        return [4 /*yield*/, apis.user.nodes.deleteNodeChildren(destinationId)];
                    case 14:
                        _f.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move action - [C286378]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(xlsxSharedFiles)];
                    case 1:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_g.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 3:
                        _g.sent();
                        _b = expect;
                        return [4 /*yield*/, copyMoveDialog.isDialogOpen()];
                    case 4:
                        _b.apply(void 0, [_g.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, copyMoveDialog.selectLocation('Personal Files')];
                    case 5:
                        _g.sent();
                        return [4 /*yield*/, copyMoveDialog.selectDestination(destination)];
                    case 6:
                        _g.sent();
                        return [4 /*yield*/, copyMoveDialog.clickMove()];
                    case 7:
                        _g.sent();
                        _c = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        _c.apply(void 0, [_g.sent()]).toContain('Moved 1 item');
                        return [4 /*yield*/, viewer.clickClose()];
                    case 9:
                        _g.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(xlsxSharedFiles)];
                    case 10:
                        _d.apply(void 0, [_g.sent()]).toBe(true, 'Item is not in the list');
                        _e = expect;
                        return [4 /*yield*/, dataTable.getItemLocationTooltip(xlsxSharedFiles)];
                    case 11:
                        _e.apply(void 0, [_g.sent()]).toContain(destination, 'Item was not moved');
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 12:
                        _g.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 13:
                        _g.sent();
                        _f = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(xlsxSharedFiles)];
                    case 14:
                        _f.apply(void 0, [_g.sent()]).toBe(true, 'Item is not present in destination');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Favorite action - [C286379]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxSharedFiles)];
                    case 1:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickMoreActionsFavorite()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, viewer.clickClose()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, page.clickFavoritesAndWait()];
                    case 5:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavorite(docxFileId)];
                    case 6:
                        _b.apply(void 0, [_d.sent()]).toBe(true, 'Item is not favorite');
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(docxSharedFiles)];
                    case 7:
                        _c.apply(void 0, [_d.sent()]).toBe(true, 'Item is not present in Favorites list');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Delete action - [C286380]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(pdfSharedFiles)];
                    case 1:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 3:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 4:
                        _b.apply(void 0, [_e.sent()]).toContain(pdfSharedFiles + " deleted");
                        _c = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 5:
                        _c.apply(void 0, [_e.sent()]).toBe(false, 'Viewer is opened');
                        return [4 /*yield*/, Utils.pressEscape()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, page.clickTrashAndWait()];
                    case 7:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(pdfSharedFiles)];
                    case 8:
                        _d.apply(void 0, [_e.sent()]).toBe(true, 'Item is not present in Trash');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Edit Offline action - [C297601]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(fileForEditOffline)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsEditOffline()];
                    case 3:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileForEditOffline)];
                    case 4:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File not found in download location');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileForEditOfflineId)];
                    case 5:
                        _b.apply(void 0, [_d.sent()]).toBe(true, fileForEditOffline + " is not locked");
                        _c = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 6:
                        _c.apply(void 0, [_d.sent()]).toBe(true, 'Viewer is not open');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Cancel Editing action - [C297602]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(fileForCancelEditing)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCancelEditing()];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWriteWithRetry(fileForCancelEditingId, false)];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(false, fileForCancelEditing + " is still locked");
                        _b = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not open');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Upload new version action - [C297603]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(fileShared)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(docxFile2)];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMajor()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new major version description')];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 8:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 9:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'Viewer is not open');
                        _b = expect;
                        return [4 /*yield*/, viewer.getFileTitle()];
                    case 10:
                        _b.apply(void 0, [_e.sent()]).toContain(docxFile2);
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(fileSharedId)];
                    case 11:
                        _c.apply(void 0, [_e.sent()]).toEqual('MAJOR', 'File has incorrect version type');
                        _d = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(fileSharedId)];
                    case 12:
                        _d.apply(void 0, [_e.sent()]).toEqual('2.0', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Share action - [C286381]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxSharedFiles)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, shareDialog.clickClose()];
                    case 5:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Manage Versions action - [C286382]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxSharedFiles)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickMoreActionsManageVersions()];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, manageVersionsDialog.isDialogOpen()];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, manageVersionsDialog.clickClose()];
                    case 5:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('from Favorites', function () {
        var parent = "parentFav-" + Utils.random();
        var parentId;
        var destination = "destFav-" + Utils.random();
        var destinationId;
        var docxFavorites = "docxFav-" + Utils.random() + ".docx";
        var docxFileId;
        var xlsxFavorites = "xlsxFav-" + Utils.random() + ".xlsx";
        var xlsxFileId;
        var pdfFavorites = "pdfFav-" + Utils.random() + ".pdf";
        var pdfFileId;
        var fileFav = docxFile2;
        var fileFavId;
        var fileForEditOffline = "file1-" + Utils.random() + ".docx";
        var fileForEditOfflineId;
        var fileForCancelEditing = "file2-" + Utils.random() + ".docx";
        var fileForCancelEditingId;
        var fileForUploadNewVersion = "file3-" + Utils.random() + ".docx";
        var fileForUploadNewVersionId;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                    case 1:
                        parentId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFolder(destination)];
                    case 2:
                        destinationId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, parentId, docxFavorites)];
                    case 3:
                        docxFileId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(xlsxFileForMove, parentId, xlsxFavorites)];
                    case 4:
                        xlsxFileId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(pdfFileForDelete, parentId, pdfFavorites)];
                    case 5:
                        pdfFileId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFile(docxFile2, parentId)];
                    case 6:
                        fileFavId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForEditOffline)];
                    case 7:
                        fileForEditOfflineId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForCancelEditing)];
                    case 8:
                        fileForCancelEditingId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.upload.uploadFileWithRename(docxFile, parentId, fileForUploadNewVersion)];
                    case 9:
                        fileForUploadNewVersionId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileForCancelEditingId)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileForUploadNewVersionId)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoritesByIds('file', [docxFileId, xlsxFileId, pdfFileId, fileForEditOfflineId, fileForCancelEditingId, fileForUploadNewVersionId, fileFavId])];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.waitForApi({ expect: 7 })];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginWith(username)];
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
                    case 0: return [4 /*yield*/, page.clickFavoritesAndWait()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
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
                    case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(destinationId)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.trashcan.emptyTrash()];
                    case 3:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Download action - [C286390]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxFavorites)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickDownload()];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(docxFavorites)];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'File not found in download location');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Copy action - [C286391]', function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxFavorites)];
                    case 1:
                        _f.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_f.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 3:
                        _f.sent();
                        _b = expect;
                        return [4 /*yield*/, copyMoveDialog.isDialogOpen()];
                    case 4:
                        _b.apply(void 0, [_f.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, copyMoveDialog.selectLocation('Personal Files')];
                    case 5:
                        _f.sent();
                        return [4 /*yield*/, copyMoveDialog.selectDestination(destination)];
                    case 6:
                        _f.sent();
                        return [4 /*yield*/, copyMoveDialog.clickCopy()];
                    case 7:
                        _f.sent();
                        _c = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        _c.apply(void 0, [_f.sent()]).toContain('Copied 1 item');
                        return [4 /*yield*/, viewer.clickClose()];
                    case 9:
                        _f.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(docxFavorites)];
                    case 10:
                        _d.apply(void 0, [_f.sent()]).toBe(true, 'Item is not in the list');
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 11:
                        _f.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 12:
                        _f.sent();
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(docxFavorites)];
                    case 13:
                        _e.apply(void 0, [_f.sent()]).toBe(true, 'Item is not present in destination');
                        return [4 /*yield*/, apis.user.nodes.deleteNodeChildren(destinationId)];
                    case 14:
                        _f.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Move action - [C286392]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(xlsxFavorites)];
                    case 1:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_g.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickMoreActionsMove()];
                    case 3:
                        _g.sent();
                        _b = expect;
                        return [4 /*yield*/, copyMoveDialog.isDialogOpen()];
                    case 4:
                        _b.apply(void 0, [_g.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, copyMoveDialog.selectLocation('Personal Files')];
                    case 5:
                        _g.sent();
                        return [4 /*yield*/, copyMoveDialog.selectDestination(destination)];
                    case 6:
                        _g.sent();
                        return [4 /*yield*/, copyMoveDialog.clickMove()];
                    case 7:
                        _g.sent();
                        _c = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        _c.apply(void 0, [_g.sent()]).toContain('Moved 1 item');
                        return [4 /*yield*/, viewer.clickClose()];
                    case 9:
                        _g.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(xlsxFavorites)];
                    case 10:
                        _d.apply(void 0, [_g.sent()]).toBe(true, 'Item is not in the list');
                        _e = expect;
                        return [4 /*yield*/, dataTable.getItemLocationTooltip(xlsxFavorites)];
                    case 11:
                        _e.apply(void 0, [_g.sent()]).toContain(destination, 'Item was not moved');
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 12:
                        _g.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(destination)];
                    case 13:
                        _g.sent();
                        _f = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(xlsxFavorites)];
                    case 14:
                        _f.apply(void 0, [_g.sent()]).toBe(true, 'Item is not present in destination');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Favorite action - [C286393]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(xlsxFavorites)];
                    case 1:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickMoreActionsRemoveFavorite()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, viewer.clickClose()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, page.clickFavoritesAndWait()];
                    case 5:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, apis.user.favorites.isFavorite(xlsxFileId)];
                    case 6:
                        _b.apply(void 0, [_d.sent()]).toBe(false, 'Item is still favorite');
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(xlsxFavorites)];
                    case 7:
                        _c.apply(void 0, [_d.sent()]).toBe(false, 'Item is still present in Favorites list');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Delete action - [C286394]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(pdfFavorites)];
                    case 1:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickMoreActionsDelete()];
                    case 3:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 4:
                        _b.apply(void 0, [_e.sent()]).toContain(pdfFavorites + " deleted");
                        _c = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 5:
                        _c.apply(void 0, [_e.sent()]).toBe(false, 'Viewer is opened');
                        return [4 /*yield*/, Utils.pressEscape()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, page.clickTrashAndWait()];
                    case 7:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(pdfFavorites)];
                    case 8:
                        _d.apply(void 0, [_e.sent()]).toBe(true, 'Item is not present in Trash');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Edit Offline action - [C297604]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(fileForEditOffline)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsEditOffline()];
                    case 3:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(fileForEditOffline)];
                    case 4:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File not found in download location');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileForEditOfflineId)];
                    case 5:
                        _b.apply(void 0, [_d.sent()]).toBe(true, fileForEditOffline + " is not locked");
                        _c = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 6:
                        _c.apply(void 0, [_d.sent()]).toBe(true, 'Viewer is not open');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Cancel Editing action - [C297605]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(fileForCancelEditing)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCancelEditing()];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWriteWithRetry(fileForCancelEditingId, false)];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(false, fileForCancelEditing + " is still locked");
                        _b = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not open');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Upload new version action - [C297606]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(fileFav)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, viewer.waitForViewerToOpen()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(docxFile2)];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMajor()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new major version description')];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 8:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 9:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'Viewer is not open');
                        _b = expect;
                        return [4 /*yield*/, viewer.getFileTitle()];
                    case 10:
                        _b.apply(void 0, [_e.sent()]).toContain(docxFile2);
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(fileFavId)];
                    case 11:
                        _c.apply(void 0, [_e.sent()]).toEqual('MAJOR', 'File has incorrect version type');
                        _d = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(fileFavId)];
                    case 12:
                        _d.apply(void 0, [_e.sent()]).toEqual('2.0', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Share action - [C286395]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxFavorites)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickShare()];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, shareDialog.clickClose()];
                    case 5:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Manage Versions action - [C286396]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(docxFavorites)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.clickMoreActionsManageVersions()];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, manageVersionsDialog.isDialogOpen()];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Dialog is not open');
                        return [4 /*yield*/, manageVersionsDialog.clickClose()];
                    case 5:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=viewer-actions.test.js.map