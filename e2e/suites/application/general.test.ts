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

import { browser } from 'protractor';
import { BrowserActions } from '@alfresco/adf-testing';
import { BrowsingPage, LoginPage, CreateOrEditFolderDialog, RepoClient, Utils } from '@alfresco/aca-testing-shared';

describe('General', () => {
  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const createDialog = new CreateOrEditFolderDialog();
  const adminApi = new RepoClient();
  const folder = `folder-${Utils.random()}`;
  let folderId: string;

  describe('on session expire', () => {
    beforeAll(async (done) => {
      folderId = (await adminApi.nodes.createFolder(folder)).entry.id;
      done();
    });

    afterAll(async (done) => {
      await adminApi.nodes.deleteNodeById(folderId);
      done();
    });

    it('[C286473] should close opened dialogs', async () => {
      await loginPage.loginWithAdmin();

      await page.sidenav.openCreateFolderDialog();
      await createDialog.waitForDialogToOpen();
      await createDialog.enterName(folder);

      await adminApi.logout();

      await BrowserActions.click(createDialog.createButton);

      expect(await page.getSnackBarMessage()).toEqual('The action was unsuccessful. Try again or contact your IT Team.');

      expect(await browser.getTitle()).toContain('Sign in');

      await createDialog.waitForDialogToClose();
      expect(await createDialog.isDialogOpen()).not.toBe(true, 'dialog is present');
    });
  });
});
