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

import { SITE_VISIBILITY } from '../../configs';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { CreateLibraryDialog } from '../../components/dialog/create-library-dialog';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('Create library', () => {
  const username = `user-${Utils.random()}`;

  const site1Name = `site1-${Utils.random()}`;
  const site2Name = `site2-${Utils.random()}`;
  const site3Name = `site3-${Utils.random()}`;

  const site4 = {
    name: `site4-${Utils.random()}`,
    id: `site4-id-${Utils.random()}`,
    description: 'site4 description'
  }

  const duplicateSite = {
    name: `duplicate-${Utils.random()}`,
    id: `duplicate-${Utils.random()}`
  }

  const siteInTrash = {
    name: `site-trash-${Utils.random()}`,
    id: `site-trash-id-${Utils.random()}`
  }

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const createDialog = new CreateLibraryDialog();
  const { dataTable } = page;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    await apis.user.sites.createSite(duplicateSite.name, SITE_VISIBILITY.PRIVATE, '', duplicateSite.id);
    await apis.user.sites.createSite(siteInTrash.name, SITE_VISIBILITY.PUBLIC, '', siteInTrash.id);
    await apis.user.sites.deleteSite(siteInTrash.id, false);

    await loginPage.loginWith(username);
    done();
  });

  afterEach(async (done) => {
    await Utils.pressEscape();
    done();
  });

  afterAll(async (done) => {
    await apis.user.sites.deleteAllUserSites();
    done();
  });

  it('Create Library dialog UI - [C280024]', async () => {
    await page.sidenav.openCreateLibraryDialog();
    await createDialog.waitForDialogToOpen();

    expect(await createDialog.getTitle()).toMatch('Create Library');
    expect(await createDialog.isNameDisplayed()).toBe(true, 'Name input is not displayed');
    expect(await createDialog.isLibraryIdDisplayed()).toBe(true, 'Library ID input is not displayed');
    expect(await createDialog.isDescriptionDisplayed()).toBe(true, 'Description field is not displayed');
    expect(await createDialog.isPublicDisplayed()).toBe(true, 'Public option is not displayed');
    expect(await createDialog.isModeratedDisplayed()).toBe(true, 'Moderated option is not displayed');
    expect(await createDialog.isPrivateDisplayed()).toBe(true, 'Private option is not displayed');
    expect(await createDialog.isPublicChecked()).toBe(true, 'Public option not checked');
    expect(await createDialog.isCreateEnabled()).toBe(false, 'Create button is not disabled');
    expect(await createDialog.isCancelEnabled()).toBe(true, 'Cancel button is not enabled');
  });

  it('Create a public library - [C280025]', async () => {
    await page.sidenav.openCreateLibraryDialog();
    await createDialog.waitForDialogToOpen();
    await createDialog.enterName(site1Name);
    await createDialog.clickCreate();
    await createDialog.waitForDialogToClose();

    expect(await page.breadcrumb.getCurrentItemName()).toEqual(site1Name, `Not navigated into ${site1Name}`);
    await page.goToMyLibrariesAndWait();
    expect(await dataTable.isItemPresent(site1Name)).toBe(true, `${site1Name} not in the list`);
    expect(await apis.user.sites.getVisibility(site1Name)).toEqual(SITE_VISIBILITY.PUBLIC);
  });

  it('Create a moderated library - [C289880]', async () => {
    await page.sidenav.openCreateLibraryDialog();
    await createDialog.waitForDialogToOpen();
    await createDialog.enterName(site2Name);
    await createDialog.selectModerated();
    await createDialog.clickCreate();
    await createDialog.waitForDialogToClose();

    expect(await page.breadcrumb.getCurrentItemName()).toEqual(site2Name, `Not navigated into ${site2Name}`);
    await page.goToMyLibrariesAndWait();
    expect(await dataTable.isItemPresent(site2Name)).toBe(true, `${site2Name} not in the list`);
    expect(await apis.user.sites.getVisibility(site2Name)).toEqual(SITE_VISIBILITY.MODERATED);
  });

  it('Create a private library - [C289881]', async () => {
    await page.sidenav.openCreateLibraryDialog();
    await createDialog.waitForDialogToOpen();
    await createDialog.enterName(site3Name);
    await createDialog.selectPrivate();
    await createDialog.clickCreate();
    await createDialog.waitForDialogToClose();

    expect(await page.breadcrumb.getCurrentItemName()).toEqual(site3Name, `Not navigated into ${site3Name}`);
    await page.goToMyLibrariesAndWait();
    expect(await dataTable.isItemPresent(site3Name)).toBe(true, `${site3Name} not in the list`);
    expect(await apis.user.sites.getVisibility(site3Name)).toEqual(SITE_VISIBILITY.PRIVATE);
  });

  it('Create a library with a given ID and description - [C289882]', async () => {
    await page.sidenav.openCreateLibraryDialog();
    await createDialog.waitForDialogToOpen();
    await createDialog.enterName(site4.name);
    await createDialog.enterLibraryId(site4.id);
    await createDialog.enterDescription(site4.description);
    await createDialog.selectPublic();
    await createDialog.clickCreate();
    await createDialog.waitForDialogToClose();

    expect(await page.breadcrumb.getCurrentItemName()).toEqual(site4.name, `Not navigated into ${site4.name}`);
    await page.goToMyLibrariesAndWait();
    expect(await dataTable.isItemPresent(site4.name)).toBe(true, `${site4.name} not in the list`);
    expect(await apis.user.sites.getVisibility(site4.id)).toEqual(SITE_VISIBILITY.PUBLIC);
    expect(await apis.user.sites.getDescription(site4.id)).toEqual(site4.description);
  });

  it('Duplicate library ID - [C280027]', async () => {
    await page.sidenav.openCreateLibraryDialog();
    await createDialog.waitForDialogToOpen();
    await createDialog.enterName(duplicateSite.name);
    await createDialog.enterLibraryId(duplicateSite.id);

    expect(await createDialog.isCreateEnabled()).toBe(false, 'Create button not disabled');
    expect(await createDialog.getErrorMessage()).toEqual(`This Library ID isn't available. Try a different Library ID.`);
  });

  it('Create library using the ID of a library from the Trashcan - [C280028]', async () => {
    await page.sidenav.openCreateLibraryDialog();
    await createDialog.waitForDialogToOpen();
    await createDialog.enterName(siteInTrash.name);
    await createDialog.enterLibraryId(siteInTrash.id);
    await createDialog.clickCreate();

    expect(await createDialog.getErrorMessage()).toEqual(`This Library ID is already used. Check the trashcan.`);
  });

  it('Cancel button - [C280029]', async () => {
    await page.sidenav.openCreateLibraryDialog();
    await createDialog.waitForDialogToOpen();
    await createDialog.enterName('test site');
    await createDialog.enterDescription('test description');
    await createDialog.clickCancel();

    expect(await createDialog.isDialogOpen()).not.toBe(true, 'dialog is not closed');
  });

  it('Library ID cannot contain special characters - [C280026]', async () => {
    const idWithSpecialChars = [ 'a*a', 'a"a', 'a<a', 'a>a', `a\\a`, 'a/a', 'a?a', 'a:a', 'a|a' ];

    await page.sidenav.openCreateLibraryDialog();
    await createDialog.waitForDialogToOpen();
    await createDialog.enterName('test site');

    for (const id of idWithSpecialChars) {
      await createDialog.enterLibraryId(id);
      expect(await createDialog.isCreateEnabled()).toBe(false, 'Create button is not disabled');
      expect(await createDialog.getErrorMessage()).toContain(`Use numbers and letters only`);
    }
  });

  it('Create 2 libraries with same name but different IDs - [C280030]', async () => {
    await page.sidenav.openCreateLibraryDialog();
    await createDialog.waitForDialogToOpen();
    await createDialog.enterName(duplicateSite.name);
    await createDialog.enterLibraryId(`${duplicateSite.id}-2`);
    await createDialog.clickCreate();
    await createDialog.waitForDialogToClose();

    expect(await page.breadcrumb.getCurrentItemName()).toEqual(duplicateSite.name, `Not navigated into ${duplicateSite.name}`);
    await page.goToMyLibrariesAndWait();
    expect(await dataTable.isItemPresent(`${duplicateSite.name} (${duplicateSite.id}-2)`)).toBe(true, `${duplicateSite.name} not in the list`);
    expect(await apis.user.sites.getTitle(`${duplicateSite.id}-2`)).toEqual(duplicateSite.name);
  });

});
