import { test } from '../fixtures/page-initialization';
import { NodeBodyCreate } from "@alfresco/aca-testing-shared";
import { actionType } from "../page-objects/components/actions-dropdown.component";
import {expect} from "@playwright/test";

test.describe('Folder Rules Actions', () => {

  const randomRuleName = `playwright-${(Math.random() + 1).toString(36).substring(6)}`;

  let folderId: string;

  test.beforeAll(async ({apiClient}) => {
    folderId = (await apiClient.nodes.createNode("-my-", new NodeBodyCreate(randomRuleName, "cm:folder"))).entry.id;
  });

  test.beforeEach(async ({personalFiles}) => {
    await personalFiles.navigate();
  });

  test.afterAll(async ({apiClient}) => {
    await apiClient.nodes.deleteNode(folderId);
  })

  test('Create a rule with actions', async ({ personalFiles, nodesPage}) => {
    await personalFiles.dataTable.performActionFromExpandableMenu(randomRuleName, 'Manage rules');

    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.typeRuleName(randomRuleName);
    await nodesPage.actionsDropdown.selectAction(actionType.IncrementCounter);
    await nodesPage.manageRulesDialog.createRuleButton.click();

    await expect.soft(nodesPage.manageRules.getGroupsList(randomRuleName)).toBeVisible();
  });
})
