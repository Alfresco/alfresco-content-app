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

import { ElementFinder, ElementArrayFinder, promise, by, browser, ExpectedConditions as EC, protractor } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';

export class DataTable extends Component {
    private static selectors = {
        root: 'adf-datatable',

        head: 'table > thead',
        columnHeader: 'tr > th',
        sortedColumnHeader: `
            th.adf-data-table__header--sorted-asc,
            th.adf-data-table__header--sorted-desc
        `,

        body: 'table > tbody',
        row: 'tr',
        selectedRow: 'tr.is-selected',
        cell: 'td',
        locationLink: 'app-location-link',

        emptyListContainer: 'td.adf-no-content-container',
        emptyFolderDragAndDrop: '.adf-empty-list_template .adf-empty-folder',

        emptyListTitle: 'div .empty-list__title',
        emptyListText: 'div .empty-list__text'
    };

    head: ElementFinder = this.component.element(by.css(DataTable.selectors.head));
    body: ElementFinder = this.component.element(by.css(DataTable.selectors.body));
    cell = by.css(DataTable.selectors.cell);
    locationLink = by.css(DataTable.selectors.locationLink);
    emptyList: ElementFinder = this.component.element(by.css(DataTable.selectors.emptyListContainer));
    emptyFolderDragAndDrop: ElementFinder = this.component.element(by.css(DataTable.selectors.emptyFolderDragAndDrop));
    emptyListTitle: ElementFinder = this.component.element(by.css(DataTable.selectors.emptyListTitle));
    emptyListText: ElementArrayFinder = this.component.all(by.css(DataTable.selectors.emptyListText));

    constructor(ancestor?: ElementFinder) {
        super(DataTable.selectors.root, ancestor);
    }

    // Wait methods (waits for elements)
    waitForHeader() {
        return browser.wait(EC.presenceOf(this.head), BROWSER_WAIT_TIMEOUT);
    }

    waitForEmptyState() {
        return browser.wait(EC.presenceOf(this.emptyList), BROWSER_WAIT_TIMEOUT);
    }

    // Header/Column methods
    getColumnHeaders(): ElementArrayFinder {
        const locator = by.css(DataTable.selectors.columnHeader);
        return this.head.all(locator);
    }

    getNthColumnHeader(nth: number): ElementFinder {
        return this.getColumnHeaders().get(nth - 1);
    }

    getColumnHeaderByLabel(label: string): ElementFinder {
        const locator = by.cssContainingText(DataTable.selectors.columnHeader, label);
        return this.head.element(locator);
    }

    getSortedColumnHeader(): ElementFinder {
        const locator = by.css(DataTable.selectors.sortedColumnHeader);
        return this.head.element(locator);
    }

    sortByColumn(columnName: string): promise.Promise<void> {
        const column = this.getColumnHeaderByLabel(columnName);
        const click = browser.actions().mouseMove(column).click();

        return click.perform();
    }

    // Rows methods
    getRows(): ElementArrayFinder {
        return this.body.all(by.css(DataTable.selectors.row));
    }

    getSelectedRows(): ElementArrayFinder {
        return this.body.all(by.css(DataTable.selectors.selectedRow));
    }

    getNthRow(nth: number): ElementFinder {
        return this.getRows().get(nth - 1);
    }

    getRowByName(name: string): ElementFinder {
        return this.body.element(by.css(`adf-datatable-cell [title="${name}"]`));
    }

    countRows(): promise.Promise<number> {
        return this.getRows().count();
    }

    // Navigation/selection methods
    doubleClickOnItemName(name: string): promise.Promise<void> {
        const dblClick = browser.actions()
            .mouseMove(this.getRowByName(name))
            .click()
            .click();

        return dblClick.perform();
    }

    clickOnItemName(name: string): promise.Promise<void> {
        return this.getRowByName(name).click();
    }

    selectMultipleItems(names: string[]): promise.Promise<void> {
        return browser.actions().sendKeys(protractor.Key.COMMAND).perform()
            .then(() => {
                names.forEach(name => {
                    this.clickOnItemName(name);
                });
            })
            .then(() => browser.actions().sendKeys(protractor.Key.NULL).perform());
    }

    clearSelection() {
        this.getSelectedRows().count()
            .then(count => {
                if (count !== 0) { browser.refresh().then(() => this.waitForHeader()); }
            });
    }

    getItemLocation(name: string) {
        const rowLocator = by.cssContainingText(DataTable.selectors.row, name);
        return this.body.element(rowLocator).element(this.locationLink);
    }

    clickItemLocation(name: string) {
        return this.getItemLocation(name).click();
    }

    // empty state methods
    isEmptyList(): promise.Promise<boolean> {
        return this.emptyList.isPresent();
    }

    isEmptyWithDragAndDrop(): promise.Promise<boolean> {
        return this.emptyFolderDragAndDrop.isDisplayed();
    }

    getEmptyDragAndDropText(): promise.Promise<string> {
        return this.isEmptyWithDragAndDrop()
            .then(() => {
                return this.emptyFolderDragAndDrop.getText();
            })
            .catch(() => '');
    }

    getEmptyStateTitle(): promise.Promise<string> {
        return this.isEmptyList()
            .then(() => {
                return this.emptyListTitle.getText();
            })
            .catch(() => '');
    }

    getEmptyStateText(): promise.Promise<string> {
        return this.isEmptyList()
            .then(() => {
                return this.emptyListText.getText();
            })
            .catch(() => '');
    }
}
