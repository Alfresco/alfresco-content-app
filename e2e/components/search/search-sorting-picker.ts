/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { ElementFinder, by, browser, ExpectedConditions as EC, ElementArrayFinder } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';

export class SearchSortingPicker extends Component {
  private static selectors = {
    root: 'adf-search-sorting-picker',

    sortByOption: '.mat-option .mat-option-text'
  };

  sortOrderButton: ElementFinder = this.component.element(by.css('button[mat-icon-button]'));
  sortByDropdownCollapsed: ElementFinder = this.component.element(by.css('.mat-select'));
  sortByDropdownExpanded: ElementFinder = browser.element(by.css('.mat-select-panel'));
  sortByList: ElementArrayFinder = this.sortByDropdownExpanded.all(by.css(SearchSortingPicker.selectors.sortByOption));

  constructor(ancestor?: ElementFinder) {
    super(SearchSortingPicker.selectors.root, ancestor);
  }

  async waitForSortByDropdownToExpand(): Promise<void> {
    await browser.wait(EC.visibilityOf(this.sortByDropdownExpanded), BROWSER_WAIT_TIMEOUT, 'Timeout waiting for sortBy dropdown to expand');
  }

  async isSortOrderButtonDisplayed(): Promise<boolean> {
    return (await this.sortOrderButton.isPresent()) && (await this.sortOrderButton.isDisplayed());
  }

  async getSortOrder(): Promise<'ASC' | 'DESC' | ''> {
    const orderArrow = await this.sortOrderButton.getText();

    if ( orderArrow.includes('upward') ) {
      return 'ASC'
    } else if ( orderArrow.includes('downward') ) {
        return 'DESC'
      } else {
        return '';
      }
  }

  async isSortByOptionDisplayed(): Promise<boolean> {
    return (await this.sortByDropdownCollapsed.isPresent()) && (await this.sortByDropdownCollapsed.isDisplayed());
  }

  async isSortByDropdownExpanded(): Promise<boolean> {
    return (await this.sortByDropdownExpanded.isPresent()) && (await this.sortByDropdownExpanded.isDisplayed());
  }

  async getSelectedSortByOption(): Promise<string> {
    return await this.sortByDropdownCollapsed.getText();
  }

  async clickSortByDropdown(): Promise<void> {
    await this.sortByDropdownCollapsed.click();
    await this.waitForSortByDropdownToExpand();
  }

  async getSortByOptionsList(): Promise<string[]> {
    const list: string[] = await this.sortByList.map(async option => {
      return option.getText();
    });
    return list;
  }

  async sortByOption(option: string): Promise<void> {
    if ( !(await this.isSortByDropdownExpanded()) ) {
      await this.clickSortByDropdown();
    }
    const elem = browser.element(by.cssContainingText(SearchSortingPicker.selectors.sortByOption, option));
    await elem.click();
  }

  async sortByName(): Promise<void> {
    await this.sortByOption('Filename');
  }

  async sortByRelevance(): Promise<void> {
    await this.sortByOption('Relevance');
  }

  async sortByTitle(): Promise<void> {
    await this.sortByOption('Title');
  }

  async sortByModifiedDate(): Promise<void> {
    await this.sortByOption('Modified date');
  }

  async sortByModifier(): Promise<void> {
    await this.sortByOption('Modifier');
  }

  async sortByCreatedDate(): Promise<void> {
    await this.sortByOption('Created date');
  }

  async sortBySize(): Promise<void> {
    await this.sortByOption('Size');
  }

  async sortByType(): Promise<void> {
    await this.sortByOption('Type');
  }

  async setSortOrderASC(): Promise<void> {
    if ( (await this.getSortOrder()) !== 'ASC' ) {
      await this.sortOrderButton.click();
    }
  }

  async setSortOrderDESC(): Promise<void> {
    if ( (await this.getSortOrder()) !== 'DESC' ) {
      await this.sortOrderButton.click();
    }
  }
}
