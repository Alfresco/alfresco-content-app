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
import { InfoDrawer } from '../../components/info-drawer/info-drawer';
import { MetadataCard } from '../../components/metadata-card/metadata-card';
describe('Extensions - Metadata presets', function () {
    var username = "user-" + Utils.random();
    var file = "file-" + Utils.random() + ".png";
    var fileId;
    var properties_tab = {
        title: 'Properties',
        component: 'app.components.tabs.metadata'
    };
    var customGroup1 = {
        id: 'a.testGroup',
        title: 'A Test Group of Properties'
    };
    var customGroup2 = {
        id: 'another.testGroup',
        title: 'Another Test Group of Properties'
    };
    var disabledGroup = {
        id: 'disabled.testGroup',
        title: 'Hidden Group of Properties'
    };
    var apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    var infoDrawer = new InfoDrawer();
    var metadataCard = new MetadataCard();
    var loginPage = new LoginPage();
    var page = new BrowsingPage();
    beforeAll(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apis.admin.people.createUser({ username: username })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apis.user.nodes.createImage(file)];
                case 2:
                    fileId = (_a.sent()).entry.id;
                    return [4 /*yield*/, loginPage.load()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, Utils.setSessionStorageFromConfig(EXTENSIBILITY_CONFIGS.METADATA_PRESETS)];
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
                case 0: return [4 /*yield*/, page.refresh()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.dataTable.selectItem(file)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, page.toolbar.clickViewDetails()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, infoDrawer.waitForInfoDrawerToOpen()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, infoDrawer.clickTab(properties_tab.title)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, metadataCard.clickExpandButton()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, metadataCard.waitForFirstExpansionPanel()];
                case 7:
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
    it('Set groups of properties to display - [C286636]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, metadataCard.isExpansionPanelPresent(0)];
                case 1:
                    _a.apply(void 0, [_e.sent()]).toBe(true, "expansion panel is not present");
                    _b = expect;
                    return [4 /*yield*/, metadataCard.getComponentIdOfPanel(0)];
                case 2:
                    _b.apply(void 0, [_e.sent()]).toEqual("adf-metadata-group-" + customGroup1.title);
                    _c = expect;
                    return [4 /*yield*/, metadataCard.isExpansionPanelPresent(1)];
                case 3:
                    _c.apply(void 0, [_e.sent()]).toBe(true, "expansion panel is not present");
                    _d = expect;
                    return [4 /*yield*/, metadataCard.getComponentIdOfPanel(1)];
                case 4:
                    _d.apply(void 0, [_e.sent()]).toEqual("adf-metadata-group-" + customGroup2.title);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Disabled group is not displayed - [C286637]', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, metadataCard.isExpansionPanelPresent(2)];
                case 1:
                    _a.apply(void 0, [_d.sent()]).toBe(false, "disabled group is displayed");
                    _b = expect;
                    return [4 /*yield*/, metadataCard.getComponentIdOfPanel(1)];
                case 2:
                    _b.apply(void 0, [_d.sent()]).not.toEqual("adf-metadata-group-" + disabledGroup.title);
                    _c = expect;
                    return [4 /*yield*/, metadataCard.getComponentIdOfPanel(0)];
                case 3:
                    _c.apply(void 0, [_d.sent()]).not.toEqual("adf-metadata-group-" + disabledGroup.title);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=ext-metadata.test.js.map