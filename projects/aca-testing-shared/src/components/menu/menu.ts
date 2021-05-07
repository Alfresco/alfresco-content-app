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

import { ElementFinder, by, browser } from 'protractor';
import { Logger, BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';
import { Component } from '../component';
import { Utils, isPresentAndEnabled, waitForPresence, waitForStaleness } from '../../utilities/utils';

export class Menu extends Component {
  items = this.allByCss('.mat-menu-item');

  uploadFilesInput = this.byId('app-upload-files', browser);
  submenus = browser.element.all(by.css('app-context-menu-item .mat-menu-item'));

  uploadFileAction = this.byId('app.create.uploadFile');
  uploadFolderAction = this.byId('app.create.uploadFolder');
  createFolderAction = this.byId('app.create.folder');
  createLibraryAction = this.byId('app.create.library');
  createFileFromTemplateAction = this.byId('app.create.fileFromTemplate');
  createFolderFromTemplateAction = this.byId('app.create.folderFromTemplate');

  cancelEditingAction = this.byCss(`.mat-menu-item[title='Cancel Editing']`);
  cancelJoinAction = this.byCssText('.mat-menu-item', 'Cancel Join');
  copyAction = this.byTitleAttr('Copy');
  downloadAction = this.byCssText('.mat-menu-item', 'Download');
  editFolderAction = this.byCss(`.mat-menu-item[id$='editFolder']`);
  editOfflineAction = this.byCss(`.mat-menu-item[title='Edit Offline']`);
  joinAction = this.byCssText('.mat-menu-item', 'Join');
  leaveAction = this.byCssText('.mat-menu-item', 'Leave');
  managePermissionsAction = this.byCssText('.mat-menu-item', 'Permissions');
  restoreAction = this.byCssText('.mat-menu-item', 'Restore');
  shareAction = this.byCssText('.mat-menu-item', 'Share');
  shareEditAction = this.byCssText('.mat-menu-item', 'Shared Link Settings');

  constructor(ancestor?: string) {
    super('.mat-menu-panel', ancestor);
  }

  async waitForMenuToOpen(): Promise<void> {
    await waitForPresence(browser.element(by.css('.cdk-overlay-container .mat-menu-panel')));
    await BrowserVisibility.waitUntilElementIsVisible(this.items.get(0));
  }

  async waitForMenuToClose(): Promise<void> {
    await waitForStaleness(browser.element(by.css('.cdk-overlay-container .mat-menu-panel')));
  }

  async closeMenu(): Promise<void> {
    await Utils.pressEscape();
    await this.waitForMenuToClose();
  }

  getNthItem(nth: number): ElementFinder {
    return this.items.get(nth - 1);
  }

  private getItemByLabel(menuItem: string): ElementFinder {
    return this.byCssText('.mat-menu-item', menuItem);
  }

  private getSubItemByLabel(subMenuItem: string): ElementFinder {
    return this.byCssText('app-context-menu-item .mat-menu-item', subMenuItem);
  }

  getItemById(id: string): ElementFinder {
    return this.byId(id);
  }

  async getItemTooltip(menuItem: string): Promise<string> {
    return this.getItemByLabel(menuItem).getAttribute('title');
  }

  async getItemIconText(menuItem: string): Promise<string> {
    return this.getItemByLabel(menuItem).element(by.css('.mat-icon')).getText();
  }

  async getItemIdAttribute(menuItem: string): Promise<string> {
    return this.getItemByLabel(menuItem).getAttribute('id');
  }

  async getItemsCount(): Promise<number> {
    return this.items.count();
  }

  async getMenuItems(): Promise<string[]> {
    return this.items.map(async (elem) => {
      const span = elem.element(by.css('span'));
      return span.getText();
    });
  }

  async clickNthItem(nth: number): Promise<void> {
    try {
      const elem = this.getNthItem(nth);
      await BrowserVisibility.waitUntilElementIsClickable(elem);
      await browser.actions().mouseMove(elem).perform();
      await browser.actions().click().perform();
      await this.waitForMenuToClose();
    } catch (e) {
      Logger.error('____ click nth menu item catch ___', e);
    }
  }

  async clickMenuItem(menuItem: string): Promise<void> {
    try {
      const elem = this.getItemByLabel(menuItem);
      await BrowserActions.click(elem);
    } catch (e) {
      Logger.error(`___click menu item catch : failed to click on ${menuItem}___`, e);
    }
  }

  async mouseOverMenuItem(menuItem: string): Promise<void> {
    try {
      const elem = this.getItemByLabel(menuItem);
      await BrowserVisibility.waitUntilElementIsClickable(elem);
      await browser.actions().mouseMove(elem).perform();
      await browser.sleep(500);
    } catch (error) {
      Logger.error(`----- mouse over error : failed to mouse over ${menuItem} : `, error);
    }
  }

  async hasSubMenu(menuItem: string): Promise<boolean> {
    try {
      const elem = this.getItemByLabel(menuItem);
      await BrowserVisibility.waitUntilElementIsClickable(elem);
      const elemClass = await elem.getAttribute('class');
      return elemClass.includes('mat-menu-item-submenu-trigger');
    } catch (error) {
      Logger.error('---- has submenu error: ', error);
      return false;
    }
  }

  async clickSubMenuItem(subMenuItem: string): Promise<void> {
    try {
      const elem = this.getSubItemByLabel(subMenuItem);
      await BrowserActions.click(elem);
    } catch (e) {
      Logger.error('___click submenu item catch___', e);
    }
  }

  async isMenuItemPresent(title: string): Promise<boolean> {
    return browser.element(by.cssContainingText('.mat-menu-item', title)).isPresent();
  }

  async isSubMenuItemPresent(title: string): Promise<boolean> {
    return browser.element(by.cssContainingText('app-context-menu-item .mat-menu-item', title)).isPresent();
  }

  async getSubmenuItemsCount(): Promise<number> {
    return this.submenus.count();
  }

  async isMenuItemDisabled(title: string): Promise<string | null> {
    try {
      const item = this.getItemByLabel(title);
      return await item.getAttribute('disabled');
    } catch (error) {
      Logger.error('----- isMenuItemDisabled catch: ', error);
      return null;
    }
  }

  async isCreateFolderEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.createFolderAction);
  }

  async isCreateLibraryEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.createLibraryAction);
  }

  async isUploadFileEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.uploadFileAction);
  }

  async isUploadFolderEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.uploadFolderAction);
  }

  async isCreateFileFromTemplateEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.createFileFromTemplateAction);
  }

  async isCreateFolderFromTemplateEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.createFolderFromTemplateAction);
  }
}
