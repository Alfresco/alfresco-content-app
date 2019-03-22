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

import { LoginPage, BrowsingPage } from '../../pages/pages';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Upload files', () => {
  const username = `user-${Utils.random()}`;

  const folder1 = `folder1-${Utils.random()}`; let folder1Id;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    folder1Id = (await apis.user.nodes.createFolder(folder1)).entry.id;

    await loginPage.loginWith(username);
    done();
  });

  beforeEach(async (done) => {
    await page.clickPersonalFilesAndWait();
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(folder1Id);
    done();
  });

  it('Upload a file', async () => {
    await dataTable.doubleClickOnRowByName(folder1);
    await page.sidenav.openNewMenu();
    await page.sidenav.menu.uploadFile().sendKeys(`${__dirname}/create-folder.test.ts`);
  });
});
