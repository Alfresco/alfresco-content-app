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
import { timeouts } from '../../../utils';

export class CreateFromTemplateDialogComponent extends BaseComponent {
  private static rootElement = 'app-create-from-template-dialog';

  constructor(page: Page) {
    super(page, CreateFromTemplateDialogComponent.rootElement);
  }

  cancelButton = this.getChild('[data-automation-id="cancel-folder-template-button"]');
  createButton = this.getChild('[data-automation-id="create-folder-template-button"]');
  getDialogTitle = (text: string) => this.getChild('.mat-dialog-title', { hasText: text });
  getDialogLabel = (text: string) => this.getChild('label', { hasText: text });
  getErrorByText = (text: string): Locator => this.page.locator('mat-error', {hasText: text});


  async isErrorMessageDisplayed(errorText: string): Promise<boolean> {
    await this.getErrorByText(errorText).waitFor({ state: 'visible', timeout: timeouts.large });
    return await this.getErrorByText(errorText).isVisible();
  }

    /**
   * This method is used when we want to fill in Create new folder from template dialog and choose Create button
   */
    async createNewFolderFromTemplate( nameInput: string, titleInput?: string, descriptionInput?: string): Promise<void> {
      await this.getDialogLabel('Name *').fill(nameInput);
      if (titleInput) { await this.getDialogLabel('Title').fill(titleInput); }
      if (descriptionInput) { await this.getDialogLabel('Description').fill(descriptionInput); }
      await this.createButton.click();
    }
}
