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

import { SIDEBAR_LABELS } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('Personal Files', () => {
    const username = `user-${Utils.random()}`;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const personalFilesPage = new BrowsingPage();
    const { dataTable } = personalFilesPage;

    const adminFolder = `admin-folder-${Utils.random()}`;

    const userFolder = `user-folder-${Utils.random()}`;
    const userFile = `file-${Utils.random()}.txt`;

    beforeAll(done => {
        Promise
            .all([
                apis.admin.people.createUser(username),
                apis.admin.nodes.createFolders([ adminFolder ])
            ])
            .then(() => apis.user.nodes.createFolders([ userFolder ]))
            .then(() => apis.user.nodes.createFiles([ userFile ], userFolder))
            .then(done);
    });

    afterAll(done => {
        Promise
            .all([
                apis.admin.nodes.deleteNodes([ adminFolder ]),
                apis.user.nodes.deleteNodes([ userFolder ])
            ])
            .then(done);
    });

    xit('');

    describe(`Admin user's personal files`, () => {
        beforeAll(done => {
            loginPage.load()
                .then(() => loginPage.loginWithAdmin())
                .then(done);
        });

        beforeEach(done => {
            personalFilesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            logoutPage.load().then(done);
        });

        it('has "Data Dictionary" folder', () => {
            expect(dataTable.getRowByName('Data Dictionary').isPresent()).toBe(true);
        });

        it('has created content', () => {
            expect(dataTable.getRowByName(adminFolder).isPresent()).toBe(true);
        });
    });

    describe(`Regular user's personal files`, () => {
        beforeAll(done => {
            loginPage.load()
                .then(() => loginPage.loginWith(username))
                .then(done);
        });

        beforeEach(done => {
            personalFilesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            logoutPage.load().then(done);
        });

        it('has the correct columns', () => {
            const labels = [ 'Name', 'Size', 'Modified', 'Modified by' ];
            const elements = labels.map(label => dataTable.getColumnHeaderByLabel(label));

            expect(dataTable.getColumnHeaders().count()).toBe(4 + 1, 'Incorrect number of columns');

            elements.forEach((element, index) => {
                expect(element.isPresent()).toBe(true, `"${labels[index]}" is missing`);
            });
        });

        it('has default sorted column', () => {
            expect(dataTable.getSortedColumnHeader().getText()).toBe('Modified');
        });

        it('has user created content', () => {
            expect(dataTable.getRowByName(userFolder).isPresent())
                .toBe(true);
        });

        it('navigates to folder', () => {
            const getNodeIdPromise = apis.user.nodes
                .getNodeByPath(`/${userFolder}`)
                .then(response => response.data.entry.id);

            const navigatePromise = dataTable
                .doubleClickOnItemName(userFolder)
                .then(() => dataTable.waitForHeader());

            Promise
                .all([
                    getNodeIdPromise,
                    navigatePromise
                ])
                .then(([ nodeId ]) => {
                    expect(browser.getCurrentUrl())
                        .toContain(nodeId, 'Node ID is not in the URL');

                    expect(dataTable.getRowByName(userFile).isPresent())
                        .toBe(true, 'user file is missing');
                });
        });
    });
});
