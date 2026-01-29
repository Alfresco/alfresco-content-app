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

import { BaseComponent } from './base.component';
import { Locator, Page } from '@playwright/test';
import { MatMenuComponent } from './dataTable/mat-menu.component';
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

  private range = this.getChild('.adf-pagination__range');
  private maxItems = this.getChild('.adf-pagination__max-items');
  private currentPage = this.getChild('.adf-pagination__current-page');
  private totalPages = this.getChild('.adf-pagination__total-pages');
  private previousButton = this.getChild('.adf-pagination__previous-button');
  private nextButton = this.getChild('.adf-pagination__next-button');
  private maxItemsButton = this.getChild('.adf-pagination__max-items + button[mat-icon-button]');

  private itemsPerPageMenu = new MatMenuComponent(this.page);

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
      await this.page.locator('[role="progressbar"]').waitFor({ state: 'attached', timeout: 2000 });
      await this.page.locator('[role="progressbar"]').waitFor({ state: 'detached', timeout: 2000 });
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
    try {
      if (await this.isNextEnabled()) {
        await this.nextButton.click();
      }
    } catch (error) {
      throw new Error(`Failed on previous click: ${error}`);
    }
  }

  async clickOnPreviousPage(): Promise<void> {
    try {
      if (await this.isPreviousEnabled()) {
        await this.previousButton.click();
      }
    } catch (error) {
      throw new Error(`Failed on previous click: ${error}`);
    }
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
      await this.clickNthItem(1);
      await this.page.waitForTimeout(timeouts.tiny);
    } catch (error) {
      throw new Error(`Reset to default page size catch: ${error}`);
    }
  }

  async clickMenuItem(menuItem: string): Promise<void> {
    try {
      await this.page.getByRole('menuitem', { name: menuItem }).click();
    } catch (e) {
      throw new Error(`Click menu item catch : failed to click on: ${e}`);
    }
  }

  async getNthItem(nth: number): Promise<Locator> {
    return this.page.getByRole('menuitem').nth(nth - 1);
  }

  async getItemsCount(): Promise<number> {
    return this.page.getByRole('menuitem').count();
  }

  async clickNthItem(nth: number): Promise<void> {
    try {
      await (await this.getNthItem(nth)).click();
    } catch (e) {
      throw new Error(`Click nth menu item catch: ${e}`);
    }
  }

  async closeMenu(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }

  async isRangePresent(): Promise<boolean> {
    return this.range.isVisible();
  }

  async getMaxRange(): Promise<string> {
    return this.range.textContent();
  }

  async isMaxItemsPresent(): Promise<boolean> {
    return this.maxItems.isVisible();
  }

  async isCurrentPagePresent(): Promise<boolean> {
    return this.currentPage.isVisible();
  }

  async isTotalPagesPresent(): Promise<boolean> {
    return this.totalPages.isVisible();
  }

  async isPreviousButtonPresent(): Promise<boolean> {
    return this.previousButton.isVisible();
  }

  async isNextButtonPresent(): Promise<boolean> {
    return this.nextButton.isVisible();
  }
}
