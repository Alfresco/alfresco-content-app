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

import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '.././base.component';
import { timeouts } from '../../../utils';

export class SearchInputComponent extends BaseComponent {
  private static rootElement = 'aca-page-layout';
  public searchOptionsArea = this.getChild('#search-options');
  public searchButton = this.getChild('aca-search-input .app-search-button');
  public searchCheckboxes = this.searchOptionsArea.locator('.mat-checkbox');
  public searchField = this.getChild('aca-search-input .mat-form-field');
  public searchFilesOption = this.searchCheckboxes.getByText('Files');
  public searchLibrariesOption = this.searchCheckboxes.getByText('Libraries');
  public searchFoldersOption = this.searchCheckboxes.getByText('Folders');
  

  getIconByName = (name: string): Locator => this.getChild('.mat-icon', { hasText: name });

  /**
   * Method used in cases where user have possibility to navigate "inside" the element (it's clickable and has link attribute).
   * Perform action .click() to navigate inside it
   *
   * @returns reference to cell element which contains link.
   */
  getCellLinkByName = (name: string): Locator => this.getChild('.adf-datatable-row[role="row"]', { hasText: name });

  constructor(page: Page, rootElement = SearchInputComponent.rootElement) {
    super(page, rootElement);
  }

  async performDoubleClickFolderOrFileToOpen(name: string): Promise<void> {
    await this.getCellLinkByName(name).waitFor({ state: 'visible', timeout: timeouts.medium });
    await this.getCellLinkByName(name).dblclick();
    await this.spinnerWaitForReload();
  }

  async clickLibrariesOption() {
    await this.searchLibrariesOption.click();
  }

  async clickFilesOption() {
    await this.searchFilesOption.click();
  }

  async clickFoldersOption() {
    await this.searchFoldersOption.click();
  }

  async isFoldersOptionChecked() {
    const optClass = await this.searchFoldersOption.getAttribute('class');
    return optClass.includes('mat-checkbox-checked');
  }

  async isFilesOptionChecked() {
    const optClass = await this.searchFilesOption.getAttribute('class');
    return optClass.includes('mat-checkbox-checked');
  }

  async isLibrariesOptionChecked() {
    const optClass = await this.searchLibrariesOption.getAttribute('class');
    return optClass.includes('mat-checkbox-checked');
  }

  async clearOptions() {
    if (await this.isFilesOptionChecked()) {
      await this.clickFilesOption();
    }
    if (await this.isFoldersOptionChecked()) {
      await this.clickFoldersOption();
    }
    if (await this.isLibrariesOptionChecked()) {
      await this.clickLibrariesOption();
    }
  }

  async checkOnlyFolders() {
    await this.clearOptions();
    await this.clickFoldersOption();
  }

  async checkOnlyFiles() {
    await this.clearOptions();
    await this.clickFilesOption();
  }

  async checkLibraries() {
    await this.clearOptions();
    await this.clickLibrariesOption();
  }

  async checkFilesAndFolders() {
    await this.clearOptions();
    await this.clickFilesOption();
    await this.clickFoldersOption();
  }

  async searchFor(text: string) {
    await this.searchButton.click();
    await this.searchField.type(text);
    await this.searchButton.click();
  }
}
