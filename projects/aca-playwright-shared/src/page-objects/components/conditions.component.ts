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

import { Locator } from '@playwright/test';
import { ManageRulesDialogComponent } from './manageRules/manage-rules-dialog.component';

export enum Field {
  Name = 'Name',
  Size = 'Size',
  Mimetype = 'Mimetype',
  Encoding = 'Encoding',
  HasCategory = 'Has category',
  HasTag = 'Has tag',
  HasAspect = 'Has aspect'
}

export enum Comparator {
  Equals = '(=) Equals',
  Contains = 'Contains',
  StartsWith = 'Starts with',
  EndsWith = 'Ends with'
}

export class ConditionComponent extends ManageRulesDialogComponent {
  private getOptionLocator = (optionName: string): Locator => this.page.locator('[role=listbox] [role=option]', { hasText: optionName }).first();

  private async selectField(fields: Partial<Field>, index: number): Promise<void> {
    await this.fieldDropDown.nth(index).click();
    const option = this.getOptionLocator(fields);
    await option.click();
  }

  private async selectComparator(comparators: Partial<Comparator>, index: number): Promise<void> {
    await this.comparatorDropDown.nth(index).click();
    const option = this.getOptionLocator(comparators);
    await option.click();
  }

  async addCondition(fields: Partial<Field>, value: string, index: number, comparators?: Partial<Comparator>): Promise<void> {
    await this.addConditionButton.first().click();
    await this.selectField(fields, index);
    if (comparators) {
      await this.selectComparator(comparators, index);
    }
    await this.valueField.nth(index).fill(value);
  }

  async addConditionGroup(fields: Partial<Field>, value: string, index: number, comparators?: Partial<Comparator>): Promise<void> {
    await this.addConditionGroupButton.last().click();
    await this.addConditionButton.nth(index).click();
    await this.selectField(fields, index);
    if (comparators) {
      await this.selectComparator(comparators, index);
    }
    await this.valueField.nth(index).fill(value);
  }
}
