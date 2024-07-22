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

test.describe('Create folder from template', () => {
  const apiClientFactory = new ApiClientFactory();
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let selectFolderTemplateDialog: ContentNodeSelectorDialog;
  let createFolderFromTemplateDialog: CreateFromTemplateDialogComponent;
  let dataTable: DataTableComponent;
  let toolbar: AcaHeader;
  let randomFolderName: string;
  let randomFolderTitle: string;
  let randomFolderDescription: string;
  let folderLink: string;
  const selectDialogTitle = 'Select a folder template';
  const dialogBreadcrumb = 'Space Templates';
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

  const fileInRootFolder = `file-in-root-${random}.txt`;
  const folderInRootFolder = `folder-in-root-${random}`;

  const templateFolder1 = `template-folder1-${random}`;
  const fileInFolder1 = `file-1-${random}.txt`;
  const templateSubFolder = `template-sub-folder-${random}`;

  const templateFolder2 = `template-folder2-${random}`;
  const fileInFolder2 = `file-2-${random}.txt`;

  const restrictedTemplateFolder = `restricted-folder-${random}`;
  const fileInRestrictedFolder = `restricted-file-${random}.txt`;

  const createDialogTitle = `Create new folder from '${templateFolder1}'`;
  const commonFolderName = `create-actions-template-${Utils.random()}`;

  const templates: NodeContentTree = {
    folders: [
      {
        name: folderInRootFolder
      },
      {
        name: templateFolder1,
        folders: [
          {
            name: templateSubFolder
          }
        ],
        files: [fileInFolder1]
      },
      {
        name: templateFolder2,
        files: [fileInFolder2]
      },
      {
        name: restrictedTemplateFolder,
        files: [fileInRestrictedFolder]
      }
    ],
    files: [fileInRootFolder]
  };

  test.beforeAll(async ({ nodesApiAction }) => {
    try {
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username: username });
      await nodesApiAction.createContent(templates, `Data Dictionary/Space Templates`);
      await nodesApiAction.removeUserAccessOnSpaceTemplate(restrictedTemplateFolder);
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      folderLink = (await nodesApiAction.createLinkToFolderName(folderInRootFolder, await nodesApiAction.getSpaceTemplatesFolderId())).entry.name;
    } catch (error) {
      console.error(`Main beforeAll failed : ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage, personalFiles }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'Main beforeEach failed');
    await personalFiles.navigate();
  });

  test.afterAll(async ({ nodesApiAction }) => {
    try {
      await nodesApiAction.cleanupSpaceTemplatesItems([
        folderInRootFolder,
        templateFolder1,
        templateFolder2,
        restrictedTemplateFolder,
        fileInRootFolder
      ]);
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    } catch (error) {
      console.error(`Main afterAll failed : ${error}`);
    }
  });

  test.describe('Personal Files page', () => {
    test.beforeAll(async () => {
      try {
        nodesApi = await NodesApi.initialize(username, username);
      } catch (error) {
        console.error(`Personal Files page, beforeAll failed : ${error}`);
      }
    });

    test.beforeEach(async ({ personalFiles }) => {
      try {
        selectFolderTemplateDialog = personalFiles.contentNodeSelector;
        dataTable = personalFiles.dataTable;
        toolbar = personalFiles.acaHeader;
        await toolbar.clickCreateFolderFromTemplate();
        await selectFolderTemplateDialog.loadMoreNodes();
      } catch (error) {
        console.error(`Personal Files page, beforeEach failed : ${error}`);
      }
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'Personal Files page, afterAll failed : ');
    });

    test.describe('Select Template dialog', () => {
      test('[C325147] Select template - dialog UI - with existing templates', async () => {
        await expect.soft(selectFolderTemplateDialog.getDialogTitle(selectDialogTitle)).toBeVisible();
        await expect.soft(selectFolderTemplateDialog.getBreadcrumb(dialogBreadcrumb)).toBeVisible();
        await expect.soft(dataTable.getRowByName(templateFolder1)).not.toBeEmpty();
        await expect.soft(dataTable.getRowByName(templateFolder1)).toBeVisible();
        await expect.soft(dataTable.getRowByName(templateFolder2)).toBeVisible();
        await expect.soft(dataTable.getRowByName(folderInRootFolder)).toBeVisible();
        await expect.soft(selectFolderTemplateDialog.cancelButton).toBeEnabled();
        await expect(selectFolderTemplateDialog.actionButton).toBeDisabled();
      });

      test(`[C325148] Templates don't appear if user doesn't have permissions to see them`, async () => {
        await expect(selectFolderTemplateDialog.getDialogTitle(selectDialogTitle)).toBeVisible();
        await expect(dataTable.getRowByName(restrictedTemplateFolder)).toBeHidden();
      });

      test(`[C325149] Navigate through the templates list with folder hierarchy`, async () => {
        await expect(selectFolderTemplateDialog.getBreadcrumb(dialogBreadcrumb)).toBeVisible();
        await expect(dataTable.getRowByName(templateFolder1)).toBeVisible();

        await dataTable.getRowByName(templateFolder1).dblclick();
        await expect(selectFolderTemplateDialog.getBreadcrumb(templateFolder1)).toBeVisible();
        await expect(dataTable.getRowByName(templateSubFolder)).toBeVisible();
        await expect(dataTable.getRowByName(fileInFolder1)).toBeVisible();

        await dataTable.getRowByName(templateSubFolder).dblclick();
        await expect(selectFolderTemplateDialog.getBreadcrumb(templateSubFolder)).toBeVisible();
        await expect(dataTable.getNoResultsFoundMessage).toBeVisible();

        await selectFolderTemplateDialog.getFolderIcon.click();
        await expect(selectFolderTemplateDialog.getOptionLocator(templateFolder1)).toBeVisible();
        await expect(selectFolderTemplateDialog.getOptionLocator(dialogBreadcrumb)).toBeVisible();
      });

      test(`[C325150] Templates list doesn't allow multiple selection`, async () => {
        await expect(dataTable.getSelectedRow).toHaveCount(0);

        await dataTable.getRowByName(templateFolder1).click({ modifiers: [commandKey] });
        await expect(dataTable.getSelectedRow).toHaveCount(1);
        await expect(dataTable.getSelectedRow).toContainText(templateFolder1);

        await dataTable.getRowByName(templateFolder2).click({ modifiers: [commandKey] });
        await expect(dataTable.getSelectedRow).not.toHaveCount(2);
        await expect(dataTable.getSelectedRow).toHaveCount(1);
        await expect(dataTable.getSelectedRow).toContainText(templateFolder2);
      });

      test('[C325153] Links to folders are not displayed', async () => {
        await expect(dataTable.getRowByName(templateFolder1)).toBeVisible();
        await expect(dataTable.getRowByName(folderLink)).toBeHidden();
      });

      test('[C325151] Cancel the Select template dialog', async () => {
        await expect(selectFolderTemplateDialog.getDialogTitle(selectDialogTitle)).toBeVisible();

        await selectFolderTemplateDialog.cancelButton.click();
        await expect(selectFolderTemplateDialog.getDialogTitle(selectDialogTitle)).toBeHidden();
      });

      test('[C325139] Next button is disabled when selecting a file', async () => {
        await expect(dataTable.getRowByName(fileInRootFolder)).toBeVisible();
        await expect(selectFolderTemplateDialog.actionButton).toBeDisabled();

        await dataTable.getRowByName(fileInRootFolder).click();
        await expect(selectFolderTemplateDialog.actionButton).toBeDisabled();
      });
    });

    test.describe('Create from template dialog', () => {
      test.beforeAll(async () => {
        try {
          await nodesApi.createFolder(commonFolderName);
        } catch (error) {
          console.error(`Create from template dialog, beforeAll failed : ${error}`);
        }
      });

      test.beforeEach(async ({ personalFiles }) => {
        try {
          createFolderFromTemplateDialog = personalFiles.createFromTemplateDialogComponent;
          await dataTable.getRowByName(templateFolder1).click();
          await selectFolderTemplateDialog.actionButton.click();
        } catch (error) {
          console.error(`Create from template dialog, beforeEach failed : ${error}`);
        }
      });

      test('[C325142] Create folder from template - dialog UI', async () => {
        await expect.soft(createFolderFromTemplateDialog.getDialogTitle(createDialogTitle)).toBeVisible();
        await expect.soft(createFolderFromTemplateDialog.getDialogLabel(nameLabel)).toBeVisible();
        await expect.soft(createFolderFromTemplateDialog.getDialogLabel(nameLabel)).toHaveValue(templateFolder1);
        await expect.soft(createFolderFromTemplateDialog.getDialogLabel(titleLabel)).toBeVisible();
        await expect.soft(createFolderFromTemplateDialog.getDialogLabel(titleLabel)).toHaveValue(emptyString);
        await expect.soft(createFolderFromTemplateDialog.getDialogLabel(descriptionLabel)).toBeVisible();
        await expect.soft(createFolderFromTemplateDialog.getDialogLabel(descriptionLabel)).toHaveValue(emptyString);
        await expect.soft(createFolderFromTemplateDialog.cancelButton).toBeEnabled();
        await expect(createFolderFromTemplateDialog.createButton).toBeEnabled();
      });

      test('[C325143] Folder name is required', async () => {
        await expect(createFolderFromTemplateDialog.getDialogLabel(nameLabel)).toHaveValue(templateFolder1);

        await createFolderFromTemplateDialog.getDialogLabel(nameLabel).clear();
        await createFolderFromTemplateDialog.page.keyboard.press(tabKeyString);
        await expect(createFolderFromTemplateDialog.getDialogLabel(nameLabel)).toHaveValue(emptyString);
        expect
          .soft(await createFolderFromTemplateDialog.isErrorMessageDisplayed(errorStrings.nameIsRequiredError), errorStrings.errorMessageNotPresent)
          .toBe(true);
        await expect(createFolderFromTemplateDialog.createButton).toBeDisabled();
      });

      test('[C325144] Special characters in folder name', async () => {
        const nameWithSpecialChars = ['a*a', 'a"a', 'a<a', 'a>a', `a\\a`, 'a/a', 'a?a', 'a:a', 'a|a'];

        for (const specialFolderName of nameWithSpecialChars) {
          await createFolderFromTemplateDialog.getDialogLabel(nameLabel).fill(specialFolderName);
          await createFolderFromTemplateDialog.page.keyboard.press(tabKeyString);
          await expect(createFolderFromTemplateDialog.getDialogLabel(nameLabel)).toHaveValue(specialFolderName);
          expect
            .soft(
              await createFolderFromTemplateDialog.isErrorMessageDisplayed(errorStrings.nameWithSpecialCharactersError),
              errorStrings.errorMessageNotPresent
            )
            .toBe(true);
          await expect(createFolderFromTemplateDialog.createButton).toBeDisabled();
        }
      });

      test('[C325145] Folder name ending with a dot', async () => {
        await createFolderFromTemplateDialog.getDialogLabel(nameLabel).fill(dotString);
        await createFolderFromTemplateDialog.page.keyboard.press(tabKeyString);
        await expect(createFolderFromTemplateDialog.getDialogLabel(nameLabel)).toHaveValue(templateFolder1 + dotString);
        expect
          .soft(await createFolderFromTemplateDialog.isErrorMessageDisplayed(errorStrings.nameEndWithDotError), errorStrings.errorMessageNotPresent)
          .toBe(true);
        await expect(createFolderFromTemplateDialog.createButton).toBeDisabled();
      });

      test('[C325146] Folder name containing only spaces', async () => {
        await createFolderFromTemplateDialog.getDialogLabel(nameLabel).clear();
        await createFolderFromTemplateDialog.getDialogLabel(nameLabel).fill(spaceString);
        await createFolderFromTemplateDialog.page.keyboard.press(tabKeyString);
        await expect(createFolderFromTemplateDialog.getDialogLabel(nameLabel)).toHaveValue(spaceString);
        expect
          .soft(
            await createFolderFromTemplateDialog.isErrorMessageDisplayed(errorStrings.nameContainOnlySpacesError),
            errorStrings.errorMessageNotPresent
          )
          .toBe(true);
        await expect(createFolderFromTemplateDialog.createButton).toBeDisabled();
      });

      test('[C325141] Title too long', async () => {
        await createFolderFromTemplateDialog.getDialogLabel(titleLabel).fill(Utils.string257Long);
        await createFolderFromTemplateDialog.page.keyboard.press(tabKeyString);
        await expect(createFolderFromTemplateDialog.getDialogLabel(titleLabel)).toHaveValue(Utils.string257Long);
        expect
          .soft(await createFolderFromTemplateDialog.isErrorMessageDisplayed(errorStrings.titleLengthLimitError), errorStrings.errorMessageNotPresent)
          .toBe(true);
        await expect(createFolderFromTemplateDialog.createButton).toBeDisabled();
      });

      test('[C325140] Description too long', async () => {
        await createFolderFromTemplateDialog.getDialogLabel(descriptionLabel).fill(Utils.string513Long);
        await createFolderFromTemplateDialog.page.keyboard.press(tabKeyString);
        await expect(createFolderFromTemplateDialog.getDialogLabel(descriptionLabel)).toHaveValue(Utils.string513Long);
        expect
          .soft(
            await createFolderFromTemplateDialog.isErrorMessageDisplayed(errorStrings.descriptionLengthLimitError),
            errorStrings.errorMessageNotPresent
          )
          .toBe(true);
        await expect(createFolderFromTemplateDialog.createButton).toBeDisabled();
      });

      test('[C325156] Create a folder with a duplicate name', async ({ personalFiles }) => {
        const snackBar = personalFiles.snackBar;

        await createFolderFromTemplateDialog.createFromTemplateAction(commonFolderName);
        await expect(snackBar.getByMessageLocator(errorStrings.nameAlreadyUsedError)).toBeVisible();
        await expect(createFolderFromTemplateDialog.getDialogTitle(createDialogTitle)).toBeVisible();
      });

      test('[C325155] Cancel folder creation', async () => {
        await expect(createFolderFromTemplateDialog.getDialogTitle(createDialogTitle)).toBeVisible();
        await createFolderFromTemplateDialog.cancelButton.click();
        await expect(createFolderFromTemplateDialog.getDialogTitle(createDialogTitle)).toBeHidden();
      });
    });

    test.describe('Folder created from template on Personal Files', () => {
      test.beforeEach(async ({ personalFiles }) => {
        try {
          randomFolderName = `create-actions-template-${Utils.random()}`;
          randomFolderTitle = `folder-title-${Utils.random()}`;
          randomFolderDescription = `folder-description-${Utils.random()}`;
          createFolderFromTemplateDialog = personalFiles.createFromTemplateDialogComponent;
          await dataTable.getRowByName(templateFolder1).click();
          await selectFolderTemplateDialog.actionButton.click();
        } catch (error) {
          console.error(`Folder created from template on Personal Files, beforeEach failed : ${error}`);
        }
      });

      test('[C325157] Create a folder from a template - with a new Name', async () => {
        await createFolderFromTemplateDialog.createFromTemplateAction(randomFolderName);
        await dataTable.goThroughPagesLookingForRowWithName(randomFolderName);
        await expect(dataTable.getRowByName(randomFolderName)).toBeVisible();

        await dataTable.getRowByName(randomFolderName).dblclick();
        await expect(dataTable.getRowByName(templateSubFolder)).toBeVisible();
        await expect(dataTable.getRowByName(fileInFolder1)).toBeVisible();
      });

      test('[C325154] Create a folder from a template - with a Name, Title and Description', async () => {
        await createFolderFromTemplateDialog.createFromTemplateAction(randomFolderName, randomFolderTitle, randomFolderDescription);
        await dataTable.goThroughPagesLookingForRowWithName(randomFolderName);
        await expect(dataTable.getCellLinkByName(randomFolderName)).toHaveAttribute(titleLabel, randomFolderTitle + `\n` + randomFolderDescription);
      });

      test('[C325158] Trim spaces from folder Name', async () => {
        await createFolderFromTemplateDialog.createFromTemplateAction('   ' + randomFolderName + '   ');
        await dataTable.goThroughPagesLookingForRowWithName(randomFolderName);
        await expect(dataTable.getRowByName(randomFolderName)).toBeVisible();
      });
    });
  });

  test.describe('Folder created from template on Personal Files Libraries', () => {
    const randomLibraryName = `playwright-library-${Utils.random()}`;
    let sitesApi: SitesApi;

    test.beforeAll(async () => {
      try {
        sitesApi = await SitesApi.initialize(username, username);
        await sitesApi.createSite(randomLibraryName);
        const libraryGuId = await sitesApi.getDocLibId(randomLibraryName);
        await nodesApi.createFolder(commonFolderName, libraryGuId);
      } catch (error) {
        console.error(`Folder created from template on Personal Files Libraries, beforeAll failed : ${error}`);
      }
    });

    test.beforeEach(async ({ myLibrariesPage }) => {
      try {
        randomFolderName = `create-actions-template-${Utils.random()}`;
        randomFolderTitle = `folder-title-${Utils.random()}`;
        randomFolderDescription = `folder-description-${Utils.random()}`;
        await myLibrariesPage.navigate();
        selectFolderTemplateDialog = myLibrariesPage.contentNodeSelector;
        createFolderFromTemplateDialog = myLibrariesPage.createFromTemplateDialogComponent;
        dataTable = myLibrariesPage.dataTable;
        toolbar = myLibrariesPage.acaHeader;
        await dataTable.goThroughPagesLookingForRowWithName(randomLibraryName);
        await dataTable.getRowByName(randomLibraryName).dblclick();
        await dataTable.spinnerWaitForReload();
        await toolbar.clickCreateFolderFromTemplate();
        await selectFolderTemplateDialog.loadMoreNodes();
        await dataTable.getRowByName(templateFolder1).click();
        await selectFolderTemplateDialog.actionButton.click();
      } catch (error) {
        console.error(`Folder created from template on Personal Files Libraries, beforeEach failed : ${error}`);
      }
    });

    test.afterAll(async () => {
      try {
        await sitesApi.deleteSites([randomLibraryName]);
      } catch (error) {
        console.error(`Folder created from template on Personal Files Libraries, afterAll failed : ${error}`);
      }
    });

    test('[C325161] Create a folder from a template from library - with Name, Title and Description', async () => {
      await createFolderFromTemplateDialog.createFromTemplateAction(randomFolderName, randomFolderTitle, randomFolderDescription);
      await expect
        .soft(dataTable.getCellLinkByName(randomFolderName))
        .toHaveAttribute(titleLabel, randomFolderTitle + `\n` + randomFolderDescription);

      await dataTable.getRowByName(randomFolderName).dblclick();
      await expect(dataTable.getRowByName(templateSubFolder)).toBeVisible();
      await expect(dataTable.getRowByName(fileInFolder1)).toBeVisible();
    });

    test('[C325162] Cancel folder creation in a library', async () => {
      await expect(createFolderFromTemplateDialog.getDialogTitle(createDialogTitle)).toBeVisible();
      await createFolderFromTemplateDialog.cancelButton.click();
      await expect(createFolderFromTemplateDialog.getDialogTitle(createDialogTitle)).toBeHidden();
      await expect(dataTable.getRowByName(randomFolderName)).toBeHidden();
    });

    test('[C325163] Create a folder with a duplicate name in a library', async ({ myLibrariesPage }) => {
      const snackBar = myLibrariesPage.snackBar;

      await createFolderFromTemplateDialog.createFromTemplateAction(commonFolderName);
      await expect(snackBar.getByMessageLocator(errorStrings.nameAlreadyUsedError)).toBeVisible();
      await expect(createFolderFromTemplateDialog.getDialogTitle(createDialogTitle)).toBeVisible();
    });
  });
});
