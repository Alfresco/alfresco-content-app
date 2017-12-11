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

    getItemsCount(): promise.Promise<number> {
        return this.items.count();
    }

    clickNthItem(nth: number): promise.Promise<void> {
        return this.getNthItem(nth).click();
    }

    clickMenuItem(label: string): promise.Promise<void> {
        return this.getItemByLabel(label).click();
    }

    isMenuItemPresent(title: string): promise.Promise<boolean> {
        return this.component.element(by.cssContainingText(Menu.selectors.item, title)).isPresent();
    }
}
