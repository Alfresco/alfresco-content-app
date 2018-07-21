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
import { SIDEBAR_LABELS } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Undo delete content', () => {
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
        apis.admin.people.createUser(username).then(done);
    });

    afterAll(done => {
        apis.admin.trashcan.emptyTrash().then(done);
    });

    xit('');

    describe('on Personal Files', () => {
        const file1 = `file1-${Utils.random()}.txt`; let file1Id;
        const file2 = `file2-${Utils.random()}.txt`; let file2Id;
        const file3 = `file3-${Utils.random()}.txt`; let file3Id;
        const file4 = `file4-${Utils.random()}.txt`;
        const folder1 = `folder1-${Utils.random()}`; let folder1Id;
        const folder2 = `folder2-${Utils.random()}`; let folder2Id;
        const fileLocked2 = `fileLocked2-${Utils.random()}.txt`; let fileLocked2Id;

        beforeAll(done => {
            apis.user.nodes.createFile(file1).then(resp => file1Id = resp.data.entry.id)
                .then(() => apis.user.nodes.createFile(file2).then(resp => file2Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFile(file3).then(resp => file3Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFolder(folder1).then(resp => folder1Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFile(file4, folder1Id))
                .then(() => apis.user.nodes.createFolder(folder2).then(resp => folder2Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFile(fileLocked2, folder2Id).then(resp => fileLocked2Id = resp.data.entry.id))
                .then(() => apis.user.nodes.lockFile(fileLocked2Id))

                .then(() => loginPage.loginWith(username))
                .then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterEach(done => {
            page.refresh().then(done);
        });

        afterAll(done => {
            Promise.all([
                logoutPage.load(),
                apis.user.nodes.unlockFile(fileLocked2Id)
                    .then(() => apis.user.nodes.deleteNodesById([file1Id, file2Id, file3Id, folder1Id, folder2Id]))
            ])
            .then(done);
        });

        it('Successful delete notification shows Undo action', () => {
            dataTable.clickOnItemNameRow(file1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`Undo`);
                })

                .then(() => apis.user.trashcan.restore(file1Id));
        });

        it('Unsuccessful delete notification does not show Undo action', () => {
            dataTable.clickOnItemNameRow(folder2)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).not.toContain(`Undo`);
                });
        });

        it('Undo delete of file', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.clickOnItemNameRow(file1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.clickSnackBarAction())
                .then(() => {
                    expect(dataTable.getRowName(file1).isPresent()).toBe(true, 'Item was not restored');
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                });
        });

        it('Undo delete of folder with content', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.clickOnItemNameRow(folder1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.clickSnackBarAction())
                .then(() => {
                    expect(dataTable.getRowName(folder1).isPresent()).toBe(true, 'Item was not restored');
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                })
                .then(() => dataTable.doubleClickOnItemNameRow(folder1))
                .then(() => {
                    expect(dataTable.getRowName(file4).isPresent()).toBe(true, 'file from folder not restored');
                });
        });

        it('undo delete of multiple files', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.selectMultipleItemsRow([file2, file3])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.clickSnackBarAction())
                .then(() => {
                    expect(dataTable.getRowName(file2).isPresent()).toBe(true, `${file2} was not removed from list`);
                    expect(dataTable.getRowName(file3).isPresent()).toBe(true, `${file3} was not removed from list`);
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                });
        });
    });

    describe('on Shared Files', () => {
        const sharedFile1 = `sharedFile1-${Utils.random()}`; let sharedFile1Id;
        const sharedFile2 = `sharedFile2-${Utils.random()}`; let sharedFile2Id;
        const sharedFile3 = `sharedFile3-${Utils.random()}`; let sharedFile3Id;
        const sharedFile4 = `sharedFile4-${Utils.random()}`; let sharedFile4Id;

        beforeAll(done => {
            apis.user.nodes.createFile(sharedFile1).then(resp => sharedFile1Id = resp.data.entry.id)
                .then(() => apis.user.nodes.createFile(sharedFile2).then(resp => sharedFile2Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFile(sharedFile3).then(resp => sharedFile3Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFile(sharedFile4).then(resp => sharedFile4Id = resp.data.entry.id))
                .then(() => apis.user.shared.shareFilesByIds([sharedFile1Id, sharedFile2Id, sharedFile3Id, sharedFile4Id]))
                .then(() => apis.user.shared.waitForApi({ expect: 4 }))

                .then(() => loginPage.loginWith(username))
                .then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterEach(done => {
            page.refresh().then(done);
        });

        afterAll(done => {
            Promise.all([
                logoutPage.load(),
                apis.user.nodes.deleteNodesById([sharedFile2Id, sharedFile3Id, sharedFile4Id])
            ])
            .then(done);
        });

        it('Successful delete notification shows Undo action', () => {
            dataTable.clickOnItemNameRow(sharedFile1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => expect(message).toContain(`Undo`));
        });

        it('Undo delete of file', () => {
            dataTable.clickOnItemNameRow(sharedFile2)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.clickSnackBarAction())
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => expect(dataTable.getRowName(sharedFile2).isPresent()).toBe(false, 'Item was not restored'));
        });

        it('undo delete of multiple files', () => {
            dataTable.selectMultipleItemsRow([sharedFile3, sharedFile4])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.clickSnackBarAction())
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => {
                    expect(dataTable.getRowName(sharedFile3).isPresent()).toBe(false, `${sharedFile3} was not restored`);
                    expect(dataTable.getRowName(sharedFile4).isPresent()).toBe(false, `${sharedFile4} was not restored`);
                });
        });
    });

    describe('on Favorites', () => {
        const favoriteFile1 = `favFile1-${Utils.random()}.txt`; let favoriteFile1Id;
        const favoriteFile2 = `favFile2-${Utils.random()}.txt`; let favoriteFile2Id;
        const favoriteFile4 = `favFile4-${Utils.random()}.txt`;
        const favoriteFileLocked2 = `favFileLocked2-${Utils.random()}.txt`; let favoriteFileLocked2Id;
        const favoriteFolder1 = `favFolder1-${Utils.random()}`; let favoriteFolder1Id;
        const favoriteFolder2 = `favFolder2-${Utils.random()}`; let favoriteFolder2Id;

        beforeAll(done => {
            apis.user.nodes.createFile(favoriteFile1).then(resp => favoriteFile1Id = resp.data.entry.id)
                .then(() => apis.user.nodes.createFile(favoriteFile2).then(resp => favoriteFile2Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFolder(favoriteFolder1).then(resp => favoriteFolder1Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFile(favoriteFile4, favoriteFolder1Id))
                .then(() => apis.user.nodes.createFolder(favoriteFolder2).then(resp => favoriteFolder2Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFile(favoriteFileLocked2, favoriteFolder2Id)
                    .then(resp => favoriteFileLocked2Id = resp.data.entry.id))
                .then(() => apis.user.nodes.lockFile(favoriteFileLocked2Id))

                .then(() => apis.user.favorites.addFavoritesByIds('file', [favoriteFile1Id, favoriteFile2Id]))
                .then(() => apis.user.favorites.addFavoritesByIds('folder', [favoriteFolder1Id, favoriteFolder2Id]))
                .then(() => apis.user.favorites.waitForApi({ expect: 4 }))

                .then(() => loginPage.loginWith(username))
                .then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterEach(done => {
            page.refresh().then(done);
        });

        afterAll(done => {
            Promise.all([
                logoutPage.load(),
                apis.user.nodes.unlockFile(favoriteFileLocked2Id)
                    .then(() => apis.user.nodes.deleteNodesById([favoriteFile1Id, favoriteFile2Id, favoriteFolder1Id, favoriteFolder2Id]))
            ])
            .then(done);
        });

        it('Successful delete notification shows Undo action', () => {
            dataTable.clickOnItemNameRow(favoriteFile1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => expect(message).toContain(`Undo`))

                .then(() => apis.user.trashcan.restore(favoriteFile1Id));
        });

        it('Unsuccessful delete notification does not show Undo action', () => {
            dataTable.clickOnItemNameRow(favoriteFolder2)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => expect(message).not.toContain(`Undo`));
        });

        it('Undo delete of file', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.clickOnItemNameRow(favoriteFile1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.clickSnackBarAction())
                .then(() => {
                    expect(dataTable.getRowName(favoriteFile1).isPresent()).toBe(true, 'Item was not restored');
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                });
        });

        it('Undo delete of folder with content', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.clickOnItemNameRow(favoriteFolder1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.clickSnackBarAction())
                .then(() => {
                    expect(dataTable.getRowName(favoriteFolder1).isPresent()).toBe(true, 'Item was not restored');
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                })
                .then(() => dataTable.doubleClickOnItemNameRow(favoriteFolder1))
                .then(() => expect(dataTable.getRowName(favoriteFile4).isPresent()).toBe(true, 'file from folder not restored'));
        });

        it('undo delete of multiple files', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.selectMultipleItemsRow([favoriteFile1, favoriteFile2])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.clickSnackBarAction())
                .then(() => {
                    expect(dataTable.getRowName(favoriteFile1).isPresent()).toBe(true, `${favoriteFile1} was not removed from list`);
                    expect(dataTable.getRowName(favoriteFile2).isPresent()).toBe(true, `${favoriteFile2} was not removed from list`);
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                });
        });
    });

    describe('on Recent Files', () => {
        const recentFile1 = `recentFile1-${Utils.random()}.txt`; let recentFile1Id;
        const recentFile2 = `recentFile2-${Utils.random()}.txt`; let recentFile2Id;
        const recentFile3 = `recentFile3-${Utils.random()}.txt`; let recentFile3Id;
        const recentFile4 = `recentFile4-${Utils.random()}.txt`; let recentFile4Id;

        beforeAll(done => {
            apis.user.nodes.createFile(recentFile1).then(resp => recentFile1Id = resp.data.entry.id)
                .then(() => apis.user.nodes.createFile(recentFile2).then(resp => recentFile2Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFile(recentFile3).then(resp => recentFile3Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFile(recentFile4).then(resp => recentFile4Id = resp.data.entry.id))
                .then(() => apis.user.search.waitForApi(username, { expect: 4 }))

                .then(() => loginPage.loginWith(username))

                .then((): any => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES)
                    .then(() => dataTable.isEmptyList())
                    .then(empty => {
                        if (empty) {
                            browser.sleep(6000).then(() => page.refresh());
                        }
                    })
                )
                .then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterEach(done => {
            page.refresh().then(done);
        });

        afterAll(done => {
            Promise.all([
                logoutPage.load(),
                apis.user.nodes.deleteNodesById([recentFile2Id, recentFile3Id, recentFile4Id])
            ])
            .then(done);
        });

        xit('Successful delete notification shows Undo action', () => {
            dataTable.clickOnItemNameRow(recentFile1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => expect(message).toContain(`Undo`));
        });

        // due to the fact that the search api is slow to update,
        // we cannot test that the restored file is displayed in the Recent Files list
        // without adding a very big browser.sleep followed by a page.refresh
        // so for the moment we're testing that the restored file is not displayed in the Trash
        xit('Undo delete of file', () => {
            dataTable.clickOnItemNameRow(recentFile2)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.clickSnackBarAction())
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => expect(dataTable.getRowName(recentFile2).isPresent()).toBe(false, 'Item is in Trash'));
        });

        // due to the fact that the search api is slow to update,
        // we cannot test that the restored file is displayed in the Recent Files list
        // without adding a very big browser.sleep followed by a page.refresh
        // so for the moment we're testing that the restored file is not displayed in the Trash
        xit('undo delete of multiple files', () => {
            dataTable.selectMultipleItemsRow([recentFile3, recentFile4])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.clickSnackBarAction())
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => {
                    expect(dataTable.getRowName(recentFile3).isPresent()).toBe(false, `${recentFile3} is in Trash`);
                    expect(dataTable.getRowName(recentFile4).isPresent()).toBe(false, `${recentFile4} is in Trash`);
                });
        });
    });
});
