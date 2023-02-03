/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
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
  private pageUrl: string;
  private urlRequest: RegExp;
  public snackBar: SnackBarComponent;
  public spinner: SpinnerComponent;

  constructor(page: Page, pageUrl: string, urlRequest?: RegExp) {
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
      ...options
    };

    if (actualOptions.remoteUrl) {
      await this.page.goto(actualOptions.remoteUrl, {
        waitUntil: actualOptions.waitUntil
      });
    } else {
      if (this.urlRequest && actualOptions.waitForRequest) {
        await Promise.all([
          this.page.goto(`./#/${this.pageUrl}${actualOptions.query}`, { waitUntil: 'load' })
          // this.page.waitForResponse(this.urlRequest)
        ]);
      } else {
        await this.page.goto(`./#/${this.pageUrl}${actualOptions.query}`, {
          waitUntil: actualOptions.waitUntil,
          timeout: 10000
        });
      }
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
