/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { BasePage, ToolbarComponent } from '@alfresco/playwright-shared';
import { Page } from '@playwright/test';
import { ManageRulesDialogComponent } from '../components/manage-rules-dialog.component';
import { ActionsDropdownComponent } from '../components/actions-dropdown.component';
import { ConditionComponent } from '../components/conditions.component';
import { ManageRules } from '../components/manage-rules.component';

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
}
