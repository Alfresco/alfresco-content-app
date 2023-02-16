/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { BaseComponent } from '@alfresco/playwright-shared';
import { Page } from '@playwright/test';

export class ManageRulesDialogComponent extends BaseComponent {
  private static rootElement = 'aca-edit-rule-dialog';

  public createRuleButton = this.getChild('[data-automation-id="edit-rule-dialog-submit"]');
  private ruleNameInputLocator = this.getChild('[id="rule-details-name-input"]');
  public addConditionButton = this.getChild('[data-automation-id="add-condition-button"]');
  public fieldDropDown = this.getChild('[data-automation-id="field-select"]');
  public comparatorDropDown = this.getChild('[data-automation-id="comparator-select"]');
  private valueField = this.getChild('[data-automation-id="value-input"]');

  constructor(page: Page) {
    super(page, ManageRulesDialogComponent.rootElement);
  }

  async typeRuleName(ruleName: string): Promise<void> {
    await this.ruleNameInputLocator.type(ruleName, { delay: 50 });
  }

  async typeConditionValue(ruleName: string): Promise<void> {
    await this.valueField.type(ruleName, { delay: 50 });
  }
}
