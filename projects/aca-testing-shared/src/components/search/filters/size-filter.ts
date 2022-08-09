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

import { by, ElementArrayFinder } from 'protractor';
import { GenericFilter } from './generic-filter';
import { BrowserActions, TestElement } from '@alfresco/adf-testing';

export enum SizeOptions {
  Small = 'SMALL',
  Medium = 'MEDIUM',
  Large = 'LARGE',
  Huge = 'HUGE'
}
export class SizeFilter extends GenericFilter {
  constructor() {
    super('Size');
  }

  facets: ElementArrayFinder = this.filterDialogOpened.all(by.css('.mat-checkbox'));
  selectedFacets: ElementArrayFinder = this.filterDialogOpened.all(by.css('.mat-checkbox.mat-checkbox-checked'));
  public getSizeCheckboxOption = (sizeOption: SizeOptions) =>
    TestElement.byCss(`[data-automation-id="checkbox-SEARCH.CATEGORIES.SIZE_OPTIONS.${sizeOption}"] [type="checkbox"]`);

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
    await this.closeDialog();
  }
}
