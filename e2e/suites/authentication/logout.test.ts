/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2017 Alfresco Software Limited
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

import { APP_ROUTES, BROWSER_WAIT_TIMEOUT } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('Logout', () => {
    const page = new BrowsingPage();
    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();

    const peopleApi = new RepoClient().people;

    const johnDoe = `user-${Utils.random()}`;

    beforeAll((done) => {
        peopleApi
            .createUser(johnDoe)
            .then(done);
    });

    beforeEach((done) => {
        loginPage.load()
            .then(() => loginPage.loginWith(johnDoe))
            .then(done);
    });

    afterEach((done) => {
        logoutPage.load()
            .then(() => Utils.clearLocalStorage())
            .then(done);
    });

    it('redirects to Login page, on sign out', () => {
        page.signOut()
            .then(() => {
                expect(browser.getCurrentUrl()).toContain(APP_ROUTES.LOGIN);
            });
    });

    it('redirects to Login page when pressing browser Back after logout', () => {
        page.signOut()
            .then(() => browser.navigate().back())
            .then(() => {
                expect(browser.getCurrentUrl()).toContain(APP_ROUTES.LOGIN);
            });
    });
});
