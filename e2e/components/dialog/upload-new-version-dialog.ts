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
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';
import { Utils } from '../../utilities/utils';

export class UploadNewVersionDialog extends Component {
  private static selectors = {
    root: '.aca-node-version-upload-dialog',

    title: '.mat-dialog-title',
    content: '.mat-dialog-content',
    button: '.mat-button',

    radioButton: `.mat-radio-label`,

    descriptionTextArea: 'textarea'
  };

  title: ElementFinder = this.component.element(by.css(UploadNewVersionDialog.selectors.title));
  content: ElementFinder = this.component.element(by.css(UploadNewVersionDialog.selectors.content));
  cancelButton: ElementFinder = this.component.element(by.cssContainingText(UploadNewVersionDialog.selectors.button, 'Cancel'));
  uploadButton: ElementFinder = this.component.element(by.cssContainingText(UploadNewVersionDialog.selectors.button, 'Upload'));

  majorOption: ElementFinder = this.component.element(by.cssContainingText(UploadNewVersionDialog.selectors.radioButton, 'Major'));
  minorOption: ElementFinder = this.component.element(by.cssContainingText(UploadNewVersionDialog.selectors.radioButton, 'Minor'));

  description: ElementFinder = this.component.element(by.css(UploadNewVersionDialog.selectors.descriptionTextArea));

  constructor(ancestor?: ElementFinder) {
    super(UploadNewVersionDialog.selectors.root, ancestor);
  }

  async waitForDialogToClose() {
    await browser.wait(EC.stalenessOf(this.title), BROWSER_WAIT_TIMEOUT);
  }

  async isDialogOpen() {
    return browser.$(UploadNewVersionDialog.selectors.root).isDisplayed();
  }

  async getTitle() {
    return this.title.getText();
  }

  async getText() {
    return this.content.getText();
  }


  async isDescriptionDisplayed() {
    return this.description.isDisplayed();
  }

  async isMinorOptionDisplayed() {
    return this.minorOption.isDisplayed();
  }

  async isMajorOptionDisplayed() {
    return this.majorOption.isDisplayed();
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
  }


  async clickMajor() {
    await this.majorOption.click();
  }

  async clickMinor() {
    await this.minorOption.click();
  }


  async enterDescription(description: string) {
    await this.description.clear();
    await Utils.typeInField(this.description, description);
  }

}
