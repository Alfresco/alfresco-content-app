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

import { ElementFinder, ElementArrayFinder, by, browser } from 'protractor';
import { GenericFilter } from './generic-filter';
import { BrowserActions } from '@alfresco/adf-testing';

export class FacetFilter extends GenericFilter {
  private readonly locators = {
    checkbox: '.mat-menu-content .mat-checkbox',
    checkboxChecked: '.mat-menu-content .mat-checkbox.mat-checkbox-checked',
    categoryInput: '.mat-menu-content input[data-automation-id^="facet-result-filter"]',
    facetsFilter: '.mat-menu-content .adf-facet-result-filter'
  };

  get facets(): ElementArrayFinder {
    return this.filterDialogOpened.all(by.css(this.locators.checkbox));
  }
  get selectedFacets(): ElementArrayFinder {
    return this.filterDialogOpened.all(by.css(this.locators.checkboxChecked));
  }
  get facetsFilter(): ElementFinder {
    return this.filterDialogOpened.element(by.css(this.locators.facetsFilter));
  }
  get filterCategoryInput(): ElementFinder {
    return this.facetsFilter.element(by.css(this.locators.categoryInput));
  }

  async getFiltersValues(): Promise<string[]> {
    return this.facets.map((option) => {
      return option.getText();
    });
  }

  async getFiltersCheckedValues(): Promise<string[]> {
    return this.selectedFacets.map((option) => {
      return option.getText();
    });
  }

  async resetPanel(): Promise<void> {
    if ((await this.selectedFacets.count()) > 0) {
      await this.openDialog();
      await this.selectedFacets.each(async (elem) => {
        await BrowserActions.click(elem);
      });
    }
    await this.openDialog();
  }

  async isFilterFacetsDisplayed(): Promise<boolean> {
    return this.facetsFilter.isDisplayed();
  }

  async isFilterCategoryInputDisplayed(): Promise<boolean> {
    return this.filterCategoryInput.isDisplayed();
  }

  async checkCategory(name: string): Promise<void> {
    const option = this.facets.filter(async (elem) => (await elem.getText()).includes(name)).first();
    await browser.executeScript(`arguments[0].scrollIntoView();`, option);
    await browser.actions().mouseMove(option).perform();
    await browser.actions().click().perform();
  }

  async filterCategoriesBy(name: string): Promise<void> {
    await this.filterCategoryInput.sendKeys(name);
  }
}
