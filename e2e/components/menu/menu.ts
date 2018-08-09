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

import { ElementFinder, ElementArrayFinder, by, browser, ExpectedConditions as EC, promise } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';

export class Menu extends Component {
    private static selectors = {
        root: '.mat-menu-panel',
        item: '.mat-menu-item',
        icon: '.mat-icon',
        uploadFiles: 'app-upload-files'
    };

    items: ElementArrayFinder = this.component.all(by.css(Menu.selectors.item));
    backdrop: ElementFinder = browser.element(by.css('.cdk-overlay-backdrop'));
    uploadFiles: ElementFinder = browser.element(by.id(Menu.selectors.uploadFiles));

    constructor(ancestor?: ElementFinder) {
        super(Menu.selectors.root, ancestor);
    }

    waitForMenuToOpen() {
        return browser.wait(EC.presenceOf(browser.element(by.css('.cdk-overlay-backdrop'))), BROWSER_WAIT_TIMEOUT)
            .then(() => browser.wait(EC.presenceOf(browser.element(by.css('.mat-menu-panel'))), BROWSER_WAIT_TIMEOUT))
            .then(() => browser.wait(EC.visibilityOf(this.items.get(0)), BROWSER_WAIT_TIMEOUT));
    }

    waitForMenuToClose() {
        return browser.wait(EC.not(EC.presenceOf(browser.element(by.css('.mat-menu-panel')))), BROWSER_WAIT_TIMEOUT);
    }

    closeMenu() {
        if (this.backdrop.isPresent()) {
            return this.backdrop.click();
        } else {
            return browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform();
        }
    }

    getNthItem(nth: number): ElementFinder {
        return this.items.get(nth - 1);
    }

    getItemByLabel(menuItem: string): ElementFinder {
        return this.component.element(by.cssContainingText(Menu.selectors.item, menuItem));
    }

    getItemTooltip(menuItem: string): promise.Promise<string> {
        return this.getItemByLabel(menuItem).getAttribute('title');
    }

    getItemIconText(menuItem: string) {
        return this.getItemByLabel(menuItem).element(by.css(Menu.selectors.icon)).getText();

    }

    getItemsCount(): promise.Promise<number> {
        return this.items.count();
    }

    clickNthItem(nth: number): promise.Promise<any> {
        const elem = this.getNthItem(nth);
        return browser.wait(EC.elementToBeClickable(elem), BROWSER_WAIT_TIMEOUT)
            .then(() => browser.actions().mouseMove(elem).click().perform())
            .then(() => this.waitForMenuToClose());
    }

    clickMenuItem(menuItem: string): promise.Promise<any> {
        const elem = this.getItemByLabel(menuItem);
        return browser.wait(EC.elementToBeClickable(elem), BROWSER_WAIT_TIMEOUT)
            .then(() => elem.click())
            .then(() => this.waitForMenuToClose());
    }

    isMenuItemPresent(title: string): promise.Promise<boolean> {
        return this.component.element(by.cssContainingText(Menu.selectors.item, title)).isPresent();
    }

    uploadFile() {
        return this.uploadFiles;
    }
}
