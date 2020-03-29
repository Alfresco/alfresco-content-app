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
import { browser } from 'protractor';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { SITE_VISIBILITY, SITE_ROLES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { ShareDialog } from '../../components/dialog/share-dialog';
import { ConfirmDialog } from '../../components/dialog/confirm-dialog';
import { Viewer } from '../../components/viewer/viewer';
import { Utils } from '../../utilities/utils';
describe('Unshare a file', function () {
    var username = "user-" + Utils.random();
    var parent = "parent-" + Utils.random();
    var parentId;
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable, toolbar = page.toolbar;
    var shareDialog = new ShareDialog();
    var confirmDialog = new ConfirmDialog();
    var contextMenu = dataTable.menu;
    var viewer = new Viewer();
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                case 2:
                    parentId = (_a.sent()).entry.id;
                    return [4 /*yield*/, loginPage.loginWith(username)];
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
                case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentId)];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('from Personal Files', function () {
        var file1 = "file1-" + Utils.random() + ".txt";
        var file1Id;
        var file2 = "file2-" + Utils.random() + ".txt";
        var file2Id;
        var file3 = "file3-" + Utils.random() + ".txt";
        var file3Id;
        var file4 = "file4-" + Utils.random() + ".txt";
        var file4Id;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFile(file1, parentId)];
                    case 1:
                        file1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file2, parentId)];
                    case 2:
                        file2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file3, parentId)];
                    case 3:
                        file3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file4, parentId)];
                    case 4:
                        file4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.shared.shareFileById(file1Id)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFileById(file2Id)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFileById(file3Id)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFileById(file4Id)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 4 })];
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
                    case 0: return [4 /*yield*/, page.closeOpenDialogs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(parent)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 4:
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
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(file1Id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(file2Id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(file3Id)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(file4Id)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 0 })];
                    case 5:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Unshare dialog UI - [C286339]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 2:
                        _g.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 3:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isShareToggleChecked()];
                    case 4:
                        _a.apply(void 0, [_g.sent()]).toBe(true, 'Share toggle not checked');
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 5:
                        _g.sent();
                        _b = expect;
                        return [4 /*yield*/, confirmDialog.isDialogOpen()];
                    case 6:
                        _b.apply(void 0, [_g.sent()]).toBe(true, 'Unshare dialog is not open');
                        _c = expect;
                        return [4 /*yield*/, confirmDialog.getTitle()];
                    case 7:
                        _c.apply(void 0, [_g.sent()]).toContain('Remove this shared link');
                        _d = expect;
                        return [4 /*yield*/, confirmDialog.getText()];
                    case 8:
                        _d.apply(void 0, [_g.sent()]).toContain('This link will be deleted and a new link will be created next time this file is shared');
                        _e = expect;
                        return [4 /*yield*/, confirmDialog.isRemoveEnabled()];
                    case 9:
                        _e.apply(void 0, [_g.sent()]).toBe(true, 'REMOVE button is not enabled');
                        _f = expect;
                        return [4 /*yield*/, confirmDialog.isCancelEnabled()];
                    case 10:
                        _f.apply(void 0, [_g.sent()]).toBe(true, 'CANCEL button is not enabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Unshare a file - [C286340]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var url, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file2)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.getLinkUrl()];
                    case 4:
                        url = _e.sent();
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, confirmDialog.clickRemove()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                    case 8:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 9:
                        _a.apply(void 0, [_e.sent()]).toBe(false, 'Share dialog open');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileShared(file2Id)];
                    case 10:
                        _b.apply(void 0, [_e.sent()]).toBe(false, file2 + " is shared");
                        return [4 /*yield*/, browser.get(url)];
                    case 11:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 12:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'viewer is not open');
                        _d = expect;
                        return [4 /*yield*/, viewer.getFileTitle()];
                    case 13:
                        _d.apply(void 0, [_e.sent()]).not.toEqual(file2);
                        return [4 /*yield*/, page.load()];
                    case 14:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Cancel the Unshare action - [C286341]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var urlBefore, _a, _b, urlAfter;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file3)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, shareDialog.getLinkUrl()];
                    case 4:
                        urlBefore = _c.sent();
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, confirmDialog.clickCancel()];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                    case 7:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 8:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Share dialog not open');
                        _b = expect;
                        return [4 /*yield*/, shareDialog.isShareToggleChecked()];
                    case 9:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Share toggle is off');
                        return [4 /*yield*/, shareDialog.getLinkUrl()];
                    case 10:
                        urlAfter = _c.sent();
                        expect(urlBefore).toEqual(urlAfter);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Unshare a file from the context menu - [C286359]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var url, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.rightClickOnItem(file4)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, contextMenu.clickSharedLinkSettings()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.getLinkUrl()];
                    case 4:
                        url = _e.sent();
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, confirmDialog.clickRemove()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                    case 8:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 9:
                        _a.apply(void 0, [_e.sent()]).toBe(false, 'Share dialog open');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileShared(file4Id)];
                    case 10:
                        _b.apply(void 0, [_e.sent()]).toBe(false, file4 + " is shared");
                        return [4 /*yield*/, browser.get(url)];
                    case 11:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 12:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'viewer is not open');
                        _d = expect;
                        return [4 /*yield*/, viewer.getFileTitle()];
                    case 13:
                        _d.apply(void 0, [_e.sent()]).not.toEqual(file4);
                        return [4 /*yield*/, page.load()];
                    case 14:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('from File Libraries', function () {
        var file1 = "file1-" + Utils.random() + ".txt";
        var file1Id;
        var file2 = "file2-" + Utils.random() + ".txt";
        var file2Id;
        var file3 = "file3-" + Utils.random() + ".txt";
        var file3Id;
        var file4 = "file4-" + Utils.random() + ".txt";
        var file4Id;
        var siteName = "site-" + Utils.random();
        var parentInSite = "parent-site-" + Utils.random();
        var parentInSiteId;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var docLibId;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.sites.getDocLibId(siteName)];
                    case 2:
                        docLibId = _a.sent();
                        return [4 /*yield*/, apis.user.nodes.createFolder(parentInSite, docLibId)];
                    case 3:
                        parentInSiteId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file1, parentInSiteId)];
                    case 4:
                        file1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file2, parentInSiteId)];
                    case 5:
                        file2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file3, parentInSiteId)];
                    case 6:
                        file3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file4, parentInSiteId)];
                    case 7:
                        file4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.shared.shareFileById(file1Id)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFileById(file2Id)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFileById(file3Id)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFileById(file4Id)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 4 })];
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
                    case 0: return [4 /*yield*/, page.closeOpenDialogs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(siteName)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(parentInSite)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 6:
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
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.admin.sites.deleteSite(siteName)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 0 })];
                    case 2:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Unshare dialog UI - [C286679]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 2:
                        _g.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 3:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isShareToggleChecked()];
                    case 4:
                        _a.apply(void 0, [_g.sent()]).toBe(true, 'Share toggle not checked');
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 5:
                        _g.sent();
                        _b = expect;
                        return [4 /*yield*/, confirmDialog.isDialogOpen()];
                    case 6:
                        _b.apply(void 0, [_g.sent()]).toBe(true, 'Unshare dialog is not open');
                        _c = expect;
                        return [4 /*yield*/, confirmDialog.getTitle()];
                    case 7:
                        _c.apply(void 0, [_g.sent()]).toContain('Remove this shared link');
                        _d = expect;
                        return [4 /*yield*/, confirmDialog.getText()];
                    case 8:
                        _d.apply(void 0, [_g.sent()]).toContain('This link will be deleted and a new link will be created next time this file is shared');
                        _e = expect;
                        return [4 /*yield*/, confirmDialog.isRemoveEnabled()];
                    case 9:
                        _e.apply(void 0, [_g.sent()]).toBe(true, 'REMOVE button is not enabled');
                        _f = expect;
                        return [4 /*yield*/, confirmDialog.isCancelEnabled()];
                    case 10:
                        _f.apply(void 0, [_g.sent()]).toBe(true, 'CANCEL button is not enabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Unshare a file - [C286680]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var url, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file2)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.getLinkUrl()];
                    case 4:
                        url = _e.sent();
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, confirmDialog.clickRemove()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                    case 8:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 9:
                        _a.apply(void 0, [_e.sent()]).toBe(false, 'Share dialog open');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileShared(file2Id)];
                    case 10:
                        _b.apply(void 0, [_e.sent()]).toBe(false, file2 + " is shared");
                        return [4 /*yield*/, browser.get(url)];
                    case 11:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 12:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'viewer is not open');
                        _d = expect;
                        return [4 /*yield*/, viewer.getFileTitle()];
                    case 13:
                        _d.apply(void 0, [_e.sent()]).not.toEqual(file2);
                        return [4 /*yield*/, page.load()];
                    case 14:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Cancel the Unshare action - [C286681]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var urlBefore, _a, _b, urlAfter;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file3)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, shareDialog.getLinkUrl()];
                    case 4:
                        urlBefore = _c.sent();
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, confirmDialog.clickCancel()];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                    case 7:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 8:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Share dialog not open');
                        _b = expect;
                        return [4 /*yield*/, shareDialog.isShareToggleChecked()];
                    case 9:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Share toggle is off');
                        return [4 /*yield*/, shareDialog.getLinkUrl()];
                    case 10:
                        urlAfter = _c.sent();
                        expect(urlBefore).toEqual(urlAfter);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Unshare a file from the context menu - [C286683]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var url, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.rightClickOnItem(file4)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, contextMenu.clickSharedLinkSettings()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.getLinkUrl()];
                    case 4:
                        url = _e.sent();
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, confirmDialog.clickRemove()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                    case 8:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 9:
                        _a.apply(void 0, [_e.sent()]).toBe(false, 'Share dialog open');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileShared(file4Id)];
                    case 10:
                        _b.apply(void 0, [_e.sent()]).toBe(false, file4 + " is shared");
                        return [4 /*yield*/, browser.get(url)];
                    case 11:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 12:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'viewer is not open');
                        _d = expect;
                        return [4 /*yield*/, viewer.getFileTitle()];
                    case 13:
                        _d.apply(void 0, [_e.sent()]).not.toEqual(file4);
                        return [4 /*yield*/, page.load()];
                    case 14:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('from Recent Files', function () {
        var file1 = "file1-" + Utils.random() + ".txt";
        var file1Id;
        var file2 = "file2-" + Utils.random() + ".txt";
        var file2Id;
        var file3 = "file3-" + Utils.random() + ".txt";
        var file3Id;
        var file4 = "file4-" + Utils.random() + ".txt";
        var file4Id;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFile(file1, parentId)];
                    case 1:
                        file1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file2, parentId)];
                    case 2:
                        file2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file3, parentId)];
                    case 3:
                        file3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file4, parentId)];
                    case 4:
                        file4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.shared.shareFileById(file1Id)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFileById(file2Id)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFileById(file3Id)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFileById(file4Id)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 4 })];
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
                    case 0: return [4 /*yield*/, page.closeOpenDialogs()];
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
        afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.closeOpenDialogs()];
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
                    case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(file1Id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(file2Id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(file3Id)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(file4Id)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 0 })];
                    case 5:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Unshare dialog UI - [C286689]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 2:
                        _g.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 3:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isShareToggleChecked()];
                    case 4:
                        _a.apply(void 0, [_g.sent()]).toBe(true, 'Share toggle not checked');
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 5:
                        _g.sent();
                        _b = expect;
                        return [4 /*yield*/, confirmDialog.isDialogOpen()];
                    case 6:
                        _b.apply(void 0, [_g.sent()]).toBe(true, 'Unshare dialog is not open');
                        _c = expect;
                        return [4 /*yield*/, confirmDialog.getTitle()];
                    case 7:
                        _c.apply(void 0, [_g.sent()]).toContain('Remove this shared link');
                        _d = expect;
                        return [4 /*yield*/, confirmDialog.getText()];
                    case 8:
                        _d.apply(void 0, [_g.sent()]).toContain('This link will be deleted and a new link will be created next time this file is shared');
                        _e = expect;
                        return [4 /*yield*/, confirmDialog.isRemoveEnabled()];
                    case 9:
                        _e.apply(void 0, [_g.sent()]).toBe(true, 'REMOVE button is not enabled');
                        _f = expect;
                        return [4 /*yield*/, confirmDialog.isCancelEnabled()];
                    case 10:
                        _f.apply(void 0, [_g.sent()]).toBe(true, 'CANCEL button is not enabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Unshare a file - [C286690]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var url, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file2)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.getLinkUrl()];
                    case 4:
                        url = _e.sent();
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, confirmDialog.clickRemove()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                    case 8:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 9:
                        _a.apply(void 0, [_e.sent()]).toBe(false, 'Share dialog open');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileShared(file2Id)];
                    case 10:
                        _b.apply(void 0, [_e.sent()]).toBe(false, file2 + " is shared");
                        return [4 /*yield*/, browser.get(url)];
                    case 11:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 12:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'viewer is not open');
                        _d = expect;
                        return [4 /*yield*/, viewer.getFileTitle()];
                    case 13:
                        _d.apply(void 0, [_e.sent()]).not.toEqual(file2);
                        return [4 /*yield*/, page.load()];
                    case 14:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Cancel the Unshare action - [C286691]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var urlBefore, _a, _b, urlAfter;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file3)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, shareDialog.getLinkUrl()];
                    case 4:
                        urlBefore = _c.sent();
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, confirmDialog.clickCancel()];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                    case 7:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 8:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Share dialog not open');
                        _b = expect;
                        return [4 /*yield*/, shareDialog.isShareToggleChecked()];
                    case 9:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Share toggle is off');
                        return [4 /*yield*/, shareDialog.getLinkUrl()];
                    case 10:
                        urlAfter = _c.sent();
                        expect(urlBefore).toEqual(urlAfter);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Unshare a file from the context menu - [C286693]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var url, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.rightClickOnItem(file4)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, contextMenu.clickSharedLinkSettings()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.getLinkUrl()];
                    case 4:
                        url = _e.sent();
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, confirmDialog.clickRemove()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                    case 8:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 9:
                        _a.apply(void 0, [_e.sent()]).toBe(false, 'Share dialog open');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileShared(file4Id)];
                    case 10:
                        _b.apply(void 0, [_e.sent()]).toBe(false, file4 + " is shared");
                        return [4 /*yield*/, browser.get(url)];
                    case 11:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 12:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'viewer is not open');
                        _d = expect;
                        return [4 /*yield*/, viewer.getFileTitle()];
                    case 13:
                        _d.apply(void 0, [_e.sent()]).not.toEqual(file4);
                        return [4 /*yield*/, page.load()];
                    case 14:
                        _e.sent();
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
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFile(file1, parentId)];
                    case 1:
                        file1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file2, parentId)];
                    case 2:
                        file2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file3, parentId)];
                    case 3:
                        file3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file4, parentId)];
                    case 4:
                        file4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.shared.shareFileById(file1Id)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFileById(file2Id)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFileById(file3Id)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFileById(file4Id)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 4 })];
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
                    case 0: return [4 /*yield*/, page.closeOpenDialogs()];
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
        afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.closeOpenDialogs()];
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
                    case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(file1Id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(file2Id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(file3Id)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(file4Id)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 0 })];
                    case 5:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Unshare dialog UI - [C286684]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 2:
                        _g.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 3:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isShareToggleChecked()];
                    case 4:
                        _a.apply(void 0, [_g.sent()]).toBe(true, 'Share toggle not checked');
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 5:
                        _g.sent();
                        _b = expect;
                        return [4 /*yield*/, confirmDialog.isDialogOpen()];
                    case 6:
                        _b.apply(void 0, [_g.sent()]).toBe(true, 'Unshare dialog is not open');
                        _c = expect;
                        return [4 /*yield*/, confirmDialog.getTitle()];
                    case 7:
                        _c.apply(void 0, [_g.sent()]).toContain('Remove this shared link');
                        _d = expect;
                        return [4 /*yield*/, confirmDialog.getText()];
                    case 8:
                        _d.apply(void 0, [_g.sent()]).toContain('This link will be deleted and a new link will be created next time this file is shared');
                        _e = expect;
                        return [4 /*yield*/, confirmDialog.isRemoveEnabled()];
                    case 9:
                        _e.apply(void 0, [_g.sent()]).toBe(true, 'REMOVE button is not enabled');
                        _f = expect;
                        return [4 /*yield*/, confirmDialog.isCancelEnabled()];
                    case 10:
                        _f.apply(void 0, [_g.sent()]).toBe(true, 'CANCEL button is not enabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Unshare a file - [C286685]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var url, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file2)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.getLinkUrl()];
                    case 4:
                        url = _e.sent();
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, confirmDialog.clickRemove()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                    case 8:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 9:
                        _a.apply(void 0, [_e.sent()]).toBe(false, 'Share dialog open');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileShared(file2Id)];
                    case 10:
                        _b.apply(void 0, [_e.sent()]).toBe(false, file2 + " is shared");
                        return [4 /*yield*/, browser.get(url)];
                    case 11:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 12:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'viewer is not open');
                        _d = expect;
                        return [4 /*yield*/, viewer.getFileTitle()];
                    case 13:
                        _d.apply(void 0, [_e.sent()]).not.toEqual(file2);
                        return [4 /*yield*/, page.load()];
                    case 14:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Cancel the Unshare action - [C286686]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var urlBefore, _a, _b, urlAfter;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file3)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, shareDialog.getLinkUrl()];
                    case 4:
                        urlBefore = _c.sent();
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, confirmDialog.clickCancel()];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                    case 7:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 8:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Share dialog not open');
                        _b = expect;
                        return [4 /*yield*/, shareDialog.isShareToggleChecked()];
                    case 9:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Share toggle is off');
                        return [4 /*yield*/, shareDialog.getLinkUrl()];
                    case 10:
                        urlAfter = _c.sent();
                        expect(urlBefore).toEqual(urlAfter);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Unshare a file from the context menu - [C286688]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var url, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.rightClickOnItem(file4)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, contextMenu.clickSharedLinkSettings()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.getLinkUrl()];
                    case 4:
                        url = _e.sent();
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, confirmDialog.clickRemove()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                    case 8:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 9:
                        _a.apply(void 0, [_e.sent()]).toBe(false, 'Share dialog open');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileShared(file4Id)];
                    case 10:
                        _b.apply(void 0, [_e.sent()]).toBe(false, file4 + " is shared");
                        return [4 /*yield*/, browser.get(url)];
                    case 11:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 12:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'viewer is not open');
                        _d = expect;
                        return [4 /*yield*/, viewer.getFileTitle()];
                    case 13:
                        _d.apply(void 0, [_e.sent()]).not.toEqual(file4);
                        return [4 /*yield*/, page.load()];
                    case 14:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('from Favorites', function () {
        var file1 = "file1-" + Utils.random() + ".txt";
        var file1Id;
        var file2 = "file2-" + Utils.random() + ".txt";
        var file2Id;
        var file3 = "file3-" + Utils.random() + ".txt";
        var file3Id;
        var file4 = "file4-" + Utils.random() + ".txt";
        var file4Id;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFile(file1, parentId)];
                    case 1:
                        file1Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file2, parentId)];
                    case 2:
                        file2Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file3, parentId)];
                    case 3:
                        file3Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.nodes.createFile(file4, parentId)];
                    case 4:
                        file4Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.shared.shareFileById(file1Id)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFileById(file2Id)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFileById(file3Id)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFileById(file4Id)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file1Id)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file2Id)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file3Id)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file4Id)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.waitForApi({ expect: 4 })];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 4 })];
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
                    case 0: return [4 /*yield*/, page.closeOpenDialogs()];
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
        afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.closeOpenDialogs()];
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
                    case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(file1Id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(file2Id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(file3Id)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, apis.user.nodes.deleteNodeById(file4Id)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 0 })];
                    case 5:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Unshare dialog UI - [C286694]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 2:
                        _g.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 3:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isShareToggleChecked()];
                    case 4:
                        _a.apply(void 0, [_g.sent()]).toBe(true, 'Share toggle not checked');
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 5:
                        _g.sent();
                        _b = expect;
                        return [4 /*yield*/, confirmDialog.isDialogOpen()];
                    case 6:
                        _b.apply(void 0, [_g.sent()]).toBe(true, 'Unshare dialog is not open');
                        _c = expect;
                        return [4 /*yield*/, confirmDialog.getTitle()];
                    case 7:
                        _c.apply(void 0, [_g.sent()]).toContain('Remove this shared link');
                        _d = expect;
                        return [4 /*yield*/, confirmDialog.getText()];
                    case 8:
                        _d.apply(void 0, [_g.sent()]).toContain('This link will be deleted and a new link will be created next time this file is shared');
                        _e = expect;
                        return [4 /*yield*/, confirmDialog.isRemoveEnabled()];
                    case 9:
                        _e.apply(void 0, [_g.sent()]).toBe(true, 'REMOVE button is not enabled');
                        _f = expect;
                        return [4 /*yield*/, confirmDialog.isCancelEnabled()];
                    case 10:
                        _f.apply(void 0, [_g.sent()]).toBe(true, 'CANCEL button is not enabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Unshare a file - [C286695]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var url, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file2)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.getLinkUrl()];
                    case 4:
                        url = _e.sent();
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, confirmDialog.clickRemove()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                    case 8:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 9:
                        _a.apply(void 0, [_e.sent()]).toBe(false, 'Share dialog open');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileShared(file2Id)];
                    case 10:
                        _b.apply(void 0, [_e.sent()]).toBe(false, file2 + " is shared");
                        return [4 /*yield*/, browser.get(url)];
                    case 11:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 12:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'viewer is not open');
                        _d = expect;
                        return [4 /*yield*/, viewer.getFileTitle()];
                    case 13:
                        _d.apply(void 0, [_e.sent()]).not.toEqual(file2);
                        return [4 /*yield*/, page.load()];
                    case 14:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Cancel the Unshare action - [C286696]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var urlBefore, _a, _b, urlAfter;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file3)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, shareDialog.getLinkUrl()];
                    case 4:
                        urlBefore = _c.sent();
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, confirmDialog.clickCancel()];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                    case 7:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 8:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Share dialog not open');
                        _b = expect;
                        return [4 /*yield*/, shareDialog.isShareToggleChecked()];
                    case 9:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'Share toggle is off');
                        return [4 /*yield*/, shareDialog.getLinkUrl()];
                    case 10:
                        urlAfter = _c.sent();
                        expect(urlBefore).toEqual(urlAfter);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Unshare a file from the context menu - [C286698]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var url, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.rightClickOnItem(file4)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, contextMenu.clickSharedLinkSettings()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.getLinkUrl()];
                    case 4:
                        url = _e.sent();
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, confirmDialog.clickRemove()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                    case 8:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 9:
                        _a.apply(void 0, [_e.sent()]).toBe(false, 'Share dialog open');
                        _b = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileShared(file4Id)];
                    case 10:
                        _b.apply(void 0, [_e.sent()]).toBe(false, file4 + " is shared");
                        return [4 /*yield*/, browser.get(url)];
                    case 11:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 12:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'viewer is not open');
                        _d = expect;
                        return [4 /*yield*/, viewer.getFileTitle()];
                    case 13:
                        _d.apply(void 0, [_e.sent()]).not.toEqual(file4);
                        return [4 /*yield*/, page.load()];
                    case 14:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('as Consumer', function () {
        var sitePrivate = "site-private-" + Utils.random();
        var file1FileLib = "file1-FL-" + Utils.random() + ".txt";
        var file1FileLibId;
        var file2FileLib = "file2-FL-" + Utils.random() + ".txt";
        var file2FileLibId;
        var file1Shared = "file1-Shared-" + Utils.random() + ".txt";
        var file1SharedId;
        var file2Shared = "file2-Shared-" + Utils.random() + ".txt";
        var file2SharedId;
        var file1Fav = "file1-Fav-" + Utils.random() + ".txt";
        var file1FavId;
        var file2Fav = "file2-Fav-" + Utils.random() + ".txt";
        var file2FavId;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var docLibId;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.admin.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.sites.getDocLibId(sitePrivate)];
                    case 2:
                        docLibId = _a.sent();
                        return [4 /*yield*/, apis.admin.nodes.createFile(file1FileLib, docLibId)];
                    case 3:
                        file1FileLibId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.admin.nodes.createFile(file2FileLib, docLibId)];
                    case 4:
                        file2FileLibId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.admin.nodes.createFile(file1Shared, docLibId)];
                    case 5:
                        file1SharedId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.admin.nodes.createFile(file2Shared, docLibId)];
                    case 6:
                        file2SharedId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.admin.nodes.createFile(file1Fav, docLibId)];
                    case 7:
                        file1FavId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.admin.nodes.createFile(file2Fav, docLibId)];
                    case 8:
                        file2FavId = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.admin.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_CONSUMER.ROLE)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.shared.shareFileById(file1FileLibId)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFileById(file2FileLibId)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.shared.shareFileById(file1SharedId)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFileById(file2SharedId)];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, apis.admin.shared.shareFileById(file1FavId)];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.shareFileById(file2FavId)];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file1FavId)];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file2FavId)];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, apis.user.favorites.waitForApi({ expect: 2 })];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 6 })];
                    case 19:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.admin.sites.deleteSite(sitePrivate)];
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
                        return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                    case 2:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('on File Libraries - file shared by other user - [C286682]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, msg;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(sitePrivate)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(file1FileLib)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 6:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isShareToggleDisabled()];
                    case 7:
                        _a.apply(void 0, [_b.sent()]).toBe(false, 'Share toggle disabled for consumer');
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, confirmDialog.clickRemove()];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 10:
                        msg = _b.sent();
                        expect(msg).toContain("You don't have permission to unshare this file");
                        return [2 /*return*/];
                }
            });
        }); });
        it('on File Libraries - file shared by the user - [C286701]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, dataTable.doubleClickOnRowByName(sitePrivate)];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, dataTable.waitForHeader()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, dataTable.selectItem(file2FileLib)];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 6:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isShareToggleDisabled()];
                    case 7:
                        _a.apply(void 0, [_d.sent()]).toBe(false, 'Share toggle disabled for consumer');
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, confirmDialog.clickRemove()];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                    case 11:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 12:
                        _b.apply(void 0, [_d.sent()]).toBe(false, 'Share dialog open');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileShared(file2FileLibId)];
                    case 13:
                        _c.apply(void 0, [_d.sent()]).toBe(false, file2FileLib + " is shared");
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Shared Files - file shared by other user - [C286687]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, msg;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.clickSharedFilesAndWait()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(file1Shared)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 4:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isShareToggleDisabled()];
                    case 5:
                        _a.apply(void 0, [_b.sent()]).toBe(false, 'Share toggle disabled for consumer');
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, confirmDialog.clickRemove()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        msg = _b.sent();
                        expect(msg).toContain("You don't have permission to unshare this file");
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Shared Files - file shared by the user - [C286702]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, page.clickSharedFilesAndWait()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, dataTable.selectItem(file2Shared)];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 4:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isShareToggleDisabled()];
                    case 5:
                        _a.apply(void 0, [_d.sent()]).toBe(false, 'Share toggle disabled for consumer');
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, confirmDialog.clickRemove()];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                    case 9:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 10:
                        _b.apply(void 0, [_d.sent()]).toBe(false, 'Share dialog open');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileShared(file2SharedId)];
                    case 11:
                        _c.apply(void 0, [_d.sent()]).toBe(false, file2Shared + " is shared");
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Favorites - file shared by other user - [C286697]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, msg;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.clickFavoritesAndWait()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(file1Fav)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 4:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isShareToggleDisabled()];
                    case 5:
                        _a.apply(void 0, [_b.sent()]).toBe(false, 'Share toggle disabled for consumer');
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, confirmDialog.clickRemove()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, page.getSnackBarMessage()];
                    case 8:
                        msg = _b.sent();
                        expect(msg).toContain("You don't have permission to unshare this file");
                        return [2 /*return*/];
                }
            });
        }); });
        it('on Favorites - file shared by the user - [C286703]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, page.clickFavoritesAndWait()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, dataTable.selectItem(file2Fav)];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                    case 4:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, shareDialog.isShareToggleDisabled()];
                    case 5:
                        _a.apply(void 0, [_d.sent()]).toBe(false, 'Share toggle disabled for consumer');
                        return [4 /*yield*/, shareDialog.clickShareToggle()];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, confirmDialog.clickRemove()];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                    case 9:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, shareDialog.isDialogOpen()];
                    case 10:
                        _b.apply(void 0, [_d.sent()]).toBe(false, 'Share dialog open');
                        _c = expect;
                        return [4 /*yield*/, apis.user.nodes.isFileShared(file2FavId)];
                    case 11:
                        _c.apply(void 0, [_d.sent()]).toBe(false, file2Fav + " is shared");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=unshare-file.test.js.map