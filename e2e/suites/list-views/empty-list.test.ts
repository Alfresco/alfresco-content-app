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

import { browser, by } from 'protractor';

import { APP_ROUTES, SITE_VISIBILITY, SITE_ROLES, SIDEBAR_LABELS } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient, NodeContentTree } from '../../utilities/repo-client/repo-client';

fdescribe('Empty list views', () => {
    const username = `user-${Utils.random()}`;
    const password = username;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, password)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const page = new BrowsingPage();
    const { dataTable } = page;

    beforeAll(done => {
        apis.admin.people.createUser(username)
            .then(() => loginPage.load()
                .then(() => loginPage.loginWith(username))
                .then(done));
    });

    it('empty Personal Files', () => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES)
            .then(() => {
                expect(dataTable.isEmptyList()).toBe(true, 'list is not empty');
                expect(dataTable.getEmptyDragAndDropText()).toContain('Drag and drop');
            });
    });

    it('empty File Libraries', () => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES)
            .then(() => {
                expect(dataTable.isEmptyList()).toBe(true, 'list is not empty');
                expect(dataTable.getEmptyStateTitle()).toContain(`You aren't a member of any File Libraries yet`);
                expect(dataTable.getEmptyStateText()).toContain('Join sites to upload, view, and share files.');
            });
    });

    it('empty Shared Files', () => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES)
            .then(() => {
                expect(dataTable.isEmptyList()).toBe(true, 'list is not empty');
                expect(dataTable.getEmptyStateTitle()).toContain('No shared files or folders');
                expect(dataTable.getEmptyStateText()).toContain('Items you share using the Share option are shown here.');
            });
    });

    it('empty Recent Files', () => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES)
            .then(() => {
                expect(dataTable.isEmptyList()).toBe(true, 'list is not empty');
                expect(dataTable.getEmptyStateTitle()).toContain('No recent files');
                expect(dataTable.getEmptyStateText()).toContain('Items you upload or edit in the last 30 days are shown here.');
            });
    });

    it('empty Favorites', () => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES)
            .then(() => {
                expect(dataTable.isEmptyList()).toBe(true, 'list is not empty');
                expect(dataTable.getEmptyStateTitle()).toContain('No favorite files or folders');
                expect(dataTable.getEmptyStateText()).toContain('Favorite items that you want to easily find later.');
            });
    });

    it('empty Trash', () => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH)
        .then(() => {
            expect(dataTable.isEmptyList()).toBe(true, 'list is not empty');
            expect(dataTable.getEmptyStateTitle()).toContain('Trash is empty');
            expect(dataTable.getEmptyStateText()).toContain('Items you delete are moved to the Trash.');
            expect(dataTable.getEmptyStateText()).toContain('Empty Trash to permanently delete items.');
        });
    });
});
