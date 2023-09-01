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
import { ApiClientFactory, getUserState, test, Utils } from '@alfresco/playwright-shared';

test.use({ storageState: getUserState('hruser') });
test.describe.only('Single click on item name', () => {
  const apiClientFactory = new ApiClientFactory();

  const file1 = `file1-${Utils.random()}.txt`;
  let file1Id: string;
  const folder1 = `folder1-${Utils.random()}`;
  let folder1Id: string;

  const deletedFile1 = `file1-${Utils.random()}.txt`;
  let deletedFile1Id: string;
  const deletedFolder1 = `folder1-${Utils.random()}`;
  let deletedFolder1Id: string;

  const siteName = `site-${Utils.random()}`;
  const fileSite = `fileSite-${Utils.random()}.txt`;

  test.beforeAll(async ({ nodesApiAction, sitesApiAction }) => {
    await apiClientFactory.setUpAcaBackend('hruser');
    file1Id = (await nodesApiAction.createFile(file1)).entry.id;
    folder1Id = (await nodesApiAction.createFolder(folder1)).entry.id;
    deletedFile1Id = (await nodesApiAction.createFile(deletedFile1)).entry.id;
    deletedFolder1Id = (await nodesApiAction.createFolder(deletedFolder1)).entry.id;

    await sitesApiAction.createSite(siteName);
    const docLibId = await sitesApiAction.getDocLibId(siteName);
    await nodesApiAction.createFile(fileSite, docLibId);
  });

  test.afterAll(async () => {
    await apiClientFactory.nodes.deleteNode(deletedFolder1Id, { permanent: true });
    await apiClientFactory.nodes.deleteNode(folder1Id, { permanent: true });
    await apiClientFactory.nodes.deleteNode(file1Id, { permanent: true });
    await apiClientFactory.nodes.deleteNode(deletedFile1Id, { permanent: true });
  });

  test('[C284899] Hyperlink does not appear for items in the Trash', async ({ trashPage }) => {
    await trashPage.navigate();

    expect(await trashPage.dataTable.getCellLinkByName(deletedFile1).isVisible(), 'Link on name is present').toBe(false);
    expect(await trashPage.dataTable.getCellLinkByName(deletedFolder1).isVisible(), 'Link on name is present').toBe(false);
  });

  test.describe('on Personal Files', () => {
    test('[C280034] Navigate inside the folder when clicking the hyperlink', async ({ personalFiles }) => {
      await personalFiles.navigate();
      await personalFiles.dataTable.getCellLinkByName(folder1).click();
      await personalFiles.dataTable.spinnerWaitForReload();
      expect(await personalFiles.breadcrumb.currentItem.innerText()).toBe(folder1);
    });
  });

  test.describe('on File Libraries', () => {
    test('[C284902] Navigate inside the library when clicking the hyperlink', async ({ myLibrariesPage }) => {
      await myLibrariesPage.navigate();
      await myLibrariesPage.dataTable.goThroughPagesLookingForRowWithName(siteName);
      await myLibrariesPage.dataTable.getCellLinkByName(siteName).click();
      await myLibrariesPage.dataTable.spinnerWaitForReload();
      expect(await myLibrariesPage.breadcrumb.currentItem.innerText()).toBe(siteName);
      expect(await myLibrariesPage.dataTable.getCellLinkByName(fileSite).isVisible(), `${fileSite} not displayed`).toBe(true);
    });
  });

  test.describe('on Search Results', () => {
    test('[C306990] Navigate inside the folder when clicking the hyperlink', async ({ personalFiles }) => {
      await personalFiles.navigate({ remoteUrl: `#/search;q=${folder1}` });
      await personalFiles.dataTable.spinnerWaitForReload();
      await personalFiles.dataTable.getSearchResultLinkByName(folder1);
      expect(await personalFiles.breadcrumb.currentItem.innerText()).toBe(folder1);
    });
  });
});
