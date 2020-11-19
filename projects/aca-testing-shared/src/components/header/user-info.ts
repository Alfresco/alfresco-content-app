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

import { Menu } from '../menu/menu';
import { Component } from '../component';
import { BrowserActions } from '@alfresco/adf-testing';

export class UserInfo extends Component {
  fullName = this.byCss('.current-user__full-name');
  avatar = this.byCss('.current-user__avatar');

  menu = new Menu();

  constructor(ancestor?: string) {
    super('aca-current-user', ancestor);
  }

  async openMenu(): Promise<Menu> {
    await BrowserActions.click(this.avatar);
    await this.menu.wait();

    return this.menu;
  }

  async signOut(): Promise<void> {
    const menu = await this.openMenu();
    await menu.clickMenuItem('Sign out');
  }
}
