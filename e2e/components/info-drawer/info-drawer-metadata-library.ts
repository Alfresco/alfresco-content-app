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

import { ElementFinder, by, browser, ExpectedConditions as EC } from 'protractor';
import { Component } from '../component';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';

export class LibraryMetadata extends Component {
  private static selectors = {
    root: 'app-library-metadata-form',

    metadataTabContent: '.mat-card-content',
    metadataTabAction: '.mat-card-actions .mat-button',
    field: '.mat-form-field',
    fieldLabelWrapper: '.mat-form-field-label-wrapper',
    fieldInput: '.mat-input-element',
    dropDown: '.mat-select',

    visibilityOption: '.mat-option .mat-option-text',

    hint: '.mat-hint',
    error: '.mat-error'
  };

  metadataTabContent: ElementFinder = this.component.element(by.css(LibraryMetadata.selectors.metadataTabContent));
  metadataTabAction: ElementFinder = this.component.element(by.css(LibraryMetadata.selectors.metadataTabAction));
  fieldLabelWrapper: ElementFinder = this.component.element(by.css(LibraryMetadata.selectors.fieldLabelWrapper));
  fieldInput: ElementFinder = this.component.element(by.css(LibraryMetadata.selectors.fieldInput));

  visibilityDropDown: ElementFinder = this.component.element(by.css(LibraryMetadata.selectors.dropDown));
  visibilityPublic: ElementFinder = browser.element(by.cssContainingText(LibraryMetadata.selectors.visibilityOption, 'Public'));
  visibilityPrivate: ElementFinder = browser.element(by.cssContainingText(LibraryMetadata.selectors.visibilityOption, 'Private'));
  visibilityModerated: ElementFinder = browser.element(by.cssContainingText(LibraryMetadata.selectors.visibilityOption, 'Moderated'));

  hint: ElementFinder = this.component.element(by.css(LibraryMetadata.selectors.hint));
  error: ElementFinder = this.component.element(by.css(LibraryMetadata.selectors.error));


  constructor(ancestor?: ElementFinder) {
    super(LibraryMetadata.selectors.root, ancestor);
  }

  getLabelWrapper(label: string) {
    return this.component.element(by.cssContainingText(LibraryMetadata.selectors.fieldLabelWrapper, label));
  }

  getFieldByName(fieldName: string) {
    const wrapper = this.getLabelWrapper(fieldName);
    return wrapper.element(by.xpath('..')).element(by.css(LibraryMetadata.selectors.fieldInput));
  }

  async isFieldDisplayed(fieldName: string) {
    return browser.isElementPresent(this.getFieldByName(fieldName));
  }

  async isInputEnabled(fieldName: string) {
    return this.getFieldByName(fieldName).isEnabled();
  }

  async getValueOfField(fieldName: string) {
    return this.getFieldByName(fieldName).getText();
  }

  async enterTextInInput(fieldName: string, text: string) {
    const input = this.getFieldByName(fieldName);
    await input.clear();
    await input.sendKeys(text);
  }


  getButton(button: string) {
    return this.component.element(by.cssContainingText(LibraryMetadata.selectors.metadataTabAction, button));
  }

  async isButtonDisplayed(button: string) {
    return browser.isElementPresent(this.getButton(button));
  }

  async isButtonEnabled(button: string) {
    return this.getButton(button).isEnabled();
  }

  async clickButton(button: string) {
    await this.getButton(button).click();
  }

  async waitForVisibilityDropDownToOpen() {
    await browser.wait(EC.presenceOf(this.visibilityDropDown), BROWSER_WAIT_TIMEOUT);
  }

  async waitForVisibilityDropDownToClose() {
    await browser.wait(EC.stalenessOf(browser.$('.mat-option .mat-option-text')), BROWSER_WAIT_TIMEOUT);
  }

  async isMessageDisplayed() {
    return browser.isElementPresent(this.hint);
  }

  async getMessage() {
    return this.hint.getText();
  }

  async isErrorDisplayed() {
    return browser.isElementPresent(this.error);
  }

  async getError() {
    return this.error.getText();
  }


  async isNameDisplayed() {
    return this.isFieldDisplayed('Name');
  }

  async isNameEnabled() {
    return this.isInputEnabled('Name');
  }

  async getName() {
    return this.getValueOfField('Name');
  }

  async enterName(name: string) {
    await this.enterTextInInput('Name', name);
  }


  async isDescriptionDisplayed() {
    return this.isFieldDisplayed('Description');
  }

  async isDescriptionEnabled() {
    return this.isInputEnabled('Description');
  }

  async getDescription() {
    return this.getValueOfField('Description');
  }

  async enterDescription(desc: string) {
    await this.enterTextInInput('Description', desc);
  }


  async isVisibilityEnabled() {
    const wrapper = this.getLabelWrapper('Visibility');
    const field = wrapper.element(by.xpath('..')).element(by.css(LibraryMetadata.selectors.dropDown));
    return field.isEnabled();
  }

  async isVisibilityDisplayed() {
    return this.isFieldDisplayed('Visibility');
  }

  async getVisibility() {
    return this.getValueOfField('Visibility');
  }

  async setVisibility(visibility: string) {
    const val = visibility.toLowerCase();

    await this.visibilityDropDown.click();
    await this.waitForVisibilityDropDownToOpen();

    if (val === 'public') {
      await this.visibilityPublic.click();
    } else if (val === 'private') {
      await this.visibilityPrivate.click();
    } else if (val === 'moderated') {
      await this.visibilityModerated.click();
    } else {
      console.log('----- invalid visibility', val);
    }

    await this.waitForVisibilityDropDownToClose();
  }


  async isLibraryIdDisplayed() {
    return this.isFieldDisplayed('Library ID');
  }

  async isLibraryIdEnabled() {
    return this.isInputEnabled('Library ID');
  }

  async getLibraryId() {
    return this.getValueOfField('Library ID');
  }


  async isEditLibraryPropertiesEnabled() {
    return this.isButtonEnabled('Edit');
  }

  async isEditLibraryPropertiesDisplayed() {
    return this.isButtonDisplayed('Edit');
  }

  async clickEditLibraryProperties() {
    await this.clickButton('Edit');
  }


  async isUpdateEnabled() {
    return this.isButtonEnabled('Update');
  }

  async isUpdateDisplayed() {
    return this.isButtonDisplayed('Update');
  }

  async clickUpdate() {
    await this.clickButton('Update');
  }


  async isCancelEnabled() {
    return this.isButtonEnabled('Cancel');
  }

  async isCancelDisplayed() {
    return this.isButtonDisplayed('Cancel');
  }

  async clickCancel() {
    await this.clickButton('Cancel');
  }

}

