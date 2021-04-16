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
import { waitForPresence } from '../utilities/utils';
import { BrowserActions, Logger } from '@alfresco/adf-testing';

export class LoginPage extends Page {
  login = new LoginComponent(this.appRoot);

  constructor() {
    super(APP_ROUTES.LOGIN);
  }

  async load() {
    await super.load();

    if (await this.isLoggedIn()) {
      await this.signOut();
    }

    await waitForPresence(this.login.submitButton);
  }

  async loginWith(username: string, password?: string) {
    try {
      const pass = password || username;

      await this.load();

      await this.login.enterCredentials(username, pass);
      await BrowserActions.click(this.login.submitButton);
      await this.waitForApp();
    } catch (error) {
      Logger.error(`----- loginWith catch : failed to login with user: ${username} : ${error}`);
    }
  }

  async loginWithAdmin() {
    await this.loginWith(browser.params.ADMIN_USERNAME, browser.params.ADMIN_PASSWORD);
  }

  async tryLoginWith(username: string, password?: string) {
    const pass = password || username;
    await this.load();
    await this.login.enterCredentials(username, pass);
    await BrowserActions.click(this.login.submitButton);
    await waitForPresence(this.login.errorMessage);
  }
}
