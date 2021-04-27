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
import { isPresentAndDisplayed, isPresentAndEnabled, typeText } from '../../utilities/utils';
import { BrowserActions, BrowserVisibility } from '@alfresco/adf-testing';

export class CreateOrEditFolderDialog extends GenericDialog {
  createButton = this.childElement(by.cssContainingText('.mat-dialog-actions button', 'Create'));
  cancelButton = this.childElement(by.id('adf-folder-cancel-button'));
  updateButton = this.childElement(by.cssContainingText('.mat-dialog-actions button', 'Update'));

  nameInput = this.rootElem.element(by.id('adf-folder-name-input'));
  titleInput = this.rootElem.element(by.id('adf-folder-title-input'));
  descriptionTextArea = this.rootElem.element(by.id('adf-folder-description-input'));
  validationMessage = this.rootElem.element(by.css('.mat-hint span'));

  constructor() {
    super('adf-folder-dialog');
  }

  async waitForDialogToOpen() {
    await super.waitForDialogToOpen();
    await BrowserVisibility.waitUntilElementIsClickable(this.nameInput);
  }

  async isUpdateButtonEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.updateButton);
  }

  async isCreateButtonEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.createButton);
  }

  async isCancelButtonEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.cancelButton);
  }

  async getValidationMessage(): Promise<string> {
    if (await isPresentAndDisplayed(this.validationMessage)) {
      return this.validationMessage.getText();
    } else {
      return '';
    }
  }

  async getName(): Promise<string> {
    return BrowserActions.getInputValue(this.nameInput);
  }

  async getDescription(): Promise<string> {
    return BrowserActions.getInputValue(this.descriptionTextArea);
  }

  async enterName(name: string): Promise<void> {
    await typeText(this.nameInput, name);
  }

  async enterDescription(description: string): Promise<void> {
    await typeText(this.descriptionTextArea, description);
  }

  async clickCancel(): Promise<void> {
    await BrowserActions.click(this.cancelButton);
    await this.waitForDialogToClose();
  }
}
