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

import { ElementFinder, by, browser, until } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';

export class PasswordDialog extends Component {
  selectors = {
    root: 'adf-pdf-viewer-password-dialog',

    title: '.mat-dialog-title',
    content: '.mat-dialog-content',
    passwordInput: 'input[type="Password"]',
    actionButtons: '.mat-dialog-actions',
    errorMessage: '.mat-error'
  };

  title = this.getByCss(this.selectors.title);
  content = this.getByCss(this.selectors.content);
  passwordInput = this.getByCss(this.selectors.passwordInput);
  errorMessage = this.getByCss(this.selectors.errorMessage);
  closeButton = this.component.element(by.buttonText('Close'));
  submitButton = this.component.element(by.buttonText('Submit'));

  constructor(ancestor?: ElementFinder) {
    super('adf-pdf-viewer-password-dialog', ancestor);
  }

  async waitForDialogToClose() {
    await this.waitStale(this.title);
  }

  async waitForDialogToOpen() {
    await this.wait(this.title);
  }

  async isDialogOpen() {
    return await browser.isElementPresent(by.css(this.selectors.root));
  }

  async getTitle() {
    return await this.title.getText();
  }

  async isCloseEnabled() {
    return await this.closeButton.isEnabled();
  }

  async isSubmitEnabled() {
    return await this.submitButton.isEnabled();
  }

  async clickClose() {
    return await this.closeButton.click();
  }

  async clickSubmit() {
    return await this.submitButton.click();
  }

  async isPasswordInputDisplayed() {
    const present = await browser.isElementPresent(this.passwordInput);
    if (present) {
      return await this.passwordInput.isDisplayed();
    } else {
      return false;
    }
  }

  async isErrorDisplayed() {
    const elem = await browser.wait(
      until.elementLocated(by.css(this.selectors.errorMessage)),
      BROWSER_WAIT_TIMEOUT,
      '------- timeout waiting for error message to appear'
    );
    return await browser.isElementPresent(elem);
  }

  async getErrorMessage() {
    if (await this.isErrorDisplayed()) {
      return await this.errorMessage.getText();
    }
    return '';
  }

  async enterPassword(password: string) {
    await this.passwordInput.clear();
    await this.passwordInput.sendKeys(password);
  }
}
