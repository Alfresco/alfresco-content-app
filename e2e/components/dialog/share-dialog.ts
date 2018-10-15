/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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
import { Component } from '../component';

export class ShareDialog extends Component {
  private static selectors = {
    root: '.adf-share-dialog',

    title: `[data-automation-id='adf-share-dialog-title']`,
    info: '.adf-share-link__info',
    label: '.adf-share-link__label',
    shareToggle: `[data-automation-id='adf-share-toggle']`,
    linkUrl: `[data-automation-id='adf-share-link']`,
    expireToggle: `[data-automation-id='adf-expire-toggle']`,
    button: `[data-automation-id='adf-share-dialog-close']`
  };

  title: ElementFinder = this.component.element(by.css(ShareDialog.selectors.title));
  infoText: ElementFinder = this.component.element(by.css(ShareDialog.selectors.info));
  labels: ElementArrayFinder = this.component.all(by.css(ShareDialog.selectors.label));
  shareToggle: ElementFinder = this.component.element(by.css(ShareDialog.selectors.shareToggle));
  url: ElementFinder = this.component.element(by.css(ShareDialog.selectors.linkUrl));
  expireToggle: ElementFinder = this.component.element(by.css(ShareDialog.selectors.expireToggle));
  closeButton: ElementFinder = this.component.element(by.css(ShareDialog.selectors.button));

  constructor(ancestor?: ElementFinder) {
    super(ShareDialog.selectors.root, ancestor);
  }

  async waitForDialogToClose() {
    await browser.wait(EC.stalenessOf(this.title), BROWSER_WAIT_TIMEOUT);
  }

  async waitForDialogToOpen() {
    await browser.wait(EC.presenceOf(this.title), BROWSER_WAIT_TIMEOUT);
    await browser.sleep(10000);
  }

  async isDialogOpen() {
    return await browser.$(ShareDialog.selectors.root).isDisplayed();
  }

  async getTitle() {
    return await this.title.getText();
  }

  async getInfoText() {
    return await this.infoText.getText();
  }

  getLabels() {
    return this.labels;
  }

  async getLinkUrl() {
    return await this.url.getText();
  }

  async isUrlReadOnly() {
    return await this.url.getAttribute('readonly');
  }

  async clickClose() {
    await this.closeButton.click();
    await this.waitForDialogToClose();
  }

  getShareToggle() {
    return this.shareToggle;
  }

  async isShareToggleEnabled() {
    const toggleClass = await this.getShareToggle().getAttribute('class');
    console.log('=====> toggle 1', toggleClass);
    // await this.shareToggle.click();
    // toggleClass = await this.getShareToggle().getAttribute('class');
    // expect(1).toEqual(2);
    // console.log('=====> toggle 2', toggleClass);
  }
}
