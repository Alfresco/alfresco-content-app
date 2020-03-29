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
import { SITE_ROLES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
describe('New menu', function () {
    var username = "user-" + Utils.random();
    var siteUser = "site-user-" + Utils.random();
    var siteAdmin = "site-admin-" + Utils.random();
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable, sidenav = page.sidenav;
    var menu = sidenav.menu;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.createSite(siteAdmin)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.addSiteMember(siteAdmin, username, SITE_ROLES.SITE_CONSUMER.ROLE)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apis.user.sites.createSite(siteUser)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 5:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.user.sites.deleteSite(siteUser)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.deleteSite(siteAdmin)];
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
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Actions in Personal Files - [C286524]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, page.clickPersonalFiles()];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, sidenav.openNewMenu()];
                case 2:
                    _g.sent();
                    _a = expect;
                    return [4 /*yield*/, menu.isUploadFileEnabled()];
                case 3:
                    _a.apply(void 0, [_g.sent()]).toBe(true, 'Upload File option not enabled');
                    _b = expect;
                    return [4 /*yield*/, menu.isUploadFolderEnabled()];
                case 4:
                    _b.apply(void 0, [_g.sent()]).toBe(true, 'Upload Folder option not enabled');
                    _c = expect;
                    return [4 /*yield*/, menu.isCreateFolderEnabled()];
                case 5:
                    _c.apply(void 0, [_g.sent()]).toBe(true, 'Create Folder option not enabled');
                    _d = expect;
                    return [4 /*yield*/, menu.isCreateLibraryEnabled()];
                case 6:
                    _d.apply(void 0, [_g.sent()]).toBe(true, 'Create Library option not enabled');
                    _e = expect;
                    return [4 /*yield*/, menu.isCreateFileFromTemplateEnabled()];
                case 7:
                    _e.apply(void 0, [_g.sent()]).toBe(true, 'Create file from template is not enabled');
                    _f = expect;
                    return [4 /*yield*/, menu.isCreateFolderFromTemplateEnabled()];
                case 8:
                    _f.apply(void 0, [_g.sent()]).toBe(true, 'Create folder from template is not enabled');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Actions in File Libraries - user with enough permissions - [C280393]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, dataTable.doubleClickOnRowByName(siteUser)];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, sidenav.openNewMenu()];
                case 3:
                    _g.sent();
                    _a = expect;
                    return [4 /*yield*/, menu.isUploadFileEnabled()];
                case 4:
                    _a.apply(void 0, [_g.sent()]).toBe(true, 'Upload file is not enabled in File Libraries');
                    _b = expect;
                    return [4 /*yield*/, menu.isUploadFolderEnabled()];
                case 5:
                    _b.apply(void 0, [_g.sent()]).toBe(true, 'Upload folder is not enabled in File Libraries');
                    _c = expect;
                    return [4 /*yield*/, menu.isCreateFolderEnabled()];
                case 6:
                    _c.apply(void 0, [_g.sent()]).toBe(true, 'Create folder is not enabled');
                    _d = expect;
                    return [4 /*yield*/, menu.isCreateLibraryEnabled()];
                case 7:
                    _d.apply(void 0, [_g.sent()]).toBe(true, 'Create Library option not enabled');
                    _e = expect;
                    return [4 /*yield*/, menu.isCreateFileFromTemplateEnabled()];
                case 8:
                    _e.apply(void 0, [_g.sent()]).toBe(true, 'Create file from template is not enabled');
                    _f = expect;
                    return [4 /*yield*/, menu.isCreateFolderFromTemplateEnabled()];
                case 9:
                    _f.apply(void 0, [_g.sent()]).toBe(true, 'Create folder from template is not enabled');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Actions in File Libraries - user without enough permissions - [C280397]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, dataTable.doubleClickOnRowByName(siteAdmin)];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, sidenav.openNewMenu()];
                case 3:
                    _g.sent();
                    _a = expect;
                    return [4 /*yield*/, menu.isUploadFileEnabled()];
                case 4:
                    _a.apply(void 0, [_g.sent()]).toBe(false, 'Upload file is not disabled');
                    _b = expect;
                    return [4 /*yield*/, menu.isUploadFolderEnabled()];
                case 5:
                    _b.apply(void 0, [_g.sent()]).toBe(false, 'Upload folder is not disabled');
                    _c = expect;
                    return [4 /*yield*/, menu.isCreateFolderEnabled()];
                case 6:
                    _c.apply(void 0, [_g.sent()]).toBe(false, 'Create folder is not disabled');
                    _d = expect;
                    return [4 /*yield*/, menu.isCreateLibraryEnabled()];
                case 7:
                    _d.apply(void 0, [_g.sent()]).toBe(true, 'Create Library option not enabled');
                    _e = expect;
                    return [4 /*yield*/, menu.isCreateFileFromTemplateEnabled()];
                case 8:
                    _e.apply(void 0, [_g.sent()]).toBe(false, 'Create file from template is not disabled');
                    _f = expect;
                    return [4 /*yield*/, menu.isCreateFolderFromTemplateEnabled()];
                case 9:
                    _f.apply(void 0, [_g.sent()]).toBe(false, 'Create folder from template is not disabled');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Enabled actions tooltips - [C216342]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var tooltip;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.clickPersonalFiles()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, sidenav.openNewMenu()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, menu.getTooltipForUploadFile()];
                case 3:
                    tooltip = _a.sent();
                    expect(tooltip).toContain('Select files to upload');
                    return [4 /*yield*/, menu.getTooltipForUploadFolder()];
                case 4:
                    tooltip = _a.sent();
                    expect(tooltip).toContain('Select folders to upload');
                    return [4 /*yield*/, menu.getTooltipForCreateFolder()];
                case 5:
                    tooltip = _a.sent();
                    expect(tooltip).toContain('Create new folder');
                    return [4 /*yield*/, menu.getTooltipForCreateLibrary()];
                case 6:
                    tooltip = _a.sent();
                    expect(tooltip).toContain('Create a new File Library');
                    return [4 /*yield*/, menu.getTooltipForCreateFileFromTemplate()];
                case 7:
                    tooltip = _a.sent();
                    expect(tooltip).toContain('Create file from template');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Disabled actions tooltips - [C280398]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var tooltip;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dataTable.doubleClickOnRowByName(siteAdmin)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, sidenav.openNewMenu()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, menu.getTooltipForUploadFile()];
                case 4:
                    tooltip = _a.sent();
                    expect(tooltip).toContain('Files cannot be uploaded whilst viewing the current items');
                    return [4 /*yield*/, menu.getTooltipForUploadFolder()];
                case 5:
                    tooltip = _a.sent();
                    expect(tooltip).toContain('Folders cannot be uploaded whilst viewing the current items');
                    return [4 /*yield*/, menu.getTooltipForCreateFolder()];
                case 6:
                    tooltip = _a.sent();
                    expect(tooltip).toContain('Folders cannot be created whilst viewing the current items');
                    return [4 /*yield*/, menu.getTooltipForCreateFileFromTemplate()];
                case 7:
                    tooltip = _a.sent();
                    expect(tooltip).toContain('Files cannot be created whilst viewing the current items');
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=new-menu.test.js.map