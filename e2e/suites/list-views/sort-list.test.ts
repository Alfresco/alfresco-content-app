/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2022 Alfresco Software Limited
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

import { AdminActions, LoginPage, RepoClient, Utils, FILES, BrowsingPage, DataTable, CreateOrEditFolderDialog } from '@alfresco/aca-testing-shared';
import { BrowserActions, ContentNodeSelectorDialogPage, DocumentListPage, PaginationPage, ViewerPage } from '@alfresco/adf-testing';

describe('Remember sorting', () => {
  const random = Utils.random();
  const user1 = `user1-${random}`;
  const user2 = `user2-${random}`;
  const pdfFileNames = [...new Array(14).fill(100)].map((v, i) => `file-${v + i}.pdf`);
  const jpgFileNames = [...new Array(12).fill(114)].map((v, i) => `file-${v + i}.jpg`);

  const testData = {
    user1: {
      files: {
        jpg: jpgFileNames,
        pdf: pdfFileNames
      },
      filesIds: {}
    },
    user2: {
      files: ['file-100.pdf', 'file-100.jpg'],
      filesIds: {}
    }
  };

  let preSortState: {
    sortingColumn: string;
    sortingOrder: string;
    firstElement: string;
  };

  const apis = {
    user1: new RepoClient(user1, user1),
    user2: new RepoClient(user2, user2)
  };

  const loginPage = new LoginPage();
  const browsingPage = new BrowsingPage();
  const dataTable = new DataTable();
  const documentListPage = new DocumentListPage();
  const viewerPage = new ViewerPage();
  const adminApiActions = new AdminActions();
  const createDialog = new CreateOrEditFolderDialog();
  const contentNodeSelectorDialogPage = new ContentNodeSelectorDialogPage();
  const paginationPage = new PaginationPage();

  beforeAll(async (done) => {
    await adminApiActions.createUser({ username: user1 });
    await adminApiActions.createUser({ username: user2 });
    await Promise.all(
      testData.user1.files.pdf.map(
        async (i) => (testData.user1.filesIds[i] = (await apis.user1.upload.uploadFileWithRename(FILES.pdfFile, '-my-', i)).entry.id)
      )
    );
    await Promise.all(
      testData.user1.files.jpg.map(
        async (i) => (testData.user1.filesIds[i] = (await apis.user1.upload.uploadFileWithRename(FILES.jpgFile, '-my-', i)).entry.id)
      )
    );
    await Promise.all(
      testData.user2.files.map(
        async (i) => (testData.user2.filesIds[i] = (await apis.user2.upload.uploadFileWithRename(FILES.pdfFile, '-my-', i)).entry.id)
      )
    );
    await apis.user1.favorites.addFavoritesByIds('file', [testData.user1.filesIds[pdfFileNames[0]], testData.user1.filesIds[jpgFileNames[0]]]);
    await loginPage.loginWith(user1);
    done();
  });

  beforeEach(async (done) => {
    await browsingPage.clickPersonalFilesAndWait();
    preSortState = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };
    done();
  });

  afterAll(async () => {
    await Promise.all(Object.keys(testData.user1.filesIds).map((i) => apis.user1.nodes.deleteNodeById(testData.user1.filesIds[i])));
    await Promise.all(Object.keys(testData.user2.filesIds).map((i) => apis.user2.nodes.deleteNodeById(testData.user2.filesIds[i])));
  });

  it('[C261136] Sort order is retained when navigating to another part of the app', async () => {
    await dataTable.getColumnHeaderByLabel('Name').click();
    await dataTable.waitForFirstElementToChange(preSortState.firstElement);

    const expectedSortData = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await expect(expectedSortData).not.toEqual(preSortState, 'Initial sort did not work');

    await browsingPage.clickFavorites();
    await browsingPage.clickPersonalFilesAndWait();

    const actualSortData = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await expect(actualSortData).toEqual(expectedSortData, 'Order is different - sorting was not retained');
  });

  it('[C261137] Size sort order is retained when user logs out and logs back in', async () => {
    await dataTable.getColumnHeaderByLabel('Name').click();
    await dataTable.waitForFirstElementToChange(preSortState.firstElement);

    const expectedSortData = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await expect(expectedSortData).not.toEqual(preSortState, 'Initial sort did not work');

    await browsingPage.signOut();
    await loginPage.loginWith(user1);

    const actualSortData = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await expect(actualSortData).toEqual(expectedSortData, 'Order is different - sorting was not retained');
  });

  it('[C261138] Sort order is retained when creating a new folder', async () => {
    await apis.user1.nodes.createFolder('a-folderName');

    const folderName = 'z-folderName';
    await dataTable.getColumnHeaderByLabel('Name').click();
    await browsingPage.clickPersonalFilesAndWait();

    const expectedSortData = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: folderName
    };

    await expect(expectedSortData).not.toEqual(preSortState, 'Initial sort did not work');

    await browsingPage.sidenav.openCreateFolderDialog();
    await createDialog.waitForDialogToOpen();
    await createDialog.enterName(folderName);
    await BrowserActions.click(createDialog.createButton);
    await createDialog.waitForDialogToClose();
    await documentListPage.dataTable.checkRowContentIsDisplayed(folderName);

    const actualSortData = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await expect(actualSortData).toEqual(expectedSortData, 'Order is different - sorting was not retained');
  });

  it('[C261139] Sort order is retained when moving a file', async () => {
    const folderToMove = 'z-folderName';
    const folderToContain = 'a-folderName';
    await apis.user1.nodes.createFolder(folderToContain);
    await apis.user1.nodes.createFolder(folderToMove);
    await dataTable.getColumnHeaderByLabel('Name').click();
    await browsingPage.clickPersonalFilesAndWait();

    const expectedSortData = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: folderToContain
    };

    await expect(expectedSortData).not.toEqual(preSortState, 'Initial sort did not work');

    await browsingPage.dataTable.rightClickOnItem(folderToMove);
    await dataTable.menu.clickMenuItem('Move');
    await contentNodeSelectorDialogPage.clickContentNodeSelectorResult(folderToContain);
    await contentNodeSelectorDialogPage.clickMoveCopyButton();
    await documentListPage.dataTable.checkRowContentIsNotDisplayed(folderToMove);

    const actualSortData = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await expect(actualSortData).toEqual(expectedSortData, 'Order is different - sorting was not retained');
  });

  xit('[C589205] Size sort order is retained after viewing a file and closing the viewer', async () => {
    await dataTable.getColumnHeaderByLabel('Size').click();
    await dataTable.waitForFirstElementToChange(preSortState.firstElement);

    const expectedSortData = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await dataTable.doubleClickOnRowByName(pdfFileNames[0]);
    await viewerPage.clickCloseButton();
    await browsingPage.clickPersonalFilesAndWait();

    const actualSortData = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await expect(actualSortData).toEqual(expectedSortData, 'Order is different - sorting was not retained');
  });

  it('[C261153] Sort order should be remembered separately on each list view', async () => {
    await dataTable.getColumnHeaderByLabel('Size').click();
    await dataTable.waitForFirstElementToChange(preSortState.firstElement);

    const personalFilesSortData = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await browsingPage.clickFavoritesAndWait();
    await dataTable.sortBy('Name', 'desc');

    const favouritesSortData = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await expect(favouritesSortData).not.toEqual(personalFilesSortData, 'Order is the same - sorting was retained');

    await browsingPage.clickPersonalFilesAndWait();

    const personalFilesSortDataAfterFavSort = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };
    await expect(personalFilesSortDataAfterFavSort).toEqual(personalFilesSortData, 'Order is different - sorting was not retained');
  });

  it('[C261147] Sort order is retained when user changes the page from pagination', async () => {
    const lastFileInArray = testData.user1.files.jpg.slice(-1).pop();
    const firstFileInArray = testData.user1.files.pdf[0];

    await dataTable.sortBy('Name', 'asc');

    await paginationPage.clickOnNextPage();
    await dataTable.waitForBody();

    let expectedPersonalFilesSortDataPage2 = {
      sortingColumn: 'Name',
      sortingOrder: 'asc',
      firstElement: lastFileInArray
    };

    let currentPersonalFilesSortDataPage2 = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await expect(currentPersonalFilesSortDataPage2).toEqual(expectedPersonalFilesSortDataPage2, 'Order is different- sorting was not retained');

    await dataTable.sortBy('Name', 'desc');
    await dataTable.waitForFirstElementToChange(expectedPersonalFilesSortDataPage2.firstElement);

    expectedPersonalFilesSortDataPage2 = {
      sortingColumn: 'Name',
      sortingOrder: 'desc',
      firstElement: firstFileInArray
    };

    currentPersonalFilesSortDataPage2 = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await expect(expectedPersonalFilesSortDataPage2).toEqual(currentPersonalFilesSortDataPage2, 'Order is different - sorting was not retained');
  });

  it('[C261150] Sort order is not retained between different users', async () => {
    await dataTable.getColumnHeaderByLabel('Size').click();
    await browsingPage.clickPersonalFilesAndWait();

    const expectedSortData = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await browsingPage.signOut();
    await loginPage.loginWith(user2);

    const actualSortData = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await expect(actualSortData).not.toEqual(expectedSortData, 'Order is the same - sorting was retained');

    await browsingPage.signOut();
  });
});
