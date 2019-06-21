/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { ElementFinder, by, browser, protractor } from 'protractor';
import { Component } from '../component';
import { Utils } from '../../utilities/utils';

export class CreateOrEditFolderDialog extends Component {
  selectors = {
    root: 'adf-folder-dialog',

    title: '.mat-dialog-title',
    nameInput: 'input[placeholder="Name" i]',
    descriptionTextArea: 'textarea[placeholder="Description" i]',
    button: '.mat-dialog-actions button',
    validationMessage: '.mat-hint span'
  };

  title = this.getByCss(this.selectors.title);
  nameInput = this.getByCss(this.selectors.nameInput);
  descriptionTextArea = this.getByCss(this.selectors.descriptionTextArea);
  createButton = this.component.element(
    by.cssContainingText(this.selectors.button, 'Create')
  );
  cancelButton = this.component.element(
    by.cssContainingText(this.selectors.button, 'Cancel')
  );
  updateButton = this.component.element(
    by.cssContainingText(this.selectors.button, 'Update')
  );
  validationMessage = this.getByCss(this.selectors.validationMessage);

  constructor(ancestor?: ElementFinder) {
    super('adf-folder-dialog', ancestor);
  }

  async waitForDialogToOpen() {
    await this.wait(this.title);
    await this.wait(browser.element(by.css('.cdk-overlay-backdrop')));
  }

  async waitForDialogToClose() {
    await this.waitStale(
      this.title,
      '---- timeout waiting for dialog to close ----'
    );
  }

  async isDialogOpen() {
    return await browser.isElementPresent(by.css(this.selectors.root));
  }

  async getTitle() {
    return await this.title.getText();
  }

  async isValidationMessageDisplayed() {
    return await this.validationMessage.isDisplayed();
  }

  async isUpdateButtonEnabled() {
    return this.updateButton.isEnabled();
  }

  async isCreateButtonEnabled() {
    return this.createButton.isEnabled();
  }

  async isCancelButtonEnabled() {
    return this.cancelButton.isEnabled();
  }

  async isNameDisplayed() {
    return await this.nameInput.isDisplayed();
  }

  async isDescriptionDisplayed() {
    return await this.descriptionTextArea.isDisplayed();
  }

  async getValidationMessage() {
    await this.isValidationMessageDisplayed();
    return await this.validationMessage.getText();
  }

  async getName() {
    return await this.nameInput.getAttribute('value');
  }

  async getDescription() {
    return await this.descriptionTextArea.getAttribute('value');
  }

  async enterName(name: string) {
    await this.nameInput.clear();
    await Utils.typeInField(this.nameInput, name);
  }

  async enterDescription(description: string) {
    await this.descriptionTextArea.clear();
    await Utils.typeInField(this.descriptionTextArea, description);
  }

  async deleteNameWithBackspace() {
    await this.nameInput.clear();
    await this.nameInput.sendKeys(
      ' ',
      protractor.Key.CONTROL,
      'a',
      protractor.Key.NULL,
      protractor.Key.BACK_SPACE
    );
  }

  async clickCreate() {
    await this.createButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
    await this.waitForDialogToClose();
  }

  async clickUpdate() {
    await this.updateButton.click();
  }
}
