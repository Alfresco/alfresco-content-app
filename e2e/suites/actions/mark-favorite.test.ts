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

import { LoginPage, BrowsingPage } from '../../pages/pages';
import { SITE_VISIBILITY, SITE_ROLES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Mark items as favorites', () => {
    const username = `user-${Utils.random()}`;

    const file1NotFav = `file1-${Utils.random()}.txt`;
    const file2NotFav = `file2-${Utils.random()}.txt`;
    const file3Fav = `file3-${Utils.random()}.txt`;
    const file4Fav = `file4-${Utils.random()}.txt`;
    const folder1 = `folder-${Utils.random()}`;

    const siteName = `site-public-${Utils.random()}`;
    const fileSiteNotFav1 = `file1-site-${Utils.random()}.txt`;
    const fileSiteNotFav2 = `file2-site-${Utils.random()}.txt`;
    const folderSite = `folder-site-${Utils.random()}`;
    const fileSiteFav1 = `file3-${Utils.random()}.txt`;
    const fileSiteFav2 = `file4-${Utils.random()}.txt`;

    let file1Id, file2Id, file3Id, file4Id, folder1Id, fileSiteNotFav1Id, fileSiteNotFav2Id, folderSiteId, fileSiteFav1Id, fileSiteFav2Id;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const loginPage = new LoginPage();
    const page = new BrowsingPage();
    const { dataTable, toolbar } = page;

    beforeAll(async (done) => {
        await apis.admin.people.createUser({ username });
        file1Id = (await apis.user.nodes.createFile(file1NotFav)).entry.id;
        file2Id = (await apis.user.nodes.createFile(file2NotFav)).entry.id;
        file3Id = (await apis.user.nodes.createFile(file3Fav)).entry.id;
        file4Id = (await apis.user.nodes.createFile(file4Fav)).entry.id;
        folder1Id = (await apis.user.nodes.createFolder(folder1)).entry.id;

        await apis.user.favorites.addFavoriteById('file', file3Id);
        await apis.user.favorites.addFavoriteById('file', file4Id);

        await apis.user.shared.shareFilesByIds([ file1Id, file2Id, file3Id, file4Id ]);

        await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
        const docLibId = await apis.user.sites.getDocLibId(siteName);
        folderSiteId = (await apis.user.nodes.createFolder(folderSite, docLibId)).entry.id;
        fileSiteNotFav1Id = (await apis.user.nodes.createFile(fileSiteNotFav1, folderSiteId)).entry.id;
        fileSiteFav1Id = (await apis.user.nodes.createFile(fileSiteFav1, folderSiteId)).entry.id;
        fileSiteNotFav2Id = (await apis.user.nodes.createFile(fileSiteNotFav2, folderSiteId)).entry.id;
        fileSiteFav2Id = (await apis.user.nodes.createFile(fileSiteFav2, folderSiteId)).entry.id;
        await apis.user.favorites.addFavoriteById('file', fileSiteFav1Id);
        await apis.user.favorites.addFavoriteById('file', fileSiteFav2Id);

        await apis.user.favorites.waitForApi({ expect: 5 });
        await apis.user.search.waitForApi(username, { expect: 8 });
        await apis.user.shared.waitForApi({ expect: 4 });

        await loginPage.loginWith(username);
        done();
    });

    afterAll(async (done) => {
        await Promise.all([
            apis.user.nodes.deleteNodesById([ file1Id, file2Id, file3Id, file4Id, folder1Id]),
            apis.user.sites.deleteSite(siteName)
        ]);
        done();
    });

    xit('');

    describe('on Personal Files', () => {
        beforeEach(async (done) => {
            await Utils.pressEscape();
            await page.clickPersonalFilesAndWait();
            done();
        });

        it('Favorite action has empty star icon for an item not marked as favorite - [C217186]', async () => {
            await dataTable.selectItem(file1NotFav);
            await toolbar.openMoreMenu();
            expect(await toolbar.menu.getItemIconText('Favorite')).toEqual('star_border');
        });

        it('Favorite action has empty star icon for multiple selection of items when some are not favorite - [C217187]', async () => {
            await dataTable.selectMultipleItems([ file1NotFav, file3Fav ]);
            await toolbar.openMoreMenu();
            expect(await toolbar.menu.getItemIconText('Favorite')).toEqual('star_border');
        });

        it('Favorite action has full star icon for items marked as favorite - [C217188]', async () => {
            await dataTable.selectItem(file3Fav);
            await toolbar.openMoreMenu();
            expect(await toolbar.menu.getItemIconText('Favorite')).toEqual('star');
        });

        it('favorite a file - [C217189]', async () => {
            await dataTable.selectItem(file1NotFav);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 6 });
            const isFavorite = await apis.user.favorites.isFavorite(file1Id);
            expect(isFavorite).toBe(true, `${file1NotFav} not marked as favorite`);

            await apis.user.favorites.removeFavoriteById(file1Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });

        it('favorite a folder - [C280390]', async () => {
            await dataTable.selectItem(folder1);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 6 });
            const isFavorite = await apis.user.favorites.isFavorite(folder1Id);
            expect(isFavorite).toBe(true, `${folder1} not marked as favorite`);

            await apis.user.favorites.removeFavoriteById(folder1Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });

        it('unfavorite an item - [C217190]', async () => {
            await dataTable.selectItem(file3Fav);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 4 });
            const isFavorite = await apis.user.favorites.isFavorite(file3Id);
            expect(isFavorite).toBe(false, `${file3Fav} is marked as favorite`);

            await apis.user.favorites.addFavoriteById('file', file3Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });

        it('favorite multiple items - all unfavorite - [C217192]', async () => {
            await dataTable.selectMultipleItems([ file1NotFav, file2NotFav ]);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 7 });
            const isFile1Fav = await apis.user.favorites.isFavorite(file1Id);
            const isFile2Fav = await apis.user.favorites.isFavorite(file2Id);
            expect(isFile1Fav).toBe(true, 'item not marked as favorite');
            expect(isFile2Fav).toBe(true, 'item not marked as favorite');

            await apis.user.favorites.removeFavoriteById(file1Id);
            await apis.user.favorites.removeFavoriteById(file2Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });

        it('favorite multiple items - some favorite and some unfavorite - [C217194]', async () => {
            await dataTable.selectMultipleItems([ file1NotFav, file3Fav ]);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 6 });
            const isFile1Fav = await apis.user.favorites.isFavorite(file1Id);
            const isFile2Fav = await apis.user.favorites.isFavorite(file3Id);
            expect(isFile1Fav).toBe(true, 'item not marked as favorite');
            expect(isFile2Fav).toBe(true, 'item not marked as favorite');

            await apis.user.favorites.removeFavoriteById(file1Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });

        it('unfavorite multiple items - [C217193]', async () => {
            await dataTable.selectMultipleItems([ file3Fav, file4Fav ])
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 3 });
            const isFile1Fav = await apis.user.favorites.isFavorite(file3Id);
            const isFile2Fav = await apis.user.favorites.isFavorite(file4Id);
            expect(isFile1Fav).toBe(false, 'item marked as favorite');
            expect(isFile2Fav).toBe(false, 'item marked as favorite');

            await apis.user.favorites.addFavoriteById('file', file3Id);
            await apis.user.favorites.addFavoriteById('file', file4Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });
    });

    describe('on Recent Files', () => {
        beforeEach(async (done) => {
            await Utils.pressEscape();
            await page.clickRecentFilesAndWait();
            done();
        });

        it('favorite a file - [C280352]', async () => {
            await dataTable.selectItem(file1NotFav);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 6 });
            const isFavorite = await apis.user.favorites.isFavorite(file1Id);
            expect(isFavorite).toBe(true, `${file1NotFav} not marked as favorite`);

            await apis.user.favorites.removeFavoriteById(file1Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });

        it('unfavorite an item - [C280353]', async () => {
            await dataTable.selectItem(file3Fav);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 4 });
            const isFavorite = await apis.user.favorites.isFavorite(file3Id);
            expect(isFavorite).toBe(false, `${file3Fav} is marked as favorite`);

            await apis.user.favorites.addFavoriteById('file', file3Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });

        it('favorite multiple items - all unfavorite - [C280355]', async () => {
            await dataTable.selectMultipleItems([ file1NotFav, file2NotFav ]);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 7 });
            const isFile1Fav = await apis.user.favorites.isFavorite(file1Id);
            const isFile2Fav = await apis.user.favorites.isFavorite(file2Id);
            expect(isFile1Fav).toBe(true, 'item not marked as favorite');
            expect(isFile2Fav).toBe(true, 'item not marked as favorite');

            await apis.user.favorites.removeFavoriteById(file1Id);
            await apis.user.favorites.removeFavoriteById(file2Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });

        it('favorite multiple items - some favorite and some unfavorite - [C280357]', async () => {
            await dataTable.selectMultipleItems([ file1NotFav, file3Fav ]);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 6 });
            const isFile1Fav = await apis.user.favorites.isFavorite(file1Id);
            const isFile2Fav = await apis.user.favorites.isFavorite(file3Id);
            expect(isFile1Fav).toBe(true, 'item not marked as favorite');
            expect(isFile2Fav).toBe(true, 'item not marked as favorite');

            await apis.user.favorites.removeFavoriteById(file1Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });

        it('unfavorite multiple items - [C280356]', async () => {
            await dataTable.selectMultipleItems([ file3Fav, file4Fav ]);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 3 });
            const isFile1Fav = await apis.user.favorites.isFavorite(file3Id);
            const isFile2Fav = await apis.user.favorites.isFavorite(file4Id);
            expect(isFile1Fav).toBe(false, 'item marked as favorite');
            expect(isFile2Fav).toBe(false, 'item marked as favorite');

            await apis.user.favorites.addFavoriteById('file', file3Id);
            await apis.user.favorites.addFavoriteById('file', file4Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });
    });

    describe('on Shared Files', () => {
        beforeAll(async (done) => {
          await page.refresh();
          done();
        });

        beforeEach(async (done) => {
            await Utils.pressEscape();
            await page.clickSharedFilesAndWait();
            done();
        });

        it('favorite a file - [C280362]', async () => {
            await dataTable.selectItem(file1NotFav);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 6 });
            const isFavorite = await apis.user.favorites.isFavorite(file1Id);
            expect(isFavorite).toBe(true, `${file1NotFav} not marked as favorite`);

            await apis.user.favorites.removeFavoriteById(file1Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });

        it('unfavorite an item - [C280363]', async () => {
            await dataTable.selectItem(file3Fav);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 4 });
            const isFavorite = await apis.user.favorites.isFavorite(file3Id);
            expect(isFavorite).toBe(false, `${file3Fav} is marked as favorite`);

            await apis.user.favorites.addFavoriteById('file', file3Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });

        it('favorite multiple items - all unfavorite - [C280365]', async () => {
            await dataTable.selectMultipleItems([ file1NotFav, file2NotFav ]);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 7 });
            const isFile1Fav = await apis.user.favorites.isFavorite(file1Id);
            const isFile2Fav = await apis.user.favorites.isFavorite(file2Id);
            expect(isFile1Fav).toBe(true, 'item not marked as favorite');
            expect(isFile2Fav).toBe(true, 'item not marked as favorite');

            await apis.user.favorites.removeFavoriteById(file1Id);
            await apis.user.favorites.removeFavoriteById(file2Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });

        it('favorite multiple items - some favorite and some unfavorite - [C280367]', async () => {
            await dataTable.selectMultipleItems([ file1NotFav, file3Fav ]);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 6 });
            const isFile1Fav = await apis.user.favorites.isFavorite(file1Id);
            const isFile2Fav = await apis.user.favorites.isFavorite(file3Id);
            expect(isFile1Fav).toBe(true, 'item not marked as favorite');
            expect(isFile2Fav).toBe(true, 'item not marked as favorite');

            await apis.user.favorites.removeFavoriteById(file1Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });

        it('unfavorite multiple items - [C280366]', async () => {
            await dataTable.selectMultipleItems([ file3Fav, file4Fav ]);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 3 });
            const isFile1Fav = await apis.user.favorites.isFavorite(file3Id);
            const isFile2Fav = await apis.user.favorites.isFavorite(file4Id);
            expect(isFile1Fav).toBe(false, 'item marked as favorite');
            expect(isFile2Fav).toBe(false, 'item marked as favorite');

            await apis.user.favorites.addFavoriteById('file', file3Id);
            await apis.user.favorites.addFavoriteById('file', file4Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });
    });

    describe('on Favorites', () => {
        beforeEach(async (done) => {
            await Utils.pressEscape();
            await page.refresh();
            await page.clickFavoritesAndWait();
            done();
        });

        it('unfavorite an item - [C280368]', async () => {
            await dataTable.selectItem(file3Fav);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 4 });
            const isFavorite = await apis.user.favorites.isFavorite(file3Id);
            expect(isFavorite).toBe(false, 'item is marked as favorite');
            expect(await dataTable.getRowByName(file3Fav).isPresent()).toBe(false, 'item still displayed');

            await apis.user.favorites.addFavoriteById('file', file3Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });

        it('unfavorite multiple items - [C280374]', async () => {
            await dataTable.selectMultipleItems([ file3Fav, file4Fav ]);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 3 });
            const isFavorite3 = await apis.user.favorites.isFavorite(file3Id);
            const isFavorite4 = await apis.user.favorites.isFavorite(file4Id);
            expect(isFavorite3).toBe(false, 'file3 marked as favorite');
            expect(isFavorite4).toBe(false, 'file4 marked as favorite');
            expect(await dataTable.getRowByName(file3Fav).isPresent()).toBe(false, 'file3 still displayed');
            expect(await dataTable.getRowByName(file4Fav).isPresent()).toBe(false, 'file4 still displayed');

            await apis.user.favorites.addFavoriteById('file', file3Id);
            await apis.user.favorites.addFavoriteById('file', file4Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });

        it('Favorite action has full star icon for items marked as favorite - [C280371]', async () => {
            await dataTable.selectItem(file3Fav);
            await toolbar.openMoreMenu();
            expect(await toolbar.menu.getItemIconText('Favorite')).toEqual('star');
        });
    });

    describe ('on File Libraries', () => {
        beforeEach(async (done) => {
            await Utils.pressEscape();
            await page.clickFileLibrariesAndWait();
            await page.dataTable.doubleClickOnRowByName(siteName);
            await page.dataTable.waitForHeader();
            done();
        });

        it('Favorite a folder - [C280391]', async  () => {
            await dataTable.selectItem(folderSite);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 6 });
            const isFavorite = await apis.user.favorites.isFavorite(folderSiteId);
            expect(isFavorite).toBe(true, `${folderSite} not marked as favorite`);
            await apis.user.favorites.removeFavoriteById(folderSiteId);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });

        it('Favorite a file - [C280342]', async () => {
            await page.dataTable.doubleClickOnRowByName(folderSite);
            await dataTable.selectItem(fileSiteNotFav1);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 6 });
            const isFavorite = await apis.user.favorites.isFavorite(fileSiteNotFav1Id);
            expect(isFavorite).toBe(true, `${fileSiteNotFav1} not marked as favorite`);
            await apis.user.favorites.removeFavoriteById(fileSiteNotFav1Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });

        it('Unfavorite an item - [C280343]', async () => {
            await page.dataTable.doubleClickOnRowByName(folderSite);
            await dataTable.selectItem(fileSiteFav1);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 4 });
            const isFavorite = await apis.user.favorites.isFavorite(fileSiteFav1Id);
            expect(isFavorite).toBe(false, `${fileSiteFav1} is marked as favorite`);
            await apis.user.favorites.addFavoriteById('file', fileSiteFav1Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });

        it('Favorite multiple items - all unfavorite - [C280345]', async () => {
            await page.dataTable.doubleClickOnRowByName(folderSite);
            await dataTable.selectMultipleItems([ fileSiteNotFav1, fileSiteNotFav2 ]);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 7 });

            const isFile1Fav = await apis.user.favorites.isFavorite(fileSiteNotFav1Id);
            const isFile2Fav = await apis.user.favorites.isFavorite(fileSiteNotFav2Id);
            expect(isFile1Fav).toBe(true, 'item not marked as favorite');
            expect(isFile2Fav).toBe(true, 'item not marked as favorite');
            await apis.user.favorites.removeFavoriteById(fileSiteNotFav1Id);
            await apis.user.favorites.removeFavoriteById(fileSiteNotFav2Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });

        it('Unfavorite multiple items - [C280346]', async () => {
            await page.dataTable.doubleClickOnRowByName(folderSite);
            await dataTable.selectMultipleItems([ fileSiteFav1, fileSiteFav2 ]);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 3 });
            const isFile1Fav = await apis.user.favorites.isFavorite(fileSiteFav1Id);
            const isFile2Fav = await apis.user.favorites.isFavorite(fileSiteFav2Id);
            expect(isFile1Fav).toBe(false, 'item marked as favorite');
            expect(isFile2Fav).toBe(false, 'item marked as favorite');
            await apis.user.favorites.addFavoriteById('file', fileSiteFav1Id);
            await apis.user.favorites.addFavoriteById('file', fileSiteFav2Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });

        it('Favorite multiple items - some favorite and some unfavorite - [C280347]', async () => {
            await page.dataTable.doubleClickOnRowByName(folderSite);
            await dataTable.selectMultipleItems([ fileSiteNotFav1, fileSiteFav1 ]);
            await toolbar.openMoreMenu();
            await toolbar.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 6 });

            const isFile1Fav = await apis.user.favorites.isFavorite(fileSiteNotFav1Id);
            const isFile2Fav = await apis.user.favorites.isFavorite(fileSiteFav1);
            expect(isFile1Fav).toBe(true, 'item not marked as favorite');
            expect(isFile2Fav).toBe(true, 'item not marked as favorite');
            await apis.user.favorites.removeFavoriteById(fileSiteNotFav1Id);
            await apis.user.favorites.waitForApi({ expect: 5 });
        });
    });

    describe('on a library', () => {
      const adminSite1 = `adminSite1-${Utils.random()}`;
      const adminSite2 = `adminSite2-${Utils.random()}`;
      const adminSite3 = `adminSite3-${Utils.random()}`;

      beforeAll(async (done) => {
        await apis.admin.sites.createSite(adminSite1);
        await apis.admin.sites.createSite(adminSite2);
        await apis.admin.sites.createSite(adminSite3);
        await apis.admin.sites.addSiteMember(adminSite1, username, SITE_ROLES.SITE_CONSUMER.ROLE);
        await apis.admin.sites.addSiteMember(adminSite2, username, SITE_ROLES.SITE_CONSUMER.ROLE);
        await apis.admin.sites.addSiteMember(adminSite3, username, SITE_ROLES.SITE_CONSUMER.ROLE);

        await apis.user.favorites.addFavoriteById('site', adminSite2);
        await apis.user.favorites.addFavoriteById('site', adminSite3);
        done();
      });

      beforeEach(async (done) => {
        await Utils.pressEscape();
        done();
      });

      afterAll(async (done) => {
        await apis.admin.sites.deleteSite(adminSite1);
        await apis.admin.sites.deleteSite(adminSite2);
        await apis.admin.sites.deleteSite(adminSite3);
        done();
      });

      it('Mark a library as favorite - [C289974]', async () => {
        await page.goToMyLibraries();
        await dataTable.selectItem(adminSite1);
        await toolbar.openMoreMenu();
        await toolbar.menu.clickMenuItem('Favorite');
        expect(await apis.user.favorites.isFavoriteWithRetry(adminSite1, { expect: true })).toBe(true, `${adminSite1} not favorite`);
      });

      it('Remove a library from favorites - on My Libraries - [C289975]', async () => {
        await page.goToMyLibraries();
        await dataTable.selectItem(adminSite2);
        await toolbar.openMoreMenu();
        await toolbar.menu.clickMenuItem('Favorite');
        expect(await apis.user.favorites.isFavoriteWithRetry(adminSite2, { expect: false })).toBe(false, `${adminSite2} still favorite`);
      });

      it('Remove a library from favorites - on Favorite Libraries - [C289976]', async () => {
        await page.goToFavoriteLibraries();
        await dataTable.selectItem(adminSite3);
        await toolbar.openMoreMenu();
        await toolbar.menu.clickMenuItem('Favorite');
        expect(await dataTable.getRowByName(adminSite3).isPresent()).toBe(false, `${adminSite3} is displayed`);
        expect(await apis.user.favorites.isFavoriteWithRetry(adminSite3, { expect: false })).toBe(false, `${adminSite3} still favorite`);
      });
    });
});
