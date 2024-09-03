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

export class AdfConfirmDialogComponent extends BaseComponent {
  private static rootElement = 'adf-confirm-dialog';

  constructor(page: Page) {
    super(page, AdfConfirmDialogComponent.rootElement);
  }

  getDialogTitle = (text: string) => this.getChild('[data-automation-id="adf-confirm-dialog-title"]', { hasText: text });
  getDialogContent = (text: string) => this.getChild('[data-automation-id="adf-confirm-dialog-base-message"]', { hasText: text });
  okButton = this.getChild('[data-automation-id="adf-confirm-dialog-confirmation"]');
  cancelButton = this.getChild('[data-automation-id="adf-confirm-dialog-reject"]');
}
