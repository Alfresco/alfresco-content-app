/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Page } from '@playwright/test';
import { BaseComponent } from './base.component';

export class SnackBarComponent extends BaseComponent {
  private static rootElement = 'simple-snack-bar';

  public message = this.getChild(' > span');
  public getByMessageLocator = (message: string) => this.getChild('span', { hasText: message });

  constructor(page: Page, rootElement = SnackBarComponent.rootElement) {
    super(page, rootElement);
  }
}
