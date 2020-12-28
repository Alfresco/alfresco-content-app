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
import { APP_ROUTES, Utils, navigate } from '@alfresco/aca-testing-shared';
import { ApiService, BrowserActions, UserModel, UsersActions, LoginPage } from '@alfresco/adf-testing';

describe('Login', () => {
  const loginPage = new LoginPage();
  const { login } = loginPage;
  const adminApiService = new ApiService();
  const adminApiActions = new ApiActions(adminApiService);
  const usersActions = new UsersActions(adminApiService);

  /* cspell:disable-next-line */
  const testUser = `user-${Utils.random()}@alfness`;

  const russianUser = {
    /* cspell:disable-next-line */
    username: `пользвате${Utils.random()}`,
    password: '密碼中國'
  };

  const johnDoe = {
    username: `user-${Utils.random()}`,
    get password() {
      return this.username;
    },
    firstName: 'John',
    lastName: 'Doe'
  };

  const disabledUser = `user-${Utils.random()}`;
  const testUser2 = {
    username: `user-${Utils.random()}`,
    password: 'user2 password'
  };
  const newPassword = 'new password';

  beforeAll(async (done) => {
    await adminApiService.loginWithProfile('admin');
    await usersActions.createUser(new UserModel({ username: testUser }));
    await usersActions.createUser(new UserModel(russianUser));
    await usersActions.createUser(new UserModel(johnDoe));
    await usersActions.createUser(new UserModel({ username: disabledUser }));
    await usersActions.createUser(new UserModel(testUser2));

    await adminApiActions.disableUser(disabledUser);
    done();
  });

  afterEach(async (done) => {
    await Utils.clearLocalStorage();
    done();
  });

  describe('general tests', () => {
    beforeEach(async (done) => {
      done();
    });

    it('[C213089] login page layout', async () => {
      expect(await login.usernameInput.isEnabled()).toBe(true, 'username input is not enabled');
      expect(await login.passwordInput.isEnabled()).toBe(true, 'password input is not enabled');
      expect(await login.submitButton.isEnabled()).toBe(false, 'SIGN IN button is enabled');
      expect(await login.isPasswordHidden()).toBe(true, 'Password is not hidden by default');
    });

    it('[C213091] change password visibility', async () => {
      await login.enterPassword('some password');
      expect(await login.isPasswordDisplayed()).toBe(false, 'password is visible');
      await BrowserActions.click(login.passwordVisibility);

      expect(await login.isPasswordHidden()).toBe(false, 'Password visibility not changed');
      expect(await login.isPasswordDisplayed()).toBe(true, 'password is not visible');
    });
  });

  describe('with valid credentials', () => {
    it('[C213092] navigate to "Personal Files"', async () => {
      const { username } = johnDoe;

      await loginPage.login(user.username, user.password);
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
    });

    it(`[C213096] logs in with user having username containing "@"`, async () => {
      await loginPage.login(testUser);
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
    });

    it('[C213097] logs in with user with non-latin characters', async () => {
      const { username, password } = russianUser;

      await loginPage.login(user.username, password);
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
    });

    it('[C213107] redirects to Home Page when navigating to the Login page while already logged in', async () => {
      const { username } = johnDoe;

      await loginPage.login(user.username, user.password);

      await navigate(APP_ROUTES.LOGIN);
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
    });

    it('[C213109] redirects to Personal Files when pressing browser Back while already logged in', async () => {
      const { username } = johnDoe;

      await loginPage.login(user.username, user.password);
      await browser.navigate().back();
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
    });

    it('[C213104] user is able to login after changing his password', async () => {
      await loginPage.login(testUser2.username, testUser2.password);
      await adminApiActions.changePassword(testUser2.username, newPassword);
      await loginPage.login(testUser2.username, newPassword);
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
    });
  });

  describe('with invalid credentials', () => {
    const { login: loginComponent } = loginPage;
    const { submitButton } = loginComponent;

    beforeEach(async (done) => {
      done();
    });

    it('[C280072] disabled submit button when password is empty', async () => {
      await loginComponent.enterUsername('any-username');
      expect(await submitButton.isEnabled()).toBe(false, 'submit button is enabled');
    });

    it('[C280070] disabled submit button when username is empty', async () => {
      await loginPage.login.enterPassword('any-password');
      expect(await submitButton.isEnabled()).toBe(false, 'submit button is enabled');
    });

    it('[C213106] unauthenticated user is redirected to Login page', async () => {
      await navigate(APP_ROUTES.PERSONAL_FILES);
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.LOGIN);
    });
  });
});
