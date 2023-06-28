/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { getUserState, test, TEST_FILES } from '@alfresco/playwright-shared';

test.use({ storageState: getUserState('admin') });
test.describe('viewer file', () => {
  const randomFolderName = `playwright-folder-${(Math.random() + 1).toString(36).substring(6)}`;
  let folderId: string;

  test.beforeEach(async ({ superAdminApiClient, fileAction }) => {
    const node = await superAdminApiClient.nodes.createNode('-my-', { name: randomFolderName, nodeType: 'cm:folder', relativePath: '/' });
    folderId = node.entry.id;
    await fileAction.uploadFile(TEST_FILES.DOCX.path, TEST_FILES.DOCX.name, folderId);
  });

  test.beforeEach(async ({ personalFiles }) => {
    await personalFiles.navigate({ waitUntil: 'domcontentloaded' });
    await personalFiles.dataTable.goThroughPagesLookingForRowWithName(randomFolderName);
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomFolderName);
  });

  test.afterAll(async ({ superAdminApiClient }) => {
    await superAdminApiClient.nodes.deleteNode(folderId);
  });

  test('[] view display', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(TEST_FILES.DOCX.name);
    expect(await personalFiles.viewer.isViewerOpened()).toBe(true);
  });
});
