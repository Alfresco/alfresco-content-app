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

import { expect, Page } from '@playwright/test';
import {
  ActionType,
  ApiClientFactory,
  test,
  Utils,
  TrashcanApi,
  NodesApi,
  MimeType,
  FileActionsApi,
  TEST_FILES,
  PersonalFilesPage,
  NodesPage,
  timeouts,
  TestFileConfig
} from '@alfresco/aca-playwright-shared';

function generateUniqueFiles(testFiles: Array<TestFileConfig>): Array<TestFileConfig> {
  return testFiles.map((file) => ({ path: file.path, name: `${file.name}-${Utils.random()}` }));
}

async function setupTransformationTest(
  context: { personalFiles: PersonalFilesPage; nodesPage: NodesPage },
  config: {
    nodesApi: NodesApi;
    testString: string;
    parentFolderName: string;
    destinationFolderName: string;
    mimeType: MimeType;
  }
): Promise<string> {
  const { personalFiles, nodesPage } = context;
  const { nodesApi, testString, parentFolderName, destinationFolderName, mimeType } = config;

  const parentFolderId = (await nodesApi.createFolder(parentFolderName)).entry.id;
  await nodesApi.createFolder(destinationFolderName);

  await personalFiles.navigate({ remoteUrl: `#/nodes/${parentFolderId}/rules` });
  await nodesPage.toolbar.clickCreateRuleButton();
  await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(testString);
  await nodesPage.manageRulesDialog.ruleDescriptionInputLocator.fill(testString);
  await nodesPage.actionsDropdown.selectAction(ActionType.TransformAndCopyContent, 0);
  await nodesPage.actionsDropdown.selectMimeType(mimeType, 0);
  await nodesPage.actionsDropdown.selectDestinationFolderTransformAndCopyContent(0, destinationFolderName);
  await nodesPage.manageRulesDialog.createRuleButton.click();
  await expect(nodesPage.manageRules.getGroupsList(testString)).toBeVisible();
  return parentFolderId;
}

async function triggerTransformation(config: {
  fileActionApi: FileActionsApi;
  files: Array<TestFileConfig>;
  parentFolderId: string;
  page: Page;
}): Promise<void> {
  const { fileActionApi, files, parentFolderId, page } = config;
  for (const file of files) {
    await fileActionApi.uploadFile(file.path, file.name, parentFolderId);
  }
  await page.waitForTimeout(timeouts.medium);
}

async function verifyTransformation(
  context: { personalFiles: PersonalFilesPage },
  config: {
    destinationFolderName: string;
    files: Array<TestFileConfig>;
    expectedExtension: string;
  }
): Promise<void> {
  const { personalFiles } = context;
  const { destinationFolderName, files, expectedExtension } = config;

  await personalFiles.navigate();
  await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolderName);
  await personalFiles.spinner.waitForReload();
  for (const file of files) {
    const transformedFileName = `${file.name}.${expectedExtension}`;
    const exists = await personalFiles.dataTable.isItemPresent(transformedFileName);
    expect(exists, `Transformed file ${transformedFileName} was not present in data table`).toBe(true);
  }
}

test.use({ launchOptions: { slowMo: 300 } });

test.describe('Folder Rules Actions', () => {
  const apiClientFactory = new ApiClientFactory();
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let fileActionApi: FileActionsApi;
  const username = `user-e2e-${Utils.random()}`;
  const testString = '"!@£$%^&*()_+{}|:""?&gt;&lt;,/.\';][=-`~"';

  test.beforeAll(async () => {
    try {
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      fileActionApi = await FileActionsApi.initialize(username, username);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[XAT-8050] Supported types transformation to PDF', async ({ personalFiles, nodesPage }) => {
    const parentFolderName = `parent-pdf-${Utils.random()}`;
    const destinationFolderName = `TO_PDF-${Utils.random()}`;
    const files = generateUniqueFiles([TEST_FILES.DOCX, TEST_FILES.XLSX, TEST_FILES.PPTX_FILE]);

    const parentFolderId = await setupTransformationTest(
      { personalFiles, nodesPage },
      { nodesApi, testString, parentFolderName, destinationFolderName, mimeType: MimeType.AdobePDFDocument }
    );

    await triggerTransformation({ fileActionApi, files, parentFolderId, page: personalFiles.page });
    await verifyTransformation({ personalFiles }, { destinationFolderName, files, expectedExtension: 'pdf' });
  });

  test('[XAT-8051] Supported types transformation to BMP', async ({ personalFiles, nodesPage }) => {
    const parentFolderName = `parent-bmp-${Utils.random()}`;
    const destinationFolderName = `TO_BMP-${Utils.random()}`;
    const files = generateUniqueFiles([TEST_FILES.JPG_FILE, TEST_FILES.PNG_FILE, TEST_FILES.GIF_FILE, TEST_FILES.TIFF_FILE]);

    const parentFolderId = await setupTransformationTest(
      { personalFiles, nodesPage },
      { nodesApi, testString, parentFolderName, destinationFolderName, mimeType: MimeType.BitmapImage }
    );

    await triggerTransformation({ fileActionApi, files, parentFolderId, page: personalFiles.page });
    await verifyTransformation({ personalFiles }, { destinationFolderName, files, expectedExtension: 'bmp' });
  });

  test('[XAT-8052] Supported types transformation to JPG', async ({ personalFiles, nodesPage }) => {
    const parentFolderName = `parent-jpg-${Utils.random()}`;
    const destinationFolderName = `TO_JPG-${Utils.random()}`;
    const files = generateUniqueFiles([TEST_FILES.PNG_FILE, TEST_FILES.GIF_FILE, TEST_FILES.BMP_FILE, TEST_FILES.TIFF_FILE]);

    const parentFolderId = await setupTransformationTest(
      { personalFiles, nodesPage },
      { nodesApi, testString, parentFolderName, destinationFolderName, mimeType: MimeType.JPEGImage }
    );

    await triggerTransformation({ fileActionApi, files, parentFolderId, page: personalFiles.page });
    await verifyTransformation({ personalFiles }, { destinationFolderName, files, expectedExtension: 'jpg' });
  });

  test('[XAT-8053] Supported types transformation to GIF', async ({ personalFiles, nodesPage }) => {
    const parentFolderName = `parent-gif-${Utils.random()}`;
    const destinationFolderName = `TO_GIF-${Utils.random()}`;
    const files = generateUniqueFiles([TEST_FILES.PNG_FILE, TEST_FILES.JPG_FILE, TEST_FILES.BMP_FILE, TEST_FILES.TIFF_FILE]);

    const parentFolderId = await setupTransformationTest(
      { personalFiles, nodesPage },
      { nodesApi, testString, parentFolderName, destinationFolderName, mimeType: MimeType.GIFImage }
    );

    await triggerTransformation({ fileActionApi, files, parentFolderId, page: personalFiles.page });
    await verifyTransformation({ personalFiles }, { destinationFolderName, files, expectedExtension: 'gif' });
  });

  test('[XAT-8054] Supported types transformation to TIFF', async ({ personalFiles, nodesPage }) => {
    const parentFolderName = `parent-tiff-${Utils.random()}`;
    const destinationFolderName = `TO_TIFF-${Utils.random()}`;
    const files = generateUniqueFiles([TEST_FILES.PNG_FILE, TEST_FILES.JPG_FILE, TEST_FILES.BMP_FILE, TEST_FILES.GIF_FILE]);

    const parentFolderId = await setupTransformationTest(
      { personalFiles, nodesPage },
      { nodesApi, testString, parentFolderName, destinationFolderName, mimeType: MimeType.TIFFImage }
    );

    await triggerTransformation({ fileActionApi, files, parentFolderId, page: personalFiles.page });
    await verifyTransformation({ personalFiles }, { destinationFolderName, files, expectedExtension: 'tif' });
  });

  test('[XAT-8055] Supported types transformation to PNG', async ({ personalFiles, nodesPage }) => {
    const parentFolderName = `parent-png-${Utils.random()}`;
    const destinationFolderName = `TO_PNG-${Utils.random()}`;
    const files = generateUniqueFiles([TEST_FILES.JPG_FILE, TEST_FILES.BMP_FILE, TEST_FILES.GIF_FILE, TEST_FILES.TIFF_FILE]);

    const parentFolderId = await setupTransformationTest(
      { personalFiles, nodesPage },
      { nodesApi, testString, parentFolderName, destinationFolderName, mimeType: MimeType.PNGImage }
    );

    await triggerTransformation({ fileActionApi, files, parentFolderId, page: personalFiles.page });
    await verifyTransformation({ personalFiles }, { destinationFolderName, files, expectedExtension: 'png' });
  });
});
