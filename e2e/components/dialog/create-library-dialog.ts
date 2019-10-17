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

import { ElementFinder, by, browser, protractor, ExpectedConditions as EC } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';
import { Utils } from '../../utilities/utils';

export class CreateLibraryDialog extends Component {
  private static selectors = {
    root: 'adf-library-dialog',

    title: '.mat-dialog-title',
    nameInput: 'input[placeholder="Name" i]',
    libraryIdInput: 'input[placeholder="Library ID" i]',
    descriptionTextArea: 'textarea[placeholder="Description" i]',
    button: '.mat-dialog-actions button',
    radioButton: '.mat-radio-label',
    radioChecked: 'mat-radio-checked',
    errorMessage: '.mat-error'
  };

  title: ElementFinder = this.component.element(by.css(CreateLibraryDialog.selectors.title));
  nameInput: ElementFinder = this.component.element(by.css(CreateLibraryDialog.selectors.nameInput));
  libraryIdInput: ElementFinder = this.component.element(by.css(CreateLibraryDialog.selectors.libraryIdInput));
  descriptionTextArea: ElementFinder = this.component.element(by.css(CreateLibraryDialog.selectors.descriptionTextArea));
  visibilityPublic: ElementFinder = this.component.element(by.cssContainingText(CreateLibraryDialog.selectors.radioButton, 'Public'));
  visibilityModerated: ElementFinder = this.component.element(by.cssContainingText(CreateLibraryDialog.selectors.radioButton, 'Moderated'));
  visibilityPrivate: ElementFinder = this.component.element(by.cssContainingText(CreateLibraryDialog.selectors.radioButton, 'Private'));
  createButton: ElementFinder = this.component.element(by.cssContainingText(CreateLibraryDialog.selectors.button, 'Create'));
  cancelButton: ElementFinder = this.component.element(by.cssContainingText(CreateLibraryDialog.selectors.button, 'Cancel'));
  errorMessage: ElementFinder = this.component.element(by.css(CreateLibraryDialog.selectors.errorMessage));

  constructor(ancestor?: ElementFinder) {
    super(CreateLibraryDialog.selectors.root, ancestor);
  }

  async waitForDialogToOpen() {
    await browser.wait(EC.presenceOf(this.title), BROWSER_WAIT_TIMEOUT);
    await browser.wait(EC.presenceOf(browser.element(by.css('.cdk-overlay-backdrop'))), BROWSER_WAIT_TIMEOUT);
  }

  async waitForDialogToClose() {
    await browser.wait(EC.stalenessOf(this.title), BROWSER_WAIT_TIMEOUT);
  }

  async isDialogOpen() {
    return browser.isElementPresent(by.css(CreateLibraryDialog.selectors.root));
  }

  async getTitle() {
    return this.title.getText();
  }

  async isErrorMessageDisplayed() {
    return this.errorMessage.isDisplayed();
  }

  async getErrorMessage() {
    await this.isErrorMessageDisplayed();
    return this.errorMessage.getText();
  }

  async isNameDisplayed() {
    return this.nameInput.isDisplayed();
  }

  async isLibraryIdDisplayed() {
    return this.libraryIdInput.isDisplayed();
  }

  async isDescriptionDisplayed() {
    return this.descriptionTextArea.isDisplayed();
  }

  async isPublicDisplayed() {
    return this.visibilityPublic.isDisplayed();
  }

  async isModeratedDisplayed() {
    return this.visibilityModerated.isDisplayed();
  }

  async isPrivateDisplayed() {
    return this.visibilityPrivate.isDisplayed();
  }

  async enterName(name: string) {
    await this.nameInput.clear();
    await Utils.typeInField(this.nameInput, name);
  }

  async enterLibraryId(id: string) {
    await this.libraryIdInput.clear();
    await Utils.typeInField(this.libraryIdInput, id);
  }

  async enterDescription(description: string) {
    await this.descriptionTextArea.clear();
    await Utils.typeInField(this.descriptionTextArea, description);
  }

  async deleteNameWithBackspace() {
    await this.nameInput.clear();
    await this.nameInput.sendKeys(' ', protractor.Key.CONTROL, 'a', protractor.Key.NULL, protractor.Key.BACK_SPACE);
  }

  async isCreateEnabled() {
    return this.createButton.isEnabled();
  }

  async isCancelEnabled() {
    return this.cancelButton.isEnabled();
  }

  async clickCreate() {
    await this.createButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
    await this.waitForDialogToClose();
  }

  async isPublicChecked() {
    const elemClass = await this.visibilityPublic.element(by.xpath('..')).getAttribute('class');
    return elemClass.includes(CreateLibraryDialog.selectors.radioChecked);
  }

  async isModeratedChecked() {
    const elemClass = await this.visibilityModerated.element(by.xpath('..')).getAttribute('class');
    return elemClass.includes(CreateLibraryDialog.selectors.radioChecked);
  }

  async isPrivateChecked() {
    const elemClass = await this.visibilityPrivate.element(by.xpath('..')).getAttribute('class');
    return elemClass.includes(CreateLibraryDialog.selectors.radioChecked);
  }

  async selectPublic() {
    await this.visibilityPublic.click();
  }

  async selectModerated() {
    await this.visibilityModerated.click();
  }

  async selectPrivate() {
    await this.visibilityPrivate.click();
  }
}
