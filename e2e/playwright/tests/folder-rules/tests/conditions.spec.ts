import { test } from '../fixtures/page-initialization';
import { NodeBodyCreate } from '@alfresco/aca-testing-shared';
import { ActionType } from '../page-objects/components/actions-dropdown.component';
import { Comparator, Field } from '../page-objects/components/conditions.component';
import { expect } from '@playwright/test';

test.describe('Folder Rules Conditions', () => {
  const randomFolderName = `playwright-folder-${(Math.random() + 1).toString(36).substring(6)}`;
  const randomRuleName = `playwright-rule-${(Math.random() + 1).toString(36).substring(6)}`;
  const specialChars = '!@£$%^&*()~#/';

  let folderId: string;

  test.beforeAll(async ({ apiClient }) => {
    folderId = (await apiClient.nodes.createNode('-my-', new NodeBodyCreate(randomFolderName, 'cm:folder'))).entry.id;
  });

  test.beforeEach(async ({ personalFiles }) => {
    await personalFiles.navigate();
  });

  test.afterAll(async ({ apiClient }) => {
    await apiClient.nodes.deleteNode(folderId);
  });

  test('Create a rule with condition', async ({ personalFiles, nodesPage }) => {
    await personalFiles.dataTable.performActionFromExpandableMenu(randomFolderName, 'Manage rules');

    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.typeRuleName(randomRuleName);
    await nodesPage.conditionsDropdown.addCondition(Field.Size, Comparator.Equals, specialChars);
    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter);
    await nodesPage.manageRulesDialog.createRuleButton.click();

    await expect.soft(nodesPage.manageRules.getGroupsList(randomRuleName)).toBeVisible();
  });
});
