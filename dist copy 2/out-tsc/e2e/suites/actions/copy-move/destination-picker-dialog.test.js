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
import { AdminActions } from '../../../utilities/admin-actions';
describe('Destination picker dialog : ', function () {
    var random = Utils.random();
    var username = "user-" + random;
    var consumer = "consumer-" + random;
    var contributor = "contributor-" + random;
    var collaborator = "collaborator-" + random;
    var file = "file-" + random + ".txt";
    var fileId;
    var fileIdConsumer;
    var fileIdContributor;
    var fileIdCollaborator;
    var adminFolder = "admin-folder-" + random;
    var adminFolderId;
    var destination = "destination-folder-" + random;
    var destinationId;
    var fileInDestination = "file-in-dest-" + random + ".txt";
    var folderInDestination = "folder-in-dest-" + random;
    var folder2InDestination = "folder2-in-dest-" + random;
    var folderLink;
    var searchFolder = "search-" + random;
    var searchFolderId;
    var searchFolderSiteId;
    var searchSubFolder1 = "sub-folder-" + random;
    var searchSubFolder1Id;
    var searchSubFolder1SiteId;
    var searchSubFolder2 = "sub-folder-" + random;
    var site = "site-" + random;
    var userApi = new RepoClient(username, username);
    var consumerApi = new RepoClient(consumer, consumer);
    var contributorApi = new RepoClient(contributor, contributor);
    var collaboratorApi = new RepoClient(collaborator, collaborator);
    var adminApiActions = new AdminActions();
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable, toolbar = page.toolbar;
    var contentNodeSelector = new ContentNodeSelectorDialog();
    beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var folder2Id, docLibId;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adminApiActions.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, adminApiActions.createUser({ username: consumer })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, adminApiActions.createUser({ username: contributor })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, adminApiActions.createUser({ username: collaborator })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, userApi.nodes.createFile(file)];
                case 5:
                    fileId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFolder(destination)];
                case 6:
                    destinationId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFile(fileInDestination, destinationId)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, userApi.nodes.createFolder(folderInDestination, destinationId)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, userApi.nodes.createFolder(folder2InDestination, destinationId)];
                case 9:
                    folder2Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFolderLink(folder2Id, destinationId)];
                case 10:
                    folderLink = (_a.sent()).entry.name;
                    return [4 /*yield*/, userApi.nodes.createFolder(searchFolder, destinationId)];
                case 11:
                    searchFolderId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFolder(searchSubFolder1, searchFolderId)];
                case 12:
                    searchSubFolder1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFolder(searchSubFolder2, searchSubFolder1Id)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, userApi.sites.createSitePrivate(site)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, userApi.sites.getDocLibId(site)];
                case 15:
                    docLibId = _a.sent();
                    return [4 /*yield*/, userApi.nodes.createFolder(searchFolder, docLibId)];
                case 16:
                    searchFolderSiteId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFolder(searchSubFolder1, searchFolderSiteId)];
                case 17:
                    searchSubFolder1SiteId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.nodes.createFolder(searchSubFolder2, searchSubFolder1SiteId)];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, userApi.sites.addSiteConsumer(site, consumer)];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, userApi.sites.addSiteContributor(site, contributor)];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, userApi.sites.addSiteCollaborator(site, collaborator)];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, consumerApi.nodes.createFile(file)];
                case 22:
                    fileIdConsumer = (_a.sent()).entry.id;
                    return [4 /*yield*/, contributorApi.nodes.createFile(file)];
                case 23:
                    fileIdContributor = (_a.sent()).entry.id;
                    return [4 /*yield*/, collaboratorApi.nodes.createFile(file)];
                case 24:
                    fileIdCollaborator = (_a.sent()).entry.id;
                    return [4 /*yield*/, adminApiActions.nodes.createFolder(adminFolder)];
                case 25:
                    adminFolderId = (_a.sent()).entry.id;
                    return [4 /*yield*/, userApi.search.waitForNodes(searchFolder, { expect: 2 })];
                case 26:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userApi.nodes.deleteNodeById(fileId)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, userApi.nodes.deleteNodeById(destinationId)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, userApi.sites.deleteSite(site)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, consumerApi.nodes.deleteNodeById(fileIdConsumer)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, contributorApi.nodes.deleteNodeById(fileIdContributor)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, collaboratorApi.nodes.deleteNodeById(fileIdCollaborator)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, adminApiActions.nodes.deleteNodeById(adminFolderId)];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.closeOpenDialogs()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('general', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWith(username)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentNodeSelector.waitForDialogToOpen()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Dialog UI - [C263875]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g;
            return tslib_1.__generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, contentNodeSelector.getTitle()];
                    case 1:
                        _a.apply(void 0, [_h.sent()]).toEqual("Copy '" + file + "' to...");
                        _b = expect;
                        return [4 /*yield*/, contentNodeSelector.isSearchInputPresent()];
                    case 2:
                        _b.apply(void 0, [_h.sent()]).toBe(true, 'Search input is not displayed');
                        _c = expect;
                        return [4 /*yield*/, contentNodeSelector.isSelectLocationDropdownDisplayed()];
                    case 3:
                        _c.apply(void 0, [_h.sent()]).toBe(true, 'Select Location dropdown not displayed');
                        _d = expect;
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.getCurrentFolderName()];
                    case 4:
                        _d.apply(void 0, [_h.sent()]).toEqual('Personal Files');
                        _e = expect;
                        return [4 /*yield*/, contentNodeSelector.dataTable.isItemPresent(destination)];
                    case 5:
                        _e.apply(void 0, [_h.sent()]).toBe(true, 'Personal Files content not displayed');
                        _f = expect;
                        return [4 /*yield*/, contentNodeSelector.isCopyButtonEnabled()];
                    case 6:
                        _f.apply(void 0, [_h.sent()]).toBe(true, 'Copy button is not disabled');
                        _g = expect;
                        return [4 /*yield*/, contentNodeSelector.isCancelButtonEnabled()];
                    case 7:
                        _g.apply(void 0, [_h.sent()]).toBe(true, 'Cancel button is not enabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Files are not displayed - [C263880]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, contentNodeSelector.selectLocation('Personal Files')];
                    case 1:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, contentNodeSelector.dataTable.isItemPresent(destination)];
                    case 2:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'destination folder not displayed');
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName(destination)];
                    case 3:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, contentNodeSelector.dataTable.isItemPresent(folderInDestination)];
                    case 4:
                        _b.apply(void 0, [_d.sent()]).toBe(true, 'folder is not displayed');
                        _c = expect;
                        return [4 /*yield*/, contentNodeSelector.dataTable.isItemPresent(fileInDestination)];
                    case 5:
                        _c.apply(void 0, [_d.sent()]).toBe(false, 'file is displayed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Folder links are not displayed - [C263881]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, contentNodeSelector.selectLocation('Personal Files')];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName(destination)];
                    case 2:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, contentNodeSelector.dataTable.isItemPresent(folderInDestination)];
                    case 3:
                        _a.apply(void 0, [_d.sent()]).toBe(true, folderInDestination + " is not displayed");
                        _b = expect;
                        return [4 /*yield*/, contentNodeSelector.dataTable.isItemPresent(folder2InDestination)];
                    case 4:
                        _b.apply(void 0, [_d.sent()]).toBe(true, folder2InDestination + " is not displayed");
                        _c = expect;
                        return [4 /*yield*/, contentNodeSelector.dataTable.isItemPresent(folderLink)];
                    case 5:
                        _c.apply(void 0, [_d.sent()]).toBe(false, 'Link to folder is displayed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('User can see his Libraries - [C263885]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, contentNodeSelector.selectLocation('File Libraries')];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, contentNodeSelector.dataTable.isItemPresent(site)];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'user site is not displayed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Search - No results displayed - [C263889]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, contentNodeSelector.searchFor('nonexistent-folder')];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, contentNodeSelector.dataTable.isEmpty()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'datatable not empty');
                        _b = expect;
                        return [4 /*yield*/, contentNodeSelector.dataTable.getEmptyListText()];
                    case 3:
                        _b.apply(void 0, [_c.sent()]).toEqual('No results found');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Search - results found - [C263888]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, contentNodeSelector.searchFor(searchFolder)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, contentNodeSelector.dataTable.isItemPresent(searchFolder, username)];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'folder from Personal Files not displayed');
                        _b = expect;
                        return [4 /*yield*/, contentNodeSelector.dataTable.isItemPresent(searchFolder, site)];
                    case 3:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'folder from site not displayed');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('multiple selection', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWith(username)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dataTable.selectMultipleItems([file, destination])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentNodeSelector.waitForDialogToOpen()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Dialog title - multiple selection - [C263879]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, contentNodeSelector.getTitle()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual("Copy 2 items to...");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('breadcrumb', function () {
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWith(username)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentNodeSelector.waitForDialogToOpen()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Personal Files breadcrumb - main node - [C263890]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, contentNodeSelector.selectLocation('Personal Files')];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.getCurrentFolderName()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toEqual('Personal Files');
                        return [2 /*return*/];
                }
            });
        }); });
        it('File Libraries breadcrumb - main node - [C263891]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, contentNodeSelector.selectLocation('File Libraries')];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.getCurrentFolderName()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toEqual('File Libraries');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Search results breadcrumb - [C263899]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, contentNodeSelector.searchFor(searchFolder)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, contentNodeSelector.getToolbarTitle()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toEqual('Search results');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Search results breadcrumb when selecting a folder - [C263900]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, contentNodeSelector.searchFor(searchFolder)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, contentNodeSelector.dataTable.selectItem(searchFolder, site)];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.getCurrentFolderName()];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toEqual(searchFolder);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Personal Files breadcrumb - folder structure - [C263897]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, contentNodeSelector.selectLocation('Personal Files')];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName(destination)];
                    case 2:
                        _f.sent();
                        _a = expect;
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.getCurrentFolderName()];
                    case 3:
                        _a.apply(void 0, [_f.sent()]).toEqual(destination);
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName(searchFolder)];
                    case 4:
                        _f.sent();
                        _b = expect;
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.getCurrentFolderName()];
                    case 5:
                        _b.apply(void 0, [_f.sent()]).toEqual(searchFolder);
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName(searchSubFolder1)];
                    case 6:
                        _f.sent();
                        _c = expect;
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.getCurrentFolderName()];
                    case 7:
                        _c.apply(void 0, [_f.sent()]).toEqual(searchSubFolder1);
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName(searchSubFolder2)];
                    case 8:
                        _f.sent();
                        _d = expect;
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.getCurrentFolderName()];
                    case 9:
                        _d.apply(void 0, [_f.sent()]).toEqual(searchSubFolder2);
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.openPath()];
                    case 10:
                        _f.sent();
                        _e = expect;
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.getPathItems()];
                    case 11:
                        _e.apply(void 0, [_f.sent()]).toEqual([searchSubFolder1, searchFolder, destination, 'Personal Files']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('File Libraries breadcrumb - folder structure - [C263898]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, contentNodeSelector.selectLocation('File Libraries')];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName(site)];
                    case 2:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.getCurrentFolderName()];
                    case 3:
                        _a.apply(void 0, [_g.sent()]).toEqual(site);
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName('documentLibrary')];
                    case 4:
                        _g.sent();
                        _b = expect;
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.getCurrentFolderName()];
                    case 5:
                        _b.apply(void 0, [_g.sent()]).toEqual(site);
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName(searchFolder)];
                    case 6:
                        _g.sent();
                        _c = expect;
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.getCurrentFolderName()];
                    case 7:
                        _c.apply(void 0, [_g.sent()]).toEqual(searchFolder);
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName(searchSubFolder1)];
                    case 8:
                        _g.sent();
                        _d = expect;
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.getCurrentFolderName()];
                    case 9:
                        _d.apply(void 0, [_g.sent()]).toEqual(searchSubFolder1);
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName(searchSubFolder2)];
                    case 10:
                        _g.sent();
                        _e = expect;
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.getCurrentFolderName()];
                    case 11:
                        _e.apply(void 0, [_g.sent()]).toEqual(searchSubFolder2);
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.openPath()];
                    case 12:
                        _g.sent();
                        _f = expect;
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.getPathItems()];
                    case 13:
                        _f.apply(void 0, [_g.sent()]).toEqual([searchSubFolder1, searchFolder, site, 'File Libraries']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Select a node from the breadcrumb path - [C263895]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, contentNodeSelector.selectLocation('Personal Files')];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName(destination)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName(searchFolder)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName(searchSubFolder1)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName(searchSubFolder2)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.openPath()];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.clickPathItem(destination)];
                    case 7:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.getCurrentFolderName()];
                    case 8:
                        _a.apply(void 0, [_c.sent()]).toEqual(destination);
                        _b = expect;
                        return [4 /*yield*/, contentNodeSelector.dataTable.isItemPresent(searchFolder)];
                    case 9:
                        _b.apply(void 0, [_c.sent()]).toBe(true, 'folder not displayed');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Users with different permissions', function () {
        it('Consumer user cannot select the folder as destination - [C263876]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWith(consumer)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(file)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, contentNodeSelector.waitForDialogToOpen()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, contentNodeSelector.selectLocation('File Libraries')];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName(site)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName('documentLibrary')];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, contentNodeSelector.dataTable.selectItem(searchFolder)];
                    case 8:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, contentNodeSelector.isCopyButtonEnabled()];
                    case 9:
                        _a.apply(void 0, [_b.sent()]).toBe(false, 'Copy should be disabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Contributor user can select the folder as destination - [C263877]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWith(contributor)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(file)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, contentNodeSelector.waitForDialogToOpen()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, contentNodeSelector.selectLocation('File Libraries')];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName(site)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName('documentLibrary')];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, contentNodeSelector.dataTable.selectItem(searchFolder)];
                    case 8:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, contentNodeSelector.isCopyButtonEnabled()];
                    case 9:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Copy should be disabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Collaborator user can select the folder as destination - [C263878]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWith(collaborator)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(file)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, contentNodeSelector.waitForDialogToOpen()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, contentNodeSelector.selectLocation('File Libraries')];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName(site)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, contentNodeSelector.dataTable.doubleClickOnRowByName('documentLibrary')];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, contentNodeSelector.dataTable.selectItem(searchFolder)];
                    case 8:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, contentNodeSelector.isCopyButtonEnabled()];
                    case 9:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'Copy should be disabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Admin user - Personal Files breadcrumb main node - [C263892]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWithAdmin()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dataTable.selectItem(adminFolder)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, toolbar.clickMoreActionsCopy()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, contentNodeSelector.waitForDialogToOpen()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, contentNodeSelector.selectLocation('Personal Files')];
                    case 5:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, contentNodeSelector.breadcrumb.getCurrentFolderName()];
                    case 6:
                        _a.apply(void 0, [_b.sent()]).toEqual('Company Home');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=destination-picker-dialog.test.js.map