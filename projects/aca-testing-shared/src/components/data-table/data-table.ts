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

import { browser, by, ElementArrayFinder, ElementFinder, protractor } from 'protractor';
import { BrowserActions, BrowserVisibility, Logger } from '@alfresco/adf-testing';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';
import { Menu } from '../menu/menu';
import { Utils, waitForPresence } from '../../utilities/utils';

export class DataTable extends Component {
  private static selectors = {
    columnHeader: '.adf-datatable-row .adf-datatable-cell-header .adf-datatable-cell-value',
    sortedColumnHeader: `
      .adf-datatable__header--sorted-asc .adf-datatable-cell-value,
      .adf-datatable__header--sorted-desc .adf-datatable-cell-value
    `,
    row: '.adf-datatable-row[data-automation-id^="datatable-row"]',
    cell: '.adf-datatable-cell-container',
    lockOwner: '.aca-locked-by',
    searchResultsRow: 'aca-search-results-row',
    searchResultsRowLine: 'span'
  };

  head = this.byCss('.adf-datatable-header');
  body = this.byCss('.adf-datatable-body');
  emptyList = this.byCss('div.adf-no-content-container');
  emptyFolderDragAndDrop = this.byCss('.adf-empty-list_template .adf-empty-folder');
  emptyListTitle = this.byCss('.adf-empty-content__title');
  emptyListSubtitle = this.byCss('.adf-empty-content__subtitle');
  emptySearchText = this.byCss('.empty-search__text');
  selectedRow = this.byCss('.adf-datatable-row.adf-is-selected');

  columnModified = this.byCss('.adf-datatable-header [data-automation-id="auto_id_modifiedAt"]');

  menu = new Menu();

  constructor(ancestor?: string) {
    super('adf-datatable', ancestor);
  }

  async waitForHeader(): Promise<void> {
    return waitForPresence(this.head, '--- timeout waitForHeader ---');
  }

  async waitForBody(): Promise<void> {
    return waitForPresence(this.body, '--- timeout waitForBody ---');
  }

  async waitForEmptyState(): Promise<void> {
    return waitForPresence(this.emptyList);
  }

  private getColumnHeaders(): ElementArrayFinder {
    const locator = by.css(DataTable.selectors.columnHeader);
    return this.head.all(locator);
  }

  async getColumnHeadersText(): Promise<string> {
    return this.getColumnHeaders().getText();
  }

  getColumnHeaderByLabel(label: string): ElementFinder {
    const locator = by.cssContainingText(DataTable.selectors.columnHeader, label);
    return this.head.element(locator);
  }

  async sortBy(label: string, order: 'asc' | 'desc'): Promise<void> {
    const sortColumn = await this.getSortedColumnHeaderText();
    const sortOrder = await this.getSortingOrder();

    if (sortColumn !== label) {
      await this.getColumnHeaderByLabel(label).click();
      if (sortOrder !== order) {
        await this.getColumnHeaderByLabel(label).click();
      }
    }
  }

  async sortByModified(order: 'asc' | 'desc'): Promise<void> {
    const sortOrder = await this.getSortingOrder();
    const sortColumn = await this.getSortedColumnHeaderText();

    if (sortColumn !== 'Modified') {
      await this.columnModified.click();
      if (sortOrder !== order) {
        await this.columnModified.click();
      }
    }
  }

  private getSortedColumnHeader(): ElementFinder {
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

  private getRows(): ElementArrayFinder {
    return this.body.all(by.css(DataTable.selectors.row));
  }

  async getRowsCount(): Promise<number> {
    return this.getRows().count();
  }

  private getSelectedRows(): ElementArrayFinder {
    return this.body.all(by.css('.adf-datatable-row.adf-is-selected'));
  }

  async getSelectedRowsNames(): Promise<string[]> {
    return this.getSelectedRows().map((row) => {
      return row.element(by.css('.adf-datatable-cell[title="Name"]')).getText();
    });
  }

  async getSelectedRowsCount(): Promise<number> {
    return this.getSelectedRows().count();
  }

  getRowByName(name: string, location: string = ''): ElementFinder {
    if (location) {
      return this.body
        .all(by.cssContainingText(DataTable.selectors.row, name))
        .filter(async (elem) => browser.isElementPresent(elem.element(by.cssContainingText(DataTable.selectors.cell, location))))
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

  private getRowFirstCell(name: string, location: string = ''): ElementFinder {
    return this.getRowCells(name, location).get(0);
  }

  private getRowNameCell(name: string, location: string = ''): ElementFinder {
    return this.getRowCells(name, location).get(1);
  }

  private getRowNameCellSpan(name: string, location: string = ''): ElementFinder {
    return this.getRowNameCell(name, location).$('span');
  }

  async getItemNameTooltip(name: string, location: string = ''): Promise<string> {
    return this.getRowNameCellSpan(name, location).getAttribute('title');
  }

  async hasCheckMarkIcon(itemName: string, location: string = ''): Promise<boolean> {
    Logger.info(`--- check if item already selected : ${itemName} ${location}`);
    const row = this.getRowByName(itemName, location);
    return row.element(by.css('.mat-icon[class*="selected"]')).isPresent();
  }

  async hasLockIcon(itemName: string, location: string = ''): Promise<boolean> {
    const row = this.getRowByName(itemName, location);
    return row.element(by.css('img[src*="lock"]')).isPresent();
  }

  private async hasLockOwnerInfo(itemName: string, location: string = ''): Promise<boolean> {
    const row = this.getRowByName(itemName, location);
    return row.element(by.css(DataTable.selectors.lockOwner)).isPresent();
  }

  async getLockOwner(itemName: string, location: string = ''): Promise<string> {
    if (await this.hasLockOwnerInfo(itemName, location)) {
      const row = this.getRowByName(itemName, location);
      return row.$(DataTable.selectors.lockOwner).$('.locked_by--name').getText();
    }
    return '';
  }

  async getLockOwnerToolTip(itemName: string, location: string = ''): Promise<string> {
    if (await this.hasLockIcon(itemName, location)) {
      const row = this.getRowByName(itemName, location);
      return BrowserActions.getAttribute(row.element(by.css('img[src*="lock"]')), 'alt');
    }
    return '';
  }

  private getNameLink(itemName: string): ElementFinder {
    return this.getRowNameCell(itemName).$('.adf-datatable-link [role="link"]');
  }

  async hasLinkOnName(itemName: string): Promise<boolean> {
    return this.getNameLink(itemName).isPresent();
  }

  async doubleClickOnRowByName(name: string, location: string = ''): Promise<void> {
    try {
      const item = this.getRowFirstCell(name, location);
      await BrowserVisibility.waitUntilElementIsClickable(item);
      await browser.actions().mouseMove(item).perform();
      await browser.actions().doubleClick().perform();
    } catch (error) {
      Logger.error(`--- doubleClickOnRowByName catch : failed to double click on ${name} from location : ${location} : `, error);
    }
  }

  async selectItem(name: string, location: string = ''): Promise<void> {
    const isSelected = await this.hasCheckMarkIcon(name, location);
    if (!isSelected) {
      try {
        Logger.info(`--- selecting item : ${name} ${location}`);
        const item = this.getRowFirstCell(name, location);
        await item.click();
      } catch (e) {
        Logger.error(`--- select item catch : failed to select ${name} from location : ${location} : `, e);
      }
    }
  }

  async unselectItem(name: string, location: string = ''): Promise<void> {
    const isSelected = await this.hasCheckMarkIcon(name, location);
    if (isSelected) {
      try {
        const item = this.getRowFirstCell(name, location);
        await item.click();
      } catch (e) {
        Logger.error(`--- unselect item catch : failed to unselect ${name} from location : ${location} : `, e);
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
      if (count > 0) {
        await browser.refresh();
        await this.wait();
      }
    } catch (error) {
      Logger.error('------ clearSelection catch : ', error);
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

  private getItemLocationEl(name: string): ElementFinder {
    return this.getRowByName(name).element(by.css('.aca-location-link'));
  }

  async getItemLocation(name: string): Promise<string> {
    return this.getItemLocationEl(name).getText();
  }

  async getItemLocationTooltip(name: string): Promise<string> {
    const location = this.getItemLocationEl(name).$('a');
    const condition = () => location.getAttribute('title').then((value) => value && value.length > 0);

    await browser.actions().mouseMove(location).perform();

    await browser.wait(condition, BROWSER_WAIT_TIMEOUT);
    return location.getAttribute('title');
  }

  async clickItemLocation(name: string): Promise<void> {
    await this.getItemLocationEl(name).click();
  }

  async isEmpty(): Promise<boolean> {
    return this.emptyList.isPresent();
  }

  async getEmptyDragAndDropText(): Promise<string> {
    const isEmpty = await this.emptyFolderDragAndDrop.isDisplayed();
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
      return this.byCss('adf-custom-empty-content-template').getText();
    }
    return '';
  }

  async getCellsContainingName(name: string): Promise<string[]> {
    const rows = this.getRows().all(by.cssContainingText(DataTable.selectors.cell, name));
    return rows.map(async (cell) => {
      return cell.getText();
    });
  }

  async hasContextMenu(): Promise<boolean> {
    const count = await this.menu.getItemsCount();
    return count > 0;
  }

  async getLibraryRole(name: string): Promise<string> {
    return this.getRowByName(name).element(by.css('adf-library-role-column')).getText();
  }

  async isItemPresent(name: string, location?: string): Promise<boolean> {
    return this.getRowByName(name, location).isPresent();
  }

  private async getEntireDataTableText(): Promise<string[]> {
    return this.getRows().map((row) => {
      return row.all(by.css(DataTable.selectors.cell)).map(async (cell) => {
        return cell.getText();
      });
    });
  }

  async getSitesNameAndVisibility(): Promise<any> {
    const data: string[] = await this.getEntireDataTableText();
    return data.reduce((acc: any, cell) => {
      acc[cell[1]] = cell[4].toUpperCase();
      return acc;
    }, {});
  }

  async getSitesNameAndRole(): Promise<any> {
    const data: string[] = await this.getEntireDataTableText();
    return data.reduce((acc: any, cell) => {
      acc[cell[1]] = cell[3];
      return acc;
    }, {});
  }

  private getSearchResultsRows(): ElementArrayFinder {
    return this.body.all(by.css(DataTable.selectors.searchResultsRow));
  }

  getNthSearchResultsRow(nth: number): ElementFinder {
    return this.getSearchResultsRows().get(nth - 1);
  }

  private getSearchResultsRowByName(name: string, location: string = ''): ElementFinder {
    if (location) {
      return this.body
        .all(by.cssContainingText(DataTable.selectors.searchResultsRow, name))
        .filter(async (elem) => browser.isElementPresent(elem.element(by.cssContainingText(DataTable.selectors.searchResultsRowLine, location))))
        .first();
    }
    return this.body.element(by.cssContainingText(DataTable.selectors.searchResultsRow, name));
  }

  private getSearchResultNameLink(itemName: string, location: string = ''): ElementFinder {
    return this.getSearchResultsRowByName(itemName, location).$('.link');
  }

  async hasLinkOnSearchResultName(itemName: string, location: string = ''): Promise<boolean> {
    return this.getSearchResultNameLink(itemName, location).isPresent();
  }

  async clickSearchResultNameLink(itemName: string, location: string = ''): Promise<void> {
    await this.getSearchResultNameLink(itemName, location).click();
  }
}
