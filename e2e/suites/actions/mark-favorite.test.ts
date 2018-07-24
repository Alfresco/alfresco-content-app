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
import { SIDEBAR_LABELS } from '../../configs';
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

    let file1Id, file2Id, file3Id, file4Id, folder1Id;

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
            .then(() => apis.user.nodes.createFile( file1NotFav ).then(resp => file1Id = resp.data.entry.id))
            .then(() => apis.user.nodes.createFile( file2NotFav ).then(resp => file2Id = resp.data.entry.id))
            .then(() => apis.user.nodes.createFile( file3Fav ).then(resp => file3Id = resp.data.entry.id))
            .then(() => apis.user.nodes.createFile( file4Fav ).then(resp => file4Id = resp.data.entry.id))
            .then(() => apis.user.nodes.createFolder( folder1 ).then(resp => folder1Id = resp.data.entry.id))

            .then(() => apis.user.favorites.addFavoriteById('file', file3Id))
            .then(() => apis.user.favorites.addFavoriteById('file', file4Id))

            .then(() => loginPage.loginWith(username))
            .then(done);
    });

    afterAll(done => {
        Promise.all([
            apis.user.nodes.deleteNodesById([ file1Id, file2Id, file3Id, file4Id, folder1Id ]),
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

        afterEach(done => {
            // browser.actions().sendKeys(protractor.Key.ESCAPE).perform().then(done);
            browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform().then(done);
        });

        it('Favorite action has empty star icon for an item not marked as favorite', () => {
            dataTable.clickOnItemNameRow(file1NotFav)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => expect(toolbar.actions.menu.getItemIconText('Favorite')).toEqual('star_border'));
        });

        it('Favorite action has empty star icon for multiple selection of items when some are not favorite', () => {
            dataTable.selectMultipleItemsRow([ file1NotFav, file3Fav ])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => expect(toolbar.actions.menu.getItemIconText('Favorite')).toEqual('star_border'));
        });

        it('Favorite action has full star icon for items marked as favorite', () => {
            dataTable.clickOnItemNameRow(file3Fav)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => expect(toolbar.actions.menu.getItemIconText('Favorite')).toEqual('star'));
        });

        it('favorite a file', () => {
            dataTable.clickOnItemNameRow(file1NotFav)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 3 }))
                .then(() => apis.user.favorites.isFavorite(file1Id))
                .then(isFavorite => expect(isFavorite).toBe(true, `${file1NotFav} not marked as favorite`))

                .then(() => apis.user.favorites.removeFavoriteById(file1Id));
        });

        it('favorite a folder', () => {
            dataTable.clickOnItemNameRow(folder1)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 3 }))
                .then(() => apis.user.favorites.isFavorite(folder1Id))
                .then(isFavorite => expect(isFavorite).toBe(true, `${folder1} not marked as favorite`))

                .then(() => apis.user.favorites.removeFavoriteById(folder1Id));
        });

        it('unfavorite an item', () => {
            dataTable.clickOnItemNameRow(file3Fav)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 1 }))
                .then(() => apis.user.favorites.isFavorite(file3Id))
                .then(isFavorite => expect(isFavorite).toBe(false, `${file3Fav} is marked as favorite`))

                .then(() => apis.user.favorites.addFavoriteById('file', file3Id));
        });

        it('favorite multiple items - all unfavorite', () => {
            dataTable.selectMultipleItemsRow([ file1NotFav, file2NotFav ])
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

        it('favorite multiple items - some favorite and some unfavorite', () => {
            dataTable.selectMultipleItemsRow([ file1NotFav, file3Fav ])
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

        it('unfavorite multiple items', () => {
            dataTable.selectMultipleItemsRow([ file3Fav, file4Fav ])
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

        afterEach(done => {
            // browser.actions().sendKeys(protractor.Key.ESCAPE).perform().then(done);
            browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform().then(done);
        });

        it('favorite a file', () => {
            dataTable.clickOnItemNameRow(file1NotFav)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 3 }))
                .then(() => apis.user.favorites.isFavorite(file1Id))
                .then(isFavorite => expect(isFavorite).toBe(true, `${file1NotFav} not marked as favorite`))

                .then(() => apis.user.favorites.removeFavoriteById(file1Id));
        });

        it('unfavorite an item', () => {
            dataTable.clickOnItemNameRow(file3Fav)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 1 }))
                .then(() => apis.user.favorites.isFavorite(file3Id))
                .then(isFavorite => expect(isFavorite).toBe(false, `${file3Fav} is marked as favorite`))

                .then(() => apis.user.favorites.addFavoriteById('file', file3Id));
        });

        it('favorite multiple items - all unfavorite', () => {
            dataTable.selectMultipleItemsRow([ file1NotFav, file2NotFav ])
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

        it('favorite multiple items - some favorite and some unfavorite', () => {
            dataTable.selectMultipleItemsRow([ file1NotFav, file3Fav ])
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

        it('unfavorite multiple items', () => {
            dataTable.selectMultipleItemsRow([ file3Fav, file4Fav ])
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

        it('favorite a file', () => {
            dataTable.clickOnItemNameRow(file1NotFav)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 3 }))
                .then(() => apis.user.favorites.isFavorite(file1Id))
                .then(isFavorite => expect(isFavorite).toBe(true, `${file1NotFav} not marked as favorite`))

                .then(() => apis.user.favorites.removeFavoriteById(file1Id));
        });

        it('unfavorite an item', () => {
            dataTable.clickOnItemNameRow(file3Fav)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 1 }))
                .then(() => apis.user.favorites.isFavorite(file3Id))
                .then(isFavorite => expect(isFavorite).toBe(false, `${file3Fav} is marked as favorite`))

                .then(() => apis.user.favorites.addFavoriteById('file', file3Id));
        });

        it('favorite multiple items - all unfavorite', () => {
            dataTable.selectMultipleItemsRow([ file1NotFav, file2NotFav ])
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

        it('favorite multiple items - some favorite and some unfavorite', () => {
            dataTable.selectMultipleItemsRow([ file1NotFav, file3Fav ])
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

        it('unfavorite multiple items', () => {
            dataTable.selectMultipleItemsRow([ file3Fav, file4Fav ])
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

        it('unfavorite an item', () => {
            dataTable.clickOnItemNameRow(file3Fav)
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => apis.user.favorites.waitForApi({ expect: 1 }))
                .then(() => apis.user.favorites.isFavorite(file3Id))
                .then(isFavorite => {
                    expect(isFavorite).toBe(false, 'item is marked as favorite');
                    expect(dataTable.getRowName(file3Fav).isPresent()).toBe(false, 'item still displayed');
                })

                .then(() => apis.user.favorites.addFavoriteById('file', file3Id));
        });

        it('unfavorite multiple items', () => {
            dataTable.selectMultipleItemsRow([ file3Fav, file4Fav ])
                .then(() => toolbar.actions.openMoreMenu())
                .then(() => toolbar.actions.menu.clickMenuItem('Favorite'))
                .then(() => browser.sleep(2000))
                .then(() => apis.user.favorites.isFavorite(file3Id))
                .then(resp => {
                    expect(resp).toBe(false, 'file3 marked as favorite');
                    expect(dataTable.getRowName(file3Fav).isPresent()).toBe(false, 'file3 still displayed');
                })
                .then(() => apis.user.favorites.isFavorite(file4Id))
                .then(resp => {
                    expect(resp).toBe(false, 'file4 marked as favorite');
                    expect(dataTable.getRowName(file4Fav).isPresent()).toBe(false, 'file4 still displayed');
                })

                .then(() => apis.user.favorites.addFavoriteById('file', file3Id))
                .then(() => apis.user.favorites.addFavoriteById('file', file4Id));
        });
    });

});
