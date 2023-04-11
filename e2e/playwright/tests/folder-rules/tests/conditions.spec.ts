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
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

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
