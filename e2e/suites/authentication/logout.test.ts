/*!
 * @license
 * Copyright 2017 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
