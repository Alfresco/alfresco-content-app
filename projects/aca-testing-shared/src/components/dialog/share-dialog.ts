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

import { by } from 'protractor';
import { DateTimePicker } from '../../components/datetime-picker/datetime-picker';
import { GenericDialog } from '../dialog/generic-dialog';
import { isPresentAndEnabled } from '../../utilities/utils';
import { BrowserActions } from '@alfresco/adf-testing';

export class ShareDialog extends GenericDialog {
  dateTimePicker = new DateTimePicker();

  dialogTitle = this.childElement(by.css(`[data-automation-id='adf-share-dialog-title']`));
  infoText = this.childElement(by.css('.adf-share-link__info'));
  labels = this.rootElem.all(by.css('.adf-share-link__label'));
  shareToggle = this.childElement(by.css(`[data-automation-id='adf-share-toggle']`));
  url = this.childElement(by.css(`[data-automation-id='adf-share-link']`));
  urlAction = this.childElement(by.css('.adf-input-action'));
  expireToggle = this.childElement(by.css(`[data-automation-id='adf-expire-toggle']`));
  expireInput = this.childElement(by.css('input[formcontrolname="time"]'));
  datetimePickerButton = this.childElement(by.css('.mat-datetimepicker-toggle'));

  closeButton = this.childElement(by.css(`[data-automation-id='adf-share-dialog-close']`));

  constructor() {
    super('.adf-share-dialog');
  }

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async getInfoText(): Promise<string> {
    return this.infoText.getText();
  }

  async getLinkUrl(): Promise<string> {
    return BrowserActions.getInputValue(this.url);
  }

  async isUrlReadOnly(): Promise<boolean> {
    const urlAttr = await this.url.getAttribute('readonly');
    return urlAttr === 'true';
  }

  async isCloseEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.closeButton);
  }

  async clickClose(): Promise<void> {
    await this.closeButton.click();
    await this.waitForDialogToClose();
  }

  async isShareToggleChecked(): Promise<boolean> {
    const toggleClass = await this.shareToggle.getAttribute('class');
    return toggleClass.includes('checked');
  }

  async isShareToggleDisabled(): Promise<boolean> {
    const toggleClass = await this.shareToggle.getAttribute('class');
    return toggleClass.includes('mat-disabled');
  }

  async isExpireToggleEnabled(): Promise<boolean> {
    const toggleClass = await this.expireToggle.getAttribute('class');
    return toggleClass.includes('checked');
  }

  async closeDatetimePicker(): Promise<void> {
    if (await this.dateTimePicker.isCalendarOpen()) {
      await BrowserActions.click(this.datetimePickerButton);
    }
  }

  async getExpireDate(): Promise<string> {
    return BrowserActions.getInputValue(this.expireInput);
  }
}
