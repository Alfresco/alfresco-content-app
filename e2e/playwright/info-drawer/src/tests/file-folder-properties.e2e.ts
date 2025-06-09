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
  TEST_FILES
} from '@alfresco/aca-playwright-shared';

test.describe('Info Drawer - File Folder Properties', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let fileActionsApi: FileActionsApi;
  let tagsApi: TagsApi;
  let categoriesApi: CategoriesApi;
  let responseCategoryId: string;
  let responseTagsId: string;
  let Folder17240Id: string;
  let Folder17242Id: string;
  let Folder5513Id: string;
  let Folder5516Id: string;
  const tagsPhraseForDeletion = 'e2e';
  const username = `user-e2e-${Utils.random()}`;
  const manualTagName = `e2e-tag-${Utils.random()}`;
  const Folder5512 = `xat-5512-e2e-${Utils.random()}`;
  const Folder5513 = `xat-5513-e2e-${Utils.random()}`;
  const Folder5514 = `xat-5514-e2e-${Utils.random()}`;
  const Folder5516 = `xat-5516-e2e-${Utils.random()}`;
  const File5516 = `xat-5516-e2e-${Utils.random()}`;
  const Folder17238 = `xat-17238-e2e-${Utils.random()}`;
  const Folder17239 = `xat-17239-e2e-${Utils.random()}`;
  const Folder17240 = `xat-17240-e2e-${Utils.random()}`;
  const Folder17241 = `xat-17241-e2e-${Utils.random()}`;
  const Folder17242 = `xat-17242-e2e-${Utils.random()}`;
  const Folder17243 = `xat-17243-e2e-${Utils.random()}`;
  const Folder17244 = `xat-17244-e2e-${Utils.random()}`;
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

      await nodesApi.createFolder(Folder5512);
      Folder5513Id = (await nodesApi.createFolder(Folder5513)).entry.id;
      await nodesApi.createFolder(Folder5514);
      Folder5516Id = (await nodesApi.createFolder(Folder5516)).entry.id;
      await nodesApi.createFolder(Folder17238);
      await nodesApi.createFolder(Folder17239);
      Folder17240Id = (await nodesApi.createFolder(Folder17240)).entry.id;
      await nodesApi.createFolder(Folder17241);
      Folder17242Id = (await nodesApi.createFolder(Folder17242)).entry.id;
      await nodesApi.createFolder(Folder17243);
      await nodesApi.createFolder(Folder17244);

      const Folder5513BodyUpdate = {
        properties: {
          'cm:title': '1234',
          'cm:description': '123',
          'cm:author': '123'
        }
      };

      await nodesApi.updateNode(Folder5513Id, Folder5513BodyUpdate);
      await fileActionsApi.uploadFileWithRename(TEST_FILES.JPG_FILE.path, File5516, Folder5516Id);
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
  }

  test('[XAT-5512] View properties - Default tabs', async ({ personalFiles }) => {
    await navigateAndOpenInfoDrawer(personalFiles, Folder5512);
    expect(await personalFiles.infoDrawer.getHeaderTitle()).toEqual(Folder5512);
    await expect(personalFiles.infoDrawer.propertiesTab).toBeVisible();
    await expect(personalFiles.infoDrawer.commentsTab).toBeVisible();
    expect(await personalFiles.infoDrawer.getTabsCount()).toEqual(2);
  });

  test('[XAT-5513] View file properties - General Info fields', async ({ personalFiles }) => {
    const generalInfoProperties = ['Name', 'Title', 'Creator', 'Created Date', 'Modifier', 'Modified Date', 'Author', 'Description', 'Content Type'];
    await navigateAndOpenInfoDrawer(personalFiles, Folder5513);
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
    await navigateAndOpenInfoDrawer(personalFiles, File5516, Folder5516Id);
    await expect(personalFiles.infoDrawer.exifInfoProperties.first()).not.toBeInViewport();
    await personalFiles.infoDrawer.exifInfoAccordion.click();
    await expect(personalFiles.infoDrawer.exifInfoProperties.first()).toBeInViewport();
    const getPropertiesText = (await personalFiles.infoDrawer.exifInfoProperties.allTextContents()).join('');
    for (const property of imageExifProperties) {
      expect(getPropertiesText).toContain(property);
    }
  });

  test('[XAT-5514] View properties - Should be able to make the folders info drawer expandable as for Sites', async ({ personalFiles }) => {
    await navigateAndOpenInfoDrawer(personalFiles, Folder5514);
    await personalFiles.infoDrawer.expandDetailsButton.click();
    await expect(personalFiles.infoDrawer.expandedDetailsPermissionsTab).toBeVisible();

    await personalFiles.navigate();
    await expect(personalFiles.dataTable.getRowByName(Folder5514)).toBeVisible();
    await personalFiles.dataTable.getRowByName(Folder5514).click({ button: 'right' });
    await personalFiles.pagination.clickMenuItem('Permissions');
    await expect(personalFiles.infoDrawer.expandedDetailsPermissionsTab).toBeVisible();
  });

  test('[XAT-17238] State for no tags and categories - accordion expanded', async ({ personalFiles }) => {
    await navigateAndOpenInfoDrawer(personalFiles, Folder17238);
    await personalFiles.infoDrawer.tagsAccordion.click();
    await expect(personalFiles.infoDrawer.tagsAccordion).toContainText(noTagsText);

    await personalFiles.infoDrawer.categoriesAccordion.click();
    await expect(personalFiles.infoDrawer.categoriesAccordion).toContainText(noCategoriesText);
  });

  test('[XAT-17239] Add a new tag to a node', async ({ personalFiles }) => {
    await navigateAndOpenInfoDrawer(personalFiles, Folder17239);
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
    await fileActionsApi.waitForNodes(Folder17240, { expect: 1 });
    await tagsApi.assignTagToNode(Folder17240Id, tagBody);
    await expect(async () => {
      expect((await tagsApi.listTagsForNode(Folder17240Id)).list.entries.length).toEqual(1);
    }).toPass({
      intervals: [1_000],
      timeout: 10_000
    });
    await personalFiles.navigate();
    await Utils.reloadPageIfRowNotVisible(personalFiles, Folder17240);
    await expect(personalFiles.dataTable.getRowByName(Folder17240)).toBeVisible();
    await personalFiles.dataTable.getRowByName(Folder17240).click();
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
    await fileActionsApi.waitForNodes(Folder17243, { expect: 1 });
    await personalFiles.navigate();
    await Utils.reloadPageIfRowNotVisible(personalFiles, Folder17243);
    await expect(personalFiles.dataTable.getRowByName(Folder17243)).toBeVisible();
    await personalFiles.dataTable.getRowByName(Folder17243).click();
    await personalFiles.acaHeader.viewDetails.click();

    await personalFiles.infoDrawer.tagsAccordionPenButton.click();
    await personalFiles.infoDrawer.tagsInput.fill(manualTagName);
    await personalFiles.infoDrawer.tagsAccordionCancelButton.click();
    await expect(personalFiles.infoDrawer.tagsAccordionPenButton).toBeVisible();
    await expect(personalFiles.infoDrawer.tagsAccordion).toContainText(noTagsText);
  });

  test('[XAT-17241] Add a new category to a node', async ({ personalFiles }) => {
    await navigateAndOpenInfoDrawer(personalFiles, Folder17241);
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
    await fileActionsApi.waitForNodes(Folder17242, { expect: 1 });
    await categoriesApi.linkNodeToCategory(Folder17242Id, [{ categoryId: responseCategoryId }]);
    await personalFiles.navigate();
    await Utils.reloadPageIfRowNotVisible(personalFiles, Folder17242);
    await expect(personalFiles.dataTable.getRowByName(Folder17242)).toBeVisible();
    await personalFiles.dataTable.getRowByName(Folder17242).click();
    await personalFiles.acaHeader.viewDetails.click();

    await personalFiles.infoDrawer.categoriesAccordion.click();
    await expect(personalFiles.infoDrawer.categoriesAccordion).not.toContainText(noCategoriesText);
    await personalFiles.infoDrawer.categoriesAccordionPenButton.click();
    await personalFiles.infoDrawer.categoriesItemRemoveButton.first().click();
    await personalFiles.infoDrawer.categoriesAccordionConfirmButton.click();
    await expect(personalFiles.infoDrawer.categoriesAccordion).toContainText(noCategoriesText);
  });

  test('[XAT-17244] Cancel adding a category to a node', async ({ personalFiles }) => {
    await navigateAndOpenInfoDrawer(personalFiles, Folder17244);
    await personalFiles.infoDrawer.categoriesAccordionPenButton.click();
    await personalFiles.infoDrawer.categoriesInput.click();
    await personalFiles.infoDrawer.categoriesInput.fill('*');
    await personalFiles.infoDrawer.categoriesListItems.first().click();
    await personalFiles.infoDrawer.categoriesAccordionCancelButton.click();
    await expect(personalFiles.infoDrawer.categoriesAccordion).toContainText(noCategoriesText);
  });
});
