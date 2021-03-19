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

import { CyBrowsingPage, CyLoginPage } from '../../pages';
import { CyUtils } from '../../utils/cy-utils';
import { CyAdminActions } from '../../utils/cy-api/cy-admin-actions';
import { APP_ROUTES } from '../../utils/cy-configs';

describe('Logout', () => {
  const page = new CyBrowsingPage();
  const loginPage = new CyLoginPage();
  const johnDoe = `user-${CyUtils.random()}`;
  const adminApiActions = new CyAdminActions();

  before(() => {
    cy.then(async () => {
      await adminApiActions.createUser({ username: johnDoe });
    });
  });

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.loginWith(johnDoe);
  });

  it('[C213143] Sign out option is available', () => {
    page.header.openMoreMenu();
    page.header.menu.isMenuItemPresent('Sign out').should('be.true');
  });

  it('[C213144] redirects to Login page on sign out', () => {
    page.signOut();
    cy.url().should('contain', APP_ROUTES.LOGIN);
  });

  it('[C213145] redirects to Login page when pressing browser Back after logout', () => {
    page.signOut();
    cy.go('back');
    cy.url().should('contain', APP_ROUTES.LOGIN);
  });

  it('[C213146] redirects to Login page when trying to access a part of the app after logout', () => {
    page.signOut();
    page.load('/favorites');
    cy.url().should('contain', APP_ROUTES.LOGIN);
  });
});
