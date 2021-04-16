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

import { ElementFinder, by, element, browser } from 'protractor';
import { Logger, BrowserActions } from '@alfresco/adf-testing';
import { SIDEBAR_LABELS, BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Menu } from '../menu/menu';
import { Component } from '../component';

export class Sidenav extends Component {
  links = this.component.all(by.css('.item'));
  activeLink = this.byCss('.action-button--active');
  newButton = this.allByCss('[data-automation-id="create-button"]');
  personalFiles = this.byCss(`[data-automation-id='app.navbar.personalFiles']`);
  fileLibraries = this.byCss(`[data-automation-id='app.navbar.libraries.menu']`);
  myLibraries = this.byCss(`[data-automation-id='app.navbar.libraries.files']`, browser);
  favoriteLibraries = this.byCss(`[data-automation-id='app.navbar.libraries.favorite']`, browser);
  shared = this.byCss(`[data-automation-id='app.navbar.shared']`);
  recentFiles = this.byCss(`[data-automation-id='app.navbar.recentFiles']`);
  favorites = this.byCss(`[data-automation-id='app.navbar.favorites']`);
  trash = this.byCss(`[data-automation-id='app.navbar.trashcan']`);

  menu: Menu = new Menu();

  constructor(ancestor?: string) {
    super('app-sidenav', ancestor);
  }

  private async expandMenu(name: string): Promise<void> {
    try {
      if (await element(by.cssContainingText('.mat-expanded', name)).isPresent()) {
        return Promise.resolve();
      } else {
        const link = this.getLink(name);
        await BrowserActions.click(link);
        await element(by.css('.mat-expansion-panel-body')).isPresent();
      }
    } catch (e) {
      Logger.error(`---- sidebar navigation catch expandMenu: failed to expand ${name} menu : `, e);
    }
  }

  async openNewMenu(): Promise<void> {
    await BrowserActions.click(this.newButton.first());
    await this.menu.waitForMenuToOpen();
  }

  async closeNewMenu(): Promise<void> {
    await BrowserActions.click(element(by.css('button[data-automation-id="create-button"] span span')));
    await this.menu.waitForMenuToClose();
  }

  async openCreateFolderDialog(): Promise<void> {
    await this.openNewMenu();
    await BrowserActions.click(this.menu.createFolderAction);
  }

  async openCreateLibraryDialog(): Promise<void> {
    await this.openNewMenu();
    await BrowserActions.click(this.menu.createLibraryAction);
  }

  async openCreateFileFromTemplateDialog(): Promise<void> {
    await this.openNewMenu();
    await BrowserActions.click(this.menu.createFileFromTemplateAction);
  }

  async openCreateFolderFromTemplateDialog(): Promise<void> {
    await this.openNewMenu();
    await BrowserActions.click(this.menu.createFolderFromTemplateAction);
  }

  async isActive(name: string): Promise<boolean> {
    const cssClass = await this.getLinkLabel(name).getAttribute('class');
    return cssClass.includes('action-button--active');
  }

  async childIsActive(name: string): Promise<boolean> {
    const childClass = await this.getLinkLabel(name).element(by.css('span')).getAttribute('class');
    return childClass.includes('action-button--active');
  }

  getLink(name: string): ElementFinder {
    return this.getLinkLabel(name).element(by.xpath('..'));
  }

  private getLinkLabel(name: string): ElementFinder {
    switch (name) {
      case 'Personal Files':
        return this.personalFiles;
      case 'File Libraries':
        return this.fileLibraries;
      case 'My Libraries':
        return this.myLibraries;
      case 'Favorite Libraries':
        return this.favoriteLibraries;
      case 'Shared':
        return this.shared;
      case 'Recent Files':
        return this.recentFiles;
      case 'Favorites':
        return this.favorites;
      case 'Trash':
        return this.trash;
      default:
        return this.personalFiles;
    }
  }

  async getLinkTooltip(name: string): Promise<string> {
    const link = this.getLinkLabel(name);
    const condition = () => link.getAttribute('title').then((value) => value && value.length > 0);

    await browser.actions().mouseMove(link).perform();
    await browser.wait(condition, BROWSER_WAIT_TIMEOUT);

    return link.getAttribute('title');
  }

  async clickLink(name: string): Promise<void> {
    try {
      const link = this.getLinkLabel(name);
      await BrowserActions.click(link);
    } catch (error) {
      Logger.error(`---- clickLink catch : sidebar navigation failed to click on - ${name} : `, error);
    }
  }

  async isFileLibrariesMenuExpanded(): Promise<boolean> {
    return element(by.cssContainingText('.mat-expanded', SIDEBAR_LABELS.FILE_LIBRARIES)).isPresent();
  }

  async expandFileLibraries(): Promise<void> {
    await this.expandMenu(SIDEBAR_LABELS.FILE_LIBRARIES);
  }
}
