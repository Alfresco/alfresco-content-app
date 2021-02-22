/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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

import { BrowsingPage, SITE_VISIBILITY, SITE_ROLES, RepoClient, InfoDrawer, Utils } from '@alfresco/aca-testing-shared';
import { ApiService, BrowserActions, UsersActions, LoginPage } from '@alfresco/adf-testing';

describe('Library properties', () => {
  let user2, user3;

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

  const apiService = new ApiService();
  const repoClient = new RepoClient(apiService);
  const adminApiService = new ApiService();
  const usersActions = new UsersActions(adminApiService);

  const infoDrawer = new InfoDrawer();
  const { aboutTab } = infoDrawer;

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;

  beforeAll(async (done) => {
    await adminApiService.loginWithProfile('admin');

    const user = await usersActions.createUser();
    await apiService.login(user.username, user.password);

    user2 = await usersActions.createUser();
    user3 = await usersActions.createUser();

    await repoClient.sites.createSite(site.name, site.visibility, site.description, site.id);
    await repoClient.sites.createSite(siteForUpdate.name, siteForUpdate.visibility, siteForUpdate.description, siteForUpdate.id);
    await repoClient.sites.createSite(siteDup);

    await repoClient.sites.addSiteMember(site.id, user2.username, SITE_ROLES.SITE_COLLABORATOR.ROLE);
    await repoClient.sites.addSiteMember(site.id, user3.username, SITE_ROLES.SITE_MANAGER.ROLE);

    await loginPage.loginWith(user.username, user.password);
    done();
  });

  afterAll(async (done) => {
    await repoClient.sites.deleteSite(site.id);
    await repoClient.sites.deleteSite(siteForUpdate.id);
    await repoClient.sites.deleteSite(siteDup);
    done();
  });

  beforeEach(async (done) => {
    await page.clickFileLibrariesAndWait();
    done();
  });

  afterEach(async (done) => {
    if (await infoDrawer.isOpen()) {
      await BrowserActions.click(page.toolbar.viewDetailsButton);
    }
    done();
  });

  it('[C289336] Info drawer opens for a library', async () => {
    await dataTable.selectItem(site.name);
    await BrowserActions.click(page.toolbar.viewDetailsButton);
    await infoDrawer.waitForInfoDrawerToOpen();

    expect(await infoDrawer.getHeaderTitle()).toEqual('Details');
    expect(await infoDrawer.isPropertiesTabDisplayed()).toBe(true, 'Properties tab is not displayed');
    expect(await aboutTab.isNameDisplayed()).toBe(true, 'Name field not displayed');
    expect(await aboutTab.isLibraryIdDisplayed()).toBe(true, 'Library ID field not displayed');
    expect(await aboutTab.isVisibilityDisplayed()).toBe(true, 'Visibility field not displayed');
    expect(await aboutTab.isDescriptionDisplayed()).toBe(true, 'Description field not displayed');

    expect(await aboutTab.getName()).toEqual(site.name);
    expect(await aboutTab.getLibraryId()).toEqual(site.id);
    expect((await aboutTab.getVisibility()).toLowerCase()).toEqual(site.visibility.toLowerCase());
    expect(await aboutTab.getDescription()).toEqual(site.description);

    expect(await aboutTab.isEditLibraryPropertiesDisplayed()).toBe(true, 'Edit action is not displayed');
  });

  it('[C289338] Editable properties', async () => {
    await dataTable.selectItem(site.name);
    await BrowserActions.click(page.toolbar.viewDetailsButton);
    await infoDrawer.waitForInfoDrawerToOpen();

    expect(await aboutTab.isEditLibraryPropertiesEnabled()).toBe(true, 'Edit action is not enabled');
    await aboutTab.clickEditLibraryProperties();

    expect(await aboutTab.isNameEnabled()).toBe(true, 'Name field not enabled');
    expect(await aboutTab.isLibraryIdEnabled()).toBe(false, 'Library ID field not disabled');
    expect(await aboutTab.isVisibilityEnabled()).toBe(true, 'Visibility field not enabled');
    expect(await aboutTab.isDescriptionEnabled()).toBe(true, 'Description field not enabled');

    expect(await aboutTab.isCancelDisplayed()).toBe(true, 'Cancel button not displayed');
    expect(await aboutTab.isUpdateDisplayed()).toBe(true, 'Update button not displayed');
    expect(await aboutTab.isCancelEnabled()).toBe(true, 'Cancel button not enabled');
    expect(await aboutTab.isUpdateEnabled()).toBe(false, 'Update button not disabled');
  });

  it('[C289339] Edit site details', async () => {
    await dataTable.selectItem(siteForUpdate.name);
    await BrowserActions.click(page.toolbar.viewDetailsButton);
    await infoDrawer.waitForInfoDrawerToOpen();

    expect(await aboutTab.isEditLibraryPropertiesEnabled()).toBe(true, 'Edit action is not enabled');
    await aboutTab.clickEditLibraryProperties();

    await aboutTab.enterName(siteUpdated.name);
    await aboutTab.enterDescription(siteUpdated.description);
    await aboutTab.setVisibility(siteUpdated.visibility);
    expect(await aboutTab.isUpdateEnabled()).toBe(true, 'Update button not enabled');

    await aboutTab.clickUpdate();

    expect(await page.getSnackBarMessage()).toEqual('Library properties updated');
    expect(await dataTable.isItemPresent(siteUpdated.name)).toBe(true, 'New site name not displayed in the list');
    expect(await infoDrawer.isOpen()).toBe(false, 'Info drawer still open');

    expect((await repoClient.sites.getSite(siteForUpdate.id)).entry.title).toEqual(siteUpdated.name);
    expect((await repoClient.sites.getSite(siteForUpdate.id)).entry.description).toEqual(siteUpdated.description);
    expect((await repoClient.sites.getSite(siteForUpdate.id)).entry.visibility).toEqual(siteUpdated.visibility);
  });

  it('[C289340] Cancel editing a site', async () => {
    const newName = `new-name-${Utils.random}`;
    const newDesc = `new desc ${Utils.random}`;

    await dataTable.selectItem(site.name);
    await BrowserActions.click(page.toolbar.viewDetailsButton);
    await infoDrawer.waitForInfoDrawerToOpen();

    expect(await aboutTab.isEditLibraryPropertiesEnabled()).toBe(true, 'Edit action is not enabled');
    await aboutTab.clickEditLibraryProperties();

    await aboutTab.enterName(newName);
    await aboutTab.enterDescription(newDesc);
    await aboutTab.setVisibility(SITE_VISIBILITY.MODERATED);

    await aboutTab.clickCancel();

    expect(await dataTable.isItemPresent(newName)).toBe(false, 'New site name is displayed in the list');
    expect(await dataTable.isItemPresent(site.name)).toBe(true, 'Original site name not displayed in the list');
    expect(await infoDrawer.isOpen()).toBe(true, 'Info drawer not open');
  });

  it('[C289341] Warning appears when editing the name of the library by entering an existing name', async () => {
    await repoClient.queries.waitForSites(site.name, { expect: 1 });

    await dataTable.selectItem(siteDup);
    await BrowserActions.click(page.toolbar.viewDetailsButton);
    await infoDrawer.waitForInfoDrawerToOpen();
    await aboutTab.clickEditLibraryProperties();

    await aboutTab.enterName(site.name);
    expect(await aboutTab.isMessageDisplayed()).toBe(true, 'Message not displayed');
    expect(await aboutTab.getMessage()).toEqual('Library name already in use');
  });

  it('[C289342] Site name too long', async () => {
    await dataTable.selectItem(site.name);
    await BrowserActions.click(page.toolbar.viewDetailsButton);
    await infoDrawer.waitForInfoDrawerToOpen();
    await aboutTab.clickEditLibraryProperties();

    await aboutTab.enterName(Utils.string257);
    await Utils.pressTab();
    expect(await aboutTab.isErrorDisplayed()).toBe(true, 'Message not displayed');
    expect(await aboutTab.getError()).toEqual('Use 256 characters or less for title');
    expect(await aboutTab.isUpdateEnabled()).toBe(false, 'Update button not disabled');
  });

  it('[C289343] Site description too long', async () => {
    await dataTable.selectItem(site.name);
    await BrowserActions.click(page.toolbar.viewDetailsButton);
    await infoDrawer.waitForInfoDrawerToOpen();
    await aboutTab.clickEditLibraryProperties();

    await aboutTab.enterDescription(Utils.string513);
    await Utils.pressTab();
    expect(await aboutTab.isErrorDisplayed()).toBe(true, 'Message not displayed');
    expect(await aboutTab.getError()).toEqual('Use 512 characters or less for description');
    expect(await aboutTab.isUpdateEnabled()).toBe(false, 'Update button not disabled');
  });

  describe('Non manager', () => {
    afterAll(async (done) => {
      await loginPage.loginWith(user.username, user.password);
      done();
    });

    it('[C289337] Info drawer button is not displayed when user is not the library manager', async () => {
      await loginPage.loginWith(user2.username, user2.password);
      await page.goToMyLibrariesAndWait();
      await dataTable.selectItem(site.name);
      expect(await page.toolbar.isButtonPresent('View Details')).toBe(false, 'View Details is present');
    });

    it('[C289344] Error notification', async () => {
      await loginPage.loginWith(user3.username, user3.password);

      await page.goToMyLibrariesAndWait();
      await dataTable.selectItem(site.name);
      await BrowserActions.click(page.toolbar.viewDetailsButton);
      await infoDrawer.waitForInfoDrawerToOpen();
      await aboutTab.clickEditLibraryProperties();

      await repoClient.sites.updateSiteMember(site.id, user3.username, SITE_ROLES.SITE_CONSUMER.ROLE);

      await aboutTab.enterDescription('new description');
      await aboutTab.clickUpdate();

      expect(await page.getSnackBarMessage()).toEqual('There was an error updating library properties');
    });
  });
});
