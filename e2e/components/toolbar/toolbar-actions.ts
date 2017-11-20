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

import { ElementFinder, ElementArrayFinder, by, promise } from 'protractor';
import { Menu } from '../menu/menu';
import { Component } from '../component';

export class ToolbarActions extends Component {
    private static selectors = {
        root: 'adf-toolbar',
        button: '.mat-icon-button'
    };

    menu: Menu = new Menu();
    buttons: ElementArrayFinder = this.component.all(by.css(ToolbarActions.selectors.button));

    constructor(ancestor?: ElementFinder) {
        super(ToolbarActions.selectors.root, ancestor);
    }

    isEmpty(): promise.Promise<boolean> {
        return this.buttons.count().then(count => (count === 0));
    }

    isButtonPresent(title: string): promise.Promise<boolean> {
        return this.component.element(by.css(`${ToolbarActions.selectors.button}[title="${title}"]`)).isPresent();
    }

    getButtonByLabel(label: string): ElementFinder {
        return this.component.element(by.cssContainingText(ToolbarActions.selectors.button, label));
    }

    getButtonByTitleAttribute(title: string): ElementFinder {
        return this.component.element(by.css(`${ToolbarActions.selectors.button}[title="${title}"]`));
    }

    openMoreMenu(): promise.Promise<Menu> {
        const { menu } = this;
        const moreButton = this.getButtonByTitleAttribute('More actions');

        return moreButton
            .click()
            .then(() => menu.wait())
            .then(() => menu);
    }
}
