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

import { LoginPage, BrowsingPage } from '../../../pages/pages';
import { RepoClient } from '../../../utilities/repo-client/repo-client';
import { Utils } from '../../../utilities/utils';
import { AdminActions } from '../../../utilities/admin-actions';
import * as data from './test-data-files-folders';
import * as testUtil from '../test-util';

describe('File/folder actions : on Trash : ', () => {

  const username = `user-${Utils.random()}`;

  let fileInTrashId: string;
  let file2InTrashId: string;
  let folderInTrashId: string;
  let folder2InTrashId: string;

  const userApi = new RepoClient(username, username);

  const adminApiActions = new AdminActions();

  const loginPage = new LoginPage();
  const page = new BrowsingPage();

  beforeAll(async () => {
    await adminApiActions.createUser({ username });

    fileInTrashId = (await userApi.nodes.createFile(data.fileInTrash.name)).entry.id;
    file2InTrashId = (await userApi.nodes.createFile(data.file2InTrash.name)).entry.id;
    folderInTrashId = (await userApi.nodes.createFolder(data.folderInTrash.name)).entry.id;
    folder2InTrashId = (await userApi.nodes.createFolder(data.folder2InTrash.name)).entry.id;

    await userApi.nodes.deleteNodeById(fileInTrashId, false);
    await userApi.nodes.deleteNodeById(file2InTrashId, false);
    await userApi.nodes.deleteNodeById(folderInTrashId, false);
    await userApi.nodes.deleteNodeById(folder2InTrashId, false);

    await userApi.trashcan.waitForApi({ expect: 4 });

    await loginPage.loginWith(username);

    await page.clickTrashAndWait();
  });

  afterAll(async () => {
    await userApi.trashcan.emptyTrash();
  });

  beforeEach(async () => {
    await Utils.pressEscape();
  });

  it('on a file - [C286258]', async () => {
    await testUtil.checkToolbarPrimary(data.fileInTrash.name, data.fileInTrash.trashActions);
    await testUtil.checkContextMenu(data.fileInTrash.name, data.fileInTrash.trashActions);
  });

  it('on a folder - [C286259]', async () => {
    await testUtil.checkToolbarPrimary(data.folderInTrash.name, data.folderInTrash.trashActions);
    await testUtil.checkContextMenu(data.folderInTrash.name, data.folderInTrash.trashActions);
  });

  it('multiple files - [C280472]', async () => {
    await testUtil.checkMultipleSelContextMenu([ data.fileInTrash.name, data.file2InTrash.name ], data.trashActions);
    await testUtil.checkMultipleSelToolbarPrimary([ data.fileInTrash.name, data.file2InTrash.name ], data.trashActions);
  });

  it('multiple folders - [C280473]', async () => {
    await testUtil.checkMultipleSelContextMenu([ data.folderInTrash.name, data.folder2InTrash.name ], data.trashActions);
    await testUtil.checkMultipleSelToolbarPrimary([ data.folderInTrash.name, data.folder2InTrash.name ], data.trashActions);
  });

  it('both files and folders - [C280474]', async () => {
    await testUtil.checkMultipleSelContextMenu([ data.fileInTrash.name, data.folderInTrash.name ], data.trashActions);
    await testUtil.checkMultipleSelToolbarPrimary([ data.fileInTrash.name, data.folderInTrash.name ], data.trashActions);
  });

});
