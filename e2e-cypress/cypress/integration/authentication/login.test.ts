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

// import { CyRepoClient } from '../../utils/cy-api/cy-repo-client/cy-repo-client';
import { CyAdminActions } from '../../utils/cy-api/cy-admin-actions';
import { CyLoginPage, CyBrowsingPage } from '../../pages';
import { CyUtils } from '../../utils/cy-utils';
import { APP_ROUTES } from '../../utils/cy-configs';

describe('Login', () => {
  const loginPage = new CyLoginPage();
  const { login } = loginPage;
  const adminApiActions = new CyAdminActions();

  /* cspell:disable-next-line */
  const testUser = `user-${CyUtils.random()}@alfness`;

  const russianUser = {
    /* cspell:disable-next-line */
    username: `пользвате${CyUtils.random()}`,
    password: '密碼中國'
  };

  const johnDoe = {
    username: `user-${CyUtils.random()}`,
    get password() {
      return this.username;
    },
    firstName: 'John',
    lastName: 'Doe'
  };

  const testUser2 = {
    username: `user-${CyUtils.random()}`,
    password: 'user2 password'
  };
  const newPassword = 'new password';

  describe('general tests', () => {
    beforeEach(() => {
      loginPage.load();
    });

    it('[C213089] login page layout', () => {
      cy.get(login.usernameInput).should('be.enabled');
      cy.get(login.passwordInput).should('be.enabled');
      cy.get(login.submitButton).should('not.be.enabled');
      login.isPasswordHidden().should('be.true');
    });

    it('[C213091] change password visibility', () => {
      login.enterPassword('some password');
      login.isPasswordDisplayed().should('be.false');
      cy.get(login.passwordVisibility).click();

      login.isPasswordHidden().should('be.false');
      login.isPasswordDisplayed().should('be.true');
    });
  });

  describe('with valid credentials', () => {
    before(() => {
      cy.then(async () => {
        await adminApiActions.login();
        await adminApiActions.createUser({ username: testUser });
        await adminApiActions.createUser(russianUser);
        await adminApiActions.createUser(johnDoe);
        await adminApiActions.createUser(testUser2);
      });
    });

    it('[C213092] navigate to "Personal Files"', () => {
      const { username } = johnDoe;

      loginPage.loginWith(username);
      cy.url().should('contain', APP_ROUTES.PERSONAL_FILES);
    });

    it(`[C213096] logs in with user having username containing "@"`, () => {
      loginPage.loginWith(testUser);
      cy.url().should('contain', APP_ROUTES.PERSONAL_FILES);
    });

    it('[C213097] logs in with user with non-latin characters', () => {
      const { username, password } = russianUser;

      loginPage.loginWith(username, password);
      cy.url().should('contain', APP_ROUTES.PERSONAL_FILES);
    });

    it('[C213107] redirects to Home Page when navigating to the Login page while already logged in', () => {
      const { username } = johnDoe;

      loginPage.loginWith(username);

      CyUtils.navigate(APP_ROUTES.LOGIN);
      cy.url().should('contain', APP_ROUTES.PERSONAL_FILES);
    });

    it('[C213109] redirects to Personal Files when pressing browser Back while already logged in', () => {
      const { username } = johnDoe;

      loginPage.loginWith(username);
      cy.go('back');
      cy.url().should('contain', APP_ROUTES.PERSONAL_FILES);
    });

    it('[C213104] user is able to login after changing his password', () => {
      loginPage.loginWith(testUser2.username, testUser2.password);
      const page = new CyBrowsingPage();
      page.signOut();

      cy.then(async () => {
        await adminApiActions.login();
        await adminApiActions.changePassword(testUser2.username, newPassword);
      });

      loginPage.load();

      cy.get(login.passwordVisibility).click();
      loginPage.loginWith(testUser2.username, newPassword);
      cy.url().should('contain', APP_ROUTES.PERSONAL_FILES);
    });
  });

  describe('with invalid credentials', () => {
    const { login: loginComponent } = loginPage;
    const { submitButton } = loginComponent;

    beforeEach(() => {
      loginPage.load();
    });

    it('[C280072] disabled submit button when password is empty', () => {
      loginComponent.enterUsername('any-username');
      cy.get(submitButton).should('not.be.enabled');
    });

    it('[C280070] disabled submit button when username is empty', () => {
      loginPage.login.enterPassword('any-password');
      cy.get(submitButton).should('not.be.enabled');
    });

    it('[C213106] unauthenticated user is redirected to Login page', () => {
      CyUtils.navigate(APP_ROUTES.PERSONAL_FILES);
      cy.url().should('contain', APP_ROUTES.LOGIN);
    });
  });
});
