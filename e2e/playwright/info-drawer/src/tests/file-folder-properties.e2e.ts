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
  ApiClientFactory,
  Utils,
  test,
  TrashcanApi,
  NodesApi,
  FileActionsApi,
  TagsApi,
  CategoriesApi,
  PersonalFilesPage,
  TEST_FILES,
  timeouts
} from '@alfresco/aca-playwright-shared';

test.describe('Info Drawer - file folder Properties', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let fileActionsApi: FileActionsApi;
  let tagsApi: TagsApi;
  let categoriesApi: CategoriesApi;
  let responseCategoryId: string;
  let responseTagsId: string;
  let folder17240Id: string;
  let folder17242Id: string;
  let folder5513Id: string;
  let folder5516Id: string;
  let propertiesFolderId: string;
  const tagsPhraseForDeletion = 'e2e';
  const username = `user-e2e-${Utils.random()}`;
  const manualTagName = `e2e-tag-${Utils.random()}`;
  const folder5512 = `xat-5512-e2e-${Utils.random()}`;
  const folder5513 = `xat-5513-e2e-${Utils.random()}`;
  const folder5514 = `xat-5514-e2e-${Utils.random()}`;
  const folder5516 = `xat-5516-e2e-${Utils.random()}`;
  const propertiesFolder = `properties-folder-${Utils.random()}`;
  const file5516 = `xat-5516-e2e-${Utils.random()}.jpg`;
  const folder17238 = `xat-17238-e2e-${Utils.random()}`;
  const folder17239 = `xat-17239-e2e-${Utils.random()}`;
  const folder17240 = `xat-17240-e2e-${Utils.random()}`;
  const folder17241 = `xat-17241-e2e-${Utils.random()}`;
  const folder17242 = `xat-17242-e2e-${Utils.random()}`;
  const folder17243 = `xat-17243-e2e-${Utils.random()}`;
  const folder17244 = `xat-17244-e2e-${Utils.random()}`;
  const nodePropertiesDocx = `docx-${Utils.random()}`;
  const nodePropertiesJpg = `jpg-${Utils.random()}`;
  const nodePropertiesFolder = `folder-${Utils.random()}`;
  const nodeEditPropertiesFolder = `folder-${Utils.random()}`;
  const tagBody = { tag: `e2e-${Utils.random()}` };
  const categoryName = Utils.random();
  const noCategoriesText = 'There are currently no categories added';
  const noTagsText = 'There are currently no tags added';

  async function createCategoryGetId(): Promise<string> {
    const createdCategory = await categoriesApi.createCategory(`-root-`, [{ name: categoryName }]);
    if ('entry' in createdCategory) {
      return createdCategory.entry.id;
    } else {
      console.error('Unexpected response format:', createdCategory);
      return null;
    }
  }

  async function createTagGetId(): Promise<string> {
    const createdTag = await tagsApi.createTags([tagBody]);
    if ('entry' in createdTag) {
      return (createdTag as { entry: { id: string } }).entry.id;
    } else {
      console.error('Unexpected response format:', createdTag);
      return null;
    }
  }

  async function checkNodeFields(personalFiles: PersonalFilesPage, isFolder?: 'isFolder'): Promise<void> {
    await personalFiles.infoDrawer.generalInfoEditButton.click();
    await expect(personalFiles.infoDrawer.generalInfoNameField).toBeEditable();
    await expect(personalFiles.infoDrawer.generalInfoAuthorField).toBeEditable();
    await expect(personalFiles.infoDrawer.generalInfoDescriptionField).toBeEditable();
    await expect(personalFiles.infoDrawer.generalInfoTitleField).toBeEditable();
    await expect(personalFiles.infoDrawer.generalInfoCreatorField).toBeDisabled();
    await expect(personalFiles.infoDrawer.generalInfoCreatedDateField).toContainClass('adf-property-readonly-value');
    await expect(personalFiles.infoDrawer.generalInfoModifiedDateField).toContainClass('adf-property-readonly-value');
    await expect(personalFiles.infoDrawer.generalInfoContentTypeCombobox).toBeEditable();
    if (!isFolder) {
      await expect(personalFiles.infoDrawer.generalInfoMimeTypeField).toBeDisabled();
    }
  }

  async function navigateAndOpenInfoDrawer(personalFiles: PersonalFilesPage, nodeName: string, subFolderId?: string) {
    await fileActionsApi.waitForNodes(nodeName, { expect: 1 });
    if (subFolderId) {
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${subFolderId}` });
    } else {
      await personalFiles.navigate();
    }
    await Utils.reloadPageIfRowNotVisible(personalFiles, nodeName);
    await expect(personalFiles.dataTable.getRowByName(nodeName)).toBeVisible();
    await personalFiles.dataTable.getRowByName(nodeName).click();
    await personalFiles.acaHeader.viewDetails.click();
    await personalFiles.infoDrawer.propertiesTab.waitFor({ timeout: timeouts.medium });
  }

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      fileActionsApi = await FileActionsApi.initialize(username, username);
      tagsApi = await TagsApi.initialize('admin');
      categoriesApi = await CategoriesApi.initialize('admin');
      responseCategoryId = await createCategoryGetId();
      responseTagsId = await createTagGetId();

      if (responseCategoryId === null || responseTagsId === null) {
        throw new Error('Failed to create category or tag - check API manually');
      }

      await nodesApi.createFolder(folder5512);
      folder5513Id = (await nodesApi.createFolder(folder5513)).entry.id;
      await nodesApi.createFolder(folder5514);
      folder5516Id = (await nodesApi.createFolder(folder5516)).entry.id;
      await nodesApi.createFolder(folder17238);
      await nodesApi.createFolder(folder17239);
      folder17240Id = (await nodesApi.createFolder(folder17240)).entry.id;
      await nodesApi.createFolder(folder17241);
      folder17242Id = (await nodesApi.createFolder(folder17242)).entry.id;
      await nodesApi.createFolder(folder17243);
      await nodesApi.createFolder(folder17244);
      propertiesFolderId = (await nodesApi.createFolder(propertiesFolder)).entry.id;

      const folder5513BodyUpdate = {
        properties: {
          'cm:title': '1234',
          'cm:description': '123',
          'cm:author': '123'
        }
      };

      await nodesApi.updateNode(folder5513Id, folder5513BodyUpdate);
      await fileActionsApi.uploadFileWithRename(TEST_FILES.JPG_FILE.path, file5516, folder5516Id);
      await fileActionsApi.uploadFileWithRename(TEST_FILES.JPG_FILE.path, nodePropertiesJpg, propertiesFolderId);
      await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, nodePropertiesDocx, propertiesFolderId);
      await nodesApi.createFolder(nodePropertiesFolder, propertiesFolderId);
      await nodesApi.createFolder(nodeEditPropertiesFolder, propertiesFolderId);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    await categoriesApi.deleteCategory(responseCategoryId);
    await tagsApi.deleteTagsByTagName(tagsPhraseForDeletion);
  });

  test('[XAT-5512] View properties - Default tabs', async ({ personalFiles }) => {
    await navigateAndOpenInfoDrawer(personalFiles, folder5512);
    expect(await personalFiles.infoDrawer.getHeaderTitle()).toEqual(folder5512);
    await expect(personalFiles.infoDrawer.propertiesTab).toBeVisible();
    await expect(personalFiles.infoDrawer.commentsTab).toBeVisible();
    expect(await personalFiles.infoDrawer.getTabsCount()).toEqual(2);
  });

  test('[XAT-5513] View file properties - General Info fields', async ({ personalFiles }) => {
    const generalInfoProperties = ['Name', 'Title', 'Creator', 'Created Date', 'Modifier', 'Modified Date', 'Author', 'Description', 'Content Type'];
    await navigateAndOpenInfoDrawer(personalFiles, folder5513);
    await expect(personalFiles.infoDrawer.generalInfoProperties.first()).not.toBeInViewport();
    await personalFiles.infoDrawer.generalInfoAccordion.click();
    await expect(personalFiles.infoDrawer.generalInfoProperties.first()).toBeInViewport();
    const getPropertiesText = (await personalFiles.infoDrawer.generalInfoProperties.allTextContents()).join('');
    for (const property of generalInfoProperties) {
      expect(getPropertiesText).toContain(property);
    }
  });

  test('[XAT-5516] View image properties', async ({ personalFiles }) => {
    const imageExifProperties = ['Image Width', 'Image Height'];
    await navigateAndOpenInfoDrawer(personalFiles, file5516, folder5516Id);
    await expect(personalFiles.infoDrawer.exifInfoProperties.first()).not.toBeInViewport();
    await personalFiles.infoDrawer.exifInfoAccordion.click();
    await expect(personalFiles.infoDrawer.exifInfoProperties.first()).toBeInViewport();
    const getPropertiesText = (await personalFiles.infoDrawer.exifInfoProperties.allTextContents()).join('');
    for (const property of imageExifProperties) {
      expect(getPropertiesText).toContain(property);
    }
  });

  test('[XAT-5514] View properties - Should be able to make the folders info drawer expandable as for Sites', async ({ personalFiles }) => {
    await navigateAndOpenInfoDrawer(personalFiles, folder5514);
    await personalFiles.infoDrawer.expandDetailsButton.click();
    await expect(personalFiles.infoDrawer.expandedDetailsPermissionsTab).toBeVisible();

    await personalFiles.navigate();
    await expect(personalFiles.dataTable.getRowByName(folder5514)).toBeVisible();
    await personalFiles.dataTable.getRowByName(folder5514).click({ button: 'right' });
    await personalFiles.pagination.clickMenuItem('Permissions');
    await expect(personalFiles.infoDrawer.expandedDetailsPermissionsTab).toBeVisible();
  });

  test('[XAT-5517] Editable / read-only properties for a document', async ({ personalFiles }) => {
    await navigateAndOpenInfoDrawer(personalFiles, nodePropertiesDocx, propertiesFolderId);
    await checkNodeFields(personalFiles);
  });

  test('[XAT-5518] Editable / read-only properties for an image', async ({ personalFiles }) => {
    await navigateAndOpenInfoDrawer(personalFiles, nodePropertiesJpg, propertiesFolderId);
    await checkNodeFields(personalFiles);
  });

  test('[XAT-5519] Editable / read-only properties for a folder', async ({ personalFiles }) => {
    await navigateAndOpenInfoDrawer(personalFiles, nodePropertiesFolder, propertiesFolderId);
    await checkNodeFields(personalFiles, 'isFolder');
  });

  test('[XAT-5520] Special characters in "Name" field', async ({ personalFiles }) => {
    const specialCharacters = ['"', '*', '\\', '/', '?', ':', '|'];
    await navigateAndOpenInfoDrawer(personalFiles, nodePropertiesFolder, propertiesFolderId);
    await personalFiles.infoDrawer.generalInfoEditButton.click();
    for (const specialCharacter of specialCharacters) {
      await personalFiles.infoDrawer.generalInfoNameField.fill('Test');
      await expect(personalFiles.infoDrawer.generalInfoNameError).toBeHidden();
      await personalFiles.infoDrawer.generalInfoNameField.fill('Test' + specialCharacter);
      await expect(personalFiles.infoDrawer.generalInfoNameError).toBeVisible();
    }
  });

  test('[XAT-5521] Edit file properties with success', async ({ personalFiles }) => {
    const newFolderName = `Test-${Utils.random()}`;
    await navigateAndOpenInfoDrawer(personalFiles, nodeEditPropertiesFolder, propertiesFolderId);
    const nameBefore = await personalFiles.infoDrawer.generalInfoNameField.inputValue();
    await personalFiles.infoDrawer.generalInfoEditButton.click();
    await personalFiles.infoDrawer.generalInfoNameField.click();
    await personalFiles.infoDrawer.generalInfoNameField.fill(newFolderName);
    await personalFiles.infoDrawer.generalInfoSaveButton.click();
    await personalFiles.page.reload({ waitUntil: 'load' });
    await expect(personalFiles.dataTable.getRowByName(newFolderName)).toBeVisible();
    await expect(personalFiles.dataTable.getRowByName(nameBefore)).toBeHidden();
  });

  test('[XAT-17238] State for no tags and categories - accordion expanded', async ({ personalFiles }) => {
    await navigateAndOpenInfoDrawer(personalFiles, folder17238);
    await personalFiles.infoDrawer.tagsAccordion.click();
    await expect(personalFiles.infoDrawer.tagsAccordion).toContainText(noTagsText);

    await personalFiles.infoDrawer.categoriesAccordion.click();
    await expect(personalFiles.infoDrawer.categoriesAccordion).toContainText(noCategoriesText);
  });

  test('[XAT-17239] Add a new tag to a node', async ({ personalFiles }) => {
    await navigateAndOpenInfoDrawer(personalFiles, folder17239);
    await personalFiles.infoDrawer.tagsAccordionPenButton.click();
    await expect(personalFiles.infoDrawer.tagsAccordionPenButton).toBeHidden();
    await expect(personalFiles.infoDrawer.tagsAccordionCancelButton).toBeEnabled();
    await expect(personalFiles.infoDrawer.tagsAccordionConfirmButton).toBeDisabled();
    await personalFiles.infoDrawer.tagsInput.fill(manualTagName);
    await personalFiles.infoDrawer.createTagButton.click();
    await expect(personalFiles.infoDrawer.tagsChips.first()).toContainText(manualTagName);
    await expect(personalFiles.infoDrawer.tagsChipsXButton.first()).toBeVisible();
    await personalFiles.infoDrawer.tagsAccordionConfirmButton.click();
    await expect(personalFiles.infoDrawer.tagsChipsXButton.first()).toBeHidden();
    await expect(personalFiles.infoDrawer.tagsAccordionPenButton).toBeVisible();
  });

  test('[XAT-17240] Remove a tag from a node', async ({ personalFiles }) => {
    await fileActionsApi.waitForNodes(folder17240, { expect: 1 });
    await tagsApi.assignTagToNode(folder17240Id, tagBody);
    await expect(async () => {
      expect((await tagsApi.listTagsForNode(folder17240Id)).list.entries.length).toEqual(1);
    }).toPass({
      intervals: [1_000],
      timeout: timeouts.large
    });
    await personalFiles.navigate();
    await Utils.reloadPageIfRowNotVisible(personalFiles, folder17240);
    await expect(personalFiles.dataTable.getRowByName(folder17240)).toBeVisible();
    await personalFiles.dataTable.getRowByName(folder17240).click();
    await personalFiles.acaHeader.viewDetails.click();

    await personalFiles.infoDrawer.tagsAccordion.click();
    await expect(personalFiles.infoDrawer.tagsChipsXButton.first()).toBeHidden();
    await personalFiles.infoDrawer.tagsAccordionPenButton.click();
    await personalFiles.infoDrawer.tagsChipsXButton.first().click();
    await personalFiles.infoDrawer.tagsAccordionConfirmButton.click();
    await expect(personalFiles.infoDrawer.tagsChips.first()).toBeHidden();
    await expect(personalFiles.infoDrawer.tagsAccordion).toContainText(noTagsText);
  });

  test('[XAT-17243] Cancel adding a tag to a node', async ({ personalFiles }) => {
    await fileActionsApi.waitForNodes(folder17243, { expect: 1 });
    await personalFiles.navigate();
    await Utils.reloadPageIfRowNotVisible(personalFiles, folder17243);
    await expect(personalFiles.dataTable.getRowByName(folder17243)).toBeVisible();
    await personalFiles.dataTable.getRowByName(folder17243).click();
    await personalFiles.acaHeader.viewDetails.click();

    await personalFiles.infoDrawer.tagsAccordionPenButton.click();
    await personalFiles.infoDrawer.tagsInput.fill(manualTagName);
    await personalFiles.infoDrawer.tagsAccordionCancelButton.click();
    await expect(personalFiles.infoDrawer.tagsAccordionPenButton).toBeVisible();
    await expect(personalFiles.infoDrawer.tagsAccordion).toContainText(noTagsText);
  });

  test('[XAT-17241] Add a new category to a node', async ({ personalFiles }) => {
    await navigateAndOpenInfoDrawer(personalFiles, folder17241);
    await personalFiles.infoDrawer.categoriesAccordionPenButton.click();
    await expect(personalFiles.infoDrawer.categoriesAccordionPenButton).toBeHidden();
    await expect(personalFiles.infoDrawer.categoriesAccordionCancelButton).toBeEnabled();
    await expect(personalFiles.infoDrawer.categoriesAccordionConfirmButton).toBeDisabled();
    await personalFiles.infoDrawer.categoriesInput.fill('*');
    await personalFiles.infoDrawer.categoriesListItems.first().click();
    await expect(personalFiles.infoDrawer.categoriesItemRemoveButton.first()).toBeVisible();
    await personalFiles.infoDrawer.categoriesAccordionConfirmButton.click();
    await expect(personalFiles.infoDrawer.tagsChipsXButton.first()).toBeHidden();
    await expect(personalFiles.infoDrawer.tagsAccordionPenButton).toBeVisible();
    await expect(personalFiles.infoDrawer.categoriesAccordion).not.toContainText(noCategoriesText);
    await expect(personalFiles.infoDrawer.categoriesCreatedList.first()).toBeVisible();
  });

  test('[XAT-17242] Remove a category from a node', async ({ personalFiles }) => {
    await fileActionsApi.waitForNodes(folder17242, { expect: 1 });
    await categoriesApi.linkNodeToCategory(folder17242Id, [{ categoryId: responseCategoryId }]);
    await personalFiles.navigate();
    await Utils.reloadPageIfRowNotVisible(personalFiles, folder17242);
    await expect(personalFiles.dataTable.getRowByName(folder17242)).toBeVisible();
    await personalFiles.dataTable.getRowByName(folder17242).click();
    await personalFiles.acaHeader.viewDetails.click();

    await personalFiles.infoDrawer.categoriesAccordion.click();
    await expect(personalFiles.infoDrawer.categoriesAccordion).not.toContainText(noCategoriesText);
    await personalFiles.infoDrawer.categoriesAccordionPenButton.click();
    await personalFiles.infoDrawer.categoriesItemRemoveButton.first().click();
    await personalFiles.infoDrawer.categoriesAccordionConfirmButton.click();
    await expect(personalFiles.infoDrawer.categoriesAccordion).toContainText(noCategoriesText);
  });

  test('[XAT-17244] Cancel adding a category to a node', async ({ personalFiles }) => {
    await navigateAndOpenInfoDrawer(personalFiles, folder17244);
    await personalFiles.infoDrawer.categoriesAccordionPenButton.click();
    await personalFiles.infoDrawer.categoriesInput.click();
    await personalFiles.infoDrawer.categoriesInput.fill('*');
    await personalFiles.infoDrawer.categoriesListItems.first().click();
    await personalFiles.infoDrawer.categoriesAccordionCancelButton.click();
    await expect(personalFiles.infoDrawer.categoriesAccordion).toContainText(noCategoriesText);
  });
});
