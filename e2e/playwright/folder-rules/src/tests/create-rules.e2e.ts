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
  const randomFolderName = `folder-XAT-888-${Utils.random()}`;
  const randomRuleName = `rule-XAT-888-${Utils.random()}`;
  const copyFileName = `copy-file-XAT-888-${Utils.random()}`;
  const randomFolderName2 = `folder-XAT-889-${Utils.random()}`;
  const randomFolderName3 = `folder-XAT-889-move-${Utils.random()}`;
  const randomRuleName2 = `rule-XAT-889-${Utils.random()}`;
  const aspectsFolder = `folder-XAT-890-${Utils.random()}`;
  const aspectsRuleName = `rule-XAT-890-${Utils.random()}`;
  const aspectsRuleNameCancel = `rule-XAT-cancel-${Utils.random()}`;
  const specialChars = '!@£$%^&*()~#/';
  const aspectsFolder2 = `folder-XAT-890-${Utils.random()}`;

  let folderId: string;
  let folderId2: string;
  let folderId3: string;
  let aspectsFolderId: string;
  let aspectsFolderId2: string;

  test.beforeAll(async () => {
    try {
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }

    folderId = (await nodesApi.createFolder(randomFolderName)).entry.id;
    folderId2 = (await nodesApi.createFolder(randomFolderName2)).entry.id;
    folderId3 = (await nodesApi.createFolder(randomFolderName3)).entry.id;
    aspectsFolderId = (await nodesApi.createFolder(aspectsFolder)).entry.id;
    aspectsFolderId2 = (await nodesApi.createFolder(aspectsFolder2)).entry.id;
    await nodesApi.createFile(copyFileName, folderId2);
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[XAT-888] Create a rule with multiple actions', async ({ personalFiles, nodesPage }) => {
    const checkInValue = 'check In Value';
    const actionValue = ' A site which contains sfdc content [sfdc:site] ';
    const autoDeclareOptionsValue = 'For all major and minor versions [ALL]';
    const simpleWorkFlow = 'accept reject';

    await personalFiles.navigate({ remoteUrl: `#/nodes/${folderId}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.type(randomRuleName);

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

    await expect.soft(nodesPage.manageRules.getGroupsList(randomRuleName)).toBeVisible();
  });

  test('[XAT-889] Create a rule which runs when items are deleted or leave a folder', async ({ nodesPage, personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${folderId2}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(randomRuleName2);
    await nodesPage.manageRulesDialog.whenCreatedCheckbox.click();
    await nodesPage.manageRulesDialog.whenDeletedCheckbox.click();
    await nodesPage.actionsDropdown.selectAction(ActionType.Copy, 0);
    await nodesPage.manageRulesDialog.destinationFolderButton.click();
    await nodesPage.contentNodeSelectorDialog.getFolderIcon.click();
    await nodesPage.contentNodeSelectorDialog.getOptionLocator(username).click();
    await personalFiles.dataTable.getRowByName(randomFolderName3).click();
    await personalFiles.page.keyboard.press('Enter');
    await nodesPage.contentNodeSelectorDialog.actionButton.click();
    await nodesPage.manageRulesDialog.createRuleButton.click();
    await expect(nodesPage.manageRules.getGroupsList(randomRuleName2)).toBeVisible();

    await personalFiles.navigate({ remoteUrl: `#/personal-files/${folderId2}` });
    await personalFiles.dataTable.selectItem(copyFileName);
    await personalFiles.acaHeader.clickMoreActions();
    await personalFiles.acaHeader.matMenu.clickMenuItem('Delete');
    await personalFiles.snackBar.message.waitFor({ state: 'visible' });
    await personalFiles.snackBar.message.waitFor({ state: 'detached' });

    await personalFiles.navigate({ remoteUrl: `#/personal-files/${folderId3}` });
    await expect(personalFiles.dataTable.getRowByName(copyFileName)).toBeVisible();
  });

  test('[XAT-890] Create a rule which adds multiple aspects when its ran', async ({ nodesPage, personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${aspectsFolderId}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(aspectsRuleName);
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
    await personalFiles.navigate({ remoteUrl: `#/nodes/${aspectsFolderId}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(aspectsRuleNameCancel);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 0);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('Controls', 0);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeEnabled();
    await nodesPage.actionsDropdown.selectAction(ActionType.Copy, 1);
    await nodesPage.manageRulesDialog.destinationFolderButton.click();
    await nodesPage.contentNodeSelectorDialog.cancelButton.click();
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeDisabled();
  });

  test('[XAT-892] Prevent rule creation when missing any required field for action', async ({ nodesPage, personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${aspectsFolderId}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(aspectsRuleNameCancel);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 0);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('Controls', 0);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeEnabled();
    await nodesPage.actionsDropdown.selectAction(ActionType.Copy, 1);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeDisabled();
  });

  test('[XAT-893] Removing values from required fields should restore disabled state for Create button', async ({ nodesPage, personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${aspectsFolderId}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(aspectsRuleNameCancel);
    await nodesPage.actionsDropdown.selectAction(ActionType.AddAspect, 0);
    await nodesPage.actionsDropdown.insertAddAspectActionValues('Controls', 0);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeEnabled();
    await nodesPage.actionsDropdown.insertAddAspectActionValues('None', 0);
    await expect(nodesPage.manageRulesDialog.createRuleButton).toBeDisabled();
  });

  test('[XAT-894] Create rule with filled required fields and empty optional fields', async ({ nodesPage, personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/nodes/${aspectsFolderId}/rules` });
    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.fill(aspectsRuleNameCancel);
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
    await personalFiles.navigate({ remoteUrl: `#/nodes/${aspectsFolderId}/rules` });
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
    await personalFiles.navigate({ remoteUrl: `#/nodes/${aspectsFolderId2}/rules` });
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
