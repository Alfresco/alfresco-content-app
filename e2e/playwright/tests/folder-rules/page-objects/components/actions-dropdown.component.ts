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
