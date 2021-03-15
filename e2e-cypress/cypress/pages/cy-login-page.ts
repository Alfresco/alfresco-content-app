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

import { CyLoginComponent } from '../components/login/cy-login';
import { CyPage } from './cy-page';
import { APP_ROUTES } from '../utils/cy-configs';

export class CyLoginPage extends CyPage {
  login = new CyLoginComponent(this.appRoot);

  constructor() {
    super(APP_ROUTES.LOGIN);
  }

  load() {
    super.load();

    this.isLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        this.signOut();
      }
    });

    cy.get(this.login.submitButton).should('be.visible');
  }

  loginWith(username: string, password?: string) {
    const pass = password || username;

    this.load();

    this.login.enterCredentials(username, pass);
    cy.get(this.login.submitButton).click();
    this.waitForApp();
  }

  loginWithAdmin() {
    return this.loginWith(Cypress.env('params').ADMIN_USERNAME, Cypress.env('params').ADMIN_PASSWORD);
  }

  tryLoginWith(username: string, password?: string) {
    const pass = password || username;
    this.load();
    this.login.enterCredentials(username, pass);
    cy.get(this.login.submitButton).click();
    cy.get(this.login.errorMessage).should('be.visible');
  }
}
