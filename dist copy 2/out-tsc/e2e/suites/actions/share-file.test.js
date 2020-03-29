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
import { SITE_VISIBILITY } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { ShareDialog } from '../../components/dialog/share-dialog';
import { Viewer } from '../../components/viewer/viewer';
import { Utils } from '../../utilities/utils';
describe('Share a file', function () {
    var username = "user-" + Utils.random();
    var parent = "parent-" + Utils.random();
    var parentId;
    var file1 = "file1-" + Utils.random() + ".txt";
    var file1Id;
    var file2 = "file2-" + Utils.random() + ".txt";
    var file2Id;
    var file3 = "file3-" + Utils.random() + ".txt";
    var file3Id;
    var file4 = "file4-" + Utils.random() + ".txt";
    var file4Id;
    var file5 = "file5-" + Utils.random() + ".txt";
    var file5Id;
    var file6 = "file6-" + Utils.random() + ".txt";
    var file6Id;
    var file7 = "file7-" + Utils.random() + ".txt";
    var file7Id;
    var file8 = "file8-" + Utils.random() + ".txt";
    var file8Id;
    var file9 = "file9-" + Utils.random() + ".txt";
    var file9Id;
    var viewer = new Viewer();
    var page = new BrowsingPage();
    var dataTable = page.dataTable, toolbar = page.toolbar;
    var shareLinkPreUrl = browser.baseUrl + "/#/preview/s/";
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFolder(parent)];
                case 2:
                    parentId = (_a.sent()).entry.id;
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
    describe('when logged out', function () {
        var file6SharedLink;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var sharedId;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apis.user.nodes.createFile(file6, parentId)];
                    case 1:
                        file6Id = (_a.sent()).entry.id;
                        return [4 /*yield*/, apis.user.shared.shareFileById(file6Id)];
                    case 2:
                        sharedId = (_a.sent()).entry.id;
                        file6SharedLink = "" + shareLinkPreUrl + sharedId;
                        return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 1 })];
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
                    case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(file6Id)];
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
        it('A non-logged user can download the shared file from the viewer - [C286326]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, browser.get(file6SharedLink)];
                    case 1:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, viewer.isViewerOpened()];
                    case 2:
                        _a.apply(void 0, [_d.sent()]).toBe(true, 'viewer is not open');
                        _b = expect;
                        return [4 /*yield*/, viewer.getFileTitle()];
                    case 3:
                        _b.apply(void 0, [_d.sent()]).toEqual(file6);
                        return [4 /*yield*/, toolbar.clickDownload()];
                    case 4:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, Utils.fileExistsOnOS(file6)];
                    case 5:
                        _c.apply(void 0, [_d.sent()]).toBe(true, 'File not found in download location');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('when logged in', function () {
        var expiryDate = '2020-12-25T18:30:00.000+0000';
        var loginPage = new LoginPage();
        var shareDialog = new ShareDialog();
        var contextMenu = dataTable.menu;
        var searchInput = page.header.searchInput;
        beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginWith(username)];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('from Personal Files', function () {
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
                            return [4 /*yield*/, apis.user.nodes.createFile(file5, parentId)];
                        case 5:
                            file5Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file6, parentId)];
                        case 6:
                            file6Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file7, parentId)];
                        case 7:
                            file7Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file8, parentId)];
                        case 8:
                            file8Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file9, parentId)];
                        case 9:
                            file9Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.shared.shareFileById(file6Id, expiryDate)];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.shareFileById(file7Id, expiryDate)];
                        case 11:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 2 })];
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
                        case 0: return [4 /*yield*/, page.clickPersonalFilesAndWait()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, dataTable.doubleClickOnRowByName(parent)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, dataTable.waitForHeader()];
                        case 3:
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
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file5Id)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file6Id)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file7Id)];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file8Id)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file9Id)];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 0 })];
                        case 10:
                            _a.sent();
                            done();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Share dialog default values - [C286327]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return tslib_1.__generator(this, function (_k) {
                    switch (_k.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                        case 1:
                            _k.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _k.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _k.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.getTitle()];
                        case 4:
                            _a.apply(void 0, [_k.sent()]).toEqual("Share " + file1);
                            _b = expect;
                            return [4 /*yield*/, shareDialog.getInfoText()];
                        case 5:
                            _b.apply(void 0, [_k.sent()]).toEqual('Click the link below to copy it to the clipboard.');
                            _c = expect;
                            return [4 /*yield*/, shareDialog.getLabels().get(0).getText()];
                        case 6:
                            _c.apply(void 0, [_k.sent()]).toEqual('Link to share');
                            _d = expect;
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 7:
                            _d.apply(void 0, [_k.sent()]).toContain(shareLinkPreUrl);
                            _e = expect;
                            return [4 /*yield*/, shareDialog.isUrlReadOnly()];
                        case 8:
                            _e.apply(void 0, [_k.sent()]).toBe(true, 'url is not readonly');
                            _f = expect;
                            return [4 /*yield*/, shareDialog.isShareToggleChecked()];
                        case 9:
                            _f.apply(void 0, [_k.sent()]).toBe(true, 'Share toggle not checked');
                            _g = expect;
                            return [4 /*yield*/, shareDialog.getLabels().get(1).getText()];
                        case 10:
                            _g.apply(void 0, [_k.sent()]).toEqual('Expires on');
                            _h = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 11:
                            _h.apply(void 0, [_k.sent()]).toBe(false, 'Expire toggle is checked');
                            _j = expect;
                            return [4 /*yield*/, shareDialog.isCloseEnabled()];
                        case 12:
                            _j.apply(void 0, [_k.sent()]).toBe(true, 'Close button is not enabled');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Close dialog - [C286328]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file2)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _c.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isCloseEnabled()];
                        case 4:
                            _a.apply(void 0, [_c.sent()]).toBe(true, 'Close button is not enabled');
                            return [4 /*yield*/, shareDialog.clickClose()];
                        case 5:
                            _c.sent();
                            _b = expect;
                            return [4 /*yield*/, shareDialog.isDialogOpen()];
                        case 6:
                            _b.apply(void 0, [_c.sent()]).toBe(false, 'Share dialog is open');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Share a file - [C286329]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var url, sharedId, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file3)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 4:
                            url = _b.sent();
                            return [4 /*yield*/, Utils.pressEscape()];
                        case 5:
                            _b.sent();
                            return [4 /*yield*/, apis.user.nodes.getSharedId(file3Id)];
                        case 6:
                            sharedId = _b.sent();
                            _a = expect;
                            return [4 /*yield*/, apis.user.nodes.isFileShared(file3Id)];
                        case 7:
                            _a.apply(void 0, [_b.sent()]).toBe(true, file3 + " is not shared");
                            expect(url).toContain(sharedId);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Copy shared file URL - [C286330]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var url, _a, _b, _c;
                return tslib_1.__generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file4)];
                        case 1:
                            _d.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _d.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _d.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 4:
                            url = _d.sent();
                            expect(url).toContain(shareLinkPreUrl);
                            return [4 /*yield*/, shareDialog.copyUrl()];
                        case 5:
                            _d.sent();
                            _a = expect;
                            return [4 /*yield*/, page.getSnackBarMessage()];
                        case 6:
                            _a.apply(void 0, [_d.sent()]).toBe('Link copied to the clipboard');
                            return [4 /*yield*/, browser.get(url)];
                        case 7:
                            _d.sent();
                            _b = expect;
                            return [4 /*yield*/, viewer.isViewerOpened()];
                        case 8:
                            _b.apply(void 0, [_d.sent()]).toBe(true, 'viewer is not open');
                            _c = expect;
                            return [4 /*yield*/, viewer.getFileTitle()];
                        case 9:
                            _c.apply(void 0, [_d.sent()]).toEqual(file4);
                            return [4 /*yield*/, page.load()];
                        case 10:
                            _d.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Share a file with expiration date - [C286332]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, date, setDate, inputDate, expireDateProperty;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file5)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, shareDialog.clickExpirationToggle()];
                        case 4:
                            _c.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 5:
                            _a.apply(void 0, [_c.sent()]).toBe(true, 'Expire toggle not checked');
                            _b = expect;
                            return [4 /*yield*/, shareDialog.dateTimePicker.isCalendarOpen()];
                        case 6:
                            _b.apply(void 0, [_c.sent()]).toBe(true, 'Calendar not opened');
                            return [4 /*yield*/, shareDialog.dateTimePicker.setDefaultDay()];
                        case 7:
                            date = _c.sent();
                            return [4 /*yield*/, shareDialog.dateTimePicker.waitForDateTimePickerToClose()];
                        case 8:
                            _c.sent();
                            setDate = ("" + date).replace(',', '');
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 9:
                            inputDate = _c.sent();
                            expect(new Date(inputDate)).toEqual(new Date(setDate));
                            return [4 /*yield*/, apis.user.nodes.getSharedExpiryDate(file5Id)];
                        case 10:
                            expireDateProperty = _c.sent();
                            expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Expire date is displayed correctly - [C286337]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expireProperty, _a, _b, _c, _d;
                return tslib_1.__generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file6)];
                        case 1:
                            _e.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 2:
                            _e.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _e.sent();
                            return [4 /*yield*/, apis.user.nodes.getSharedExpiryDate(file6Id)];
                        case 4:
                            expireProperty = _e.sent();
                            expect(expireProperty).toEqual(expiryDate);
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 5:
                            _a.apply(void 0, [_e.sent()]).toBe(true, 'Expiration is not checked');
                            _b = expect;
                            _d = (_c = Utils).formatDate;
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 6:
                            _b.apply(void 0, [_d.apply(_c, [_e.sent()])]).toEqual(Utils.formatDate(expiryDate));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Disable the share link expiration - [C286333]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e;
                return tslib_1.__generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file7)];
                        case 1:
                            _f.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 2:
                            _f.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _f.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 4:
                            _a.apply(void 0, [_f.sent()]).toBe(true, 'Expiration is not checked');
                            _b = expect;
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 5:
                            _b.apply(void 0, [_f.sent()]).not.toBe('', 'Expire date input is empty');
                            return [4 /*yield*/, shareDialog.clickExpirationToggle()];
                        case 6:
                            _f.sent();
                            _c = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 7:
                            _c.apply(void 0, [_f.sent()]).toBe(false, 'Expiration is checked');
                            _d = expect;
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 8:
                            _d.apply(void 0, [_f.sent()]).toBe('', 'Expire date input is not empty');
                            return [4 /*yield*/, shareDialog.clickClose()];
                        case 9:
                            _f.sent();
                            _e = expect;
                            return [4 /*yield*/, apis.user.nodes.getSharedExpiryDate(file7Id)];
                        case 10:
                            _e.apply(void 0, [_f.sent()]).toBe('', file7 + " link still has expiration");
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Shared file URL is not changed when Share dialog is closed and opened again - [C286335]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var url1, url2;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file8)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 4:
                            url1 = _a.sent();
                            return [4 /*yield*/, shareDialog.clickClose()];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, page.dataTable.clearSelection()];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, dataTable.selectItem(file8)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 11:
                            url2 = _a.sent();
                            expect(url1).toEqual(url2);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Share a file from the context menu - [C286345]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var url, sharedId, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, dataTable.rightClickOnItem(file9)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, contextMenu.waitForMenuToOpen()];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, contextMenu.clickShare()];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 5:
                            url = _b.sent();
                            return [4 /*yield*/, Utils.pressEscape()];
                        case 6:
                            _b.sent();
                            return [4 /*yield*/, apis.user.nodes.getSharedId(file9Id)];
                        case 7:
                            sharedId = _b.sent();
                            _a = expect;
                            return [4 /*yield*/, apis.user.nodes.isFileShared(file9Id)];
                        case 8:
                            _a.apply(void 0, [_b.sent()]).toBe(true, file9 + " is not shared");
                            expect(url).toContain(sharedId);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('from File Libraries', function () {
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
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.createFile(file2, parentInSiteId)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.createFile(file3, parentInSiteId)];
                        case 6:
                            file3Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file4, parentInSiteId)];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.createFile(file5, parentInSiteId)];
                        case 8:
                            file5Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file6, parentInSiteId)];
                        case 9:
                            file6Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file7, parentInSiteId)];
                        case 10:
                            file7Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file8, parentInSiteId)];
                        case 11:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.createFile(file9, parentInSiteId)];
                        case 12:
                            file9Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.shared.shareFileById(file6Id, expiryDate)];
                        case 13:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.shareFileById(file7Id, expiryDate)];
                        case 14:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 2 })];
                        case 15:
                            _a.sent();
                            done();
                            return [2 /*return*/];
                    }
                });
            }); });
            beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.goToMyLibrariesAndWait()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, dataTable.doubleClickOnRowByName(siteName)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, dataTable.waitForHeader()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, dataTable.doubleClickOnRowByName(parentInSite)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, dataTable.waitForHeader()];
                        case 5:
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
                            return [4 /*yield*/, page.clickPersonalFilesAndWait()];
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
            it('Share dialog default values - [C286639]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return tslib_1.__generator(this, function (_k) {
                    switch (_k.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                        case 1:
                            _k.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _k.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _k.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.getTitle()];
                        case 4:
                            _a.apply(void 0, [_k.sent()]).toEqual("Share " + file1);
                            _b = expect;
                            return [4 /*yield*/, shareDialog.getInfoText()];
                        case 5:
                            _b.apply(void 0, [_k.sent()]).toEqual('Click the link below to copy it to the clipboard.');
                            _c = expect;
                            return [4 /*yield*/, shareDialog.getLabels().get(0).getText()];
                        case 6:
                            _c.apply(void 0, [_k.sent()]).toEqual('Link to share');
                            _d = expect;
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 7:
                            _d.apply(void 0, [_k.sent()]).toContain(shareLinkPreUrl);
                            _e = expect;
                            return [4 /*yield*/, shareDialog.isUrlReadOnly()];
                        case 8:
                            _e.apply(void 0, [_k.sent()]).toBe(true, 'url is not readonly');
                            _f = expect;
                            return [4 /*yield*/, shareDialog.isShareToggleChecked()];
                        case 9:
                            _f.apply(void 0, [_k.sent()]).toBe(true, 'Share toggle not checked');
                            _g = expect;
                            return [4 /*yield*/, shareDialog.getLabels().get(1).getText()];
                        case 10:
                            _g.apply(void 0, [_k.sent()]).toEqual('Expires on');
                            _h = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 11:
                            _h.apply(void 0, [_k.sent()]).toBe(false, 'Expire toggle is checked');
                            _j = expect;
                            return [4 /*yield*/, shareDialog.isCloseEnabled()];
                        case 12:
                            _j.apply(void 0, [_k.sent()]).toBe(true, 'Close button is not enabled');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Close dialog - [C286640]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file2)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _c.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isCloseEnabled()];
                        case 4:
                            _a.apply(void 0, [_c.sent()]).toBe(true, 'Close button is not enabled');
                            return [4 /*yield*/, shareDialog.clickClose()];
                        case 5:
                            _c.sent();
                            _b = expect;
                            return [4 /*yield*/, shareDialog.isDialogOpen()];
                        case 6:
                            _b.apply(void 0, [_c.sent()]).toBe(false, 'Share dialog is open');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Share a file - [C286641]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var url, sharedId, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file3)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 4:
                            url = _b.sent();
                            return [4 /*yield*/, Utils.pressEscape()];
                        case 5:
                            _b.sent();
                            return [4 /*yield*/, apis.user.nodes.getSharedId(file3Id)];
                        case 6:
                            sharedId = _b.sent();
                            _a = expect;
                            return [4 /*yield*/, apis.user.nodes.isFileShared(file3Id)];
                        case 7:
                            _a.apply(void 0, [_b.sent()]).toBe(true, file3 + " is not shared");
                            expect(url).toContain(sharedId);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Copy shared file URL - [C286642]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var url, _a, _b, _c;
                return tslib_1.__generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file4)];
                        case 1:
                            _d.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _d.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _d.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 4:
                            url = _d.sent();
                            expect(url).toContain(shareLinkPreUrl);
                            return [4 /*yield*/, shareDialog.copyUrl()];
                        case 5:
                            _d.sent();
                            _a = expect;
                            return [4 /*yield*/, page.getSnackBarMessage()];
                        case 6:
                            _a.apply(void 0, [_d.sent()]).toBe('Link copied to the clipboard');
                            return [4 /*yield*/, browser.get(url)];
                        case 7:
                            _d.sent();
                            _b = expect;
                            return [4 /*yield*/, viewer.isViewerOpened()];
                        case 8:
                            _b.apply(void 0, [_d.sent()]).toBe(true, 'viewer is not open');
                            _c = expect;
                            return [4 /*yield*/, viewer.getFileTitle()];
                        case 9:
                            _c.apply(void 0, [_d.sent()]).toEqual(file4);
                            return [4 /*yield*/, page.load()];
                        case 10:
                            _d.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Share a file with expiration date - [C286643]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, date, setDate, inputDate, expireDateProperty;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file5)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, shareDialog.clickExpirationToggle()];
                        case 4:
                            _c.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 5:
                            _a.apply(void 0, [_c.sent()]).toBe(true, 'Expire toggle not checked');
                            _b = expect;
                            return [4 /*yield*/, shareDialog.dateTimePicker.isCalendarOpen()];
                        case 6:
                            _b.apply(void 0, [_c.sent()]).toBe(true, 'Calendar not opened');
                            return [4 /*yield*/, shareDialog.dateTimePicker.setDefaultDay()];
                        case 7:
                            date = _c.sent();
                            return [4 /*yield*/, shareDialog.dateTimePicker.waitForDateTimePickerToClose()];
                        case 8:
                            _c.sent();
                            setDate = ("" + date).replace(',', '');
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 9:
                            inputDate = _c.sent();
                            expect(new Date(inputDate)).toEqual(new Date(setDate));
                            return [4 /*yield*/, apis.user.nodes.getSharedExpiryDate(file5Id)];
                        case 10:
                            expireDateProperty = _c.sent();
                            expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Expire date is displayed correctly - [C286644]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expireProperty, _a, _b, _c, _d;
                return tslib_1.__generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file6)];
                        case 1:
                            _e.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 2:
                            _e.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _e.sent();
                            return [4 /*yield*/, apis.user.nodes.getSharedExpiryDate(file6Id)];
                        case 4:
                            expireProperty = _e.sent();
                            expect(expireProperty).toEqual(expiryDate);
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 5:
                            _a.apply(void 0, [_e.sent()]).toBe(true, 'Expiration is not checked');
                            _b = expect;
                            _d = (_c = Utils).formatDate;
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 6:
                            _b.apply(void 0, [_d.apply(_c, [_e.sent()])]).toEqual(Utils.formatDate(expiryDate));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Disable the share link expiration - [C286645]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e;
                return tslib_1.__generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file7)];
                        case 1:
                            _f.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 2:
                            _f.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _f.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 4:
                            _a.apply(void 0, [_f.sent()]).toBe(true, 'Expiration is not checked');
                            _b = expect;
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 5:
                            _b.apply(void 0, [_f.sent()]).not.toBe('', 'Expire date input is empty');
                            return [4 /*yield*/, shareDialog.clickExpirationToggle()];
                        case 6:
                            _f.sent();
                            _c = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 7:
                            _c.apply(void 0, [_f.sent()]).toBe(false, 'Expiration is checked');
                            _d = expect;
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 8:
                            _d.apply(void 0, [_f.sent()]).toBe('', 'Expire date input is not empty');
                            return [4 /*yield*/, shareDialog.clickClose()];
                        case 9:
                            _f.sent();
                            _e = expect;
                            return [4 /*yield*/, apis.user.nodes.getSharedExpiryDate(file7Id)];
                        case 10:
                            _e.apply(void 0, [_f.sent()]).toBe('', file7 + " link still has expiration");
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Shared file URL is not changed when Share dialog is closed and opened again - [C286646]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var url1, url2;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file8)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 4:
                            url1 = _a.sent();
                            return [4 /*yield*/, shareDialog.clickClose()];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, page.dataTable.clearSelection()];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, dataTable.selectItem(file8)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 11:
                            url2 = _a.sent();
                            expect(url1).toEqual(url2);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Share a file from the context menu - [C286647]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var url, sharedId, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, dataTable.rightClickOnItem(file9)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, contextMenu.waitForMenuToOpen()];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, contextMenu.clickShare()];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 5:
                            url = _b.sent();
                            return [4 /*yield*/, Utils.pressEscape()];
                        case 6:
                            _b.sent();
                            return [4 /*yield*/, apis.user.nodes.getSharedId(file9Id)];
                        case 7:
                            sharedId = _b.sent();
                            _a = expect;
                            return [4 /*yield*/, apis.user.nodes.isFileShared(file9Id)];
                        case 8:
                            _a.apply(void 0, [_b.sent()]).toBe(true, file9 + " is not shared");
                            expect(url).toContain(sharedId);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('from Recent Files', function () {
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
                            return [4 /*yield*/, apis.user.nodes.createFile(file5, parentId)];
                        case 5:
                            file5Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file6, parentId)];
                        case 6:
                            file6Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file7, parentId)];
                        case 7:
                            file7Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file8, parentId)];
                        case 8:
                            file8Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file9, parentId)];
                        case 9:
                            file9Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.shared.shareFileById(file6Id, expiryDate)];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.shareFileById(file7Id, expiryDate)];
                        case 11:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 2 })];
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
                        case 0: return [4 /*yield*/, page.clickRecentFilesAndWait()];
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
                            return [4 /*yield*/, page.clickPersonalFilesAndWait()];
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
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file5Id)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file6Id)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file7Id)];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file8Id)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file9Id)];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 0 })];
                        case 10:
                            _a.sent();
                            done();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Share dialog default values - [C286657]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return tslib_1.__generator(this, function (_k) {
                    switch (_k.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                        case 1:
                            _k.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _k.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _k.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.getTitle()];
                        case 4:
                            _a.apply(void 0, [_k.sent()]).toEqual("Share " + file1);
                            _b = expect;
                            return [4 /*yield*/, shareDialog.getInfoText()];
                        case 5:
                            _b.apply(void 0, [_k.sent()]).toEqual('Click the link below to copy it to the clipboard.');
                            _c = expect;
                            return [4 /*yield*/, shareDialog.getLabels().get(0).getText()];
                        case 6:
                            _c.apply(void 0, [_k.sent()]).toEqual('Link to share');
                            _d = expect;
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 7:
                            _d.apply(void 0, [_k.sent()]).toContain(shareLinkPreUrl);
                            _e = expect;
                            return [4 /*yield*/, shareDialog.isUrlReadOnly()];
                        case 8:
                            _e.apply(void 0, [_k.sent()]).toBe(true, 'url is not readonly');
                            _f = expect;
                            return [4 /*yield*/, shareDialog.isShareToggleChecked()];
                        case 9:
                            _f.apply(void 0, [_k.sent()]).toBe(true, 'Share toggle not checked');
                            _g = expect;
                            return [4 /*yield*/, shareDialog.getLabels().get(1).getText()];
                        case 10:
                            _g.apply(void 0, [_k.sent()]).toEqual('Expires on');
                            _h = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 11:
                            _h.apply(void 0, [_k.sent()]).toBe(false, 'Expire toggle is checked');
                            _j = expect;
                            return [4 /*yield*/, shareDialog.isCloseEnabled()];
                        case 12:
                            _j.apply(void 0, [_k.sent()]).toBe(true, 'Close button is not enabled');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Close dialog - [C286658]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file2)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _c.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isCloseEnabled()];
                        case 4:
                            _a.apply(void 0, [_c.sent()]).toBe(true, 'Close button is not enabled');
                            return [4 /*yield*/, shareDialog.clickClose()];
                        case 5:
                            _c.sent();
                            _b = expect;
                            return [4 /*yield*/, shareDialog.isDialogOpen()];
                        case 6:
                            _b.apply(void 0, [_c.sent()]).toBe(false, 'Share dialog is open');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Share a file - [C286659]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var url, sharedId, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file3)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 4:
                            url = _b.sent();
                            return [4 /*yield*/, Utils.pressEscape()];
                        case 5:
                            _b.sent();
                            return [4 /*yield*/, apis.user.nodes.getSharedId(file3Id)];
                        case 6:
                            sharedId = _b.sent();
                            _a = expect;
                            return [4 /*yield*/, apis.user.nodes.isFileShared(file3Id)];
                        case 7:
                            _a.apply(void 0, [_b.sent()]).toBe(true, file3 + " is not shared");
                            expect(url).toContain(sharedId);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Copy shared file URL - [C286660]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var url, _a, _b, _c;
                return tslib_1.__generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file4)];
                        case 1:
                            _d.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _d.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _d.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 4:
                            url = _d.sent();
                            expect(url).toContain(shareLinkPreUrl);
                            return [4 /*yield*/, shareDialog.copyUrl()];
                        case 5:
                            _d.sent();
                            _a = expect;
                            return [4 /*yield*/, page.getSnackBarMessage()];
                        case 6:
                            _a.apply(void 0, [_d.sent()]).toBe('Link copied to the clipboard');
                            return [4 /*yield*/, browser.get(url)];
                        case 7:
                            _d.sent();
                            _b = expect;
                            return [4 /*yield*/, viewer.isViewerOpened()];
                        case 8:
                            _b.apply(void 0, [_d.sent()]).toBe(true, 'viewer is not open');
                            _c = expect;
                            return [4 /*yield*/, viewer.getFileTitle()];
                        case 9:
                            _c.apply(void 0, [_d.sent()]).toEqual(file4);
                            return [4 /*yield*/, page.load()];
                        case 10:
                            _d.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Share a file with expiration date - [C286661]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, date, setDate, inputDate, expireDateProperty;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file5)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, shareDialog.clickExpirationToggle()];
                        case 4:
                            _c.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 5:
                            _a.apply(void 0, [_c.sent()]).toBe(true, 'Expire toggle not checked');
                            _b = expect;
                            return [4 /*yield*/, shareDialog.dateTimePicker.isCalendarOpen()];
                        case 6:
                            _b.apply(void 0, [_c.sent()]).toBe(true, 'Calendar not opened');
                            return [4 /*yield*/, shareDialog.dateTimePicker.setDefaultDay()];
                        case 7:
                            date = _c.sent();
                            return [4 /*yield*/, shareDialog.dateTimePicker.waitForDateTimePickerToClose()];
                        case 8:
                            _c.sent();
                            setDate = ("" + date).replace(',', '');
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 9:
                            inputDate = _c.sent();
                            expect(new Date(inputDate)).toEqual(new Date(setDate));
                            return [4 /*yield*/, apis.user.nodes.getSharedExpiryDate(file5Id)];
                        case 10:
                            expireDateProperty = _c.sent();
                            expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Expire date is displayed correctly - [C286662]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expireProperty, _a, _b, _c, _d;
                return tslib_1.__generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file6)];
                        case 1:
                            _e.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 2:
                            _e.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _e.sent();
                            return [4 /*yield*/, apis.user.nodes.getSharedExpiryDate(file6Id)];
                        case 4:
                            expireProperty = _e.sent();
                            expect(expireProperty).toEqual(expiryDate);
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 5:
                            _a.apply(void 0, [_e.sent()]).toBe(true, 'Expiration is not checked');
                            _b = expect;
                            _d = (_c = Utils).formatDate;
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 6:
                            _b.apply(void 0, [_d.apply(_c, [_e.sent()])]).toEqual(Utils.formatDate(expiryDate));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Disable the share link expiration - [C286663]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e;
                return tslib_1.__generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file7)];
                        case 1:
                            _f.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 2:
                            _f.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _f.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 4:
                            _a.apply(void 0, [_f.sent()]).toBe(true, 'Expiration is not checked');
                            _b = expect;
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 5:
                            _b.apply(void 0, [_f.sent()]).not.toBe('', 'Expire date input is empty');
                            return [4 /*yield*/, shareDialog.clickExpirationToggle()];
                        case 6:
                            _f.sent();
                            _c = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 7:
                            _c.apply(void 0, [_f.sent()]).toBe(false, 'Expiration is checked');
                            _d = expect;
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 8:
                            _d.apply(void 0, [_f.sent()]).toBe('', 'Expire date input is not empty');
                            return [4 /*yield*/, shareDialog.clickClose()];
                        case 9:
                            _f.sent();
                            _e = expect;
                            return [4 /*yield*/, apis.user.nodes.getSharedExpiryDate(file7Id)];
                        case 10:
                            _e.apply(void 0, [_f.sent()]).toBe('', file7 + " link still has expiration");
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Shared file URL is not changed when Share dialog is closed and opened again - [C286664]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var url1, url2;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file8)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 4:
                            url1 = _a.sent();
                            return [4 /*yield*/, shareDialog.clickClose()];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, page.dataTable.clearSelection()];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, dataTable.selectItem(file8)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 11:
                            url2 = _a.sent();
                            expect(url1).toEqual(url2);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Share a file from the context menu - [C286665]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var url, sharedId, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, dataTable.rightClickOnItem(file9)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, contextMenu.waitForMenuToOpen()];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, contextMenu.clickShare()];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 5:
                            url = _b.sent();
                            return [4 /*yield*/, Utils.pressEscape()];
                        case 6:
                            _b.sent();
                            return [4 /*yield*/, apis.user.nodes.getSharedId(file9Id)];
                        case 7:
                            sharedId = _b.sent();
                            _a = expect;
                            return [4 /*yield*/, apis.user.nodes.isFileShared(file9Id)];
                        case 8:
                            _a.apply(void 0, [_b.sent()]).toBe(true, file9 + " is not shared");
                            expect(url).toContain(sharedId);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('from Shared Files', function () {
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
                            return [4 /*yield*/, apis.user.nodes.createFile(file5, parentId)];
                        case 5:
                            file5Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file6, parentId)];
                        case 6:
                            file6Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file7, parentId)];
                        case 7:
                            file7Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.shared.shareFileById(file1Id)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.shareFileById(file2Id)];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.shareFileById(file3Id)];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.shareFileById(file4Id, expiryDate)];
                        case 11:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.shareFileById(file5Id, expiryDate)];
                        case 12:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.shareFileById(file6Id)];
                        case 13:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.shareFileById(file7Id)];
                        case 14:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 7 })];
                        case 15:
                            _a.sent();
                            done();
                            return [2 /*return*/];
                    }
                });
            }); });
            beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.clickSharedFilesAndWait()];
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
                            return [4 /*yield*/, page.clickPersonalFilesAndWait()];
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
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file5Id)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file6Id)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file7Id)];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 0 })];
                        case 8:
                            _a.sent();
                            done();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Share dialog default values - [C286648]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return tslib_1.__generator(this, function (_k) {
                    switch (_k.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                        case 1:
                            _k.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 2:
                            _k.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _k.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.getTitle()];
                        case 4:
                            _a.apply(void 0, [_k.sent()]).toEqual("Share " + file1);
                            _b = expect;
                            return [4 /*yield*/, shareDialog.getInfoText()];
                        case 5:
                            _b.apply(void 0, [_k.sent()]).toEqual('Click the link below to copy it to the clipboard.');
                            _c = expect;
                            return [4 /*yield*/, shareDialog.getLabels().get(0).getText()];
                        case 6:
                            _c.apply(void 0, [_k.sent()]).toEqual('Link to share');
                            _d = expect;
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 7:
                            _d.apply(void 0, [_k.sent()]).toContain(shareLinkPreUrl);
                            _e = expect;
                            return [4 /*yield*/, shareDialog.isUrlReadOnly()];
                        case 8:
                            _e.apply(void 0, [_k.sent()]).toBe(true, 'url is not readonly');
                            _f = expect;
                            return [4 /*yield*/, shareDialog.isShareToggleChecked()];
                        case 9:
                            _f.apply(void 0, [_k.sent()]).toBe(true, 'Share toggle not checked');
                            _g = expect;
                            return [4 /*yield*/, shareDialog.getLabels().get(1).getText()];
                        case 10:
                            _g.apply(void 0, [_k.sent()]).toEqual('Expires on');
                            _h = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 11:
                            _h.apply(void 0, [_k.sent()]).toBe(false, 'Expire toggle is checked');
                            _j = expect;
                            return [4 /*yield*/, shareDialog.isCloseEnabled()];
                        case 12:
                            _j.apply(void 0, [_k.sent()]).toBe(true, 'Close button is not enabled');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Close dialog - [C286649]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file2)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _c.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isCloseEnabled()];
                        case 4:
                            _a.apply(void 0, [_c.sent()]).toBe(true, 'Close button is not enabled');
                            return [4 /*yield*/, shareDialog.clickClose()];
                        case 5:
                            _c.sent();
                            _b = expect;
                            return [4 /*yield*/, shareDialog.isDialogOpen()];
                        case 6:
                            _b.apply(void 0, [_c.sent()]).toBe(false, 'Share dialog is open');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Copy shared file URL - [C286651]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var url, _a, _b, _c;
                return tslib_1.__generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file3)];
                        case 1:
                            _d.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 2:
                            _d.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _d.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 4:
                            url = _d.sent();
                            expect(url).toContain(shareLinkPreUrl);
                            return [4 /*yield*/, shareDialog.copyUrl()];
                        case 5:
                            _d.sent();
                            _a = expect;
                            return [4 /*yield*/, page.getSnackBarMessage()];
                        case 6:
                            _a.apply(void 0, [_d.sent()]).toBe('Link copied to the clipboard');
                            return [4 /*yield*/, browser.get(url)];
                        case 7:
                            _d.sent();
                            _b = expect;
                            return [4 /*yield*/, viewer.isViewerOpened()];
                        case 8:
                            _b.apply(void 0, [_d.sent()]).toBe(true, 'viewer is not open');
                            _c = expect;
                            return [4 /*yield*/, viewer.getFileTitle()];
                        case 9:
                            _c.apply(void 0, [_d.sent()]).toEqual(file3);
                            return [4 /*yield*/, page.load()];
                        case 10:
                            _d.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Expire date is displayed correctly - [C286653]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expireProperty, _a, _b, _c, _d;
                return tslib_1.__generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file4)];
                        case 1:
                            _e.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 2:
                            _e.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _e.sent();
                            return [4 /*yield*/, apis.user.nodes.getSharedExpiryDate(file4Id)];
                        case 4:
                            expireProperty = _e.sent();
                            expect(expireProperty).toEqual(expiryDate);
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 5:
                            _a.apply(void 0, [_e.sent()]).toBe(true, 'Expiration is not checked');
                            _b = expect;
                            _d = (_c = Utils).formatDate;
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 6:
                            _b.apply(void 0, [_d.apply(_c, [_e.sent()])]).toEqual(Utils.formatDate(expiryDate));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Disable the share link expiration - [C286654]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e;
                return tslib_1.__generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file5)];
                        case 1:
                            _f.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 2:
                            _f.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _f.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 4:
                            _a.apply(void 0, [_f.sent()]).toBe(true, 'Expiration is not checked');
                            _b = expect;
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 5:
                            _b.apply(void 0, [_f.sent()]).not.toBe('', 'Expire date input is empty');
                            return [4 /*yield*/, shareDialog.clickExpirationToggle()];
                        case 6:
                            _f.sent();
                            _c = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 7:
                            _c.apply(void 0, [_f.sent()]).toBe(false, 'Expiration is checked');
                            _d = expect;
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 8:
                            _d.apply(void 0, [_f.sent()]).toBe('', 'Expire date input is not empty');
                            return [4 /*yield*/, shareDialog.clickClose()];
                        case 9:
                            _f.sent();
                            _e = expect;
                            return [4 /*yield*/, apis.user.nodes.getSharedExpiryDate(file5Id)];
                        case 10:
                            _e.apply(void 0, [_f.sent()]).toBe('', file5 + " link still has expiration");
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Shared file URL is not changed when Share dialog is closed and opened again - [C286655]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var url1, url2;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file6)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 4:
                            url1 = _a.sent();
                            return [4 /*yield*/, shareDialog.clickClose()];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, page.dataTable.clearSelection()];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, dataTable.selectItem(file6)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 11:
                            url2 = _a.sent();
                            expect(url1).toEqual(url2);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Open Share dialog from context menu - [C286656]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return tslib_1.__generator(this, function (_k) {
                    switch (_k.label) {
                        case 0: return [4 /*yield*/, dataTable.rightClickOnItem(file7)];
                        case 1:
                            _k.sent();
                            return [4 /*yield*/, contextMenu.waitForMenuToOpen()];
                        case 2:
                            _k.sent();
                            return [4 /*yield*/, contextMenu.clickSharedLinkSettings()];
                        case 3:
                            _k.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 4:
                            _k.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.getTitle()];
                        case 5:
                            _a.apply(void 0, [_k.sent()]).toEqual("Share " + file7);
                            _b = expect;
                            return [4 /*yield*/, shareDialog.getInfoText()];
                        case 6:
                            _b.apply(void 0, [_k.sent()]).toEqual('Click the link below to copy it to the clipboard.');
                            _c = expect;
                            return [4 /*yield*/, shareDialog.getLabels().get(0).getText()];
                        case 7:
                            _c.apply(void 0, [_k.sent()]).toEqual('Link to share');
                            _d = expect;
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 8:
                            _d.apply(void 0, [_k.sent()]).toContain(shareLinkPreUrl);
                            _e = expect;
                            return [4 /*yield*/, shareDialog.isUrlReadOnly()];
                        case 9:
                            _e.apply(void 0, [_k.sent()]).toBe(true, 'url is not readonly');
                            _f = expect;
                            return [4 /*yield*/, shareDialog.isShareToggleChecked()];
                        case 10:
                            _f.apply(void 0, [_k.sent()]).toBe(true, 'Share toggle not checked');
                            _g = expect;
                            return [4 /*yield*/, shareDialog.getLabels().get(1).getText()];
                        case 11:
                            _g.apply(void 0, [_k.sent()]).toEqual('Expires on');
                            _h = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 12:
                            _h.apply(void 0, [_k.sent()]).toBe(false, 'Expire toggle is checked');
                            _j = expect;
                            return [4 /*yield*/, shareDialog.isCloseEnabled()];
                        case 13:
                            _j.apply(void 0, [_k.sent()]).toBe(true, 'Close button is not enabled');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('from Favorites', function () {
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
                            return [4 /*yield*/, apis.user.nodes.createFile(file5, parentId)];
                        case 5:
                            file5Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file6, parentId)];
                        case 6:
                            file6Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file7, parentId)];
                        case 7:
                            file7Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file8, parentId)];
                        case 8:
                            file8Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file9, parentId)];
                        case 9:
                            file9Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file1Id)];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file2Id)];
                        case 11:
                            _a.sent();
                            return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file3Id)];
                        case 12:
                            _a.sent();
                            return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file4Id)];
                        case 13:
                            _a.sent();
                            return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file5Id)];
                        case 14:
                            _a.sent();
                            return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file6Id)];
                        case 15:
                            _a.sent();
                            return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file7Id)];
                        case 16:
                            _a.sent();
                            return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file8Id)];
                        case 17:
                            _a.sent();
                            return [4 /*yield*/, apis.user.favorites.addFavoriteById('file', file9Id)];
                        case 18:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.shareFileById(file6Id, expiryDate)];
                        case 19:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.shareFileById(file7Id, expiryDate)];
                        case 20:
                            _a.sent();
                            return [4 /*yield*/, apis.user.favorites.waitForApi({ expect: 9 })];
                        case 21:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 2 })];
                        case 22:
                            _a.sent();
                            done();
                            return [2 /*return*/];
                    }
                });
            }); });
            beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.clickFavoritesAndWait()];
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
                            return [4 /*yield*/, page.clickPersonalFilesAndWait()];
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
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file5Id)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file6Id)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file7Id)];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file8Id)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file9Id)];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 0 })];
                        case 10:
                            _a.sent();
                            done();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Share dialog default values - [C286666]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return tslib_1.__generator(this, function (_k) {
                    switch (_k.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file1)];
                        case 1:
                            _k.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _k.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _k.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.getTitle()];
                        case 4:
                            _a.apply(void 0, [_k.sent()]).toEqual("Share " + file1);
                            _b = expect;
                            return [4 /*yield*/, shareDialog.getInfoText()];
                        case 5:
                            _b.apply(void 0, [_k.sent()]).toEqual('Click the link below to copy it to the clipboard.');
                            _c = expect;
                            return [4 /*yield*/, shareDialog.getLabels().get(0).getText()];
                        case 6:
                            _c.apply(void 0, [_k.sent()]).toEqual('Link to share');
                            _d = expect;
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 7:
                            _d.apply(void 0, [_k.sent()]).toContain(shareLinkPreUrl);
                            _e = expect;
                            return [4 /*yield*/, shareDialog.isUrlReadOnly()];
                        case 8:
                            _e.apply(void 0, [_k.sent()]).toBe(true, 'url is not readonly');
                            _f = expect;
                            return [4 /*yield*/, shareDialog.isShareToggleChecked()];
                        case 9:
                            _f.apply(void 0, [_k.sent()]).toBe(true, 'Share toggle not checked');
                            _g = expect;
                            return [4 /*yield*/, shareDialog.getLabels().get(1).getText()];
                        case 10:
                            _g.apply(void 0, [_k.sent()]).toEqual('Expires on');
                            _h = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 11:
                            _h.apply(void 0, [_k.sent()]).toBe(false, 'Expire toggle is checked');
                            _j = expect;
                            return [4 /*yield*/, shareDialog.isCloseEnabled()];
                        case 12:
                            _j.apply(void 0, [_k.sent()]).toBe(true, 'Close button is not enabled');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Close dialog - [C286667]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file2)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _c.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isCloseEnabled()];
                        case 4:
                            _a.apply(void 0, [_c.sent()]).toBe(true, 'Close button is not enabled');
                            return [4 /*yield*/, shareDialog.clickClose()];
                        case 5:
                            _c.sent();
                            _b = expect;
                            return [4 /*yield*/, shareDialog.isDialogOpen()];
                        case 6:
                            _b.apply(void 0, [_c.sent()]).toBe(false, 'Share dialog is open');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Share a file - [C286668]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var url, sharedId, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file3)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 4:
                            url = _b.sent();
                            return [4 /*yield*/, Utils.pressEscape()];
                        case 5:
                            _b.sent();
                            return [4 /*yield*/, apis.user.nodes.getSharedId(file3Id)];
                        case 6:
                            sharedId = _b.sent();
                            _a = expect;
                            return [4 /*yield*/, apis.user.nodes.isFileShared(file3Id)];
                        case 7:
                            _a.apply(void 0, [_b.sent()]).toBe(true, file3 + " is not shared");
                            expect(url).toContain(sharedId);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Copy shared file URL - [C286669]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var url, _a, _b, _c;
                return tslib_1.__generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file4)];
                        case 1:
                            _d.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _d.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _d.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 4:
                            url = _d.sent();
                            expect(url).toContain(shareLinkPreUrl);
                            return [4 /*yield*/, shareDialog.copyUrl()];
                        case 5:
                            _d.sent();
                            _a = expect;
                            return [4 /*yield*/, page.getSnackBarMessage()];
                        case 6:
                            _a.apply(void 0, [_d.sent()]).toBe('Link copied to the clipboard');
                            return [4 /*yield*/, browser.get(url)];
                        case 7:
                            _d.sent();
                            _b = expect;
                            return [4 /*yield*/, viewer.isViewerOpened()];
                        case 8:
                            _b.apply(void 0, [_d.sent()]).toBe(true, 'viewer is not open');
                            _c = expect;
                            return [4 /*yield*/, viewer.getFileTitle()];
                        case 9:
                            _c.apply(void 0, [_d.sent()]).toEqual(file4);
                            return [4 /*yield*/, page.load()];
                        case 10:
                            _d.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Share a file with expiration date - [C286670]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, date, setDate, inputDate, expireDateProperty;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file5)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, shareDialog.clickExpirationToggle()];
                        case 4:
                            _c.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 5:
                            _a.apply(void 0, [_c.sent()]).toBe(true, 'Expire toggle not checked');
                            _b = expect;
                            return [4 /*yield*/, shareDialog.dateTimePicker.isCalendarOpen()];
                        case 6:
                            _b.apply(void 0, [_c.sent()]).toBe(true, 'Calendar not opened');
                            return [4 /*yield*/, shareDialog.dateTimePicker.setDefaultDay()];
                        case 7:
                            date = _c.sent();
                            return [4 /*yield*/, shareDialog.dateTimePicker.waitForDateTimePickerToClose()];
                        case 8:
                            _c.sent();
                            setDate = ("" + date).replace(',', '');
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 9:
                            inputDate = _c.sent();
                            expect(new Date(inputDate)).toEqual(new Date(setDate));
                            return [4 /*yield*/, apis.user.nodes.getSharedExpiryDate(file5Id)];
                        case 10:
                            expireDateProperty = _c.sent();
                            expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Expire date is displayed correctly - [C286671]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expireProperty, _a, _b, _c, _d;
                return tslib_1.__generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file6)];
                        case 1:
                            _e.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 2:
                            _e.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _e.sent();
                            return [4 /*yield*/, apis.user.nodes.getSharedExpiryDate(file6Id)];
                        case 4:
                            expireProperty = _e.sent();
                            expect(expireProperty).toEqual(expiryDate);
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 5:
                            _a.apply(void 0, [_e.sent()]).toBe(true, 'Expiration is not checked');
                            _b = expect;
                            _d = (_c = Utils).formatDate;
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 6:
                            _b.apply(void 0, [_d.apply(_c, [_e.sent()])]).toEqual(Utils.formatDate(expiryDate));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Disable the share link expiration - [C286672]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e;
                return tslib_1.__generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file7)];
                        case 1:
                            _f.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 2:
                            _f.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _f.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 4:
                            _a.apply(void 0, [_f.sent()]).toBe(true, 'Expiration is not checked');
                            _b = expect;
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 5:
                            _b.apply(void 0, [_f.sent()]).not.toBe('', 'Expire date input is empty');
                            return [4 /*yield*/, shareDialog.clickExpirationToggle()];
                        case 6:
                            _f.sent();
                            _c = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 7:
                            _c.apply(void 0, [_f.sent()]).toBe(false, 'Expiration is checked');
                            _d = expect;
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 8:
                            _d.apply(void 0, [_f.sent()]).toBe('', 'Expire date input is not empty');
                            return [4 /*yield*/, shareDialog.clickClose()];
                        case 9:
                            _f.sent();
                            _e = expect;
                            return [4 /*yield*/, apis.user.nodes.getSharedExpiryDate(file7Id)];
                        case 10:
                            _e.apply(void 0, [_f.sent()]).toBe('', file7 + " link still has expiration");
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Shared file URL is not changed when Share dialog is closed and opened again - [C286673]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var url1, url2;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file8)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 4:
                            url1 = _a.sent();
                            return [4 /*yield*/, shareDialog.clickClose()];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToClose()];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, page.dataTable.clearSelection()];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, dataTable.selectItem(file8)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 11:
                            url2 = _a.sent();
                            expect(url1).toEqual(url2);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Share a file from the context menu - [C286674]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var url, sharedId, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, dataTable.rightClickOnItem(file9)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, contextMenu.waitForMenuToOpen()];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, contextMenu.clickShare()];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 5:
                            url = _b.sent();
                            return [4 /*yield*/, Utils.pressEscape()];
                        case 6:
                            _b.sent();
                            return [4 /*yield*/, apis.user.nodes.getSharedId(file9Id)];
                        case 7:
                            sharedId = _b.sent();
                            _a = expect;
                            return [4 /*yield*/, apis.user.nodes.isFileShared(file9Id)];
                        case 8:
                            _a.apply(void 0, [_b.sent()]).toBe(true, file9 + " is not shared");
                            expect(url).toContain(sharedId);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('from Search Results', function () {
            file3 = "search-file3-" + Utils.random() + ".txt";
            file5 = "search-file5-" + Utils.random() + ".txt";
            file6 = "search-file6-" + Utils.random() + ".txt";
            file7 = "search-file7-" + Utils.random() + ".txt";
            file9 = "search-file9-" + Utils.random() + ".txt";
            beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, apis.user.nodes.createFile(file3, parentId)];
                        case 1:
                            file3Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file5, parentId)];
                        case 2:
                            file5Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file6, parentId)];
                        case 3:
                            file6Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file7, parentId)];
                        case 4:
                            file7Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.nodes.createFile(file9, parentId)];
                        case 5:
                            file9Id = (_a.sent()).entry.id;
                            return [4 /*yield*/, apis.user.shared.shareFileById(file6Id, expiryDate)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.shareFileById(file7Id, expiryDate)];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 2 })];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, apis.user.search.waitForNodes('search-f', { expect: 5 })];
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
                        case 0: return [4 /*yield*/, searchInput.clickSearchButton()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, searchInput.checkFilesAndFolders()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, searchInput.searchFor('search-f')];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, dataTable.waitForBody()];
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
                            return [4 /*yield*/, page.clickPersonalFilesAndWait()];
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
                        case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(file3Id)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file5Id)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file6Id)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file7Id)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, apis.user.nodes.deleteNodeById(file9Id)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, apis.user.shared.waitForApi({ expect: 0 })];
                        case 6:
                            _a.sent();
                            done();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Share a file - [C306975]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var url, sharedId, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file3)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 4:
                            url = _b.sent();
                            return [4 /*yield*/, Utils.pressEscape()];
                        case 5:
                            _b.sent();
                            return [4 /*yield*/, apis.user.nodes.getSharedId(file3Id)];
                        case 6:
                            sharedId = _b.sent();
                            _a = expect;
                            return [4 /*yield*/, apis.user.nodes.isFileShared(file3Id)];
                        case 7:
                            _a.apply(void 0, [_b.sent()]).toBe(true, file3 + " is not shared");
                            expect(url).toContain(sharedId);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Share a file with expiration date - [C306977]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, date, setDate, inputDate, expireDateProperty;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file5)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, toolbar.clickShare()];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, shareDialog.clickExpirationToggle()];
                        case 4:
                            _c.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 5:
                            _a.apply(void 0, [_c.sent()]).toBe(true, 'Expire toggle not checked');
                            _b = expect;
                            return [4 /*yield*/, shareDialog.dateTimePicker.isCalendarOpen()];
                        case 6:
                            _b.apply(void 0, [_c.sent()]).toBe(true, 'Calendar not opened');
                            return [4 /*yield*/, shareDialog.dateTimePicker.setDefaultDay()];
                        case 7:
                            date = _c.sent();
                            return [4 /*yield*/, shareDialog.dateTimePicker.waitForDateTimePickerToClose()];
                        case 8:
                            _c.sent();
                            setDate = ("" + date).replace(',', '');
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 9:
                            inputDate = _c.sent();
                            expect(new Date(inputDate)).toEqual(new Date(setDate));
                            return [4 /*yield*/, apis.user.nodes.getSharedExpiryDate(file5Id)];
                        case 10:
                            expireDateProperty = _c.sent();
                            expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Expire date is displayed correctly - [C306978]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expireProperty, _a, _b, _c, _d;
                return tslib_1.__generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file6)];
                        case 1:
                            _e.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 2:
                            _e.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _e.sent();
                            return [4 /*yield*/, apis.user.nodes.getSharedExpiryDate(file6Id)];
                        case 4:
                            expireProperty = _e.sent();
                            expect(expireProperty).toEqual(expiryDate);
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 5:
                            _a.apply(void 0, [_e.sent()]).toBe(true, 'Expiration is not checked');
                            _b = expect;
                            _d = (_c = Utils).formatDate;
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 6:
                            _b.apply(void 0, [_d.apply(_c, [_e.sent()])]).toEqual(Utils.formatDate(expiryDate));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Disable the share link expiration - [C306979]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e;
                return tslib_1.__generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, dataTable.selectItem(file7)];
                        case 1:
                            _f.sent();
                            return [4 /*yield*/, toolbar.clickSharedLinkSettings()];
                        case 2:
                            _f.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 3:
                            _f.sent();
                            _a = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 4:
                            _a.apply(void 0, [_f.sent()]).toBe(true, 'Expiration is not checked');
                            _b = expect;
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 5:
                            _b.apply(void 0, [_f.sent()]).not.toBe('', 'Expire date input is empty');
                            return [4 /*yield*/, shareDialog.clickExpirationToggle()];
                        case 6:
                            _f.sent();
                            _c = expect;
                            return [4 /*yield*/, shareDialog.isExpireToggleEnabled()];
                        case 7:
                            _c.apply(void 0, [_f.sent()]).toBe(false, 'Expiration is checked');
                            _d = expect;
                            return [4 /*yield*/, shareDialog.getExpireDate()];
                        case 8:
                            _d.apply(void 0, [_f.sent()]).toBe('', 'Expire date input is not empty');
                            return [4 /*yield*/, shareDialog.clickClose()];
                        case 9:
                            _f.sent();
                            _e = expect;
                            return [4 /*yield*/, apis.user.nodes.getSharedExpiryDate(file7Id)];
                        case 10:
                            _e.apply(void 0, [_f.sent()]).toBe('', file7 + " link still has expiration");
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Share a file from the context menu - [C306981]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var url, sharedId, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, dataTable.rightClickOnItem(file9)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, contextMenu.waitForMenuToOpen()];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, contextMenu.clickShare()];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, shareDialog.waitForDialogToOpen()];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, shareDialog.getLinkUrl()];
                        case 5:
                            url = _b.sent();
                            return [4 /*yield*/, Utils.pressEscape()];
                        case 6:
                            _b.sent();
                            return [4 /*yield*/, apis.user.nodes.getSharedId(file9Id)];
                        case 7:
                            sharedId = _b.sent();
                            _a = expect;
                            return [4 /*yield*/, apis.user.nodes.isFileShared(file9Id)];
                        case 8:
                            _a.apply(void 0, [_b.sent()]).toBe(true, file9 + " is not shared");
                            expect(url).toContain(sharedId);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
//# sourceMappingURL=share-file.test.js.map