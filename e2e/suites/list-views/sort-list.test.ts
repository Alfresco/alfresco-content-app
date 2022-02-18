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
import { BrowserActions, ContentNodeSelectorDialogPage, DocumentListPage } from '@alfresco/adf-testing';

describe('Search sorting', () => {
  const random = Utils.random();
  const user1 = `user1-${random}`;
  const user2 = `user2-${random}`;
  let user1_fileJpgId: string;
  let user1_filePdfId: string;
  let user2_fileJpgId: string;
  let user2_filePdfId: string;
  //let fileXlsxId: string;
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
  const adminApiActions = new AdminActions();
  const createDialog = new CreateOrEditFolderDialog();
  const contentNodeSelectorDialogPage = new ContentNodeSelectorDialogPage();

  beforeAll(async (done) => {
    await adminApiActions.createUser({ username: user1 });
    await adminApiActions.createUser({ username: user2 });
    user1_fileJpgId = (await apis.user1.upload.uploadFile(FILES.jpgFile)).entry.id;
    user1_filePdfId = (await apis.user1.upload.uploadFile(FILES.pdfFile)).entry.id;
    user2_fileJpgId = (await apis.user2.upload.uploadFile(FILES.jpgFile)).entry.id;
    user2_filePdfId = (await apis.user2.upload.uploadFile(FILES.pdfFile)).entry.id;
    //fileXlsxId = (await apis.user1.upload.uploadFile(FILES.xlsxFile)).entry.id;
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
    await apis.user1.nodes.deleteNodeById(user1_fileJpgId);
    await apis.user1.nodes.deleteNodeById(user1_filePdfId);
    await apis.user2.nodes.deleteNodeById(user2_fileJpgId);
    await apis.user2.nodes.deleteNodeById(user2_filePdfId);
    //await apis.user1.nodes.deleteNodeById(fileXlsxId);
  });

  it('[C261136] Sort order is retained when navigating to another part of the app', async () => {
    await dataTable.getColumnHeaderByLabel('Name').click();

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
  /* Make it last on the list */
  it('[C261150] Sort order is not retained between different users', async () => {
    await dataTable.getColumnHeaderByLabel('Size').click();

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
