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

describe('Trash', () => {
    const username = `user-${Utils.random()}`;

    const siteName = `site-${Utils.random()}`;
    const fileSite = `file-${Utils.random()}.txt`; let fileSiteId;

    const folderAdmin = `folder-${Utils.random()}`; let folderAdminId;
    const fileAdmin = `file-${Utils.random()}.txt`; let fileAdminId;

    const folderUser = `folder-${Utils.random()}`; let folderUserId;
    const fileUser = `file-${Utils.random()}.txt`; let fileUserId;

    const folderDeleted = `folder-${Utils.random()}`; let folderDeletedId;
    const fileDeleted = `file-${Utils.random()}.txt`; let fileDeletedId;

    const folderNotDeleted = `folder-${Utils.random()}`; let folderNotDeletedId;
    const fileInFolder = `file-${Utils.random()}.txt`; let fileInFolderId;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const trashPage = new BrowsingPage();
    const { dataTable } = trashPage;
    const { breadcrumb } = trashPage.toolbar;

    beforeAll(done => {
        apis.admin.people.createUser({ username })
            .then(() => apis.admin.nodes.createFiles([ fileAdmin ]).then(resp => fileAdminId = resp.entry.id))
            .then(() => apis.admin.nodes.createFolders([ folderAdmin ]).then(resp => folderAdminId = resp.entry.id))
            .then(() => apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC))
            .then(() => apis.admin.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_MANAGER))
            .then(() => apis.admin.nodes.createFiles([ fileSite ], `Sites/${siteName}/documentLibrary`)
                .then(resp => fileSiteId = resp.entry.id))
            .then(() => apis.user.nodes.createFiles([ fileUser ]).then(resp => fileUserId = resp.entry.id))
            .then(() => apis.user.nodes.createFolders([ folderUser ]).then(resp => folderUserId = resp.entry.id))
            .then(() => apis.user.nodes.createFolder(folderDeleted).then(resp => folderDeletedId = resp.entry.id))
            .then(() => apis.user.nodes.createFiles([ fileDeleted ], folderDeleted).then(resp => fileDeletedId = resp.entry.id))
            .then(() => apis.user.nodes.createFolder(folderNotDeleted).then(resp => folderNotDeletedId = resp.entry.id))
            .then(() => apis.user.nodes.createFiles([ fileInFolder ], folderNotDeleted).then(resp => fileInFolderId = resp.entry.id))

            .then(() => apis.admin.nodes.deleteNodesById([ fileAdminId, folderAdminId ], false))
            .then(() => apis.user.nodes.deleteNodesById([ fileSiteId, fileUserId, folderUserId, fileInFolderId ], false))
            .then(() => apis.user.nodes.deleteNodeById(fileDeletedId, false))
            .then(() => apis.user.nodes.deleteNodeById(folderDeletedId, false))

            .then(done);
    });

    afterAll(done => {
        Promise.all([
            apis.admin.sites.deleteSite(siteName),
            apis.user.nodes.deleteNodeById(folderNotDeletedId),
            apis.admin.trashcan.emptyTrash()
        ])
        .then(done);
    });

    xit('');

    describe('as admin', () => {
        beforeAll(done => {
            loginPage.loginWithAdmin().then(done);
        });

        beforeEach(done => {
            trashPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            logoutPage.load().then(done);
        });

        it('has the correct columns - [C213217]', () => {
            const labels = [ 'Name', 'Location', 'Size', 'Deleted', 'Deleted by' ];
            const elements = labels.map(label => dataTable.getColumnHeaderByLabel(label));

            expect(dataTable.getColumnHeaders().count()).toBe(5 + 1, 'Incorrect number of columns');

            elements.forEach((element, index) => {
                expect(element.isPresent()).toBe(true, `"${labels[index]}" is missing`);
            });
        });

        it('displays the files and folders deleted by everyone - [C280493]', () => {
            expect(dataTable.countRows()).toEqual(8, 'Incorrect number of deleted items displayed');

            expect(dataTable.getRowByName(fileAdmin).isPresent()).toBe(true, `${fileAdmin} not displayed`);
            expect(dataTable.getRowByName(folderAdmin).isPresent()).toBe(true, `${folderAdmin} not displayed`);
            expect(dataTable.getRowByName(fileUser).isPresent()).toBe(true, `${fileUser} not displayed`);
            expect(dataTable.getRowByName(folderUser).isPresent()).toBe(true, `${folderUser} not displayed`);
            expect(dataTable.getRowByName(fileSite).isPresent()).toBe(true, `${fileSite} not displayed`);
        });
    });

    describe('as user', () => {
        beforeAll(done => {
            loginPage.loginWith(username).then(done);
        });

        beforeEach(done => {
            trashPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            logoutPage.load().then(done);
        });

        it('has the correct columns - [C280494]', () => {
            const labels = [ 'Name', 'Location', 'Size', 'Deleted'];
            const elements = labels.map(label => dataTable.getColumnHeaderByLabel(label));

            expect(dataTable.getColumnHeaders().count()).toBe(4 + 1, 'Incorrect number of columns');

            elements.forEach((element, index) => {
                expect(element.isPresent()).toBe(true, `"${labels[index]}" is missing`);
            });
        });

        it('displays the files and folders deleted by the user - [C213218]', () => {
            expect(dataTable.countRows()).toEqual(6, 'Incorrect number of deleted items displayed');

            expect(dataTable.getRowByName(fileSite).isPresent()).toBe(true, `${fileSite} not displayed`);
            expect(dataTable.getRowByName(fileUser).isPresent()).toBe(true, `${fileUser} not displayed`);
            expect(dataTable.getRowByName(folderUser).isPresent()).toBe(true, `${folderUser} not displayed`);
            expect(dataTable.getRowByName(fileAdmin).isPresent()).toBe(false, `${fileAdmin} is displayed`);
        });

        it('default sorting column - [C213219]', () => {
            expect(dataTable.getSortedColumnHeader().getText()).toBe('Deleted');
            expect(dataTable.getSortingOrder()).toBe('desc');
        });

        it('Location column displays the parent folder of the file - [C280498]', () => {
            expect(dataTable.getItemLocation(fileInFolder).getText()).toEqual(folderNotDeleted);
            expect(dataTable.getItemLocation(fileUser).getText()).toEqual('Personal Files');
            expect(dataTable.getItemLocation(fileSite).getText()).toEqual(siteName);
        });

        it('Location column displays a tooltip with the entire path of the file - [C280499]', () => {
            expect(dataTable.getItemLocationTileAttr(fileInFolder)).toEqual(`Personal Files/${folderNotDeleted}`);
            expect(dataTable.getItemLocationTileAttr(fileUser)).toEqual('Personal Files');
            expect(dataTable.getItemLocationTileAttr(fileSite)).toEqual(`File Libraries/${siteName}`);
        });

        it('Location column is empty if parent folder no longer exists - [C280500]', () => {
            expect(dataTable.getItemLocation(fileDeleted).getText()).toEqual('');
        });

        it('Location column redirect - file in user Home - [C217144]', () => {
            dataTable.clickItemLocation(fileUser)
                .then(() => expect(breadcrumb.getAllItems()).toEqual([ 'Personal Files' ]));
        });

        it('Location column redirect - file in folder - [C280496]', () => {
            dataTable.clickItemLocation(fileInFolder)
                .then(() => expect(breadcrumb.getAllItems()).toEqual([ 'Personal Files', folderNotDeleted ]));
        });

        it('Location column redirect - file in site - [C280497]', () => {
            dataTable.clickItemLocation(fileSite)
                .then(() => expect(breadcrumb.getAllItems()).toEqual([ 'File Libraries', siteName ]));
        });
    });
});
