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

import { browser, protractor } from 'protractor';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { SITE_VISIBILITY, SITE_ROLES, SIDEBAR_LABELS } from '../../configs';
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

            .then(() => apis.user.shared.shareFilesByIds([ file1Id, file2Id ]))
            .then(() => apis.user.shared.waitForApi({ expect: 2 }))

            .then(() => apis.user.favorites.addFavoritesByIds('file', [ file1Id, file2Id ]))
            .then(() => apis.user.favorites.addFavoritesByIds('folder', [ folder1Id, folder2Id ]))
            .then(() => apis.user.favorites.waitForApi({ expect: 4 }))

            .then(() => apis.user.nodes.deleteNodesById([
                fileForDelete1Id, fileForDelete2Id, folderForDelete1Id, folderForDelete2Id
            ], false))

            .then(done);
    });

    afterAll(done => {
        Promise.all([
            apis.user.nodes.deleteNodesById([ file1Id, file2Id, folder1Id, folder2Id ]),
            apis.user.trashcan.emptyTrash(),
            logoutPage.load()
        ])
        .then(done);
    });

    xit('');

    describe('Personal Files', () => {
        beforeAll(done => {
            loginPage.loginWith(user1).then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            logoutPage.load().then(done);
        });

        it('Unselect items with single click - [C280458]', () => {
            dataTable.selectMultipleItems([ file1, file2, folder1, folder2 ])
                .then(() => expect(dataTable.countSelectedRows()).toEqual(4, 'incorrect selected rows number'))
                .then(() => dataTable.clickOnRowByName(file1))
                .then(() => expect(dataTable.countSelectedRows()).toEqual(1, 'incorrect selected rows number'))
                .then(() => dataTable.clearSelection());
        });

        it('Select / unselect selected items by CMD+click - [C217110]', () => {
            browser.actions().sendKeys(protractor.Key.COMMAND).perform()
                .then(() => dataTable.clickOnRowByName(file1))
                .then(() => dataTable.clickOnRowByName(file2))
                .then(() => dataTable.clickOnRowByName(folder1))
                .then(() => dataTable.clickOnRowByName(folder2))
                .then(() => browser.actions().sendKeys(protractor.Key.NULL).perform())
                .then(() => expect(dataTable.countSelectedRows()).toEqual(4, 'incorrect selected rows number'))
                .then(() => browser.actions().sendKeys(protractor.Key.COMMAND).perform())
                .then(() => dataTable.clickOnRowByName(file1))
                .then(() => dataTable.clickOnRowByName(file2))
                .then(() => browser.actions().sendKeys(protractor.Key.NULL).perform())
                .then(() => expect(dataTable.countSelectedRows()).toEqual(2, 'incorrect selected rows number'))
                .then(() => dataTable.clearSelection());
        });

        it('correct actions appear when multiple files are selected - [C217112]', () => {
            dataTable.selectMultipleItems([file1, file2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                })
                .then(() => browser.actions().sendKeys(protractor.Key.ESCAPE).perform())
                .then(() => dataTable.clearSelection());
        });

        it('correct actions appear when multiple folders are selected - [C280459]', () => {
            dataTable.selectMultipleItems([folder1, folder2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                })
                .then(() => browser.actions().sendKeys(protractor.Key.ESCAPE).perform())
                .then(() => dataTable.clearSelection());
        });

        it('correct actions appear when both files and folders are selected - [C280460]', () => {
            dataTable.selectMultipleItems([file1, file2, folder1, folder2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                })
                .then(() => browser.actions().sendKeys(protractor.Key.ESCAPE).perform())
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
                .then(() => dataTable.doubleClickOnRowByName(siteName))
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            apis.admin.sites.deleteSite(siteName).then(done);
        });

        xit('');

        describe('user is Manager', () => {
            beforeAll(done => {
                loginPage.loginWith(user1).then(done);
            });

            afterAll(done => {
                logoutPage.load().then(done);
            });

            it('correct actions appear when multiple files are selected - [C280461]', () => {
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
                    // .then(() => browser.$('body').click())
                    .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform())
                    .then(() => dataTable.clearSelection());
            });

            it('correct actions appear when multiple folders are selected - [C280462]', () => {
                dataTable.selectMultipleItems([folder1Admin, folder2Admin])
                    .then(() => {
                        expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
                        expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
                        expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
                    })
                    .then(() => toolbar.actions.openMoreMenu())
                    .then(menu => {
                        expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                    })
                    // .then(() => browser.$('body').click())
                    .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform())
                    .then(() => dataTable.clearSelection());
            });

            it('correct actions appear when both files and folders are selected - [C280463]', () => {
                dataTable.selectMultipleItems([file1Admin, file2Admin, folder1Admin, folder2Admin])
                    .then(() => {
                        expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
                        expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
                        expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
                    })
                    .then(() => toolbar.actions.openMoreMenu())
                    .then(menu => {
                        expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                    })
                    // .then(() => browser.$('body').click())
                    .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform())
                    .then(() => dataTable.clearSelection());
            });
        });

        describe('user is Consumer', () => {
            beforeAll(done => {
                loginPage.loginWith(user2).then(done);
            });

            afterAll(done => {
                logoutPage.load().then(done);
            });

            it('correct actions appear when multiple files are selected - [C280464]', () => {
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
                    // .then(() => browser.$('body').click())
                    .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform())
                    .then(() => dataTable.clearSelection());
            });

            it('correct actions appear when multiple folders are selected - [C280465]', () => {
                dataTable.selectMultipleItems([folder1Admin, folder2Admin])
                    .then(() => {
                        expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
                        expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
                        expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
                    })
                    .then(() => toolbar.actions.openMoreMenu())
                    .then(menu => {
                        expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed`);
                        expect(menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed`);
                        expect(menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed`);
                        expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed`);
                    })
                    // .then(() => browser.$('body').click())
                    .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform())
                    .then(() => dataTable.clearSelection());
            });

            it('correct actions appear when both files and folders are selected - [C280466]', () => {
                dataTable.selectMultipleItems([file1Admin, file2Admin, folder1Admin, folder2Admin])
                    .then(() => {
                        expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
                        expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
                        expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
                    })
                    .then(() => toolbar.actions.openMoreMenu())
                    .then(menu => {
                        expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Delete')).toBe(false, `Delete is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Move')).toBe(false, `Move is not displayed for selected files`);
                        expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                    })
                    // .then(() => browser.$('body').click())
                    .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform())
                    .then(() => dataTable.clearSelection());
            });
        });
    });

    describe('Shared Files', () => {
        beforeAll(done => {
            loginPage.loginWith(user1).then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            logoutPage.load().then(done);
        });

        it('correct actions appear when multiple files are selected - [C280467]', () => {
            dataTable.selectMultipleItems([file1, file2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
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
                .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform())
                .then(() => dataTable.clearSelection());
        });
    });

    describe('Recent Files', () => {
        beforeAll(done => {
            loginPage.loginWith(user1).then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            logoutPage.load().then(done);
        });

        it('correct actions appear when multiple files are selected - [C280468]', () => {
            dataTable.selectMultipleItems([file1, file2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                })
                // .then(() => browser.$('body').click())
                .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform())
                .then(() => dataTable.clearSelection());
        });
    });

    describe('Favorites', () => {
        beforeAll(done => {
            loginPage.loginWith(user1).then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            logoutPage.load().then(done);
        });

        it('correct actions appear when multiple files are selected - [C280469]', () => {
            dataTable.selectMultipleItems([file1, file2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                })
                // .then(() => browser.$('body').click())
                .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform())
                .then(() => dataTable.clearSelection());
        });

        it('correct actions appear when multiple folders are selected - [C280470]', () => {
            dataTable.selectMultipleItems([folder1, folder2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                })
                // .then(() => browser.$('body').click())
                .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform())
                .then(() => dataTable.clearSelection());
        });

        it('correct actions appear when both files and folders are selected - [C280471]', () => {
            dataTable.selectMultipleItems([file1, file2, folder1, folder2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
                    expect(toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
                })
                .then(() => toolbar.actions.openMoreMenu())
                .then(menu => {
                    expect(menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                    expect(menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                })
                // .then(() => browser.$('body').click())
                .then(() => browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform())
                .then(() => dataTable.clearSelection());
        });
    });

    describe('Trash', () => {
        beforeAll(done => {
            loginPage.loginWith(user1).then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterAll(done => {
            logoutPage.load().then(done);
        });

        it('correct actions appear when multiple files are selected - [C280472]', () => {
            dataTable.selectMultipleItems([fileForDelete1, fileForDelete2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('Permanently delete'))
                        .toBe(true, 'Permanently delete is displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Restore')).toBe(true, 'Restore is not displayed for selected files');
                })
                .then(() => dataTable.clearSelection());
        });

        it('correct actions appear when multiple folders are selected - [C280473]', () => {
            dataTable.selectMultipleItems([folderForDelete1, folderForDelete2])
                .then(() => {
                    expect(toolbar.actions.isButtonPresent('Permanently delete'))
                        .toBe(true, 'Permanently delete is displayed for selected files');
                    expect(toolbar.actions.isButtonPresent('Restore')).toBe(true, 'Restore is not displayed for selected files');
                })
                .then(() => dataTable.clearSelection());
        });

        it('correct actions appear when both files and folders are selected - [C280474]', () => {
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
