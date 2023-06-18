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
