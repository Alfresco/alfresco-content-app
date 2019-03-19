/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { LoginPage, BrowsingPage } from '../../pages/pages';
import { SITE_VISIBILITY, SITE_ROLES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { InfoDrawer } from './../../components/info-drawer/info-drawer';
import { Utils } from '../../utilities/utils';

describe('Library properties', () => {
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
  }

  const siteDup = `site3-${Utils.random()}`;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const infoDrawer = new InfoDrawer();

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    await apis.admin.people.createUser({ username: user2 });
    await apis.admin.people.createUser({ username: user3 });
    await apis.user.sites.createSite(site.name, site.visibility, site.description, site.id);
    await apis.user.sites.createSite(siteForUpdate.name, siteForUpdate.visibility, siteForUpdate.description, siteForUpdate.id);
    await apis.user.sites.createSite(siteDup);

    await apis.user.sites.addSiteMember(site.id, user2, SITE_ROLES.SITE_COLLABORATOR.ROLE);
    await apis.user.sites.addSiteMember(site.id, user3, SITE_ROLES.SITE_MANAGER.ROLE);

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.sites.deleteSite(site.id);
    await apis.user.sites.deleteSite(siteForUpdate.id);
    await apis.user.sites.deleteSite(siteDup);
    done();
  });

  beforeEach(async (done) => {
    await page.clickFileLibrariesAndWait();
    done();
  });

  afterEach(async done => {
    if (await infoDrawer.isOpen()) {
      await page.toolbar.clickViewDetails();
    }
    done();
  });

  it('Info drawer opens for a library - [C289336]', async () => {
    await dataTable.selectItem(site.name);
    await page.toolbar.clickViewDetails();
    await infoDrawer.waitForInfoDrawerToOpen();

    expect(await infoDrawer.getHeaderTitle()).toEqual('Details');
    expect(await infoDrawer.isAboutTabDisplayed()).toBe(true, 'About tab is not displayed');
    expect(await infoDrawer.isNameDisplayed()).toBe(true, 'Name field not displayed');
    expect(await infoDrawer.isLibraryIdDisplayed()).toBe(true, 'Library ID field not displayed');
    expect(await infoDrawer.isVisibilityDisplayed()).toBe(true, 'Visibility field not displayed');
    expect(await infoDrawer.isDescriptionDisplayed()).toBe(true, 'Description field not displayed');

    expect(await infoDrawer.getName()).toEqual(site.name);
    expect(await infoDrawer.getLibraryId()).toEqual(site.id);
    expect((await infoDrawer.getVisibility()).toLowerCase()).toEqual((site.visibility).toLowerCase());
    expect(await infoDrawer.getDescription()).toEqual(site.description);

    expect(await infoDrawer.isEditDisplayed()).toBe(true, 'Edit action is not displayed');
  });

  it('Editable properties - [C289338]', async () => {
    await dataTable.selectItem(site.name);
    await page.toolbar.clickViewDetails();
    await infoDrawer.waitForInfoDrawerToOpen();

    expect(await infoDrawer.isEditEnabled()).toBe(true, 'Edit action is not enabled');
    await infoDrawer.clickEdit();

    expect(await infoDrawer.isNameEnabled()).toBe(true, 'Name field not enabled');
    expect(await infoDrawer.isLibraryIdEnabled()).toBe(false, 'Library ID field not disabled');
    expect(await infoDrawer.isVisibilityEnabled()).toBe(true, 'Visibility field not enabled');
    expect(await infoDrawer.isDescriptionEnabled()).toBe(true, 'Description field not enabled');

    expect(await infoDrawer.isCancelDisplayed()).toBe(true, 'Cancel button not displayed');
    expect(await infoDrawer.isUpdateDisplayed()).toBe(true, 'Update button not displayed');
    expect(await infoDrawer.isCancelEnabled()).toBe(true, 'Cancel button not enabled');
    expect(await infoDrawer.isUpdateEnabled()).toBe(false, 'Update button not disabled');
  });

  it('Edit site details - [C289339]', async () => {
    await dataTable.selectItem(siteForUpdate.name);
    await page.toolbar.clickViewDetails();
    await infoDrawer.waitForInfoDrawerToOpen();

    expect(await infoDrawer.isEditEnabled()).toBe(true, 'Edit action is not enabled');
    await infoDrawer.clickEdit();

    await infoDrawer.enterName(siteUpdated.name);
    await infoDrawer.enterDescription(siteUpdated.description);
    await infoDrawer.setVisibility(siteUpdated.visibility);
    expect(await infoDrawer.isUpdateEnabled()).toBe(true, 'Update button not enabled');

    await infoDrawer.clickUpdate();

    expect(await page.getSnackBarMessage()).toEqual('Library properties updated');
    expect(await dataTable.isItemPresent(siteUpdated.name)).toBe(true, 'New site name not displayed in the list');
    expect(await infoDrawer.isOpen()).toBe(false, 'Info drawer still open');

    expect((await apis.user.sites.getSite(siteForUpdate.id)).entry.title).toEqual(siteUpdated.name);
    expect((await apis.user.sites.getSite(siteForUpdate.id)).entry.description).toEqual(siteUpdated.description);
    expect((await apis.user.sites.getSite(siteForUpdate.id)).entry.visibility).toEqual(siteUpdated.visibility);
  });

  it('Cancel editing a site - [C289340]', async () => {
    const newName = `new-name-${Utils.random}`;
    const newDesc = `new desc ${Utils.random}`;

    await dataTable.selectItem(site.name);
    await page.toolbar.clickViewDetails();
    await infoDrawer.waitForInfoDrawerToOpen();

    expect(await infoDrawer.isEditEnabled()).toBe(true, 'Edit action is not enabled');
    await infoDrawer.clickEdit();

    await infoDrawer.enterName(newName);
    await infoDrawer.enterDescription(newDesc);
    await infoDrawer.setVisibility(SITE_VISIBILITY.MODERATED);

    await infoDrawer.clickCancel();

    expect(await dataTable.isItemPresent(newName)).toBe(false, 'New site name is displayed in the list');
    expect(await dataTable.isItemPresent(site.name)).toBe(true, 'Original site name not displayed in the list');
    expect(await infoDrawer.isOpen()).toBe(true, 'Info drawer not open');
  });

  it('Warning appears when editing the name of the library by entering an existing name - [C289341]', async () => {
    await apis.user.queries.waitForSites(site.name, { expect: 1 });

    await dataTable.selectItem(siteDup);
    await page.toolbar.clickViewDetails();
    await infoDrawer.waitForInfoDrawerToOpen();
    await infoDrawer.clickEdit();

    await infoDrawer.enterName(site.name);
    expect(await infoDrawer.isMessageDisplayed()).toBe(true, 'Message not displayed');
    expect(await infoDrawer.getMessage()).toEqual('Library name already in use');
  });

  it('Site name too long - [C289342]', async () => {
    await dataTable.selectItem(site.name);
    await page.toolbar.clickViewDetails();
    await infoDrawer.waitForInfoDrawerToOpen();
    await infoDrawer.clickEdit();

    await infoDrawer.enterName(Utils.string257);
    await Utils.pressTab();
    expect(await infoDrawer.isErrorDisplayed()).toBe(true, 'Message not displayed');
    expect(await infoDrawer.getError()).toEqual('Use 256 characters or less for title');
    expect(await infoDrawer.isUpdateEnabled()).toBe(false, 'Update button not disabled');
  });

  it('Site description too long - [C289343]', async () => {
    await dataTable.selectItem(site.name);
    await page.toolbar.clickViewDetails();
    await infoDrawer.waitForInfoDrawerToOpen();
    await infoDrawer.clickEdit();

    await infoDrawer.enterDescription(Utils.string513);
    await Utils.pressTab();
    expect(await infoDrawer.isErrorDisplayed()).toBe(true, 'Message not displayed');
    expect(await infoDrawer.getError()).toEqual('Use 512 characters or less for description');
    expect(await infoDrawer.isUpdateEnabled()).toBe(false, 'Update button not disabled');
  });

  describe('Non manager', () => {
    afterAll(async done => {
      await loginPage.loginWith(username);
      done();
    });

    it('Edit button is not displayed when user is not the library manager - [C289337]', async () => {
      await loginPage.loginWith(user2);

      await page.clickFileLibrariesAndWait();
      await dataTable.selectItem(site.name);
      await page.toolbar.clickViewDetails();
      await infoDrawer.waitForInfoDrawerToOpen();
      expect(await infoDrawer.isEditDisplayed()).toBe(false, 'Edit action is displayed');
    });

    it('Error notification - [C289344]', async () => {
      await loginPage.loginWith(user3);

      await page.clickFileLibrariesAndWait();
      await dataTable.selectItem(site.name);
      await page.toolbar.clickViewDetails();
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.clickEdit();

      await apis.user.sites.updateSiteMember(site.id, user3, SITE_ROLES.SITE_CONSUMER.ROLE);

      await infoDrawer.enterDescription('new description');
      await infoDrawer.clickUpdate();

      expect(await page.getSnackBarMessage()).toEqual('There was an error updating library properties');
    });
  });

});
