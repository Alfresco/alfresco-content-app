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
import { by, protractor } from 'protractor';
import { GenericDialog } from '../dialog/generic-dialog';
var CreateFromTemplateDialog = /** @class */ (function (_super) {
    tslib_1.__extends(CreateFromTemplateDialog, _super);
    function CreateFromTemplateDialog() {
        var _this = _super.call(this, CreateFromTemplateDialog.selectors.root) || this;
        _this.nameInput = _this.rootElem.element(by.css(CreateFromTemplateDialog.selectors.nameInput));
        _this.titleInput = _this.rootElem.element(by.css(CreateFromTemplateDialog.selectors.titleInput));
        _this.descriptionTextArea = _this.rootElem.element(by.css(CreateFromTemplateDialog.selectors.descriptionTextArea));
        _this.validationMessage = _this.rootElem.element(by.css(CreateFromTemplateDialog.selectors.validationMessage));
        return _this;
    }
    CreateFromTemplateDialog.prototype.isValidationMessageDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.validationMessage.isPresent()];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.validationMessage.isDisplayed()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    CreateFromTemplateDialog.prototype.isCreateButtonEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled(CreateFromTemplateDialog.selectors.createButton)];
            });
        });
    };
    CreateFromTemplateDialog.prototype.isCancelButtonEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled(CreateFromTemplateDialog.selectors.cancelButton)];
            });
        });
    };
    CreateFromTemplateDialog.prototype.isNameFieldDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.nameInput.isDisplayed()];
            });
        });
    };
    CreateFromTemplateDialog.prototype.isTitleFieldDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.titleInput.isDisplayed()];
            });
        });
    };
    CreateFromTemplateDialog.prototype.isDescriptionFieldDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.descriptionTextArea.isDisplayed()];
            });
        });
    };
    CreateFromTemplateDialog.prototype.getValidationMessage = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isValidationMessageDisplayed()];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, this.validationMessage.getText()];
                        }
                        else {
                            return [2 /*return*/, ''];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateFromTemplateDialog.prototype.getName = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.nameInput.getAttribute('value')];
            });
        });
    };
    CreateFromTemplateDialog.prototype.getDescription = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.descriptionTextArea.getAttribute('value')];
            });
        });
    };
    CreateFromTemplateDialog.prototype.enterName = function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nameInput.clear()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.nameInput.sendKeys(name)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateFromTemplateDialog.prototype.enterTitle = function (title) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.titleInput.clear()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.titleInput.sendKeys(title)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateFromTemplateDialog.prototype.enterDescription = function (description) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.descriptionTextArea.clear()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.descriptionTextArea.sendKeys(description)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateFromTemplateDialog.prototype.deleteNameWithBackspace = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nameInput.clear()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.nameInput.sendKeys(' ', protractor.Key.CONTROL, 'a', protractor.Key.NULL, protractor.Key.BACK_SPACE)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateFromTemplateDialog.prototype.clickCreate = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton(CreateFromTemplateDialog.selectors.createButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateFromTemplateDialog.prototype.clickCancel = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton(CreateFromTemplateDialog.selectors.cancelButton)];
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
    CreateFromTemplateDialog.selectors = {
        root: '.aca-create-from-template-dialog',
        nameInput: 'input[placeholder="Name" i]',
        titleInput: 'input[placeholder="Title" i]',
        descriptionTextArea: 'textarea[placeholder="Description" i]',
        validationMessage: '.mat-error',
        createButton: by.cssContainingText('.mat-dialog-actions button', 'Create'),
        cancelButton: by.cssContainingText('.mat-dialog-actions button', 'CANCEL')
    };
    return CreateFromTemplateDialog;
}(GenericDialog));
export { CreateFromTemplateDialog };
//# sourceMappingURL=create-from-template-dialog.js.map