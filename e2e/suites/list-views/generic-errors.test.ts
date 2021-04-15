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

import { browser } from 'protractor';
import { AdminActions, UserActions, LoginPage, BrowsingPage, Utils, RepoClient } from '@alfresco/aca-testing-shared';
import { Logger } from '@alfresco/adf-testing';

describe('Generic errors', () => {
  const username = `user-${Utils.random()}`;
  const username2 = `user2-${Utils.random()}`;

  const parent = `folder-${Utils.random()}`;
  let parentId: string;
  const file1 = `file1-${Utils.random()}.txt`;
  let file1Id: string;
  const file2 = `file2-${Utils.random()}.txt`;

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;

  const adminApiActions = new AdminActions();
  const userActions = new UserActions();

  beforeAll(async (done) => {
    try {
      await adminApiActions.createUser({ username });
      await adminApiActions.createUser({ username: username2 });

      parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
      file1Id = (await apis.user.nodes.createFile(file1, parentId)).entry.id;
      await apis.user.nodes.createFile(file2, parentId);

      await loginPage.loginWith(username);
    } catch (error) {
      Logger.error(`----- beforeAll failed : ${error}`);
    }
    done();
  });

  afterAll(async () => {
    await userActions.login(username, username);
    await userActions.deleteNodes([parentId]);
    await userActions.emptyTrashcan();
  });

  it('[C217313] File / folder not found', async () => {
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(parent);
    await dataTable.doubleClickOnRowByName(file1);
    const URL = await browser.getCurrentUrl();
    await apis.user.nodes.deleteNodeById(file1Id, false);
    await browser.get(URL);

    expect(await page.genericError.isDisplayed()).toBe(true, 'Generic error page not displayed');
    expect(await page.genericErrorTitle.getText()).toContain(`This item no longer exists or you don't have permission to view it.`);
  });

  it('[C217315] Invalid URL', async () => {
    await page.load('/invalid page');

    expect(await page.genericError.isDisplayed()).toBe(true, 'Generic error page not displayed');
    expect(await page.genericErrorTitle.getText()).toContain(`This item no longer exists or you don't have permission to view it.`);
  });

  it('[C217314] Permission denied', async () => {
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(parent);
    await dataTable.doubleClickOnRowByName(file2);
    const URL = await browser.getCurrentUrl();
    await loginPage.loginWith(username2);
    await browser.get(URL);

    expect(await page.genericError.isDisplayed()).toBe(true, 'Generic error page not displayed');
    expect(await page.genericErrorTitle.getText()).toContain(`This item no longer exists or you don't have permission to view it.`);

    await loginPage.loginWith(username);
  });
});
