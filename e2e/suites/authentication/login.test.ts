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

import { APP_ROUTES } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('Login', () => {
    const peopleApi = new RepoClient().people;
    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();

    const testUser = `user-${Utils.random()}@alfness`;

    const russianUser = {
        username: `пользвате${Utils.random()}`,
        password: '密碼中國'
    };

    const johnDoe = {
        username: `user-${Utils.random()}`,
        get password() { return this.username; },
        firstName: 'John',
        lastName: 'Doe'
    };

    beforeAll(done => {
        Promise
            .all([
                peopleApi.createUser(testUser),
                peopleApi.createUser(russianUser.username, russianUser.password),
                peopleApi.createUser(johnDoe.username, johnDoe.password, {
                    firstName: johnDoe.firstName,
                    lastName: johnDoe.lastName
                })
            ])
            .then(done);
    });

    beforeEach(done => {
        loginPage.load().then(done);
    });

    afterEach(done => {
        logoutPage.load()
            .then(() => Utils.clearLocalStorage())
            .then(done);
    });

    xit('');

    describe('with valid credentials', () => {
        it('navigate to "Personal Files"', () => {
            const { username } = johnDoe;

            loginPage.loginWith(username)
                .then(() => {
                    expect(browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
                });
        });

        it(`displays user's name in header`, () => {
            const { userInfo } = new BrowsingPage(APP_ROUTES.PERSONAL_FILES).header;
            const { username, firstName, lastName } = johnDoe;

            loginPage.loginWith(username)
                .then(() => {
                    expect(userInfo.name).toEqual(`${firstName} ${lastName}`);
                });
        });

        it(`logs in with user having username containing "@"`, () => {
            loginPage
                .loginWith(testUser)
                .then(() => {
                    expect(browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
                });
        });

        it('logs in with user with non-latin characters', () => {
            const { username, password } = russianUser;

            loginPage
                .loginWith(username, password)
                .then(() => {
                    expect(browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
                });
        });

        it('redirects to Home Page when navigating to the Login page while already logged in', () => {
            const { username } = johnDoe;

            loginPage
                .loginWith(username)
                .then(() => browser.get(APP_ROUTES.LOGIN)
                    .then(() => {
                        expect(browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
                    })
                );
        });

        it('redirects to Personal Files when pressing browser Back while already logged in ', () => {
            const { username } = johnDoe;

            loginPage
                .loginWith(username)
                .then(() => browser.navigate().back())
                .then(() => {
                    expect(browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
                });
        });
    });

    describe('with invalid credentials', () => {
        const { login: loginComponent } = loginPage;
        const { submitButton, errorMessage } = loginComponent;

        it('disabled submit button when no credentials are entered', () => {
            expect(submitButton.isEnabled()).toBe(false);
        });

        it('disabled submit button when password is empty', () => {
            loginComponent.enterUsername('any-username');

            expect(submitButton.isEnabled()).toBe(false);
        });

        it('disabled submit button when username is empty', () => {
            loginPage.login.enterPassword('any-password');

            expect(submitButton.isEnabled()).toBe(false);
        });

        it('shows error when entering nonexistent user', () => {
            loginPage
                .tryLoginWith('nonexistent-user', 'any-password')
                .then(() => {
                    expect(browser.getCurrentUrl()).toContain(APP_ROUTES.LOGIN);
                    expect(errorMessage.isDisplayed()).toBe(true);
                });
        });

        it('shows error when entering invalid password', () => {
            const { username } = johnDoe;

            loginPage
                .tryLoginWith(username, 'incorrect-password')
                .then(() => {
                    expect(browser.getCurrentUrl()).toContain(APP_ROUTES.LOGIN);
                    expect(errorMessage.isDisplayed()).toBe(true);
                });
        });
    });
});
