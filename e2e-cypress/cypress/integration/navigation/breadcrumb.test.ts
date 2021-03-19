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
import { CyAdminActions } from '../../utils/cy-api/cy-admin-actions';
import { CyRepoClient } from '../../utils/cy-api/cy-repo-client/cy-repo-client';
import { SITE_VISIBILITY } from '../../utils/cy-configs';
import { CyUtils } from '../../utils/cy-utils';

describe('Breadcrumb', () => {
  const username = `user-${CyUtils.random()}`;

  const parent = `parent-${CyUtils.random()}`;
  let parentId: string;
  const subFolder1 = `subFolder1-${CyUtils.random()}`;
  let subFolder1Id: string;
  const subFolder2 = `subFolder2-${CyUtils.random()}`;
  let subFolder2Id: string;
  const fileName1 = `file1-${CyUtils.random()}.txt`;

  const siteName = `site-${CyUtils.random()}`;
  const parentFromSite = `parent-in-site-${CyUtils.random()}`;
  let parentFromSiteId: string;
  const subFolder1FromSite = `subFolder1-in-site-${CyUtils.random()}`;
  let subFolder1FromSiteId: string;
  const subFolder2FromSite = `subFolder2-in-site-${CyUtils.random()}`;
  let subFolder2FromSiteId: string;
  const fileName1FromSite = `file1-in-site-${CyUtils.random()}.txt`;

  const parent2 = `parent2-${CyUtils.random()}`;
  let parent2Id: string;
  const folder1 = `folder1-${CyUtils.random()}`;
  let folder1Id: string;
  let subfolder2File: string;
  let subFolder2FromSiteIdFile: string;
  const folder1Renamed = `renamed-${CyUtils.random()}`;

  const loginPage = new CyLoginPage();
  const page = new CyBrowsingPage();
  const { breadcrumb } = page;

  const apis = {
    user: new CyRepoClient(username, username)
  };
  const adminApiActions = new CyAdminActions();

  before(() => {
    cy.then(async () => {
      await adminApiActions.createUser({ username });
      parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
      subFolder1Id = (await apis.user.nodes.createFolder(subFolder1, parentId)).entry.id;
      subFolder2Id = (await apis.user.nodes.createFolder(subFolder2, subFolder1Id)).entry.id;
      await apis.user.nodes.createFile(fileName1, subFolder2Id);

      parent2Id = (await apis.user.nodes.createFolder(parent2)).entry.id;
      folder1Id = (await apis.user.nodes.createFolder(folder1, parent2Id)).entry.id;

      await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
      const docLibId = await apis.user.sites.getDocLibId(siteName);
      parentFromSiteId = (await apis.user.nodes.createFolder(parentFromSite, docLibId)).entry.id;
      subFolder1FromSiteId = (await apis.user.nodes.createFolder(subFolder1FromSite, parentFromSiteId)).entry.id;
      subFolder2FromSiteId = (await apis.user.nodes.createFolder(subFolder2FromSite, subFolder1FromSiteId)).entry.id;
      await apis.user.nodes.createFile(fileName1FromSite, subFolder2FromSiteId);
    });
  });

  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.loginWith(username);
  });

  after(() => {
    cy.then(async () => {
      await Promise.all([apis.user.nodes.deleteNodeById(parentId), apis.user.nodes.deleteNodeById(parent2Id), apis.user.sites.deleteSite(siteName)]);
    });
  });

  function verifyBreadcrumb(expectedCount: number, expectedText: string) {
    breadcrumb.getRowsCount().should('eq', expectedCount);
    // cy.get(breadcrumb.currentItem)
    //   .invoke('text')
    //   .should(($el) => {
    //     expect($el.trim()).equal(expectedText);
    //   });
    breadcrumb.getCurrentItem().should((text) => {
      expect(text.trim()).equal(expectedText);
    });
  }

  it('[C260964] Personal Files breadcrumb main node', () => {
    page.clickPersonalFiles();
    verifyBreadcrumb(1, 'Personal Files');
  });

  it('[C260966] My Libraries breadcrumb main node', () => {
    page.goToMyLibraries();
    verifyBreadcrumb(1, 'My Libraries');
  });

  it('[C289891] Favorite Libraries breadcrumb main node', () => {
    page.goToFavoriteLibraries();
    verifyBreadcrumb(1, 'Favorite Libraries');
  });

  it('[C260971] Recent Files breadcrumb main node', () => {
    page.clickRecentFiles();
    verifyBreadcrumb(1, 'Recent Files');
  });

  it('[C260972] Shared Files breadcrumb main node', () => {
    page.clickSharedFiles();
    cy.url().should('contain', 'shared');
    verifyBreadcrumb(1, 'Shared Files');
  });

  it('[C260973] Favorites breadcrumb main node', () => {
    page.clickFavorites();
    verifyBreadcrumb(1, 'Favorites');
  });

  it('[C260974] Trash breadcrumb main node', () => {
    page.clickTrash();
    cy.url().should('contain', 'trashcan');
    verifyBreadcrumb(1, 'Trash');
  });

  it('[C260965] Personal Files breadcrumb for a folder hierarchy', () => {
    page.clickPersonalFiles();
    page.dataTable.doubleClickOnRowByName(parent);
    page.dataTable.doubleClickOnRowByName(subFolder1);
    page.dataTable.doubleClickOnRowByName(subFolder2);
    const expectedBreadcrumb = ['Personal Files', parent, subFolder1, subFolder2];
    breadcrumb.checkLastItemIsVisible(subFolder2);

    breadcrumb.getAllItems().then((result) => {
      expect(JSON.stringify(result)).equal(JSON.stringify(expectedBreadcrumb));
    });
  });

  it('[C260967] File Libraries breadcrumb for a folder hierarchy', () => {
    page.clickFileLibraries();
    page.dataTable.doubleClickOnRowByName(siteName);
    page.dataTable.doubleClickOnRowByName(parentFromSite);
    page.dataTable.doubleClickOnRowByName(subFolder1FromSite);
    page.dataTable.doubleClickOnRowByName(subFolder2FromSite);
    const expectedItems = ['Favorite Libraries', siteName, parentFromSite, subFolder1FromSite, subFolder2FromSite];
    breadcrumb.checkLastItemIsVisible(subFolder2FromSite);
    breadcrumb.getAllItems().then((result) => {
      expect(JSON.stringify(result)).equal(JSON.stringify(expectedItems));
    });
  });

  it('[C213235] User can navigate to any location by clicking on a step from the breadcrumb', () => {
    page.clickPersonalFiles();
    page.dataTable.doubleClickOnRowByName(parent);
    page.dataTable.doubleClickOnRowByName(subFolder1);
    page.dataTable.doubleClickOnRowByName(subFolder2);
    breadcrumb.clickItem(subFolder1);
    const expectedBreadcrumb = ['Personal Files', parent, subFolder1];
    breadcrumb.getAllItems().then((result) => {
      expect(JSON.stringify(result)).equal(JSON.stringify(expectedBreadcrumb));
    });
  });

  it('[C213237] Tooltip appears on hover on a step in breadcrumb', () => {
    page.clickPersonalFiles();
    page.dataTable.doubleClickOnRowByName(parent);
    page.dataTable.doubleClickOnRowByName(subFolder1);
    page.dataTable.doubleClickOnRowByName(subFolder2);

    breadcrumb.checkLastItemIsVisible(subFolder2);
    breadcrumb.getItemByIndex(2).invoke('attr', 'title').should('eq', subFolder1);
  });

  it('[C213238] Breadcrumb updates correctly when folder is renamed', () => {
    page.clickPersonalFiles();
    page.dataTable.doubleClickOnRowByName(parent2);
    page.dataTable.doubleClickOnRowByName(folder1);

    cy.then(async () => {
      await apis.user.nodes.renameNode(folder1Id, folder1Renamed);
    });

    cy.reload();
    breadcrumb.checkLastItemIsVisible(folder1Renamed);
    breadcrumb.getCurrentItem().should('eq', ` ${folder1Renamed} `);
  });

  it('[C213240] Browser back navigates to previous location regardless of breadcrumb steps', () => {
    page.clickPersonalFiles();
    page.dataTable.doubleClickOnRowByName(parent);
    page.dataTable.doubleClickOnRowByName(subFolder1);
    page.dataTable.doubleClickOnRowByName(subFolder2);
    page.dataTable.getRowByName(subfolder2File);

    page.clickTrash();
    cy.url().should('contain', 'trashcan');
    page.dataTable.isEmpty();
    cy.go('back');
    breadcrumb.checkLastItemIsVisible(subFolder2);
    const expectedBreadcrumb = ['Personal Files', parent, subFolder1, subFolder2];
    breadcrumb.getAllItems().then((result) => {
      expect(JSON.stringify(result)).equal(JSON.stringify(expectedBreadcrumb));
    });
  });

  describe('as admin', () => {
    const user2 = `user2-${CyUtils.random()}`;
    const userFolder = `userFolder-${CyUtils.random()}`;
    let userFolderId: string;
    const user2Api = new CyRepoClient(user2, user2);

    before(() => {
      cy.then(async () => {
        await adminApiActions.createUser({ username: user2 });
        userFolderId = (await user2Api.nodes.createFolder(userFolder)).entry.id;
      });
    });

    before(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      loginPage.loginWithAdmin();
    });

    after(() => {
      cy.then(async () => {
        await user2Api.nodes.deleteNodeById(userFolderId);
      });
    });

    it(`[C260970] Breadcrumb on navigation to a user's home`, () => {
      page.dataTable.sortByModified('desc');
      cy.wait(600);
      page.dataTable.doubleClickOnRowByName('User Homes');
      page.dataTable.doubleClickOnRowByName(user2);
      breadcrumb.checkLastItemIsVisible(user2);
      breadcrumb.getAllItems().then((result) => {
        expect(JSON.stringify(result)).equal(JSON.stringify(['Personal Files', 'User Homes', user2]));
      });

      page.dataTable.doubleClickOnRowByName(userFolder);
      breadcrumb.checkLastItemIsVisible(userFolder);

      breadcrumb.getAllItems().then((result) => {
        expect(JSON.stringify(result)).equal(JSON.stringify(['Personal Files', 'User Homes', user2, userFolder]));
      });
    });
  });
});
