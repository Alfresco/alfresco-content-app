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

import { ApiClientFactory, NodesApi, test, timeouts, Utils, SharedLinksApi } from '@alfresco/playwright-shared';
import { expect } from '@playwright/test';

test.describe('Share a file', () => {
  const random = Utils.random();

  const username = `user-${random}`;
  const parent = `parent-${random}`;
  let parentId: string;

  const file3 = `file3-${random}.txt`;
  const file4 = `file4-${random}.txt`;
  const file5 = `file5-${random}.txt`;
  const file6 = `file6-${random}.txt`;
  const file7 = `file7-${random}.txt`;
  const file8 = `file8-${random}.txt`;
  const file9 = `file9-${random}.txt`;

  const shareLinkPreUrl = `/#/preview/s/`;

  const apiClientFactory = new ApiClientFactory();

  test.beforeAll(async () => {
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
    const nodesApi = await NodesApi.initialize(username, username);

    parentId = (await nodesApi.createFolder(parent)).entry.id;
  });

  test.afterAll(async () => {
    await apiClientFactory.nodes.deleteNodes([parentId]);
  });

  test.describe('when logged out', () => {
    let file6SharedLink: string;
    let file6Id: string;

    test.beforeAll(async () => {
      const nodesApi = await NodesApi.initialize(username, username);
      const shareApi = await SharedLinksApi.initialize(username, username);

      file6Id = (await nodesApi.createFile(file6, parentId))?.entry.id;

      const sharedId = (await shareApi.shareFileById(file6Id)).entry.id;
      file6SharedLink = `${shareLinkPreUrl}${sharedId}`;
      await shareApi.waitForFilesToBeShared([file6Id]);
    });

    test.afterAll(async () => {
      await apiClientFactory.nodes.deleteNodes([file6Id]);
    });

    test('[C286326] A non-logged user can download the shared file from the viewer', async ({ personalFiles, page }) => {
      await page.goto(file6SharedLink);
      await personalFiles.viewer.waitForViewerToOpen();

      const downloadPromise = personalFiles.page.waitForEvent('download');
      await personalFiles.viewer.toolbar.sharedDownloadButton.click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe(file6);
    });
  });

  test.describe('when logged in', () => {
    const expiryDateObj = new Date();
    expiryDateObj.setFullYear(expiryDateObj.getFullYear() + 1);
    const expiryDate: any = expiryDateObj.toISOString().replace('Z', '+0000');

    test.describe('from Personal Files', () => {
      let file3Id: string;
      let file4Id: string;
      let file5Id: string;
      let file6Id: string;
      let file7Id: string;
      let file8Id: string;
      let file9Id: string;

      test.beforeAll(async () => {
        test.setTimeout(timeouts.extendedTest);
        const nodesApi = await NodesApi.initialize(username, username);
        const shareApi = await SharedLinksApi.initialize(username, username);

        file3Id = (await nodesApi.createFile(file3, parentId))?.entry.id;
        file4Id = (await nodesApi.createFile(file4, parentId))?.entry.id;
        file5Id = (await nodesApi.createFile(file5, parentId))?.entry.id;
        file6Id = (await nodesApi.createFile(file6, parentId))?.entry.id;
        file7Id = (await nodesApi.createFile(file7, parentId))?.entry.id;
        file8Id = (await nodesApi.createFile(file8, parentId))?.entry.id;
        file9Id = (await nodesApi.createFile(file9, parentId))?.entry.id;

        await shareApi.shareFilesByIds([file6Id, file7Id], expiryDate);
        await shareApi.waitForFilesToBeShared([file6Id, file7Id]);
      });

      test.beforeEach(async ({ loginPage, personalFiles, page }) => {
        await loginPage.navigate();
        await loginPage.loginUser({ username: username, password: username });

        await personalFiles.waitForPageLoad();
        await personalFiles.dataTable.getCellByColumnNameAndRowItem(parent, 'Size').dblclick();
        await page.waitForTimeout(timeouts.tiny);
      });

      test.afterAll(async () => {
        const nodesApi = await NodesApi.initialize(username, username);
        await nodesApi.deleteNodes([file3Id, file4Id, file5Id, file6Id, file7Id, file8Id, file9Id]);
      });

      test('[C286327] Share dialog default values', async ({ personalFiles }) => {
        expect(await personalFiles.dataTable.performActionFromExpandableMenu(file3, 'Share'));
        const labels = await personalFiles.shareDialog.getLabels();
        expect(await personalFiles.shareDialog.getDialogTitle()).toEqual(`Share ${file3}`);
        expect(labels[0].trim()).toBe(`Share ${file3}`);
        expect(await personalFiles.shareDialog.getInfoText()).toEqual('Share Link');
        expect(await personalFiles.shareDialog.getLinkUrl()).toContain(shareLinkPreUrl);
        expect(await personalFiles.shareDialog.isUrlReadOnly()).toBe(true);
        expect(await personalFiles.shareDialog.isShareToggleChecked()).toBe(true);
        expect(labels[1].trim()).toBe('Link Expiry Date');
        expect(await personalFiles.shareDialog.isExpireToggleEnabled()).toBe(false);
        expect(await personalFiles.shareDialog.isCloseEnabled()).toBe(true);
      });

      test('[C286329] Share a file', async ({ personalFiles, nodesApiAction }) => {
        expect(await personalFiles.dataTable.performActionFromExpandableMenu(file3, 'Share'));

        const url = await personalFiles.shareDialog.getLinkUrl();
        await personalFiles.shareDialog.clickClose();

        const sharedId = await nodesApiAction.getSharedId(file3Id);
        expect(url).toContain(sharedId);
      });

      test('[C286330] Copy shared file URL', async ({ personalFiles, page }) => {
        expect(await personalFiles.dataTable.performActionFromExpandableMenu(file4, 'Share'));

        const url = await personalFiles.shareDialog.getLinkUrl();
        expect(url).toContain(shareLinkPreUrl);

        await personalFiles.shareDialog.urlAction.click();

        const shareSnackBar = personalFiles.snackBar;
        await expect(shareSnackBar.getByMessageLocator('Link copied to the clipboard')).toBeVisible();

        await page.goto(url);
        await personalFiles.viewer.waitForViewerToOpen();

        const downloadPromise = personalFiles.page.waitForEvent('download');
        await personalFiles.viewer.toolbar.sharedDownloadButton.click();

        const download = await downloadPromise;
        expect(download.suggestedFilename()).toBe(file4);
      });

      test('[C286332] Share a file with expiration date', async ({ personalFiles, nodesApiAction, page }) => {
        expect(await personalFiles.dataTable.performActionFromExpandableMenu(file5, 'Share'));

        await personalFiles.shareDialog.expireToggle.click();
        expect(await personalFiles.shareDialog.isExpireToggleEnabled()).toBe(true);

        await personalFiles.shareDialog.datetimePickerButton.click();
        expect(await personalFiles.shareDialog.dateTimePicker.isCalendarOpen()).toBe(true);

        await personalFiles.shareDialog.dateTimePicker.pickDateTime();

        const inputDate = await personalFiles.shareDialog.getExpireDate();

        await page.waitForTimeout(timeouts.normal);
        const expireDateProperty = await nodesApiAction.getSharedExpiryDate(file5Id);

        expect(Utils.formatDate(expireDateProperty)).toEqual(Utils.formatDate(inputDate));
      });

      test('[C286337] Expire date is displayed correctly', async ({ personalFiles, nodesApiAction }) => {
        expect(await personalFiles.dataTable.performActionFromExpandableMenu(file6, 'Share'));
        const expireProperty = await nodesApiAction.getSharedExpiryDate(file6Id);

        expect(expireProperty).toEqual(expiryDate);
        expect(await personalFiles.shareDialog.isExpireToggleEnabled()).toBe(true);
        expect(Utils.formatDate(await personalFiles.shareDialog.getExpireDate())).toEqual(Utils.formatDate(expiryDate));
      });

      test('[C286333] Disable the share link expiration', async ({ personalFiles, nodesApiAction, page }) => {
        expect(await personalFiles.dataTable.performActionFromExpandableMenu(file7, 'Share'));

        expect(await personalFiles.shareDialog.isExpireToggleEnabled()).toBe(true);
        expect(await personalFiles.shareDialog.getExpireDate()).not.toBe('');

        await personalFiles.shareDialog.expireToggle.click();
        expect(await personalFiles.shareDialog.isExpireToggleEnabled()).toBe(false);

        await page.waitForTimeout(timeouts.tiny);
        await personalFiles.shareDialog.clickClose();
        expect(await nodesApiAction.getSharedExpiryDate(file7Id)).toBe('');
      });

      test('[C286335] Shared file URL is not changed when Share dialog is closed and opened again', async ({ personalFiles }) => {
        expect(await personalFiles.dataTable.performActionFromExpandableMenu(file8, 'Share'));

        const url1 = await personalFiles.shareDialog.getLinkUrl();
        await personalFiles.shareDialog.clickClose();

        await personalFiles.dataTable.selectItem(file8);
        await personalFiles.acaHeader.shareButton.click();
        const url2 = await personalFiles.shareDialog.getLinkUrl();

        expect(url1).toEqual(url2);
      });

      test('[C286345] Share a file from the context menu', async ({ personalFiles, nodesApiAction }) => {
        expect(await personalFiles.dataTable.performActionFromExpandableMenu(file9, 'Share'));

        const url = await personalFiles.shareDialog.getLinkUrl();
        await personalFiles.shareDialog.clickClose();

        const sharedId = await nodesApiAction.getSharedId(file9Id);
        expect(await nodesApiAction.isFileShared(file9Id)).toBe(true);
        expect(url).toContain(sharedId);
      });
    });
  });
});
