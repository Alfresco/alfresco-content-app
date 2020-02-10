/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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

import { ElementFinder, ElementArrayFinder, by, browser, ExpectedConditions as EC, protractor } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';
import { Menu } from '../menu/menu';
import { Utils } from '../../utilities/utils';

export class DataTable extends Component {
  private static selectors = {
    root: 'adf-datatable',

    head: '.adf-datatable-header',
    columnHeader: '.adf-datatable-row .adf-datatable-cell-header .adf-datatable-cell-value',
    sortedColumnHeader: `
      .adf-datatable__header--sorted-asc .adf-datatable-cell-value,
      .adf-datatable__header--sorted-desc .adf-datatable-cell-value
    `,

    body: '.adf-datatable-body',
    row: '.adf-datatable-row[role]',
    selectedRow: '.adf-datatable-row.adf-is-selected',
    cell: '.adf-datatable-cell-container',
    locationLink: '.aca-location-link',
    nameLink: '.adf-datatable-link',
    libraryRole: 'adf-library-role-column',

    selectedIcon: '.mat-icon[class*="selected"]',
    lockIcon: 'img[src*="lock"]',
    lockOwner: '.aca-locked-by',

    emptyListContainer: 'div.adf-no-content-container',
    emptyFolderDragAndDrop: '.adf-empty-list_template .adf-empty-folder',

    emptyListTitle: '.adf-empty-content__title',
    emptyListSubtitle: '.adf-empty-content__subtitle',

    emptySearchText: '.empty-search__text',

    searchResultsRow: 'aca-search-results-row',
    searchResultsRowLine: '.line',
    searchResultsNameLink: '.link'
  };

  head: ElementFinder = this.component.element(by.css(DataTable.selectors.head));
  body: ElementFinder = this.component.element(by.css(DataTable.selectors.body));

  emptyList: ElementFinder = this.component.element(by.css(DataTable.selectors.emptyListContainer));
  emptyFolderDragAndDrop: ElementFinder = this.component.element(by.css(DataTable.selectors.emptyFolderDragAndDrop));
  emptyListTitle: ElementFinder = this.component.element(by.css(DataTable.selectors.emptyListTitle));
  emptyListSubtitle: ElementFinder = this.component.element(by.css(DataTable.selectors.emptyListSubtitle));

  emptySearchText: ElementFinder = this.component.element(by.css(DataTable.selectors.emptySearchText));

  menu: Menu = new Menu();

  constructor(ancestor?: string) {
    super(DataTable.selectors.root, ancestor);
  }

  // Wait methods (waits for elements)
  async waitForHeader(): Promise<void> {
    await browser.wait(EC.presenceOf(this.head), BROWSER_WAIT_TIMEOUT, '--- timeout waitForHeader ---');
  }

  async waitForBody(): Promise<void> {
    await browser.wait(EC.presenceOf(this.body), BROWSER_WAIT_TIMEOUT, '--- timeout waitForBody ---');
  }

  async waitForEmptyState(): Promise<void> {
    await browser.wait(EC.presenceOf(this.emptyList), BROWSER_WAIT_TIMEOUT);
  }

  // Header/Column methods
  getColumnHeaders(): ElementArrayFinder {
    const locator = by.css(DataTable.selectors.columnHeader);
    return this.head.all(locator);
  }

  async getColumnHeadersText(): Promise<string> {
    const el = this.getColumnHeaders();
    return el.getText();
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

  async getSortedColumnHeaderText(): Promise<string> {
    return this.getSortedColumnHeader().getText();
  }

  async getSortingOrder(): Promise<string> {
    const str = await this.getSortedColumnHeader().element(by.xpath('..')).getAttribute('class');
    if (str.includes('asc')) {
      return 'asc';
    }

    if (str.includes('desc')) {
      return 'desc';
    }

    return 'none';
  }

  async sortByColumn(columnName: string): Promise<void> {
    const column = this.getColumnHeaderByLabel(columnName);
    const click = browser.actions().mouseMove(column).click();

    await click.perform();
  }

  // Rows methods
  getRows(): ElementArrayFinder {
    return this.body.all(by.css(DataTable.selectors.row));
  }

  async getRowsCount(): Promise<number> {
    return this.getRows().count();
  }

  async waitForRowToBeSelected(): Promise<void> {
    await browser.wait(EC.presenceOf(this.component.element(by.css(DataTable.selectors.selectedRow))), BROWSER_WAIT_TIMEOUT, 'timeout waiting for row to be selected');
  }

  getSelectedRows(): ElementArrayFinder {
    return this.body.all(by.css(DataTable.selectors.selectedRow));
  }

  async getSelectedRowsNames(): Promise<string[]> {
    const rowsText: string[] = await this.getSelectedRows().map((row) => {
      return row.element(by.css('.adf-datatable-cell[title="Name"]')).getText();
    });
    return rowsText;
  }

  async getSelectedRowsCount(): Promise<number> {
    return this.getSelectedRows().count();
  }

  getNthRow(nth: number): ElementFinder {
    return this.getRows().get(nth - 1);
  }

  getRowByName(name: string, location: string = ''): ElementFinder {
    if (location) {
      return this.body.all(by.cssContainingText(DataTable.selectors.row, name))
        .filter(async (elem) => await browser.isElementPresent(elem.element(by.cssContainingText(DataTable.selectors.cell, location))))
        .first();
    }
    return this.body.element(by.cssContainingText(DataTable.selectors.row, name));
  }

  getRowCells(name: string, location: string = ''): ElementArrayFinder {
    return this.getRowByName(name, location).all(by.css(DataTable.selectors.cell));
  }

  async getRowCellsCount(itemName: string): Promise<number> {
    return this.getRowCells(itemName).count();
  }

  getRowFirstCell(name: string, location: string = ''): ElementFinder {
    return this.getRowCells(name, location).get(0);
  }

  getRowNameCell(name: string, location: string = ''): ElementFinder {
    return this.getRowCells(name, location).get(1);
  }

  getRowNameCellSpan(name: string, location: string = ''): ElementFinder {
    return this.getRowNameCell(name, location).$('span');
  }

  async getItemNameTooltip(name: string, location: string = ''): Promise<string> {
    return this.getRowNameCellSpan(name, location).getAttribute('title');
  }

  async hasCheckMarkIcon(itemName: string, location: string = ''): Promise<boolean> {
    const row: ElementFinder = this.getRowByName(itemName, location);
    return row.element(by.css(DataTable.selectors.selectedIcon)).isPresent();
  }

  async hasLockIcon(itemName: string, location: string = ''): Promise<boolean> {
    const row: ElementFinder = this.getRowByName(itemName, location);
    return row.element(by.css(DataTable.selectors.lockIcon)).isPresent();
  }

  async hasLockOwnerInfo(itemName: string, location: string = ''): Promise<boolean> {
    const row: ElementFinder = this.getRowByName(itemName, location);
    return row.element(by.css(DataTable.selectors.lockOwner)).isPresent();
  }

  async getLockOwner(itemName: string, location: string = ''): Promise<string> {
    if (await this.hasLockOwnerInfo(itemName, location)) {
      const row = this.getRowByName(itemName, location);
      return row.$(DataTable.selectors.lockOwner).$('.locked_by--name').getText();
    }
    return '';
  }

  getNameLink(itemName: string): ElementFinder {
    return this.getRowNameCell(itemName).$(DataTable.selectors.nameLink);
  }

  async hasLinkOnName(itemName: string): Promise<boolean> {
    return this.getNameLink(itemName).isPresent();
  }

  // Navigation/selection methods
  async doubleClickOnRowByName(name: string, location: string = ''): Promise<void> {
    try {
      const item = this.getRowFirstCell(name, location);
      await Utils.waitUntilElementClickable(item);
      await browser.actions().mouseMove(item).perform();
      await browser.actions().doubleClick().perform();
    } catch (error) {
      console.log('--- catch: doubleClickOnRowByName', error);
    }
  }

  async selectItem(name: string, location: string = ''): Promise<void> {
    const isSelected = await this.hasCheckMarkIcon(name, location);
    if (!isSelected) {
      try {
        const item = this.getRowFirstCell(name, location);
        await item.click();

      } catch (e) {
        console.log('--- select item catch : ', e);
      }
    }
  }

  async clickItem(name: string, location: string = ''): Promise<void> {
    const item = this.getRowFirstCell(name, location);
    await item.click();
  }

  async clickNameLink(itemName: string): Promise<void> {
    await this.getNameLink(itemName).click();
  }

  async selectMultipleItems(names: string[], location: string = ''): Promise<void> {
    await this.clearSelection();
    await Utils.pressCmd();
    for (const name of names) {
      await this.selectItem(name, location);
    }
    await Utils.releaseKeyPressed();
  }

  async clearSelection(): Promise<void> {
    try {
      const count = await this.getSelectedRowsCount();
      if (count !== 0) {
        await browser.refresh();
        await this.wait();
      }
    } catch (error) {
      console.log('------ clearSelection catch : ', error);
    }
  }

  async rightClickOnItem(itemName: string): Promise<void> {
    const item = this.getRowFirstCell(itemName);
    await browser.actions().mouseMove(item).perform();
    await browser.actions().click(protractor.Button.RIGHT).perform();
  }

  async rightClickOnMultipleSelection(): Promise<void> {
    const itemFromSelection = this.getSelectedRows().get(0);
    await browser.actions().mouseMove(itemFromSelection).perform();
    await browser.actions().click(protractor.Button.RIGHT).perform();
  }

  getItemLocationEl(name: string): ElementFinder {
    return this.getRowByName(name).element(by.css(DataTable.selectors.locationLink));
  }

  async getItemLocation(name: string): Promise<string> {
    return this.getItemLocationEl(name).getText();
  }

  async getItemLocationTooltip(name: string): Promise<string> {
    const location = this.getItemLocationEl(name).$('a');
    const condition = () => location.getAttribute('title').then(value => value && value.length > 0);

    await browser.actions().mouseMove(location).perform();

    await browser.wait(condition, BROWSER_WAIT_TIMEOUT);
    return location.getAttribute('title');
  }

  async clickItemLocation(name: string): Promise<void> {
    await this.getItemLocationEl(name).click();
  }

  // empty state methods
  async isEmpty(): Promise<boolean> {
    return this.emptyList.isPresent();
  }

  async isEmptyWithDragAndDrop(): Promise<boolean> {
    return this.emptyFolderDragAndDrop.isDisplayed();
  }

  async getEmptyDragAndDropText(): Promise<string> {
    const isEmpty = await this.isEmptyWithDragAndDrop();
    if (isEmpty) {
      return this.emptyFolderDragAndDrop.getText();
    }
    return '';
  }

  async getEmptyStateTitle(): Promise<string> {
    const isEmpty = await this.isEmpty();
    if (isEmpty) {
      return this.emptyListTitle.getText();
    }
    return '';
  }

  async getEmptyStateSubtitle(): Promise<string> {
    const isEmpty = await this.isEmpty();
    if (isEmpty) {
      return this.emptyListSubtitle.getText();
    }
    return '';
  }

  async getEmptyListText(): Promise<string> {
    const isEmpty = await this.isEmpty();
    if (isEmpty) {
      return this.component.element(by.css('adf-custom-empty-content-template')).getText();
    }
    return '';
  }

  async getEmptySearchResultsText(): Promise<string> {
    return this.emptySearchText.getText();
  }

  async getCellsContainingName(name: string): Promise<string[]> {
    const rows: ElementArrayFinder = this.getRows().all(by.cssContainingText(DataTable.selectors.cell, name));
    const cellsText: string[] = await rows.map(async cell => {
      return cell.getText();
    });
    return cellsText;
  }

  async hasContextMenu(): Promise<boolean> {
    const count = await this.menu.getItemsCount();
    return count > 0;
  }

  async getLibraryRole(name: string): Promise<string> {
    return this.getRowByName(name).element(by.css(DataTable.selectors.libraryRole)).getText();
  }

  async isItemPresent(name: string, location? : string): Promise<boolean> {
    return this.getRowByName(name, location).isPresent();
  }

  async getEntireDataTableText(): Promise<string[]> {
    const text: string[] = await this.getRows().map((row) => {
      return row.all(by.css(DataTable.selectors.cell)).map(async cell => {
        return cell.getText();
      });
    });
    return text;
  }

  async getSitesNameAndVisibility(): Promise<{}> {
    const data = await this.getEntireDataTableText();
    return data.reduce((acc, cell) => {
      acc[cell[1]] = cell[3].toUpperCase();
      return acc;
    }, {});
  }

  async getSitesNameAndRole(): Promise<{}> {
    const data = await this.getEntireDataTableText();
    return data.reduce((acc, cell) => {
      acc[cell[1]] = cell[2];
      return acc;
    }, {});
  }

  getSearchResultsRows(): ElementArrayFinder {
    return this.body.all(by.css(DataTable.selectors.searchResultsRow));
  }

  getNthSearchResultsRow(nth: number): ElementFinder {
    return this.getSearchResultsRows().get(nth - 1);
  }

  getSearchResultsRowByName(name: string, location: string = ''): ElementFinder {
    if (location) {
      return this.body.all(by.cssContainingText(DataTable.selectors.searchResultsRow, name))
        .filter(async (elem) => await browser.isElementPresent(elem.element(by.cssContainingText(DataTable.selectors.searchResultsRowLine, location))))
        .first();
    }
    return this.body.element(by.cssContainingText(DataTable.selectors.searchResultsRow, name));
  }

  getSearchResultRowLines(name: string, location: string = ''): ElementArrayFinder {
    return this.getSearchResultsRowByName(name, location).all(by.css(DataTable.selectors.searchResultsRowLine));
  }

  async getSearchResultLinesCount(name: string, location: string = ''): Promise<number> {
    return this.getSearchResultRowLines(name, location).count();
  }

  getSearchResultNthLine(name: string, location: string = '', index: number): ElementFinder {
    return this.getSearchResultRowLines(name, location).get(index);
  }

  async getSearchResultNameAndTitle(name: string, location: string = ''): Promise<string> {
    return this.getSearchResultNthLine(name, location, 0).getText();
  }

  async getSearchResultDescription(name: string, location: string = ''): Promise<string> {
    return this.getSearchResultNthLine(name, location, 1).getText();
  }

  async getSearchResultModified(name: string, location: string = ''): Promise<string> {
    return this.getSearchResultNthLine(name, location, 2).getText();
  }

  async getSearchResultLocation(name: string, location: string = ''): Promise<string> {
    return this.getSearchResultNthLine(name, location, 3).getText();
  }

  getSearchResultNameLink(itemName: string, location: string = ''): ElementFinder {
    return this.getSearchResultsRowByName(itemName, location).$(DataTable.selectors.searchResultsNameLink);
  }

  async hasLinkOnSearchResultName(itemName: string, location: string = ''): Promise<boolean> {
    return this.getSearchResultNameLink(itemName, location).isPresent();
  }

  async clickSearchResultNameLink(itemName: string, location: string = ''): Promise<void> {
    await this.getSearchResultNameLink(itemName, location).click();
  }

}
