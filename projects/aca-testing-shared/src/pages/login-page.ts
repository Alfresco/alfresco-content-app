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
import { browser } from 'protractor';
import { LoginComponent } from '../components/components';
import { Page } from './page';

import { APP_ROUTES } from '../configs';
import { BrowserActions, BrowserVisibility } from '@alfresco/adf-testing';

export class LoginPage extends Page {
  login = new LoginComponent(this.appRoot);

  constructor() {
    super(APP_ROUTES.LOGIN);
  }

  async load() {
    await super.load();
    await BrowserVisibility.waitUntilElementIsPresent(this.login.submitButton);
  }

  async loginWith(username: string, password?: string) {
    const pass = password || username;
    await this.load();
    await this.login.enterCredentials(username, pass);
    await BrowserActions.click(this.login.submitButton);
    return super.waitForApp();
  }

  async loginWithAdmin() {
    await this.load();
    return this.loginWith(browser.params.ADMIN_USERNAME, browser.params.ADMIN_PASSWORD);
  }

  async tryLoginWith(username: string, password?: string) {
    const pass = password || username;
    await this.load();
    await this.login.enterCredentials(username, pass);
    await BrowserActions.click(this.login.submitButton);
    await BrowserVisibility.waitUntilElementIsPresent(this.login.errorMessage);
  }
}
