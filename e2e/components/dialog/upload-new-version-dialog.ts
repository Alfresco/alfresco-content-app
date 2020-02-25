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

import { ElementFinder, by } from 'protractor';
import { GenericDialog } from '../dialog/generic-dialog';

export class UploadNewVersionDialog extends GenericDialog {
  private static selectors = {
    root: '.aca-node-version-upload-dialog',

    cancelButton: by.cssContainingText('.mat-button', 'Cancel'),
    uploadButton: by.cssContainingText('.mat-button', 'Upload'),

    radioButton: `.mat-radio-label`,

    descriptionTextArea: 'textarea'
  };


  majorOption: ElementFinder = this.rootElem.element(by.cssContainingText(UploadNewVersionDialog.selectors.radioButton, 'Major'));
  minorOption: ElementFinder = this.rootElem.element(by.cssContainingText(UploadNewVersionDialog.selectors.radioButton, 'Minor'));

  description: ElementFinder = this.rootElem.element(by.css(UploadNewVersionDialog.selectors.descriptionTextArea));

  constructor() {
    super(UploadNewVersionDialog.selectors.root);
  }

  async isDescriptionDisplayed(): Promise<boolean> {
    return this.description.isDisplayed();
  }

  async isMinorOptionDisplayed(): Promise<boolean> {
    return this.minorOption.isDisplayed();
  }

  async isMajorOptionDisplayed(): Promise<boolean> {
    return this.majorOption.isDisplayed();
  }

  async isCancelButtonEnabled(): Promise<boolean> {
    return this.isButtonEnabled(UploadNewVersionDialog.selectors.cancelButton);
  }

  async isUploadButtonEnabled(): Promise<boolean> {
    return this.isButtonEnabled(UploadNewVersionDialog.selectors.uploadButton);
  }

  async clickCancel(): Promise<void> {
    await this.clickButton(UploadNewVersionDialog.selectors.cancelButton);
    await this.waitForDialogToClose();
  }

  async clickUpload(): Promise<void> {
    await this.clickButton(UploadNewVersionDialog.selectors.uploadButton);
  }

  async clickMajor(): Promise<void> {
    await this.majorOption.click();
  }

  async clickMinor(): Promise<void> {
    await this.minorOption.click();
  }

  async enterDescription(description: string): Promise<void> {
    await this.description.clear();
    await this.description.sendKeys(description);
  }

}
