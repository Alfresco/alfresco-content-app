/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

export class FolderInformationDialogComponent extends BaseComponent {
  private static readonly rootElement = '[data-automation-id="adf-dialog-container"]';

  constructor(page: Page) {
    super(page, FolderInformationDialogComponent.rootElement);
  }

  folderName = this.getChild('.aca-node-info-header');
  doneButton = this.getChild('[data-automation-id="adf-dialog-actions-confirm"]');
  folderNumberOfFiles = this.getChild('[data-automation-id="node-info-number-of-files"]');
  folderSize = this.getChild('[data-automation-id="node-info-size"]');
  folderLocation = this.getChild('[data-automation-id="node-info-location"]');
  folderCreationDate = this.getChild('[data-automation-id="node-info-creation-date"]');
  folderModifiedDate = this.getChild('[data-automation-id="node-info-modify-date"]');

  async getFolderSizeNumber(): Promise<number> {
    const textContent = await this.folderSize.textContent();
    if (!textContent) {
      throw new Error('Folder size text content is null or undefined');
    }
    return parseFloat(textContent.trim().split(/\s+/)[0].replace(/,/g, ''));
  }
}
