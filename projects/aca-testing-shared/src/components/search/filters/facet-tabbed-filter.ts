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

import { ElementFinder, ElementArrayFinder, by, browser, protractor, element } from 'protractor';
import { BrowserVisibility } from '@alfresco/adf-testing';
import { GenericFilter } from './generic-filter';

export class FacetTabbedFilter extends GenericFilter {
  private readonly locators = {
    tabs: '.mat-tab-list .mat-tab-label',
    chipList: '.mat-tab-body-active .adf-chip-list',
    chipListInput: '.mat-tab-body-active .adf-chip-list input',
    currentTabLabel: '.mat-tab-label-active .mat-tab-label-content',
    chip: '.mat-chip span',
    option: '.mat-option-text'
  };

  chips: ElementArrayFinder = this.filterDialogOpened.all(by.css(this.locators.chip));

  get tabs(): ElementArrayFinder {
    return this.filterDialogOpened.all(by.css(this.locators.tabs));
  }

  get chipList(): ElementFinder {
    return this.filterDialogOpened.element(by.css(this.locators.chipList));
  }

  get chipListInput(): ElementFinder {
    return this.filterDialogOpened.element(by.css(this.locators.chipListInput));
  }

  get options(): ElementArrayFinder {
    return element.all(by.css(this.locators.option));
  }

  async getCurrentTabLabel(): Promise<string> {
    const label = this.filterDialogOpened.element(by.css(this.locators.currentTabLabel));
    return await label.getText();
  }

  async changeTabToModifier(): Promise<void> {
    await this.tabs.get(1).click();
    await BrowserVisibility.waitUntilElementHasText(await this.filterDialogOpened.element(by.css(this.locators.currentTabLabel)), 'Modifier');
  }

  async changeTabToCreator(): Promise<void> {
    await this.tabs.get(0).click();
    await BrowserVisibility.waitUntilElementHasText(await this.filterDialogOpened.element(by.css(this.locators.currentTabLabel)), 'Creator');
  }

  async isChipListDisplayed(): Promise<boolean> {
    return this.chipList.isDisplayed();
  }

  async getSelectedValues(): Promise<string[]> {
    return this.chips.map((option) => {
      return option.getText();
    });
  }

  async selectChip(name: string): Promise<void> {
    await this.chipListInput.sendKeys(name);
    await browser.actions().sendKeys(protractor.Key.ENTER).perform();
  }

  async getAutocompleteOptions(filterValue: string): Promise<string[]> {
    await this.chipListInput.sendKeys(filterValue);
    return this.options.map((option) => option.getText());
  }
}
