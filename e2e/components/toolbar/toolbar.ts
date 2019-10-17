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

import { ElementFinder, ElementArrayFinder, by, browser } from 'protractor';
import { Menu } from '../menu/menu';
import { Component } from '../component';
import { Utils } from '../../utilities/utils';

export class Toolbar extends Component {
  private static selectors = {
    root: '.adf-toolbar',
    button: 'button',

    share: `.mat-icon-button[title='Share']`,
    shareEdit: `.mat-icon-button[title='Shared Link Settings']`,
    view: `.mat-icon-button[title='View']`,
    searchFilterToggle: `.mat-icon-button[title='Toggle search filter']`,
    download: `.mat-icon-button[title='Download']`,
    editFolder: 'app.toolbar.editFolder',
    viewDetails: `.mat-icon-button[title='View Details']`,
    print: `.mat-icon-button[title='Print']`,
    fullScreen: `.mat-icon-button[title='Activate full-screen mode']`,
    joinLibrary: `.mat-icon-button[title='Join']`,
    leaveLibrary: `.mat-icon-button[title='Leave Library']`,
    permanentlyDelete: `.mat-icon-button[title='Permanently Delete']`,
    restore: `.mat-icon-button[title='Restore']`
  };

  menu: Menu = new Menu();
  buttons: ElementArrayFinder = this.component.all(by.css(Toolbar.selectors.button));
  shareButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.share));
  shareEditButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.shareEdit));
  viewButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.view));
  searchFiltersToggleButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.searchFilterToggle));
  downloadButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.download));
  editFolderButton: ElementFinder = this.component.element(by.id(Toolbar.selectors.editFolder));
  viewDetailsButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.viewDetails));
  printButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.print));
  fullScreenButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.fullScreen));
  joinButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.joinLibrary));
  leaveButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.leaveLibrary));
  permanentlyDeleteButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.permanentlyDelete));
  restoreButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.restore));

  constructor(ancestor?: ElementFinder) {
    super(Toolbar.selectors.root, ancestor);
  }

  async isEmpty() {
    const count = await this.buttons.count();
    return count === 0;
  }

  async numberOfAvailableActions() {
    return this.buttons.count();
  }

  async getButtons(): Promise<string[]> {
    return this.buttons.map(async elem => {
      return await elem.getAttribute('title');
    });
  }

  async isButtonPresent(title: string) {
    const elem = this.component.element(by.css(`${Toolbar.selectors.button}[title="${title}"]`));
    return elem.isPresent();
  }

  getButtonByLabel(label: string) {
    return this.component.element(by.cssContainingText(Toolbar.selectors.button, label));
  }

  getButtonByTitleAttribute(title: string) {
    return this.component.element(by.css(`${Toolbar.selectors.button}[title="${title}"]`));
  }

  getButtonById(id: string) {
    return this.component.element(by.id(id));
  }

  async openMoreMenu() {
    await this.isButtonPresent('More Actions');
    const moreMenu = this.getButtonByTitleAttribute('More Actions');
    await moreMenu.click();
    await this.menu.waitForMenuToOpen();
  }

  async closeMoreMenu() {
    await Utils.pressEscape();
  }

  async getButtonTooltip(button: ElementFinder) {
    return button.getAttribute('title');
  }

  async clickButton(title: string) {
    const btn = this.getButtonByTitleAttribute(title);
    await btn.click();
  }


  async isSharedLinkSettingsPresent() {
    return browser.isElementPresent(this.shareEditButton);
  }

  async isSharePresent() {
    return browser.isElementPresent(this.shareButton);
  }

  async isViewPresent() {
    return browser.isElementPresent(this.viewButton);
  }

  async isToggleSearchFiltersPresent() {
    return browser.isElementPresent(this.searchFiltersToggleButton);
  }

  async isDownloadPresent() {
    return browser.isElementPresent(this.downloadButton);
  }

  async isPermanentlyDeletePresent() {
    return browser.isElementPresent(this.permanentlyDeleteButton);
  }

  async isRestorePresent() {
    return browser.isElementPresent(this.restoreButton);
  }

  async isEditFolderPresent() {
    return browser.isElementPresent(this.editFolderButton);
  }

  async isViewDetailsPresent() {
    return browser.isElementPresent(this.viewDetailsButton);
  }

  async isPrintPresent() {
    return browser.isElementPresent(this.printButton);
  }

  async isFullScreenPresent() {
    return browser.isElementPresent(this.fullScreenButton);
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
    await this.viewButton.click();
  }

  async clickEditFolder() {
    await this.editFolderButton.click();
  }

  async clickViewDetails() {
    await this.viewDetailsButton.click();
  }

  async clickDownload() {
    await this.downloadButton.click();
  }

  async clickJoin() {
    await this.joinButton.click();
  }

  async clickLeave() {
    await this.leaveButton.click();
  }

  async clickPermanentlyDelete() {
    await this.permanentlyDeleteButton.click();
  }
  async clickRestore() {
    await this.restoreButton.click();
  }


  async clickMoreActionsFavorite() {
    await this.openMoreMenu();
    await this.menu.clickMenuItem('Favorite');
  }

  async clickMoreActionsRemoveFavorite() {
    await this.openMoreMenu();
    await this.menu.clickMenuItem('Remove Favorite');
  }

  async clickMoreActionsDelete() {
    await this.openMoreMenu();
    await this.menu.clickMenuItem('Delete');
  }

  async clickMoreActionsManageVersions() {
    await this.openMoreMenu();
    await this.menu.clickMenuItem('Manage Versions');
  }

  async clickMoreActionsMove() {
    await this.openMoreMenu();
    await this.menu.clickMenuItem('Move');
  }

  async clickMoreActionsCopy() {
    await this.openMoreMenu();
    await this.menu.clickMenuItem('Copy');
  }

  async clickMoreActionsEditOffline() {
    await this.openMoreMenu();
    await this.menu.clickMenuItem('Edit Offline');
  }

  async clickMoreActionsCancelEditing() {
    await this.openMoreMenu();
    await this.menu.clickMenuItem('Cancel Editing');
  }

  async clickMoreActionsUploadNewVersion() {
    await this.openMoreMenu();
    await this.menu.clickMenuItem('Upload New Version');
  }

  async clickFullScreen() {
    await this.fullScreenButton.click();
  }

}
