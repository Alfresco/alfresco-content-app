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
import { getUserState, test } from '@alfresco/playwright-shared';

test.use({ storageState: getUserState('hruser') });
test.describe('Create actions', () => {
  let randomFolderName: string;

  test.beforeEach(async ({ personalFiles }) => {
    randomFolderName = `playwright-folder-${(Math.random() + 1).toString(36).substring(6)}`;
    await personalFiles.navigate();
  });

  test.afterEach(async ({ personalFiles }) => {
    await personalFiles.dataTable.performActionFromExpandableMenu(randomFolderName, 'Delete');
  });

  test('[C216341] Create a folder with name only', async ({ personalFiles }) => {
    await personalFiles.acaHeader.createButton.click();
    await personalFiles.matMenu.createFolder.click();
    await personalFiles.folderDialog.folderNameInputLocator.fill(randomFolderName);
    await personalFiles.folderDialog.createButton.click();

    await personalFiles.dataTable.goThroughPagesLookingForRowWithName(randomFolderName);
    await expect(personalFiles.dataTable.getRowByName(randomFolderName)).toBeVisible();
  });
});