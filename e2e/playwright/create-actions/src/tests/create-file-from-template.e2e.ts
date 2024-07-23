/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
  AcaHeader,
  ApiClientFactory,
  ContentNodeSelectorDialog,
  CreateFromTemplateDialogComponent,
  DataTableComponent,
  NodeContentTree,
  NodesApi,
  SitesApi,
  Utils,
  errorStrings,
  test,
  TrashcanApi
} from '@alfresco/playwright-shared';

test.describe('Create file from template', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let selectFileTemplateDialog: ContentNodeSelectorDialog;
  let createFileFromTemplateDialog: CreateFromTemplateDialogComponent;
  let dataTable: DataTableComponent;
  let toolbar: AcaHeader;
  let randomFileName: string;
  let randomFileTitle: string;
  let randomFileDescription: string;
  let fileLink: string;
  const selectDialogTitle = 'Select a document template';
  const dialogBreadcrumb = 'Node Templates';
  const nameLabel = 'Name *';
  const titleLabel = 'Title';
  const descriptionLabel = 'Description';
  const emptyString = '';
  const tabKeyString = 'Tab';
  const dotString = '.';
  const spaceString = '   ';
  const commandKey = 'Meta';
  const random = Utils.random();
  const username = `user-${Utils.random()}`;

  const restrictedTemplateFolder = `restricted-templates-${random}`;
  const templateInRestrictedFolder = `template-restricted-${random}.txt`;

  const templatesFolder1 = `templates-folder1-${random}`;
  const template1InFolder1 = `template1-1-${random}.txt`;
  const template2InFolder1 = `template1-2-${random}.txt`;

  const templatesFolder2 = `templates-folder2-${random}`;
  const template1InFolder2 = `template2-1-${random}.txt`;
  const templatesSubFolder = `template-subFolder-${random}`;

  const template1InRoot = `template3-${random}.txt`;
  const template2InRoot = `template4-${random}.txt`;

  const createDialogTitle = `Create new document from '${template1InRoot}'`;
  const commonFileName = `playwright-file-${Utils.random()}`;

  const templates: NodeContentTree = {
    folders: [
      {
        name: templatesFolder1,
        folders: [
          {
            name: templatesSubFolder,
            files: [template1InFolder1, template2InFolder1]
          }
        ]
      },
      {
        name: templatesFolder2,
        files: [template1InFolder2]
      },
      {
        name: restrictedTemplateFolder,
        files: [templateInRestrictedFolder]
      }
    ],
    files: [template1InRoot, template2InRoot]
  };

  test.beforeAll(async ({ nodesApiAction }) => {
    const apiService = new ApiClientFactory();

    await apiService.setUpAcaBackend('admin');
    await apiService.createUser({ username: username });
    await nodesApiAction.createContent(templates, `Data Dictionary/Node Templates`);
    await nodesApiAction.removeUserAccessOnNodeTemplate(restrictedTemplateFolder);
    fileLink = (await nodesApiAction.createLinkToFileName(template2InRoot, await nodesApiAction.getNodeTemplatesFolderId())).entry.name;
    nodesApi = await NodesApi.initialize(username, username);
    trashcanApi = await TrashcanApi.initialize(username, username);
  });

  test.beforeEach(async ({ loginPage, personalFiles }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'Main beforeEach failed');
    await personalFiles.navigate();
  });

  test.afterAll(async ({ nodesApiAction }) => {
    await nodesApiAction.cleanupNodeTemplatesItems([templatesFolder1, templatesFolder2, restrictedTemplateFolder, template1InRoot, template2InRoot]);
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test.describe('Personal Files page', () => {
    test.beforeEach(async ({ personalFiles }) => {
      try {
        selectFileTemplateDialog = personalFiles.contentNodeSelector;
        dataTable = personalFiles.dataTable;
        toolbar = personalFiles.acaHeader;
        await toolbar.clickCreateFileFromTemplate();
        await selectFileTemplateDialog.loadMoreNodes();
      } catch (error) {
        console.error(`Personal Files page, beforeEach failed: ${error}`);
      }
    });

    test.describe('Select Template dialog', () => {
      test('[C325043] Select template - dialog UI - with existing templates', async () => {
        await expect.soft(selectFileTemplateDialog.getDialogTitle(selectDialogTitle)).toBeVisible();
        await expect.soft(selectFileTemplateDialog.getBreadcrumb(dialogBreadcrumb)).toBeVisible();
        await expect.soft(dataTable.getRowByName(templatesFolder1)).not.toBeEmpty();
        await expect.soft(dataTable.getRowByName(templatesFolder1)).toBeVisible();
        await expect.soft(dataTable.getRowByName(templatesFolder2)).toBeVisible();
        await expect.soft(dataTable.getRowByName(template1InRoot)).toBeVisible();
        await expect.soft(selectFileTemplateDialog.cancelButton).toBeEnabled();
        await expect(selectFileTemplateDialog.actionButton).toBeDisabled();
      });

      test(`[C325044] Templates don't appear if user doesn't have permissions to see them`, async () => {
        await expect(selectFileTemplateDialog.getDialogTitle(selectDialogTitle)).toBeVisible();
        await expect(dataTable.getRowByName(restrictedTemplateFolder)).toBeHidden();
        await expect(dataTable.getRowByName(templateInRestrictedFolder)).toBeHidden();
      });

      test(`[C325045] Navigate through the templates list with folder hierarchy`, async () => {
        await expect(selectFileTemplateDialog.getBreadcrumb(dialogBreadcrumb)).toBeVisible();
        await expect(dataTable.getRowByName(templatesFolder1)).toBeVisible();
        await expect(dataTable.getRowByName(templatesFolder2)).toBeVisible();
        await expect(dataTable.getRowByName(template1InRoot)).toBeVisible();

        await dataTable.getRowByName(templatesFolder1).dblclick();
        await expect(selectFileTemplateDialog.getBreadcrumb(templatesFolder1)).toBeVisible();
        await expect(dataTable.getRowByName(templatesSubFolder)).toBeVisible();

        await dataTable.getRowByName(templatesSubFolder).dblclick();
        await expect(selectFileTemplateDialog.getBreadcrumb(templatesSubFolder)).toBeVisible();
        await expect(dataTable.getRowByName(template1InFolder1)).toBeVisible();
        await expect(dataTable.getRowByName(template2InFolder1)).toBeVisible();

        await selectFileTemplateDialog.getFolderIcon.click();
        await expect(selectFileTemplateDialog.getOptionLocator(templatesFolder1)).toBeVisible();
        await expect(selectFileTemplateDialog.getOptionLocator(dialogBreadcrumb)).toBeVisible();
      });

      test(`[C325047] Templates list doesn't allow multiple selection`, async () => {
        await expect(dataTable.getSelectedRow).toHaveCount(0);

        await dataTable.getRowByName(template1InRoot).click({ modifiers: [commandKey] });
        await expect(dataTable.getSelectedRow).toHaveCount(1);
        await expect(dataTable.getSelectedRow).toContainText(template1InRoot);

        await dataTable.getRowByName(template2InRoot).click({ modifiers: [commandKey] });
        await expect(dataTable.getSelectedRow).not.toHaveCount(2);
        await expect(dataTable.getSelectedRow).toHaveCount(1);
        await expect(dataTable.getSelectedRow).toContainText(template2InRoot);
      });

      test('[C325050] Links to files are not displayed', async () => {
        await expect(dataTable.getRowByName(template1InRoot)).toBeVisible();
        await expect(dataTable.getRowByName(template2InRoot)).toBeVisible();
        await expect(dataTable.getRowByName(fileLink)).toBeHidden();
      });

      test('[C325048] Cancel the Select template dialog', async () => {
        await expect(selectFileTemplateDialog.getDialogTitle(selectDialogTitle)).toBeVisible();

        await selectFileTemplateDialog.cancelButton.click();
        await expect(selectFileTemplateDialog.getDialogTitle(selectDialogTitle)).toBeHidden();
      });

      test('[C216339] Next button is disabled when selecting a folder', async () => {
        await expect(dataTable.getRowByName(templatesFolder1)).toBeVisible();
        await expect(selectFileTemplateDialog.actionButton).toBeDisabled();

        await dataTable.getRowByName(templatesFolder1).click();
        await expect(selectFileTemplateDialog.actionButton).toBeDisabled();
      });
    });

    test.describe('Create document from template dialog', () => {
      test.beforeAll(async () => {
        await nodesApi.createFile(commonFileName);
      });

      test.beforeEach(async ({ personalFiles }) => {
        try {
          createFileFromTemplateDialog = personalFiles.createFromTemplateDialogComponent;
          await dataTable.getRowByName(template1InRoot).click();
          await selectFileTemplateDialog.actionButton.click();
        } catch (error) {
          console.error(`Create document from template dialog, beforeEach failed: ${error}`);
        }
      });

      test('[C325020] Create file from template - dialog UI', async () => {
        await expect.soft(createFileFromTemplateDialog.getDialogTitle(createDialogTitle)).toBeVisible();
        await expect.soft(createFileFromTemplateDialog.getDialogLabel(nameLabel)).toBeVisible();
        await expect.soft(createFileFromTemplateDialog.getDialogLabel(nameLabel)).toHaveValue(template1InRoot);
        await expect.soft(createFileFromTemplateDialog.getDialogLabel(titleLabel)).toBeVisible();
        await expect.soft(createFileFromTemplateDialog.getDialogLabel(titleLabel)).toHaveValue(emptyString);
        await expect.soft(createFileFromTemplateDialog.getDialogLabel(descriptionLabel)).toBeVisible();
        await expect.soft(createFileFromTemplateDialog.getDialogLabel(descriptionLabel)).toHaveValue(emptyString);
        await expect.soft(createFileFromTemplateDialog.cancelButton).toBeEnabled();
        await expect(createFileFromTemplateDialog.createButton).toBeEnabled();
      });

      test('[C325031] File name is required', async () => {
        await expect(createFileFromTemplateDialog.getDialogLabel(nameLabel)).toHaveValue(template1InRoot);

        await createFileFromTemplateDialog.getDialogLabel(nameLabel).clear();
        await createFileFromTemplateDialog.page.keyboard.press(tabKeyString);
        await expect(createFileFromTemplateDialog.getDialogLabel(nameLabel)).toHaveValue(emptyString);
        expect
          .soft(await createFileFromTemplateDialog.isErrorMessageDisplayed(errorStrings.nameIsRequiredError), errorStrings.errorMessageNotPresent)
          .toBe(true);
        await expect(createFileFromTemplateDialog.createButton).toBeDisabled();
      });

      test('[C325032] Special characters in file name', async () => {
        const nameWithSpecialChars = ['a*a', 'a"a', 'a<a', 'a>a', `a\\a`, 'a/a', 'a?a', 'a:a', 'a|a'];

        for (const specialFileName of nameWithSpecialChars) {
          await createFileFromTemplateDialog.getDialogLabel(nameLabel).fill(specialFileName);
          await createFileFromTemplateDialog.page.keyboard.press(tabKeyString);
          await expect(createFileFromTemplateDialog.getDialogLabel(nameLabel)).toHaveValue(specialFileName);
          expect
            .soft(
              await createFileFromTemplateDialog.isErrorMessageDisplayed(errorStrings.nameWithSpecialCharactersError),
              errorStrings.errorMessageNotPresent
            )
            .toBe(true);
          await expect(createFileFromTemplateDialog.createButton).toBeDisabled();
        }
      });

      test('[C325033] File name ending with a dot', async () => {
        await createFileFromTemplateDialog.getDialogLabel(nameLabel).fill(dotString);
        await createFileFromTemplateDialog.page.keyboard.press(tabKeyString);
        await expect(createFileFromTemplateDialog.getDialogLabel(nameLabel)).toHaveValue(template1InRoot + dotString);
        expect
          .soft(await createFileFromTemplateDialog.isErrorMessageDisplayed(errorStrings.nameEndWithDotError), errorStrings.errorMessageNotPresent)
          .toBe(true);
        await expect(createFileFromTemplateDialog.createButton).toBeDisabled();
      });

      test('[C325034] File name containing only spaces', async () => {
        await createFileFromTemplateDialog.getDialogLabel(nameLabel).clear();
        await createFileFromTemplateDialog.getDialogLabel(nameLabel).fill(spaceString);
        await createFileFromTemplateDialog.page.keyboard.press(tabKeyString);
        await expect(createFileFromTemplateDialog.getDialogLabel(nameLabel)).toHaveValue(spaceString);
        expect
          .soft(
            await createFileFromTemplateDialog.isErrorMessageDisplayed(errorStrings.nameContainOnlySpacesError),
            errorStrings.errorMessageNotPresent
          )
          .toBe(true);
        await expect(createFileFromTemplateDialog.createButton).toBeDisabled();
      });

      test('[C290146] File title too long', async () => {
        await createFileFromTemplateDialog.getDialogLabel(titleLabel).fill(Utils.string257Long);
        await createFileFromTemplateDialog.page.keyboard.press(tabKeyString);
        await expect(createFileFromTemplateDialog.getDialogLabel(titleLabel)).toHaveValue(Utils.string257Long);
        expect
          .soft(await createFileFromTemplateDialog.isErrorMessageDisplayed(errorStrings.titleLengthLimitError), errorStrings.errorMessageNotPresent)
          .toBe(true);
        await expect(createFileFromTemplateDialog.createButton).toBeDisabled();
      });

      test('[C290142] Description too long', async () => {
        await createFileFromTemplateDialog.getDialogLabel(descriptionLabel).fill(Utils.string513Long);
        await createFileFromTemplateDialog.page.keyboard.press(tabKeyString);
        await expect(createFileFromTemplateDialog.getDialogLabel(descriptionLabel)).toHaveValue(Utils.string513Long);
        expect
          .soft(
            await createFileFromTemplateDialog.isErrorMessageDisplayed(errorStrings.descriptionLengthLimitError),
            errorStrings.errorMessageNotPresent
          )
          .toBe(true);
        await expect(createFileFromTemplateDialog.createButton).toBeDisabled();
      });

      test('[C325028] Create a file with a duplicate name', async ({ personalFiles }) => {
        const snackBar = personalFiles.snackBar;

        await createFileFromTemplateDialog.createFromTemplateAction(commonFileName);
        await expect(snackBar.getByMessageLocator(errorStrings.nameAlreadyUsedError)).toBeVisible();
        await expect(createFileFromTemplateDialog.getDialogTitle(createDialogTitle)).toBeVisible();
      });

      test('[C325027] Cancel file creation', async () => {
        await expect(createFileFromTemplateDialog.getDialogTitle(createDialogTitle)).toBeVisible();
        await createFileFromTemplateDialog.cancelButton.click();
        await expect(createFileFromTemplateDialog.getDialogTitle(createDialogTitle)).toBeHidden();
      });
    });

    test.describe('File created from template on Personal Files', () => {
      test.beforeEach(async ({ personalFiles }) => {
        try {
          randomFileName = `playwright-file-${Utils.random()}`;
          randomFileTitle = `file-title-${Utils.random()}`;
          randomFileDescription = `file-description-${Utils.random()}`;
          createFileFromTemplateDialog = personalFiles.createFromTemplateDialogComponent;
          await dataTable.getRowByName(template1InRoot).click();
          await selectFileTemplateDialog.actionButton.click();
        } catch (error) {
          console.error(`File created from template on Personal Files, beforeEach failed: ${error}`);
        }
      });

      test('[C325030] Create a file from a template - with a new Name', async () => {
        await createFileFromTemplateDialog.createFromTemplateAction(randomFileName);
        await dataTable.goThroughPagesLookingForRowWithName(randomFileName);
        await expect(dataTable.getRowByName(randomFileName)).toBeVisible();
      });

      test('[C325026] Create a file from a template - with a Name, Title and Description', async () => {
        await createFileFromTemplateDialog.createFromTemplateAction(randomFileName, randomFileTitle, randomFileDescription);
        await dataTable.goThroughPagesLookingForRowWithName(randomFileName);
        await expect(dataTable.getCellLinkByName(randomFileName)).toHaveAttribute(titleLabel, randomFileTitle + `\n` + randomFileDescription);
      });

      test('[C325042] Trim spaces from file Name', async () => {
        await createFileFromTemplateDialog.createFromTemplateAction('   ' + randomFileName + '   ');
        await dataTable.goThroughPagesLookingForRowWithName(randomFileName);
        await expect(dataTable.getRowByName(randomFileName)).toBeVisible();
      });
    });
  });

  test.describe('File created from template on Personal Files Libraries', () => {
    const randomLibraryName = `playwright-library-${Utils.random()}`;
    let sitesApi: SitesApi;

    test.beforeAll(async () => {
      sitesApi = await SitesApi.initialize(username, username);
      await sitesApi.createSite(randomLibraryName);
      const libraryGuId = await sitesApi.getDocLibId(randomLibraryName);
      await nodesApi.createFile(commonFileName, libraryGuId);
    });

    test.beforeEach(async ({ myLibrariesPage }) => {
      try {
        randomFileName = `playwright-file-${Utils.random()}`;
        randomFileTitle = `file-title-${Utils.random()}`;
        randomFileDescription = `file-description-${Utils.random()}`;
        await myLibrariesPage.navigate();
        selectFileTemplateDialog = myLibrariesPage.contentNodeSelector;
        createFileFromTemplateDialog = myLibrariesPage.createFromTemplateDialogComponent;
        dataTable = myLibrariesPage.dataTable;
        toolbar = myLibrariesPage.acaHeader;
        await dataTable.getRowByName(randomLibraryName).dblclick();
        await dataTable.spinnerWaitForReload();
        await toolbar.clickCreateFileFromTemplate();
        await selectFileTemplateDialog.loadMoreNodes();
        await dataTable.getRowByName(template1InRoot).click();
        await selectFileTemplateDialog.actionButton.click();
      } catch (error) {
        console.error(`File created from template on Personal Files Libraries, beforeEach failed: ${error}`);
      }
    });

    test.afterAll(async () => {
      await sitesApi.deleteSites([randomLibraryName]);
    });

    test('[C325023] Create a file from a template from library - with Name, Title and Description', async () => {
      await createFileFromTemplateDialog.createFromTemplateAction(randomFileName, randomFileTitle, randomFileDescription);
      await expect(dataTable.getCellLinkByName(randomFileName)).toHaveAttribute(titleLabel, randomFileTitle + `\n` + randomFileDescription);
    });

    test('[C325024] Cancel file creation in a library', async () => {
      await expect(createFileFromTemplateDialog.getDialogTitle(createDialogTitle)).toBeVisible();
      await createFileFromTemplateDialog.cancelButton.click();
      await expect(createFileFromTemplateDialog.getDialogTitle(createDialogTitle)).toBeHidden();
      await expect(dataTable.getRowByName(randomFileName)).toBeHidden();
    });

    test('[C325025] Create a file with a duplicate name in a library', async ({ myLibrariesPage }) => {
      const snackBar = myLibrariesPage.snackBar;

      await createFileFromTemplateDialog.createFromTemplateAction(commonFileName);
      await expect(snackBar.getByMessageLocator(errorStrings.nameAlreadyUsedError)).toBeVisible();
      await expect(createFileFromTemplateDialog.getDialogTitle(createDialogTitle)).toBeVisible();
    });
  });
});
