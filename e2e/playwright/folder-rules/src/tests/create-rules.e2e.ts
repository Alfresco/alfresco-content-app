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
import { ActionType, ApiClientFactory, test, Utils, TrashcanApi, NodesApi, Comparator, Field } from '@alfresco/playwright-shared';

test.use({ launchOptions: { slowMo: 300 } });
test.describe('Folder Rules Actions', () => {
  const apiClientFactory = new ApiClientFactory();
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  const username = `user-e2e-${Utils.random()}`;
  const folderName883 = `folder-XAT-883-${Utils.random()}`;
  const folderName884_1 = `folder-XAT-884-1-${Utils.random()}`;
  const folderName884_2 = `folder-XAT-884-2-${Utils.random()}`;
  const folderName885_1 = `folder-XAT-885-1-${Utils.random()}`;
  const folderName885_2 = `folder-XAT-885-2-${Utils.random()}`;
  const folderName886 = `folder-XAT-886-${Utils.random()}`;
  const folderName887 = `folder-XAT-887-${Utils.random()}`;
  const folderName888 = `folder-XAT-888-${Utils.random()}`;
  const folderName889_1 = `folder-XAT-889-${Utils.random()}`;
  const folderName889_2 = `folder-XAT-889-move-${Utils.random()}`;
  const folderName890 = `folder-XAT-890-${Utils.random()}`;
  const folderName891 = `folder-XAT-891-${Utils.random()}`;
  const folderName892 = `folder-XAT-892-${Utils.random()}`;
  const folderName893 = `folder-XAT-893-${Utils.random()}`;
  const folderName894 = `folder-XAT-894-${Utils.random()}`;
  const folderName895 = `folder-XAT-895-${Utils.random()}`;
  const folderName896 = `folder-XAT-896-${Utils.random()}`;

  const randomRuleName = `rule-XAT-${Utils.random()}`;
  const copyFileName = `copy-file-XAT-888-${Utils.random()}`;
  const specialChars = '!@£$%^&*()~#/';
  const testString = '"!@£$%^&*()_+{}|:""?&gt;&lt;,/.\';][=-`~"';

  let folderName883Id: string;
  let folderName884Id1: string;
  let folderName884Id2: string;
  let folderName885Id1: string;
  let folderName885Id2: string;
  let folderName886Id: string;
  let folderName887Id: string;
  let folderName888Id: string;
  let folderName889Id1: string;
  let folderName889Id2: string;
  let folderName890Id: string;
  let folderName891Id: string;
  let folderName892Id: string;
  let folderName893Id: string;
  let folderName894Id: string;
  let folderName895Id: string;
  let folderName896Id: string;

  test.beforeAll(async () => {
    try {
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }

    folderName883Id = (await nodesApi.createFolder(folderName883)).entry.id;
    folderName884Id1 = (await nodesApi.createFolder(folderName884_1)).entry.id;
    folderName884Id2 = (await nodesApi.createFolder(folderName884_2)).entry.id;
    folderName885Id1 = (await nodesApi.createFolder(folderName885_1)).entry.id;
    folderName885Id2 = (await nodesApi.createFolder(folderName885_2, folderName885Id1)).entry.id;
    folderName886Id = (await nodesApi.createFolder(folderName886)).entry.id;
    folderName887Id = (await nodesApi.createFolder(folderName887)).entry.id;
    folderName888Id = (await nodesApi.createFolder(folderName888)).entry.id;
    folderName889Id1 = (await nodesApi.createFolder(folderName889_1)).entry.id;
    folderName889Id2 = (await nodesApi.createFolder(folderName889_2)).entry.id;
    folderName890Id = (await nodesApi.createFolder(folderName890)).entry.id;
    folderName891Id = (await nodesApi.createFolder(folderName891)).entry.id;
    folderName892Id = (await nodesApi.createFolder(folderName892)).entry.id;
    folderName893Id = (await nodesApi.createFolder(folderName893)).entry.id;
    folderName894Id = (await nodesApi.createFolder(folderName894)).entry.id;
    folderName895Id = (await nodesApi.createFolder(folderName895)).entry.id;
    folderName896Id = (await nodesApi.createFolder(folderName896)).entry.id;
    await nodesApi.createFile(copyFileName, folderName889Id1);
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[XAT-883] Create a rule with symbols in its name and description', async ({ personalFiles, nodesPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folderName883Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(testString);
    await nodesPage.manageRulesDialog.ruleDescriptionInputLocator.fill(testString);

    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter, 0);
    await nodesPage.manageRulesDialog.createRuleButton.click();

    await expect(nodesPage.manageRules.getGroupsList(testString)).toBeVisible();
  });

  test('[XAT-884] Create a rule and link it to an existing folder', async ({ personalFiles, nodesPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folderName884Id1}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(testString);
    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter, 0);
    await nodesPage.manageRulesDialog.createRuleButton.click();

    await personalFiles.navigate({ remoteUrl: `#/nodes/${folderName884Id2}/rules` });
    await nodesPage.toolbar.clickLinkRulesButton();
    await nodesPage.linkRulesDialog.waitForLinkRules();
    await nodesPage.linkRulesDialog.getFolderIcon.click();
    await nodesPage.linkRulesDialog.getOptionLocator(username).click();
    await nodesPage.linkRulesDialog.selectDestination(folderName884_1);
    await nodesPage.linkRulesDialog.selectFolderButton.click();

    await expect(nodesPage.manageRules.getGroupsList(testString)).toBeVisible();
  });

  test('[XAT-885] Create a rule in a folder and inherit it in a subfolder (Rule applies to subfolders)', async ({ personalFiles, nodesPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folderName885Id1}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(testString);
    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter, 0);
    await nodesPage.manageRulesDialog.ruleSubfoldersCheckbox.click();
    await nodesPage.manageRulesDialog.createRuleButton.click();

    await personalFiles.navigate({ remoteUrl: `#/nodes/${folderName885Id2}/rules` });
    await expect(nodesPage.manageRules.getGroupsList(testString)).toBeVisible();
  });

  test('[XAT-886] Create a rule and press cancel', async ({ personalFiles, nodesPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folderName886Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeDisabled();
    await nodesPage.manageRulesDialog.cancelRuleButton.click();
    expect(nodesPage.manageRules.checkIfRuleListEmpty()).toBeTruthy();
  });

  test('[XAT-887] Create a disabled rule', async ({ personalFiles, nodesPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folderName887Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(testString);
    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter, 0);
    await nodesPage.manageRulesDialog.ruleDisableCheckbox.click();
    await nodesPage.manageRulesDialog.createRuleButton.click();
    await expect(nodesPage.manageRules.ruleToggleFalse).toBeVisible();
  });

  test('[XAT-888] Create a rule with multiple actions', async ({ personalFiles, nodesPage }) => {
    const checkInValue = 'check In Value';
    const actionValue = ' A site which contains sfdc content [sfdc:site] ';
    const autoDeclareOptionsValue = 'For all major and minor versions [ALL]';
    const simpleWorkFlow = 'accept reject';

    await personalFiles.navigate({ remoteUrl: `#/nodes/${folderName888Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);

    await nodesPage.actionsDropdown.selectAction(ActionType.HideRecord, 0);
    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter, 1);
    await nodesPage.actionsDropdown.selectAction(ActionType.CheckIn, 2);
    await nodesPage.actionsDropdown.insertCheckInActionValues(checkInValue, 2);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 3);
    await nodesPage.actionsDropdown.insertAddAspectActionValues(actionValue, 3);
    await nodesPage.actionsDropdown.selectAction(ActionType.AutoDeclareOptions, 4);
    await nodesPage.actionsDropdown.insertAutoDeclareOptionsActionValues(autoDeclareOptionsValue, 4);
    await nodesPage.actionsDropdown.selectAction(ActionType.SimpleWorkflow, 5);
    await nodesPage.actionsDropdown.insertSimpleWorkflowActionValues(simpleWorkFlow, 5);

    await nodesPage.manageRulesDialog.createRuleButton.click();

    await expect(nodesPage.manageRules.getGroupsList(randomRuleName)).toBeVisible();
  });

  test('[XAT-889] Create a rule which runs when items are deleted or leave a folder', async ({ nodesPage, personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folderName889Id1}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.manageRulesDialog.whenCreatedCheckbox.click();
    await nodesPage.manageRulesDialog.whenDeletedCheckbox.click();
    await nodesPage.actionsDropdown.selectAction(ActionType.Copy, 0);
    await nodesPage.manageRulesDialog.destinationFolderButton.click();
    await nodesPage.contentNodeSelectorDialog.getFolderIcon.click();
    await nodesPage.contentNodeSelectorDialog.getOptionLocator(username).click();
    await nodesPage.contentNodeSelectorDialog.selectDestination(folderName889_2);
    await nodesPage.contentNodeSelectorDialog.actionButton.click();
    await nodesPage.manageRulesDialog.createRuleButton.click();
    await expect(nodesPage.manageRules.getGroupsList(randomRuleName)).toBeVisible();

    await personalFiles.navigate({ remoteUrl: `#/personal-files/${folderName889Id1}` });
    await personalFiles.dataTable.selectItem(copyFileName);
    await personalFiles.acaHeader.clickMoreActions();
    await personalFiles.acaHeader.matMenu.clickMenuItem('Delete');
    await personalFiles.snackBar.message.waitFor({ state: 'visible' });

    await personalFiles.navigate({ remoteUrl: `#/personal-files/${folderName889Id2}` });
    await expect(personalFiles.dataTable.getRowByName(copyFileName)).toBeVisible();
  });

  test('[XAT-890] Create a rule which adds multiple aspects when its ran', async ({ nodesPage, personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folderName890Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 0);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('Controls', 0);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 1);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('CMM', 1);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 2);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('folder', 2);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 3);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('site which', 3);
    await nodesPage.manageRulesDialog.createRuleButton.click();

    await nodesPage.manageRules.checkAspects(['sc:controlsAreClearance', 'sfdc:objectModel', 'sfdc:folder', 'sfdc:site']);
  });

  test('[XAT-891] Prevent rule creation after clicking on cancel during selecting destination folder', async ({ nodesPage, personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folderName891Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 0);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('Controls', 0);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeEnabled();
    await nodesPage.actionsDropdown.selectAction(ActionType.Copy, 1);
    await nodesPage.manageRulesDialog.destinationFolderButton.click();
    await nodesPage.contentNodeSelectorDialog.cancelButton.click();
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeDisabled();
  });

  test('[XAT-892] Prevent rule creation when missing any required field for action', async ({ nodesPage, personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folderName892Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 0);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('Controls', 0);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeEnabled();
    await nodesPage.actionsDropdown.selectAction(ActionType.Copy, 1);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeDisabled();
  });

  test('[XAT-893] Removing values from required fields should restore disabled state for Create button', async ({ nodesPage, personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folderName893Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 0);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('Controls', 0);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeEnabled();
    await nodesPage.actionsDropdown.insertAddAspectActionValues('None', 0);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeDisabled();
  });

  test('[XAT-894] Create rule with filled required fields and empty optional fields', async ({ nodesPage, personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folderName894Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 0);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('Controls', 0);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeEnabled();
    await nodesPage.actionsDropdown.selectAction(ActionType.CheckIn, 1);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeEnabled();
  });

  test('[XAT-895] Create a rule with multiple conditions utilising all available comparators and conditions', async ({
    personalFiles,
    nodesPage
  }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folderName895Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.conditionsDropdown.addCondition(Field.Size, specialChars, 0, Comparator.Equals);
    await nodesPage.conditionsDropdown.addCondition(Field.Name, specialChars, 1, Comparator.Equals);
    await nodesPage.conditionsDropdown.addCondition(Field.Encoding, specialChars, 2);
    await nodesPage.conditionsDropdown.addCondition(Field.HasTag, specialChars, 3);
    await nodesPage.conditionsDropdown.addCondition(Field.HasAspect, specialChars, 4);
    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter, 0);
    await nodesPage.manageRulesDialog.createRuleButton.click();

    await expect(nodesPage.manageRules.getGroupsList(randomRuleName)).toBeVisible();
  });

  test('[XAT-896] Create a rule with multiple groups utilising all available comparators and conditions', async ({ personalFiles, nodesPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folderName896Id}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName);
    await nodesPage.conditionsDropdown.addConditionGroup(Field.Size, specialChars, 0, Comparator.Equals);
    await nodesPage.conditionsDropdown.addConditionGroup(Field.Name, specialChars, 1, Comparator.Equals);
    await nodesPage.conditionsDropdown.addConditionGroup(Field.Encoding, specialChars, 2);
    await nodesPage.conditionsDropdown.addConditionGroup(Field.HasTag, specialChars, 3);
    await nodesPage.conditionsDropdown.addConditionGroup(Field.HasAspect, specialChars, 4);
    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter, 0);
    await nodesPage.manageRulesDialog.createRuleButton.click();

    await expect(nodesPage.manageRules.getGroupsList(randomRuleName)).toBeVisible();
  });
});
