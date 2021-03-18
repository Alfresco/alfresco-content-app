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

// import { browser, by, ElementFinder } from 'protractor';
// import { BrowserActions, BrowserVisibility, Logger } from '@alfresco/adf-testing';
import { APP_ROUTES, BROWSER_WAIT_TIMEOUT, USE_HASH_STRATEGY } from '../utils/cy-configs';
// import { Utils, waitElement, waitForPresence, isPresentAndDisplayed } from '../utilities/utils';
import { CyHeader } from '../components/header/cy-header';

export abstract class CyPage {
  appRoot = 'app-root';

  layout = 'app-layout';
  overlay = '.cdk-overlay-container';
  snackBar = '.mat-simple-snackbar-action button';
  dialogContainer = '.mat-dialog-container';
  snackBarContainer = '.mat-snack-bar-container';
  snackBarAction = '.mat-simple-snackbar-action button';
  genericError = 'aca-generic-error';
  genericErrorIcon = 'aca-generic-error .mat-icon';
  genericErrorTitle = '.generic-error__title';

  uploadDialog = '.adf-upload-dialog';
  closeUploadButton = '.adf-upload-dialog [id="adf-upload-dialog-close"]';

  constructor(public url: string = '') {}

  load(relativeUrl: string = '') {
    const hash = USE_HASH_STRATEGY ? '#' : '';
    const path = `${Cypress.config().baseUrl}${hash}${this.url}${relativeUrl}`;
    cy.log('>>>>>>>> path : ', path);
    cy.visit(path);
  }

  waitForApp() {
    cy.get(this.layout, { timeout: BROWSER_WAIT_TIMEOUT }).should('be.visible');
  }

  signOut() {
    new CyHeader().openMoreMenu();
    new CyHeader().menu.clickMenuItem('Sign out');
    cy.get('[class*="login-content"] input#username', { timeout: BROWSER_WAIT_TIMEOUT }).should('be.visible');
  }

  // async waitForDialog() {
  //   await BrowserVisibility.waitUntilElementIsVisible(this.dialogContainer);
  // }

  // async isDialogOpen() {
  //   return browser.isElementPresent(this.dialogContainer);
  // }

  // async closeOpenDialogs() {
  //   while (await this.isDialogOpen()) {
  //     await Utils.pressEscape();
  //   }
  // }

  // async isUploadDialogOpen(): Promise<boolean> {
  //   return isPresentAndDisplayed(this.uploadDialog);
  // }

  // async closeUploadDialog(): Promise<void> {
  //   if (await this.isUploadDialogOpen()) {
  //     await BrowserActions.click(this.closeUploadButton);
  //   }
  // }

  // async refresh(): Promise<void> {
  //   await browser.refresh();
  //   await this.waitForApp();
  // }

  getSnackBarMessage() {
    // const elem = await waitElement('.mat-snack-bar-container');
    // return elem.getAttribute('innerText');
    return cy.get('.mat-snack-bar-container').invoke('text');
  }

  // async clickSnackBarAction(): Promise<void> {
  //   try {
  //     const action = await waitElement('.mat-simple-snackbar-action button');
  //     await action.click();
  //   } catch (e) {
  //     Logger.error(e, '.......failed on click snack bar action.........');
  //   }
  // }

  isLoggedIn() {
    return cy.url().then((urlString) => {
      return !urlString.includes(APP_ROUTES.LOGIN);
    });
  }
}
