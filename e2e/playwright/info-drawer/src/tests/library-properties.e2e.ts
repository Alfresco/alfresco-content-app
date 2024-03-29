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

import { expect } from '@playwright/test';
import { ApiClientFactory, Utils, test, SitesApi, QueriesApi, SITE_VISIBILITY, SITE_ROLES } from '@alfresco/playwright-shared';

test.describe('Library properties', () => {
  let sitesApi: SitesApi;

  const username = `user1-${Utils.random()}`;
  const site = {
    name: `site1-${Utils.random()}`,
    id: `site-id-${Utils.random()}`,
    visibility: SITE_VISIBILITY.MODERATED,
    description: 'my site description'
  };
  const siteForUpdate = {
    name: `site2-${Utils.random()}`,
    id: `site-id-${Utils.random()}`,
    visibility: SITE_VISIBILITY.MODERATED,
    description: 'my initial description'
  };
  const siteDup = `site3-${Utils.random()}`;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });

      sitesApi = await SitesApi.initialize(username, username);
      await sitesApi.createSite(site.name, site.visibility, site.description, site.id);
      await sitesApi.createSite(siteForUpdate.name, siteForUpdate.visibility, siteForUpdate.description, siteForUpdate.id);
      await sitesApi.createSite(siteDup);
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage, myLibrariesPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    await myLibrariesPage.navigate();
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(undefined, undefined, 'afterAll failed', sitesApi, [site.id, siteForUpdate.id, siteDup]);
  });

  test('[C289336] Info drawer opens for a library', async ({ myLibrariesPage }) => {
    await expect(myLibrariesPage.dataTable.getRowByName(site.name)).toBeVisible();
    await myLibrariesPage.dataTable.getRowByName(site.name).click();
    await myLibrariesPage.acaHeader.viewDetails.click();

    await expect(myLibrariesPage.libraryDetails.infoDrawerPanel).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.headerTitle).toHaveText(site.name);
    await expect(myLibrariesPage.libraryDetails.propertiesTab).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.nameField).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.idField).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.visibilityField).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.descriptionField).toBeVisible();

    await expect(myLibrariesPage.libraryDetails.nameField).toHaveValue(site.name);
    await expect(myLibrariesPage.libraryDetails.idField).toHaveValue(site.id);
    expect((await myLibrariesPage.libraryDetails.visibilityField.textContent()).toUpperCase()).toEqual(site.visibility);
    await expect(myLibrariesPage.libraryDetails.descriptionField).toHaveValue(site.description);
    await expect(myLibrariesPage.libraryDetails.editButton).toBeVisible();
  });

  test('[C289338] Editable properties', async ({ myLibrariesPage }) => {
    await myLibrariesPage.dataTable.getRowByName(site.name).click();
    await myLibrariesPage.acaHeader.viewDetails.click();
    await expect(myLibrariesPage.libraryDetails.infoDrawerPanel).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.editButton).toBeVisible();

    await myLibrariesPage.libraryDetails.editButton.click();
    await expect(myLibrariesPage.libraryDetails.nameField).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.idField).not.toBeEditable();
    await expect(myLibrariesPage.libraryDetails.visibilityField).toBeEditable();
    await expect(myLibrariesPage.libraryDetails.descriptionField).toBeEditable();
    await expect(myLibrariesPage.libraryDetails.cancelButton).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.updateButton).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.cancelButton).toBeEnabled();
    await expect(myLibrariesPage.libraryDetails.updateButton).toBeDisabled();
  });

  test('[C289339] Edit site details', async ({ myLibrariesPage }) => {
    const siteUpdated = {
      name: `site-for-rename-${Utils.random()}`,
      visibility: SITE_VISIBILITY.PRIVATE,
      description: 'new description'
    };

    await myLibrariesPage.dataTable.getRowByName(siteForUpdate.name).click();
    await myLibrariesPage.acaHeader.viewDetails.click();
    await expect(myLibrariesPage.libraryDetails.infoDrawerPanel).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.editButton).toBeVisible();

    await myLibrariesPage.libraryDetails.editButton.click();
    await myLibrariesPage.libraryDetails.nameField.fill(siteUpdated.name);
    await myLibrariesPage.libraryDetails.visibilityField.click();
    await myLibrariesPage.libraryDetails.selectVisibility(siteUpdated.visibility);
    await myLibrariesPage.libraryDetails.descriptionField.fill(siteUpdated.description);
    await expect(myLibrariesPage.libraryDetails.updateButton).toBeEnabled();

    await myLibrariesPage.libraryDetails.updateButton.click();
    await expect(myLibrariesPage.snackBar.message).toHaveText('Library properties updated');
    expect(await myLibrariesPage.dataTable.isItemPresent(siteUpdated.name)).toBe(true);
    await expect(myLibrariesPage.libraryDetails.infoDrawerPanel).toBeHidden();
    expect((await sitesApi.getSite(siteForUpdate.id)).entry.title).toEqual(siteUpdated.name);
    expect((await sitesApi.getSite(siteForUpdate.id)).entry.description).toEqual(siteUpdated.description);
    expect((await sitesApi.getSite(siteForUpdate.id)).entry.visibility).toEqual(siteUpdated.visibility);
  });

  test('[C289340] Cancel editing a site', async ({ myLibrariesPage }) => {
    const newName = `new-name-${Utils.random}`;
    const newDesc = `new desc ${Utils.random}`;

    await myLibrariesPage.dataTable.getRowByName(site.name).click();
    await myLibrariesPage.acaHeader.viewDetails.click();
    await expect(myLibrariesPage.libraryDetails.infoDrawerPanel).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.editButton).toBeVisible();

    await myLibrariesPage.libraryDetails.editButton.click();
    await myLibrariesPage.libraryDetails.nameField.fill(newName);
    await myLibrariesPage.libraryDetails.visibilityField.click();
    await myLibrariesPage.libraryDetails.selectVisibility(SITE_VISIBILITY.MODERATED);
    await myLibrariesPage.libraryDetails.descriptionField.fill(newDesc);
    await expect(myLibrariesPage.libraryDetails.updateButton).toBeEnabled();

    await myLibrariesPage.libraryDetails.cancelButton.click();
    expect(await myLibrariesPage.dataTable.isItemPresent(newName)).toBe(false);
    expect(await myLibrariesPage.dataTable.isItemPresent(site.name)).toBe(true);
    await expect(myLibrariesPage.libraryDetails.infoDrawerPanel).toBeVisible();
  });

  test('[C289341] Warning appears when editing the name of the library by entering an existing name', async ({ myLibrariesPage }) => {
    const queriesApi = await QueriesApi.initialize(username, username);

    await queriesApi.waitForSites(site.name, { expect: 1 });
    await myLibrariesPage.dataTable.getRowByName(siteDup).click();
    await myLibrariesPage.acaHeader.viewDetails.click();
    await expect(myLibrariesPage.libraryDetails.infoDrawerPanel).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.editButton).toBeVisible();

    await myLibrariesPage.libraryDetails.editButton.click();
    await myLibrariesPage.libraryDetails.nameField.fill(site.name);
    await expect(myLibrariesPage.libraryDetails.hintMessage).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.hintMessage).toHaveText('Library name already in use');
  });

  test('[C289342] Site name too long', async ({ myLibrariesPage }) => {
    await myLibrariesPage.dataTable.getRowByName(site.name).click();
    await myLibrariesPage.acaHeader.viewDetails.click();
    await expect(myLibrariesPage.libraryDetails.infoDrawerPanel).toBeVisible();

    await myLibrariesPage.libraryDetails.editButton.click();
    await myLibrariesPage.libraryDetails.nameField.fill(Utils.string257Long);
    await expect(myLibrariesPage.libraryDetails.errorMessage).toBeVisible();
    expect((await myLibrariesPage.libraryDetails.errorMessage.textContent()).trim()).toEqual('Use 256 characters or less for title');
    await expect(myLibrariesPage.libraryDetails.updateButton).toBeDisabled();
  });

  test('[C289343] Site description too long', async ({ myLibrariesPage }) => {
    await Utils.reloadPageIfRowNotVisible(myLibrariesPage, site.name);
    await myLibrariesPage.dataTable.getRowByName(site.name).click();
    await myLibrariesPage.acaHeader.viewDetails.click();
    await expect(myLibrariesPage.libraryDetails.infoDrawerPanel).toBeVisible();

    await myLibrariesPage.libraryDetails.editButton.click();
    await myLibrariesPage.libraryDetails.descriptionField.fill(Utils.string513Long);
    await expect(myLibrariesPage.libraryDetails.errorMessage).toBeVisible();
    expect((await myLibrariesPage.libraryDetails.errorMessage.textContent()).trim()).toEqual('Use 512 characters or less for description');
    await expect(myLibrariesPage.libraryDetails.updateButton).toBeDisabled();
  });
});

test.describe('Non manager', () => {
  let sitesApi: SitesApi;

  const username = `user1-${Utils.random()}`;
  const user2 = `user2-${Utils.random()}`;
  const user3 = `user3-${Utils.random()}`;
  const site = {
    name: `site1-${Utils.random()}`,
    id: `site-id-${Utils.random()}`,
    visibility: SITE_VISIBILITY.MODERATED,
    description: 'my site description'
  };

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      await apiClientFactory.createUser({ username: user2 });
      await apiClientFactory.createUser({ username: user3 });

      sitesApi = await SitesApi.initialize(username, username);
      await sitesApi.createSite(site.name, site.visibility, site.description, site.id);
      await sitesApi.addSiteMember(site.id, user2, SITE_ROLES.SITE_COLLABORATOR.ROLE);
      await sitesApi.addSiteMember(site.id, user3, SITE_ROLES.SITE_MANAGER.ROLE);
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(undefined, undefined, 'afterAll failed', sitesApi, [site.id]);
  });

  test('[C289337] Info drawer button is not displayed when user is not the library manager', async ({ loginPage, myLibrariesPage }) => {
    await loginPage.loginUser({ username: user2, password: user2 }, { withNavigation: true, waitForLoading: true });
    await myLibrariesPage.navigate();

    await myLibrariesPage.dataTable.getRowByName(site.name).click();
    await expect(myLibrariesPage.acaHeader.viewDetails).toBeHidden();
  });

  test('[C289344] Error notification when editing with no rights', async ({ loginPage, myLibrariesPage }) => {
    await loginPage.loginUser({ username: user3, password: user3 }, { withNavigation: true, waitForLoading: true });
    await myLibrariesPage.navigate();

    await myLibrariesPage.dataTable.getRowByName(site.name).click();
    await myLibrariesPage.acaHeader.viewDetails.click();
    await myLibrariesPage.libraryDetails.editButton.click();
    await sitesApi.updateSiteMember(site.id, user3, SITE_ROLES.SITE_CONSUMER.ROLE);
    await myLibrariesPage.libraryDetails.descriptionField.fill('new description');
    await myLibrariesPage.libraryDetails.updateButton.click();

    await expect(myLibrariesPage.snackBar.message).toHaveText('There was an error updating library properties');
  });
});
