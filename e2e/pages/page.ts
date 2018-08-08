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

import { browser, element, by, ElementFinder, promise, ExpectedConditions as EC } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from './../configs';

export abstract class Page {
    private static USE_HASH_STRATEGY = true;

    private locators = {
        app: by.css('app-root'),
        layout: by.css('app-layout'),
        overlay: by.css('.cdk-overlay-container'),
        dialogContainer: by.css('.mat-dialog-container'),
        snackBarContainer: '.cdk-overlay-pane .mat-snack-bar-container',
        snackBar: '.mat-simple-snackbar',
        snackBarAction: '.mat-simple-snackbar-action button'
    };

    public app: ElementFinder = element(this.locators.app);
    public layout: ElementFinder = element(this.locators.layout);
    public overlay: ElementFinder = element(this.locators.overlay);
    snackBar: ElementFinder = browser.$(this.locators.snackBar);
    dialogContainer: ElementFinder = element(this.locators.dialogContainer);
    snackBarContainer: ElementFinder = browser.$(this.locators.snackBarContainer);
    snackBarAction: ElementFinder = browser.$(this.locators.snackBarAction);

    constructor(public url: string = '') {}

    get title(): promise.Promise<string> {
        return browser.getTitle();
    }

    load(relativeUrl: string = ''): promise.Promise<void> {
        const hash = Page.USE_HASH_STRATEGY ? '/#' : '';
        const path = `${hash}${this.url}${relativeUrl}`;

        return browser.get(path);
    }

    waitForApp() {
        return browser.wait(EC.presenceOf(this.layout), BROWSER_WAIT_TIMEOUT);
    }

    waitForSnackBarToAppear() {
        return browser.wait(EC.visibilityOf(this.snackBarContainer), BROWSER_WAIT_TIMEOUT);
    }

    waitForSnackBarToClose() {
        return browser.wait(EC.not(EC.visibilityOf(this.snackBarContainer)), BROWSER_WAIT_TIMEOUT);
    }

    waitForDialog() {
        return browser.wait(EC.visibilityOf(this.dialogContainer), BROWSER_WAIT_TIMEOUT);
    }

    waitForDialogToClose() {
        return browser.wait(EC.not(EC.visibilityOf(this.dialogContainer)), BROWSER_WAIT_TIMEOUT);
    }

    refresh(): promise.Promise<void> {
        return browser.refresh();
    }

    getDialogActionByLabel(label) {
        return element(by.cssContainingText('.mat-button-wrapper', label));
    }

    isSnackBarDisplayed(): promise.Promise<boolean> {
        return this.snackBar.isDisplayed();
    }

    getSnackBarMessage(): promise.Promise<string> {
        return this.waitForSnackBarToAppear()
            .then(() => this.snackBar.getAttribute('innerText'));
    }

    getSnackBarAction() {
        return this.waitForSnackBarToAppear()
            .then(() => this.snackBarAction);
    }

    clickSnackBarAction() {
        return this.waitForSnackBarToAppear()
            .then(() => {
                return browser.executeScript(function (elem) {
                    elem.click();
                }, this.snackBarAction);
            });
    }
}
