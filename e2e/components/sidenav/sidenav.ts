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

import { ElementFinder, ElementArrayFinder, by } from 'protractor';
import { Menu } from '../menu/menu';
import { Component } from '../component';
import { Utils } from '../../utilities/utils';

export class Sidenav extends Component {
  private static selectors = {
    root: 'app-sidenav',
    link: '.sidenav-menu__item',
    label: '.menu__item--label',
    activeLink: '.menu__item--active',
    newButton: '[data-automation-id="create-button"]'
  };

  links: ElementArrayFinder = this.component.all(by.css(Sidenav.selectors.link));
  activeLink: ElementFinder = this.component.element(by.css(Sidenav.selectors.activeLink));
  newButton: ElementArrayFinder = this.component.all(by.css(Sidenav.selectors.newButton));

  menu: Menu = new Menu();

  constructor(ancestor?: ElementFinder) {
    super(Sidenav.selectors.root, ancestor);
  }

  async openNewMenu() {
    const { menu, newButton } = this;

    await newButton.click();
    await menu.waitForMenuToOpen();
  }

  async openCreateDialog() {
    await this.openNewMenu();
    await this.menu.clickMenuItem('Create folder');
  }

  async isActiveByLabel(label: string) {
    const className = await this.getLinkByLabel(label).getAttribute('class');
    return className.includes(Sidenav.selectors.activeLink.replace('.', ''));
  }

  getLink(label: string) {
    return this.component.element(by.cssContainingText(Sidenav.selectors.link, label));
  }

  getLinkByLabel(label: string) {
    return this.component.element(by.cssContainingText(Sidenav.selectors.label, label));
    // return browser.element(by.xpath(`.//*[.="${label}" and class="${Sidenav.selectors.label}"]`))
  }

  async getLinkTooltip(label: string) {
    return await this.getLink(label).getAttribute('title');
  }

  async navigateToLinkByLabel(label: string) {
    try{
      const link = this.getLinkByLabel(label);
      await Utils.waitUntilElementClickable(link);
      return await link.click();

    } catch (e){
      console.log('---- sidebar navigation catch : ', e);
    }
  }
}
