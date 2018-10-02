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

import { ElementFinder, by, browser, ExpectedConditions as EC } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';

export class ShareDialog extends Component {
  private static selectors = {
    root: '.adf-share-dialog',

    title: '.mat-dialog-title',
    content: '.mat-dialog-content',
    button: '.mat-button'
  };

  title: ElementFinder = this.component.element(by.css(ShareDialog.selectors.title));
  content: ElementFinder = this.component.element(by.css(ShareDialog.selectors.content));
  closeButton: ElementFinder = this.component.element(by.cssContainingText(ShareDialog.selectors.button, 'CLOSE'));

  constructor(ancestor?: ElementFinder) {
    super(ShareDialog.selectors.root, ancestor);
  }

  async waitForDialogToClose() {
    await browser.wait(EC.stalenessOf(this.title), BROWSER_WAIT_TIMEOUT);
  }

  async isDialogOpen() {
    return await browser.$(ShareDialog.selectors.root).isDisplayed();
  }

  async getTitle() {
    return await this.title.getText();
  }

  async getText() {
    return await this.content.getText();
  }

  async clickClose() {
    await this.closeButton.click();
    await this.waitForDialogToClose();
  }
}
