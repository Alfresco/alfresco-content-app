/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { ElementFinder, by, browser, protractor, ExpectedConditions as EC, promise } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';
import { Utils } from '../../utilities/utils';

export class CreateOrEditFolderDialog extends Component {
  private static selectors = {
    root: 'adf-folder-dialog',

    title: '.mat-dialog-title',
    nameInput: 'input[placeholder="Name" i]',
    descriptionTextArea: 'textarea[placeholder="Description" i]',
    button: '.mat-dialog-actions button',
    validationMessage: '.mat-hint span'
  };

  title: ElementFinder = this.component.element(by.css(CreateOrEditFolderDialog.selectors.title));
  nameInput: ElementFinder = this.component.element(by.css(CreateOrEditFolderDialog.selectors.nameInput));
  descriptionTextArea: ElementFinder = this.component.element(by.css(CreateOrEditFolderDialog.selectors.descriptionTextArea));
  createButton: ElementFinder = this.component.element(by.cssContainingText(CreateOrEditFolderDialog.selectors.button, 'Create'));
  cancelButton: ElementFinder = this.component.element(by.cssContainingText(CreateOrEditFolderDialog.selectors.button, 'Cancel'));
  updateButton: ElementFinder = this.component.element(by.cssContainingText(CreateOrEditFolderDialog.selectors.button, 'Update'));
  validationMessage: ElementFinder = this.component.element(by.css(CreateOrEditFolderDialog.selectors.validationMessage));

  constructor(ancestor?: ElementFinder) {
    super(CreateOrEditFolderDialog.selectors.root, ancestor);
  }

  async waitForDialogToOpen() {
    await browser.wait(EC.presenceOf(this.title), BROWSER_WAIT_TIMEOUT);
    await browser.wait(EC.presenceOf(browser.element(by.css('.cdk-overlay-backdrop'))), BROWSER_WAIT_TIMEOUT);
  }

  async waitForDialogToClose() {
    await browser.wait(EC.stalenessOf(this.title), BROWSER_WAIT_TIMEOUT);
  }

  async getTitle() {
    return await this.title.getText();
  }

  async isValidationMessageDisplayed() {
    return await this.validationMessage.isDisplayed();
  }

  async getValidationMessage() {
    await this.isValidationMessageDisplayed();
    return await this.validationMessage.getText();
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
    await this.nameInput.sendKeys(' ', protractor.Key.CONTROL, 'a', protractor.Key.NULL, protractor.Key.BACK_SPACE);
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
