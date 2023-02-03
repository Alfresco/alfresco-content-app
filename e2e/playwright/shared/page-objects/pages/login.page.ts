/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { UserModel } from '../../models';

interface LoginOptions {
  waitForLoading?: boolean;
  withNavigation?: boolean;
}
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page, '');
  }

  private username = this.page.locator('#username');
  private password = this.page.locator('#password');
  private submitButton = this.page.locator('#login-button');

  async loginUser(userData: { username: string; password: string } | UserModel, options?: LoginOptions): Promise<void> {
    if (options?.withNavigation) {
      await this.navigate();
    }
    await this.username.fill(userData.username);
    await this.password.fill(userData.password);
    await this.submitButton.click();

    if (options?.waitForLoading) {
      await Promise.all([this.page.waitForLoadState('domcontentloaded'), this.spinner.waitForReload()]);
    }
  }
}
