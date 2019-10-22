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

import { ElementFinder, ElementArrayFinder, by, browser, ExpectedConditions as EC } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { DateTimePicker } from '../../components/datetime-picker/datetime-picker';
import { Component } from '../component';

export class ShareDialog extends Component {
  private static selectors = {
    root: '.adf-share-dialog',

    title: `[data-automation-id='adf-share-dialog-title']`,
    info: '.adf-share-link__info',
    label: '.adf-share-link__label',
    shareToggle: `[data-automation-id='adf-share-toggle']`,
    linkUrl: `[data-automation-id='adf-share-link']`,
    inputAction: '.adf-input-action',
    expireToggle: `[data-automation-id='adf-expire-toggle']`,
    datetimePickerButton: '.mat-datetimepicker-toggle',
    expirationInput: 'input[formcontrolname="time"]',
    button: `[data-automation-id='adf-share-dialog-close']`
  };

  dateTimePicker = new DateTimePicker();

  title: ElementFinder = this.component.element(by.css(ShareDialog.selectors.title));
  infoText: ElementFinder = this.component.element(by.css(ShareDialog.selectors.info));
  labels: ElementArrayFinder = this.component.all(by.css(ShareDialog.selectors.label));
  shareToggle: ElementFinder = this.component.element(by.css(ShareDialog.selectors.shareToggle));
  url: ElementFinder = this.component.element(by.css(ShareDialog.selectors.linkUrl));
  urlAction: ElementFinder = this.component.element(by.css(ShareDialog.selectors.inputAction));
  expireToggle: ElementFinder = this.component.element(by.css(ShareDialog.selectors.expireToggle));
  expireInput: ElementFinder = this.component.element(by.css(ShareDialog.selectors.expirationInput));
  datetimePickerButton: ElementFinder = this.component.element(by.css(ShareDialog.selectors.datetimePickerButton));
  closeButton: ElementFinder = this.component.element(by.css(ShareDialog.selectors.button));


  constructor(ancestor?: ElementFinder) {
    super(ShareDialog.selectors.root, ancestor);
  }

  async waitForDialogToClose() {
    await browser.wait(EC.stalenessOf(this.title), BROWSER_WAIT_TIMEOUT, 'share dialog did not close');
  }

  async waitForDialogToOpen() {
    await browser.wait(EC.presenceOf(this.title), BROWSER_WAIT_TIMEOUT);
  }

  async isDialogOpen() {
    return browser.isElementPresent(by.css(ShareDialog.selectors.root));
  }

  async getTitle() {
    return this.title.getText();
  }

  async getInfoText() {
    return this.infoText.getText();
  }

  getLabels() {
    return this.labels;
  }

  async getLinkUrl() {
    return this.url.getAttribute('value');
  }

  async isUrlReadOnly() {
    return this.url.getAttribute('readonly');
  }

  async isCloseEnabled() {
    return this.closeButton.isEnabled();
  }

  async clickClose() {
    await this.closeButton.click();
    await this.waitForDialogToClose();
  }

  getShareToggle() {
    return this.shareToggle;
  }

  getExpireToggle() {
    return this.expireToggle;
  }

  getExpireInput() {
    return this.expireInput;
  }

  async isShareToggleChecked() {
    const toggleClass = await this.getShareToggle().getAttribute('class');
    return toggleClass.includes('checked');
  }

  async isShareToggleDisabled() {
    const toggleClass = await this.getShareToggle().getAttribute('class');
    return toggleClass.includes('mat-disabled');
  }

  async isExpireToggleEnabled() {
    const toggleClass = await this.getExpireToggle().getAttribute('class');
    return toggleClass.includes('checked');
  }

  async copyUrl() {
    await this.urlAction.click();
  }

  async openDatetimePicker() {
    await this.datetimePickerButton.click();
  }

  async closeDatetimePicker() {
    if (await this.dateTimePicker.isCalendarOpen()) {
      await this.datetimePickerButton.click();
    }
  }

  async getExpireDate() {
    return this.getExpireInput().getAttribute('value');
  }

  async clickExpirationToggle() {
    await this.expireToggle.click();
  }

  async clickShareToggle() {
    await this.shareToggle.click();
  }
}
