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
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { APP_ROUTES, SIDEBAR_LABELS } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Restore from Trash', () => {
    const username = `user-${Utils.random()}`;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const page = new BrowsingPage();
    const { dataTable, toolbar } = page;

    beforeAll(done => {
        apis.admin.people.createUser(username)
            .then(() => loginPage.loginWith(username))
            .then(done);
    });

    afterAll(done => {
        Promise.all([
            apis.admin.trashcan.emptyTrash(),
            logoutPage.load()
        ])
        .then(done);
    });

    xit('');

    describe('successful restore', () => {
        const file = `file-${Utils.random()}.txt`; let fileId;
        const folder = `folder-${Utils.random()}`; let folderId;

        beforeAll(done => {
            apis.user.nodes.createFile(file).then(resp => fileId = resp.data.entry.id)
                .then(() => apis.user.nodes.createFolder(folder).then(resp => folderId = resp.data.entry.id))
                .then(() => apis.user.nodes.deleteNodesById([ fileId, folderId ], false))
                .then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            apis.user.trashcan.emptyTrash().then(done);
        });

        it('restore file', () => {
            dataTable.clickOnItemNameRow(file)
                .then(() => toolbar.actions.getButtonByTitleAttribute('Restore').click())
                .then(() => page.getSnackBarMessage())
                .then(text => {
                    expect(text).toContain(`${file} restored`);
                    expect(text).toContain(`View`);
                    expect(dataTable.getRowName(file).isPresent()).toBe(false, 'Item was not removed from list');
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES))
                .then(() => page.dataTable.waitForHeader())
                .then(() => {
                    expect(page.dataTable.getRowName(file).isPresent()).toBe(true, 'Item not displayed in list');
                })

                .then(() => apis.user.nodes.deleteNodeById(fileId, false));
        });

        it('restore folder', () => {
            dataTable.clickOnItemNameRow(folder)
                .then(() => toolbar.actions.getButtonByTitleAttribute('Restore').click())
                .then(() => page.getSnackBarMessage())
                .then(text => {
                    expect(text).toContain(`${folder} restored`);
                    expect(text).toContain(`View`);
                    expect(dataTable.getRowName(folder).isPresent()).toBe(false, 'Item was not removed from list');
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES))
                .then(() => page.dataTable.waitForHeader())
                .then(() => {
                    expect(page.dataTable.getRowName(folder).isPresent()).toBe(true, 'Item not displayed in list');
                })

                .then(() => apis.user.nodes.deleteNodeById(folderId, false));
        });

        it('restore multiple items', () => {
            dataTable.selectMultipleItemsRow([ file, folder ])
                .then(() => toolbar.actions.getButtonByTitleAttribute('Restore').click())
                .then(() => page.getSnackBarMessage())
                .then(text => {
                    expect(text).toContain(`Restore successful`);
                    expect(text).not.toContain(`View`);
                    expect(dataTable.getRowName(file).isPresent()).toBe(false, 'Item was not removed from list');
                    expect(dataTable.getRowName(folder).isPresent()).toBe(false, 'Item was not removed from list');
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES))
                .then(() => page.dataTable.waitForHeader())
                .then(() => {
                    expect(page.dataTable.getRowName(file).isPresent()).toBe(true, 'Item not displayed in list');
                    expect(page.dataTable.getRowName(folder).isPresent()).toBe(true, 'Item not displayed in list');
                })

                .then(() => apis.user.nodes.deleteNodesById([ fileId, folderId ], false));
        });

        it('View from notification', () => {
            dataTable.clickOnItemNameRow(file)
                .then(() => toolbar.actions.getButtonByTitleAttribute('Restore').click())
                .then(() => page.clickSnackBarAction())
                .then(() => page.dataTable.waitForHeader())
                .then(() => {
                    expect(page.sidenav.isActiveByLabel('Personal Files')).toBe(true, 'Personal Files sidebar link not active');
                    expect(browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
                })

                .then(() => apis.user.nodes.deleteNodeById(fileId, false));
        });
    });

    describe('failure to restore', () => {
        const file1 = `file-${Utils.random()}.txt`; let file1Id1, file1Id2;
        const file2 = `file-${Utils.random()}.txt`; let file2Id;

        const folder1 = `folder-${Utils.random()}`; let folder1Id;
        const folder2 = `folder-${Utils.random()}`; let folder2Id;

        beforeAll(done => {
            apis.user.nodes.createFolder(folder1).then(resp => folder1Id = resp.data.entry.id)
                .then(() => apis.user.nodes.createFile(file1, folder1Id).then(resp => file1Id1 = resp.data.entry.id))
                .then(() => apis.user.nodes.deleteNodeById(file1Id1, false))
                .then(() => apis.user.nodes.createFile(file1, folder1Id).then(resp => file1Id2 = resp.data.entry.id))

                .then(() => apis.user.nodes.createFolder(folder2).then(resp => folder2Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFile(file2, folder2Id).then(resp => file2Id = resp.data.entry.id))
                .then(() => apis.user.nodes.deleteNodeById(file2Id, false))
                .then(() => apis.user.nodes.deleteNodeById(folder2Id, false))

                .then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            Promise.all([
                apis.user.nodes.deleteNodeById(file1Id2),
                apis.user.trashcan.emptyTrash()
            ])
            .then(done);
        });

        it('Restore a file when another file with same name exists on the restore location', () => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH)
                .then(() => dataTable.clickOnItemNameRow(file1))
                .then(() => toolbar.actions.getButtonByTitleAttribute('Restore').click())
                .then(() => page.getSnackBarMessage())
                .then(text => expect(text).toEqual(`Can't restore, ${file1} already exists`));
        });

        it('Restore a file when original location no longer exists', () => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH)
                .then(() => dataTable.clickOnItemNameRow(file2))
                .then(() => toolbar.actions.getButtonByTitleAttribute('Restore').click())
                .then(() => page.getSnackBarMessage())
                .then(text => expect(text).toEqual(`Can't restore ${file2}, the original location no longer exists`));
        });

    });

    describe('Notification on partial success', () => {
        const folder1 = `folder1-${Utils.random()}.txt`; let folder1Id;
        const folder2 = `folder2-${Utils.random()}.txt`; let folder2Id;
        const file1 = `file-${Utils.random()}.txt`; let file1Id;
        const file2 = `file-${Utils.random()}.txt`; let file2Id;

        const folder3 = `folder3-${Utils.random()}.txt`; let folder3Id;
        const folder4 = `folder4-${Utils.random()}.txt`; let folder4Id;
        const file3 = `file3-${Utils.random()}.txt`; let file3Id;
        const file4 = `file4-${Utils.random()}.txt`; let file4Id;
        const file5 = `file5-${Utils.random()}.txt`; let file5Id;

        beforeAll(done => {
            apis.user.nodes.createFolder(folder1).then(resp => folder1Id = resp.data.entry.id)
                .then(() => apis.user.nodes.createFile(file1, folder1Id).then(resp => file1Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFolder(folder2).then(resp => folder2Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFile(file2, folder2Id).then(resp => file2Id = resp.data.entry.id))
                .then(() => apis.user.nodes.deleteNodeById(file1Id, false))
                .then(() => apis.user.nodes.deleteNodeById(folder1Id, false))
                .then(() => apis.user.nodes.deleteNodeById(file2Id, false))

                .then(() => apis.user.nodes.createFolder(folder3).then(resp => folder3Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFile(file3, folder3Id).then(resp => file3Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFile(file4, folder3Id).then(resp => file4Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFolder(folder4).then(resp => folder4Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFile(file5, folder4Id).then(resp => file5Id = resp.data.entry.id))
                .then(() => apis.user.nodes.deleteNodeById(file3Id, false))
                .then(() => apis.user.nodes.deleteNodeById(file4Id, false))
                .then(() => apis.user.nodes.deleteNodeById(folder3Id, false))
                .then(() => apis.user.nodes.deleteNodeById(file5Id, false))

                .then(() => loginPage.loginWith(username))
                .then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH)
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

        it('one failure', () => {
            dataTable.selectMultipleItemsRow([ file1, file2 ])
                .then(() => toolbar.actions.getButtonByTitleAttribute('Restore').click())
                .then(() => page.getSnackBarMessage())
                    .then(text => expect(text).toEqual(`Can't restore ${file1}, the original location no longer exists`));
        });

        it('multiple failures', () => {
            dataTable.selectMultipleItemsRow([ file3, file4, file5 ])
                .then(() => toolbar.actions.getButtonByTitleAttribute('Restore').click())
                .then(() => page.getSnackBarMessage())
                .then(text => expect(text).toEqual('2 items not restored because of issues with the restore location'));
        });
    });
});
