/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '@alfresco/playwright-shared';

export class ManageRules extends BaseComponent {
  private static rootElement = '.aca-manage-rules';

  public getGroupsList = (optionName: string): Locator => this.getChild('.aca-rule-list-item__header', { hasText: optionName });
  public disableRuleToggle = this.getChild('.aca-manage-rules__container .mat-slide-toggle-bar').first();

  constructor(page: Page) {
    super(page, ManageRules.rootElement);
  }
}
