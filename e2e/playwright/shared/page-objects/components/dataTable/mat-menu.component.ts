/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Page } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class MatMenuComponent extends BaseComponent {
  private static rootElement = '.mat-menu-content';

  constructor(page: Page) {
    super(page, MatMenuComponent.rootElement);
  }

  public getMenuItemsLocator = this.getChild('button');

  public getButtonByText = (text: string) => this.getChild('button', { hasText: text });
}
