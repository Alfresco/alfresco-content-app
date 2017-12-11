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

describe('Favorites', () => {
    const username = `user-${Utils.random()}`;
    const password = username;

    const siteName = `site-${Utils.random()}`;
    const folderName = `folder-${Utils.random()}`;
    const fileName1 = `file-${Utils.random()}.txt`;
    const fileName2 = `file-${Utils.random()}.txt`;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, password)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const favoritesPage = new BrowsingPage();
    const { dataTable } = favoritesPage;
    const { breadcrumb } = favoritesPage.toolbar;

    beforeAll(done => {
        apis.admin.people.createUser(username)
            .then(() => apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC))
            .then(() => apis.admin.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_MANAGER))
            .then(() => apis.admin.nodes.createFiles([ fileName1 ], `Sites/${siteName}/documentLibrary`)
                .then(resp => apis.user.favorites.addFavoriteById('file', resp.data.entry.id)))
            .then(() => apis.user.nodes.createFolders([ folderName ])
                .then(resp => apis.user.favorites.addFavoriteById('folder', resp.data.entry.id)))
            .then(() => apis.user.nodes.createFiles([ fileName2 ], folderName)
                .then(resp => apis.user.favorites.addFavoriteById('file', resp.data.entry.id)))
            .then(() => loginPage.load())
            .then(() => loginPage.loginWith(username))
            .then(done);
    });

    beforeEach(done => {
        favoritesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES)
            .then(() => dataTable.waitForHeader())
            .then(done);
    });

    afterAll(done => {
        Promise.all([
            apis.admin.sites.deleteSite(siteName),
            apis.user.nodes.deleteNodes([ folderName ]),
            logoutPage.load()
        ])
        .then(done);
    });

    it('has the correct columns', () => {
        const labels = [ 'Name', 'Location', 'Size', 'Modified', 'Modified by' ];
        const elements = labels.map(label => dataTable.getColumnHeaderByLabel(label));

        expect(dataTable.getColumnHeaders().count()).toBe(5 + 1, 'Incorrect number of columns');

        elements.forEach((element, index) => {
            expect(element.isPresent()).toBe(true, `"${labels[index]}" is missing`);
        });
    });

    it('displays the favorite files and folders', () => {
        expect(dataTable.countRows()).toEqual(3, 'Incorrect number of items displayed');
        expect(dataTable.getRowByName(fileName1).isPresent()).toBe(true, `${fileName1} not displayed`);
        expect(dataTable.getRowByName(fileName2).isPresent()).toBe(true, `${fileName2} not displayed`);
        expect(dataTable.getRowByName(folderName).isPresent()).toBe(true, `${folderName} not displayed`);
    });

    it('Location column displays the parent folder of the files', () => {
        const itemsLocations = {
            [fileName1]: siteName,
            [fileName2]: folderName,
            [folderName]: 'Personal Files'
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
            .then((favoritesList) => {
                Object.keys(itemsLocations).forEach((item) => {
                    expect(favoritesList[item]).toEqual(itemsLocations[item]);
                });
            });
    });

    it('Location column redirect - item in user Home', () => {
        dataTable.clickItemLocation(folderName)
            .then(() => breadcrumb.getCurrentItemName())
            .then(name => {
                expect(name).toBe('Personal Files');
            });
    });

    it('Location column redirect - file in folder', () => {
        dataTable.clickItemLocation(fileName2)
            .then(() => breadcrumb.getCurrentItemName())
            .then(name => {
                expect(name).toBe(folderName);
            })
            .then(() => breadcrumb.getFirstItemName())
            .then(name => {
                expect(name).toBe('Personal Files');
            });
    });

    it('Location column redirect - file in site', () => {
        dataTable.clickItemLocation(fileName1)
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
