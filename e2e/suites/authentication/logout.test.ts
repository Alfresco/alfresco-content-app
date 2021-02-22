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
import { BrowsingPage, APP_ROUTES } from '@alfresco/aca-testing-shared';
import { ApiService, UserModel, UsersActions, LoginPage } from '@alfresco/adf-testing';

describe('Logout', () => {
  const page = new BrowsingPage();
  const loginPage = new LoginPage();
  let user: UserModel;
  const adminApiService = new ApiService();
  const usersActions = new UsersActions(adminApiService);

  beforeAll(async (done) => {
    await adminApiService.loginWithProfile('admin');
    await usersActions.createUser();
    await apiService.login(user.username, user.password);
    done();
  });

  beforeEach(async (done) => {
    await loginPage.login(user.username, user.password);
    done();
  });

  it('[C213143] Sign out option is available', async () => {
    await page.header.openMoreMenu();
    expect(await page.header.menu.isMenuItemPresent('Sign out')).toBe(true, 'Sign out option not displayed');
  });

  it('[C213144] redirects to Login page on sign out', async () => {
    await page.signOut();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.LOGIN);
  });

  it('[C213145] redirects to Login page when pressing browser Back after logout', async () => {
    await page.signOut();
    await browser.navigate().back();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.LOGIN);
  });

  it('[C213146] redirects to Login page when trying to access a part of the app after logout', async () => {
    await page.signOut();
    await page.load('/favorites');
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.LOGIN);
  });
});
