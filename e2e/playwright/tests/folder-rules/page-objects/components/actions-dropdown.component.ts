/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '@alfresco/playwright-shared';

export enum ActionType {
  Aspect = 'Add aspect',
  SimpleWorkflow = 'Add simple workflow',
  IncrementCounter = 'Increment Counter'
}

export class ActionsDropdownComponent extends BaseComponent {
  private static rootElement = '.mat-select-panel';

  public getOptionLocator = (optionName: string): Locator => this.getChild('.mat-option-text', { hasText: optionName });

  constructor(page: Page) {
    super(page, ActionsDropdownComponent.rootElement);
  }

  async selectAction(action: Partial<ActionType>): Promise<void> {
    await this.page.locator(`aca-edit-rule-dialog [data-automation-id="rule-action-select"]`).click();
    const option = this.getOptionLocator(action);
    await option.click();
  }
}
