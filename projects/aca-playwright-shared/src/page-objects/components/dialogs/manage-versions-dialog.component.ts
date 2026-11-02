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
import { BaseComponent } from '../base.component';
import { VersionListComponent } from '../version-list.component';

export class ManageVersionsDialog extends BaseComponent {
  private static readonly rootElement = '.adf-new-version-uploader-dialog';

  readonly versionList = new VersionListComponent(this.page, `${ManageVersionsDialog.rootElement} ${VersionListComponent.rootElement}`);

  readonly title = this.getChild('[data-automation-id="new-version-uploader-dialog-title"]');

  constructor(page: Page) {
    super(page, ManageVersionsDialog.rootElement);
  }

  versionLabel(version: string): Locator {
    return this.versionList.versionLabel(version);
  }

  versionComment(version: string): Locator {
    return this.versionList.versionComment(version);
  }

  versionModifiedBy(version: string): Locator {
    return this.versionList.versionModifiedBy(version);
  }

  restoreAction(version: string): Locator {
    return this.versionList.restoreAction(version);
  }

  async openActionMenuForVersion(version: string): Promise<void> {
    await this.versionList.openActionMenuForVersion(version);
  }

  async clickDownloadForVersion(version: string): Promise<void> {
    await this.versionList.clickDownloadForVersion(version);
  }

  async clickDeleteForVersion(version: string): Promise<void> {
    await this.versionList.clickDeleteForVersion(version);
  }

  async waitForVersionListToLoad(): Promise<void> {
    await this.versionList.waitForVersionListToLoad();
  }

  async waitForDialog(): Promise<void> {
    await this.title.waitFor();
  }
}
