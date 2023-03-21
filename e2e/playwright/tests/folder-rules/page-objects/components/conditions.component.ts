/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
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

  async addCondition(fields: Partial<Field>, comparators: Partial<Comparator>, value: string, index: number): Promise<void> {
    await this.addConditionButton.click();
    await this.selectField(fields, index);
    await this.selectComparator(comparators, index);
    await this.typeConditionValue(value, index);
  }

  async createConditionGroup(): Promise<void> {
    await this.addConditionGroupButton.click();
  }

  async addConditionGroup(fields: Partial<Field>, comparators: Partial<Comparator>, value: string, index: number): Promise<void> {
    await this.addConditionButton.nth(0).click();
    await this.selectField(fields, index);
    await this.selectComparator(comparators, index);
    await this.typeConditionValue(value, index);
  }
}
