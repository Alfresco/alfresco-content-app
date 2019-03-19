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

import { BrowsingPage, LoginPage } from '../../pages/pages';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { EXTENSIBILITY_CONFIGS } from '../../configs';
import { Utils } from '../../utilities/utils';

describe('Extensions - DocumentList presets', () => {
  const username = `user-${Utils.random()}`;
  const file = `file-${Utils.random()}.txt`;
  let fileId;

  const testData = [
    {
      id: 'app.files.name',
      label: 'Name'
    },
    {
      id: 'app.files.thumbnail',
      label: 'Thumbnail'
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

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    fileId = (await apis.user.nodes.createFile(file)).entry.id;

    await loginPage.load();
    await Utils.setSessionStorageFromConfig(EXTENSIBILITY_CONFIGS.DOCUMENT_LIST_PRESETS);
    await loginPage.loginWith(username);

    done();
  });

  beforeEach(async done => {
    await page.clickPersonalFilesAndWait();
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(fileId);
    done();
  });

  it('Sets the columns to display - [C286700]', async () => {
    const expectedColumns = testData
      .filter(item => !item.disabled)
      .map(data => data.label);
    const actualColumns = await dataTable.getColumnHeadersText();

    expect(actualColumns).toEqual(expectedColumns);
  });

  it('Disabled items are not shown - [C286699]', async () => {
    const noColumnLabel = testData.find(item => item.disabled).label;
    const element = dataTable.getColumnHeaderByLabel(noColumnLabel);

    expect(await element.isPresent()).toBe(false, `"${noColumnLabel}" is displayed`);
  });
});
