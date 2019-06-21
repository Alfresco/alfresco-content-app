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

export class CreateLibraryDialog extends Component {
  selectors = {
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

  title = this.getByCss(this.selectors.title);
  nameInput = this.getByCss(this.selectors.nameInput);
  libraryIdInput = this.getByCss(this.selectors.libraryIdInput);
  descriptionTextArea = this.getByCss(this.selectors.descriptionTextArea);
  visibilityPublic = this.getByText(this.selectors.radioButton, 'Public');
  visibilityModerated = this.getByText(this.selectors.radioButton, 'Moderated');
  visibilityPrivate = this.getByText(this.selectors.radioButton, 'Private');
  createButton = this.getByText(this.selectors.button, 'Create');
  cancelButton = this.getByText(this.selectors.button, 'Cancel');
  errorMessage = this.getByCss(this.selectors.errorMessage);

  constructor(ancestor?: ElementFinder) {
    super('adf-library-dialog', ancestor);
  }

  async waitForDialogToOpen() {
    await this.wait(this.title);
    await this.wait(browser.element(by.css('.cdk-overlay-backdrop')));
  }

  async waitForDialogToClose() {
    await this.waitStale(this.title);
  }

  async isDialogOpen() {
    return await browser.isElementPresent(by.css(this.selectors.root));
  }

  async getTitle() {
    return await this.title.getText();
  }

  async isErrorMessageDisplayed() {
    return await this.errorMessage.isDisplayed();
  }

  async getErrorMessage() {
    await this.isErrorMessageDisplayed();
    return await this.errorMessage.getText();
  }

  async isNameDisplayed() {
    return await this.nameInput.isDisplayed();
  }

  async isLibraryIdDisplayed() {
    return await this.libraryIdInput.isDisplayed();
  }

  async isDescriptionDisplayed() {
    return await this.descriptionTextArea.isDisplayed();
  }

  async isPublicDisplayed() {
    return await this.visibilityPublic.isDisplayed();
  }

  async isModeratedDisplayed() {
    return await this.visibilityModerated.isDisplayed();
  }

  async isPrivateDisplayed() {
    return await this.visibilityPrivate.isDisplayed();
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
    await this.nameInput.sendKeys(
      ' ',
      protractor.Key.CONTROL,
      'a',
      protractor.Key.NULL,
      protractor.Key.BACK_SPACE
    );
  }

  async isCreateEnabled() {
    return await this.createButton.isEnabled();
  }

  async isCancelEnabled() {
    return await this.cancelButton.isEnabled();
  }

  async clickCreate() {
    await this.createButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
    await this.waitForDialogToClose();
  }

  async isPublicChecked() {
    const elemClass = await this.visibilityPublic
      .element(by.xpath('..'))
      .getAttribute('class');
    return await elemClass.includes(this.selectors.radioChecked);
  }

  async isModeratedChecked() {
    const elemClass = await this.visibilityModerated
      .element(by.xpath('..'))
      .getAttribute('class');
    return await elemClass.includes(this.selectors.radioChecked);
  }

  async isPrivateChecked() {
    const elemClass = await this.visibilityPrivate
      .element(by.xpath('..'))
      .getAttribute('class');
    return await elemClass.includes(this.selectors.radioChecked);
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
