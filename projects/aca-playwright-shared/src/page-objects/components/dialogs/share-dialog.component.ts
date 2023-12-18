/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../base.component';
import { timeouts } from '../../../utils';
import { DateTimePicker } from '../datetime-picker/datetime-picker.component';

export class ShareDialogComponent extends BaseComponent {
  private static rootElement = 'adf-share-dialog';

  constructor(page: Page) {
    super(page, ShareDialogComponent.rootElement);
  }

  closeButton = this.getChild('[data-automation-id="adf-share-dialog-close"]');
  dialogTitle = this.getChild('[data-automation-id="adf-share-dialog-title"]');
  infoText = this.getChild('.adf-share-link__info').first();
  labels = '.adf-share-link__label';
  shareToggle = this.getChild(`[data-automation-id='adf-share-toggle']`);
  url = this.getChild(`[data-automation-id='adf-share-link']`);
  urlAction = this.getChild('.adf-input-action');
  expireToggle = this.getChild(`[data-automation-id='adf-expire-toggle']`);
  expireInput = this.getChild('input[formcontrolname="time"]');
  datetimePickerButton = this.getChild('.mat-datepicker-toggle');

  dateTimePicker = new DateTimePicker(this.page);

  getDialogLabel = () => this.getChild('label').innerText();
  getErrorByText = (text: string): Locator => this.page.locator('mat-error', { hasText: text });

  async getLabels() {
    return await this.page.$$eval('.adf-share-link__label', (elements) => elements.map((element) => element.textContent));
  }

  async isErrorMessageDisplayed(errorText: string): Promise<boolean> {
    await this.getErrorByText(errorText).waitFor({ state: 'visible', timeout: timeouts.large });
    return await this.getErrorByText(errorText).isVisible();
  }

  async getDialogTitle(): Promise<string> {
    return await this.dialogTitle.innerText();
  }

  async getInfoText(): Promise<string> {
    return await this.infoText.innerText();
  }

  async getLinkUrl(): Promise<string> {
    return await this.url.inputValue();
  }

  async isUrlReadOnly(): Promise<boolean> {
    const urlAttr = await this.url.getAttribute('readonly');
    return urlAttr === 'true';
  }

  async isCloseEnabled(): Promise<boolean> {
    return await this.closeButton.isEnabled();
  }

  async clickClose(): Promise<void> {
    await this.page.waitForTimeout(timeouts.tiny);
    await this.closeButton.click();
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

  async getExpireDate(): Promise<string> {
    return await this.expireInput.inputValue();
  }
}
