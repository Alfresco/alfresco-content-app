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

export class SearchInDialogComponent extends BaseComponent {
  private static rootElement = '.aca-search-in-panel';

  public filesAndFoldersRadioButton = this.getChild('[type="radio"]').getByLabel('Files and Folders');
  public librariesRadioButton = this.getChild('[type="radio"]').getByLabel('Libraries');
  public filesCheckbox = this.getChild('.aca-search-in-panel__checkboxes').getByLabel('Files');
  public foldersCheckbox = this.getChild('.aca-search-in-panel__checkboxes').getByLabel('Folders');
  public applyButton = this.getChild('button', { hasText: 'Apply' });
  private resetButton = this.getChild('button', { hasText: 'Reset' });

  constructor(page: Page, rootElement = SearchInDialogComponent.rootElement) {
    super(page, rootElement);
  }

  async isFoldersOptionChecked() {
    return this.foldersCheckbox.isChecked();
  }

  async isFilesOptionChecked() {
    return this.filesCheckbox.isChecked();
  }

  async resetOptions() {
    await this.resetButton.click();
  }

  async checkOnlyFolders(): Promise<void> {
    await this.resetOptions();
    if (await this.isFilesOptionChecked()) {
      await this.filesCheckbox.click();
    }
    if (!(await this.isFoldersOptionChecked())) {
      await this.foldersCheckbox.click();
    }
  }

  async checkOnlyFiles(): Promise<void> {
    await this.resetOptions();
    if (await this.isFoldersOptionChecked()) {
      await this.foldersCheckbox.click();
    }
    if (!(await this.isFilesOptionChecked())) {
      await this.filesCheckbox.click();
    }
  }

  async checkLibraries(): Promise<void> {
    await this.resetOptions();
    await this.librariesRadioButton.click();
  }

  async checkFilesAndFolders(): Promise<void> {
    await this.resetOptions();
    if (!(await this.isFilesOptionChecked())) {
      await this.filesCheckbox.click();
    }
    if (!(await this.isFoldersOptionChecked())) {
      await this.foldersCheckbox.click();
    }
  }
}
