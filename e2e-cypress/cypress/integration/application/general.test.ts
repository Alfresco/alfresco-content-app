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

// import { BrowsingPage, LoginPage, CreateOrEditFolderDialog, RepoClient, Utils } from '@alfresco/aca-testing-shared';
import { CyLoginPage, CyBrowsingPage } from './../../pages';
import { CyUtils } from './../../utils/cy-utils';
import { CyRepoClient } from '../../utils/cy-api/cy-repo-client/cy-repo-client';
import { CyCreateOrEditFolderDialog } from '../../components/dialog';

describe('General', () => {
  const loginPage = new CyLoginPage();
  const page = new CyBrowsingPage();
  const createDialog = new CyCreateOrEditFolderDialog();
  const adminApi = new CyRepoClient();
  const folder = `folder-${CyUtils.random()}`;
  let folderId: string;

  describe('on session expire', () => {
    before(async () => {
      folderId = (await adminApi.nodes.createFolder(folder)).entry.id;
    });

    after(async () => {
      await adminApi.nodes.deleteNodeById(folderId);
    });

    it('[C286473] should close opened dialogs', () => {
      loginPage.loginWithAdmin();

      page.sidenav.openCreateFolderDialog();
      createDialog.enterName(folder);

      cy.request('POST', `${Cypress.env('params').config.hostEcm}/alfresco/api/-default-/public/authentication/versions/1/tickets`, {
        userId: Cypress.env('params').ADMIN_USERNAME,
        password: Cypress.env('params').ADMIN_PASSWORD
      }).then((resp) => {
        cy.log('>>>>>> response : ', resp);
      });

      const logout = {
        method: 'DELETE',
        url: `${Cypress.env('params').config.hostEcm}/alfresco/api/-default-/public/authentication/versions/1/tickets/-me-`,
        headers: {
          Accept: 'application/json',
          Authorization: {
            userId: 'admin@alfresco.com',
            password: 'adf$2018IloveAngular'
          }
        }
      };

      cy.request(logout).should((response) => {
        expect(response.status).to.eq(204);
      });

      createDialog.createButton.click();

      page.getSnackBarMessage().should('contain', 'The action was unsuccessful. Try again or contact your IT Team.');
      cy.title().should('contain', 'Sign in');

      // expect(createDialog.isDialogOpen()).not.toBe(true, 'dialog is present');
      createDialog.rootElem.should('not.be.visible');
    });
  });
});
