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

import { AdminActions, LoginPage, BrowsingPage, RepoClient, InfoDrawer, Utils } from '@alfresco/aca-testing-shared';
import { BrowserActions } from '@alfresco/adf-testing';

describe('General', () => {
  const username = `user1-${Utils.random()}`;

  const parent = `parent-${Utils.random()}`;
  let parentId: string;

  const file1 = `file1-${Utils.random()}.txt`;
  const folder1 = `folder1-${Utils.random()}`;

  const apis = {
    user: new RepoClient(username, username)
  };

  const infoDrawer = new InfoDrawer();

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;
  const adminApiActions = new AdminActions();

  beforeAll(async (done) => {
    await adminApiActions.createUser({ username });

    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
    await apis.user.nodes.createFile(file1, parentId);
    await apis.user.nodes.createFolder(folder1, parentId);

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(parentId);
    done();
  });

  beforeEach(async (done) => {
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(parent);
    done();
  });

  afterEach(async (done) => {
    if (await infoDrawer.isOpen()) {
      await BrowserActions.click(page.toolbar.viewDetailsButton);
    }
    done();
  });

  it('[C268999] Info drawer closes on page refresh', async () => {
    await dataTable.selectItem(file1);
    await BrowserActions.click(page.toolbar.viewDetailsButton);
    expect(await infoDrawer.isOpen()).toBe(true, 'Info drawer not open');

    await page.refresh();
    await dataTable.waitForBody();

    expect(await infoDrawer.isOpen()).toBe(false, 'Info drawer open');
  });
});
