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
var ConfirmDialog = /** @class */ (function (_super) {
    tslib_1.__extends(ConfirmDialog, _super);
    function ConfirmDialog() {
        return _super.call(this, ConfirmDialog.selectors.root) || this;
    }
    ConfirmDialog.prototype.getText = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.content.getText()];
            });
        });
    };
    ConfirmDialog.prototype.isOkEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled(ConfirmDialog.selectors.okButton)];
            });
        });
    };
    ConfirmDialog.prototype.isCancelEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled(ConfirmDialog.selectors.cancelButton)];
            });
        });
    };
    ConfirmDialog.prototype.isKeepEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled(ConfirmDialog.selectors.keepButton)];
            });
        });
    };
    ConfirmDialog.prototype.isDeleteEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled(ConfirmDialog.selectors.deleteButton)];
            });
        });
    };
    ConfirmDialog.prototype.isRemoveEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled(ConfirmDialog.selectors.removeButton)];
            });
        });
    };
    ConfirmDialog.prototype.clickOk = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton(ConfirmDialog.selectors.okButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ConfirmDialog.prototype.clickCancel = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton(ConfirmDialog.selectors.cancelButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ConfirmDialog.prototype.clickKeep = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton(ConfirmDialog.selectors.keepButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ConfirmDialog.prototype.clickDelete = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton(ConfirmDialog.selectors.deleteButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ConfirmDialog.prototype.clickRemove = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton(ConfirmDialog.selectors.removeButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ConfirmDialog.selectors = {
        root: 'adf-confirm-dialog',
        okButton: by.buttonText('OK'),
        cancelButton: by.buttonText('Cancel'),
        keepButton: by.buttonText('Keep'),
        deleteButton: by.buttonText('Delete'),
        removeButton: by.buttonText('Remove')
    };
    return ConfirmDialog;
}(GenericDialog));
export { ConfirmDialog };
//# sourceMappingURL=confirm-dialog.js.map