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
  const folder883 = `folder-883-${Utils.random()}`;
  const folder884 = `folder-884-${Utils.random()}`;
  const folder884Second = `folder-884-2-${Utils.random()}`;
  const folder885 = `folder-885-${Utils.random()}`;
  const folder885Child = `folder-885-child-${Utils.random()}`;
  const folder886 = `folder-886-${Utils.random()}`;
  const folder887 = `folder-887-${Utils.random()}`;
  const folder888 = `folder-888-${Utils.random()}`;
  const folder889 = `folder-889-${Utils.random()}`;
  const folder889Second = `folder-889-2-${Utils.random()}`;
  const folder890 = `folder-890-${Utils.random()}`;
  const folder891 = `folder-891-${Utils.random()}`;
  const folder892 = `folder-892-${Utils.random()}`;
  const folder893 = `folder-893-${Utils.random()}`;
  const folder894 = `folder-894-${Utils.random()}`;
  const folder895 = `folder-895-${Utils.random()}`;
  const folder896 = `folder-896-${Utils.random()}`;
  const folder910 = `folder-910-${Utils.random()}`;

  let randomRuleName: string;
  const copyFileName = `copy-file-${Utils.random()}`;
  const specialChars = '!@£$%^&*()~#/';
  const testString = '"!@£$%^&*()_+{}|:""?&gt;&lt;,/.\';][=-`~"';

  let folder883Id: string;
  let folder884Id: string;
  let folder884SecondId: string;
  let folder885Id: string;
  let folder885ChildId: string;
  let folder886Id: string;
  let folder887Id: string;
  let folder888Id: string;
  let folder889Id: string;
  let folder889SecondId: string;
  let folder890Id: string;
  let folder891Id: string;
  let folder892Id: string;
  let folder893Id: string;
  let folder894Id: string;
  let folder895Id: string;
  let folder896Id: string;
  let folder910Id: string;

  test.beforeAll(async () => {
    try {
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
      throw error;
    }

    folder883Id = (await nodesApi.createFolder(folder883)).entry.id;
    folder884Id = (await nodesApi.createFolder(folder884)).entry.id;
    folder884SecondId = (await nodesApi.createFolder(folder884Second)).entry.id;
    folder885Id = (await nodesApi.createFolder(folder885)).entry.id;
    folder885ChildId = (await nodesApi.createFolder(folder885Child, folder885Id)).entry.id;
    folder886Id = (await nodesApi.createFolder(folder886)).entry.id;
    folder887Id = (await nodesApi.createFolder(folder887)).entry.id;
    folder888Id = (await nodesApi.createFolder(folder888)).entry.id;
    folder889Id = (await nodesApi.createFolder(folder889)).entry.id;
    folder889SecondId = (await nodesApi.createFolder(folder889Second)).entry.id;
    folder890Id = (await nodesApi.createFolder(folder890)).entry.id;
    folder891Id = (await nodesApi.createFolder(folder891)).entry.id;
    folder892Id = (await nodesApi.createFolder(folder892)).entry.id;
    folder893Id = (await nodesApi.createFolder(folder893)).entry.id;
    folder894Id = (await nodesApi.createFolder(folder894)).entry.id;
    folder895Id = (await nodesApi.createFolder(folder895)).entry.id;
    folder896Id = (await nodesApi.createFolder(folder896)).entry.id;
    folder910Id = (await nodesApi.createFolder(folder910)).entry.id;
    await nodesApi.createFile(copyFileName, folder889Id);
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    randomRuleName = `rule-XAT-${Utils.random()}`;
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[XAT-883] Create a rule with symbols in its name and description', async ({ personalFiles, nodesPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folder883Id}/rules` });
    await nodesPage.rulesToolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(testString);
    await nodesPage.manageRulesDialog.ruleDescriptionInputLocator.fill(testString);

    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter, 0);
    await nodesPage.manageRulesDialog.createRuleButton.click();

    await expect(nodesPage.manageRules.getGroupsList(testString)).toBeVisible();
  });

  test('[XAT-884] Create a rule and link it to an existing folder', async ({ personalFiles, nodesPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folder884Id}/rules` });
    await nodesPage.rulesToolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter, 0);
    await nodesPage.manageRulesDialog.createRuleButton.click();

    await personalFiles.navigate({ remoteUrl: `#/nodes/${folder884SecondId}/rules` });
    await nodesPage.rulesToolbar.clickLinkRulesButton();
    await nodesPage.linkRulesDialog.waitForLinkRules();
    await nodesPage.linkRulesDialog.getFolderIcon.click();
    await nodesPage.linkRulesDialog.getOptionLocator(username).click();
    await nodesPage.linkRulesDialog.selectDestination(folder884);
    await nodesPage.linkRulesDialog.selectFolderButton.click();

    await nodesPage.manageRules.checkIfRuleIsOnTheList(randomRuleName);
  });

  test('[XAT-885] Create a rule in a folder and inherit it in a subfolder (Rule applies to subfolders)', async ({ personalFiles, nodesPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folder885Id}/rules` });
    await nodesPage.rulesToolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter, 0);
    await nodesPage.manageRulesDialog.ruleSubfoldersCheckbox.click();
    await nodesPage.manageRulesDialog.createRuleButton.click();

    await personalFiles.navigate({ remoteUrl: `#/nodes/${folder885ChildId}/rules` });
    await nodesPage.manageRules.checkIfRuleIsOnTheList(randomRuleName);
  });

  test('[XAT-886] Create a rule and press cancel', async ({ personalFiles, nodesPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folder886Id}/rules` });
    await nodesPage.rulesToolbar.clickCreateRuleButton();
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeDisabled();
    await nodesPage.manageRulesDialog.cancelRuleButton.click();
    expect(await nodesPage.manageRules.checkIfRuleListEmpty()).toBe(true);
  });

  test('[XAT-887] Create a disabled rule', async ({ personalFiles, nodesPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folder887Id}/rules` });
    await nodesPage.rulesToolbar.clickCreateRuleButton();
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

    await personalFiles.navigate({ remoteUrl: `#/nodes/${folder888Id}/rules` });
    await nodesPage.rulesToolbar.clickCreateRuleButton();
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
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folder889Id}/rules` });
    await nodesPage.rulesToolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.manageRulesDialog.whenCreatedCheckbox.click();
    await nodesPage.manageRulesDialog.whenDeletedCheckbox.click();
    await nodesPage.actionsDropdown.selectAction(ActionType.Copy, 0);
    await nodesPage.manageRulesDialog.destinationFolderButton.click();
    await nodesPage.contentNodeSelectorDialog.getFolderIcon.click();
    await nodesPage.contentNodeSelectorDialog.getOptionLocator(username).click();
    await nodesPage.contentNodeSelectorDialog.selectDestination(folder889Second);
    await nodesPage.contentNodeSelectorDialog.actionButton.click();
    await nodesPage.manageRulesDialog.createRuleButton.click();
    await nodesPage.manageRules.checkIfRuleIsOnTheList(randomRuleName);

    await personalFiles.navigate({ remoteUrl: `#/personal-files/${folder889Id}` });
    await personalFiles.dataTable.selectItems(copyFileName);
    await personalFiles.acaHeader.clickMoreActions();
    await personalFiles.acaHeader.matMenu.clickMenuItem('Delete');
    await personalFiles.snackBar.message.waitFor({ state: 'visible' });

    await personalFiles.navigate({ remoteUrl: `#/personal-files/${folder889SecondId}` });
    await expect(personalFiles.dataTable.getRowByName(copyFileName)).toBeVisible();
  });

  test('[XAT-890] Create a rule which adds multiple aspects when its ran', async ({ nodesPage, personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folder890Id}/rules` });
    await nodesPage.rulesToolbar.clickCreateRuleButton();
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
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folder891Id}/rules` });
    await nodesPage.rulesToolbar.clickCreateRuleButton();
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
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folder892Id}/rules` });
    await nodesPage.rulesToolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 0);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('Classifiable', 0);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeEnabled();
    await nodesPage.actionsDropdown.selectAction(ActionType.Copy, 1);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeDisabled();
  });

  test('[XAT-893] Removing values from required fields should restore disabled state for Create button', async ({ nodesPage, personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folder893Id}/rules` });
    await nodesPage.rulesToolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 0);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('Classifiable', 0);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeEnabled();
    await nodesPage.actionsDropdown.insertAddAspectActionValues('None', 0);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeDisabled();
  });

  test('[XAT-894] Create rule with filled required fields and empty optional fields', async ({ nodesPage, personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folder894Id}/rules` });
    await nodesPage.rulesToolbar.clickCreateRuleButton();
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
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folder895Id}/rules` });
    await nodesPage.rulesToolbar.clickCreateRuleButton();
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
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folder896Id}/rules` });
    await nodesPage.rulesToolbar.clickCreateRuleButton();
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

  test('[XAT-910] Create a rule and disable it', async ({ personalFiles, nodesPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folder910Id}/rules` });
    await nodesPage.rulesToolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter, 0);
    await nodesPage.manageRulesDialog.createRuleButton.click();
    await nodesPage.manageRules.ruleToggle.click();
    await expect(nodesPage.manageRules.ruleToggleFalse).toBeVisible();
  });
});
