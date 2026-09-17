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

import { MyLibrariesPage, Utils, FavoritesPage, SharedPage, SearchPage } from '@alfresco/aca-playwright-shared';
import { expect } from '@playwright/test';

export async function checkActionsAvailable(
  pageContext: MyLibrariesPage | FavoritesPage | SharedPage | SearchPage,
  item: string,
  expectedToolbarPrimary: string[],
  expectedToolbarMore: string[]
): Promise<void> {
  await pageContext.dataTable.selectItems(item);
  if (expectedToolbarMore.includes('Remove Favorite') && pageContext instanceof FavoritesPage) {
    await Utils.waitForApiResponse(pageContext, 'favorites', 200);
  }
  await pageContext.acaHeader.verifyToolbarPrimaryActions(expectedToolbarPrimary);
  await pageContext.acaHeader.clickMoreActions();
  await pageContext.matMenu.verifyActualMoreActions(expectedToolbarMore, async () => {
    await pageContext.page.keyboard.press('Escape');
    if (await pageContext.dataTable.isRowSelected(item)) {
      await pageContext.dataTable.getCheckboxForElement(item).click();
    }
    await pageContext.dataTable.selectItems(item);
    await pageContext.acaHeader.clickMoreActions();
  });
}

export async function checkActionsViewerAvailable(
  pageContext: MyLibrariesPage | FavoritesPage | SharedPage | SearchPage,
  item: string,
  expectedToolbarPrimary: string[],
  expectedToolbarMore: string[]
): Promise<void> {
  await pageContext.dataTable.performClickFolderOrFileToOpen(item);
  expect(await pageContext.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
  await pageContext.viewer.verifyViewerPrimaryActions(expectedToolbarPrimary);
  await pageContext.viewer.toolbar.clickMoreActions();
  await pageContext.matMenu.verifyActualMoreActions(expectedToolbarMore);
}
