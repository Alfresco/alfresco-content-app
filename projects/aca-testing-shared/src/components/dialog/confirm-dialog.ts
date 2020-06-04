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
import { isPresentAndEnabled } from '../../utilities/utils';

export class ConfirmDialog extends GenericDialog {
  okButton = this.childElement(by.buttonText('OK'));
  cancelButton = this.childElement(by.buttonText('Cancel'));
  keepButton = this.childElement(by.buttonText('Keep'));
  deleteButton = this.childElement(by.buttonText('Delete'));
  removeButton = this.childElement(by.buttonText('Remove'));

  constructor() {
    super('adf-confirm-dialog');
  }

  async getText(): Promise<string> {
    return this.content.getText();
  }

  async isOkEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.okButton);
  }

  async isCancelEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.cancelButton);
  }

  async isKeepEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.keepButton);
  }

  async isDeleteEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.deleteButton);
  }

  async isRemoveEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.removeButton);
  }
}
