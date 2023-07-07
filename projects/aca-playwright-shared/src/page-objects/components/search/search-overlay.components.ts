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
import { BaseComponent } from '.././base.component';

export class SearchOverlayComponent extends BaseComponent {
  private static rootElement = '.cdk-overlay-pane';

  public searchFilesOption = this.getChild('label[for="content-input"]');
  public searchFoldersOption = this.getChild('label[for="folder-input"]');
  public searchLibrariesOption = this.getChild('label[for="libraries-input"]');
  public searchInput = this.getChild('input[id="app-control-input"]');
  public searchButton = this.getChild('.app-search-button');

  constructor(page: Page, rootElement = SearchOverlayComponent.rootElement) {
    super(page, rootElement);
  }

  async checkFilesAndFolders(): Promise<void> {
    await this.searchFilesOption.click();
    await this.searchFoldersOption.click();
  }

  async searchFor(input: string): Promise<void> {
    await this.searchInput.fill(input);
    await this.searchButton.click();
  }
}
