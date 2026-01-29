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

import { ApiClientFactory, test, Utils, NodesApi, TrashcanApi, RulesApi } from '@alfresco/aca-playwright-shared';
import { expect } from '@playwright/test';

test.use({ launchOptions: { slowMo: 300 } });

test.describe('Rules - Manage Rules', () => {
  const apiClientFactory = new ApiClientFactory();
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let rulesApi: RulesApi;
  const username = `user-e2e-${Utils.random()}`;
  const randomFolderName = `folder-name-${Utils.random()}`;
  const folderName906_1 = `folder-XAT-906-1-${Utils.random()}`;
  const folderName906_2 = `folder-XAT-906-2-${Utils.random()}`;
  const randomRuleName905 = `playwright-rule-905-${Utils.random()}`;
  const randomRuleName906 = `playwright-rule-906-${Utils.random()}`;
  const randomRuleName907 = `playwright-rule-907-${Utils.random()}`;
  const randomRuleName908 = `playwright-rule-908-${Utils.random()}`;

  let randomFolderId: string;
  let folderName906Id1: string;
  let folderName906Id2: string;

  test.beforeAll(async () => {
    try {
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      rulesApi = await RulesApi.initialize(username, username);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }

    await apiClientFactory.setUpAcaBackend(username, username);
    randomFolderId = (await nodesApi.createFolder(randomFolderName)).entry.id;
    folderName906Id1 = (await nodesApi.createFolder(folderName906_1)).entry.id;
    folderName906Id2 = (await nodesApi.createFolder(folderName906_2)).entry.id;
    await rulesApi.createRandomRule(randomFolderId, randomRuleName905);
    await rulesApi.createRuleWithDestinationFolder(folderName906Id1, randomRuleName906, 'move', folderName906Id2);
    await nodesApi.deleteNodeById(folderName906Id2);
    await rulesApi.createRandomRule(randomFolderId, randomRuleName907);
    await rulesApi.createRandomComplexRule(randomFolderId, randomRuleName908, 3, 3, 'desc908');
  });

  test.beforeEach(async ({ personalFiles, loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    await personalFiles.navigate();
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[XAT-905] Delete a rule', async ({ personalFiles, nodesPage }) => {
    await personalFiles.dataTable.performActionFromExpandableMenu(randomFolderName, 'Manage rules');
    await nodesPage.manageRules.getGroupsList(randomRuleName905).click();
    await nodesPage.manageRules.ruleDetailsDeleteButton.click();
    await personalFiles.confirmDialog.okButton.click();
    await expect(nodesPage.manageRules.getGroupsList(randomRuleName905)).toBeHidden();
  });

  test('[XAT-906] Delete a rule which has a broken/errored rule action', async ({ personalFiles, nodesPage }) => {
    await personalFiles.dataTable.performActionFromExpandableMenu(folderName906_1, 'Manage rules');
    await nodesPage.manageRules.getGroupsList(randomRuleName906).click();
    await nodesPage.manageRules.ruleDetailsDeleteButton.click();
    await personalFiles.confirmDialog.okButton.click();
    await expect(nodesPage.manageRules.getGroupsList(randomRuleName906)).toBeHidden();
  });

  test('[XAT-907] Cancel deleting a rule', async ({ personalFiles, nodesPage }) => {
    await personalFiles.dataTable.performActionFromExpandableMenu(randomFolderName, 'Manage rules');
    await nodesPage.manageRules.getGroupsList(randomRuleName907).click();
    await nodesPage.manageRules.ruleDetailsDeleteButton.click();
    await personalFiles.confirmDialog.cancelButton.click();
    await expect(nodesPage.manageRules.getGroupsList(randomRuleName907)).toBeVisible();
  });

  test('[XAT-908] [XAT-909] View existing rules', async ({ personalFiles, nodesPage }) => {
    await personalFiles.dataTable.performActionFromExpandableMenu(randomFolderName, 'Manage rules');
    await nodesPage.manageRules.getGroupsList(randomRuleName908).click();
    expect(await nodesPage.manageRules.ruleActions.count()).toEqual(3);
    expect(await nodesPage.manageRules.countConditionsInGroup()).toEqual(3);
    expect(await nodesPage.manageRules.ruleDescription.textContent()).toContain('desc908');
  });
});
