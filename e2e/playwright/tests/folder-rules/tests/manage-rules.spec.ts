import { test } from '../fixtures/page-initialization';
import { NodeBodyCreate } from '@alfresco/aca-testing-shared';

test.describe('Rules - Manage Rules', () => {
  const randomName = `playwright-folder-${(Math.random() + 1).toString(36).substring(6)}`;
  const randomRuleName = `playwright-rule-${(Math.random() + 1).toString(36).substring(6)}`;

  let folderId: string;

  test.beforeAll(async ({ apiClient }) => {
    folderId = (await apiClient.nodes.createNode('-my-', new NodeBodyCreate(randomName, 'cm:folder'))).entry.id;
    await apiClient.createRandomRule(folderId, randomRuleName);
  });

  test.beforeEach(async ({ personalFiles }) => {
    await personalFiles.navigate();
  });

  test.afterAll(async ({ apiClient }) => {
    await apiClient.nodes.deleteNode(folderId);
  });

  test('Disable an existing rule', async ({ personalFiles, nodesPage }) => {
    await personalFiles.dataTable.performActionFromExpandableMenu(randomName, 'Manage rules');
    await nodesPage.manageRules.disableRuleToggle.click();
  });
});
