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

describe('File Libraries', () => {
    const username = `user-${Utils.random()}`;
    const password = username;

    const sitePrivate = `private-${Utils.random()}`;
    const siteModerated = `moderated-${Utils.random()}`;
    const sitePublic = `public-${Utils.random()}`;

    const adminSite = `admin-${Utils.random()}`;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, password)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const fileLibrariesPage = new BrowsingPage(APP_ROUTES.FILE_LIBRARIES);
    const { dataTable } = fileLibrariesPage;

    beforeAll(done => {
        Promise
            .all([
                apis.admin.people.createUser(username),
                apis.admin.sites.createSite(sitePublic, SITE_VISIBILITY.PUBLIC),
                apis.admin.sites.createSite(siteModerated, SITE_VISIBILITY.MODERATED),
                apis.admin.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE),
                apis.admin.sites.createSite(adminSite, SITE_VISIBILITY.PUBLIC)
            ])
            .then(() => apis.admin.sites.addSiteMember(sitePublic, username, SITE_ROLES.SITE_CONSUMER))
            .then(() => apis.admin.sites.addSiteMember(siteModerated, username, SITE_ROLES.SITE_MANAGER))
            .then(() => apis.admin.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_CONTRIBUTOR))

            .then(() => loginPage.load())
            .then(() => loginPage.loginWith(username))
            .then(done);
    });

    beforeEach(done => {
        fileLibrariesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES)
            .then(() => dataTable.waitForHeader())
            .then(done);
    });

    afterAll(done => {
        Promise.all([
            apis.admin.sites.deleteSite(sitePublic),
            apis.admin.sites.deleteSite(siteModerated),
            apis.admin.sites.deleteSite(sitePrivate),
            apis.admin.sites.deleteSite(adminSite),
            logoutPage.load()
        ])
        .then(done);
    });

    it('has the correct columns', () => {
        const labels = [ 'Title', 'Status' ];
        const elements = labels.map(label => dataTable.getColumnHeaderByLabel(label));

        expect(dataTable.getColumnHeaders().count()).toBe(2 + 1, 'Incorrect number of columns');

        elements.forEach((element, index) => {
            expect(element.isPresent()).toBe(true, `"${labels[index]}" is missing`);
        });
    });

    it('User can see only the sites he is a member of', () => {
        const sitesCount = dataTable.countRows();

        const expectedSites = {
            [sitePrivate]: SITE_VISIBILITY.PRIVATE,
            [siteModerated]: SITE_VISIBILITY.MODERATED,
            [sitePublic]: SITE_VISIBILITY.PUBLIC
        };

        expect(sitesCount).toEqual(3, 'Incorrect number of sites displayed');
        expect(dataTable.getRowByName(adminSite).isPresent()).toBe(false, 'Incorrect site appears in list');

        dataTable.getRows()
            .map((row) => {
                return row.all(by.css('td')).map(cell => cell.getText());
            })
            .then((rowCells) => {
                return rowCells.reduce((acc, cell) => {
                    acc[cell[1]] = cell[2].toUpperCase();
                    return acc;
                }, {});
            })
            .then((sitesList) => {
                Object.keys(expectedSites).forEach((site) => {
                    expect(sitesList[site]).toEqual(expectedSites[site]);
                });
            });
    });

    // it('Site ID is displayed when two sites have the same name', () => {
    //     // cannot be implemented until ACA-987 is fixed
    // });
});
