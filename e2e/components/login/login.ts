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

import { by, ElementFinder } from 'protractor';
import { Component } from '../component';

export class LoginComponent extends Component {
  private static selectors = {
    root: 'adf-login',

    usernameInput: by.css('input#username'),
    passwordInput: by.css('input#password'),
    passwordVisibility: by.css('.adf-login-password-icon'),
    submitButton: by.css('button#login-button'),
    errorMessage: by.css('.adf-login-error-message'),
    copyright: by.css('.adf-copyright')
  };

  usernameInput: ElementFinder = this.component.element(LoginComponent.selectors.usernameInput);
  passwordInput: ElementFinder = this.component.element(LoginComponent.selectors.passwordInput);
  submitButton: ElementFinder = this.component.element(LoginComponent.selectors.submitButton);
  errorMessage: ElementFinder = this.component.element(LoginComponent.selectors.errorMessage);
  copyright: ElementFinder = this.component.element(LoginComponent.selectors.copyright);
  passwordVisibility: ElementFinder = this.component.element(LoginComponent.selectors.passwordVisibility);

  constructor(ancestor?: ElementFinder) {
    super(LoginComponent.selectors.root, ancestor);
  }

  async enterUsername(username: string) {
    const { usernameInput } = this;

    await usernameInput.clear();
    await usernameInput.sendKeys(username);
  }

  async enterPassword(password: string) {
    const { passwordInput } = this;

    await passwordInput.clear();
    await passwordInput.sendKeys(password);
  }

  async enterCredentials(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async clickPasswordVisibility() {
    await this.passwordVisibility.click();
  }

  async getPasswordVisibility(): Promise<boolean> {
    const text = await this.passwordVisibility.getText();
    if (text.endsWith('visibility_off')) {
      return false;
    }
    else {
      if (text.endsWith('visibility')) {
        return true;
      }
    }

    return false;
  }

  async isPasswordDisplayed(): Promise<boolean> {
    const type = await this.passwordInput.getAttribute('type');
    if (type === 'text') {
      return true;
    }
    else {
      if (type === 'password') {
        return false;
      }
    }

    return false;
  }

  async isUsernameEnabled() {
    return this.usernameInput.isEnabled();
  }

  async isPasswordEnabled() {
    return this.passwordInput.isEnabled();
  }

  async isSubmitEnabled() {
    return this.submitButton.isEnabled();
  }

  async isPasswordHidden() {
    return !(await this.getPasswordVisibility());
  }

}
