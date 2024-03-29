/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { expect } from '@playwright/test';
import { ApiClientFactory, Utils, test } from '@alfresco/playwright-shared';

test.describe('viewer file', () => {
  const apiClientFactory = new ApiClientFactory();

  const otherLanguageUser = {
    /* cspell:disable-next-line */
    username: `пользвате${Utils.random()}`,
    /* cspell:disable-next-line */
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

  const testUser2 = {
    username: `user-${Utils.random()}`,
    password: Utils.random()
  };
  const newPassword = 'new password';

  test.beforeAll(async () => {
    await apiClientFactory.setUpAcaBackend('admin');

    await apiClientFactory.createUser(otherLanguageUser);
    await apiClientFactory.createUser(johnDoe);
    await apiClientFactory.createUser(testUser2);
  });

  test.describe('general tests', () => {
    test('[C213089] login page layout', async ({ loginPage }) => {
      await loginPage.navigate();
      await expect(loginPage.username, 'username input is not enabled').toBeEnabled();
      await expect(loginPage.password, 'password input is not enabled').toBeEnabled();
      await expect(loginPage.submitButton, 'SIGN IN button is enabled').toBeDisabled();
      await loginPage.password.fill('text');
      expect(await loginPage.isPasswordDisplayed(), 'Password is not hidden by default').toBe(false);
      await loginPage.passwordVisibility.click();
      expect(await loginPage.isPasswordDisplayed(), 'Password is not visible on show password').toBe(true);
    });
  });

  test.describe('with invalid credentials', () => {
    test('[C213106] unauthenticated user is redirected to Login page', async ({ personalFiles }) => {
      await personalFiles.navigate();
      expect(personalFiles.page.url()).toContain('login');
    });
  });

  test.describe('with valid credentials', () => {
    test('[C213097] logs in with user with non-latin characters', async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.loginUser({ username: otherLanguageUser.username, password: otherLanguageUser.password });
      expect(loginPage.page.url()).toContain('personal-files');
    });

    test('[C213107] redirects to Home Page when navigating to the Login page while already logged in', async ({ loginPage }) => {
      const { username } = johnDoe;
      await loginPage.navigate();
      await loginPage.loginUser({ username: username, password: username });
      await loginPage.userProfileButton.waitFor({ state: 'attached' });
      await loginPage.navigate();
      await loginPage.userProfileButton.waitFor({ state: 'attached' });
      expect(loginPage.page.url()).toContain('personal-files');
    });

    test('[C213104] user is able to login after changing his password', async ({ loginPage }) => {
      await apiClientFactory.changePassword(testUser2.username, newPassword);
      await loginPage.navigate();
      await loginPage.loginUser({ username: testUser2.username, password: newPassword });
      await loginPage.userProfileButton.waitFor({ state: 'attached' });
      expect(loginPage.page.url()).toContain('personal-files');
    });
  });
});
