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

import { Page } from '@playwright/test';
import {
  ConditionComponent,
  ManageRules,
  ManageRulesDialogComponent,
  ToolbarComponent,
  ActionsDropdownComponent,
  ContentNodeSelectorDialog,
  LinkRulesDialog
} from '../components';
import { BasePage } from './base.page';

export class NodesPage extends BasePage {
  private static pageUrl = 'nodes';

  constructor(page: Page) {
    super(page, NodesPage.pageUrl);
  }

  public toolbar = new ToolbarComponent(this.page);
  public manageRulesDialog = new ManageRulesDialogComponent(this.page);
  public actionsDropdown = new ActionsDropdownComponent(this.page);
  public conditionsDropdown = new ConditionComponent(this.page);
  public manageRules = new ManageRules(this.page);
  public contentNodeSelectorDialog = new ContentNodeSelectorDialog(this.page);
  public linkRulesDialog = new LinkRulesDialog(this.page);
}
