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

import { BaseComponent } from '../base.component';
import { Page } from '@playwright/test';

export class AdfFolderDialogComponent extends BaseComponent {
  private static rootElement = 'adf-folder-dialog';

  public folderNameInputLocator = this.getChild('[id="adf-folder-name-input"]');
  public folderNameInputHint = this.getChild('[aria-atomic="true"] span');
  public folderTitleInput = this.getChild('[id="adf-folder-title-input"]');
  public folderDescriptionInput = this.getChild('[id="adf-folder-description-input"]');
  public createButton = this.getChild('[id="adf-folder-create-button"]');
  public cancelButton = this.getChild('[id="adf-folder-cancel-button"]');

  constructor(page: Page) {
    super(page, AdfFolderDialogComponent.rootElement);
  }

  public getLabelText = (text: string) => this.getChild('label', { hasText: text });
  public getRequiredMarker = (text: string) => this.getLabelText(text).locator('span');

  /**
   * This method is used when we want to fill in Create new Folder Dialog and choose Create button
   *
   * @param nameInput input for the Name field
   * @param titleInput input for Title field
   * @param descriptionInput input for Description field
   */
  async createNewFolderDialog(nameInput: string, titleInput?: string, descriptionInput?: string): Promise<void> {
    await this.folderNameInputLocator.fill(nameInput);
    if (titleInput) {
      await this.folderTitleInput.fill(titleInput);
    }
    if (descriptionInput) {
      await this.folderDescriptionInput.fill(descriptionInput);
    }
    await this.createButton.click();
  }
}
