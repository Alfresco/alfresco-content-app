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

import { timeouts } from '../../../utils';
import { BaseComponent } from '../base.component';
import { Locator, Page } from '@playwright/test';

export class AdfLibraryDialogComponent extends BaseComponent {
  private static rootElement = 'adf-library-dialog';

  public createButton = this.getChild('[data-automation-id="create-library-id"]');
  public cancelButton = this.getChild('[data-automation-id="cancel-library-id"]');

  constructor(page: Page) {
    super(page, AdfLibraryDialogComponent.rootElement);
  }

  public getLabelText = (text: string) => this.getChild('label', { hasText: text });
  public getRequiredMarker = (text: string) => this.getLabelText(text).locator('span');
  public getDialogTitle = (text: string) => this.getChild('h2', { hasText: text });
  public getErrorByText = (text: string): Locator => this.getChild('.adf-library-dialog-form-field').getByText(text);

  /**
   * This method is used when we want to fill in Create Library Dialog and choose Create button
   *
   * @param nameInput input for the Name field
   * @param libraryIdInput input for Library ID field
   * @param descriptionInput input for Description field
   * @param visibility visibility of the library
   */
  async createLibraryWithNameAndId(nameInput: string, libraryIdInput: string, descriptionInput?: string, visibility?: string): Promise<void> {
    await this.getLabelText('Name').fill(nameInput);
    await this.getLabelText('Library ID').clear();
    await this.getLabelText('Library ID').fill(libraryIdInput);
    if (descriptionInput) {
      await this.getLabelText('Description').fill(descriptionInput);
    }
    if (visibility) {
      await this.getLabelText(visibility).click();
    }
    await this.createButton.click();
    await this.spinnerWaitForReload();
  }

  async isErrorMessageDisplayed(errorText: string): Promise<boolean> {
    await this.getErrorByText(errorText).waitFor({ state: 'visible', timeout: timeouts.large });
    return this.getErrorByText(errorText).isVisible();
  }
}
