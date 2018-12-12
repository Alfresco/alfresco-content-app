/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { ElementFinder, ElementArrayFinder, by, element } from 'protractor';
import { SIDEBAR_LABELS } from '../../configs';
import { Menu } from '../menu/menu';
import { Component } from '../component';
import { Utils } from '../../utilities/utils';

export class Sidenav extends Component {
  private static selectors = {
    root: 'app-sidenav',
    link: '.menu__item',
    label: '.item--label',
    expansion_panel: ".mat-expansion-panel-header",
    expansion_panel_content: ".mat-expansion-panel-body",
    active: 'item--active',
    activeLink: '.item--active',
    newButton: '[data-automation-id="create-button"]'
  };

  links: ElementArrayFinder = this.component.all(by.css(Sidenav.selectors.link));
  activeLink: ElementFinder = this.component.element(by.css(Sidenav.selectors.activeLink));
  newButton: ElementArrayFinder = this.component.all(by.css(Sidenav.selectors.newButton));

  menu: Menu = new Menu();

  constructor(ancestor?: ElementFinder) {
    super(Sidenav.selectors.root, ancestor);
  }

  private async expandMenu(name: string) {
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

  async openNewMenu() {
    const { menu, newButton } = this;

    await newButton.click();
    await menu.waitForMenuToOpen();
  }

  async openCreateFolderDialog() {
    await this.openNewMenu();
    await this.menu.clickMenuItem('Create folder');
  }

  async openCreateLibraryDialog() {
    await this.openNewMenu();
    await this.menu.clickMenuItem('Create Library');
  }

  async isActive(name: string) {
    const className = await this.getLinkLabel(name).getAttribute('class');
    return className.includes(Sidenav.selectors.active);
  }

  async childIsActive(name: string) {
    const childClass = await this.getLinkLabel(name).element(by.css('span')).getAttribute('class');
    return childClass.includes(Sidenav.selectors.active);
  }

  getLink(name: string) {
    return this.getLinkLabel(name).element(by.xpath('..'));
  }

  getLinkLabel(name: string) {
    return this.component.element(by.cssContainingText(Sidenav.selectors.label, name));
  }

  getActiveLink() {
    return this.activeLink;
  }

  async getLinkTooltip(name: string) {
    return await this.getLink(name).getAttribute('title');
  }

  async navigateToLink(name: string) {
    try{
      const link = this.getLinkLabel(name);
      await Utils.waitUntilElementClickable(link);
      return await link.click();

    } catch (e){
      console.log('---- sidebar navigation catch navigateToLink: ', e);
    }
  }

  async isFileLibrariesMenuExpanded() {
    return await element(by.cssContainingText('.mat-expanded', SIDEBAR_LABELS.FILE_LIBRARIES)).isPresent();
  }

  async expandFileLibraries() {
    return await this.expandMenu(SIDEBAR_LABELS.FILE_LIBRARIES);
  }

}
