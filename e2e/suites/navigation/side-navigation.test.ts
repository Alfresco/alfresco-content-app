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

import { APP_ROUTES, SIDEBAR_LABELS } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { LocalStorageUtility } from '../../utilities/local-storage';

describe('Side navigation', () => {
    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const page = new BrowsingPage();

    beforeAll(done => {
        loginPage.load()
            .then(() => loginPage.loginWithAdmin())
            .then(done);
    });

    beforeEach(done => {
        page.dataTable.wait().then(done);
    });

    afterAll(done => {
        logoutPage.load()
            .then(() => LocalStorageUtility.clear())
            .then(done);
    });

    it('has "Personal Files" as default', () => {
        expect(browser.getCurrentUrl())
            .toContain(APP_ROUTES.PERSONAL_FILES);

        expect(page.sidenav.isActiveByLabel('Personal Files'))
            .toBe(true, 'Active link');
    });

    it('navigates to "File Libraries"', () => {
        const { sidenav, dataTable } = page;

        sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES)
            .then(() => dataTable.wait())
            .then(() => browser.getCurrentUrl())
            .then(url => {
                expect(url).toContain(APP_ROUTES.FILE_LIBRARIES);
                expect(sidenav.isActiveByLabel(SIDEBAR_LABELS.FILE_LIBRARIES)).toBe(true);
            });
    });

    it('navigates to "Personal Files"', () => {
        const { sidenav, dataTable } = page;

        sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES)
            .then(() => dataTable.wait())
            .then(() => browser.getCurrentUrl())
            .then(url => {
                expect(url).toContain(APP_ROUTES.PERSONAL_FILES);
                expect(sidenav.isActiveByLabel(SIDEBAR_LABELS.PERSONAL_FILES)).toBe(true);
            });
    });

    it('navigates to "Shared Files"', () => {
        const { sidenav, dataTable } = page;

        sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES)
            .then(() => dataTable.wait())
            .then(() => browser.getCurrentUrl())
            .then(url => {
                expect(url).toContain(APP_ROUTES.SHARED_FILES);
                expect(sidenav.isActiveByLabel(SIDEBAR_LABELS.SHARED_FILES)).toBe(true);
            });
    });

    it('navigates to "Recent Files"', () => {
        const { sidenav, dataTable } = page;

        sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES)
            .then(() => dataTable.wait())
            .then(() => browser.getCurrentUrl())
            .then(url => {
                expect(url).toContain(APP_ROUTES.RECENT_FILES);
                expect(sidenav.isActiveByLabel(SIDEBAR_LABELS.RECENT_FILES)).toBe(true);
            });
    });

    it('navigates to "Favorites"', () => {
        const { sidenav, dataTable } = page;

        sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES)
            .then(() => dataTable.wait())
            .then(() => browser.getCurrentUrl())
            .then(url => {
                expect(url).toContain(APP_ROUTES.FAVORITES);
                expect(sidenav.isActiveByLabel(SIDEBAR_LABELS.FAVORITES)).toBe(true);
            });
    });

    it('navigates to "Trash"', () => {
        const { sidenav, dataTable } = page;

        sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH)
            .then(() => dataTable.wait())
            .then(() => browser.getCurrentUrl())
            .then(url => {
                expect(url).toContain(APP_ROUTES.TRASHCAN);
                expect(sidenav.isActiveByLabel(SIDEBAR_LABELS.TRASH)).toBe(true);
            });
    });
});
