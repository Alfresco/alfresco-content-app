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
import { BaseComponent } from '.././base.component';

export class SearchOverlayComponent extends BaseComponent {
  private static rootElement = '.cdk-overlay-pane';

  public searchFilesOption = this.getChild('input#content-input');
  public searchFoldersOption = this.getChild('input#folder-input');
  public searchLibrariesOption = this.getChild('input#libraries-input');
  public searchInput = this.page.locator('#app-control-input');
  public searchButton = this.page.locator('app-search-input-control button[title="Search"]');
  public searchInputControl = this.page.locator('.app-search-control');
  public searchOptions = this.page.locator('.app-search-options');

  constructor(page: Page, rootElement = SearchOverlayComponent.rootElement) {
    super(page, rootElement);
  }

  async isFoldersOptionChecked() {
    const optClass = await this.searchFoldersOption.getAttribute('class');
    return optClass.includes('.mat-mdc-checkbox-checked');
  }

  async isFilesOptionChecked() {
    const optClass = await this.searchFilesOption.getAttribute('class');
    return optClass.includes('.mat-mdc-checkbox-checked');
  }

  async isLibrariesOptionChecked() {
    const optClass = await this.searchLibrariesOption.getAttribute('class');
    return optClass.includes('.mat-mdc-checkbox-checked');
  }

  async clearOptions() {
    if (await this.isFilesOptionChecked()) {
      await this.searchFilesOption.click();
    }
    if (await this.isFoldersOptionChecked()) {
      await this.searchFoldersOption.click();
    }
    if (await this.isLibrariesOptionChecked()) {
      await this.searchLibrariesOption.click();
    }
  }

  async checkOnlyFolders(): Promise<void> {
    await this.clearOptions();
    await this.searchFoldersOption.click();
  }

  async checkOnlyFiles(): Promise<void> {
    await this.clearOptions();
    await this.searchFilesOption.click();
  }

  async checkLibraries(): Promise<void> {
    await this.clearOptions();
    await this.searchLibrariesOption.click();
  }

  async checkFilesAndFolders(): Promise<void> {
    await this.clearOptions();
    await this.searchFilesOption.click();
    await this.searchFoldersOption.click();
  }

  async searchFor(input: string): Promise<void> {
    await this.searchInput.clear();
    await this.searchInput.fill(input);
    await this.searchButton.click({ force: true });
  }
}
