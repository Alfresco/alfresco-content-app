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

export class Sidenav extends Component {
    private static selectors = {
        root: 'app-sidenav',
        link: '.sidenav-menu__item-link',
        activeLink: '.sidenav-menu__item-link--active',
        newButton: '.sidenav__section--new__button'
    };

    links: ElementArrayFinder = this.component.all(by.css(Sidenav.selectors.link));
    activeLink: ElementFinder = this.component.element(by.css(Sidenav.selectors.activeLink));
    newButton: ElementArrayFinder = this.component.all(by.css(Sidenav.selectors.newButton));

    menu: Menu = new Menu();

    constructor(ancestor?: ElementFinder) {
        super(Sidenav.selectors.root, ancestor);
    }

    openNewMenu(): promise.Promise<Menu> {
        const { menu, newButton } = this;

        return newButton.click()
            .then(() => menu.wait())
            .then(() => menu);
    }

    isActiveByLabel(label: string): promise.Promise<boolean> {
        return this
            .getLinkByLabel(label)
            .getWebElement()
            .then(element => element.getAttribute('class'))
            .then(className => className.includes(Sidenav.selectors.activeLink.replace('.', '')));
    }

    getLinkByLabel(label: string): ElementFinder {
        return this.component.element(by.cssContainingText(Sidenav.selectors.link, label));
    }

    navigateToLinkByLabel(label: string): promise.Promise<void> {
        return this.getLinkByLabel(label).click();
    }
}
