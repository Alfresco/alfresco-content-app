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

import { BaseComponent } from '../base.component';
import { Page } from '@playwright/test';

export class ManageRulesDialogComponent extends BaseComponent {
  private static rootElement = 'aca-edit-rule-dialog';

  public createRuleButton = this.getChild('[data-automation-id="edit-rule-dialog-submit"]');
  public cancelRuleButton = this.getChild('.aca-edit-rule-dialog__footer button').filter({ hasText: 'Cancel' });
  public ruleNameInputLocator = this.getChild('[id="rule-details-name-input"]');
  public ruleDescriptionInputLocator = this.getChild('[id="rule-details-description-textarea"]');
  public addConditionButton = this.getChild('[data-automation-id="add-condition-button"]');
  public addConditionGroupButton = this.getChild('[data-automation-id="add-group-button"]');
  public fieldDropDown = this.getChild('[data-automation-id="field-select"]');
  public comparatorDropDown = this.getChild('[data-automation-id="comparator-select"]');
  public valueField = this.getChild('[data-automation-id="value-input"]');
  public whenCreatedCheckbox = this.getChild('[data-automation-id="rule-trigger-checkbox-inbound"]');
  public whenUpdatedCheckbox = this.getChild('[data-automation-id="rule-trigger-checkbox-update"]');
  public whenDeletedCheckbox = this.getChild('[data-automation-id="rule-trigger-checkbox-outbound"]');
  public destinationFolderButton = this.getChild('[data-automation-id="card-textitem-clickable-icon-destination-folder"]');
  public ruleInBackgroundCheckbox = this.getChild('[data-automation-id="rule-option-checkbox-asynchronous"]');
  public ruleSubfoldersCheckbox = this.getChild('[data-automation-id="rule-option-checkbox-inheritable"]');
  public ruleDisableCheckbox = this.getChild('[data-automation-id="rule-option-checkbox-disabled"]');
  public actionsEllipsisButtons = this.getChild('[data-automation-id="rule-action-list-action-menu"]');
  public actionsEllipsisDelete = this.page.locator('[data-automation-id="rule-action-list-remove-action-button"]');
  public conditionsEllipsisButtons = this.getChild('[data-automation-id="condition-actions-button"]');
  public conditionsEllipsisDelete = this.page.locator('button[title="Remove"]');

  constructor(page: Page) {
    super(page, ManageRulesDialogComponent.rootElement);
  }

  async deleteActions(noActions: number): Promise<void> {
    for (let i = 0; i < noActions; i++) {
      await this.actionsEllipsisButtons.first().click();
      await this.actionsEllipsisDelete.click();
    }
  }

  async deleteConditions(noConditions: number): Promise<void> {
    for (let i = 0; i < noConditions; i++) {
      await this.conditionsEllipsisButtons.first().click();
      await this.conditionsEllipsisDelete.click();
    }
  }
}
