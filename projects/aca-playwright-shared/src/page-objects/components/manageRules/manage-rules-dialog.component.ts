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
  public cancelRuleButton = this.getChild('mat-dialog-actions button').filter({ hasText: 'Cancel' });
  public ruleNameInputLocator = this.getChild('[id="rule-details-name-input"]');
  public ruleDescriptionInputLocator = this.getChild('[id="rule-details-description-textarea"]');
  public addConditionButton = this.getChild('[data-automation-id="add-condition-button"]');
  public addConditionGroupButton = this.getChild('[data-automation-id="add-group-button"]');
  public fieldDropDown = this.getChild('[data-automation-id="field-select"]');
  public comparatorDropDown = this.getChild('[data-automation-id="comparator-select"]');
  public valueField = this.getChild('[data-automation-id="value-input"]');
  public whenCreatedCheckbox = this.getChild('aca-rule-triggers mat-checkbox').filter({ hasText: 'created' });
  public whenUpdatedCheckbox = this.getChild('aca-rule-triggers mat-checkbox').filter({ hasText: 'updated' });
  public whenDeletedCheckbox = this.getChild('aca-rule-triggers mat-checkbox').filter({ hasText: 'deleted' });
  public destinationFolderButton = this.getChild('[data-automation-id="card-textitem-clickable-icon-destination-folder"]');
  public ruleInBackgroundCheckbox = this.getChild('mat-checkbox').filter({ hasText: ' Run rule in the background ' });
  public ruleSubfoldersCheckbox = this.getChild('mat-checkbox').filter({ hasText: ' Rule applies to subfolders ' });
  public ruleDisableCheckbox = this.getChild('mat-checkbox').filter({ hasText: ' Disable rule ' });

  constructor(page: Page) {
    super(page, ManageRulesDialogComponent.rootElement);
  }
}
