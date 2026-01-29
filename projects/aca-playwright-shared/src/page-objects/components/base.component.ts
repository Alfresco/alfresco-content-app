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

import { Locator, Page } from '@playwright/test';
import { PlaywrightBase } from '../playwright-base';
import { timeouts } from '../../utils';

export abstract class BaseComponent extends PlaywrightBase {
  private readonly rootElement: string;
  private overlayElement = this.page.locator('.cdk-overlay-backdrop-showing');
  private progressBar = this.page.locator('[role="progressbar"]');

  protected constructor(page: Page, rootElement: string) {
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
      await this.overlayElement.waitFor({ state: 'detached', timeout: timeouts.medium });
    }
  }

  async spinnerWaitForReload(): Promise<void> {
    try {
      await this.page.locator('[role="progressbar"]').waitFor({ state: 'attached', timeout: timeouts.medium });
      await this.page.locator('[role="progressbar"]').waitFor({ state: 'detached', timeout: timeouts.normal });
    } catch (e) {
      this.logger.info('Spinner was not present');
    }
  }

  async progressBarWaitForReload(): Promise<void> {
    try {
      await this.progressBar.waitFor({ state: 'visible', timeout: timeouts.medium });
      await this.progressBar.waitFor({ state: 'hidden', timeout: timeouts.normal });
    } catch (e) {
      this.logger.info('Progress bar was not present');
    }
  }
}
