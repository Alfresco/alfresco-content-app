/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { by, browser, By, element } from 'protractor';
import { Menu } from '../menu/menu';
import { Component } from '../component';
import { click, Utils } from '../../utilities';

export class Toolbar extends Component {
  menu = new Menu();

  buttons = this.allByCss('button');
  createButton = element(By.css('[id="app.toolbar.create"]'));
  uploadButton = element(By.css('[id="app.toolbar.upload"]'));
  downloadButton = element(By.css(`.mat-icon-button[title='Download']`));
  viewDetailsButton = element(By.css(`button[title='View Details']`));
  permanentlyDeleteButton = element(By.css(`button[title='Permanently Delete']`));
  restoreButton = element(By.css(`button[title='Restore']`));
  searchIconButton = element(By.css(`button[title='Search']`));
  viewerDownloadButton = element(By.css('[id="app.viewer.download"]'));

  constructor(ancestor?: string) {
    super('aca-toolbar', ancestor);
  }

  async isButtonPresent(title: string) {
    const element = this.byCss(`button[title="${title}"]`);
    return element.isPresent();
  }

  async clickSearchIconButton() {
    await click(this.searchIconButton);
  }

  async openMoreMenu(): Promise<void> {
    const btnMoreActions = element(By.css('button[id="app.toolbar.more"]'));
    await btnMoreActions.isPresent();
    await click(btnMoreActions);

    await this.menu.waitForMenuToOpen();
    await browser.sleep(500);
  }

  async closeMoreMenu() {
    await Utils.pressEscape();
  }

  async openUploadMenu(): Promise<void> {
    await click(this.uploadButton);
    await this.menu.waitForMenuToOpen();
  }

  async closeUploadMenu(): Promise<void> {
    await click(element(by.css('button[id="app.toolbar.upload"]')));
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
