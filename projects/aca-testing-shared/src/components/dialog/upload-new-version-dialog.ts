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
import { isPresentAndEnabled, typeText } from '../../utilities/utils';

export class UploadNewVersionDialog extends GenericDialog {
  cancelButton = this.childElement(by.cssContainingText('.mat-button-wrapper', 'Cancel'));
  uploadButton = this.childElement(by.cssContainingText('.mat-button-wrapper', 'Upload'));
  majorOption = this.childElement(by.cssContainingText(`.mat-radio-label`, 'major'));
  minorOption = this.childElement(by.cssContainingText(`.mat-radio-label`, 'minor'));
  description = this.childElement(by.css('textarea'));

  constructor() {
    super('.adf-version-manager-dialog-panel-upload');
  }

  async isCancelButtonEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.cancelButton);
  }

  async isUploadButtonEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.uploadButton);
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
    await this.waitForDialogToClose();
  }

  async enterDescription(description: string): Promise<void> {
    await typeText(this.description, description);
  }
}
