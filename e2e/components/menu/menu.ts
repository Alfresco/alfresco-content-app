/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { ElementFinder, ElementArrayFinder, by, browser, ExpectedConditions as EC } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';
import { Utils } from '../../utilities/utils'

export class Menu extends Component {
  private static selectors = {
    root: '.mat-menu-panel',
    item: '.mat-menu-item',
    icon: '.mat-icon',
    uploadFiles: 'app-upload-files',

    submenu: 'app-context-menu-item .mat-menu-item',

    editFolder: `.mat-menu-item[id$='editFolder']`,
    favoriteAction: `.mat-menu-item[id$='favorite.add']`,
    removeFavoriteAction: `.mat-menu-item[id$='favorite.remove']`,
    editOffline: `.mat-menu-item[title='Edit Offline']`,
    cancelEditing: `.mat-menu-item[title='Cancel Editing']`
  };

  items: ElementArrayFinder = this.component.all(by.css(Menu.selectors.item));
  backdrop: ElementFinder = browser.element(by.css('.cdk-overlay-backdrop'));
  uploadFiles: ElementFinder = browser.element(by.id(Menu.selectors.uploadFiles));
  submenus: ElementArrayFinder = browser.element.all(by.css(Menu.selectors.submenu));

  cancelEditingAction: ElementFinder = this.component.element(by.css(Menu.selectors.cancelEditing));
  cancelJoinAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Cancel Join'));
  copyAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Copy'));
  createFolderAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Create Folder'));
  createLibraryAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Create Library'));
  deleteAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Delete'));
  downloadAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Download'));
  editFolderAction: ElementFinder = this.component.element(by.css(Menu.selectors.editFolder));
  editOfflineAction: ElementFinder = this.component.element(by.css(Menu.selectors.editOffline));
  favoriteAction: ElementFinder = this.component.element(by.css(Menu.selectors.favoriteAction));
  removeFavoriteAction: ElementFinder = this.component.element(by.css(Menu.selectors.removeFavoriteAction));
  toggleFavoriteAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Favorite'));
  toggleRemoveFavoriteAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Remove Favorite'));
  joinAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Join'));
  leaveAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Leave'));
  managePermissionsAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Permissions'));
  manageVersionsAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Manage Versions'));
  uploadNewVersionAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Upload New Version'));
  moveAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Move'));
  permanentDeleteAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Permanently Delete'));
  restoreAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Restore'));
  shareAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Share'));
  shareEditAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Shared Link Settings'));
  uploadFileAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Upload File'));
  uploadFolderAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Upload Folder'));
  viewAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'View'));
  viewDetailsAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'View Details'));

  constructor(ancestor?: ElementFinder) {
    super(Menu.selectors.root, ancestor);
  }

  async waitForMenuToOpen() {
    await browser.wait(EC.presenceOf(browser.element(by.css('.cdk-overlay-container .mat-menu-panel'))), BROWSER_WAIT_TIMEOUT);
    await browser.wait(EC.visibilityOf(this.items.get(0)), BROWSER_WAIT_TIMEOUT);
  }

  async waitForMenuToClose() {
    await browser.wait(EC.not(EC.presenceOf(browser.element(by.css('.cdk-overlay-container .mat-menu-panel')))), BROWSER_WAIT_TIMEOUT);
  }

  async closeMenu() {
    await Utils.pressEscape();
    await this.waitForMenuToClose();
  }

  getNthItem(nth: number) {
    return this.items.get(nth - 1);
  }

  getItemByLabel(menuItem: string) {
    return this.component.element(by.cssContainingText(Menu.selectors.item, menuItem));
  }

  getSubItemByLabel(subMenuItem: string) {
    return this.component.element(by.cssContainingText(Menu.selectors.submenu, subMenuItem));
  }

  getItemById(id: string) {
    return this.component.element(by.id(id));
  }

  async getItemTooltip(menuItem: string) {
    return this.getItemByLabel(menuItem).getAttribute('title');
  }

  async getItemIconText(menuItem: string) {
    return this.getItemByLabel(menuItem).element(by.css(Menu.selectors.icon)).getText();
  }

  async getItemIdAttribute(menuItem: string) {
    return this.getItemByLabel(menuItem).getAttribute('id');
  }

  async getItemsCount() {
    return this.items.count();
  }

  async getMenuItems(): Promise<string[]> {
    return this.items.map(async (elem) => {
      const text = await elem.element(by.css('span')).getText();
      return text;
    });
  }

  async clickNthItem(nth: number) {
    try {
      const elem = this.getNthItem(nth);
      await browser.wait(EC.elementToBeClickable(elem), BROWSER_WAIT_TIMEOUT, 'timeout waiting for menu item to be clickable');
      await browser.actions().mouseMove(elem).perform();
      await browser.actions().click().perform();
      await this.waitForMenuToClose();
    } catch (e) {
      console.log('____ click nth menu item catch ___', e);
    }
  }

  async clickMenuItem(menuItem: string) {
    try {
      const elem = this.getItemByLabel(menuItem);
      await browser.wait(EC.elementToBeClickable(elem), BROWSER_WAIT_TIMEOUT, 'timeout waiting for menu item to be clickable');
      await elem.click();
    } catch (e) {
      console.log('___click menu item catch___', e);
    }
  }

  async mouseOverMenuItem(menuItem: string) {
    try {
      const elem = this.getItemByLabel(menuItem);
      await browser.wait(EC.elementToBeClickable(elem), BROWSER_WAIT_TIMEOUT);
      await browser.actions().mouseMove(elem).perform();
      await browser.sleep(500);
    } catch (error) {
      console.log('----- mouse over error: ', error);
    }
  }

  async hasSubMenu(menuItem: string): Promise<boolean> {
    try {
      const elem = this.getItemByLabel(menuItem);
      await browser.wait(EC.elementToBeClickable(elem), BROWSER_WAIT_TIMEOUT);
      const elemClass = await elem.getAttribute('class');
      return elemClass.includes('mat-menu-item-submenu-trigger');
    } catch (error) {
      console.log('---- has submenu error: ', error);
      return false;
    }
  }

  async clickSubMenuItem(subMenuItem: string) {
    try {
      const elem = this.getSubItemByLabel(subMenuItem);
      await browser.wait(EC.elementToBeClickable(elem), BROWSER_WAIT_TIMEOUT);
      await elem.click();
    } catch (e) {
      console.log('___click submenu item catch___', e);
    }
  }

  async isMenuItemPresent(title: string) {
    return browser.element(by.cssContainingText(Menu.selectors.item, title)).isPresent();
  }

  async isSubMenuItemPresent(title: string) {
    return browser.element(by.cssContainingText(Menu.selectors.submenu, title)).isPresent();
  }

  async getSubmenuItemsCount() {
    return this.submenus.count();
  }

  async isMenuItemDisabled(title: string): Promise<string | null> {
    try {
      const item = this.getItemByLabel(title);
      const disabled = await item.getAttribute('disabled');
      return disabled;
    } catch (error) {
      console.log('----- isMenuItemDisabled catch: ', error);
      return null;
    }
  }

  uploadFile() {
    return this.uploadFiles;
  }

  async clickEditFolder() {
    await this.editFolderAction.click();
  }

  async clickShare() {
    const action = this.shareAction;
    await action.click();
  }

  async clickSharedLinkSettings() {
    const action = this.shareEditAction;
    await action.click();
  }


  async isViewPresent() {
    return this.viewAction.isPresent();
  }

  async isDownloadPresent() {
    return this.downloadAction.isPresent();
  }

  async isEditFolderPresent() {
    return this.editFolderAction.isPresent();
  }

  async isEditOfflinePresent() {
    return this.editOfflineAction.isPresent();
  }

  async isCancelEditingPresent() {
    return this.cancelEditingAction.isPresent();
  }

  async isCopyPresent() {
    return this.copyAction.isPresent();
  }

  async isMovePresent() {
    return this.moveAction.isPresent();
  }

  async isDeletePresent() {
    return this.deleteAction.isPresent();
  }

  async isManagePermissionsPresent() {
    return this.managePermissionsAction.isPresent();
  }

  async isManageVersionsPresent() {
    return this.manageVersionsAction.isPresent();
  }

  async isUploadNewVersionPresent() {
    return this.uploadNewVersionAction.isPresent();
  }

  async isFavoritePresent() {
    return this.favoriteAction.isPresent();
  }

  async isRemoveFavoritePresent() {
    return this.removeFavoriteAction.isPresent();
  }

  async isToggleFavoritePresent() {
    return this.toggleFavoriteAction.isPresent();
  }

  async isToggleRemoveFavoritePresent() {
    return this.toggleRemoveFavoriteAction.isPresent();
  }

  async isJoinLibraryPresent() {
    return this.joinAction.isPresent();
  }

  async isCancelJoinPresent() {
    return this.cancelJoinAction.isPresent();
  }

  async isLeaveLibraryPresent() {
    return this.leaveAction.isPresent();
  }

  async isPermanentDeletePresent() {
    return this.permanentDeleteAction.isPresent();
  }

  async isRestorePresent() {
    return this.restoreAction.isPresent();
  }

  async isSharePresent() {
    return this.shareAction.isPresent();
  }

  async isSharedLinkSettingsPresent() {
    return this.shareEditAction.isPresent();
  }

  async isViewDetailsPresent() {
    return this.viewDetailsAction.isPresent();
  }

  async isCreateFolderPresent() {
    return this.createFolderAction.isPresent();
  }
  async isCreateFolderEnabled() {
    return this.createFolderAction.isEnabled();
  }

  async isCreateLibraryPresent() {
    return this.createLibraryAction.isPresent();
  }
  async isCreateLibraryEnabled() {
    return this.createLibraryAction.isEnabled();
  }

  async isUploadFilePresent() {
    return this.uploadFileAction.isPresent();
  }
  async isUploadFileEnabled() {
    return this.uploadFileAction.isEnabled();
  }

  async isUploadFolderPresent() {
    return this.uploadFolderAction.isPresent();
  }
  async isUploadFolderEnabled() {
    return this.uploadFolderAction.isEnabled();
  }


  async clickCreateFolder() {
    const action = this.createFolderAction;
    await action.click();
  }

  async clickCreateLibrary() {
    const action = this.createLibraryAction;
    await action.click();
  }

  async clickUploadFile() {
    const action = this.uploadFileAction;
    await action.click();
  }

  async clickUploadFolder() {
    const action = this.uploadFolderAction;
    await action.click();
  }

}
