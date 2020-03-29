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
import { GenericDialog } from '../dialog/generic-dialog';
var UploadNewVersionDialog = /** @class */ (function (_super) {
    tslib_1.__extends(UploadNewVersionDialog, _super);
    function UploadNewVersionDialog() {
        var _this = _super.call(this, UploadNewVersionDialog.selectors.root) || this;
        _this.majorOption = _this.rootElem.element(by.cssContainingText(UploadNewVersionDialog.selectors.radioButton, 'Major'));
        _this.minorOption = _this.rootElem.element(by.cssContainingText(UploadNewVersionDialog.selectors.radioButton, 'Minor'));
        _this.description = _this.rootElem.element(by.css(UploadNewVersionDialog.selectors.descriptionTextArea));
        return _this;
    }
    UploadNewVersionDialog.prototype.isDescriptionDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.description.isDisplayed()];
            });
        });
    };
    UploadNewVersionDialog.prototype.isMinorOptionDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.minorOption.isDisplayed()];
            });
        });
    };
    UploadNewVersionDialog.prototype.isMajorOptionDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.majorOption.isDisplayed()];
            });
        });
    };
    UploadNewVersionDialog.prototype.isCancelButtonEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled(UploadNewVersionDialog.selectors.cancelButton)];
            });
        });
    };
    UploadNewVersionDialog.prototype.isUploadButtonEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled(UploadNewVersionDialog.selectors.uploadButton)];
            });
        });
    };
    UploadNewVersionDialog.prototype.clickCancel = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton(UploadNewVersionDialog.selectors.cancelButton)];
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
    UploadNewVersionDialog.prototype.clickUpload = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton(UploadNewVersionDialog.selectors.uploadButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadNewVersionDialog.prototype.clickMajor = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.majorOption.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadNewVersionDialog.prototype.clickMinor = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.minorOption.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadNewVersionDialog.prototype.enterDescription = function (description) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.description.clear()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.description.sendKeys(description)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadNewVersionDialog.selectors = {
        root: '.aca-node-version-upload-dialog',
        cancelButton: by.cssContainingText('.mat-button', 'Cancel'),
        uploadButton: by.cssContainingText('.mat-button', 'Upload'),
        radioButton: ".mat-radio-label",
        descriptionTextArea: 'textarea'
    };
    return UploadNewVersionDialog;
}(GenericDialog));
export { UploadNewVersionDialog };
//# sourceMappingURL=upload-new-version-dialog.js.map