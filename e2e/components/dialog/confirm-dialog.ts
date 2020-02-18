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

import { by } from 'protractor';
import { GenericDialog } from '../dialog/generic-dialog';

export class ConfirmDialog extends GenericDialog {
  private static selectors = {
    root: 'adf-confirm-dialog',

    okButton: by.buttonText('OK'),
    cancelButton: by.buttonText('Cancel'),
    keepButton: by.buttonText('Keep'),
    deleteButton: by.buttonText('Delete'),
    removeButton: by.buttonText('Remove')
  }

  constructor() {
    super(ConfirmDialog.selectors.root);
  }

  async getText(): Promise<string> {
    return this.content.getText();
  }

  async isOkEnabled(): Promise<boolean> {
    return this.isButtonEnabled(ConfirmDialog.selectors.okButton);
  }

  async isCancelEnabled(): Promise<boolean> {
    return this.isButtonEnabled(ConfirmDialog.selectors.cancelButton);
  }

  async isKeepEnabled(): Promise<boolean> {
    return this.isButtonEnabled(ConfirmDialog.selectors.keepButton);
  }

  async isDeleteEnabled(): Promise<boolean> {
    return this.isButtonEnabled(ConfirmDialog.selectors.deleteButton);
  }

  async isRemoveEnabled(): Promise<boolean> {
    return this.isButtonEnabled(ConfirmDialog.selectors.removeButton);
  }

  async clickOk(): Promise<void> {
    await this.clickButton(ConfirmDialog.selectors.okButton);
  }

  async clickCancel(): Promise<void> {
    await this.clickButton(ConfirmDialog.selectors.cancelButton);
  }

  async clickKeep(): Promise<void> {
    await this.clickButton(ConfirmDialog.selectors.keepButton);
  }

  async clickDelete(): Promise<void> {
    await this.clickButton(ConfirmDialog.selectors.deleteButton);
  }

  async clickRemove(): Promise<void> {
    await this.clickButton(ConfirmDialog.selectors.removeButton);
  }

}
