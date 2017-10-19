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

import { ElementFinder, ElementArrayFinder, by, browser, ExpectedConditions as EC, promise } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';

export class Menu extends Component {
    private static selectors = {
        root: '.mat-menu-panel',
        item: 'button.mat-menu-item'
    };

    items: ElementArrayFinder = this.component.all(by.css(Menu.selectors.item));

    constructor(ancestor?: ElementFinder) {
        super(Menu.selectors.root, ancestor);
    }

    wait() {
        return browser.wait(EC.visibilityOf(this.items.get(0)), BROWSER_WAIT_TIMEOUT);
    }

    getNthItem(nth: number): ElementFinder {
        return this.items.get(nth - 1);
    }

    getItemByLabel(label: string): ElementFinder {
        return this.component.element(by.cssContainingText(Menu.selectors.item, label));
    }

    getItemTooltip(label: string): promise.Promise<string> {
        return this.getItemByLabel(label).getAttribute('title');
    }

    clicktNthItem(nth: number): promise.Promise<void> {
        return this.getNthItem(nth).click();
    }

    clickMenuItem(label: string): promise.Promise<void> {
        return this.getItemByLabel(label).click();
    }
}
