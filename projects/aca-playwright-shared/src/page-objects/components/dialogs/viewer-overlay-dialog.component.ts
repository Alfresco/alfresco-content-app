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

export class ViewerOverlayDialogComponent extends BaseComponent {
  private static rootElement = '.cdk-overlay-pane';

  public closeButton = this.getChild('[data-automation-id="adf-password-dialog-close"]');
  public submitButton = this.getChild('[data-automation-id="adf-password-dialog-submit"]');
  public passwordInput = this.getChild('[data-automation-id="adf-password-dialog-input"]');
  public errorMessage = this.getChild('[data-automation-id="adf-password-dialog-error"]');
  public copyDialog = this.getChild('[data-automation-id="content-node-selector-title"]');
  public copyMenuButton = this.getChild('[id="app.viewer.copy"]');
  public deleteMenuButton = this.getChild('[id="app.viewer.delete"]');
  public favoriteMenuButton = this.getChild('[id="app.viewer.favorite.add"]');
  public removeFavoriteMenuButton = this.getChild('[id="app.viewer.favorite.remove"]');
  public shareDialogTitle = this.getChild('[data-automation-id="adf-share-dialog-title"]');
  public shareDialogClose = this.getChild('[data-automation-id="adf-share-dialog-close"]');

  constructor(page: Page, rootElement = ViewerOverlayDialogComponent.rootElement) {
    super(page, rootElement);
  }

  async isCopyDialogOpen(): Promise<boolean> {
    await this.copyDialog.waitFor({ state: 'attached', timeout: timeouts.medium });
    return this.copyDialog.isVisible();
  }

  async isCopyDialogClose(): Promise<boolean> {
    await this.copyDialog.waitFor({ state: 'detached', timeout: timeouts.medium });
    return this.copyDialog.isVisible();
  }

  async clickActionsCopy(): Promise<void> {
    await this.copyMenuButton.waitFor({ state: 'attached', timeout: timeouts.medium });
    await this.copyMenuButton.click();
  }
}
