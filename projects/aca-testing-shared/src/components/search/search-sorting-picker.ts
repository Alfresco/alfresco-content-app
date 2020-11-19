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

import { by, browser } from 'protractor';
import { Component } from '../component';
import { isPresentAndDisplayed } from '../../utilities/utils';
import { BrowserActions, BrowserVisibility } from '@alfresco/adf-testing';

export type SortByType = 'Relevance' | 'Title' | 'Filename' | 'Modified date' | 'Modifier' | 'Created date' | 'Size' | 'Type';
export type SortOrderType = 'ASC' | 'DESC' | '';

export class SearchSortingPicker extends Component {
  sortOrderButton = this.byCss('button[mat-icon-button]');
  sortByDropdownCollapsed = this.byCss('.mat-select');
  sortByDropdownExpanded = browser.element(by.css('.mat-select-panel'));
  sortByList = this.sortByDropdownExpanded.all(by.css('.mat-option .mat-option-text'));

  constructor(ancestor?: string) {
    super('adf-search-sorting-picker', ancestor);
  }

  async waitForSortByDropdownToExpand(): Promise<void> {
    await BrowserVisibility.waitUntilElementIsVisible(
      this.sortByDropdownExpanded,
      BrowserVisibility.DEFAULT_TIMEOUT,
      'Timeout waiting for sortBy dropdown to expand'
    );
  }

  async isSortOrderButtonDisplayed(): Promise<boolean> {
    return isPresentAndDisplayed(this.sortOrderButton);
  }

  async getSortOrder(): Promise<SortOrderType> {
    const orderArrow = await this.sortOrderButton.getText();

    if (orderArrow.includes('upward')) {
      return 'ASC';
    } else if (orderArrow.includes('downward')) {
      return 'DESC';
    } else {
      return '';
    }
  }

  async isSortByOptionDisplayed(): Promise<boolean> {
    return isPresentAndDisplayed(this.sortByDropdownCollapsed);
  }

  async isSortByDropdownExpanded(): Promise<boolean> {
    return isPresentAndDisplayed(this.sortByDropdownExpanded);
  }

  async getSelectedSortByOption(): Promise<string> {
    return this.sortByDropdownCollapsed.getText();
  }

  async clickSortByDropdown(): Promise<void> {
    await BrowserActions.click(this.sortByDropdownCollapsed);
    await this.waitForSortByDropdownToExpand();
  }

  async getSortByOptionsList(): Promise<string[]> {
    return this.sortByList.map(async (option) => {
      return option.getText();
    });
  }

  async sortBy(option: SortByType): Promise<void> {
    if (!(await this.isSortByDropdownExpanded())) {
      await this.clickSortByDropdown();
    }
    const elem = browser.element(by.cssContainingText('.mat-option .mat-option-text', option));
    await BrowserActions.click(elem);
  }

  async setSortOrderASC(): Promise<void> {
    if ((await this.getSortOrder()) !== 'ASC') {
      await BrowserActions.click(this.sortOrderButton);
    }
  }

  async setSortOrderDESC(): Promise<void> {
    if ((await this.getSortOrder()) !== 'DESC') {
      await BrowserActions.click(this.sortOrderButton);
    }
  }
}
