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

describe('Special permissions', () => {
    const username = `user-${Utils.random()}`;
    const password = username;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, password)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const recentFilesPage = new BrowsingPage();
    const favoritesPage = new BrowsingPage();
    const sharedPage = new BrowsingPage();
    const { dataTable } = recentFilesPage;

    xit('');

    beforeAll(done => {
        apis.admin.people.createUser({ username }).then(done);
    });

    describe('file not displayed if user no longer has permissions on it', () => {
        const sitePrivate = `private-${Utils.random()}`;
        const fileName = `file-${Utils.random()}.txt`;
        let fileId;

        beforeAll(done => {
            apis.admin.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE)
                .then(() => apis.admin.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_COLLABORATOR))
                .then(() => apis.admin.nodes.createFiles([ fileName ], `Sites/${sitePrivate}/documentLibrary`)
                    .then(resp => fileId = resp.entry.id))
                .then(() => apis.user.favorites.addFavoriteById('file', fileId))
                .then(() => apis.admin.shared.shareFileById(fileId))
                .then(() => apis.user.nodes.editNodeContent(fileId, 'edited by user'))

                .then(() => apis.user.search.waitForApi(username, { expect: 1 }))
                .then(() => apis.user.shared.waitForApi({ expect: 1 }))

                .then(() => loginPage.loginWith(username))
                .then(done);
        });

        afterEach(done => {
            apis.admin.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_COLLABORATOR).then(done);
        });

        afterAll(done => {
            Promise.all([
                apis.admin.sites.deleteSite(sitePrivate),
                logoutPage.load()
            ])
            .then(done);
        });

        it('on Recent Files - [C213173]', () => {
            recentFilesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES)
                .then(() => dataTable.waitForHeader())
                .then(() => {
                    expect(dataTable.countRows()).toBe(1, 'Incorrect number of items');
                })
                .then(() => apis.admin.sites.deleteSiteMember(sitePrivate, username))
                .then(() => recentFilesPage.refresh())
                .then(() => {
                    expect(dataTable.countRows()).toBe(0, 'Incorrect number of items');
                });
        });

        it('on Favorites - [C213227]', () => {
            favoritesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES)
                .then(() => dataTable.waitForHeader())
                .then(() => {
                    expect(dataTable.countRows()).toBe(1, 'Incorrect number of items');
                })
                .then(() => apis.admin.sites.deleteSiteMember(sitePrivate, username))
                .then(() => favoritesPage.refresh())
                .then(() => {
                    expect(dataTable.countRows()).toBe(0, 'Incorrect number of items');
                });
        });

        it('on Shared Files - [C213116]', () => {
            sharedPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES)
                .then(() => dataTable.waitForHeader())
                .then(() => {
                    expect(dataTable.countRows()).toBe(1, 'Incorrect number of items');
                })
                .then(() => apis.admin.sites.deleteSiteMember(sitePrivate, username))
                .then(() => sharedPage.refresh())
                .then(() => {
                    expect(dataTable.countRows()).toBe(0, 'Incorrect number of items');
                });
        });
    });

    describe(`Location column is empty if user doesn't have permissions on the file's parent folder`, () => {
        const sitePrivate = `private-${Utils.random()}`;
        const fileName = `file-${Utils.random()}.txt`;
        let fileId;

        beforeAll(done => {
            apis.admin.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE)
                .then(() => apis.admin.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_COLLABORATOR))
                .then(() => apis.admin.sites.getDocLibId(sitePrivate))
                .then(resp => apis.user.nodes.createFile(fileName, resp))
                .then(resp => fileId = resp.entry.id)
                .then(() => apis.user.favorites.addFavoriteById('file', fileId))
                .then(() => apis.user.shared.shareFileById(fileId))
                .then(() => apis.user.shared.waitForApi({ expect: 1 }))
                .then(() => apis.user.search.waitForApi(username, { expect: 1 }))
                .then(() => apis.admin.sites.deleteSiteMember(sitePrivate, username))
                .then(() => loginPage.loginWith(username))
                .then(done);
        });

        afterAll(done => {
            Promise.all([
                apis.admin.sites.deleteSite(sitePrivate),
                logoutPage.load()
            ])
            .then(done);
        });

        it(`on Recent Files - [C213178]`, () => {
            recentFilesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES)
                .then(() => dataTable.waitForHeader())
                .then(() => {
                    expect(dataTable.countRows()).toBe(1, 'Incorrect number of items');
                    expect(dataTable.getItemLocation(fileName).getText()).toEqual('');
                });
        });

        it(`on Favorites - [C213672]`, () => {
            favoritesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES)
                .then(() => dataTable.waitForHeader())
                .then(() => {
                    expect(dataTable.countRows()).toBe(1, 'Incorrect number of items');
                    expect(dataTable.getItemLocation(fileName).getText()).toEqual('');
                });
        });

        it(`on Shared Files - [C213668]`, () => {
            sharedPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES)
                .then(() => dataTable.waitForHeader())
                .then(() => {
                    expect(dataTable.countRows()).toBe(1, 'Incorrect number of items');
                    expect(dataTable.getItemLocation(fileName).getText()).toEqual('');
                });
        });
    });
});
