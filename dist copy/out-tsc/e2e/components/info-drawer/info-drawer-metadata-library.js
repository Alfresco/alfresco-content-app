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
var LibraryMetadata = /** @class */ (function (_super) {
    tslib_1.__extends(LibraryMetadata, _super);
    function LibraryMetadata(ancestor) {
        var _this = _super.call(this, LibraryMetadata.selectors.root, ancestor) || this;
        _this.metadataTabContent = _this.component.element(by.css(LibraryMetadata.selectors.metadataTabContent));
        _this.metadataTabAction = _this.component.element(by.css(LibraryMetadata.selectors.metadataTabAction));
        _this.fieldLabelWrapper = _this.component.element(by.css(LibraryMetadata.selectors.fieldLabelWrapper));
        _this.fieldInput = _this.component.element(by.css(LibraryMetadata.selectors.fieldInput));
        _this.visibilityDropDown = _this.component.element(by.css(LibraryMetadata.selectors.dropDown));
        _this.visibilityPublic = browser.element(by.cssContainingText(LibraryMetadata.selectors.visibilityOption, 'Public'));
        _this.visibilityPrivate = browser.element(by.cssContainingText(LibraryMetadata.selectors.visibilityOption, 'Private'));
        _this.visibilityModerated = browser.element(by.cssContainingText(LibraryMetadata.selectors.visibilityOption, 'Moderated'));
        _this.hint = _this.component.element(by.css(LibraryMetadata.selectors.hint));
        _this.error = _this.component.element(by.css(LibraryMetadata.selectors.error));
        return _this;
    }
    LibraryMetadata.prototype.getLabelWrapper = function (label) {
        return this.component.element(by.cssContainingText(LibraryMetadata.selectors.fieldLabelWrapper, label));
    };
    LibraryMetadata.prototype.getFieldByName = function (fieldName) {
        var wrapper = this.getLabelWrapper(fieldName);
        return wrapper.element(by.xpath('..')).element(by.css(LibraryMetadata.selectors.fieldInput));
    };
    LibraryMetadata.prototype.isFieldDisplayed = function (fieldName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.getFieldByName(fieldName))];
            });
        });
    };
    LibraryMetadata.prototype.isInputEnabled = function (fieldName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getFieldByName(fieldName).isEnabled()];
            });
        });
    };
    LibraryMetadata.prototype.getValueOfField = function (fieldName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getFieldByName(fieldName).getText()];
            });
        });
    };
    LibraryMetadata.prototype.enterTextInInput = function (fieldName, text) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var input;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = this.getFieldByName(fieldName);
                        return [4 /*yield*/, input.clear()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, input.sendKeys(text)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LibraryMetadata.prototype.getButton = function (button) {
        return this.component.element(by.cssContainingText(LibraryMetadata.selectors.metadataTabAction, button));
    };
    LibraryMetadata.prototype.isButtonDisplayed = function (button) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.getButton(button))];
            });
        });
    };
    LibraryMetadata.prototype.isButtonEnabled = function (button) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getButton(button).isEnabled()];
            });
        });
    };
    LibraryMetadata.prototype.clickButton = function (button) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getButton(button).click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LibraryMetadata.prototype.waitForVisibilityDropDownToOpen = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.presenceOf(this.visibilityDropDown), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LibraryMetadata.prototype.waitForVisibilityDropDownToClose = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.stalenessOf(browser.$('.mat-option .mat-option-text')), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LibraryMetadata.prototype.isMessageDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.hint)];
            });
        });
    };
    LibraryMetadata.prototype.getMessage = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.hint.getText()];
            });
        });
    };
    LibraryMetadata.prototype.isErrorDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.error)];
            });
        });
    };
    LibraryMetadata.prototype.getError = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.error.getText()];
            });
        });
    };
    LibraryMetadata.prototype.isNameDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isFieldDisplayed('Name')];
            });
        });
    };
    LibraryMetadata.prototype.isNameEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isInputEnabled('Name')];
            });
        });
    };
    LibraryMetadata.prototype.getName = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getValueOfField('Name')];
            });
        });
    };
    LibraryMetadata.prototype.enterName = function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.enterTextInInput('Name', name)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LibraryMetadata.prototype.isDescriptionDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isFieldDisplayed('Description')];
            });
        });
    };
    LibraryMetadata.prototype.isDescriptionEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isInputEnabled('Description')];
            });
        });
    };
    LibraryMetadata.prototype.getDescription = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getValueOfField('Description')];
            });
        });
    };
    LibraryMetadata.prototype.enterDescription = function (desc) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.enterTextInInput('Description', desc)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LibraryMetadata.prototype.isVisibilityEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var wrapper, field;
            return tslib_1.__generator(this, function (_a) {
                wrapper = this.getLabelWrapper('Visibility');
                field = wrapper.element(by.xpath('..')).element(by.css(LibraryMetadata.selectors.dropDown));
                return [2 /*return*/, field.isEnabled()];
            });
        });
    };
    LibraryMetadata.prototype.isVisibilityDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isFieldDisplayed('Visibility')];
            });
        });
    };
    LibraryMetadata.prototype.getVisibility = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getValueOfField('Visibility')];
            });
        });
    };
    LibraryMetadata.prototype.setVisibility = function (visibility) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var val;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        val = visibility.toLowerCase();
                        return [4 /*yield*/, this.visibilityDropDown.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.waitForVisibilityDropDownToOpen()];
                    case 2:
                        _a.sent();
                        if (!(val === 'public')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.visibilityPublic.click()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 4:
                        if (!(val === 'private')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.visibilityPrivate.click()];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 6:
                        if (!(val === 'moderated')) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.visibilityModerated.click()];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        console.log('----- invalid visibility', val);
                        _a.label = 9;
                    case 9: return [4 /*yield*/, this.waitForVisibilityDropDownToClose()];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LibraryMetadata.prototype.isLibraryIdDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isFieldDisplayed('Library ID')];
            });
        });
    };
    LibraryMetadata.prototype.isLibraryIdEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isInputEnabled('Library ID')];
            });
        });
    };
    LibraryMetadata.prototype.getLibraryId = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getValueOfField('Library ID')];
            });
        });
    };
    LibraryMetadata.prototype.isEditLibraryPropertiesEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled('Edit')];
            });
        });
    };
    LibraryMetadata.prototype.isEditLibraryPropertiesDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonDisplayed('Edit')];
            });
        });
    };
    LibraryMetadata.prototype.clickEditLibraryProperties = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton('Edit')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LibraryMetadata.prototype.isUpdateEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled('Update')];
            });
        });
    };
    LibraryMetadata.prototype.isUpdateDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonDisplayed('Update')];
            });
        });
    };
    LibraryMetadata.prototype.clickUpdate = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton('Update')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LibraryMetadata.prototype.isCancelEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled('Cancel')];
            });
        });
    };
    LibraryMetadata.prototype.isCancelDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonDisplayed('Cancel')];
            });
        });
    };
    LibraryMetadata.prototype.clickCancel = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton('Cancel')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LibraryMetadata.selectors = {
        root: 'app-library-metadata-form',
        metadataTabContent: '.mat-card-content',
        metadataTabAction: '.mat-card-actions .mat-button',
        field: '.mat-form-field',
        fieldLabelWrapper: '.mat-form-field-label-wrapper',
        fieldInput: '.mat-input-element',
        dropDown: '.mat-select',
        visibilityOption: '.mat-option .mat-option-text',
        hint: '.mat-hint',
        error: '.mat-error'
    };
    return LibraryMetadata;
}(Component));
export { LibraryMetadata };
//# sourceMappingURL=info-drawer-metadata-library.js.map