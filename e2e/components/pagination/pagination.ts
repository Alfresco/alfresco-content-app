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

import { ElementFinder, promise, by } from 'protractor';
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
            .then(() => menu.waitForMenuToOpen())
            .then(() => menu);
    }

    openCurrentPageMenu(): promise.Promise<Menu> {
        const { menu, pagesButton } = this;

        return pagesButton.click()
            .then(() => menu.waitForMenuToOpen())
            .then(() => menu);
    }

    getText(elem: ElementFinder) {
        return elem.getText();
    }

    resetToDefaultPageSize(): promise.Promise<any> {
        return this.openMaxItemsMenu()
            .then(menu => menu.clickMenuItem('25'))
            .then(() => this.menu.waitForMenuToClose());
    }

    resetToDefaultPageNumber(): promise.Promise<any> {
        return this.openCurrentPageMenu()
            .then(menu => menu.clickMenuItem('1'))
            .then(() => this.menu.waitForMenuToClose());
    }

    clickNext(): promise.Promise<any> {
        return this.nextButton.click();
    }

    clickPrevious(): promise.Promise<any> {
        return this.previousButton.click();
    }
}
