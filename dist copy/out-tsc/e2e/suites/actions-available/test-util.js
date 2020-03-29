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
import * as tslib_1 from "tslib";
import { BrowsingPage } from '../../pages/pages';
import { Viewer } from '../../components/viewer/viewer';
import { Utils } from '../../utilities/utils';
var page = new BrowsingPage();
var dataTable = page.dataTable, toolbar = page.toolbar;
var contextMenu = dataTable.menu;
var viewer = new Viewer();
var viewerToolbar = viewer.toolbar;
export function checkContextMenu(item, expectedContextMenu) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var actualActions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dataTable.rightClickOnItem(item)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contextMenu.getMenuItems()];
                case 2:
                    actualActions = _a.sent();
                    expect(actualActions).toEqual(expectedContextMenu);
                    return [4 /*yield*/, Utils.pressEscape()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function checkToolbarPrimary(item, expectedToolbarPrimary) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var actualPrimaryActions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dataTable.selectItem(item)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, toolbar.getButtons()];
                case 2:
                    actualPrimaryActions = _a.sent();
                    expect(actualPrimaryActions).toEqual(expectedToolbarPrimary);
                    return [2 /*return*/];
            }
        });
    });
}
export function checkToolbarMoreActions(item, expectedToolbarMore) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var actualMoreActions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dataTable.selectItem(item)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, toolbar.openMoreMenu()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, toolbar.menu.getMenuItems()];
                case 3:
                    actualMoreActions = _a.sent();
                    expect(actualMoreActions).toEqual(expectedToolbarMore);
                    return [4 /*yield*/, toolbar.closeMoreMenu()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function checkToolbarActions(item, expectedToolbarPrimary, expectedToolbarMore) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var actualPrimaryActions, actualMoreActions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dataTable.selectItem(item)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, toolbar.getButtons()];
                case 2:
                    actualPrimaryActions = _a.sent();
                    expect(actualPrimaryActions).toEqual(expectedToolbarPrimary);
                    return [4 /*yield*/, toolbar.openMoreMenu()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, toolbar.menu.getMenuItems()];
                case 4:
                    actualMoreActions = _a.sent();
                    expect(actualMoreActions).toEqual(expectedToolbarMore);
                    return [4 /*yield*/, toolbar.closeMoreMenu()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function checkMultipleSelContextMenu(items, expectedContextMenu) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var actualActions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dataTable.selectMultipleItems(items)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dataTable.rightClickOnMultipleSelection()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, contextMenu.getMenuItems()];
                case 3:
                    actualActions = _a.sent();
                    expect(actualActions).toEqual(expectedContextMenu);
                    return [4 /*yield*/, Utils.pressEscape()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function checkMultipleSelToolbarPrimary(items, expectedToolbarPrimary) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var actualPrimaryActions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dataTable.selectMultipleItems(items)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, toolbar.getButtons()];
                case 2:
                    actualPrimaryActions = _a.sent();
                    expect(actualPrimaryActions).toEqual(expectedToolbarPrimary);
                    return [2 /*return*/];
            }
        });
    });
}
export function checkMultipleSelToolbarActions(items, expectedToolbarPrimary, expectedToolbarMore) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var actualPrimaryActions, actualMoreActions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dataTable.selectMultipleItems(items)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, toolbar.getButtons()];
                case 2:
                    actualPrimaryActions = _a.sent();
                    expect(actualPrimaryActions).toEqual(expectedToolbarPrimary);
                    return [4 /*yield*/, toolbar.openMoreMenu()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, toolbar.menu.getMenuItems()];
                case 4:
                    actualMoreActions = _a.sent();
                    expect(actualMoreActions).toEqual(expectedToolbarMore);
                    return [4 /*yield*/, toolbar.closeMoreMenu()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function checkViewerActions(item, expectedToolbarPrimary, expectedToolbarMore) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var actualPrimaryActions, actualMoreActions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dataTable.selectItem(item)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, toolbar.clickView()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewer.waitForViewerToOpen()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerToolbar.getButtons()];
                case 4:
                    actualPrimaryActions = _a.sent();
                    actualPrimaryActions = removeClosePreviousNextOldInfo(actualPrimaryActions);
                    expect(actualPrimaryActions).toEqual(expectedToolbarPrimary);
                    return [4 /*yield*/, viewerToolbar.openMoreMenu()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, viewerToolbar.menu.getMenuItems()];
                case 6:
                    actualMoreActions = _a.sent();
                    expect(actualMoreActions).toEqual(expectedToolbarMore);
                    return [4 /*yield*/, toolbar.closeMoreMenu()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, Utils.pressEscape()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var toRemove = ['Close', 'Previous File', 'Next File', 'View details'];
function removeClosePreviousNextOldInfo(actions) {
    return actions.filter(function (elem) { return !toRemove.includes(elem); });
}
//# sourceMappingURL=test-util.js.map