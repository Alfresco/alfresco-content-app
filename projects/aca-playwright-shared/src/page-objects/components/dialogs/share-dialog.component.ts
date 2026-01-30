/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { ElementHandle, Page } from '@playwright/test';
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
  datetimePickerButton = this.getChild('[data-automation-id="adf-content-share-expiration-field"] button');
  dateErrorText = this.getChild('[data-automation-id="adf-share-link-input-warning"]');
  clockIcon = this.getChild('[adf-icon="timer"]');

  dateTimePicker = new DateTimePicker(this.page);

  getDialogLabel = () => this.getChild('label').innerText();

  async getLabels(): Promise<Array<string>> {
    return this.page.$$eval('.adf-share-link__label', (elements) => elements.map((element) => element.textContent));
  }

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.innerText();
  }

  async getInfoText(): Promise<string> {
    return this.infoText.innerText();
  }

  async getLinkUrl(): Promise<string> {
    return this.url.first().inputValue();
  }

  async isUrlReadOnly(): Promise<boolean> {
    const urlAttr = await this.url.getAttribute('readonly');
    return urlAttr === 'true';
  }

  async isCloseEnabled(): Promise<boolean> {
    return this.closeButton.isEnabled();
  }

  async clickClose(): Promise<void> {
    await this.page.waitForTimeout(timeouts.tiny);
    await this.closeButton.click();
  }

  async isToggleStatus(toggle: ElementHandle, status: string): Promise<boolean> {
    const toggleClass = await toggle.getAttribute('class');
    return toggleClass.includes(status);
  }

  async isShareToggleChecked(): Promise<boolean> {
    const shareToggleElement = await this.shareToggle.elementHandle();
    return this.isToggleStatus(shareToggleElement, 'checked');
  }

  async isExpireToggleEnabled(): Promise<boolean> {
    const expireToggleElement = await this.expireToggle.elementHandle();
    return this.isToggleStatus(expireToggleElement, 'checked');
  }

  async getExpireDate(): Promise<string> {
    return this.expireInput.inputValue();
  }
}
