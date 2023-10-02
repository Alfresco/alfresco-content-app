/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { MatMenuComponent } from './dataTable';
import { BaseComponent } from './base.component';
export class AcaHeader extends BaseComponent {
  private static rootElement = 'aca-toolbar';
  private moreActionsButton = this.getChild('button[id="app.viewer.toolbar.more"]');
  public createButton = this.getChild('[id="app.toolbar.create"]');
  public viewDetails = this.getChild('[title="View Details"]');
  public viewButton = this.getChild('button[title="View"]');
  public searchButton = this.getChild('button[title="Search"]');
  public fullScreenButton = this.getChild('button[id="app.viewer.fullscreen"]');
  public shareButton = this.getChild('button[id="share-action-button"]');
  public downloadButton = this.getChild('button[id="app.viewer.download"]');

  constructor(page: Page) {
    super(page, AcaHeader.rootElement);
  }
  public matMenu = new MatMenuComponent(this.page);

  async clickViewerMoreActions(): Promise<void> {
    await this.moreActionsButton.waitFor({ state: 'attached' });
    await this.moreActionsButton.click();
  }

  async clickCreateFolderFromTemplate(): Promise<void> {
    await this.createButton.click();
    await this.matMenu.createFolderFromTemplate.click();
  }
}
