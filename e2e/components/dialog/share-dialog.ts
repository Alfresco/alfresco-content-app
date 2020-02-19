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

import { ElementFinder, ElementArrayFinder, by } from 'protractor';
import { DateTimePicker } from '../../components/datetime-picker/datetime-picker';
import { GenericDialog } from '../dialog/generic-dialog';

export class ShareDialog extends GenericDialog {
  private static selectors = {
    root: '.adf-share-dialog',

    dialogTitle: `[data-automation-id='adf-share-dialog-title']`,
    info: '.adf-share-link__info',
    label: '.adf-share-link__label',
    shareToggle: `[data-automation-id='adf-share-toggle']`,
    linkUrl: `[data-automation-id='adf-share-link']`,
    inputAction: '.adf-input-action',
    expireToggle: `[data-automation-id='adf-expire-toggle']`,
    datetimePickerButton: '.mat-datetimepicker-toggle',
    expirationInput: 'input[formcontrolname="time"]',

    closeButton: by.css(`[data-automation-id='adf-share-dialog-close']`)
  };

  dateTimePicker = new DateTimePicker();

  dialogTitle: ElementFinder = this.rootElem.element(by.css(ShareDialog.selectors.dialogTitle));
  infoText: ElementFinder = this.rootElem.element(by.css(ShareDialog.selectors.info));
  labels: ElementArrayFinder = this.rootElem.all(by.css(ShareDialog.selectors.label));
  shareToggle: ElementFinder = this.rootElem.element(by.css(ShareDialog.selectors.shareToggle));
  url: ElementFinder = this.rootElem.element(by.css(ShareDialog.selectors.linkUrl));
  urlAction: ElementFinder = this.rootElem.element(by.css(ShareDialog.selectors.inputAction));
  expireToggle: ElementFinder = this.rootElem.element(by.css(ShareDialog.selectors.expireToggle));
  expireInput: ElementFinder = this.rootElem.element(by.css(ShareDialog.selectors.expirationInput));
  datetimePickerButton: ElementFinder = this.rootElem.element(by.css(ShareDialog.selectors.datetimePickerButton));

  constructor() {
    super(ShareDialog.selectors.root);
  }

  async getTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async getInfoText(): Promise<string> {
    return this.infoText.getText();
  }

  getLabels(): ElementArrayFinder {
    return this.labels;
  }

  async getLinkUrl(): Promise<string> {
    return this.url.getAttribute('value');
  }

  async isUrlReadOnly(): Promise<boolean> {
    const urlAttr = await this.url.getAttribute('readonly');
    return urlAttr === 'true';
  }

  async isCloseEnabled(): Promise<boolean> {
    return this.isButtonEnabled(ShareDialog.selectors.closeButton);
  }

  async clickClose(): Promise<void> {
    await this.clickButton(ShareDialog.selectors.closeButton);
    await this.waitForDialogToClose();
  }

  getShareToggle(): ElementFinder {
    return this.shareToggle;
  }

  getExpireToggle(): ElementFinder {
    return this.expireToggle;
  }

  getExpireInput(): ElementFinder {
    return this.expireInput;
  }

  async isShareToggleChecked(): Promise<boolean> {
    const toggleClass = await this.getShareToggle().getAttribute('class');
    return toggleClass.includes('checked');
  }

  async isShareToggleDisabled(): Promise<boolean> {
    const toggleClass = await this.getShareToggle().getAttribute('class');
    return toggleClass.includes('mat-disabled');
  }

  async isExpireToggleEnabled(): Promise<boolean> {
    const toggleClass = await this.getExpireToggle().getAttribute('class');
    return toggleClass.includes('checked');
  }

  async copyUrl(): Promise<void> {
    await this.urlAction.click();
  }

  async openDatetimePicker(): Promise<void> {
    await this.datetimePickerButton.click();
  }

  async closeDatetimePicker(): Promise<void> {
    if (await this.dateTimePicker.isCalendarOpen()) {
      await this.datetimePickerButton.click();
    }
  }

  async getExpireDate(): Promise<string> {
    return this.getExpireInput().getAttribute('value');
  }

  async clickExpirationToggle(): Promise<void> {
    await this.expireToggle.click();
  }

  async clickShareToggle(): Promise<void> {
    await this.shareToggle.click();
  }
}
