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

import { browser, protractor, promise } from 'protractor';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { APP_ROUTES, SITE_VISIBILITY, SITE_ROLES, SIDEBAR_LABELS } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Restore from Trash', () => {
    const username = `user-${Utils.random()}`;

    const file1 = `file-${Utils.random()}.txt`;
    const file2 = `file-${Utils.random()}.txt`;
    const file3 = `file-${Utils.random()}.txt`;
    let filesIds;

    const folder1 = `folder-${Utils.random()}`;
    const folder2 = `folder-${Utils.random()}`;
    let foldersIds;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const trashPage = new BrowsingPage();
    const personalFilesPage = new BrowsingPage();
    const { dataTable } = trashPage;
    const { toolbar } = trashPage;

    beforeAll(done => {
        apis.admin.people.createUser(username)
            .then(() => apis.user.nodes.createFiles([ file1, file2, file3 ]))
            .then(resp => filesIds = resp.data.list.entries.map(entries => entries.entry.id))
            .then(() => apis.user.nodes.createFolders([ folder1, folder2 ]))
            .then(resp => foldersIds = resp.data.list.entries.map(entries => entries.entry.id))

            .then(() => apis.user.nodes.deleteNodesById(filesIds, false))
            .then(() => apis.user.nodes.deleteNodesById(foldersIds, false))

            .then(() => loginPage.load())
            .then(() => loginPage.loginWith(username))
            .then(done);
    });

    beforeEach(done => {
        trashPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH)
            .then(() => dataTable.waitForHeader())
            .then(done);
    });

    afterAll(done => {
        Promise.all([
            apis.user.nodes.deleteNodesById(filesIds),
            apis.user.nodes.deleteNodesById(foldersIds),
            apis.admin.trashcan.emptyTrash(),
            logoutPage.load()
        ])
        .then(done);
    });

    it('restore file', () => {
        dataTable.clickOnItemName(file1)
            .then(() => toolbar.actions.getButtonByTitleAttribute('Restore').click())
            .then(() => trashPage.getSnackBarMessage())
            .then(text => {
                expect(text).toContain(`${file1} restored`);
                expect(text).toContain(`View`);
                expect(dataTable.getRowByName(file1).isPresent()).toBe(false, 'Item was not removed from list');
            })
            .then(() => personalFilesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES))
            .then(() => personalFilesPage.dataTable.waitForHeader())
            .then(() => {
                expect(personalFilesPage.dataTable.getRowByName(file1).isPresent()).toBe(true, 'Item not displayed in list');
            });
    });

    it('restore folder', () => {
        dataTable.clickOnItemName(folder1)
            .then(() => toolbar.actions.getButtonByTitleAttribute('Restore').click())
            .then(() => trashPage.getSnackBarMessage())
            .then(text => {
                expect(text).toContain(`${folder1} restored`);
                expect(text).toContain(`View`);
                expect(dataTable.getRowByName(folder1).isPresent()).toBe(false, 'Item was not removed from list');
            })
            .then(() => personalFilesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES))
            .then(() => personalFilesPage.dataTable.waitForHeader())
            .then(() => {
                expect(personalFilesPage.dataTable.getRowByName(folder1).isPresent()).toBe(true, 'Item not displayed in list');
            });
    });

    it('restore multiple items', () => {
        dataTable.selectMultipleItems([ file2, folder2 ])
            .then(() => toolbar.actions.getButtonByTitleAttribute('Restore').click())
            .then(() => trashPage.getSnackBarMessage())
            .then(text => {
                expect(text).toContain(`Restore successful`);
                expect(text).not.toContain(`View`);
                expect(dataTable.getRowByName(file2).isPresent()).toBe(false, 'Item was not removed from list');
                expect(dataTable.getRowByName(folder2).isPresent()).toBe(false, 'Item was not removed from list');
            })
            .then(() => personalFilesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES))
            .then(() => personalFilesPage.dataTable.waitForHeader())
            .then(() => {
                expect(personalFilesPage.dataTable.getRowByName(file2).isPresent()).toBe(true, 'Item not displayed in list');
                expect(personalFilesPage.dataTable.getRowByName(folder2).isPresent()).toBe(true, 'Item not displayed in list');
            });
    });

    it('View from notification', () => {
        dataTable.clickOnItemName(file3)
            .then(() => toolbar.actions.getButtonByTitleAttribute('Restore').click())
            .then(() => trashPage.getSnackBarAction().click())
            .then(() => personalFilesPage.dataTable.waitForHeader())
            .then(() => {
                expect(personalFilesPage.sidenav.isActiveByLabel('Personal Files')).toBe(true, 'Personal Files sidebar link not active');
                expect(browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
            });
    });
});
