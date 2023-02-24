/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { BaseComponent } from './base.component';
import { Page } from '@playwright/test';
import { MatMenuComponent } from './mat-menu.component';

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
      await this.page.locator('mat-progress-spinner').waitFor({ state: 'attached', timeout: 2000 });
      await this.page.locator('mat-progress-spinner').waitFor({ state: 'detached', timeout: 2000 });
    } catch (e) {
      this.logger.info('Spinner was not present');
    }
  }
}
