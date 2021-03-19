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
import { CyUserActions } from '../../utils/cy-api/cy-user-actions';

describe.skip('Generic errors', () => {
  const username = `user-${CyUtils.random()}`;
  const username2 = `user2-${CyUtils.random()}`;

  const parent = `folder-${CyUtils.random()}`;
  let parentId: string;
  const file1 = `file1-${CyUtils.random()}.txt`;
  let file1Id: string;
  const file2 = `file2-${CyUtils.random()}.txt`;

  const userApi = new CyRepoClient(username, username);

  const loginPage = new CyLoginPage();
  const page = new CyBrowsingPage();
  const { dataTable } = page;

  const adminApiActions = new CyAdminActions();
  const userActions = new CyUserActions();

  before(() => {
    cy.then(async () => {
      await adminApiActions.login();
      await adminApiActions.createUser({ username });
      await adminApiActions.createUser({ username: username2 });

      await userActions.login(username, username);
      parentId = (await userApi.nodes.createFolder(parent)).entry.id;
      file1Id = (await userApi.nodes.createFile(file1, parentId)).entry.id;
      await userApi.nodes.createFile(file2, parentId);
    });
  });

  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.loginWith(username);
  });

  after(() => {
    cy.then(async () => {
      await userActions.deleteNodes([parentId]);
      await userActions.emptyTrashcan();
    });
  });

  it('[C217313] File / folder not found', () => {
    page.clickPersonalFiles();
    dataTable.doubleClickOnRowByName(parent);
    dataTable.doubleClickOnRowByName(file1);

    const url = cy.url();

    cy.then(async () => {
      await userApi.nodes.deleteNodeById(file1Id, false);
    });

    cy.visit(url);

    page.genericError.isDisplayed().toBe(true, 'Generic error page not displayed');
    page.genericErrorTitle.getText().toContain(`This item no longer exists or you don't have permission to view it.`);
  });

  it('[C217315] Invalid URL', () => {
    page.load('/invalid page');

    page.genericError.isDisplayed().toBe(true, 'Generic error page not displayed');
    page.genericErrorTitle.getText().toContain(`This item no longer exists or you don't have permission to view it.`);
  });

  it('[C217314] Permission denied', () => {
    page.clickPersonalFiles();
    dataTable.doubleClickOnRowByName(parent);
    dataTable.doubleClickOnRowByName(file2);

    const url = cy.url();

    loginPage.loginWith(username2);
    cy.visit(url);

    page.genericError.isDisplayed().toBe(true, 'Generic error page not displayed');
    page.genericErrorTitle.getText().toContain(`This item no longer exists or you don't have permission to view it.`);

    loginPage.loginWith(username);
  });
});
