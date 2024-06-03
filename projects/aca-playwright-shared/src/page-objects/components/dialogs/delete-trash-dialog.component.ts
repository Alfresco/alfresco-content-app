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
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { Page } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class AdfDeleteTrashComponent extends BaseComponent {
  private static rootElement = 'adf-confirm-dialog';

  constructor(page: Page) {
    super(page, AdfDeleteTrashComponent.rootElement);
  }

  dialogTitle = this.getChild('[data-automation-id="adf-confirm-dialog-title"]');
  dialogDescription = this.getChild('[data-automation-id="adf-confirm-dialog-base-message"]');
  deleteButton = this.getChild('[id="adf-confirm-accept"]');
  keepButton = this.getChild('[id="adf-confirm-cancel"]');

  async waitForDialog(): Promise<void> {
    await this.dialogTitle.waitFor();
  }

  async isDialogOpen(): Promise<boolean> {
    return await this.dialogTitle.isVisible();
  }

  async getDialogTitle(): Promise<string> {
    const dialogTitleText = await this.dialogTitle.textContent();
    return dialogTitleText
  }

  async getDialogDescription(): Promise<string> {
    const dialogDescriptionText = await this.dialogDescription.textContent();
    return dialogDescriptionText
  }

  async isDeleteEnabled(): Promise<boolean> {
    const isDeleteEnabled = await this.deleteButton.isEnabled();
    return isDeleteEnabled;
  }

  async isKeepEnabled(): Promise<boolean> {
    const isKeepEnabled = await this.keepButton.isEnabled();
    return isKeepEnabled;
  }
}
