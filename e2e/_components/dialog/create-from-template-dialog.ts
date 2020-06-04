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

import { by } from 'protractor';
import { GenericDialog } from '../dialog/generic-dialog';
import { isPresentAndDisplayed, isPresentAndEnabled, typeText } from '../../utilities/utils';

export class CreateFromTemplateDialog extends GenericDialog {
  createButton = this.childElement(by.cssContainingText('.mat-dialog-actions button', 'Create'));
  cancelButton = this.childElement(by.cssContainingText('.mat-dialog-actions button', 'CANCEL'));

  nameInput = this.childElement(by.css('input[placeholder="Name" i]'));
  titleInput = this.childElement(by.css('input[placeholder="Title" i]'));
  descriptionTextArea = this.childElement(by.css('textarea[placeholder="Description" i]'));
  validationMessage = this.childElement(by.css('.mat-error'));

  constructor() {
    super('.aca-create-from-template-dialog');
  }

  async isValidationMessageDisplayed(): Promise<boolean> {
    return isPresentAndDisplayed(this.validationMessage);
  }

  async isCreateButtonEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.createButton);
  }

  async isCancelButtonEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.cancelButton);
  }

  async getValidationMessage(): Promise<string> {
    if (await this.isValidationMessageDisplayed()) {
      return this.validationMessage.getText();
    } else {
      return '';
    }
  }

  async getName(): Promise<string> {
    return this.nameInput.getAttribute('value');
  }

  async getDescription(): Promise<string> {
    return this.descriptionTextArea.getAttribute('value');
  }

  async enterName(name: string): Promise<void> {
    await typeText(this.nameInput, name);
  }

  async enterTitle(title: string): Promise<void> {
    await typeText(this.titleInput, title);
  }

  async enterDescription(description: string): Promise<void> {
    await typeText(this.descriptionTextArea, description);
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
    await this.waitForDialogToClose();
  }
}
