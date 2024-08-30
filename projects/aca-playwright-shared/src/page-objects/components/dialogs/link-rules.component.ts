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

import { Locator, Page, expect } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class LinkRulesDialog extends BaseComponent {
  private static rootElement = 'aca-rule-set-picker';

  constructor(page: Page) {
    super(page, LinkRulesDialog.rootElement);
  }

  cancelButton = this.getChild('[data-automation-id="content-node-selector-actions-cancel"]');
  selectFolderButton = this.getChild('button', { hasText: ' Select folder ' });
  emptyLinkRules = this.getChild('.adf-empty-content__title');
  getOptionLocator = (optionName: string): Locator =>
    this.page.locator('.mat-mdc-select-panel .mdc-list-item__primary-text', { hasText: optionName });
  private getRowByName = (name: string | number): Locator => this.getChild(`adf-datatable-row`, { hasText: name.toString() });
  getDialogTitle = (text: string) => this.getChild('[data-automation-id="content-node-selector-title"]', { hasText: text });
  getBreadcrumb = (text: string) => this.getChild('[data-automation-id="current-folder"]', { hasText: text });
  getFolderIcon = this.getChild('.adf-dropdown-breadcrumb-icon', { hasText: 'folder' });
  getLibraryIcon = this.getChild('.adf-empty-content__icon', { hasText: 'library_books' });

  async selectDestination(folderName: string): Promise<void> {
    const row = this.getRowByName(folderName);

    await expect(row).toBeVisible();
    await row.click({ trial: true });

    await expect(async () => {
      await row.hover({ timeout: 1000 });
      await row.click();
      await expect(this.selectFolderButton).toBeEnabled();
    }).toPass({
      intervals: [2_000, 2_000, 2_000, 2_000, 2_000, 2_000, 2_000],
      timeout: 20_000
    });
  }

  async waitForLinkRules(): Promise<void> {
    await this.getLibraryIcon.waitFor();
  }
}
