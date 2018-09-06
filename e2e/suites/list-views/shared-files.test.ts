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

describe('Shared Files', () => {
    const username = `user-${Utils.random()}`;
    const password = username;

    const siteName = `site-${Utils.random()}`;
    const fileAdmin = `file-${Utils.random()}.txt`;

    const folderUser = `folder-${Utils.random()}`;
    const file1User = `file1-${Utils.random()}.txt`; let file1Id;
    const file2User = `file2-${Utils.random()}.txt`; let file2Id;
    const file3User = `file3-${Utils.random()}.txt`; let file3Id;
    const file4User = `file4-${Utils.random()}.txt`; let file4Id;

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
        apis.admin.people.createUser({ username })
            .then(() => apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC))
            .then(() => apis.admin.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_CONSUMER))
            .then(() => apis.admin.nodes.createFiles([ fileAdmin ], `Sites/${siteName}/documentLibrary`))
            .then(resp => apis.admin.shared.shareFileById(resp.entry.id))

            .then(() => apis.user.nodes.createFolders([ folderUser ]))
            .then(() => apis.user.nodes.createFiles([ file1User ], folderUser)).then(resp => file1Id = resp.entry.id)
            .then(() => apis.user.nodes.createFile(file2User)).then(resp => file2Id = resp.entry.id)
            .then(() => apis.user.nodes.createFile(file3User)).then(resp => file3Id = resp.entry.id)
            .then(() => apis.user.nodes.createFile(file4User)).then(resp => file4Id = resp.entry.id)
            .then(() => apis.user.shared.shareFilesByIds([file1Id, file2Id, file3Id, file4Id]))

            .then(() => apis.user.shared.waitForApi({ expect: 5 }))
            .then(() => apis.user.nodes.deleteNodeById(file2Id))
            .then(() => apis.user.shared.unshareFile(file3User))

            .then(() => loginPage.loginWith(username))
            .then(done);
    });

    beforeEach(done => {
        sharedFilesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES)
            .then(() => dataTable.waitForHeader())
            .then(done);
    });

    afterEach(done => {
        sharedFilesPage.refresh().then(done);
    });

    afterAll(done => {
        Promise.all([
            apis.admin.sites.deleteSite(siteName),
            apis.user.nodes.deleteNodes([ folderUser ]),
            logoutPage.load()
        ])
        .then(done);
    });

    it('has the correct columns - [C213113]', () => {
        const labels = [ 'Name', 'Location', 'Size', 'Modified', 'Modified by', 'Shared by' ];
        const elements = labels.map(label => dataTable.getColumnHeaderByLabel(label));

        expect(dataTable.getColumnHeaders().count()).toBe(6 + 1, 'Incorrect number of columns');

        elements.forEach((element, index) => {
            expect(element.isPresent()).toBe(true, `"${labels[index]}" is missing`);
        });
    });

    it('default sorting column - [C213115]', () => {
        expect(dataTable.getSortedColumnHeader().getText()).toBe('Modified');
        expect(dataTable.getSortingOrder()).toBe('desc');
    });

    it('displays the files shared by everyone - [C213114]', () => {
        expect(dataTable.getRowByName(fileAdmin).isPresent()).toBe(true, `${fileAdmin} not displayed`);
        expect(dataTable.getRowByName(file1User).isPresent()).toBe(true, `${file1User} not displayed`);
    });

    it(`file not displayed if it's been deleted - [C213117]`, () => {
        expect(dataTable.getRowByName(file2User).isPresent()).toBe(false, `${file2User} is displayed`);
    });

    // TODO: disabled cause the api is slow to update. Find a way to wait until the file is unshared
    xit('unshared file is not displayed - [C213118]', async () => {
        apis.user.shared.waitForApi({ expect: 4 })
            .then(() => {
                expect(dataTable.getRowByName(file3User).isPresent()).toBe(false, `${file3User} is displayed`);
            });
    });

    it('Location column displays the parent folder of the file - [C213665]', () => {
        expect(dataTable.getItemLocationTileAttr(file4User)).toEqual('Personal Files');
        expect(dataTable.getItemLocation(fileAdmin).getText()).toEqual(siteName);
        expect(dataTable.getItemLocation(file1User).getText()).toEqual(folderUser);
    });

    it('Location column redirect - file in user Home - [C213666]', () => {
        dataTable.clickItemLocation(file4User)
            .then(() => expect(breadcrumb.getAllItems()).toEqual([ 'Personal Files' ]));
    });

    it('Location column redirect - file in folder - [C280490]', () => {
        dataTable.clickItemLocation(file1User)
            .then(() => expect(breadcrumb.getAllItems()).toEqual([ 'Personal Files', folderUser ]));
    });

    it('Location column redirect - file in site - [C280491]', () => {
        dataTable.clickItemLocation(fileAdmin)
            .then(() => expect(breadcrumb.getAllItems()).toEqual([ 'File Libraries', siteName ]));
    });

    it('Location column displays a tooltip with the entire path of the file - [C213667]', () => {
        expect(dataTable.getItemLocationTileAttr(fileAdmin)).toEqual(`File Libraries/${siteName}`);
        expect(dataTable.getItemLocationTileAttr(file1User)).toEqual(`Personal Files/${folderUser}`);
    });
});
