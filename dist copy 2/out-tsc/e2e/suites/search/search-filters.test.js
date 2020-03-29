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
import { LoginPage, SearchResultsPage } from '../../pages/pages';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
import { FILES, SITE_VISIBILITY, SITE_ROLES } from '../../configs';
import * as moment from 'moment';
describe('Search filters', function () {
    var random = Utils.random();
    var user1 = "user1-" + random;
    var user2 = "user2-" + random;
    var parent = "parent-" + random;
    var parentId;
    var site = "site-" + Utils.random();
    var docLibId;
    var fileJpgUser1 = {
        name: "search-filters-file-1-" + random + ".jpg",
        source: FILES.jpgFile
    };
    var filePdfUser2 = {
        name: "search-filters-file-2-" + random + ".pdf",
        title: 'search filters title',
        description: 'search filters',
        source: FILES.pdfFile
    };
    var expectedFileTypes = ['Adobe PDF Document (1)', 'JPEG Image (1)'];
    var expectedCreators = [user1 + " " + user1 + " (1)", user2 + " " + user2 + " (1)"];
    var expectedModifiers = [user1 + " " + user1 + " (1)", user2 + " " + user2 + " (1)"];
    var expectedLocations = ['_REPOSITORY_ (1)', site + " (1)"];
    var apis = {
        admin: new RepoClient(),
        user1: new RepoClient(user1, user1),
        user2: new RepoClient(user2, user2)
    };
    var loginPage = new LoginPage();
    var page = new SearchResultsPage();
    var searchInput = page.header.searchInput;
    var dataTable = page.dataTable, filters = page.filters;
    var sizeFilter = filters.size;
    var fileTypeFilter = filters.fileType;
    var createdDateFilter = filters.createdDate;
    var creatorFilter = filters.creator;
    var locationFilter = filters.location;
    var modifierFilter = filters.modifier;
    var modifiedDateFilter = filters.modifiedDate;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: user1 })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.people.createUser({ username: user2 })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apis.user1.nodes.createFolder(parent)];
                case 3:
                    parentId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user1.sites.createSite(site, SITE_VISIBILITY.PUBLIC)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apis.user1.sites.addSiteMember(site, user2, SITE_ROLES.SITE_MANAGER.ROLE)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, apis.admin.sites.getDocLibId(site)];
                case 6:
                    docLibId = _a.sent();
                    return [4 /*yield*/, apis.user1.nodes.setGranularPermission(parentId, true, user2, 'Collaborator')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, apis.user1.upload.uploadFileWithRename(fileJpgUser1.source, docLibId, fileJpgUser1.name)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, apis.user2.upload.uploadFileWithRename(filePdfUser2.source, parentId, filePdfUser2.name, filePdfUser2.title, filePdfUser2.description)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, apis.user1.search.waitForNodes('search-filters', { expect: 2 })];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginWith(user1)];
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
                case 0: return [4 /*yield*/, Utils.pressEscape()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchInput.clickSearchButton()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchInput.searchFor('search filters')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, dataTable.waitForBody()];
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
                case 0: return [4 /*yield*/, Promise.all([
                        apis.user1.nodes.deleteNodeById(parentId),
                        apis.user1.sites.deleteSite(site)
                    ])];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Filters are displayed - [C279186]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g;
        return tslib_1.__generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, sizeFilter.isPanelDisplayed()];
                case 1:
                    _a.apply(void 0, [_h.sent()]).toBe(true, 'Size filter panel not displayed');
                    _b = expect;
                    return [4 /*yield*/, createdDateFilter.isPanelDisplayed()];
                case 2:
                    _b.apply(void 0, [_h.sent()]).toBe(true, 'Created date filter panel not displayed');
                    _c = expect;
                    return [4 /*yield*/, fileTypeFilter.isPanelDisplayed()];
                case 3:
                    _c.apply(void 0, [_h.sent()]).toBe(true, 'File type filter panel not displayed');
                    _d = expect;
                    return [4 /*yield*/, creatorFilter.isPanelDisplayed()];
                case 4:
                    _d.apply(void 0, [_h.sent()]).toBe(true, 'Creator filter panel not displayed');
                    _e = expect;
                    return [4 /*yield*/, modifierFilter.isPanelDisplayed()];
                case 5:
                    _e.apply(void 0, [_h.sent()]).toBe(true, 'Modifier filter panel not displayed');
                    _f = expect;
                    return [4 /*yield*/, locationFilter.isPanelDisplayed()];
                case 6:
                    _f.apply(void 0, [_h.sent()]).toBe(true, 'Location filter panel not displayed');
                    _g = expect;
                    return [4 /*yield*/, modifiedDateFilter.isPanelDisplayed()];
                case 7:
                    _g.apply(void 0, [_h.sent()]).toBe(true, 'Modified date filter panel not displayed');
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Filter by Size', function () {
        afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sizeFilter.resetPanel()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Expand / Collapse the Size filter panel - [C279197]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, expectedSizes, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, sizeFilter.isPanelExpanded()];
                    case 1:
                        _a.apply(void 0, [_f.sent()]).toBe(false, 'Size filter panel is expanded');
                        return [4 /*yield*/, sizeFilter.expandPanel()];
                    case 2:
                        _f.sent();
                        _b = expect;
                        return [4 /*yield*/, sizeFilter.isPanelExpanded()];
                    case 3:
                        _b.apply(void 0, [_f.sent()]).toBe(true, 'Size filter panel not expanded');
                        expectedSizes = ['Small', 'Medium', 'Large', 'Huge'];
                        _c = expect;
                        return [4 /*yield*/, sizeFilter.getFiltersValues()];
                    case 4:
                        _c.apply(void 0, [_f.sent()]).toEqual(expectedSizes, 'Incorrect Size filters facets');
                        _d = expect;
                        return [4 /*yield*/, sizeFilter.isClearButtonEnabled()];
                    case 5:
                        _d.apply(void 0, [_f.sent()]).toBe(true, 'Size filter Clear button not enabled');
                        return [4 /*yield*/, sizeFilter.collapsePanel()];
                    case 6:
                        _f.sent();
                        _e = expect;
                        return [4 /*yield*/, sizeFilter.isPanelExpanded()];
                    case 7:
                        _e.apply(void 0, [_f.sent()]).toBe(false, 'Size filter panel is expanded');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Filter by Small - [C279199]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, sizeFilter.expandPanel()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, sizeFilter.checkSizeSmall()];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toBe(true, fileJpgUser1.name + " not in the list");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe(true, filePdfUser2.name + " not in the list");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Filter by Huge - [C279202]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, sizeFilter.expandPanel()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, sizeFilter.checkSizeHuge()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isEmpty()];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(true, 'list is not empty');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Filter by multiple size categories - [C279203]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, sizeFilter.expandPanel()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, sizeFilter.checkSizeSmall()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, sizeFilter.checkSizeMedium()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, sizeFilter.checkSizeLarge()];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toBe(true, fileJpgUser1.name + " not in the list");
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toBe(true, filePdfUser2.name + " not in the list");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Clear the Size filter options - [C279198]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, sizeFilter.expandPanel()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, sizeFilter.checkSizeSmall()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, sizeFilter.checkSizeMedium()];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, sizeFilter.getFiltersCheckedValues()];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toEqual(['Small', 'Medium'], 'Incorrect checked Size filters');
                        return [4 /*yield*/, sizeFilter.clickClearButton()];
                    case 5:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, sizeFilter.getFiltersCheckedValues()];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toEqual([], 'Size filters not cleared');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Filter by Created date', function () {
        var yesterday = moment().subtract(1, 'day').format('DD-MMM-YY');
        var today = moment().format('DD-MMM-YY');
        var future = moment().add(1, 'month').format('DD-MMM-YY');
        afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createdDateFilter.resetPanel()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Expand / Collapse the Created date filter panel - [C279211]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, createdDateFilter.isPanelExpanded()];
                    case 1:
                        _a.apply(void 0, [_f.sent()]).toBe(false, 'Created date filter panel is expanded');
                        return [4 /*yield*/, createdDateFilter.expandPanel()];
                    case 2:
                        _f.sent();
                        _b = expect;
                        return [4 /*yield*/, createdDateFilter.isPanelExpanded()];
                    case 3:
                        _b.apply(void 0, [_f.sent()]).toBe(true, 'Created date filter panel not expanded');
                        _c = expect;
                        return [4 /*yield*/, createdDateFilter.isClearButtonEnabled()];
                    case 4:
                        _c.apply(void 0, [_f.sent()]).toBe(true, 'Created date CLEAR button not enabled');
                        _d = expect;
                        return [4 /*yield*/, createdDateFilter.isApplyButtonEnabled()];
                    case 5:
                        _d.apply(void 0, [_f.sent()]).toBe(false, 'Created date APPLY button not disabled');
                        return [4 /*yield*/, createdDateFilter.collapsePanel()];
                    case 6:
                        _f.sent();
                        _e = expect;
                        return [4 /*yield*/, createdDateFilter.isPanelExpanded()];
                    case 7:
                        _e.apply(void 0, [_f.sent()]).toBe(false, 'Created date filter panel is expanded');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Results are filtered by Created date - [C279217]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, createdDateFilter.expandPanel()];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, createdDateFilter.enterFromDate(yesterday)];
                    case 2:
                        _g.sent();
                        return [4 /*yield*/, createdDateFilter.enterToDate(yesterday)];
                    case 3:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, createdDateFilter.isApplyButtonEnabled()];
                    case 4:
                        _a.apply(void 0, [_g.sent()]).toBe(true, 'Created date filter Apply button not enabled');
                        return [4 /*yield*/, createdDateFilter.clickApplyButton()];
                    case 5:
                        _g.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 6:
                        _b.apply(void 0, [_g.sent()]).toBe(false, 'PDF file is displayed');
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 7:
                        _c.apply(void 0, [_g.sent()]).toBe(false, 'JPG file is displayed');
                        return [4 /*yield*/, createdDateFilter.enterFromDate(yesterday)];
                    case 8:
                        _g.sent();
                        return [4 /*yield*/, createdDateFilter.enterToDate(today)];
                    case 9:
                        _g.sent();
                        _d = expect;
                        return [4 /*yield*/, createdDateFilter.isApplyButtonEnabled()];
                    case 10:
                        _d.apply(void 0, [_g.sent()]).toBe(true, 'Created date filter Apply button not enabled');
                        return [4 /*yield*/, createdDateFilter.clickApplyButton()];
                    case 11:
                        _g.sent();
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 12:
                        _e.apply(void 0, [_g.sent()]).toBe(true, 'PDF file not displayed');
                        _f = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 13:
                        _f.apply(void 0, [_g.sent()]).toBe(true, 'JPG file not displayed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Clear the Created date filter options - [C279216]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, createdDateFilter.expandPanel()];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, createdDateFilter.enterFromDate(yesterday)];
                    case 2:
                        _g.sent();
                        return [4 /*yield*/, createdDateFilter.enterToDate(yesterday)];
                    case 3:
                        _g.sent();
                        return [4 /*yield*/, createdDateFilter.clickApplyButton()];
                    case 4:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, createdDateFilter.getFromValue()];
                    case 5:
                        _a.apply(void 0, [_g.sent()]).toContain(yesterday);
                        _b = expect;
                        return [4 /*yield*/, createdDateFilter.getToValue()];
                    case 6:
                        _b.apply(void 0, [_g.sent()]).toContain(yesterday);
                        return [4 /*yield*/, createdDateFilter.clickClearButton()];
                    case 7:
                        _g.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 8:
                        _c.apply(void 0, [_g.sent()]).toBe(true, 'PDF file is displayed');
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 9:
                        _d.apply(void 0, [_g.sent()]).toBe(true, 'JPG file is displayed');
                        _e = expect;
                        return [4 /*yield*/, createdDateFilter.getFromValue()];
                    case 10:
                        _e.apply(void 0, [_g.sent()]).toEqual('', 'From field not empty');
                        _f = expect;
                        return [4 /*yield*/, createdDateFilter.getToValue()];
                    case 11:
                        _f.apply(void 0, [_g.sent()]).toEqual('', 'To field not empty');
                        return [2 /*return*/];
                }
            });
        }); });
        it('From and To values are required - [C279212]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, createdDateFilter.expandPanel()];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, createdDateFilter.enterFromDate('')];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, createdDateFilter.enterToDate('')];
                    case 3:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, createdDateFilter.isFromErrorDisplayed()];
                    case 4:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'Error missing for From field');
                        _b = expect;
                        return [4 /*yield*/, createdDateFilter.isToErrorDisplayed()];
                    case 5:
                        _b.apply(void 0, [_e.sent()]).toBe(true, 'Error missing for To field');
                        _c = expect;
                        return [4 /*yield*/, createdDateFilter.getFromError()];
                    case 6:
                        _c.apply(void 0, [_e.sent()]).toEqual('Required value');
                        _d = expect;
                        return [4 /*yield*/, createdDateFilter.getToError()];
                    case 7:
                        _d.apply(void 0, [_e.sent()]).toEqual('Required value');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Error message is displayed when entering an incorrect date format - [C279213]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, createdDateFilter.expandPanel()];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, createdDateFilter.enterFromDate('03.31.2019')];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, createdDateFilter.enterToDate('invalid text')];
                    case 3:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, createdDateFilter.isFromErrorDisplayed()];
                    case 4:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'Error missing for From field');
                        _b = expect;
                        return [4 /*yield*/, createdDateFilter.isToErrorDisplayed()];
                    case 5:
                        _b.apply(void 0, [_e.sent()]).toBe(true, 'Error missing for To field');
                        _c = expect;
                        return [4 /*yield*/, createdDateFilter.getFromError()];
                    case 6:
                        _c.apply(void 0, [_e.sent()]).toEqual("Invalid date. The date must be in the format 'DD-MMM-YY'");
                        _d = expect;
                        return [4 /*yield*/, createdDateFilter.getToError()];
                    case 7:
                        _d.apply(void 0, [_e.sent()]).toEqual("Invalid date. The date must be in the format 'DD-MMM-YY'");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Error message is displayed when entering a date from the future - [C279214]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, createdDateFilter.expandPanel()];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, createdDateFilter.enterFromDate(future)];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, createdDateFilter.enterToDate(future)];
                    case 3:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, createdDateFilter.isFromErrorDisplayed()];
                    case 4:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'Error missing for From field');
                        _b = expect;
                        return [4 /*yield*/, createdDateFilter.isToErrorDisplayed()];
                    case 5:
                        _b.apply(void 0, [_e.sent()]).toBe(true, 'Error missing for To field');
                        _c = expect;
                        return [4 /*yield*/, createdDateFilter.getFromError()];
                    case 6:
                        _c.apply(void 0, [_e.sent()]).toEqual('The date is beyond the maximum date.');
                        _d = expect;
                        return [4 /*yield*/, createdDateFilter.getToError()];
                    case 7:
                        _d.apply(void 0, [_e.sent()]).toEqual('The date is beyond the maximum date.');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Error message is displayed when From value is bigger than To value - [C279215]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, createdDateFilter.expandPanel()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, createdDateFilter.enterFromDate(today)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, createdDateFilter.enterToDate(yesterday)];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, createdDateFilter.isToErrorDisplayed()];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toBe(true, 'Error missing for To field');
                        _b = expect;
                        return [4 /*yield*/, createdDateFilter.getToError()];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toEqual('No days selected.');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Filter by File type', function () {
        afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, filters.clickResetAllButton()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Expand / Collapse the File type filter panel - [C279191]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, fileTypeFilter.isPanelExpanded()];
                    case 1:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'File type filter panel not expanded');
                        _b = expect;
                        return [4 /*yield*/, fileTypeFilter.getFiltersValues()];
                    case 2:
                        _b.apply(void 0, [_e.sent()]).toEqual(expectedFileTypes, 'Incorrect File type filters facets');
                        _c = expect;
                        return [4 /*yield*/, fileTypeFilter.isFilterCategoryInputDisplayed()];
                    case 3:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'File type filter categories not displayed');
                        return [4 /*yield*/, fileTypeFilter.collapsePanel()];
                    case 4:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, fileTypeFilter.isPanelExpanded()];
                    case 5:
                        _d.apply(void 0, [_e.sent()]).toBe(false, 'File type filter panel is expanded');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Results are filtered by File type - [C279192]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g;
            return tslib_1.__generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, fileTypeFilter.expandPanel()];
                    case 1:
                        _h.sent();
                        return [4 /*yield*/, fileTypeFilter.checkCategory('Adobe PDF Document')];
                    case 2:
                        _h.sent();
                        _a = expect;
                        return [4 /*yield*/, fileTypeFilter.isClearButtonEnabled()];
                    case 3:
                        _a.apply(void 0, [_h.sent()]).toBe(true, 'File type filter Clear button not enabled');
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 4:
                        _b.apply(void 0, [_h.sent()]).toBe(true, 'PDF file not displayed');
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 5:
                        _c.apply(void 0, [_h.sent()]).toBe(false, 'JPG file is displayed');
                        _d = expect;
                        return [4 /*yield*/, page.getResultsChipsValues()];
                    case 6:
                        _d.apply(void 0, [_h.sent()]).toEqual(['Adobe PDF Document']);
                        return [4 /*yield*/, fileTypeFilter.checkCategory('JPEG Image')];
                    case 7:
                        _h.sent();
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 8:
                        _e.apply(void 0, [_h.sent()]).toBe(true, 'PDF file not displayed');
                        _f = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 9:
                        _f.apply(void 0, [_h.sent()]).toBe(true, 'JPG file not displayed');
                        _g = expect;
                        return [4 /*yield*/, page.getResultsChipsValues()];
                    case 10:
                        _g.apply(void 0, [_h.sent()]).toEqual(['Adobe PDF Document', 'JPEG Image']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Clear the File type filter options - [C279193]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, fileTypeFilter.expandPanel()];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, fileTypeFilter.checkCategory('Adobe PDF Document')];
                    case 2:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, fileTypeFilter.getFiltersCheckedValues()];
                    case 3:
                        _a.apply(void 0, [_g.sent()]).toEqual(['Adobe PDF Document (1)']);
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 4:
                        _b.apply(void 0, [_g.sent()]).toBe(true, 'PDF file not displayed');
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 5:
                        _c.apply(void 0, [_g.sent()]).toBe(false, 'JPG file is displayed');
                        return [4 /*yield*/, fileTypeFilter.clickClearButton()];
                    case 6:
                        _g.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 7:
                        _d.apply(void 0, [_g.sent()]).toBe(true, 'PDF file not displayed');
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 8:
                        _e.apply(void 0, [_g.sent()]).toBe(true, 'JPG file not displayed');
                        _f = expect;
                        return [4 /*yield*/, fileTypeFilter.getFiltersCheckedValues()];
                    case 9:
                        _f.apply(void 0, [_g.sent()]).toEqual([], 'File types selection not cleared');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Search for a specific file type - [C279195]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, fileTypeFilter.expandPanel()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, fileTypeFilter.getFiltersValues()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toEqual(expectedFileTypes, 'Incorrect File type filters facets');
                        return [4 /*yield*/, fileTypeFilter.filterCategoriesBy('PDF')];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, fileTypeFilter.getFiltersValues()];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toEqual(['Adobe PDF Document (1)'], 'Incorrect File type filters facets');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Filter by Creator', function () {
        afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, filters.clickResetAllButton()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Expand / Collapse the Creator filter panel - [C279205]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, creatorFilter.isPanelExpanded()];
                    case 1:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'Creator filter panel not expanded');
                        _b = expect;
                        return [4 /*yield*/, creatorFilter.getFiltersValues()];
                    case 2:
                        _b.apply(void 0, [_e.sent()]).toEqual(expectedCreators, 'Incorrect Creator filters facets');
                        _c = expect;
                        return [4 /*yield*/, creatorFilter.isFilterCategoryInputDisplayed()];
                    case 3:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'Creator filter categories not displayed');
                        return [4 /*yield*/, creatorFilter.collapsePanel()];
                    case 4:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, creatorFilter.isPanelExpanded()];
                    case 5:
                        _d.apply(void 0, [_e.sent()]).toBe(false, 'Creator filter panel is expanded');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Results are filtered by Creator - [C279206]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g;
            return tslib_1.__generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, creatorFilter.expandPanel()];
                    case 1:
                        _h.sent();
                        return [4 /*yield*/, creatorFilter.checkCategory(user1)];
                    case 2:
                        _h.sent();
                        _a = expect;
                        return [4 /*yield*/, creatorFilter.isClearButtonEnabled()];
                    case 3:
                        _a.apply(void 0, [_h.sent()]).toBe(true, 'Creator filter Clear button not enabled');
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 4:
                        _b.apply(void 0, [_h.sent()]).toBe(false, 'PDF file is displayed');
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 5:
                        _c.apply(void 0, [_h.sent()]).toBe(true, 'JPG file not displayed');
                        _d = expect;
                        return [4 /*yield*/, page.getResultsChipsValues()];
                    case 6:
                        _d.apply(void 0, [_h.sent()]).toEqual([user1 + " " + user1]);
                        return [4 /*yield*/, creatorFilter.checkCategory(user2)];
                    case 7:
                        _h.sent();
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 8:
                        _e.apply(void 0, [_h.sent()]).toBe(true, 'PDF file not displayed');
                        _f = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 9:
                        _f.apply(void 0, [_h.sent()]).toBe(true, 'JPG file not displayed');
                        _g = expect;
                        return [4 /*yield*/, page.getResultsChipsValues()];
                    case 10:
                        _g.apply(void 0, [_h.sent()]).toEqual([user1 + " " + user1, user2 + " " + user2]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Clear the Creator filter options - [C279207]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, creatorFilter.expandPanel()];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, creatorFilter.checkCategory(user1)];
                    case 2:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, creatorFilter.getFiltersCheckedValues()];
                    case 3:
                        _a.apply(void 0, [_g.sent()]).toEqual([user1 + " " + user1 + " (1)"]);
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 4:
                        _b.apply(void 0, [_g.sent()]).toBe(false, 'PDF file is displayed');
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 5:
                        _c.apply(void 0, [_g.sent()]).toBe(true, 'JPG file not displayed');
                        return [4 /*yield*/, creatorFilter.clickClearButton()];
                    case 6:
                        _g.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 7:
                        _d.apply(void 0, [_g.sent()]).toBe(true, 'PDF file not displayed');
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 8:
                        _e.apply(void 0, [_g.sent()]).toBe(true, 'JPG file not displayed');
                        _f = expect;
                        return [4 /*yield*/, creatorFilter.getFiltersCheckedValues()];
                    case 9:
                        _f.apply(void 0, [_g.sent()]).toEqual([], 'Creator selection not cleared');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Search for a specific creator - [C279208]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, creatorFilter.expandPanel()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, creatorFilter.getFiltersValues()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toEqual(expectedCreators, 'Incorrect Creator filters facets');
                        return [4 /*yield*/, creatorFilter.filterCategoriesBy(user1)];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, creatorFilter.getFiltersValues()];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toEqual([user1 + " " + user1 + " (1)"], 'Incorrect Creator filters facets');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Filter by Modifier', function () {
        afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, filters.clickResetAllButton()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Expand / Collapse the Modifier filter panel - [C279224]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, modifierFilter.isPanelExpanded()];
                    case 1:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'Modifier filter panel not expanded');
                        _b = expect;
                        return [4 /*yield*/, modifierFilter.getFiltersValues()];
                    case 2:
                        _b.apply(void 0, [_e.sent()]).toEqual(expectedModifiers, 'Incorrect Modifier filters facets');
                        _c = expect;
                        return [4 /*yield*/, modifierFilter.isFilterCategoryInputDisplayed()];
                    case 3:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'Modifier filter categories not displayed');
                        return [4 /*yield*/, modifierFilter.collapsePanel()];
                    case 4:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, modifierFilter.isPanelExpanded()];
                    case 5:
                        _d.apply(void 0, [_e.sent()]).toBe(false, 'Modifier filter panel is expanded');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Results are filtered by Modifier - [C279225]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g;
            return tslib_1.__generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, modifierFilter.expandPanel()];
                    case 1:
                        _h.sent();
                        return [4 /*yield*/, modifierFilter.checkCategory(user1)];
                    case 2:
                        _h.sent();
                        _a = expect;
                        return [4 /*yield*/, modifierFilter.isClearButtonEnabled()];
                    case 3:
                        _a.apply(void 0, [_h.sent()]).toBe(true, 'Modifier filter Clear button not enabled');
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 4:
                        _b.apply(void 0, [_h.sent()]).toBe(false, 'PDF file is displayed');
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 5:
                        _c.apply(void 0, [_h.sent()]).toBe(true, 'JPG file not displayed');
                        _d = expect;
                        return [4 /*yield*/, page.getResultsChipsValues()];
                    case 6:
                        _d.apply(void 0, [_h.sent()]).toEqual([user1 + " " + user1]);
                        return [4 /*yield*/, modifierFilter.checkCategory(user2)];
                    case 7:
                        _h.sent();
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 8:
                        _e.apply(void 0, [_h.sent()]).toBe(true, 'PDF file not displayed');
                        _f = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 9:
                        _f.apply(void 0, [_h.sent()]).toBe(true, 'JPG file not displayed');
                        _g = expect;
                        return [4 /*yield*/, page.getResultsChipsValues()];
                    case 10:
                        _g.apply(void 0, [_h.sent()]).toEqual([user1 + " " + user1, user2 + " " + user2]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Clear the Modifier filter options - [C279226]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, modifierFilter.expandPanel()];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, modifierFilter.checkCategory(user1)];
                    case 2:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, modifierFilter.getFiltersCheckedValues()];
                    case 3:
                        _a.apply(void 0, [_g.sent()]).toEqual([user1 + " " + user1 + " (1)"]);
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 4:
                        _b.apply(void 0, [_g.sent()]).toBe(false, 'PDF file is displayed');
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 5:
                        _c.apply(void 0, [_g.sent()]).toBe(true, 'JPG file not displayed');
                        return [4 /*yield*/, modifierFilter.clickClearButton()];
                    case 6:
                        _g.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 7:
                        _d.apply(void 0, [_g.sent()]).toBe(true, 'PDF file not displayed');
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 8:
                        _e.apply(void 0, [_g.sent()]).toBe(true, 'JPG file not displayed');
                        _f = expect;
                        return [4 /*yield*/, modifierFilter.getFiltersCheckedValues()];
                    case 9:
                        _f.apply(void 0, [_g.sent()]).toEqual([], 'Modifier selection not cleared');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Search for a specific modifier - [C279227]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, modifierFilter.expandPanel()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, modifierFilter.getFiltersValues()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toEqual(expectedModifiers, 'Incorrect Modifier filters facets');
                        return [4 /*yield*/, modifierFilter.filterCategoriesBy(user1)];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, modifierFilter.getFiltersValues()];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toEqual([user1 + " " + user1 + " (1)"], 'Incorrect Modifier filters facets');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Filter by Location', function () {
        afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, filters.clickResetAllButton()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Expand / Collapse the Location filter panel - [C279230]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, locationFilter.isPanelExpanded()];
                    case 1:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'Location filter panel not expanded');
                        _b = expect;
                        return [4 /*yield*/, locationFilter.getFiltersValues()];
                    case 2:
                        _b.apply(void 0, [_e.sent()]).toEqual(expectedLocations, 'Incorrect Location filters facets');
                        _c = expect;
                        return [4 /*yield*/, locationFilter.isFilterCategoryInputDisplayed()];
                    case 3:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'Location filter categories not displayed');
                        return [4 /*yield*/, locationFilter.collapsePanel()];
                    case 4:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, locationFilter.isPanelExpanded()];
                    case 5:
                        _d.apply(void 0, [_e.sent()]).toBe(false, 'Location filter panel is expanded');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Results are filtered by Location - [C279231]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g;
            return tslib_1.__generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, locationFilter.expandPanel()];
                    case 1:
                        _h.sent();
                        return [4 /*yield*/, locationFilter.checkCategory(site)];
                    case 2:
                        _h.sent();
                        _a = expect;
                        return [4 /*yield*/, locationFilter.isClearButtonEnabled()];
                    case 3:
                        _a.apply(void 0, [_h.sent()]).toBe(true, 'Location filter Clear button not enabled');
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 4:
                        _b.apply(void 0, [_h.sent()]).toBe(false, 'PDF file is displayed');
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 5:
                        _c.apply(void 0, [_h.sent()]).toBe(true, 'JPG file not displayed');
                        _d = expect;
                        return [4 /*yield*/, page.getResultsChipsValues()];
                    case 6:
                        _d.apply(void 0, [_h.sent()]).toEqual([site]);
                        return [4 /*yield*/, locationFilter.checkCategory('_REPOSITORY_')];
                    case 7:
                        _h.sent();
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 8:
                        _e.apply(void 0, [_h.sent()]).toBe(true, 'PDF file not displayed');
                        _f = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 9:
                        _f.apply(void 0, [_h.sent()]).toBe(true, 'JPG file not displayed');
                        _g = expect;
                        return [4 /*yield*/, page.getResultsChipsValues()];
                    case 10:
                        _g.apply(void 0, [_h.sent()]).toEqual([site, '_REPOSITORY_']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Clear the Location filter options - [C279232]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, locationFilter.expandPanel()];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, locationFilter.checkCategory(site)];
                    case 2:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, locationFilter.getFiltersCheckedValues()];
                    case 3:
                        _a.apply(void 0, [_g.sent()]).toEqual([site + " (1)"]);
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 4:
                        _b.apply(void 0, [_g.sent()]).toBe(false, 'PDF file is displayed');
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 5:
                        _c.apply(void 0, [_g.sent()]).toBe(true, 'JPG file not displayed');
                        return [4 /*yield*/, locationFilter.clickClearButton()];
                    case 6:
                        _g.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 7:
                        _d.apply(void 0, [_g.sent()]).toBe(true, 'PDF file not displayed');
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 8:
                        _e.apply(void 0, [_g.sent()]).toBe(true, 'JPG file not displayed');
                        _f = expect;
                        return [4 /*yield*/, locationFilter.getFiltersCheckedValues()];
                    case 9:
                        _f.apply(void 0, [_g.sent()]).toEqual([], 'Location selection not cleared');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Search for a specific location - [C279233]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, locationFilter.expandPanel()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, locationFilter.getFiltersValues()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toEqual(expectedLocations, 'Incorrect Location filters facets');
                        return [4 /*yield*/, locationFilter.filterCategoriesBy(site)];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, locationFilter.getFiltersValues()];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toEqual([site + " (1)"], 'Incorrect Location filters facets');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Filter by Modified date', function () {
        var expectedDateFilters = ['Today (2)', 'This week (2)', 'This month (2)', 'In the last 6 months (2)', 'This year (2)'];
        afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, filters.clickResetAllButton()];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Expand / Collapse the Modified date filter panel - [C279219]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, modifiedDateFilter.isPanelExpanded()];
                    case 1:
                        _a.apply(void 0, [_e.sent()]).toBe(true, 'Modified Date filter panel not expanded');
                        _b = expect;
                        return [4 /*yield*/, modifiedDateFilter.getFiltersValues()];
                    case 2:
                        _b.apply(void 0, [_e.sent()]).toEqual(expectedDateFilters, 'Incorrect Modified Date filters facets');
                        _c = expect;
                        return [4 /*yield*/, modifiedDateFilter.isFilterCategoryInputDisplayed()];
                    case 3:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'Modified Date filter categories not displayed');
                        return [4 /*yield*/, modifiedDateFilter.collapsePanel()];
                    case 4:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, modifiedDateFilter.isPanelExpanded()];
                    case 5:
                        _d.apply(void 0, [_e.sent()]).toBe(false, 'Modified Date filter panel is expanded');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Results are filtered by Modified date - [C279221]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g;
            return tslib_1.__generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, modifiedDateFilter.expandPanel()];
                    case 1:
                        _h.sent();
                        return [4 /*yield*/, modifiedDateFilter.checkCategory('Today')];
                    case 2:
                        _h.sent();
                        _a = expect;
                        return [4 /*yield*/, modifiedDateFilter.isClearButtonEnabled()];
                    case 3:
                        _a.apply(void 0, [_h.sent()]).toBe(true, 'Modified date filter Clear button not enabled');
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 4:
                        _b.apply(void 0, [_h.sent()]).toBe(true, 'PDF file not displayed');
                        _c = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 5:
                        _c.apply(void 0, [_h.sent()]).toBe(true, 'JPG file not displayed');
                        _d = expect;
                        return [4 /*yield*/, page.getResultsChipsValues()];
                    case 6:
                        _d.apply(void 0, [_h.sent()]).toEqual(['Today']);
                        return [4 /*yield*/, modifiedDateFilter.checkCategory('This week')];
                    case 7:
                        _h.sent();
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 8:
                        _e.apply(void 0, [_h.sent()]).toBe(true, 'PDF file not displayed');
                        _f = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 9:
                        _f.apply(void 0, [_h.sent()]).toBe(true, 'JPG file not displayed');
                        _g = expect;
                        return [4 /*yield*/, page.getResultsChipsValues()];
                    case 10:
                        _g.apply(void 0, [_h.sent()]).toEqual(['Today', 'This week']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Clear the Modified date filter options - [C279220]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, modifiedDateFilter.expandPanel()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, modifiedDateFilter.checkCategory('Today')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, modifiedDateFilter.checkCategory('This week')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, modifiedDateFilter.checkCategory('This month')];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, modifiedDateFilter.checkCategory('In the last 6 months')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, modifiedDateFilter.checkCategory('This year')];
                    case 6:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, modifiedDateFilter.getFiltersCheckedValues()];
                    case 7:
                        _a.apply(void 0, [_c.sent()]).toEqual(expectedDateFilters, 'Incorrect checked Modified date filters');
                        return [4 /*yield*/, modifiedDateFilter.clickClearButton()];
                    case 8:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, modifiedDateFilter.getFiltersCheckedValues()];
                    case 9:
                        _b.apply(void 0, [_c.sent()]).toEqual([], 'Modified date selection not cleared');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Search for a specific modified date option - [C325006]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, modifiedDateFilter.expandPanel()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, modifiedDateFilter.getFiltersValues()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toEqual(expectedDateFilters, 'Incorrect Modified date filters facets');
                        return [4 /*yield*/, modifiedDateFilter.filterCategoriesBy('This')];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, modifiedDateFilter.getFiltersValues()];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toEqual(['This week (2)', 'This month (2)', 'This year (2)'], 'Incorrect Modified date filters facets');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Multiple filters', function () {
        afterEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, filters.clickResetAllButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, sizeFilter.resetPanel()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, createdDateFilter.resetPanel()];
                    case 3:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Multiple filters can be applied - [C280051]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, sizeFilter.expandPanel()];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, sizeFilter.checkSizeSmall()];
                    case 2:
                        _g.sent();
                        return [4 /*yield*/, fileTypeFilter.expandPanel()];
                    case 3:
                        _g.sent();
                        return [4 /*yield*/, fileTypeFilter.checkCategory('JPEG Image')];
                    case 4:
                        _g.sent();
                        return [4 /*yield*/, creatorFilter.checkCategory(user1)];
                    case 5:
                        _g.sent();
                        return [4 /*yield*/, locationFilter.checkCategory(site)];
                    case 6:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 7:
                        _a.apply(void 0, [_g.sent()]).toBe(false, 'PDF file is displayed');
                        _b = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 8:
                        _b.apply(void 0, [_g.sent()]).toBe(true, 'JPG file not displayed');
                        _c = expect;
                        return [4 /*yield*/, page.getResultsChipsValues()];
                    case 9:
                        _c.apply(void 0, [_g.sent()]).toEqual(['JPEG Image', user1 + " " + user1, site]);
                        return [4 /*yield*/, page.removeChip('JPEG Image')];
                    case 10:
                        _g.sent();
                        return [4 /*yield*/, page.removeChip(user1 + " " + user1)];
                    case 11:
                        _g.sent();
                        return [4 /*yield*/, page.removeChip(site)];
                    case 12:
                        _g.sent();
                        _d = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(filePdfUser2.name)];
                    case 13:
                        _d.apply(void 0, [_g.sent()]).toBe(true, 'PDF file not displayed');
                        _e = expect;
                        return [4 /*yield*/, dataTable.isItemPresent(fileJpgUser1.name)];
                    case 14:
                        _e.apply(void 0, [_g.sent()]).toBe(true, 'JPG file not displayed');
                        _f = expect;
                        return [4 /*yield*/, page.getResultsChipsValues()];
                    case 15:
                        _f.apply(void 0, [_g.sent()]).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Total results is updated correctly - [C280052]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, fileTypeFilter.expandPanel()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, fileTypeFilter.checkCategory('JPEG Image')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, creatorFilter.checkCategory(user1)];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, page.getResultsFoundText()];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toEqual('1 result found');
                        return [4 /*yield*/, page.removeChip('JPEG Image')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, page.removeChip(user1 + " " + user1)];
                    case 6:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, page.getResultsFoundText()];
                    case 7:
                        _b.apply(void 0, [_c.sent()]).toEqual('2 results found');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Pagination is correct when search results are filtered - [C279188]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, fileTypeFilter.expandPanel()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, fileTypeFilter.checkCategory('JPEG Image')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, creatorFilter.checkCategory(user1)];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, page.pagination.getRange()];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toEqual('Showing 1-1 of 1');
                        return [4 /*yield*/, page.removeChip('JPEG Image')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, page.removeChip(user1 + " " + user1)];
                    case 6:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, page.pagination.getRange()];
                    case 7:
                        _b.apply(void 0, [_c.sent()]).toEqual('Showing 1-2 of 2');
                        return [2 /*return*/];
                }
            });
        }); });
        it('The filter facets display is updated when making a new query - [C308042]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return tslib_1.__generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, fileTypeFilter.getFiltersValues()];
                    case 1:
                        _a.apply(void 0, [_j.sent()]).toEqual(expectedFileTypes);
                        _b = expect;
                        return [4 /*yield*/, creatorFilter.getFiltersValues()];
                    case 2:
                        _b.apply(void 0, [_j.sent()]).toEqual(expectedCreators);
                        _c = expect;
                        return [4 /*yield*/, modifierFilter.getFiltersValues()];
                    case 3:
                        _c.apply(void 0, [_j.sent()]).toEqual(expectedModifiers);
                        _d = expect;
                        return [4 /*yield*/, locationFilter.getFiltersValues()];
                    case 4:
                        _d.apply(void 0, [_j.sent()]).toEqual(expectedLocations);
                        return [4 /*yield*/, searchInput.clickSearchButton()];
                    case 5:
                        _j.sent();
                        return [4 /*yield*/, searchInput.searchFor(fileJpgUser1.name)];
                    case 6:
                        _j.sent();
                        return [4 /*yield*/, dataTable.waitForBody()];
                    case 7:
                        _j.sent();
                        _e = expect;
                        return [4 /*yield*/, fileTypeFilter.getFiltersValues()];
                    case 8:
                        _e.apply(void 0, [_j.sent()]).toEqual(['JPEG Image (1)']);
                        _f = expect;
                        return [4 /*yield*/, creatorFilter.getFiltersValues()];
                    case 9:
                        _f.apply(void 0, [_j.sent()]).toEqual([user1 + " " + user1 + " (1)"]);
                        _g = expect;
                        return [4 /*yield*/, modifierFilter.getFiltersValues()];
                    case 10:
                        _g.apply(void 0, [_j.sent()]).toEqual([user1 + " " + user1 + " (1)"]);
                        _h = expect;
                        return [4 /*yield*/, locationFilter.getFiltersValues()];
                    case 11:
                        _h.apply(void 0, [_j.sent()]).toEqual([site + " (1)"]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=search-filters.test.js.map