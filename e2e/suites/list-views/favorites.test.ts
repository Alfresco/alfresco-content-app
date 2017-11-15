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
            apis.admin.sites.deleteSite(siteName, true),
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
        expect(dataTable.getRowByContainingText(fileName1).isPresent()).toBe(true, `${fileName1} not displayed`);
        expect(dataTable.getRowByContainingText(fileName2).isPresent()).toBe(true, `${fileName2} not displayed`);
        expect(dataTable.getRowByContainingText(folderName).isPresent()).toBe(true, `${folderName} not displayed`);
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

});
