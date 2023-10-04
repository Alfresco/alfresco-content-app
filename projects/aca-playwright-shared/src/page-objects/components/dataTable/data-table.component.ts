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
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../base.component';
import { MatMenuComponent } from './mat-menu.component';
import { PaginationActionsType, PaginationComponent } from '../pagination.component';

export class DataTableComponent extends BaseComponent {
  private static rootElement = 'adf-datatable';
  contextMenuActions = new MatMenuComponent(this.page);

  constructor(page: Page, rootElement = DataTableComponent.rootElement) {
    super(page, rootElement);
  }

  public pagination = new PaginationComponent(this.page);
  getEmptyFolderLocator = this.getChild('.adf-empty-folder');
  getEmptyContentTitleLocator = this.getChild('adf-empty-content .adf-empty-content__title');
  getEmptyContentSubTitleLocator = this.getChild('adf-empty-content .adf-empty-content__subtitle');
  getSelectedRow = this.getChild('.adf-datatable-row.adf-is-selected');

  /** Locator for row (or rows) */
  getRowLocator = this.getChild(`adf-datatable-row`);

  /** Locator to get "No results found" message */
  getNoResultsFoundMessage = this.getChild('adf-custom-empty-content-template', { hasText: "No results found" });

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
   * Method used in cases where user have possibility to navigate "inside" the element (it's clickable and has link attribute).
   * Perform action .click() to navigate inside it
   *
   * @returns reference to cell element which contains link.
   */
  getCellLinkByName = (name: string): Locator => this.getChild('.adf-cell-value span', { hasText: name });

  /**
   * Method used in cases where we want to localize the element by [aria-label]
   *
   * @returns reference to cell element.
   */
  getByAriaLabelTitle = (title: string): Locator => this.getChild(`[aria-label="${title}"]`);

  /**
   * Method used in cases where we want to get the button (hamburger menu) for row element
   *
   * @returns reference to menu placed in row localized by the name
   */
  getActionsButtonByName = (name: string): Locator =>
    this.getRowByName(name).locator('mat-icon', { hasText: new RegExp(`^\\s*more_vert\\s*$`, 'g') });

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
  getCheckboxForElement = (item: string): Locator => this.getRowByName(item).locator('mat-checkbox');

  getColumnHeaderByTitleLocator = (headerTitle: string): Locator => this.getChild('[role="columnheader"]', { hasText: headerTitle });

  getSearchResultLinkByName = (name: string): Locator => this.getChild('.aca-search-results-row span[role="link"]', { hasText: name });

  async sortBy(columnTitle: string, order: 'Ascending' | 'Descending'): Promise<void> {
    const columnHeaderLocator = this.getColumnHeaderByTitleLocator(columnTitle);
    await this.spinnerWaitForReload();
    await columnHeaderLocator.click();

    const sortAttribute = await columnHeaderLocator.getAttribute('aria-sort');
    if (sortAttribute !== order) {
      await columnHeaderLocator.click();
    }

    await this.spinnerWaitForReload();
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
   * Click action from the expandable kebab menu for the element in datatable
   *
   * @param name title of the record you would like to proceed
   * @param action provide button title for the action
   * @param subAction if the action is in sub menu, then provide it here
   */
  async performActionForElement(name: string, action: string, subAction?: string): Promise<void> {
    await this.getActionsButtonByName(name).click();
    await this.contextMenuActions.getButtonByText(action).click();

    if (subAction) {
      await this.contextMenuActions.getButtonByText(subAction).click();
    }
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

    if ((await this.pagination.currentPageLocator.textContent()) !== ' Page 1 ') {
      await this.pagination.navigateToPage(1);
    }

    const maxPages = (await this.pagination.totalPageLocator.textContent()).match(/\d/)[0];
    for (let page = 1; page <= Number(maxPages); page++) {
      if (await this.getRowByName(name).isVisible()) {
        break;
      }
      await this.pagination.getArrowLocatorFor(PaginationActionsType.NextPageSelector).isEnabled();
      await this.pagination.getArrowLocatorFor(PaginationActionsType.NextPageSelector).click();
      await this.spinnerWaitForReload();
    }
  }

  async selectItem(name: string): Promise<void> {
    const isSelected = await this.hasCheckMarkIcon(name);
    if (!isSelected) {
      const row = this.getRowByName(name);
      await row.locator('.mat-checkbox[id*="mat-checkbox"]').check();
    }
  }

  async hasCheckMarkIcon(itemName: string): Promise<boolean> {
    const row = this.getRowByName(itemName);
    return await row.locator('.mat-checkbox[class*="checked"]').isVisible();
  }
}
