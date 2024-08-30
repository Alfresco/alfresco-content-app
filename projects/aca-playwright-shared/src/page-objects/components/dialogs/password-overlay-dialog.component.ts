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
import { timeouts } from '../../../utils';

export class PasswordOverlayDialogComponent extends BaseComponent {
  private static rootElement = '.cdk-overlay-pane';

  public closeButton = this.getChild('[data-automation-id="adf-password-dialog-close"]');
  public submitButton = this.getChild('[data-automation-id="adf-password-dialog-submit"]');
  public passwordInput = this.getChild('[data-automation-id="adf-password-dialog-input"]');
  public errorMessage = this.getChild('[data-automation-id="adf-password-dialog-error"]');

  constructor(page: Page, rootElement = PasswordOverlayDialogComponent.rootElement) {
    super(page, rootElement);
  }

  async waitForDialogToOpen(): Promise<void> {
    await this.spinnerWaitForReload();
    await this.passwordInput.waitFor({ state: 'attached', timeout: timeouts.large });
    await this.passwordInput.isVisible();
  }

  async waitForDialogToClose(): Promise<void> {
    await this.passwordInput.waitFor({ state: 'detached', timeout: timeouts.large });
  }

  async isDialogOpen(): Promise<boolean> {
    await this.waitForDialogToOpen();
    return this.passwordInput.isVisible();
  }

  async isCloseVisible(): Promise<boolean> {
    return this.closeButton.isVisible();
  }

  async isSubmitHidden(): Promise<boolean> {
    return this.submitButton.isHidden();
  }

  async isPasswordInputDisplayed(): Promise<boolean> {
    return this.passwordInput.isVisible();
  }

  async isErrorDisplayed(): Promise<boolean> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: timeouts.short });
    return this.errorMessage.isVisible();
  }

  async getErrorMessage(): Promise<string> {
    if (await this.isErrorDisplayed()) {
      return this.errorMessage.innerText();
    }
    return '';
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }
}
