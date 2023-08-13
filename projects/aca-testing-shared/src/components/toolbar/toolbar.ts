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

import { ElementFinder, by, browser, By, element } from 'protractor';
import { BrowserActions } from '@alfresco/adf-testing';
import { Menu } from '../menu/menu';
import { Component } from '../component';
import { Utils } from '../../utilities/utils';

export class Toolbar extends Component {
  menu = new Menu();

  buttons = this.allByCss('button');
  createButton = element(By.css('[id="app.toolbar.create"]'));
  uploadButton = element(By.css('[id="app.toolbar.upload"]'));
  shareButton = element(By.css('button[data-automation-id="share-action-button"]'));
  viewButton = element(By.css(`button[title='View']`));
  downloadButton = element(By.css(`.mat-icon-button[title='Download']`));
  viewDetailsButton = element(By.css(`button[title='View Details']`));
  printButton = element(By.css(`button[title='Print']`));
  fullScreenButton = element(By.css(`button[title='Activate full-screen mode']`));
  joinButton = element(By.css(`button[title='Join']`));
  leaveButton = element(By.css(`button[title='Leave Library']`));
  permanentlyDeleteButton = element(By.css(`button[title='Permanently Delete']`));
  restoreButton = element(By.css(`button[title='Restore']`));
  searchIconButton = element(By.css(`button[title='Search']`));
  viewerDownloadButton = element(By.css('[id="app.viewer.download"]'));

  constructor(ancestor?: string) {
    super('aca-toolbar', ancestor);
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

  async clickSearchIconButton() {
    await BrowserActions.click(this.searchIconButton);
  }

  async openViewerMoreMenu(): Promise<void> {
    const btnMoreActions = element(By.css('button[id="app.viewer.toolbar.more"]'));
    await btnMoreActions.isPresent();
    await BrowserActions.click(btnMoreActions);

    await this.menu.waitForMenuToOpen();
    await browser.sleep(500);
  }

  async openMoreMenu(): Promise<void> {
    const btnMoreActions = element(By.css('button[id="app.toolbar.more"]'));
    await btnMoreActions.isPresent();
    await BrowserActions.click(btnMoreActions);

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

  async openCreateFolderDialog(): Promise<void> {
    await this.openCreateMenu();
    await BrowserActions.click(this.menu.createFolderAction);
  }

  async openCreateFileFromTemplateDialog(): Promise<void> {
    await this.openCreateMenu();
    await BrowserActions.click(this.menu.createFileFromTemplateAction);
  }

  async openCreateFolderFromTemplateDialog(): Promise<void> {
    await this.openCreateMenu();
    await BrowserActions.click(this.menu.createFolderFromTemplateAction);
  }

  async openCreateMenu(): Promise<void> {
    await BrowserActions.click(this.createButton);
    await this.menu.waitForMenuToOpen();
  }
  async openUploadMenu(): Promise<void> {
    await BrowserActions.click(this.uploadButton);
    await this.menu.waitForMenuToOpen();
  }

  async closeUploadMenu(): Promise<void> {
    await BrowserActions.click(element(by.css('button[id="app.toolbar.upload"]')));
    await this.menu.waitForMenuToClose();
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
