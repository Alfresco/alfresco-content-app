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

import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class ContentNodeSelectorDialog extends BaseComponent {
  private static rootElement = 'adf-content-node-selector';

  constructor(page: Page) {
    super(page, ContentNodeSelectorDialog.rootElement);
  }

  public cancelButton = this.getChild('[data-automation-id="content-node-selector-actions-cancel"]');
  public actionButton = this.getChild('[data-automation-id="content-node-selector-actions-choose"]');
  public locationDropDown = this.getChild('[id="site-dropdown-container"]');
  private selectedRow = this.getChild('.adf-is-selected');
  getOptionLocator = (optionName: string): Locator => this.page.locator('.mat-select-panel .mat-option-text', { hasText: optionName });
  private getRowByName = (name: string | number): Locator => this.getChild(`adf-datatable-row`, { hasText: name.toString() });
  getDialogTitle = (text: string) => this.getChild('.mat-dialog-title', { hasText: text });
  getBreadcrumb = (text: string) => this.getChild('[data-automation-id="current-folder"]', { hasText: text });
  getFolderIcon = this.getChild('mat-icon[role="img"]', { hasText: "folder" });


  async selectLocation(location: string): Promise<void> {
    await this.locationDropDown.click();
    const optionLocator = this.getOptionLocator(location);
    await optionLocator.click();
    await optionLocator.waitFor({ state: 'detached' });
  }

  async selectDestination(folderName: string): Promise<void> {
    const row = this.getRowByName(folderName);
    await row.click();
    await this.selectedRow.waitFor({ state: 'attached' });
    await this.selectedRow.isVisible();
  }
}
