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
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { APP_ROUTES } from '../../configs';

describe('Logout', () => {
  const page = new BrowsingPage();
  const loginPage = new LoginPage();

  const peopleApi = new RepoClient().people;

  const johnDoe = `user-${Utils.random()}`;

  beforeAll(async (done) => {
    await peopleApi.createUser({ username: johnDoe });
    done();
  });

  beforeEach(async (done) => {
    await loginPage.loginWith(johnDoe);
    done();
  });

  it('Sign out option is available - [C213143]', async () => {
    await page.header.userInfo.openMenu();
    expect(await page.header.isSignOutDisplayed()).toBe(true, 'Sign out option not displayed');
  });

  it('redirects to Login page on sign out - [C213144]', async () => {
    await page.signOut();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.LOGIN);
  });

  it('redirects to Login page when pressing browser Back after logout - [C213145]', async () => {
    await page.signOut();
    await browser.navigate().back();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.LOGIN);
  });

  it('redirects to Login page when trying to access a part of the app after logout - [C213146]', async () => {
    await page.signOut();
    await page.load('/favorites');
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.LOGIN);
  });
});
