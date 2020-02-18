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

import { ElementFinder, by, protractor, browser, ExpectedConditions as EC } from 'protractor';
import { GenericDialog } from '../dialog/generic-dialog';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';

export class CreateLibraryDialog extends GenericDialog {
  private static selectors = {
    root: 'adf-library-dialog',

    nameInput: 'input[placeholder="Name" i]',
    libraryIdInput: 'input[placeholder="Library ID" i]',
    descriptionTextArea: 'textarea[placeholder="Description" i]',

    radioButton: '.mat-radio-label',
    radioChecked: 'mat-radio-checked',
    errorMessage: '.mat-error',

    createButton: by.cssContainingText('.mat-dialog-actions button', 'Create'),
    cancelButton: by.cssContainingText('.mat-dialog-actions button', 'Cancel')
  };

  nameInput: ElementFinder = this.rootElem.element(by.css(CreateLibraryDialog.selectors.nameInput));
  libraryIdInput: ElementFinder = this.rootElem.element(by.css(CreateLibraryDialog.selectors.libraryIdInput));
  descriptionTextArea: ElementFinder = this.rootElem.element(by.css(CreateLibraryDialog.selectors.descriptionTextArea));
  visibilityPublic: ElementFinder = this.rootElem.element(by.cssContainingText(CreateLibraryDialog.selectors.radioButton, 'Public'));
  visibilityModerated: ElementFinder = this.rootElem.element(by.cssContainingText(CreateLibraryDialog.selectors.radioButton, 'Moderated'));
  visibilityPrivate: ElementFinder = this.rootElem.element(by.cssContainingText(CreateLibraryDialog.selectors.radioButton, 'Private'));

  errorMessage: ElementFinder = this.rootElem.element(by.css(CreateLibraryDialog.selectors.errorMessage));

  constructor() {
    super(CreateLibraryDialog.selectors.root);
  }

  async waitForDialogToOpen(): Promise<void> {
    await super.waitForDialogToOpen();
    await browser.wait(EC.elementToBeClickable(this.nameInput), BROWSER_WAIT_TIMEOUT, '--- timeout waiting for input to be clickable ---');
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    return this.errorMessage.isDisplayed();
  }

  async getErrorMessage(): Promise<string> {
    if (await this.isErrorMessageDisplayed()) {
      return this.errorMessage.getText();
    }
    return '';
  }

  async isNameDisplayed(): Promise<boolean> {
    return this.nameInput.isDisplayed();
  }

  async isLibraryIdDisplayed(): Promise<boolean> {
    return this.libraryIdInput.isDisplayed();
  }

  async isDescriptionDisplayed(): Promise<boolean> {
    return this.descriptionTextArea.isDisplayed();
  }

  async isPublicDisplayed(): Promise<boolean> {
    return this.visibilityPublic.isDisplayed();
  }

  async isModeratedDisplayed(): Promise<boolean> {
    return this.visibilityModerated.isDisplayed();
  }

  async isPrivateDisplayed(): Promise<boolean> {
    return this.visibilityPrivate.isDisplayed();
  }

  async enterName(name: string): Promise<void> {
    await this.nameInput.clear();
    await this.nameInput.sendKeys(name);
  }

  async enterLibraryId(id: string): Promise<void> {
    await this.libraryIdInput.clear();
    await this.libraryIdInput.sendKeys(id);
  }

  async enterDescription(description: string): Promise<void> {
    await this.descriptionTextArea.clear();
    await this.descriptionTextArea.sendKeys(description);
  }

  async deleteNameWithBackspace(): Promise<void> {
    await this.nameInput.clear();
    await this.nameInput.sendKeys(' ', protractor.Key.CONTROL, 'a', protractor.Key.NULL, protractor.Key.BACK_SPACE);
  }

  async isCreateEnabled(): Promise<boolean> {
    return this.isButtonEnabled(CreateLibraryDialog.selectors.createButton);
  }

  async isCancelEnabled(): Promise<boolean> {
    return this.isButtonEnabled(CreateLibraryDialog.selectors.cancelButton);
  }

  async clickCreate(): Promise<void> {
    await this.clickButton(CreateLibraryDialog.selectors.createButton);
  }

  async clickCancel(): Promise<void> {
    await this.clickButton(CreateLibraryDialog.selectors.cancelButton);
    await this.waitForDialogToClose();
  }

  async isPublicChecked(): Promise<boolean> {
    const elemClass = await this.visibilityPublic.element(by.xpath('..')).getAttribute('class');
    return elemClass.includes(CreateLibraryDialog.selectors.radioChecked);
  }

  async isModeratedChecked(): Promise<boolean> {
    const elemClass = await this.visibilityModerated.element(by.xpath('..')).getAttribute('class');
    return elemClass.includes(CreateLibraryDialog.selectors.radioChecked);
  }

  async isPrivateChecked(): Promise<boolean> {
    const elemClass = await this.visibilityPrivate.element(by.xpath('..')).getAttribute('class');
    return elemClass.includes(CreateLibraryDialog.selectors.radioChecked);
  }

  async selectPublic(): Promise<void> {
    await this.visibilityPublic.click();
  }

  async selectModerated(): Promise<void> {
    await this.visibilityModerated.click();
  }

  async selectPrivate(): Promise<void> {
    await this.visibilityPrivate.click();
  }
}
