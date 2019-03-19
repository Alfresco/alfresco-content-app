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

import { browser } from 'protractor';

import { APP_ROUTES } from '../../configs';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { navigate } from '../../utilities/browser-utils';

describe('Login', () => {
  const peopleApi = new RepoClient().people;
  const loginPage = new LoginPage();
  const { login } = loginPage;

  /* cspell:disable-next-line */
  const testUser = `user-${Utils.random()}@alfness`;

  const russianUser = {
    /* cspell:disable-next-line */
    username: `пользвате${Utils.random()}`,
    password: '密碼中國'
  };

  const johnDoe = {
    username: `user-${Utils.random()}`,
    get password() { return this.username; },
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
    await peopleApi.createUser({ username: testUser });
    await peopleApi.createUser(russianUser);
    await peopleApi.createUser(johnDoe);
    await peopleApi.createUser({ username: disabledUser });
    await peopleApi.createUser(testUser2);
    await peopleApi.disableUser(disabledUser);
    done();
  });

  afterEach(async (done) => {
    await Utils.clearLocalStorage();
    done();
  });

  describe('general tests', () => {
    beforeEach(async (done) => {
      await loginPage.load();
      done();
    });

    it('login page layout - [C213089]', async () => {
      expect(await login.isUsernameEnabled()).toBe(true, 'username input is not enabled');
      expect(await login.isPasswordEnabled()).toBe(true, 'password input is not enabled');
      expect(await login.isSubmitEnabled()).toBe(false, 'SIGN IN button is enabled');
      expect(await login.isPasswordHidden()).toBe(true, 'Password is not hidden by default');
    });

    it('change password visibility - [C213091]', async () => {
      await login.enterPassword('some password');
      expect(await login.isPasswordDisplayed()).toBe(false, 'password is visible');
      await login.clickPasswordVisibility();
      expect(await login.isPasswordHidden()).toBe(false, 'Password visibility not changed');
      expect(await login.isPasswordDisplayed()).toBe(true, 'password is not visible');
    });
  });

  describe('with valid credentials', () => {
    it('navigate to "Personal Files" - [C213092]', async () => {
      const { username } = johnDoe;

      await loginPage.loginWith(username);
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
    });

    it(`displays user's name in header - [C213108]`, async () => {
      const { userInfo } = new BrowsingPage(APP_ROUTES.PERSONAL_FILES).header;
      const { username, firstName, lastName } = johnDoe;

      await loginPage.loginWith(username);
      expect(await userInfo.getName()).toEqual(`${firstName} ${lastName}`);
    });

    it(`logs in with user having username containing "@" - [C213096]`, async () => {
      await loginPage.loginWith(testUser);
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
    });

    it('logs in with user with non-latin characters - [C213097]', async () => {
      const { username, password } = russianUser;

      await loginPage.loginWith(username, password);
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
    });

    // TODO: ACA-245
    xit('redirects to Home Page when navigating to the Login page while already logged in - [C213107]', async () => {
      const { username } = johnDoe;

      await loginPage.loginWith(username);

      await navigate(APP_ROUTES.LOGIN);
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
    });

    it('redirects to Personal Files when pressing browser Back while already logged in - [C213109]', async () => {
      const { username } = johnDoe;

      await loginPage.loginWith(username);
      await browser.navigate().back();
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
    });

    it('user is able to login after changing his password - [C213104]', async () => {
      await loginPage.loginWith(testUser2.username, testUser2.password);
      await peopleApi.changePassword(testUser2.username, newPassword);
      await loginPage.loginWith(testUser2.username, newPassword);
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
    });
  });

  describe('with invalid credentials', () => {
    const { login: loginComponent } = loginPage;
    const { submitButton, errorMessage } = loginComponent;

    beforeEach(async (done) => {
      await loginPage.load();
      done();
    });

    it('disabled submit button when password is empty - [C280072]', async () => {
      await loginComponent.enterUsername('any-username');
      expect(await submitButton.isEnabled()).toBe(false, 'submit button is enabled');
    });

    it('disabled submit button when username is empty - [C280070]', async () => {
      await loginPage.login.enterPassword('any-password');
      expect(await submitButton.isEnabled()).toBe(false, 'submit button is enabled');
    });

    it('shows error when entering nonexistent user - [C213093]', async () => {
      await loginPage.tryLoginWith('nonexistent-user', 'any-password');
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.LOGIN);
      expect(await errorMessage.isDisplayed()).toBe(true, 'error message is not displayed');
      expect(await errorMessage.getText()).toBe(`You've entered an unknown username or password`);
    });

    it('shows error when entering invalid password - [C280071]', async () => {
      const { username } = johnDoe;

      await loginPage.tryLoginWith(username, 'incorrect-password');
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.LOGIN);
      expect(await errorMessage.isDisplayed()).toBe(true, 'error message is not displayed');
      expect(await errorMessage.getText()).toBe(`You've entered an unknown username or password`);
    });

    it('unauthenticated user is redirected to Login page - [C213106]', async () => {
      await navigate(APP_ROUTES.PERSONAL_FILES);
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.LOGIN);
    });

    it('disabled user is not logged in - [C213100]', async () => {
      await loginPage.tryLoginWith(disabledUser);
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.LOGIN);
      expect(await errorMessage.isDisplayed()).toBe(true, 'error message is not displayed');
      expect(await errorMessage.getText()).toBe(`You've entered an unknown username or password`);
    });
  });
});
