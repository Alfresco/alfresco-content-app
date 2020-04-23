/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { browser, by, ExpectedConditions as EC, until, ElementFinder } from 'protractor';
import { Logger } from '@alfresco/adf-testing';
import { BROWSER_WAIT_TIMEOUT, USE_HASH_STRATEGY } from './../configs';
import { Utils } from '../utilities/utils';

export abstract class Page {
  appRoot = 'app-root';

  layout = this.byCss('app-layout');
  overlay = this.byCss('.cdk-overlay-container');
  snackBar = this.byCss('.mat-simple-snackbar-action button');
  dialogContainer = this.byCss('.mat-dialog-container');
  snackBarContainer = this.byCss('.mat-snack-bar-container');
  snackBarAction = this.byCss('.mat-simple-snackbar-action button');
  genericError = this.byCss('aca-generic-error');
  genericErrorIcon = this.byCss('aca-generic-error .mat-icon');
  genericErrorTitle = this.byCss('.generic-error__title');

  constructor(public url: string = '') {}

  protected byCss(css: string): ElementFinder {
    return browser.element(by.css(css));
  }

  async load(relativeUrl: string = '') {
    const hash = USE_HASH_STRATEGY ? '/#' : '';
    const path = `${browser.baseUrl}${hash}${this.url}${relativeUrl}`;
    return browser.get(path);
  }

  async waitForApp() {
    await browser.wait(EC.presenceOf(this.layout), BROWSER_WAIT_TIMEOUT);
  }

  private async waitForSnackBarToAppear() {
    return browser.wait(
      until.elementLocated(by.css('.mat-snack-bar-container')),
      BROWSER_WAIT_TIMEOUT,
      '------- timeout waiting for snackbar to appear'
    );
  }

  async waitForSnackBarToClose() {
    await browser.wait(EC.not(EC.visibilityOf(this.snackBarContainer)), BROWSER_WAIT_TIMEOUT);
  }

  async waitForDialog() {
    await browser.wait(EC.visibilityOf(this.dialogContainer), BROWSER_WAIT_TIMEOUT);
  }

  async isDialogOpen() {
    return browser.isElementPresent(this.dialogContainer);
  }

  async closeOpenDialogs() {
    while (await this.isDialogOpen()) {
      await Utils.pressEscape();
    }
  }

  async refresh(): Promise<void> {
    await browser.refresh();
    await this.waitForApp();
  }

  async getSnackBarMessage(): Promise<string> {
    const elem = await this.waitForSnackBarToAppear();
    return elem.getAttribute('innerText');
  }

  async clickSnackBarAction(): Promise<void> {
    try {
      const action = await browser.wait(until.elementLocated(by.css('.mat-simple-snackbar-action button')), BROWSER_WAIT_TIMEOUT, '------- timeout waiting for snack action to appear');
      await action.click();
    } catch (e) {
      Logger.error(e, '.......failed on click snack bar action.........');
    }
  }
}
