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

import { BaseComponent } from './base.component';
import { Page } from '@playwright/test';
import { MatMenuComponent } from './dataTable/mat-menu.component';
import { MenuComponent } from './menu.component';
import { timeouts } from '../../utils';

export enum PaginationActionsType {
  PageSizeSelector = 'Page size selector',
  CurrentPageSelector = 'Current page selector',
  NextPageSelector = 'Next page button'
}

export class PaginationComponent extends BaseComponent {
  private static rootElement = 'adf-pagination';

  constructor(page: Page) {
    super(page, PaginationComponent.rootElement);
  }

  range = this.getChild('.adf-pagination__range');
  maxItems = this.getChild('.adf-pagination__max-items');
  currentPage = this.getChild('.adf-pagination__current-page');
  totalPages = this.getChild('.adf-pagination__total-pages');
  previousButton = this.getChild('.adf-pagination__previous-button');
  nextButton = this.getChild('.adf-pagination__next-button');
  maxItemsButton = this.getChild('.adf-pagination__max-items + button[mat-icon-button]');

  private itemsPerPageMenu = new MatMenuComponent(this.page);
  public menu = new MenuComponent(this.page);

  public currentPageLocator = this.getChild('.adf-pagination__current-page');
  public totalPageLocator = this.getChild('.adf-pagination__total-pages');
  public getArrowLocatorFor = (action: PaginationActionsType) => this.getChild(`[aria-label="${action}"]`);

  async setItemsPerPage(amount: number): Promise<void> {
    await this.getArrowLocatorFor(PaginationActionsType.PageSizeSelector).click();
    await this.itemsPerPageMenu.getButtonByText(amount.toString()).click();
    await this.spinnerWaitForReload();
  }

  async navigateToPage(pageNumber: number): Promise<void> {
    await this.getArrowLocatorFor(PaginationActionsType.CurrentPageSelector).click();
    await this.itemsPerPageMenu.getButtonByText(pageNumber.toString()).click();
    await this.spinnerWaitForReload();
  }

  async spinnerWaitForReload(): Promise<void> {
    try {
      await this.page.locator('mat-progress-spinner').waitFor({ state: 'attached', timeout: 2000 });
      await this.page.locator('mat-progress-spinner').waitFor({ state: 'detached', timeout: 2000 });
    } catch (e) {
      this.logger.info('Spinner was not present');
    }
  }

  async getRange(): Promise<string> {
    return this.range.innerText();
  }

  async getMaxItems(): Promise<string> {
    return this.maxItems.innerText();
  }

  async getCurrentPage(): Promise<string> {
    return this.currentPage.innerText();
  }

  async getTotalPages(): Promise<string> {
    return this.totalPages.innerText();
  }

  async isPreviousEnabled(): Promise<boolean> {
    return this.previousButton.isEnabled();
  }

  async isNextEnabled(): Promise<boolean> {
    await this.page.waitForTimeout(timeouts.tiny);
    return this.nextButton.isEnabled();
  }

  async clickOnNextPage(): Promise<void> {
    return await this.nextButton.click();
  }

  async clickOnPreviousPage(): Promise<void> {
    return await this.previousButton.click();
  }

  async openMaxItemsMenu(): Promise<void> {
    try {
      await this.maxItemsButton.waitFor({ state: 'visible' });
      await this.maxItemsButton.click();
    } catch (error) {
      throw new Error(`Open max items catch: ${error}`);
    }
  }

  async resetToDefaultPageSize(): Promise<void> {
    try {
      await this.openMaxItemsMenu();
      await this.menu.clickNthItem(1);
      await this.page.waitForTimeout(timeouts.tiny);
    } catch (error) {
      throw new Error(`Reset to default page size catch: ${error}`);
    }
  }
}
