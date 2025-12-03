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
  TEST_FILES
} from '@alfresco/aca-playwright-shared';

/**
 * Helper function to test file transformation via folder rules.
 * Creates a rule with the specified MIME type, uploads files, and verifies the transformations.
 *
 * @param context - Playwright page objects (personalFiles, nodesPage, loginPage)
 * @param config - Configuration object containing:
 *   - nodesApi: API for node operations
 *   - fileActionApi: API for file operations
 *   - randomFolderName1Id: ID of the parent folder
 *   - testString: String to use for rule name/description
 *   - username: Username for login
 *   - folderName: Name of the destination folder for transformed files
 *   - mimeType: Target MIME type for transformation
 *   - files: Array of {path, name} objects representing files to upload
 *   - expectedExtension: Expected file extension after transformation (e.g., 'pdf', 'bmp')
 */
async function testTransformation(
  context: { personalFiles: any; nodesPage: any; loginPage: any },
  config: {
    nodesApi: NodesApi;
    fileActionApi: FileActionsApi;
    randomFolderName1Id: string;
    testString: string;
    username: string;
    folderName: string;
    mimeType: MimeType;
    files: Array<{ path: string; name: string }>;
    expectedExtension: string;
  }
) {
  const { personalFiles, nodesPage, loginPage } = context;
  const { nodesApi, fileActionApi, randomFolderName1Id, testString, username, folderName, mimeType, files, expectedExtension } = config;

  // Create destination folder
  await nodesApi.createFolder(folderName);

  // Navigate to folder rules and create a new rule
  await personalFiles.navigate({ remoteUrl: `#/nodes/${randomFolderName1Id}/rules` });
  await nodesPage.toolbar.clickCreateRuleButton();
  await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(testString);
  await nodesPage.manageRulesDialog.ruleDescriptionInputLocator.fill(testString);
  await nodesPage.actionsDropdown.selectAction(ActionType.TransformAndCopyContent, 0);
  await nodesPage.actionsDropdown.selectMimeType(mimeType, 0);
  await nodesPage.actionsDropdown.selectDestinationFolderTransformAndCopyContent(0, folderName);
  await nodesPage.manageRulesDialog.createRuleButton.click();
  await expect(nodesPage.manageRules.getGroupsList(testString)).toBeVisible();

  // Upload files to trigger the transformation rule
  for (const file of files) {
    await fileActionApi.uploadFile(file.path, file.name, randomFolderName1Id);
  }

  // Logout and login to ensure transformations have completed
  await loginPage.logoutUser();
  await expect(loginPage.username, 'User name was not visible').toBeVisible();
  await Utils.tryLoginUser(loginPage, username, username, 'Login after transformation failed');

  // Navigate to destination folder and verify transformed files
  await personalFiles.dataTable.performClickFolderOrFileToOpen(folderName);
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

  const randomFolderName1 = `folder-name-${Utils.random()}`;
  const randomDocxName = `${TEST_FILES.DOCX.name}-${Utils.random()}`;
  const randomXLSXName = `${TEST_FILES.XLSX.name}-${Utils.random()}`;
  const randomPPTXName = `${TEST_FILES.PPTX_FILE.name}-${Utils.random()}`;
  const randomJPGName = `${TEST_FILES.JPG_FILE.name}-${Utils.random()}`;
  const randomPNGName = `${TEST_FILES.PNG_FILE.name}-${Utils.random()}`;
  const randomGIFName = `${TEST_FILES.GIF_FILE.name}-${Utils.random()}`;

  const copyFileName = `copy-file-${Utils.random()}`;
  const testString = '"!@£$%^&*()_+{}|:""?&gt;&lt;,/.\';][=-`~"';

  let randomFolderName1Id: string;

  test.beforeAll(async () => {
    try {
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      fileActionApi = await FileActionsApi.initialize(username, username);
      randomFolderName1Id = (await nodesApi.createFolder(randomFolderName1)).entry.id;
      await nodesApi.createFile(copyFileName, randomFolderName1Id);
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
        randomFolderName1Id,
        testString,
        username,
        folderName: 'TO_PDF',
        mimeType: MimeType.AdobePDFDocument,
        expectedExtension: 'pdf',
        files: [
          { path: TEST_FILES.DOCX.path, name: randomDocxName },
          { path: TEST_FILES.XLSX.path, name: randomXLSXName },
          { path: TEST_FILES.PPTX_FILE.path, name: randomPPTXName }
        ]
      }
    );
  });

  test('[XAT-8051] Supported types transformation to BMP', async ({ personalFiles, nodesPage, loginPage }) => {
    await testTransformation(
      { personalFiles, nodesPage, loginPage },
      {
        nodesApi,
        fileActionApi,
        randomFolderName1Id,
        testString,
        username,
        folderName: 'TO_BMP',
        mimeType: MimeType.BitmapImage,
        expectedExtension: 'bmp',
        files: [
          { path: TEST_FILES.JPG_FILE.path, name: randomJPGName },
          { path: TEST_FILES.PNG_FILE.path, name: randomPNGName },
          { path: TEST_FILES.GIF_FILE.path, name: randomGIFName }
        ]
      }
    );
  });

  test('[XAT-8052] Supported types transformation to JPG', async ({ personalFiles, nodesPage, loginPage }) => {
    await testTransformation(
      { personalFiles, nodesPage, loginPage },
      {
        nodesApi,
        fileActionApi,
        randomFolderName1Id,
        testString,
        username,
        folderName: 'TO_JPG',
        mimeType: MimeType.JPEGImage,
        expectedExtension: 'jpg',
        files: [
          { path: TEST_FILES.PNG_FILE.path, name: randomPNGName },
          { path: TEST_FILES.GIF_FILE.path, name: randomGIFName }
        ]
      }
    );
  });
});
