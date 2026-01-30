/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../base.component';
import { MatMenuComponent } from './mat-menu.component';
import { PaginationActionsType, PaginationComponent } from '../pagination.component';
import { timeouts } from '../../../utils';

export class DataTableComponent extends BaseComponent {
  private static rootElement = 'adf-datatable';
  contextMenuActions = new MatMenuComponent(this.page);

  constructor(page: Page, rootElement = DataTableComponent.rootElement) {
    super(page, rootElement);
  }

  public pagination = new PaginationComponent(this.page);
  body = this.getChild('.adf-datatable-body');
  getEmptyFolderLocator = this.getChild('.adf-empty-folder');
  getEmptyContentTitleLocator = this.getChild('adf-empty-content .adf-empty-content__title');
  getEmptyContentSubTitleLocator = this.getChild('adf-empty-content .adf-empty-content__subtitle');
  getSelectedRow = this.getChild('.adf-datatable-row.adf-is-selected');
  sortedColumnHeader = this.getChild(`.adf-datatable__header--sorted-asc .adf-datatable-cell-header-content .adf-datatable-cell-value,
                                      .adf-datatable__header--sorted-desc .adf-datatable-cell-header-content .adf-datatable-cell-value`);
  columnHeaders = this.getChild('.adf-datatable-row .adf-datatable-cell-header .adf-datatable-cell-value');
  emptyList = this.getChild('div.adf-no-content-container');
  emptyListTitle = this.getChild('.adf-empty-content__title');
  emptyListSubtitle = this.getChild('.adf-empty-content__subtitle');
  emptySearchText = this.getChild('.empty-search__text');
  emptyListTest = this.getChild('adf-custom-empty-content-template');
  paginationButton = this.page.locator('.adf-pagination__block button').nth(0);
  paginationOptions = this.page.locator('#cdk-overlay-0 button');
  sitesVisibility = this.page.locator('.adf-datatable-body [data-automation-id*="datatable-row"] [aria-label="Visibility"]');
  sitesName = this.page.locator('.adf-datatable-body [data-automation-id*="datatable-row"] [aria-label="Name"]');
  sitesRole = this.page.locator('.adf-datatable-body [data-automation-id*="datatable-row"] [aria-label="My Role"]');
  lockOwner = this.page.locator('.aca-locked-by--name');
  highlightedText = '.aca-highlight';
  searchFileName = '.search-file-name';
  searchFileDescription = '[data-automation-id="search-results-entry-description"]';
  searchFileContent = '.aca-result-content';

  /** Locator for row (or rows) */
  getRowLocator = this.page.getByRole('rowgroup').nth(1).locator('adf-datatable-row');

  /** Locator to get "No results found" message */
  getNoResultsFoundMessage = this.getChild('adf-custom-empty-content-template', { hasText: 'No results found' });

  /**
   * Method used in cases where we want to check that some record is visible in the datatable. It will consider whole row
   *
   * @returns reference to cell element which contains text.
   */
  getRowByName = (name: string | number): Locator => this.getChild(`adf-datatable-row`, { hasText: name.toString() });

  /**
   * Method used in cases where we want to check that some record is visible in the datatable.
   * But we want to check it by column header title and value of this column.
   *
   * @returns reference to cell element which contains text.
   */
  getRowByColumnTitleAndItsCellValue = (columnTitle: string, cellValue: string | number): Locator =>
    this.page.locator(`//div[contains(@title, '${columnTitle}')]//span[contains(text(), '${cellValue}')]/ancestor::adf-datatable-row`);

  /**
   * Method used in cases where we want to retrieve a row from the datatable based on its numerical order within the array.
   *
   * @returns reference to cell element which contains text.
   */
  getNthRow = (orderNum: number): Locator => this.getRowLocator.nth(orderNum);

  /**
   * Method used in cases where user have possibility to navigate "inside" the element (it's clickable and has link attribute).
   * Perform action .click() to navigate inside it
   *
   * @returns reference to cell element which contains link.
   */
  getCellLinkByName = (name: string): Locator => this.getChild('.adf-cell-value span[role="link"]', { hasText: name });

  /**
   * Method used in cases where we want to localize the element by [aria-label]
   *
   * @returns reference to cell element.
   */
  getByAriaLabelTitle = (title: string): Locator => this.getChild(`[aria-label="${title}"]`);

  /**
   * Method used in cases where we want to get the edit button and there is no hamburger menu
   *
   * @returns reference to edit button placed in row localized by the name
   */
  getEditButtonByName = (name: string): Locator => this.getRowByName(name).locator('button#editButton');

  /**
   * Method used in cases where we want to get the button and there is no hamburger menu
   *
   * @returns reference to button placed in row localized by the name
   */
  getButtonByNameForSpecificRow = (elementTitleInRow: string, buttonTitle: string): Locator =>
    this.getRowByName(elementTitleInRow).locator('button', { hasText: buttonTitle });

  /**
   * Method used in cases where you want to get some specific cell (by column name) for row which contains some name/title/etc.
   *
   * @returns reference to cell element
   */
  getCellByColumnNameAndRowItem = (item: string | number, columnName: string): Locator => this.getRowByName(item).locator(`[title="${columnName}"]`);

  /**
   * Method used in cases where we want to get the checkbox for row element
   *
   * @returns reference to checkbox placed in row localized by the name
   */
  getCheckboxForElement = (item: string): Locator => this.getRowByName(item).locator('[type="checkbox"]');

  getColumnHeaderByTitleLocator = (headerTitle: string): Locator => this.getChild('[role="columnheader"]', { hasText: headerTitle });

  getSearchResultLinkByName = (name: string): Locator => this.getChild('.aca-search-results-row span[role="link"]', { hasText: name });

  getColumnValuesByName = (name: string): Locator => this.getChild(`div[title="${name}"] span`);

  getColumnHeaderByName = (headerTitle: string): Locator =>
    this.getChild('.adf-datatable-row .adf-datatable-cell-header .adf-datatable-cell-value', { hasText: headerTitle });

  async sortBy(label: string, order: 'asc' | 'desc'): Promise<void> {
    const sortColumn = await this.getSortedColumnHeaderText();
    let sortOrder = await this.getSortingOrder();
    if (sortColumn !== label) {
      await this.getColumnHeaderByName(label).hover();
      await this.getColumnHeaderByName(label).click({ force: true });
      sortOrder = await this.getSortingOrder();
    }
    if (sortOrder !== order) {
      await this.getChild('span[class*="adf-datatable__header--sorted"]').click();
    }
  }

  /**
   * This method is used when we want to perform right mouse click on the dataTable row and perform some action
   *
   * @param name of the data table element with which we want to click
   * @param action provide which action you want to perform
   */
  async performActionFromExpandableMenu(name: string | number, action: string): Promise<void> {
    await this.goThroughPagesLookingForRowWithName(name);
    const actionButtonLocator = await this.getActionLocatorFromExpandableMenu(name, action);
    await actionButtonLocator.click();
    await this.spinnerWaitForReload();
  }

  /**
   * This method is used when we want to perform double click on the dataTable row to open a file or folder
   *
   * @param name of the data table element with which we want to double click
   */
  async performClickFolderOrFileToOpen(name: string): Promise<void> {
    await this.getCellLinkByName(name).click();
    await this.spinnerWaitForReload();
  }

  async isItemPresent(name: string): Promise<boolean> {
    await this.goThroughPagesLookingForRowWithName(name);
    return this.getRowByName(name).isVisible();
  }

  async getActionLocatorFromExpandableMenu(name: string | number, action: string): Promise<Locator> {
    await this.getRowByName(name).click({ button: 'right' });
    return this.contextMenuActions.getButtonByText(action);
  }

  async performActionInExpandableMenu(name: string | number, action: string): Promise<void> {
    await this.getRowByName(name).click({ button: 'right' });
    await this.contextMenuActions.getButtonByText(action).click();
  }

  async goThroughPagesLookingForRowWithName(name: string | number): Promise<void> {
    await this.spinnerWaitForReload();
    if (await this.getRowByName(name).isVisible()) {
      return null;
    }

    if (await this.pagination.currentPageLocator.isVisible()) {
      if ((await this.pagination.currentPageLocator.textContent()) === ' of 1 ') {
        return null;
      }
    }
    if (await this.pagination.totalPageLocator.isVisible()) {
      const maxPages = (await this.pagination.totalPageLocator?.textContent())?.match(/\d/)[0];
      for (let page = 1; page <= Number(maxPages); page++) {
        if (await this.getRowByName(name).isVisible()) {
          break;
        }
        if (await this.pagination.getArrowLocatorFor(PaginationActionsType.NextPageSelector).isEnabled()) {
          await this.pagination.getArrowLocatorFor(PaginationActionsType.NextPageSelector).click();
        }
        await this.spinnerWaitForReload();
      }
    }
  }

  async selectItems(...names: string[]): Promise<void> {
    for (const name of names) {
      const isSelected = await this.isRowSelected(name);
      if (!isSelected) {
        const row = this.getRowByName(name);
        await row.hover();
        if (!(await this.getCheckboxForElement(name).isChecked())) {
          await this.getCheckboxForElement(name).click();
        }
      }
    }
  }

  async isRowSelected(itemName: string): Promise<boolean> {
    const row = this.getRowByName(itemName);
    await row.hover();
    return this.getCheckboxForElement(itemName).isChecked();
  }

  async getColumnHeaders(): Promise<Array<string>> {
    const columnNameLocator = this.columnHeaders;
    await this.columnHeaders.nth(0).waitFor({ state: 'attached' });
    return columnNameLocator.allTextContents();
  }

  async getSortedColumnHeaderText(): Promise<string> {
    return this.sortedColumnHeader.innerText();
  }

  private getItemLocationEl(name: string): Locator {
    return this.getRowByName(name).locator('.aca-location-link');
  }

  async getItemLocationText(name: string): Promise<string> {
    await this.getItemLocationEl(name).locator('a').waitFor({ state: 'attached' });
    return this.getItemLocationEl(name).innerText();
  }

  async getItemLocationTooltip(name: string): Promise<string> {
    const location = this.getItemLocationEl(name);
    await location.hover();
    return location.locator('a').getAttribute('title', { timeout: timeouts.normal });
  }

  async clickItemLocation(name: string): Promise<void> {
    await this.getItemLocationEl(name).click();
  }

  async getSortingOrder(): Promise<string> {
    const str = await this.sortedColumnHeader.locator('../..').getAttribute('class');
    if (str.includes('asc')) {
      return 'asc';
    } else if (str.includes('desc')) {
      return 'desc';
    }
    return 'none';
  }

  async getRowAllInnerTexts(name: string): Promise<string> {
    return (await this.getRowByName(name).locator('span').allInnerTexts()).toString();
  }

  async getFirstElementDetail(name: string): Promise<string> {
    const firstNode = this.getColumnValuesByName(name).first();
    return firstNode.innerText();
  }

  async isEmpty(): Promise<boolean> {
    return this.emptyList.isVisible();
  }

  async getEmptyStateTitle(): Promise<string> {
    return (await this.isEmpty()) ? this.emptyListTitle.innerText() : '';
  }

  async getEmptyStateSubtitle(): Promise<string> {
    return (await this.isEmpty()) ? this.emptyListSubtitle.innerText() : '';
  }

  async getEmptyListText(): Promise<string> {
    return (await this.isEmpty()) ? this.emptyListTest.innerText() : '';
  }

  async getRowsCount(): Promise<number> {
    return this.getRowLocator.count();
  }

  async rightClickOnItem(itemName: string): Promise<void> {
    await this.getCellByColumnNameAndRowItem(itemName, 'Name').click({ button: 'right' });
  }

  async setPaginationTo50(): Promise<void> {
    await this.paginationButton.click();
    await this.paginationOptions.getByText('50').click();
  }

  /**
   * Method used to create objects from names and visibility of sites from datatable
   *
   * @returns an object with sites' names and their corresponding visibility values
   */
  async getSitesNameAndVisibility(): Promise<{ [siteName: string]: string }> {
    const rowsCount = await this.sitesName.count();
    const sitesInfo: { [siteName: string]: string } = {};
    for (let i = 0; i < rowsCount; i++) {
      let siteVisibilityText = await this.sitesVisibility.nth(i).textContent();
      let siteNameText = await this.sitesName.nth(i).textContent();
      siteVisibilityText = siteVisibilityText.trim().toUpperCase();
      siteNameText = siteNameText.trim();
      sitesInfo[siteNameText] = siteVisibilityText;
    }
    return sitesInfo;
  }

  /**
   * Method used to create objects from names and roles of sites from datatable
   *
   * @returns an object with sites' names and their corresponding role values
   */
  async getSitesNameAndRole(): Promise<{ [siteName: string]: string }> {
    const rowsCount = await this.sitesName.count();
    const sitesInfo: { [siteName: string]: string } = {};
    for (let i = 0; i < rowsCount; i++) {
      let siteNameText = await this.sitesName.nth(i).textContent();
      let siteRoleText = await this.sitesRole.nth(i).textContent();
      siteNameText = siteNameText.trim();
      siteRoleText = siteRoleText.trim();
      sitesInfo[siteNameText] = siteRoleText;
    }
    return sitesInfo;
  }

  async hasLockIcon(itemName: string): Promise<boolean> {
    const row = this.getRowByName(itemName);
    return row.locator('img[src*="lock"]').isVisible();
  }

  async getLockOwner(itemName: string): Promise<string> {
    const row = this.getRowByName(itemName);
    return row.locator(this.lockOwner).innerText();
  }

  async hasHighlightedText(location: 'name' | 'description' | 'content'): Promise<boolean> {
    switch (location) {
      case 'name':
        return this.page.locator(this.searchFileName).locator(this.highlightedText).isVisible();
      case 'description':
        return this.page.locator(this.searchFileDescription).locator(this.highlightedText).isVisible();
      case 'content':
        return this.page.locator(this.searchFileContent).locator(this.highlightedText).isVisible();
    }
  }
}
