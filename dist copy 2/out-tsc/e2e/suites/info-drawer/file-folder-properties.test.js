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
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { InfoDrawer } from './../../components/info-drawer/info-drawer';
import { Utils } from '../../utilities/utils';
import { FILES, DATE_TIME_FORMAT, DATE_FORMAT } from '../../configs';
import * as moment from 'moment';
describe('File / Folder properties', function () {
    var username = "user1-" + Utils.random();
    var parent = "parent-" + Utils.random();
    var parentId;
    var file1 = {
        name: "file1-" + Utils.random() + ".txt",
        title: 'file title',
        description: 'file description',
        author: 'file author'
    };
    var file1Id;
    var image1 = {
        name: FILES.jpgFile,
        title: 'image title',
        description: 'image description',
        author: 'image author'
    };
    var image1Id;
    var folder1 = {
        name: "folder1-" + Utils.random(),
        title: 'folder title',
        description: 'folder description',
        author: 'folder author'
    };
    var folder1Id;
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var infoDrawer = new InfoDrawer();
    var propertiesTab = infoDrawer.propertiesTab;
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                case 2:
                    parentId = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFile(file1.name, parentId, file1.title, file1.description, file1.author)];
                case 3:
                    file1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.nodes.createFolder(folder1.name, parentId, folder1.title, folder1.description, folder1.author)];
                case 4:
                    folder1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, apis.user.upload.uploadFile(image1.name, parentId)];
                case 5:
                    image1Id = (_a.sent()).entry.id;
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
                case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(parentId)];
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
                    return [4 /*yield*/, dataTable.doubleClickOnRowByName(parent)];
                case 2:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('View properties', function () {
        it('Default tabs - [C299162]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1.name)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, infoDrawer.getHeaderTitle()];
                    case 4:
                        _a.apply(void 0, [_e.sent()]).toEqual('Details');
                        _b = expect;
                        return [4 /*yield*/, infoDrawer.isPropertiesTabDisplayed()];
                    case 5:
                        _b.apply(void 0, [_e.sent()]).toBe(true, 'Properties tab is not displayed');
                        _c = expect;
                        return [4 /*yield*/, infoDrawer.isCommentsTabDisplayed()];
                    case 6:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'Comments tab is not displayed');
                        _d = expect;
                        return [4 /*yield*/, infoDrawer.getTabsCount()];
                    case 7:
                        _d.apply(void 0, [_e.sent()]).toBe(2, 'Incorrect number of tabs');
                        return [2 /*return*/];
                }
            });
        }); });
        it('File properties - [C269003]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var apiProps, expectedPropLabels, expectedPropValues, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.getNodeById(file1Id)];
                    case 1:
                        apiProps = _e.sent();
                        expectedPropLabels = [
                            'Name',
                            'Title',
                            'Creator',
                            'Created Date',
                            'Size',
                            'Modifier',
                            'Modified Date',
                            'Mimetype',
                            'Author',
                            'Description'
                        ];
                        expectedPropValues = [
                            file1.name,
                            file1.title,
                            apiProps.entry.createdByUser.displayName,
                            moment(apiProps.entry.createdAt).format(DATE_FORMAT),
                            apiProps.entry.content.sizeInBytes + " Bytes",
                            apiProps.entry.modifiedByUser.displayName,
                            moment(apiProps.entry.modifiedAt).format(DATE_FORMAT),
                            apiProps.entry.content.mimeTypeName,
                            file1.author,
                            file1.description
                        ];
                        return [4 /*yield*/, dataTable.selectItem(file1.name)];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 4:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, propertiesTab.getVisiblePropertiesLabels()];
                    case 5:
                        _a.apply(void 0, [_e.sent()]).toEqual(expectedPropLabels, 'Incorrect properties displayed');
                        _b = expect;
                        return [4 /*yield*/, propertiesTab.getVisiblePropertiesValues()];
                    case 6:
                        _b.apply(void 0, [_e.sent()]).toEqual(expectedPropValues, 'Incorrect properties values');
                        _c = expect;
                        return [4 /*yield*/, propertiesTab.isEditPropertiesButtonEnabled()];
                    case 7:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'Edit button not enabled');
                        _d = expect;
                        return [4 /*yield*/, propertiesTab.isMoreInfoButtonEnabled()];
                    case 8:
                        _d.apply(void 0, [_e.sent()]).toBe(true, 'More information button not enabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Folder properties - [C307106]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var apiProps, expectedPropLabels, expectedPropValues, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.getNodeById(folder1Id)];
                    case 1:
                        apiProps = _e.sent();
                        expectedPropLabels = [
                            'Name',
                            'Title',
                            'Creator',
                            'Created Date',
                            'Modifier',
                            'Modified Date',
                            'Author',
                            'Description'
                        ];
                        expectedPropValues = [
                            folder1.name,
                            folder1.title,
                            apiProps.entry.createdByUser.displayName,
                            moment(apiProps.entry.createdAt).format(DATE_FORMAT),
                            apiProps.entry.modifiedByUser.displayName,
                            moment(apiProps.entry.modifiedAt).format(DATE_FORMAT),
                            folder1.author,
                            folder1.description
                        ];
                        return [4 /*yield*/, dataTable.selectItem(folder1.name)];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 4:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, propertiesTab.getVisiblePropertiesLabels()];
                    case 5:
                        _a.apply(void 0, [_e.sent()]).toEqual(expectedPropLabels, 'Incorrect properties displayed');
                        _b = expect;
                        return [4 /*yield*/, propertiesTab.getVisiblePropertiesValues()];
                    case 6:
                        _b.apply(void 0, [_e.sent()]).toEqual(expectedPropValues, 'Incorrect properties values');
                        _c = expect;
                        return [4 /*yield*/, propertiesTab.isEditPropertiesButtonEnabled()];
                    case 7:
                        _c.apply(void 0, [_e.sent()]).toBe(true, 'Edit button not enabled');
                        _d = expect;
                        return [4 /*yield*/, propertiesTab.isMoreInfoButtonEnabled()];
                    case 8:
                        _d.apply(void 0, [_e.sent()]).toBe(true, 'More information button not enabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Less / More information buttons - [C269004]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return tslib_1.__generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4 /*yield*/, dataTable.selectItem(file1.name)];
                    case 1:
                        _j.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 2:
                        _j.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 3:
                        _j.sent();
                        _a = expect;
                        return [4 /*yield*/, propertiesTab.isMoreInfoButtonEnabled()];
                    case 4:
                        _a.apply(void 0, [_j.sent()]).toBe(true, 'More information button not enabled');
                        _b = expect;
                        return [4 /*yield*/, propertiesTab.isPropertiesListExpanded()];
                    case 5:
                        _b.apply(void 0, [_j.sent()]).toBe(true, 'Properties list not expanded');
                        return [4 /*yield*/, propertiesTab.clickMoreInformationButton()];
                    case 6:
                        _j.sent();
                        _c = expect;
                        return [4 /*yield*/, propertiesTab.isMoreInfoButtonDisplayed()];
                    case 7:
                        _c.apply(void 0, [_j.sent()]).toBe(false, 'More information button displayed');
                        _d = expect;
                        return [4 /*yield*/, propertiesTab.isLessInfoButtonEnabled()];
                    case 8:
                        _d.apply(void 0, [_j.sent()]).toBe(true, 'Less information button not enabled');
                        _e = expect;
                        return [4 /*yield*/, propertiesTab.isPropertiesListExpanded()];
                    case 9:
                        _e.apply(void 0, [_j.sent()]).toBe(false, 'Properties list expanded');
                        return [4 /*yield*/, propertiesTab.clickLessInformationButton()];
                    case 10:
                        _j.sent();
                        _f = expect;
                        return [4 /*yield*/, propertiesTab.isMoreInfoButtonDisplayed()];
                    case 11:
                        _f.apply(void 0, [_j.sent()]).toBe(true, 'More information button not displayed');
                        _g = expect;
                        return [4 /*yield*/, propertiesTab.isLessInfoButtonEnabled()];
                    case 12:
                        _g.apply(void 0, [_j.sent()]).toBe(false, 'Less information button enabled');
                        _h = expect;
                        return [4 /*yield*/, propertiesTab.isPropertiesListExpanded()];
                    case 13:
                        _h.apply(void 0, [_j.sent()]).toBe(true, 'Properties list not expanded');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Image properties - [C269007]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var apiProps, expectedPropLabels, expectedPropValues, _a, _b, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.getNodeById(image1Id)];
                    case 1:
                        apiProps = _f.sent();
                        expectedPropLabels = [
                            'Image Width',
                            'Image Height',
                            'Date and Time',
                            'Exposure Time',
                            'F Number',
                            'Flash Activated',
                            'Focal Length',
                            'ISO Speed',
                            'Orientation',
                            'Camera Manufacturer',
                            'Camera Model',
                            'Camera Software'
                        ];
                        expectedPropValues = [
                            apiProps.entry.properties['exif:pixelXDimension'].toString(),
                            apiProps.entry.properties['exif:pixelYDimension'].toString(),
                            moment(apiProps.entry.properties['exif:dateTimeOriginal']).format(DATE_TIME_FORMAT),
                            apiProps.entry.properties['exif:exposureTime'].toString(),
                            apiProps.entry.properties['exif:fNumber'].toString(),
                            apiProps.entry.properties['exif:flash'],
                            apiProps.entry.properties['exif:focalLength'].toString(),
                            apiProps.entry.properties['exif:isoSpeedRatings'],
                            (apiProps.entry.properties['exif:orientation']).toString(),
                            apiProps.entry.properties['exif:manufacturer'],
                            apiProps.entry.properties['exif:model'],
                            apiProps.entry.properties['exif:software']
                        ];
                        return [4 /*yield*/, dataTable.selectItem(image1.name)];
                    case 2:
                        _f.sent();
                        return [4 /*yield*/, page.toolbar.clickViewDetails()];
                    case 3:
                        _f.sent();
                        return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                    case 4:
                        _f.sent();
                        return [4 /*yield*/, propertiesTab.clickMoreInformationButton()];
                    case 5:
                        _f.sent();
                        return [4 /*yield*/, propertiesTab.clickImagePropertiesPanel()];
                    case 6:
                        _f.sent();
                        return [4 /*yield*/, propertiesTab.waitForImagePropertiesPanelToExpand()];
                    case 7:
                        _f.sent();
                        _a = expect;
                        return [4 /*yield*/, propertiesTab.isImagePropertiesPanelDisplayed()];
                    case 8:
                        _a.apply(void 0, [_f.sent()]).toBe(true, 'Image properties panel not displayed');
                        _b = expect;
                        return [4 /*yield*/, propertiesTab.getVisiblePropertiesLabels()];
                    case 9:
                        _b.apply(void 0, [_f.sent()]).toEqual(expectedPropLabels, 'Incorrect properties displayed');
                        _c = expect;
                        return [4 /*yield*/, propertiesTab.getVisiblePropertiesValues()];
                    case 10:
                        _c.apply(void 0, [_f.sent()]).toEqual(expectedPropValues, 'Incorrect properties values');
                        _d = expect;
                        return [4 /*yield*/, propertiesTab.isEditPropertiesButtonEnabled()];
                    case 11:
                        _d.apply(void 0, [_f.sent()]).toBe(true, 'Edit button not enabled');
                        _e = expect;
                        return [4 /*yield*/, propertiesTab.isLessInfoButtonEnabled()];
                    case 12:
                        _e.apply(void 0, [_f.sent()]).toBe(true, 'Less information button not enabled');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=file-folder-properties.test.js.map