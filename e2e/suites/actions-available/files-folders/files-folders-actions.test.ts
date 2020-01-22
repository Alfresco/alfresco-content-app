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

import { RepoClient } from '../../../utilities/repo-client/repo-client';
import { Utils } from '../../../utilities/utils';
import { AdminActions } from '../../../utilities/admin-actions';
import { LoginPage } from '../../../pages/pages';
import { FILES } from '../../../configs';
import * as testData from './test-data';
import { personalFilesTests } from './personal-files';
import { recentFilesTests } from './recent-files';
import { favoritesTests } from './favorites';
import { searchResultsTests } from './search-results';
import { sharedFilesTests } from './shared-files';
import { viewerTests } from './viewer';
import { trashTests } from './trash';

describe('Files / folders actions : ', () => {
  const random = Utils.random();

  const username = `user-${random}`

  const parent = `parent-${random}`;

  let parentId: string;
  let fileDocxFavId: string;
  let fileFavId: string;
  let fileDocxSharedId: string;
  let fileDocxSharedFavId: string;
  let fileSharedId: string;
  let fileSharedFavId: string;
  let fileLockedId: string;
  let fileFavLockedId: string;
  let fileSharedLockedId: string;
  let fileSharedFavLockedId: string;
  let folderFavId: string;
  let folderFav2Id: string;
  let fileInTrashId: string;
  let file2InTrashId: string;
  let folderInTrashId: string;
  let folder2InTrashId: string;

  const userApi = new RepoClient(username, username);
  const adminApiActions = new AdminActions();

  const loginPage = new LoginPage();

  beforeAll(async () => {
    await adminApiActions.createUser({ username });

    parentId = (await userApi.nodes.createFolder(parent)).entry.id;

    await userApi.upload.uploadFileWithRename(FILES.docxFile, parentId, testData.fileDocx.name );
    fileDocxFavId = (await userApi.upload.uploadFileWithRename(FILES.docxFile, parentId, testData.fileDocxFav.name)).entry.id;
    await userApi.nodes.createFile(testData.file.name, parentId);
    fileFavId = (await userApi.nodes.createFile(testData.fileFav.name, parentId)).entry.id;
    fileDocxSharedId = (await userApi.upload.uploadFileWithRename(FILES.docxFile, parentId, testData.fileDocxShared.name)).entry.id;
    fileDocxSharedFavId = (await userApi.upload.uploadFileWithRename(FILES.docxFile, parentId, testData.fileDocxSharedFav.name)).entry.id;
    fileSharedId = (await userApi.nodes.createFile(testData.fileShared.name, parentId)).entry.id;
    fileSharedFavId = (await userApi.nodes.createFile(testData.fileSharedFav.name, parentId)).entry.id;
    fileLockedId = (await userApi.nodes.createFile(testData.fileLocked.name, parentId)).entry.id;
    fileFavLockedId = (await userApi.nodes.createFile(testData.fileFavLocked.name, parentId)).entry.id;
    fileSharedLockedId = (await userApi.nodes.createFile(testData.fileSharedLocked.name, parentId)).entry.id;
    fileSharedFavLockedId = (await userApi.nodes.createFile(testData.fileSharedFavLocked.name, parentId)).entry.id;

    await userApi.nodes.createFolder(testData.folder.name, parentId);
    folderFavId = (await userApi.nodes.createFolder(testData.folderFav.name, parentId)).entry.id;
    folderFav2Id = (await userApi.nodes.createFolder(testData.folderFav2.name, parentId)).entry.id;

    await userApi.favorites.addFavoritesByIds('folder', [folderFavId, folderFav2Id]);

    await userApi.favorites.addFavoritesByIds('file', [
      fileDocxFavId,
      fileFavId,
      fileDocxSharedFavId,
      fileSharedFavId,
      fileFavLockedId,
      fileSharedFavLockedId
    ]);

    await userApi.shared.shareFilesByIds([
      fileDocxSharedId,
      fileDocxSharedFavId,
      fileSharedId,
      fileSharedFavId,
      fileSharedLockedId,
      fileSharedFavLockedId
    ]);

    await userApi.nodes.lockFile(fileLockedId);
    await userApi.nodes.lockFile(fileFavLockedId);
    await userApi.nodes.lockFile(fileSharedLockedId);
    await userApi.nodes.lockFile(fileSharedFavLockedId);

    fileInTrashId = (await userApi.nodes.createFile(testData.fileInTrash.name)).entry.id;
    file2InTrashId = (await userApi.nodes.createFile(testData.file2InTrash.name)).entry.id;
    folderInTrashId = (await userApi.nodes.createFolder(testData.folderInTrash.name)).entry.id;
    folder2InTrashId = (await userApi.nodes.createFolder(testData.folder2InTrash.name)).entry.id;

    await userApi.nodes.deleteNodeById(fileInTrashId, false);
    await userApi.nodes.deleteNodeById(file2InTrashId, false);
    await userApi.nodes.deleteNodeById(folderInTrashId, false);
    await userApi.nodes.deleteNodeById(folder2InTrashId, false);

    await Promise.all([
      userApi.favorites.waitForApi({ expect: 8 }),
      userApi.shared.waitForApi({ expect: 6 }),
      userApi.search.waitForApi(username, { expect: 12 }),
      userApi.trashcan.waitForApi({ expect: 4 })
    ]);

    await loginPage.loginWith(username);
  });

  afterAll(async () => {
    await userApi.nodes.deleteNodeById(parentId);
    await userApi.trashcan.emptyTrash();
  });

  beforeEach(async () => {
    await Utils.pressEscape();
  });

  describe('on Personal Files : ', () => {
    personalFilesTests(parent);
  });

  describe('on Recent Files : ', () => {
    recentFilesTests();
  });

  describe('on Favorites : ', () => {
    favoritesTests();
  });

  describe('on Search Results : ', () => {
    searchResultsTests();
  });

  describe('on Shared Files : ', () => {
    sharedFilesTests();
  });

  describe('on Viewer : ', () => {
    viewerTests(parent);
  });

  describe('on Trash : ', () => {
    trashTests();
  });

});
