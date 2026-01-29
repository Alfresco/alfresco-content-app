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

import { Page } from '@playwright/test';
import { BaseComponent } from '../base.component';

export type SortByType = 'Relevance' | 'Title' | 'Filename' | 'Modified date' | 'Modifier' | 'Created date' | 'Size' | 'Type';
export type SortByDirection = 'asc' | 'desc';

export class SearchSortingPicker extends BaseComponent {
  private static rootElement = '#aca-button-action-menu';

  public actionMenu = this.page.locator('[data-automation-id="auto_header_content_id_$thumbnail"]');
  public sortOrderButton = this.page.locator('#aca-button-sorting-menu');
  public sortByDropdownExpanded = this.page.locator('[role="menu"]').first();
  public sortByList = this.page.locator('[role="menu"] button');

  constructor(page: Page, rootElement = SearchSortingPicker.rootElement) {
    super(page, rootElement);
  }

  async waitForSortByDropdownToExpand(): Promise<void> {
    await this.sortByDropdownExpanded.waitFor();
  }

  async isSortOrderButtonDisplayed(): Promise<boolean> {
    return this.sortOrderButton.isVisible();
  }

  async isSortByDropdownExpanded(): Promise<boolean> {
    return this.sortByDropdownExpanded.isVisible();
  }

  async clickSortByDropdown(): Promise<void> {
    await this.sortOrderButton.click();
    await this.waitForSortByDropdownToExpand();
  }

  async getSortByOptionsList(): Promise<string[]> {
    const sortOptionsCount = await this.sortByList.count();
    const sortByOptions: string[] = [];
    for (let i = 1; i < sortOptionsCount; i++) {
      const textContent = (await this.sortByList.nth(i).textContent()).trim();
      sortByOptions.push(textContent);
    }
    sortByOptions.sort((a, b) => a.localeCompare(b));
    return sortByOptions;
  }

  async sortBy(option: SortByType, direction: SortByDirection): Promise<void> {
    await this.actionMenu.click();
    await this.clickSortByDropdown();

    if (!(await this.isSortByDropdownExpanded())) {
      await this.clickSortByDropdown();
    }
    const elem = this.sortByList.getByText(option);
    const optionId = await elem.locator('..').getAttribute('id');
    await elem.click();
    const directionSortElement = this.page.locator(`[id="${optionId}-${direction.toLocaleLowerCase()}"]`);
    await directionSortElement.click();
    await this.progressBarWaitForReload();
  }
}
