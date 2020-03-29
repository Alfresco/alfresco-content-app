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
import { by, browser } from 'protractor';
import { Menu } from '../menu/menu';
import { Component } from '../component';
import { Utils } from '../../utilities/utils';
var Toolbar = /** @class */ (function (_super) {
    tslib_1.__extends(Toolbar, _super);
    function Toolbar(ancestor) {
        var _this = _super.call(this, Toolbar.selectors.root, ancestor) || this;
        _this.menu = new Menu();
        _this.buttons = _this.component.all(by.css(Toolbar.selectors.button));
        _this.shareButton = _this.component.element(by.css(Toolbar.selectors.share));
        _this.shareEditButton = _this.component.element(by.css(Toolbar.selectors.shareEdit));
        _this.viewButton = _this.component.element(by.css(Toolbar.selectors.view));
        _this.searchFiltersToggleButton = _this.component.element(by.css(Toolbar.selectors.searchFilterToggle));
        _this.downloadButton = _this.component.element(by.css(Toolbar.selectors.download));
        _this.editFolderButton = _this.component.element(by.id(Toolbar.selectors.editFolder));
        _this.viewDetailsButton = _this.component.element(by.css(Toolbar.selectors.viewDetails));
        _this.printButton = _this.component.element(by.css(Toolbar.selectors.print));
        _this.fullScreenButton = _this.component.element(by.css(Toolbar.selectors.fullScreen));
        _this.joinButton = _this.component.element(by.css(Toolbar.selectors.joinLibrary));
        _this.leaveButton = _this.component.element(by.css(Toolbar.selectors.leaveLibrary));
        _this.permanentlyDeleteButton = _this.component.element(by.css(Toolbar.selectors.permanentlyDelete));
        _this.restoreButton = _this.component.element(by.css(Toolbar.selectors.restore));
        return _this;
    }
    Toolbar.prototype.isEmpty = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var count;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buttons.count()];
                    case 1:
                        count = _a.sent();
                        return [2 /*return*/, count === 0];
                }
            });
        });
    };
    Toolbar.prototype.numberOfAvailableActions = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.buttons.count()];
            });
        });
    };
    Toolbar.prototype.getButtons = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.buttons.map(function (elem) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, elem.getAttribute('title')];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })];
            });
        });
    };
    Toolbar.prototype.isButtonPresent = function (title) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var elem;
            return tslib_1.__generator(this, function (_a) {
                elem = this.component.element(by.css(Toolbar.selectors.button + "[title=\"" + title + "\"]"));
                return [2 /*return*/, elem.isPresent()];
            });
        });
    };
    Toolbar.prototype.getButtonByLabel = function (label) {
        return this.component.element(by.cssContainingText(Toolbar.selectors.button, label));
    };
    Toolbar.prototype.getButtonByTitleAttribute = function (title) {
        return this.component.element(by.css(Toolbar.selectors.button + "[title=\"" + title + "\"]"));
    };
    Toolbar.prototype.getButtonById = function (id) {
        return this.component.element(by.id(id));
    };
    Toolbar.prototype.openMoreMenu = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var moreMenu;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isButtonPresent('More Actions')];
                    case 1:
                        _a.sent();
                        moreMenu = this.getButtonByTitleAttribute('More Actions');
                        return [4 /*yield*/, moreMenu.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.menu.waitForMenuToOpen()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.closeMoreMenu = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.pressEscape()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.getButtonTooltip = function (button) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, button.getAttribute('title')];
            });
        });
    };
    Toolbar.prototype.clickButton = function (title) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var btn;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        btn = this.getButtonByTitleAttribute(title);
                        return [4 /*yield*/, btn.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.isSharedLinkSettingsPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.shareEditButton)];
            });
        });
    };
    Toolbar.prototype.isSharePresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.shareButton)];
            });
        });
    };
    Toolbar.prototype.isViewPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.viewButton)];
            });
        });
    };
    Toolbar.prototype.isToggleSearchFiltersPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.searchFiltersToggleButton)];
            });
        });
    };
    Toolbar.prototype.isDownloadPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.downloadButton)];
            });
        });
    };
    Toolbar.prototype.isPermanentlyDeletePresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.permanentlyDeleteButton)];
            });
        });
    };
    Toolbar.prototype.isRestorePresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.restoreButton)];
            });
        });
    };
    Toolbar.prototype.isEditFolderPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.editFolderButton)];
            });
        });
    };
    Toolbar.prototype.isViewDetailsPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.viewDetailsButton)];
            });
        });
    };
    Toolbar.prototype.isPrintPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.printButton)];
            });
        });
    };
    Toolbar.prototype.isFullScreenPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.fullScreenButton)];
            });
        });
    };
    Toolbar.prototype.clickShare = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var btn;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        btn = this.shareButton;
                        return [4 /*yield*/, btn.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.clickSharedLinkSettings = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var btn;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        btn = this.shareEditButton;
                        return [4 /*yield*/, btn.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.clickView = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.viewButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.clickEditFolder = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.editFolderButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.clickViewDetails = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.viewDetailsButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.clickDownload = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.downloadButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.clickJoin = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.joinButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.clickLeave = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.leaveButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.clickPermanentlyDelete = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.permanentlyDeleteButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.clickRestore = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.restoreButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.clickMoreActionsFavorite = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openMoreMenu()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.menu.clickMenuItem('Favorite')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.clickMoreActionsRemoveFavorite = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openMoreMenu()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.menu.clickMenuItem('Remove Favorite')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.clickMoreActionsDelete = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openMoreMenu()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.menu.clickMenuItem('Delete')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.clickMoreActionsManageVersions = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openMoreMenu()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.menu.clickMenuItem('Manage Versions')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.clickMoreActionsMove = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openMoreMenu()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.menu.clickMenuItem('Move')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.clickMoreActionsCopy = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openMoreMenu()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.menu.clickMenuItem('Copy')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.clickMoreActionsEditOffline = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openMoreMenu()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.menu.clickMenuItem('Edit Offline')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.clickMoreActionsCancelEditing = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openMoreMenu()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.menu.clickMenuItem('Cancel Editing')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.clickMoreActionsUploadNewVersion = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openMoreMenu()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.menu.clickMenuItem('Upload New Version')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.prototype.clickFullScreen = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fullScreenButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Toolbar.selectors = {
        root: '.adf-toolbar',
        button: 'button',
        share: ".mat-icon-button[title='Share']",
        shareEdit: ".mat-icon-button[title='Shared Link Settings']",
        view: ".mat-icon-button[title='View']",
        searchFilterToggle: ".mat-icon-button[title='Toggle search filter']",
        download: ".mat-icon-button[title='Download']",
        editFolder: 'app.toolbar.editFolder',
        viewDetails: ".mat-icon-button[title='View Details']",
        print: ".mat-icon-button[title='Print']",
        fullScreen: ".mat-icon-button[title='Activate full-screen mode']",
        joinLibrary: ".mat-icon-button[title='Join']",
        leaveLibrary: ".mat-icon-button[title='Leave Library']",
        permanentlyDelete: ".mat-icon-button[title='Permanently Delete']",
        restore: ".mat-icon-button[title='Restore']"
    };
    return Toolbar;
}(Component));
export { Toolbar };
//# sourceMappingURL=toolbar.js.map