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

import { by, browser } from 'protractor';
import { BrowserActions, Logger } from '@alfresco/adf-testing';
import { Component } from '../component';
import { waitForPresence, waitForStaleness, typeText } from '../../utilities/utils';

export class LibraryMetadata extends Component {
  metadataTabContent = this.byCss('.mat-card-content');
  metadataTabAction = this.byCss('.mat-card-actions .mat-button');
  fieldLabelWrapper = this.byCss('.mat-form-field-label-wrapper');
  fieldInput = this.byCss('.mat-input-element');
  visibilityDropDown = this.component.element(by.css('.mat-select'));
  visibilityPublic = this.byCssText('.mat-option .mat-option-text', 'Public', browser);
  visibilityPrivate = this.byCssText('.mat-option .mat-option-text', 'Private', browser);
  visibilityModerated = this.byCssText('.mat-option .mat-option-text', 'Moderated', browser);
  hint = this.byCss('.mat-hint');
  error = this.byCss('.mat-error');

  constructor(ancestor?: string) {
    super('app-library-metadata-form', ancestor);
  }

  private getLabelWrapper(label: string) {
    return this.byCssText('.mat-form-field-label-wrapper', label);
  }

  private getFieldByName(fieldName: string) {
    const wrapper = this.getLabelWrapper(fieldName);
    return wrapper.element(by.xpath('..')).element(by.css('.mat-input-element'));
  }

  private async isFieldDisplayed(fieldName: string) {
    return browser.isElementPresent(this.getFieldByName(fieldName));
  }

  private async isInputEnabled(fieldName: string) {
    return this.getFieldByName(fieldName).isEnabled();
  }

  private async getValueOfField(fieldName: string) {
    return this.getFieldByName(fieldName).getText();
  }

  private async enterTextInInput(fieldName: string, text: string) {
    const input = this.getFieldByName(fieldName);
    await typeText(input, text);
  }

  private getButton(button: string) {
    return this.byCssText('.mat-card-actions .mat-button', button);
  }

  private async isButtonDisplayed(button: string) {
    return browser.isElementPresent(this.getButton(button));
  }

  private async isButtonEnabled(button: string) {
    return this.getButton(button).isEnabled();
  }

  private async clickButton(button: string) {
    await BrowserActions.click(this.getButton(button));
  }

  async waitForVisibilityDropDownToClose() {
    await waitForStaleness(browser.$('.mat-option .mat-option-text'));
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

  async getName(): Promise<string> {
    return this.getValueOfField('Name');
  }

  async enterName(name: string): Promise<void> {
    await this.enterTextInInput('Name', name);
  }

  async isDescriptionDisplayed() {
    return this.isFieldDisplayed('Description');
  }

  async isDescriptionEnabled() {
    return this.isInputEnabled('Description');
  }

  async getDescription(): Promise<string> {
    return this.getValueOfField('Description');
  }

  async enterDescription(desc: string) {
    await this.enterTextInInput('Description', desc);
  }

  async isVisibilityEnabled() {
    const wrapper = this.getLabelWrapper('Visibility');
    const field = wrapper.element(by.xpath('..')).element(by.css('.mat-select'));
    return field.isEnabled();
  }

  async isVisibilityDisplayed() {
    return this.isFieldDisplayed('Visibility');
  }

  async getVisibility(): Promise<string> {
    return this.getValueOfField('Visibility');
  }

  async setVisibility(visibility: string) {
    const val = visibility.toLowerCase();

    await BrowserActions.click(this.visibilityDropDown);
    await waitForPresence(this.visibilityDropDown);

    if (val === 'public') {
      await BrowserActions.click(this.visibilityPublic);
    } else if (val === 'private') {
      await BrowserActions.click(this.visibilityPrivate);
    } else if (val === 'moderated') {
      await BrowserActions.click(this.visibilityModerated);
    } else {
      Logger.error('----- invalid visibility', val);
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
