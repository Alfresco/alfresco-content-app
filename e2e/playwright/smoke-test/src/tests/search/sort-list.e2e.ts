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
import {
  ApiClientFactory,
  FavoritesPageApi,
  FileActionsApi,
  NodesApi,
  PersonalFilesPage,
  TEST_FILES,
  Utils,
  test,
  timeouts
} from '@alfresco/aca-playwright-shared';

async function getSortState(myPersonalFiles: PersonalFilesPage): Promise<{ [key: string]: string }> {
  return {
    sortingColumn: await myPersonalFiles.dataTable.getSortedColumnHeaderText(),
    sortingOrder: await myPersonalFiles.dataTable.getSortingOrder(),
    firstElement: await myPersonalFiles.dataTable.getFirstElementDetail('Name')
  };
}

test.describe('Remember sorting', () => {
  const user1 = `userSort1-${Utils.random()}`;
  const pdfFileNames = [...new Array(14).fill(100)].map((v, i) => `file-${v + i}.pdf`);
  const jpgFileNames = [...new Array(12).fill(114)].map((v, i) => `file-${v + i}.jpg`);
  const folderToMove = `folder1`;
  const folderToContain = `folder2`;
  const uiCreatedFolder = `folder3`;

  const testData = {
    user1: {
      files: {
        jpg: jpgFileNames,
        pdf: pdfFileNames
      }
    }
  };

  let initialSortState: { [key: string]: string };
  let nodeActionUser1: NodesApi;

  test.beforeAll(async () => {
    try {
      test.setTimeout(timeouts.extendedTest);
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username: user1 });
      const fileActionUser1 = await FileActionsApi.initialize(user1, user1);
      const favoritesActions = await FavoritesPageApi.initialize(user1, user1);
      nodeActionUser1 = await NodesApi.initialize(user1, user1);
      const filesIdsUser1: { [key: string]: string } = {};
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
      await favoritesActions.addFavoritesByIds('file', [filesIdsUser1[pdfFileNames[0]], filesIdsUser1[pdfFileNames[1]]]);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage, personalFiles }) => {
    await NodesApi.initialize(user1, user1);
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
    nodeActionUser1 = await NodesApi.initialize(user1, user1);
    await nodeActionUser1.deleteCurrentUserNodes();
  });

  test('[C261136] Sort order is retained when navigating to another part of the app', async ({ personalFiles, favoritePage }) => {
    await personalFiles.dataTable.sortBy('Name', 'desc');
    await personalFiles.dataTable.spinnerWaitForReload();

    const expectedSortData = await getSortState(personalFiles);
    expect(expectedSortData).not.toEqual(initialSortState);

    await favoritePage.navigate();
    await personalFiles.navigate();

    const actualSortData = await getSortState(personalFiles);
    expect(actualSortData).toEqual(expectedSortData);
  });

  test('[C589205] Size sort order is retained after viewing a file and closing the viewer', async ({ personalFiles }) => {
    await personalFiles.dataTable.sortBy('Size', 'desc');
    await personalFiles.dataTable.spinnerWaitForReload();
    const expectedSortData = await getSortState(personalFiles);

    await personalFiles.dataTable.performClickFolderOrFileToOpen(expectedSortData.firstElement);
    await personalFiles.viewer.closeButtonLocator.click();
    await personalFiles.waitForPageLoad();

    const actualSortData = await getSortState(personalFiles);
    expect(actualSortData).toEqual(expectedSortData);
  });

  test('[C261147] Sort order is retained when user changes the page from pagination', async ({ personalFiles }) => {
    const lastFileInArray = testData.user1.files.jpg.slice(-2).pop();
    const firstFileInArray = testData.user1.files.pdf[0];

    await personalFiles.pagination.clickOnNextPage();
    await personalFiles.dataTable.spinnerWaitForReload();

    let expectedPersonalFilesSortDataPage2 = {
      sortingColumn: 'Name',
      sortingOrder: 'asc',
      firstElement: lastFileInArray
    };

    let currentPersonalFilesSortDataPage2 = await getSortState(personalFiles);
    expect(currentPersonalFilesSortDataPage2).toEqual(expectedPersonalFilesSortDataPage2);

    await personalFiles.dataTable.sortBy('Name', 'desc');
    await personalFiles.dataTable.spinnerWaitForReload();
    expectedPersonalFilesSortDataPage2 = {
      sortingColumn: 'Name',
      sortingOrder: 'desc',
      firstElement: firstFileInArray
    };

    currentPersonalFilesSortDataPage2 = await getSortState(personalFiles);
    expect(expectedPersonalFilesSortDataPage2).toEqual(currentPersonalFilesSortDataPage2);
  });

  test.describe('Folder actions', () => {
    test.beforeAll(async () => {
      const folderIds: { [key: string]: string } = {};
      folderIds[folderToContain] = (await nodeActionUser1.createFolder(folderToContain)).entry.id;
      folderIds[folderToMove] = (await nodeActionUser1.createFolder(folderToMove)).entry.id;
    });

    test('[C261138] Sort order is retained when creating a new folder', async ({ personalFiles }) => {
      await personalFiles.dataTable.sortBy('Name', 'desc');
      await personalFiles.dataTable.spinnerWaitForReload();

      const expectedSortData = {
        sortingColumn: await personalFiles.dataTable.getSortedColumnHeaderText(),
        sortingOrder: await personalFiles.dataTable.getSortingOrder(),
        firstElement: uiCreatedFolder
      };

      await personalFiles.selectCreateFolder();
      await personalFiles.folderDialog.createNewFolderDialog(uiCreatedFolder);
      await personalFiles.dataTable.isItemPresent(uiCreatedFolder);

      const actualSortData = await getSortState(personalFiles);
      expect(actualSortData).toEqual(expectedSortData);
    });

    test('[C261139] Sort order is retained when moving a file', async ({ personalFiles }) => {
      const expectedSortData = {
        sortingColumn: await personalFiles.dataTable.getSortedColumnHeaderText(),
        sortingOrder: await personalFiles.dataTable.getSortingOrder(),
        firstElement: folderToContain
      };
      await personalFiles.copyOrMoveContentInDatatable([folderToMove], folderToContain, 'Move');
      await personalFiles.dataTable.spinnerWaitForReload();
      const actualSortData = await getSortState(personalFiles);
      expect(actualSortData).toEqual(expectedSortData);
    });
  });
});
