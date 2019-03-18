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

import { ElementFinder, by } from 'protractor';
import { Menu } from '../menu/menu';
import { Component } from '../component';

export class UserInfo extends Component {
  private static selectors = {
    avatar: by.css('.current-user__avatar'),
    fullName: by.css('.current-user__full-name'),
    menuItems: by.css('[mat-menu-item]')
  };

  fullName: ElementFinder = this.component.element(UserInfo.selectors.fullName);
  avatar: ElementFinder = this.component.element(UserInfo.selectors.avatar);

  menu: Menu = new Menu();

  constructor(ancestor?: ElementFinder) {
    super('aca-current-user', ancestor);
  }

  async openMenu() {
    const { menu, avatar } = this;

    await avatar.click();
    await menu.wait();
    return menu;
  }

  getName() {
    return this.fullName.getText();
  }

  async signOut() {
    const menu = await this.openMenu();
    await menu.clickMenuItem('Sign out');
  }
}
