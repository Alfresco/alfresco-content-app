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
var ManageVersionsDialog = /** @class */ (function (_super) {
    tslib_1.__extends(ManageVersionsDialog, _super);
    function ManageVersionsDialog() {
        return _super.call(this, ManageVersionsDialog.selectors.root) || this;
    }
    ManageVersionsDialog.prototype.clickClose = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickButton(ManageVersionsDialog.selectors.closeButton)];
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
    ManageVersionsDialog.selectors = {
        root: '.aca-node-versions-dialog',
        closeButton: by.cssContainingText('.mat-button', 'Close')
    };
    return ManageVersionsDialog;
}(GenericDialog));
export { ManageVersionsDialog };
//# sourceMappingURL=manage-versions-dialog.js.map