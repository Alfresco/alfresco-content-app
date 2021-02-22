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

import { BrowsingPage, RepoClient, EXTENSIBILITY_CONFIGS, Utils } from '@alfresco/aca-testing-shared';
import { ApiService, LoginPage, UsersActions } from '@alfresco/adf-testing';

describe('Extensions - DocumentList presets', () => {
  const file = `file-${Utils.random()}.txt`;
  let fileId: string;

  const testData = [
    {
      id: 'app.files.name',
      label: 'Name'
    },
    {
      id: 'app.files.size',
      label: 'Size',
      disabled: true
    },
    {
      id: 'app.files.modifiedBy',
      label: 'Test header'
    },
    {
      id: 'some.id.createdBy',
      label: 'New column'
    }
  ];

  const apiService = new ApiService();
  const repoClient = new RepoClient(apiService);
  const adminApiService = new ApiService();
  const usersActions = new UsersActions(adminApiService);

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;

  beforeAll(async (done) => {
    await adminApiService.loginWithProfile('admin');
    const user = await usersActions.createUser();
    await apiService.login(user.username, user.password);

    fileId = (await repoClient.nodes.createFile(file)).entry.id;

    await Utils.setSessionStorageFromConfig(EXTENSIBILITY_CONFIGS.DOCUMENT_LIST_PRESETS);
    await loginPage.login(user.username, user.password);

    done();
  });

  beforeEach(async (done) => {
    await page.clickPersonalFilesAndWait();
    done();
  });

  afterAll(async (done) => {
    await repoClient.nodes.deleteNodeById(fileId);
    done();
  });

  it('[C286700] Sets the columns to display', async () => {
    const expectedColumns = testData.filter((item) => !item.disabled).map((data) => data.label);
    const actualColumns = await dataTable.getColumnHeadersText();

    await expect(actualColumns).toEqual(expectedColumns);
  });

  it('[C286699] Disabled items are not shown', async () => {
    const noColumnLabel = testData.find((item) => item.disabled).label;
    const element = dataTable.getColumnHeaderByLabel(noColumnLabel);

    expect(await element.isPresent()).toBe(false, `"${noColumnLabel}" is displayed`);
  });
});
