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
import { BrowserActions } from '@alfresco/adf-testing';
import { Menu } from '../menu/menu';
import { Component } from '../component';
import { Utils } from '../../utilities/utils';

export class Toolbar extends Component {
  menu = new Menu();

  buttons = this.allByCss('button');
  shareButton = this.byCss(`.mat-icon-button[title='Share']`);
  shareEditButton = this.byCss(`.mat-icon-button[title='Shared Link Settings']`);
  viewButton = this.byCss(`.mat-icon-button[title='View']`);
  downloadButton = this.byCss(`.mat-icon-button[title='Download']`);
  editFolderButton = this.byId('app.toolbar.editFolder');
  viewDetailsButton = this.byCss(`.mat-icon-button[title='View Details']`);
  printButton = this.byCss(`.mat-icon-button[title='Print']`);
  fullScreenButton = this.byCss(`.mat-icon-button[title='Activate full-screen mode']`);
  joinButton = this.byCss(`.mat-icon-button[title='Join']`);
  leaveButton = this.byCss(`.mat-icon-button[title='Leave Library']`);
  permanentlyDeleteButton = this.byCss(`.mat-icon-button[title='Permanently Delete']`);
  restoreButton = this.byCss(`.mat-icon-button[title='Restore']`);

  constructor(ancestor?: string) {
    super('.adf-toolbar', ancestor);
  }

  async isEmpty(): Promise<boolean> {
    const count = await this.buttons.count();
    return count === 0;
  }

  async getButtons(): Promise<string[]> {
    return this.buttons.map(async (elem) => {
      return elem.getAttribute('title');
    });
  }

  async isButtonPresent(title: string) {
    const element = this.byCss(`button[title="${title}"]`);
    return element.isPresent();
  }

  getButtonByTitleAttribute(title: string) {
    return this.byCss(`button[title="${title}"]`);
  }

  getButtonById(id: string) {
    return this.component.element(by.id(id));
  }

  async openMoreMenu(): Promise<void> {
    await this.isButtonPresent('More Actions');

    const moreMenu = this.getButtonByTitleAttribute('More Actions');
    await BrowserActions.click(moreMenu);

    await this.menu.waitForMenuToOpen();
    await browser.sleep(500);
  }

  async closeMoreMenu() {
    await Utils.pressEscape();
  }

  async getButtonTooltip(button: ElementFinder): Promise<string> {
    return button.getAttribute('title');
  }

  async clickButton(title: string): Promise<void> {
    await BrowserActions.click(this.getButtonByTitleAttribute(title));
  }

  async isPrintPresent() {
    return browser.isElementPresent(this.printButton);
  }

  async clickMoreActionsFavorite(): Promise<void> {
    await this.openMoreMenu();
    await this.menu.clickMenuItem('Favorite');
  }

  async clickMoreActionsRemoveFavorite(): Promise<void> {
    await this.openMoreMenu();
    await this.menu.clickMenuItem('Remove Favorite');
  }

  async clickMoreActionsDelete(): Promise<void> {
    await this.openMoreMenu();
    await this.menu.clickMenuItem('Delete');
  }

  async clickMoreActionsManageVersions(): Promise<void> {
    await this.openMoreMenu();
    await this.menu.clickMenuItem('Manage Versions');
  }

  async clickMoreActionsMove(): Promise<void> {
    await this.openMoreMenu();
    await this.menu.clickMenuItem('Move');
  }

  async clickMoreActionsCopy(): Promise<void> {
    await this.openMoreMenu();
    await this.menu.copyAction.click();
  }

  async clickMoreActionsEditOffline(): Promise<void> {
    await this.openMoreMenu();
    await this.menu.clickMenuItem('Edit Offline');
  }

  async clickMoreActionsCancelEditing(): Promise<void> {
    await this.openMoreMenu();
    await this.menu.clickMenuItem('Cancel Editing');
  }

  async clickMoreActionsUploadNewVersion(): Promise<void> {
    await this.openMoreMenu();
    await this.menu.clickMenuItem('Upload New Version');
  }
}
