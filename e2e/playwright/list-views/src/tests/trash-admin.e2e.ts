/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { expect } from '@playwright/test';
import { ApiClientFactory, NodesApi, Utils, test, users } from '@alfresco/aca-playwright-shared';

test.describe('Trash admin', () => {
  const folderAdmin = `C213217-deleteFolder-${Utils.random()}`;
  let folderAdminId: string;
  let adminApiActions: NodesApi;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      adminApiActions = await NodesApi.initialize('admin');
      folderAdminId = (await adminApiActions.createFolder(folderAdmin)).entry.id;
      await adminApiActions.deleteNodeById(folderAdminId, false);
    } catch (error) {
      console.error(`----- beforeAll failed : ${error}`);
    }
  });

  test.afterAll(async () => {
    await adminApiActions.deleteDeletedNode(folderAdminId);
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, users.admin.username, users.admin.password, 'beforeEach failed');
  });

  test.describe('as admin', () => {
    test('[XAT-4465] Trash list has correct columns - admin', async ({ trashPage }) => {
      await trashPage.navigate();
      const expectedColumns = ['Name', 'Location', 'Size', 'Deleted', 'Deleted by'];
      const actualColumns = Utils.trimArrayElements(await trashPage.dataTable.getColumnHeaders());

      expect(actualColumns).toEqual(expectedColumns);
    });
  });
});
