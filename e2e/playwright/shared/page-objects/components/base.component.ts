/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Locator, Page } from '@playwright/test';
import { PlaywrightBase } from '../playwright-base';

export abstract class BaseComponent extends PlaywrightBase {
  private rootElement: string;
  private overlayElement = this.page.locator('.cdk-overlay-backdrop-showing');

  constructor(page: Page, rootElement: string) {
    super(page);
    this.rootElement = rootElement;
  }

  /**
   * Method which should be used across the repository, while creating
   * reference to elements, which are in root element of component.
   *
   * @param cssLocator css selector as String. Need to be in the tree under the root element
   * @param options if you want to localize it by text, then provide an optional hasText
   * @returns Locator object
   */
  getChild(cssLocator: string, options?: { hasText?: string | RegExp; has?: Locator }): Locator {
    return this.page.locator(`${this.rootElement} ${cssLocator}`, options);
  }

  async closeAdditionalOverlayElementIfVisible(): Promise<void> {
    if (await this.overlayElement.isVisible()) {
      await this.page.keyboard.press('Escape');
      await this.overlayElement.waitFor({ state: 'detached', timeout: 5000 });
    }
  }

  async spinnerWaitForReload(): Promise<void> {
    try {
      await this.page.locator('mat-progress-spinner').waitFor({ state: 'attached', timeout: 2000 });
      await this.page.locator('mat-progress-spinner').waitFor({ state: 'detached', timeout: 2000 });
    } catch (e) {
      this.logger.info('Spinner was not present');
    }
  }
}
