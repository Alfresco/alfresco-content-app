/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ApiClientFactory, MyLibrariesPage, NodesApi, SitesApi, test, Utils, TrashcanApi } from '@alfresco/playwright-shared';
import { expect } from '@playwright/test';
import { Site } from '@alfresco/js-api';

test.describe('Copy Move actions', () => {
  let nodesApi: NodesApi;
  let sitesApi: SitesApi;
  let trashcanApi: TrashcanApi;

  const site = `site-${Utils.random()}`;
  const consumerUser = `consumer-${Utils.random()}`;
  const contributorUser = `contributor-${Utils.random()}`;
  const collaboratorUser = `collaborator-${Utils.random()}`;

  const sourceFile = `source-file-${Utils.random()}.txt`;
  const destinationFolder = `destination-folder-${Utils.random()}`;

  let siteId: string;

  test.beforeAll(async () => {
    try {
      const username = `user-${Utils.random()}`;
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });

      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      sitesApi = await SitesApi.initialize(username, username);

      siteId = (await sitesApi.createSite(site, Site.VisibilityEnum.PRIVATE)).entry.id;
      const docLibId = await sitesApi.getDocLibId(siteId);

      const consumerId = (await apiClientFactory.createUser({ username: consumerUser })).entry.id;
      const contributorId = (await apiClientFactory.createUser({ username: contributorUser })).entry.id;
      const collaboratorId = (await apiClientFactory.createUser({ username: collaboratorUser })).entry.id;

      await sitesApi.addSiteMember(siteId, consumerId, Site.RoleEnum.SiteConsumer);
      await sitesApi.addSiteMember(siteId, contributorId, Site.RoleEnum.SiteContributor);
      await sitesApi.addSiteMember(siteId, collaboratorId, Site.RoleEnum.SiteCollaborator);

      await nodesApi.createFile(sourceFile, docLibId);
      await nodesApi.createFolder(destinationFolder, docLibId);
    } catch {}
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed', sitesApi, [siteId]);
  });

  const copyContentInMyLibraries = async (myLibrariesPage: MyLibrariesPage) => {
    await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(site);
    await myLibrariesPage.dataTable.selectItems(sourceFile);
    await myLibrariesPage.clickMoreActionsButton('Copy');
    await myLibrariesPage.contentNodeSelector.selectDestination(destinationFolder);
  };

  test('[C263876] Consumer user cannot select the folder as destination', async ({ loginPage, myLibrariesPage }) => {
    await loginPage.loginUser({ username: consumerUser, password: consumerUser }, { withNavigation: true, waitForLoading: true });
    await myLibrariesPage.navigate();
    await copyContentInMyLibraries(myLibrariesPage);
    await expect(myLibrariesPage.contentNodeSelector.actionButton).toBeDisabled();
  });

  test('[C263877] Contributor user can select the folder as destination', async ({ loginPage, myLibrariesPage }) => {
    await loginPage.loginUser({ username: contributorUser, password: contributorUser }, { withNavigation: true, waitForLoading: true });
    await myLibrariesPage.navigate();
    await copyContentInMyLibraries(myLibrariesPage);
    await expect(myLibrariesPage.contentNodeSelector.actionButton).toBeEnabled();
  });

  test('[C263878] Collaborator user can select the folder as destination', async ({ loginPage, myLibrariesPage }) => {
    await loginPage.loginUser({ username: collaboratorUser, password: collaboratorUser }, { withNavigation: true, waitForLoading: true });
    await myLibrariesPage.navigate();
    await copyContentInMyLibraries(myLibrariesPage);
    await expect(myLibrariesPage.contentNodeSelector.actionButton).toBeEnabled();
  });
});
