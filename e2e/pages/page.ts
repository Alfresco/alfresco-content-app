/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import {
  browser,
  element,
  by,
  ElementFinder,
  ExpectedConditions as EC
} from 'protractor';
import { BROWSER_WAIT_TIMEOUT, USE_HASH_STRATEGY } from './../configs';

export abstract class Page {
  private locators = {
    app: by.css('app-root'),
    layout: by.css('app-layout'),
    overlay: by.css('.cdk-overlay-container'),
    dialogContainer: by.css('.mat-dialog-container'),
    snackBarContainer: '.cdk-overlay-pane .mat-snack-bar-container',
    snackBar: '.mat-simple-snackbar',
    snackBarAction: '.mat-simple-snackbar-action button',

    genericError: 'aca-generic-error',
    genericErrorIcon: 'aca-generic-error .mat-icon',
    genericErrorTitle: '.generic-error__title'
  };

  public app: ElementFinder = element(this.locators.app);
  public layout: ElementFinder = element(this.locators.layout);
  public overlay: ElementFinder = element(this.locators.overlay);
  snackBar: ElementFinder = browser.$(this.locators.snackBar);
  dialogContainer: ElementFinder = element(this.locators.dialogContainer);
  snackBarContainer: ElementFinder = browser.$(this.locators.snackBarContainer);
  snackBarAction: ElementFinder = browser.$(this.locators.snackBarAction);

  genericError: ElementFinder = browser.$(this.locators.genericError);
  genericErrorIcon: ElementFinder = browser.$(this.locators.genericErrorIcon);
  genericErrorTitle: ElementFinder = browser.$(this.locators.genericErrorTitle);

  constructor(public url: string = '') {}

  getTitle() {
    return browser.getTitle();
  }

  load(relativeUrl: string = '') {
    const hash = USE_HASH_STRATEGY ? '/#' : '';
    const path = `${browser.baseUrl}${hash}${this.url}${relativeUrl}`;
    return browser.get(path);
  }

  waitForApp() {
    return browser.wait(EC.presenceOf(this.layout), BROWSER_WAIT_TIMEOUT);
  }

  waitForSnackBarToAppear() {
    return browser.wait(EC.visibilityOf(this.snackBarContainer), BROWSER_WAIT_TIMEOUT);
  }

  async waitForSnackBarToClose() {
    await browser.wait(EC.not(EC.visibilityOf(this.snackBarContainer)), BROWSER_WAIT_TIMEOUT);
  }

  async waitForDialog() {
    await browser.wait(EC.visibilityOf(this.dialogContainer), BROWSER_WAIT_TIMEOUT);
  }

  async waitForDialogToClose() {
    await browser.wait(EC.not(EC.visibilityOf(this.dialogContainer)), BROWSER_WAIT_TIMEOUT);
  }

  async refresh() {
    await browser.refresh();
    await this.waitForApp();
  }

  getDialogActionByLabel(label) {
    return element(by.cssContainingText('.mat-button-wrapper', label));
  }

  async isSnackBarDisplayed() {
    return await this.snackBar.isDisplayed();
  }

  async getSnackBarMessage() {
    await this.waitForSnackBarToAppear();
    return await this.snackBar.getAttribute('innerText');
  }

  async clickSnackBarAction() {
    try {

      // await this.waitForSnackBarToAppear();

      // return browser.executeScript(function (elem) {
      //   elem.click();
      // }, this.snackBarAction);
      return await this.snackBarAction.click();
    } catch (e) {
      console.log(e, '.......failed on click snack bar action.........');
    }
  }

  async isGenericErrorDisplayed() {
    return await this.genericError.isDisplayed();
  }

  async getGenericErrorTitle() {
    return await this.genericErrorTitle.getText();
  }
}
