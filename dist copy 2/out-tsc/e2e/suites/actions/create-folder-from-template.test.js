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
describe('Create folder from template', function () {
    var random = Utils.random();
    var username = "user-" + random;
    var restrictedTemplateFolder = "restricted-folder-" + random;
    var fileInRestrictedFolder = "restricted-file-" + random + ".txt";
    var templateFolder1 = "template-folder1-" + random;
    var fileInFolder1 = "file-1-" + random + ".txt";
    var templateFolder2 = "template-folder2-" + random;
    var fileInFolder2 = "file-2-" + random + ".txt";
    var templateSubFolder = "template-sub-folder-" + random;
    var fileInRootFolder = "file-in-root-" + random + ".txt";
    var folderInRootFolder = "folder-in-root-" + random;
    var parent = "parent-" + random;
    var parentId;
    var folder1 = {
        name: "folder1-" + random
    };
    var folder2 = {
        name: "folder2-" + random,
        title: "folder2 title",
        description: "folder2 description"
    };
    var duplicateFolderName = "duplicate-folder-" + random;
    var nameWithSpaces = "  folder-" + random + "  ";
    var siteName = "site-" + random;
    var folderSite = {
        name: "folder-site-" + random,
        title: "folder site title",
        description: "folder site description"
    };
    var duplicateFolderSite = "duplicate-folder-site-" + random;
    var docLibUserSite;
    var templates = {
        folders: [
            {
                name: folderInRootFolder
            },
            {
                name: templateFolder1,
                files: [fileInFolder1]
            },
            {
                name: templateFolder2,
                folders: [
                    {
                        name: templateSubFolder
                    }
                ],
                files: [fileInFolder2]
            },
            {
                name: restrictedTemplateFolder,
                files: [fileInRestrictedFolder]
            }
        ],
        files: [fileInRootFolder]
    };
    var folderLink;
    var userApi = new RepoClient(username, username);
    var adminApiActions = new AdminActions();
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var selectTemplateDialog = new SelectTemplateDialog();
    var createFromTemplateDialog = new CreateFromTemplateDialog();
    var sidenav = page.sidenav;
    beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, adminApiActions.createUser({ username: username })];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, userApi.nodes.createFolder(parent)];
                case 2:
                    parentId = (_d.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFolder(duplicateFolderName, parentId)];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, userApi.sites.createSite(siteName)];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, userApi.sites.getDocLibId(siteName)];
                case 5:
                    docLibUserSite = _d.sent();
                    return [4 /*yield*/, userApi.nodes.createFolder(duplicateFolderSite, docLibUserSite)];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, adminApiActions.createSpaceTemplatesHierarchy(templates)];
                case 7:
                    _d.sent();
                    return [4 /*yield*/, adminApiActions.removeUserAccessOnSpaceTemplate(restrictedTemplateFolder)];
                case 8:
                    _d.sent();
                    _b = (_a = adminApiActions).createLinkToFolderName;
                    _c = [folderInRootFolder];
                    return [4 /*yield*/, adminApiActions.getSpaceTemplatesFolderId()];
                case 9: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent()]))];
                case 10:
                    folderLink = (_d.sent()).entry.name;
                    return [4 /*yield*/, loginPage.loginWith(username)];
                case 11:
                    _d.sent();
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
                    return [4 /*yield*/, adminApiActions.cleanupSpaceTemplatesFolder()];
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
    describe('Select Template dialog', function () {
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sidenav.openCreateFolderFromTemplateDialog()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, selectTemplateDialog.waitForDialogToOpen()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Select template - dialog UI - with existing templates - [C325147]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return tslib_1.__generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, selectTemplateDialog.getTitle()];
                    case 1:
                        _a.apply(void 0, [_j.sent()]).toEqual('Select a folder template');
                        _b = expect;
                        return [4 /*yield*/, selectTemplateDialog.dataTable.isEmpty()];
                    case 2:
                        _b.apply(void 0, [_j.sent()]).toBe(false, 'Datatable is empty');
                        _c = expect;
                        return [4 /*yield*/, selectTemplateDialog.dataTable.isItemPresent(templateFolder1)];
                    case 3:
                        _c.apply(void 0, [_j.sent()]).toBe(true, 'template folder not displayed');
                        _d = expect;
                        return [4 /*yield*/, selectTemplateDialog.dataTable.isItemPresent(templateFolder2)];
                    case 4:
                        _d.apply(void 0, [_j.sent()]).toBe(true, 'template folder not displayed');
                        _e = expect;
                        return [4 /*yield*/, selectTemplateDialog.dataTable.isItemPresent(fileInRootFolder)];
                    case 5:
                        _e.apply(void 0, [_j.sent()]).toBe(true, 'file not displayed');
                        _f = expect;
                        return [4 /*yield*/, selectTemplateDialog.breadcrumb.getCurrentFolderName()];
                    case 6:
                        _f.apply(void 0, [_j.sent()]).toEqual('Space Templates');
                        _g = expect;
                        return [4 /*yield*/, selectTemplateDialog.isNextButtonEnabled()];
                    case 7:
                        _g.apply(void 0, [_j.sent()]).toBe(false, 'Next button is not disabled');
                        _h = expect;
                        return [4 /*yield*/, selectTemplateDialog.isCancelButtonEnabled()];
                    case 8:
                        _h.apply(void 0, [_j.sent()]).toBe(true, 'Cancel button is not enabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it("Templates don't appear if user doesn't have permissions to see them - [C325148]", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, selectTemplateDialog.dataTable.isItemPresent(restrictedTemplateFolder)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe(false, 'restricted template folder is displayed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Navigate through the templates list with folder hierarchy - [C325149]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return tslib_1.__generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, selectTemplateDialog.dataTable.isItemPresent(templateFolder2)];
                    case 1:
                        _a.apply(void 0, [_j.sent()]).toBe(true, 'template folder not displayed');
                        return [4 /*yield*/, selectTemplateDialog.dataTable.doubleClickOnRowByName(templateFolder2)];
                    case 2:
                        _j.sent();
                        _b = expect;
                        return [4 /*yield*/, selectTemplateDialog.dataTable.isItemPresent(templateSubFolder)];
                    case 3:
                        _b.apply(void 0, [_j.sent()]).toBe(true, 'template sub-folder not displayed');
                        _c = expect;
                        return [4 /*yield*/, selectTemplateDialog.dataTable.isItemPresent(fileInFolder2)];
                    case 4:
                        _c.apply(void 0, [_j.sent()]).toBe(true, 'template not displayed');
                        _d = expect;
                        return [4 /*yield*/, selectTemplateDialog.dataTable.isItemPresent(templateFolder1)];
                    case 5:
                        _d.apply(void 0, [_j.sent()]).toBe(false, 'template folder is displayed');
                        _e = expect;
                        return [4 /*yield*/, selectTemplateDialog.breadcrumb.getCurrentFolderName()];
                    case 6:
                        _e.apply(void 0, [_j.sent()]).toEqual(templateFolder2);
                        return [4 /*yield*/, selectTemplateDialog.dataTable.doubleClickOnRowByName(templateSubFolder)];
                    case 7:
                        _j.sent();
                        _f = expect;
                        return [4 /*yield*/, selectTemplateDialog.breadcrumb.getCurrentFolderName()];
                    case 8:
                        _f.apply(void 0, [_j.sent()]).toEqual(templateSubFolder);
                        _g = expect;
                        return [4 /*yield*/, selectTemplateDialog.dataTable.isEmpty()];
                    case 9:
                        _g.apply(void 0, [_j.sent()]).toBe(true, 'datatable is not empty');
                        return [4 /*yield*/, selectTemplateDialog.breadcrumb.openPath()];
                    case 10:
                        _j.sent();
                        _h = expect;
                        return [4 /*yield*/, selectTemplateDialog.breadcrumb.getPathItems()];
                    case 11:
                        _h.apply(void 0, [_j.sent()]).toEqual([templateFolder2, 'Space Templates']);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Templates list doesn't allow multiple selection - [C325150]", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, selectTemplateDialog.dataTable.getSelectedRowsCount()];
                    case 1:
                        _a.apply(void 0, [_f.sent()]).toEqual(0, 'Incorrect number of selected rows');
                        return [4 /*yield*/, selectTemplateDialog.dataTable.selectItem(templateFolder1)];
                    case 2:
                        _f.sent();
                        _b = expect;
                        return [4 /*yield*/, selectTemplateDialog.dataTable.getSelectedRowsCount()];
                    case 3:
                        _b.apply(void 0, [_f.sent()]).toEqual(1, 'Incorrect number of selected rows');
                        _c = expect;
                        return [4 /*yield*/, selectTemplateDialog.dataTable.getSelectedRowsNames()];
                    case 4:
                        _c.apply(void 0, [_f.sent()]).toEqual([templateFolder1], 'Incorrect selected item');
                        return [4 /*yield*/, Utils.pressCmd()];
                    case 5:
                        _f.sent();
                        return [4 /*yield*/, selectTemplateDialog.dataTable.selectItem(templateFolder2)];
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
                        _e.apply(void 0, [_f.sent()]).toEqual([templateFolder2], 'Incorrect selected item');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Links to folders are not displayed - [C325153]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, selectTemplateDialog.dataTable.isItemPresent(folderLink)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe(false, 'Link to folder is displayed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Cancel the Select template dialog - [C325151]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
        it('Next button is disabled when selecting a file - [C325139]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, selectTemplateDialog.isNextButtonEnabled()];
                    case 1:
                        _a.apply(void 0, [_c.sent()]).toBe(false, 'Next button is enabled');
                        return [4 /*yield*/, selectTemplateDialog.dataTable.selectItem(fileInRootFolder)];
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
                    case 0: return [4 /*yield*/, sidenav.openCreateFolderFromTemplateDialog()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, selectTemplateDialog.waitForDialogToOpen()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, selectTemplateDialog.dataTable.selectItem(templateFolder1)];
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
        it('Create folder from template - dialog UI - [C325142]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, createFromTemplateDialog.getTitle()];
                    case 1:
                        _a.apply(void 0, [_g.sent()]).toEqual("Create new folder from '" + templateFolder1 + "'");
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
        it('Folder name is required - [C325143]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, createFromTemplateDialog.getName()];
                    case 1:
                        _a.apply(void 0, [_d.sent()]).toEqual(templateFolder1);
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
        it('Special characters in folder name - [C325144]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
        it('Folder name ending with a dot - [C325145]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, createFromTemplateDialog.enterName('folder-name.')];
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
        it('Folder name containing only spaces - [C325146]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
        it('Title too long - [C325141]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
        it('Description too long - [C325140]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                        return [4 /*yield*/, sidenav.openCreateFolderFromTemplateDialog()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, selectTemplateDialog.waitForDialogToOpen()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, selectTemplateDialog.dataTable.selectItem(templateFolder1)];
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
        it('Create a folder from a template - with a new Name - [C325157]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, createFromTemplateDialog.enterName(folder1.name)];
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
                        return [4 /*yield*/, page.dataTable.isItemPresent(folder1.name)];
                    case 5:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Folder not displayed in list view');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Create a folder from a template - with a Name, Title and Description - [C325154]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, desc, title;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, createFromTemplateDialog.enterName(folder2.name)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, createFromTemplateDialog.enterTitle(folder2.title)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, createFromTemplateDialog.enterDescription(folder2.description)];
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
                        return [4 /*yield*/, page.dataTable.isItemPresent(folder2.name)];
                    case 7:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Folder not displayed in list view');
                        return [4 /*yield*/, userApi.nodes.getNodeDescription(folder2.name, parentId)];
                    case 8:
                        desc = _b.sent();
                        expect(desc).toEqual(folder2.description);
                        return [4 /*yield*/, userApi.nodes.getNodeTitle(folder2.name, parentId)];
                    case 9:
                        title = _b.sent();
                        expect(title).toEqual(folder2.title);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Create a folder with a duplicate name - [C325156]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, createFromTemplateDialog.enterName(duplicateFolderName)];
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
        it('Cancel folder creation - [C325155]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                        _b.apply(void 0, [_c.sent()]).toBe(false, 'Folder should not appear in the list');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Trim spaces from folder Name - [C325158]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Folder not displayed in list view');
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
                        return [4 /*yield*/, sidenav.openCreateFolderFromTemplateDialog()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, selectTemplateDialog.waitForDialogToOpen()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, selectTemplateDialog.dataTable.selectItem(templateFolder1)];
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
        it('Create a folder from a template - with Name, Title and Description - [C325161]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, desc, title;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, createFromTemplateDialog.enterName(folderSite.name)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, createFromTemplateDialog.enterTitle(folderSite.title)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, createFromTemplateDialog.enterDescription(folderSite.description)];
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
                        return [4 /*yield*/, page.dataTable.isItemPresent(folderSite.name)];
                    case 7:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Folder not displayed in list view');
                        return [4 /*yield*/, userApi.nodes.getNodeDescription(folderSite.name, docLibUserSite)];
                    case 8:
                        desc = _b.sent();
                        expect(desc).toEqual(folderSite.description);
                        return [4 /*yield*/, userApi.nodes.getNodeTitle(folderSite.name, docLibUserSite)];
                    case 9:
                        title = _b.sent();
                        expect(title).toEqual(folderSite.title);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Cancel folder creation - [C325162]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                        _b.apply(void 0, [_c.sent()]).toBe(false, 'Folder should not appear in the list');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Create a folder with a duplicate name - [C325163]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, createFromTemplateDialog.enterName(duplicateFolderSite)];
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
//# sourceMappingURL=create-folder-from-template.test.js.map