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

import { ElementFinder, by, protractor } from 'protractor';
import { GenericDialog } from '../dialog/generic-dialog';

export class CreateFromTemplateDialog extends GenericDialog {
  private static selectors = {
    root: '.aca-create-from-template-dialog',

    nameInput: 'input[placeholder="Name" i]',
    titleInput: 'input[placeholder="Title" i]',
    descriptionTextArea: 'textarea[placeholder="Description" i]',
    validationMessage: '.mat-error',

    createButton: by.cssContainingText('.mat-dialog-actions button', 'Create'),
    cancelButton: by.cssContainingText('.mat-dialog-actions button', 'CANCEL')
  };

  nameInput: ElementFinder = this.rootElem.element(by.css(CreateFromTemplateDialog.selectors.nameInput));
  titleInput: ElementFinder = this.rootElem.element(by.css(CreateFromTemplateDialog.selectors.titleInput));
  descriptionTextArea: ElementFinder = this.rootElem.element(by.css(CreateFromTemplateDialog.selectors.descriptionTextArea));
  validationMessage: ElementFinder = this.rootElem.element(by.css(CreateFromTemplateDialog.selectors.validationMessage));

  constructor() {
    super(CreateFromTemplateDialog.selectors.root);
  }

  async isValidationMessageDisplayed(): Promise<boolean> {
    return (await this.validationMessage.isPresent()) && (await this.validationMessage.isDisplayed());
  }

  async isCreateButtonEnabled(): Promise<boolean> {
    return this.isButtonEnabled(CreateFromTemplateDialog.selectors.createButton);
  }

  async isCancelButtonEnabled(): Promise<boolean> {
    return this.isButtonEnabled(CreateFromTemplateDialog.selectors.cancelButton);
  }

  async isNameFieldDisplayed(): Promise<boolean> {
    return this.nameInput.isDisplayed();
  }

  async isTitleFieldDisplayed(): Promise<boolean> {
    return this.titleInput.isDisplayed();
  }

  async isDescriptionFieldDisplayed(): Promise<boolean> {
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

  async enterTitle(title: string): Promise<void> {
    await this.titleInput.clear();
    await this.titleInput.sendKeys(title);
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
    await this.clickButton(CreateFromTemplateDialog.selectors.createButton);
  }

  async clickCancel(): Promise<void> {
    await this.clickButton(CreateFromTemplateDialog.selectors.cancelButton);
    await this.waitForDialogToClose();
  }

}
