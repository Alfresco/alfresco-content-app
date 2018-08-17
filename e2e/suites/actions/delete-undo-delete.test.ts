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

describe('Delete and undo delete', () => {
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
        apis.admin.people.createUser({ username }).then(done);
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
            apis.user.nodes.createFile(file1).then(resp => file1Id = resp.entry.id)
                .then(() => apis.user.nodes.createFile(file2).then(resp => file2Id = resp.entry.id))
                .then(() => apis.user.nodes.createFolder(folder1).then(resp => folder1Id = resp.entry.id))
                .then(() => apis.user.nodes.createFolder(folder2).then(resp => folder2Id = resp.entry.id))
                .then(() => apis.user.nodes.createFile(file3, folder1Id))
                .then(() => apis.user.nodes.createFile(file4, folder2Id).then(resp => file4Id = resp.entry.id))
                .then(() => apis.user.nodes.lockFile(file4Id))

                .then(() => apis.user.nodes.createFile(fileLocked1).then(resp => fileLocked1Id = resp.entry.id))
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
            .then(() => apis.user.search.waitForApi(username, {expect: 0}))
            .then(done);
        });

        it('delete a file and check notification - [C217125]', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.selectItem(file1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`${file1} deleted`);
                    expect(dataTable.getRowByName(file1).isPresent()).toBe(false, 'Item was not removed from list');
                    items--;
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => expect(dataTable.getRowByName(file1).isPresent()).toBe(true, 'Item is not in trash'))

                .then(() => apis.user.trashcan.restore(file1Id));
        });

        it('delete multiple files and check notification - [C280502]', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.selectMultipleItems([file1, file2])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`Deleted 2 items`);
                    expect(dataTable.getRowByName(file1).isPresent()).toBe(false, `${file1} was not removed from list`);
                    expect(dataTable.getRowByName(file2).isPresent()).toBe(false, `${file2} was not removed from list`);
                    items = items - 2;
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => {
                    expect(dataTable.getRowByName(file1).isPresent()).toBe(true, `${file1} is not in trash`);
                    expect(dataTable.getRowByName(file2).isPresent()).toBe(true, `${file2} is not in trash`);
                })

                .then(() => apis.user.trashcan.restore(file1Id))
                .then(() => apis.user.trashcan.restore(file2Id));
        });

        it('delete a folder with content - [C217126]', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.selectItem(folder1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => {
                    expect(dataTable.getRowByName(folder1).isPresent()).toBe(false, 'Item was not removed from list');
                    items--;
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => {
                    expect(dataTable.getRowByName(folder1).isPresent()).toBe(true, 'Item is not in trash');
                    expect(dataTable.getRowByName(file3).isPresent()).toBe(false, 'Item is in trash');
                })

                .then(() => apis.user.trashcan.restore(folder1Id));
        });

        it('delete a folder containing locked files - [C217127]', () => {
            dataTable.selectItem(folder2)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`${folder2} couldn't be deleted`);
                    expect(dataTable.getRowByName(folder2).isPresent()).toBe(true, 'Item was removed from list');
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => {
                    expect(dataTable.getRowByName(folder2).isPresent()).toBe(false, 'Item is in trash');
                    expect(dataTable.getRowByName(file4).isPresent()).toBe(false, 'Item is in trash');
                });
        });

        it('notification on multiple items deletion - some items fail to delete - [C217129]', () => {
            dataTable.selectMultipleItems([file1, folder2])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => expect(message).toContain(`Deleted 1 item, 1 couldn't be deleted`))

                .then(() => apis.user.trashcan.restore(file1Id));
        });

        it('notification on multiple items deletion - all items fail to delete - [C217130]', () => {
            dataTable.selectMultipleItems([fileLocked1, folder2])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => expect(message).toEqual(`2 items couldn't be deleted`));
        });

        it('successful delete notification shows Undo action - [C217131]', () => {
            dataTable.selectItem(file1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`Undo`);
                })

                .then(() => apis.user.trashcan.restore(file1Id));
        });

        it('unsuccessful delete notification does not show Undo action - [C217134]', () => {
            dataTable.selectItem(folder2)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).not.toContain(`Undo`);
                });
        });

        it('undo delete of file - [C217132]', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.selectItem(file1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.clickSnackBarAction())
                .then(() => {
                    expect(dataTable.getRowByName(file1).isPresent()).toBe(true, 'Item was not restored');
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                });
        });

        it('undo delete of folder with content - [C280503]', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.selectItem(folder1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.clickSnackBarAction())
                .then(() => {
                    expect(dataTable.getRowByName(folder1).isPresent()).toBe(true, 'Item was not restored');
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                })
                .then(() => dataTable.doubleClickOnRowByName(folder1))
                .then(() => {
                    expect(dataTable.getRowByName(file3).isPresent()).toBe(true, 'file from folder not restored');
                });
        });

        it('undo delete of multiple files - [C280504]', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.selectMultipleItems([file1, file2])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.clickSnackBarAction())
                .then(() => {
                    expect(dataTable.getRowByName(file1).isPresent()).toBe(true, `${file1} was not removed from list`);
                    expect(dataTable.getRowByName(file2).isPresent()).toBe(true, `${file2} was not removed from list`);
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                });
        });
    });

    describe('on Shared Files', () => {
        const sharedFile1 = `sharedFile1-${Utils.random()}.txt`; let sharedFile1Id;
        const sharedFile2 = `sharedFile2-${Utils.random()}.txt`; let sharedFile2Id;
        const sharedFile3 = `sharedFile3-${Utils.random()}.txt`; let sharedFile3Id;
        const sharedFile4 = `sharedFile4-${Utils.random()}.txt`; let sharedFile4Id;

        beforeAll(done => {
            apis.user.nodes.createFile(sharedFile1).then(resp => sharedFile1Id = resp.entry.id)
                .then(() => apis.user.nodes.createFile(sharedFile2).then(resp => sharedFile2Id = resp.entry.id))
                .then(() => apis.user.nodes.createFile(sharedFile3).then(resp => sharedFile3Id = resp.entry.id))
                .then(() => apis.user.nodes.createFile(sharedFile4).then(resp => sharedFile4Id = resp.entry.id))
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
                apis.user.nodes.deleteNodesById([sharedFile1Id, sharedFile2Id, sharedFile3Id, sharedFile4Id])
            ])
            .then(() => apis.user.search.waitForApi(username, {expect: 0}))
            .then(done);
        });

        it('delete a file and check notification - [C280316]', () => {
            dataTable.selectItem(sharedFile1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`${sharedFile1} deleted`);
                    expect(dataTable.getRowByName(sharedFile1).isPresent()).toBe(false, 'Item was not removed from list');
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => expect(dataTable.getRowByName(sharedFile1).isPresent()).toBe(true, 'Item is not in trash'))

                .then(() => apis.user.trashcan.restore(sharedFile1Id))
                .then(() => apis.user.shared.shareFilesByIds([ sharedFile1Id ]))
                .then(() => apis.user.shared.waitForApi({ expect: 4 }));
        });

        it('delete multiple files and check notification - [C280513]', () => {
            dataTable.selectMultipleItems([sharedFile2, sharedFile3])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`Deleted 2 items`);
                    expect(dataTable.getRowByName(sharedFile2).isPresent()).toBe(false, `${sharedFile2} was not removed from list`);
                    expect(dataTable.getRowByName(sharedFile3).isPresent()).toBe(false, `${sharedFile3} was not removed from list`);
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => {
                    expect(dataTable.getRowByName(sharedFile2).isPresent()).toBe(true, `${sharedFile2} is not in trash`);
                    expect(dataTable.getRowByName(sharedFile3).isPresent()).toBe(true, `${sharedFile3} is not in trash`);
                })

                .then(() => apis.user.trashcan.restore(sharedFile2Id))
                .then(() => apis.user.trashcan.restore(sharedFile3Id))
                .then(() => apis.user.shared.shareFilesByIds([ sharedFile2Id, sharedFile3Id ]))
                .then(() => apis.user.shared.waitForApi({ expect: 4 }));
        });

        it('successful delete notification shows Undo action - [C280323]', () => {
            dataTable.selectItem(sharedFile1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => expect(message).toContain(`Undo`))

                .then(() => apis.user.trashcan.restore(sharedFile1Id));
        });

        it('undo delete of file - [C280324]', () => {
            dataTable.selectItem(sharedFile2)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.clickSnackBarAction())
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => expect(dataTable.getRowByName(sharedFile2).isPresent()).toBe(false, 'Item was not restored'));
        });

        it('undo delete of multiple files - [C280514]', () => {
            dataTable.selectMultipleItems([sharedFile3, sharedFile4])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.clickSnackBarAction())
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => {
                    expect(dataTable.getRowByName(sharedFile3).isPresent()).toBe(false, `${sharedFile3} was not restored`);
                    expect(dataTable.getRowByName(sharedFile4).isPresent()).toBe(false, `${sharedFile4} was not restored`);
                });
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
            apis.user.nodes.createFile(favoriteFile1).then(resp => favoriteFile1Id = resp.entry.id)
                .then(() => apis.user.nodes.createFile(favoriteFile2).then(resp => favoriteFile2Id = resp.entry.id))
                .then(() => apis.user.nodes.createFolder(favoriteFolder1).then(resp => favoriteFolder1Id = resp.entry.id))
                .then(() => apis.user.nodes.createFolder(favoriteFolder2).then(resp => favoriteFolder2Id = resp.entry.id))
                .then(() => apis.user.nodes.createFile(favoriteFile3, favoriteFolder1Id))
                .then(() => apis.user.nodes.createFile(favoriteFile4, favoriteFolder2Id).then(resp => favoriteFile4Id = resp.entry.id))
                .then(() => apis.user.nodes.lockFile(favoriteFile4Id))

                .then(() => apis.user.nodes.createFile(favoriteFileLocked1).then(resp => favoriteFileLocked1Id = resp.entry.id))
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
            .then(() => apis.user.search.waitForApi(username, {expect: 0}))
            .then(done);
        });

        it('delete a file and check notification - [C280516]', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.selectItem(favoriteFile1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`${favoriteFile1} deleted`);
                    expect(dataTable.getRowByName(favoriteFile1).isPresent()).toBe(false, 'Item was not removed from list');
                    items--;
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => expect(dataTable.getRowByName(favoriteFile1).isPresent()).toBe(true, 'Item is not in trash'))

                .then(() => apis.user.trashcan.restore(favoriteFile1Id));
        });

        it('delete multiple files and check notification - [C280517]', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.selectMultipleItems([favoriteFile1, favoriteFile2])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`Deleted 2 items`);
                    expect(dataTable.getRowByName(favoriteFile1).isPresent()).toBe(false, `${favoriteFile1} was not removed from list`);
                    expect(dataTable.getRowByName(favoriteFile2).isPresent()).toBe(false, `${favoriteFile2} was not removed from list`);
                    items = items - 2;
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => {
                    expect(dataTable.getRowByName(favoriteFile1).isPresent()).toBe(true, `${favoriteFile1} is not in trash`);
                    expect(dataTable.getRowByName(favoriteFile2).isPresent()).toBe(true, `${favoriteFile2} is not in trash`);
                })

                .then(() => apis.user.trashcan.restore(favoriteFile1Id))
                .then(() => apis.user.trashcan.restore(favoriteFile2Id));
        });

        it('delete a folder with content - [C280518]', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });
            dataTable.selectItem(favoriteFolder1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => {
                    expect(dataTable.getRowByName(favoriteFolder1).isPresent()).toBe(false, 'Item was not removed from list');
                    items--;
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => {
                    expect(dataTable.getRowByName(favoriteFolder1).isPresent()).toBe(true, 'Item is not in trash');
                    expect(dataTable.getRowByName(favoriteFile3).isPresent()).toBe(false, 'Item is in trash');
                })

                .then(() => apis.user.trashcan.restore(favoriteFolder1Id));
        });

        it('delete a folder containing locked files - [C280519]', () => {
            dataTable.selectItem(favoriteFolder2)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`${favoriteFolder2} couldn't be deleted`);
                    expect(dataTable.getRowByName(favoriteFolder2).isPresent()).toBe(true, 'Item was removed from list');
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => {
                    expect(dataTable.getRowByName(favoriteFolder2).isPresent()).toBe(false, 'Item is in trash');
                    expect(dataTable.getRowByName(favoriteFile4).isPresent()).toBe(false, 'Item is in trash');
                });
        });

        it('notification on multiple items deletion - some items fail to delete - [C280520]', () => {
            dataTable.selectMultipleItems([favoriteFile1, favoriteFolder2])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`Deleted 1 item, 1 couldn't be deleted`);
                })

                .then(() => apis.user.trashcan.restore(favoriteFile1Id));
        });

        it('notification on multiple items deletion - all items fail to delete - [C280521]', () => {
            dataTable.selectMultipleItems([favoriteFileLocked1, favoriteFolder2])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toEqual(`2 items couldn't be deleted`);
                });
        });

        it('successful delete notification shows Undo action - [C280522]', () => {
            dataTable.selectItem(favoriteFile1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => expect(message).toContain(`Undo`))

                .then(() => apis.user.trashcan.restore(favoriteFile1Id));
        });

        it('unsuccessful delete notification does not show Undo action - [C280523]', () => {
            dataTable.selectItem(favoriteFolder2)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => expect(message).not.toContain(`Undo`));
        });

        it('undo delete of file - [C280524]', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.selectItem(favoriteFile1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.clickSnackBarAction())
                .then(() => {
                    expect(dataTable.getRowByName(favoriteFile1).isPresent()).toBe(true, 'Item was not restored');
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                });
        });

        it('undo delete of folder with content - [C280526]', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.selectItem(favoriteFolder1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.clickSnackBarAction())
                .then(() => {
                    expect(dataTable.getRowByName(favoriteFolder1).isPresent()).toBe(true, 'Item was not restored');
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                })
                .then(() => dataTable.doubleClickOnRowByName(favoriteFolder1))
                .then(() => expect(dataTable.getRowByName(favoriteFile3).isPresent()).toBe(true, 'file from folder not restored'));
        });

        it('undo delete of multiple files - [C280525]', () => {
            let items: number;
            page.dataTable.countRows().then(number => { items = number; });

            dataTable.selectMultipleItems([favoriteFile1, favoriteFile2])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.clickSnackBarAction())
                .then(() => {
                    expect(dataTable.getRowByName(favoriteFile1).isPresent()).toBe(true, `${favoriteFile1} was not removed from list`);
                    expect(dataTable.getRowByName(favoriteFile2).isPresent()).toBe(true, `${favoriteFile2} was not removed from list`);
                    expect(page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
                });
        });
    });

    // TODO: try to change search.waitForApi to wait for exact number of items
    xdescribe('on Recent Files', () => {
        const recentFile1 = `recentFile1-${Utils.random()}.txt`; let recentFile1Id;
        const recentFile2 = `recentFile2-${Utils.random()}.txt`; let recentFile2Id;
        const recentFile3 = `recentFile3-${Utils.random()}.txt`; let recentFile3Id;
        const recentFile4 = `recentFile4-${Utils.random()}.txt`; let recentFile4Id;

        beforeAll(done => {
            apis.user.nodes.createFile(recentFile1).then(resp => recentFile1Id = resp.entry.id)
                .then(() => apis.user.nodes.createFile(recentFile2).then(resp => recentFile2Id = resp.entry.id))
                .then(() => apis.user.nodes.createFile(recentFile3).then(resp => recentFile3Id = resp.entry.id))
                .then(() => apis.user.nodes.createFile(recentFile4).then(resp => recentFile4Id = resp.entry.id))
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
                apis.user.nodes.deleteNodesById([recentFile1Id, recentFile2Id, recentFile3Id, recentFile4Id])
            ])
            .then(done);
        });

        it('delete a file and check notification - [C280528]', () => {
            dataTable.selectItem(recentFile1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`${recentFile1} deleted`);
                    expect(dataTable.getRowByName(recentFile1).isPresent()).toBe(false, 'Item was not removed from list');
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => expect(dataTable.getRowByName(recentFile1).isPresent()).toBe(true, 'Item is not in trash'))

                .then(() => apis.user.trashcan.restore(recentFile1Id))
                .then(() => apis.user.search.waitForApi(username, { expect: 4 }));
        });

        it('delete multiple files and check notification - [C280529]', () => {
            dataTable.selectMultipleItems([recentFile2, recentFile3])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => {
                    expect(message).toContain(`Deleted 2 items`);
                    expect(dataTable.getRowByName(recentFile2).isPresent()).toBe(false, `${recentFile2} was not removed from list`);
                    expect(dataTable.getRowByName(recentFile3).isPresent()).toBe(false, `${recentFile3} was not removed from list`);
                })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => {
                    expect(dataTable.getRowByName(recentFile2).isPresent()).toBe(true, `${recentFile2} is not in trash`);
                    expect(dataTable.getRowByName(recentFile3).isPresent()).toBe(true, `${recentFile3} is not in trash`);
                })

                .then(() => apis.user.trashcan.restore(recentFile2Id))
                .then(() => apis.user.trashcan.restore(recentFile3Id))
                .then(() => apis.user.search.waitForApi(username, { expect: 4 }));
        });

        it('successful delete notification shows Undo action - [C280534]', () => {
            dataTable.selectItem(recentFile1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.getSnackBarMessage())
                .then(message => expect(message).toContain(`Undo`))

                .then(() => apis.user.trashcan.restore(recentFile1Id))
                .then(() => apis.user.search.waitForApi(username, { expect: 4 }));
        });

        // due to the fact that the search api is slow to update,
        // we cannot test that the restored file is displayed in the Recent Files list
        // without adding a very big browser.sleep followed by a page.refresh
        // so for the moment we're testing that the restored file is not displayed in the Trash
        it('undo delete of file - [C280536]', () => {
            dataTable.selectItem(recentFile2)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.clickSnackBarAction())
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => expect(dataTable.getRowByName(recentFile2).isPresent()).toBe(false, 'Item is in Trash'));
        });

        // due to the fact that the search api is slow to update,
        // we cannot test that the restored file is displayed in the Recent Files list
        // without adding a very big browser.sleep followed by a page.refresh
        // so for the moment we're testing that the restored file is not displayed in the Trash
        it('undo delete of multiple files - [C280537]', () => {
            dataTable.selectMultipleItems([recentFile3, recentFile4])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Delete'))
                .then(() => page.clickSnackBarAction())
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(() => {
                    expect(dataTable.getRowByName(recentFile3).isPresent()).toBe(false, `${recentFile3} is in Trash`);
                    expect(dataTable.getRowByName(recentFile4).isPresent()).toBe(false, `${recentFile4} is in Trash`);
                });
        });
    });
});
