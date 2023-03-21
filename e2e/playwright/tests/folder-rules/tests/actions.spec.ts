import { test } from '../fixtures/page-initialization';
import { NodeBodyCreate } from '@alfresco/aca-testing-shared';
import { ActionType } from '../page-objects/components/actions.component';
import { expect } from '@playwright/test';
import { NodePaging } from '@alfresco/js-api';

test.describe('Folder Rules Actions', () => {
  const randomFolderName = `playwright-folder-${(Math.random() + 1).toString(36).substring(6)}`;
  const randomRuleName = `playwright-rule-${(Math.random() + 1).toString(36).substring(6)}`;
  const checkInValue = 'check In Value';
  const actionValue = ' A site which contains sfdc content [sfdc:site] ';
  const autoDeclareOptionsValue = 'For all major and minor versions [ALL]';
  const simpleWorkFlow = 'accept reject';

  let folderId: string;

  test.beforeAll(async ({ apiClient }) => {
    folderId = (await apiClient.nodes.createNode('-my-', new NodeBodyCreate(randomFolderName, 'cm:folder'))).entry.id;
  });

  test.beforeEach(async ({ personalFiles }) => {
    await personalFiles.navigate({ waitUntil: 'domcontentloaded' });
  });

  test.afterAll(async ({ apiClient }) => {
    await apiClient.nodes.deleteNode(folderId);
  });

  test('Create a rule with actions', async ({ personalFiles, nodesPage }) => {
    await personalFiles.dataTable.performActionFromExpandableMenu(randomFolderName, 'Manage rules');

    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.typeRuleName(randomRuleName);

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
});
