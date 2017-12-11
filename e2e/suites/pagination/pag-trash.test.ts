/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2017 Alfresco Software Limited
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

import { browser, protractor, promise } from 'protractor';
import { SIDEBAR_LABELS, SITE_VISIBILITY } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient, NodeContentTree } from '../../utilities/repo-client/repo-client';

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

    function resetToDefaultPageSize(): promise.Promise<any> {
        return pagination.openMaxItemsMenu()
            .then(menu => menu.clickMenuItem('25'))
            .then(() => dataTable.waitForHeader());
    }

    function resetToDefaultPageNumber(): promise.Promise<any> {
        return pagination.openCurrentPageMenu()
            .then(menu => menu.clickMenuItem('1'))
            .then(() => dataTable.waitForHeader());
    }

    beforeAll(done => {
        apis.admin.people.createUser(username)
            .then(() => nodesApi.createFiles(filesForDelete))
            .then(resp => filesDeletedIds = resp.data.list.entries.map(entries => entries.entry.id))
            .then(() => nodesApi.deleteNodesById(filesDeletedIds, false))

            .then(() => loginPage.load())
            .then(() => loginPage.loginWith(username))
            .then(done);
    });

    beforeEach(done => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH)
            .then(() => dataTable.waitForHeader())
            .then(done);
    });

    afterEach(done => {
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform().then(done);
    });

    afterAll(done => {
        Promise.all([
            trashApi.emptyTrash(),
            logoutPage.load()
        ])
        .then(done);
    });

    it('default values', () => {
        expect(pagination.range.getText()).toContain('1-25 of 101');
        expect(pagination.maxItems.getText()).toContain('25');
        expect(pagination.currentPage.getText()).toContain('Page 1');
        expect(pagination.totalPages.getText()).toContain('of 5');
        expect(pagination.previousButton.isEnabled()).toBe(false, 'Previous button is enabled');
        expect(pagination.nextButton.isEnabled()).toBe(true, 'Next button is not enabled');
    });

    it('page sizes', () => {
        pagination.openMaxItemsMenu()
            .then(menu => {
                const [ first, second, third ] = [1, 2, 3]
                    .map(nth => menu.getNthItem(nth).getText());
                expect(first).toBe('25');
                expect(second).toBe('50');
                expect(third).toBe('100');
            });
    });

    it('change the page size', () => {
        pagination.openMaxItemsMenu()
            .then(menu => menu.clickMenuItem('50'))
            .then(() => dataTable.waitForHeader())
            .then(() => {
                expect(pagination.maxItems.getText()).toContain('50');
                expect(pagination.totalPages.getText()).toContain('of 3');
            })

            .then(() => resetToDefaultPageSize());
    });

    it('current page menu items', () => {
        pagination.openCurrentPageMenu()
            .then(menu => {
                expect(menu.getItemsCount()).toBe(5);
            });
    });

    it('change the current page from menu', () => {
        pagination.openCurrentPageMenu()
            .then(menu => menu.clickNthItem(3))
            .then(() => dataTable.waitForHeader())
            .then(() => {
                expect(pagination.range.getText()).toContain('51-75 of 101');
                expect(pagination.currentPage.getText()).toContain('Page 3');
                expect(pagination.previousButton.isEnabled()).toBe(true, 'Previous button is not enabled');
                expect(pagination.nextButton.isEnabled()).toBe(true, 'Next button is not enabled');
                expect(dataTable.getRowByName('file-40.txt').isPresent())
                    .toBe(true, 'File not found on page');
            })

            .then(() => resetToDefaultPageNumber());
    });

    it('navigate to next page', () => {
        pagination.nextButton.click()
            .then(() => dataTable.waitForHeader())
            .then(() => {
                expect(pagination.range.getText()).toContain('26-50 of 101');
                expect(dataTable.getRowByName('file-70.txt').isPresent())
                    .toBe(true, 'File not found on page');
            })

            .then(() => resetToDefaultPageNumber());
    });

    it('navigate to previous page', () => {
        pagination.openCurrentPageMenu()
            .then(menu => menu.clickNthItem(2))
            .then(() => dataTable.waitForHeader())
            .then(() => pagination.previousButton.click())
            .then(() => dataTable.waitForHeader())
            .then(() => {
                expect(pagination.range.getText()).toContain('1-25 of 101');
                expect(dataTable.getRowByName('file-88.txt').isPresent())
                    .toBe(true, 'File not found on page');
            })

            .then(() => resetToDefaultPageNumber());
    });

    it('last page', () => {
        pagination.openCurrentPageMenu()
            .then(menu => menu.clickNthItem(5))
            .then(() => dataTable.waitForHeader())
            .then(() => {
                expect(dataTable.countRows()).toBe(1, 'Incorrect number of items on the last page');
                expect(pagination.currentPage.getText()).toContain('Page 5');
                expect(pagination.nextButton.isEnabled()).toBe(false, 'Next button is enabled');
            });
    });
});
