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

import { browser } from 'protractor';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('Generic errors', () => {
  const username = `user-${Utils.random()}`;

  const username2 = `user2-${Utils.random()}`;

  const parent = `folder-${Utils.random()}`; let parentId;
  const file1 = `file1-${Utils.random()}.txt`; let file1Id;
  const file2 = `file2-${Utils.random()}.txt`;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    await apis.admin.people.createUser({ username: username2 });
    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
    file1Id = (await apis.user.nodes.createFile(file1, parentId)).entry.id;
    await apis.user.nodes.createFile(file2, parentId);

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(parentId);
    await apis.user.trashcan.emptyTrash();
    done();
  });

  it('File / folder not found - [C217313]', async () => {
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(parent);
    await dataTable.doubleClickOnRowByName(file1);
    const URL = await browser.getCurrentUrl();
    await apis.user.nodes.deleteNodeById(file1Id, false);
    await browser.get(URL);

    expect(await page.isGenericErrorDisplayed()).toBe(true, 'Generic error page not displayed');
    expect(await page.getGenericErrorTitle()).toContain(`This item no longer exists or you don't have permission to view it.`);
  });

  it('Invalid URL - [C217315]', async () => {
    await page.load('/invalid page');

    expect(await page.isGenericErrorDisplayed()).toBe(true, 'Generic error page not displayed');
    expect(await page.getGenericErrorTitle()).toContain(`This item no longer exists or you don't have permission to view it.`);

  });

  it('Permission denied - [C217314]', async () => {
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(parent);
    await dataTable.doubleClickOnRowByName(file2);
    const URL = await browser.getCurrentUrl();
    await loginPage.loginWith(username2);
    await browser.get(URL);

    expect(await page.isGenericErrorDisplayed()).toBe(true, 'Generic error page not displayed');
    expect(await page.getGenericErrorTitle()).toContain(`This item no longer exists or you don't have permission to view it.`);

    await loginPage.loginWith(username);
  });
});
