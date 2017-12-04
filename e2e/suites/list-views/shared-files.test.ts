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

describe('Shared Files', () => {
    const username = `user-${Utils.random()}`;
    const password = username;

    const siteName = `site-${Utils.random()}`;
    const fileAdmin = `file-${Utils.random()}.txt`;

    const folderUser = `folder-${Utils.random()}`;
    const fileUser = `file-${Utils.random()}.txt`;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, password)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const sharedFilesPage = new BrowsingPage();
    const { dataTable } = sharedFilesPage;
    const { breadcrumb } = sharedFilesPage.toolbar;

    beforeAll(done => {
        apis.admin.people.createUser(username)
            .then(() => apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC))
            .then(() => apis.admin.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_CONSUMER))
            .then(() => apis.admin.nodes.createFiles([ fileAdmin ], `Sites/${siteName}/documentLibrary`))
            .then(resp => apis.admin.shared.shareFileById(resp.data.entry.id))

            .then(() => apis.user.nodes.createFolders([ folderUser ]))
            .then(() => apis.user.nodes.createFiles([ fileUser ], folderUser))
            .then(resp => apis.user.shared.shareFileById(resp.data.entry.id))

            .then(() => loginPage.load())
            .then(() => loginPage.loginWith(username))
            .then(done);
    });

    beforeEach(done => {
        sharedFilesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES)
            .then(() => dataTable.isEmptyList())
            .then(empty => {
                if (empty) {
                    browser.sleep(5000);
                    sharedFilesPage.refresh();
                }
            })
            .then(() => dataTable.waitForHeader())
            .then(done);
    });

    afterAll(done => {
        Promise.all([
            apis.admin.sites.deleteSite(siteName),
            apis.user.nodes.deleteNodes([ folderUser ]),
            logoutPage.load()
        ])
        .then(done);
    });

    it('has the correct columns', () => {
        const labels = [ 'Name', 'Location', 'Size', 'Modified', 'Modified by', 'Shared by' ];
        const elements = labels.map(label => dataTable.getColumnHeaderByLabel(label));

        expect(dataTable.getColumnHeaders().count()).toBe(6 + 1, 'Incorrect number of columns');

        elements.forEach((element, index) => {
            expect(element.isPresent()).toBe(true, `"${labels[index]}" is missing`);
        });
    });

    it('displays the files shared by everyone', () => {
        expect(dataTable.countRows()).toEqual(2, 'Incorrect number of items displayed');
        expect(dataTable.getRowByName(fileAdmin).isPresent()).toBe(true, `${fileAdmin} not displayed`);
        expect(dataTable.getRowByName(fileUser).isPresent()).toBe(true, `${fileUser} not displayed`);
    });

    it('Location column displays the parent folder of the file', () => {
        const itemsLocations = {
            [fileAdmin]: siteName,
            [fileUser]: folderUser
        };

        dataTable.getRows()
            .map((row) => {
                return row.all(dataTable.cell).map(cell => cell.getText());
            })
            .then((rowCells) => {
                return rowCells.reduce((acc, cell) => {
                    acc[cell[1]] = cell[2];
                    return acc;
                }, {});
            })
            .then((recentList) => {
                Object.keys(itemsLocations).forEach((item) => {
                    expect(recentList[item]).toEqual(itemsLocations[item]);
                });
            });
    });

    it('Location column redirect - file in user Home', () => {
        dataTable.clickItemLocation(fileUser)
            .then(() => breadcrumb.getCurrentItemName())
            .then(name => {
                expect(name).toBe(folderUser);
            })
            .then(() => breadcrumb.getFirstItemName())
            .then(name => {
                expect(name).toBe('Personal Files');
            });
    });

    it('Location column redirect - file in site', () => {
        dataTable.clickItemLocation(fileAdmin)
            .then(() => breadcrumb.getCurrentItemName())
            .then(name => {
                expect(name).toBe(siteName);
            })
            .then(() => breadcrumb.getFirstItemName())
            .then(name => {
                expect(name).toBe('File Libraries');
            });
    });
});
