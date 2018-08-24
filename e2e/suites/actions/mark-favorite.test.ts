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

import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { SIDEBAR_LABELS, SITE_VISIBILITY } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
import { browser } from 'protractor';

describe('Mark items as favorites', () => {
    const username = `user-${Utils.random()}`;

    const file1NotFav = `file-${Utils.random()}.txt`;
    const file2NotFav = `file-${Utils.random()}.txt`;
    const file3Fav = `file-${Utils.random()}.txt`;
    const file4Fav = `file-${Utils.random()}.txt`;
    const folder1 = `folder-${Utils.random()}`;
    const siteName = `site-public-${Utils.random()}`;
    const fileSiteNotFav1 = `file-site${Utils.random()}.txt`;
    const fileSiteNotFav2 = `file-site${Utils.random()}.txt`;
    const folderSite = `folder-${Utils.random()}`;
    const fileSiteFav1 = `file-${Utils.random()}.txt`;
    const fileSiteFav2 = `file-${Utils.random()}.txt`;

    let file1Id, file2Id, file3Id, file4Id, folder1Id, fileSiteNotFav1Id, fileSiteNotFav2Id, folderSiteId, fileSiteFav1Id, fileSiteFav2Id;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const page = new BrowsingPage();
    const { dataTable, toolbar } = page;

    beforeAll(done => {
        apis.admin.people.createUser({ username })
            .then(() => apis.user.nodes.createFile( file1NotFav ).then(resp => file1Id = resp.entry.id))
            .then(() => apis.user.nodes.createFile( file2NotFav ).then(resp => file2Id = resp.entry.id))
            .then(() => apis.user.nodes.createFile( file3Fav ).then(resp => file3Id = resp.entry.id))
            .then(() => apis.user.nodes.createFile( file4Fav ).then(resp => file4Id = resp.entry.id))
            .then(() => apis.user.nodes.createFolder( folder1 ).then(resp => folder1Id = resp.entry.id))

            .then(() => apis.user.favorites.addFavoriteById('file', file3Id))
            .then(() => apis.user.favorites.addFavoriteById('file', file4Id))

            .then(() => apis.user.search.waitForApi(username, { expect: 4 }))
            .then(() => apis.user.favorites.waitForApi({ expect: 2 }))

            .then(() => loginPage.loginWith(username))
            .then(done);
    });

    afterAll(done => {
        Promise.all([
            apis.user.nodes.deleteNodesById([ file1Id, file2Id, file3Id, file4Id, folder1Id]),
            apis.user.sites.deleteSite(siteName),
            logoutPage.load()
        ])
        .then(done);
    });

    xit('');

    describe('on Personal Files', () => {
        beforeAll(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        beforeEach(done => {
            toolbar.actions.closeMoreMenu().then(done);
        });

        it('Favorite action has empty star icon for an item not marked as favorite - [C217186]', () => {
            dataTable.selectItem(file1NotFav)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => expect(toolbar.actions.menu.getItemIconText('Favorite')).toEqual('star_border'));
        });

        it('Favorite action has empty star icon for multiple selection of items when some are not favorite - [C217187]', () => {
            dataTable.selectMultipleItems([ file1NotFav, file3Fav ])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => expect(toolbar.actions.menu.getItemIconText('Favorite')).toEqual('star_border'));
        });

        it('Favorite action has full star icon for items marked as favorite - [C217188]', () => {
            dataTable.selectItem(file3Fav)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => expect(toolbar.actions.menu.getItemIconText('Favorite')).toEqual('star'));
        });

        it('favorite a file - [C217189]', () => {
            dataTable.selectItem(file1NotFav)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 3 }))
                .then(() => apis.user.favorites.isFavorite(file1Id))
                .then(isFavorite => expect(isFavorite).toBe(true, `${file1NotFav} not marked as favorite`))

                .then(() => apis.user.favorites.removeFavoriteById(file1Id));
        });

        it('favorite a folder - [C280390]', () => {
            dataTable.selectItem(folder1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 3 }))
                .then(() => apis.user.favorites.isFavorite(folder1Id))
                .then(isFavorite => expect(isFavorite).toBe(true, `${folder1} not marked as favorite`))

                .then(() => apis.user.favorites.removeFavoriteById(folder1Id));
        });

        it('unfavorite an item - [C217190]', () => {
            dataTable.selectItem(file3Fav)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 1 }))
                .then(() => apis.user.favorites.isFavorite(file3Id))
                .then(isFavorite => expect(isFavorite).toBe(false, `${file3Fav} is marked as favorite`))

                .then(() => apis.user.favorites.addFavoriteById('file', file3Id));
        });

        it('favorite multiple items - all unfavorite - [C217192]', () => {
            dataTable.selectMultipleItems([ file1NotFav, file2NotFav ])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 4 }))
                .then(() => Promise.all([
                    apis.user.favorites.isFavorite(file1Id),
                    apis.user.favorites.isFavorite(file2Id)
                ]))
                .then(resp => {
                    expect(resp[0]).toBe(true, 'item not marked as favorite');
                    expect(resp[1]).toBe(true, 'item not marked as favorite');
                })

                .then(() => apis.user.favorites.removeFavoriteById(file1Id))
                .then(() => apis.user.favorites.removeFavoriteById(file2Id));
        });

        it('favorite multiple items - some favorite and some unfavorite - [C217194]', () => {
            dataTable.selectMultipleItems([ file1NotFav, file3Fav ])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 3 }))
                .then(() => Promise.all([
                    apis.user.favorites.isFavorite(file1Id),
                    apis.user.favorites.isFavorite(file3Id)
                ]))
                .then(resp => {
                    expect(resp[0]).toBe(true, 'item not marked as favorite');
                    expect(resp[1]).toBe(true, 'item not marked as favorite');
                })

                .then(() => apis.user.favorites.removeFavoriteById(file1Id));
        });

        it('unfavorite multiple items - [C217193]', () => {
            dataTable.selectMultipleItems([ file3Fav, file4Fav ])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => browser.sleep(2000))
                .then(() => Promise.all([
                    apis.user.favorites.isFavorite(file3Id),
                    apis.user.favorites.isFavorite(file4Id)
                ]))
                .then(resp => {
                    expect(resp[0]).toBe(false, 'item marked as favorite');
                    expect(resp[1]).toBe(false, 'item marked as favorite');
                })

                .then(() => apis.user.favorites.addFavoriteById('file', file3Id))
                .then(() => apis.user.favorites.addFavoriteById('file', file4Id));
        });
    });

    describe('on Recent Files', () => {
        beforeAll(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        beforeEach(done => {
            toolbar.actions.closeMoreMenu().then(done);
        });

        it('favorite a file - [C280352]', () => {
            dataTable.selectItem(file1NotFav)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 3 }))
                .then(() => apis.user.favorites.isFavorite(file1Id))
                .then(isFavorite => expect(isFavorite).toBe(true, `${file1NotFav} not marked as favorite`))

                .then(() => apis.user.favorites.removeFavoriteById(file1Id));
        });

        it('unfavorite an item - [C280353]', () => {
            dataTable.selectItem(file3Fav)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 1 }))
                .then(() => apis.user.favorites.isFavorite(file3Id))
                .then(isFavorite => expect(isFavorite).toBe(false, `${file3Fav} is marked as favorite`))

                .then(() => apis.user.favorites.addFavoriteById('file', file3Id));
        });

        it('favorite multiple items - all unfavorite - [C280355]', () => {
            dataTable.selectMultipleItems([ file1NotFav, file2NotFav ])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 4 }))
                .then(() => Promise.all([
                    apis.user.favorites.isFavorite(file1Id),
                    apis.user.favorites.isFavorite(file2Id)
                ]))
                .then(resp => {
                    expect(resp[0]).toBe(true, 'item not marked as favorite');
                    expect(resp[1]).toBe(true, 'item not marked as favorite');
                })

                .then(() => apis.user.favorites.removeFavoriteById(file1Id))
                .then(() => apis.user.favorites.removeFavoriteById(file2Id));
        });

        it('favorite multiple items - some favorite and some unfavorite - [C280357]', () => {
            dataTable.selectMultipleItems([ file1NotFav, file3Fav ])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 3 }))
                .then(() => Promise.all([
                    apis.user.favorites.isFavorite(file1Id),
                    apis.user.favorites.isFavorite(file3Id)
                ]))
                .then(resp => {
                    expect(resp[0]).toBe(true, 'item not marked as favorite');
                    expect(resp[1]).toBe(true, 'item not marked as favorite');
                })

                .then(() => apis.user.favorites.removeFavoriteById(file1Id));
        });

        it('unfavorite multiple items - [C280356]', () => {
            dataTable.selectMultipleItems([ file3Fav, file4Fav ])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => browser.sleep(2000))
                .then(() => Promise.all([
                    apis.user.favorites.isFavorite(file3Id),
                    apis.user.favorites.isFavorite(file4Id)
                ]))
                .then(resp => {
                    expect(resp[0]).toBe(false, 'item marked as favorite');
                    expect(resp[1]).toBe(false, 'item marked as favorite');
                })

                .then(() => apis.user.favorites.addFavoriteById('file', file3Id))
                .then(() => apis.user.favorites.addFavoriteById('file', file4Id));
        });
    });

    describe('on Shared Files', () => {
        beforeAll(done => {
            apis.user.shared.shareFilesByIds([ file1Id, file2Id, file3Id, file4Id ])
                .then(() => apis.user.shared.waitForApi({ expect: 4 }))
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES))
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterEach(done => {
            // browser.actions().sendKeys(protractor.Key.ESCAPE).perform().then(done);
            browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform().then(done);
        });

        it('favorite a file - [C280362]', () => {
            dataTable.selectItem(file1NotFav)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 3 }))
                .then(() => apis.user.favorites.isFavorite(file1Id))
                .then(isFavorite => expect(isFavorite).toBe(true, `${file1NotFav} not marked as favorite`))

                .then(() => apis.user.favorites.removeFavoriteById(file1Id));
        });

        it('unfavorite an item - [C280363]', () => {
            dataTable.selectItem(file3Fav)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 1 }))
                .then(() => apis.user.favorites.isFavorite(file3Id))
                .then(isFavorite => expect(isFavorite).toBe(false, `${file3Fav} is marked as favorite`))

                .then(() => apis.user.favorites.addFavoriteById('file', file3Id));
        });

        it('favorite multiple items - all unfavorite - [C280365]', () => {
            dataTable.selectMultipleItems([ file1NotFav, file2NotFav ])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 4 }))
                .then(() => Promise.all([
                    apis.user.favorites.isFavorite(file1Id),
                    apis.user.favorites.isFavorite(file2Id)
                ]))
                .then(resp => {
                    expect(resp[0]).toBe(true, 'item not marked as favorite');
                    expect(resp[1]).toBe(true, 'item not marked as favorite');
                })

                .then(() => apis.user.favorites.removeFavoriteById(file1Id))
                .then(() => apis.user.favorites.removeFavoriteById(file2Id));
        });

        it('favorite multiple items - some favorite and some unfavorite - [C280367]', () => {
            dataTable.selectMultipleItems([ file1NotFav, file3Fav ])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 3 }))
                .then(() => Promise.all([
                    apis.user.favorites.isFavorite(file1Id),
                    apis.user.favorites.isFavorite(file3Id)
                ]))
                .then(resp => {
                    expect(resp[0]).toBe(true, 'item not marked as favorite');
                    expect(resp[1]).toBe(true, 'item not marked as favorite');
                })

                .then(() => apis.user.favorites.removeFavoriteById(file1Id));
        });

        it('unfavorite multiple items - [C280366]', () => {
            dataTable.selectMultipleItems([ file3Fav, file4Fav ])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => browser.sleep(2000))
                .then(() => Promise.all([
                    apis.user.favorites.isFavorite(file3Id),
                    apis.user.favorites.isFavorite(file4Id)
                ]))
                .then(resp => {
                    expect(resp[0]).toBe(false, 'item marked as favorite');
                    expect(resp[1]).toBe(false, 'item marked as favorite');
                })

                .then(() => apis.user.favorites.addFavoriteById('file', file3Id))
                .then(() => apis.user.favorites.addFavoriteById('file', file4Id));
        });
    });

    describe('on Favorites', () => {
        beforeAll(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterEach(done => {
            page.refresh().then(done);
        });

        it('unfavorite an item - [C280368]', () => {
            dataTable.selectItem(file3Fav)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 1 }))
                .then(() => apis.user.favorites.isFavorite(file3Id))
                .then(isFavorite => {
                    expect(isFavorite).toBe(false, 'item is marked as favorite');
                    expect(dataTable.getRowByName(file3Fav).isPresent()).toBe(false, 'item still displayed');
                })

                .then(() => apis.user.favorites.addFavoriteById('file', file3Id));
        });

        it('unfavorite multiple items - [C280374]', () => {
            dataTable.selectMultipleItems([ file3Fav, file4Fav ])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => browser.sleep(2000))
                .then(() => apis.user.favorites.isFavorite(file3Id))
                .then(resp => {
                    expect(resp).toBe(false, 'file3 marked as favorite');
                    expect(dataTable.getRowByName(file3Fav).isPresent()).toBe(false, 'file3 still displayed');
                })
                .then(() => apis.user.favorites.isFavorite(file4Id))
                .then(resp => {
                    expect(resp).toBe(false, 'file4 marked as favorite');
                    expect(dataTable.getRowByName(file4Fav).isPresent()).toBe(false, 'file4 still displayed');
                })

                .then(() => apis.user.favorites.addFavoriteById('file', file3Id))
                .then(() => apis.user.favorites.addFavoriteById('file', file4Id));
        });

        it('Favorite action has full star icon for items marked as favorite - [C280371]', () => {
            dataTable.selectItem(file3Fav)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => expect(toolbar.actions.menu.getItemIconText('Favorite')).toEqual('star'));
        });
    });

    describe ('on File Libraries', () => {
        const fileLibrariesPage = new BrowsingPage();

        beforeAll(async (done) => {
            await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
            const docLibId = (await apis.user.sites.getDocLibId(siteName));
            folderSiteId = (await apis.user.nodes.createFolder(folderSite, docLibId)).entry.id;
            fileSiteNotFav1Id = (await apis.user.nodes.createFile(fileSiteNotFav1, folderSiteId)).entry.id;
            fileSiteFav1Id = (await apis.user.nodes.createFile(fileSiteFav1, folderSiteId)).entry.id;
            fileSiteNotFav2Id = (await apis.user.nodes.createFile(fileSiteNotFav2, folderSiteId)).entry.id;
            fileSiteFav2Id = (await apis.user.nodes.createFile(fileSiteFav2, folderSiteId)).entry.id;
            await apis.user.favorites.addFavoriteById('file', fileSiteFav1Id);
            await apis.user.favorites.addFavoriteById('file', fileSiteFav2Id);
            done();
        });

        beforeEach(async (done) => {
            await fileLibrariesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES);
            await fileLibrariesPage.dataTable.waitForHeader();
            await fileLibrariesPage.dataTable.doubleClickOnRowByName(siteName);
            await fileLibrariesPage.dataTable.waitForHeader();
            await toolbar.actions.closeMoreMenu();
            done();
        });

        afterEach(async (done) => {
            await browser.refresh();
            done();
        });

        it('Favorite a folder - [C280391]', async  () => {
            await dataTable.selectItem(folderSite);
            await toolbar.actions.openMoreMenu();
            await toolbar.actions.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 3 });
            const isFavorite = await apis.user.favorites.isFavorite(folderSiteId);
            expect(isFavorite).toBe(true, `${folderSite} not marked as favorite`);
            await apis.user.favorites.removeFavoriteById(folderSiteId);
        });

        it('Favorite a file - [C280342]', async () => {
            await fileLibrariesPage.dataTable.doubleClickOnRowByName(folderSite);
            await dataTable.selectItem(fileSiteNotFav1);
            await toolbar.actions.openMoreMenu();
            await toolbar.actions.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 3 });
            const isFavorite = await apis.user.favorites.isFavorite(fileSiteNotFav1Id);
            expect(isFavorite).toBe(true, `${fileSiteNotFav1} not marked as favorite`);
            await apis.user.favorites.removeFavoriteById(fileSiteNotFav1Id);
        });

        it('Unfavorite an item - [C280343]', async () => {
            await fileLibrariesPage.dataTable.doubleClickOnRowByName(folderSite);
            await dataTable.selectItem(fileSiteFav1);
            await toolbar.actions.openMoreMenu();
            await toolbar.actions.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 3 });
            const isFavorite = await apis.user.favorites.isFavorite(fileSiteFav1Id);
            expect(isFavorite).toBe(false, `${fileSiteFav1} is marked as favorite`);
            await apis.user.favorites.addFavoriteById('file', fileSiteFav1Id);
        });

        it('Favorite multiple items - all unfavorite - [C280345]', async () => {
            await fileLibrariesPage.dataTable.doubleClickOnRowByName(folderSite);
            await dataTable.selectMultipleItems([ fileSiteNotFav1, fileSiteNotFav2 ]);
            await toolbar.actions.openMoreMenu();
            await toolbar.actions.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 4 });
            const listItems1 = await Promise.all([
                apis.user.favorites.isFavorite(fileSiteNotFav1Id),
                apis.user.favorites.isFavorite(fileSiteNotFav2Id)
                ]);
            expect(listItems1[0]).toBe(true, 'item not marked as favorite');
            expect(listItems1[1]).toBe(true, 'item not marked as favorite');
            await apis.user.favorites.removeFavoriteById(fileSiteNotFav1Id);
            await apis.user.favorites.removeFavoriteById(fileSiteNotFav2Id);
        });

        it('Unfavorite multiple items - [C280346]', async () => {
            await fileLibrariesPage.dataTable.doubleClickOnRowByName(folderSite);
            await dataTable.selectMultipleItems([ fileSiteFav1, fileSiteFav2 ]);
            await toolbar.actions.openMoreMenu();
            await toolbar.actions.menu.clickMenuItem('Favorite');
            const listItems2 = await Promise.all([
                apis.user.favorites.isFavorite(fileSiteFav1Id),
                apis.user.favorites.isFavorite(fileSiteFav2Id)
                ]);
            expect(listItems2[0]).toBe(false, 'item marked as favorite');
            expect(listItems2[1]).toBe(false, 'item marked as favorite');
            await apis.user.favorites.addFavoriteById('file', fileSiteFav1Id);
            await apis.user.favorites.addFavoriteById('file', fileSiteFav2Id);
        });

        it('Favorite multiple items - some favorite and some unfavorite - [C280347]', async () => {
            await fileLibrariesPage.dataTable.doubleClickOnRowByName(folderSite);
            await dataTable.selectMultipleItems([ fileSiteNotFav1, fileSiteFav1 ]);
            await toolbar.actions.openMoreMenu();
            await toolbar.actions.menu.clickMenuItem('Favorite');
            await apis.user.favorites.waitForApi({ expect: 3 });
            const listItems3 = await Promise.all([
                apis.user.favorites.isFavorite(fileSiteNotFav1Id),
                apis.user.favorites.isFavorite(fileSiteFav1)
                ]);
            expect(listItems3[0]).toBe(true, 'item not marked as favorite');
            expect(listItems3[1]).toBe(true, 'item not marked as favorite');
            await apis.user.favorites.removeFavoriteById(fileSiteNotFav1Id);
        });
    });
});
