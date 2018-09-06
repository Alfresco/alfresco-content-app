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
import { SIDEBAR_LABELS } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('Pagination on Trash', () => {
    const username = `user-${Utils.random()}`;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    const { nodes: nodesApi, trashcan: trashApi } = apis.user;

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const page = new BrowsingPage();
    const { dataTable, pagination } = page;

    const filesForDelete = Array(101)
        .fill('file')
        .map((name, index): string => `${name}-${index + 1}.txt`);
    let filesDeletedIds;

    const file = `file-${Utils.random()}.txt`; let fileId;

    beforeAll(done => {
        apis.admin.people.createUser({ username }).then(done);
    });

    xit('');

    describe('on empty page', () => {
        beforeAll(done => {
            loginPage.loginWith(username).then(done);
        });

        afterAll(done => {
            logoutPage.load().then(done);
        });

        it('pagination controls not displayed - [C280120]', () => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH)
                .then(() => {
                    expect(pagination.range.isPresent()).toBe(false);
                    expect(pagination.maxItems.isPresent()).toBe(false);
                    expect(pagination.currentPage.isPresent()).toBe(false);
                    expect(pagination.totalPages.isPresent()).toBe(false);
                    expect(pagination.previousButton.isPresent()).toBe(false);
                    expect(pagination.nextButton.isPresent()).toBe(false);
                });
        });
    });

    describe('on single page', () => {
        beforeAll(done => {
            nodesApi.createFile(file).then(resp => fileId = resp.entry.id)
                .then(() => nodesApi.deleteNodeById(fileId, false))
                .then(() => trashApi.waitForApi({ expect: 1 }))
                .then(() => loginPage.loginWith(username))
                .then(done);
        });

        afterAll(done => {
            Promise.all([
                trashApi.emptyTrash(),
                logoutPage.load()
            ])
            .then(done);
        });

        it('page selector not displayed when having a single page - [C280121]', () => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH)
                .then(() => dataTable.waitForHeader())
                .then(() => expect(pagination.pagesButton.isPresent()).toBe(false, 'page selector displayed'));
        });
    });

    describe('on multiple pages', () => {
        beforeAll(done => {
            nodesApi.createFiles(filesForDelete)
                .then(resp => filesDeletedIds = resp.list.entries.map(entries => entries.entry.id))
                .then(() => nodesApi.deleteNodesById(filesDeletedIds, false))
                .then(() => trashApi.waitForApi({expect: 101}))

                .then(() => loginPage.loginWith(username))
                .then(done);
        });

        beforeEach(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterEach(done => {
            browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform().then(done);
        });

        afterAll(done => {
            Promise.all([
                trashApi.emptyTrash(),
                logoutPage.load()
            ])
            .then(done);
        });

        it('Pagination control default values - [C280122]', () => {
            expect(pagination.range.getText()).toContain('1-25 of 101');
            expect(pagination.maxItems.getText()).toContain('25');
            expect(pagination.currentPage.getText()).toContain('Page 1');
            expect(pagination.totalPages.getText()).toContain('of 5');
            expect(pagination.previousButton.isEnabled()).toBe(false, 'Previous button is enabled');
            expect(pagination.nextButton.isEnabled()).toBe(true, 'Next button is not enabled');
        });

        it('Items per page values - [C280123]', () => {
            pagination.openMaxItemsMenu()
                .then(() => {
                    const [ first, second, third ] = [1, 2, 3]
                        .map(nth => pagination.menu.getNthItem(nth).getText());
                    expect(first).toBe('25');
                    expect(second).toBe('50');
                    expect(third).toBe('100');
                })
            .then(() => pagination.menu.closeMenu());
        });

        it('current page menu items - [C280124]', () => {
            pagination.openMaxItemsMenu()
                .then(() => pagination.menu.clickMenuItem('25'))
                .then(() => {
                    expect(pagination.getText(pagination.maxItems)).toContain('25');
                    expect(pagination.getText(pagination.totalPages)).toContain('of 5');
                })
                .then(() => pagination.openCurrentPageMenu())
                .then(() => expect(pagination.menu.getItemsCount()).toBe(5))
                .then(() => pagination.menu.closeMenu())

                .then(() => pagination.openMaxItemsMenu())
                .then(() => pagination.menu.clickMenuItem('50'))
                .then(() => {
                    expect(pagination.getText(pagination.maxItems)).toContain('50');
                    expect(pagination.getText(pagination.totalPages)).toContain('of 3');
                })
                .then(() => pagination.openCurrentPageMenu())
                .then(() => expect(pagination.menu.getItemsCount()).toBe(3))
                .then(() => pagination.menu.closeMenu())

                .then(() => pagination.openMaxItemsMenu())
                .then(() => pagination.menu.clickMenuItem('100'))
                .then(() => {
                    expect(pagination.getText(pagination.maxItems)).toContain('100');
                    expect(pagination.getText(pagination.totalPages)).toContain('of 2');
                })
                .then(() => pagination.openCurrentPageMenu())
                .then(() => expect(pagination.menu.getItemsCount()).toBe(2))
                .then(() => pagination.menu.closeMenu())

                .then(() => pagination.resetToDefaultPageSize());
        });

        it('change the current page from menu - [C280125]', () => {
            pagination.openCurrentPageMenu()
                .then(() => pagination.menu.clickNthItem(3))
                .then(() => dataTable.waitForHeader())
                .then(() => {
                    expect(pagination.range.getText()).toContain('51-75 of 101');
                    expect(pagination.currentPage.getText()).toContain('Page 3');
                    expect(pagination.previousButton.isEnabled()).toBe(true, 'Previous button is not enabled');
                    expect(pagination.nextButton.isEnabled()).toBe(true, 'Next button is not enabled');
                    expect(dataTable.getRowByName('file-40.txt').isPresent()).toBe(true, 'File not found on page');
                })

                .then(() => pagination.resetToDefaultPageNumber());
        });

        it('navigate to next and previous pages - [C280128]', () => {
            pagination.nextButton.click()
                .then(() => dataTable.waitForHeader())
                .then(() => {
                    expect(pagination.range.getText()).toContain('26-50 of 101');
                    expect(dataTable.getRowByName('file-70.txt').isPresent()).toBe(true, 'File not found on page');
                })

                .then(() => pagination.resetToDefaultPageNumber())

                .then(() => pagination.openCurrentPageMenu())
                .then(() => pagination.menu.clickNthItem(2))
                .then(() => dataTable.waitForHeader())
                .then(() => pagination.previousButton.click())
                .then(() => dataTable.waitForHeader())
                .then(() => {
                    expect(pagination.range.getText()).toContain('1-25 of 101');
                    expect(dataTable.getRowByName('file-88.txt').isPresent())
                        .toBe(true, 'File not found on page');
                })
                .then(() => pagination.resetToDefaultPageNumber());
        });

        it('Previous button is disabled on first page - [C280126]', () => {
            expect(pagination.currentPage.getText()).toContain('Page 1');
            expect(pagination.previousButton.isEnabled()).toBe(false, 'Previous button is enabled on first page');
        });

        it('Next button is disabled on last page - [C280127]', () => {
            pagination.openCurrentPageMenu()
                .then(() => pagination.menu.clickNthItem(5))
                .then(() => {
                    expect(dataTable.countRows()).toBe(1, 'Incorrect number of items on the last page');
                    expect(pagination.currentPage.getText()).toContain('Page 5');
                    expect(pagination.nextButton.isEnabled()).toBe(false, 'Next button is enabled on last page');
                });
        });
    });
});
