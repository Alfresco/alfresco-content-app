/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { browser, by, ElementArrayFinder, ElementFinder } from 'protractor';
import { Component } from '../component';
import { Menu } from '../menu/menu';
import { Utils, waitForPresence, waitUntilElementIsClickable } from '../../utilities';

export class DataTable extends Component {
  private static selectors = {
    columnHeader: '.adf-datatable-row .adf-datatable-cell-header .adf-datatable-cell-value',
    sortedColumnHeader: `
      .adf-datatable__header--sorted-asc .adf-datatable-cell-header-content .adf-datatable-cell-value,
      .adf-datatable__header--sorted-desc .adf-datatable-cell-header-content .adf-datatable-cell-value
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
  emptyListTitle = this.byCss('.adf-empty-content__title');
  emptyListSubtitle = this.byCss('.adf-empty-content__subtitle');
  emptySearchText = this.byCss('.empty-search__text');
  selectedRow = this.byCss('.adf-datatable-row.adf-is-selected');

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

  private getColumnHeaders(): ElementArrayFinder {
    const locator = by.css(DataTable.selectors.columnHeader);
    return this.head.all(locator);
  }

  async getColumnHeadersText(): Promise<string> {
    return this.getColumnHeaders().getText();
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

  private getRowFirstCell(name: string, location: string = ''): ElementFinder {
    return this.getRowCells(name, location).get(0);
  }

  async hasCheckMarkIcon(itemName: string, location: string = ''): Promise<boolean> {
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
      return row.$(DataTable.selectors.lockOwner).$('.aca-locked-by--name').getText();
    }
    return '';
  }

  async doubleClickOnRowByName(name: string, location: string = ''): Promise<void> {
    try {
      const item = this.getRowFirstCell(name, location);
      await waitUntilElementIsClickable(item);
      await browser.actions().mouseMove(item).perform();
      await browser.actions().doubleClick().perform();
    } catch (error) {
      console.error(`--- doubleClickOnRowByName catch : failed to double click on ${name} from location : ${location} : `, error);
    }
  }

  async selectItem(name: string, location: string = ''): Promise<void> {
    const isSelected = await this.hasCheckMarkIcon(name, location);
    if (!isSelected) {
      try {
        const item = this.getRowFirstCell(name, location);
        await item.click();
      } catch (e) {
        console.error(`--- select item catch : failed to select ${name} from location : ${location} : `, e);
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
        console.error(`--- unselect item catch : failed to unselect ${name} from location : ${location} : `, e);
      }
    }
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
      console.error('------ clearSelection catch : ', error);
    }
  }

  private getItemLocationEl(name: string): ElementFinder {
    return this.getRowByName(name).element(by.css('.aca-location-link'));
  }

  async clickItemLocation(name: string): Promise<void> {
    await this.getItemLocationEl(name).click();
  }

  async isEmpty(): Promise<boolean> {
    return this.emptyList.isPresent();
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
}
