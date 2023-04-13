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
