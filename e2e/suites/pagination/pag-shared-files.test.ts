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

import { browser, protractor, promise } from 'protractor';
import { SIDEBAR_LABELS, SITE_VISIBILITY } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient, NodeContentTree } from '../../utilities/repo-client/repo-client';

describe('Pagination on Shared Files', () => {
    const username = `user-${Utils.random()}`;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };
    const { nodes: nodesApi, shared: sharedApi } = apis.user;

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const page = new BrowsingPage();
    const { dataTable, pagination } = page;

    const parent = `parent-${Utils.random()}`;
    const files = Array(101)
        .fill('file')
        .map((name, index): string => `${name}-${index + 1}.txt`);
    let filesIds;

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
            .then(() => nodesApi.createFiles(files, parent))
            .then(resp => filesIds = resp.data.list.entries.map(entries => entries.entry.id))

            .then(() => sharedApi.shareFilesByIds(filesIds))

            .then(() => loginPage.load())
            .then(() => loginPage.loginWith(username))
            .then(done);
    });

    beforeEach(done => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES)
            .then(() => dataTable.isEmptyList())
            .then(empty => {
                if (empty) {
                    browser.sleep(4000);
                    page.refresh();
                }
            })
            .then(() => dataTable.waitForHeader())
            .then(done);
    });

    afterEach(done => {
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform().then(done);
    });

    afterAll(done => {
        Promise.all([
            nodesApi.deleteNodes([ parent ]),
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
