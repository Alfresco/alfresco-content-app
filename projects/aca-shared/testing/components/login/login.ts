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

import { Component } from '../component';
import { typeText } from '../../utilities/utils';

export class LoginComponent extends Component {
  usernameInput = this.byCss('input#username');
  passwordInput = this.byCss('input#password');
  submitButton = this.byCss('button#login-button');
  errorMessage = this.byCss('.adf-login-error-message');
  copyright = this.byCss('.adf-copyright');
  passwordVisibility = this.byCss('.adf-login-password-icon');

  constructor(ancestor?: string) {
    super('adf-login', ancestor);
  }

  async enterUsername(username: string): Promise<void> {
    await typeText(this.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await typeText(this.passwordInput, password);
  }

  async enterCredentials(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
  }

  private async getPasswordVisibility(): Promise<boolean> {
    const text = await this.passwordVisibility.getText();
    return text.endsWith('visibility');
  }

  async isPasswordDisplayed(): Promise<boolean> {
    const type = await this.passwordInput.getAttribute('type');
    if (type === 'text') {
      return true;
    } else {
      if (type === 'password') {
        return false;
      }
    }

    return false;
  }

  async isPasswordHidden() {
    return !(await this.getPasswordVisibility());
  }
}
