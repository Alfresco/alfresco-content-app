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

import { LoginPage } from '../../pages/pages';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { EXTENSIBILITY_CONFIGS } from '../../configs';
import { Utils } from '../../utilities/utils';
import { Header } from '../../components/components';
import { Menu } from './../../components/menu/menu';

describe('Extensions - Info Drawer', () => {
    const username = `user-${Utils.random()}`;

    const disabledMenu = {
      id: 'settings',
      title: 'App settings',
      description: 'Application settings',
      icon: 'settings'
    };

    const enabledMenu = {
      id: 'button',
      title: 'New Button',
      description: 'new button description',
      icon: 'alarm_on'
    };

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const header = new Header();
    const toolbarMenu = new Menu();

    const loginPage = new LoginPage();

    beforeAll(async (done) => {
      await apis.admin.people.createUser({ username });
      await loginPage.load();
      await Utils.setSessionStorageFromConfig(EXTENSIBILITY_CONFIGS.HEADER);
      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('Add a new button in the header - [C286474]', async () => {
      await header.openMoreMenu();
      expect(await toolbarMenu.isMenuItemPresent(enabledMenu.title)).toBe(true, 'menu item not present');
      expect(await toolbarMenu.getItemIconText(enabledMenu.title)).toEqual(enabledMenu.icon);
    });

    it('Disable a button from the header - [C286477]', async () => {
      await header.openMoreMenu();
      expect(await toolbarMenu.isMenuItemPresent(disabledMenu.title)).toBe(true, `${disabledMenu.title} menu item not present`);
      expect(await toolbarMenu.isMenuItemDisabled(disabledMenu.title)).toEqual('true', `${disabledMenu.title} is not disabled`);
    });

});
