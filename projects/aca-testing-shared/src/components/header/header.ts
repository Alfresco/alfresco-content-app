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

import { by, browser } from 'protractor';
import { Component } from '../component';
import { UserInfo } from './user-info';
import { Menu } from '../menu/menu';
import { Toolbar } from './../toolbar/toolbar';
import { SearchInput } from '../search/search-input';
import { waitElement } from '../../utilities/utils';
import { BrowserActions } from '@alfresco/adf-testing';

export class Header extends Component {
  logoLink = this.byCss('.app-menu__title');
  moreActions = browser.element(by.id('app.header.more'));
  sidenavToggle = this.byCss(`[id='adf-sidebar-toggle-start']`);

  userInfo = new UserInfo();
  menu = new Menu();
  toolbar = new Toolbar();
  searchInput = new SearchInput();

  constructor(ancestor?: string) {
    super('adf-layout-header', ancestor);
  }

  async openMoreMenu(): Promise<void> {
    await BrowserActions.click(this.moreActions);
    await this.menu.waitForMenuToOpen();
  }

  async closeMoreMenu(): Promise<void> {
    await BrowserActions.click(this.moreActions);
    await this.menu.waitForMenuToClose();
  }

  async isSidenavExpanded(): Promise<boolean> {
    return browser.isElementPresent(by.css(`[data-automation-id='expanded']`));
  }

  async expandSideNav(): Promise<void> {
    const expanded = await this.isSidenavExpanded();
    if (!expanded) {
      await BrowserActions.click(this.sidenavToggle);
      await waitElement(`[data-automation-id='expanded']`);
    }
  }

  async collapseSideNav(): Promise<void> {
    const expanded = await this.isSidenavExpanded();
    if (expanded) {
      await BrowserActions.click(this.sidenavToggle);
      await waitElement(`[data-automation-id='collapsed']`);
    }
  }
}
