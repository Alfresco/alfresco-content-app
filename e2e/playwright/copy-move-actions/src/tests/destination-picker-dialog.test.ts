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

import { ApiClientFactory, getUserState, test, Utils } from '@alfresco/playwright-shared';
import { expect } from '@playwright/test';

test.use({ storageState: getUserState('hruser') });
test.describe('Copy Move actions', () => {
  const apiClientFactory = new ApiClientFactory();
  const random = Utils.random();

  const file = `file-${random}.txt`;
  let fileId: string;
  // let destinationId: string;

  test.beforeAll(async () => {
    await apiClientFactory.setUpAcaBackend('hruser');
    fileId = (await apiClientFactory.nodes.createNode('-my-', { name: file, nodeType: 'cm:content' })).entry.id;
    // destinationId = (await apiClientFactory.nodes.createFolder(destination)).entry.id;
  });

  test.afterAll(async () => {
    await apiClientFactory.nodes.deleteNode(fileId);
  });

  test.describe('general', () => {
    test.beforeEach(async ({ personalFiles }) => {
      await personalFiles.navigate();
      await personalFiles.dataTable.selectItem(file);
      await personalFiles.clickMoreActionsButton('Copy');
    });

    test('[C263875] Dialog UI', async ({ personalFiles }) => {
      expect(await personalFiles.contentNodeSelector.getDialogTitle()).toEqual(`Copy '${file}' to...`);
      expect(await personalFiles.contentNodeSelector.searchInput.isVisible()).toBe(true);
      expect(await personalFiles.contentNodeSelector.locationDropDown.isVisible()).toBe(true);
      await expect(await personalFiles.contentNodeSelector.getBreadcrumb('Personal Files')).toBeVisible();
      expect(await personalFiles.contentNodeSelector.actionButton.isEnabled()).toBe(true);
      expect(await personalFiles.contentNodeSelector.cancelButton.isEnabled()).toBe(true);
    });
  });
});
