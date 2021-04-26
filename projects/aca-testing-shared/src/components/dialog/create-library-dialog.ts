/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { by, ElementFinder } from 'protractor';
import { GenericDialog } from '../dialog/generic-dialog';
import { isPresentAndEnabled, typeText } from '../../utilities/utils';
import { BrowserActions, BrowserVisibility } from '@alfresco/adf-testing';

export class CreateLibraryDialog extends GenericDialog {
  createButton = this.childElement(by.cssContainingText('.mat-dialog-actions button', 'Create'));
  cancelButton = this.childElement(by.cssContainingText('.mat-dialog-actions button', 'Cancel'));

  nameInput = this.rootElem.element(by.css('input[formcontrolname="title"]'));
  libraryIdInput = this.rootElem.element(by.css('input[formcontrolname="id"]'));
  descriptionTextArea = this.rootElem.element(by.css('textarea[formcontrolname="description"]'));
  visibilityPublic = this.rootElem.element(by.cssContainingText('.mat-radio-label', 'Public'));
  visibilityModerated = this.rootElem.element(by.cssContainingText('.mat-radio-label', 'Moderated'));
  visibilityPrivate = this.rootElem.element(by.cssContainingText('.mat-radio-label', 'Private'));

  errorMessage = this.rootElem.element(by.css('.mat-error'));

  constructor() {
    super('adf-library-dialog');
  }

  async waitForDialogToOpen(): Promise<void> {
    await super.waitForDialogToOpen();
    await BrowserVisibility.waitUntilElementIsClickable(this.nameInput);
  }

  async getErrorMessage(): Promise<string> {
    if (await this.errorMessage.isDisplayed()) {
      return this.errorMessage.getText();
    }
    return '';
  }

  async enterName(name: string): Promise<void> {
    await typeText(this.nameInput, name);
  }

  async enterLibraryId(id: string): Promise<void> {
    await typeText(this.libraryIdInput, id);
  }

  async enterDescription(description: string): Promise<void> {
    await typeText(this.descriptionTextArea, description);
  }

  async isCreateEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.createButton);
  }

  async isCancelEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.cancelButton);
  }

  async clickCancel(): Promise<void> {
    await BrowserActions.click(this.cancelButton);
    await this.waitForDialogToClose();
  }

  private async isChecked(target: ElementFinder): Promise<boolean> {
    const elemClass = await target.element(by.xpath('..')).getAttribute('class');
    return elemClass.includes('mat-radio-checked');
  }

  async isPublicChecked(): Promise<boolean> {
    return this.isChecked(this.visibilityPublic);
  }

  async isModeratedChecked(): Promise<boolean> {
    return this.isChecked(this.visibilityModerated);
  }

  async isPrivateChecked(): Promise<boolean> {
    return this.isChecked(this.visibilityPrivate);
  }
}
