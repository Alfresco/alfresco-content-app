/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../base.component';
import { MatMenuComponent } from './mat-menu.component';

export class DataTableComponent extends BaseComponent {
  private static rootElement = 'adf-datatable';
  contextMenuActions = new MatMenuComponent(this.page);

  constructor(page: Page, rootElement = DataTableComponent.rootElement) {
    super(page, rootElement);
  }

  public getEmptyFolderLocator = this.getChild('.adf-empty-folder');
  public getEmptyContentTitleLocator = this.getChild('adf-empty-content .adf-empty-content__title');
  public getEmptyContentSubTitleLocator = this.getChild('adf-empty-content .adf-empty-content__subtitle');

  /** Locator for row (or rows) */
  public getRowLocator = this.getChild(`adf-datatable-row`);

  /**
   * Method used in cases where we want to check that some record is visible in the datatable. It will consider whole row
   *
   * @returns reference to cell element which contains text.
   */
  public getRowByName = (name: string | number): Locator => this.getChild(`adf-datatable-row`, { hasText: name.toString() });

  /**
   * Method used in cases where we want to check that some record is visible in the datatable.
   * But we want to check it by column header title and value of this column.
   *
   * @returns reference to cell element which contains text.
   */
  public getRowByColumnTitleAndItsCellValue = (columnTitle: string, cellValue: string | number): Locator =>
    this.page.locator(`//div[contains(@title, '${columnTitle}')]//span[contains(text(), '${cellValue}')]/ancestor::adf-datatable-row`);

  /**
   * Method used in cases where user have possibility to navigate "inside" the element (it's clickable and has link attribute).
   * Perform action .click() to navigate inside it
   *
   * @returns reference to cell element which contains link.
   */
  public getCellLinkByName = (name: string): Locator => this.getChild('.adf-datatable-cell-value[role="link"]', { hasText: name });

  /**
   * Method used in cases where we want to localize the element by [aria-label]
   *
   * @returns reference to cell element.
   */
  public getByAriaLabelTitle = (title: string): Locator => this.getChild(`[aria-label="${title}"]`);

  /**
   * Method used in cases where we want to get the button (hamburger menu) for row element
   *
   * @returns reference to menu placed in row localized by the name
   */
  public getActionsButtonByName = (name: string): Locator =>
    this.getRowByName(name).locator('mat-icon', { hasText: new RegExp(`^\\s*more_vert\\s*$`, 'g') });

  /**
   * Method used in cases where we want to get the edit button and there is no hamburger menu
   *
   * @returns reference to edit button placed in row localized by the name
   */
  public getEditButtonByName = (name: string): Locator => this.getRowByName(name).locator('button#editButton');

  /**
   * Method used in cases where we want to get the button and there is no hamburger menu
   *
   * @returns reference to button placed in row localized by the name
   */
  public getButtonByNameForSpecificRow = (elementTitleInRow: string, buttonTitle: string): Locator =>
    this.getRowByName(elementTitleInRow).locator('button', { hasText: buttonTitle });

  /**
   * Method used in cases where you want to get some specific cell (by column name) for row which contains some name/title/etc.
   *
   * @returns reference to cell element
   */
  public getCellByColumnNameAndRowItem = (item: string | number, columnName: string): Locator =>
    this.getRowByName(item).locator(`[title="${columnName}"]`);

  /**
   * Method used in cases where we want to get the checkbox for row element
   *
   * @returns reference to checkbox placed in row localized by the name
   */
  public getCheckboxForElement = (item: string): Locator => this.getRowByName(item).locator('mat-checkbox');

  public getColumnHeaderByTitleLocator = (headerTitle: string): Locator => this.getChild('[role="columnheader"]', { hasText: headerTitle });

  async sortBy(columnTitle: string, order: 'Ascending' | 'Descending'): Promise<void> {
    const columnHeaderLocator = this.getColumnHeaderByTitleLocator(columnTitle);
    await this.spinnerWaitForReload();
    await columnHeaderLocator.click();

    const sortAttribute = await columnHeaderLocator.getAttribute('aria-sort');
    if (!(sortAttribute === order)) {
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

  async getActionLocatorFromExpandableMenu(name: string | number, action: string): Promise<Locator> {
    await this.getRowByName(name).click({ button: 'right' });
    return this.contextMenuActions.getButtonByText(action);
  }
}
