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
import { by, protractor, browser, ExpectedConditions as EC } from 'protractor';
import { GenericDialog } from '../dialog/generic-dialog';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
var CreateLibraryDialog = /** @class */ (function (_super) {
    tslib_1.__extends(CreateLibraryDialog, _super);
    function CreateLibraryDialog() {
        var _this = _super.call(this, CreateLibraryDialog.selectors.root) || this;
        _this.nameInput = _this.rootElem.element(by.css(CreateLibraryDialog.selectors.nameInput));
        _this.libraryIdInput = _this.rootElem.element(by.css(CreateLibraryDialog.selectors.libraryIdInput));
        _this.descriptionTextArea = _this.rootElem.element(by.css(CreateLibraryDialog.selectors.descriptionTextArea));
        _this.visibilityPublic = _this.rootElem.element(by.cssContainingText(CreateLibraryDialog.selectors.radioButton, 'Public'));
        _this.visibilityModerated = _this.rootElem.element(by.cssContainingText(CreateLibraryDialog.selectors.radioButton, 'Moderated'));
        _this.visibilityPrivate = _this.rootElem.element(by.cssContainingText(CreateLibraryDialog.selectors.radioButton, 'Private'));
        _this.errorMessage = _this.rootElem.element(by.css(CreateLibraryDialog.selectors.errorMessage));
        return _this;
    }
    CreateLibraryDialog.prototype.waitForDialogToOpen = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.waitForDialogToOpen.call(this)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser.wait(EC.elementToBeClickable(this.nameInput), BROWSER_WAIT_TIMEOUT, '--- timeout waiting for input to be clickable ---')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.isErrorMessageDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.errorMessage.isDisplayed()];
            });
        });
    };
    CreateLibraryDialog.prototype.getErrorMessage = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isErrorMessageDisplayed()];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, this.errorMessage.getText()];
                        }
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.isNameDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.nameInput.isDisplayed()];
            });
        });
    };
    CreateLibraryDialog.prototype.isLibraryIdDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.libraryIdInput.isDisplayed()];
            });
        });
    };
    CreateLibraryDialog.prototype.isDescriptionDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.descriptionTextArea.isDisplayed()];
            });
        });
    };
    CreateLibraryDialog.prototype.isPublicDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.visibilityPublic.isDisplayed()];
            });
        });
    };
    CreateLibraryDialog.prototype.isModeratedDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.visibilityModerated.isDisplayed()];
            });
        });
    };
    CreateLibraryDialog.prototype.isPrivateDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.visibilityPrivate.isDisplayed()];
            });
        });
    };
    CreateLibraryDialog.prototype.enterName = function (name) {
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
    CreateLibraryDialog.prototype.enterLibraryId = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.libraryIdInput.clear()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.libraryIdInput.sendKeys(id)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.enterDescription = function (description) {
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
    CreateLibraryDialog.prototype.deleteNameWithBackspace = function () {
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
    CreateLibraryDialog.prototype.isCreateEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled(CreateLibraryDialog.selectors.createButton)];
            });
        });
    };
    CreateLibraryDialog.prototype.isCancelEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled(CreateLibraryDialog.selectors.cancelButton)];
            });
        });
    };
    CreateLibraryDialog.prototype.clickCreate = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton(CreateLibraryDialog.selectors.createButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.clickCancel = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton(CreateLibraryDialog.selectors.cancelButton)];
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
    CreateLibraryDialog.prototype.isPublicChecked = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var elemClass;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.visibilityPublic.element(by.xpath('..')).getAttribute('class')];
                    case 1:
                        elemClass = _a.sent();
                        return [2 /*return*/, elemClass.includes(CreateLibraryDialog.selectors.radioChecked)];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.isModeratedChecked = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var elemClass;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.visibilityModerated.element(by.xpath('..')).getAttribute('class')];
                    case 1:
                        elemClass = _a.sent();
                        return [2 /*return*/, elemClass.includes(CreateLibraryDialog.selectors.radioChecked)];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.isPrivateChecked = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var elemClass;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.visibilityPrivate.element(by.xpath('..')).getAttribute('class')];
                    case 1:
                        elemClass = _a.sent();
                        return [2 /*return*/, elemClass.includes(CreateLibraryDialog.selectors.radioChecked)];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.selectPublic = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.visibilityPublic.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.selectModerated = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.visibilityModerated.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.selectPrivate = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.visibilityPrivate.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateLibraryDialog.selectors = {
        root: 'adf-library-dialog',
        nameInput: 'input[placeholder="Name" i]',
        libraryIdInput: 'input[placeholder="Library ID" i]',
        descriptionTextArea: 'textarea[placeholder="Description" i]',
        radioButton: '.mat-radio-label',
        radioChecked: 'mat-radio-checked',
        errorMessage: '.mat-error',
        createButton: by.cssContainingText('.mat-dialog-actions button', 'Create'),
        cancelButton: by.cssContainingText('.mat-dialog-actions button', 'Cancel')
    };
    return CreateLibraryDialog;
}(GenericDialog));
export { CreateLibraryDialog };
//# sourceMappingURL=create-library-dialog.js.map