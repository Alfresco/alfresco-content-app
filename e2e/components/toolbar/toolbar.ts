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

import { ElementFinder, by, browser } from 'protractor';
import { Menu } from '../menu/menu';
import { Component } from '../component';
import { Utils } from '../../utilities/utils';

export class Toolbar extends Component {
  selectors = {
    root: '.adf-toolbar',
    button: 'button',
    share: `.mat-icon-button[title='Share']`,
    shareEdit: `.mat-icon-button[title='Shared link settings']`,
    view: `.mat-icon-button[title='View']`,
    searchFilterToggle: `.mat-icon-button[title='Toggle search filter']`,
    download: `.mat-icon-button[title='Download']`,
    editFolderId: 'app.toolbar.editFolder',
    viewDetails: `.mat-icon-button[title='View details']`,
    print: `.mat-icon-button[title='Print']`,
    fullScreen: `.mat-icon-button[title='Activate full-screen mode']`,
    joinLibrary: `.mat-icon-button[title='Join']`,
    leaveLibrary: `.mat-icon-button[title='Leave library']`,
    permanentlyDelete: `.mat-icon-button[title='Permanently delete']`,
    restore: `.mat-icon-button[title='Restore']`
  };

  menu: Menu = new Menu();
  buttons = this.getAllByCss(this.selectors.button);
  shareButton = this.getByCss(this.selectors.share);
  shareEditButton = this.getByCss(this.selectors.shareEdit);
  viewButton = this.getByCss(this.selectors.view);
  searchFiltersToggleButton = this.getByCss(this.selectors.searchFilterToggle);
  downloadButton = this.getByCss(this.selectors.download);
  editFolderButton = this.getById(this.selectors.editFolderId);
  viewDetailsButton = this.getByCss(this.selectors.viewDetails);
  printButton = this.getByCss(this.selectors.print);
  fullScreenButton = this.getByCss(this.selectors.fullScreen);
  joinButton = this.getByCss(this.selectors.joinLibrary);
  leaveButton = this.getByCss(this.selectors.leaveLibrary);
  permanentlyDeleteButton = this.getByCss(this.selectors.permanentlyDelete);
  restoreButton = this.getByCss(this.selectors.restore);

  constructor(ancestor?: ElementFinder) {
    super('.adf-toolbar', ancestor);
  }

  async isEmpty() {
    const count = await this.buttons.count();
    return count === 0;
  }

  async numberOfAvailableActions() {
    return await this.buttons.count();
  }

  async isButtonPresent(title: string) {
    const elem = this.getByCss(`${this.selectors.button}[title="${title}"]`);
    return await elem.isPresent();
  }

  getButtonByLabel(label: string) {
    return this.getByText(this.selectors.button, label);
  }

  getButtonByTitleAttribute(title: string) {
    return this.getByCss(`${this.selectors.button}[title="${title}"]`);
  }

  getButtonById(id: string) {
    return this.component.element(by.id(id));
  }

  async openMoreMenu() {
    await this.isButtonPresent('More actions');
    const moreMenu = this.getButtonByTitleAttribute('More actions');
    await moreMenu.click();
    await this.menu.waitForMenuToOpen();
  }

  async closeMoreMenu() {
    await Utils.pressEscape();
  }

  async getButtonTooltip(button: ElementFinder) {
    return await button.getAttribute('title');
  }

  async clickButton(title: string) {
    const btn = this.getButtonByTitleAttribute(title);
    await btn.click();
  }

  async isSharedLinkSettingsPresent() {
    return await browser.isElementPresent(this.shareEditButton);
  }

  async isSharePresent() {
    return await browser.isElementPresent(this.shareButton);
  }

  async isViewPresent() {
    return await browser.isElementPresent(this.viewButton);
  }

  async isToggleSearchFiltersPresent() {
    return await browser.isElementPresent(this.searchFiltersToggleButton);
  }

  async isDownloadPresent() {
    return await browser.isElementPresent(this.downloadButton);
  }

  async isPermanentlyDeletePresent() {
    return await browser.isElementPresent(this.permanentlyDeleteButton);
  }

  async isRestorePresent() {
    return await browser.isElementPresent(this.restoreButton);
  }

  async isEditFolderPresent() {
    return await browser.isElementPresent(this.editFolderButton);
  }

  async isViewDetailsPresent() {
    return await browser.isElementPresent(this.viewDetailsButton);
  }

  async isPrintPresent() {
    return await browser.isElementPresent(this.printButton);
  }

  async isFullScreenPresent() {
    return await browser.isElementPresent(this.fullScreenButton);
  }

  async clickShare() {
    const btn = this.shareButton;
    await btn.click();
  }

  async clickSharedLinkSettings() {
    const btn = this.shareEditButton;
    await btn.click();
  }

  async clickView() {
    return await this.viewButton.click();
  }

  async clickEditFolder() {
    return await this.editFolderButton.click();
  }

  async clickViewDetails() {
    return await this.viewDetailsButton.click();
  }

  async clickDownload() {
    return await this.downloadButton.click();
  }

  async clickJoin() {
    return await this.joinButton.click();
  }

  async clickLeave() {
    return await this.leaveButton.click();
  }

  async clickPermanentlyDelete() {
    return await this.permanentlyDeleteButton.click();
  }
  async clickRestore() {
    return await this.restoreButton.click();
  }

  async clickMoreActionsFavorite() {
    await this.openMoreMenu();
    return await this.menu.clickMenuItem('Favorite');
  }

  async clickMoreActionsRemoveFavorite() {
    await this.openMoreMenu();
    return await this.menu.clickMenuItem('Remove favorite');
  }

  async clickMoreActionsDelete() {
    await this.openMoreMenu();
    return await this.menu.clickMenuItem('Delete');
  }

  async clickMoreActionsManageVersions() {
    await this.openMoreMenu();
    return await this.menu.clickMenuItem('Manage Versions');
  }

  async clickMoreActionsMove() {
    await this.openMoreMenu();
    return await this.menu.clickMenuItem('Move');
  }

  async clickMoreActionsCopy() {
    await this.openMoreMenu();
    return await this.menu.clickMenuItem('Copy');
  }

  async clickMoreActionsEditOffline() {
    await this.openMoreMenu();
    return await this.menu.clickMenuItem('Edit offline');
  }

  async clickMoreActionsCancelEditing() {
    await this.openMoreMenu();
    return await this.menu.clickMenuItem('Cancel editing');
  }

  async clickMoreActionsUploadNewVersion() {
    await this.openMoreMenu();
    return await this.menu.clickMenuItem('Upload new version');
  }

  async clickFullScreen() {
    return await this.fullScreenButton.click();
  }
}
