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
import { SelectTemplateDialog } from '../../components/dialog/select-template-dialog';
import { CreateFromTemplateDialog } from '../../components/dialog/create-from-template-dialog';
import { Utils } from '../../utilities/utils';
import { AdminActions } from '../../utilities/admin-actions';
import { RepoClient } from '../../utilities/repo-client/repo-client';
describe('Create file from template', function () {
    var random = Utils.random();
    var username = "user-" + random;
    var restrictedTemplateFolder = "restricted-templates-" + random;
    var templateInRestrictedFolder = "template-restricted-" + random + ".txt";
    var templatesFolder1 = "templates-folder1-" + random;
    var template1InFolder1 = "template1-1-" + random + ".txt";
    var template2InFolder1 = "template1-2-" + random + ".txt";
    var templatesFolder2 = "templates-folder2-" + random;
    var template1InFolder2 = "template2-1-" + random + ".txt";
    var templatesSubFolder = "template-subFolder-" + random;
    var template1InRootFolder = "template3-" + random + ".txt";
    var template2InRootFolder = "template4-" + random + ".txt";
    var parent = "parent-" + random;
    var parentId;
    var file1 = {
        name: "file1-" + random + ".txt"
    };
    var file2 = {
        name: "file2-" + random + ".txt",
        title: "file2 title",
        description: "file2 description"
    };
    var duplicateFileName = "duplicate-file-" + random + ".txt";
    var nameWithSpaces = "  file-" + random + ".txt  ";
    var siteName = "site-" + random;
    var fileSite = {
        name: "file-site-" + random + ".txt",
        title: "file site title",
        description: "file site description"
    };
    var duplicateFileSite = "duplicate-file-site-" + random + ".txt";
    var docLibUserSite;
    var userApi = new RepoClient(username, username);
    var adminApiActions = new AdminActions();
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var selectTemplateDialog = new SelectTemplateDialog();
    var createFromTemplateDialog = new CreateFromTemplateDialog();
    var sidenav = page.sidenav;
    beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adminApiActions.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, userApi.nodes.createFolder(parent)];
                case 2:
                    parentId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFile(duplicateFileName, parentId)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, userApi.sites.createSite(siteName)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, userApi.sites.getDocLibId(siteName)];
                case 5:
                    docLibUserSite = _a.sent();
                    return [4 /*yield*/, userApi.nodes.createFile(duplicateFileSite, docLibUserSite)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userApi.nodes.deleteNodeById(parentId)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, userApi.sites.deleteSite(siteName)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, adminApiActions.cleanupNodeTemplatesFolder()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.closeOpenDialogs()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Select template - dialog UI - when no templates exist in the repo - [C325049]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, sidenav.openCreateFileFromTemplateDialog()];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, selectTemplateDialog.waitForDialogToOpen()];
                case 2:
                    _g.sent();
                    _a = expect;
                    return [4 /*yield*/, selectTemplateDialog.getTitle()];
                case 3:
                    _a.apply(void 0, [_g.sent()]).toEqual('Select a document template');
                    _b = expect;
                    return [4 /*yield*/, selectTemplateDialog.dataTable.isEmpty()];
                case 4:
                    _b.apply(void 0, [_g.sent()]).toBe(true, 'Datatable is not empty');
                    _c = expect;
                    return [4 /*yield*/, selectTemplateDialog.dataTable.getEmptyListText()];
                case 5:
                    _c.apply(void 0, [_g.sent()]).toEqual('No results found');
                    _d = expect;
                    return [4 /*yield*/, selectTemplateDialog.breadcrumb.getCurrentFolderName()];
                case 6:
                    _d.apply(void 0, [_g.sent()]).toEqual('Node Templates');
                    _e = expect;
                    return [4 /*yield*/, selectTemplateDialog.isNextButtonEnabled()];
                case 7:
                    _e.apply(void 0, [_g.sent()]).toBe(false, 'Next button is not disabled');
                    _f = expect;
                    return [4 /*yield*/, selectTemplateDialog.isCancelButtonEnabled()];
                case 8:
                    _f.apply(void 0, [_g.sent()]).toBe(true, 'Cancel button is not enabled');
                    return [2 /*return*/];
            }
        });
    }); });
    describe('with existing templates', function () {
        var templates = {
            folders: [
                {
                    name: templatesFolder1,
                    files: [template1InFolder1, template2InFolder1]
                },
                {
                    name: templatesFolder2,
                    folders: [
                        {
                            name: templatesSubFolder
                        }
                    ],
                    files: [template1InFolder2]
                },
                {
                    name: restrictedTemplateFolder,
                    files: [templateInRestrictedFolder]
                }
            ],
            files: [template1InRootFolder, template2InRootFolder]
        };
        var link;
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, adminApiActions.createNodeTemplatesHierarchy(templates)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, adminApiActions.removeUserAccessOnNodeTemplate(restrictedTemplateFolder)];
                    case 2:
                        _d.sent();
                        _b = (_a = adminApiActions).createLinkToFileName;
                        _c = [template2InRootFolder];
                        return [4 /*yield*/, adminApiActions.getNodeTemplatesFolderId()];
                    case 3: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent()]))];
                    case 4:
                        link = (_d.sent()).entry.name;
                        return [2 /*return*/];
                }
            });
        }); });
        describe('Select Template dialog', function () {
            beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, sidenav.openCreateFileFromTemplateDialog()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, selectTemplateDialog.waitForDialogToOpen()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Select template - dialog UI - with existing templates - [C325043]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return tslib_1.__generator(this, function (_k) {
                    switch (_k.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, selectTemplateDialog.getTitle()];
                        case 1:
                            _a.apply(void 0, [_k.sent()]).toEqual('Select a document template');
                            _b = expect;
                            return [4 /*yield*/, selectTemplateDialog.dataTable.isEmpty()];
                        case 2:
                            _b.apply(void 0, [_k.sent()]).toBe(false, 'Datatable is empty');
                            _c = expect;
                            return [4 /*yield*/, selectTemplateDialog.dataTable.isItemPresent(templatesFolder1)];
                        case 3:
                            _c.apply(void 0, [_k.sent()]).toBe(true, 'template folder not displayed');
                            _d = expect;
                            return [4 /*yield*/, selectTemplateDialog.dataTable.isItemPresent(templatesFolder2)];
                        case 4:
                            _d.apply(void 0, [_k.sent()]).toBe(true, 'template folder not displayed');
                            _e = expect;
                            return [4 /*yield*/, selectTemplateDialog.dataTable.isItemPresent(template1InRootFolder)];
                        case 5:
                            _e.apply(void 0, [_k.sent()]).toBe(true, 'template not displayed');
                            _f = expect;
                            return [4 /*yield*/, selectTemplateDialog.dataTable.isItemPresent(template2InRootFolder)];
                        case 6:
                            _f.apply(void 0, [_k.sent()]).toBe(true, 'template not displayed');
                            _g = expect;
                            return [4 /*yield*/, selectTemplateDialog.breadcrumb.getCurrentFolderName()];
                        case 7:
                            _g.apply(void 0, [_k.sent()]).toEqual('Node Templates');
                            _h = expect;
                            return [4 /*yield*/, selectTemplateDialog.isNextButtonEnabled()];
                        case 8:
                            _h.apply(void 0, [_k.sent()]).toBe(false, 'Next button is not disabled');
                            _j = expect;
                            return [4 /*yield*/, selectTemplateDialog.isCancelButtonEnabled()];
                        case 9:
                            _j.apply(void 0, [_k.sent()]).toBe(true, 'Cancel button is not enabled');
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Templates don't appear if user doesn't have permissions to see them - [C325044]", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, selectTemplateDialog.dataTable.isItemPresent(restrictedTemplateFolder)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).toBe(false, 'restricted templates folder is displayed');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Navigate through the templates list with folder hierarchy - [C325045]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return tslib_1.__generator(this, function (_k) {
                    switch (_k.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, selectTemplateDialog.dataTable.isItemPresent(templatesFolder2)];
                        case 1:
                            _a.apply(void 0, [_k.sent()]).toBe(true, 'template folder not displayed');
                            return [4 /*yield*/, selectTemplateDialog.dataTable.doubleClickOnRowByName(templatesFolder2)];
                        case 2:
                            _k.sent();
                            _b = expect;
                            return [4 /*yield*/, selectTemplateDialog.dataTable.isItemPresent(templatesSubFolder)];
                        case 3:
                            _b.apply(void 0, [_k.sent()]).toBe(true, 'template sub-folder not displayed');
                            _c = expect;
                            return [4 /*yield*/, selectTemplateDialog.dataTable.isItemPresent(template1InFolder2)];
                        case 4:
                            _c.apply(void 0, [_k.sent()]).toBe(true, 'template not displayed');
                            _d = expect;
                            return [4 /*yield*/, selectTemplateDialog.dataTable.isItemPresent(template1InRootFolder)];
                        case 5:
                            _d.apply(void 0, [_k.sent()]).toBe(false, 'template is displayed');
                            _e = expect;
                            return [4 /*yield*/, selectTemplateDialog.dataTable.isItemPresent(template2InRootFolder)];
                        case 6:
                            _e.apply(void 0, [_k.sent()]).toBe(false, 'template is displayed');
                            _f = expect;
                            return [4 /*yield*/, selectTemplateDialog.breadcrumb.getCurrentFolderName()];
                        case 7:
                            _f.apply(void 0, [_k.sent()]).toEqual(templatesFolder2);
                            return [4 /*yield*/, selectTemplateDialog.dataTable.doubleClickOnRowByName(templatesSubFolder)];
                        case 8:
                            _k.sent();
                            _g = expect;
                            return [4 /*yield*/, selectTemplateDialog.breadcrumb.getCurrentFolderName()];
                        case 9:
                            _g.apply(void 0, [_k.sent()]).toEqual(templatesSubFolder);
                            _h = expect;
                            return [4 /*yield*/, selectTemplateDialog.dataTable.isEmpty()];
                        case 10:
                            _h.apply(void 0, [_k.sent()]).toBe(true, 'datatable is not empty');
                            return [4 /*yield*/, selectTemplateDialog.breadcrumb.openPath()];
                        case 11:
                            _k.sent();
                            _j = expect;
                            return [4 /*yield*/, selectTemplateDialog.breadcrumb.getPathItems()];
                        case 12:
                            _j.apply(void 0, [_k.sent()]).toEqual([templatesFolder2, 'Node Templates']);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Templates list doesn't allow multiple selection - [C325047]", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e;
                return tslib_1.__generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, selectTemplateDialog.dataTable.getSelectedRowsCount()];
                        case 1:
                            _a.apply(void 0, [_f.sent()]).toEqual(0, 'Incorrect number of selected rows');
                            return [4 /*yield*/, selectTemplateDialog.dataTable.selectItem(template1InRootFolder)];
                        case 2:
                            _f.sent();
                            _b = expect;
                            return [4 /*yield*/, selectTemplateDialog.dataTable.getSelectedRowsCount()];
                        case 3:
                            _b.apply(void 0, [_f.sent()]).toEqual(1, 'Incorrect number of selected rows');
                            _c = expect;
                            return [4 /*yield*/, selectTemplateDialog.dataTable.getSelectedRowsNames()];
                        case 4:
                            _c.apply(void 0, [_f.sent()]).toEqual([template1InRootFolder], 'Incorrect selected item');
                            return [4 /*yield*/, Utils.pressCmd()];
                        case 5:
                            _f.sent();
                            return [4 /*yield*/, selectTemplateDialog.dataTable.selectItem(template2InRootFolder)];
                        case 6:
                            _f.sent();
                            return [4 /*yield*/, Utils.releaseKeyPressed()];
                        case 7:
                            _f.sent();
                            _d = expect;
                            return [4 /*yield*/, selectTemplateDialog.dataTable.getSelectedRowsCount()];
                        case 8:
                            _d.apply(void 0, [_f.sent()]).toEqual(1, 'Incorrect number of selected rows');
                            _e = expect;
                            return [4 /*yield*/, selectTemplateDialog.dataTable.getSelectedRowsNames()];
                        case 9:
                            _e.apply(void 0, [_f.sent()]).toEqual([template2InRootFolder], 'Incorrect selected item');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Links to files are not displayed - [C325050]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, selectTemplateDialog.dataTable.isItemPresent(link)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).toBe(false, 'Link to file is displayed');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Cancel the Select template dialog - [C325048]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, selectTemplateDialog.isCancelButtonEnabled()];
                        case 1:
                            _a.apply(void 0, [_c.sent()]).toBe(true, 'Cancel button is not enabled');
                            return [4 /*yield*/, selectTemplateDialog.clickCancel()];
                        case 2:
                            _c.sent();
                            _b = expect;
                            return [4 /*yield*/, selectTemplateDialog.isDialogOpen()];
                        case 3:
                            _b.apply(void 0, [_c.sent()]).toBe(false, 'Select Template dialog is open');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Next button is disabled when selecting a folder - [C216339]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, selectTemplateDialog.isNextButtonEnabled()];
                        case 1:
                            _a.apply(void 0, [_c.sent()]).toBe(false, 'Next button is enabled');
                            return [4 /*yield*/, selectTemplateDialog.dataTable.selectItem(templatesFolder1)];
                        case 2:
                            _c.sent();
                            _b = expect;
                            return [4 /*yield*/, selectTemplateDialog.isNextButtonEnabled()];
                        case 3:
                            _b.apply(void 0, [_c.sent()]).toBe(false, 'Next button is enabled');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('Create from template dialog', function () {
            beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, sidenav.openCreateFileFromTemplateDialog()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, selectTemplateDialog.waitForDialogToOpen()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, selectTemplateDialog.dataTable.selectItem(template1InRootFolder)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, selectTemplateDialog.clickNext()];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, createFromTemplateDialog.waitForDialogToOpen()];
                        case 5:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Create file from template - dialog UI - [C325020]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f;
                return tslib_1.__generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, createFromTemplateDialog.getTitle()];
                        case 1:
                            _a.apply(void 0, [_g.sent()]).toEqual("Create new document from '" + template1InRootFolder + "'");
                            _b = expect;
                            return [4 /*yield*/, createFromTemplateDialog.isNameFieldDisplayed()];
                        case 2:
                            _b.apply(void 0, [_g.sent()]).toBe(true, 'Name field not displayed');
                            _c = expect;
                            return [4 /*yield*/, createFromTemplateDialog.isTitleFieldDisplayed()];
                        case 3:
                            _c.apply(void 0, [_g.sent()]).toBe(true, 'Title field not displayed');
                            _d = expect;
                            return [4 /*yield*/, createFromTemplateDialog.isDescriptionFieldDisplayed()];
                        case 4:
                            _d.apply(void 0, [_g.sent()]).toBe(true, 'Description field not displayed');
                            _e = expect;
                            return [4 /*yield*/, createFromTemplateDialog.isCancelButtonEnabled()];
                        case 5:
                            _e.apply(void 0, [_g.sent()]).toBe(true, 'Cancel button is not enabled');
                            _f = expect;
                            return [4 /*yield*/, createFromTemplateDialog.isCreateButtonEnabled()];
                        case 6:
                            _f.apply(void 0, [_g.sent()]).toBe(true, 'Create button is not enabled');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File name is required - [C325031]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c;
                return tslib_1.__generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, createFromTemplateDialog.getName()];
                        case 1:
                            _a.apply(void 0, [_d.sent()]).toEqual(template1InRootFolder);
                            return [4 /*yield*/, createFromTemplateDialog.deleteNameWithBackspace()];
                        case 2:
                            _d.sent();
                            _b = expect;
                            return [4 /*yield*/, createFromTemplateDialog.getValidationMessage()];
                        case 3:
                            _b.apply(void 0, [_d.sent()]).toEqual('Name is required');
                            _c = expect;
                            return [4 /*yield*/, createFromTemplateDialog.isCreateButtonEnabled()];
                        case 4:
                            _c.apply(void 0, [_d.sent()]).toBe(false, 'Create button is not disabled');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Special characters in file name - [C325032]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var namesWithSpecialChars, _i, namesWithSpecialChars_1, name_1, _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            namesWithSpecialChars = ['a*a', 'a"a', 'a<a', 'a>a', "a\\a", 'a/a', 'a?a', 'a:a', 'a|a'];
                            _i = 0, namesWithSpecialChars_1 = namesWithSpecialChars;
                            _c.label = 1;
                        case 1:
                            if (!(_i < namesWithSpecialChars_1.length)) return [3 /*break*/, 6];
                            name_1 = namesWithSpecialChars_1[_i];
                            return [4 /*yield*/, createFromTemplateDialog.enterName(name_1)];
                        case 2:
                            _c.sent();
                            _a = expect;
                            return [4 /*yield*/, createFromTemplateDialog.isCreateButtonEnabled()];
                        case 3:
                            _a.apply(void 0, [_c.sent()]).toBe(false, 'Create button is not disabled');
                            _b = expect;
                            return [4 /*yield*/, createFromTemplateDialog.getValidationMessage()];
                        case 4:
                            _b.apply(void 0, [_c.sent()]).toContain("Name can't contain these characters");
                            _c.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
            it('File name ending with a dot - [C325033]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, createFromTemplateDialog.enterName('file-name.')];
                        case 1:
                            _c.sent();
                            _a = expect;
                            return [4 /*yield*/, createFromTemplateDialog.isCreateButtonEnabled()];
                        case 2:
                            _a.apply(void 0, [_c.sent()]).toBe(false, 'Create button is not disabled');
                            _b = expect;
                            return [4 /*yield*/, createFromTemplateDialog.getValidationMessage()];
                        case 3:
                            _b.apply(void 0, [_c.sent()]).toMatch("Name can't end with a period .");
                            return [2 /*return*/];
                    }
                });
            }); });
            it('File name containing only spaces - [C325034]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, createFromTemplateDialog.enterName('    ')];
                        case 1:
                            _c.sent();
                            _a = expect;
                            return [4 /*yield*/, createFromTemplateDialog.isCreateButtonEnabled()];
                        case 2:
                            _a.apply(void 0, [_c.sent()]).toBe(false, 'Create button is not disabled');
                            _b = expect;
                            return [4 /*yield*/, createFromTemplateDialog.getValidationMessage()];
                        case 3:
                            _b.apply(void 0, [_c.sent()]).toMatch("Name can't contain only spaces");
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Title too long - [C290146]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, createFromTemplateDialog.enterTitle(Utils.string257)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, Utils.pressTab()];
                        case 2:
                            _c.sent();
                            _a = expect;
                            return [4 /*yield*/, createFromTemplateDialog.isCreateButtonEnabled()];
                        case 3:
                            _a.apply(void 0, [_c.sent()]).toBe(false, 'Create button is not disabled');
                            _b = expect;
                            return [4 /*yield*/, createFromTemplateDialog.getValidationMessage()];
                        case 4:
                            _b.apply(void 0, [_c.sent()]).toMatch("Use 256 characters or less for title");
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Description too long - [C290142]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, createFromTemplateDialog.enterDescription(Utils.string513)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, Utils.pressTab()];
                        case 2:
                            _c.sent();
                            _a = expect;
                            return [4 /*yield*/, createFromTemplateDialog.isCreateButtonEnabled()];
                        case 3:
                            _a.apply(void 0, [_c.sent()]).toBe(false, 'Create button is not disabled');
                            _b = expect;
                            return [4 /*yield*/, createFromTemplateDialog.getValidationMessage()];
                        case 4:
                            _b.apply(void 0, [_c.sent()]).toMatch("Use 512 characters or less for description");
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('On Personal Files', function () {
            beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(parent)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, sidenav.openCreateFileFromTemplateDialog()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, selectTemplateDialog.waitForDialogToOpen()];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, selectTemplateDialog.dataTable.selectItem(template1InRootFolder)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, selectTemplateDialog.clickNext()];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, createFromTemplateDialog.waitForDialogToOpen()];
                        case 7:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Create a file from a template - with a new Name - [C325030]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, createFromTemplateDialog.enterName(file1.name)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, createFromTemplateDialog.clickCreate()];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, createFromTemplateDialog.waitForDialogToClose()];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, page.dataTable.waitForHeader()];
                        case 4:
                            _b.sent();
                            _a = expect;
                            return [4 /*yield*/, page.dataTable.isItemPresent(file1.name)];
                        case 5:
                            _a.apply(void 0, [_b.sent()]).toBe(true, 'File not displayed in list view');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Create a file from a template - with a Name, Title and Description - [C325026]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, desc, title;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, createFromTemplateDialog.enterName(file2.name)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, createFromTemplateDialog.enterTitle(file2.title)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, createFromTemplateDialog.enterDescription(file2.description)];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, createFromTemplateDialog.clickCreate()];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, createFromTemplateDialog.waitForDialogToClose()];
                        case 5:
                            _b.sent();
                            return [4 /*yield*/, page.dataTable.waitForHeader()];
                        case 6:
                            _b.sent();
                            _a = expect;
                            return [4 /*yield*/, page.dataTable.isItemPresent(file2.name)];
                        case 7:
                            _a.apply(void 0, [_b.sent()]).toBe(true, 'File not displayed in list view');
                            return [4 /*yield*/, userApi.nodes.getNodeDescription(file2.name, parentId)];
                        case 8:
                            desc = _b.sent();
                            expect(desc).toEqual(file2.description);
                            return [4 /*yield*/, userApi.nodes.getNodeTitle(file2.name, parentId)];
                        case 9:
                            title = _b.sent();
                            expect(title).toEqual(file2.title);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Create a file with a duplicate name - [C325028]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, createFromTemplateDialog.enterName(duplicateFileName)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, createFromTemplateDialog.clickCreate()];
                        case 2:
                            _c.sent();
                            _a = expect;
                            return [4 /*yield*/, page.getSnackBarMessage()];
                        case 3:
                            _a.apply(void 0, [_c.sent()]).toEqual("This name is already in use, try a different name.");
                            _b = expect;
                            return [4 /*yield*/, createFromTemplateDialog.isDialogOpen()];
                        case 4:
                            _b.apply(void 0, [_c.sent()]).toBe(true, 'dialog is not present');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Cancel file creation - [C325027]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, createFromTemplateDialog.enterName('test')];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, createFromTemplateDialog.clickCancel()];
                        case 2:
                            _c.sent();
                            _a = expect;
                            return [4 /*yield*/, createFromTemplateDialog.isDialogOpen()];
                        case 3:
                            _a.apply(void 0, [_c.sent()]).not.toBe(true, 'dialog is not closed');
                            _b = expect;
                            return [4 /*yield*/, page.dataTable.isItemPresent('test')];
                        case 4:
                            _b.apply(void 0, [_c.sent()]).toBe(false, 'File should not appear in the list');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Trim spaces from file Name - [C325042]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, createFromTemplateDialog.enterName(nameWithSpaces)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, createFromTemplateDialog.clickCreate()];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, createFromTemplateDialog.waitForDialogToClose()];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, page.dataTable.waitForHeader()];
                        case 4:
                            _b.sent();
                            _a = expect;
                            return [4 /*yield*/, page.dataTable.isItemPresent(nameWithSpaces.trim())];
                        case 5:
                            _a.apply(void 0, [_b.sent()]).toBe(true, 'File not displayed in list view');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('On File Libraries', function () {
            var fileLibrariesPage = new BrowsingPage();
            beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fileLibrariesPage.goToMyLibrariesAndWait()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, page.dataTable.doubleClickOnRowByName(siteName)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, sidenav.openCreateFileFromTemplateDialog()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, selectTemplateDialog.waitForDialogToOpen()];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, selectTemplateDialog.dataTable.selectItem(template1InRootFolder)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, selectTemplateDialog.clickNext()];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, createFromTemplateDialog.waitForDialogToOpen()];
                        case 7:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Create a file from a template - with Name, Title and Description - [C325023]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, desc, title;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, createFromTemplateDialog.enterName(fileSite.name)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, createFromTemplateDialog.enterTitle(fileSite.title)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, createFromTemplateDialog.enterDescription(fileSite.description)];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, createFromTemplateDialog.clickCreate()];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, createFromTemplateDialog.waitForDialogToClose()];
                        case 5:
                            _b.sent();
                            return [4 /*yield*/, page.dataTable.waitForHeader()];
                        case 6:
                            _b.sent();
                            _a = expect;
                            return [4 /*yield*/, page.dataTable.isItemPresent(fileSite.name)];
                        case 7:
                            _a.apply(void 0, [_b.sent()]).toBe(true, 'File not displayed in list view');
                            return [4 /*yield*/, userApi.nodes.getNodeDescription(fileSite.name, docLibUserSite)];
                        case 8:
                            desc = _b.sent();
                            expect(desc).toEqual(fileSite.description);
                            return [4 /*yield*/, userApi.nodes.getNodeTitle(fileSite.name, docLibUserSite)];
                        case 9:
                            title = _b.sent();
                            expect(title).toEqual(fileSite.title);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Cancel file creation - [C325024]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, createFromTemplateDialog.enterName('test')];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, createFromTemplateDialog.clickCancel()];
                        case 2:
                            _c.sent();
                            _a = expect;
                            return [4 /*yield*/, createFromTemplateDialog.isDialogOpen()];
                        case 3:
                            _a.apply(void 0, [_c.sent()]).not.toBe(true, 'dialog is not closed');
                            _b = expect;
                            return [4 /*yield*/, page.dataTable.isItemPresent('test')];
                        case 4:
                            _b.apply(void 0, [_c.sent()]).toBe(false, 'File should not appear in the list');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Create a file with a duplicate name - [C325025]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, createFromTemplateDialog.enterName(duplicateFileSite)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, createFromTemplateDialog.clickCreate()];
                        case 2:
                            _c.sent();
                            _a = expect;
                            return [4 /*yield*/, page.getSnackBarMessage()];
                        case 3:
                            _a.apply(void 0, [_c.sent()]).toEqual("This name is already in use, try a different name.");
                            _b = expect;
                            return [4 /*yield*/, createFromTemplateDialog.isDialogOpen()];
                        case 4:
                            _b.apply(void 0, [_c.sent()]).toBe(true, 'dialog is not present');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
//# sourceMappingURL=create-file-from-template.test.js.map