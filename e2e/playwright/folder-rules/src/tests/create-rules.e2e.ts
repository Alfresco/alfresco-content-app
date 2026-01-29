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
import { ActionType, ApiClientFactory, test, Utils, TrashcanApi, NodesApi, Comparator, Field } from '@alfresco/aca-playwright-shared';

test.use({ launchOptions: { slowMo: 300 } });

test.describe('Folder Rules Actions', () => {
  const apiClientFactory = new ApiClientFactory();
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  const username = `user-e2e-${Utils.random()}`;
  const randomFolderName1 = `folder-name-${Utils.random()}`;
  const randomFolderName2 = `folder-name-2-${Utils.random()}`;
  const randomFolderName3 = `folder-name-3-${Utils.random()}`;

  let randomRuleName: string;
  const copyFileName = `copy-file-${Utils.random()}`;
  const specialChars = '!@£$%^&*()~#/';
  const testString = '"!@£$%^&*()_+{}|:""?&gt;&lt;,/.\';][=-`~"';

  let randomFolderName1Id: string;
  let randomFolderName2Id: string;
  let randomFolderName3Id: string;

  test.beforeAll(async () => {
    try {
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }

    randomFolderName1Id = (await nodesApi.createFolder(randomFolderName1)).entry.id;
    randomFolderName2Id = (await nodesApi.createFolder(randomFolderName2)).entry.id;
    randomFolderName3Id = (await nodesApi.createFolder(randomFolderName3, randomFolderName1Id)).entry.id;
    await nodesApi.createFile(copyFileName, randomFolderName1Id);
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    randomRuleName = `rule-XAT-${Utils.random()}`;
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[XAT-883] Create a rule with symbols in its name and description', async ({ personalFiles, nodesPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${randomFolderName1Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(testString);
    await nodesPage.manageRulesDialog.ruleDescriptionInputLocator.fill(testString);

    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter, 0);
    await nodesPage.manageRulesDialog.createRuleButton.click();

    await expect(nodesPage.manageRules.getGroupsList(testString)).toBeVisible();
  });

  test('[XAT-884] Create a rule and link it to an existing folder', async ({ personalFiles, nodesPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${randomFolderName1Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter, 0);
    await nodesPage.manageRulesDialog.createRuleButton.click();

    await personalFiles.navigate({ remoteUrl: `#/nodes/${randomFolderName2Id}/rules` });
    await nodesPage.toolbar.clickLinkRulesButton();
    await nodesPage.linkRulesDialog.waitForLinkRules();
    await nodesPage.linkRulesDialog.getFolderIcon.click();
    await nodesPage.linkRulesDialog.getOptionLocator(username).click();
    await nodesPage.linkRulesDialog.selectDestination(randomFolderName1);
    await nodesPage.linkRulesDialog.selectFolderButton.click();

    await nodesPage.manageRules.checkIfRuleIsOnTheList(randomRuleName);
  });

  test('[XAT-885] Create a rule in a folder and inherit it in a subfolder (Rule applies to subfolders)', async ({ personalFiles, nodesPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${randomFolderName1Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter, 0);
    await nodesPage.manageRulesDialog.ruleSubfoldersCheckbox.click();
    await nodesPage.manageRulesDialog.createRuleButton.click();

    await personalFiles.navigate({ remoteUrl: `#/nodes/${randomFolderName3Id}/rules` });
    await nodesPage.manageRules.checkIfRuleIsOnTheList(randomRuleName);
  });

  test('[XAT-886] Create a rule and press cancel', async ({ personalFiles, nodesPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${randomFolderName1Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeDisabled();
    await nodesPage.manageRulesDialog.cancelRuleButton.click();
    expect(nodesPage.manageRules.checkIfRuleListEmpty()).toBeTruthy();
  });

  test('[XAT-887] Create a disabled rule', async ({ personalFiles, nodesPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${randomFolderName1Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter, 0);
    await nodesPage.manageRulesDialog.ruleDisableCheckbox.click();
    await nodesPage.manageRulesDialog.createRuleButton.click();
    await expect(nodesPage.manageRules.ruleToggleFalse).toBeVisible();
  });

  test('[XAT-888] Create a rule with multiple actions', async ({ personalFiles, nodesPage }) => {
    const checkInValue = 'check In Value';
    const actionValue = 'Site Container [st:siteContainer]';
    const specialiseTypeValue = 'Action Base Type [act:actionbase]';
    const simpleWorkFlow = 'accept reject';

    await personalFiles.navigate({ remoteUrl: `#/nodes/${randomFolderName1Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);

    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter, 0);
    await nodesPage.actionsDropdown.selectAction(ActionType.CheckIn, 1);
    await nodesPage.actionsDropdown.insertCheckInActionValues(checkInValue, 1);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 2);
    await nodesPage.actionsDropdown.insertAddAspectActionValues(actionValue, 2);
    await nodesPage.actionsDropdown.selectAction(ActionType.SpecialiseType, 3);
    await nodesPage.actionsDropdown.insertSpecialiseTypeActionValues(specialiseTypeValue, 3);
    await nodesPage.actionsDropdown.selectAction(ActionType.SimpleWorkflow, 4);
    await nodesPage.actionsDropdown.insertSimpleWorkflowActionValues(simpleWorkFlow, 4);

    await nodesPage.manageRulesDialog.createRuleButton.click();

    await nodesPage.manageRules.checkIfRuleIsOnTheList(randomRuleName);
  });

  test('[XAT-889] Create a rule which runs when items are deleted or leave a folder', async ({ nodesPage, personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${randomFolderName1Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.manageRulesDialog.whenCreatedCheckbox.click();
    await nodesPage.manageRulesDialog.whenDeletedCheckbox.click();
    await nodesPage.actionsDropdown.selectAction(ActionType.Copy, 0);
    await nodesPage.manageRulesDialog.destinationFolderButton.click();
    await nodesPage.contentNodeSelectorDialog.getFolderIcon.click();
    await nodesPage.contentNodeSelectorDialog.getOptionLocator(username).click();
    await nodesPage.contentNodeSelectorDialog.selectDestination(randomFolderName2);
    await nodesPage.contentNodeSelectorDialog.actionButton.click();
    await nodesPage.manageRulesDialog.createRuleButton.click();
    await nodesPage.manageRules.checkIfRuleIsOnTheList(randomRuleName);

    await personalFiles.navigate({ remoteUrl: `#/personal-files/${randomFolderName1Id}` });
    await personalFiles.dataTable.selectItems(copyFileName);
    await personalFiles.acaHeader.clickMoreActions();
    await personalFiles.acaHeader.matMenu.clickMenuItem('Delete');
    await personalFiles.snackBar.message.waitFor({ state: 'visible' });

    await personalFiles.navigate({ remoteUrl: `#/personal-files/${randomFolderName2Id}` });
    await expect(personalFiles.dataTable.getRowByName(copyFileName)).toBeVisible();
  });

  test('[XAT-890] Create a rule which adds multiple aspects when its ran', async ({ nodesPage, personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${randomFolderName1Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 0);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('Classifiable', 0);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 1);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('Countable', 1);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 2);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('Incomplete', 2);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 3);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('Site container', 3);
    await nodesPage.manageRulesDialog.createRuleButton.click();
    await nodesPage.manageRulesDialog.createRuleButton.waitFor({ state: 'hidden' });
    await nodesPage.manageRules.getGroupsList(randomRuleName).click();

    await nodesPage.manageRules.checkAspects([
      'Classifiable [cm:generalclassifiable]',
      'Countable [cm:countable]',
      'Incomplete [sys:incomplete]',
      'Site Container [st:siteContainer]'
    ]);
  });

  test('[XAT-891] Prevent rule creation after clicking on cancel during selecting destination folder', async ({ nodesPage, personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${randomFolderName1Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 0);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('Classifiable', 0);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeEnabled();
    await nodesPage.actionsDropdown.selectAction(ActionType.Copy, 1);
    await nodesPage.manageRulesDialog.destinationFolderButton.click();
    await nodesPage.contentNodeSelectorDialog.cancelButton.click();
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeDisabled();
  });

  test('[XAT-892] Prevent rule creation when missing any required field for action', async ({ nodesPage, personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${randomFolderName1Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 0);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('Classifiable', 0);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeEnabled();
    await nodesPage.actionsDropdown.selectAction(ActionType.Copy, 1);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeDisabled();
  });

  test('[XAT-893] Removing values from required fields should restore disabled state for Create button', async ({ nodesPage, personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${randomFolderName1Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 0);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('Classifiable', 0);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeEnabled();
    await nodesPage.actionsDropdown.insertAddAspectActionValues('None', 0);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeDisabled();
  });

  test('[XAT-894] Create rule with filled required fields and empty optional fields', async ({ nodesPage, personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${randomFolderName1Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 0);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('Classifiable', 0);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeEnabled();
    await nodesPage.actionsDropdown.selectAction(ActionType.CheckIn, 1);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeEnabled();
  });

  test('[XAT-895] Create a rule with multiple conditions utilising all available comparators and conditions', async ({
    personalFiles,
    nodesPage
  }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${randomFolderName1Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.conditionsDropdown.addCondition(Field.Size, specialChars, 0, Comparator.Equals);
    await nodesPage.conditionsDropdown.addCondition(Field.Name, specialChars, 1, Comparator.Equals);
    await nodesPage.conditionsDropdown.addCondition(Field.Encoding, specialChars, 2);
    await nodesPage.conditionsDropdown.addCondition(Field.HasTag, specialChars, 3);
    await nodesPage.conditionsDropdown.addCondition(Field.HasAspect, specialChars, 4);
    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter, 0);
    await nodesPage.manageRulesDialog.createRuleButton.click();

    await nodesPage.manageRules.checkIfRuleIsOnTheList(randomRuleName);
  });

  test('[XAT-896] Create a rule with multiple groups utilising all available comparators and conditions', async ({ personalFiles, nodesPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${randomFolderName1Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.conditionsDropdown.addConditionGroup(Field.Size, specialChars, 0, Comparator.Equals);
    await nodesPage.conditionsDropdown.addConditionGroup(Field.Name, specialChars, 1, Comparator.Equals);
    await nodesPage.conditionsDropdown.addConditionGroup(Field.Encoding, specialChars, 2);
    await nodesPage.conditionsDropdown.addConditionGroup(Field.HasTag, specialChars, 3);
    await nodesPage.conditionsDropdown.addConditionGroup(Field.HasAspect, specialChars, 4);
    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter, 0);
    await nodesPage.manageRulesDialog.createRuleButton.click();

    await nodesPage.manageRules.checkIfRuleIsOnTheList(randomRuleName);
  });
});
