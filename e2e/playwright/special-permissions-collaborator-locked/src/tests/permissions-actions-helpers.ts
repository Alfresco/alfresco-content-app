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

import { MyLibrariesPage, Utils } from '@alfresco/aca-playwright-shared';
import { expect } from '@playwright/test';

export async function checkActionsAvailable(
  myLibrariesPage: MyLibrariesPage,
  item: string,
  expectedToolbarPrimary: string[],
  expectedToolbarMore: string[]
): Promise<void> {
  await myLibrariesPage.dataTable.selectItems(item);
  if (expectedToolbarMore.includes('Remove Favorite')) {
    await Utils.waitForApiResponse(myLibrariesPage, 'favorites', 200);
  }
  await myLibrariesPage.acaHeader.verifyToolbarPrimaryActions(expectedToolbarPrimary);
  await myLibrariesPage.acaHeader.clickMoreActions();
  await myLibrariesPage.matMenu.verifyActualMoreActions(expectedToolbarMore, async () => {
    await myLibrariesPage.page.keyboard.press('Escape');
    if (await myLibrariesPage.dataTable.isRowSelected(item)) {
      await myLibrariesPage.dataTable.getCheckboxForElement(item).click();
    }
    await myLibrariesPage.dataTable.selectItems(item);
    await myLibrariesPage.acaHeader.clickMoreActions();
  });
}

export async function checkActionsViewerAvailable(
  myLibrariesPage: MyLibrariesPage,
  item: string,
  expectedToolbarPrimary: string[],
  expectedToolbarMore: string[]
): Promise<void> {
  await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(item);
  expect(await myLibrariesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
  await myLibrariesPage.viewer.verifyViewerPrimaryActions(expectedToolbarPrimary);
  await myLibrariesPage.viewer.toolbar.clickMoreActions();
  await myLibrariesPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
}
