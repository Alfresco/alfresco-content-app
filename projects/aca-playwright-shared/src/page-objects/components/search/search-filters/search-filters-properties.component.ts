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

import { SearchPage } from '../../../pages';
import { BaseComponent } from '../../base.component';
import { Page } from '@playwright/test';

export class SearchFiltersProperties extends BaseComponent {
  private static rootElement = '.adf-search-filter-menu-card';

  constructor(page: Page) {
    super(page, SearchFiltersProperties.rootElement);
  }

  public operatorButton = this.getChild(`[data-automation-id='adf-search-properties-file-size-operator']`);
  public fileSizeInput = this.getChild(`[placeholder$='Enter file size']`);
  public unitButton = this.getChild(`[data-automation-id='adf-search-properties-file-size-unit']`);
  public fileTypeInput = this.getChild(`[placeholder$='File Type']`);
  public atLeastOption = this.page.locator(`mat-option`, { hasText: 'At Least' });
  public atMostOption = this.page.locator(`mat-option`, { hasText: 'At Most' });
  public exactlyOption = this.page.locator(`mat-option`, { hasText: 'Exactly' });
  public kbUnit = this.page.locator(`mat-option`, { hasText: 'KB' });
  public mbUnit = this.page.locator(`mat-option`, { hasText: 'MB' });
  public gbUnit = this.page.locator(`mat-option`, { hasText: 'GB' });
  public dropdownOptions = this.page.locator(`mat-option`);

  async setPropertiesParameters(
    page: SearchPage,
    operator?: 'At Least' | 'At Most' | 'Exactly',
    unit?: 'KB' | 'MB' | 'GB',
    fileSizeInputText?: string,
    fileTypeInputText?: string
  ): Promise<void> {
    await page.searchFilters.propertiesFilter.click();

    if (operator) {
      await this.operatorButton?.click();
      switch (operator) {
        case 'At Least':
          await this.atLeastOption?.click();
          break;
        case 'At Most':
          await this.atMostOption?.click();
          break;
        case 'Exactly':
          await this.exactlyOption?.click();
          break;
      }
    }

    if (unit) {
      await this.unitButton?.click();
      switch (unit) {
        case 'KB':
          await this.kbUnit?.click();
          break;
        case 'MB':
          await this.mbUnit?.click();
          break;
        case 'GB':
          await this.gbUnit?.click();
          break;
      }
    }

    if (fileSizeInputText) {
      await this.fileSizeInput?.fill(fileSizeInputText);
    }

    if (fileTypeInputText) {
      await this.fileTypeInput?.fill(fileTypeInputText);
      await this.dropdownOptions.getByText(fileTypeInputText).waitFor();
      await this.dropdownOptions.getByText(fileTypeInputText).click();
    }

    await page.searchFilters.menuCardApply.click();
    await page.dataTable.progressBarWaitForReload();
  }
}
