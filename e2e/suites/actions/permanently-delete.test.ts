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

import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { SIDEBAR_LABELS } from '../../configs';
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
    const { dataTable, toolbar } = trashPage;

    beforeAll(done => {
        apis.admin.people.createUser(username)
            .then(() => apis.user.nodes.createFiles([ file1, file2 ]))
            .then(resp => filesIds = resp.data.list.entries.map(entries => entries.entry.id))
            .then(() => apis.user.nodes.createFolders([ folder1, folder2 ]))
            .then(resp => foldersIds = resp.data.list.entries.map(entries => entries.entry.id))

            .then(() => apis.user.nodes.deleteNodesById(filesIds, false))
            .then(() => apis.user.nodes.deleteNodesById(foldersIds, false))

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
            apis.admin.trashcan.emptyTrash(),
            logoutPage.load()
        ])
        .then(done);
    });

    it('delete file [C217094] [C217091] [C217092]', () => {
        dataTable.clickOnItemNameRow(file1)
            .then(() => toolbar.actions.getButtonByTitleAttribute('Permanently delete').click())
            .then(() => trashPage.waitForDialog())
            .then(() => trashPage.getDialogActionByLabel('Delete'))
            .then((elm) => elm.click())
            .then(() => trashPage.waitForDialogToClose())
            .then(() => trashPage.getSnackBarMessage())
            .then(text => {
                expect(text).toEqual(`${file1} deleted`);
                expect(dataTable.getRowName(file1).isPresent()).toBe(false, 'Item was not deleted');
            });
    });

    it('delete folder [C217091] [C217092]', () => {
        dataTable.clickOnItemNameRow(folder1)
            .then(() => toolbar.actions.getButtonByTitleAttribute('Permanently delete').click())
            .then(() => trashPage.waitForDialog())
            .then(() => trashPage.getDialogActionByLabel('Delete'))
            .then((elm) => elm.click())
            .then(() => trashPage.waitForDialogToClose())
            .then(() => trashPage.getSnackBarMessage())
            .then(text => {
                expect(text).toEqual(`${folder1} deleted`);
                expect(dataTable.getRowName(folder1).isPresent()).toBe(false, 'Item was not deleted');
            });
    });

    it('delete multiple items [C217093]', () => {
        dataTable.selectMultipleItemsRow([ file2, folder2 ])
            .then(() => toolbar.actions.getButtonByTitleAttribute('Permanently delete').click())
            .then(() => trashPage.waitForDialog())
            .then(() => trashPage.getDialogActionByLabel('Delete'))
            .then((elm) => elm.click())
            .then(() => trashPage.waitForDialogToClose())
            .then(() => trashPage.getSnackBarMessage())
            .then(text => {
                expect(text).toEqual(`2 items deleted`);
                expect(dataTable.getRowName(file2).isPresent()).toBe(false, 'Item was not deleted');
                expect(dataTable.getRowName(folder2).isPresent()).toBe(false, 'Item was not deleted');
            });
    });
});
