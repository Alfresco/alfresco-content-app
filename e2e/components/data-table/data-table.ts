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

import { ElementFinder, ElementArrayFinder, by, browser, ExpectedConditions as EC, protractor } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';
import { Menu } from '../menu/menu';
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
    locationLink: '.aca-location-link',
    nameLink: '.dl-link',

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
  nameLink: ElementFinder = browser.element(by.css(DataTable.selectors.nameLink));
  emptyList: ElementFinder = this.component.element(by.css(DataTable.selectors.emptyListContainer));
  emptyFolderDragAndDrop: ElementFinder = this.component.element(by.css(DataTable.selectors.emptyFolderDragAndDrop));
  emptyListTitle: ElementFinder = this.component.element(by.css(DataTable.selectors.emptyListTitle));
  emptyListSubtitle: ElementFinder = this.component.element(by.css(DataTable.selectors.emptyListSubtitle));
  emptyListText: ElementArrayFinder = this.component.all(by.css(DataTable.selectors.emptyListText));

  menu: Menu = new Menu();

  constructor(ancestor?: ElementFinder) {
    super(DataTable.selectors.root, ancestor);
  }

  // Wait methods (waits for elements)
  waitForHeader() {
    try {
      return browser.wait(EC.presenceOf(this.head), BROWSER_WAIT_TIMEOUT);
    } catch (error) {
      console.log('----- wait for header catch : ', error);
    }
  }

  async waitForEmptyState() {
    await browser.wait(EC.presenceOf(this.emptyList), BROWSER_WAIT_TIMEOUT);
  }

  // Header/Column methods
  getColumnHeaders() {
    const locator = by.css(DataTable.selectors.columnHeader);
    return this.head.all(locator);
  }

  async getHeaderText() {
    const el = this.getColumnHeaders();
    return await el.getText();
  }

  getNthColumnHeader(nth: number) {
    return this.getColumnHeaders().get(nth - 1);
  }

  getColumnHeaderByLabel(label: string) {
    const locator = by.cssContainingText(DataTable.selectors.columnHeader, label);
    return this.head.element(locator);
  }

  getSortedColumnHeader() {
    const locator = by.css(DataTable.selectors.sortedColumnHeader);
    return this.head.element(locator);
  }

  async getSortedColumnHeaderText() {
    return await this.getSortedColumnHeader().getText();
  }

  async getSortingOrder() {
    const str = await this.getSortedColumnHeader().getAttribute('class');
    if (str.includes('asc')) {
      return 'asc';
    }
    else {
      if (str.includes('desc')) {
        return 'desc';
      }
    }
  }

  async sortByColumn(columnName: string) {
    const column = this.getColumnHeaderByLabel(columnName);
    const click = browser.actions().mouseMove(column).click();

    await click.perform();
  }

  // Rows methods
  getRows() {
    return this.body.all(by.css(DataTable.selectors.row));
  }

  async countRows() {
    return await this.getRows().count();
  }

  getSelectedRows() {
    return this.body.all(by.css(DataTable.selectors.selectedRow));
  }

  async countSelectedRows() {
    return await this.getSelectedRows().count();
  }

  getNthRow(nth: number) {
    return this.getRows().get(nth - 1);
  }

  getRowByName(name: string) {
    return this.body.element(by.cssContainingText(DataTable.selectors.row, name));
  }

  getRowFirstCell(name: string) {
    return this.getRowByName(name).all(by.css(DataTable.selectors.cell)).get(0);
  }

  getRowNameCell(name: string) {
    return this.getRowByName(name).all(by.css(DataTable.selectors.cell)).get(1);
  }

  getRowNameCellText(name: string) {
    return this.getRowNameCell(name).$('span');
  }

  async getItemNameTooltip(name: string) {
    return await this.getRowNameCellText(name).getAttribute('title');
  }

  async hasCheckMarkIcon(itemName: string) {
    return await this.getRowByName(itemName).element(by.css(DataTable.selectors.selectedIcon)).isPresent();
  }

  getNameLink(itemName: string) {
    return this.getRowNameCell(itemName).$(DataTable.selectors.nameLink);
  }

  async hasLinkOnName(itemName: string) {
    return await this.getNameLink(itemName).isPresent();
  }

  // Navigation/selection methods
  async doubleClickOnRowByName(name: string) {
    const item = this.getRowFirstCell(name);
    await Utils.waitUntilElementClickable(item);
    await browser.actions().mouseMove(item).perform();
    await browser.actions().click().click().perform();
  }

  async selectItem(name: string) {
    try{
      const item = this.getRowFirstCell(name);
      // await Utils.waitUntilElementClickable(item);
      await item.click();

    } catch (e) {
      console.log('--- select item catch : ', e);
    }
  }

  async clickNameLink(itemName: string) {
    await this.getNameLink(itemName).click();
  }

  async selectMultipleItems(names: string[]) {
    await this.clearSelection();
    await browser.actions().sendKeys(protractor.Key.COMMAND).perform();
    for (const name of names) {
      await this.selectItem(name);
    }
    await browser.actions().sendKeys(protractor.Key.NULL).perform();
  }

  async clearSelection() {
    try {
      const count = await this.countSelectedRows();
      if (count !== 0) {
        await browser.refresh();
        await this.waitForHeader();
      }
    } catch (error) {
      console.log('------ clearSelection catch : ', error);
    }
  }

  async rightClickOnItem(itemName: string) {
    const item = this.getRowFirstCell(itemName);
    await browser.actions().click(item, protractor.Button.RIGHT).perform();
  }

  async rightClickOnMultipleSelection() {
    await this.waitForHeader();
    const itemFromSelection = this.getSelectedRows().get(0);
    await browser.actions().click(itemFromSelection, protractor.Button.RIGHT).perform();
  }

  getItemLocationEl(name: string) {
    return this.getRowByName(name).element(this.locationLink);
  }

  async getItemLocation(name: string) {
    return await this.getItemLocationEl(name).getText();
  }

  async getItemLocationTooltip(name: string) {
    return await this.getItemLocationEl(name).$('a').getAttribute('title');
  }

  async getItemLocationTileAttr(name: string) {
    const location = this.getItemLocationEl(name).$('a');
    const condition = () => location.getAttribute('title').then(value => value && value.length > 0);

    await browser.actions().mouseMove(location).perform();

    await browser.wait(condition, BROWSER_WAIT_TIMEOUT);
    return await location.getAttribute('title');
  }

  async clickItemLocation(name: string) {
    await this.getItemLocationEl(name).click();
  }

  // empty state methods
  async isEmptyList() {
    return await this.emptyList.isPresent();
  }

  async isEmptyWithDragAndDrop() {
    return await this.emptyFolderDragAndDrop.isDisplayed();
  }

  async getEmptyDragAndDropText() {
    const isEmpty = await this.isEmptyWithDragAndDrop();
    if (isEmpty) {
      return await this.emptyFolderDragAndDrop.getText();
    }
  }

  async getEmptyStateTitle() {
    const isEmpty = await this.isEmptyList();
    if (isEmpty) {
      return await this.emptyListTitle.getText();
    }
  }

  async getEmptyStateSubtitle() {
    const isEmpty = await this.isEmptyList();
    if (isEmpty) {
      return await this.emptyListSubtitle.getText();
    }
  }

  async getEmptyStateText() {
    const isEmpty = await this.isEmptyList();
    if (isEmpty) {
      return await this.emptyListText.getText();
    }
  }

  async getCellsContainingName(name: string) {
    const rows = this.getRows().all(by.cssContainingText(DataTable.selectors.cell, name));
    return rows.map(async cell => await cell.getText());
  }

  async hasContextMenu() {
    const count = await this.menu.getItemsCount();
    return count > 0;
  }
}
