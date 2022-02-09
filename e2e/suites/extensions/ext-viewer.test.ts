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

import { AdminActions, LoginPage, BrowsingPage, Viewer, RepoClient, EXTENSIBILITY_CONFIGS, FILES, Utils } from '@alfresco/aca-testing-shared';
import { BrowserActions } from '@alfresco/adf-testing';

describe('Extensions - Viewer', () => {
  const username = `user-${Utils.random()}`;

  const pdfFile = {
    fileName: FILES.pdfFile,
    component: 'app.components.tabs.metadata'
  };
  let pdfFileId: string;

  const docxFile = {
    fileName: FILES.docxFile,
    component: 'app.components.tabs.comments'
  };
  let docxFileId: string;

  const customAction = {
    id: 'app.viewer.my-action',
    title: 'My action',
    icon: 'http'
  };

  const customSecondaryAction = {
    id: 'app.viewer.my-secondary-action',
    title: 'My secondary action',
    icon: 'alarm'
  };

  const downloadButton = {
    id: 'app.viewer.download',
    title: 'My custom title'
  };

  const moveAction = {
    id: 'app.viewer.move',
    title: 'My new title'
  };

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();

  const viewer = new Viewer();
  const { toolbar } = viewer;
  const adminApiActions = new AdminActions();

  beforeAll(async (done) => {
    await adminApiActions.createUser({ username });
    pdfFileId = (await apis.user.upload.uploadFile(pdfFile.fileName)).entry.id;
    docxFileId = (await apis.user.upload.uploadFile(docxFile.fileName)).entry.id;

    await loginPage.load();
    await Utils.setSessionStorageFromConfig(EXTENSIBILITY_CONFIGS.VIEWER);
    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodesById([pdfFileId, docxFileId]);
    done();
  });

  beforeEach(async (done) => {
    await page.clickPersonalFilesAndWait();
    done();
  });

  afterEach(async (done) => {
    await Utils.pressEscape();
    done();
  });

  describe('content', () => {
    it('[C284659] Insert new component in a content viewer', async () => {
      await page.dataTable.doubleClickOnRowByName(pdfFile.fileName);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
      expect(await viewer.isCustomContentPresent()).toBe(true, 'Custom content is not present');
      expect(await viewer.getComponentIdOfView()).toEqual(pdfFile.component);
      await BrowserActions.click(viewer.closeButton);

      await page.dataTable.doubleClickOnRowByName(docxFile.fileName);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
      expect(await viewer.isCustomContentPresent()).toBe(true, 'Custom content is not present');
      expect(await viewer.getComponentIdOfView()).toEqual(docxFile.component);
    });
  });

  describe('toolbar actions', () => {
    it('[C286416] Add a new action in the toolbar', async () => {
      await page.dataTable.doubleClickOnRowByName(pdfFile.fileName);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      expect(await toolbar.isButtonPresent(customAction.title)).toBe(true, 'Custom action is not present');
      expect(await BrowserActions.getAttribute(toolbar.getButtonByTitleAttribute(customAction.title), 'id')).toEqual(customAction.id);
      expect(await toolbar.getButtonByTitleAttribute(customAction.title).getText()).toEqual(customAction.icon);
    });

    it('[C286417] Modify title of action from toolbar', async () => {
      await page.dataTable.doubleClickOnRowByName(pdfFile.fileName);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      expect(await BrowserActions.getAttribute(toolbar.getButtonById(downloadButton.id), 'title')).toEqual(downloadButton.title);
    });

    it('[C286419] Remove action from toolbar', async () => {
      await page.dataTable.doubleClickOnRowByName(pdfFile.fileName);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      expect(await toolbar.isPrintPresent()).toBe(false, 'Print button is still displayed');
    });
  });

  describe('toolbar More actions menu', () => {
    it('[C286420] Add a new action', async () => {
      await page.dataTable.doubleClickOnRowByName(pdfFile.fileName);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent(customSecondaryAction.title)).toBe(true, 'action is not present');
      expect(await toolbar.menu.getItemIconText(customSecondaryAction.title)).toEqual(customSecondaryAction.icon);
      expect(await toolbar.menu.getItemIdAttribute(customSecondaryAction.title)).toEqual(customSecondaryAction.id);
    });

    it('[C286421] Modify title of action from More actions menu', async () => {
      await page.dataTable.doubleClickOnRowByName(pdfFile.fileName);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      expect(await BrowserActions.getAttribute(toolbar.menu.getItemById(moveAction.id), 'title')).toEqual(moveAction.title);
    });

    it('[C286423] Remove action from More actions menu', async () => {
      await page.dataTable.doubleClickOnRowByName(pdfFile.fileName);
      expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

      await toolbar.openMoreMenu();
      expect(await toolbar.menu.managePermissionsAction.isPresent()).toBe(false, 'Action is still displayed');
    });
  });
});
