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

import { BaseComponent } from '../../base.component';
import { Page } from '@playwright/test';
import { SearchPage } from '../../../pages';

type FilterTab = 'Created' | 'Modified';

export class SearchFiltersDate extends BaseComponent {
  private static rootElement = '.adf-search-filter-menu-card';

  constructor(page: Page) {
    super(page, SearchFiltersDate.rootElement);
  }

  public createdTab = this.getChild(`[role='tab']`, { hasText: 'Created' });
  public modifiedTab = this.getChild(`[role='tab']`, { hasText: 'Modified' });
  public createdTabTitle = this.createdTab.locator(`div`);
  public modifiedTabTitle = this.modifiedTab.locator(`div`);
  public anytimeButton = this.getChild(`[data-automation-id$='date-range-anytime']`);
  public anytimeRadioButton = this.anytimeButton.locator(`input`);
  public inTheLastButton = this.getChild(`[data-automation-id$='date-range-in-last']`);
  public inTheLastInput = this.getChild(`[data-automation-id$='date-range-in-last-input']`);
  public inTheLastDropdown = this.getChild(`[data-automation-id$='date-range-in-last-dropdown']`);
  public betweenButton = this.getChild(`[data-automation-id$='date-range-between']`);
  public betweenRadioButton = this.betweenButton.locator(`input`);
  public betweenStartDate = this.getChild(`[data-automation-id$='date-range-between-start-input']`);
  public betweenEndDate = this.getChild(`[data-automation-id$='date-range-between-end-input']`);

  async openCreatedModifiedTab(page: SearchPage, tab: FilterTab): Promise<void> {
    switch (tab) {
      case 'Created':
        await page.searchFiltersDate.createdTab.click();
        break;
      case 'Modified':
        await page.searchFiltersDate.modifiedTab.click();
        break;
      default:
        break;
    }
    await page.page.waitForTimeout(2000);
  }

  async isModifiedTabSelected(): Promise<string> {
    return this.modifiedTab.getAttribute('aria-selected');
  }

  async isSearchTabSelected(): Promise<string> {
    return this.createdTab.getAttribute('aria-selected');
  }
}
