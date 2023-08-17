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

import { AdminActions, LoginPage, BrowsingPage, RepoClient, FILES, SearchInput, DataTable, InfoDrawer } from '@alfresco/aca-testing-shared';
import { BrowserActions, ViewerPage } from '@alfresco/adf-testing';

describe('File preview', () => {
  const timestamp = new Date().getTime();
  const username = `user1-${timestamp}`;
  const fileName = `file1-${timestamp}.pdf`;
  let fileId: string;

  const apis = {
    user: new RepoClient(username, username)
  };

  const infoDrawer = new InfoDrawer();
  const loginPage = new LoginPage();
  const browsingPage = new BrowsingPage();
  const dataTable = new DataTable();
  const adminApiActions = new AdminActions();
  const searchInput = new SearchInput();
  const viewerPage = new ViewerPage();

  beforeAll(async () => {
    await adminApiActions.createUser({ username });
    fileId = (await apis.user.upload.uploadFileWithRename(FILES.pdfFile, '-my-', fileName)).entry.id;
    await apis.user.search.waitForNodes(fileName, { expect: 1 });
    await loginPage.loginWith(username);
  });

  afterAll(async () => {
    await apis.user.nodes.deleteNodeById(fileId);
  });

  beforeEach(async () => {
    await browsingPage.clickPersonalFilesAndWait();
  });

  it('[C595967] Should preview document from the info drawer', async () => {
    const pageNumber = '1';
    const documentText = 'This is a small demonstration';
    await searchInput.searchUntilResult(fileName, 'URL');
    await dataTable.selectItem(fileName);
    await BrowserActions.click(infoDrawer.toolbar.viewDetailsButton);
    await infoDrawer.previewButton.click();
    await viewerPage.checkFileContent(pageNumber, documentText);
  });
});
