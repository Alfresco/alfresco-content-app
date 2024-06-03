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

import { Page } from '@playwright/test';
import { BaseComponent } from '../base.component';
import { expect } from '@playwright/test';

export class SnackBarComponent extends BaseComponent {
  private static rootElement = 'adf-snackbar-content';

  public message = this.getChild('[data-automation-id="adf-snackbar-message-content"]').first();

  public actionButton = this.getChild('[data-automation-id="adf-snackbar-message-content-action-button"]');

  public closeIcon = this.getChild('.adf-snackbar-message-content-action-icon');
  public getByMessageLocator = (message: string) =>
    this.getChild(`[data-automation-id='adf-snackbar-message-content']`, { hasText: message }).first();

  constructor(page: Page, rootElement = SnackBarComponent.rootElement) {
    super(page, rootElement);
  }

  async getSnackBarMessage(): Promise<string> {
    const snackBarMessage: string = await this.message.textContent();
    return snackBarMessage;
  }

  async getSnackBarActionText(): Promise<string> {
    if (await this.actionButton.isVisible()){
      const snackBarMessage: string = await this.actionButton.textContent();
      return snackBarMessage;
    } else {
      return '';
    }
  }

  async verifySnackBarActionText(text: string): Promise<void> {
    await expect(await this.message.textContent()).toContain(text);
  }

  async clickSnackBarAction(): Promise<void> {
    await this.actionButton.click();
  }
}
