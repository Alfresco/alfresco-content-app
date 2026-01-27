/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Locator, Page, expect } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class ManageRules extends BaseComponent {
  private static rootElement = '.aca-manage-rules';

  public getGroupsList = (optionName: string): Locator => this.getChild('.aca-rule-list-item__header', { hasText: optionName });
  public ruleToggle = this.getChild('.aca-manage-rules__container .mdc-switch').first();
  public ruleToggleFalse = this.getChild('aca-rule-list-grouping aca-rule-list-item .mdc-switch--unselected').first();
  public ruleDetailsTitle = this.getChild('.aca-manage-rules__container__rule-details__header__title__name');
  public ruleDetailsDeleteButton = this.getChild('#delete-rule-btn');
  public ruleDetailsEditButton = this.getChild('#edit-rule-btn');
  public ruleDetailsWhenText = this.getChild('[data-automation-id="rule-details-triggers-component"]');
  public ruleDetailsPerformActionsDiv = this.getChild('adf-card-view-selectitem [data-automation-id="select-box"]');
  public rulesEmptyListTitle = this.getChild('.adf-empty-content__title');
  public ruleActions = this.getChild('aca-rule-action');
  public ruleConditionsInGroup = this.getChild('aca-rule-composite-condition aca-rule-simple-condition');
  public ruleDescription = this.getChild('.aca-manage-rules__container__rule-details__header__title__description');

  constructor(page: Page) {
    super(page, ManageRules.rootElement);
  }

  async checkAspects(aspects: string[]): Promise<void> {
    for (let i = 0; i < aspects.length; i++) {
      const aspectsActions = await this.ruleDetailsPerformActionsDiv.nth(i).innerText();
      expect(aspects).toContain(aspectsActions);
    }
  }

  async checkIfRuleListEmpty(): Promise<boolean> {
    return this.rulesEmptyListTitle.isVisible();
  }

  async checkIfRuleIsOnTheList(ruleName: string): Promise<void> {
    await expect(this.getGroupsList(ruleName)).toBeVisible({ timeout: 5000 });
  }

  async countConditionsInGroup(): Promise<number> {
    return this.ruleConditionsInGroup.count();
  }

  async turnOffRuleToggle(): Promise<void> {
    await expect(async () => {
      await this.ruleToggle.hover({ timeout: 1000 });
      await this.ruleToggle.click();
      await expect(this.ruleToggleFalse).toBeVisible();
    }).toPass({
      intervals: [2_000],
      timeout: 20_000
    });
  }
}
