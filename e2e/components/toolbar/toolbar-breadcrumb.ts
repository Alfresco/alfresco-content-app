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

import { ElementFinder, ElementArrayFinder, by } from 'protractor';
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
}
