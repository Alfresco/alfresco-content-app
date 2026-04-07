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
import { ApiClientFactory, Utils, test, TrashcanApi, NodesApi, FileActionsApi, TagsApi, PersonalFilesPage } from '@alfresco/aca-playwright-shared';

async function navigateAndOpenExpandedInfoDrawer(personalFiles: PersonalFilesPage, folderName: string): Promise<void> {
  await personalFiles.navigate();
  await Utils.reloadPageIfRowNotVisible(personalFiles, folderName);
  await expect(personalFiles.dataTable.getRowByName(folderName)).toBeVisible();
  await personalFiles.dataTable.getRowByName(folderName).click();
  await personalFiles.acaHeader.viewDetails.click();
  await personalFiles.infoDrawer.expandDetailsButton.click();
}

async function openTagsEditMode(personalFiles: PersonalFilesPage): Promise<void> {
  await personalFiles.nodeInfoEditMode.tagsAccordionPenButton.scrollIntoViewIfNeeded();
  await personalFiles.nodeInfoEditMode.tagsAccordionPenButton.click();
}

test.describe('Edit Mode - Tags and Categories', () => {
  const apiClientFactory = new ApiClientFactory();
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let fileActionsApi: FileActionsApi;
  let tagsApi: TagsApi;
  let folder919: string;
  let folder938: string;
  let folder939: string;
  let folder942: string;
  const testRunId = Utils.random();
  const tag938 = `xat-938-${Utils.random()}`;
  const tag939SharedName = `xat-939-${testRunId}`;
  const tag939One = `${tag939SharedName}-1-${Utils.random()}`;
  const tag939Two = `${tag939SharedName}-2-${Utils.random()}`;
  const tag939Three = `${tag939SharedName}-3-${Utils.random()}`;
  const tag942 = `xat-942-${Utils.random()}`;
  const username = `edit-mode-${Utils.random()}`;

  test.beforeAll(async () => {
    try {
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      fileActionsApi = await FileActionsApi.initialize(username, username);
      tagsApi = await TagsApi.initialize('admin');
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
      throw error;
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    for (const tag of [tag938, tag939One, tag939Two, tag939Three]) {
      await tagsApi.deleteTagByTagName(tag);
    }
  });

  test.describe('Edit Mode - XAT-919', () => {
    test.beforeAll(async () => {
      try {
        folder919 = `folder-919-${Utils.random()}`;
        await nodesApi.createFolder(folder919);

        await fileActionsApi.waitForNodes(folder919, { expect: 1 });
      } catch (error) {
        console.error(`beforeAll failed : ${error}`);
        throw error;
      }
    });

    test('[XAT-919] Input fields in edit mode', async ({ personalFiles }) => {
      await navigateAndOpenExpandedInfoDrawer(personalFiles, folder919);
      await personalFiles.nodeInfoEditMode.categoriesAccordionPenButton.scrollIntoViewIfNeeded();
      await personalFiles.nodeInfoEditMode.categoriesAccordionPenButton.click();
      await expect(personalFiles.nodeInfoEditMode.categoriesInput).toBeEnabled();
      await openTagsEditMode(personalFiles);
      await expect(personalFiles.nodeInfoEditMode.tagsInput).toBeEnabled();
    });
  });

  test.describe('Edit Mode - XAT-938', () => {
    test.beforeAll(async () => {
      try {
        folder938 = `folder-938-${Utils.random()}`;
        await nodesApi.createFolder(folder938);
        await tagsApi.createTags(tag938);

        await fileActionsApi.waitForNodes(folder938, { expect: 1 });
      } catch (error) {
        console.error(`beforeAll failed : ${error}`);
        throw error;
      }
    });

    test.afterAll(async () => {
      await tagsApi.deleteTagByTagName(tag938);
    });

    test('[XAT-938] Select an existing tag', async ({ personalFiles }) => {
      await navigateAndOpenExpandedInfoDrawer(personalFiles, folder938);
      await openTagsEditMode(personalFiles);
      await personalFiles.nodeInfoEditMode.tagsInput.fill(tag938);
      await personalFiles.nodeInfoEditMode.existingTags.getByText(tag938).click();
      await personalFiles.nodeInfoEditMode.tagsAccordionConfirmButton.click();
      await expect(personalFiles.nodeInfoEditMode.tagsChips.getByText(tag938)).toBeVisible();
    });
  });

  test.describe('Edit Mode - XAT-939', () => {
    test.beforeAll(async () => {
      try {
        folder939 = `folder-939-${Utils.random()}`;
        await nodesApi.createFolder(folder939);
        await tagsApi.createTags(tag939One, tag939Two, tag939Three);

        await fileActionsApi.waitForNodes(folder939, { expect: 1 });
      } catch (error) {
        console.error(`beforeAll failed : ${error}`);
        throw error;
      }
    });

    test.afterAll(async () => {
      for (const tag of [tag939One, tag939Two, tag939Three]) {
        await tagsApi.deleteTagByTagName(tag);
      }
    });

    test('[XAT-939] List of tags ready to be assigned', async ({ personalFiles }) => {
      await navigateAndOpenExpandedInfoDrawer(personalFiles, folder939);
      await openTagsEditMode(personalFiles);
      await personalFiles.nodeInfoEditMode.tagsInput.fill(tag939SharedName);
      await personalFiles.nodeInfoEditMode.existingTags.first().waitFor();
      expect(await personalFiles.nodeInfoEditMode.existingTags.count()).toEqual(3);
    });
  });

  test.describe('Edit Mode - XAT-942', () => {
    test.beforeAll(async () => {
      try {
        folder942 = `folder-942-${Utils.random()}`;
        await nodesApi.createFolder(folder942);

        await fileActionsApi.waitForNodes(folder942, { expect: 1 });
      } catch (error) {
        console.error(`beforeAll failed : ${error}`);
        throw error;
      }
    });

    test.afterAll(async () => {
      await tagsApi.deleteTagByTagName(tag942);
    });

    test('[XAT-942] Creating tags in edit mode', async ({ personalFiles }) => {
      await navigateAndOpenExpandedInfoDrawer(personalFiles, folder942);
      await openTagsEditMode(personalFiles);
      await personalFiles.nodeInfoEditMode.tagsInput.fill(tag942);
      await personalFiles.nodeInfoEditMode.createTagButton.click();
      await personalFiles.nodeInfoEditMode.tagsChips.getByText(tag942).click();
      await personalFiles.nodeInfoEditMode.tagsAccordionConfirmButton.click();
      await expect(personalFiles.nodeInfoEditMode.tagsChips.getByText(tag942)).toBeVisible();
    });
  });
});
