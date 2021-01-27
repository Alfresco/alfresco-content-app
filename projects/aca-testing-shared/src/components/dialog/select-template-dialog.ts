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
import { DropDownBreadcrumb } from '../breadcrumb/dropdown-breadcrumb';
import { DataTable } from '../data-table/data-table';
import { isPresentAndEnabled } from '../../utilities/utils';
import { BrowserActions } from '@alfresco/adf-testing';

export class SelectTemplateDialog extends GenericDialog {
  nextButton = this.childElement(by.css('[data-automation-id="content-node-selector-actions-choose"]'));
  cancelButton = this.childElement(by.css('[data-automation-id="content-node-selector-actions-cancel"]'));

  breadcrumb = new DropDownBreadcrumb();
  dataTable = new DataTable('.aca-template-node-selector-dialog');

  constructor() {
    super('.aca-template-node-selector-dialog');
  }

  get content() {
    return this.rootElem.element(by.css('.adf-content-node-selector-content'));
  }

  async isCancelButtonEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.cancelButton);
  }

  async isNextButtonEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.nextButton);
  }

  async clickCancel(): Promise<void> {
    await BrowserActions.click(this.cancelButton);
    await this.waitForDialogToClose();
  }

  async clickNext(): Promise<void> {
    await BrowserActions.click(this.nextButton);
    await this.waitForDialogToClose();
  }
}
