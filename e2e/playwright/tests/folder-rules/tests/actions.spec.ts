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

import { test } from '../fixtures/page-initialization';
import { NodeBodyCreate } from '@alfresco/aca-testing-shared';
import { ActionType } from '../page-objects/components/actions-dropdown.component';
import { expect } from '@playwright/test';

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
