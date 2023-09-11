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
import { ApiClientFactory, FileActionsApi, LoginPage, NodesApi, SitesApi, test, TEST_FILES, Utils } from '@alfresco/playwright-shared';
import { SiteBodyCreate } from '@alfresco/js-api';
import { Logger } from '@alfresco/adf-testing';

test.describe('from File Libraries', () => {
  const apiClientFactory = new ApiClientFactory();
  const username = `user-${Utils.random()}`;
  const siteName = `site-${Utils.random()}`;
  const destination = `destFL-${Utils.random()}`;
  let destinationId: string;
  const xlsxLibraries = `xlsxFL-${Utils.random()}`;
  let nodesApi: NodesApi;
  let sitesApi: SitesApi;
  let fileApi: FileActionsApi;

  test.beforeAll(async () => {
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
    nodesApi = await NodesApi.initialize(username, username);
    sitesApi = await SitesApi.initialize(username, username);
    fileApi = await FileActionsApi.initialize(username, username);
    try {
      await sitesApi.createSite(siteName, SiteBodyCreate.VisibilityEnum.PUBLIC);
      const docLibId = await sitesApi.getDocLibId(siteName);
      const node = await nodesApi.createFolder(destination);
      destinationId = node.entry.id;
      await fileApi.uploadFile(TEST_FILES.XLSX.path, xlsxLibraries, docLibId);
    } catch (error) {
      Logger.error(`beforeAll failed : ${error}`);
    }
  });

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginUser(
      { username: username, password: username },
      {
        withNavigation: true,
        waitForLoading: true
      }
    );
  });

  test.afterAll(async () => {
    try {
      await sitesApi.deleteSites([siteName]);
      await nodesApi.deleteNodes([destinationId]);
    } catch (error) {
      Logger.error(`afterAll failed : ${error}`);
    }
  });

  test('[C286371] Move action from File Libraries', async ({ myLibrariesPage, personalFiles }) => {
    await myLibrariesPage.navigate();
    await myLibrariesPage.dataTable.getCellLinkByName(siteName).click();
    await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(xlsxLibraries);
    expect(await myLibrariesPage.viewer.isViewerOpened(), 'Viewer should be opened').toBe(true);

    await myLibrariesPage.acaHeader.clickViewerMoreActions();
    await myLibrariesPage.matMenu.clickMenuItem('Move');
    expect(await myLibrariesPage.viewerDialog.isCopyDialogOpen(), 'Dialog is not open').toBe(true);

    await myLibrariesPage.copyMoveDialog.selectLocation('Personal Files');
    await myLibrariesPage.copyMoveDialog.selectDestination(destination);
    await myLibrariesPage.copyMoveDialog.actionButton.click();
    await expect(myLibrariesPage.snackBar.getByMessageLocator('Moved 1 item')).toBeVisible();

    await myLibrariesPage.viewer.closeButtonLocator.click();
    await myLibrariesPage.dataTable.getRowByName(xlsxLibraries).waitFor({ state: 'detached' });
    expect(await myLibrariesPage.dataTable.getRowByName(xlsxLibraries).isVisible(), 'Item was not moved').toBe(false);
    await personalFiles.navigate({ remoteUrl: `#/personal-files/${destinationId}` });
    expect(await personalFiles.dataTable.isItemPresent(xlsxLibraries), 'Item is not present in destination').toBe(true);
  });
});
