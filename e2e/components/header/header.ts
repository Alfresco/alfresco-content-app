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

import { ElementFinder, by, browser, until } from 'protractor';
import { Component } from '../component';
import { UserInfo } from './user-info';
import { Menu } from '../menu/menu';
import { Toolbar } from './../toolbar/toolbar';
import { SearchInput } from '../search/search-input';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';

export class Header extends Component {
  private static selectors = {
    root: 'app-header',
    logoLink: by.css('.app-menu__title'),
    userInfo: by.css('aca-current-user'),
    moreActions: by.id('app.header.more'),

    sidenavToggle: `[id='adf-sidebar-toggle-start']`,
    expandedSidenav: by.css(`[data-automation-id='expanded']`),
    collapsedSidenav: by.css(`[data-automation-id='collapsed']`)
  };

  logoLink: ElementFinder = this.component.element(Header.selectors.logoLink);
  moreActions: ElementFinder = browser.element(Header.selectors.moreActions);
  sidenavToggle: ElementFinder = this.component.element(by.css(Header.selectors.sidenavToggle));

  userInfo: UserInfo = new UserInfo(this.component);
  menu: Menu = new Menu();
  toolbar: Toolbar = new Toolbar();
  searchInput: SearchInput = new SearchInput();

  constructor(ancestor?: ElementFinder) {
    super('adf-layout-header', ancestor);
  }

  async openMoreMenu() {
    await this.moreActions.click();
    await this.menu.waitForMenuToOpen();
  }

  async isSignOutDisplayed() {
    return this.userInfo.menu.isMenuItemPresent('Sign out');
  }

  async clickSidenavToggle() {
    await this.sidenavToggle.click();
  }

  async isSidenavExpanded() {
    return browser.isElementPresent(Header.selectors.expandedSidenav);
  }

  async expandSideNav() {
    const expanded = await this.isSidenavExpanded();
    if ( !expanded ) {
      await this.clickSidenavToggle();
      await browser.wait(until.elementLocated(Header.selectors.expandedSidenav), BROWSER_WAIT_TIMEOUT, '--- timeout waiting for expanded sidenav' );
    }
  }

  async collapseSideNav() {
    const expanded = await this.isSidenavExpanded();
    if ( expanded ) {
      await this.clickSidenavToggle();
      await browser.wait(until.elementLocated(Header.selectors.collapsedSidenav), BROWSER_WAIT_TIMEOUT, '--- timeout waiting for collapsed sidenav')
    }
  }

}

