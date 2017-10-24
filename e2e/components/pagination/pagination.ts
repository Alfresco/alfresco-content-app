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

import { ElementFinder, ElementArrayFinder, promise, by, browser, ExpectedConditions as EC } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Menu } from '../menu/menu';
import { Component } from '../component';

export class Pagination extends Component {
    private static selectors = {
        root: 'adf-pagination',
        range: '.adf-pagination__range',
        maxItems: '.adf-pagination__max-items',
        currentPage: '.adf-pagination__current-page',
        totalPages: '.adf-pagination__total-pages',

        previousButton: '.adf-pagination__previous-button',
        nextButton: '.adf-pagination__next-button',
        maxItemsButton: '.adf-pagination__max-items + button[mat-icon-button]',
        pagesButton: '.adf-pagination__current-page + button[mat-icon-button]'
    };

    range: ElementFinder = this.component.element(by.css(Pagination.selectors.range));
    maxItems: ElementFinder = this.component.element(by.css(Pagination.selectors.maxItems));
    currentPage: ElementFinder = this.component.element(by.css(Pagination.selectors.currentPage));
    totalPages: ElementFinder = this.component.element(by.css(Pagination.selectors.totalPages));
    previousButton: ElementFinder = this.component.element(by.css(Pagination.selectors.previousButton));
    nextButton: ElementFinder = this.component.element(by.css(Pagination.selectors.nextButton));
    maxItemsButton: ElementFinder = this.component.element(by.css(Pagination.selectors.maxItemsButton));
    pagesButton: ElementFinder = this.component.element(by.css(Pagination.selectors.pagesButton));

    menu: Menu = new Menu();

    constructor(ancestor?: ElementFinder) {
        super(Pagination.selectors.root, ancestor);
    }

    openMaxItemsMenu(): promise.Promise<Menu> {
        const { menu, maxItemsButton } = this;

        return maxItemsButton.click()
            .then(() => menu.wait())
            .then(() => menu);
    }

    openCurrentPageMenu(): promise.Promise<Menu> {
        const { menu, pagesButton } = this;

        return this.pagesButton.click()
            .then(() => menu.wait())
            .then(() => menu);
    }
}
