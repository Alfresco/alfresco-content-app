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
import { Toolbar } from '../toolbar/toolbar';
var Viewer = /** @class */ (function (_super) {
    tslib_1.__extends(Viewer, _super);
    function Viewer(ancestor) {
        var _this = _super.call(this, Viewer.selectors.root, ancestor) || this;
        _this.root = browser.$(Viewer.selectors.root);
        _this.viewerLayout = _this.component.element(by.css(Viewer.selectors.layout));
        _this.viewerContainer = _this.component.element(by.css(Viewer.selectors.contentContainer));
        _this.closeButton = _this.component.element(by.css(Viewer.selectors.closeBtn));
        _this.fileTitle = _this.component.element(by.css(Viewer.selectors.fileTitle));
        _this.viewerExtensionContent = _this.component.element(by.css(Viewer.selectors.viewerExtensionContent));
        _this.pdfViewerContentPages = _this.component.all(by.css(Viewer.selectors.pdfViewerContentPage));
        _this.toolbar = new Toolbar(Viewer.selectors.root);
        return _this;
    }
    Viewer.prototype.waitForViewerToOpen = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, browser.wait(EC.presenceOf(this.viewerContainer), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log('\n-----> catch waitForViewerToOpen <-----\n', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Viewer.prototype.isViewerOpened = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.viewerLayout)];
            });
        });
    };
    Viewer.prototype.isViewerContentDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.viewerContainer)];
            });
        });
    };
    Viewer.prototype.isViewerToolbarDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.toolbar.component)];
            });
        });
    };
    Viewer.prototype.isCloseButtonDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.closeButton)];
            });
        });
    };
    Viewer.prototype.isFileTitleDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.fileTitle)];
            });
        });
    };
    Viewer.prototype.clickClose = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.closeButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Viewer.prototype.getCloseButtonTooltip = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.toolbar.getButtonTooltip(this.closeButton)];
            });
        });
    };
    Viewer.prototype.getFileTitle = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.fileTitle.getText()];
            });
        });
    };
    Viewer.prototype.isCustomContentPresent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.viewerExtensionContent)];
            });
        });
    };
    Viewer.prototype.getComponentIdOfView = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isCustomContentPresent()];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, this.viewerExtensionContent.getAttribute('data-automation-id')];
                        }
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    Viewer.prototype.isPdfViewerContentDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var count;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pdfViewerContentPages.count()];
                    case 1:
                        count = _a.sent();
                        return [2 /*return*/, count > 0];
                }
            });
        });
    };
    Viewer.selectors = {
        root: 'adf-viewer',
        layout: '.adf-viewer-layout-content',
        contentContainer: '.adf-viewer-content-container',
        closeBtn: '.adf-viewer-close-button',
        fileTitle: '.adf-viewer__file-title',
        viewerExtensionContent: 'adf-preview-extension',
        pdfViewerContentPage: '.adf-pdf-viewer__content .page'
    };
    return Viewer;
}(Component));
export { Viewer };
//# sourceMappingURL=viewer.js.map