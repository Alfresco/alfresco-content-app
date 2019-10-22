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

import { ElementFinder, by, browser, ExpectedConditions as EC, until } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';

export class PasswordDialog extends Component {
  private static selectors = {
    root: 'adf-pdf-viewer-password-dialog',

    title: '.mat-dialog-title',
    content: '.mat-dialog-content',
    passwordInput: 'input[type="Password"]',
    actionButtons: '.mat-dialog-actions',
    errorMessage: '.mat-error'
  };

  title: ElementFinder = this.component.element(by.css(PasswordDialog.selectors.title));
  content: ElementFinder = this.component.element(by.css(PasswordDialog.selectors.content));
  passwordInput: ElementFinder = this.component.element(by.css(PasswordDialog.selectors.passwordInput));
  errorMessage: ElementFinder = this.component.element(by.css(PasswordDialog.selectors.errorMessage));
  closeButton: ElementFinder = this.component.element(by.buttonText('Close'));
  submitButton: ElementFinder = this.component.element(by.buttonText('Submit'));

  constructor(ancestor?: ElementFinder) {
    super(PasswordDialog.selectors.root, ancestor);
  }

  async waitForDialogToClose() {
    await browser.wait(EC.stalenessOf(this.title), BROWSER_WAIT_TIMEOUT);
  }

  async waitForDialogToOpen() {
    await browser.wait(EC.presenceOf(this.title), BROWSER_WAIT_TIMEOUT);
  }

  async isDialogOpen() {
    return browser.isElementPresent(by.css(PasswordDialog.selectors.root));
  }

  async getTitle() {
    return this.title.getText();
  }

  async isCloseEnabled() {
    return this.closeButton.isEnabled();
  }

  async isSubmitEnabled() {
    return this.submitButton.isEnabled();
  }

  async clickClose() {
    await this.closeButton.click();
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async isPasswordInputDisplayed() {
    const present = await browser.isElementPresent(this.passwordInput);
    if (present) {
      return this.passwordInput.isDisplayed();
    } else {
      return false;
    }
  }

  async isErrorDisplayed() {
    const elem = await browser.wait(until.elementLocated(by.css(PasswordDialog.selectors.errorMessage)), BROWSER_WAIT_TIMEOUT, '------- timeout waiting for error message to appear')
    return browser.isElementPresent(elem);
  }

  async getErrorMessage() {
    if (await this.isErrorDisplayed()) {
      return this.errorMessage.getText();
    }
    return '';
  }

  async enterPassword(password: string) {
    await this.passwordInput.clear();
    await this.passwordInput.sendKeys(password);
  }
}
