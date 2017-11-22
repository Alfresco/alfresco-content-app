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

import { browser, protractor, promise } from 'protractor';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { APP_ROUTES, SITE_VISIBILITY, SITE_ROLES, SIDEBAR_LABELS } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Restore from Trash', () => {
    const username = `user-${Utils.random()}`;

    const file1 = `file-${Utils.random()}.txt`;
    let file1Id;
    const file2 = `file-${Utils.random()}.txt`;
    let file2Id;
    const file3 = `file-${Utils.random()}.txt`;
    let file3Id;

    const folder1 = `folder-${Utils.random()}`;
    let folder1Id;
    const folder2 = `folder-${Utils.random()}`;
    let folder2Id;

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
            .then(() => apis.user.nodes.createFiles([ file1 ]).then(resp => file1Id = resp.data.entry.id))
            .then(() => apis.user.nodes.createFiles([ file2 ]).then(resp => file2Id = resp.data.entry.id))
            .then(() => apis.user.nodes.createFiles([ file3 ]).then(resp => file3Id = resp.data.entry.id))
            .then(() => apis.user.nodes.createFolders([ folder1 ]).then(resp => folder1Id = resp.data.entry.id))
            .then(() => apis.user.nodes.createFolders([ folder2 ]).then(resp => folder2Id = resp.data.entry.id))

            .then(() => apis.user.nodes.deleteNodeById(file1Id, false))
            .then(() => apis.user.nodes.deleteNodeById(file2Id, false))
            .then(() => apis.user.nodes.deleteNodeById(file3Id, false))
            .then(() => apis.user.nodes.deleteNodeById(folder1Id, false))
            .then(() => apis.user.nodes.deleteNodeById(folder2Id, false))

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
            apis.user.nodes.deleteNodeById(file1Id),
            apis.user.nodes.deleteNodeById(file2Id),
            apis.user.nodes.deleteNodeById(file3Id),
            apis.user.nodes.deleteNodeById(folder1Id),
            apis.user.nodes.deleteNodeById(folder2Id),
            logoutPage.load()
        ])
        .then(done);
    });

    it('restore file', () => {
        dataTable.clickOnRowByContainingText(file1)
            .then(() => toolbar.actions.getButtonByTitleAttribute('Restore').click())
            .then(() => trashPage.getSnackBarMessage())
            .then(text => {
                expect(text).toContain(`${file1} restored`);
                expect(text).toContain(`View`);
                expect(dataTable.getRowByContainingText(file1).isPresent()).toBe(false, 'Item was not removed from list');
            })
            .then(() => personalFilesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES))
            .then(() => personalFilesPage.dataTable.waitForHeader())
            .then(() => {
                expect(personalFilesPage.dataTable.getRowByContainingText(file1).isPresent()).toBe(true, 'Item not displayed in list');
            });
    });

    it('restore folder', () => {
        dataTable.clickOnRowByContainingText(folder1)
            .then(() => toolbar.actions.getButtonByTitleAttribute('Restore').click())
            .then(() => trashPage.getSnackBarMessage())
            .then(text => {
                expect(text).toContain(`${folder1} restored`);
                expect(text).toContain(`View`);
                expect(dataTable.getRowByContainingText(folder1).isPresent()).toBe(false, 'Item was not removed from list');
            })
            .then(() => personalFilesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES))
            .then(() => personalFilesPage.dataTable.waitForHeader())
            .then(() => {
                expect(personalFilesPage.dataTable.getRowByContainingText(folder1).isPresent()).toBe(true, 'Item not displayed in list');
            });
    });

    it('restore multiple items', () => {
        dataTable.selectMultipleItems([ file2, folder2 ])
            .then(() => toolbar.actions.getButtonByTitleAttribute('Restore').click())
            .then(() => trashPage.getSnackBarMessage())
            .then(text => {
                expect(text).toContain(`Restore successful`);
                expect(text).not.toContain(`View`);
                expect(dataTable.getRowByContainingText(file2).isPresent()).toBe(false, 'Item was not removed from list');
                expect(dataTable.getRowByContainingText(folder2).isPresent()).toBe(false, 'Item was not removed from list');
            })
            .then(() => personalFilesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES))
            .then(() => personalFilesPage.dataTable.waitForHeader())
            .then(() => {
                expect(personalFilesPage.dataTable.getRowByContainingText(file2).isPresent()).toBe(true, 'Item not displayed in list');
                expect(personalFilesPage.dataTable.getRowByContainingText(folder2).isPresent()).toBe(true, 'Item not displayed in list');
            });
    });

    it('View from notification', () => {
        dataTable.clickOnRowByContainingText(file3)
            .then(() => toolbar.actions.getButtonByTitleAttribute('Restore').click())
            .then(() => trashPage.getSnackBarAction().click())
            .then(() => personalFilesPage.dataTable.waitForHeader())
            .then(() => {
                expect(personalFilesPage.sidenav.isActiveByLabel('Personal Files')).toBe(true, 'Personal Files sidebar link not active');
                expect(browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
            });
    });
});
