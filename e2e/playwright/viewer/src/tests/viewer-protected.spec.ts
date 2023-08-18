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
import { ApiClientFactory, getUserState, test, TEST_FILES, Utils } from '@alfresco/playwright-shared';

test.use({ storageState: getUserState('hruser') });
test.describe('viewer file', () => {
  const apiClientFactory = new ApiClientFactory();
  const randomFolderName = `playwright-folder-${Utils.random()}`;
  const randomDocxName = `${TEST_FILES.PDF_PROTECTED.name}-${Utils.random()}`;
  let folderId: string;
  let fileDocxId: string;

  test.beforeAll(async ({ fileAction, shareAction, favoritesPageAction: favoritesPageAction }) => {
    await apiClientFactory.setUpAcaBackend('hruser');
    const node = await apiClientFactory.nodes.createNode('-my-', { name: randomFolderName, nodeType: 'cm:folder', relativePath: '/' });
    folderId = node.entry.id;
    const fileDoc = await fileAction.uploadFile(TEST_FILES.PDF_PROTECTED.path, randomDocxName, folderId);
    fileDocxId = fileDoc.entry.id;
    await shareAction.shareFileById(fileDocxId);
    await favoritesPageAction.addFavoriteById('file', fileDocxId);
  });

  test.beforeEach(async ({ personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/personal-files/${folderId}` });
    await personalFiles.dataTable.performClickFolderOrFileToOpen(randomDocxName);
  });

  test.afterAll(async () => {
    await apiClientFactory.nodes.deleteNode(folderId, { permanent: true });
  });

  test('[C268958] Password dialog appears when opening a protected file', async ({ personalFiles }) => {
    expect(await personalFiles.passwordDialog.isDialogOpen(), 'Password dialog not open').toBe(true);
    expect(await personalFiles.passwordDialog.isPasswordInputDisplayed(), 'Password input not displayed').toBe(true);
    expect(await personalFiles.passwordDialog.submitButton.isHidden(), 'Submit button not disabled').toBe(false);
    expect(await personalFiles.passwordDialog.isCloseVisible(), 'Close button not enabled').toBe(true);
    expect(await personalFiles.viewer.pdfViewerContentPages.isVisible(), 'Viewer did not close').toBe(false);
  });

  test('[C268959] File content is displayed when entering the correct password', async ({ personalFiles }) => {
    await personalFiles.passwordDialog.enterPassword(TEST_FILES.PDF_PROTECTED.password);
    expect(await personalFiles.passwordDialog.submitButton.isVisible(), 'Submit button not enabled').toBe(true);

    await personalFiles.passwordDialog.submitButton.click();
    await personalFiles.passwordDialog.waitForDialogToClose();

    expect(await personalFiles.viewer.isPdfViewerContentDisplayed(), 'file content not displayed').toBe(true);
  });

  test('[C268960] Error appears when entering an incorrect password', async ({ personalFiles }) => {
    await personalFiles.passwordDialog.enterPassword('incorrect');
    expect(await personalFiles.passwordDialog.submitButton.isVisible(), 'Submit button not enabled').toBe(true);
    await personalFiles.passwordDialog.submitButton.click();

    expect(await personalFiles.passwordDialog.getErrorMessage()).toBe('Password is wrong');
    expect(await personalFiles.viewer.isPdfViewerContentDisplayed(), 'file content is displayed').toBe(false);
  });

  test('[C268961] Refresh the page while Password dialog is open', async ({ personalFiles }) => {
    await personalFiles.passwordDialog.enterPassword(TEST_FILES.PDF_PROTECTED.password);
    await personalFiles.reload({ waitUntil: 'domcontentloaded' });
    await personalFiles.viewer.waitForViewerToOpen();

    expect(await personalFiles.viewer.isPdfViewerContentDisplayed(), 'file content is displayed').toBe(false);
    expect(await personalFiles.passwordDialog.isDialogOpen(), 'Password dialog not open').toBe(true);
  });
});
