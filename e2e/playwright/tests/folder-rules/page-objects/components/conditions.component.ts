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

import { Locator, Page } from '@playwright/test';
import { ManageRulesDialogComponent } from './manage-rules-dialog.component';

export enum Field {
  Name = 'Name',
  Size = 'Size',
  Mimetype = 'Mimetype'
}

export enum Comparator {
  Equals = '(=) Equals',
  Contains = 'Contains',
  StartsWith = 'Starts with',
  EndsWith = 'Ends with'
}

export class ConditionComponent extends ManageRulesDialogComponent {
  private getOptionLocator = (optionName: string): Locator => this.page.locator(`.cdk-overlay-pane .mat-option span`, { hasText: optionName });

  constructor(page: Page) {
    super(page);
  }

  private async selectField(fields: Partial<Field>): Promise<void> {
    await this.fieldDropDown.click();
    const option = this.getOptionLocator(fields);
    await option.click();
  }

  private async selectComparator(comparators: Partial<Comparator>): Promise<void> {
    await this.comparatorDropDown.click();
    const option = this.getOptionLocator(comparators);
    await option.click();
  }

  async addCondition(fields: Partial<Field>, comparators: Partial<Comparator>, value: string): Promise<void> {
    await this.addConditionButton.click();
    await this.selectField(fields);
    await this.selectComparator(comparators);
    await this.typeConditionValue(value);
  }
}
