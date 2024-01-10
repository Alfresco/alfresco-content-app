/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { ElementFinder, by, browser } from 'protractor';
import { BrowserActions } from '@alfresco/adf-testing';
import { Component } from '../component';
import { waitForPresence, waitForStaleness, waitUntilElementIsVisible } from '../../utilities';

export class Menu extends Component {
  items = this.allByCss('.mat-menu-item');
  uploadFilesInput = this.byId('app-upload-files', browser);
  cancelEditingAction = this.byCss(`.mat-menu-item[title='Cancel Editing']`);
  copyAction = this.byTitleAttr('Copy');
  editFolderAction = this.byCss(`.mat-menu-item[id$='editFolder']`);
  editOfflineAction = this.byCss(`.mat-menu-item[title='Edit Offline']`);

  constructor(ancestor?: string) {
    super('.mat-menu-panel', ancestor);
  }

  async waitForMenuToOpen(): Promise<void> {
    await waitForPresence(browser.element(by.css('.cdk-overlay-container .mat-menu-panel')));
    await waitUntilElementIsVisible(this.items.get(0));
  }

  async waitForMenuToClose(): Promise<void> {
    await waitForStaleness(browser.element(by.css('.cdk-overlay-container .mat-menu-panel')));
  }

  private getItemByLabel(menuItem: string): ElementFinder {
    return this.byCssText('.mat-menu-item', menuItem);
  }

  async getItemIconText(menuItem: string): Promise<string> {
    return this.getItemByLabel(menuItem).element(by.css('.mat-icon')).getText();
  }

  async clickMenuItem(menuItem: string): Promise<void> {
    try {
      const elem = this.getItemByLabel(menuItem);
      await BrowserActions.click(elem);
    } catch (e) {
      console.error(`___click menu item catch : failed to click on ${menuItem}___`, e);
    }
  }
}
