/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { browser } from 'protractor';
import { BrowsingPage, LoginPage, LogoutPage } from '../../pages/pages';
import { CreateOrEditFolderDialog } from '../../components/dialog/create-edit-folder-dialog';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('General', () => {
  const loginPage = new LoginPage();
  const logoutPage = new LogoutPage();
  const page = new BrowsingPage();
  const createDialog = new CreateOrEditFolderDialog();
  const adminApi = new RepoClient();
  const { nodes: nodesApi, authentication: authApi } = adminApi;
  const folder = `folder-${Utils.random()}`;
  let folderId;
  xit('');

  describe('on session expire', () => {
    beforeAll(async (done) => {
      folderId = (await nodesApi.createFolder(folder)).entry.id;
      done();
    });

    afterAll(async (done) => {
      await nodesApi.deleteNodeById(folderId);
      await logoutPage.load();
      done();
    });

    it('should close opened dialogs - [C286473]', async () => {
      await loginPage.loginWithAdmin();

      await page.sidenav.openCreateDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.enterName(folder);

      await authApi.logout();

      await createDialog.clickCreate();
      expect(await browser.getTitle()).toContain('Sign in');
      const message = await page.getSnackBarMessage();
      expect(message).toEqual('The action was unsuccessful. Try again or contact your IT Team.');

      await createDialog.waitForDialogToClose();
      expect(createDialog.component.isPresent()).not.toBe(true, 'dialog is present');
    });
  });
});
