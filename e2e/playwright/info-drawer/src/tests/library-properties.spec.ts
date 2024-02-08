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

import { SITE_VISIBILITY, SITE_ROLES } from '@alfresco/aca-testing-shared';
import { expect } from '@playwright/test';
import { ApiClientFactory, Utils, test, SitesApi, QueriesApi } from '@alfresco/playwright-shared';

test.describe('Library properties', () => {
  let sitesApi: SitesApi;
  let queriesApi: QueriesApi;
  const username = `user1-${Utils.random()}`;
  const user2 = `user2-${Utils.random()}`;
  const user3 = `user3-${Utils.random()}`;

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

  const siteUpdated = {
    name: `site-for-rename-${Utils.random()}`,
    visibility: SITE_VISIBILITY.PRIVATE,
    description: 'new description'
  };

  const siteDup = `site3-${Utils.random()}`;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username: username });
      await apiClientFactory.createUser({ username: user2 });
      await apiClientFactory.createUser({ username: user3 });

      sitesApi = await SitesApi.initialize(username, username);
      await sitesApi.createSite(site.name, site.visibility, site.description, site.id);
      await sitesApi.createSite(siteForUpdate.name, siteForUpdate.visibility, siteForUpdate.description, siteForUpdate.id);
      await sitesApi.createSite(siteDup);
      await sitesApi.addSiteMember(site.id, user2, SITE_ROLES.SITE_COLLABORATOR.ROLE);
      await sitesApi.addSiteMember(site.id, user3, SITE_ROLES.SITE_MANAGER.ROLE);
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.afterAll(async () => {
    await sitesApi.deleteSites([site.id, siteForUpdate.id, siteDup]);
  });

  test.beforeEach(async ({ myLibrariesPage, loginPage }) => {
    try {
      await loginPage.loginUser({ username, password: username }, { withNavigation: true, waitForLoading: true });
      await myLibrariesPage.navigate();
    } catch (error) {
      console.error(` beforeEach failed: ${error}`);
    }
  });

  test.afterEach(async ({ myLibrariesPage }) => {
    if (await myLibrariesPage.libraryDetails.infoDrawerPanel.isVisible()) {
      await myLibrariesPage.acaHeader.viewDetails.click();
    }
  });

  test('[C289336] Info drawer opens for a library', async ({ myLibrariesPage }) => {
    await expect(myLibrariesPage.dataTable.getRowByName(site.name)).toBeVisible();
    await myLibrariesPage.dataTable.getRowByName(site.name).click();
    await myLibrariesPage.acaHeader.viewDetails.click();

    await expect(myLibrariesPage.libraryDetails.infoDrawerPanel).toBeVisible();
    expect(await myLibrariesPage.libraryDetails.headerTitle.textContent()).toEqual(site.name);
    await expect(myLibrariesPage.libraryDetails.propertiesTab).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.getNameField('Name')).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.getIdField('Library ID')).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.getVisibilityField('Visibility')).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.getDescriptionField).toBeVisible();

    expect(await myLibrariesPage.libraryDetails.infoDrawerPanel.locator('label', { hasText: 'Name' }).inputValue()).toEqual(site.name);
    expect(await myLibrariesPage.libraryDetails.infoDrawerPanel.locator('label', { hasText: 'Library ID' }).inputValue()).toEqual(site.id);
    // expect(await myLibrariesPage.libraryDetails.infoDrawerPanel.locator('label', {hasText: 'Visibility'}).locator('../../..').inputValue()).toEqual(site.visibility);
    expect(await myLibrariesPage.libraryDetails.getDescriptionField.textContent()).toEqual(site.description);
    await expect(myLibrariesPage.libraryDetails.editButton).toBeVisible();
  });

  test('[C289338] Editable properties', async ({ myLibrariesPage }) => {
    await myLibrariesPage.dataTable.selectItem(site.name);
    await myLibrariesPage.acaHeader.viewDetails.click();
    await expect(myLibrariesPage.libraryDetails.infoDrawerPanel).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.editButton).toBeVisible();

    await myLibrariesPage.libraryDetails.editButton.click();
    await expect(myLibrariesPage.libraryDetails.getNameField('Name')).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.getIdField('Library ID')).not.toBeEditable();
    await expect(myLibrariesPage.libraryDetails.getVisibilityField('Visibility')).toBeEditable();
    await expect(myLibrariesPage.libraryDetails.getDescriptionField).toBeEditable();
    await expect(myLibrariesPage.libraryDetails.cancelButton).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.updateButton).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.cancelButton).toBeEnabled();
    await expect(myLibrariesPage.libraryDetails.updateButton).not.toBeEnabled();
  });

  test('[C289339] Edit site details', async ({ myLibrariesPage }) => {
    await myLibrariesPage.dataTable.selectItem(site.name);
    await myLibrariesPage.acaHeader.viewDetails.click();
    await expect(myLibrariesPage.libraryDetails.infoDrawerPanel).toBeVisible();
    await expect(myLibrariesPage.libraryDetails.editButton).toBeVisible();

    await myLibrariesPage.libraryDetails.editButton.click();
    await myLibrariesPage.libraryDetails.getNameField('Name').fill(siteUpdated.name);
    await myLibrariesPage.libraryDetails.getVisibilityField('Visibility').selectOption(siteUpdated.visibility);
    await myLibrariesPage.libraryDetails.getDescriptionField.fill(siteUpdated.description);
    await expect(myLibrariesPage.libraryDetails.updateButton).toBeEnabled();

    await myLibrariesPage.libraryDetails.updateButton.click();
    await expect(myLibrariesPage.snackBar.message).toEqual('Library properties updated');
    await expect(myLibrariesPage.dataTable.isItemPresent(siteUpdated.name)).toBe(true);
    await expect(myLibrariesPage.libraryDetails.infoDrawerPanel).toBeVisible();
    expect((await sitesApi.getSite(siteForUpdate.id)).entry.title).toEqual(siteUpdated.name);
    expect((await sitesApi.getSite(siteForUpdate.id)).entry.description).toEqual(siteUpdated.description);
    expect((await sitesApi.getSite(siteForUpdate.id)).entry.visibility).toEqual(siteUpdated.visibility);
  });

  test('[C289340] Cancel editing a site', async ({ myLibrariesPage }) => {
    const newName = `new-name-${Utils.random}`;
    const newDesc = `new desc ${Utils.random}`;

    await myLibrariesPage.dataTable.selectItem(site.name);
    await myLibrariesPage.acaHeader.viewDetails.click();
    expect(await myLibrariesPage.libraryDetails.infoDrawerPanel).toBeVisible();
    expect(await myLibrariesPage.libraryDetails.editButton).toBeVisible();

    await myLibrariesPage.libraryDetails.editButton.click();
    await myLibrariesPage.libraryDetails.getNameField('Name').fill(newName);
    await myLibrariesPage.libraryDetails.getVisibilityField('Visibility').selectOption(SITE_VISIBILITY.MODERATED);
    await myLibrariesPage.libraryDetails.getDescriptionField.fill(newDesc);
    expect(await myLibrariesPage.libraryDetails.updateButton).toBeEnabled();

    await myLibrariesPage.libraryDetails.cancelButton.click();
    expect(await myLibrariesPage.dataTable.isItemPresent(newName)).toBe(false);
    expect(await myLibrariesPage.dataTable.isItemPresent(site.name)).toBe(true);
    expect(await myLibrariesPage.libraryDetails.infoDrawerPanel).toBeVisible();
  });

  test('[C289341] Warning appears when editing the name of the library by entering an existing name', async ({ myLibrariesPage }) => {
    queriesApi = await QueriesApi.initialize(username, username);
    await queriesApi.waitForSites(site.name, { expect: 1 });
    await myLibrariesPage.dataTable.selectItem(siteDup);
    await myLibrariesPage.acaHeader.viewDetails.click();
    expect(await myLibrariesPage.libraryDetails.infoDrawerPanel).toBeVisible();
    expect(await myLibrariesPage.libraryDetails.editButton).toBeVisible();

    await myLibrariesPage.libraryDetails.editButton.click();
    await myLibrariesPage.libraryDetails.getNameField('Name').fill(site.name);
    expect(await myLibrariesPage.libraryDetails.hintMessage).toBeVisible();
    expect(await myLibrariesPage.libraryDetails.hintMessage).toEqual('Library name already in use');
  });

  test('[C289342] Site name too long', async ({ myLibrariesPage }) => {
    await myLibrariesPage.dataTable.selectItem(site.name);
    await myLibrariesPage.acaHeader.viewDetails.click();
    expect(await myLibrariesPage.libraryDetails.infoDrawerPanel).toBeVisible();

    await myLibrariesPage.libraryDetails.editButton.click();
    await myLibrariesPage.libraryDetails.getNameField('Name').fill(Utils.string257Long);
    expect(await myLibrariesPage.libraryDetails.hintMessage).toBeVisible();
    expect(await myLibrariesPage.libraryDetails.hintMessage).toEqual('Use 256 characters or less for title');
    expect(await myLibrariesPage.libraryDetails.updateButton).not.toBeEnabled();
  });

  test('[C289343] Site description too long', async ({ myLibrariesPage }) => {
    await myLibrariesPage.dataTable.selectItem(site.name);
    await myLibrariesPage.acaHeader.viewDetails.click();
    expect(await myLibrariesPage.libraryDetails.infoDrawerPanel).toBeVisible();

    await myLibrariesPage.libraryDetails.editButton.click();
    await myLibrariesPage.libraryDetails.getDescriptionField.fill(Utils.string513Long);
    expect(await myLibrariesPage.libraryDetails.hintMessage).toBeVisible();
    expect(await myLibrariesPage.libraryDetails.hintMessage).toEqual('Use 512 characters or less for description');
    expect(await myLibrariesPage.libraryDetails.updateButton).not.toBeEnabled();
  });

  test.describe('Non manager', () => {
    test.beforeEach(async ({ myLibrariesPage }) => {
      await myLibrariesPage.navigate();
    });

    test.afterAll(async ({ loginPage }) => {
      await loginPage.loginUser({ username, password: username }, { withNavigation: true, waitForLoading: true });
    });

    test('[C289337] Info drawer button is not displayed when user is not the library manager', async ({ loginPage, myLibrariesPage }) => {
      await loginPage.loginUser({ username, password: user2 }, { withNavigation: true, waitForLoading: true });
      await myLibrariesPage.dataTable.selectItem(site.name);
      expect(await myLibrariesPage.acaHeader.viewDetails).not.toBeVisible();
    });

    test('[C289344] Error notification', async ({ loginPage, myLibrariesPage }) => {
      await loginPage.loginUser({ username, password: user3 }, { withNavigation: true, waitForLoading: true });
      await myLibrariesPage.dataTable.selectItem(site.name);
      await myLibrariesPage.acaHeader.viewDetails.click();
      await myLibrariesPage.libraryDetails.editButton.click();
      await sitesApi.updateSiteMember(site.id, user3, SITE_ROLES.SITE_CONSUMER.ROLE);
      await myLibrariesPage.libraryDetails.getDescriptionField.fill('new description');
      await myLibrariesPage.libraryDetails.updateButton.click();

      await expect(myLibrariesPage.snackBar.message).toEqual('There was an error updating library properties');
    });
  });
});
