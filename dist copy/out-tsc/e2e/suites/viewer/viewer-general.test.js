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
import { FILES, SITE_VISIBILITY } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
import { Viewer } from '../../components/viewer/viewer';
describe('Viewer general', function () {
    var username = "user-" + Utils.random();
    var parent = "parent-" + Utils.random();
    var parentId;
    var xlsxFile = FILES.xlsxFile;
    var xlsxFileId;
    var fileAdmin = FILES.docxFile;
    var fileAdminId;
    var siteAdmin = "siteAdmin-" + Utils.random();
    var docLibId;
    var siteUser = "siteUser-" + Utils.random();
    var docLibSiteUserId;
    var fileInSite = FILES.docxFile;
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable;
    var viewer = new Viewer();
    var searchInput = page.header.searchInput;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                case 2:
                    parentId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.upload.uploadFile(xlsxFile, parentId)];
                case 3:
                    xlsxFileId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.admin.sites.createSite(siteAdmin, SITE_VISIBILITY.PRIVATE)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.getDocLibId(siteAdmin)];
                case 5:
                    docLibId = _a.sent();
                    return [4 /*yield*/, apis.admin.upload.uploadFile(fileAdmin, docLibId)];
                case 6:
                    fileAdminId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.sites.createSite(siteUser, SITE_VISIBILITY.PUBLIC)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.getDocLibId(siteUser)];
                case 8:
                    docLibSiteUserId = _a.sent();
                    return [4 /*yield*/, apis.user.upload.uploadFile(fileInSite, docLibSiteUserId)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.shareFileById(xlsxFileId)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 1 })];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', xlsxFileId)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, apis.user.favorites.waitForApi({ expect: 2 })];
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
                case 0: return [4 /*yield*/, page.header.expandSideNav()];
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
                case 0: return [4 /*yield*/, Utils.pressEscape()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.header.expandSideNav()];
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
                    return [4 /*yield*/, apis.admin.sites.deleteSite(siteAdmin)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.deleteSite(siteUser)];
                case 3:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Viewer opens on double clicking on a file from Personal Files - [C279269]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(xlsxFile)];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, viewer.isViewerOpened()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe(true, 'Viewer is not opened');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Viewer opens when clicking the View action for a file - [C279270]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, dataTable.selectItem(xlsxFile)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, page.toolbar.clickView()];
                case 2:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, viewer.isViewerOpened()];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBe(true, 'Viewer is not opened');
                    return [2 /*return*/];
            }
        });
    }); });
    it('The viewer general elements are displayed - [C279283]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(xlsxFile)];
                case 1:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, viewer.isViewerOpened()];
                case 2:
                    _a.apply(void 0, [_e.sent()]).toBe(true, 'Viewer is not opened');
                    _b = expect;
                    return [4 /*yield*/, viewer.isViewerToolbarDisplayed()];
                case 3:
                    _b.apply(void 0, [_e.sent()]).toBe(true, 'Toolbar not displayed');
                    _c = expect;
                    return [4 /*yield*/, viewer.isCloseButtonDisplayed()];
                case 4:
                    _c.apply(void 0, [_e.sent()]).toBe(true, 'Close button is not displayed');
                    _d = expect;
                    return [4 /*yield*/, viewer.isFileTitleDisplayed()];
                case 5:
                    _d.apply(void 0, [_e.sent()]).toBe(true, 'File title is not displayed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Close the viewer - [C279271]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(xlsxFile)];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, viewer.isViewerOpened()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not opened');
                    return [4 /*yield*/, viewer.clickClose()];
                case 3:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, viewer.isViewerOpened()];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe(false, 'Viewer did not close');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Close button tooltip - [C284632]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, dataTable.doubleClickOnRowByName(xlsxFile)];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, viewer.getCloseButtonTooltip()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual('Close');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Viewer opens when accessing the preview URL for a file - [C279285]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var previewURL, _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    previewURL = "personal-files/" + parentId + "/(viewer:view/" + xlsxFileId + ")";
                    return [4 /*yield*/, page.load(previewURL)];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, viewer.isViewerOpened()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not opened');
                    _b = expect;
                    return [4 /*yield*/, viewer.getFileTitle()];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toEqual(xlsxFile);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Viewer does not open when accessing the preview URL for a file without permissions - [C279287]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var previewURL, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    previewURL = "libraries/" + docLibId + "/(viewer:view/" + fileAdminId + ")";
                    return [4 /*yield*/, page.load(previewURL)];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, viewer.isViewerOpened()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe(false, 'Viewer should not be opened!');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Viewer opens for a file from File Libraries - [C284633]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, dataTable.doubleClickOnRowByName(siteUser)];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, dataTable.waitForHeader()];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, dataTable.doubleClickOnRowByName(fileInSite)];
                case 4:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, viewer.isViewerOpened()];
                case 5:
                    _a.apply(void 0, [_e.sent()]).toBe(true, 'Viewer is not opened');
                    _b = expect;
                    return [4 /*yield*/, viewer.isViewerToolbarDisplayed()];
                case 6:
                    _b.apply(void 0, [_e.sent()]).toBe(true, 'Toolbar not displayed');
                    _c = expect;
                    return [4 /*yield*/, viewer.isCloseButtonDisplayed()];
                case 7:
                    _c.apply(void 0, [_e.sent()]).toBe(true, 'Close button is not displayed');
                    _d = expect;
                    return [4 /*yield*/, viewer.isFileTitleDisplayed()];
                case 8:
                    _d.apply(void 0, [_e.sent()]).toBe(true, 'File title is not displayed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Viewer opens for a file from Recent Files - [C284636]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, page.clickRecentFilesAndWait()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, dataTable.doubleClickOnRowByName(xlsxFile)];
                case 2:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, viewer.isViewerOpened()];
                case 3:
                    _a.apply(void 0, [_e.sent()]).toBe(true, 'Viewer is not opened');
                    _b = expect;
                    return [4 /*yield*/, viewer.isViewerToolbarDisplayed()];
                case 4:
                    _b.apply(void 0, [_e.sent()]).toBe(true, 'Toolbar not displayed');
                    _c = expect;
                    return [4 /*yield*/, viewer.isCloseButtonDisplayed()];
                case 5:
                    _c.apply(void 0, [_e.sent()]).toBe(true, 'Close button is not displayed');
                    _d = expect;
                    return [4 /*yield*/, viewer.isFileTitleDisplayed()];
                case 6:
                    _d.apply(void 0, [_e.sent()]).toBe(true, 'File title is not displayed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Viewer opens for a file from Shared Files - [C284635]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, page.clickSharedFilesAndWait()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, dataTable.doubleClickOnRowByName(xlsxFile)];
                case 2:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, viewer.isViewerOpened()];
                case 3:
                    _a.apply(void 0, [_e.sent()]).toBe(true, 'Viewer is not opened');
                    _b = expect;
                    return [4 /*yield*/, viewer.isViewerToolbarDisplayed()];
                case 4:
                    _b.apply(void 0, [_e.sent()]).toBe(true, 'Toolbar not displayed');
                    _c = expect;
                    return [4 /*yield*/, viewer.isCloseButtonDisplayed()];
                case 5:
                    _c.apply(void 0, [_e.sent()]).toBe(true, 'Close button is not displayed');
                    _d = expect;
                    return [4 /*yield*/, viewer.isFileTitleDisplayed()];
                case 6:
                    _d.apply(void 0, [_e.sent()]).toBe(true, 'File title is not displayed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Viewer opens for a file from Favorites - [C284634]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, page.clickFavoritesAndWait()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, dataTable.doubleClickOnRowByName(xlsxFile)];
                case 2:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, viewer.isViewerOpened()];
                case 3:
                    _a.apply(void 0, [_e.sent()]).toBe(true, 'Viewer is not opened');
                    _b = expect;
                    return [4 /*yield*/, viewer.isViewerToolbarDisplayed()];
                case 4:
                    _b.apply(void 0, [_e.sent()]).toBe(true, 'Toolbar not displayed');
                    _c = expect;
                    return [4 /*yield*/, viewer.isCloseButtonDisplayed()];
                case 5:
                    _c.apply(void 0, [_e.sent()]).toBe(true, 'Close button is not displayed');
                    _d = expect;
                    return [4 /*yield*/, viewer.isFileTitleDisplayed()];
                case 6:
                    _d.apply(void 0, [_e.sent()]).toBe(true, 'File title is not displayed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Viewer opens for a file from Search Results - [C279175]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, searchInput.searchFor(xlsxFile)];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, dataTable.doubleClickOnRowByName(xlsxFile)];
                case 5:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, viewer.isViewerOpened()];
                case 6:
                    _a.apply(void 0, [_e.sent()]).toBe(true, 'Viewer is not opened');
                    _b = expect;
                    return [4 /*yield*/, viewer.isViewerToolbarDisplayed()];
                case 7:
                    _b.apply(void 0, [_e.sent()]).toBe(true, 'Toolbar not displayed');
                    _c = expect;
                    return [4 /*yield*/, viewer.isCloseButtonDisplayed()];
                case 8:
                    _c.apply(void 0, [_e.sent()]).toBe(true, 'Close button is not displayed');
                    _d = expect;
                    return [4 /*yield*/, viewer.isFileTitleDisplayed()];
                case 9:
                    _d.apply(void 0, [_e.sent()]).toBe(true, 'File title is not displayed');
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=viewer-general.test.js.map