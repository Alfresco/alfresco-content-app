/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { BaseComponent } from '../base.component';
import { Page } from '@playwright/test';

export class ToolbarComponent extends BaseComponent {
  private static rootElement = 'adf-toolbar';
  private createRuleButton = this.getChild('[data-automation-id="manage-rules-create-button"]');

  constructor(page: Page) {
    super(page, ToolbarComponent.rootElement);
  }

  async clickCreateRuleButton(): Promise<void> {
    await this.createRuleButton.click();
  }
}
