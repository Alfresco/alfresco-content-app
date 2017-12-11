/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2017 Alfresco Software Limited
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
    private static USE_HASH_STRATEGY = false;

    private locators = {
        app: by.css('app-root'),
        layout: by.css('app-layout'),
        overlay: by.css('.cdk-overlay-container'),
        snackBar: by.css('simple-snack-bar'),
        snackBarAction: by.css('.mat-simple-snackbar-action')
    };

    public app: ElementFinder = element(this.locators.app);
    public layout: ElementFinder = element(this.locators.layout);
    public overlay: ElementFinder = element(this.locators.overlay);
    public snackBar: ElementFinder = element(this.locators.snackBar);

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

    refresh(): promise.Promise<void> {
        return browser.refresh();
    }

    isSnackBarDisplayed(): promise.Promise<boolean> {
        return this.snackBar.isDisplayed();
    }

    getSnackBarMessage(): promise.Promise<string> {
        return this.isSnackBarDisplayed()
            .then(() => this.snackBar.getText())
            .catch(() => '');
    }

    getSnackBarAction(): ElementFinder {
        return this.snackBar.element(this.locators.snackBarAction);
    }
}
