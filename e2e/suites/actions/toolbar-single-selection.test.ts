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
import { SITE_VISIBILITY, SITE_ROLES, SIDEBAR_LABELS } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Toolbar actions - single selection : ', () => {
    const username = `user-${Utils.random()}`;
    const username2 = `user-${Utils.random()}`;

    const fileUser = `file-${Utils.random()}.txt`; let fileUserId;

    const folderUser = `folder-${Utils.random()}`; let folderUserId;

    const fileForDelete = `file-${Utils.random()}.txt`; let fileForDeleteId;

    const folderForDelete = `folder-${Utils.random()}`; let folderForDeleteId;

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
    const { dataTable, toolbar } = page;

    beforeAll(done => {
        apis.admin.people.createUser(username)
            .then(() => apis.user.nodes.createFiles([ fileUser ]))
            .then(resp => fileUserId = resp.data.entry.id)
            .then(() => apis.user.nodes.createFiles([ fileForDelete ]))
            .then(resp => fileForDeleteId = resp.data.entry.id)
            .then(() => apis.user.nodes.createFolders([ folderForDelete ]))
            .then(resp => folderForDeleteId = resp.data.entry.id)
            .then(() => apis.user.nodes.createFolders([ folderUser ]))
            .then(resp => folderUserId = resp.data.entry.id)
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

    describe('General tests', () => {
        const userSite = `site-${Utils.random()}`;

        beforeAll(done => {
            apis.user.sites.createSite(userSite, SITE_VISIBILITY.PUBLIC)
                .then(() => loginPage.loginWith(username))
                .then(done);
        });

        afterAll(done => {
            Promise.all([
                apis.user.sites.deleteSite(userSite),
                logoutPage.load()
            ])
            .then(done);
        });

        xit('actions not displayed for top level of File Libraries', () => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES)
                .then(() => dataTable.waitForHeader())
                .then(() => dataTable.clickOnItemNameRow(userSite))
                .then(() => expect(toolbar.actions.isEmpty()).toBe(true, 'toolbar not empty'));
        });

        it('selected row is marked with a check circle icon', () => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES)
                .then(() => dataTable.waitForHeader())
                .then(() => dataTable.clickOnItemNameRow(fileUser))
                .then(() => expect(dataTable.hasCheckMarkIcon(fileUser)).toBe(true, 'check mark missing'));
        });

        describe('granular permissions', () => {
            const site = `site-${Utils.random()}`;
            const file1 = `file-${Utils.random()}`; let file1Id;
            const file2 = `file-${Utils.random()}`; let file2Id;

            beforeAll(done => {
                apis.admin.sites.createSite(site, SITE_VISIBILITY.PRIVATE)
                    .then(() => apis.admin.nodes.createFiles([ file1 ], `Sites/${site}/documentLibrary`)
                        .then(resp => file1Id = resp.data.entry.id))
                    .then(() => apis.admin.nodes.createFiles([ file2 ], `Sites/${site}/documentLibrary`)
                        .then(resp => file2Id = resp.data.entry.id))
                    .then(() => apis.admin.sites.addSiteMember(site, username, SITE_ROLES.SITE_CONSUMER))
                    .then(() => apis.admin.nodes.setGranularPermission(file1Id, false, username, SITE_ROLES.SITE_CONSUMER))
                    .then(() => apis.admin.nodes.setGranularPermission(file2Id, false, username, SITE_ROLES.SITE_MANAGER))

                    .then(() => apis.user.shared.shareFileById(file1Id))
                    .then(() => apis.admin.shared.shareFileById(file2Id))

                    .then(() => apis.user.shared.waitForApi({ expect: 1 }))
                    .then(() => apis.admin.shared.waitForApi({ expect: 1 }))

                    .then(() => apis.user.favorites.addFavoritesByIds('file', [file1Id, file2Id]))

                    .then(() => loginPage.loginWith(username))
                    .then(done);
            });

            afterAll(done => {
                Promise.all([
                    apis.admin.sites.deleteSite(site),
                    logoutPage.load()
                ])
                .then(done);
            });

            describe('actions update accordingly for files with different granular permissions', () => {
                it('on File Libraries', () => {
                    page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES)
                        .then(() => dataTable.waitForHeader())
                        .then(() => dataTable.doubleClickOnItemNameRow(site))
                        .then(() => dataTable.waitForHeader())
                        .then(() => dataTable.clickOnItemNameRow(file1))
                        .then(() => {
                            expect(toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${file1}`);
                            expect(toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${file1}`);
                            expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${file1}`);
                        })
                        .then(() => toolbar.actions.openMoreMenu())
                        .then(menu => {
                            expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${file1}`);
                            expect(menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed for ${file1}`);
                            expect(menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed for ${file1}`);
                            expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${file1}`);
                        })
                        .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform())
                        .then(() => dataTable.clickOnItemNameRow(file2))
                        .then(() => {
                            expect(toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${file2}`);
                            expect(toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${file2}`);
                            expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${file2}`);
                        })
                        .then(() => toolbar.actions.openMoreMenu())
                        .then(menu => {
                            expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${file2}`);
                            expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${file2}`);
                            expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${file2}`);
                            expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${file2}`);
                        })
                        .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform());
                });

                xit('on Shared Files', () => {
                    page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES)
                        .then(() => dataTable.waitForHeader())
                        .then(() => dataTable.clickOnItemNameRow(file1))
                        .then(() => {
                            expect(toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${file1}`);
                            expect(toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${file1}`);
                            expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${file1}`);
                        })
                        .then(() => toolbar.actions.openMoreMenu())
                        .then(menu => {
                            expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${file1}`);
                            expect(menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed for ${file1}`);
                            expect(menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed for ${file1}`);
                            expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${file1}`);
                        })
                        .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform())
                        .then(() => dataTable.clickOnItemNameRow(file2))
                        .then(() => {
                            expect(toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${file2}`);
                            expect(toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${file2}`);
                            expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${file2}`);
                        })
                        .then(() => toolbar.actions.openMoreMenu())
                        .then(menu => {
                            expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${file2}`);
                            expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${file2}`);
                            expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${file2}`);
                            expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${file2}`);
                        })
                        .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform());
                });

                // disabled until ACA-1184 is done
                xit('on Favorites', () => {
                    page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES)
                        .then(() => dataTable.waitForHeader())
                        .then(() => dataTable.clickOnItemNameRow(file1))
                        .then(() => {
                            expect(toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${file1}`);
                            expect(toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${file1}`);
                            expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${file1}`);
                        })
                        .then(() => toolbar.actions.openMoreMenu())
                        .then(menu => {
                            expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${file1}`);
                            expect(menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed for ${file1}`);
                            expect(menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed for ${file1}`);
                            expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${file1}`);
                        })
                        .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform())
                        .then(() => dataTable.clickOnItemNameRow(file2))
                        .then(() => {
                            expect(toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${file2}`);
                            expect(toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${file2}`);
                            expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${file2}`);
                        })
                        .then(() => toolbar.actions.openMoreMenu())
                        .then(menu => {
                            expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${file2}`);
                            expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${file2}`);
                            expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${file2}`);
                            expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${file2}`);
                        })
                        .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform());
                });
            });

            describe('correct actions are displayed when selecting multiple files with different granular permissions', () => {
                it('on File Libraries', () => {
                    page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES)
                        .then(() => dataTable.waitForHeader())
                        .then(() => dataTable.doubleClickOnItemNameRow(site))
                        .then(() => dataTable.waitForHeader())
                        .then(() => dataTable.selectMultipleItems([ file1, file2 ]))
                        .then(() => {
                            expect(toolbar.actions.isButtonPresent('View')).toBe(false, `View is displayed for selected files`);
                            expect(toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for selected files`);
                            expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for selected files`);
                        })
                        .then(() => toolbar.actions.openMoreMenu())
                        .then(menu => {
                            expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                            expect(menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed for selected files`);
                            expect(menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed for selected files`);
                            expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                        })
                        .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform());
                });

                xit('on Shared Files', () => {
                    page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES)
                        .then(() => dataTable.waitForHeader())
                        .then(() => dataTable.selectMultipleItems([ file1, file2 ]))
                        .then(() => {
                            expect(toolbar.actions.isButtonPresent('View')).toBe(false, `View is displayed for selected files`);
                            expect(toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for selected files`);
                            expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for selected files`);
                        })
                        .then(() => toolbar.actions.openMoreMenu())
                        .then(menu => {
                            expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                            expect(menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed for selected files`);
                            expect(menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed for selected files`);
                            expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                        })
                        .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform());
                });

                // disabled until ACA-1184 is done
                xit('on Favorites', () => {
                    page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES)
                        .then(() => dataTable.waitForHeader())
                        .then(() => dataTable.selectMultipleItems([ file1, file2 ]))
                        .then(() => {
                            expect(toolbar.actions.isButtonPresent('View')).toBe(false, `View is displayed for selected files`);
                            expect(toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for selected files`);
                            expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for selected files`);
                        })
                        .then(() => toolbar.actions.openMoreMenu())
                        .then(menu => {
                            expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                            expect(menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed for selected files`);
                            expect(menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed for selected files`);
                            expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                        })
                        .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform());
                });
            });

            xit('');
        });
    });

    describe('Personal Files', () => {
        beforeAll(done => {
            loginPage.loginWith(username).then(done);
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
            dataTable.clickOnItemNameRow(fileUser)
                .then(() => {
                    expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
                });
        });

        it('actions are displayed when a folder is selected', () => {
            dataTable.clickOnItemNameRow(folderUser)
                .then(() => {
                    expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${folderUser}`);
                });
        });

        it('correct actions appear when a file is selected', () => {
            dataTable.clickOnItemNameRow(fileUser)
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
                .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform());
        });

        it('correct actions appear when a folder is selected', () => {
            dataTable.clickOnItemNameRow(folderUser)
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
                .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform());
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
                .then(() => dataTable.doubleClickOnItemNameRow(siteName))
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            apis.admin.sites.deleteSite(siteName).then(done);
        });

        xit('');

        describe('user is Manager', () => {
            beforeAll(done => {
                loginPage.loginWith(username).then(done);
            });

            afterAll(done => {
                logoutPage.load().then(done);
            });

            it('actions are not displayed when no item is selected', () => {
                expect(toolbar.actions.isEmpty()).toBe(true, `actions displayed though nothing selected`);
            });

            it('actions are displayed when a file is selected', () => {
                dataTable.clickOnItemNameRow(fileAdmin)
                    .then(() => {
                        expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileAdmin}`);
                    });
            });

            it('actions are displayed when a folder is selected', () => {
                dataTable.clickOnItemNameRow(folderAdmin)
                    .then(() => {
                        expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${folderAdmin}`);
                    });
            });

            it('correct actions appear when a file is selected', () => {
                dataTable.clickOnItemNameRow(fileAdmin)
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
                    .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform());
            });

            it('correct actions appear when a folder is selected', () => {
                dataTable.clickOnItemNameRow(folderAdmin)
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
                    .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform());
            });
        });

        describe('user is Consumer', () => {
            beforeAll(done => {
                loginPage.loginWith(username2).then(done);
            });

            afterAll(done => {
                logoutPage.load().then(done);
            });

            it('actions are not displayed when no item is selected', () => {
                expect(toolbar.actions.isEmpty()).toBe(true, `actions displayed though nothing selected`);
            });

            it('actions are displayed when a file is selected', () => {
                dataTable.clickOnItemNameRow(fileAdmin)
                    .then(() => {
                        expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileAdmin}`);
                    });
            });

            it('actions are displayed when a folder is selected', () => {
                dataTable.clickOnItemNameRow(folderAdmin)
                    .then(() => {
                        expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${folderAdmin}`);
                    });
            });

            it('correct actions appear when a file is selected', () => {
                dataTable.clickOnItemNameRow(fileAdmin)
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
                    .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform());
            });

            it('correct actions appear when a folder is selected', () => {
                dataTable.clickOnItemNameRow(folderAdmin)
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
                    .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform());
            });
        });
    });

    describe('Shared Files', () => {
        beforeAll(done => {
            loginPage.loginWith(username).then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterEach(() => {
            dataTable.clearSelection();
        });

        afterAll(done => {
            logoutPage.load().then(done);
        });

        it('actions are not displayed when no item is selected', () => {
            expect(toolbar.actions.isEmpty()).toBe(true, `actions displayed though nothing selected`);
        });

        it('actions are displayed when a file is selected', () => {
            dataTable.clickOnItemNameRow(fileUser)
                .then(() => {
                    expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
                });
        });

        it('correct actions appear when a file is selected', () => {
            dataTable.clickOnItemNameRow(fileUser)
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
                .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform());
        });
    });

    describe('Recent Files', () => {
        beforeAll(done => {
            loginPage.loginWith(username).then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterEach(() => {
            dataTable.clearSelection();
        });

        afterAll(done => {
            logoutPage.load().then(done);
        });

        it('actions are not displayed when no item is selected', () => {
            expect(toolbar.actions.isEmpty()).toBe(true, `actions displayed though nothing selected`);
        });

        it('actions are displayed when a file is selected', () => {
            dataTable.clickOnItemNameRow(fileUser)
                .then(() => {
                    expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
                });
        });

        it('correct actions appear when a file is selected', () => {
            dataTable.clickOnItemNameRow(fileUser)
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
                .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform());
        });
    });

    describe('Favorites', () => {
        beforeAll(done => {
            loginPage.loginWith(username).then(done);
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
            dataTable.clickOnItemNameRow(fileUser)
                .then(() => {
                    expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
                });
        });

        it('actions are displayed when a folder is selected', () => {
            dataTable.clickOnItemNameRow(folderUser)
                .then(() => {
                    expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${folderUser}`);
                });
        });

        it('correct actions appear when a file is selected', () => {
            dataTable.clickOnItemNameRow(fileUser)
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
                .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform());
        });

        it('correct actions appear when a folder is selected', () => {
            dataTable.clickOnItemNameRow(folderUser)
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
                .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform());
        });
    });

    // [C217090]
    describe('Trash', () => {
        beforeAll(done => {
            apis.user.nodes.deleteNodeById(fileForDeleteId, false)
                .then(() => apis.user.nodes.deleteNodeById(folderForDeleteId, false))
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
            dataTable.clickOnItemNameRow(fileForDelete)
                .then(() => {
                    expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileForDelete}`);
                });
        });

        it('actions are displayed when a folder is selected', () => {
            dataTable.clickOnItemNameRow(folderForDelete)
                .then(() => {
                    expect(toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${folderForDelete}`);
                });
        });

        it('correct actions appear when a file is selected', () => {
            dataTable.clickOnItemNameRow(fileForDelete)
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('Permanently delete'))
                        .toBe(true, `Permanently delete is not displayed for ${fileForDelete}`);
                    expect(toolbar.actions.isButtonPresent('Restore')).toBe(true, `Restore is not displayed for ${fileForDelete}`);
                });
        });

        it('correct actions appear when a folder is selected', () => {
            dataTable.clickOnItemNameRow(folderForDelete)
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('Permanently delete'))
                        .toBe(true, `Permanently delete is displayed for ${folderForDelete}`);
                    expect(toolbar.actions.isButtonPresent('Restore')).toBe(true, `Restore is not enabled for ${folderForDelete}`);
                });
        });
    });
});
