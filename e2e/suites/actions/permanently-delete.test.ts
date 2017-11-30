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

describe('Permanently delete from Trash', () => {
    const username = `user-${Utils.random()}`;

    const file1 = `file-${Utils.random()}.txt`;
    const file2 = `file-${Utils.random()}.txt`;
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
    const { dataTable } = trashPage;
    const { toolbar } = trashPage;

    beforeAll(done => {
        apis.admin.people.createUser(username)
            .then(() => apis.user.nodes.createFiles([ file1, file2 ]))
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
            apis.user.trashcan.emptyTrash(),
            logoutPage.load()
        ])
        .then(done);
    });

    it('delete file', () => {
        dataTable.clickOnItemName(file1)
            .then(() => toolbar.actions.getButtonByTitleAttribute('Permanently delete').click())
            .then(() => trashPage.getSnackBarMessage())
            .then(text => {
                expect(text).toBe(`${file1} deleted`);
                expect(dataTable.getRowByName(file1).isPresent()).toBe(false, 'Item was not deleted');
            });
    });

    it('delete folder', () => {
        dataTable.clickOnItemName(folder1)
            .then(() => toolbar.actions.getButtonByTitleAttribute('Permanently delete').click())
            .then(() => trashPage.getSnackBarMessage())
            .then(text => {
                expect(text).toBe(`${folder1} deleted`);
                expect(dataTable.getRowByName(folder1).isPresent()).toBe(false, 'Item was not deleted');
            });
    });

    it('delete multiple items', () => {
        dataTable.selectMultipleItems([ file2, folder2 ])
            .then(() => toolbar.actions.getButtonByTitleAttribute('Permanently delete').click())
            .then(() => trashPage.getSnackBarMessage())
            .then(text => {
                expect(text).toBe(`2 items deleted`);
                expect(dataTable.getRowByName(file2).isPresent()).toBe(false, 'Item was not deleted');
                expect(dataTable.getRowByName(folder2).isPresent()).toBe(false, 'Item was not deleted');
            });
    });
});
