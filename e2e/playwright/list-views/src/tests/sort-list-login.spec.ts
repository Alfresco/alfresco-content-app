/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import {
  ApiClientFactory,
  FileActionsApi,
  LoginPage,
  NodesApi,
  PersonalFilesPage,
  TEST_FILES,
  Utils,
  test,
  timeouts
} from '@alfresco/playwright-shared';

let initialSortState: {
  sortingColumn: string;
  sortingOrder: string;
  firstElement: string;
};

async function getSortState(myPersonalFiles: PersonalFilesPage): Promise<typeof initialSortState> {
  return {
    sortingColumn: await myPersonalFiles.dataTable.getSortedColumnHeaderText(),
    sortingOrder: await myPersonalFiles.dataTable.getSortingOrder(),
    firstElement: await myPersonalFiles.dataTable.getFirstElementDetail('Name')
  };
}

test.describe.only('Remember sorting', () => {
  interface NodesIds {
    [index: string]: string;
  }

  const user1 = `userSortLogin1-${Utils.random()}`;
  const user2 = `userSortLogin2-${Utils.random()}`;
  const pdfFileNames = [...new Array(14).fill(100)].map((v, i) => `file-${v + i}.pdf`);
  const jpgFileNames = [...new Array(12).fill(114)].map((v, i) => `file-${v + i}.jpg`);

  const testData = {
    user1: {
      files: {
        jpg: jpgFileNames,
        pdf: pdfFileNames
      }
    },
    user2: {
      files: [pdfFileNames[0], jpgFileNames[0]]
    }
  };

  test.beforeAll(async () => {
    test.setTimeout(timeouts.extendedTest);
    const apiClientFactory = new ApiClientFactory();
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username: user1 });
    await apiClientFactory.createUser({ username: user2 });
    const fileActionUser1 = await FileActionsApi.initialize(user1, user1);
    const fileActionUser2 = await FileActionsApi.initialize(user2, user2);
    const filesIdsUser1: NodesIds = {};
    const filesIdsUser2: NodesIds = {};
    await Promise.all(
      testData.user1.files.pdf.map(
        async (i) => (filesIdsUser1[i] = (await fileActionUser1.uploadFileWithRename(TEST_FILES.PDF.path, i, '-my-')).entry.id)
      )
    );
    await Promise.all(
      testData.user1.files.jpg.map(
        async (i) => (filesIdsUser1[i] = (await fileActionUser1.uploadFileWithRename(TEST_FILES.JPG_FILE.path, i, '-my-')).entry.id)
      )
    );
    await Promise.all(
      testData.user2.files.map(
        async (i) => (filesIdsUser2[i] = (await fileActionUser2.uploadFileWithRename(TEST_FILES.PDF.path, i, '-my-')).entry.id)
      )
    );
  });

  test.beforeEach(async ({ page, personalFiles }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginUser(
      { username: user1, password: user1 },
      {
        withNavigation: true,
        waitForLoading: true
      }
    );
    await personalFiles.dataTable.sortBy('Name', 'asc');
    await personalFiles.dataTable.spinnerWaitForReload();
    initialSortState = await getSortState(personalFiles);
  });

  test.afterAll(async () => {
    const nodeActionUser1 = await NodesApi.initialize(user1, user1);
    const nodeActionUser2 = await NodesApi.initialize(user2, user2);
    await nodeActionUser1.deleteCurrentUserNodes();
    await nodeActionUser2.deleteCurrentUserNodes();
  });

  test.describe('User Tests', () => {
    test('[C261137] Size sort order is retained when user logs out and logs back in', async ({ personalFiles, loginPage }) => {
      await personalFiles.dataTable.sortBy('Name', 'desc');
      await personalFiles.dataTable.spinnerWaitForReload();
      const expectedSortData = await getSortState(personalFiles);
      expect(expectedSortData).not.toEqual(initialSortState);

      await loginPage.logoutUser();
      await FileActionsApi.initialize(user1, user1);
      await loginPage.loginUser({ username: user1, password: user1 }, { withNavigation: true, waitForLoading: true });

      const actualSortData = await getSortState(personalFiles);
      expect(actualSortData).toEqual(expectedSortData);
    });

    test('[C261150] Sort order is not retained between different users', async ({ personalFiles, loginPage }) => {
      await personalFiles.dataTable.sortBy('Size', 'asc');
      await personalFiles.dataTable.spinnerWaitForReload();
      const expectedSortData = await getSortState(personalFiles);

      await loginPage.logoutUser();
      await FileActionsApi.initialize(user2, user2);
      await loginPage.loginUser(
        { username: user2, password: user2 },
        {
          withNavigation: true,
          waitForLoading: true
        }
      );

      const actualSortData = await getSortState(personalFiles);
      expect(actualSortData).not.toEqual(expectedSortData);
    });
  });
});
