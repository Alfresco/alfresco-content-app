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

import { browser, by } from 'protractor';

import { APP_ROUTES, SITE_VISIBILITY, SITE_ROLES, SIDEBAR_LABELS } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient, NodeContentTree } from '../../utilities/repo-client/repo-client';

describe('Recent Files', () => {
    const username = `user-${Utils.random()}`;
    const password = username;

    const folderName = `folder-${Utils.random()}`;
    let folderId;
    const fileName1 = `file-${Utils.random()}.txt`;

    const fileName2 = `file-${Utils.random()}.txt`;
    let file2Id;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, password)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const recentFilesPage = new BrowsingPage();
    const { dataTable } = recentFilesPage;
    const { breadcrumb } = recentFilesPage.toolbar;

    beforeAll(done => {
        apis.admin.people.createUser(username)
            .then(() => apis.user.nodes.createFolders([ folderName ]))
            .then(resp => folderId = resp.data.entry.id)
            .then(() => apis.user.nodes.createFiles([ fileName1 ], folderName))

            .then(() => apis.user.nodes.createFiles([ fileName2 ]))
            .then(resp => file2Id = resp.data.entry.id)

            .then(() => loginPage.load())
            .then(() => loginPage.loginWith(username))
            .then(done);
    });

    beforeEach(done => {
        recentFilesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES)
            .then(() => dataTable.isEmptyList())
            .then(empty => {
                if (empty) {
                    browser.sleep(5000);
                    recentFilesPage.refresh();
                }
            })
            .then(() => dataTable.waitForHeader())
            .then(done);
    });

    afterAll(done => {
        Promise.all([
            apis.user.nodes.deleteNodesById([ folderId, file2Id ]),
            logoutPage.load()
        ])
        .then(done);
    });

    it('has the correct columns', () => {
        const labels = [ 'Name', 'Location', 'Size', 'Modified' ];
        const elements = labels.map(label => dataTable.getColumnHeaderByLabel(label));

        expect(dataTable.getColumnHeaders().count()).toBe(4 + 1, 'Incorrect number of columns');

        elements.forEach((element, index) => {
            expect(element.isPresent()).toBe(true, `"${labels[index]}" is missing`);
        });
    });

    it('displays the files added by the current user in the last 30 days', () => {
        expect(dataTable.countRows()).toEqual(2, 'Incorrect number of sites displayed');
        expect(dataTable.getRowByName(fileName1).isPresent()).toBe(true, `${fileName1} not displayed`);
        expect(dataTable.getRowByName(fileName2).isPresent()).toBe(true, `${fileName2} not displayed`);
    });

    it('Location column displays the parent folder of the file', () => {
        const itemsLocations = {
            [fileName2]: 'Personal Files',
            [fileName1]: folderName
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
        dataTable.clickItemLocation(fileName1)
            .then(() => breadcrumb.getCurrentItemName())
            .then(name => {
                expect(name).toBe(folderName);
            })
            .then(() => breadcrumb.getFirstItemName())
            .then(name => {
                expect(name).toBe('Personal Files');
            });
    });

    it('Location column redirect - file in folder', () => {
        dataTable.clickItemLocation(fileName2)
            .then(() => breadcrumb.getCurrentItemName())
            .then(name => {
                expect(name).toBe('Personal Files');
            });
    });
});
