/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '.././base.component';
import { timeouts } from '../../../utils';

export class SearchInputComponent extends BaseComponent {
  private static rootElement = 'aca-page-layout';
  public searchInput = this.page.locator('#app-control-input');
  public searchButton = this.page.locator('.aca-search-input--search-button');
  public searchCloseButton = this.page.locator('.aca-search-input--close-button');

  /**
   * Method used in cases where user have possibility to navigate "inside" the element (it's clickable and has link attribute).
   * Perform action .click() to navigate inside it
   *
   * @returns reference to cell element which contains link.
   */
  getCellLinkByName = (name: string): Locator => this.getChild('.adf-datatable-row[role="row"]', { hasText: name });

  constructor(page: Page, rootElement = SearchInputComponent.rootElement) {
    super(page, rootElement);
  }

  async performDoubleClickFolderOrFileToOpen(name: string): Promise<void> {
    await this.getCellLinkByName(name).waitFor({ state: 'visible', timeout: timeouts.medium });
    await this.getCellLinkByName(name).dblclick();
    await this.spinnerWaitForReload();
  }
}
