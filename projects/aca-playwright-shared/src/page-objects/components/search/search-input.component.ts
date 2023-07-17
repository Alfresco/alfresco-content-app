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
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../base.component';
import { timeouts } from '../../../utils';
import { $ } from 'protractor';

export class SearchInputComponent extends BaseComponent {
  private static rootElement = 'aca-page-layout';
  public searchButton = this.getChild('aca-search-input .app-search-button');
  private viewButton = this.getChild('button[title="View"]');

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
    await this.waitForSearchForResult(name);//
    await this.getCellLinkByName(name).waitFor({ state:'visible', timeout: timeouts.normal });
    await this.getCellLinkByName(name).click();
    await this.viewButton.waitFor({ state:'visible', timeout: timeouts.normal });
    await this.viewButton.click();
    await this.page.waitForURL('**/(viewer:view/**', { waitUntil: 'domcontentloaded'});
    await this.spinnerWaitForReload();
  }

  private async waitForSearchForResult(name: string): Promise<void> {
    let retry = 0;
    do {
      if (await this.getCellLinkByName(name).isVisible()) return null;
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await this.spinnerWaitForReload();
      retry++;
    } while (retry < 10);
  }
}
