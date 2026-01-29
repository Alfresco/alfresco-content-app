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

import { ApiClientFactory, test, Utils, NodesApi, TrashcanApi, ActionType, RulesApi, Field, Comparator } from '@alfresco/aca-playwright-shared';
import { expect } from '@playwright/test';

test.use({ launchOptions: { slowMo: 300 } });

test.describe('Rules - Manage Rules', () => {
  const apiClientFactory = new ApiClientFactory();
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let rulesApi: RulesApi;
  const username = `user-e2e-${Utils.random()}`;
  const folderName897_1 = `folder-XAT-897-1-${Utils.random()}`;
  const folderName897_2 = `folder-XAT-897-2-${Utils.random()}`;
  const randomFolderName1 = `folder-name-${Utils.random()}`;
  const randomRuleName897 = `playwright-rule-897-${Utils.random()}`;
  const randomRuleName898 = `playwright-rule-898-${Utils.random()}`;
  const randomRuleName899 = `playwright-rule-899-${Utils.random()}`;
  const randomRuleName900 = `playwright-rule-900-${Utils.random()}`;
  const randomRuleName901 = `playwright-rule-901-${Utils.random()}`;
  const randomRuleName902 = `playwright-rule-902-${Utils.random()}`;
  const randomRuleName903 = `playwright-rule-903-${Utils.random()}`;

  let folderName897Id1: string;
  let folderName897Id2: string;
  let randomFolderId: string;

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
    folderName897Id1 = (await nodesApi.createFolder(folderName897_1)).entry.id;
    folderName897Id2 = (await nodesApi.createFolder(folderName897_2)).entry.id;
    randomFolderId = (await nodesApi.createFolder(randomFolderName1)).entry.id;

    await rulesApi.createRuleWithDestinationFolder(folderName897Id1, randomRuleName897, 'move', folderName897Id2);
    await rulesApi.createRandomRule(randomFolderId, randomRuleName898);
    await rulesApi.createRandomRuleWithMultipleActions(randomFolderId, randomRuleName899, 3);
    await rulesApi.createRuleWithRandomAspects(randomFolderId, randomRuleName900);
    await rulesApi.createRandomRuleWithMultipleActions(randomFolderId, randomRuleName901, 3);
    await rulesApi.createRandomRule(randomFolderId, randomRuleName902);
    await rulesApi.createRandomRuleWithMultipleConditions(randomFolderId, randomRuleName903, 3);

    await nodesApi.deleteNodeById(folderName897Id2);
  });

  test.beforeEach(async ({ personalFiles, loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    await personalFiles.navigate();
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[XAT-897] Update a rule which has an error in its action', async ({ personalFiles, nodesPage }) => {
    await personalFiles.dataTable.performActionFromExpandableMenu(folderName897_1, 'Manage rules');
    await nodesPage.manageRules.turnOffRuleToggle();
    await nodesPage.manageRules.ruleDetailsEditButton.click();
    await expect(nodesPage.manageRulesDialog.ruleDisableCheckbox).toBeChecked();
  });

  test('[XAT-898] Cancel updating rule dialog', async ({ personalFiles, nodesPage }) => {
    await personalFiles.dataTable.performActionFromExpandableMenu(randomFolderName1, 'Manage rules');
    await nodesPage.manageRules.ruleDetailsEditButton.click();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill('new name');
    await nodesPage.manageRulesDialog.cancelRuleButton.click();
    await expect(nodesPage.manageRules.getGroupsList(randomRuleName898)).toBeVisible();
  });

  test('[XAT-899] Update rule by removing existing actions', async ({ personalFiles, nodesPage }) => {
    await personalFiles.dataTable.performActionFromExpandableMenu(randomFolderName1, 'Manage rules');
    await nodesPage.manageRules.getGroupsList(randomRuleName899).click();
    await nodesPage.manageRules.ruleDetailsEditButton.click();
    await nodesPage.manageRulesDialog.deleteActions(2);
    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter, 1);
    await nodesPage.manageRulesDialog.createRuleButton.click();
    await nodesPage.manageRulesDialog.createRuleButton.waitFor({ state: 'hidden' });
    await nodesPage.manageRules.getGroupsList(randomRuleName899).click();

    expect(await nodesPage.manageRules.ruleActions.count()).toEqual(2);
  });

  test('[XAT-900] Update a rule by removing existing aspects', async ({ personalFiles, nodesPage }) => {
    await personalFiles.dataTable.performActionFromExpandableMenu(randomFolderName1, 'Manage rules');
    await nodesPage.manageRules.getGroupsList(randomRuleName900).click();
    await nodesPage.manageRules.ruleDetailsEditButton.click();
    await nodesPage.manageRulesDialog.deleteActions(2);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 1);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('History', 1);
    await nodesPage.manageRulesDialog.createRuleButton.click();
    await nodesPage.manageRulesDialog.createRuleButton.waitFor({ state: 'hidden' });
    await nodesPage.manageRules.getGroupsList(randomRuleName900).click();

    expect(await nodesPage.manageRules.ruleActions.count()).toEqual(2);
  });

  test('[XAT-901] Prevent rule updating after clicking on cancel during selecting destination folder', async ({ personalFiles, nodesPage }) => {
    await personalFiles.dataTable.performActionFromExpandableMenu(randomFolderName1, 'Manage rules');
    await nodesPage.manageRules.getGroupsList(randomRuleName901).click();
    await nodesPage.manageRules.ruleDetailsEditButton.click();
    await nodesPage.manageRulesDialog.deleteActions(2);
    await nodesPage.actionsDropdown.selectAction(ActionType.Copy, 1);
    await nodesPage.manageRulesDialog.destinationFolderButton.click();
    await nodesPage.contentNodeSelectorDialog.cancelButton.click();
    await nodesPage.contentNodeSelectorDialog.cancelButton.waitFor({ state: 'hidden' });
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeDisabled();
  });

  test('[XAT-902] Prevent rule updating when required fields are empty', async ({ personalFiles, nodesPage }) => {
    await personalFiles.dataTable.performActionFromExpandableMenu(randomFolderName1, 'Manage rules');
    await nodesPage.manageRules.getGroupsList(randomRuleName902).click();
    await nodesPage.manageRules.ruleDetailsEditButton.click();
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 1);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeDisabled();
  });

  test('[XAT-903] [XAT-904] Edit existing conditions', async ({ personalFiles, nodesPage }) => {
    await personalFiles.dataTable.performActionFromExpandableMenu(randomFolderName1, 'Manage rules');
    await nodesPage.manageRules.getGroupsList(randomRuleName903).click();
    await nodesPage.manageRules.ruleDetailsEditButton.click();
    await nodesPage.manageRulesDialog.deleteConditions(2);
    await nodesPage.conditionsDropdown.addCondition(Field.Size, 'XAT-903', 1, Comparator.Equals);
    await nodesPage.manageRulesDialog.createRuleButton.click();
    await nodesPage.manageRulesDialog.createRuleButton.waitFor({ state: 'hidden' });
    await nodesPage.manageRules.getGroupsList(randomRuleName903).click();
    expect(await nodesPage.manageRules.countConditionsInGroup()).toEqual(2);
  });
});
