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

import { ElementFinder, ElementArrayFinder, by, promise } from 'protractor';
import { Component } from '../component';

export class ToolbarBreadcrumb extends Component {
    private static selectors = {
        root: 'adf-breadcrumb',
        item: '.adf-breadcrumb-item',
        currentItem: '.adf-breadcrumb-item-current'
    };

    items: ElementArrayFinder = this.component.all(by.css(ToolbarBreadcrumb.selectors.item));
    currentItem: ElementFinder = this.component.element(by.css(ToolbarBreadcrumb.selectors.currentItem));

    constructor(ancestor?: ElementFinder) {
        super(ToolbarBreadcrumb.selectors.root, ancestor);
    }

    getNthItem(nth: number): ElementFinder {
        return this.items.get(nth - 1);
    }

    getNthItemName(nth: number) {
        return this.getNthItem(nth).getText();
    }

    getItemsCount(): promise.Promise<number> {
        return this.items.count();
    }

    getAllItems() {
        return this.items.map(elem => elem.getText().then(str => str.split('\nchevron_right')[0]));
    }

    getFirstItemName(): promise.Promise<string> {
        return this.items.get(0).getText();
    }

    getCurrentItem() {
        return this.currentItem;
    }

    getCurrentItemName(): promise.Promise<string> {
        return this.currentItem.getText();
    }

    clickItem(name: string) {
        return this.component.element(by.css(`${ToolbarBreadcrumb.selectors.item}[title=${name}]`)).click();
    }

    clickNthItem(nth: number) {
        return this.getNthItem(nth).click();
    }

    getNthItemTooltip(nth: number) {
        return this.getNthItem(nth).getAttribute('title');
    }
}
