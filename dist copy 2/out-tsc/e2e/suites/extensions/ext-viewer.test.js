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
import { Viewer } from './../../components/components';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { EXTENSIBILITY_CONFIGS, FILES } from '../../configs';
import { Utils } from '../../utilities/utils';
describe('Extensions - Viewer', function () {
    var username = "user-" + Utils.random();
    var pdfFile = {
        file_name: FILES.pdfFile,
        component: 'app.components.tabs.metadata'
    };
    var pdfFileId;
    var docxFile = {
        file_name: FILES.docxFile,
        component: 'app.components.tabs.comments'
    };
    var docxFileId;
    var customAction = {
        id: 'app.viewer.my-action',
        title: 'My action',
        icon: 'http'
    };
    var customSecondaryAction = {
        id: 'app.viewer.my-secondary-action',
        title: 'My secondary action',
        icon: 'alarm'
    };
    var downloadButton = {
        id: 'app.viewer.download',
        title: 'My custom title'
    };
    var moveAction = {
        id: 'app.viewer.move',
        title: 'My new title'
    };
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var viewer = new Viewer();
    var toolbar = viewer.toolbar;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.upload.uploadFile(pdfFile.file_name)];
                case 2:
                    pdfFileId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.upload.uploadFile(docxFile.file_name)];
                case 3:
                    docxFileId = (_a.sent()).entry.id;
                    return [4 /*yield*/, loginPage.load()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, Utils.setSessionStorageFromConfig(EXTENSIBILITY_CONFIGS.VIEWER)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 6:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.user.nodes.deleteNodesById([pdfFileId, docxFileId])];
                case 1:
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
    describe('content', function () {
        it('Insert new component in a content viewer - [C284659]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(pdfFile.file_name)];
                    case 1:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_g.sent()]).toBe(true, 'Viewer is not opened');
                        _b = expect;
                        return [4 /*yield*/, viewer.isCustomContentPresent()];
                    case 3:
                        _b.apply(void 0, [_g.sent()]).toBe(true, 'Custom content is not present');
                        _c = expect;
                        return [4 /*yield*/, viewer.getComponentIdOfView()];
                    case 4:
                        _c.apply(void 0, [_g.sent()]).toEqual(pdfFile.component);
                        return [4 /*yield*/, viewer.clickClose()];
                    case 5:
                        _g.sent();
                        return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(docxFile.file_name)];
                    case 6:
                        _g.sent();
                        _d = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 7:
                        _d.apply(void 0, [_g.sent()]).toBe(true, 'Viewer is not opened');
                        _e = expect;
                        return [4 /*yield*/, viewer.isCustomContentPresent()];
                    case 8:
                        _e.apply(void 0, [_g.sent()]).toBe(true, 'Custom content is not present');
                        _f = expect;
                        return [4 /*yield*/, viewer.getComponentIdOfView()];
                    case 9:
                        _f.apply(void 0, [_g.sent()]).toEqual(docxFile.component);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('toolbar actions', function () {
        it('Add a new action in the toolbar - [C286416]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(pdfFile.file_name)];
                    case 1:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'Viewer is not opened');
                        _b = expect;
                        return [4 /*yield*/, toolbar.isButtonPresent(customAction.title)];
                    case 3:
                        _b.apply(void 0, [_e.sent()]).toBe(true, 'Custom action is not present');
                        _c = expect;
                        return [4 /*yield*/, toolbar.getButtonByTitleAttribute(customAction.title).getAttribute('id')];
                    case 4:
                        _c.apply(void 0, [_e.sent()]).toEqual(customAction.id);
                        _d = expect;
                        return [4 /*yield*/, toolbar.getButtonByTitleAttribute(customAction.title).getText()];
                    case 5:
                        _d.apply(void 0, [_e.sent()]).toEqual(customAction.icon);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Modify title of action from toolbar - [C286417]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(pdfFile.file_name)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not opened');
                        _b = expect;
                        return [4 /*yield*/, toolbar.getButtonById(downloadButton.id).getAttribute('title')];
                    case 3:
                        _b.apply(void 0, [_c.sent()]).toEqual(downloadButton.title);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Remove action from toolbar - [C286419]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(pdfFile.file_name)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not opened');
                        _b = expect;
                        return [4 /*yield*/, toolbar.isPrintPresent()];
                    case 3:
                        _b.apply(void 0, [_c.sent()]).toBe(false, 'Print button is still displayed');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('toolbar More actions menu', function () {
        it('Add a new action - [C286420]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(pdfFile.file_name)];
                    case 1:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 3:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, toolbar.menu.isMenuItemPresent(customSecondaryAction.title)];
                    case 4:
                        _b.apply(void 0, [_e.sent()]).toBe(true, 'action is not present');
                        _c = expect;
                        return [4 /*yield*/, toolbar.menu.getItemIconText(customSecondaryAction.title)];
                    case 5:
                        _c.apply(void 0, [_e.sent()]).toEqual(customSecondaryAction.icon);
                        _d = expect;
                        return [4 /*yield*/, toolbar.menu.getItemIdAttribute(customSecondaryAction.title)];
                    case 6:
                        _d.apply(void 0, [_e.sent()]).toEqual(customSecondaryAction.id);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Modify title of action from More actions menu - [C286421]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(pdfFile.file_name)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, toolbar.menu.getItemById(moveAction.id).getAttribute('title')];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toEqual(moveAction.title);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Remove action from More actions menu - [C286423]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(pdfFile.file_name)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Viewer is not opened');
                        return [4 /*yield*/, toolbar.openMoreMenu()];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, toolbar.menu.isManagePermissionsPresent()];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(false, 'Action is still displayed');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=ext-viewer.test.js.map