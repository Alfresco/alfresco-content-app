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

// import { browser, by, ElementArrayFinder, ElementFinder, protractor } from 'protractor';
// import { BrowserVisibility, Logger } from '@alfresco/adf-testing';
import { BROWSER_WAIT_TIMEOUT } from '../../utils/cy-configs';
import { CyComponent } from '../cy-component';
import { CyMenu } from '../menu/cy-menu';
import { CyUtils } from '../../utils/cy-utils';

export class CyDataTable extends CyComponent {
  columnHeader = '.adf-datatable-row .adf-datatable-cell-header .adf-datatable-cell-value';
  sortedColumnHeader = `
    .adf-datatable__header--sorted-asc .adf-datatable-cell-value,
    .adf-datatable__header--sorted-desc .adf-datatable-cell-value
  `;
  row = '.adf-datatable-row[data-automation-id^="datatable-row"]';
  cell = '.adf-datatable-cell-container';
  lockOwner = '.aca-locked-by';
  searchResultsRow = 'aca-search-results-row';
  searchResultsRowLine = '.line';

  head = '.adf-datatable-header';
  body = '.adf-datatable-body';
  emptyList = 'div.adf-no-content-container';
  emptyFolderDragAndDrop = '.adf-empty-list_template .adf-empty-folder';
  emptyListTitle = '.adf-empty-content__title';
  emptyListSubtitle = '.adf-empty-content__subtitle';
  emptySearchText = '.empty-search__text';
  selectedRow = '.adf-datatable-row.adf-is-selected';

  columnModified = '.adf-datatable-header [data-automation-id="auto_id_modifiedAt"]';

  locationLink = '.aca-location-link';

  root = 'adf-datatable';

  menu = new CyMenu();

  constructor(ancestor?: string) {
    super('adf-datatable', ancestor);
  }

  waitForHeader() {
    return cy.get(this.head).should('exist');
  }

  // async waitForBody(): Promise<void> {
  //   return waitForPresence(this.body, '--- timeout waitForBody ---');
  // }

  // async waitForEmptyState(): Promise<void> {
  //   return waitForPresence(this.emptyList);
  // }

  // private getColumnHeaders(): ElementArrayFinder {
  //   const locator = by.css(DataTable.selectors.columnHeader);
  //   return this.head.all(locator);
  // }

  getColumnHeadersText() {
    return cy
      .get(this.head)
      .find(this.columnHeader)
      .then(($els) => {
        return Cypress._.map(Cypress.$.makeArray($els), 'innerText');
      });
  }

  // getColumnHeaderByLabel(label: string): ElementFinder {
  //   const locator = by.cssContainingText(DataTable.selectors.columnHeader, label);
  //   return this.head.element(locator);
  // }

  // async sortBy(label: string, order: 'asc' | 'desc'): Promise<void> {
  //   const sortColumn = await this.getSortedColumnHeaderText();
  //   const sortOrder = await this.getSortingOrder();

  //   if (sortColumn !== label) {
  //     await this.getColumnHeaderByLabel(label).click();
  //     if (sortOrder !== order) {
  //       await this.getColumnHeaderByLabel(label).click();
  //     }
  //   }
  // }

  sortByModified(order: 'asc' | 'desc') {
    let sortOrder;
    this.getSortingOrder().then( result => sortOrder = result);
    let sortColumn;
    this.getSortedColumnHeaderText().then( result => sortColumn = result);

    if (sortColumn !== 'Modified') {
      cy.get(this.columnModified).click();
      if (sortOrder !== order) {
        cy.get(this.columnModified).click();
      }
    }
  }

  private getSortedColumnHeader() {
    const locator = this.sortedColumnHeader;
    return cy.get(this.head).get(locator);
  }

  getSortedColumnHeaderText() {
    return this.getSortedColumnHeader().invoke('text');
  }

  getSortingOrder() {
    return this.getSortedColumnHeader().invoke('attr', 'class').then( str => {
      return str.includes('asc') ? 'asc' : null;
    });
  }

  //   if (str.includes('desc')) {
  //     return 'desc';
  //   }

  //   return 'none';
  // }

  // private getRows() {
  //   return cy.get(this.body.all(by.css(DataTable.selectors.row));
  // }

  getRowsCount() {
    return cy.get(this.body).find(this.row).its('length');
  }

  // private getSelectedRows(): ElementArrayFinder {
  //   return this.body.all(by.css('.adf-datatable-row.adf-is-selected'));
  // }

  // async getSelectedRowsNames(): Promise<string[]> {
  //   return this.getSelectedRows().map((row) => {
  //     return row.element(by.css('.adf-datatable-cell[title="Name"]')).getText();
  //   });
  // }

  // async getSelectedRowsCount(): Promise<number> {
  //   return this.getSelectedRows().count();
  // }

  // getRowByName(name: string, location: string = '') {
  //   if (location) {
  //     return cy.get(this.body).find(this.row).contains(name).filter(this.cell).contains(location);
  //     // .all(by.cssContainingText(DataTable.selectors.row, name))
  //     // .filter(async (elem) => browser.isElementPresent(elem.element(by.cssContainingText(DataTable.selectors.cell, location))))
  //     // .first();
  //   }
  //   // return cy.get(this.row).contains(this.cell, name).parents(this.row);
  //   return cy.contains(this.cell, name).closest(this.row);
  // }

  getRowByName(name: string, location: string = '') {
//     if (location) {
//       return cy.get(this.body).get(this.row).contains(name).filter(this.cell).contains(location);
//       // .all(by.cssContainingText(DataTable.selectors.row, name))
//       // .filter(async (elem) => browser.isElementPresent(elem.element(by.cssContainingText(DataTable.selectors.cell, location))))
//       // .first();
//     }
//     return cy.contains(this.cell, name, { timeout: 8000 }).closest(this.row);
    return cy.contains(`${this.body} ${this.row}`, name);
  }

  // private getItemLocationEl(name: string) {
  //   return this.getRowByName(name).within(() => {
  //     return cy.get('.aca-location-link');
  //   });
  // }

  getItemLocation(name: string) {
    return this.getRowByName(name).within(() => {
      return cy.get(this.locationLink);
    });
  }

  getItemLocationTooltip(name: string) {
    return this.getRowByName(name)
      .find(`${this.locationLink} .adf-datatable-cell-value`)
      .invoke('show')
      .trigger('mouseenter')
      .wait(1000)
      .should('have.attr', 'title');
  }

  clickItemLocation(name: string) {
    return this.getRowByName(name).within(() => {
      return cy.get(this.locationLink).click();
    });
  }

  getItemNameTooltip(name: string, location: string = '') {
    // return this.getRowNameCellSpan(name, location).getAttribute('title');
    return this.getRowNameCell(name, location).find('span').should('have.attr', 'title');
  }

  // getRowCells(name: string, location: string = '') {
  //   return this.getRowByName(name, location); //.get(this.cell);
  // }

  // async getRowCellsCount(itemName: string): Promise<number> {
  //   return this.getRowCells(itemName).count();
  // }

  private getRowFirstCell(name: string, location: string = '') {
    return this.getRowByName(name, location).children().first();
  }

  private getRowNameCell(name: string, location: string = '') {
    return this.getRowByName(name, location).children().eq(1);
  }

  // private getRowNameCellSpan(name: string, location: string = ''): ElementFinder {
  //   return this.getRowNameCell(name, location).$('span');
  // }

  // async hasCheckMarkIcon(itemName: string, location: string = ''): Promise<boolean> {
  //   Logger.info(`--- check if item already selected : ${itemName} ${location}`);
  //   const row = this.getRowByName(itemName, location);
  //   return row.element(by.css('.mat-icon[class*="selected"]')).isPresent();
  // }

  // async hasLockIcon(itemName: string, location: string = ''): Promise<boolean> {
  //   const row = this.getRowByName(itemName, location);
  //   return row.element(by.css('img[src*="lock"]')).isPresent();
  // }

  // private async hasLockOwnerInfo(itemName: string, location: string = ''): Promise<boolean> {
  //   const row = this.getRowByName(itemName, location);
  //   return row.element(by.css(DataTable.selectors.lockOwner)).isPresent();
  // }

  // async getLockOwner(itemName: string, location: string = ''): Promise<string> {
  //   if (await this.hasLockOwnerInfo(itemName, location)) {
  //     const row = this.getRowByName(itemName, location);
  //     return row.$(DataTable.selectors.lockOwner).$('.locked_by--name').getText();
  //   }
  //   return '';
  // }

  // private getNameLink(itemName: string): ElementFinder {
  //   return this.getRowNameCell(itemName).$('.adf-datatable-link');
  // }

  // async hasLinkOnName(itemName: string): Promise<boolean> {
  //   return this.getNameLink(itemName).isPresent();
  // }

  doubleClickOnRowByName(name: string, location: string = '') {
    this.getRowFirstCell(name, location).trigger('click').trigger('click').wait(300);
  }

  // async selectItem(name: string, location: string = ''): Promise<void> {
  //   const isSelected = await this.hasCheckMarkIcon(name, location);
  //   if (!isSelected) {
  //     try {
  //       Logger.info(`--- selecting item : ${name} ${location}`);
  //       const item = this.getRowFirstCell(name, location);
  //       await item.click();
  //     } catch (e) {
  //       Logger.error(`--- select item catch : failed to select ${name} from location : ${location} : `, e);
  //     }
  //   }
  // }

  // async unselectItem(name: string, location: string = ''): Promise<void> {
  //   const isSelected = await this.hasCheckMarkIcon(name, location);
  //   if (isSelected) {
  //     try {
  //       const item = this.getRowFirstCell(name, location);
  //       await item.click();
  //     } catch (e) {
  //       Logger.error('--- unselect item catch : ', e);
  //     }
  //   }
  // }

  // async clickItem(name: string, location: string = ''): Promise<void> {
  //   const item = this.getRowFirstCell(name, location);
  //   await item.click();
  // }

  // async clickNameLink(itemName: string): Promise<void> {
  //   await this.getNameLink(itemName).click();
  // }

  // async selectMultipleItems(names: string[], location: string = ''): Promise<void> {
  //   await this.clearSelection();
  //   await Utils.pressCmd();
  //   for (const name of names) {
  //     await this.selectItem(name, location);
  //   }
  //   await Utils.releaseKeyPressed();
  // }

  // async clearSelection(): Promise<void> {
  //   try {
  //     const count = await this.getSelectedRowsCount();
  //     if (count > 0) {
  //       await browser.refresh();
  //       await this.wait();
  //     }
  //   } catch (error) {
  //     Logger.error('------ clearSelection catch : ', error);
  //   }
  // }

  // async rightClickOnItem(itemName: string): Promise<void> {
  //   const item = this.getRowFirstCell(itemName);
  //   await browser.actions().mouseMove(item).perform();
  //   await browser.actions().click(protractor.Button.RIGHT).perform();
  // }

  // async rightClickOnMultipleSelection(): Promise<void> {
  //   const itemFromSelection = this.getSelectedRows().get(0);
  //   await browser.actions().mouseMove(itemFromSelection).perform();
  //   await browser.actions().click(protractor.Button.RIGHT).perform();
  // }

  isEmpty() {
    return cy
      .get('adf-datatable')
      .find(this.emptyList)
      .then((elem) => {
        return elem.length > 0;
      });
  }

  isEmptyDragAndDrop() {
    return cy
      .get('adf-datatable')
      .find(this.emptyFolderDragAndDrop)
      .then((elem) => {
        return elem.length > 0;
      });
  }

  // async getEmptyDragAndDropText(): Promise<string> {
  //   const isEmpty = await this.emptyFolderDragAndDrop.isDisplayed();
  //   if (isEmpty) {
  //     return this.emptyFolderDragAndDrop.getText();
  //   }
  //   return '';
  // }

  getEmptyStateTitle() {
    if (this.isEmpty) {
      return cy.get(this.emptyListTitle).invoke('text');
    }
    return '';
  }

  getEmptyStateSubtitle() {
    if (this.isEmpty) {
      return cy.get(this.emptyListSubtitle).invoke('text');
    }
    return '';
  }

  getEmptyListText() {
    if (this.isEmpty) {
      return cy.get('adf-custom-empty-content-template').invoke('text');
    }
    return '';
  }

  getEmptySearchResultsText() {
    return cy.get(this.emptySearchText).invoke('text');
  }

  // async getCellsContainingName(name: string): Promise<string[]> {
  //   const rows = this.getRows().all(by.cssContainingText(DataTable.selectors.cell, name));
  //   return rows.map(async (cell) => {
  //     return cell.getText();
  //   });
  // }

  // async hasContextMenu(): Promise<boolean> {
  //   const count = await this.menu.getItemsCount();
  //   return count > 0;
  // }

  // async getLibraryRole(name: string): Promise<string> {
  //   return this.getRowByName(name).element(by.css('adf-library-role-column')).getText();
  // }

  isItemPresent(name: string, location?: string) {
    // cy.get(this.body)
    //   .within(() => {
    //     cy.get(this.row).should('exist');
    //   })
    //   .as('rows');

    cy.get(`${this.body} ${this.row}`).should('exist').as('rows');

    let isPresent = false;
    cy.get('@rows').each((row) => {
      const text = row.text();
      if (text.includes(name) && text.includes(location)) {
        isPresent = true;
      }
    });
    return isPresent;
  }

  // private async getEntireDataTableText(): Promise<string[]> {
  //   return this.getRows().map((row) => {
  //     return row.all(by.css(DataTable.selectors.cell)).map(async (cell) => {
  //       return cell.getText();
  //     });
  //   });
  // }

  // async getSitesNameAndVisibility(): Promise<any> {
  //   const data: string[] = await this.getEntireDataTableText();
  //   return data.reduce((acc: any, cell) => {
  //     acc[cell[1]] = cell[4].toUpperCase();
  //     return acc;
  //   }, {});
  // }

  // async getSitesNameAndRole(): Promise<any> {
  //   const data: string[] = await this.getEntireDataTableText();
  //   return data.reduce((acc: any, cell) => {
  //     acc[cell[1]] = cell[3];
  //     return acc;
  //   }, {});
  // }

  // private getSearchResultsRows(): ElementArrayFinder {
  //   return this.body.all(by.css(DataTable.selectors.searchResultsRow));
  // }

  // getNthSearchResultsRow(nth: number): ElementFinder {
  //   return this.getSearchResultsRows().get(nth - 1);
  // }

  // private getSearchResultsRowByName(name: string, location: string = ''): ElementFinder {
  //   if (location) {
  //     return this.body
  //       .all(by.cssContainingText(DataTable.selectors.searchResultsRow, name))
  //       .filter(async (elem) => browser.isElementPresent(elem.element(by.cssContainingText(DataTable.selectors.searchResultsRowLine, location))))
  //       .first();
  //   }
  //   return this.body.element(by.cssContainingText(DataTable.selectors.searchResultsRow, name));
  // }

  // private getSearchResultRowLines(name: string, location: string = ''): ElementArrayFinder {
  //   return this.getSearchResultsRowByName(name, location).all(by.css(DataTable.selectors.searchResultsRowLine));
  // }

  // async getSearchResultLinesCount(name: string, location: string = ''): Promise<number> {
  //   return this.getSearchResultRowLines(name, location).count();
  // }

  // private getSearchResultNthLine(name: string, location: string = '', index: number): ElementFinder {
  //   return this.getSearchResultRowLines(name, location).get(index);
  // }

  // async getSearchResultNameAndTitle(name: string, location: string = ''): Promise<string> {
  //   return this.getSearchResultNthLine(name, location, 0).getText();
  // }

  // async getSearchResultDescription(name: string, location: string = ''): Promise<string> {
  //   return this.getSearchResultNthLine(name, location, 1).getText();
  // }

  // async getSearchResultModified(name: string, location: string = ''): Promise<string> {
  //   return this.getSearchResultNthLine(name, location, 2).getText();
  // }

  // async getSearchResultLocation(name: string, location: string = ''): Promise<string> {
  //   return this.getSearchResultNthLine(name, location, 3).getText();
  // }

  // private getSearchResultNameLink(itemName: string, location: string = ''): ElementFinder {
  //   return this.getSearchResultsRowByName(itemName, location).$('.link');
  // }

  // async hasLinkOnSearchResultName(itemName: string, location: string = ''): Promise<boolean> {
  //   return this.getSearchResultNameLink(itemName, location).isPresent();
  // }

  // async clickSearchResultNameLink(itemName: string, location: string = ''): Promise<void> {
  //   await this.getSearchResultNameLink(itemName, location).click();
  // }
}
