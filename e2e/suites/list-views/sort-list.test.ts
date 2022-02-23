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
  const folderToMove = `folder1-${random}`;
  const folderToContain = `folder2-${random}`;
  const uiCreatedFolder = `folder3-${random}`;

  const testData = {
    user1: {
      files: {
        jpg: jpgFileNames,
        pdf: pdfFileNames
      },
      filesIds: {},
      foldersIds: {}
    },
    user2: {
      files: [pdfFileNames[0], jpgFileNames[0]],
      filesIds: {}
    }
  };

  let initialSortState: {
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

  beforeAll(async () => {
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
    await apis.user1.favorites.addFavoritesByIds('file', [testData.user1.filesIds[pdfFileNames[0]], testData.user1.filesIds[pdfFileNames[1]]]);
    await loginPage.loginWith(user1);
  });

  beforeEach(async () => {
    await browsingPage.clickPersonalFilesAndWait();
    await dataTable.sortBy('Name', 'asc');
    await dataTable.waitForBody();
    initialSortState = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };
  });

  afterAll(async () => {
    await Promise.all(Object.keys(testData.user1.filesIds).map((i) => apis.user1.nodes.deleteNodeById(testData.user1.filesIds[i])));
    await Promise.all(Object.keys(testData.user2.filesIds).map((i) => apis.user2.nodes.deleteNodeById(testData.user2.filesIds[i])));
  });

  it('[C261136] Sort order is retained when navigating to another part of the app', async () => {
    await dataTable.sortBy('Name', 'desc');
    await dataTable.waitForBody();

    const expectedSortData = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await expect(expectedSortData).not.toEqual(initialSortState, 'Initial sort did not work');

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
    await dataTable.sortBy('Name', 'desc');
    await dataTable.waitForBody();

    const expectedSortData = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await expect(expectedSortData).not.toEqual(initialSortState, 'Initial sort did not work');

    await browsingPage.signOut();
    await loginPage.loginWith(user1);

    const actualSortData = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await expect(actualSortData).toEqual(expectedSortData, 'Order is different - sorting was not retained');
  });

  describe('Folder actions', () => {
    beforeAll(async () => {
      testData.user1.foldersIds[folderToContain] = (await apis.user1.nodes.createFolder(folderToContain)).entry.id;
      testData.user1.foldersIds[folderToMove] = (await apis.user1.nodes.createFolder(folderToMove)).entry.id;
    });

    afterAll(async () => {
      testData.user1.foldersIds[uiCreatedFolder] = await apis.user1.nodes.getNodeIdFromParent(uiCreatedFolder, '-my-');
      await Promise.all(Object.keys(testData.user1.foldersIds).map((i) => apis.user1.nodes.deleteNodeById(testData.user1.foldersIds[i])));
    });

    it('[C261138] Sort order is retained when creating a new folder', async () => {
      await dataTable.sortBy('Name', 'desc');
      await dataTable.waitForBody();

      const expectedSortData = {
        sortingColumn: await dataTable.getSortedColumnHeaderText(),
        sortingOrder: await dataTable.getSortingOrder(),
        firstElement: uiCreatedFolder
      };

      await browsingPage.sidenav.openCreateFolderDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.enterName(uiCreatedFolder);
      await BrowserActions.click(createDialog.createButton);
      await createDialog.waitForDialogToClose();
      await documentListPage.dataTable.checkRowContentIsDisplayed(uiCreatedFolder);

      const actualSortData = {
        sortingColumn: await dataTable.getSortedColumnHeaderText(),
        sortingOrder: await dataTable.getSortingOrder(),
        firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
      };

      await expect(actualSortData).toEqual(expectedSortData, 'Order is different - sorting was not retained');
    });

    it('[C261139] Sort order is retained when moving a file', async () => {
      const expectedSortData = {
        sortingColumn: await dataTable.getSortedColumnHeaderText(),
        sortingOrder: await dataTable.getSortingOrder(),
        firstElement: folderToContain
      };

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
  });

  it('[C589205] Size sort order is retained after viewing a file and closing the viewer', async () => {
    await dataTable.sortBy('Size', 'desc');
    await dataTable.waitForBody();

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
    await dataTable.sortBy('Name', 'desc');
    await dataTable.waitForBody();

    const personalFilesSortData = {
      sortingColumn: await dataTable.getSortedColumnHeaderText(),
      sortingOrder: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await browsingPage.clickFavoritesAndWait();
    await dataTable.sortBy('Name', 'asc');
    await dataTable.waitForBody();

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
    await dataTable.waitForBody();

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
    await dataTable.waitForBody();

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
    await dataTable.sortBy('Size', 'asc');
    await dataTable.waitForBody();

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
