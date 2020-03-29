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
import { by, browser, ExpectedConditions as EC } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';
import { Utils } from '../../utilities/utils';
var Menu = /** @class */ (function (_super) {
    tslib_1.__extends(Menu, _super);
    function Menu(ancestor) {
        var _this = _super.call(this, Menu.selectors.root, ancestor) || this;
        _this.items = _this.component.all(by.css(Menu.selectors.item));
        _this.backdrop = browser.element(by.css('.cdk-overlay-backdrop'));
        _this.uploadFilesInput = browser.element(by.id(Menu.selectors.uploadFilesInput));
        _this.submenus = browser.element.all(by.css(Menu.selectors.submenu));
        _this.uploadFileAction = _this.component.element(by.id(Menu.selectors.uploadFile));
        _this.uploadFolderAction = _this.component.element(by.id(Menu.selectors.uploadFolder));
        _this.createFolderAction = _this.component.element(by.id(Menu.selectors.createFolder));
        _this.createLibraryAction = _this.component.element(by.id(Menu.selectors.createLibrary));
        _this.createFileFromTemplateAction = _this.component.element(by.id(Menu.selectors.createFileFromTemplate));
        _this.createFolderFromTemplateAction = _this.component.element(by.id(Menu.selectors.createFolderFromTemplate));
        _this.cancelEditingAction = _this.component.element(by.css(Menu.selectors.cancelEditing));
        _this.cancelJoinAction = _this.component.element(by.cssContainingText(Menu.selectors.item, 'Cancel Join'));
        _this.copyAction = _this.component.element(by.cssContainingText(Menu.selectors.item, 'Copy'));
        _this.deleteAction = _this.component.element(by.cssContainingText(Menu.selectors.item, 'Delete'));
        _this.downloadAction = _this.component.element(by.cssContainingText(Menu.selectors.item, 'Download'));
        _this.editFolderAction = _this.component.element(by.css(Menu.selectors.editFolder));
        _this.editOfflineAction = _this.component.element(by.css(Menu.selectors.editOffline));
        _this.favoriteAction = _this.component.element(by.css(Menu.selectors.favoriteAction));
        _this.removeFavoriteAction = _this.component.element(by.css(Menu.selectors.removeFavoriteAction));
        _this.toggleFavoriteAction = _this.component.element(by.cssContainingText(Menu.selectors.item, 'Favorite'));
        _this.toggleRemoveFavoriteAction = _this.component.element(by.cssContainingText(Menu.selectors.item, 'Remove Favorite'));
        _this.joinAction = _this.component.element(by.cssContainingText(Menu.selectors.item, 'Join'));
        _this.leaveAction = _this.component.element(by.cssContainingText(Menu.selectors.item, 'Leave'));
        _this.managePermissionsAction = _this.component.element(by.cssContainingText(Menu.selectors.item, 'Permissions'));
        _this.manageVersionsAction = _this.component.element(by.cssContainingText(Menu.selectors.item, 'Manage Versions'));
        _this.uploadNewVersionAction = _this.component.element(by.cssContainingText(Menu.selectors.item, 'Upload New Version'));
        _this.moveAction = _this.component.element(by.cssContainingText(Menu.selectors.item, 'Move'));
        _this.permanentDeleteAction = _this.component.element(by.cssContainingText(Menu.selectors.item, 'Permanently Delete'));
        _this.restoreAction = _this.component.element(by.cssContainingText(Menu.selectors.item, 'Restore'));
        _this.shareAction = _this.component.element(by.cssContainingText(Menu.selectors.item, 'Share'));
        _this.shareEditAction = _this.component.element(by.cssContainingText(Menu.selectors.item, 'Shared Link Settings'));
        _this.viewAction = _this.component.element(by.cssContainingText(Menu.selectors.item, 'View'));
        _this.viewDetailsAction = _this.component.element(by.cssContainingText(Menu.selectors.item, 'View Details'));
        return _this;
    }
    Menu.prototype.waitForMenuToOpen = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.presenceOf(browser.element(by.css('.cdk-overlay-container .mat-menu-panel'))), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser.wait(EC.visibilityOf(this.items.get(0)), BROWSER_WAIT_TIMEOUT)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Menu.prototype.waitForMenuToClose = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.not(EC.presenceOf(browser.element(by.css('.cdk-overlay-container .mat-menu-panel')))), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Menu.prototype.closeMenu = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.waitForMenuToClose()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Menu.prototype.getNthItem = function (nth) {
        return this.items.get(nth - 1);
    };
    Menu.prototype.getItemByLabel = function (menuItem) {
        return this.component.element(by.cssContainingText(Menu.selectors.item, menuItem));
    };
    Menu.prototype.getSubItemByLabel = function (subMenuItem) {
        return this.component.element(by.cssContainingText(Menu.selectors.submenu, subMenuItem));
    };
    Menu.prototype.getItemById = function (id) {
        return this.component.element(by.id(id));
    };
    Menu.prototype.getItemTooltip = function (menuItem) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getItemByLabel(menuItem).getAttribute('title')];
            });
        });
    };
    Menu.prototype.getTooltipForUploadFile = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getItemTooltip('Upload File')];
            });
        });
    };
    Menu.prototype.getTooltipForUploadFolder = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getItemTooltip('Upload Folder')];
            });
        });
    };
    Menu.prototype.getTooltipForCreateFolder = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getItemTooltip('Create Folder')];
            });
        });
    };
    Menu.prototype.getTooltipForCreateLibrary = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getItemTooltip('Create Library')];
            });
        });
    };
    Menu.prototype.getTooltipForCreateFileFromTemplate = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getItemTooltip('Create file from template')];
            });
        });
    };
    Menu.prototype.getItemIconText = function (menuItem) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getItemByLabel(menuItem).element(by.css(Menu.selectors.icon)).getText()];
            });
        });
    };
    Menu.prototype.getItemIdAttribute = function (menuItem) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getItemByLabel(menuItem).getAttribute('id')];
            });
        });
    };
    Menu.prototype.getItemsCount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.items.count()];
            });
        });
    };
    Menu.prototype.getMenuItems = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.items.map(function (elem) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var span;
                            return tslib_1.__generator(this, function (_a) {
                                span = elem.element(by.css('span'));
                                return [2 /*return*/, span.getText()];
                            });
                        }); })];
                    case 1:
                        items = _a.sent();
                        return [2 /*return*/, items];
                }
            });
        });
    };
    Menu.prototype.clickNthItem = function (nth) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var elem, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        elem = this.getNthItem(nth);
                        return [4 /*yield*/, browser.wait(EC.elementToBeClickable(elem), BROWSER_WAIT_TIMEOUT, 'timeout waiting for menu item to be clickable')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser.actions().mouseMove(elem).perform()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, browser.actions().click().perform()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.waitForMenuToClose()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        console.log('____ click nth menu item catch ___', e_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Menu.prototype.clickMenuItem = function (menuItem) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var elem, e_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        elem = this.getItemByLabel(menuItem);
                        return [4 /*yield*/, browser.wait(EC.elementToBeClickable(elem), BROWSER_WAIT_TIMEOUT, 'timeout waiting for menu item to be clickable')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, elem.click()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        console.log('___click menu item catch___', e_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Menu.prototype.mouseOverMenuItem = function (menuItem) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var elem, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        elem = this.getItemByLabel(menuItem);
                        return [4 /*yield*/, browser.wait(EC.elementToBeClickable(elem), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser.actions().mouseMove(elem).perform()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, browser.sleep(500)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.log('----- mouse over error: ', error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Menu.prototype.hasSubMenu = function (menuItem) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var elem, elemClass, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        elem = this.getItemByLabel(menuItem);
                        return [4 /*yield*/, browser.wait(EC.elementToBeClickable(elem), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, elem.getAttribute('class')];
                    case 2:
                        elemClass = _a.sent();
                        return [2 /*return*/, elemClass.includes('mat-menu-item-submenu-trigger')];
                    case 3:
                        error_2 = _a.sent();
                        console.log('---- has submenu error: ', error_2);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Menu.prototype.clickSubMenuItem = function (subMenuItem) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var elem, e_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        elem = this.getSubItemByLabel(subMenuItem);
                        return [4 /*yield*/, browser.wait(EC.elementToBeClickable(elem), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, elem.click()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _a.sent();
                        console.log('___click submenu item catch___', e_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Menu.prototype.isMenuItemPresent = function (title) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.element(by.cssContainingText(Menu.selectors.item, title)).isPresent()];
            });
        });
    };
    Menu.prototype.isSubMenuItemPresent = function (title) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.element(by.cssContainingText(Menu.selectors.submenu, title)).isPresent()];
            });
        });
    };
    Menu.prototype.getSubmenuItemsCount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.submenus.count()];
            });
        });
    };
    Menu.prototype.isMenuItemDisabled = function (title) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var item, disabled, error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        item = this.getItemByLabel(title);
                        return [4 /*yield*/, item.getAttribute('disabled')];
                    case 1:
                        disabled = _a.sent();
                        return [2 /*return*/, disabled];
                    case 2:
                        error_3 = _a.sent();
                        console.log('----- isMenuItemDisabled catch: ', error_3);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Menu.prototype.uploadFile = function () {
        return this.uploadFilesInput;
    };
    Menu.prototype.clickEditFolder = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.editFolderAction.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Menu.prototype.clickShare = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var action;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        action = this.shareAction;
                        return [4 /*yield*/, action.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Menu.prototype.clickSharedLinkSettings = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var action;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        action = this.shareEditAction;
                        return [4 /*yield*/, action.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Menu.prototype.isViewPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.viewAction.isPresent()];
            });
        });
    };
    Menu.prototype.isDownloadPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.downloadAction.isPresent()];
            });
        });
    };
    Menu.prototype.isEditFolderPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.editFolderAction.isPresent()];
            });
        });
    };
    Menu.prototype.isEditOfflinePresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.editOfflineAction.isPresent()];
            });
        });
    };
    Menu.prototype.isCancelEditingPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.cancelEditingAction.isPresent()];
            });
        });
    };
    Menu.prototype.isCopyPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.copyAction.isPresent()];
            });
        });
    };
    Menu.prototype.isMovePresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.moveAction.isPresent()];
            });
        });
    };
    Menu.prototype.isDeletePresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.deleteAction.isPresent()];
            });
        });
    };
    Menu.prototype.isManagePermissionsPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.managePermissionsAction.isPresent()];
            });
        });
    };
    Menu.prototype.isManageVersionsPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.manageVersionsAction.isPresent()];
            });
        });
    };
    Menu.prototype.isUploadNewVersionPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.uploadNewVersionAction.isPresent()];
            });
        });
    };
    Menu.prototype.isFavoritePresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.favoriteAction.isPresent()];
            });
        });
    };
    Menu.prototype.isRemoveFavoritePresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.removeFavoriteAction.isPresent()];
            });
        });
    };
    Menu.prototype.isToggleFavoritePresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.toggleFavoriteAction.isPresent()];
            });
        });
    };
    Menu.prototype.isToggleRemoveFavoritePresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.toggleRemoveFavoriteAction.isPresent()];
            });
        });
    };
    Menu.prototype.isJoinLibraryPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.joinAction.isPresent()];
            });
        });
    };
    Menu.prototype.isCancelJoinPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.cancelJoinAction.isPresent()];
            });
        });
    };
    Menu.prototype.isLeaveLibraryPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.leaveAction.isPresent()];
            });
        });
    };
    Menu.prototype.isPermanentDeletePresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.permanentDeleteAction.isPresent()];
            });
        });
    };
    Menu.prototype.isRestorePresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.restoreAction.isPresent()];
            });
        });
    };
    Menu.prototype.isSharePresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.shareAction.isPresent()];
            });
        });
    };
    Menu.prototype.isSharedLinkSettingsPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.shareEditAction.isPresent()];
            });
        });
    };
    Menu.prototype.isViewDetailsPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.viewDetailsAction.isPresent()];
            });
        });
    };
    Menu.prototype.isCreateFolderEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.createFolderAction.isPresent()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createFolderAction.isEnabled()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    Menu.prototype.isCreateLibraryEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.createLibraryAction.isPresent()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createLibraryAction.isEnabled()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    Menu.prototype.isUploadFileEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.uploadFileAction.isPresent()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.uploadFileAction.isEnabled()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    Menu.prototype.isUploadFolderEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.uploadFolderAction.isPresent()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.uploadFolderAction.isEnabled()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    Menu.prototype.isCreateFileFromTemplateEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.createFileFromTemplateAction.isPresent()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createFileFromTemplateAction.isEnabled()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    Menu.prototype.isCreateFolderFromTemplateEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.createFolderFromTemplateAction.isPresent()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createFolderFromTemplateAction.isEnabled()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    Menu.prototype.clickCreateFolder = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var action;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        action = this.createFolderAction;
                        return [4 /*yield*/, action.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Menu.prototype.clickCreateLibrary = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var action;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        action = this.createLibraryAction;
                        return [4 /*yield*/, action.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Menu.prototype.clickCreateFileFromTemplate = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var action;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        action = this.createFileFromTemplateAction;
                        return [4 /*yield*/, action.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Menu.prototype.clickCreateFolderFromTemplate = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var action;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        action = this.createFolderFromTemplateAction;
                        return [4 /*yield*/, action.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Menu.selectors = {
        root: '.mat-menu-panel',
        item: '.mat-menu-item',
        icon: '.mat-icon',
        uploadFilesInput: 'app-upload-files',
        uploadFile: 'app.create.uploadFile',
        uploadFolder: 'app.create.uploadFolder',
        createFolder: 'app.create.folder',
        createLibrary: 'app.create.library',
        createFileFromTemplate: 'app.create.fileFromTemplate',
        createFolderFromTemplate: 'app.create.folderFromTemplate',
        submenu: 'app-context-menu-item .mat-menu-item',
        editFolder: ".mat-menu-item[id$='editFolder']",
        favoriteAction: ".mat-menu-item[id$='favorite.add']",
        removeFavoriteAction: ".mat-menu-item[id$='favorite.remove']",
        editOffline: ".mat-menu-item[title='Edit Offline']",
        cancelEditing: ".mat-menu-item[title='Cancel Editing']"
    };
    return Menu;
}(Component));
export { Menu };
//# sourceMappingURL=menu.js.map