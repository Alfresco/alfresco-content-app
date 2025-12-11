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

import { expect } from '@playwright/test';
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
  LoginPage,
  timeouts
} from '@alfresco/aca-playwright-shared';

/**
 * Helper function to generate file configurations with unique random names.
 * @param testFiles - Array of test file objects
 * @returns Array of {path, name} objects with randomized names
 */
function generateUniqueFiles(testFiles: Array<{ path: string; name: string }>): Array<{ path: string; name: string }> {
  return testFiles.map((file) => ({ path: file.path, name: `${file.name}-${Utils.random()}` }));
}

/**
 * Helper function to test file transformation via folder rules.
 * Creates a rule with the specified MIME type, uploads files, and verifies the transformations.
 * Each test creates its own parent folder to ensure thread safety in parallel execution.
 *
 * @param context - Playwright page objects (personalFiles, nodesPage, loginPage)
 * @param config - Configuration object containing:
 *   - nodesApi: API for node operations
 *   - fileActionApi: API for file operations
 *   - testString: String to use for rule name/description
 *   - username: Username for login
 *   - parentFolderName: Name of the parent folder for this test
 *   - destinationFolderName: Name of the destination folder for transformed files
 *   - mimeType: Target MIME type for transformation
 *   - files: Array of {path, name} objects representing files to upload
 *   - expectedExtension: Expected file extension after transformation (e.g., 'pdf', 'bmp')
 */
async function testTransformation(
  context: { personalFiles: PersonalFilesPage; nodesPage: NodesPage; loginPage: LoginPage },
  config: {
    nodesApi: NodesApi;
    fileActionApi: FileActionsApi;
    testString: string;
    username: string;
    parentFolderName: string;
    destinationFolderName: string;
    mimeType: MimeType;
    files: Array<{ path: string; name: string }>;
    expectedExtension: string;
  }
) {
  const { personalFiles, nodesPage } = context;
  const { nodesApi, fileActionApi, testString, parentFolderName, destinationFolderName, mimeType, files, expectedExtension } = config;

  // Create unique parent folder for this test to ensure thread safety
  const parentFolderId = (await nodesApi.createFolder(parentFolderName)).entry.id;

  // Create destination folder for transformed files
  await nodesApi.createFolder(destinationFolderName);

  // Navigate to folder rules and create a new rule
  await personalFiles.navigate({ remoteUrl: `#/nodes/${parentFolderId}/rules` });
  await nodesPage.toolbar.clickCreateRuleButton();
  await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(testString);
  await nodesPage.manageRulesDialog.ruleDescriptionInputLocator.fill(testString);
  await nodesPage.actionsDropdown.selectAction(ActionType.TransformAndCopyContent, 0);
  await nodesPage.actionsDropdown.selectMimeType(mimeType, 0);
  await nodesPage.actionsDropdown.selectDestinationFolderTransformAndCopyContent(0, destinationFolderName);
  await nodesPage.manageRulesDialog.createRuleButton.click();
  await expect(nodesPage.manageRules.getGroupsList(testString)).toBeVisible();

  // Upload files to trigger the transformation rule
  for (const file of files) {
    await fileActionApi.uploadFile(file.path, file.name, parentFolderId);
  }

  // Wait for transformations to complete (transformation happens asynchronously)
  await personalFiles.page.waitForTimeout(timeouts.medium);

  // Navigate to Personal Files root and then to destination folder
  await personalFiles.navigate();
  await personalFiles.dataTable.performClickFolderOrFileToOpen(destinationFolderName);
  await personalFiles.spinner.waitForReload();

  // Verify each transformed file exists
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

  test('[XAT-8050] Supported types transformation to PDF', async ({ personalFiles, nodesPage, loginPage }) => {
    await testTransformation(
      { personalFiles, nodesPage, loginPage },
      {
        nodesApi,
        fileActionApi,
        testString,
        username,
        parentFolderName: `parent-pdf-${Utils.random()}`,
        destinationFolderName: `TO_PDF-${Utils.random()}`,
        mimeType: MimeType.AdobePDFDocument,
        expectedExtension: 'pdf',
        files: generateUniqueFiles([TEST_FILES.DOCX, TEST_FILES.XLSX, TEST_FILES.PPTX_FILE])
      }
    );
  });

  test('[XAT-8051] Supported types transformation to BMP', async ({ personalFiles, nodesPage, loginPage }) => {
    await testTransformation(
      { personalFiles, nodesPage, loginPage },
      {
        nodesApi,
        fileActionApi,
        testString,
        username,
        parentFolderName: `parent-bmp-${Utils.random()}`,
        destinationFolderName: `TO_BMP-${Utils.random()}`,
        mimeType: MimeType.BitmapImage,
        expectedExtension: 'bmp',
        files: generateUniqueFiles([TEST_FILES.JPG_FILE, TEST_FILES.PNG_FILE, TEST_FILES.GIF_FILE, TEST_FILES.TIFF_FILE])
      }
    );
  });

  test('[XAT-8052] Supported types transformation to JPG', async ({ personalFiles, nodesPage, loginPage }) => {
    await testTransformation(
      { personalFiles, nodesPage, loginPage },
      {
        nodesApi,
        fileActionApi,
        testString,
        username,
        parentFolderName: `parent-jpg-${Utils.random()}`,
        destinationFolderName: `TO_JPG-${Utils.random()}`,
        mimeType: MimeType.JPEGImage,
        expectedExtension: 'jpg',
        files: generateUniqueFiles([TEST_FILES.PNG_FILE, TEST_FILES.GIF_FILE, TEST_FILES.BMP_FILE, TEST_FILES.TIFF_FILE])
      }
    );
  });

  test('[XAT-8053] Supported types transformation to GIF', async ({ personalFiles, nodesPage, loginPage }) => {
    await testTransformation(
      { personalFiles, nodesPage, loginPage },
      {
        nodesApi,
        fileActionApi,
        testString,
        username,
        parentFolderName: `parent-gif-${Utils.random()}`,
        destinationFolderName: `TO_GIF-${Utils.random()}`,
        mimeType: MimeType.GIFImage,
        expectedExtension: 'gif',
        files: generateUniqueFiles([TEST_FILES.PNG_FILE, TEST_FILES.JPG_FILE, TEST_FILES.BMP_FILE, TEST_FILES.TIFF_FILE])
      }
    );
  });

  test('[XAT-8054] Supported types transformation to TIFF', async ({ personalFiles, nodesPage, loginPage }) => {
    await testTransformation(
      { personalFiles, nodesPage, loginPage },
      {
        nodesApi,
        fileActionApi,
        testString,
        username,
        parentFolderName: `parent-tiff-${Utils.random()}`,
        destinationFolderName: `TO_TIFF-${Utils.random()}`,
        mimeType: MimeType.TIFFImage,
        expectedExtension: 'tif',
        files: generateUniqueFiles([TEST_FILES.PNG_FILE, TEST_FILES.JPG_FILE, TEST_FILES.BMP_FILE, TEST_FILES.GIF_FILE])
      }
    );
  });

  test('[XAT-8055] Supported types transformation to PNG', async ({ personalFiles, nodesPage, loginPage }) => {
    await testTransformation(
      { personalFiles, nodesPage, loginPage },
      {
        nodesApi,
        fileActionApi,
        testString,
        username,
        parentFolderName: `parent-png-${Utils.random()}`,
        destinationFolderName: `TO_PNG-${Utils.random()}`,
        mimeType: MimeType.PNGImage,
        expectedExtension: 'png',
        files: generateUniqueFiles([TEST_FILES.JPG_FILE, TEST_FILES.BMP_FILE, TEST_FILES.GIF_FILE, TEST_FILES.TIFF_FILE])
      }
    );
  });
});
