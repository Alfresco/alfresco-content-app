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

describe('Trash', () => {
    const username = `user-${Utils.random()}`;

    const siteName = `site-${Utils.random()}`;
    const fileSite = `file-${Utils.random()}.txt`;
    let fileSiteId;

    const folderAdmin = `folder-${Utils.random()}`;
    let folderAdminId;
    const fileAdmin = `file-${Utils.random()}.txt`;
    let fileAdminId;

    const folderUser = `folder-${Utils.random()}`;
    let folderUserId;
    const fileUser = `file-${Utils.random()}.txt`;
    let fileUserId;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const trashPage = new BrowsingPage();
    const { dataTable } = trashPage;

    beforeAll(done => {
        apis.admin.people.createUser(username)
            .then(() => apis.admin.nodes.createFiles([ fileAdmin ])
                .then(resp => fileAdminId = resp.data.entry.id))
            .then(() => apis.admin.nodes.createFolders([ folderAdmin ])
                .then(resp => folderAdminId = resp.data.entry.id))
            .then(() => apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC))
            .then(() => apis.admin.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_MANAGER))
            .then(() => apis.admin.nodes.createFiles([ fileSite ], `Sites/${siteName}/documentLibrary`)
                .then(resp => fileSiteId = resp.data.entry.id))
            .then(() => apis.user.nodes.createFiles([ fileUser ])
                .then(resp => fileUserId = resp.data.entry.id))
            .then(() => apis.user.nodes.createFolders([ folderUser ])
                .then(resp => folderUserId = resp.data.entry.id))

            .then(() => apis.admin.nodes.deleteNodeById(fileAdminId, false))
            .then(() => apis.admin.nodes.deleteNodeById(folderAdminId, false))
            .then(() => apis.user.nodes.deleteNodeById(fileSiteId, false))
            .then(() => apis.user.nodes.deleteNodeById(fileUserId, false))
            .then(() => apis.user.nodes.deleteNodeById(folderUserId, false))

            .then(done);
    });

    afterAll(done => {
        Promise.all([
            apis.admin.sites.deleteSite(siteName),
            apis.admin.trashcan.permanentlyDelete(fileAdminId),
            apis.admin.trashcan.permanentlyDelete(folderAdminId),
            apis.admin.trashcan.permanentlyDelete(fileSiteId),
            apis.user.trashcan.permanentlyDelete(fileUserId),
            apis.user.trashcan.permanentlyDelete(folderUserId)
        ])
        .then(done);
    });

    xit('');

    describe('as admin', () => {
        beforeAll(done => {
            loginPage.load()
                .then(() => loginPage.loginWithAdmin())
                .then(() => trashPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            logoutPage.load().then(done);
        });

        it('has the correct columns', () => {
            const labels = [ 'Name', 'Location', 'Size', 'Deleted', 'Deleted by' ];
            const elements = labels.map(label => dataTable.getColumnHeaderByLabel(label));

            expect(dataTable.getColumnHeaders().count()).toBe(5 + 1, 'Incorrect number of columns');

            elements.forEach((element, index) => {
                expect(element.isPresent()).toBe(true, `"${labels[index]}" is missing`);
            });
        });

        it('displays the files and folders deleted by everyone', () => {
            expect(dataTable.countRows()).toEqual(5, 'Incorrect number of deleted items displayed');

            expect(dataTable.getRowByContainingText(fileAdmin).isPresent()).toBe(true, `${fileAdmin} not displayed`);
            expect(dataTable.getRowByContainingText(folderAdmin).isPresent()).toBe(true, `${folderAdmin} not displayed`);
            expect(dataTable.getRowByContainingText(fileUser).isPresent()).toBe(true, `${fileUser} not displayed`);
            expect(dataTable.getRowByContainingText(folderUser).isPresent()).toBe(true, `${folderUser} not displayed`);
            expect(dataTable.getRowByContainingText(fileSite).isPresent()).toBe(true, `${fileSite} not displayed`);
        });
    });

    describe('as user', () => {
        beforeAll(done => {
            loginPage.load()
                .then(() => loginPage.loginWith(username))
                .then(() => trashPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            logoutPage.load().then(done);
        });

        it('has the correct columns', () => {
            const labels = [ 'Name', 'Location', 'Size', 'Deleted', 'Deleted by' ];
            const elements = labels.map(label => dataTable.getColumnHeaderByLabel(label));

            expect(dataTable.getColumnHeaders().count()).toBe(5 + 1, 'Incorrect number of columns');

            elements.forEach((element, index) => {
                expect(element.isPresent()).toBe(true, `"${labels[index]}" is missing`);
            });
        });

        it('displays the files and folders deleted by the user', () => {
            expect(dataTable.countRows()).toEqual(3, 'Incorrect number of deleted items displayed');

            expect(dataTable.getRowByContainingText(fileSite).isPresent()).toBe(true, `${fileSite} not displayed`);
            expect(dataTable.getRowByContainingText(fileUser).isPresent()).toBe(true, `${fileUser} not displayed`);
            expect(dataTable.getRowByContainingText(folderUser).isPresent()).toBe(true, `${folderUser} not displayed`);
        });
    });
});
