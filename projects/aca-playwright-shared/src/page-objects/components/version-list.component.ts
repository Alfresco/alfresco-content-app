/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { timeouts } from '../../utils/timeouts';
import { BaseComponent } from './base.component';

/**
 * Page object for the ADF `adf-version-list` rendered inside the Manage Versions dialog.
 *
 * Accessors return a `Locator` so that callers can use the auto-retrying
 * `expect(locator)` assertions instead of taking a one-shot snapshot of the DOM.
 */
export class VersionListComponent extends BaseComponent {
  static readonly rootElement = 'adf-version-list';

  readonly loadingBar = this.getChild('[data-automation-id="version-history-loading-bar"]');
  readonly rows = this.getChild('.adf-version-list-item');

  constructor(page: Page, rootElement: string = VersionListComponent.rootElement) {
    super(page, rootElement);
  }

  versionLabel(version: string): Locator {
    return this.getChild(`[id="adf-version-list-item-version-${version}"]`);
  }

  versionComment(version: string): Locator {
    return this.getChild(`[id="adf-version-list-item-comment-${version}"]`);
  }

  versionModifiedBy(version: string): Locator {
    return this.getChild(`[data-automation-id="adf-version-list-item-modified-by-${version}"]`);
  }

  actionMenuButton(version: string): Locator {
    return this.getChild(`[id="adf-version-list-action-menu-button-${version}"]`);
  }

  // Menu items render in the CDK overlay container, outside the component root,
  // so they cannot be resolved with `getChild`.
  restoreAction(version: string): Locator {
    return this.page.locator(`[id="adf-version-list-action-restore-${version}"]`);
  }

  downloadAction(version: string): Locator {
    return this.page.locator(`[id="adf-version-list-action-download-${version}"]`);
  }

  deleteAction(version: string): Locator {
    return this.page.locator(`[id="adf-version-list-action-delete-${version}"]`);
  }

  async openActionMenuForVersion(version: string): Promise<void> {
    await this.actionMenuButton(version).click();
  }

  async clickDownloadForVersion(version: string): Promise<void> {
    await this.openActionMenuForVersion(version);
    await this.downloadAction(version).click();
  }

  async clickDeleteForVersion(version: string): Promise<void> {
    await this.openActionMenuForVersion(version);
    await this.deleteAction(version).click();
  }

  /**
   * Waits for the version history to finish loading. Also requires at least one row to
   * render, so that a version list which silently fails to load is reported as a failure.
   */
  async waitForVersionListToLoad(): Promise<void> {
    await this.loadingBar.waitFor({ state: 'detached' });
    await this.rows.first().waitFor({ state: 'visible', timeout: timeouts.large });
  }
}
