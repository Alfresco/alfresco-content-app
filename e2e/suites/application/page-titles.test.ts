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

import { SIDEBAR_LABELS } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';

describe('Page titles', () => {
    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const page = new BrowsingPage();

    xit('');

    describe('on Login / Logout pages', () => {
        it('on Login page', () => {
            loginPage.load()
                .then(() => {
                    expect(browser.getTitle()).toContain('Sign in');
                });
        });

        it('after logout', () => {
            loginPage.load()
                .then(() => loginPage.loginWithAdmin())
                .then(() => page.signOut())
                .then(() => {
                    expect(browser.getTitle()).toContain('Sign in');
                });
        });

        it('when pressing Back after Logout', () => {
            loginPage.load()
                .then(() => loginPage.loginWithAdmin())
                .then(() => page.signOut())
                .then(() => browser.driver.navigate().back())
                .then(() => {
                    expect(browser.getTitle()).toContain('Sign in');
                });
        });
    });

    describe('on list views', () => {
        beforeAll(done => {
            loginPage.load()
                .then(() => loginPage.loginWithAdmin())
                .then(done);
        });

        afterAll(done => {
            logoutPage.load()
                .then(done);
        });

        it('Personal Files page', () => {
            const label = SIDEBAR_LABELS.PERSONAL_FILES;

            page.sidenav.navigateToLinkByLabel(label)
                .then(() => {
                    expect(browser.getTitle()).toContain(label);
                });
        });

        it('File Libraries page', () => {
            const label = SIDEBAR_LABELS.FILE_LIBRARIES;

            page.sidenav.navigateToLinkByLabel(label)
                .then(() => {
                    expect(browser.getTitle()).toContain(label);
                });
        });

        it('Shared Files page', () => {
            const label = SIDEBAR_LABELS.SHARED_FILES;

            page.sidenav.navigateToLinkByLabel(label)
                .then(() => {
                    expect(browser.getTitle()).toContain(label);
                });
        });

        it('Recent Files page', () => {
            const label = SIDEBAR_LABELS.RECENT_FILES;

            page.sidenav.navigateToLinkByLabel(label)
                .then(() => {
                    expect(browser.getTitle()).toContain(label);
                });
        });

        it('Favorites page', () => {
            const label = SIDEBAR_LABELS.FAVORITES;

            page.sidenav.navigateToLinkByLabel(label)
                .then(() => {
                    expect(browser.getTitle()).toContain(label);
                });
        });

        it('Trash page', () => {
            const label = SIDEBAR_LABELS.TRASH;

            page.sidenav.navigateToLinkByLabel(label)
                .then(() => {
                    expect(browser.getTitle()).toContain(label);
                });
        });
    });
});
