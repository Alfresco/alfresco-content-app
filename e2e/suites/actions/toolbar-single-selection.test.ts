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

describe('Toolbar actions - single selection : ', () => {
    const username = `user-${Utils.random()}`;
    const username2 = `user-${Utils.random()}`;

    const fileUser = `fileUser-${Utils.random()}.txt`; let fileUserId;
    const folderUser = `folderUser-${Utils.random()}`; let folderUserId;
    const fileForDelete = `fileForDelete-${Utils.random()}.txt`; let fileForDeleteId;
    const folderForDelete = `folderForDelete-${Utils.random()}`; let folderForDeleteId;

    const siteName = `site-private-${Utils.random()}`;
    const fileAdmin = `fileAdmin-${Utils.random()}.txt`;
    const folderAdmin = `folderAdmin-${Utils.random()}`;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const page = new BrowsingPage();
    const { dataTable, toolbar } = page;

    beforeAll(async (done) => {
        await apis.admin.people.createUser({ username });

        fileUserId = (await apis.user.nodes.createFiles([fileUser])).entry.id;
        fileForDeleteId = (await apis.user.nodes.createFiles([fileForDelete])).entry.id;
        folderForDeleteId = (await apis.user.nodes.createFolders([ folderForDelete ])).entry.id;
        folderUserId = (await apis.user.nodes.createFolders([ folderUser ])).entry.id;

        await apis.user.shared.shareFileById(fileUserId);
        await apis.user.shared.waitForApi({ expect: 1 });

        await apis.user.favorites.addFavoriteById('file', fileUserId);
        await apis.user.favorites.addFavoriteById('folder', folderUserId);
        await apis.user.favorites.waitForApi({ expect: 2 });

        done();
    });

    afterAll(async (done) => {
        await Promise.all([
            apis.user.nodes.deleteNodeById(fileUserId),
            apis.user.nodes.deleteNodeById(folderUserId)
        ]);

        done();
    });

    xit('');

    describe('General tests', () => {
        const userSite = `userSite-${Utils.random()}`;

        beforeAll(async (done) => {
            await apis.user.sites.createSite(userSite, SITE_VISIBILITY.PUBLIC);
            await loginPage.loginWith(username);
            done();
        });

        afterAll(async (done) => {
            await Promise.all([
                apis.user.sites.deleteSite(userSite),
                logoutPage.load()
            ]);

            done();
        });

        it('actions not displayed for top level of File Libraries - [C213135]', async () => {
            await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES);
            await dataTable.waitForHeader();
            await dataTable.selectItem(userSite);
            expect(await toolbar.actions.isEmpty()).toBe(true, 'toolbar not empty');
        });

        it('selected row is marked with a check circle icon - [C213134]', async () => {
            await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
            await dataTable.waitForHeader();
            await dataTable.selectItem(fileUser);
            expect(await dataTable.hasCheckMarkIcon(fileUser)).toBe(true, 'check mark missing');
        });
    });

    describe('granular permissions', () => {
        const site = `site-${Utils.random()}`;
        const file1 = `file1-${Utils.random()}`; let file1Id;
        const file2 = `file2-${Utils.random()}`; let file2Id;

        beforeAll(async (done) => {
            await apis.admin.sites.createSite(site, SITE_VISIBILITY.PRIVATE);
            const docLibId = await apis.admin.sites.getDocLibId(site);

            file1Id = (await apis.admin.nodes.createFile(file1, docLibId)).entry.id;
            file2Id = (await apis.admin.nodes.createFile(file2, docLibId)).entry.id;

            await apis.admin.sites.addSiteMember(site, username, SITE_ROLES.SITE_CONSUMER);
            await apis.admin.nodes.setGranularPermission(file1Id, false, username, SITE_ROLES.SITE_CONSUMER);
            await apis.admin.nodes.setGranularPermission(file2Id, false, username, SITE_ROLES.SITE_MANAGER);

            await apis.user.shared.shareFileById(file1Id);
            await apis.admin.shared.shareFileById(file2Id);
            await apis.user.shared.waitForApi({ expect: 3 });

            await apis.user.favorites.addFavoritesByIds('file', [file1Id, file2Id]);
            await apis.user.favorites.waitForApi({ expect: 3 });

            await loginPage.loginWith(username);
            done();
        });

        afterAll(async (done) => {
            await Promise.all([
                apis.admin.sites.deleteSite(site),
                logoutPage.load()
            ]);

            done();
        });

        describe('actions update accordingly for files with different granular permissions', () => {
            beforeEach(async (done) => {
                await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
                done();
            });

            it('on File Libraries - [C280455]', async () => {
                await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES);
                await dataTable.waitForHeader();
                await dataTable.doubleClickOnRowByName(site);
                await dataTable.waitForHeader();
                await dataTable.selectItem(file1);
                expect(await toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${file1}`);
                expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${file1}`);
                expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${file1}`);

                let menu = await toolbar.actions.openMoreMenu();
                expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${file1}`);
                expect(await menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed for ${file1}`);
                expect(await menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed for ${file1}`);
                expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${file1}`);
                await toolbar.actions.closeMoreMenu();

                await dataTable.selectItem(file2);
                expect(await toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${file2}`);
                expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${file2}`);
                expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${file2}`);

                menu = await toolbar.actions.openMoreMenu();
                expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${file2}`);
                expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${file2}`);
                expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${file2}`);
                expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${file2}`);
                await toolbar.actions.closeMoreMenu();
            });

            it('on Shared Files - [C280456]', async () => {
                await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES);
                await page.dataTable.waitForHeader();
                await page.dataTable.selectItem(file1);
                expect(await toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${file1}`);
                expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${file1}`);
                expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${file1}`);
                let menu = await toolbar.actions.openMoreMenu();

                expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${file1}`);
                expect(await menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed for ${file1}`);
                expect(await menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed for ${file1}`);
                expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${file1}`);
                await toolbar.actions.closeMoreMenu();

                await page.dataTable.selectItem(file2);
                expect(await toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${file2}`);
                expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${file2}`);
                expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${file2}`);
                menu = await toolbar.actions.openMoreMenu();

                expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${file2}`);
                expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${file2}`);
                expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${file2}`);
                expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${file2}`);
                await toolbar.actions.closeMoreMenu();
            });

            // disabled until ACA-1184 is done
            xit('on Favorites - [C213121]', async () => {
                await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES);
                await dataTable.waitForHeader();
                await dataTable.selectItem(file1);
                expect(await toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${file1}`);
                expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${file1}`);
                expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${file1}`);
                let menu = await toolbar.actions.openMoreMenu();
                expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${file1}`);
                expect(await menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed for ${file1}`);
                expect(await menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed for ${file1}`);
                expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${file1}`);
                await toolbar.actions.closeMoreMenu();

                await dataTable.selectItem(file2);
                expect(await toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${file2}`);
                expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${file2}`);
                expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${file2}`);
                menu = await toolbar.actions.openMoreMenu();
                expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${file2}`);
                expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${file2}`);
                expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${file2}`);
                expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${file2}`);
                await toolbar.actions.closeMoreMenu();
            });
        });

        describe('correct actions are displayed when selecting multiple files with different granular permissions', () => {
            beforeEach(async (done) => {
                await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
                done();
            });

            it('on File Libraries - [C280476]', async () => {
                await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES);
                await dataTable.waitForHeader();
                await dataTable.doubleClickOnRowByName(site);
                await dataTable.waitForHeader();
                await dataTable.selectMultipleItems([ file1, file2 ]);
                expect(await toolbar.actions.isButtonPresent('View')).toBe(false, `View is displayed for selected files`);
                expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for selected files`);
                expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for selected files`);
                const menu = await toolbar.actions.openMoreMenu();
                expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                expect(await menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed for selected files`);
                expect(await menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed for selected files`);
                expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                await toolbar.actions.closeMoreMenu();
            });

            it('on Shared Files - [C280477]', async () => {
                await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES);
                await dataTable.waitForHeader();
                await dataTable.selectMultipleItems([ file1, file2 ]);
                expect(await toolbar.actions.isButtonPresent('View')).toBe(false, `View is displayed for selected files`);
                expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for selected files`);
                expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for selected files`);
                const menu = await toolbar.actions.openMoreMenu();
                expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                expect(await menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed for selected files`);
                expect(await menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed for selected files`);
                expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                await toolbar.actions.closeMoreMenu();
            });

            // disabled until ACA-1184 is done
            xit('on Favorites - [C280478]', async () => {
                await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES);
                await dataTable.waitForHeader();
                await dataTable.selectMultipleItems([ file1, file2 ]);
                expect(await toolbar.actions.isButtonPresent('View')).toBe(false, `View is displayed for selected files`);
                expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for selected files`);
                expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for selected files`);
                const menu = await toolbar.actions.openMoreMenu();
                expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
                expect(await menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed for selected files`);
                expect(await menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed for selected files`);
                expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
                await toolbar.actions.closeMoreMenu();
            });
        });

        xit('');
    });

    describe('Personal Files', () => {
        beforeAll(async (done) => {
            await loginPage.loginWith(username);
            done();
        });

        beforeEach(async (done) => {
            await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
            await dataTable.waitForHeader();
            done();
        });

        afterAll(async (done) => {
            await logoutPage.load();
            done();
        });

        it('actions are not displayed when no item is selected - [C213120]', async () => {
            expect(await toolbar.actions.isEmpty()).toBe(true, `actions displayed though nothing selected`);
        });

        it('correct actions appear when a file is selected - [C213122]', async () => {
            await dataTable.selectItem(fileUser);
            expect(await toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
            expect(await toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${fileUser}`);
            expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${fileUser}`);
            expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${fileUser}`);
            const menu = await toolbar.actions.openMoreMenu();
            expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileUser}`);
            expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${fileUser}`);
            expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${fileUser}`);
            expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileUser}`);
            await toolbar.actions.closeMoreMenu();
        });

        it('correct actions appear when a folder is selected - [C213123]', async () => {
            await dataTable.selectItem(folderUser);
            expect(await toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${folderUser}`);
            expect(await toolbar.actions.isButtonPresent('View')).toBe(false, `View is displayed for ${folderUser}`);
            expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not enabled for ${folderUser}`);
            expect(await toolbar.actions.isButtonPresent('Edit')).toBe(true, `Edit is not displayed for ${folderUser}`);
            const menu = await toolbar.actions.openMoreMenu();
            expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${folderUser}`);
            expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${folderUser}`);
            expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${folderUser}`);
            expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${folderUser}`);
            await toolbar.actions.closeMoreMenu();
        });
    });

    describe('File Libraries', () => {
        beforeAll(async (done) => {
            await apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
            const docLibId = await apis.admin.sites.getDocLibId(siteName);

            await apis.admin.people.createUser({ username: username2 });
            await apis.admin.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_MANAGER);
            await apis.admin.sites.addSiteMember(siteName, username2, SITE_ROLES.SITE_CONSUMER);

            await apis.admin.nodes.createFile(fileAdmin, docLibId);
            await apis.admin.nodes.createFolder(folderAdmin, docLibId);
            done();
        });

        afterAll(async (done) => {
            await apis.admin.sites.deleteSite(siteName);
            done();
        });

        xit('');

        describe('user is Manager', () => {
            beforeAll(async (done) => {
                await loginPage.loginWith(username);
                done();
            });

            beforeEach(async (done) => {
                await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
                await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES);
                await dataTable.waitForHeader();
                await dataTable.doubleClickOnRowByName(siteName);
                await dataTable.waitForHeader();
                done();
            });

            afterAll(async (done) => {
                await logoutPage.load();
                done();
            });

            it('actions are not displayed when no item is selected - [C280439]', async () => {
                expect(await toolbar.actions.isEmpty()).toBe(true, `actions displayed though nothing selected`);
            });

            it('correct actions appear when a file is selected - [C280440]', async () => {
                await dataTable.selectItem(fileAdmin);
                expect(await toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileAdmin}`);
                expect(await toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${fileAdmin}`);
                expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${fileAdmin}`);
                expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${fileAdmin}`);
                const menu = await toolbar.actions.openMoreMenu();
                expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileAdmin}`);
                expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${fileAdmin}`);
                expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${fileAdmin}`);
                expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileAdmin}`);
                await toolbar.actions.closeMoreMenu();
            });

            it('correct actions appear when a folder is selected - [C280441]', async () => {
                await dataTable.selectItem(folderAdmin);
                expect(await toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${folderAdmin}`);
                expect(await toolbar.actions.isButtonPresent('View')).toBe(false, `View is displayed for ${folderAdmin}`);
                expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not enabled for ${folderAdmin}`);
                expect(await toolbar.actions.isButtonPresent('Edit')).toBe(true, `Edit is not displayed for ${folderAdmin}`);
                const menu = await toolbar.actions.openMoreMenu();
                expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${folderAdmin}`);
                expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${folderAdmin}`);
                expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${folderAdmin}`);
                expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${folderAdmin}`);
                await toolbar.actions.closeMoreMenu();
            });
        });

        describe('user is Consumer', () => {
            beforeAll(async (done) => {
                await loginPage.loginWith(username2);
                done();
            });

            beforeEach(async (done) => {
                await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
                await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES);
                await dataTable.waitForHeader();
                await dataTable.doubleClickOnRowByName(siteName);
                await dataTable.waitForHeader();
                done();
            });

            afterAll(async (done) => {
                await logoutPage.load();
                done();
            });

            it('actions are not displayed when no item is selected - [C280442]', async () => {
                expect(await toolbar.actions.isEmpty()).toBe(true, `actions displayed though nothing selected`);
            });

            it('correct actions appear when a file is selected - [C280443]', async () => {
                await dataTable.selectItem(fileAdmin);
                expect(await toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileAdmin}`);
                expect(await toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${fileAdmin}`);
                expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${fileAdmin}`);
                expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${fileAdmin}`);
                const menu = await toolbar.actions.openMoreMenu();
                expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileAdmin}`);
                expect(await menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed for ${fileAdmin}`);
                expect(await menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed for ${fileAdmin}`);
                expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileAdmin}`);
                await toolbar.actions.closeMoreMenu();
            });

            it('correct actions appear when a folder is selected - [C280444]', async () => {
                await dataTable.selectItem(folderAdmin);
                expect(await toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${folderAdmin}`);
                expect(await toolbar.actions.isButtonPresent('View')).toBe(false, `View is displayed for ${folderAdmin}`);
                expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not enabled for ${folderAdmin}`);
                expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${folderAdmin}`);
                const menu = await toolbar.actions.openMoreMenu();
                expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${folderAdmin}`);
                expect(await menu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed for ${folderAdmin}`);
                expect(await menu.isMenuItemPresent('Move')).toBe(false, `Move is displayed for ${folderAdmin}`);
                expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${folderAdmin}`);
                await toolbar.actions.closeMoreMenu();
            });
        });
    });

    describe('Shared Files', () => {
        beforeAll(async (done) => {
            await loginPage.loginWith(username);
            done();
        });

        beforeEach(async (done) => {
            await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES);
            await page.dataTable.waitForHeader();
            done();
        });

        afterAll(async (done) => {
            await logoutPage.load();
            done();
        });

        it('actions are not displayed when no item is selected - [C280445]', async () => {
            expect(await toolbar.actions.isEmpty()).toBe(true, `actions displayed though nothing selected`);
        });

        it('correct actions appear when a file is selected - [C280446]', async () => {
            await page.dataTable.selectItem(fileUser);
            expect(await toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
            expect(await toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${fileUser}`);
            expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${fileUser}`);
            expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${fileUser}`);
            const menu = await toolbar.actions.openMoreMenu();
            expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileUser}`);
            expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${fileUser}`);
            expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${fileUser}`);
            expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileUser}`);
            await toolbar.actions.closeMoreMenu();
        });
    });

    describe('Recent Files', () => {
        beforeAll(async (done) => {
            await loginPage.loginWith(username);
            done();
        });

        beforeEach(async (done) => {
            await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES);
            await dataTable.waitForHeader();
            done();
        });

        afterAll(async (done) => {
            await logoutPage.load();
            done();
        });

        it('actions are not displayed when no item is selected - [C280447]', async () => {
            expect(await toolbar.actions.isEmpty()).toBe(true, `actions displayed though nothing selected`);
        });

        it('correct actions appear when a file is selected - [C280448]', async () => {
            await dataTable.selectItem(fileUser);
            expect(await toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
            expect(await toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${fileUser}`);
            expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${fileUser}`);
            expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${fileUser}`);
            const menu = await toolbar.actions.openMoreMenu();
            expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileUser}`);
            expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${fileUser}`);
            expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${fileUser}`);
            expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileUser}`);
            await toolbar.actions.closeMoreMenu();
        });
    });

    describe('Favorites', () => {
        beforeAll(async (done) => {
            await loginPage.loginWith(username);
            done();
        });

        beforeEach(async (done) => {
            await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES);
            await dataTable.waitForHeader();
            done();
        });

        afterAll(async (done) => {
            await logoutPage.load();
            done();
        });

        it('actions are not displayed when no item is selected - [C280449]', async () => {
            expect(await toolbar.actions.isEmpty()).toBe(true, `actions displayed though nothing selected`);
        });

        it('correct actions appear when a file is selected - [C280450]', async () => {
            await dataTable.selectItem(fileUser);
            expect(await toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileUser}`);
            expect(await toolbar.actions.isButtonPresent('View')).toBe(true, `View is not displayed for ${fileUser}`);
            expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not displayed for ${fileUser}`);
            expect(await toolbar.actions.isButtonPresent('Edit')).toBe(false, `Edit is displayed for ${fileUser}`);
            const menu = await toolbar.actions.openMoreMenu();
            expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${fileUser}`);
            expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${fileUser}`);
            expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${fileUser}`);
            expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${fileUser}`);
            await toolbar.actions.closeMoreMenu();
        });

        it('correct actions appear when a folder is selected - [C280451]', async () => {
            await dataTable.selectItem(folderUser);
            expect(await toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${folderUser}`);
            expect(await toolbar.actions.isButtonPresent('View')).toBe(false, `View is displayed for ${folderUser}`);
            expect(await toolbar.actions.isButtonPresent('Download')).toBe(true, `Download is not enabled for ${folderUser}`);
            expect(await toolbar.actions.isButtonPresent('Edit')).toBe(true, `Edit is not displayed for ${folderUser}`);
            const menu = await toolbar.actions.openMoreMenu();
            expect(await menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for ${folderUser}`);
            expect(await menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for ${folderUser}`);
            expect(await menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for ${folderUser}`);
            expect(await menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for ${folderUser}`);
            await toolbar.actions.closeMoreMenu();
        });
    });

    describe('Trash', () => {
        beforeAll(async (done) => {
            await apis.user.nodes.deleteNodeById(fileForDeleteId, false);
            await apis.user.nodes.deleteNodeById(folderForDeleteId, false);
            await loginPage.loginWith(username);
            done();
        });

        beforeEach(async (done) => {
            await browser.actions().sendKeys(protractor.Key.ESCAPE);
            await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH);
            await dataTable.waitForHeader();
            done();
        });

        afterAll(async (done) => {
            await Promise.all([
                apis.user.trashcan.permanentlyDelete(fileForDeleteId),
                apis.user.trashcan.permanentlyDelete(folderForDeleteId),
                logoutPage.load()
            ]);
            done();
        });

        it('actions are not displayed when no item is selected - [C280452]', async () => {
            expect(await toolbar.actions.isEmpty()).toBe(true, `actions displayed though nothing selected`);
        });

        it('correct actions appear when a file is selected - [C280453]', async () => {
            await dataTable.selectItem(fileForDelete);
            expect(await toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${fileForDelete}`);
            expect(await toolbar.actions.isButtonPresent('Permanently delete')).toBe(true, `Permanently delete is not displayed for file`);
            expect(await toolbar.actions.isButtonPresent('Restore')).toBe(true, `Restore is not displayed for file`);
        });

        it('correct actions appear when a folder is selected - [C280454]', async () => {
            await dataTable.selectItem(folderForDelete);
            expect(await toolbar.actions.isEmpty()).toBe(false, `actions not displayed for ${folderForDelete}`);
            expect(await toolbar.actions.isButtonPresent('Permanently delete')).toBe(true, `Permanently delete is displayed for folder`);
            expect(await toolbar.actions.isButtonPresent('Restore')).toBe(true, `Restore is not enabled for folder`);
        });
    });
});
