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
import { Component } from '../component';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { CommentsTab } from './info-drawer-comments-tab';
import { LibraryMetadata } from './info-drawer-metadata-library';
import { ContentMetadata } from './info-drawer-metadata-content';
var InfoDrawer = /** @class */ (function (_super) {
    tslib_1.__extends(InfoDrawer, _super);
    function InfoDrawer(ancestor) {
        var _this = _super.call(this, InfoDrawer.selectors.root, ancestor) || this;
        _this.commentsTab = new CommentsTab(InfoDrawer.selectors.root);
        _this.aboutTab = new LibraryMetadata(InfoDrawer.selectors.root);
        _this.propertiesTab = new ContentMetadata(InfoDrawer.selectors.root);
        _this.header = _this.component.element(by.css(InfoDrawer.selectors.header));
        _this.headerTitle = _this.component.element(by.css(InfoDrawer.selectors.headerTitle));
        _this.tabLabel = _this.component.element(by.css(InfoDrawer.selectors.tabLabel));
        _this.tabLabelsList = _this.component.all(by.css(InfoDrawer.selectors.tabLabel));
        _this.tabActiveLabel = _this.component.element(by.css(InfoDrawer.selectors.tabActiveLabel));
        _this.tabActiveContent = _this.component.element(by.css(InfoDrawer.selectors.activeTabContent));
        _this.nextButton = _this.component.element(by.css(InfoDrawer.selectors.next));
        _this.previousButton = _this.component.element(by.css(InfoDrawer.selectors.previous));
        return _this;
    }
    InfoDrawer.prototype.waitForInfoDrawerToOpen = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.presenceOf(this.header), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    InfoDrawer.prototype.isOpen = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.header)];
            });
        });
    };
    InfoDrawer.prototype.isEmpty = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.isElementPresent(by.css(InfoDrawer.selectors.tabs))];
                    case 1: return [2 /*return*/, !(_a.sent())];
                }
            });
        });
    };
    InfoDrawer.prototype.getTabByTitle = function (title) {
        return this.component.element(by.cssContainingText(InfoDrawer.selectors.tabLabel, title));
    };
    InfoDrawer.prototype.getTabsCount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.component.all(by.css(InfoDrawer.selectors.tabLabel)).count()];
            });
        });
    };
    InfoDrawer.prototype.isTabPresent = function (title) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getTabByTitle(title).isPresent()];
            });
        });
    };
    InfoDrawer.prototype.isTabDisplayed = function (title) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.isElementPresent(this.getTabByTitle(title))];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, this.getTabByTitle(title).isDisplayed()];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    InfoDrawer.prototype.getTabTitle = function (index) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.tabLabelsList.get(index - 1).getAttribute('innerText')];
            });
        });
    };
    InfoDrawer.prototype.getActiveTabTitle = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.tabActiveLabel.getText()];
            });
        });
    };
    InfoDrawer.prototype.clickTab = function (title) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTabByTitle(title).click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    InfoDrawer.prototype.getComponentIdOfTab = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.tabActiveContent.getAttribute('data-automation-id')];
            });
        });
    };
    InfoDrawer.prototype.getHeaderTitle = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.headerTitle.getText()];
            });
        });
    };
    InfoDrawer.prototype.isAboutTabDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isTabDisplayed('About')];
            });
        });
    };
    InfoDrawer.prototype.isPropertiesTabDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isTabDisplayed('Properties')];
            });
        });
    };
    InfoDrawer.prototype.isPropertiesTabActive = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getActiveTabTitle()];
                    case 1: return [2 /*return*/, (_a.sent()) === 'PROPERTIES'];
                }
            });
        });
    };
    InfoDrawer.prototype.isCommentsTabDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isTabDisplayed('Comments')];
            });
        });
    };
    InfoDrawer.prototype.clickCommentsTab = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getTabByTitle('Comments').click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.commentsTab.waitForCommentsContainer()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, Promise.all([
                                browser.wait(EC.visibilityOf(this.commentsTab.component), BROWSER_WAIT_TIMEOUT),
                                browser.wait(EC.invisibilityOf(this.propertiesTab.component), BROWSER_WAIT_TIMEOUT)
                            ])];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error('--- info-drawer clickCommentsTab catch error: ', error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    InfoDrawer.selectors = {
        root: 'adf-info-drawer',
        header: '.adf-info-drawer-layout-header',
        content: '.adf-info-drawer-layout-content',
        tabs: '.adf-info-drawer-tabs',
        tabLabel: '.mat-tab-label-content',
        tabActiveLabel: '.mat-tab-label-active',
        activeTabContent: '.mat-tab-body-active .mat-tab-body-content adf-dynamic-tab',
        next: '.mat-tab-header-pagination-after .mat-tab-header-pagination-chevron',
        previous: '.mat-tab-header-pagination-before .mat-tab-header-pagination-chevron',
        headerTitle: '.adf-info-drawer-layout-header-title'
    };
    return InfoDrawer;
}(Component));
export { InfoDrawer };
//# sourceMappingURL=info-drawer.js.map