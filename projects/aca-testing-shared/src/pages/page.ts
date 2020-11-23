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

import { browser, by, ElementFinder } from 'protractor';
import { BrowserActions, BrowserVisibility, Logger } from '@alfresco/adf-testing';
import { USE_HASH_STRATEGY } from './../configs';
import { Utils, isPresentAndDisplayed } from '../utilities/utils';

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

  uploadDialog = this.byCss('.adf-upload-dialog');
  closeUploadButton = this.byCss('.adf-upload-dialog [id="adf-upload-dialog-close"]');

  constructor(public url: string = '') {
  }

  protected byCss(css: string): ElementFinder {
    return browser.element(by.css(css));
  }

  async load(relativeUrl: string = '') {
    const hash = USE_HASH_STRATEGY ? '#' : '';
    const path = `${browser.baseUrl}${hash}${this.url}${relativeUrl}`;
    return browser.get(path);
  }

  async waitForApp() {
    await BrowserVisibility.waitUntilElementIsPresent(this.layout);
  }

  async waitForDialog() {
    await BrowserVisibility.waitUntilElementIsVisible(this.dialogContainer);
  }

  async isDialogOpen() {
    return browser.isElementPresent(this.dialogContainer);
  }

  async closeOpenDialogs() {
    while (await this.isDialogOpen()) {
      await Utils.pressEscape();
    }
  }

  async isUploadDialogOpen(): Promise<boolean> {
    return isPresentAndDisplayed(this.uploadDialog);
  }

  async closeUploadDialog(): Promise<void> {
    if (await this.isUploadDialogOpen()) {
      await BrowserActions.click(this.closeUploadButton);
    }
  }

  async refresh(): Promise<void> {
    await browser.refresh();
    await this.waitForApp();
  }

  async getSnackBarMessage(): Promise<string> {
    const elem = this.byCss(`.mat-snack-bar-container`);
    await BrowserVisibility.waitUntilElementIsLocated(elem);
    return elem.getAttribute('innerText');
  }

  async clickSnackBarAction(): Promise<void> {
    try {
      const action = this.byCss(`.mat-simple-snackbar-action button`);
      await BrowserVisibility.waitUntilElementIsLocated(action);
      await action.click();
    } catch (e) {
      Logger.error(e, '.......failed on click snack bar action.........');
    }
  }
}
