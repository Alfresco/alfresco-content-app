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

import { SITE_VISIBILITY, SIDEBAR_LABELS } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('Recent Files', () => {
    const username = `user-${Utils.random()}`;

    const folderName = `folder-${Utils.random()}`; let folderId;
    const fileName1 = `file-${Utils.random()}.txt`;
    const fileName2 = `file-${Utils.random()}.txt`; let file2Id;
    const fileName3 = `file-${Utils.random()}.txt`;

    const siteName = `site-${Utils.random()}`;
    const folderSite = `folder2-${Utils.random()}`; let folderSiteId;
    const fileSite = `file-${Utils.random()}.txt`;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const recentFilesPage = new BrowsingPage();
    const { dataTable } = recentFilesPage;
    const { breadcrumb } = recentFilesPage.toolbar;

    beforeAll(done => {
        apis.admin.people.createUser({ username })
            .then(() => apis.user.nodes.createFolders([ folderName ])).then(resp => folderId = resp.entry.id)
            .then(() => apis.user.nodes.createFiles([ fileName1 ], folderName))
            .then(() => apis.user.nodes.createFiles([ fileName2 ])).then(resp => file2Id = resp.entry.id)
            .then(() => apis.user.nodes.createFiles([ fileName3 ]).then(resp => apis.user.nodes.deleteNodeById(resp.entry.id, false)))

            .then(() => apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC))
            .then(() => apis.user.sites.getDocLibId(siteName))
            .then(resp => apis.user.nodes.createFolder(folderSite, resp)).then(resp => folderSiteId = resp.entry.id)
            .then(() => apis.user.nodes.createFile(fileSite, folderSiteId))

            .then(() => apis.user.search.waitForApi(username, { expect: 3 }))

            .then(() => loginPage.loginWith(username))
            .then(done);
    });

    beforeEach(done => {
        recentFilesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES)
            .then(() => dataTable.waitForHeader())
            .then(done);
    });

    afterAll(done => {
        Promise.all([
            apis.user.nodes.deleteNodesById([ folderId, file2Id ]),
            apis.user.sites.deleteSite(siteName),
            apis.admin.trashcan.emptyTrash(),
            logoutPage.load()
        ])
        .then(done);
    });

    it('has the correct columns - [C213168]', () => {
        const labels = [ 'Name', 'Location', 'Size', 'Modified' ];
        const elements = labels.map(label => dataTable.getColumnHeaderByLabel(label));

        expect(dataTable.getColumnHeaders().count()).toBe(4 + 1, 'Incorrect number of columns');

        elements.forEach((element, index) => {
            expect(element.isPresent()).toBe(true, `"${labels[index]}" is missing`);
        });
    });

    it('default sorting column - [C213171]', () => {
        expect(dataTable.getSortedColumnHeader().getText()).toBe('Modified');
        expect(dataTable.getSortingOrder()).toBe('desc');
    });

    it('displays the files added by the current user in the last 30 days - [C213170]', () => {
        expect(dataTable.countRows()).toEqual(3, 'Incorrect number of files displayed');
        expect(dataTable.getRowByName(fileName1).isPresent()).toBe(true, `${fileName1} not displayed`);
        expect(dataTable.getRowByName(fileName2).isPresent()).toBe(true, `${fileName2} not displayed`);
        expect(dataTable.getRowByName(fileSite).isPresent()).toBe(true, `${fileSite} not displayed`);
    });

    it(`file not displayed if it's been deleted - [C213174]`, () => {
        expect(dataTable.getRowByName(fileName3).isPresent()).not.toBe(true, `${fileName3} is displayed`);
    });

    it('Location column displays the parent folder of the file - [C213175]', () => {
        expect(dataTable.getItemLocation(fileName1).getText()).toEqual(folderName);
        expect(dataTable.getItemLocation(fileName2).getText()).toEqual('Personal Files');
        expect(dataTable.getItemLocation(fileSite).getText()).toEqual(folderSite);
    });

    it('Location column displays a tooltip with the entire path of the file - [C213177]', () => {
        expect(dataTable.getItemLocationTileAttr(fileName1)).toEqual(`Personal Files/${folderName}`);
        expect(dataTable.getItemLocationTileAttr(fileName2)).toEqual('Personal Files');
        expect(dataTable.getItemLocationTileAttr(fileSite)).toEqual(`File Libraries/${siteName}/${folderSite}`);
    });

    it('Location column redirect - file in user Home - [C213176]', () => {
        dataTable.clickItemLocation(fileName2)
            .then(() => expect(breadcrumb.getAllItems()).toEqual([ 'Personal Files' ]));
    });

    it('Location column redirect - file in folder - [C280486]', () => {
        dataTable.clickItemLocation(fileName1)
            .then(() => expect(breadcrumb.getAllItems()).toEqual([ 'Personal Files', folderName ]));
    });

    it('Location column redirect - file in site - [C280487]', () => {
        dataTable.clickItemLocation(fileSite)
            .then(() => expect(breadcrumb.getAllItems()).toEqual([ 'File Libraries', siteName, folderSite ]));
    });
});
