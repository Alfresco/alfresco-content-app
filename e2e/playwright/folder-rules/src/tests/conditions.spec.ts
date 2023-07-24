/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ActionType, ApiClientFactory, Comparator, Field, getUserState, test } from '@alfresco/playwright-shared';

test.use({ storageState: getUserState('hruser') });
test.describe('Folder Rules Conditions', () => {
  const apiClientFactory = new ApiClientFactory();
  const randomFolderName = `playwright-folder-${(Math.random() + 1).toString(36).substring(6)}`;
  const randomRuleName = `playwright-rule-${(Math.random() + 1).toString(36).substring(6)}`;
  const specialChars = '!@£$%^&*()~#/';

  let folderId: string;

  test.beforeAll(async () => {
    await apiClientFactory.setUpAcaBackend('hruser');
    const node = await apiClientFactory.nodes.createNode('-my-', { name: randomFolderName, nodeType: 'cm:folder' });
    folderId = node.entry.id;
  });

  test.beforeEach(async ({ personalFiles }) => {
    await personalFiles.navigate();
  });

  test.afterAll(async () => {
    await apiClientFactory.nodes.deleteNode(folderId, { permanent: true });
  });

  test('[C691638] Create a rule with condition', async ({ personalFiles, nodesPage }) => {
    await personalFiles.dataTable.performActionFromExpandableMenu(randomFolderName, 'Manage rules');

    await nodesPage.toolbar.clickCreateRuleButton();
    await nodesPage.manageRulesDialog.ruleNameInputLocator.type(randomRuleName);
    await nodesPage.conditionsDropdown.addCondition(Field.Size, Comparator.Equals, specialChars, 0);
    await nodesPage.conditionsDropdown.addCondition(Field.Size, Comparator.Equals, specialChars, 1);
    await nodesPage.conditionsDropdown.addConditionGroupButton.click();
    await nodesPage.conditionsDropdown.addConditionGroup(Field.Size, Comparator.Equals, specialChars, 0);
    await nodesPage.conditionsDropdown.addConditionGroup(Field.Size, Comparator.Equals, specialChars, 1);
    await nodesPage.actionsDropdown.selectAction(ActionType.IncrementCounter, 0);
    await nodesPage.manageRulesDialog.createRuleButton.click();

    await expect.soft(nodesPage.manageRules.getGroupsList(randomRuleName)).toBeVisible();
  });
});
