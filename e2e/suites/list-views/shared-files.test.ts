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
