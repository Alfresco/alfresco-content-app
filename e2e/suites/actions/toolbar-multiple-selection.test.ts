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

describe('Toolbar actions - multiple selection : ', () => {
    const user1 = `user-${Utils.random()}`;
    const user2 = `user-${Utils.random()}`;

    const file1 = `file-${Utils.random()}.txt`;
    let file1Id;
    const file2 = `file-${Utils.random()}.txt`;
    let file2Id;

    const folder1 = `folder-${Utils.random()}`;
    let folder1Id;
    const folder2 = `folder-${Utils.random()}`;
    let folder2Id;

    const fileForDelete1 = `file-${Utils.random()}.txt`; let fileForDelete1Id;
    const fileForDelete2 = `file-${Utils.random()}.txt`; let fileForDelete2Id;
    const folderForDelete1 = `folder-${Utils.random()}`; let folderForDelete1Id;
    const folderForDelete2 = `folder-${Utils.random()}`; let folderForDelete2Id;

    const siteName = `site-private-${Utils.random()}`;
    const file1Admin = `file-${Utils.random()}.txt`;
    const file2Admin = `file-${Utils.random()}.txt`;
    const folder1Admin = `folder-${Utils.random()}`;
    const folder2Admin = `folder-${Utils.random()}`;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(user1, user1)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const page = new BrowsingPage();
    const { dataTable } = page;
    const { toolbar } = page;

    beforeAll(done => {
        apis.admin.people.createUser(user1)
            .then(() => apis.user.nodes.createFiles([ file1 ]).then(resp => file1Id = resp.data.entry.id))
            .then(() => apis.user.nodes.createFiles([ file2 ]).then(resp => file2Id = resp.data.entry.id))
            .then(() => apis.user.nodes.createFolders([ folder1 ]).then(resp => folder1Id = resp.data.entry.id))
            .then(() => apis.user.nodes.createFolders([ folder2 ]).then(resp => folder2Id = resp.data.entry.id))
            .then(() => apis.user.nodes.createFiles([ fileForDelete1 ]).then(resp => fileForDelete1Id = resp.data.entry.id))
            .then(() => apis.user.nodes.createFiles([ fileForDelete2 ]).then(resp => fileForDelete2Id = resp.data.entry.id))
            .then(() => apis.user.nodes.createFolders([ folderForDelete1 ]).then(resp => folderForDelete1Id = resp.data.entry.id))
            .then(() => apis.user.nodes.createFolders([ folderForDelete2 ]).then(resp => folderForDelete2Id = resp.data.entry.id))

            .then(() => apis.user.shared.shareFileById(file1Id))
            .then(() => apis.user.shared.shareFileById(file2Id))

            .then(() => apis.user.favorites.addFavoriteById('file', file1Id))
            .then(() => apis.user.favorites.addFavoriteById('file', file2Id))
            .then(() => apis.user.favorites.addFavoriteById('folder', folder1Id))
            .then(() => apis.user.favorites.addFavoriteById('folder', folder2Id))

            .then(() => apis.user.nodes.deleteNodeById(fileForDelete1Id, false))
            .then(() => apis.user.nodes.deleteNodeById(fileForDelete2Id, false))
            .then(() => apis.user.nodes.deleteNodeById(folderForDelete1Id, false))
            .then(() => apis.user.nodes.deleteNodeById(folderForDelete2Id, false))

            .then(done);
    });

    afterAll(done => {
        Promise.all([
            apis.user.nodes.deleteNodeById(file1Id),
            apis.user.nodes.deleteNodeById(file2Id),
            apis.user.nodes.deleteNodeById(folder1Id),
            apis.user.nodes.deleteNodeById(folder2Id),

            apis.user.trashcan.permanentlyDelete(fileForDelete1Id),
            apis.user.trashcan.permanentlyDelete(fileForDelete2Id),
            apis.user.trashcan.permanentlyDelete(folderForDelete1Id),
            apis.user.trashcan.permanentlyDelete(folderForDelete2Id),

            logoutPage.load()
        ])
        .then(done);
    });

    xit('');

    describe('Personal Files', () => {
        beforeAll(done => {
            loginPage.load()
                .then(() => loginPage.loginWith(user1))
                .then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            logoutPage.load().then(done);
        });

        it('correct actions appear when multiple files are selected', () => {
            dataTable.selectMultipleItems([file1, file2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed for selected files');
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                })
                .then(() => browser.$('body').click())
                .then(() => dataTable.clearSelection());
        });

        it('correct actions appear when multiple folders are selected', () => {
            dataTable.selectMultipleItems([folder1, folder2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed for selected files');
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                })
                .then(() => browser.$('body').click())
                .then(() => dataTable.clearSelection());
        });

        it('correct actions appear when both files and folders are selected', () => {
            dataTable.selectMultipleItems([file1, file2, folder1, folder2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed for selected files');
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                })
                .then(() => browser.$('body').click())
                .then(() => dataTable.clearSelection());
        });
    });

    describe('File Libraries', () => {
        beforeAll(done => {
            apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC)
                .then(() => apis.admin.people.createUser(user2))
                .then(() => apis.admin.sites.addSiteMember(siteName, user1, SITE_ROLES.SITE_MANAGER))
                .then(() => apis.admin.sites.addSiteMember(siteName, user2, SITE_ROLES.SITE_CONSUMER))
                .then(() => apis.admin.nodes.createFiles([ file1Admin, file2Admin ], `Sites/${siteName}/documentLibrary`))
                .then(() => apis.admin.nodes.createFolders([ folder1Admin, folder2Admin ], `Sites/${siteName}/documentLibrary`))
                .then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES)
                .then(() => dataTable.waitForHeader())
                .then(() => dataTable.doubleClickOnItemName(siteName))
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            apis.admin.sites.deleteSite(siteName).then(done);
        });

        xit('');

        describe('user is Manager', () => {
            beforeAll(done => {
                loginPage.load()
                    .then(() => loginPage.loginWith(user1))
                    .then(done);
            });

            afterAll(done => {
                logoutPage.load().then(done);
            });

            it('correct actions appear when multiple files are selected', () => {
                dataTable.selectMultipleItems([file1Admin, file2Admin])
                    .then(() => {
                        expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed for selected files');
                        expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
                        expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed for selected files');
                    })
                    .then(() => toolbar.actions.openMoreMenu())
                    .then(menu => {
                        expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                    })
                    .then(() => browser.$('body').click())
                    .then(() => dataTable.clearSelection());
            });

            it('correct actions appear when multiple folders are selected', () => {
                dataTable.selectMultipleItems([folder1Admin, folder2Admin])
                    .then(() => {
                        expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed for selected files');
                        expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
                        expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed for selected files');
                    })
                    .then(() => toolbar.actions.openMoreMenu())
                    .then(menu => {
                        expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                    })
                    .then(() => browser.$('body').click())
                    .then(() => dataTable.clearSelection());
            });

            it('correct actions appear when both files and folders are selected', () => {
                dataTable.selectMultipleItems([file1Admin, file2Admin, folder1Admin, folder2Admin])
                    .then(() => {
                        expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed for selected files');
                        expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
                        expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed for selected files');
                    })
                    .then(() => toolbar.actions.openMoreMenu())
                    .then(menu => {
                        expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                    })
                    .then(() => browser.$('body').click())
                    .then(() => dataTable.clearSelection());
            });
        });

        describe('user is Consumer', () => {
            beforeAll(done => {
                loginPage.load()
                    .then(() => loginPage.loginWith(user2))
                    .then(done);
            });

            afterAll(done => {
                logoutPage.load().then(done);
            });

            it('correct actions appear when multiple files are selected', () => {
                dataTable.selectMultipleItems([file1Admin, file2Admin])
                    .then(() => {
                        expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed for selected files');
                        expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
                        expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed for selected files');
                    })
                    .then(() => toolbar.actions.openMoreMenu())
                    .then(menu => {
                        expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed for selected files`);
                        expect(menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed for selected files`);
                        expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                    })
                    .then(() => browser.$('body').click())
                    .then(() => dataTable.clearSelection());
            });

            it('correct actions appear when multiple folders are selected', () => {
                dataTable.selectMultipleItems([folder1Admin, folder2Admin])
                    .then(() => {
                        expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed for selected files');
                        expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
                        expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed for selected files');
                    })
                    .then(() => toolbar.actions.openMoreMenu())
                    .then(menu => {
                        expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed for selected files`);
                        expect(menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed for selected files`);
                        expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                    })
                    .then(() => browser.$('body').click())
                    .then(() => dataTable.clearSelection());
            });

            it('correct actions appear when both files and folders are selected', () => {
                dataTable.selectMultipleItems([file1Admin, file2Admin, folder1Admin, folder2Admin])
                    .then(() => {
                        expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed for selected files');
                        expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
                        expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed for selected files');
                    })
                    .then(() => toolbar.actions.openMoreMenu())
                    .then(menu => {
                        expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Delete')).toBe(false, `Delete is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Move')).toBe(false, `Move is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                    })
                    .then(() => browser.$('body').click())
                    .then(() => dataTable.clearSelection());
            });
        });
    });

    describe('Shared Files', () => {
        beforeAll(done => {
            loginPage.load()
                .then(() => loginPage.loginWith(user1))
                .then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            logoutPage.load().then(done);
        });

        it('correct actions appear when multiple files are selected', () => {
            dataTable.selectMultipleItems([file1, file2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed for selected files');
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                })
                .then(() => browser.$('body').click())
                .then(() => dataTable.clearSelection());
        });
    });

    describe('Recent Files', () => {
        beforeAll(done => {
            loginPage.load()
                .then(() => loginPage.loginWith(user1))
                .then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            logoutPage.load().then(done);
        });

        it('correct actions appear when multiple files are selected', () => {
            dataTable.selectMultipleItems([file1, file2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed for selected files');
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                })
                .then(() => browser.$('body').click())
                .then(() => dataTable.clearSelection());
        });
    });

    describe('Favorites', () => {
        beforeAll(done => {
            loginPage.load()
                .then(() => loginPage.loginWith(user1))
                .then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            logoutPage.load().then(done);
        });

        it('correct actions appear when multiple files are selected', () => {
            dataTable.selectMultipleItems([file1, file2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed for selected files');
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                })
                .then(() => browser.$('body').click())
                .then(() => dataTable.clearSelection());
        });

        it('correct actions appear when multiple folders are selected', () => {
            dataTable.selectMultipleItems([folder1, folder2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed for selected files');
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                })
                .then(() => browser.$('body').click())
                .then(() => dataTable.clearSelection());
        });

        it('correct actions appear when both files and folders are selected', () => {
            dataTable.selectMultipleItems([file1, file2, folder1, folder2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed for selected files');
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                })
                .then(() => browser.$('body').click())
                .then(() => dataTable.clearSelection());
        });
    });

    describe('Trash', () => {
        beforeAll(done => {
            loginPage.load()
                .then(() => loginPage.loginWith(user1))
                .then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            logoutPage.load().then(done);
        });

        it('correct actions appear when multiple files are selected', () => {
            dataTable.selectMultipleItems([fileForDelete1, fileForDelete2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('Permanently delete'))
                        .toBe(true, 'Permanently delete is displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Restore')).toBe(true, 'Restore is not displayed for selected files');
                })
                .then(() => dataTable.clearSelection());
        });

        it('correct actions appear when multiple folders are selected', () => {
            dataTable.selectMultipleItems([folderForDelete1, folderForDelete2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('Permanently delete'))
                        .toBe(true, 'Permanently delete is displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Restore')).toBe(true, 'Restore is not displayed for selected files');
                })
                .then(() => dataTable.clearSelection());
        });

        it('correct actions appear when both files and folders are selected', () => {
            dataTable.selectMultipleItems([fileForDelete1, fileForDelete2, folderForDelete1, folderForDelete2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('Permanently delete'))
                        .toBe(true, 'Permanently delete is displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Restore')).toBe(true, 'Restore is not displayed for selected files');
                })
                .then(() => dataTable.clearSelection());
        });
    });
});
