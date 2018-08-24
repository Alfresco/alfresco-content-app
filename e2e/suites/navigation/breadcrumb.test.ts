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

import { browser } from 'protractor';

import { SIDEBAR_LABELS, SITE_VISIBILITY } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('Breadcrumb', () => {
    const username = `user-${Utils.random()}`;

    const parent = `parent-${Utils.random()}`; let parentId;
    const subFolder1 = `subFolder1-${Utils.random()}`; let subFolder1Id;
    const subFolder2 = `subFolder2-${Utils.random()}`; let subFolder2Id;
    const fileName1 = `file1-${Utils.random()}.txt`;

    const siteName = `site-${Utils.random()}`;

    const parent2 = `parent2-${Utils.random()}`; let parent2Id;
    const folder1 = `folder1-${Utils.random()}`; let folder1Id;
    const folder1Renamed = `renamed-${Utils.random()}`;

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const page = new BrowsingPage();
    const { breadcrumb } = page.toolbar;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    beforeAll(done => {
        apis.admin.people.createUser({ username })
            .then(() => apis.user.nodes.createFolder(parent)).then(resp => parentId = resp.entry.id)
            .then(() => apis.user.nodes.createFolder(subFolder1, parentId)).then(resp => subFolder1Id = resp.entry.id)
            .then(() => apis.user.nodes.createFolder(subFolder2, subFolder1Id)).then(resp => subFolder2Id = resp.entry.id)
            .then(() => apis.user.nodes.createFile(fileName1, subFolder2Id))

            .then(() => apis.user.nodes.createFolder(parent2)).then(resp => parent2Id = resp.entry.id)
            .then(() => apis.user.nodes.createFolder(folder1, parent2Id)).then(resp => folder1Id = resp.entry.id)

            .then(() => apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC))
            .then(() => apis.user.sites.getDocLibId(siteName))
            .then(resp => apis.user.nodes.createFolder(parent, resp)).then(resp => parentId = resp.entry.id)
            .then(() => apis.user.nodes.createFolder(subFolder1, parentId)).then(resp => subFolder1Id = resp.entry.id)
            .then(() => apis.user.nodes.createFolder(subFolder2, subFolder1Id)).then(resp => subFolder2Id = resp.entry.id)
            .then(() => apis.user.nodes.createFile(fileName1, subFolder2Id))

            .then(() => loginPage.loginWith(username))
            .then(done);
    });

    afterAll(done => {
        Promise.all([
            apis.user.nodes.deleteNodeById(parentId),
            apis.user.nodes.deleteNodeById(parent2Id),
            apis.user.sites.deleteSite(siteName),
            logoutPage.load()
        ])
        .then(done);
    });

    it('Personal Files breadcrumb main node - [C260964]', () => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES)
            .then(() => {
                expect(breadcrumb.getItemsCount()).toEqual(1, 'Breadcrumb has incorrect number of items');
                expect(breadcrumb.getCurrentItemName()).toBe('Personal Files');
            });
    });

    it('File Libraries breadcrumb main node - [C260966]', () => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES)
            .then(() => {
                expect(breadcrumb.getItemsCount()).toEqual(1, 'Breadcrumb has incorrect number of items');
                expect(breadcrumb.getCurrentItemName()).toBe('File Libraries');
            });
    });

    it('Recent Files breadcrumb main node - [C260971]', () => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES)
            .then(() => {
                expect(breadcrumb.getItemsCount()).toEqual(1, 'Breadcrumb has incorrect number of items');
                expect(breadcrumb.getCurrentItemName()).toBe('Recent Files');
            });
    });

    it('Shared Files breadcrumb main node - [C260972]', () => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES)
            .then(() => {
                expect(breadcrumb.getItemsCount()).toEqual(1, 'Breadcrumb has incorrect number of items');
                expect(breadcrumb.getCurrentItemName()).toBe('Shared Files');
            });
    });

    it('Favorites breadcrumb main node - [C260973]', () => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES)
            .then(() => {
                expect(breadcrumb.getItemsCount()).toEqual(1, 'Breadcrumb has incorrect number of items');
                expect(breadcrumb.getCurrentItemName()).toBe('Favorites');
            });
    });

    it('Trash breadcrumb main node - [C260974]', () => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH)
            .then(() => {
                expect(breadcrumb.getItemsCount()).toEqual(1, 'Breadcrumb has incorrect number of items');
                expect(breadcrumb.getCurrentItemName()).toBe('Trash');
            });
    });

    it('Personal Files breadcrumb for a folder hierarchy - [C260965]', () => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES)
            .then(() => page.dataTable.waitForHeader())
            .then(() => page.dataTable.doubleClickOnRowByName(parent))
            .then(() => page.dataTable.doubleClickOnRowByName(subFolder1))
            .then(() => page.dataTable.doubleClickOnRowByName(subFolder2))
            .then(() => {
                const expectedBreadcrumb = [ 'Personal Files', parent, subFolder1, subFolder2 ];
                expect(breadcrumb.getAllItems()).toEqual(expectedBreadcrumb);
            });
    });

    it('File Libraries breadcrumb for a folder hierarchy - [C260967]', () => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES)
            .then(() => page.dataTable.waitForHeader())
            .then(() => page.dataTable.doubleClickOnRowByName(siteName))
            .then(() => page.dataTable.doubleClickOnRowByName(parent))
            .then(() => page.dataTable.doubleClickOnRowByName(subFolder1))
            .then(() => page.dataTable.doubleClickOnRowByName(subFolder2))
            .then(() => {
                const expectedItems = [ 'File Libraries', siteName, parent, subFolder1, subFolder2 ];
                expect(breadcrumb.getAllItems()).toEqual(expectedItems);
            });
    });

    it('User can navigate to any location by clicking on a step from the breadcrumb - [C213235]', () => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES)
            .then(() => page.dataTable.waitForHeader())
            .then(() => page.dataTable.doubleClickOnRowByName(parent))
            .then(() => page.dataTable.doubleClickOnRowByName(subFolder1))
            .then(() => page.dataTable.doubleClickOnRowByName(subFolder2))
            .then(() => breadcrumb.clickItem(subFolder1))
            .then(() => {
                const expectedBreadcrumb = [ 'Personal Files', parent, subFolder1 ];
                expect(breadcrumb.getAllItems()).toEqual(expectedBreadcrumb);
            });
    });

    it('Tooltip appears on hover on a step in breadcrumb - [C213237]', () => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES)
            .then(() => page.dataTable.waitForHeader())
            .then(() => page.dataTable.doubleClickOnRowByName(parent))
            .then(() => page.dataTable.doubleClickOnRowByName(subFolder1))
            .then(() => page.dataTable.doubleClickOnRowByName(subFolder2))
            .then(() => {
                expect(breadcrumb.getNthItemTooltip(3)).toEqual(subFolder1);
            });
    });

    it('Breadcrumb updates correctly when folder is renamed - [C213238]', () => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES)
            .then(() => page.dataTable.waitForHeader())
            .then(() => page.dataTable.doubleClickOnRowByName(parent2))
            .then(() => page.dataTable.doubleClickOnRowByName(folder1))
            .then(() => page.dataTable.wait())
            .then(() => apis.user.nodes.renameNode(folder1Id, folder1Renamed).then(done => done))
            .then(() => page.refresh())
            .then(() => page.dataTable.wait())
            .then(() => {
                expect(breadcrumb.getCurrentItemName()).toEqual(folder1Renamed);
            });
    });

    it('Browser back navigates to previous location regardless of breadcrumb steps - [C213240]', () => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES)
            .then(() => page.dataTable.waitForHeader())
            .then(() => page.dataTable.doubleClickOnRowByName(parent))
            .then(() => page.dataTable.doubleClickOnRowByName(subFolder1))
            .then(() => page.dataTable.doubleClickOnRowByName(subFolder2))
            .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
            .then(() => page.dataTable.waitForEmptyState())
            .then(() => browser.navigate().back())
            .then(() => {
                const expectedBreadcrumb = [ 'Personal Files', parent, subFolder1, subFolder2 ];
                expect(breadcrumb.getAllItems()).toEqual(expectedBreadcrumb);
            });
    });

    // disabled cause of ACA-1039
    xdescribe('as admin', () => {
        const user2 = 'a_user';
        const userFolder = `userFolder-${Utils.random()}`; let userFolderId;
        const user2Api = new RepoClient(user2, user2);

        beforeAll(done => {
            logoutPage.load()
                .then(() => apis.admin.people.createUser({ username: user2 }))
                .then(() => user2Api.nodes.createFolder(userFolder).then(resp => userFolderId = resp.entry.id))
                .then(() => loginPage.loginWithAdmin())
                .then(done);
        });

        afterAll(done => {
            Promise.all([
                user2Api.nodes.deleteNodeById(userFolderId),
                logoutPage.load()
            ])
            .then(done);
        });

        xit(`Breadcrumb on navigation to a user's home - [C260970]`, () => {
            page.dataTable.doubleClickOnRowByName('User Homes')
                .then(() => page.dataTable.doubleClickOnRowByName(user2))
                .then(() => expect(breadcrumb.getAllItems()).toEqual([ 'Personal Files', 'User Homes', user2 ]))
                .then(() => page.dataTable.doubleClickOnRowByName(userFolder))
                .then(() => expect(breadcrumb.getAllItems()).toEqual([ 'Personal Files', 'User Homes', user2, userFolder ]));
        });
    });
});
