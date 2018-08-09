/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

    beforeAll(done => {
        Promise
            .all([
                peopleApi.createUser({ username: testUser }),
                peopleApi.createUser(russianUser),
                peopleApi.createUser(johnDoe),
                peopleApi.createUser({ username: disabledUser })
                    .then(() => peopleApi.disableUser(disabledUser)),
                peopleApi.createUser(testUser2)
            ])
            .then(done);
    });

    afterEach(done => {
        logoutPage.load()
            .then(() => Utils.clearLocalStorage())
            .then(done);
    });

    xit('');

    describe('general tests', () => {
        beforeEach(done => {
            loginPage.load().then(done);
        });

        it('login page layout - [C213089]', () => {
            expect(loginPage.login.usernameInput.isEnabled()).toBe(true, 'username input is not enabled');
            expect(loginPage.login.passwordInput.isEnabled()).toBe(true, 'password input is not enabled');
            expect(loginPage.login.submitButton.isEnabled()).toBe(false, 'SIGN IN button is enabled');
            expect(loginPage.login.getPasswordVisibility()).toBe(false, 'Password is not hidden by default');
        });

        it('change password visibility - [C213091]', () => {
            loginPage.login.enterPassword('some password');
            expect(loginPage.login.isPasswordShown()).toBe(false, 'password is visible');
            loginPage.login.passwordVisibility.click()
                .then(() => {
                    expect(loginPage.login.getPasswordVisibility()).toBe(true, 'Password visibility not changed');
                    expect(loginPage.login.isPasswordShown()).toBe(true, 'password is not visible');
                });
        });
    });

    describe('with valid credentials', () => {
        it('navigate to "Personal Files" - [C213092]', () => {
            const { username } = johnDoe;

            loginPage.loginWith(username)
                .then(() => {
                    expect(browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
                });
        });

        it(`displays user's name in header - [C213108]`, () => {
            const { userInfo } = new BrowsingPage(APP_ROUTES.PERSONAL_FILES).header;
            const { username, firstName, lastName } = johnDoe;

            loginPage.loginWith(username)
                .then(() => {
                    expect(userInfo.name).toEqual(`${firstName} ${lastName}`);
                });
        });

        it(`logs in with user having username containing "@" - [C213096]`, () => {
            loginPage
                .loginWith(testUser)
                .then(() => {
                    expect(browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
                });
        });

        it('logs in with user with non-latin characters - [C213097]', () => {
            const { username, password } = russianUser;

            loginPage
                .loginWith(username, password)
                .then(() => {
                    expect(browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
                });
        });

        it('redirects to Home Page when navigating to the Login page while already logged in - [C213107]', () => {
            const { username } = johnDoe;

            loginPage
                .loginWith(username)
                .then(() => browser.get(APP_ROUTES.LOGIN)
                    .then(() => {
                        expect(browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
                    })
                );
        });

        it('redirects to Personal Files when pressing browser Back while already logged in - [C213109]', () => {
            const { username } = johnDoe;

            loginPage
                .loginWith(username)
                .then(() => browser.navigate().back())
                .then(() => {
                    expect(browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
                });
        });

        it('user is able to login after changing his password - [C213104]', () => {
            loginPage.loginWith(testUser2.username, testUser2.password)
                .then(() => logoutPage.load())
                .then(() => peopleApi.changePassword(testUser2.username, newPassword))
                .then(() => loginPage.loginWith(testUser2.username, newPassword))
                .then(() => {
                    expect(browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
                });
        });
    });

    describe('with invalid credentials', () => {
        const { login: loginComponent } = loginPage;
        const { submitButton, errorMessage } = loginComponent;

        beforeEach(done => {
            loginPage.load().then(done);
        });

        it('disabled submit button when password is empty - [C280072]', () => {
            loginComponent.enterUsername('any-username');
            expect(submitButton.isEnabled()).toBe(false);
        });

        it('disabled submit button when username is empty - [C280070]', () => {
            loginPage.login.enterPassword('any-password');
            expect(submitButton.isEnabled()).toBe(false);
        });

        it('shows error when entering nonexistent user - [C213093]', () => {
            loginPage
                .tryLoginWith('nonexistent-user', 'any-password')
                .then(() => {
                    expect(browser.getCurrentUrl()).toContain(APP_ROUTES.LOGIN);
                    expect(errorMessage.isDisplayed()).toBe(true);
                    expect(errorMessage.getText()).toBe(`You've entered an unknown username or password`);
                });
        });

        it('shows error when entering invalid password - [C280071]', () => {
            const { username } = johnDoe;

            loginPage
                .tryLoginWith(username, 'incorrect-password')
                .then(() => {
                    expect(browser.getCurrentUrl()).toContain(APP_ROUTES.LOGIN);
                    expect(errorMessage.isDisplayed()).toBe(true);
                    expect(errorMessage.getText()).toBe(`You've entered an unknown username or password`);
                });
        });

        it('unauthenticated user is redirected to Login page - [C213106]', () => {
            browser.get(APP_ROUTES.PERSONAL_FILES)
                .then(() => {
                    expect(browser.getCurrentUrl()).toContain(APP_ROUTES.LOGIN);
                });
        });

        it('disabled user is not logged in - [C213100]', () => {
            loginPage.tryLoginWith(disabledUser)
                .then(() => {
                    expect(browser.getCurrentUrl()).toContain(APP_ROUTES.LOGIN);
                    expect(errorMessage.isDisplayed()).toBe(true);
                    expect(errorMessage.getText()).toBe(`You've entered an unknown username or password`);
                });
        });
    });
});
