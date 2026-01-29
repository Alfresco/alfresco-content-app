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

import { Locator, Page, expect } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class ContentNodeSelectorDialog extends BaseComponent {
  private static rootElement = 'adf-content-node-selector';
  private selectedRow = this.getChild('.adf-is-selected');
  private getRowByName = (name: string | number): Locator => this.getChild(`adf-datatable-row`, { hasText: name.toString() });

  public cancelButton = this.getChild('[data-automation-id="content-node-selector-actions-cancel"]');
  public actionButton = this.getChild('[data-automation-id="content-node-selector-actions-choose"]');
  public locationDropDown = this.getChild('[id="site-dropdown-container"] .adf-sites-dropdown-form-field');

  getOptionLocator = (optionName: string): Locator => this.page.locator('[role=listbox] [role=option]', { hasText: optionName }).first();
  getDialogTitle = (text: string) => this.getChild('[data-automation-id="content-node-selector-title"]', { hasText: text });
  getBreadcrumb = (text: string) => this.getChild('[data-automation-id="current-folder"]', { hasText: text });
  getFolderIcon = this.getChild('[data-automation-id="dropdown-breadcrumb-trigger"]');
  loadMoreButton = this.getChild('[data-automation-id="adf-infinite-pagination-button"]');

  constructor(page: Page) {
    super(page, ContentNodeSelectorDialog.rootElement);
  }

  async loadMoreNodes(): Promise<void> {
    await this.spinnerWaitForReload();
    while (await this.loadMoreButton.isVisible()) {
      await this.loadMoreButton.click();
    }
  }

  async selectLocation(location: string): Promise<void> {
    await this.locationDropDown.click();
    const optionLocator = this.getOptionLocator(location);
    await optionLocator.click();
    await optionLocator.waitFor({ state: 'detached' });
  }

  async selectDestination(folderName: string): Promise<void> {
    const row = this.getRowByName(folderName);

    await expect(row).toBeVisible();
    await row.click({ trial: true });

    await expect(async () => {
      await row.hover({ timeout: 1000 });
      await row.click();
      await expect(this.selectedRow).toBeVisible();
    }).toPass({
      intervals: [2_000],
      timeout: 20_000
    });
  }
}
