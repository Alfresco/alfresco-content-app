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
    editOffline: `.mat-menu-item[title='Edit offline']`,
    cancelEditing: `.mat-menu-item[title='Cancel editing']`
  };

  items: ElementArrayFinder = this.component.all(by.css(Menu.selectors.item));
  backdrop: ElementFinder = browser.element(by.css('.cdk-overlay-backdrop'));
  uploadFiles: ElementFinder = browser.element(by.id(Menu.selectors.uploadFiles));
  submenus: ElementArrayFinder = browser.element.all(by.css(Menu.selectors.submenu));

  cancelEditingAction: ElementFinder = this.component.element(by.css(Menu.selectors.cancelEditing));
  cancelJoinAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Cancel join'));
  copyAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Copy'));
  createFolderAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Create folder'));
  createLibraryAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Create Library'));
  deleteAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Delete'));
  downloadAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Download'));
  editFolderAction: ElementFinder = this.component.element(by.css(Menu.selectors.editFolder));
  editOfflineAction: ElementFinder = this.component.element(by.css(Menu.selectors.editOffline));
  favoriteAction: ElementFinder = this.component.element(by.css(Menu.selectors.favoriteAction));
  removeFavoriteAction: ElementFinder = this.component.element(by.css(Menu.selectors.removeFavoriteAction));
  toggleFavoriteAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Favorite'));
  toggleRemoveFavoriteAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Remove favorite'));
  joinAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Join'));
  leaveAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Leave'));
  managePermissionsAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Permissions'));
  manageVersionsAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Manage Versions'));
  uploadNewVersionAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Upload new version'));
  moveAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Move'));
  permanentDeleteAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Permanently delete'));
  restoreAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Restore'));
  shareAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Share'));
  shareEditAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Shared link settings'));
  uploadFileAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Upload file'));
  uploadFolderAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Upload folder'));
  viewAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'View'));
  viewDetailsAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'View details'));

  constructor(ancestor?: ElementFinder) {
    super(Menu.selectors.root, ancestor);
  }

  async waitForMenuToOpen() {
    await browser.wait(EC.presenceOf(browser.element(by.css('.cdk-overlay-backdrop'))), BROWSER_WAIT_TIMEOUT);
    await browser.wait(EC.presenceOf(browser.element(by.css('.mat-menu-panel'))), BROWSER_WAIT_TIMEOUT);
    await browser.wait(EC.visibilityOf(this.items.get(0)), BROWSER_WAIT_TIMEOUT);
  }

  async waitForMenuToClose() {
    await browser.wait(EC.not(EC.presenceOf(browser.element(by.css('.mat-menu-panel')))), BROWSER_WAIT_TIMEOUT);
  }

  async closeMenu() {
    return Utils.pressEscape();
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
    return await this.getItemByLabel(menuItem).getAttribute('title');
  }

  async getItemIconText(menuItem: string) {
    return await this.getItemByLabel(menuItem).element(by.css(Menu.selectors.icon)).getText();
  }

  async getItemIdAttribute(menuItem: string) {
    return await this.getItemByLabel(menuItem).getAttribute('id');
  }

  async getItemsCount() {
    return await this.items.count();
  }

  async clickNthItem(nth: number) {
    const elem = this.getNthItem(nth);
    await browser.wait(EC.elementToBeClickable(elem), BROWSER_WAIT_TIMEOUT);
    await browser.actions().mouseMove(elem).click().perform();
    await this.waitForMenuToClose();
  }

  async clickMenuItem(menuItem: string) {
    try {
      const elem = this.getItemByLabel(menuItem);
      await browser.wait(EC.elementToBeClickable(elem), BROWSER_WAIT_TIMEOUT);
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

  async hasSubMenu(menuItem: string) {
    try {
      const elem = this.getItemByLabel(menuItem);
      await browser.wait(EC.elementToBeClickable(elem), BROWSER_WAIT_TIMEOUT);
      const elemClass = await elem.getAttribute('class');
      return elemClass.includes('mat-menu-item-submenu-trigger');
    } catch (error) {
      console.log('---- has submenu error: ', error);
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
    return await browser.element(by.cssContainingText(Menu.selectors.item, title)).isPresent();
  }

  async isSubMenuItemPresent(title: string) {
    return await browser.element(by.cssContainingText(Menu.selectors.submenu, title)).isPresent();
  }

  async getSubmenuItemsCount() {
    return await this.submenus.count();
  }

  async isMenuItemDisabled(title: string) {
    try {
      const item = this.getItemByLabel(title);
      const disabled = await item.getAttribute('disabled');
      return disabled;
    } catch (error) {
      console.log('----- isMenuItemDisabled catch: ', error);
    }
  }

  uploadFile() {
    return this.uploadFiles;
  }

  async clickEditFolder() {
    return await this.editFolderAction.click();
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
    return await this.viewAction.isPresent();
  }

  async isDownloadPresent() {
    return await this.downloadAction.isPresent();
  }

  async isEditFolderPresent() {
    return await this.editFolderAction.isPresent();
  }

  async isEditOfflinePresent() {
    return await this.editOfflineAction.isPresent();
  }

  async isCancelEditingPresent() {
    return await this.cancelEditingAction.isPresent();
  }

  async isCopyPresent() {
    return await this.copyAction.isPresent();
  }

  async isMovePresent() {
    return await this.moveAction.isPresent();
  }

  async isDeletePresent() {
    return await this.deleteAction.isPresent();
  }

  async isManagePermissionsPresent() {
    return await this.managePermissionsAction.isPresent();
  }

  async isManageVersionsPresent() {
    return await this.manageVersionsAction.isPresent();
  }

  async isUploadNewVersionPresent() {
    return await this.uploadNewVersionAction.isPresent();
  }

  async isFavoritePresent() {
    return await this.favoriteAction.isPresent();
  }

  async isRemoveFavoritePresent() {
    return await this.removeFavoriteAction.isPresent();
  }

  async isToggleFavoritePresent() {
    return await this.toggleFavoriteAction.isPresent();
  }

  async isToggleRemoveFavoritePresent() {
    return await this.toggleRemoveFavoriteAction.isPresent();
  }

  async isJoinLibraryPresent() {
    return await this.joinAction.isPresent();
  }

  async isCancelJoinPresent() {
    return await this.cancelJoinAction.isPresent();
  }

  async isLeaveLibraryPresent() {
    return await this.leaveAction.isPresent();
  }

  async isPermanentDeletePresent() {
    return await this.permanentDeleteAction.isPresent();
  }

  async isRestorePresent() {
    return await this.restoreAction.isPresent();
  }

  async isSharePresent() {
    return await this.shareAction.isPresent();
  }

  async isSharedLinkSettingsPresent() {
    return await this.shareEditAction.isPresent();
  }

  async isViewDetailsPresent() {
    return await this.viewDetailsAction.isPresent();
  }

  async isCreateFolderPresent() {
    return await this.createFolderAction.isPresent();
  }
  async isCreateFolderEnabled() {
    return await this.createFolderAction.isEnabled();
  }

  async isCreateLibraryPresent() {
    return await this.createLibraryAction.isPresent();
  }
  async isCreateLibraryEnabled() {
    return await this.createLibraryAction.isEnabled();
  }

  async isUploadFilePresent() {
    return await this.uploadFileAction.isPresent();
  }
  async isUploadFileEnabled() {
    return await this.uploadFileAction.isEnabled();
  }

  async isUploadFolderPresent() {
    return await this.uploadFolderAction.isPresent();
  }
  async isUploadFolderEnabled() {
    return await this.uploadFolderAction.isEnabled();
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
