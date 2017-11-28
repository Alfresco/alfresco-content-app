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

describe('Toolbar actions - single selection : ', () => {
    const username = `user-${Utils.random()}`;
    const username2 = `user-${Utils.random()}`;

    const fileUser = `file-${Utils.random()}.txt`;
    let fileUserId;

    const folderUser = `folder-${Utils.random()}`;
    let folderUserId;

    const fileForDelete = `file-${Utils.random()}.txt`;
    let fileForDeleteId;

    const folderForDelete = `folder-${Utils.random()}`;
    let folderForDeleteId;

    const siteName = `site-private-${Utils.random()}`;
    const fileAdmin = `file-${Utils.random()}.txt`;
    const folderAdmin = `folder-${Utils.random()}`;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const page = new BrowsingPage();
    const { dataTable } = page;
    const { toolbar } = page;

    beforeAll(done => {
        apis.admin.people.createUser(username)
            .then(() => apis.user.nodes.createFiles([ fileUser ]).then(resp => { fileUserId = resp.data.entry.id; }))
            .then(() => apis.user.nodes.createFiles([ fileForDelete ]).then(resp => { fileForDeleteId = resp.data.entry.id; }))
            .then(() => apis.user.nodes.createFolders([ folderForDelete ]).then((resp) => { folderForDeleteId = resp.data.entry.id; }))
            .then(() => apis.user.nodes.createFolders([ folderUser ]).then(resp => { folderUserId = resp.data.entry.id; }))
            .then(() => apis.user.shared.shareFileById(fileUserId))
            .then(() => apis.user.favorites.addFavoriteById('file', fileUserId))
            .then(() => apis.user.favorites.addFavoriteById('folder', folderUserId))
            .then(done);
    });

    afterAll(done => {
        Promise.all([
            apis.user.nodes.deleteNodeById(fileUserId),
            apis.user.nodes.deleteNodeById(folderUserId),
            logoutPage.load()
        ])
        .then(done);
    });

    xit('');

    describe('Personal Files', () => {
        beforeAll(done => {
            loginPage.load()
                .then(() => loginPage.loginWith(username))
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

        it('actions are not displayed when no item is selected', () => {
            expect(toolbar.actions.isEmpty()).toBe(true, `actions displayed though nothing selected`);
        });

        it('actions are displayed when a file is selected', () => {
            dataTable.clickOnItemName(fileUser)
                .then(() => {
                    expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
                });
        });

        it('actions are displayed when a folder is selected', () => {
            dataTable.clickOnItemName(folderUser)
                .then(() => {
                    expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${folderUser}`);
                });
        });

        it('correct actions appear when a file is selected', () => {
            dataTable.clickOnItemName(fileUser)
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${fileUser}`);
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${fileUser}`);
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${fileUser}`);
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileUser}`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${fileUser}`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${fileUser}`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileUser}`);
                })
                .then(() => browser.$('body').click());
        });

        it('correct actions appear when a folder is selected', () => {
            dataTable.clickOnItemName(folderUser)
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(false, `View is displayed for ${folderUser}`);
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not enabled for ${folderUser}`);
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(true, `Edit is not displayed for ${folderUser}`);
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${folderUser}`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${folderUser}`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${folderUser}`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${folderUser}`);
                })
                .then(() => browser.$('body').click());
        });
    });

    describe('File Libraries', () => {
        beforeAll(done => {
            apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC)
                .then(() => apis.admin.people.createUser(username2))
                .then(() => apis.admin.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_MANAGER))
                .then(() => apis.admin.sites.addSiteMember(siteName, username2, SITE_ROLES.SITE_CONSUMER))
                .then(() => apis.admin.nodes.createFiles([ fileAdmin ], `Sites/${siteName}/documentLibrary`))
                .then(() => apis.admin.nodes.createFolders([ folderAdmin ], `Sites/${siteName}/documentLibrary`))
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
                    .then(() => loginPage.loginWith(username))
                    .then(done);
            });

            afterAll(done => {
                logoutPage.load().then(done);
            });

            it('actions are not displayed when no item is selected', () => {
                expect(toolbar.actions.isEmpty()).toBe(true, `actions displayed though nothing selected`);
            });

            it('actions are displayed when a file is selected', () => {
                dataTable.clickOnItemName(fileAdmin)
                    .then(() => {
                        expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileAdmin}`);
                    });
            });

            it('actions are displayed when a folder is selected', () => {
                dataTable.clickOnItemName(folderAdmin)
                    .then(() => {
                        expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${folderAdmin}`);
                    });
            });

            it('correct actions appear when a file is selected', () => {
                dataTable.clickOnItemName(fileAdmin)
                    .then(() => {
                        expect(toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${fileAdmin}`);
                        expect(toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${fileAdmin}`);
                        expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${fileAdmin}`);
                    })
                    .then(() => toolbar.actions.openMoreMenu())
                    .then(menu => {
                        expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileAdmin}`);
                        expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${fileAdmin}`);
                        expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${fileAdmin}`);
                        expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileAdmin}`);
                    })
                    .then(() => browser.$('body').click());
            });

            it('correct actions appear when a folder is selected', () => {
                dataTable.clickOnItemName(folderAdmin)
                    .then(() => {
                        expect(toolbar.actions.isButtonPresent('View')).toBe(false, `View is displayed for ${folderAdmin}`);
                        expect(toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not enabled for ${folderAdmin}`);
                        expect(toolbar.actions.isButtonPresent('Edit')).toBe(true, `Edit is not displayed for ${folderAdmin}`);
                    })
                    .then(() => toolbar.actions.openMoreMenu())
                    .then(menu => {
                        expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${folderAdmin}`);
                        expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${folderAdmin}`);
                        expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${folderAdmin}`);
                        expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${folderAdmin}`);
                    })
                    .then(() => browser.$('body').click());
            });
        });

        describe('user is Consumer', () => {
            beforeAll(done => {
                loginPage.load()
                    .then(() => loginPage.loginWith(username2))
                    .then(done);
            });

            afterAll(done => {
                logoutPage.load().then(done);
            });

            it('actions are not displayed when no item is selected', () => {
                expect(toolbar.actions.isEmpty()).toBe(true, `actions displayed though nothing selected`);
            });

            it('actions are displayed when a file is selected', () => {
                dataTable.clickOnItemName(fileAdmin)
                    .then(() => {
                        expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileAdmin}`);
                    });
            });

            it('actions are displayed when a folder is selected', () => {
                dataTable.clickOnItemName(folderAdmin)
                    .then(() => {
                        expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${folderAdmin}`);
                    });
            });

            it('correct actions appear when a file is selected', () => {
                dataTable.clickOnItemName(fileAdmin)
                    .then(() => {
                        expect(toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${fileAdmin}`);
                        expect(toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${fileAdmin}`);
                        expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${fileAdmin}`);
                    })
                    .then(() => toolbar.actions.openMoreMenu())
                    .then(menu => {
                        expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileAdmin}`);
                        expect(menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed for ${fileAdmin}`);
                        expect(menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed for ${fileAdmin}`);
                        expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileAdmin}`);
                    })
                    .then(() => browser.$('body').click());
            });

            it('correct actions appear when a folder is selected', () => {
                dataTable.clickOnItemName(folderAdmin)
                    .then(() => {
                        expect(toolbar.actions.isButtonPresent('View')).toBe(false, `View is displayed for ${folderAdmin}`);
                        expect(toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not enabled for ${folderAdmin}`);
                        expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${folderAdmin}`);
                    })
                    .then(() => toolbar.actions.openMoreMenu())
                    .then(menu => {
                        expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${folderAdmin}`);
                        expect(menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed for ${folderAdmin}`);
                        expect(menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed for ${folderAdmin}`);
                        expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${folderAdmin}`);
                    })
                    .then(() => browser.$('body').click());
            });
        });
    });

    describe('Shared Files', () => {
        beforeAll(done => {
            loginPage.load()
                .then(() => loginPage.loginWith(username))
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

        it('actions are not displayed when no item is selected', () => {
            expect(toolbar.actions.isEmpty()).toBe(true, `actions displayed though nothing selected`);
        });

        it('actions are displayed when a file is selected', () => {
            dataTable.clickOnItemName(fileUser)
                .then(() => {
                    expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
                });
        });

        it('correct actions appear when a file is selected', () => {
            dataTable.clickOnItemName(fileUser)
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${fileUser}`);
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${fileUser}`);
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${fileUser}`);
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileUser}`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${fileUser}`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${fileUser}`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileUser}`);
                })
                .then(() => browser.$('body').click());
        });
    });

    describe('Recent Files', () => {
        beforeAll(done => {
            loginPage.load()
                .then(() => loginPage.loginWith(username))
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

        it('actions are not displayed when no item is selected', () => {
            expect(toolbar.actions.isEmpty()).toBe(true, `actions displayed though nothing selected`);
        });

        it('actions are displayed when a file is selected', () => {
            dataTable.clickOnItemName(fileUser)
                .then(() => {
                    expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
                });
        });

        it('correct actions appear when a file is selected', () => {
            dataTable.clickOnItemName(fileUser)
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${fileUser}`);
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${fileUser}`);
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${fileUser}`);
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileUser}`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${fileUser}`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${fileUser}`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileUser}`);
                })
                .then(() => browser.$('body').click());
        });
    });

    describe('Favorites', () => {
        beforeAll(done => {
            loginPage.load()
                .then(() => loginPage.loginWith(username))
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

        it('actions are not displayed when no item is selected', () => {
            expect(toolbar.actions.isEmpty()).toBe(true, `actions displayed though nothing selected`);
        });

        it('actions are displayed when a file is selected', () => {
            dataTable.clickOnItemName(fileUser)
                .then(() => {
                    expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
                });
        });

        it('actions are displayed when a folder is selected', () => {
            dataTable.clickOnItemName(folderUser)
                .then(() => {
                    expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${folderUser}`);
                });
        });

        it('correct actions appear when a file is selected', () => {
            dataTable.clickOnItemName(fileUser)
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${fileUser}`);
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${fileUser}`);
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${fileUser}`);
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileUser}`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${fileUser}`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${fileUser}`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileUser}`);
                })
                .then(() => browser.$('body').click());
        });

        it('correct actions appear when a folder is selected', () => {
            dataTable.clickOnItemName(folderUser)
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(false, `View is displayed for ${folderUser}`);
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not enabled for ${folderUser}`);
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(true, `Edit is not displayed for ${folderUser}`);
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${folderUser}`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${folderUser}`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${folderUser}`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${folderUser}`);
                })
                .then(() => browser.$('body').click());
        });
    });

    describe('Trash', () => {
        beforeAll(done => {
            apis.user.nodes.deleteNodeById(fileForDeleteId, false)
                .then(() => apis.user.nodes.deleteNodeById(folderForDeleteId, false))
                .then(() => loginPage.load())
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
                apis.user.trashcan.permanentlyDelete(fileForDeleteId),
                apis.user.trashcan.permanentlyDelete(folderForDeleteId),
                logoutPage.load()
            ])
            .then(done);
        });

        it('actions are not displayed when no item is selected', () => {
            expect(toolbar.actions.isEmpty()).toBe(true, `actions displayed though nothing selected`);
        });

        it('actions are displayed when a file is selected', () => {
            dataTable.clickOnItemName(fileForDelete)
                .then(() => {
                    expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileForDelete}`);
                });
        });

        it('actions are displayed when a folder is selected', () => {
            dataTable.clickOnItemName(folderForDelete)
                .then(() => {
                    expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${folderForDelete}`);
                });
        });

        it('correct actions appear when a file is selected', () => {
            dataTable.clickOnItemName(fileForDelete)
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('Permanently delete'))
                        .toBe(true, `Permanently delete is not displayed for ${fileForDelete}`);
                    expect(toolbar.actions.isButtonPresent('Restore')).toBe(true, `Restore is not displayed for ${fileForDelete}`);
                });
        });

        it('correct actions appear when a folder is selected', () => {
            dataTable.clickOnItemName(folderForDelete)
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('Permanently delete'))
                        .toBe(true, `Permanently delete is displayed for ${folderForDelete}`);
                    expect(toolbar.actions.isButtonPresent('Restore')).toBe(true, `Restore is not enabled for ${folderForDelete}`);
                });
        });
    });
});
