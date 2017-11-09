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

import { browser } from 'protractor';

import { APP_ROUTES } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient, NodeContentTree } from '../../utilities/repo-client/repo-client';

describe('Pagination', () => {
    const username = 'jane.doe';
    const password = 'jane.doe';

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, password)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();

    beforeAll(done => {
        apis.admin.people
            .createUser(username, password)
            .then(done);
    });

    xit('');

    describe(`on Personal Files`, () => {
        const personalFilesPage = new BrowsingPage(APP_ROUTES.PERSONAL_FILES);
        const { dataTable, pagination } = personalFilesPage;

        // Generate files
        const content: NodeContentTree = {
            name: 'user-folder',
            files: Array(101)
                .fill('file')
                .map((name, index): string => `${name}-${index + 1}.txt`)
        };

        const { nodes: nodesApi } = apis.user;

        beforeAll(done => {
            nodesApi.createContent(content)
                .then(() => loginPage.load())
                .then(() => loginPage.loginWith(username, password))
                .then(done);
        });

        beforeEach(done => {
            personalFilesPage
                .load()
                .then(() => dataTable.waitForHeader())
                .then(() => dataTable.doubleClickOnRowByContainingText(content.name))
                .then(() => dataTable.sortByColumn('Name'))
                .then(done);
        });

        afterAll(done => {
            logoutPage
                .load()
                .then(() => Utils.clearLocalStorage())
                .then(() => nodesApi.deleteNodes([ content.name ]))
                .then(done);
        });

        it('has default details', () => {
            expect(pagination.range.getText()).toContain('1-25 of 101', 'Range');
            expect(pagination.maxItems.getText()).toContain('25', 'Items per page');
            expect(pagination.currentPage.getText()).toContain('Page 1', 'Current page');
            expect(pagination.totalPages.getText()).toContain('of 5', 'Total pages');
            expect(pagination.previousButton.isEnabled()).toBe(false, 'Previous button');
            expect(pagination.nextButton.isEnabled()).toBe(true, 'Next button');
        });

        it('has page sizes', () => {
            pagination.openMaxItemsMenu()
                .then(menu => {
                    const [ first, second, third ] = [1, 2, 3]
                        .map(nth => menu.getNthItem(nth).getText());

                    expect(first).toBe('25', 'Items per page');
                    expect(second).toBe('50', 'Items per page');
                    expect(third).toBe('100', 'Items per page');
                });
        });

        it('changes the page size', () => {
            pagination.openMaxItemsMenu()
                .then(menu => menu.clickMenuItem('50'))
                .then(() => dataTable.waitForHeader())
                .then(() => {
                    expect(pagination.maxItems.getText()).toContain('50', 'Items per page');
                    expect(pagination.totalPages.getText()).toContain('of 3', 'Total pages');
                });
        });

        it('has page items', () => {
            pagination.openCurrentPageMenu()
                .then(menu => {
                    expect(menu.items.count()).toBe(5);
                });
        });

        it('changes the current page from menu', () => {
            pagination.openCurrentPageMenu()
                .then(menu => menu.clicktNthItem(3))
                .then(() => dataTable.waitForHeader())
                .then(() => {
                    expect(pagination.range.getText()).toContain('51-75 of 101', 'Range');
                    expect(pagination.currentPage.getText()).toContain('Page 3', 'Current page');
                    expect(pagination.previousButton.isEnabled()).toBe(true, 'Previous button');
                    expect(pagination.nextButton.isEnabled()).toBe(true, 'Next button');
                    expect(dataTable.getRowByContainingText('file-60.txt').isPresent())
                        .toBe(true, 'File not found on page');
                });
        });

        it('navigates to next page', () => {
            pagination.nextButton.click()
                .then(() => dataTable.waitForHeader())
                .then(() => {
                    expect(pagination.range.getText()).toContain('26-50 of 101', 'Range');
                    expect(dataTable.getRowByContainingText('file-30.txt').isPresent())
                        .toBe(true, 'File not found on page');
                });
        });

        it('navigates to previous page', () => {
            pagination.openCurrentPageMenu()
                .then(menu => menu.clicktNthItem(2))
                .then(() => dataTable.waitForHeader())
                .then(() => pagination.previousButton.click())
                .then(() => dataTable.waitForHeader())
                .then(() => {
                    expect(pagination.range.getText()).toContain('1-25 of 101', 'Range');
                    expect(dataTable.getRowByContainingText('file-12.txt').isPresent())
                        .toBe(true, 'File not found on page');
                });
        });

        it('has one item on the last page', () => {
            pagination.openCurrentPageMenu()
                .then(menu => menu.clicktNthItem(5))
                .then(() => dataTable.waitForHeader())
                .then(() => {
                    expect(dataTable.countRows()).toBe(1, 'Single item on the last page');
                    expect(pagination.currentPage.getText()).toContain('Page 5', 'Last page');
                    expect(pagination.nextButton.isEnabled()).toBe(false, 'Next button is not enabled');
                });
        });
    });
});
