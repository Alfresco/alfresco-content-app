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

import { ElementFinder, ElementArrayFinder, by, promise } from 'protractor';
import { Menu } from '../menu/menu';
import { Component } from '../component';

export class ToolbarBreadcrumb extends Component {
    private static selectors = {
        root: 'adf-breadcrumb',
        item: '.adf-breadcrumb-item'
    };

    items: ElementArrayFinder = this.component.all(by.css(ToolbarBreadcrumb.selectors.item));

    constructor(ancestor?: ElementFinder) {
        super(ToolbarBreadcrumb.selectors.root, ancestor);
    }

    getNthItem(nth: number): ElementFinder {
        return this.items.get(nth - 1);
    }

    getItemsCount(): promise.Promise<number> {
        return this.items.count();
    }

    getFirstItemName(): promise.Promise<string> {
        return this.items.get(0).getAttribute('title');
    }

    getCurrentItem(): promise.Promise<ElementFinder> {
        return this.getItemsCount()
            .then(count => this.getNthItem(count));
    }

    getCurrentItemName(): promise.Promise<string> {
        return this.getCurrentItem()
            .then(node => node.getAttribute('title'));
    }
}
