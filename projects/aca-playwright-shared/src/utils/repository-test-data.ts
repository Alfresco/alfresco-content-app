/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { NodesApi } from '../api';
import { Utils } from './utils';

export interface RepositoryTestData {
  repoFolder: { id: string; name: string };
  repoFile: { id: string; name: string };
  personalFile: { id: string; name: string };
}

export interface RepositoryTestDataApis {
  userNodesApi: NodesApi;
  adminNodesApi: NodesApi;
}

export async function seedRepositoryTestData(apis: RepositoryTestDataApis): Promise<RepositoryTestData> {
  const { userNodesApi, adminNodesApi } = apis;

  const repoFolderName = `repo-folder-${Utils.random()}`;
  const repoFileName = `repo-file-${Utils.random()}.txt`;
  const personalFileName = `personal-file-${Utils.random()}.txt`;

  const repoFolder = (await adminNodesApi.createFolder(repoFolderName, '-root-')).entry;
  const repoFile = (await adminNodesApi.createFile(repoFileName, repoFolder.id)).entry;
  const personalFile = (await userNodesApi.createFile(personalFileName)).entry;

  return {
    repoFolder: { id: repoFolder.id, name: repoFolderName },
    repoFile: { id: repoFile.id, name: repoFileName },
    personalFile: { id: personalFile.id, name: personalFileName }
  };
}

export async function cleanupRepositoryTestData(
  testData: RepositoryTestData | undefined,
  apis: Pick<RepositoryTestDataApis, 'adminNodesApi'>
): Promise<void> {
  if (!testData) {
    return;
  }
  const { adminNodesApi } = apis;

  if (testData.personalFile?.id) {
    await adminNodesApi.deleteNodes([testData.personalFile.id], true);
  }

  if (testData.repoFolder?.id) {
    await adminNodesApi.deleteNodes([testData.repoFolder.id], true);
  }
}
