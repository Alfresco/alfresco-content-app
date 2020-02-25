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

export class SelectTemplateDialog extends GenericDialog {
  private static selectors = {
    root: '.aca-template-node-selector-dialog',

    nextButton: by.css('[data-automation-id="content-node-selector-actions-choose"]'),
    cancelButton: by.css('[data-automation-id="content-node-selector-actions-cancel"]')
  };

  breadcrumb: DropDownBreadcrumb = new DropDownBreadcrumb();
  dataTable: DataTable = new DataTable(SelectTemplateDialog.selectors.root);

  constructor() {
    super(SelectTemplateDialog.selectors.root);
  }

  async isCancelButtonEnabled(): Promise<boolean> {
    return this.isButtonEnabled(SelectTemplateDialog.selectors.cancelButton);
  }

  async isNextButtonEnabled(): Promise<boolean> {
    return this.isButtonEnabled(SelectTemplateDialog.selectors.nextButton);
  }

  async clickCancel(): Promise<void> {
    await this.clickButton(SelectTemplateDialog.selectors.cancelButton);
    await this.waitForDialogToClose();
  }

  async clickNext(): Promise<void> {
    await this.clickButton(SelectTemplateDialog.selectors.nextButton);
    await this.waitForDialogToClose();
  }
}
