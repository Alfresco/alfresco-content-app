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
    const toFolderName = 'TO_PDF';
    await nodesApi.createFolder(toFolderName);
    await personalFiles.navigate({ remoteUrl: `#/nodes/${randomFolderName1Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(testString);
    await nodesPage.manageRulesDialog.ruleDescriptionInputLocator.fill(testString);
    await nodesPage.actionsDropdown.selectAction(ActionType.TransformAndCopyContent, 0);
    await nodesPage.actionsDropdown.selectMimeType(MimeType.AdobePDFDocument, 0);
    await nodesPage.actionsDropdown.selectDestinationFolderTransformAndCopyContent(0, toFolderName);
    await nodesPage.manageRulesDialog.createRuleButton.click();
    await expect(nodesPage.manageRules.getGroupsList(testString)).toBeVisible();
    await fileActionApi.uploadFile(TEST_FILES.DOCX.path, randomDocxName, randomFolderName1Id);
    await fileActionApi.uploadFile(TEST_FILES.XLSX.path, randomXLSXName, randomFolderName1Id);
    await fileActionApi.uploadFile(TEST_FILES.PPTX_FILE.path, randomPPTXName, randomFolderName1Id);
    await loginPage.logoutUser();
    await expect(loginPage.username, 'User name was not visible').toBeVisible();
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    await personalFiles.dataTable.performClickFolderOrFileToOpen(toFolderName);
    await personalFiles.spinner.waitForReload();
    const docxToPDF = `${randomDocxName}.pdf`;
    const xlsxToPDF = `${randomXLSXName}.pdf`;
    const pptxToPDF = `${randomPPTXName}.pdf`;
    expect(await personalFiles.dataTable.isItemPresent(docxToPDF), `Converted PDF from DOCX ${docxToPDF} was not present in data table`).toBe(true);
    expect(await personalFiles.dataTable.isItemPresent(pptxToPDF), `Converted PDF from PPTX ${pptxToPDF} was not present in data table`).toBe(true);
    expect(await personalFiles.dataTable.isItemPresent(xlsxToPDF), `Converted PDF from XLSX ${xlsxToPDF} was not present in data table`).toBe(true);
  });
});
