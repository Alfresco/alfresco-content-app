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
import { UploadNewVersionDialog } from '../../components/dialog/upload-new-version-dialog';
describe('Upload new version', function () {
    var username = "user-" + Utils.random();
    var file1 = "file1-" + Utils.random() + ".docx";
    var file1Id;
    var file2 = "file2-" + Utils.random() + ".docx";
    var file2Id;
    var file3 = "file3-" + Utils.random() + ".docx";
    var file3Id;
    var file4 = "file4-" + Utils.random() + ".docx";
    var file4Id;
    var fileLocked1 = "file-locked1-" + Utils.random() + ".docx";
    var fileLocked1Id;
    var fileLocked2 = "file-locked2-" + Utils.random() + ".docx";
    var fileLocked2Id;
    var fileSearch1 = "search-file1-" + Utils.random() + ".docx";
    var fileSearch1Id;
    var fileSearch2 = "search-file2-" + Utils.random() + ".docx";
    var fileSearch2Id;
    var fileSearch3 = "search-file3-" + Utils.random() + ".docx";
    var fileSearch3Id;
    var fileSearch4 = "search-file4-" + Utils.random() + ".docx";
    var fileSearch4Id;
    var fileLockedSearch1 = "search-file-locked1-" + Utils.random() + ".docx";
    var fileLockedSearch1Id;
    var fileLockedSearch2 = "search-file-locked2-" + Utils.random() + ".docx";
    var fileLockedSearch2Id;
    var parentPF = "parentPersonal-" + Utils.random();
    var parentPFId;
    var parentSF = "parentShared-" + Utils.random();
    var parentSFId;
    var parentRF = "parentRecent-" + Utils.random();
    var parentRFId;
    var parentFav = "parentFav-" + Utils.random();
    var parentFavId;
    var parentSearch = "parentSearch-" + Utils.random();
    var parentSearchId;
    var nameConflictMessage = 'New version not uploaded, another file with the same name already exists';
    var file = FILES.pdfFile;
    var fileId;
    var fileToUpload1 = FILES.docxFile;
    var fileToUpload2 = FILES.xlsxFile;
    var fileToUpload3 = FILES.pdfFile;
    var fileToUpload4 = FILES.docxFile2;
    var fileToUpload5 = FILES.xlsxFile2;
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable, toolbar = page.toolbar;
    var uploadNewVersionDialog = new UploadNewVersionDialog();
    var searchInput = page.header.searchInput;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(parentPF)];
                case 2:
                    parentPFId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(parentSF)];
                case 3:
                    parentSFId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(parentRF)];
                case 4:
                    parentRFId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(parentFav)];
                case 5:
                    parentFavId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(parentSearch)];
                case 6:
                    parentSearchId = (_a.sent()).entry.id;
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentPFId)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentSFId)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentRFId)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentFavId)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentSearchId)];
                case 5:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('on Personal Files', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.upload.uploadFile(file, parentPFId)];
                    case 1:
                        fileId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file1, parentPFId)];
                    case 2:
                        file1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file2, parentPFId)];
                    case 3:
                        file2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file3, parentPFId)];
                    case 4:
                        file3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file4, parentPFId)];
                    case 5:
                        file4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileLocked1, parentPFId)];
                    case 6:
                        fileLocked1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileLocked2, parentPFId)];
                    case 7:
                        fileLocked2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked1Id)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked2Id)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginWith(username)];
                    case 10:
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
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(parentPF)];
                    case 2:
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
                        return [4 /*yield*/, page.refresh()];
                    case 2:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('dialog UI defaults - [C297544]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g;
            return tslib_1.__generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file)];
                    case 1:
                        _h.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _h.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload1)];
                    case 3:
                        _h.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _h.sent();
                        _a = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.getTitle()];
                    case 5:
                        _a.apply(void 0, [_h.sent()]).toEqual('Upload New Version');
                        _b = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.getText()];
                    case 6:
                        _b.apply(void 0, [_h.sent()]).toContain('What level of changes were made to this version?');
                        _c = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isDescriptionDisplayed()];
                    case 7:
                        _c.apply(void 0, [_h.sent()]).toBe(true, 'Description not displayed');
                        _d = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isMinorOptionDisplayed()];
                    case 8:
                        _d.apply(void 0, [_h.sent()]).toBe(true, 'Minor option not displayed');
                        _e = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isMajorOptionDisplayed()];
                    case 9:
                        _e.apply(void 0, [_h.sent()]).toBe(true, 'Major option not displayed');
                        _f = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isCancelButtonEnabled()];
                    case 10:
                        _f.apply(void 0, [_h.sent()]).toBe(true, 'Cancel button not enabled');
                        _g = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isUploadButtonEnabled()];
                    case 11:
                        _g.apply(void 0, [_h.sent()]).toBe(true, 'Update button not enabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file is updated after uploading a new version - major - [C297545]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload1)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMajor()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new major version description')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.waitForDialogToClose()];
                    case 8:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileToUpload1)];
                    case 9:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File not updated');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(file1Id)];
                    case 10:
                        _b.apply(void 0, [_d.sent()]).toEqual('MAJOR', 'File has incorrect version type');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(file1Id)];
                    case 11:
                        _c.apply(void 0, [_d.sent()]).toEqual('2.0', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file is updated after uploading a new version - minor - [C297546]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file2)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload2)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new minor version description')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.waitForDialogToClose()];
                    case 8:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileToUpload2)];
                    case 9:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File not updated');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(file2Id)];
                    case 10:
                        _b.apply(void 0, [_d.sent()]).toEqual('MINOR', 'File has incorrect version type');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(file2Id)];
                    case 11:
                        _c.apply(void 0, [_d.sent()]).toEqual('1.1', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file is not updated when clicking Cancel - [C297547]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file3)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload3)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new version description')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickCancel()];
                    case 7:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file3)];
                    case 8:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File was updated');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(file3Id)];
                    case 9:
                        _b.apply(void 0, [_d.sent()]).toEqual('MAJOR', 'File has incorrect version type');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(file3Id)];
                    case 10:
                        _c.apply(void 0, [_d.sent()]).toEqual('1.0', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('upload new version fails when new file name already exists - [C297548]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var message, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file4)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(file)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new version description')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        message = _d.sent();
                        expect(message).toContain(nameConflictMessage);
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file4)];
                    case 9:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File was updated');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(file4Id)];
                    case 10:
                        _b.apply(void 0, [_d.sent()]).toEqual('MAJOR', 'File has incorrect version type');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(file4Id)];
                    case 11:
                        _c.apply(void 0, [_d.sent()]).toEqual('1.0', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file is unlocked after uploading a new version - [C297549]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileLocked1)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload4)];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new version description')];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.waitForDialogToClose()];
                    case 8:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileToUpload4)];
                    case 9:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'File name was not changed');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileLocked1Id)];
                    case 10:
                        _b.apply(void 0, [_e.sent()]).toBe(false, fileLocked1 + " is still locked");
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(fileLocked1Id)];
                    case 11:
                        _c.apply(void 0, [_e.sent()]).toEqual('MINOR', 'File has incorrect version type');
                        _d = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(fileLocked1Id)];
                    case 12:
                        _d.apply(void 0, [_e.sent()]).toEqual('1.1', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file remains locked after canceling of uploading a new version - [C297550]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileLocked2)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload5)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new version description')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickCancel()];
                    case 7:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileToUpload5)];
                    case 8:
                        _a.apply(void 0, [_d.sent()]).toBe(false, 'File was updated');
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileLocked2)];
                    case 9:
                        _b.apply(void 0, [_d.sent()]).toBe(true, 'File not displayed');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileLocked2Id)];
                    case 10:
                        _c.apply(void 0, [_d.sent()]).toBe(true, fileLocked2 + " was unlocked");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Shared Files', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.upload.uploadFile(file, parentSFId)];
                    case 1:
                        fileId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file1, parentSFId)];
                    case 2:
                        file1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file2, parentSFId)];
                    case 3:
                        file2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file3, parentSFId)];
                    case 4:
                        file3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file4, parentSFId)];
                    case 5:
                        file4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileLocked1, parentSFId)];
                    case 6:
                        fileLocked1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileLocked2, parentSFId)];
                    case 7:
                        fileLocked2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked1Id)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked2Id)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFilesByIds([fileId, file1Id, file2Id, file3Id, file4Id, fileLocked1Id, fileLocked2Id])];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 7 })];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginWith(username)];
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
                    case 0: return [4 /*yield*/, page.refresh()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('dialog UI defaults - [C297551]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g;
            return tslib_1.__generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file)];
                    case 1:
                        _h.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _h.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload1)];
                    case 3:
                        _h.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _h.sent();
                        _a = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.getTitle()];
                    case 5:
                        _a.apply(void 0, [_h.sent()]).toEqual('Upload New Version');
                        _b = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.getText()];
                    case 6:
                        _b.apply(void 0, [_h.sent()]).toContain('What level of changes were made to this version?');
                        _c = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isDescriptionDisplayed()];
                    case 7:
                        _c.apply(void 0, [_h.sent()]).toBe(true, 'Description not displayed');
                        _d = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isMinorOptionDisplayed()];
                    case 8:
                        _d.apply(void 0, [_h.sent()]).toBe(true, 'Minor option not displayed');
                        _e = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isMajorOptionDisplayed()];
                    case 9:
                        _e.apply(void 0, [_h.sent()]).toBe(true, 'Major option not displayed');
                        _f = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isCancelButtonEnabled()];
                    case 10:
                        _f.apply(void 0, [_h.sent()]).toBe(true, 'Cancel button not enabled');
                        _g = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isUploadButtonEnabled()];
                    case 11:
                        _g.apply(void 0, [_h.sent()]).toBe(true, 'Update button not enabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file is updated after uploading a new version - major - [C297552]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload1)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMajor()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new major version description')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.waitForDialogToClose()];
                    case 8:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileToUpload1)];
                    case 9:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File not updated');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(file1Id)];
                    case 10:
                        _b.apply(void 0, [_d.sent()]).toEqual('MAJOR', 'File has incorrect version type');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(file1Id)];
                    case 11:
                        _c.apply(void 0, [_d.sent()]).toEqual('2.0', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file is updated after uploading a new version - minor - [C297553]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file2)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload2)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new minor version description')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.waitForDialogToClose()];
                    case 8:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileToUpload2)];
                    case 9:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File not updated');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(file2Id)];
                    case 10:
                        _b.apply(void 0, [_d.sent()]).toEqual('MINOR', 'File has incorrect version type');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(file2Id)];
                    case 11:
                        _c.apply(void 0, [_d.sent()]).toEqual('1.1', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file is not updated when clicking Cancel - [C297554]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file3)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload3)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new version description')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickCancel()];
                    case 7:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file3)];
                    case 8:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File was updated');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(file3Id)];
                    case 9:
                        _b.apply(void 0, [_d.sent()]).toEqual('MAJOR', 'File has incorrect version type');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(file3Id)];
                    case 10:
                        _c.apply(void 0, [_d.sent()]).toEqual('1.0', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('upload new version fails when new file name already exists - [C297555]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var message, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file4)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(file)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new version description')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        message = _d.sent();
                        expect(message).toContain(nameConflictMessage);
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file4)];
                    case 9:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File was updated');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(file4Id)];
                    case 10:
                        _b.apply(void 0, [_d.sent()]).toEqual('MAJOR', 'File has incorrect version type');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(file4Id)];
                    case 11:
                        _c.apply(void 0, [_d.sent()]).toEqual('1.0', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file is unlocked after uploading a new version - [C297556]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileLocked1)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload4)];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new version description')];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.waitForDialogToClose()];
                    case 8:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileToUpload4)];
                    case 9:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'File name was not changed');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileLocked1Id)];
                    case 10:
                        _b.apply(void 0, [_e.sent()]).toBe(false, fileLocked1 + " is still locked");
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(fileLocked1Id)];
                    case 11:
                        _c.apply(void 0, [_e.sent()]).toEqual('MINOR', 'File has incorrect version type');
                        _d = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(fileLocked1Id)];
                    case 12:
                        _d.apply(void 0, [_e.sent()]).toEqual('1.1', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file remains locked after canceling of uploading a new version - [C297557]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileLocked2)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload5)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new version description')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickCancel()];
                    case 7:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileToUpload5)];
                    case 8:
                        _a.apply(void 0, [_d.sent()]).toBe(false, 'File was updated');
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileLocked2)];
                    case 9:
                        _b.apply(void 0, [_d.sent()]).toBe(true, 'File not displayed');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileLocked2Id)];
                    case 10:
                        _c.apply(void 0, [_d.sent()]).toBe(true, fileLocked2 + " was unlocked");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Recent Files', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.upload.uploadFile(file, parentRFId)];
                    case 1:
                        fileId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file1, parentRFId)];
                    case 2:
                        file1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file2, parentRFId)];
                    case 3:
                        file2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file3, parentRFId)];
                    case 4:
                        file3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file4, parentRFId)];
                    case 5:
                        file4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileLocked1, parentRFId)];
                    case 6:
                        fileLocked1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileLocked2, parentRFId)];
                    case 7:
                        fileLocked2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked1Id)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked2Id)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, apis.user.search.waitForApi(username, { expect: 21 })];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginWith(username)];
                    case 11:
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
                    case 0: return [4 /*yield*/, page.refresh()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('dialog UI defaults - [C297558]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g;
            return tslib_1.__generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file, parentRF)];
                    case 1:
                        _h.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _h.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload1)];
                    case 3:
                        _h.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _h.sent();
                        _a = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.getTitle()];
                    case 5:
                        _a.apply(void 0, [_h.sent()]).toEqual('Upload New Version');
                        _b = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.getText()];
                    case 6:
                        _b.apply(void 0, [_h.sent()]).toContain('What level of changes were made to this version?');
                        _c = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isDescriptionDisplayed()];
                    case 7:
                        _c.apply(void 0, [_h.sent()]).toBe(true, 'Description not displayed');
                        _d = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isMinorOptionDisplayed()];
                    case 8:
                        _d.apply(void 0, [_h.sent()]).toBe(true, 'Minor option not displayed');
                        _e = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isMajorOptionDisplayed()];
                    case 9:
                        _e.apply(void 0, [_h.sent()]).toBe(true, 'Major option not displayed');
                        _f = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isCancelButtonEnabled()];
                    case 10:
                        _f.apply(void 0, [_h.sent()]).toBe(true, 'Cancel button not enabled');
                        _g = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isUploadButtonEnabled()];
                    case 11:
                        _g.apply(void 0, [_h.sent()]).toBe(true, 'Update button not enabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file is updated after uploading a new version - major - [C297559]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1, parentRF)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload1)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMajor()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new major version description')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.waitForDialogToClose()];
                    case 8:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileToUpload1, parentRF)];
                    case 9:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File not updated');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(file1Id)];
                    case 10:
                        _b.apply(void 0, [_d.sent()]).toEqual('MAJOR', 'File has incorrect version type');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(file1Id)];
                    case 11:
                        _c.apply(void 0, [_d.sent()]).toEqual('2.0', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file is updated after uploading a new version - minor - [C297560]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file2, parentRF)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload2)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new minor version description')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.waitForDialogToClose()];
                    case 8:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileToUpload2, parentRF)];
                    case 9:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File not updated');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(file2Id)];
                    case 10:
                        _b.apply(void 0, [_d.sent()]).toEqual('MINOR', 'File has incorrect version type');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(file2Id)];
                    case 11:
                        _c.apply(void 0, [_d.sent()]).toEqual('1.1', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file is not updated when clicking Cancel - [C297561]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file3, parentRF)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload3)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new version description')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickCancel()];
                    case 7:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file3, parentRF)];
                    case 8:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File was updated');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(file3Id)];
                    case 9:
                        _b.apply(void 0, [_d.sent()]).toEqual('MAJOR', 'File has incorrect version type');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(file3Id)];
                    case 10:
                        _c.apply(void 0, [_d.sent()]).toEqual('1.0', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('upload new version fails when new file name already exists - [C297562]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var message, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file4, parentRF)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(file)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new version description')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        message = _d.sent();
                        expect(message).toContain(nameConflictMessage);
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file4, parentRF)];
                    case 9:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File was updated');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(file4Id)];
                    case 10:
                        _b.apply(void 0, [_d.sent()]).toEqual('MAJOR', 'File has incorrect version type');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(file4Id)];
                    case 11:
                        _c.apply(void 0, [_d.sent()]).toEqual('1.0', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file is unlocked after uploading a new version - [C297563]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileLocked1, parentRF)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload4)];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new version description')];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.waitForDialogToClose()];
                    case 8:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileToUpload4, parentRF)];
                    case 9:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'File name was not changed');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileLocked1Id)];
                    case 10:
                        _b.apply(void 0, [_e.sent()]).toBe(false, fileLocked1 + " is still locked");
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(fileLocked1Id)];
                    case 11:
                        _c.apply(void 0, [_e.sent()]).toEqual('MINOR', 'File has incorrect version type');
                        _d = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(fileLocked1Id)];
                    case 12:
                        _d.apply(void 0, [_e.sent()]).toEqual('1.1', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file remains locked after canceling of uploading a new version - [C297564]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileLocked2, parentRF)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload5)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new version description')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickCancel()];
                    case 7:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileToUpload5, parentRF)];
                    case 8:
                        _a.apply(void 0, [_d.sent()]).toBe(false, 'File was updated');
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileLocked2, parentRF)];
                    case 9:
                        _b.apply(void 0, [_d.sent()]).toBe(true, 'File not displayed');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileLocked2Id)];
                    case 10:
                        _c.apply(void 0, [_d.sent()]).toBe(true, fileLocked2 + " was unlocked");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Favorite Files', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.upload.uploadFile(file, parentFavId)];
                    case 1:
                        fileId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file1, parentFavId)];
                    case 2:
                        file1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file2, parentFavId)];
                    case 3:
                        file2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file3, parentFavId)];
                    case 4:
                        file3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file4, parentFavId)];
                    case 5:
                        file4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileLocked1, parentFavId)];
                    case 6:
                        fileLocked1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileLocked2, parentFavId)];
                    case 7:
                        fileLocked2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked1Id)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLocked2Id)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoritesByIds('file', [fileId, file1Id, file2Id, file3Id, file4Id, fileLocked1Id, fileLocked2Id])];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.waitForApi({ expect: 7 })];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginWith(username)];
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
                    case 0: return [4 /*yield*/, page.refresh()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('dialog UI defaults - [C297565]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g;
            return tslib_1.__generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file)];
                    case 1:
                        _h.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _h.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload1)];
                    case 3:
                        _h.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _h.sent();
                        _a = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.getTitle()];
                    case 5:
                        _a.apply(void 0, [_h.sent()]).toEqual('Upload New Version');
                        _b = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.getText()];
                    case 6:
                        _b.apply(void 0, [_h.sent()]).toContain('What level of changes were made to this version?');
                        _c = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isDescriptionDisplayed()];
                    case 7:
                        _c.apply(void 0, [_h.sent()]).toBe(true, 'Description not displayed');
                        _d = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isMinorOptionDisplayed()];
                    case 8:
                        _d.apply(void 0, [_h.sent()]).toBe(true, 'Minor option not displayed');
                        _e = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isMajorOptionDisplayed()];
                    case 9:
                        _e.apply(void 0, [_h.sent()]).toBe(true, 'Major option not displayed');
                        _f = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isCancelButtonEnabled()];
                    case 10:
                        _f.apply(void 0, [_h.sent()]).toBe(true, 'Cancel button not enabled');
                        _g = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isUploadButtonEnabled()];
                    case 11:
                        _g.apply(void 0, [_h.sent()]).toBe(true, 'Update button not enabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file is updated after uploading a new version - major - [C297566]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload1)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMajor()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new major version description')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.waitForDialogToClose()];
                    case 8:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileToUpload1)];
                    case 9:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File not updated');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(file1Id)];
                    case 10:
                        _b.apply(void 0, [_d.sent()]).toEqual('MAJOR', 'File has incorrect version type');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(file1Id)];
                    case 11:
                        _c.apply(void 0, [_d.sent()]).toEqual('2.0', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file is updated after uploading a new version - minor - [C297567]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file2)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload2)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new minor version description')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.waitForDialogToClose()];
                    case 8:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileToUpload2)];
                    case 9:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File not updated');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(file2Id)];
                    case 10:
                        _b.apply(void 0, [_d.sent()]).toEqual('MINOR', 'File has incorrect version type');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(file2Id)];
                    case 11:
                        _c.apply(void 0, [_d.sent()]).toEqual('1.1', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file is not updated when clicking Cancel - [C297568]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file3)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload3)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new version description')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickCancel()];
                    case 7:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file3)];
                    case 8:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File was updated');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(file3Id)];
                    case 9:
                        _b.apply(void 0, [_d.sent()]).toEqual('MAJOR', 'File has incorrect version type');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(file3Id)];
                    case 10:
                        _c.apply(void 0, [_d.sent()]).toEqual('1.0', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('upload new version fails when new file name already exists - [C297569]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var message, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file4)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(file)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new version description')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        message = _d.sent();
                        expect(message).toContain(nameConflictMessage);
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(file4)];
                    case 9:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File was updated');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(file4Id)];
                    case 10:
                        _b.apply(void 0, [_d.sent()]).toEqual('MAJOR', 'File has incorrect version type');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(file4Id)];
                    case 11:
                        _c.apply(void 0, [_d.sent()]).toEqual('1.0', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file is unlocked after uploading a new version - [C297570]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileLocked1)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload4)];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new version description')];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.waitForDialogToClose()];
                    case 8:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileToUpload4)];
                    case 9:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'File name was not changed');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileLocked1Id)];
                    case 10:
                        _b.apply(void 0, [_e.sent()]).toBe(false, fileLocked1 + " is still locked");
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(fileLocked1Id)];
                    case 11:
                        _c.apply(void 0, [_e.sent()]).toEqual('MINOR', 'File has incorrect version type');
                        _d = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(fileLocked1Id)];
                    case 12:
                        _d.apply(void 0, [_e.sent()]).toEqual('1.1', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file remains locked after canceling of uploading a new version - [C297571]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(fileLocked2)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload5)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new version description')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickCancel()];
                    case 7:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileToUpload5)];
                    case 8:
                        _a.apply(void 0, [_d.sent()]).toBe(false, 'File was updated');
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileLocked2)];
                    case 9:
                        _b.apply(void 0, [_d.sent()]).toBe(true, 'File not displayed');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileLocked2Id)];
                    case 10:
                        _c.apply(void 0, [_d.sent()]).toBe(true, fileLocked2 + " was unlocked");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('on Search Results', function () {
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.upload.uploadFile(file, parentSearchId)];
                    case 1:
                        fileId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileSearch1, parentSearchId)];
                    case 2:
                        fileSearch1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileSearch2, parentSearchId)];
                    case 3:
                        fileSearch2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileSearch3, parentSearchId)];
                    case 4:
                        fileSearch3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileSearch4, parentSearchId)];
                    case 5:
                        fileSearch4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileLockedSearch1, parentSearchId)];
                    case 6:
                        fileLockedSearch1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(fileLockedSearch2, parentSearchId)];
                    case 7:
                        fileLockedSearch2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLockedSearch1Id)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.lockFile(fileLockedSearch2Id)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, apis.user.search.waitForNodes('search-f', { expect: 6 })];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginWith(username)];
                    case 11:
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
                        return [4 /*yield*/, page.header.expandSideNav()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 3:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('dialog UI defaults - [C307003]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g;
            return tslib_1.__generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _h.sent();
                        return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                    case 2:
                        _h.sent();
                        return [4 /*yield*/, searchInput.searchFor(file)];
                    case 3:
                        _h.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 4:
                        _h.sent();
                        return [4 /*yield*/, dataTable.selectItem(file, parentSearch)];
                    case 5:
                        _h.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 6:
                        _h.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload1)];
                    case 7:
                        _h.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 8:
                        _h.sent();
                        _a = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.getTitle()];
                    case 9:
                        _a.apply(void 0, [_h.sent()]).toEqual('Upload New Version');
                        _b = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.getText()];
                    case 10:
                        _b.apply(void 0, [_h.sent()]).toContain('What level of changes were made to this version?');
                        _c = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isDescriptionDisplayed()];
                    case 11:
                        _c.apply(void 0, [_h.sent()]).toBe(true, 'Description not displayed');
                        _d = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isMinorOptionDisplayed()];
                    case 12:
                        _d.apply(void 0, [_h.sent()]).toBe(true, 'Minor option not displayed');
                        _e = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isMajorOptionDisplayed()];
                    case 13:
                        _e.apply(void 0, [_h.sent()]).toBe(true, 'Major option not displayed');
                        _f = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isCancelButtonEnabled()];
                    case 14:
                        _f.apply(void 0, [_h.sent()]).toBe(true, 'Cancel button not enabled');
                        _g = expect;
                        return [4 /*yield*/, uploadNewVersionDialog.isUploadButtonEnabled()];
                    case 15:
                        _g.apply(void 0, [_h.sent()]).toBe(true, 'Update button not enabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file is updated after uploading a new version - major - [C307004]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, searchInput.searchFor(fileSearch1)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, dataTable.selectItem(fileSearch1, parentSearch)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload1)];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMajor()];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new major version description')];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 11:
                        _c.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.waitForDialogToClose()];
                    case 12:
                        _c.sent();
                        // TODO: enable when ACA-2329 is fixed
                        // expect(await dataTable.isItemPresent(fileToUpload1, parentSearch)).toBe(true, 'File not updated');
                        _a = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(fileSearch1Id)];
                    case 13:
                        // TODO: enable when ACA-2329 is fixed
                        // expect(await dataTable.isItemPresent(fileToUpload1, parentSearch)).toBe(true, 'File not updated');
                        _a.apply(void 0, [_c.sent()]).toEqual('MAJOR', 'File has incorrect version type');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(fileSearch1Id)];
                    case 14:
                        _b.apply(void 0, [_c.sent()]).toEqual('2.0', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file is updated after uploading a new version - minor - [C307005]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, searchInput.searchFor(fileSearch2)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, dataTable.selectItem(fileSearch2, parentSearch)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload2)];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new minor version description')];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 11:
                        _c.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.waitForDialogToClose()];
                    case 12:
                        _c.sent();
                        // TODO: enable when ACA-2329 is fixed
                        // expect(await dataTable.isItemPresent(fileToUpload2, parentSearch)).toBe(true, 'File not updated');
                        _a = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(fileSearch2Id)];
                    case 13:
                        // TODO: enable when ACA-2329 is fixed
                        // expect(await dataTable.isItemPresent(fileToUpload2, parentSearch)).toBe(true, 'File not updated');
                        _a.apply(void 0, [_c.sent()]).toEqual('MINOR', 'File has incorrect version type');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(fileSearch2Id)];
                    case 14:
                        _b.apply(void 0, [_c.sent()]).toEqual('1.1', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file is not updated when clicking Cancel - [C307006]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, searchInput.searchFor(fileSearch3)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, dataTable.selectItem(fileSearch3, parentSearch)];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload3)];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new version description')];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickCancel()];
                    case 11:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileSearch3, parentSearch)];
                    case 12:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File was updated');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(fileSearch3Id)];
                    case 13:
                        _b.apply(void 0, [_d.sent()]).toEqual('MAJOR', 'File has incorrect version type');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(fileSearch3Id)];
                    case 14:
                        _c.apply(void 0, [_d.sent()]).toEqual('1.0', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('upload new version fails when new file name already exists - [C307007]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var message, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, searchInput.searchFor(fileSearch4)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, dataTable.selectItem(fileSearch4, parentSearch)];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(file)];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new version description')];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 11:
                        _d.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 12:
                        message = _d.sent();
                        expect(message).toContain(nameConflictMessage);
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileSearch4, parentSearch)];
                    case 13:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'File was updated');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(fileSearch4Id)];
                    case 14:
                        _b.apply(void 0, [_d.sent()]).toEqual('MAJOR', 'File has incorrect version type');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(fileSearch4Id)];
                    case 15:
                        _c.apply(void 0, [_d.sent()]).toEqual('1.0', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file is unlocked after uploading a new version - [C307008]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, searchInput.searchFor(fileLockedSearch1)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, dataTable.selectItem(fileLockedSearch1, parentSearch)];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload4)];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new version description')];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickUpload()];
                    case 11:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.waitForDialogToClose()];
                    case 12:
                        _d.sent();
                        // TODO: enable when ACA-2329 is fixed
                        // expect(await dataTable.isItemPresent(fileToUpload4, parentSearch)).toBe(true, 'File name was not changed');
                        _a = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileLockedSearch1Id)];
                    case 13:
                        // TODO: enable when ACA-2329 is fixed
                        // expect(await dataTable.isItemPresent(fileToUpload4, parentSearch)).toBe(true, 'File name was not changed');
                        _a.apply(void 0, [_d.sent()]).toBe(false, fileLockedSearch1 + " is still locked");
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionType(fileLockedSearch1Id)];
                    case 14:
                        _b.apply(void 0, [_d.sent()]).toEqual('MINOR', 'File has incorrect version type');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.getFileVersionLabel(fileLockedSearch1Id)];
                    case 15:
                        _c.apply(void 0, [_d.sent()]).toEqual('1.1', 'File has incorrect version label');
                        return [2 /*return*/];
                }
            });
        }); });
        it('file remains locked after canceling of uploading a new version - [C307009]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, searchInput.searchFor(fileLockedSearch2)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, dataTable.selectItem(fileLockedSearch2, parentSearch)];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsUploadNewVersion()];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, Utils.uploadFileNewVersion(fileToUpload5)];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, page.waitForDialog()];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickMinor()];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.enterDescription('new version description')];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, uploadNewVersionDialog.clickCancel()];
                    case 11:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileToUpload5, parentSearch)];
                    case 12:
                        _a.apply(void 0, [_d.sent()]).toBe(false, 'File was updated');
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileLockedSearch2, parentSearch)];
                    case 13:
                        _b.apply(void 0, [_d.sent()]).toBe(true, 'File not displayed');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileLockedWrite(fileLockedSearch2Id)];
                    case 14:
                        _c.apply(void 0, [_d.sent()]).toBe(true, fileLockedSearch2 + " was unlocked");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=upload-new-version.test.js.map