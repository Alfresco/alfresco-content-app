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

import { CyComponent } from '../cy-component';
import { typeText } from '../../utils/cy-utils';

export class CyLoginComponent extends CyComponent {
  usernameInput = 'input#username';
  passwordInput = 'input#password';
  submitButton = '[type="submit"]';
  errorMessage = '.adf-login-error-message';
  copyright = '.adf-copyright';
  passwordVisibility = '.adf-login-password-icon';

  constructor(ancestor?: string) {
    super('adf-login', ancestor);
  }

  enterUsername(username: string) {
    typeText(this.usernameInput, username);
    return this;
  }

  enterPassword(password: string) {
    typeText(this.passwordInput, password);
    return this;
  }

  enterCredentials(username: string, password: string) {
    this.enterUsername(username).enterPassword(password);
    return this;
  }

  isPasswordDisplayed() {
    return cy
      .get(this.passwordInput)
      .invoke('attr', 'type')
      .then((type) => {
        return type === 'text';
      });
  }

  isPasswordHidden() {
    return cy
      .get(this.passwordInput)
      .invoke('attr', 'type')
      .then((type) => {
        return type === 'password';
      });
  }
}
