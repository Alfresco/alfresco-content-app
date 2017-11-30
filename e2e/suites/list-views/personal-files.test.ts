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

import { APP_ROUTES } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient, NodeContentTree } from '../../utilities/repo-client/repo-client';

describe('Personal Files', () => {
    const username = `user-${Utils.random()}`;
    const password = username;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, password)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const personalFilesPage = new BrowsingPage(APP_ROUTES.PERSONAL_FILES);
    const dataTable = personalFilesPage.dataTable;

    const adminFolder = `admin-folder-${Utils.random()}`;

    const userFolder = `user-folder-${Utils.random()}`;
    const userFile = `file-${Utils.random()}.txt`;

    beforeAll(done => {
        Promise
            .all([
                apis.admin.people.createUser(username, password),
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
            personalFilesPage.load()
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            logoutPage.load()
                .then(done);
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
                .then(() => loginPage.loginWith(username, password))
                .then(done);
        });

        beforeEach(done => {
            personalFilesPage.load()
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            logoutPage.load()
                .then(done);
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

        // Some tests regarding selection, breadcrumb and toolbar
        // probably they can be move to a different suite
        describe('Item selection', () => {
            it('has toolbar when selected', done => {
                const { actions } = personalFilesPage.toolbar;

                dataTable
                    .clickOnItemName(userFolder)
                    .then(() => {
                        expect(actions.isEmpty()).toBe(false, 'Toolbar to be present');
                    })
                    .then(() => actions.openMoreMenu())
                    .then(menu => {
                        expect(menu.items.count()).toBeGreaterThan(0, 'More actions has items');
                    })
                    .then(done);
            });
        });
    });
});
