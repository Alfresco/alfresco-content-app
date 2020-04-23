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

import { by, protractor, browser, ExpectedConditions as EC } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { GenericDialog } from '../dialog/generic-dialog';
import { isPresentAndDisplayed } from '../../utilities/utils';

export class CreateOrEditFolderDialog extends GenericDialog {
  private static selectors = {
    createButton: by.cssContainingText('.mat-dialog-actions button', 'Create'),
    cancelButton: by.id('adf-folder-cancel-button'),
    updateButton: by.cssContainingText('.mat-dialog-actions button', 'Update')
  };

  nameInput = this.rootElem.element(by.css('input[placeholder="Name" i]'));
  descriptionTextArea = this.rootElem.element(by.css('textarea[placeholder="Description" i]'));
  validationMessage = this.rootElem.element(by.css('.mat-hint span'));

  constructor() {
    super('adf-folder-dialog');
  }

  async waitForDialogToOpen() {
    await super.waitForDialogToOpen();
    await browser.wait(EC.elementToBeClickable(this.nameInput), BROWSER_WAIT_TIMEOUT, '--- timeout waiting for input to be clickable ---');
  }

  async isValidationMessageDisplayed(): Promise<boolean> {
    return isPresentAndDisplayed(this.validationMessage);
  }

  async isUpdateButtonEnabled(): Promise<boolean> {
    return this.isButtonEnabled(CreateOrEditFolderDialog.selectors.updateButton);
  }

  async isCreateButtonEnabled(): Promise<boolean> {
    return this.isButtonEnabled(CreateOrEditFolderDialog.selectors.createButton);
  }

  async isCancelButtonEnabled(): Promise<boolean> {
    return this.isButtonEnabled(CreateOrEditFolderDialog.selectors.cancelButton);
  }

  async isNameDisplayed(): Promise<boolean> {
    return this.nameInput.isDisplayed();
  }

  async isDescriptionDisplayed(): Promise<boolean> {
    return this.descriptionTextArea.isDisplayed();
  }

  async getValidationMessage(): Promise<string> {
    if (await this.isValidationMessageDisplayed()) {
      return this.validationMessage.getText();
    } else {
      return '';
    }
  }

  async getName(): Promise<string> {
    return this.nameInput.getAttribute('value');
  }

  async getDescription(): Promise<string> {
    return this.descriptionTextArea.getAttribute('value');
  }

  async enterName(name: string): Promise<void> {
    await this.nameInput.clear();
    await this.nameInput.sendKeys(name);
  }

  async enterDescription(description: string): Promise<void> {
    await this.descriptionTextArea.clear();
    await this.descriptionTextArea.sendKeys(description);
  }

  async deleteNameWithBackspace(): Promise<void> {
    await this.nameInput.clear();
    await this.nameInput.sendKeys(' ', protractor.Key.CONTROL, 'a', protractor.Key.NULL, protractor.Key.BACK_SPACE);
  }

  async clickCreate(): Promise<void> {
    await this.clickButton(CreateOrEditFolderDialog.selectors.createButton);
  }

  async clickCancel(): Promise<void> {
    await this.clickButton(CreateOrEditFolderDialog.selectors.cancelButton);
    await this.waitForDialogToClose();
  }

  async clickUpdate(): Promise<void> {
    await this.clickButton(CreateOrEditFolderDialog.selectors.updateButton);
  }

}
