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

import { by } from 'protractor';

import { SITE_VISIBILITY, SITE_ROLES, SIDEBAR_LABELS } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('File Libraries', () => {
    const username = `user-${Utils.random()}`;
    const password = username;

    const sitePrivate = `private-${Utils.random()}`;
    const siteModerated = `moderated-${Utils.random()}`;
    const sitePublic = `public-${Utils.random()}`;
    const siteName = `siteName-${Utils.random()}`;
    const siteId1 = Utils.random();
    const siteId2 = Utils.random();
    const adminSite = `admin-${Utils.random()}`;

    const siteDescription = 'my site description';

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, password)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const fileLibrariesPage = new BrowsingPage();
    const { dataTable } = fileLibrariesPage;

    beforeAll(done => {
        Promise
            .all([
                apis.admin.people.createUser(username),
                apis.admin.sites.createSite(sitePublic, SITE_VISIBILITY.PUBLIC),
                apis.admin.sites.createSite(siteModerated, SITE_VISIBILITY.MODERATED, { description: siteDescription }),
                apis.admin.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE, { description: '' }),
                apis.admin.sites.createSite(adminSite, SITE_VISIBILITY.PUBLIC),
                apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC, { id: siteId1 }),
                apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC, { id: siteId2 })
            ])
            .then(() => apis.admin.sites.addSiteMember(sitePublic, username, SITE_ROLES.SITE_CONSUMER))
            .then(() => apis.admin.sites.addSiteMember(siteModerated, username, SITE_ROLES.SITE_MANAGER))
            .then(() => apis.admin.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_CONTRIBUTOR))
            .then(() => apis.admin.sites.addSiteMember(siteId1, username, SITE_ROLES.SITE_CONTRIBUTOR))
            .then(() => apis.admin.sites.addSiteMember(siteId2, username, SITE_ROLES.SITE_CONTRIBUTOR))

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
            apis.admin.sites.deleteSites([
                sitePublic,
                siteModerated,
                sitePrivate,
                adminSite,
                siteId1,
                siteId2
            ]),
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

    it('User can see only the sites he is a member of [C217095]', () => {
        const sitesCount = dataTable.countRows();

        const expectedSites = {
            [sitePrivate]: SITE_VISIBILITY.PRIVATE,
            [siteModerated]: SITE_VISIBILITY.MODERATED,
            [sitePublic]: SITE_VISIBILITY.PUBLIC
        };

        expect(sitesCount).toEqual(5, 'Incorrect number of sites displayed');
        expect(dataTable.getRowName(adminSite).isPresent()).toBe(false, 'Incorrect site appears in list');

        dataTable.getRows()
            .map((row) => {
                return row.all(dataTable.cell).map(cell => cell.getText());
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

    it('Site ID is displayed when two sites have the same name [C217098]', () => {
        const expectedSites = [
            `${siteName} (${siteId1})`,
            `${siteName} (${siteId2})`
        ];
        dataTable.getCellsContainingName(siteName)
            .then(resp => {
                const expectedJSON = JSON.stringify(expectedSites.sort());
                const actualJSON = JSON.stringify(resp.sort());
                expect(actualJSON).toEqual(expectedJSON);
            });
    });

    it('Tooltip for sites without description [C217096]', () => {
        const tooltip = dataTable.getItemNameTooltip(sitePrivate);
        expect(tooltip).toBe(`${sitePrivate}`);
    });

    it('Tooltip for sites with description [C217097]', () => {
        const tooltip = dataTable.getItemNameTooltip(siteModerated);
        expect(tooltip).toBe(`${siteDescription}`);
    });
});
