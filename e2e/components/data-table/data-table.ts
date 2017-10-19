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

import { ElementFinder, ElementArrayFinder, promise, by, browser, ExpectedConditions as EC } from 'protractor';
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
        row: 'tr'
    };

    private head: ElementFinder = this.component.element(by.css(DataTable.selectors.head));
    private body: ElementFinder = this.component.element(by.css(DataTable.selectors.body));

    constructor(ancestor?: ElementFinder) {
        super(DataTable.selectors.root, ancestor);
    }

    // Wait methods (waits for elements)
    waitForHeader() {
        return browser.wait(EC.presenceOf(this.head), BROWSER_WAIT_TIMEOUT);
    }

    // waitForEmptyState() {}

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

    getNthRow(nth: number): ElementFinder {
        return this.getRows().get(nth - 1);
    }

    getRowByContainingText(text: string): ElementFinder {
        const locator = by.cssContainingText(DataTable.selectors.row, text);
        return this.body.element(locator);
    }

    countRows(): promise.Promise<number> {
        return this.getRows().count();
    }

    // Navigation/selection methods
    doubleClickOnRowByContainingText(text: string): promise.Promise<void> {
        const row = this.getRowByContainingText(text);
        const dblClick = browser.actions().mouseMove(row).click().click();

        return dblClick.perform();
    }

    clickOnRowByContainingText(text: string): promise.Promise<void> {
        const row = this.getRowByContainingText(text);
        const click = browser.actions().mouseMove(row).click();

        return click.perform();
    }
}
