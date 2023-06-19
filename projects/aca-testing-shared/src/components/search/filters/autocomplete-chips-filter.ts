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
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { browser, by, ElementArrayFinder, ElementFinder, protractor } from 'protractor';
import { GenericFilter } from './generic-filter';

export class AutocompleteChipsFilter extends GenericFilter {
  private readonly locators = {
    selectedOption: '.mat-chip span',
    input: '.mat-menu-content input',
  };

  constructor(filterName: string) {
      super(filterName);
  }

  selectedOptions: ElementArrayFinder = this.filterDialogOpened.all(by.css(this.locators.selectedOption));

  get filterInput(): ElementFinder {
    return this.filterDialogOpened.element(by.css(this.locators.input));
  }

  async getFiltersSelectedValues(): Promise<string[]> {
    return this.selectedOptions.map((option) => {
      return option.getText();
    });
  }

  async isFilterAutocompleteInputDisplayed(): Promise<boolean> {
    return this.filterInput.isDisplayed();
  }

  async setAutocompleteInputValue(value: string): Promise<void> {
    await this.filterInput.sendKeys(value);
    await browser.actions().sendKeys(protractor.Key.ENTER).perform();
  }
}
