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

    beforeAll(async (done) => {
        await apis.admin.people.createUser({ username: user1 });
        file1Id = (await apis.user.nodes.createFiles([ file1 ])).entry.id;
        file2Id = (await apis.user.nodes.createFiles([ file2 ])).entry.id;
        folder1Id = (await apis.user.nodes.createFolders([ folder1 ])).entry.id;
        folder2Id = (await apis.user.nodes.createFolders([ folder2 ])).entry.id;
        fileForDelete1Id = (await apis.user.nodes.createFiles([ fileForDelete1 ])).entry.id;
        fileForDelete2Id = (await apis.user.nodes.createFiles([ fileForDelete2 ])).entry.id;
        folderForDelete1Id = (await apis.user.nodes.createFolders([ folderForDelete1 ])).entry.id;
        folderForDelete2Id = (await apis.user.nodes.createFolders([ folderForDelete2 ])).entry.id;

        await apis.user.shared.shareFilesByIds([ file1Id, file2Id ]);
        await apis.user.shared.waitForApi({ expect: 2 });

        await apis.user.favorites.addFavoritesByIds('file', [ file1Id, file2Id ]);
        await apis.user.favorites.addFavoritesByIds('folder', [ folder1Id, folder2Id ]);
        await apis.user.favorites.waitForApi({ expect: 4 });

        await apis.user.nodes.deleteNodesById([ fileForDelete1Id, fileForDelete2Id, folderForDelete1Id, folderForDelete2Id ], false);

        done();
    });

    afterAll(async (done) => {
        await Promise.all([
            apis.user.nodes.deleteNodesById([ file1Id, file2Id, folder1Id, folder2Id ]),
            apis.user.trashcan.emptyTrash(),
            logoutPage.load()
        ]);
        done();
    });

    xit('');

    describe('Personal Files', () => {
        beforeAll(async (done) => {
            await loginPage.loginWith(user1);
            done();
        });

        beforeEach(async (done) => {
            await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
            await dataTable.waitForHeader();
            done();
        });

        afterAll(async (done) => {
            await logoutPage.load();
            done();
        });

        it('Unselect items with single click - [C280458]', async () => {
            await dataTable.selectMultipleItems([ file1, file2, folder1, folder2 ]);
            expect(await dataTable.countSelectedRows()).toEqual(4, 'incorrect selected rows number');
            await dataTable.selectItem(file1);
            expect(await dataTable.countSelectedRows()).toEqual(1, 'incorrect selected rows number');
            await dataTable.clearSelection();
        });

        it('Select / unselect selected items by CMD+click - [C217110]', async () => {
            await browser.actions().sendKeys(protractor.Key.COMMAND).perform();
            await dataTable.selectItem(file1);
            await dataTable.selectItem(file2);
            await dataTable.selectItem(folder1);
            await dataTable.selectItem(folder2);
            await browser.actions().sendKeys(protractor.Key.NULL).perform();
            expect(await dataTable.countSelectedRows()).toEqual(4, 'incorrect selected rows number');
            await browser.actions().sendKeys(protractor.Key.COMMAND).perform();
            await dataTable.selectItem(file1);
            await dataTable.selectItem(file2);
            await browser.actions().sendKeys(protractor.Key.NULL).perform();
            expect(await dataTable.countSelectedRows()).toEqual(2, 'incorrect selected rows number');
            await dataTable.clearSelection();
        });

        it('correct actions appear when multiple files are selected - [C217112]', async () => {
            await dataTable.selectMultipleItems([file1, file2]);
            expect(await toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
            expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
            expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
            const menu = await toolbar.actions.openMoreMenu();
            expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
            await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            await dataTable.clearSelection();
        });

        it('correct actions appear when multiple folders are selected - [C280459]', async () => {
            await dataTable.selectMultipleItems([folder1, folder2]);
            expect(await toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
            expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
            expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
            const menu = await toolbar.actions.openMoreMenu();
            expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
            await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            await dataTable.clearSelection();
        });

        it('correct actions appear when both files and folders are selected - [C280460]', async () => {
            await dataTable.selectMultipleItems([file1, file2, folder1, folder2]);
            expect(await toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
            expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
            expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
            const menu = await toolbar.actions.openMoreMenu();
            expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
            await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            await dataTable.clearSelection();
        });
    });

    describe('File Libraries', () => {
        beforeAll(async (done) => {
            await apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
            await apis.admin.people.createUser({ username: user2 });
            await apis.admin.sites.addSiteMember(siteName, user1, SITE_ROLES.SITE_MANAGER);
            await apis.admin.sites.addSiteMember(siteName, user2, SITE_ROLES.SITE_CONSUMER);
            await apis.admin.nodes.createFiles([ file1Admin, file2Admin ], `Sites/${siteName}/documentLibrary`);
            await apis.admin.nodes.createFolders([ folder1Admin, folder2Admin ], `Sites/${siteName}/documentLibrary`);
            done();
        });

        beforeEach(async (done) => {
            await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES);
            await dataTable.waitForHeader();
            await dataTable.doubleClickOnRowByName(siteName);
            await dataTable.waitForHeader();
            done();
        });

        afterAll(async (done) => {
            await apis.admin.sites.deleteSite(siteName);
            done();
        });

        xit('');

        describe('user is Manager', () => {
            beforeAll(async (done) => {
                await loginPage.loginWith(user1);
                done();
            });

            afterAll(async (done) => {
                await logoutPage.load();
                done();
            });

            it('correct actions appear when multiple files are selected - [C280461]', async () => {
                await dataTable.selectMultipleItems([file1Admin, file2Admin]);
                expect(await toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed for selected files');
                expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
                expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed for selected files');
                const menu = await toolbar.actions.openMoreMenu();
                expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);

                await browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform();
                await dataTable.clearSelection();
            });

            it('correct actions appear when multiple folders are selected - [C280462]', async () => {
                await dataTable.selectMultipleItems([folder1Admin, folder2Admin]);
                expect(await toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
                expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
                expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
                const menu = await toolbar.actions.openMoreMenu();
                expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);

                await browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform();
                await dataTable.clearSelection();
            });

            it('correct actions appear when both files and folders are selected - [C280463]', async () => {
                await dataTable.selectMultipleItems([file1Admin, file2Admin, folder1Admin, folder2Admin]);
                expect(await toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
                expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
                expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
                const menu = await toolbar.actions.openMoreMenu();
                expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
                expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
                expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);

                await browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform();
                await dataTable.clearSelection();
            });
        });

        describe('user is Consumer', () => {
            beforeAll(async (done) => {
                await loginPage.loginWith(user2);
                done();
            });

            afterAll(async (done) => {
                await logoutPage.load();
                done();
            });

            it('correct actions appear when multiple files are selected - [C280464]', async () => {
                await dataTable.selectMultipleItems([file1Admin, file2Admin]);
                expect(await toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed for selected files');
                expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
                expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed for selected files');
                const menu = await toolbar.actions.openMoreMenu();
                expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                expect(await menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed for selected files`);
                expect(await menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed for selected files`);
                expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);

                await browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform();
                await dataTable.clearSelection();
            });

            it('correct actions appear when multiple folders are selected - [C280465]', async () => {
                await dataTable.selectMultipleItems([folder1Admin, folder2Admin]);
                expect(await toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
                expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
                expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
                const menu = await toolbar.actions.openMoreMenu();
                expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed`);
                expect(await menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed`);
                expect(await menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed`);
                expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed`);

                await browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform();
                await dataTable.clearSelection();
            });

            it('correct actions appear when both files and folders are selected - [C280466]', async () => {
                await dataTable.selectMultipleItems([file1Admin, file2Admin, folder1Admin, folder2Admin]);
                expect(await toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
                expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
                expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
                const menu = await toolbar.actions.openMoreMenu();
                expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                expect(await menu.isMenuItemPresent('Delete')).toBe(false, `Delete is not displayed for selected files`);
                expect(await menu.isMenuItemPresent('Move')).toBe(false, `Move is not displayed for selected files`);
                expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);

                await browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform();
                await dataTable.clearSelection();
            });
        });
    });

    describe('Shared Files', () => {
        beforeAll(async (done) => {
            await loginPage.loginWith(user1);
            done();
        });

        beforeEach(async (done) => {
            await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES);
            await dataTable.waitForHeader();
            done();
        });

        afterAll(async (done) => {
            await logoutPage.load();
            done();
        });

        it('correct actions appear when multiple files are selected - [C280467]', async () => {
            await dataTable.selectMultipleItems([file1, file2]);
            expect(await toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
            expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
            expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed for selected files');
            const menu = await toolbar.actions.openMoreMenu();
            expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);

            await browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform();
            await dataTable.clearSelection();
        });
    });

    describe('Recent Files', () => {
        beforeAll(async (done) => {
            await loginPage.loginWith(user1);
            done();
        });

        beforeEach(async (done) => {
            await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES);
            await dataTable.waitForHeader();
            done();
        });

        afterAll(async (done) => {
            await logoutPage.load();
            done();
        });

        it('correct actions appear when multiple files are selected - [C280468]', async () => {
            await dataTable.selectMultipleItems([file1, file2]);
            expect(await toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
            expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
            expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
            const menu = await toolbar.actions.openMoreMenu();
            expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);

            await browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform();
            await dataTable.clearSelection();
        });
    });

    describe('Favorites', () => {
        beforeAll(async (done) => {
            await loginPage.loginWith(user1);
            done();
        });

        beforeEach(async (done) => {
            await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES);
            await dataTable.waitForHeader();
            done();
        });

        afterAll(async (done) => {
            await logoutPage.load();
            done();
        });

        it('correct actions appear when multiple files are selected - [C280469]', async () => {
            await dataTable.selectMultipleItems([file1, file2]);
            expect(await toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
            expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
            expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
            const menu = await toolbar.actions.openMoreMenu();
            expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);

            await browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform();
            await dataTable.clearSelection();
        });

        it('correct actions appear when multiple folders are selected - [C280470]', async () => {
            await dataTable.selectMultipleItems([folder1, folder2]);
            expect(await toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
            expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
            expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
            const menu = await toolbar.actions.openMoreMenu();
            expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);

            await browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform();
            await dataTable.clearSelection();
        });

        it('correct actions appear when both files and folders are selected - [C280471]', async () => {
            await dataTable.selectMultipleItems([file1, file2, folder1, folder2]);
            expect(await toolbar.actions.isButtonPresent('View')).toBe(false, 'View is displayed');
            expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
            expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
            const menu = await toolbar.actions.openMoreMenu();
            expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
            expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);

            await browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform();
            await dataTable.clearSelection();
        });
    });

    describe('Trash', () => {
        beforeAll(async (done) => {
            await loginPage.loginWith(user1);
            done();
        });

        beforeEach(async (done) => {
            await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH);
            await dataTable.waitForHeader();
            done();
        });

        afterAll(async (done) => {
            await logoutPage.load();
            done();
        });

        it('correct actions appear when multiple files are selected - [C280472]', async () => {
            await dataTable.selectMultipleItems([fileForDelete1, fileForDelete2]);
            expect(await toolbar.actions.isButtonPresent('Permanently delete'))
                .toBe(true, 'Permanently delete is displayed for selected files');
            expect(await toolbar.actions.isButtonPresent('Restore')).toBe(true, 'Restore is not displayed for selected files');
            await dataTable.clearSelection();
        });

        it('correct actions appear when multiple folders are selected - [C280473]', async () => {
            await dataTable.selectMultipleItems([folderForDelete1, folderForDelete2]);
            expect(await toolbar.actions.isButtonPresent('Permanently delete'))
                .toBe(true, 'Permanently delete is displayed for selected files');
            expect(await toolbar.actions.isButtonPresent('Restore')).toBe(true, 'Restore is not displayed for selected files');
            await dataTable.clearSelection();
        });

        it('correct actions appear when both files and folders are selected - [C280474]', async () => {
            await dataTable.selectMultipleItems([fileForDelete1, fileForDelete2, folderForDelete1, folderForDelete2]);
            expect(await toolbar.actions.isButtonPresent('Permanently delete'))
                .toBe(true, 'Permanently delete is displayed for selected files');
            expect(await toolbar.actions.isButtonPresent('Restore')).toBe(true, 'Restore is not displayed for selected files');
            await dataTable.clearSelection();
        });
    });
});
