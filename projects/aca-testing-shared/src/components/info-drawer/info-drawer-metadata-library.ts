/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { by, browser } from 'protractor';
import { Component } from '../component';
import { waitForPresence, waitForStaleness, typeText, click } from '../../utilities';

export class LibraryMetadata extends Component {
  visibilityDropDown = this.component.element(by.css('.mat-mdc-select'));
  visibilityPublic = this.byCssText('.mat-mdc-option .mdc-list-item__primary-text', 'Public', browser);
  visibilityPrivate = this.byCssText('.mat-mdc-option .mdc-list-item__primary-text', 'Private', browser);
  visibilityModerated = this.byCssText('.mat-mdc-option .mat-optimdc-list-item__primary-texton-text', 'Moderated', browser);
  visibilityValue = this.byCss('[data-automation-id="library-visibility-properties-wrapper"] .mat-mdc-select');

  hint = this.byCss('.mat-mdc-form-field-hint');
  error = this.byCss('.mat-mdc-form-field-error');

  constructor(ancestor?: string) {
    super('app-library-metadata-form', ancestor);
  }

  private getLabelWrapper(label: string) {
    return this.byCssText('.mat-mdc-floating-label', label);
  }

  private getFieldByName(fieldName: string) {
    const wrapper = this.getLabelWrapper(fieldName);
    return wrapper.element(by.xpath('..')).element(by.css('.mat-mdc-input-element'));
  }

  private async isFieldDisplayed(fieldName: string) {
    return browser.isElementPresent(this.getFieldByName(fieldName));
  }

  private async isInputEnabled(fieldName: string) {
    return this.getFieldByName(fieldName).isEnabled();
  }

  private async getValueOfField(fieldName: string) {
    return this.getFieldByName(fieldName).getAttribute('value');
  }

  private async enterTextInInput(fieldName: string, text: string) {
    const input = this.getFieldByName(fieldName);
    await typeText(input, text);
  }

  private getButton(button: string) {
    return this.byCssText('.mat-mdc-card-actions .mat-mdc-button', button);
  }

  private async isButtonDisplayed(button: string) {
    return browser.isElementPresent(this.getButton(button));
  }

  private async isButtonEnabled(button: string) {
    return this.getButton(button).isEnabled();
  }

  private async clickButton(button: string) {
    await click(this.getButton(button));
  }

  async waitForVisibilityDropDownToClose() {
    await waitForStaleness(browser.$('.mat-mdc-option .mdc-list-item__primary-text'));
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
    const field = wrapper.element(by.xpath('..')).element(by.css('.mat-mdc-select'));
    return field.isEnabled();
  }

  async isVisibilityDisplayed() {
    return browser.isElementPresent(this.visibilityValue);
  }

  async getVisibility(): Promise<string> {
    return this.visibilityValue.getText();
  }

  async setVisibility(visibility: string) {
    const val = visibility.toLowerCase();

    await click(this.visibilityDropDown);
    await waitForPresence(this.visibilityDropDown);

    if (val === 'public') {
      await click(this.visibilityPublic);
    } else if (val === 'private') {
      await click(this.visibilityPrivate);
    } else if (val === 'moderated') {
      await click(this.visibilityModerated);
    } else {
      console.error('----- invalid visibility', val);
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
