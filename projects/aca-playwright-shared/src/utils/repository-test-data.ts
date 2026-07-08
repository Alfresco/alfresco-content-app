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

import { Site } from '@alfresco/js-api';
import { NodesApi, SitesApi } from '../api';
import { Utils } from './utils';

export interface RepositoryTestData {
  repoFolder: { id: string; name: string };
  repoFile: { id: string; name: string };
  personalFile: { id: string; name: string };
  site?: { id: string; docLibId: string };
  siteFile?: { id: string; name: string };
}

export interface SeedRepositoryTestDataOptions {
  withSite?: boolean;
  prefix?: string;
}

export interface RepositoryTestDataApis {
  userNodesApi: NodesApi;
  adminNodesApi: NodesApi;
  userSitesApi?: SitesApi;
}

export async function seedRepositoryTestData(apis: RepositoryTestDataApis, opts: SeedRepositoryTestDataOptions = {}): Promise<RepositoryTestData> {
  const { userNodesApi, adminNodesApi, userSitesApi } = apis;
  const { withSite = false, prefix = '' } = opts;

  const suffix = () => `${prefix}${Utils.random()}`;

  const repoFolderName = `repo-folder-${suffix()}`;
  const repoFileName = `repo-file-${suffix()}.txt`;
  const personalFileName = `personal-file-${suffix()}.txt`;

  const repoFolder = (await adminNodesApi.createFolder(repoFolderName, '-root-')).entry;
  const repoFile = (await adminNodesApi.createFile(repoFileName, repoFolder.id)).entry;
  const personalFile = (await userNodesApi.createFile(personalFileName)).entry;

  const testData: RepositoryTestData = {
    repoFolder: { id: repoFolder.id, name: repoFolderName },
    repoFile: { id: repoFile.id, name: repoFileName },
    personalFile: { id: personalFile.id, name: personalFileName }
  };

  if (withSite) {
    if (!userSitesApi) {
      throw new Error('seedRepositoryTestData: `userSitesApi` is required when `withSite` is true.');
    }
    const siteName = `repo-site-${suffix()}`;
    const siteFileName = `site-file-${suffix()}.txt`;
    const siteId = (await userSitesApi.createSite(siteName, Site.VisibilityEnum.PUBLIC)).entry.id;
    const docLibId = await userSitesApi.getDocLibId(siteId);
    const siteFile = (await userNodesApi.createFile(siteFileName, docLibId)).entry;

    testData.site = { id: siteId, docLibId };
    testData.siteFile = { id: siteFile.id, name: siteFileName };
  }

  return testData;
}

export async function cleanupRepositoryTestData(
  testData: RepositoryTestData | undefined,
  apis: Pick<RepositoryTestDataApis, 'adminNodesApi' | 'userSitesApi'>
): Promise<void> {
  if (!testData) {
    return;
  }
  const { adminNodesApi, userSitesApi } = apis;

  if (testData.repoFolder?.id) {
    try {
      await adminNodesApi.deleteNodes([testData.repoFolder.id], true);
    } catch (error) {
      console.error(`cleanupRepositoryTestData: failed to delete repoFolder ${testData.repoFolder.name}: ${error}`);
    }
  }

  if (testData.personalFile?.id) {
    try {
      await adminNodesApi.deleteNodes([testData.personalFile.id], true);
    } catch (error) {
      console.error(`cleanupRepositoryTestData: failed to delete personalFile ${testData.personalFile.name}: ${error}`);
    }
  }

  if (testData.site?.id && userSitesApi) {
    try {
      await userSitesApi.deleteSites([testData.site.id]);
    } catch (error) {
      console.error(`cleanupRepositoryTestData: failed to delete site ${testData.site.id}: ${error}`);
    }
  }
}
