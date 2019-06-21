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

import { ElementFinder, browser } from 'protractor';
import { Component } from '../component';
import { Utils } from '../../utilities/utils';

export class UploadNewVersionDialog extends Component {
  selectors = {
    root: '.aca-node-version-upload-dialog',
    title: '.mat-dialog-title',
    content: '.mat-dialog-content',
    button: '.mat-button',
    radioButton: `.mat-radio-label`,
    descriptionTextArea: 'textarea'
  };

  title = this.getByCss(this.selectors.title);
  content = this.getByCss(this.selectors.content);
  cancelButton = this.getByText(this.selectors.button, 'Cancel');
  uploadButton = this.getByText(this.selectors.button, 'Upload');

  majorOption = this.getByText(this.selectors.radioButton, 'Major');
  minorOption = this.getByText(this.selectors.radioButton, 'Minor');

  description = this.getByCss(this.selectors.descriptionTextArea);

  constructor(ancestor?: ElementFinder) {
    super('.aca-node-version-upload-dialog', ancestor);
  }

  async waitForDialogToClose() {
    return await this.wait(this.title);
  }

  async isDialogOpen() {
    return await browser.$(this.selectors.root).isDisplayed();
  }

  async getTitle() {
    return await this.title.getText();
  }

  async getText() {
    return await this.content.getText();
  }

  async isDescriptionDisplayed() {
    return await this.description.isDisplayed();
  }

  async isMinorOptionDisplayed() {
    return await this.minorOption.isDisplayed();
  }

  async isMajorOptionDisplayed() {
    return await this.majorOption.isDisplayed();
  }

  async isCancelButtonEnabled() {
    return this.cancelButton.isEnabled();
  }

  async isUploadButtonEnabled() {
    return this.uploadButton.isEnabled();
  }

  async clickCancel() {
    await this.cancelButton.click();
    await this.waitForDialogToClose();
  }

  async clickUpload() {
    await this.uploadButton.click();
    await this.waitForDialogToClose();
  }

  async clickMajor() {
    return await this.majorOption.click();
  }

  async clickMinor() {
    return await this.minorOption.click();
  }

  async enterDescription(description: string) {
    await this.description.clear();
    await Utils.typeInField(this.description, description);
  }
}
