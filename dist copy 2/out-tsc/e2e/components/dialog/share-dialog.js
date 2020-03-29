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
import { by } from 'protractor';
import { DateTimePicker } from '../../components/datetime-picker/datetime-picker';
import { GenericDialog } from '../dialog/generic-dialog';
var ShareDialog = /** @class */ (function (_super) {
    tslib_1.__extends(ShareDialog, _super);
    function ShareDialog() {
        var _this = _super.call(this, ShareDialog.selectors.root) || this;
        _this.dateTimePicker = new DateTimePicker();
        _this.dialogTitle = _this.rootElem.element(by.css(ShareDialog.selectors.dialogTitle));
        _this.infoText = _this.rootElem.element(by.css(ShareDialog.selectors.info));
        _this.labels = _this.rootElem.all(by.css(ShareDialog.selectors.label));
        _this.shareToggle = _this.rootElem.element(by.css(ShareDialog.selectors.shareToggle));
        _this.url = _this.rootElem.element(by.css(ShareDialog.selectors.linkUrl));
        _this.urlAction = _this.rootElem.element(by.css(ShareDialog.selectors.inputAction));
        _this.expireToggle = _this.rootElem.element(by.css(ShareDialog.selectors.expireToggle));
        _this.expireInput = _this.rootElem.element(by.css(ShareDialog.selectors.expirationInput));
        _this.datetimePickerButton = _this.rootElem.element(by.css(ShareDialog.selectors.datetimePickerButton));
        return _this;
    }
    ShareDialog.prototype.getTitle = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.dialogTitle.getText()];
            });
        });
    };
    ShareDialog.prototype.getInfoText = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.infoText.getText()];
            });
        });
    };
    ShareDialog.prototype.getLabels = function () {
        return this.labels;
    };
    ShareDialog.prototype.getLinkUrl = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.url.getAttribute('value')];
            });
        });
    };
    ShareDialog.prototype.isUrlReadOnly = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var urlAttr;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.url.getAttribute('readonly')];
                    case 1:
                        urlAttr = _a.sent();
                        return [2 /*return*/, urlAttr === 'true'];
                }
            });
        });
    };
    ShareDialog.prototype.isCloseEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled(ShareDialog.selectors.closeButton)];
            });
        });
    };
    ShareDialog.prototype.clickClose = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton(ShareDialog.selectors.closeButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.waitForDialogToClose()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.getShareToggle = function () {
        return this.shareToggle;
    };
    ShareDialog.prototype.getExpireToggle = function () {
        return this.expireToggle;
    };
    ShareDialog.prototype.getExpireInput = function () {
        return this.expireInput;
    };
    ShareDialog.prototype.isShareToggleChecked = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var toggleClass;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getShareToggle().getAttribute('class')];
                    case 1:
                        toggleClass = _a.sent();
                        return [2 /*return*/, toggleClass.includes('checked')];
                }
            });
        });
    };
    ShareDialog.prototype.isShareToggleDisabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var toggleClass;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getShareToggle().getAttribute('class')];
                    case 1:
                        toggleClass = _a.sent();
                        return [2 /*return*/, toggleClass.includes('mat-disabled')];
                }
            });
        });
    };
    ShareDialog.prototype.isExpireToggleEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var toggleClass;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getExpireToggle().getAttribute('class')];
                    case 1:
                        toggleClass = _a.sent();
                        return [2 /*return*/, toggleClass.includes('checked')];
                }
            });
        });
    };
    ShareDialog.prototype.copyUrl = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.urlAction.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.openDatetimePicker = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.datetimePickerButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.closeDatetimePicker = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dateTimePicker.isCalendarOpen()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.datetimePickerButton.click()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.getExpireDate = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getExpireInput().getAttribute('value')];
            });
        });
    };
    ShareDialog.prototype.clickExpirationToggle = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.expireToggle.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.clickShareToggle = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.shareToggle.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.selectors = {
        root: '.adf-share-dialog',
        dialogTitle: "[data-automation-id='adf-share-dialog-title']",
        info: '.adf-share-link__info',
        label: '.adf-share-link__label',
        shareToggle: "[data-automation-id='adf-share-toggle']",
        linkUrl: "[data-automation-id='adf-share-link']",
        inputAction: '.adf-input-action',
        expireToggle: "[data-automation-id='adf-expire-toggle']",
        datetimePickerButton: '.mat-datetimepicker-toggle',
        expirationInput: 'input[formcontrolname="time"]',
        closeButton: by.css("[data-automation-id='adf-share-dialog-close']")
    };
    return ShareDialog;
}(GenericDialog));
export { ShareDialog };
//# sourceMappingURL=share-dialog.js.map