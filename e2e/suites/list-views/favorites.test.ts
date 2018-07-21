/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { SITE_VISIBILITY, SITE_ROLES, SIDEBAR_LABELS } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('Favorites', () => {
    const username = `user-${Utils.random()}`;
    const password = username;

    const siteName = `site-${Utils.random()}`;
    const folderName = `folder-${Utils.random()}`;
    const fileName1 = `file1-${Utils.random()}.txt`;
    const fileName2 = `file2-${Utils.random()}.txt`;
    const fileName3 = `file3-${Utils.random()}.txt`; let file3Id;
    const fileName4 = `file4-${Utils.random()}.txt`; let file4Id;

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
            .then(() => apis.user.nodes.createFiles([ fileName3 ], folderName)
                .then(resp => file3Id = resp.data.entry.id)
                .then(() => apis.user.favorites.addFavoriteById('file', file3Id))
                .then(() => apis.user.nodes.deleteNodeById(file3Id, false)))
            .then(() => apis.user.nodes.createFiles([ fileName4 ], folderName)
                .then(resp => file4Id = resp.data.entry.id)
                .then(() => apis.user.favorites.addFavoriteById('file', file4Id))
                .then(() => apis.user.nodes.deleteNodeById(file4Id, false))
                .then(() => apis.user.trashcan.restore(file4Id)))

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
            apis.admin.trashcan.emptyTrash(),
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

    it('displays the favorite files and folders [C213226]', () => {
        expect(dataTable.countRows()).toEqual(4, 'Incorrect number of items displayed');
        expect(dataTable.getRowName(fileName1).isPresent()).toBe(true, `${fileName1} not displayed`);
        expect(dataTable.getRowName(fileName2).isPresent()).toBe(true, `${fileName2} not displayed`);
        expect(dataTable.getRowName(folderName).isPresent()).toBe(true, `${folderName} not displayed`);
    });

    it(`file not displayed if it's in the Trashcan [C213228]`, () => {
        expect(dataTable.getRowName(fileName3).isPresent()).not.toBe(true, `${fileName3} is displayed`);
    });

    it(`file is displayed after it is restored from Trashcan [C213229]`, () => {
        expect(dataTable.getRowName(fileName4).isPresent()).toBe(true, `${fileName4} not displayed`);
    });

    it('Location column displays the parent folder of the files [C213231]', () => {
        expect(dataTable.getItemLocation(fileName1).getText()).toEqual(siteName);
        expect(dataTable.getItemLocation(fileName2).getText()).toEqual(folderName);
        expect(dataTable.getItemLocation(folderName).getText()).toEqual('Personal Files');
    });

    it('Location column displays a tooltip with the entire path of the file [C213671]', () => {
        expect(dataTable.getItemLocationTooltip(fileName1)).toEqual(`File Libraries/${siteName}`);
        expect(dataTable.getItemLocationTooltip(fileName2)).toEqual(`Personal Files/${folderName}`);
        expect(dataTable.getItemLocationTooltip(folderName)).toEqual('Personal Files');
    });

    it('Location column redirect - item in user Home [C213650] [C260968]', () => {
        dataTable.clickItemLocation(folderName)
            .then(() => expect(breadcrumb.getAllItems()).toEqual([ 'Personal Files' ]));
    });

    it('Location column redirect - file in folder [C213650] [C260968]', () => {
        dataTable.clickItemLocation(fileName2)
            .then(() => expect(breadcrumb.getAllItems()).toEqual([ 'Personal Files', folderName ]));
    });

    it('Location column redirect - file in site [C213650] [C260969]', () => {
        dataTable.clickItemLocation(fileName1)
            .then(() => expect(breadcrumb.getAllItems()).toEqual([ 'File Libraries', siteName ]));
    });

    it('Navigate into folder from Favorites [C213230]', () => {
        dataTable.doubleClickOnItemNameRow(folderName)
            .then(() => dataTable.waitForHeader())
            .then(() => breadcrumb.getCurrentItemName())
            .then(name => {
                expect(name).toBe(folderName);
            });
    });

});
