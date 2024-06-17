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

import { Locator, Page, expect } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class ManageRules extends BaseComponent {
  private static rootElement = '.aca-manage-rules';

  public getGroupsList = (optionName: string): Locator => this.getChild('.aca-rule-list-item__header', { hasText: optionName });
  public ruleToggle = this.getChild('.aca-manage-rules__container .mat-slide-toggle-bar').first();
  public ruleToggleFalse = this.getChild('aca-rule-list-grouping input[type="checkbox"][aria-checked="false"]').first();
  public ruleDetailsTitle = this.getChild('.aca-manage-rules__container__rule-details__header__title__name');
  public ruleDetailsTrashButton = this.getChild('#delete-rule-btn');
  public ruleDetailsEditButton = this.getChild('#edit-rule-btn');
  public ruleDetailsWhenText = this.getChild('[data-automation-id="rule-details-triggers-component"]');
  public ruleDetailsPerformActionsDiv = this.getChild('adf-card-view-textitem mat-form-field input');

  constructor(page: Page) {
    super(page, ManageRules.rootElement);
  }

  async checkAspects(aspects: string[]): Promise<void> {
    for (let i = 0; i < aspects.length; i++) {
        const aspectsActions = await this.ruleDetailsPerformActionsDiv.nth(i).inputValue();
        expect(aspects).toContain(aspectsActions);
    }
}

}
