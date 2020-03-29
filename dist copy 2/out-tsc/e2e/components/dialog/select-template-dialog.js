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
import { DropDownBreadcrumb } from '../breadcrumb/dropdown-breadcrumb';
import { DataTable } from '../data-table/data-table';
var SelectTemplateDialog = /** @class */ (function (_super) {
    tslib_1.__extends(SelectTemplateDialog, _super);
    function SelectTemplateDialog() {
        var _this = _super.call(this, SelectTemplateDialog.selectors.root) || this;
        _this.breadcrumb = new DropDownBreadcrumb();
        _this.dataTable = new DataTable(SelectTemplateDialog.selectors.root);
        return _this;
    }
    SelectTemplateDialog.prototype.isCancelButtonEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled(SelectTemplateDialog.selectors.cancelButton)];
            });
        });
    };
    SelectTemplateDialog.prototype.isNextButtonEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.isButtonEnabled(SelectTemplateDialog.selectors.nextButton)];
            });
        });
    };
    SelectTemplateDialog.prototype.clickCancel = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton(SelectTemplateDialog.selectors.cancelButton)];
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
    SelectTemplateDialog.prototype.clickNext = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton(SelectTemplateDialog.selectors.nextButton)];
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
    SelectTemplateDialog.selectors = {
        root: '.aca-template-node-selector-dialog',
        nextButton: by.css('[data-automation-id="content-node-selector-actions-choose"]'),
        cancelButton: by.css('[data-automation-id="content-node-selector-actions-cancel"]')
    };
    return SelectTemplateDialog;
}(GenericDialog));
export { SelectTemplateDialog };
//# sourceMappingURL=select-template-dialog.js.map