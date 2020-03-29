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
import { BrowsingPage, LoginPage } from '../../pages/pages';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { EXTENSIBILITY_CONFIGS } from '../../configs';
import { Utils } from '../../utilities/utils';
describe('Extensions - DocumentList presets', function () {
    var username = "user-" + Utils.random();
    var file = "file-" + Utils.random() + ".txt";
    var fileId;
    var testData = [
        {
            id: 'app.files.name',
            label: 'Name'
        },
        {
            id: 'app.files.size',
            label: 'Size',
            disabled: true
        },
        {
            id: 'app.files.modifiedBy',
            label: 'Test header'
        },
        {
            id: 'some.id.createdBy',
            label: 'New column'
        }
    ];
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    var dataTable = page.dataTable;
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createFile(file)];
                case 2:
                    fileId = (_a.sent()).entry.id;
                    return [4 /*yield*/, loginPage.load()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, Utils.setSessionStorageFromConfig(EXTENSIBILITY_CONFIGS.DOCUMENT_LIST_PRESETS)];
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
    afterAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.user.nodes.deleteNodeById(fileId)];
                case 1:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Sets the columns to display - [C286700]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var expectedColumns, actualColumns;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectedColumns = testData
                        .filter(function (item) { return !item.disabled; })
                        .map(function (data) { return data.label; });
                    return [4 /*yield*/, dataTable.getColumnHeadersText()];
                case 1:
                    actualColumns = _a.sent();
                    expect(actualColumns).toEqual(expectedColumns);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Disabled items are not shown - [C286699]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var noColumnLabel, element, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    noColumnLabel = testData.find(function (item) { return item.disabled; }).label;
                    element = dataTable.getColumnHeaderByLabel(noColumnLabel);
                    _a = expect;
                    return [4 /*yield*/, element.isPresent()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBe(false, "\"" + noColumnLabel + "\" is displayed");
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=ext-document-list.test.js.map