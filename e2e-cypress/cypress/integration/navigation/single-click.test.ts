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

import { CyBrowsingPage, CyLoginPage } from '../../pages';
import { CyViewer } from '../../pages/viewer';
import { CyAdminActions } from '../../utils/cy-api/cy-admin-actions';
import { CyRepoClient } from '../../utils/cy-api/cy-repo-client/cy-repo-client';
import { CyUserActions } from '../../utils/cy-api/cy-user-actions';
import { CyUtils } from '../../utils/cy-utils';

describe('Single click on item name', () => {
  const username = `user-${CyUtils.random()}`;

  const file1 = `file1-${CyUtils.random()}.txt`;
  let file1Id: string;
  const folder1 = `folder1-${CyUtils.random()}`;
  let folder1Id: string;

  const deletedFile1 = `file1-${CyUtils.random()}.txt`;
  let deletedFile1Id: string;
  const deletedFolder1 = `folder1-${CyUtils.random()}`;
  let deletedFolder1Id: string;

  const siteName = `site-${CyUtils.random()}`;
  const fileSite = `fileSite-${CyUtils.random()}.txt`;

  const apis = {
    user: new CyRepoClient(username, username)
  };

  const loginPage = new CyLoginPage();
  const page = new CyBrowsingPage();
  const { dataTable, breadcrumb } = page;
  const viewer = new CyViewer();
  const { searchInput } = page.header;

  const adminApiActions = new CyAdminActions();
  const userActions = new CyUserActions();

  before(() => {
    let docLibId, initialRecentTotalItems;

    cy.wrap(adminApiActions.login());
    cy.wrap(adminApiActions.createUser({ username }));
    cy.wrap(userActions.login(username, username));

    cy.then(() => apis.user.search.getTotalItems(username)).then( response => initialRecentTotalItems = response);

    cy.then(() => apis.user.nodes.createFile(file1)).then( response => file1Id = response.entry.id);
    cy.then(() => apis.user.nodes.createFolder(file1)).then( response => folder1Id = response.entry.id);
    cy.wrap(apis.user.sites.createSite(siteName));
    cy.then(() => apis.user.sites.getDocLibId(siteName)).then( response => docLibId = response)
    cy.wrap(apis.user.nodes.createFile(fileSite, docLibId));

    cy.wrap(apis.user.search.waitForApi(username, { expect: initialRecentTotalItems + 2 }));
    cy.then(() => apis.user.nodes.createFile(deletedFile1)).then( response => deletedFile1Id = response.entry.id);
    cy.then(() => apis.user.nodes.createFolder(deletedFolder1)).then( response => deletedFile1Id = response.entry.id);
    cy.wrap(userActions.deleteNodes([deletedFile1Id, deletedFolder1Id], false));
  });

  beforeEach(() => {
    loginPage.loginWith(username);
  });

  after(() => {
    cy.then( async () => {
      await userActions.deleteSites([siteName]);
      await userActions.deleteNodes([folder1Id, file1Id]);
      await userActions.emptyTrashcan();
    });
  });

  it.only('[C284899] Hyperlink does not appear for items in the Trash', () => {
    page.clickTrash();

    dataTable.hasLinkOnName(deletedFile1);
    dataTable.hasLinkOnName(deletedFolder1);
  });

  // describe('on Personal Files', () => {
  //   beforeEach(async () => {
  //     await page.clickPersonalFilesAndWait();
  //   });

  //   it('[C280032] Hyperlink appears when mouse over a file/folder', async () => {
  //     expect(await dataTable.hasLinkOnName(file1)).toBe(true, 'Link on name is missing');
  //   });

  //   it('[C280033] File preview opens when clicking the hyperlink', async () => {
  //     await dataTable.clickNameLink(file1);

  //     expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

  //     await Utils.pressEscape();
  //   });

  //   it('[C280034] Navigate inside the folder when clicking the hyperlink', async () => {
  //     await dataTable.clickNameLink(folder1);

  //     expect(await breadcrumb.currentItem.getText()).toBe(folder1);
  //   });
  // });

  // describe('on File Libraries', () => {
  //   beforeEach(async () => {
  //     await page.clickFileLibrariesAndWait();
  //   });

  //   it('[C284901] Hyperlink appears when mouse over a library', async () => {
  //     expect(await dataTable.hasLinkOnName(siteName)).toBe(true, 'Link on site name is missing');
  //   });

  //   it('[C284902] Navigate inside the library when clicking the hyperlink', async () => {
  //     await dataTable.clickNameLink(siteName);

  //     expect(await breadcrumb.currentItem.getText()).toBe(siteName);
  //     expect(await dataTable.isItemPresent(fileSite)).toBe(true, `${fileSite} not displayed`);
  //   });
  // });

  // describe('on Shared Files', () => {
  //   beforeAll(async () => {
  //     await userActions.shareNodes([file1Id]);
  //     await apis.user.shared.waitForFilesToBeShared([file1Id]);
  //   });

  //   beforeEach(async () => {
  //     await page.clickSharedFilesAndWait();
  //   });

  //   it('[C284905] Hyperlink appears when mouse over a file', async () => {
  //     expect(await dataTable.hasLinkOnName(file1)).toBe(true, 'Link on name is missing');
  //   });

  //   it('[C284906] File preview opens when clicking the hyperlink', async () => {
  //     await dataTable.clickNameLink(file1);

  //     expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

  //     await Utils.pressEscape();
  //   });
  // });

  // describe('on Recent Files', () => {
  //   beforeEach(async () => {
  //     await page.clickRecentFilesAndWait();
  //   });

  //   it('[C284907] Hyperlink appears when mouse over a file', async () => {
  //     expect(await dataTable.hasLinkOnName(file1)).toBe(true, 'Link on name is missing');
  //   });

  //   it('[C284908] File preview opens when clicking the hyperlink', async () => {
  //     await dataTable.clickNameLink(file1);

  //     expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

  //     await Utils.pressEscape();
  //   });
  // });

  // describe('on Favorites', () => {
  //   beforeAll(async () => {
  //     const initialFavoriteTotalItems = await apis.user.favorites.getFavoritesTotalItems();
  //     await apis.user.favorites.addFavoriteById('file', file1Id);
  //     await apis.user.favorites.addFavoriteById('folder', folder1Id);
  //     await apis.user.favorites.waitForApi({ expect: initialFavoriteTotalItems + 2 });
  //   });

  //   beforeEach(async () => {
  //     await page.clickFavoritesAndWait();
  //   });

  //   it('[C284909] Hyperlink appears when mouse over a file/folder', async () => {
  //     expect(await dataTable.hasLinkOnName(file1)).toBe(true, 'Link on name is missing');
  //   });

  //   it('[C284910] File preview opens when clicking the hyperlink', async () => {
  //     await dataTable.clickNameLink(file1);

  //     expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

  //     await Utils.pressEscape();
  //   });

  //   it('[C284911] Navigate inside the folder when clicking the hyperlink', async () => {
  //     await dataTable.clickNameLink(folder1);

  //     expect(await breadcrumb.currentItem.getText()).toBe(folder1);
  //   });
  // });

  // describe('on Search Results', () => {
  //   beforeEach(async () => {
  //     await searchInput.clickSearchButton();
  //     await searchInput.checkFilesAndFolders();
  //   });

  //   afterEach(async () => {
  //     await Utils.pressEscape();
  //     await page.clickPersonalFilesAndWait();
  //   });

  //   it('[C306988] Hyperlink appears when mouse over a file', async () => {
  //     await searchInput.searchFor(file1);
  //     await dataTable.waitForBody();

  //     expect(await dataTable.hasLinkOnSearchResultName(file1)).toBe(true, 'Link on name is missing');
  //   });

  //   it('[C306989] File preview opens when clicking the hyperlink', async () => {
  //     await searchInput.searchFor(file1);
  //     await dataTable.waitForBody();
  //     await dataTable.clickSearchResultNameLink(file1);

  //     expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

  //     await Utils.pressEscape();
  //   });

  //   it('[C306990] Navigate inside the folder when clicking the hyperlink', async () => {
  //     await searchInput.searchFor(folder1);
  //     await dataTable.waitForBody();
  //     await dataTable.clickSearchResultNameLink(folder1);

  //     expect(await breadcrumb.currentItem.getText()).toBe(folder1);
  //   });
  // });
});
