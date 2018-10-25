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

import { ElementFinder, by, browser } from 'protractor';
import { Component } from '../component';
import { UserInfo } from './user-info';
import { protractor } from 'protractor';
import { Utils } from '../../utilities/utils';
import { Menu } from '../menu/menu';
import { Toolbar } from './../toolbar/toolbar';

export class Header extends Component {
  private locators = {
    root: 'app-header',
    logoLink: by.css('.app-menu__title'),
    userInfo: by.css('aca-current-user'),
    searchButton: by.css('#adf-search-button'),
    searchBar: by.css('#adf-control-input'),
    moreActions: by.id('app.header.more')
  };

  logoLink: ElementFinder = this.component.element(this.locators.logoLink);
  userInfo: UserInfo = new UserInfo(this.component);
  searchButton: ElementFinder = this.component.element(this.locators.searchButton);
  searchBar: ElementFinder = this.component.element(this.locators.searchBar);
  moreActions: ElementFinder = browser.element(this.locators.moreActions);

  menu: Menu = new Menu();
  toolbar: Toolbar = new Toolbar();

  constructor(ancestor?: ElementFinder) {
    super('adf-layout-header', ancestor);
  }

  async searchForText(text: string) {
    await this.searchBar.clear();
    await this.searchBar.sendKeys(text);
    await this.searchBar.sendKeys(protractor.Key.ENTER);
  }

  async waitForSearchButton() {
    await Utils.waitUntilElementClickable(this.searchButton);
  }

  async waitForSearchBar() {
    await Utils.waitUntilElementClickable(this.searchBar);
  }

  async openMoreMenu() {
    await this.moreActions.click();
    await this.menu.waitForMenuToOpen();
  }
}

