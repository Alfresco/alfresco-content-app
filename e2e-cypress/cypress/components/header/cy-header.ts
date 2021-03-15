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

import { CyComponent } from '../cy-component';
import { CyUserInfo } from './cy-user-info';
import { CyMenu } from '../menu/cy-menu';
// import { Toolbar } from './../toolbar/toolbar';
import { CySearchInput } from '../search/cy-search-input';
// import { waitElement } from '../../utilities/utils';

export class CyHeader extends CyComponent {
  logoLink = '.app-menu__title';
  moreActions = '[id="app.header.more"]';
  sidenavToggle = `[id='adf-sidebar-toggle-start']`;

  userInfo = new CyUserInfo();
  menu = new CyMenu();
  // toolbar = new Toolbar();
  searchInput = new CySearchInput();

  constructor(ancestor?: string) {
    super('adf-layout-header', ancestor);
  }

  openMoreMenu() {
    cy.get(this.moreActions).click();
    // await this.menu.waitForMenuToOpen();
  }

  closeMoreMenu() {
    cy.get(this.moreActions).click();
    // await this.menu.waitForMenuToClose();
  }

  // async isSidenavExpanded() {
  //   return browser.isElementPresent(by.css(`[data-automation-id='expanded']`));
  // }

  // async expandSideNav() {
  //   const expanded = await this.isSidenavExpanded();
  //   if (!expanded) {
  //     await BrowserActions.click(this.sidenavToggle);
  //     await waitElement(`[data-automation-id='expanded']`);
  //   }
  // }

  // async collapseSideNav() {
  //   const expanded = await this.isSidenavExpanded();
  //   if (expanded) {
  //     await BrowserActions.click(this.sidenavToggle);
  //     await waitElement(`[data-automation-id='collapsed']`);
  //   }
  // }
}
