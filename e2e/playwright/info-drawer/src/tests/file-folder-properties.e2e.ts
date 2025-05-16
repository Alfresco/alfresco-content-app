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
  PersonalFilesPage
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
  const tagsPhraseForDeletion = 'e2e';
  const username = `user-e2e-${Utils.random()}`;
  const manualTagName = `e2e-tag-${Utils.random()}`;
  const FolderC299162 = `C299162-e2e-${Utils.random()}`;
  const FolderC599174 = `C599174-e2e-${Utils.random()}`;
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

      await nodesApi.createFolder(FolderC299162);
      await nodesApi.createFolder(FolderC599174);
      await nodesApi.createFolder(Folder17238);
      await nodesApi.createFolder(Folder17239);
      Folder17240Id = (await nodesApi.createFolder(Folder17240)).entry.id;
      await nodesApi.createFolder(Folder17241);
      Folder17242Id = (await nodesApi.createFolder(Folder17242)).entry.id;
      await nodesApi.createFolder(Folder17243);
      await nodesApi.createFolder(Folder17244);
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

  async function navigateAndOpenInfoDrawer(personalFiles: PersonalFilesPage, folderName: string) {
    await fileActionsApi.waitForNodes(folderName, { expect: 1 });
    await personalFiles.navigate();
    await Utils.reloadPageIfRowNotVisible(personalFiles, folderName);
    await expect(personalFiles.dataTable.getRowByName(folderName)).toBeVisible();
    await personalFiles.dataTable.getRowByName(folderName).click();
    await personalFiles.acaHeader.viewDetails.click();
  }

  test('[XAT-5512] View properties - Default tabs', async ({ personalFiles }) => {
    await navigateAndOpenInfoDrawer(personalFiles, FolderC299162);
    expect(await personalFiles.infoDrawer.getHeaderTitle()).toEqual(FolderC299162);
    await expect(personalFiles.infoDrawer.propertiesTab).toBeVisible();
    await expect(personalFiles.infoDrawer.commentsTab).toBeVisible();
    expect(await personalFiles.infoDrawer.getTabsCount()).toEqual(2);
  });

  test('[XAT-5514] View properties - Should be able to make the folders info drawer expandable as for Sites', async ({ personalFiles }) => {
    await navigateAndOpenInfoDrawer(personalFiles, FolderC599174);
    await personalFiles.infoDrawer.expandDetailsButton.click();
    await expect(personalFiles.infoDrawer.expandedDetailsPermissionsTab).toBeVisible();

    await personalFiles.navigate();
    await expect(personalFiles.dataTable.getRowByName(FolderC599174)).toBeVisible();
    await personalFiles.dataTable.getRowByName(FolderC599174).click({ button: 'right' });
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
