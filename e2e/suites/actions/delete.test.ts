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

describe('Delete content', () => {
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
        const file3 = `file3-${Utils.random()}.txt`;
        const file4 = `file4-${Utils.random()}.txt`; let file4Id;
        const folder1 = `folder1-${Utils.random()}`; let folder1Id;
        const folder2 = `folder2-${Utils.random()}`; let folder2Id;
        const fileLocked1 = `fileLocked-${Utils.random()}.txt`; let fileLocked1Id;

        beforeAll(done => {
            apis.user.nodes.createFile(file1).then(resp => file1Id = resp.data.entry.id)
                .then(() => apis.user.nodes.createFile(file2).then(resp => file2Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFolder(folder1).then(resp => folder1Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFolder(folder2).then(resp => folder2Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFile(file3, folder1Id))
                .then(() => apis.user.nodes.createFile(file4, folder2Id).then(resp => file4Id = resp.data.entry.id))
                .then(() => apis.user.nodes.lockFile(file4Id))

                .then(() => apis.user.nodes.createFile(fileLocked1).then(resp => fileLocked1Id = resp.data.entry.id))
                .then(() => apis.user.nodes.lockFile(fileLocked1Id))

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
                apis.user.nodes.unlockFile(file4Id)
                    .then(() => apis.user.nodes.unlockFile(fileLocked1Id))
                    .then(() => apis.user.nodes.deleteNodesById([file1Id, file2Id, folder1Id, folder2Id, fileLocked1Id]))
            ])
            .then(done);
        });

        it('delete a file and check notification', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.clickOnItemNameRow(file1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`${file1} deleted`);
                    expect(dataTable.getRowName(file1).isPresent()).toBe(false, 'Item was not removed from list');
                    items--;
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => expect(dataTable.getRowName(file1).isPresent()).toBe(true, 'Item is not in trash'))

                .then(() => apis.user.trashcan.restore(file1Id));
        });

        it('delete multiple files and check notification', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.selectMultipleItemsRow([file1, file2])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`Deleted 2 items`);
                    expect(dataTable.getRowName(file1).isPresent()).toBe(false, `${file1} was not removed from list`);
                    expect(dataTable.getRowName(file2).isPresent()).toBe(false, `${file2} was not removed from list`);
                    items = items - 2;
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => {
                    expect(dataTable.getRowName(file1).isPresent()).toBe(true, `${file1} is not in trash`);
                    expect(dataTable.getRowName(file2).isPresent()).toBe(true, `${file2} is not in trash`);
                })

                .then(() => apis.user.trashcan.restore(file1Id))
                .then(() => apis.user.trashcan.restore(file2Id));
        });

        it('delete a folder with content', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.clickOnItemNameRow(folder1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => {
                    expect(dataTable.getRowName(folder1).isPresent()).toBe(false, 'Item was not removed from list');
                    items--;
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => {
                    expect(dataTable.getRowName(folder1).isPresent()).toBe(true, 'Item is not in trash');
                    expect(dataTable.getRowName(file3).isPresent()).toBe(false, 'Item is in trash');
                })

                .then(() => apis.user.trashcan.restore(folder1Id));
        });

        it('delete a folder containing locked files', () => {
            dataTable.clickOnItemNameRow(folder2)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`${folder2} couldn't be deleted`);
                    expect(dataTable.getRowName(folder2).isPresent()).toBe(true, 'Item was removed from list');
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => {
                    expect(dataTable.getRowName(folder2).isPresent()).toBe(false, 'Item is in trash');
                    expect(dataTable.getRowName(file4).isPresent()).toBe(false, 'Item is in trash');
                });
        });

        it('notification on multiple items deletion - some items fail to delete', () => {
            dataTable.selectMultipleItemsRow([file1, folder2])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => expect(message).toContain(`Deleted 1 item, 1 couldn't be deleted`))

                .then(() => apis.user.trashcan.restore(file1Id));
        });

        // TODO: needs to operate on two folders containing locked items
        xit('Notification on multiple items deletion - all items fail to delete', () => {
            dataTable.selectMultipleItemsRow([fileLocked1, folder2])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => expect(message).toEqual(`2 items couldn't be deleted`));
        });
    });

    describe('on Shared Files', () => {
        const sharedFile1 = `sharedFile1-${Utils.random()}.txt`; let sharedFile1Id;
        const sharedFile2 = `sharedFile2-${Utils.random()}.txt`; let sharedFile2Id;
        const sharedFile3 = `sharedFile3-${Utils.random()}.txt`; let sharedFile3Id;

        beforeAll(done => {
            apis.user.nodes.createFile(sharedFile1).then(resp => sharedFile1Id = resp.data.entry.id)
                .then(() => apis.user.nodes.createFile(sharedFile2).then(resp => sharedFile2Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFile(sharedFile3).then(resp => sharedFile3Id = resp.data.entry.id))
                .then(() => apis.user.shared.shareFilesByIds([sharedFile1Id, sharedFile2Id, sharedFile3Id]))
                .then(() => apis.user.shared.waitForApi({ expect: 3 }))

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
                apis.user.nodes.deleteNodesById([sharedFile1Id, sharedFile2Id, sharedFile3Id])
            ])
            .then(done);
        });

        it('delete a file and check notification', () => {
            dataTable.clickOnItemNameRow(sharedFile1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`${sharedFile1} deleted`);
                    expect(dataTable.getRowName(sharedFile1).isPresent()).toBe(false, 'Item was not removed from list');
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => expect(dataTable.getRowName(sharedFile1).isPresent()).toBe(true, 'Item is not in trash'))

                .then(() => apis.user.trashcan.restore(sharedFile1Id));
        });

        it('delete multiple files and check notification', () => {
            dataTable.selectMultipleItemsRow([sharedFile2, sharedFile3])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`Deleted 2 items`);
                    expect(dataTable.getRowName(sharedFile2).isPresent()).toBe(false, `${sharedFile2} was not removed from list`);
                    expect(dataTable.getRowName(sharedFile3).isPresent()).toBe(false, `${sharedFile3} was not removed from list`);
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => {
                    expect(dataTable.getRowName(sharedFile2).isPresent()).toBe(true, `${sharedFile2} is not in trash`);
                    expect(dataTable.getRowName(sharedFile3).isPresent()).toBe(true, `${sharedFile3} is not in trash`);
                })

                .then(() => apis.user.trashcan.restore(sharedFile2Id))
                .then(() => apis.user.trashcan.restore(sharedFile3Id));
        });
    });

    describe('on Favorites', () => {
        const favoriteFile1 = `favFile1-${Utils.random()}.txt`; let favoriteFile1Id;
        const favoriteFile2 = `favFile2-${Utils.random()}.txt`; let favoriteFile2Id;
        const favoriteFile3 = `favFile3-${Utils.random()}.txt`;
        const favoriteFile4 = `favFile4-${Utils.random()}.txt`; let favoriteFile4Id;
        const favoriteFolder1 = `favFolder1-${Utils.random()}`; let favoriteFolder1Id;
        const favoriteFolder2 = `favFolder2-${Utils.random()}`; let favoriteFolder2Id;
        const favoriteFileLocked1 = `favFileLocked-${Utils.random()}.txt`; let favoriteFileLocked1Id;

        beforeAll(done => {
            apis.user.nodes.createFile(favoriteFile1).then(resp => favoriteFile1Id = resp.data.entry.id)
                .then(() => apis.user.nodes.createFile(favoriteFile2).then(resp => favoriteFile2Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFolder(favoriteFolder1).then(resp => favoriteFolder1Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFolder(favoriteFolder2).then(resp => favoriteFolder2Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFile(favoriteFile3, favoriteFolder1Id))
                .then(() => apis.user.nodes.createFile(favoriteFile4, favoriteFolder2Id).then(resp => favoriteFile4Id = resp.data.entry.id))
                .then(() => apis.user.nodes.lockFile(favoriteFile4Id))

                .then(() => apis.user.nodes.createFile(favoriteFileLocked1).then(resp => favoriteFileLocked1Id = resp.data.entry.id))
                .then(() => apis.user.nodes.lockFile(favoriteFileLocked1Id))

                .then(() => apis.user.favorites.addFavoritesByIds('file', [favoriteFile1Id, favoriteFile2Id, favoriteFileLocked1Id]))
                .then(() => apis.user.favorites.addFavoritesByIds('folder', [favoriteFolder1Id, favoriteFolder2Id]))
                .then(() => apis.user.favorites.waitForApi({ expect: 5 }))

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
                apis.user.nodes.unlockFile(favoriteFile4Id)
                    .then(() => apis.user.nodes.unlockFile(favoriteFileLocked1Id))
                    .then(() => apis.user.nodes.deleteNodesById([
                        favoriteFile1Id, favoriteFile2Id, favoriteFolder1Id, favoriteFolder2Id, favoriteFileLocked1Id
                    ]))
            ])
            .then(done);
        });

        it('delete a file and check notification', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.clickOnItemNameRow(favoriteFile1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`${favoriteFile1} deleted`);
                    expect(dataTable.getRowName(favoriteFile1).isPresent()).toBe(false, 'Item was not removed from list');
                    items--;
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => expect(dataTable.getRowName(favoriteFile1).isPresent()).toBe(true, 'Item is not in trash'))

                .then(() => apis.user.trashcan.restore(favoriteFile1Id));
        });

        it('delete multiple files and check notification', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.selectMultipleItemsRow([favoriteFile1, favoriteFile2])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`Deleted 2 items`);
                    expect(dataTable.getRowName(favoriteFile1).isPresent()).toBe(false, `${favoriteFile1} was not removed from list`);
                    expect(dataTable.getRowName(favoriteFile2).isPresent()).toBe(false, `${favoriteFile2} was not removed from list`);
                    items = items - 2;
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => {
                    expect(dataTable.getRowName(favoriteFile1).isPresent()).toBe(true, `${favoriteFile1} is not in trash`);
                    expect(dataTable.getRowName(favoriteFile2).isPresent()).toBe(true, `${favoriteFile2} is not in trash`);
                })

                .then(() => apis.user.trashcan.restore(favoriteFile1Id))
                .then(() => apis.user.trashcan.restore(favoriteFile2Id));
        });

        it('delete a folder with content', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });
            dataTable.clickOnItemNameRow(favoriteFolder1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => {
                    expect(dataTable.getRowName(favoriteFolder1).isPresent()).toBe(false, 'Item was not removed from list');
                    items--;
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => {
                    expect(dataTable.getRowName(favoriteFolder1).isPresent()).toBe(true, 'Item is not in trash');
                    expect(dataTable.getRowName(favoriteFile3).isPresent()).toBe(false, 'Item is in trash');
                })

                .then(() => apis.user.trashcan.restore(favoriteFolder1Id));
        });

        it('delete a folder containing locked files', () => {
            dataTable.clickOnItemNameRow(favoriteFolder2)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`${favoriteFolder2} couldn't be deleted`);
                    expect(dataTable.getRowName(favoriteFolder2).isPresent()).toBe(true, 'Item was removed from list');
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => {
                    expect(dataTable.getRowName(favoriteFolder2).isPresent()).toBe(false, 'Item is in trash');
                    expect(dataTable.getRowName(favoriteFile4).isPresent()).toBe(false, 'Item is in trash');
                });
        });

        it('notification on multiple items deletion - some items fail to delete', () => {
            dataTable.selectMultipleItemsRow([favoriteFile1, favoriteFolder2])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`Deleted 1 item, 1 couldn't be deleted`);
                })

                .then(() => apis.user.trashcan.restore(favoriteFile1Id));
        });

        it('Notification on multiple items deletion - all items fail to delete', () => {
            dataTable.selectMultipleItemsRow([favoriteFileLocked1, favoriteFolder2])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toEqual(`2 items couldn't be deleted`);
                });
        });
    });

    describe('on Recent Files', () => {
        const recentFile1 = `recentFile1-${Utils.random()}.txt`; let recentFile1Id;
        const recentFile2 = `recentFile2-${Utils.random()}.txt`; let recentFile2Id;
        const recentFile3 = `recentFile3-${Utils.random()}.txt`; let recentFile3Id;

        beforeAll(done => {
            apis.user.nodes.createFile(recentFile1).then(resp => recentFile1Id = resp.data.entry.id)
                .then(() => apis.user.nodes.createFile(recentFile2).then(resp => recentFile2Id = resp.data.entry.id))
                .then(() => apis.user.nodes.createFile(recentFile3).then(resp => recentFile3Id = resp.data.entry.id))
                .then(() => apis.user.search.waitForApi(username, { expect: 3 }))

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
                apis.user.nodes.deleteNodesById([recentFile1Id, recentFile2Id, recentFile3Id])
            ])
            .then(done);
        });

        xit('delete a file and check notification', () => {
            dataTable.clickOnItemNameRow(recentFile1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`${recentFile1} deleted`);
                    expect(dataTable.getRowName(recentFile1).isPresent()).toBe(false, 'Item was not removed from list');
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => expect(dataTable.getRowName(recentFile1).isPresent()).toBe(true, 'Item is not in trash'))

                .then(() => apis.user.trashcan.restore(recentFile1Id));
        });

        xit('delete multiple files and check notification', () => {
            dataTable.selectMultipleItemsRow([recentFile2, recentFile3])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`Deleted 2 items`);
                    expect(dataTable.getRowName(recentFile2).isPresent()).toBe(false, `${recentFile2} was not removed from list`);
                    expect(dataTable.getRowName(recentFile3).isPresent()).toBe(false, `${recentFile3} was not removed from list`);
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => {
                    expect(dataTable.getRowName(recentFile2).isPresent()).toBe(true, `${recentFile2} is not in trash`);
                    expect(dataTable.getRowName(recentFile3).isPresent()).toBe(true, `${recentFile3} is not in trash`);
                })

                .then(() => apis.user.trashcan.restore(recentFile2Id))
                .then(() => apis.user.trashcan.restore(recentFile3Id));
        });
    });
});
