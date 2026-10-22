/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { expect } from '@playwright/test';
import { basename } from 'path';
import {
  ApiClientFactory,
  NodesApi,
  PersonalFilesPage,
  TEST_FILES,
  TrashcanApi,
  UploadApi,
  Utils,
  VersionManagerActions,
  test
} from '@alfresco/aca-playwright-shared';

test.describe('Manage Versions - version author information', () => {
  // The display names carry the same random token as the usernames so the author
  // assertions cannot accidentally pass against a leftover or parallel-run user.
  const ownerToken = Utils.random();
  const owner = `owner-${ownerToken}`;
  const ownerFirstName = `Olivia${ownerToken}`;
  const ownerLastName = `Owner${ownerToken}`;
  const ownerDisplayName = `${ownerFirstName} ${ownerLastName}`;

  const collaboratorToken = Utils.random();
  const collaborator = `collaborator-${collaboratorToken}`;
  const collaboratorFirstName = `Carl${collaboratorToken}`;
  const collaboratorLastName = `Collaborator${collaboratorToken}`;
  const collaboratorDisplayName = `${collaboratorFirstName} ${collaboratorLastName}`;

  const parentFolder = `versions-author-${Utils.random()}`;
  const threeVersionsFile = `three-versions-${Utils.random()}.jpg`;
  const uiUploadFile = `ui-upload-${Utils.random()}.jpg`;

  let ownerNodesApi: NodesApi;
  let ownerUploadApi: UploadApi;
  let ownerTrashcanApi: TrashcanApi;
  let collaboratorUploadApi: UploadApi;
  let parentFolderId: string;

  async function openManageVersionsFor(page: PersonalFilesPage, fileName: string): Promise<void> {
    await page.navigate({ remoteUrl: `#/personal-files/${parentFolderId}` });
    await VersionManagerActions.openManageVersionsFromList(page, fileName);
  }

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username: owner, firstName: ownerFirstName, lastName: ownerLastName });
      await apiClientFactory.createUser({ username: collaborator, firstName: collaboratorFirstName, lastName: collaboratorLastName });

      ownerNodesApi = await NodesApi.initialize(owner, owner);
      ownerUploadApi = await UploadApi.initialize(owner, owner);
      ownerTrashcanApi = await TrashcanApi.initialize(owner, owner);
      collaboratorUploadApi = await UploadApi.initialize(collaborator, collaborator);

      parentFolderId = (await ownerNodesApi.createFolder(parentFolder)).entry.id;
      // A new version is uploaded into the parent folder, so the collaborator needs
      // write access on the folder itself, not just on the individual files.
      await ownerNodesApi.setGranularPermission(parentFolderId, collaborator, 'Collaborator', true);

      await ownerUploadApi.uploadFileWithRename(TEST_FILES.JPG_FILE.path, uiUploadFile, parentFolderId);

      // Versions 1.0 and 3.0 created by the owner, version 2.0 by the collaborator.
      const threeVersionsFileId = (await ownerUploadApi.uploadFileWithRename(TEST_FILES.JPG_FILE.path, threeVersionsFile, parentFolderId)).entry.id;
      await collaboratorUploadApi.uploadNewVersionFile(
        threeVersionsFileId,
        TEST_FILES.JPG_FILE.path,
        threeVersionsFile,
        true,
        'second version by collaborator'
      );
      await ownerUploadApi.uploadNewVersionFile(threeVersionsFileId, TEST_FILES.JPG_FILE.path, threeVersionsFile, true, 'third version by owner');
    } catch (error) {
      console.error(`beforeAll failed: ${Utils.extractErrorMessage(error)}`);
      throw error;
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, owner, owner, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(ownerNodesApi, ownerTrashcanApi, 'afterAll failed');
  });

  test('[XAT-20509] Author information stays correct when authors alternate across versions', async ({ personalFiles }) => {
    await openManageVersionsFor(personalFiles, threeVersionsFile);

    await expect(personalFiles.manageVersionsDialog.versionList.rows, 'Unexpected number of versions listed').toHaveCount(3);
    await expect(personalFiles.manageVersionsDialog.versionModifiedBy('1.0'), 'Version 1.0 has the wrong author').toHaveText(ownerDisplayName);
    await expect(personalFiles.manageVersionsDialog.versionModifiedBy('2.0'), 'Version 2.0 has the wrong author').toHaveText(collaboratorDisplayName);
    await expect(personalFiles.manageVersionsDialog.versionModifiedBy('3.0'), 'Version 3.0 has the wrong author').toHaveText(ownerDisplayName);
  });

  test('[XAT-20508] New version uploaded through the UI is attributed to the uploading user', async ({ personalFiles }) => {
    // Uploading a new version renames the node to the name of the uploaded file.
    const renamedFile = basename(TEST_FILES.JPG_FILE.path);

    await personalFiles.navigate({ remoteUrl: `#/personal-files/${parentFolderId}` });
    await VersionManagerActions.uploadNewVersion(personalFiles, uiUploadFile, TEST_FILES.JPG_FILE.path, { comment: 'version uploaded by owner' });

    // The document list is still re-rendering right after the upload, so reload it
    // to get a settled list before selecting the file again.
    await openManageVersionsFor(personalFiles, renamedFile);

    await expect(personalFiles.manageVersionsDialog.versionLabel('1.1'), 'New version 1.1 is not listed').toBeVisible();
    await expect(personalFiles.manageVersionsDialog.versionModifiedBy('1.1'), 'New version has the wrong author').toHaveText(ownerDisplayName);
  });
});
