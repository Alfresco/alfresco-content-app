/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { browser, by, ElementFinder, ExpectedConditions as EC, until } from 'protractor';
import { BROWSER_WAIT_TIMEOUT, USE_HASH_STRATEGY } from './../configs';
import { Utils } from '../utilities/utils';

export abstract class Page {
  protected static locators = {
    app: 'app-root',
    layout: 'app-layout',
    overlay: '.cdk-overlay-container',
    dialogContainer: '.mat-dialog-container',
    snackBarContainer: '.mat-snack-bar-container',
    snackBar: '.mat-simple-snackbar',
    snackBarAction: '.mat-simple-snackbar-action button',

    genericError: 'aca-generic-error',
    genericErrorIcon: 'aca-generic-error .mat-icon',
    genericErrorTitle: '.generic-error__title'
  };

  app: ElementFinder = browser.element(by.css(Page.locators.app));
  layout: ElementFinder = browser.element(by.css(Page.locators.layout));
  overlay: ElementFinder = browser.element(by.css(Page.locators.overlay));
  snackBar: ElementFinder = browser.element(by.css(Page.locators.snackBar));
  dialogContainer: ElementFinder = browser.element(by.css(Page.locators.dialogContainer));
  snackBarContainer: ElementFinder = browser.element(by.css(Page.locators.snackBarContainer));
  snackBarAction: ElementFinder = browser.element(by.css(Page.locators.snackBarAction));

  genericError: ElementFinder = browser.element(by.css(Page.locators.genericError));
  genericErrorIcon: ElementFinder = browser.element(by.css(Page.locators.genericErrorIcon));
  genericErrorTitle: ElementFinder = browser.element(by.css(Page.locators.genericErrorTitle));

  constructor(public url: string = '') {}

  async getTitle() {
    return browser.getTitle();
  }

  async load(relativeUrl: string = '') {
    const hash = USE_HASH_STRATEGY ? '/#' : '';
    const path = `${browser.baseUrl}${hash}${this.url}${relativeUrl}`;
    return browser.get(path);
  }

  async waitForApp() {
    await browser.wait(EC.presenceOf(this.layout), BROWSER_WAIT_TIMEOUT);
  }

  async waitForSnackBarToAppear() {
    return browser.wait(until.elementLocated(by.css('.mat-snack-bar-container')), BROWSER_WAIT_TIMEOUT, '------- timeout waiting for snackbar to appear');
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

  async refresh() {
    await browser.refresh();
    await this.waitForApp();
  }

  async getSnackBarMessage() {
    const elem = await this.waitForSnackBarToAppear();
    return elem.getAttribute('innerText');
  }

  async clickSnackBarAction() {
    try {
      const action = await browser.wait(until.elementLocated(by.css('.mat-simple-snackbar-action button')), BROWSER_WAIT_TIMEOUT, '------- timeout waiting for snack action to appear');
      await action.click();
    } catch (e) {
      console.log(e, '.......failed on click snack bar action.........');
    }
  }

  async isGenericErrorDisplayed() {
    return this.genericError.isDisplayed();
  }

  async getGenericErrorTitle() {
    return this.genericErrorTitle.getText();
  }


  async isUndoActionPresent() {
    const message = await this.snackBar.getAttribute('innerText');
    return message.includes('Undo');
  }

}
