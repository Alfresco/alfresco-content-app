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
describe('Unshare a file from Search Results', function () {
    var username = "user-" + Utils.random();
    var parent = "parent-" + Utils.random();
    var parentId;
    var file1 = "search-file1-" + Utils.random() + ".txt";
    var file1Id;
    var file2 = "search-file2-" + Utils.random() + ".txt";
    var file2Id;
    var file3 = "search-file3-" + Utils.random() + ".txt";
    var file3Id;
    var file4 = "search-file4-" + Utils.random() + ".txt";
    var file4Id;
    var sitePrivate = "site-private-" + Utils.random();
    var fileSite1 = "search-fileSite1-" + Utils.random() + ".txt";
    var fileSite1Id;
    var fileSite2 = "search-fileSite2-" + Utils.random() + ".txt";
    var fileSite2Id;
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
    var searchInput = page.header.searchInput;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var docLibId;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                case 2:
                    parentId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file1, parentId)];
                case 3:
                    file1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file2, parentId)];
                case 4:
                    file2Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file3, parentId)];
                case 5:
                    file3Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file4, parentId)];
                case 6:
                    file4Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.shared.shareFileById(file1Id)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.shareFileById(file2Id)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.shareFileById(file3Id)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.shareFileById(file4Id)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.getDocLibId(sitePrivate)];
                case 12:
                    docLibId = _a.sent();
                    return [4 /*yield*/, apis.admin.nodes.createFile(fileSite1, docLibId)];
                case 13:
                    fileSite1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.admin.nodes.createFile(fileSite2, docLibId)];
                case 14:
                    fileSite2Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.admin.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_CONSUMER.ROLE)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.shared.shareFileById(fileSite1Id)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.shareFileById(fileSite2Id)];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 6 })];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, apis.user.search.waitForNodes('search-file', { expect: 6 })];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 20:
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
                    return [4 /*yield*/, apis.admin.sites.deleteSite(sitePrivate)];
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
                    return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                case 2:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Unshare dialog UI - [C306995]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, searchInput.searchFor(file1)];
                case 3:
                    _g.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _g.sent();
                    return [4 /*yield*/, dataTable.selectItem(file1)];
                case 5:
                    _g.sent();
                    return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                case 6:
                    _g.sent();
                    return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                case 7:
                    _g.sent();
                    _a = expect;
                    return [4 /*yield*/, shareDialog.isShareToggleChecked()];
                case 8:
                    _a.apply(void 0, [_g.sent()]).toBe(true, 'Share toggle not checked');
                    return [4 /*yield*/, shareDialog.clickShareToggle()];
                case 9:
                    _g.sent();
                    _b = expect;
                    return [4 /*yield*/, confirmDialog.isDialogOpen()];
                case 10:
                    _b.apply(void 0, [_g.sent()]).toBe(true, 'Unshare dialog is not open');
                    _c = expect;
                    return [4 /*yield*/, confirmDialog.getTitle()];
                case 11:
                    _c.apply(void 0, [_g.sent()]).toContain('Remove this shared link');
                    _d = expect;
                    return [4 /*yield*/, confirmDialog.getText()];
                case 12:
                    _d.apply(void 0, [_g.sent()]).toContain('This link will be deleted and a new link will be created next time this file is shared');
                    _e = expect;
                    return [4 /*yield*/, confirmDialog.isRemoveEnabled()];
                case 13:
                    _e.apply(void 0, [_g.sent()]).toBe(true, 'REMOVE button is not enabled');
                    _f = expect;
                    return [4 /*yield*/, confirmDialog.isCancelEnabled()];
                case 14:
                    _f.apply(void 0, [_g.sent()]).toBe(true, 'CANCEL button is not enabled');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Unshare a file - [C306996]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var url, _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, searchInput.searchFor(file2)];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, dataTable.selectItem(file2)];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                case 7:
                    _e.sent();
                    return [4 /*yield*/, shareDialog.getLinkUrl()];
                case 8:
                    url = _e.sent();
                    return [4 /*yield*/, shareDialog.clickShareToggle()];
                case 9:
                    _e.sent();
                    return [4 /*yield*/, confirmDialog.clickRemove()];
                case 10:
                    _e.sent();
                    return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                case 11:
                    _e.sent();
                    return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                case 12:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, shareDialog.isDialogOpen()];
                case 13:
                    _a.apply(void 0, [_e.sent()]).toBe(false, 'Share dialog open');
                    _b = expect;
                    return [4 /*yield*/, apis.user.nodes.isFileShared(file2Id)];
                case 14:
                    _b.apply(void 0, [_e.sent()]).toBe(false, file2 + " is shared");
                    return [4 /*yield*/, browser.get(url)];
                case 15:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, viewer.isViewerOpened()];
                case 16:
                    _c.apply(void 0, [_e.sent()]).toBe(true, 'viewer is not open');
                    _d = expect;
                    return [4 /*yield*/, viewer.getFileTitle()];
                case 17:
                    _d.apply(void 0, [_e.sent()]).not.toEqual(file2);
                    return [4 /*yield*/, page.load()];
                case 18:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Cancel the Unshare action - [C306997]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var urlBefore, _a, _b, urlAfter;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, searchInput.searchFor(file3)];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, dataTable.selectItem(file3)];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, shareDialog.getLinkUrl()];
                case 8:
                    urlBefore = _c.sent();
                    return [4 /*yield*/, shareDialog.clickShareToggle()];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, confirmDialog.clickCancel()];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                case 11:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, shareDialog.isDialogOpen()];
                case 12:
                    _a.apply(void 0, [_c.sent()]).toBe(true, 'Share dialog not open');
                    _b = expect;
                    return [4 /*yield*/, shareDialog.isShareToggleChecked()];
                case 13:
                    _b.apply(void 0, [_c.sent()]).toBe(true, 'Share toggle is off');
                    return [4 /*yield*/, shareDialog.getLinkUrl()];
                case 14:
                    urlAfter = _c.sent();
                    expect(urlBefore).toEqual(urlAfter);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Unshare a file from the context menu - [C306999]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var url, _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, searchInput.searchFor(file4)];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, dataTable.rightClickOnItem(file4)];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, contextMenu.waitForMenuToOpen()];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, contextMenu.clickSharedLinkSettings()];
                case 7:
                    _e.sent();
                    return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                case 8:
                    _e.sent();
                    return [4 /*yield*/, shareDialog.getLinkUrl()];
                case 9:
                    url = _e.sent();
                    return [4 /*yield*/, shareDialog.clickShareToggle()];
                case 10:
                    _e.sent();
                    return [4 /*yield*/, confirmDialog.clickRemove()];
                case 11:
                    _e.sent();
                    return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                case 12:
                    _e.sent();
                    return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                case 13:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, shareDialog.isDialogOpen()];
                case 14:
                    _a.apply(void 0, [_e.sent()]).toBe(false, 'Share dialog open');
                    _b = expect;
                    return [4 /*yield*/, apis.user.nodes.isFileShared(file4Id)];
                case 15:
                    _b.apply(void 0, [_e.sent()]).toBe(false, file4 + " is shared");
                    return [4 /*yield*/, browser.get(url)];
                case 16:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, viewer.isViewerOpened()];
                case 17:
                    _c.apply(void 0, [_e.sent()]).toBe(true, 'viewer is not open');
                    _d = expect;
                    return [4 /*yield*/, viewer.getFileTitle()];
                case 18:
                    _d.apply(void 0, [_e.sent()]).not.toEqual(file4);
                    return [4 /*yield*/, page.load()];
                case 19:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Consumer - on Search Results - file shared by other user - [C306998]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, msg;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, searchInput.searchFor(fileSite1)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, dataTable.selectItem(fileSite1)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                case 7:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, shareDialog.isShareToggleDisabled()];
                case 8:
                    _a.apply(void 0, [_b.sent()]).toBe(false, 'Share toggle disabled for consumer');
                    return [4 /*yield*/, shareDialog.clickShareToggle()];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, confirmDialog.clickRemove()];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, page.getSnackBarMessage()];
                case 11:
                    msg = _b.sent();
                    expect(msg).toContain("You don't have permission to unshare this file");
                    return [2 /*return*/];
            }
        });
    }); });
    it('Consumer - on Search Results - file shared by the user - [C307000]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, searchInput.searchFor(fileSite2)];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, dataTable.selectItem(fileSite2)];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                case 7:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, shareDialog.isShareToggleDisabled()];
                case 8:
                    _a.apply(void 0, [_d.sent()]).toBe(false, 'Share toggle disabled for consumer');
                    return [4 /*yield*/, shareDialog.clickShareToggle()];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, confirmDialog.clickRemove()];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, confirmDialog.waitForDialogToClose()];
                case 11:
                    _d.sent();
                    return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                case 12:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, shareDialog.isDialogOpen()];
                case 13:
                    _b.apply(void 0, [_d.sent()]).toBe(false, 'Share dialog open');
                    _c = expect;
                    return [4 /*yield*/, apis.user.nodes.isFileShared(fileSite2Id)];
                case 14:
                    _c.apply(void 0, [_d.sent()]).toBe(false, fileSite2 + " is shared");
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=unshare-file-search-results.test.js.map