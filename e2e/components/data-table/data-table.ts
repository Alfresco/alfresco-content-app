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

import { ElementFinder, ElementArrayFinder, promise, by, browser, ExpectedConditions as EC, protractor } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';
import { Utils } from '../../utilities/utils';

export class DataTable extends Component {
    private static selectors = {
        root: 'adf-datatable',

        head: '.adf-datatable-header',
        columnHeader: '.adf-datatable-row .adf-datatable-table-cell-header',
        sortedColumnHeader: `
            .adf-data-table__header--sorted-asc,
            .adf-data-table__header--sorted-desc
        `,

        body: '.adf-datatable-body',
        row: '.adf-datatable-row[role]',
        selectedRow: '.adf-datatable-row.is-selected',
        cell: '.adf-data-table-cell',
        locationLink: 'aca-location-link',
        linkCell: '.adf-location-cell',

        selectedIcon: '.mat-icon',

        emptyListContainer: 'div.adf-no-content-container',
        emptyFolderDragAndDrop: '.adf-empty-list_template .adf-empty-folder',

        emptyListTitle: '.adf-empty-content__title',
        emptyListSubtitle: '.adf-empty-content__subtitle',
        emptyListText: '.adf-empty-content__text'
    };

    head: ElementFinder = this.component.element(by.css(DataTable.selectors.head));
    body: ElementFinder = this.component.element(by.css(DataTable.selectors.body));
    cell = by.css(DataTable.selectors.cell);
    locationLink = by.css(DataTable.selectors.locationLink);
    linkCell: ElementFinder = this.component.element(by.css(DataTable.selectors.linkCell));
    emptyList: ElementFinder = this.component.element(by.css(DataTable.selectors.emptyListContainer));
    emptyFolderDragAndDrop: ElementFinder = this.component.element(by.css(DataTable.selectors.emptyFolderDragAndDrop));
    emptyListTitle: ElementFinder = this.component.element(by.css(DataTable.selectors.emptyListTitle));
    emptyListSubtitle: ElementFinder = this.component.element(by.css(DataTable.selectors.emptyListSubtitle));
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

    getSortingOrder() {
        return this.getSortedColumnHeader().getAttribute('class')
            .then(str => {
                if (str.includes('asc')) {
                    return 'asc';
                } else {
                    if (str.includes('desc')) {
                        return 'desc';
                    }
                }
            });
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

    countSelectedRows(): promise.Promise<number> {
        return this.getSelectedRows().count();
    }

    getNthRow(nth: number): ElementFinder {
        return this.getRows().get(nth - 1);
    }

    getRowName(name: string): ElementFinder {
        return this.body.element(by.cssContainingText(`.adf-data-table-cell span`, name));
    }

    getItemNameTooltip(name: string): promise.Promise<string> {
        return this.getRowName(name).getAttribute('title');
    }

    countRows(): promise.Promise<number> {
        return this.getRows().count();
    }

    hasCheckMarkIcon(itemName: string) {
        return this.getRowName(itemName).element(by.xpath(`./ancestor::div[contains(@class, 'adf-datatable-row')]`))
            .element(by.css(DataTable.selectors.selectedIcon)).isPresent();
    }

    // Navigation/selection methods
    doubleClickOnItemName(name: string): promise.Promise<any> {
        const dblClick = browser.actions()
            .mouseMove(this.getRowName(name))
            .click()
            .click();

        return dblClick.perform();
    }

    // Navigation/selection methods
    doubleClickOnItemNameRow(name: string): promise.Promise<any> {
        const dblClick = browser.actions()
            .mouseMove(this.getRowName(name).element(by.xpath(`./ancestor::div[contains(@class, 'adf-datatable-row')]`)))
            .click()
            .click();

        return dblClick.perform();
    }

    clickOnItemName(name: string): promise.Promise<any> {
        const item = this.getRowName(name);
        return Utils.waitUntilElementClickable(item)
            .then(() => this.getRowName(name).click());
    }

    clickOnItemNameRow(name: string): promise.Promise<any> {
        const item = this.getRowName(name);
        return Utils.waitUntilElementClickable(item)
            .then(() => this.getRowName(name)
                .element(by.xpath(`./ancestor::div[contains(@class, 'adf-datatable-row')]`))
                .click());
    }

    selectMultipleItemsRow(names: string[]): promise.Promise<void> {
        return this.clearSelection()
            .then(() => browser.actions().sendKeys(protractor.Key.COMMAND).perform())
            .then(() => {
                names.forEach(name => {
                    this.clickOnItemNameRow(name);
                });
            })
            .then(() => browser.actions().sendKeys(protractor.Key.NULL).perform());
    }

    selectMultipleItems(names: string[]): promise.Promise<void> {
        return this.clearSelection()
            .then(() => browser.actions().sendKeys(protractor.Key.COMMAND).perform())
            .then(() => {
                names.forEach(name => {
                    this.clickOnItemName(name);
                });
            })
            .then(() => browser.actions().sendKeys(protractor.Key.NULL).perform());
    }

    clearSelection(): promise.Promise<void> {
        return this.getSelectedRows().count()
            .then(count => {
                if (count !== 0) { browser.refresh().then(() => this.waitForHeader()); }
            });
    }

    getItemLocation(name: string) {
        return this.getRowName(name).element(by.xpath(`./ancestor::div[contains(@class, 'adf-datatable-row')]`))
            .element(this.locationLink);
    }

    getItemLocationTooltip(name: string): promise.Promise<string> {
        return this.getItemLocation(name).$('a').getAttribute('title');
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
            });
    }

    getEmptyStateTitle(): promise.Promise<string> {
        return this.isEmptyList()
            .then(() => {
                return this.emptyListTitle.getText();
            });
    }

    getEmptyStateSubtitle(): promise.Promise<string> {
        return this.isEmptyList()
            .then(() => {
                return this.emptyListSubtitle.getText();
            });
    }

    getEmptyStateText(): promise.Promise<string> {
        return this.isEmptyList()
            .then(() => {
                return this.emptyListText.getText();
            });
    }

    getCellsContainingName(name: string) {
        return this.getRows().all(by.cssContainingText(DataTable.selectors.cell, name))
            .map(cell => cell.getText());
    }
}
