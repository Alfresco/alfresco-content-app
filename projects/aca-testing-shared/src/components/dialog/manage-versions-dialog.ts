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
import { BrowserActions } from '@alfresco/adf-testing';
import { Menu } from '../menu/menu';

export class ManageVersionsDialog extends GenericDialog {
  closeButton = this.childElement(by.cssContainingText('.mat-button', 'Close'));

  menu = new Menu();

  constructor() {
    super('.aca-node-versions-dialog');
  }

  async clickClose(): Promise<void> {
    await BrowserActions.click(this.closeButton);
    await this.waitForDialogToClose();
  }

  async clickActionButton(version: string): Promise<void> {
    await BrowserActions.click(this.childElement(by.id(`adf-version-list-action-menu-button-${version}`)));
    await this.menu.waitForMenuToOpen();
  }

  async viewFileVersion(version: string): Promise<void> {
    await this.clickActionButton(version);
    await this.menu.clickMenuItem('View');
  }
}
