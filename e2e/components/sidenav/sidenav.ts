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

import { ElementFinder, ElementArrayFinder, by, element, browser } from 'protractor';
import { SIDEBAR_LABELS, BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Menu } from '../menu/menu';
import { Component } from '../component';
import { Utils } from '../../utilities/utils';

export class Sidenav extends Component {
  private static selectors = {
    root: 'app-sidenav',
    link: '.item',
    label: '.action-button__label',
    expansion_panel: ".mat-expansion-panel-header",
    expansion_panel_content: ".mat-expansion-panel-body",
    active: 'mat-accent',
    activeClass: '.action-button--active',
    activeClassName: 'action-button--active',
    activeChild: 'action-button--active',

    newButton: '[data-automation-id="create-button"]',

    personalFiles: `[data-automation-id='app.navbar.personalFiles']`,
    fileLibraries: `[data-automation-id='app.navbar.libraries.menu']`,
    myLibraries: `[data-automation-id='app.navbar.libraries.files']`,
    favoriteLibraries: `[data-automation-id='app.navbar.libraries.favorite']`,
    shared: `[data-automation-id='app.navbar.shared']`,
    recentFiles: `[data-automation-id='app.navbar.recentFiles']`,
    favorites: `[data-automation-id='app.navbar.favorites']`,
    trash: `[data-automation-id='app.navbar.trashcan']`
  };

  links: ElementArrayFinder = this.component.all(by.css(Sidenav.selectors.link));
  activeLink: ElementFinder = this.component.element(by.css(Sidenav.selectors.activeClass));

  newButton: ElementArrayFinder = this.component.all(by.css(Sidenav.selectors.newButton));

  personalFiles: ElementFinder = this.component.element(by.css(Sidenav.selectors.personalFiles));
  fileLibraries: ElementFinder = this.component.element(by.css(Sidenav.selectors.fileLibraries));
  myLibraries: ElementFinder = browser.element(by.css(Sidenav.selectors.myLibraries));
  favoriteLibraries: ElementFinder = browser.element(by.css(Sidenav.selectors.favoriteLibraries));
  shared: ElementFinder = this.component.element(by.css(Sidenav.selectors.shared));
  recentFiles: ElementFinder = this.component.element(by.css(Sidenav.selectors.recentFiles));
  favorites: ElementFinder = this.component.element(by.css(Sidenav.selectors.favorites));
  trash: ElementFinder = this.component.element(by.css(Sidenav.selectors.trash));

  menu: Menu = new Menu();

  constructor(ancestor?: string) {
    super(Sidenav.selectors.root, ancestor);
  }

  private async expandMenu(name: string): Promise<void> {
    try{

      if (await element(by.cssContainingText('.mat-expanded', name)).isPresent()) {
        return Promise.resolve();
      } else {
        const link = this.getLink(name);
        await Utils.waitUntilElementClickable(link);
        await link.click();
        await element(by.css(Sidenav.selectors.expansion_panel_content)).isPresent();
      }

    } catch (e) {
      console.log('---- sidebar navigation catch expandMenu: ', e);
    }
  }

  async openNewMenu(): Promise<void> {
    await this.newButton.click();
    await this.menu.waitForMenuToOpen();
  }

  async openCreateFolderDialog(): Promise<void> {
    await this.openNewMenu();
    await this.menu.clickCreateFolder();
  }

  async openCreateLibraryDialog(): Promise<void> {
    await this.openNewMenu();
    await this.menu.clickCreateLibrary();
  }

  async openCreateFileFromTemplateDialog(): Promise<void> {
    await this.openNewMenu();
    await this.menu.clickCreateFileFromTemplate();
  }

  async openCreateFolderFromTemplateDialog(): Promise<void> {
    await this.openNewMenu();
    await this.menu.clickCreateFolderFromTemplate();
  }

  async isActive(name: string): Promise<boolean> {
    return (await this.getLinkLabel(name).getAttribute('class')).includes(Sidenav.selectors.activeClassName);
  }

  async childIsActive(name: string): Promise<boolean> {
    const childClass = await this.getLinkLabel(name).element(by.css('span')).getAttribute('class');
    return childClass.includes(Sidenav.selectors.activeChild);
  }

  getLink(name: string): ElementFinder {
    return this.getLinkLabel(name).element(by.xpath('..'));
  }

  getLinkLabel(name: string): ElementFinder {
    switch (name) {
      case 'Personal Files': return this.personalFiles;
      case 'File Libraries': return this.fileLibraries;
      case 'My Libraries': return this.myLibraries;
      case 'Favorite Libraries': return this.favoriteLibraries;
      case 'Shared': return this.shared;
      case 'Recent Files': return this.recentFiles;
      case 'Favorites': return this.favorites;
      case 'Trash': return this.trash;
      default: return this.personalFiles;
    }
  }

  getActiveLink(): ElementFinder {
    return this.activeLink;
  }

  async getLinkTooltip(name: string): Promise<string> {
    const link = this.getLinkLabel(name);
    const condition = () => link.getAttribute('title').then(value => value && value.length > 0);

    await browser.actions().mouseMove(link).perform();
    await browser.wait(condition, BROWSER_WAIT_TIMEOUT);

    return link.getAttribute('title');
  }

  async clickLink(name: string): Promise<void> {
    try{
      const link = this.getLinkLabel(name);
      await Utils.waitUntilElementClickable(link);
      await link.click();
    } catch (error) {
      console.log('---- sidebar navigation clickLink catch error: ', error);
    }
  }

  async isFileLibrariesMenuExpanded(): Promise<boolean> {
    return element(by.cssContainingText('.mat-expanded', SIDEBAR_LABELS.FILE_LIBRARIES)).isPresent();
  }

  async expandFileLibraries(): Promise<void> {
    await this.expandMenu(SIDEBAR_LABELS.FILE_LIBRARIES);
  }

}
