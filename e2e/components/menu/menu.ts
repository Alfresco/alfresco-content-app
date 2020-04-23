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

import { ElementFinder, ElementArrayFinder, by, browser } from 'protractor';
import { Logger } from '@alfresco/adf-testing';
import { Component } from '../component';
import { Utils, isPresentAndEnabled, waitForPresence, waitForVisibility, waitForStaleness, waitForClickable } from '../../utilities/utils'

export class Menu extends Component {
  private static selectors = {
    root: '.mat-menu-panel',
    item: '.mat-menu-item',
    icon: '.mat-icon',

    uploadFilesInput: 'app-upload-files',

    uploadFile: 'app.create.uploadFile',
    uploadFolder: 'app.create.uploadFolder',
    createFolder: 'app.create.folder',
    createLibrary: 'app.create.library',
    createFileFromTemplate: 'app.create.fileFromTemplate',
    createFolderFromTemplate: 'app.create.folderFromTemplate',

    submenu: 'app-context-menu-item .mat-menu-item',

    editFolder: `.mat-menu-item[id$='editFolder']`,
    favoriteAction: `.mat-menu-item[id$='favorite.add']`,
    removeFavoriteAction: `.mat-menu-item[id$='favorite.remove']`,
    editOffline: `.mat-menu-item[title='Edit Offline']`,
    cancelEditing: `.mat-menu-item[title='Cancel Editing']`
  };

  items: ElementArrayFinder = this.component.all(by.css(Menu.selectors.item));
  backdrop: ElementFinder = browser.element(by.css('.cdk-overlay-backdrop'));

  uploadFilesInput: ElementFinder = browser.element(by.id(Menu.selectors.uploadFilesInput));
  submenus: ElementArrayFinder = browser.element.all(by.css(Menu.selectors.submenu));

  uploadFileAction: ElementFinder = this.component.element(by.id(Menu.selectors.uploadFile));
  uploadFolderAction: ElementFinder = this.component.element(by.id(Menu.selectors.uploadFolder));
  createFolderAction: ElementFinder = this.component.element(by.id(Menu.selectors.createFolder));
  createLibraryAction: ElementFinder = this.component.element(by.id(Menu.selectors.createLibrary));
  createFileFromTemplateAction: ElementFinder = this.component.element(by.id(Menu.selectors.createFileFromTemplate));
  createFolderFromTemplateAction: ElementFinder = this.component.element(by.id(Menu.selectors.createFolderFromTemplate));

  cancelEditingAction: ElementFinder = this.component.element(by.css(Menu.selectors.cancelEditing));
  cancelJoinAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Cancel Join'));
  copyAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'Copy'));
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
  viewAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'View'));
  viewDetailsAction: ElementFinder = this.component.element(by.cssContainingText(Menu.selectors.item, 'View Details'));

  constructor(ancestor?: string) {
    super(Menu.selectors.root, ancestor);
  }

  async waitForMenuToOpen(): Promise<void> {
    await waitForPresence(browser.element(by.css('.cdk-overlay-container .mat-menu-panel')));
    await waitForVisibility(this.items.get(0));
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

  getItemByLabel(menuItem: string): ElementFinder {
    return this.component.element(by.cssContainingText(Menu.selectors.item, menuItem));
  }

  getSubItemByLabel(subMenuItem: string): ElementFinder {
    return this.component.element(by.cssContainingText(Menu.selectors.submenu, subMenuItem));
  }

  getItemById(id: string): ElementFinder {
    return this.component.element(by.id(id));
  }

  async getItemTooltip(menuItem: string): Promise<string> {
    return this.getItemByLabel(menuItem).getAttribute('title');
  }

  async getTooltipForUploadFile(): Promise<string> {
    return this.getItemTooltip('Upload File');
  }

  async getTooltipForUploadFolder(): Promise<string> {
    return this.getItemTooltip('Upload Folder');
  }

  async getTooltipForCreateFolder(): Promise<string> {
    return this.getItemTooltip('Create Folder');
  }

  async getTooltipForCreateLibrary(): Promise<string> {
    return this.getItemTooltip('Create Library');
  }

  async getTooltipForCreateFileFromTemplate(): Promise<string> {
    return this.getItemTooltip('Create file from template');
  }

  async getItemIconText(menuItem: string): Promise<string> {
    return this.getItemByLabel(menuItem).element(by.css(Menu.selectors.icon)).getText();
  }

  async getItemIdAttribute(menuItem: string): Promise<string> {
    return this.getItemByLabel(menuItem).getAttribute('id');
  }

  async getItemsCount(): Promise<number> {
    return this.items.count();
  }

  async getMenuItems(): Promise<string[]> {
    const items: string[] = await this.items.map(async (elem) => {
      const span: ElementFinder = elem.element(by.css('span'));
      return span.getText();
    });
    return items;
  }

  async clickNthItem(nth: number): Promise<void> {
    try {
      const elem = this.getNthItem(nth);
      await waitForClickable(elem);
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
      await waitForClickable(elem);
      await elem.click();
    } catch (e) {
      Logger.error('___click menu item catch___', e);
    }
  }

  async mouseOverMenuItem(menuItem: string): Promise<void> {
    try {
      const elem = this.getItemByLabel(menuItem);
      await waitForClickable(elem);
      await browser.actions().mouseMove(elem).perform();
      await browser.sleep(500);
    } catch (error) {
      Logger.error('----- mouse over error: ', error);
    }
  }

  async hasSubMenu(menuItem: string): Promise<boolean> {
    try {
      const elem = this.getItemByLabel(menuItem);
      await waitForClickable(elem);
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
      await waitForClickable(elem);
      await elem.click();
    } catch (e) {
      Logger.error('___click submenu item catch___', e);
    }
  }

  async isMenuItemPresent(title: string): Promise<boolean> {
    return browser.element(by.cssContainingText(Menu.selectors.item, title)).isPresent();
  }

  async isSubMenuItemPresent(title: string): Promise<boolean> {
    return browser.element(by.cssContainingText(Menu.selectors.submenu, title)).isPresent();
  }

  async getSubmenuItemsCount(): Promise<number> {
    return this.submenus.count();
  }

  async isMenuItemDisabled(title: string): Promise<string | null> {
    try {
      const item = this.getItemByLabel(title);
      const disabled = await item.getAttribute('disabled');
      return disabled;
    } catch (error) {
      Logger.error('----- isMenuItemDisabled catch: ', error);
      return null;
    }
  }

  uploadFile(): ElementFinder {
    return this.uploadFilesInput;
  }

  async clickEditFolder(): Promise<void> {
    await this.editFolderAction.click();
  }

  async clickShare(): Promise<void> {
    const action = this.shareAction;
    await action.click();
  }

  async clickSharedLinkSettings(): Promise<void> {
    const action = this.shareEditAction;
    await action.click();
  }

  async isViewPresent(): Promise<boolean> {
    return this.viewAction.isPresent();
  }

  async isDownloadPresent(): Promise<boolean> {
    return this.downloadAction.isPresent();
  }

  async isEditFolderPresent(): Promise<boolean> {
    return this.editFolderAction.isPresent();
  }

  async isEditOfflinePresent(): Promise<boolean> {
    return this.editOfflineAction.isPresent();
  }

  async isCancelEditingPresent(): Promise<boolean> {
    return this.cancelEditingAction.isPresent();
  }

  async isCopyPresent(): Promise<boolean> {
    return this.copyAction.isPresent();
  }

  async isMovePresent(): Promise<boolean> {
    return this.moveAction.isPresent();
  }

  async isDeletePresent(): Promise<boolean> {
    return this.deleteAction.isPresent();
  }

  async isManagePermissionsPresent(): Promise<boolean> {
    return this.managePermissionsAction.isPresent();
  }

  async isManageVersionsPresent(): Promise<boolean> {
    return this.manageVersionsAction.isPresent();
  }

  async isUploadNewVersionPresent(): Promise<boolean> {
    return this.uploadNewVersionAction.isPresent();
  }

  async isFavoritePresent(): Promise<boolean> {
    return this.favoriteAction.isPresent();
  }

  async isRemoveFavoritePresent(): Promise<boolean> {
    return this.removeFavoriteAction.isPresent();
  }

  async isToggleFavoritePresent(): Promise<boolean> {
    return this.toggleFavoriteAction.isPresent();
  }

  async isToggleRemoveFavoritePresent(): Promise<boolean> {
    return this.toggleRemoveFavoriteAction.isPresent();
  }

  async isJoinLibraryPresent(): Promise<boolean> {
    return this.joinAction.isPresent();
  }

  async isCancelJoinPresent(): Promise<boolean> {
    return this.cancelJoinAction.isPresent();
  }

  async isLeaveLibraryPresent(): Promise<boolean> {
    return this.leaveAction.isPresent();
  }

  async isPermanentDeletePresent(): Promise<boolean> {
    return this.permanentDeleteAction.isPresent();
  }

  async isRestorePresent(): Promise<boolean> {
    return this.restoreAction.isPresent();
  }

  async isSharePresent(): Promise<boolean> {
    return this.shareAction.isPresent();
  }

  async isSharedLinkSettingsPresent(): Promise<boolean> {
    return this.shareEditAction.isPresent();
  }

  async isViewDetailsPresent(): Promise<boolean> {
    return this.viewDetailsAction.isPresent();
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

  async clickCreateFolder(): Promise<void> {
    const action = this.createFolderAction;
    await action.click();
  }

  async clickCreateLibrary(): Promise<void> {
    const action = this.createLibraryAction;
    await action.click();
  }

  async clickCreateFileFromTemplate(): Promise<void> {
    const action = this.createFileFromTemplateAction;
    await action.click();
  }

  async clickCreateFolderFromTemplate(): Promise<void> {
    const action = this.createFolderFromTemplateAction;
    await action.click();
  }
}
