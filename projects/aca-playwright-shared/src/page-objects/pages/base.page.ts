/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Page } from '@playwright/test';
import { PlaywrightBase } from '../playwright-base';
import { SnackBarComponent, SpinnerComponent } from '../components';

export interface NavigateOptions {
  query?: string;
  waitForRequest?: boolean;
  waitUntil?: 'networkidle' | 'commit' | 'load' | 'domcontentloaded';
  remoteUrl?: string;
}
export abstract class BasePage extends PlaywrightBase {
  private readonly pageUrl: string;
  private readonly urlRequest: RegExp;
  public snackBar: SnackBarComponent;
  public spinner: SpinnerComponent;

  protected constructor(page: Page, pageUrl: string, urlRequest?: RegExp) {
    super(page);
    this.pageUrl = pageUrl;
    this.urlRequest = urlRequest;
    this.snackBar = new SnackBarComponent(this.page);
    this.spinner = new SpinnerComponent(this.page);
  }

  /**
   * Method which navigate to appropriate page or remoteURL
   *
   * @param options object with configurable options
   * @property {string} query if you would like to navigate to page which support query,
   * then pass it in this option - e.g. '?appName=content'
   * @property {boolean} waitForRequest if you would like to NOT wait for request (which need to be passed
   * in the constructor of the page), then pass false. By default it'll wait for request to be fulfilled.
   * @property {'networkidle' | 'commit' | 'load' | 'domcontentloaded'} waitUntil by default will wait until 'networkidle' but you can change it if needed
   * @property {string} remoteUrl if you need to navigate to third part site, then you need to pass all of the URL in this option
   */
  async navigate(options?: Partial<NavigateOptions>): Promise<void> {
    const actualOptions: NavigateOptions = {
      query: '',
      waitForRequest: true,
      remoteUrl: '',
      waitUntil: 'load',
      ...options
    };

    if (actualOptions.remoteUrl) {
      await this.page.goto(actualOptions.remoteUrl, {
        waitUntil: actualOptions.waitUntil
      });
    } else if (this.urlRequest && actualOptions.waitForRequest) {
      await Promise.all([
        this.page.goto(`./#/${this.pageUrl}${actualOptions.query}`, { waitUntil: 'load' }),
        this.page.waitForResponse(this.urlRequest)
      ]);
    } else {
      await this.page.goto(`./#/${this.pageUrl}${actualOptions.query}`, {
        waitUntil: actualOptions.waitUntil,
        timeout: 60000
      });
    }
    await this.spinner.waitForReload();
  }

  async reload(options?: Pick<NavigateOptions, 'waitUntil'>): Promise<void> {
    const actualOptions: Pick<NavigateOptions, 'waitUntil'> = {
      waitUntil: 'networkidle',
      ...options
    };
    await this.page.reload(actualOptions);
  }
}
