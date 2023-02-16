/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Page } from '@playwright/test';
import { BaseComponent } from './base.component';

export class SpinnerComponent extends BaseComponent {
  private static rootElement = 'mat-progress-spinner';

  constructor(page: Page, rootElement = SpinnerComponent.rootElement) {
    super(page, rootElement);
  }

  async waitForReload(): Promise<void> {
    try {
      await this.getChild('').waitFor({ state: 'attached', timeout: 2000 });
      await this.getChild('').waitFor({ state: 'detached', timeout: 2000 });
    } catch (e) {
      this.logger.info('Spinner was not present');
    }
  }
}
