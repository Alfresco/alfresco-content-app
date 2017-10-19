/*!
 * @license
 * Copyright 2017 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { browser, element, by, ElementFinder, promise } from 'protractor';

export abstract class Page {
    private static USE_HASH_STRATEGY = true;

    private locators = {
        app: by.css('alfresco-content-app'),
        overlay: by.css('.cdk-overlay-container'),
        snackBar: by.css('simple-snack-bar')
    };

    public app: ElementFinder = element(this.locators.app);
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
}
