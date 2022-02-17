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
import { BrowserActions, DocumentListPage } from '@alfresco/adf-testing';

describe('Search sorting', () => {
  const random = Utils.random();
  const user1 = `user1-${random}`;
  const fileJpg = {
    name: `sort-${random}-file-1.jpg`,
    source: FILES.jpgFile
  };
  const filePdf = {
    name: `sort-${random}-file-2.pdf`,
    title: 'sort title',
    description: 'search sort',
    source: FILES.pdfFile
  };
  let fileJpgId: string;
  let filePdfId: string;
  let preSortState: {
    sorting: string;
    firstElement: string;
  };

  const apis = {
    user1: new RepoClient(user1, user1)
  };

  const loginPage = new LoginPage();
  const browsingPage = new BrowsingPage();
  const dataTable = new DataTable();
  const documentListPage = new DocumentListPage();
  const adminApiActions = new AdminActions();
  const createDialog = new CreateOrEditFolderDialog();

  beforeAll(async (done) => {
    await adminApiActions.createUser({ username: user1 });
    fileJpgId = (await apis.user1.upload.uploadFile(fileJpg.source)).entry.id;
    filePdfId = (await apis.user1.upload.uploadFile(filePdf.source)).entry.id;
    await loginPage.loginWith(user1);
    done();
  });

  beforeEach(async (done) => {
    await browsingPage.clickPersonalFilesAndWait();
    preSortState = {
      sorting: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };
    done();
  });

  afterAll(async () => {
    await apis.user1.nodes.deleteNodeById(fileJpgId);
    await apis.user1.nodes.deleteNodeById(filePdfId);
  });

  it('[C261136] Sort order is retained when navigating to another part of the app', async () => {
    await dataTable.getColumnHeaderByLabel('Name').click();

    const expectedSortData = {
      sorting: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await expect(expectedSortData).not.toEqual(preSortState, 'Initial sort did not work');

    await browsingPage.clickFavorites();
    await browsingPage.clickPersonalFilesAndWait();

    const actualSortData = {
      sorting: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await expect(actualSortData).toEqual(expectedSortData, 'Order is different - sorting was not retained');
  });

  it('[C261137] Size sort order is retained when user logs out and logs back in', async () => {
    await dataTable.getColumnHeaderByLabel('Name').click();

    const expectedSortData = {
      sorting: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await expect(expectedSortData).not.toEqual(preSortState, 'Initial sort did not work');

    await browsingPage.signOut();
    await loginPage.loginWith(user1);

    const actualSortData = {
      sorting: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await expect(actualSortData).toEqual(expectedSortData, 'Order is different - sorting was not retained');
  });

  it('[C261138] Sort order is retained when creating a new folder', async () => {
    await apis.user1.nodes.createFolder('a-folderName');

    const folderName = 'z-folderName';
    await dataTable.getColumnHeaderByLabel('Name').click();

    const expectedSortData = {
      sorting: await dataTable.getSortingOrder(),
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
      sorting: await dataTable.getSortingOrder(),
      firstElement: await documentListPage.dataTable.getFirstElementDetail('Name')
    };

    await expect(actualSortData).toEqual(expectedSortData, 'Order is different - sorting was not retained');
  });
});
