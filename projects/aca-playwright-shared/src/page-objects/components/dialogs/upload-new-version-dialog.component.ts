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

export class UploadNewVersionDialog extends BaseComponent {
  private static rootElement = 'adf-new-version-uploader-dialog';

  public cancelButton = this.getChild('#adf-new-version-cancel');
  public uploadButton = this.getChild('[data-automation-id="adf-new-version-file-upload"]');
  public majorOption = this.getChild('#adf-new-version-major');
  public minorOption = this.getChild('#adf-new-version-minor');
  public description = this.getChild('#adf-new-version-text-area');
  public title = this.getChild(' [data-automation-id="new-version-uploader-dialog-title"]');

  constructor(page: Page) {
    super(page, UploadNewVersionDialog.rootElement);
  }
}
